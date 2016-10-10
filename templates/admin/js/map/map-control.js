<script type="text/javascript">

var NUM_OF_TILES_PER_TASK = 12;
var TILE_EDGE_LENGTH_PIXELS = 256;

var NUM_OF_ROWS = 2;
var NUM_OF_COLUMNS = 6;

var selectedAreaKM = -1;

// Needs to be a global variable because we will check against its value
// when clicking on the "Download CSV" button.
var numOfTasks = -1;

// Need to be global because we will use this object when generating CSV.
var selectedBounds = null;

$(document).ready(function() {

    var map = new L.Map('map', {
        selectArea: true
    });

    map.setView([14.378300, 24.904200], 5);

    var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tileLayer.addTo(map);

    var areaSelect = L.areaSelect({width:200, height:300});
    areaSelect.addTo(map);


    // Every time we move the selected area, refresh data about the selected area.
    areaSelect.on("change", function() {

        selectedBounds = this.getBounds();

        // North East coordinates
        var neCoords = this.getBounds().getNorthEast().lat.toFixed(6) + ", " + this.getBounds().getNorthEast().lng.toFixed(6);
        $('.ne-bounds').text(neCoords);

        // South West coordinates
        var swCoords = this.getBounds().getSouthWest().lat.toFixed(6) + ", " + this.getBounds().getSouthWest().lng.toFixed(6);
        $('.sw-bounds').text(swCoords);

        // Selection area in sq/km.
        // First build a GeoJson
        var selectedPolygonGeoJson = getPolygonGeoJson(this.getBounds());
        // Then use turf to calculate the area.
        // we use a global variable to set the selection area because we need to access it in the zoom
        // level selection dropdown.
        selectedAreaKM = turf.area(selectedPolygonGeoJson) / 1000000;

        $('.selected-area').text(numeral(Math.ceil(selectedAreaKM)).format('0,0'));

        numOfTasks = getRequiredNumberOfTasks();
        $('.task-count').text(numeral(numOfTasks).format('0,0'));

        // enable download CSV button if it is disables
        if($('.btn-download-csv').hasClass('disabled')){
           $('.btn-download-csv').removeClass('disabled');
        }

    });

    function getPolygonGeoJson(bounds){
        var polygonGeoJson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    bounds.getNorthEast().lng,
                                    bounds.getNorthEast().lat
                                ],
                                [
                                    bounds.getNorthEast().lng,
                                    bounds.getSouthWest().lat
                                ],
                                [
                                    bounds.getSouthWest().lng,
                                    bounds.getSouthWest().lat
                                ],
                                [
                                    bounds.getSouthWest().lng,
                                    bounds.getNorthEast().lat
                                ],
                                [
                                    bounds.getNorthEast().lng,
                                    bounds.getNorthEast().lat
                                ]
                            ]
                        ]
                    }
                }
            ]
        };

        return polygonGeoJson
    }

    function getRequiredNumberOfTasks(){
        var tileEdgeLengthKM = parseFloat($('.zoom-select').val()) * TILE_EDGE_LENGTH_PIXELS / 1000;
        var tileAreaKM = tileEdgeLengthKM * tileEdgeLengthKM;
        var taskAreaKM = tileAreaKM * NUM_OF_TILES_PER_TASK;

        var taskNum =  selectedAreaKM / taskAreaKM;

        return Math.ceil(taskNum);
    }


    $('.zoom-select').on('change', function(){
        if(selectedAreaKM > 0){
            numOfTasks = getRequiredNumberOfTasks();
            $('.task-count').text(numeral(numOfTasks).format('0,0'));
        }
    });


    // Download CSV button click
    $('.btn-download-csv').on('click', function(){
        if(numOfTasks > 35000){
            $( "#too-many-tasks-error-modal").modal('show');
        }else{
            generateAndDownloadCSV();
        }
    });

    function generateAndDownloadCSV(){
        var northEastLat = selectedBounds.getNorthEast().lat;
        var northEastLon = selectedBounds.getNorthEast().lng;
        var southWestLat = selectedBounds.getSouthWest().lat;
        var southWestLon = selectedBounds.getSouthWest().lng;

        var topLeftPixelCoords = latLongZoomToPixelCoords(northEastLat,southWestLon);
        var bottomRightPixelCoords = latLongZoomToPixelCoords(southWestLat, northEastLon);

        //After we figured out the corner coordinates, let's generate the CSV
        generateTilesCsv(topLeftPixelCoords.x, topLeftPixelCoords.y,bottomRightPixelCoords.x,bottomRightPixelCoords.y);
    }


        // Convert latitude and longitude to pixel coordinates
    function latLongZoomToPixelCoords(lat, lon){

        var sinLat = Math.sin(lat * Math.PI/180.0);
        var x = ((lon + 180) / 360) * 256 * Math.pow(2, parseInt($( ".zoom-select option:selected" ).text()));
        var y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * 256 * Math.pow(2, parseInt($( ".zoom-select option:selected" ).text()));
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



    // Generate the CSV file based on the corner tile address coordinates, the increments
    // incrementX = width
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
            var row = index + "," + parseInt($( ".zoom-select option:selected" ).text());
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

    // Build tile Coordinates based on the params we give in the map tile generator page
    function buildTileCords(x,y,maxX,maxY){
        var xCoordCurrent = x;
        var yCoordCurrent = y;

        var result = [];
        
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
});
</script>
