<template>
  <div class="row">
    <table-element
      :data="form.data"
      :columns="columns"
      :name="form.name"
      :options="form.options"
      :column-id="form.columnId"
      :row-object="form.rowObject"
      :enable-add-rows="form.enableAddRows"
      :add-button-after-table="form.addButtonAfterTable"
      :add-button-before-table="form.addButtonBeforeTable"
    >
      <template
        v-for="(c, i) in form.columns"
        :slot="c.name"
        slot-scope="props"
        class="form-group col-md-12"
      >
        <ComponentColumns
          v-if="c.component !== 'plain-text'"
          :key="i"
          :selected-component="c.component"
          :form="{
            row: props.row,
            'pyb-table-answer': props.row,
            'initial-value': false
          }"
        />
        <div
          v-else
          :key="i"
        >
          {{ props.row[c.name] }}
        </div>
      </template>
    </table-element>
  </div>
</template>

<script>

import components from '@dtwebservices/task-presenter-components';
import ComponentColumns from './ComponentColumns.vue';
export default {
  name: 'TableCreator',
  components: { ...components, ComponentColumns },
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    };
  },
  computed: {
    columns () {
      return this.form.columns.map(col => col.name);
    }
  }
};
</script>
