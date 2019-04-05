import * as types from '../types';
import utils from '../../utils';

export const isAnyColumnNameEmpty = (columns) => {
  return columns.filter(c => c.name === '').length > 0;
};

export const isAnyDirtyEmptyColumn = (columns) => {
  return columns.filter(c => c.name === '' && c.isDirty).length > 0;
};

export const isAnswerFieldDirty = (state) => {
  return state.name.value === '' && state.name.isDirty;
};
export const isAnyDirtyColumn = (columns) => {
  return columns.filter(c => c.isDirty).length > 0;
};

export const isFormUntouched = (state, anyDirtyColumn) => {
  return !state.name.isDirty && !anyDirtyColumn;
};
export const isAnyColumnComponent = (columns) => {
  return columns.filter(col => col.component !== 'plain-text').length > 0;
};
export const isAnyColumnNameRepeated = (columns) => {
  return columns.length !==
  [...new Set(columns.map(c => c.name))].length;
};

export const isDataNameEmptyAndRequired = (state) => {
  return state.data.isVariable && state.data.value === '';
};

export const isAnswerFieldRequired = (state, anyColumnComponent) => {
  return anyColumnComponent && state.name.value === '';
};

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
    const columns = state.columnKeys.map(id2 => (state.columnsListObj[id2]));
    const anyDirtyColumn = isAnyDirtyColumn(columns);
    const anyColumnComponent = isAnyColumnComponent(columns);
    const dataNameEmptyAndRequired = isDataNameEmptyAndRequired(state);
    const anyColumnNameEmpty = isAnyColumnNameEmpty(columns);
    const anyDirtyEmptyColumn = isAnyDirtyEmptyColumn(columns);
    const answerFieldDirty = isAnswerFieldDirty(state);
    const formUntouched = isFormUntouched(state, anyDirtyColumn);
    const repeatedColName = isAnyColumnNameRepeated(columns);
    const answerFieldRequired = isAnswerFieldRequired(state, anyColumnComponent);

    return !(formUntouched ||
      dataNameEmptyAndRequired ||
      answerFieldRequired ||
      anyColumnNameEmpty ||
      answerFieldDirty ||
      anyDirtyEmptyColumn ||
      repeatedColName);
  }
};

export const mutations = {

  [types.MUTATE_TABLE_NAME]: (state, payload) => {
    const name = { value: '', isDirty: true };
    name.value = payload.value !== undefined ? payload.value : state.name.value;
    name.isDirty = true;

    state.name = name;
  },
  [types.MUTATE_TABLE_DATA]: (state, payload) => {
    state.data.value = payload.value !== undefined ? payload.value : state.data.value;
    state.data.isVariable = payload.isVariable !== undefined ? payload.isVariable : state.data.isVariable;
    state.data.isDirty = true;
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
