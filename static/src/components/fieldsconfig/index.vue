<template>
  <div class="stats-config row">
    <div class="col-xs-12">
      <div class="form-inline">
        <div
          class="form-group"
          :class="{'has-error': error}"
        >
          <p> Path to answer field: </p>
          <input
            v-model="fieldName"
            type="text"
            class="form-control input-sm"
            placeholder="eg: Q1.ans1"
          >
          <p> Type of answer </p>
          <select
            v-model="fieldType"
            name="field-type"
            class="form-control input-sm"
          >
            <option
              v-for="(conf, type, index) in labelTypes.config"
              :key="index"
              :value="type"
            >
              {{ conf.display }}
            </option>
          </select>
          <br> </br>
          <input
            type="checkbox"
            v-model="retryForConsensus"
          >
          <label for="checkbox" display="inline"><p> retry to reach consensus on this field</p></label>
          <br></br>
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
      </div>
      <div v-if="!Object.keys(answerFields).length">
        <p>No fields currently configured.</p>
      </div>
      <div
        v-for="(field, name) in answerFields"
        v-else
        :key="name"
        class="field-config-wrapper"
      >
        <component
          :is="labelTypes.config[field.type].component"
          :key="name"
          :name="name"
          :edit="isNewField(name)"
          v-bind="field.config"
          :type="labelTypes.config[field.type].display"
        />
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
        console.log(JSON.stringify(this.answerFields))
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          // body: JSON.stringify({'answerFieldsConfig': this.answerFields})
          body: JSON.stringify(this.answerFields)
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data.flash)
          console.log(data.status)
          window.pybossaNotify(data.flash, true, data.status);
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
      } catch (error) {
        console.warn(error);
        console.log("an error occurred");
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    }
  }
};

</script>
<style>
.field-config-wrapper {
    margin-bottom: 0.5em
}
</style>
