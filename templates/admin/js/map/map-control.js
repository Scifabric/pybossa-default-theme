<script type="text/javascript">
	// A $( document ).ready() block.

    var ZOOM_LEVEL = 12;
    var NUM_OF_ROWS = 2;
    var NUM_OF_COLUMNS = 6;

	$( document ).ready(function() {

		var map = new L.Map('map', {
		  selectArea: true
		}).setView([22.42658, 114.1452], 1);


        $('.zoom-select').on('change', function() {
            ZOOM_LEVEL = parseInt($(".zoom-select").val());
			map.selectArea.setShiftKey(true);
        });


		var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);


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

		  	 var generated_coordinates = generateCoordinates(northEastLat, northEastLon, southWestLat, southWestLon);

		  	bounds  = L.bounds(northEastLat, southWestLon );


		  	var topLeft = L.marker([northEastLat, southWestLon]);

		  	var topRight = L.marker([northEastLat, northEastLon]);

		  	var bottomLeft = L.marker([southWestLat, southWestLon]);

		  	var bottomRight = L.marker([southWestLat, northEastLon]);

		  	var topLeftPixelCoordinates = latLongZoomToPixelCoords(northEastLat, southWestLon);
		  	var topRightPixelCoordinates = latLongZoomToPixelCoords(northEastLat, northEastLon);
		  	var bottomLeftPixelCoordinates = latLongZoomToPixelCoords(southWestLat, southWestLon);
		  	var bottomRightPixelCoordinates = latLongZoomToPixelCoords(southWestLat, northEastLon);

		  	var topLeftPixelCoords = latLongZoomToPixelCoords(northEastLat,southWestLon);
		  	var bottomRightPixelCoords = latLongZoomToPixelCoords(southWestLat, northEastLon);

		  	//After we figured out the corner coordinates, let's generate the CSV
		  	generateTilesCsv(topLeftPixelCoords.x, topLeftPixelCoords.y,bottomRightPixelCoords.x,bottomRightPixelCoords.y);
		  	
		  	// Generating polylines so we can see which area we selected on the map
		  	var upperLine = L.polyline([topRight._latlng, topLeft._latlng], {color: 'yellow'}).addTo(map),
		  	leftLine = L.polyline([topLeft._latlng, bottomLeft._latlng], {color: 'yellow'}).addTo(map),
		  	bottomLine = L.polyline([bottomLeft._latlng, bottomRight._latlng], {color: 'yellow'}).addTo(map),
		  	rightLine = L.polyline([topRight._latlng, bottomRight._latlng], {color: 'yellow'}).addTo(map);


		  	// Creating a polylines array so we can remove them all at once.
		  	var polylinesArray = [upperLine, leftLine, bottomLine, rightLine];

		  	// clearing the map selection when we click the Clear Map button
		  	$('#clear_map').click(function(){
		  		for(var index in polylinesArray){
		  			map.removeLayer(polylinesArray[index]);
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
	   for (var i in map._layers) {
		    if (map._layers[i].options.format == undefined) {
		        try {
		            map.removeLayer(map._layers[i]);
		        } catch (e) {
		            console.error("problem with " + e + map._layers[i]);
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
	function generateCoordinates(northEastLat, northEastLon, southWestLat, southWestLon){
		// The array of the end-result we get from this method looking like:
		var result = [];

		// The distance of the horizontal line of the selection
		var horizontalDistance =northEastLat - southWestLat;

		// The distance of the vertical line of the selection
		var verticalDistance = northEastLon - southWestLon;

		// The horizontal distance(width) of a single tile
		var horizontalTileDistance = horizontalDistance/ NUM_OF_COLUMNS;

		// The vertical distance(height) of a single tile
		var verticalTileDistance = verticalDistance/ NUM_OF_ROWS;

		// Caulcate the corner coordinates of the tiles.
		for (var i = 1; i <= NUM_OF_COLUMNS; i++) {
			result[i] = [];


			for(var j = 1; j<=NUM_OF_ROWS; j++){
				var horizontalTileCoordinate = i*horizontalTileDistance + southWestLat;
				var verticalTileCoordinate = j*verticalTileDistance + southWestLon;

				var secondHorizontalTileCoordinate = horizontalTileCoordinate - horizontalTileDistance/2;
				var secondVerticalTileCoordinate = verticalTileCoordinate - verticalTileDistance/2;

				result[i][j] = {"lat":horizontalTileCoordinate, "lon":verticalTileCoordinate , "lat2":secondHorizontalTileCoordinate,"lon2":secondVerticalTileCoordinate};
			}

		}

		return result;
	}

	// Convert latitude and longitude to pixel coordinates
	function latLongZoomToPixelCoords(lat, lon){

	    var sinLat = Math.sin(lat * Math.PI/180.0);
	    var x = ((lon + 180) / 360) * 256 * Math.pow(2, ZOOM_LEVEL);
	    var y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * 256 * Math.pow(2, ZOOM_LEVEL);
	    var p_x = Math.floor(x);
	    var p_y = Math.floor(y);
	    var layerPoint = {
	        x: p_x,
	        y: p_y
	    };
	    return layerPoint;
	}

	// Convert pixel coordinates to tile address
	function pixelCoordsToTileAddress(x,y){
	    var x = parseInt(Math.floor(x / 256));
	    var y = parseInt(Math.floor(y / 256));
	    var layerPoint = {
	        x: x,
	        y: y
	    };
	    return layerPoint;
	}

	// Convert tile address cordinates to QuadKey if we are using BING MAPS
	var tileCoordsAndZoomToQuadKey = function(x, y){
		var quadKey = '';
	    for(var i=ZOOM_LEVEL; i>0; i--){
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
	function quadKeyToUrl(quadKey){
		var tile_url = "http://t0.tiles.virtualearth.net/tiles/a"+quadKey+".jpeg?g=854&mkt=en-US&token=Wng5gW93a5omskTBVFAp~EDP0U37k7j79v_kqQAmVeQ~AuurLIe7KMsHd5UOgw66QOy_HbLp9egG3siNhepFHn27XofL8s_6CO68AFeAlVBn";

	    return tile_url
	}

	// Convert latitude and longitude to Quad Key
	function latLongZoomToQuadKey(lat, lon){
		var pixel = latLongZoomToPixelCoords(lat, lon);
	    var tile = pixelCoordsToTileAddress(pixel.x, pixel.y);
	    var quadKey = tileCoordsAndZoomToQuadKey(tile.x, tile.y);
	    return quadKey;
	}

	// Generate the CSV file based on the corner tile address coordinates, the increments
	// increementX = width
	// incrementY = height
	function generateTilesCsv(x, y, x1, y1){

		var cornerTile = pixelCoordsToTileAddress(x, y);
		var bottomRightTile = pixelCoordsToTileAddress(x1, y1);

		var cornerX = cornerTile.x;
		var cornerY = cornerTile.y;

		var maxX = bottomRightTile.x;
		var maxY = bottomRightTile.y;

		var result = buildTileCords(cornerX,cornerY,maxX,maxY);
		var csvArray = [];
		var csvHeader = "index,zoom,x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6,x7,y7,x8,y8,x9,y9,x10,y10,x11,y11,x12,y12" + "\n";
		csvArray[0] = csvHeader;

		for(var index in result){
			var loopIndex = 1;
			var row = index + "," + ZOOM_LEVEL;
			for(var idx in result[index]){
				
				for(var i in result[index][idx]){
					if(loopIndex==1){
						row += "," + result[index][idx][i];
					}
					else if(loopIndex < result[index][idx].length - 1 && result[index][idx][i] != ""){
						row += "," + result[index][idx][i];
					}
					loopIndex++;
				}
			}
			row += "\n";
			csvArray.push(row);
		}
		downloadFile(csvArray,"download.csv");
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
	var tileXYtoPixelXY = function(tileX,tileY)
	{
	    var pixelX = tileX * 256;
	    var pixelY = tileY * 256;

	    return {"x":pixelX, "y":pixelY};

	}

	// Convert X Y Tile coordinates to URL if we are using BING MAPS
	function XYtoURL(x,y){
		var tile = pixelCoordsToTileAddress(x, y);
		var quadKey = tileCoordsAndZoomToQuadKey(tile.x, tile.y);
		var tile_url = quadKeyToUrl(quadKey);
	    return [tile_url];
	}

	// Convert Latitude, Longitude and Zoom directly to tile URL if we are using Bing Maps
	function latLongZoomToURL(lat, lon){
		var pixel = latLongZoomToPixelCoords(lat, lon);
	    var tile = pixelCoordsToTileAddress(pixel.x, pixel.y);
	    var quadKey = tileCoordsAndZoomToQuadKey(tile.x, tile.y);
	    var tileUrl = quadKeyToUrl(quadKey);
	    return tileUrl;
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
	var convertPixelsToLatLon = function(pixelX, pixelY, levelOfDetail){
	    var mapSize = mapSize(levelOfDetail);
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
	function mapSize(levelOfDetail)
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
	                console.error("Invalid QuadKey digit sequence.");
	        }
	    }

	    return { "x: " : tileX, "y" : tileY};
	}

	// Build tile Coordinates based on the params we give in the map tile generator page
	function buildTileCords(x,y,maxX,maxY){
	  var xCoordCurrent = x;
	  var yCoordCurrent = y;

	  var result = [];

	  var numberOfTasks = ((maxX-x)/ NUM_OF_COLUMNS) * ((maxY-y)/ NUM_OF_ROWS);

	  var loopIndex = 1;
	  while(yCoordCurrent < maxY){
	    result[loopIndex] = [];
	    if(xCoordCurrent<maxX){
	      result[loopIndex].push([xCoordCurrent,yCoordCurrent],[xCoordCurrent+NUM_OF_COLUMNS-1,yCoordCurrent+NUM_OF_ROWS-1]);
	      xCoordCurrent = xCoordCurrent + NUM_OF_COLUMNS;
	      loopIndex++;
	    }else{
	      xCoordCurrent = x;
	      yCoordCurrent = yCoordCurrent + NUM_OF_ROWS;
	    }
	  }
	  var finalResult = [];
	  for(var i = 1;i<result.length-1;i++){
	    finalResult.push(buildTaskRow(result[i][0][0],result[i][0][1],result[i][1][0],result[i][1][1]));
	  }

	  return finalResult;
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
</script>
