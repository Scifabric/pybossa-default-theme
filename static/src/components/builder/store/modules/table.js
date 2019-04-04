import * as types from '../types';
import utils from '../../utils';

export const getColumnObject = id => {
  return {
    name: '',
    header: '',
    component: 'plain-text',
    id: `Column ${id}`,
    isDirty: false
  };
};

export const initialState = () => {
  const firstElement = getColumnObject(1);
  const columnsListObj = { [firstElement.id]: firstElement };
  return {
    id: utils.uniqueID(),
    name: { value: '', isDirty: false },
    data: { value: '', isVariable: true, isDirty: false },
    columnKeys: [firstElement.id],
    columnsListObj,
    dataRowKeys: [],
    dataRowObj: {},
    colCounter: 1
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_TABLE_PROPS]: state => {
    const options = {
      headings: {}
    };
    const columns = state.columnKeys.map(id => (state.columnsListObj[id]));

    columns.forEach(col => {
      options.headings[col.name] = col.header ? col.header : col.name;
    });

    const list = state.dataRowKeys.map(id => {
      const row = {};
      columns.forEach(col => {
        row[col.name] = state.dataRowObj[id][col.id];
      });
      return row;
    });

    const data = { ...state.data, list };
    const name = state.name.value;
    return { name, data, options, columns };
  },
  [types.GET_TABLE_COLUMNS_LIST]: state => {
    return state.columnKeys.map(id => (state.columnsListObj[id]));
  },

  [types.GET_TABLE_DATA_LIST]: state => {
    return state.dataRowKeys.map(id => (state.dataRowObj[id]));
  },

  [types.GET_TABLE_FORM_VALID]: state => {
    /* Determine if Table Props are completed and valid */

    /// Split
    const columns = state.columnKeys.map(id2 => (state.columnsListObj[id2]));
    const anyColumnNameEmpty =
        columns.filter(c => c.name === '').length > 0;
    const anyDirtyEmptyColumn =
        columns.filter(c => c.name === '' && c.isDirty).length > 0;
    const isAnswerFieldDirty =
        (state.name.value === '' && state.isVariable) ||
        (state.name.value === '' && state.name.isDirty);
    const anyDirtyColumn = columns.filter(c => c.isDirty).length > 0;
    const isFormUntouched = !state.name.isDirty && !anyDirtyColumn;
    const anyColumnComponent =
        columns.filter(col => col.component !== 'plain-text').length > 0;
    const repeatedColName =
        columns.length !==
        [...new Set(columns.map(c => c.name))].length;
    const isDataNameEmptyAndRequired =
        state.data.isVariable && state.data.value === '';
    const isAnswerFieldRequired = anyColumnComponent && state.name.value === '';

    return !(isFormUntouched ||
      isDataNameEmptyAndRequired ||
      isAnswerFieldRequired ||
      anyColumnNameEmpty ||
      isAnswerFieldDirty ||
      anyDirtyEmptyColumn ||
      repeatedColName);
  }
};

export const mutations = {

  [types.MUTATE_TABLE_NAME]: (state, payload) => {
    state.name = payload;
  },
  [types.MUTATE_TABLE_DATA]: (state, payload) => {
    state.data.value = payload.value;
    state.data.isVariable = payload.isVariable;
  },
  [types.MUTATE_TABLE_UPDATE_COLUMN]: (state, payload) => {
    state.columnsListObj[payload.id] = payload;
  },
  [types.MUTATE_TABLE_DELETE_COLUMN]: (state, id) => {
    delete state.columnsListObj[id];
    state.columnKeys = state.columnKeys.filter(i => i !== id);
  },
  [types.MUTATE_TABLE_ADD_COLUMN]: (state) => {
    state.colCounter++;
    const newObj = getColumnObject(state.colCounter);
    state.columnKeys.push(newObj.id);
    state.columnsListObj = { ...state.columnsListObj, [newObj.id]: newObj };
  },
  [types.MUTATE_TABLE_UPDATE_DATA_ROW]: (state, payload) => {
    state.dataRowObj[payload.id] = payload;
  },
  [types.MUTATE_TABLE_ADD_DATA_ROW]: (state) => {
    const id = utils.uniqueID();
    state.dataRowKeys.push(id);
    const row = { };
    const columns = state.columnKeys.map(id => (state.columnsListObj[id]));
    columns.forEach(function (col) {
      row[col.id] = '';
    });
    row.id = id;
    state.dataRowObj = { ...state.dataRowObj, [id]: row };
  },

  [types.MUTATE_TABLE_DELETE_DATA_ROW]: (state, id) => {
    delete state.dataRowObj[id];
    state.dataRowKeys = state.dataRowKeys.filter(i => i !== id);
  },

  [types.MUTATE_CLEAR_TABLE_FORM]: (state) => {
    const initial = initialState();
    Object.keys(initial).forEach(key => {
      state[key] = initial[key];
    });
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
