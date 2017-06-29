<template>
    <div>
     <div class="blogcover">
      <img class="img-responsive" :src="src" style="margin-bottom:5px;"/>
      <vue-core-image-upload
        class="btn btn-primary"
        :crop="false"
        inputOfFile='file'
        @imageuploaded="imageuploaded"
        :data="data"
        :max-file-size="5242880"
        text="Change cover"
        url="/api/blogpost" >
      </vue-core-image-upload>
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
import VueCoreImageUpload from 'vue-core-image-upload'
import { markdownEditor } from 'vue-simplemde'

export default {
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
    'markdown-editor': markdownEditor
  },
  data() {
    return {
      src: 'http://via.placeholder.com/500x375',
      blogpost_id: null,
      data: {project_id: 580,
             title: '',
             body: '',
             published: false
             }
    }
  },
  methods: {
    imageuploaded(res) {
      this.src = res.media_url
      this.data.title = res.title
      this.data.body = res.body
      this.blogpost_id = res.id
    },
    update(){
        axios.put(this.puturl, this.data).then(function(response){console.log(response)})
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
</style>
