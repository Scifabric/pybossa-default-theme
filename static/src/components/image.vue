<template>
    <div>


     <div>
            <div class="file-upload-form">
                Upload an image file:
                <input type="file" @change="previewImage" accept="image/*">
            </div>
            <div v-if="src.length > 0">
                <img id="cropit" class="preview" :src="src" v-on:load="cropIt">
            </div>
            <div v-else>
                <img class="preview" src="http://via.placeholder.com/500x375">
            </div>
        </div>

     <div class="blogcover">
      </div>
      <div class="form-group">
          <label for="title" class="control-label"><label for="title">Title</label></label>
          <input class="form-control" v-model="data.title" placeholder="Write a nice title" type="text">
      </div>
      <markdown-editor v-model="data.body"></markdown-editor/>
      <div class="action-btns">
        <button class="btn btn-warning" v-on:click="update">Save draft</button>
        <div v-if="canPublish">
          <button v-if="this.data.published" class="btn btn-primary" v-on:click="publish(false)">Unpublish</button>
          <button v-else class="btn btn-primary" v-on:click="publish(true)">Publish</button>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
//import VueCoreImageUpload from 'vue-core-image-upload'
import { markdownEditor } from 'vue-simplemde'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  components: {
 //   'vue-core-image-upload': VueCoreImageUpload,
    'markdown-editor': markdownEditor,
  },
  data() {
    return {
      src: '',
      blogpost_id: null,
      data: {project_id: 580,
             title: '',
             body: '',
             published: false
             }
    }
  },
  methods: {
      cropIt(){
          var self = this
          console.log("loaded and ready to crop")
          var image = document.getElementById('cropit');
          var cropper = new Cropper(image, {
            aspectRatio: 16 / 9,
            movable: false,
          });

            cropper.getCroppedCanvas();
            
            cropper.getCroppedCanvas({
              width: 160,
              height: 90,
              beforeDrawImage: function(canvas) {
                const context = canvas.getContext('2d');
            
                context.imageSmoothingEnabled = false;
                context.imageSmoothingQuality = 'high';
              },
            });


            var file_name = document.querySelector('input[type=file]').files[0].name.split(".")[0] + ".png"
            
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
            cropper.getCroppedCanvas().toBlob(function (blob) {
              var formData = new FormData();
            
              formData.append('file', blob, file_name)
              formData.append('project_id', self.data.project_id)
              formData.append('title', self.data.title)
              formData.append('body', self.data.body)
            
              // Use `jQuery.ajax` method
              axios.post('/api/blogpost', formData)
            });

      },
      previewImage: function(event) {
            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.src = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
        },

    imageuploaded(res) {
      if(res.media_url !== '' && res.media_url !== undefined) {
        this.src = res.media_url
      }
      this.data.title = res.title
      this.data.body = res.body
      this.blogpost_id = res.id
    },
    update(){
        var self = this
        if (this.src === 'http://via.placeholder.com/500x375') {
            axios.post(this.puturl, this.data).then(function(response){
                console.log(response)
                if (response.data.media_url !== '' && response.data.media_url !== null) {
                    self.src = response.data.media_url
                }
                self.data.title = response.data.title
                self.data.body = response.data.body
                self.blogpost_id = response.data.id

                })
        }
        else axios.put(this.puturl, this.data).then(function(response){console.log(response)})
    },
    publish(flag){
        this.data.published = flag
        axios.put(this.puturl, this.data).then(function(response){console.log(response)})
    }
  },
  computed: {
    puturl(){
        if (this.blogpost_id) return '/api/blogpost/' + this.blogpost_id
        else return '/api/blogpost'
    },
    canPublish(){
        if (this.data.title === '' || this.data.body === '') return false
        else return true
    }
  }
}
</script>
<style>
.blogcover {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.g-core-image-upload-btn {
    position: absolute !important;
}

.action-btns {
    display: flex;
    justify-content: space-between;
}

#cropit {
    max-width: 100%;
}
</style>
