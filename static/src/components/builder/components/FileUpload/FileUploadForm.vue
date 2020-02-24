<template>
  <div class="row">
    <h4>File Upload Settings</h4>

    <div class="row">
      <form>
        <div class="form-row">
          <div class="form-group col-md-12">
            <input
              id="add-label"
              :checked="labelAdded"
              type="checkbox"
              @input="updateLabelAdded($event.target.checked)"
            >
            <label for="add-label">
              Add Label
            </label>
            <input
              v-if="labelAdded"
              id="component-label"
              :value="label"
              class="form-control form-control-sm"
              type="text"
              @input="updateLabel($event.target.value)"
            >
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-12">
            <label
              for="pyb-answer"
              class="col-labels"
            >
              Answer field name | <span class="label-tip">The field where the worker's answer is stored. Must have a suffix '__upload_url' (e.g filenameans1__upload_url)</span>
            </label>
            <input
              id="pyb-answer"
              :value="pybanswer"
              :class="{'danger-validation': getErrors('pybanswer')}"
              class="form-control form-control-sm"
              type="text"
              @input="updatePybanswer($event.target.value)"
            >
            <div class="danger-validation-text">
              {{ getErrors('pybanswer') }}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-12">
            <label
              for="filename"
              class="col-labels"
            >
              File name | <span class="label-tip">Optional - The new file name that will overwrite the current file name of the file uploaded.</span>
            </label>
            <input
              id="filename"
              :value="fileName"
              class="form-control form-control-sm"
              type="text"
              @input="updateFileName($event.target.value)"
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import '../../../../../css/component_builder.css';
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'FileUploadForm',
  computed: {
    ...mapState({
      label: state => state.fileUpload.label,
      labelAdded: state => state.fileUpload.labelAdded,
      pybanswer: state => state.fileUpload.pybanswer,
      fileName: state => state.fileUpload.fileName
    })
  },
  methods: {
    ...mapMutations({
      'updateLabel': types.MUTATE_FILE_UPLOAD_LABEL,
      'updateLabelAdded': types.MUTATE_FILE_UPLOAD_LABEL_ADDED,
      'updatePybanswer': types.MUTATE_FILE_UPLOAD_PYB_ANSWER,
      'updateFileName': types.MUTATE_FILE_UPLOAD_FILE_NAME
    }),
    getErrors (key) {
      const errors = this.$store.getters[types.GET_FILE_UPLOAD_ERRORS];
      return (errors[key] || []).join('\n');
    }
  }
};
</script>
