/* 
zoom for image comparison in darfur project,
when zoom before (or after) image, zoom the after (or before) image also
*/

var parallelZoom = {};
parallelZoom.init = function() {
	console.log($('.img-before.x1y1').attr('src'));
}

//Fixme: we enable zoom inside initLeaderboard() as we need to wait when all the images available on dom
//later when we can modify the template.html code then no need to do this
var darfurimagerycomparison_initLeaderboardTmp = darfurimagerycomparison.initLeaderboard;
darfurimagerycomparison.initLeaderboard = function(projectId) {
	darfurimagerycomparison_initLeaderboardTmp(projectId);

	parallelZoom.init();
}

