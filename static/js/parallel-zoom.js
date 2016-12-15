/* 
zoom for image comparison in darfur project,
when zoom before (or after) image, zoom the after (or before) image also
*/
(function(){

var parallelZoom = {};
parallelZoom.zoomBeforeAfter = function(settings) {
	var beforeImageContainer = settings.beforeImageContainer;
	var afterImageContainer = settings.afterImageContainer;	

	var beforeImageSources = [], afterImageSources = [];

	var beforeImages = [];
	var bigBeforeCanvas;
	var smallBeforeCanvas;

	var afterImages = [];
	var bigAfterCanvas;
	var smallAfterCanvas;

	//container's size of final single before/after image 
	var size;

	var tileRealSize = 256;//square of 256 x 256
	var tileViewSize;//tile resized version
	var zoomLevel;
	//dimension for zoom square window
	var zoomWidth;
	

	var initBeforeDeffered = $.Deferred();
	var initAfterDeffered = $.Deferred();

	init(beforeImageContainer)
	.then(function(results){
		beforeImages = results.images;
		smallBeforeCanvas = results.smallCanvas;
		bigBeforeCanvas = results.bigCanvas;

		initBeforeDeffered.resolve();
	});

	init(afterImageContainer)
	.then(function(results){
		afterImages = results.images;
		smallAfterCanvas = results.smallCanvas;
		bigAfterCanvas = results.bigCanvas;

		initAfterDeffered.resolve();
	});

	$.when(initBeforeDeffered.promise(), initAfterDeffered.promise()).then(function(){
		if (Modernizr.touch) {
			handleEventOnMobile();		
		} else {
			handleEventOnDesktop();
		}

		$(window).on('resize', function() {
			var size = getSize();
			resize(smallBeforeCanvas, size);
			resize(smallAfterCanvas, size);
	    	drawSmallImages(smallBeforeCanvas, beforeImages);
	    	drawSmallImages(smallAfterCanvas, afterImages);

			//don't zoom icon when thumbnail image has the same size as original image
            if (zoomLevel <= 1) {
                $([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').hide();
            } else {
                $([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').show();
            }
		});
	})

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
		
		$(smallBeforeCanvas).mousemove(function(evt){
			//reset after image interaction
			afterXY.x = afterXY.y = null;
			zoomOnMobile(evt, smallBeforeCanvas, bigBeforeCanvas, beforeImages, beforeXY);
		});
		$(smallAfterCanvas).mousemove(function(evt){
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
	    	drawSmallImages(smallCanvas, images);
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
		$(smallBeforeCanvas).mouseout(function(){
			mouseOutBefore = true;
			if (mouseOutAfter) {
				drawSmallImages(smallBeforeCanvas, beforeImages);
				drawSmallImages(smallAfterCanvas, afterImages);

				if (zoomLevel > 1) {
                    $([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').show();
                }
			}
		});
		$(smallAfterCanvas).mouseout(function(){
			mouseOutAfter = true;
			if (mouseOutBefore) {
				drawSmallImages(smallBeforeCanvas, beforeImages);
				drawSmallImages(smallAfterCanvas, afterImages);

				if (zoomLevel > 1) {
                    $([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').show();
                }
			}
		});

		$(smallBeforeCanvas).mousemove(function(evt){
			if (zoomLevel < 1) {
				return;
			}

			mouseOutBefore = false;

			var rect = smallBeforeCanvas.getBoundingClientRect();
			var x = evt.clientX - rect.left;
		    var y = evt.clientY - rect.top;

			zoom(smallBeforeCanvas, bigBeforeCanvas, beforeImages, x, y);
			zoom(smallAfterCanvas, bigAfterCanvas, afterImages, x, y);

			$([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').hide();
		});

		$(smallAfterCanvas).mousemove(function(evt){
			if (zoomLevel < 1) {
				return;
			}

			mouseOutAfter = false;

			var rect = smallAfterCanvas.getBoundingClientRect();
			var x = evt.clientX - rect.left;
		    var y = evt.clientY - rect.top;

			zoom(smallBeforeCanvas, bigBeforeCanvas, beforeImages, x, y);
			zoom(smallAfterCanvas, bigAfterCanvas, afterImages, x, y);

			$([beforeImageContainer, afterImageContainer]).find('.icon-zoom-in').hide();
		});		
	}

	/* get size of image container width */
	function getSize() {
		//in mobile we only show before or after image so we need to use the width of visibile one
		var beforeWidth = $(beforeImageContainer).width();
		var afterWidth = $(afterImageContainer).width();
		size = (afterWidth > beforeWidth) ? afterWidth : beforeWidth;
		return size;
	}

	/* calculate size of canvas, zoom ratio, zoom viewport width when resize window*/
	function resize(smallCanvas, newSize) {
		if (!newSize) {
			size = getSize();
		} else {
			size = newSize;
		}

		tileViewSize = size/2;
		zoomLevel = tileRealSize/tileViewSize;
		zoomWidth = tileViewSize;
		$(smallCanvas).attr('width', size).attr('height', size);
	}

	//find <img> in imageContainer, extract <img>'s source to imageSources
	function extractImageSource(imageContainer) {
		var imageSources = [];
		if ($(imageContainer).find('img').length == 0) {
			console.error('There is no before images');
		}
		$.each($(imageContainer).find('img'), function(index, value){
			imageSources.push($(value).attr('src'));
		});
		return imageSources;
	}

	/* zoom by draw the right part of original image on top of smaller one */
	function zoom(smallCanvas, bigCanvas, images, x, y) {
		var smallCanvasContext = smallCanvas.getContext('2d');
		var bigCanvasContext = bigCanvas.getContext('2d');

	    var viewPort = zoomWidth;
	    // var zoomLevel = 2;
	    drawSmallImages(smallCanvas, images);

	    var largeX1,largeY1;
	    largeX1 = x * zoomLevel - viewPort/2;
	    largeY1 = y * zoomLevel - viewPort/2;

	    var bigImageCut = bigCanvasContext.getImageData(largeX1 , largeY1, viewPort, viewPort);
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

	/* 
	 * Combine images for before/after images, use for first load.
	 * Before image will have single image (after image with 4 images)
	 */
	function init(imageContainer) {
		var initDeferred = $.Deferred();

		//get images source THEN hide them
		var imageSources = extractImageSource(imageContainer);

		var images = [];

		//create scope for promise
		function imageOnload(image) {
		    var deferred = $.Deferred();
		    image.onload = function() {
		    	deferred.resolve('a');
		    };
		    return deferred.promise();
		}

		var promises = [];
		for ( var i = 0; i < imageSources.length; i++ ) {
		    var image = new Image();
		    image.crossOrigin = 'Anonymous';
		    promises.push(imageOnload(image));
		    image.src = imageSources[i];
		    images.push(image);
		} 

		var buildCanvas = function(){
		    var	size = getSize();

		    // $(imageContainer).empty();
		    if (settings.cleanPreviousContent) {
		    	settings.cleanPreviousContent(imageContainer);
		    } else {
		    	$(imageContainer).find('img').hide();	
		    }		    

			//init canvas to render images
			var html = '<!-- to enable zoom, images has been replaced with canvas -->' +
					//as normalize.css set canvas with display: inline-block 
					//which create a default padding-bottom (can not remove that padding)
					//so we set display: block here
					'<i class="glyphicon glyphicon-zoom-in icon-zoom-in"></i>' +
					'<canvas class="smallCanvas" style="display: block">Your browser does not support the HTML5 canvas tag.</canvas>' +
					'<canvas class="bigCanvas" style="display:none">Your browser does not support the HTML5 canvas tag.</canvas>'
				;
			$(imageContainer).append(html);

			var bigCanvas = $(imageContainer).find(".bigCanvas")[0];
			var smallCanvas = $(imageContainer).find(".smallCanvas")[0];

			//the canvas contain original size images
			$(bigCanvas).attr('width', tileRealSize * 2).attr('height', tileRealSize * 2);

			resize(smallCanvas, size);

	    	drawSmallImages(smallCanvas, images);
	    	drawBigImages(bigCanvas, images);

	    	initDeferred.resolve({
	    		images: images,
	    		smallCanvas: smallCanvas,
	    		bigCanvas: bigCanvas,
	    	});  	
		};

		// as jquery.when() doesn't support array of promise so we pass as separate argument now
			// after image include 4 smaller images
		if (promises.length == 4) {
			$.when(promises[0], promises[1], promises[2], promises[3])
			.then(buildCanvas, function(){
				console.error("Error in loading images");
			});
		} 
			// before image include 1 image
		else if (promises.length == 1) {
			$.when(promises[0])
			.then(buildCanvas, function(){
				console.error("Error in loading images");
			});
		} else {
			console.error('Number of child images for before or after image should be 1 or 4')
		}

		return initDeferred.promise();
	}

	function drawSmallImages(canvas, images) {
		var context = canvas.getContext('2d');
		if (images.length == 4) {
			context.drawImage(images[0], 0, 0, tileRealSize, tileRealSize, 0, 0, tileViewSize, tileViewSize);
			context.drawImage(images[1], 0, 0, tileRealSize, tileRealSize, tileViewSize, 0, tileViewSize, tileViewSize);
			context.drawImage(images[2], 0, 0, tileRealSize, tileRealSize, 0, tileViewSize, tileViewSize, tileViewSize);
			context.drawImage(images[3], 0, 0, tileRealSize, tileRealSize, tileViewSize, tileViewSize, tileViewSize, tileViewSize);			
		} else if (images.length == 1) {
			context.drawImage(images[0], 0, 0, tileRealSize * 2, tileRealSize * 2, 0, 0, tileViewSize * 2, tileViewSize * 2);
		} else {
			console.error('Number of child images for before or after image should be 1 or 4')
		}
	}

	function drawBigImages(canvas, images) {
		var context = canvas.getContext('2d');
		if (images.length == 4) {
			context.drawImage(images[0], 0, 0, tileRealSize, tileRealSize, 0, 0, tileRealSize, tileRealSize);
			context.drawImage(images[1], 0, 0, tileRealSize, tileRealSize, tileRealSize, 0, tileRealSize, tileRealSize);
			context.drawImage(images[2], 0, 0, tileRealSize, tileRealSize, 0, tileRealSize, tileRealSize, tileRealSize);
			context.drawImage(images[3], 0, 0, tileRealSize, tileRealSize, tileRealSize, tileRealSize, tileRealSize, tileRealSize);
		} else if (images.length == 1) {
			context.drawImage(images[0], 0, 0, tileRealSize * 2, tileRealSize * 2, 0, 0, tileRealSize * 2, tileRealSize * 2);
		} else {
			console.error('Number of child images for before or after image should be 1 or 4')
		}
	}

}

//trigger zoom
$(document).on('taskpresenter:imageready', function(){
	//apply zoom for desktop view
	parallelZoom.zoomBeforeAfter({
		beforeImageContainer: $('.desktop-view .img-before-div')[0],
		afterImageContainer: $('.desktop-view .img-after-div')[0],
		cleanPreviousContent: function(imageContainer) {
			//before image
			$(imageContainer).find('img.img-before').remove();	
			//after image
			$(imageContainer).find('.row').remove();	
		}
	});

	//apply zoom for mobile view
	parallelZoom.zoomBeforeAfter({
		beforeImageContainer: $('.tablet-mobile-view #before-tab .padd-00')[0],
		afterImageContainer: $('.tablet-mobile-view #after-tab .padd-00')[0],
		cleanPreviousContent: function(imageContainer) {
			//before image
			$(imageContainer).find('img.img-before').remove();	
			//after image
			$(imageContainer).find('.row').remove();	
		}	
	});
});

})();

