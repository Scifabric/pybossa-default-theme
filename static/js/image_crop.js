(function(global){

    global = global || {};
    // Preview image before uploading
    var MAX_FILE_SIZE = 2000000;

    function _previewImage(){
        var oFReader = new FileReader();
        var avatar = $("#avatar")
        var avatar_file = avatar[0].files[0];
        if (avatar_file.size > MAX_FILE_SIZE) {
            alert("This file is too large. Max size allowed is 2MB. Please, select another file.");
            avatar.replaceWith(avatar = avatar.clone(true));
            return;
        }
        oFReader.readAsDataURL(avatar_file);

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
