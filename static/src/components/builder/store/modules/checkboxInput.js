import * as types from '../types';
import utils from '../../utils';

const prop = (value, isVariable) => {
  return { value, isVariable };
};

export const initialState = () => {
  const firstElement = getCheckboxObject();
  const checkboxListObj = { [firstElement.id]: firstElement };
  return {
    label: '',
    labelAdded: false,
    checkboxIdKeys: [firstElement.id],
    checkboxListObj,
    isValidForm: true
  };
};

export const getCheckboxObject = () => {
  return {
    id: utils.uniqueID(),
    'pyb-answer': '',
    label: '',
    labelAdded: false,
    'initial-value': { ...prop(false, true) } };
};

export const state = {
  form: initialState()
};

export const getters = {
  [types.GET_CHECKBOX_INPUT_FORM]: state => {
    return { label: state.form.label,
      labelAdded: state.form.labelAdded,
      isValidForm: state.form.isValidForm,
      checkboxList: state.form.checkboxIdKeys.map(id => (state.form.checkboxListObj[id])) };
  },
  [types.GET_CHECKBOXLIST]: state => {
    return state.form.checkboxIdKeys.map(id => (state.form.checkboxListObj[id]));
  },
  [types.GET_CHECKBOX_INPUT_FORM_VALID]: () => {
    return state.form.isValidForm;
  }
};

export const mutations = {
  [types.MUTATE_CLEAR_CHECKBOX_INPUT_FORM]: (state, payload) => {
    state.form = initialState();
  },
  [types.MUTATE_CHECKBOX_LABEL_ADDED]: (state, payload) => {
    state.form.labelAdded = payload;
  },
  [types.MUTATE_CHECKBOX_LABEL]: (state, payload) => {
    state.form.label = payload;
  },
  [types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM]: (state, payload) => {
    state.form.checkboxListObj[payload.id] = payload;
  },
  [types.MUTATE_CHECKBOX_DELETE_LIST_ITEM]: (state, id) => {
    delete state.form.checkboxListObj[id];
    state.form.checkboxIdKeys = state.form.checkboxIdKeys.filter(i => i !== id);
  },
  [types.MUTATE_CHECKBOX_ADD_LIST_ITEM]: (state) => {
    const newObj = getCheckboxObject();
    state.form.checkboxIdKeys.push(newObj.id);
    state.form.checkboxListObj = { ...state.form.checkboxListObj, [newObj.id]: newObj };
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
