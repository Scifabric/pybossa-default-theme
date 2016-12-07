/* 
zoom for image comparison in darfur project,
when zoom before (or after) image, zoom the after (or before) image also
*/

var parallelZoom = {};
parallelZoom.zoomBeforeAfter = function(settings) {
	var beforeImageContainer = settings.beforeImageContainer;
	var afterImageContainer = settings.afterImageContainer;	

	var beforeImageSources = [], afterImageSources = [];

	//get images source THEN hide them
	extractImageSource(beforeImageSources, beforeImageContainer);
	extractImageSource(afterImageSources, afterImageContainer);

	$(beforeImageContainer).find('img').hide();
	$(afterImageContainer).find('img').hide();

	//init canvas to render images
	var html = "<div class='square-container'>" + 
			'<canvas id="smallBeforeCanvas">Your browser does not support the HTML5 canvas tag.</canvas>' +
			'<canvas id="bigBeforeCanvas" style="display:none">Your browser does not support the HTML5 canvas tag.</canvas>' +
		"</div>";
	$(beforeImageContainer).append(html);

		//squarec-container help to keep canvas in square shape during resize
	html = "<div class='square-container'>" + 
			'<canvas id="smallAfterCanvas">Your browser does not support the HTML5 canvas tag.</canvas>' +
			'<canvas id="bigAfterCanvas" style="display:none">Your browser does not support the HTML5 canvas tag.</canvas>' +
		"</div>";
	$(afterImageContainer).append(html);

	var beforeImages = [];
	var bigBeforeCanvas = document.getElementById("bigBeforeCanvas");
	var bigBeforeCanvasContext = bigBeforeCanvas.getContext('2d');
	var smallBeforeCanvas = document.getElementById("smallBeforeCanvas");
	var smallBeforeCanvasContext = smallBeforeCanvas.getContext('2d');

	var afterImages = [];
	var bigAfterCanvas = document.getElementById("bigAfterCanvas");
	var bigAfterCanvasContext = bigAfterCanvas.getContext('2d');
	var smallAfterCanvas = document.getElementById("smallAfterCanvas");
	var smallAfterCanvasContext = smallAfterCanvas.getContext('2d');

	var size;

	var tileRealSize = 256;//square of 256 x 256
	var tileViewSize;//tile resized version
	var zoomLevel;
	//dimension for zoom square window
	var zoomWidth;
	

	//the canvas contain original size images
	$("#bigBeforeCanvas").attr('width', tileRealSize * 2).attr('height', tileRealSize * 2);
	$("#bigAfterCanvas").attr('width', tileRealSize * 2).attr('height', tileRealSize * 2);

	//establish first time setting for dimension
	resize();

	$(window).on('resize', function() {
		resize();
    	drawSmallImages(smallBeforeCanvasContext, beforeImages);
    	drawSmallImages(smallAfterCanvasContext, afterImages);
	});

	init(beforeImageSources, beforeImages, smallBeforeCanvasContext, bigBeforeCanvasContext);
	init(afterImageSources, afterImages, smallAfterCanvasContext, bigAfterCanvasContext);

	if (Modernizr.touchevents) {
		handleEventOnMobile();		
	} else {
		handleEventOnDesktop();
	}

	function handleEventOnMobile() {
		// tap position in before image and after image
		var beforeXY = {
			x: null,
			y: null
		},
		afterXY = {
			x: null,
			y: null
		};

		
		$('#smallBeforeCanvas').mousemove(function(evt){
			//reset after image interaction
			afterXY.x = afterXY.y = null;
			zoomOnMobile(evt, smallBeforeCanvas, bigBeforeCanvas, beforeImages, beforeXY);
		});
		$('#smallAfterCanvas').mousemove(function(evt){
			//reset before image interaction
			beforeXY.x = beforeXY.y = null;
			zoomOnMobile(evt, smallAfterCanvas, bigAfterCanvas, afterImages, afterXY);
		});

	}

	function zoomOnMobile(evt, smallCanvas, bigCanvas, images, previousXY) {
		if (zoomLevel < 1) {
			return;
		}
		var smallCanvasContext = smallCanvas.getContext("2d");
		var previousX = previousXY.x;
		var previousY = previousXY.y;

		var rect = smallCanvas.getBoundingClientRect();
		var x = evt.clientX - rect.left;
	    var y = evt.clientY - rect.top;

	    //tap in same square -> turn off zoom
	    if ( 
	    	previousX &&
	    	previousY &&
	    	(x < (previousX + zoomWidth/2)) && 
	    	(x > (previousX - zoomWidth/2)) && 
	    	(y < (previousY + zoomWidth/2)) && 
	    	(y > (previousY - zoomWidth/2))
	    ) {
	    	previousXY.x = null;
	    	previousXY.y = null;
	    	drawSmallImages(smallCanvasContext, images);
	    } 
	    //zoom
	    else {
	    	previousXY.x = x;
	    	previousXY.y = y;
			zoom(smallCanvas, bigCanvas, images, x, y);
	    }
	    return previousXY;		
	}	
	
	function handleEventOnDesktop() {		
		var mouseOutBefore = true, mouseOutAfter = true;
		$('#smallBeforeCanvas').mouseout(function(){
			mouseOutBefore = true;
			if (mouseOutAfter) {
				drawSmallImages(smallBeforeCanvasContext, beforeImages);
				drawSmallImages(smallAfterCanvasContext, afterImages);
			}
		});
		$('#smallAfterCanvas').mouseout(function(){
			mouseOutAfter = true;
			if (mouseOutBefore) {
				drawSmallImages(smallBeforeCanvasContext, beforeImages);
				drawSmallImages(smallAfterCanvasContext, afterImages);
			}
		});

		$('#smallBeforeCanvas').mousemove(function(evt){
			if (zoomLevel < 1) {
				return;
			}

			mouseOutBefore = false;

			var rect = smallBeforeCanvas.getBoundingClientRect();
			var x = evt.clientX - rect.left;
		    var y = evt.clientY - rect.top;

			zoom(smallBeforeCanvas, bigBeforeCanvas, beforeImages, x, y);
			zoom(smallAfterCanvas, bigAfterCanvas, afterImages, x, y);
		});

		$('#smallAfterCanvas').mousemove(function(evt){
			if (zoomLevel < 1) {
				return;
			}

			mouseOutAfter = false;

			var rect = smallAfterCanvas.getBoundingClientRect();
			var x = evt.clientX - rect.left;
		    var y = evt.clientY - rect.top;

			zoom(smallBeforeCanvas, bigBeforeCanvas, beforeImages, x, y);
			zoom(smallAfterCanvas, bigAfterCanvas, afterImages, x, y);
		});		
	}


	/* calculate size of canvas, zoom ratio, zoom viewport width when resize window*/
	function resize() {
		size = $('.square-container').width();
		tileViewSize = size/2;
		zoomLevel = tileRealSize/tileViewSize;
		zoomWidth = tileViewSize;
		$("#smallBeforeCanvas").attr('width', size).attr('height', size);
		$("#smallAfterCanvas").attr('width', size).attr('height', size);
	}

	//find <img> in imageContainer, extract <img>'s source to imageSources
	function extractImageSource(imageSources, imageContainer) {
		if ($(imageContainer).find('img').length == 0) {
			console.error('There is no before images');
		}
		$.each($(imageContainer).find('img'), function(index, value){
			imageSources.push($(value).attr('src'));
		});

	}

	/* zoom by draw the right part of original image on top of smaller one */
	function zoom(smallCanvas, bigCanvas, images, x, y) {
		var smallCanvasContext = smallCanvas.getContext('2d');
		var bigCanvasContext = bigCanvas.getContext('2d');

	    var viewPort = zoomWidth;
	    // var zoomLevel = 2;
	    drawSmallImages(smallCanvasContext, images);

	    var largeX1,largeY1;
	    largeX1 = x * zoomLevel - viewPort/2;
	    largeY1 = y * zoomLevel - viewPort/2;

	    var bigImageCut = bigCanvasContext.getImageData(largeX1 , largeY1, viewPort, viewPort);
	    console.log(bigImageCut);
	    var x1, y1;
	    x1 = x - viewPort/2;
	    y1 = y - viewPort/2;
	    smallCanvasContext.putImageData(
	    	bigImageCut, 
	    	x1, y1
	    );

	    smallCanvasContext.strokeStyle = '#ff0';  // some color/style
		smallCanvasContext.lineWidth = 1;
	    smallCanvasContext.strokeRect(x1, y1, viewPort, viewPort);		
	}

	/* combine images for before/after images, use for first load */
	function init(imageSources, images, smallContext, bigContext) {
		//create scope for promise
		function imageOnload(image) {
		    var deferred = $.Deferred();
		    image.onload = function() {
		    	deferred.resolve('a');
		    };
		    return deferred;
		}

		var promises = [];
		for ( var i = 0; i < imageSources.length; i++ ) {
		    var image = new Image();
		    image.crossOrigin = 'Anonymous';
		    promises.push(imageOnload(image));
		    image.src = imageSources[i];
		    images.push(image);
		} 

		$.when(promises)
		.done(function(){
	    	drawSmallImages(smallContext, images);
	    	drawBigImages(bigContext, images);
		}).fail(function(){
			console.error("Error in loading images");
		});
	}

	function drawSmallImages(context, images) {
		context.drawImage(images[0], 0, 0, tileRealSize, tileRealSize, 0, 0, tileViewSize, tileViewSize);
		context.drawImage(images[1], 0, 0, tileRealSize, tileRealSize, tileViewSize, 0, tileViewSize, tileViewSize);
		context.drawImage(images[2], 0, 0, tileRealSize, tileRealSize, 0, tileViewSize, tileViewSize, tileViewSize);
		context.drawImage(images[3], 0, 0, tileRealSize, tileRealSize, tileViewSize, tileViewSize, tileViewSize, tileViewSize);			
	}

	function drawBigImages(context, images) {
		context.drawImage(images[0], 0, 0, tileRealSize, tileRealSize, 0, 0, tileRealSize, tileRealSize);
		context.drawImage(images[1], 0, 0, tileRealSize, tileRealSize, tileRealSize, 0, tileRealSize, tileRealSize);
		context.drawImage(images[2], 0, 0, tileRealSize, tileRealSize, 0, tileRealSize, tileRealSize, tileRealSize);
		context.drawImage(images[3], 0, 0, tileRealSize, tileRealSize, tileRealSize, tileRealSize, tileRealSize, tileRealSize);
	}

}

//Fixme: we enable zoom inside initLeaderboard() as we need to wait when all the images available on dom
//later when we can modify the template.html code then no need to do this
var darfurimagerycomparison_initLeaderboardTmp = darfurimagerycomparison.initLeaderboard;
darfurimagerycomparison.initLeaderboard = function(projectId) {
	darfurimagerycomparison_initLeaderboardTmp(projectId);

	var beforeImageContainer = $('.desktop-view .img-before-div')[0];
	var afterImageContainer = $('.desktop-view .img-after-div')[0];
	
	parallelZoom.zoomBeforeAfter({
		beforeImageContainer: beforeImageContainer,
		afterImageContainer: afterImageContainer		
	});
}