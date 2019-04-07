<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="row">
          <div class="col-md-12">
            <h4>Columns Settings</h4>
            <span />
          </div>
        </div>
        <div class="scroll col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div
                v-for="(col, index) in columns"
                :key="index"
                class="row"
                name="columns"
              >
                <hr
                  v-if="index != 0"
                  size="100px"
                >
                <label> {{ col.id }}</label>
                <button
                  v-if="columns.length > 1"
                  :id="`delete-column-${index}`"
                  class="btn btn-times-delete pull-right fa fa-times"
                  @click="removeColumn(col.id)"
                /><br>
                <label class="col-lables">
                  * Column Name
                </label>
                <input
                  :id="`column-name-${index}`"
                  :value="col.name"
                  :class="{
                    'form-control form-control-sm': true,
                    'danger-validation': invalidColumn(col)
                  }"
                  name="name"
                  type="text"
                  @blur="updateColumn(col)"
                  @input="updateColumn(col, 'name', $event.target.value)"
                >
                <p v-if="col.name === '' && col.isDirty">
                  This field is required!
                </p>
                <label class="col-lables">
                  Column Heading
                </label>
                <input
                  :id="`column-header-${index}`"
                  :value="col.header"
                  class="form-control form-control-sm"
                  type="text"
                  @blur="updateColumn(col)"
                  @input="updateColumn(col, 'header', $event.target.value)"
                >
                <label class="col-lables">
                  Column Display
                </label>
                <select
                  :id="`column-component-${index}`"
                  :value="col.component"
                  class="form-control form-control-sm"
                  @blur="updateColumn(col)"
                  @input="updateColumn(col, 'component', $event.target.value)"
                >
                  <option
                    v-for="component in columnsComponent"
                    :key="component"
                    :value="component"
                  >
                    {{ component }}
                  </option>
                </select>
              </div>
              <br>
            </div>
          </div>
        </div>
        <div class="col-sm-10 col-md-11" />
        <button
          id="addButton"
          class="btn btn-default btn-sm col-sm-2 col-md-1"
          @click="addColumn"
        >
          Add
        </button>
        <div class="row">
          <div class="col-md-12">
            <hr>
            <h4>Table Settings</h4>
            <div
              v-if="columnWithComponent"
              class="form-group"
            >
              <label for="add-label">
                * Table Answer field Name
              </label>
              <input
                id="table-answer-name"
                :value="name.value"
                :class="{
                  'form-control form-control-sm': true,
                  'danger-validation': name.value === ''
                }"
                type="text"
                @input="updateName({value: $event.target.value})"
                @blur="updateName"
              >
              <p v-if="name.value === '' && name.isDirty">
                This field is required!
              </p>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <label>Data</label><br>
                <input
                  id="dynamic"
                  :checked="data.isVariable"
                  type="radio"
                  @change="updateData({value: data.value, isVariable: $event.target.value})"
                >
                <label
                  class="col-lables right-padding-radio"
                  for="dynamic"
                >
                  Get table data from source
                </label>
                <input
                  id="static"
                  :checked="!data.isVariable"
                  type="radio"
                  @change="updateData({value: data.value, isVariable: false})"
                >
                <label
                  class="col-lables"
                  for="static"
                >
                  Enter table data manually
                </label>
              </div>
            </div>
            <label
              v-if="data.isVariable"
              class="col-form-label-md pull-left"
            >
              * Field Data Source Name
            </label>
            <label
              v-if="!data.isVariable"
              class="col-form-label-md"
            >
              Add Table Data
            </label>
            <input
              v-show="data.isVariable"
              id="data-source-name"
              :value="data.value"
              type="text"
              :class="{
                'form-control form-control-sm': true,
                'danger-validation': data.value === '' && data.isDirty
              }"
              @blur="updateData"
              @input="updateData({value: $event.target.value, isVariable: data.isVariable})"
            >
            <p v-if="data.isVariable && data.value === '' && data.isDirty ">
              This field is required!
            </p>
            <br>
          </div>
        </div>
        <div class="col-md-12">
          <static-data
            v-if="!data.isVariable"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.col-lables {
  color: black;
  font-size: 16px;
  font-weight: 400;
}

.btn-times-delete {
  color: #d9534f;
}
.btn-times-delete:hover {
  color: #d9534f;
}
.danger-validation {
  border-color: #d9534f;
}
.scroll {
  width: flex;
  max-height: 300px;
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.right-padding-radio {
  padding-right: 10px;
}
</style>

<script>
import Vue from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';
import StaticData from './StaticData.vue';
import * as types from '../../store/types';
import { ClientTable } from 'vue-tables-2';

Vue.use(ClientTable, {});

export default {
  name: 'TableForms',
  components: { StaticData },
  data () {
    return {
      columnsComponent: ['plain-text', 'text-input', 'checkbox-input']
    };
  },
  computed: {
    ...mapGetters({
      columns: types.GET_TABLE_COLUMNS_LIST
    }),
    ...mapState({
      name: (state) => state.table.name,
      data: (state) => state.table.data
    }),

    columnWithComponent: {
      get () {
        return (
          this.columns.filter(col => col.component !== 'plain-text').length > 0
        );
      }
    }
  },
  updated () {
    this.scrollToEnd();
  },
  methods: {
    ...mapMutations({
      'updateName': types.MUTATE_TABLE_NAME,
      'updateData': types.MUTATE_TABLE_DATA,
      'addColumn': types.MUTATE_TABLE_ADD_COLUMN,
      'removeColumn': types.MUTATE_TABLE_DELETE_COLUMN
    }),
    updateColumn (column, fieldName, value) {
      const newColumn = { ...column };
      if (fieldName) {
        newColumn[fieldName] = value;
      }
      newColumn.isDirty = true;
      this.$store.commit(types.MUTATE_TABLE_UPDATE_COLUMN, newColumn);
      this.scrollToEnd();
    },
    scrollToEnd () {
      var container = document.querySelector('.scroll');
      if (container) {
        var scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      }
    },

    invalidColumn: function (col) {
      const cols = this.columns.filter(c => c.name === col.name);
      return (
        cols.length > 1 ||
        (this.columns.length > 1 && col.name === '') ||
        (col.name === '' && col.isDirty)
      );
    }
  }
};
</script>
