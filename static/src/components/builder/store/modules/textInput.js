import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    id: utils.uniqueID(),
    'pyb-answer': '',
    label: '',
    labelAdded: false,
    isValidForm: true
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_TEXT_INPUT_PROPS]: state => {
    return state;
  },
  [types.GET_TEXT_INPUT_FORM_VALID]: () => {
    return { isValid: state.isValidForm }
    ;
  }
};

export const mutations = {
  [types.MUTATE_TEXT_INPUT_LABEL]: (state, payload) => {
    state.label = payload;
  },
  [types.MUTATE_TEXT_INPUT_LABEL_ADDED]: (state, payload) => {
    state.labelAdded = payload;
  },
  [types.MUTATE_TEXT_INPUT_PYB_ANSWER]: (state, payload) => {
    state['pyb-answer'] = payload;
  },
  [types.MUTATE_CLEAR_TEXT_INPUT_FORM]: (state) => {
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
