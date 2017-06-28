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
      <button class="btn btn-primary">Update blogpost</button>
    </div>
</template>
<script>
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
      data: {project_id: 580,
             title: '',
             body: 'body'}
    }
  },
  methods: {
    imageuploaded(res) {
      this.src = res.media_url;
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
</style>
