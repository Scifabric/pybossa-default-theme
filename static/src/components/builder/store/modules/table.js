import * as types from '../types';
import utils from '../../utils';
import { flow } from 'lodash';

function* _isAnyColumnNameEmpty (columns) {
  for (const [index, column] of columns.entries()) {
    if (column.name === '') {
      yield [`columns[${index}].name`, `${column.id} name is missing.`];
    }
  }
}

export const isAnyColumnNameEmpty = flow(_isAnyColumnNameEmpty, iteratorToBool);

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

function iteratorToBool (iterator) {
  const messages = [...iterator];
  return !!messages.length;
}

export const isAnyColumnNameRepeated = flow(_isAnyColumnNameRepeated, iteratorToBool);

function* _isAnyColumnNameRepeated (columns) {
  const uniqueNames = new Set();

  for (const [index, column] of columns.entries()) {
    if (column.name === '') continue;
    if (uniqueNames.has(column.name)) {
      yield [`columns[${index}].name`, `${column.id} has a duplicate name.`];
    } else {
      uniqueNames.add(column.name);
    }
  }
}

export const isDataNameEmptyAndRequired = flow(_isDataNameEmptyAndRequired, iteratorToBool);

function* _isDataNameEmptyAndRequired (state) {
  if (state.data.isVariable && state.data.value === '') {
    const message = 'Table data source name is missing.';
    yield ['data.value', message];
  }
}

export const isAnswerFieldRequired = flow(_isAnswerFieldRequired, iteratorToBool);

function* _isAnswerFieldRequired (state) {
  if ((state.enableEditing) && state.name.value === '') {
    yield ['name', 'Table answer field name is missing.'];
  }
}

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
    columnId: { value: '', isDirty: false },
    enableAddRows: { value: false, isDirty: false },
    addButtonAfterTable: { value: true, isDirty: false },
    addButtonBeforeTable: { value: false, isDirty: false },
    columnKeys: [firstElement.id],
    columnsListObj,
    dataRowKeys: [],
    dataRowObj: {},
    colCounter: 1,
    enableEditing: false
  };
};

export const state = {
  ...initialState()
};

function* getErrors (state) {
  const columns = state.columnKeys.map(id => (state.columnsListObj[id]));
  const anyDirtyColumn = isAnyDirtyColumn(columns);

  yield * _isDataNameEmptyAndRequired(state);
  yield * _isAnyColumnNameEmpty(columns);
  if (isFormUntouched(state, anyDirtyColumn)) yield ['', 'Form is untouched.'];
  yield * _isAnyColumnNameRepeated(columns);
  yield * _isAnswerFieldRequired(state);
}

export const getters = {
  [types.GET_TABLE_PROPS] (state) {
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
    const columnId = state.columnId.value;
    const enableAddRows = state.enableAddRows.value;
    const addButtonAfterTable = state.addButtonAfterTable.value;
    const addButtonBeforeTable = state.addButtonBeforeTable.value;
    const rowObject = {};
    const enableEditing = state.enableEditing;
    columns.forEach((c) => { rowObject[c.name] = ''; });
    return {
              name,
              data,
              columnId,
              enableAddRows,
              addButtonAfterTable,
              addButtonBeforeTable,
              options,
              columns,
              rowObject,
              enableEditing
            };
  },
  [types.GET_TABLE_COLUMNS_LIST] (state) {
    return state.columnKeys.map(id => (state.columnsListObj[id]));
  },
  [types.GET_TABLE_ENABLE_EDITING] (state) {
    return state.enableEditing;
  },
  [types.GET_TABLE_DATA_LIST] (state) {
    return state.dataRowKeys.map(id => (state.dataRowObj[id]));
  },
  [types.GET_TABLE_FORM_VALID] (state, getters) {
    return utils.toFormValidation(getters[types.GET_TABLE_ERRORS]);
  },
  [types.GET_TABLE_ERRORS] (state) {
    return utils.toMultiDict(getErrors(state));
  }
};

export const mutations = {

  [types.MUTATE_TABLE_NAME] (state, payload) {
    const name = { value: '', isDirty: true };
    name.value = payload.value !== undefined ? payload.value : state.name.value;
    name.isDirty = true;

    state.name = name;
  },
  [types.MUTATE_TABLE_COLUMN_ID] (state, payload) {
    state.columnId.value = payload.value;
  },
  [types.MUTATE_TABLE_ENABLE_EDITING] (state, payload) {
    if (!payload) {
      state.columnId = '';
      state.enableAddRows.value = false;
      state.name = '';
    }
    state.enableEditing = payload;
  },
  [types.MUTATE_TABLE_ENABLE_ADD_ROW] (state, payload) {
    state.enableAddRows.value = payload.value;
  },
  [types.MUTATE_TABLE_ADD_BUTTON_BEFORE] (state, payload) {
    state.addButtonBeforeTable.value = payload.value;
  },
  [types.MUTATE_TABLE_ADD_BUTTON_AFTER] (state, payload) {
    state.addButtonAfterTable.value = payload.value;
  },
  [types.MUTATE_TABLE_DATA] (state, payload) {
    state.data.value = payload.value !== undefined ? payload.value : state.data.value;
    state.data.isVariable = payload.isVariable !== undefined ? payload.isVariable : state.data.isVariable;
    state.data.isDirty = true;
  },
  [types.MUTATE_TABLE_UPDATE_COLUMN] (state, payload) {
    state.columnsListObj[payload.id] = payload;
  },
  [types.MUTATE_TABLE_DELETE_COLUMN] (state, id) {
    delete state.columnsListObj[id];
    state.columnKeys = state.columnKeys.filter(i => i !== id);
  },
  [types.MUTATE_TABLE_ADD_COLUMN] (state) {
    state.colCounter++;
    const newObj = getColumnObject(state.colCounter);
    state.columnKeys.push(newObj.id);
    state.columnsListObj = { ...state.columnsListObj, [newObj.id]: newObj };
  },
  [types.MUTATE_TABLE_UPDATE_DATA_ROW] (state, payload) {
    state.dataRowObj[payload.id] = payload;
  },
  [types.MUTATE_TABLE_ADD_DATA_ROW] (state) {
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

  [types.MUTATE_TABLE_DELETE_DATA_ROW] (state, id) {
    delete state.dataRowObj[id];
    state.dataRowKeys = state.dataRowKeys.filter(i => i !== id);
  },

  [types.MUTATE_CLEAR_TABLE_FORM] (state) {
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
