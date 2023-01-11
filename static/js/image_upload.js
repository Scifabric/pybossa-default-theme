// onImageUpload callback

const TaskPresenterImageUploader = {

    uploadImages: (files, short_name, summernote) => {

        //TODO: check image sizes
        var fd = new FormData();

        Array.from(files).forEach(file => { fd.append("image", file) });
        $.ajax({
            type: 'POST',
            url: '/project/' + short_name + "/tasks/taskpresenterimageupload",
            data: fd,
            processData: false,
            contentType: false,
        }).done(response => {
            let image = $('<img>').attr('src', response.imgurls[0]);
            summernote.summernote("insertNode", image[0]);
        }).fail(response => {
            console.log("upload image failed. response:", response)
        })
    }
}
