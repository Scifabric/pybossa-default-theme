
// A $( document ).ready() block.
$( document ).ready(function() {
    
	var tc = new TileCalculator;

	var TILES_ZOOM = 10;
	var map = new L.Map('map', {
	  selectArea: true
	}).setView([22.42658, 114.1452], 4);


	$('#generate_tasks').click(function() {
	  alert( "Handler for .click() called." );
	  map.setZoom($("#zoom").val());
	});
	
	// tiles layer
	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,

		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


	// create button
	var button = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-select-control', map._controlCorners.topleft);
	button.innerHTML = '<div class="icon"></div>';

	function areaSelectToggled() {
	  if (map.selectArea.enabled()) {
	    L.DomUtil.removeClass(button, 'active');
	    map.selectArea.disable();
	  } else {
	    L.DomUtil.addClass(button, 'active');
	    map.selectArea.enable();
	  }
	}

	function updateButton() {
	  L.DomUtil[map.selectArea.enabled() ? 'addClass' : 'removeClass'](button, 'active');
	}

	// activate
	L.DomEvent.on(button, 'click', areaSelectToggled);

	var result = document.querySelector('.result');

	var northEastLat = '';
	var northEastLon = '';

	var southWestLat = '';
	var southWestLon = '';
	// on select
	map.on({
	  'areaselected': function areaselected(evt) {
	  	// console.log(evt);
	  	 northEastLat = evt.bounds._northEast['lat'];
	  	 northEastLon = evt.bounds._northEast['lng'];
	  	 southWestLat = evt.bounds._southWest['lat'];
	  	 southWestLon = evt.bounds._southWest['lng'];

	  	 var incrementX = $("#number_of_rows").val();
	  	 var incrementY = $("#number_of_columns").val();
	  	 var generated_coordinates = generateCoordinates(northEastLat, northEastLon, southWestLat, southWestLon, number_of_rows,  number_of_columns );

	  	bounds  = L.bounds(northEastLat, southWestLon );


	  	var topLeft = L.marker([northEastLat, southWestLon]).addTo(map).bindPopup("<b>." + northEastLat + ":"+southWestLon);

	  	var topRight = L.marker([northEastLat, northEastLon]);

	  	var bottomLeft = L.marker([southWestLat, southWestLon]);

	  	var bottomRight = L.marker([southWestLat, northEastLon]);

	  	// console.log("topleft lat-lng : " + northEastLat + " : " + southWestLon);
	  	var top_left_pixel_coordinates = lat_long_zoom_to_pixel_coords(northEastLat, southWestLon,TILES_ZOOM);
	  	var top_right_pixel_coordinates = lat_long_zoom_to_pixel_coords(northEastLat, northEastLon,TILES_ZOOM);
	  	var bottom_left_pixel_coordinates = lat_long_zoom_to_pixel_coords(southWestLat, southWestLon,TILES_ZOOM);
	  	var bottom_right_pixel_coordinates = lat_long_zoom_to_pixel_coords(southWestLat, northEastLon,TILES_ZOOM);

	  	var top_left_pixel_coords = lat_long_zoom_to_pixel_coords(northEastLat,southWestLon,TILES_ZOOM);
	  	var bottom_right_pixel_coords = lat_long_zoom_to_pixel_coords(southWestLat, northEastLon,TILES_ZOOM);

	  	//After we figured out the corner coordinates, let's generate the CSV
	  	generate_tiles_csv(top_left_pixel_coords.x, top_left_pixel_coords.y,bottom_right_pixel_coords.x,bottom_right_pixel_coords.y, 6,2, TILES_ZOOM );
	  	
	  	var upper_line = L.polyline([topRight._latlng, topLeft._latlng], {color: 'red'}).addTo(map),
	  	left_line = L.polyline([topLeft._latlng, bottomLeft._latlng], {color: 'red'}).addTo(map),
	  	bottom_line = L.polyline([bottomLeft._latlng, bottomRight._latlng], {color: 'red'}).addTo(map),
	  	right_line = L.polyline([topRight._latlng, bottomRight._latlng], {color: 'red'}).addTo(map);

	  	for(element in generated_coordinates){
	  		for(el in generated_coordinates[element]){
	  			var lat2 = generated_coordinates[element][el]['lat2'];
	  			var lon2 = generated_coordinates[element][el]['lon2'];
	  			console.log("lat:" + lat2 + " lon: " + lon2);
	  			L.marker([lat2,lon2 ]).addTo(map).bindPopup("<b>." + generated_coordinates[element][el]['lat2'] + ":"+generated_coordinates[element][el]['lon2']);
	  		}
	  		
	  	}

	  	var topLeftPoint = L.point(northEastLat, southWestLon),
	  	topRightPoint = L.point(northEastLat, northEastLon),
	  	new_point = topRightPoint.subtract(topLeftPoint);

	    L.Util.requestAnimFrame(function () {
	      map.eachLayer(function (pointLayer) {
	        if (pointLayer instanceof L.CircleMarker) {
	          pointLayer.setStyle({
	            color: evt.bounds.contains(pointLayer.getLatLng()) ? '#0f0' : '#f00'
	          });
	        }
	      });
	    });
	    result.innerHTML = '<pre>' + evt.bounds.toBBoxString().split(',').join(',\n') + '</pre>';
	  },
	  'areaselecttoggled': updateButton
	});

	/***
		Generating coordinates based on the corners of the selection
		If the we are selecting corners/bounds named as 
		n_e_lat = northEastLat, 
		n_e_lon = northEastLon, 
		s_w_lat = southWestLat, 
		s_w_lon = southWestLon

		We first need the distance of the longitude to get the coordinates of the corners of the tiles in an horizontal view.
		
		*** Horizontal distance ***
		h_d = horizontal_distance
		h_d = n_e_lon(right longitude) - s_w_lon(left_longitude);

		*** Vertical distance ****
		v_d = vertical_distance
		v_d = s_w_lat(bottom latitude) - n_e_lat(top latitude)

								lat(horizontal)
								 |
		(n_e_lat,s_w_lon)   *********h_d***********NORTH************h_d************** (n_e_lat, n_e_lon)
							*														*
		  lon (vertical)----*														*
							v_d														v_d
							*														*
							W														E
							E														A
							S														S
							T														T
							*														*
							v_d														v_d
							*														*
							*														*
		(s_w_lat,s_w_lon)   **************h_d*******SOUTH**********h_d*************** (s_w_lat, n_e_lon)
	***/
	function generateCoordinates(n_e_lat, n_e_lon, s_w_lat, s_w_lon, number_of_rows, number_of_columns ){
		// The array of the end-result we get from this method looking like:
		// {"lat":horizontal_tile_coordinate, "lon":vertical_tile_coordinate , "lat2":second_horizontal_tile_coordinate,"lon2":second_vertical_tile_coordinate}
		var result = [];

		// The distance of the horizontal line of the selection
		var horizontal_distance =n_e_lat - s_w_lat;

		// The distance of the vertical line of the selection
		var vertical_distance = n_e_lon - s_w_lon;

		// The horizontal distance(width) of a single tile
		var horizontal_tile_distance = horizontal_distance/number_of_rows;

		// The vertical distance(height) of a single tile
		var vertical_tile_distance = vertical_distance/number_of_columns;

		// Caulcate the corner coordinates of the tiles.
		for (i = 1; i <= number_of_rows; i++) {
			result[i] = [];


			for(j = 1; j<=number_of_columns; j++){
				var horizontal_tile_coordinate = i*horizontal_tile_distance + s_w_lat;
				var vertical_tile_coordinate = j*vertical_tile_distance + s_w_lon;

				var second_horizontal_tile_coordinate = horizontal_tile_coordinate - horizontal_tile_distance/2;
				var second_vertical_tile_coordinate = vertical_tile_coordinate - vertical_tile_distance/2;

				result[i][j] = {"lat":horizontal_tile_coordinate, "lon":vertical_tile_coordinate , "lat2":second_horizontal_tile_coordinate,"lon2":second_vertical_tile_coordinate};
				// console.log("for i = " + i);
				// console.log("for j = " + j);
				// console.log("distance :" + (i*horizontal_tile_distance) + ", horizontal_tile_distance: " + horizontal_tile_distance + ", s_w_lat: "+s_w_lat+ ", result = " + horizontal_tile_coordinate);
				// console.log("distance :" + (i*vertical_tile_distance) + ", vertical_tile_distance: " + vertical_tile_distance + ", s_w_lon: "+s_w_lon + ", result = " + vertical_tile_coordinate);
			
			}
			
		}

		return result;
	}

	map.selectArea.setShiftKey(true);

	updateButton();
});

