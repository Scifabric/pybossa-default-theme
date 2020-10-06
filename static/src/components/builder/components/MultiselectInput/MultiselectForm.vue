<template>
  <div class="row">
    <h4>Multiselect Settings</h4>
    <div class="form-group">
      <input
        id="add-label"
        v-model="labelAdded"
        type="checkbox"
      >
      <label for="add-label">
        Add Multiselect Label
      </label>
      <input
        v-if="labelAdded === true"
        v-model="label"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <label
      class="block-label"
    >
      Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
      <input
        id="pyb-answer"
        v-model="pybAnswer"
        class="form-control form-control-sm"
        type="text"
      >
    </label>
    <validator
      :validations="validations"
      :validation-options="filteredValidations"
      :update-validations="updateValidations"
    />
    <div class="form-group">
      <label
        class="col-labels"
        for="initial-value"
      >
        Initial Value | <span class="label-tip">Must be one of the configured multiselect values.</span>
      </label>
      <select
        v-model="initialValue"
        class="form-control form-control-sm"
      >
        <option selected />
        <option
          v-for="value in values"
          :key="value"
        >
          {{ value }}
        </option>
      </select>
    </div>
    <hr>
    <h4>
      Choices
    </h4>
    <div
      id="choices"
      class="scroll"
    >
      <div
        v-for="(choice, index) in choiceList"
        :key="index"
      >
        <hr
          v-if="index != 0"
          size="100px"
        >
        <label>Choice {{ index + 1 }}</label>
        <button
          v-if="choiceList.length > 1"
          :title="`Delete Choice ${index + 1}`"
          class="btn btn-times-delete pull-right fa fa-times"
          @click="deleteChoice(index)"
        /><br>
        <label
          class="block-label"
        >
          Value | <span class="label-tip">The value to store as the answer when selected.</span>
          <input
            id="value"
            class="form-control form-control-sm"
            type="text"
            :value="choice.value"
            :class="{'danger-validation':getErrors(`choiceList[${index}].value`)}"
            @input="updateChoice(choice, index, 'value', $event.target.value)"
          >
        </label>
        <div class="danger-validation-text">
          {{ getErrors(`choiceList[${index}].value`) }}
        </div>
        <label
          class="block-label"
        >
          Display | <span class="label-tip">Text to display for the choice. Uses value if not specified.</span>
          <input
            :value="choice.display"
            class="form-control form-control-sm"
            type="text"
            @input="updateChoice(choice, index, 'display', $event.target.value)"
          >
        </label>
      </div>
    </div>
    <div class="col-sm-10 col-md-11" />
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addChoice"
    >
      Add
    </button>
  </div>
</template>
<style scoped>
.danger-validation-text {
  color: #d9534f;
  margin-bottom: 10px;
}
</style>
<script>
import '../../../../../css/component_builder.css';
import { mapMutations, mapState } from 'vuex';
import Validator from '../validator';
import * as types from '../../store/types';
import { cloneDeep, chain } from 'lodash';

function scrollToEnd (selector) {
  const container = document.querySelector(selector);
  if (container) {
    const scrollHeight = container.scrollHeight;
    container.scrollTop = scrollHeight;
  }
}

export default {
  name: 'MultiselectInputForm',
  components: { Validator },
  data () {
    return {
      validationOptions: ['required'],
      scrollToEndSelectors: []
    };
  },
  computed: {
    filteredValidations: function () {
      // when no filters applied
      return this.validationOptions.map((e) => { return { name: e }; });
    },
    values () {
      return chain(this.choiceList).map('value').filter().uniq().value();
    },
    pybAnswer: {
      get () {
        return this.$store.state.multiselectInput.pybAnswer;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_MULTISELECT_ANSWER_FIELD, newValue);
      }
    },
    labelAdded: {
      get () {
        return this.$store.state.multiselectInput.labelAdded;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_MULTISELECT_LABEL_ADDED, newValue);
      }
    },
    label: {
      get () {
        return this.$store.state.multiselectInput.label;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_MULTISELECT_LABEL, newValue);
      }
    },
    initialValue: {
      get () {
        return this.$store.state.multiselectInput.initialValue;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_MULTISELECT_INITIAL_VALUE, newValue);
      }
    },
    ...mapState({
      choiceList: state => state.multiselectInput.choiceList,
      validations: state => state.multiselectInput.validations
    })
  },
  updated () {
    this.scrollToEndSelectors.forEach(scrollToEnd);
    this.scrollToEndSelectors = [];
  },
  methods: {
    ...mapMutations({
      'deleteChoice': types.MUTATE_MULTISELECT_DELETE_CHOICE,
      'updateValidations': types.MUTATE_MULTISELECT_VALIDATIONS
    }),
    addChoice () {
      this.$store.commit(types.MUTATE_MULTISELECT_ADD_CHOICE);
      this.scrollToEndSelectors.push('#choices');
    },
    getErrors (key) {
      return (this.$store.getters[types.GET_MULTISELECT_INPUT_ERRORS][key] || []).join('\n');
    },
    updateChoice (choice, index, fieldName, value) {
      const newChoice = cloneDeep(choice);
      newChoice[fieldName] = value;
      this.$store.commit(types.MUTATE_MULTISELECT_UPDATE_CHOICE, { choice: newChoice, index });
    }
  }
};
</script>
