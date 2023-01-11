// onImageUpload callback

const TaskPresenterImageUploader = {

    uploadImages: (files, editor) => {
        let URL = '/project/'
        let short_name = "testproject"
        let data = {"files": files, "test": "hello"}
        console.log("uploadImages request", data)

        res = $.ajax({
            type: 'POST',
            url: URL + short_name + "/tasks/taskpresenterimageupload",
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(data)
        });
        console.log("uploadImages response", res)
        return res
    }
}