function LatLonToPixelCoordinates(lat, lon, zoom){
    //Converts lat/lon to pixel coordinates in given zoom of the EPSG:4326 pyramid"

    var res = 180 / 256.0 / Math.pow(zoom, 2);
    var px = (180 + lat) / res;
    var py = (90 + lon) / res;
    return [px, py];
}

function lat_long_zoom_to_pixel_coords(lat, lon, zoom){

    var sinLat = Math.sin(lat * Math.PI/180.0);
    var x = ((lon + 180) / 360) * 256 * Math.pow(2,zoom);
    var y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * 256 * Math.pow(2,zoom);
    var p_x = Math.floor(x);
    var p_y = Math.floor(y);
    var layerPoint = {
        x: p_x,
        y: p_y
    };
    // console.log("x: " + p_x + " y: "+ p_y);
    return layerPoint;
}
function pixel_coords_to_tile_address(x,y){
    var x = parseInt(Math.floor(x / 256));
    var y = parseInt(Math.floor(y / 256));
    var layerPoint = {
        x: x,
        y: y
    };
    return layerPoint;
}

var tile_coords_and_zoom_to_quadKey = function(x, y, zoom){
	var quadKey = '';
    for( i=zoom;i>0;i--){
    	var digit = 0;
        var mask = 1 << (i - 1);
        if((x & mask) != 0){
            digit += 1
        }
        if((y & mask) != 0){
            digit += 2
        }
        quadKey += digit;
    }
    return quadKey;
}

