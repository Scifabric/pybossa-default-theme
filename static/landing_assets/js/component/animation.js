$(function(){
    
    var ua = navigator.userAgent.toLowerCase(),
    isAndroid = ua.indexOf("android") > -1;
                
    // Only animate elements when using non-mobile devices    
    if (jQuery.browser.mobile === false && !isAndroid) 
    {
        /*---------------------------------------*/
        /*  BAR CHART
        /*---------------------------------------*/
        $('.bar-chart').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated flipInX delayp1').css('opacity', 1);}
        });
        
        
        /*---------------------------------------*/
        /*  CONTENT BOXES
        /*---------------------------------------*/
        $('.content-boxes').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated flipInY delayp1').css('opacity', 1);}
        });
        
        
        /*---------------------------------------*/
        /*  COUNTERS
        /*---------------------------------------*/
        $('.counter-item').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated fadeInUp delayp1').css('opacity', 1);}
        });
        
        
        /*---------------------------------------*/
        /*  FUNNY BOXES
        /*---------------------------------------*/
        $('.funny-boxes-text').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated flipInY delayp1').css('opacity', 1);}
        });
        
        
        /*---------------------------------------*/
        /*  PIE CHART
        /*---------------------------------------*/
        $('.pie-chart-item').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated flipInX delayp1').css('opacity', 1);}
        });
        
        
        /*---------------------------------------*/
        /*  PORTFOLIO
        /*---------------------------------------*/
        /*$('.portfolio-item').find('.inner-content').each(function(i){            
            var element = $(this),
            itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 50 : $(this).data('animation-delay'));
            element.css('opacity', 0).one('inview', function(isInView) {
                if (isInView){
                    setTimeout(function(){
                        element.addClass('animated bounceIn').css('opacity', 1);
                    } , itemsDelay * i);
                }
            });
        });*/
        
        
        /*---------------------------------------*/
        /*  PRICING TABLES
        /*---------------------------------------*/
        $('.pricing-table').each(function(){
            var pricingWrapper = $(this).find('.pricing-wrapper');
            
            pricingWrapper.each(function(i){
                var element = $(this),
                itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 15 : $(this).data('animation-delay'));
                element.css('opacity', 0).one('inview', function(isInView) {
                    if (isInView){
                        setTimeout(function(){
                            element.addClass('animated bounceInUp').css('opacity', 1);
                        } , itemsDelay * (i * 2));
                    }
                }); 
            });
        });
        
        $('.pricing-table').find('.pricing-wrapper').each(function(i){            
            var element = $(this),
            itemsDelay   = ( isNaN($(this).data('animation-delay')) ? 15 : $(this).data('animation-delay'));
            element.css('opacity', 0).one('inview', function(isInView) {
                if (isInView){
                    setTimeout(function(){
                        element.addClass('animated bounceInUp').css('opacity', 1);
                    } , itemsDelay * (i * 2));
                }
            });
        });
        
        
        /*---------------------------------------*/
        /*  TIMELINE
        /*---------------------------------------*/
        $('.timeline').find('.timeline-panel').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated fadeInLeft').css('opacity', 1);}
        });

        $('.timeline > .timeline-inverted > .timeline-panel').css('opacity', 0).one('inview', function(isInView){
            if (isInView) {$(this).addClass('animated fadeInRight').css('opacity', 1);}
        });
    }
});