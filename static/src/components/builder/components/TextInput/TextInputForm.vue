<template>
  <div class="row">
    <h4>Text Input Settings</h4>

    <div class="col-md-12">
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
              <label class="col-form-label-sm">
                Input Type
              </label>
              <select
                class="form-control form-control-sm"
                :value="type"
                @input="updateType($event.target.value)"
              >
                <option
                  v-for="(v, k) in inputTypeOptions"
                  :key="k"
                  :value="v"
                >
                  {{ k }}
                </option>
              </select>
            </div>
          </div>

          <validator
            :validations="validations"
            :validationOptions="filteredValidations"
            :updateValidations="updateValidations"
          />

          <div class="form-row">
            <div class="form-group col-md-12">
              <label
                for="pyb-answer"
                class="col-form-label-sm"
              >
                Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
              </label>
              <input
                id="pyb-answer"
                :value="pybanwer"
                class="form-control form-control-sm"
                type="text"
                @input="updatePybanswer($event.target.value)"
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Validator from '../validator'
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'TextInputForm',
  components: { Validator },
    data () {
    return {
      validationOptions: ['required', 'email', 'number', 'url'],
      inputTypeOptions: {
        Text: 'text',
        Number: 'number',
        Date: 'date',
        Time: 'time',
        Email: 'email',
        URL: 'url'
      }
    };
  },
  computed: {
    filteredValidations: function () {
      if (this.type === 'text') {
        return this.validationOptions.map((e) => { return { name: e }; });
      } else if (this.validationOptions.includes(this.type)) {
        return [{ name: this.type }, { name: 'required' }];
      }
      return [{ name: 'required' }];
    },
    ...mapState({
      label: state => state.textInput.label,
      labelAdded: state => state.textInput.labelAdded,
      type: state => state.textInput.type,
      pybanwer: state => state.textInput['pyb-answer'],
      validations: state => state.textInput.validations
    })
  },
  methods: {
    ...mapMutations({
      'updateLabel': types.MUTATE_TEXT_INPUT_LABEL,
      'updateLabelAdded': types.MUTATE_TEXT_INPUT_LABEL_ADDED,
      'updateType': types.MUTATE_TEXT_INPUT_TYPE,
      'updatePybanswer': types.MUTATE_TEXT_INPUT_PYB_ANSWER,
      'updateValidations': types.MUTATE_TEXT_INPUT_VALIDATIONS
    })
  }
};
</script>
