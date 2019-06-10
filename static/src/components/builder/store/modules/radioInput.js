import * as types from '../types';
import utils from '../../utils';

export function initialState() {
  const firstElement = getRadioObject();
  const secondElement = getRadioObject();
  return {
    label: '',
    labelAdded: false,
    radioList: [firstElement, secondElement],
    pybAnswer: '',
    name: '',
    initialValue: ''
  };
}

export function getRadioObject() {
  return {
    label: '',
    value: ''
  };
}

export const state = {
  ...initialState()
};

export const getters = {
  [types.GET_RADIO_INPUT_PROPS] (state) {
    return {
      label: state.label,
      labelAdded: state.labelAdded,
      radioList: state.radioList,
      pybAnswer: state.pybAnswer,
      name: state.name,
      initialValue: state.initialValue
    };
  },
  [types.GET_RADIO_INPUT_FORM_VALID] (state) {
    const messages = [...getErrors()];
    const isValid = messages.length ? false : true;
    return {isValid, messages};

    function* getErrors() {
      if (!state.name) yield "HTML Name cannot be blank.";
      const uniqueValues = new Set();
      for (const [index, {value}] of state.radioList.entries()) {
        if (!value) yield `Radio ${index+1} value cannot be blank.`
        else if (uniqueValues.has(value)) yield `Radio ${index+1} value is not unique.`;
        else uniqueValues.add(value);
      }
    }
  }
};

export const mutations = {
  [types.MUTATE_RADIO_GROUP_ANSWER_FIELD](state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_RADIO_GROUP_INITIAL_VALUE](state, payload) {
    state.initialValue = payload;
  },
  [types.MUTATE_RADIO_GROUP_NAME](state, payload) {
    state.name = payload;
  },
  [types.MUTATE_CLEAR_RADIO_INPUT_FORM] (state) {
    const initial = initialState();
    Object.keys(initial).forEach(key => {
      state[key] = initial[key];
    });
  },
  [types.MUTATE_RADIO_GROUP_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_RADIO_GROUP_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM] (state, {radio, index}) {
    state.radioList.splice(index, 1, radio);
  },
  [types.MUTATE_RADIO_GROUP_DELETE_LIST_ITEM] (state, index) {
    state.radioList.splice(index, 1)
  },
  [types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM] (state) {
    const newObj = getRadioObject();
    state.radioList.push(newObj);
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
