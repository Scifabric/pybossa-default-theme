import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    id: utils.uniqueID(),
    condition: '',
    isValidForm: true
  };
};

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_CONDITIONAL_DISPLAY_PROPS] (state) {
    return state;
  },
  [types.GET_CONDITIONAL_DISPLAY_FORM_VALID] () {
    return { isValid: state.isValidForm };
  }
};

export const mutations = {
  [types.MUTATE_CONDITIONAL_DISPLAY_CONDITION] (state, payload) {
    state.condition = payload;
  },

  [types.MUTATE_CLEAR_CONDITIONAL_DISPLAY_FORM] (state) {
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
