import Vue from 'vue';
import Vuex from 'vuex';
import textInput from './modules/textInput';
import checkboxInput from './modules/checkboxInput';
import table from './modules/table';
import { getStoreOptions, setNamespace } from '@dtwebservices/task-presenter-components';

Vue.use(Vuex);

const TASK_PRESENTER = 'TASK_PRESENTER';
setNamespace(TASK_PRESENTER);
const taskPresenterStoreOptions = getStoreOptions();
taskPresenterStoreOptions.namespaced = true;

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    [TASK_PRESENTER]: taskPresenterStoreOptions,
    checkboxInput,
    textInput,
    table
  }
});