function quadKey_to_url(quadKey){
	var tile_url = "http://t0.tiles.virtualearth.net/tiles/a"+quadKey+".jpeg?g=854&mkt=en-US&token=Wng5gW93a5omskTBVFAp~EDP0U37k7j79v_kqQAmVeQ~AuurLIe7KMsHd5UOgw66QOy_HbLp9egG3siNhepFHn27XofL8s_6CO68AFeAlVBn";

    return tile_url
}
    

function lat_long_zoom_to_quadKey(lat, lon, zoom){
	var pixel = lat_long_zoom_to_pixel_coords(lat, lon, zoom);
    var tile = pixel_coords_to_tile_address(pixel.x, pixel.y);
    var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
    return quadKey;
}

function generate_tiles_csv(x, y,x1,y1,incrementX,incrementY, zoom){

	var corner_tile = pixel_coords_to_tile_address(x, y);
	var bottom_right_tile = pixel_coords_to_tile_address(x1, y1);

	var corner_x = corner_tile.x;
	var corner_y = corner_tile.y;

	var maxX = bottom_right_tile.x;
	var maxY = bottom_right_tile.y;

	var result = buildTileCords(corner_x,corner_y,maxX,maxY,incrementX,incrementY);
	var csv_array = [];
	var csv_header = ",index,zoom,x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6,x7,y7,x8,y8,x9,y9,x10,y10,x11,y11,x12,y12" + "\n";;
	csv_array[0] = csv_header;

	var row = "";
	for(index in result){

		row += "" + index + "," + zoom + ",";
		for(idx in result[index]){

			for(i in result[index][idx]){
				if(i==0){
					row += result[index][idx][i] + "";
				}
				else if(i < result[index][idx].length - 1 && result[index][idx][i] != ""){
					row += result[index][idx][i] + ",";
				}
				else if(result[index][idx][i] != ""){
					row += result[index][idx][i] + "";
				}
				// var the_url = quadKey_to_url(tile_coords_and_zoom_to_quadKey(result[index][idx][i][0], result[index][idx][i][1], 10));
				// console.log(the_url);
			}
			
			// console.log(result[index][idx]);
		}
		row+= "\n";
		csv_array.push(row);
		row = "";
	}
	console.log(csv_array);

	download(csv_array, 'dowload.csv', 'text/csv');

	return result;
}
var download = function(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
  } else if ('download' in a) { //html5 A[download]
    a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    setTimeout(function() {
      a.click();
      document.body.removeChild(a);
    }, 66);
    return true;
  } else { //do iframe dataURL download (old ch+FF):
    var f = document.createElement('iframe');
    document.body.appendChild(f);
    f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);

    setTimeout(function() {
      document.body.removeChild(f);
    }, 333);
    return true;
  }
}
var tile_xy_to_pixel_xy = function(tileX,tileY)
{
    var pixelX = tileX * 256;
    var pixelY = tileY * 256;

    return {"x":pixelX, "y":pixelY};

}

