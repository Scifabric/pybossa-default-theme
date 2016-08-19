
// A $( document ).ready() block.
$( document ).ready(function() {

	var map = new L.Map('map', {
	  selectArea: true
	}).setView([22.42658, 114.1452], 1);

	var TILES_ZOOM = "";
	var incrementX = "";
	var incrementY = "";

	$('#enable_selection').click(function() {
		TILES_ZOOM = parseInt($("#zoom").val());
		incrementX = parseInt($("#number_of_rows").val());
		incrementY = parseInt($("#number_of_columns").val());
		map.selectArea.setShiftKey(true);
	});
	


	// tiles layer
	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);


	// // create button
	// var button = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-select-control', map._controlCorners.topleft);
	// button.innerHTML = '<div class="icon"></div>';

	// function areaSelectToggled() {
	//   if (map.selectArea.enabled()) {
	//     L.DomUtil.removeClass(button, 'active');
	//     map.selectArea.disable();
	//   } else {
	//     L.DomUtil.addClass(button, 'active');
	//     map.selectArea.enable();
	//   }
	// }

	// function updateButton() {
	//   L.DomUtil[map.selectArea.enabled() ? 'addClass' : 'removeClass'](button, 'active');
	// }

	// // activate
	// L.DomEvent.on(button, 'click', areaSelectToggled);

	var result = document.querySelector('.result');

	var northEastLat = '';
	var northEastLon = '';

	var southWestLat = '';
	var southWestLon = '';
	// on select
	map.on({
	  'areaselected': function areaselected(evt) {
	  	 northEastLat = evt.bounds._northEast['lat'];
	  	 northEastLon = evt.bounds._northEast['lng'];
	  	 southWestLat = evt.bounds._southWest['lat'];
	  	 southWestLon = evt.bounds._southWest['lng'];

	  	 var generated_coordinates = generateCoordinates(northEastLat, northEastLon, southWestLat, southWestLon, number_of_rows,  number_of_columns );

	  	bounds  = L.bounds(northEastLat, southWestLon );


	  	var topLeft = L.marker([northEastLat, southWestLon]);

	  	var topRight = L.marker([northEastLat, northEastLon]);

	  	var bottomLeft = L.marker([southWestLat, southWestLon]);

	  	var bottomRight = L.marker([southWestLat, northEastLon]);

	  	var top_left_pixel_coordinates = lat_long_zoom_to_pixel_coords(northEastLat, southWestLon,TILES_ZOOM);
	  	var top_right_pixel_coordinates = lat_long_zoom_to_pixel_coords(northEastLat, northEastLon,TILES_ZOOM);
	  	var bottom_left_pixel_coordinates = lat_long_zoom_to_pixel_coords(southWestLat, southWestLon,TILES_ZOOM);
	  	var bottom_right_pixel_coordinates = lat_long_zoom_to_pixel_coords(southWestLat, northEastLon,TILES_ZOOM);

	  	var top_left_pixel_coords = lat_long_zoom_to_pixel_coords(northEastLat,southWestLon,TILES_ZOOM);
	  	var bottom_right_pixel_coords = lat_long_zoom_to_pixel_coords(southWestLat, northEastLon,TILES_ZOOM);

	  	//After we figured out the corner coordinates, let's generate the CSV
	  	generate_tiles_csv(top_left_pixel_coords.x, top_left_pixel_coords.y,bottom_right_pixel_coords.x,bottom_right_pixel_coords.y, incrementX,incrementY, TILES_ZOOM );
	  	
	  	// Generating polylines so we can see which area we selected on the map
	  	var upper_line = L.polyline([topRight._latlng, topLeft._latlng], {color: 'yellow'}).addTo(map),
	  	left_line = L.polyline([topLeft._latlng, bottomLeft._latlng], {color: 'yellow'}).addTo(map),
	  	bottom_line = L.polyline([bottomLeft._latlng, bottomRight._latlng], {color: 'yellow'}).addTo(map),
	  	right_line = L.polyline([topRight._latlng, bottomRight._latlng], {color: 'yellow'}).addTo(map);


	  	// Creating a polylines array so we can remove them all at once.
	  	var polylines_array = [upper_line, left_line, bottom_line, right_line];

	  	// clearing the map selection when we click the Clear Map button
	  	$('#clear_map').click(function(){
	  		for(index in polylines_array){
	  			map.removeLayer(polylines_array[index]);
	  		}
		});

	    L.Util.requestAnimFrame(function () {
	      map.eachLayer(function (pointLayer) {
	        if (pointLayer instanceof L.CircleMarker) {
	          pointLayer.setStyle({
	            color: evt.bounds.contains(pointLayer.getLatLng()) ? '#0f0' : '#f00'
	          });
	        }
	      });
	    });
	    result.innerHTML = '<pre>You have selected an area with the above coordinates:\n' + evt.bounds.toBBoxString().split(',').join(',\n') + '</pre>';
	  },
	  // 'areaselecttoggled': updateButton
	});

	// updateButton();

	

	
});
function clearMap(map) {
   for (i in map._layers) {
	    if (map._layers[i].options.format == undefined) {
	        try {
	            map.removeLayer(map._layers[i]);
	        } catch (e) {
	            console.log("problem with " + e + map._layers[i]);
	        }
	    }
	}
}
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
		}
		
	}

	return result;
}

