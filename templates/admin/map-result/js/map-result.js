<script type="text/javascript">
$(document).ready(function() {
  var tileDataLayer = undefined;
  //map attributes
  var mbAttr = " <a href='http://opendatakosovo.org'>Open Data Kosovo</a>";
  var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
  //define map base layers
  var satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr});
  var streets   = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});
  //initialize map
  var map = L.map('map', {center: [8, 13],zoom: 2,layers: [satellite]});
  //define base layers container for layer control 
  var baseLayers = {
    "Satellite": satellite,
    "Streets": streets
  };
  //add control layer on the map
  var layerControl = L.control.layers(baseLayers).addTo(map);
  //on select, show tiles on the map
  $('#selectProject li').on('click', function(){
    // if tile layer is defined delete it and remove from map control
    if (tileDataLayer != undefined) {
        map.removeLayer(tileDataLayer);
        layerControl.removeLayer(tileDataLayer);
    }
    tileDataLayer =  new L.LayerGroup();
    //setting currently changed option value to selectedProject variable 
    var selectedProject = $(this).text()
    $('#currentProject').html(selectedProject);
    //perform an ajax request using the .ajax() method
    $.ajax({
            type: "GET",
            url: "{{ url_for('admin.map_result_data') }}",
            contentType: "application/xml; charset=utf-8",
            data: { currentProject: selectedProject},
            success: function(respData) {
                loopRespData(respData);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
          });
    //loop thorugh response data which contain tiles where human presence is verified
    function loopRespData(respData) {
        for (var i = 0; i < respData.length; i++) {
            var item = respData[i];
            for (var key in item) {
                //define zoom for one document
                var zoom = item['zoom'];
                if (item.hasOwnProperty(key)) {
                    var tile = item[key];
                    //check and ignore meta data,do throught tiles which contain x and y
                    if (tile.hasOwnProperty('x') && tile.hasOwnProperty('y')) {
                        //call function to define tiles on the map
                        tilesOnTheMap(tile.x, tile.y, zoom, tile.hp )
                    }
                }
            }
        }
    }
    //define tiles in latitude and longitutde bounds, and add tiles on the map
    function tilesOnTheMap(x, y, z, hp) {
        R = 6378137;
        //both x and y are in range [0...WORLD_SIZE] 
        var unproject = function(x, y) {
            var d = 180 / Math.PI;
            x -= R * Math.PI;
            y = R * Math.PI - y;
            var lat = (2 * Math.atan(Math.exp(y / R)) - (Math.PI / 2)) * d;
            var lon = x * d / R;
            return [lat, lon]
        }
        //coordinates into geographical coordinates
        var getCoordinates = function(x, y, z) {
            var tileSize = 2 * Math.PI * R / (1 << z);
            var pointMin = unproject(x * tileSize, (y + 1) * tileSize);
            var pointMax = unproject((x + 1) * tileSize, y * tileSize);
            return [pointMin, pointMax]
        }
        // bounds are defined based on x,y  and zoom
        var bounds = getCoordinates(x, y, z);
        //define the rectangle and add it on the tile layer
        L.rectangle(bounds, { weight: 0.5, color:  "red", fill:"True",stroke: "none" ,opacity: 0.1, fillOpacity:0.3}).bindPopup('Human Presence is:'+ hp).addTo(tileDataLayer);
    }
    //add tile layer on the map and on the layer control
    map.addLayer(tileDataLayer);
    layerControl.addOverlay(tileDataLayer, "Human Presence");

  });
});
</script>