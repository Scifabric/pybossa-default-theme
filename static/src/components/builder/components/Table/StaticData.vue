<template>
  <div class="row">
    <v-client-table
      ref="staticDataTable"
      :data="data"
      :columns="columns"
      :options="options"
      name="staticDataTable"
    >
      <div slot="afterTable">
        <button
          class="btn btn-sm btn-default pull-right"
          @click="addDataListItem"
        >
          Add Row
        </button>
      </div>
      <template
        v-for="(c, i) in form.columns"
        :slot="c.id"
        slot-scope="props"
        class="col-md-12"
      >
        <div
          v-if="c.component === 'plain-text'"
          :key="i"
          class=""
        >
          <input
            id="table-name"
            :value="props.row[c.id]"
            class="form-control form-control-sm"
            type="text"
            @input="updateDataListItem(props.row, c.id, $event.target.value)"
          >
        </div>
        <div
          v-else
          :key="i"
        >
          Answer Column
        </div>
      </template>
      <template
        slot="hide-delete"
        slot-scope="props"
      >
        <button
          class="btn btn-link fa fa-times"
          @click="deleteDataListItem(props.row.id)"
        />
      </template>
    </v-client-table>
  </div>
</template>
<style></style>

<script>
import Vue from 'vue';
import * as types from '../../store/types';
import { ClientTable } from 'vue-tables-2';

import { mapGetters, mapMutations } from 'vuex';
Vue.use(ClientTable, {});
export default {
  name: 'TableCreator',
  data () {
    return {
      row: {
        type: Object,
        default: {}
      }
    };
  },
  computed: {
    ...mapGetters({
      form: types.GET_TABLE_PROPS,
      data: types.GET_TABLE_DATA_LIST
    }),
    options: {
      get () {
        const options = { headings: { ...this.form.options.headings, 'hide-delete': 'Delete' } };
        options.filterByColumn = false;
        options.filterable = [];
        options.sortable = [];
        options.texts = { filter: '', count: '' };

        return options;
      }
    },
    columns: {
      get () {
        return [...['hide-delete'], ...this.form.columns.map(col => col.id)];
      }
    }
  },
  methods: {
    ...mapMutations({
      'addDataListItem': types.MUTATE_TABLE_ADD_DATA_ROW,
      'deleteDataListItem': types.MUTATE_TABLE_DELETE_DATA_ROW
    }),

    updateDataListItem: function (row, fieldName, value) {
      const newRow = { ...row };
      newRow[fieldName] = value;
      this.$store.commit(types.MUTATE_TABLE_UPDATE_DATA_ROW, newRow);
    }
  }
};
</script>
