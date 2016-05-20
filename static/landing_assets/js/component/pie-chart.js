$(function(){
    
    var ua = navigator.userAgent.toLowerCase(),
    isAndroid = ua.indexOf("android") > -1;
    
    if (jQuery.browser.mobile === false && !isAndroid){
        $('.pie-chart-item').one('inview', function(isInView){
            if (isInView){
                easyPieChart();
            }
        });
    }
    else{
        easyPieChart();
    }
    
    function easyPieChart(){
        $('.pie-chart').easyPieChart({
            scaleColor: false,
            lineCap: 'butt',
            lineWidth: 10,
            size: 210,
            animate: 3000,
            easing: 'easeOutBounce',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent) + '%');
            }
        });
    }
});