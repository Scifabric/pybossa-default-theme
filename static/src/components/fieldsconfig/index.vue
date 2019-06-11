<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <h3> Answer Field Configuration </h3>
      <div
        class="form-group"
        :class="{'has-error': error}"
      >
        <div class="row">
          <div class="col-md-5">
            <p> Type of answer </p>
            <select
              v-model="fieldType"
              name="field-type"
              class="form-control"
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
          <div class="col-md-7  pull-right">
            <p> Answer field path: </p>
            <input
              v-model="fieldName"
              type="text"
              class="form-control"
              :title="message1"
            >
          </div>
        </div>
        <div class="checkbox">
          <label :title="message2">
            <input
              v-model="retryForConsensus"
              type="checkbox"
            >
            Retry: Add redundancy if answers do not reach consensus.
          </label>
        </div>
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
        >{{ error }}</span>
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
      <button
        :disabled="hasRetryFields && !hasConsensusConfig"
        class="btn btn-primary"
        @click="save"
      >
        Save
      </button>
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
      message2: 'Consensus configuration must be filled out to enable retry feature'
    };
  },

  computed: {
    ...mapGetters(['answerFields', 'csrfToken', 'isNewField', 'hasConsensusConfig', 'hasRetryFields', 'showWarning'])
  },

  methods: {
    ...mapMutations(['addField']),

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
          const data = await res.json();
          window.pybossaNotify(data.flash, true, data.status);
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
  width: flex;
  max-height: 300px;
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
</style>
