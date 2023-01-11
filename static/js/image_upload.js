// onImageUpload callback

const TaskPresenterImageUploader = {

    uploadImages: (files, short_name) => {
        let data = {"files": files}
        console.log("uploadImages request", data)

        res = $.ajax({
            type: 'POST',
            url: '/project/' + short_name + "/tasks/taskpresenterimageupload",
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(data)
        });
        console.log("uploadImages response", res)
        return res
    }
}
