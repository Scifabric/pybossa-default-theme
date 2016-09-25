<script type="text/javascript">
$(document).ready(function() {

    /*-------- Redundancy drop down list ----------*/

    var $select = $(".redundancy-select");
    for (i=1;i<=10;i++){
        $select.append($('<option value="'+i+'"></option>').val(i).html(i))
    }


    /*---------- Result Map ---------------------*/

    var tileDataLayer = undefined;
    //map attributes
    var mbAttr = " <a href='http://opendatakosovo.org'>Open Data Kosovo</a>";
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';

    //Map base layers
    var satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr});
    var streets   = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});

    //Initialize map
    var map = L.map('map', {center: [42, 21],zoom: 3,layers: [satellite]});

    //Base layers container for layer control
    var baseLayers = {
        "Satellite": satellite,
        "Streets": streets
    };

    //Add control layer on the map
    var layerControl = L.control.layers(baseLayers).addTo(map);

    //On project selection change, add tiles on the map
    $("#project-select").change(function () {

        // If tile layer is defined delete it and remove from map control
        if (tileDataLayer != undefined) {
            map.removeLayer(tileDataLayer);
            layerControl.removeLayer(tileDataLayer);
        }
        tileDataLayer =  new L.LayerGroup();

        //Setting currently changed options for project and redundancy
        var selectedProjectId = $( "#project-select option:selected" ).val();
        var selectedRedundancy = $( "#redundancy-select option:selected" ).val();

        //Ajax request to get data on project selection
        $.ajax({
            type: "GET",
            url: "{{ url_for('admin.map_result_data') }}",
            contentType: "application/xml; charset=utf-8",
            data: { currentProjectId: selectedProjectId , currentRedundancy: selectedRedundancy},
            success: function(respData) {
                loopRespData(respData);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
          });

        //Loop through response data
        function loopRespData(respData) {
            var data = JSON.parse(respData);
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                    var zoom =item['zoom'];
                    var x = parseInt(item['x']); //FIX: remove converting to int
                    var y = parseInt(item['y']); //FIX: remove converting to int
                    var hp = item['true'];
                    tilesOnTheMap(x, y, zoom, hp);
            }
        }

        //Add tiles on the map
        function tilesOnTheMap(x, y, z, hp) {
            R = 6378137;
            var unproject = function(x, y) {
                var d = 180 / Math.PI;
                x -= R * Math.PI;
                y = R * Math.PI - y;
                var lat = (2 * Math.atan(Math.exp(y / R)) - (Math.PI / 2)) * d;
                var lon = x * d / R;
                return [lat, lon]
            }

            //Coordinates into geographical coordinates
            var getCoordinates = function(x, y, z) {
                var tileSize = 2 * Math.PI * R / (1 << z);
                var pointMin = unproject(x * tileSize, (y + 1) * tileSize);
                var pointMax = unproject((x + 1) * tileSize, y * tileSize);
                return [pointMin, pointMax]

            }
            var bounds = getCoordinates(x, y, z);

            //Rectangle  is defined and added on the tile layer
            L.rectangle(bounds, { weight: 0.5, color:  "red", fill:"True",stroke: "none" ,opacity: 0.1, fillOpacity:0.3}).bindPopup('Human Presence is:'+ hp).addTo(tileDataLayer);
        }
        //Tile layer on the map and layer control
        map.addLayer(tileDataLayer);
        layerControl.addOverlay(tileDataLayer, "Human Presence");

        });
    });
</script>
