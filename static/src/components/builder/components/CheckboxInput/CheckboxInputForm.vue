<template>
  <div class="row">
    <h4>Checkbox Settings</h4>
    <input
      id="add-label"
      :checked="labelAdded"
      type="checkbox"
      @input="updateCheckboxLabelAdded($event.target.checked)"
    >
    <label for="add-label">
      Add Checkbox Group Label
    </label>
    <input
      v-if="labelAdded === true"
      id="component-label"
      :value="label"
      class="form-control form-control-sm"
      type="text"
      @change="updateCheckboxLabel($event.target.value)"
    >
    <hr>
    <h4>
      Checkbox Group
    </h4>
    <div class="scroll col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="(checkbox, index) in checkboxList"
            :key="index"
            class="row"
            name="columns"
          >
            <hr
              v-if="index != 0"
              size="100px"
            >
            <label>Checkbox {{ index + 1 }}</label>
            <button
              v-if="checkboxList.length > 1"
              :id="`column-delete${index}`"
              class="btn btn-times-delete pull-right fa fa-times"
              @click="deleteCheckboxListItem(checkbox.id)"
            /><br>
            <label
              class="block-label"
            >
              Checkbox Description Label
              <input
                :value="checkbox.label"
                class="form-control form-control-sm"
                type="text"
                @input="updateCheckboxItem(checkbox, 'label', $event.target.value)"
              >
            </label>
            <label
              class="block-label"
            >
              Answer field name
              <input
                id="pyb-answer"
                :value="checkbox['pyb-answer']"
                class="form-control form-control-sm"
                type="text"
                @input="updateCheckboxItem(checkbox, 'pyb-answer', $event.target.value)"
              >
            </label>
            <label
              class="block-label"
            >
              Initial Value
              <select
                class="form-control form-control-sm"
                :value="checkbox['initial-value'].value"
                @input="updateCheckboxItem(checkbox, 'initial-value', {value: $event.target.value, isVariable:true})"
              >
                <option
                  v-for="e in booleanValues"
                  :key="e"
                  :value="e"
                >
                  {{ e }}
                </option>
              </select>
            </label>
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-10 col-md-11" />
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addCheckboxListItem"
    >
      Add
    </button>
  </div>
</template>
<style scoped>
.block-label {
  color: black;
  font-size: 16px;
  font-weight: 400;
  display: block;
}
.scroll {
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.btn-times-delete {
  color: #d9534f;
}
.btn-times-delete:hover {
  color: #d9534f;
}
</style>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import * as types from '../../store/types';
import { cloneDeep } from 'lodash';

export default {
  name: 'CheckboxInputForm',
  components: {},
  data () {
    return {
      booleanValues: [false, true] };
  },
  computed: {
    ...mapGetters({ 'checkboxList': types.GET_CHECKBOXLIST }),
    ...mapState({
      label: state => state.checkboxInput.label,
      labelAdded: state => state.checkboxInput.labelAdded
    })
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    ...mapMutations({
      'updateCheckboxLabel': types.MUTATE_CHECKBOX_LABEL,
      'updateCheckboxLabelAdded': types.MUTATE_CHECKBOX_LABEL_ADDED,
      'deleteCheckboxListItem': types.MUTATE_CHECKBOX_DELETE_LIST_ITEM,
      'addCheckboxListItem': types.MUTATE_CHECKBOX_ADD_LIST_ITEM
    }),
    updateCheckboxItem (checkbox, fieldName, value) {
      const newCheckbox = cloneDeep(checkbox);
      newCheckbox[fieldName] = value;
      this.$store.commit(types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM, newCheckbox);
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
