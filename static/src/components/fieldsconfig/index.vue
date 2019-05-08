<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div
        class="form-group"
        :class="{'has-error': error}"
      >
        <div class="row">
          <div class="col-md-7">
            <p> Path to answer field: </p>
            <input
              v-model="fieldName"
              type="text"
              class="form-control"
            >
          </div>
          <div class="col-md-5 pull-right">
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
        </div>

        <div class="checkbox">
          <label>
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
                :retry-for-consensus="answerFields[name].retryForConsensus"
                :edit="isNewField(name)"
                v-bind="field.config"
                :type="labelTypes.config[field.type].display"
              />
            </div>
          </div>
        </div>
      </div>
      <button
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
      labelTypes
    };
  },

  computed: {
    ...mapGetters(['answerFields', 'csrfToken', 'isNewField'])
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
          body: JSON.stringify({ 'answerFieldsConfig': this.answerFields })
        });
        if (res.ok) {
          const data = await res.json();
          window.pybossaNotify(data.flash, true, data.status);
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
      } catch (error) {
        console.warn(error);
        console.log('an error occurred');
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
