import * as types from '../types';
import utils from '../../utils';

const initialState = () => {
  return {
    id: utils.uniqueID(),
    pybanswer: '',
    fileName: '',
    label: '',
    labelAdded: false,
    isValidForm: true
  };
};

export const state = initialState();

function* getErrors (state) {
  const suffix = '__upload_url';
  if (state.pybanswer.length <= suffix.length || !state.pybanswer.match(`${suffix}$`)) yield ['pybanswer', `Please ensure the answer field value ends with ${suffix}.`];
}

export const getters = {
  [types.GET_FILE_UPLOAD_PROPS] (state) {
    return state;
  },
  [types.GET_FILE_UPLOAD_FORM_VALID] (state, getters) {
    return utils.toFormValidation(getters[types.GET_FILE_UPLOAD_ERRORS]);
  },
  [types.GET_FILE_UPLOAD_ERRORS] (state) {
    return utils.toMultiDict(getErrors(state));
  }
};

export const mutations = {
  [types.MUTATE_FILE_UPLOAD_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_FILE_UPLOAD_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_FILE_UPLOAD_PYB_ANSWER] (state, payload) {
    state.pybanswer = payload;
  },
  [types.MUTATE_FILE_UPLOAD_FILE_NAME] (state, payload) {
    state.fileName = payload;
  },
  [types.MUTATE_CLEAR_FILE_UPLOAD_FORM] (state) {
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
