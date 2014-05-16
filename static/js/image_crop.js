(function(global){

    global = global || {};
    // Preview image before uploading
    function _previewImage(){
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("avatar").files[0]);
        
        oFReader.onload = function (oFREvent) {
            document.getElementById("uploadPreview").src = oFREvent.target.result;
            var img = document.getElementById('uploadPreview'); 
            //or however you get a handle to the IMG
            var width = img.clientWidth;
            var height = img.clientHeight;
            if (width > height) {
                width = height - 100;
            }
            else {
                height = width - 100;
            }

            jQuery(function($) {
                $('#uploadPreview').Jcrop({
                    onSelect:    _updateCoords,
                    onChange:    _updateCoords,
                    bgColor:     'black',
                    bgOpacity:   .4,
                    minSize: [100, 100],
                    setSelect:   [  0, 
                                    0, 
                                    (width / 2), 
                                    (height/ 2)],
                    aspectRatio: 1,
                    boxWidth: 450

                });
            });
        };
    }

    function _updateCoords(c){
        $("#x1").val(Math.floor(c.x));
        $("#y1").val(Math.floor(c.y));
        $("#x2").val(Math.floor(c.x2));
        $("#y2").val(Math.floor(c.y2));
    }

    global.previewImage = _previewImage;

}(window));
