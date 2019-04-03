import * as types from '../types';
import utils from '../../utils';

const prop = (value, isVariable) => {
  return { value, isVariable };
};

const initialState = () => {
  return {
    id: prop(utils.uniqueID(), false),
    'pyb-answer': prop('', false),
    label: prop('', false),
    labelAdded: false
  };
};

export const state = {
  textInput: {
    form: initialState()
  }
};

export const getters = {
  [types.GET_TEXT_INPUT_PROPS]: state => {
    return state.textInput.form;
  },
  [types.GET_TEXT_INPUT_FORM_VALID]: () => {
    return true;
  }
};

export const mutations = {
  [types.MUTATE_TEXT_INPUT_FORM]: (state, payload) => {
    state.textInput.form = payload;
  },
  [types.MUTATE_CLEAR_TEXT_INPUT_FORM]: (state) => {
    state.textInput.form = initialState();
  }
};

export const actions = {
  [types.UPDATE_TEXT_INPUT_FORM]: ({ commit }, payload) => {
    commit(types.MUTATE_TEXT_INPUT_FORM, payload);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
