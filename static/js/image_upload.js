// onImageUpload callback

const TaskPresenterImageUploader = {
    initialize: guidelines => {

        console.log("INITIALIZING IMAGE UPLOADER");

        guidelines.on('summernote.image.upload', (e, f) => {
            console.log("INSERTING IMAGE 1")
            editor.summernote('insertNode', imgNode);
        });

        guidelines.on("summernote.change", e => {
            console.log("CHANGED!!!")
        });
    }
}
