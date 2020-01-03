/* eslint-disable no-undef */
import * as types from '../../types';

export const state = {
  textInput: {
    id: '1',
    'pyb-answer': 'pybanswer',
    label: 'label',
    labelAdded: true,
    isValidForm: true
  }
};

export const getters = {
  [types.GET_TEXT_INPUT_PROPS]: jest.fn().mockReturnValue({
    id: '1',
    'pyb-answer': 'pybanswer',
    label: 'label',
    labelAdded: true
  })
};
export const mutations = {
  [types.MUTATE_TEXT_INPUT_LABEL]: jest.fn(),
  [types.MUTATE_TEXT_INPUT_LABEL_ADDED]: jest.fn(),
  [types.MUTATE_TEXT_INPUT_TYPE]: jest.fn(),
  [types.MUTATE_TEXT_INPUT_PYB_ANSWER]: jest.fn(),
  [types.MUTATE_CLEAR_TEXT_INPUT_FORM]: jest.fn()
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
