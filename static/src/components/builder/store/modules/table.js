import * as types from '../types';
import utils from '../../utils';

const prop = (value, isVariable) => {
  return { value, isVariable };
};
export const getColumnObject = id => {
  return {
    name: '',
    header: '',
    component: 'plain-text',
    id: `Columns ${id}`,
    id2: utils.uniqueID(),
    isDirty: false
  };
};

export const initialState = () => {
  const firstElement = getColumnObject(1);
  const columnListObj = { [firstElement.id2]: firstElement };
  return {
    id: utils.uniqueID(),
    label: { value: '', isDirty: false },
    name: { value: '', isDirty: false },
    data: { ...prop('', true), list: [], isDirty: false },
    columnIdKeys: [],
    columnListObj,
    columns: [getColumnObject(1)],
    options:
      {
        headings: {}
      },
    colCounter: 1
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_TABLE_PROPS]: state => {
    return state;
  },

  [types.GET_TABLE_FORM_VALID]: state => {
    /* Determine if Table Form is valid */
    const anyColumnNameEmpty =
      state.columns.filter(c => c.name === '').length > 0;
    const anyDirtyEmptyColumn =
      state.columns.filter(c => c.name === '' && c.isDirty).length > 0;
    const isAnswerFieldDirty =
      (state.name.value === '' && state.isVariable) ||
      (state.name.value === '' && state.name.isDirty);
    const anyDirtyColumn = state.columns.filter(c => c.isDirty).length > 0;
    const isFormUntouched = !state.name.isDirty && !anyDirtyColumn;
    const anyColumnComponent =
      state.columns.filter(col => col.component !== 'plain-text').length > 0;
    const repeatedColName =
      state.columns.length !==
      [...new Set(state.columns.map(c => c.name))].length;
    const isDataNameEmptyAndRequired =
      state.data.isVariable && state.data.value === '';
    const isAnswerFieldRequired = anyColumnComponent && state.name.value === '';

    if (
      isFormUntouched ||
      isDataNameEmptyAndRequired ||
      isAnswerFieldRequired ||
      anyColumnNameEmpty ||
      isAnswerFieldDirty ||
      anyDirtyEmptyColumn ||
      repeatedColName
    ) {
      return false;
    } else {
      return true;
    }
  }
};

export const mutations = {
  [types.MUTATE_TABLE_FORM]: (state, payload) => {
    state = payload;
  },
  [types.MUTATE_TABLE_COLUMNS_FORM]: (state, payload) => {
    state.table.form.columns = payload.columnns;
  },
  [types.MUTATE_CLEAR_TABLE_FORM]: (state) => {
    state.table.form = initialState();
  }

};

export const actions = {
  [types.UPDATE_TABLE_FORM]: ({ commit }, payload) => {
    commit(types.MUTATE_TABLE_FORM, payload);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
