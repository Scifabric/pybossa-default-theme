import Vue from 'vue';
import Vuex from 'vuex';
import textInput from './modules/textInput';
import checkboxInput from './modules/checkboxInput';

Vue.use(Vuex);
export function __createMocks (
  custom = { getters: {}, mutations: {}, actions: {}, state: {} }
) {
  const mockGetters = Object.assign({}, textInput.getters, checkboxInput.getters);
  const mockMutations = Object.assign(
    {},
    textInput.mutations,
    checkboxInput.mutations
  );
  const mockActions = Object.assign({}, textInput.actions, custom.actions);
  const mockState = Object.assign({}, textInput.state, checkboxInput.state);
  return {
    getters: mockGetters,
    mutations: mockMutations,
    actions: mockActions,
    state: mockState,
    store: new Vuex.Store({
      getters: mockGetters,
      mutations: mockMutations,
      actions: mockActions,
      state: mockState
    })
  };
}

export const store = __createMocks().store;
