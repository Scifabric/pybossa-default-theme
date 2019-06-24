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
    'initial-value': { ...prop(false, true) } };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_CHECKBOX_INPUT_PROPS] (state) {
    return { label: state.label,
      labelAdded: state.labelAdded,
      isValidForm: state.isValidForm,
      checkboxList: state.checkboxIdKeys.map(id => (state.checkboxListObj[id])) };
  },
  [types.GET_CHECKBOXLIST] (state) {
    return state.checkboxIdKeys.map(id => (state.checkboxListObj[id]));
  },
  [types.GET_CHECKBOX_INPUT_FORM_VALID] () {
    return { isValid: state.isValidForm };
  }
};

export const mutations = {
  [types.MUTATE_CLEAR_CHECKBOX_INPUT_FORM] (state) {
    const initial = initialState();
    Object.keys(initial).forEach(key => {
      state[key] = initial[key];
    });
  },
  [types.MUTATE_CHECKBOX_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_CHECKBOX_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM] (state, payload) {
    state.checkboxListObj[payload.id] = payload;
  },
  [types.MUTATE_CHECKBOX_DELETE_LIST_ITEM] (state, id) {
    delete state.checkboxListObj[id];
    state.checkboxIdKeys = state.checkboxIdKeys.filter(i => i !== id);
  },
  [types.MUTATE_CHECKBOX_ADD_LIST_ITEM] (state) {
    const newObj = getCheckboxObject();
    state.checkboxIdKeys.push(newObj.id);
    state.checkboxListObj = { ...state.checkboxListObj, [newObj.id]: newObj };
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
