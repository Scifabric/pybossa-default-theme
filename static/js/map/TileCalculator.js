function TileCalculator(){
            this.tileSize = 256;
        this.initialResolution = 2 * Math.PI * 6378137 / this.tileSize;
        // 156543.03392804062 for tileSize 256 PIxels;
        this.originShift = 2 * Math.PI * 6378137 / 2.0;
        // 20037508.342789244;
		
}

TileCalculator.prototype.LatLonToMeters = function(lat, lon){
	//Converts given lat/lon in WGS84 Datum to XY in Spherical Mercator EPSG:900913

    var mx = lon * this.originShift / 180.0;
    var my = Math.log( Math.tan((90 + lat) * Math.PI / 360.0 )) / (Math.PI / 180.0);
    var my = my * this.originShift / 180.0;
    return mx, my;
}

TileCalculator.prototype.MetersToLatLon = function(mx, my ){
    // Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum
    console.log(Math.PI);
    var lon = (mx / this.originShift) * 180.0;
    var lat = (my / this.originShift) * 180.0;

    lat = 180 / Math.PI * (2 * Math.atan( Math.exp( lat * Math.PI / 180.0)) - Math.PI / 2.0);
    return [lat, lon];
}

TileCalculator.prototype.PIxelsToMeters = function(px, py, zoom){
	 //Converts PIxel coordinates in given zoom level of pyramid to EPSG:900913

    var res = this.Resolution( zoom )
    var mx = px * res - this.originShift
    var my = py * res - this.originShift
    return mx, my
}
TileCalculator.prototype.PIxelsToTile = function(px, py){
	 //Returns a tile covering region in given PIxel coordinates

    var tx = int( Math.ceil( px / float(this.tileSize) ) - 1 );
    var ty = int( Math.ceil( py / float(this.tileSize) ) - 1 );
    return tx, ty;
}
TileCalculator.prototype.MetersToTile = function(mx, my, zoom){
	//Returns tile for given mercator coordinates"
    
    var px, py = this.MetersToPIxels( mx, my, zoom);
    return this.PIxelsToTile( px, py);
}
       