// Convert latitude and longitude to pixel coordinates
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
    return layerPoint;
}

// Convert pixel coordinates to tile address
function pixel_coords_to_tile_address(x,y){
    var x = parseInt(Math.floor(x / 256));
    var y = parseInt(Math.floor(y / 256));
    var layerPoint = {
        x: x,
        y: y
    };
    return layerPoint;
}

// Convert tile address cordinates to QuadKey if we are using BING MAPS
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

// Convert the QuadKey to a bing maps Tile URL
function quadKey_to_url(quadKey){
	var tile_url = "http://t0.tiles.virtualearth.net/tiles/a"+quadKey+".jpeg?g=854&mkt=en-US&token=Wng5gW93a5omskTBVFAp~EDP0U37k7j79v_kqQAmVeQ~AuurLIe7KMsHd5UOgw66QOy_HbLp9egG3siNhepFHn27XofL8s_6CO68AFeAlVBn";

    return tile_url
}
    
// Convert latitude and longitude to Quad Key
function lat_long_zoom_to_quadKey(lat, lon, zoom){
	var pixel = lat_long_zoom_to_pixel_coords(lat, lon, zoom);
    var tile = pixel_coords_to_tile_address(pixel.x, pixel.y);
    var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
    return quadKey;
}

// Generate the CSV file based on the corner tile address coordinates, the increments 
// increementX = width
// incrementY = height
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
		var loop_index = 1;
		row += "" + index + "," + zoom + ",";
		for(idx in result[index]){
			
			for(i in result[index][idx]){
				console.log(result[index][idx][i]);
				if(loop_index==1){
					row += result[index][idx][i] + ",";
				}
				else if(loop_index < result[index][idx].length - 1 && result[index][idx][i] != ""){
					row += result[index][idx][i] + ",";
				}
				loop_index++;
			}
		}
		row+= "\n";
		csv_array.push(row);
		row = "";
	}
	downloadFile(csv_array,"download.csv");
	return result;
}

// Download the csv file based on the array of tiles we generated
function downloadFile(data, fileName) {
        var csvData = data;
        var blob = new Blob([ csvData ], {
            type : "text/csv;"
        });

        if (window.navigator.msSaveBlob) {
            // FOR IE BROWSER
            navigator.msSaveBlob(blob, fileName);
        } else {
            // FOR OTHER BROWSERS
            var link = document.createElement("a");
            var csvUrl = URL.createObjectURL(blob);
            link.href = csvUrl;
            link.style = "visibility:hidden";
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
}
// Convert tile X and Y to Pixel X and Y
var tile_xy_to_pixel_xy = function(tileX,tileY)
{
    var pixelX = tileX * 256;
    var pixelY = tileY * 256;

    return {"x":pixelX, "y":pixelY};

}

// Convert X Y Tile coordinates to URL if we are using BING MAPS
function x_y_to_URL(x,y,zoom){
	var tile = pixel_coords_to_tile_address(x, y);
	var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
	var tile_url = quadKey_to_url(quadKey);
    return [tile_url];
}

// Convert Latitude, Longitude and Zoom directly to tile URL if we are using Bing Maps
function lat_long_zoom_to_URL(lat, lon, zoom){
	var pixel = lat_long_zoom_to_pixel_coords(lat, lon, zoom);
    var tile = pixel_coords_to_tile_address(pixel.x, pixel.y);
    var quadKey = tile_coords_and_zoom_to_quadKey(tile.x, tile.y, zoom);
    var tile_url = quadKey_to_url(quadKey);
    return tile_url;
}

// Get the distance of the map selection
var  distance = function(x1,x2, y1,y2){
	var result = {
		"vertical_distance":y2-y1,
		"horizontal_distance":x2-x1
	}
	return result;
}


// Convert tile pixels to latitude and longitude
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
// Get the map size
function map_size(levelOfDetail)
{
    return 256 << levelOfDetail;
}

// Convert QuadKey to Tile address X and Y
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

// Build tile Coordinates based on the params we give in the map tile generator page
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

// Generate tile coordinates for one task
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


