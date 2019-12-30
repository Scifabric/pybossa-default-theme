<template>
  <div class="row">
    <h4>Radio Settings</h4>
    <div class="form-group">
      <input
        id="add-label"
        v-model="labelAdded"
        type="checkbox"
      >
      <label for="add-label">
        Add Radio Group Label
      </label>
      <input
        v-if="labelAdded === true"
        id="component-label"
        v-model="label"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        class="col-labels"
        for="pyb-answer"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored. Can be JSON path like a.b.c.</span>
      </label>
      <input
        id="pyb-answer"
        v-model="pybAnswer"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        class="col-labels"
        for="html-name"
      >
        HTML Name | <span class="label-tip">The unique name of the radio group on the page. Is needed to enforce single selection within the group.</span>
      </label>
      <input
        id="html-name"
        v-model="name"
        class="form-control form-control-sm"
        :class="{'danger-validation':getErrors(`name`)}"
        type="text"
      >
      <div class="danger-validation-text">
        {{ getErrors(`name`) }}
      </div>
    </div>
    <div class="form-group">
      <label
        class="col-labels"
        for="initial-value"
      >
        Initial Value | <span class="label-tip">Must be one of the configured radio values.</span>
      </label>
      <select
        id="initial-value"
        v-model="initialValue"
        class="form-control form-control-sm"
      >
        <option selected />
        <option
          v-for="value in values"
          :key="value"
          :value="value"
        >
          {{ value }}
        </option>
      </select>
    </div>
    <hr>
    <h4>
      Radio Group
    </h4>
    <div class="scroll col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="(radio, index) in radioList"
            :key="index"
            class="row"
            name="columns"
          >
            <hr
              v-if="index != 0"
              size="100px"
            >
            <label>Radio {{ index + 1 }}</label>
            <button
              v-if="radioList.length > 2"
              class="btn btn-times-delete pull-right fa fa-times"
              @click="deleteRadioListItem(index)"
            /><br>
            <label
              class="block-label"
            >
              Radio Description Label | <span class="label-tip">Text to display for the radio button.</span>
              <input
                :value="radio.label"
                class="form-control form-control-sm"
                type="text"
                @input="updateRadioItem(radio, index, 'label', $event.target.value)"
              >
            </label>
            <label
              class="block-label"
            >
              Value | <span class="label-tip">The value to store as the answer when selected.</span>
              <input
                id="value"
                class="form-control form-control-sm"
                type="text"
                :value="radio.value"
                :class="{'danger-validation':getErrors(`radioList[${index}].value`)}"
                @input="updateRadioItem(radio, index, 'value', $event.target.value)"
              >
            </label>
            <div class="danger-validation-text">
              {{ getErrors(`radioList[${index}].value`) }}
            </div>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-10 col-md-11" />
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addRadioListItem"
    >
      Add
    </button>
  </div>
</template>
<script>
import '../../../../../css/component_builder.css'
import { mapMutations, mapState } from 'vuex';
import * as types from '../../store/types';
import { cloneDeep, chain } from 'lodash';

export default {
  name: 'RadioInputForm',
  components: {},
  computed: {
    values () {
      return chain(this.radioList).map('value').filter().uniq().value();
    },
    pybAnswer: {
      get () {
        return this.$store.state.radioInput.pybAnswer;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_RADIO_GROUP_ANSWER_FIELD, newValue);
      }
    },
    labelAdded: {
      get () {
        return this.$store.state.radioInput.labelAdded;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_RADIO_GROUP_LABEL_ADDED, newValue);
      }
    },
    label: {
      get () {
        return this.$store.state.radioInput.label;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_RADIO_GROUP_LABEL, newValue);
      }
    },
    initialValue: {
      get () {
        return this.$store.state.radioInput.initialValue;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_RADIO_GROUP_INITIAL_VALUE, newValue);
      }
    },
    name: {
      get () {
        return this.$store.state.radioInput.name;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_RADIO_GROUP_NAME, newValue);
      }
    },
    ...mapState({
      radioList: state => state.radioInput.radioList
    })
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    ...mapMutations({
      'deleteRadioListItem': types.MUTATE_RADIO_GROUP_DELETE_LIST_ITEM,
      'addRadioListItem': types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM
    }),
    getErrors (key) {
      return (this.$store.getters[types.GET_RADIO_INPUT_ERRORS][key] || []).join('\n');
    },
    updateRadioItem (radio, index, fieldName, value) {
      const newRadio = cloneDeep(radio);
      newRadio[fieldName] = value;
      this.$store.commit(types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM, { radio: newRadio, index });
      this.scrollToEnd();
    },
    scrollToEnd () {
      const container = document.querySelector('.scroll');
      if (container) {
        const scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      }
    }
  }
};
</script>
