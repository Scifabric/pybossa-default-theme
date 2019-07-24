<template>
  <div class="stats-config row">
    <div class="col-md-12" style="width:85%">
      <div
        class="form-group"
        :class="{'has-error': error}"
      >
      <div class="form-group row">
        <div class="col-sm-4">
          <p> answer field name and type</p>
        </div>
        <div class="col-sm-4">
          <input
            :disabled="!editable"
            v-model="fieldName"
            type="text"
            class="form-control input-sm"
            id="answer-field"
            />
        </div>
          <div class="col-sm-4">
           <select
              v-model="fieldType"
              name="field-type"
              class="form-control input-sm"
              id="answer-field"
            >
              <option
                v-for="(conf, type, index) in labelTypes.config"
                :key="index"
                :value="type"
              >
                {{ conf.display }}
              </option>
            </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-4">
          <p> retry for consensus </p>
        </div>
        <div class="col-sm-4">
          <label class="switch">
            <input type="checkbox" :disabled="!editable" v-model="retryForConsensus">
            <span class="slider"></span>
         </label>
        </div>
        <div class="col-sm-4 pull-right">
          <button
            class="btn btn-sm btn-primary"
            :disabled="!fieldName"
            @click="_addField"
          >
            Add Field
          </button>
          <span
            v-if="error"
            class="help-block"
          >
          {{ error }}
          </span>
        </div>
      </div>
      </div>

      <div v-if="!Object.keys(answerFields).length">
        <p>No fields currently configured.</p>
      </div>
      <div
        v-else
        class="scroll"
      >
        <div
          v-for="(field, name) in answerFields"
          :key="name"
          class=""
        >
          <div class="col-md-12 card">
            <div class="thumbnail card-body">
              <component
                :is="labelTypes.config[field.type].component"
                :key="name"
                :name="name"
                :retry-for-consensus="answerFields[name]['retry_for_consensus']"
                :edit="isNewField(name)"
                :isEditable="editable"
                v-bind="field.config"
                :type="labelTypes.config[field.type].display"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showWarning"
        class="alert alert-danger"
      >
        <strong>Warning:</strong>
        changing or updating a field configuration will delete the associated
        performance statistics.
      </div>
      <div v-if="!editable">
        <button
        class="btn btn-sm btn-primary"
        @click="toggleEditable"
        >
        Edit
        </button>
      </div>
      <div v-else>
        <button
        class="btn btn-sm btn-primary"
        @click="save"
        >
        Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import FieldConfigBase from './field_config_base';
import CategoricalFieldConfig from './categorical_field_config';
import labelTypes from './labelTypes';

export default {

  components: {
    CategoricalFieldConfig,
    FieldConfigBase
  },

  data () {
    return {
      fieldName: '',
      fieldType: labelTypes.default,
      retryForConsensus: false,
      error: false,
      labelTypes,
      message1: 'This should match "pyb-answer" in your task presenter',
      message2: 'Consensus configuration must be filled out to enable retry feature',
      editable: false
    };
  },

  computed: {
    ...mapGetters(['answerFields', 'csrfToken', 'isNewField', 'hasConsensusConfig', 'hasRetryFields', 'showWarning'])
  },

  methods: {
    ...mapMutations(['addField']),

    toggleEditable: function () {
      this.editable = !this.editable;

    },
    _addField () {
      if (!this.fieldName) {
        this.error = 'Field Name is Required.';
        return;
      }
      this.addField({
        name: this.fieldName,
        type: this.fieldType,
        retryForConsensus: this.retryForConsensus,
        config: labelTypes.config[this.fieldType].defaultConfig(),
        newField: true
      });
      this.reset();
    },

    reset () {
      this.fieldName = '';
      this.fieldType = labelTypes.default;
      this.retryForConsensus = false;
    },

    async save () {
      try {
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 'answer_fields': this.answerFields })
        });
        if (res.ok) {
          // const data = await res.json();
          // window.pybossaNotify(data.flash, true, data.status);
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    }
  }
};

</script>
<style>
.field-config-wrapper {
    margin-bottom: 0.5em;
}
.scroll {
  overflow-x: hidden;
  max-height: 350px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
#answer-field {
  width: 100%
}
</style>