function x_y_to_URL(x,y,zoom){
	var tile = pixel_coords_to_tile_address(x, y);
	console.log(tile.x + " :::::: " + tile.y);
	console.log((tile.x+1) + " :::::: " + tile.y);
	var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
	var tile_url = quadKey_to_url(quadKey);
    return [tile_url];
}
function lat_long_zoom_to_URL(lat, lon, zoom){
	var pixel = lat_long_zoom_to_pixel_coords(lat, lon, zoom);
    var tile = pixel_coords_to_tile_address(pixel.x, pixel.y);
    
    var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
    var tile_url = quadKey_to_url(quadKey);
    return tile_url;
}


var getSlippyTileLayerPoints = function (lat_deg, lng_deg, zoom) {
    var x = (Math.floor((lng_deg ) / 360 * Math.pow(2, zoom)));
    var y = (Math.floor((1 - Math.log(Math.tan(lat_deg * Math.PI / 180) + 1 / Math.cos(lat_deg * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));

    var layerPoint = {
        x: x,
        y: y
    };
    return layerPoint;
};

var  distance = function(x1,x2, y1,y2){
	var result = {
		"vertical_distance":y2-y1,
		"horizontal_distance":x2-x1
	}
	return result;
}


var convert_pixels_to_latlon = function(pixelX, pixelY, levelOfDetail){
    var mapSize = map_size(levelOfDetail);
    var x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    var y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);

    var latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    var longitude = 360 * x;

	return {"lat":latitude,"lon":longitude};
}
function clip( n,  minValue,  maxValue)
{
    return Math.min(Math.max(n, minValue), maxValue);
}
function map_size(levelOfDetail)
{
    return 256 << levelOfDetail;
}
function QuadKeyToTileXY(quadKey){
    var tileX = tileY = 0;
    var levelOfDetail = quadKey.length;
    for (var i = levelOfDetail; i > 0; i--)
    {
        var mask = 1 << (i - 1);
        switch (quadKey[levelOfDetail - i])
        {
            case '0':
                break;

            case '1':
                tileX |= mask;
                break;

            case '2':
                tileY |= mask;
                break;

            case '3':
                tileX |= mask;
                tileY |= mask;
                break;

            default:
                console.log("Invalid QuadKey digit sequence.");
        }
    }

    return { "x: " : tileX, "y" : tileY};
}

function buildTileCords(x,y,maxX,maxY,incrementX,incrementY){
  var x_coord_current = x;
  var y_coord_current = y;

  var result = [];

  var number_of_tasks = ((maxX-x)/incrementX) * ((maxY-y)/incrementY);

  var loop_index = 1;
  while(y_coord_current < maxY){
    result[loop_index] = [];
    if(x_coord_current<maxX){
      result[loop_index].push([x_coord_current,y_coord_current],[x_coord_current+incrementX-1,y_coord_current+incrementY-1]);
      x_coord_current = x_coord_current + incrementX;
      loop_index++;
    }else{
      x_coord_current = x;
      y_coord_current = y_coord_current + incrementY;
    }
  }
  var final_result = [];
  for(var i = 1;i<result.length-1;i++){
    final_result.push(buildTaskRow(result[i][0][0],result[i][0][1],result[i][1][0],result[i][1][1]));
  }

  return final_result;
}


function buildTaskRow(x,y,x1,y1){
  var result = [];
  for(var i = y;i<=y1;i++){
    result[i] = [];
    for(var j = x; j<=x1; j++){
      result[i][j] = [j,i];
    }
  }
  return result;
}


