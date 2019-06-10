import * as types from '../types';
import utils from '../../utils';
import { flow } from 'lodash';

function* _isAnyColumnNameEmpty(columns) {
  for (const column of columns) {
    if (column.name === '') {
      yield `${column.id} name is missing.`;
    }
  }
}

export const isAnyColumnNameEmpty = flow(_isAnyColumnNameEmpty, iteratorToBool);

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

function iteratorToBool(iterator) {
  const messages = [...iterator];
  return messages.length ? true : false;
}

export const isAnyColumnNameRepeated = flow(_isAnyColumnNameRepeated, iteratorToBool);

function* _isAnyColumnNameRepeated(columns) {
  const uniqueNames = new Set();

  for (const column of columns) {
    if (column.name === '') continue;
    if (uniqueNames.has(column.name)) {
      yield `${column.id} has a duplicate name.`;
    } else {
      uniqueNames.add(column.name);
    }
  }
}

export const isDataNameEmptyAndRequired = flow(_isDataNameEmptyAndRequired, iteratorToBool);

function* _isDataNameEmptyAndRequired(state) {
  if (state.data.isVariable && state.data.value === '') {
    yield 'Table data source name is missing.'; 
  }
}

export const isAnswerFieldRequired = flow(_isAnswerFieldRequired, iteratorToBool);

function* _isAnswerFieldRequired (state, anyColumnComponent) {
  if (anyColumnComponent && state.name.value === '') {
    yield 'Table answer field name is missing.';
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
    const messages = [...getErrors()];
    const isValid = messages.length ? false : true;
    return { isValid, messages };

    function* getErrors() {
      const columns = state.columnKeys.map(id => (state.columnsListObj[id]));
      const anyDirtyColumn = isAnyDirtyColumn(columns);
      const anyColumnComponent = isAnyColumnComponent(columns);

      yield* _isDataNameEmptyAndRequired(state);
      yield* _isAnyColumnNameEmpty(columns);
      if (isAnyDirtyEmptyColumn(columns)) yield 'A dirty column has empty name.';
      if (isAnswerFieldDirty(state)) yield 'Answer field is dirty.';
      if (isFormUntouched(state, anyDirtyColumn)) yield 'Form is untouched.';
      yield* _isAnyColumnNameRepeated(columns);
      yield* _isAnswerFieldRequired(state, anyColumnComponent);
    }
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
