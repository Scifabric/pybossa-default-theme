'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import FieldsConfig from './components/fieldsconfig/index';
import ConsensusConfig from './components/fieldsconfig/consensus_config';
import { storeSpecs } from './components/fieldsconfig/store';

Vue.use(Vuex);

const store = new Vuex.Store(storeSpecs);

const app = new Vue({
  el: '#answerfieldsconfig',
  store,
  components: {
    FieldsConfig,
    ConsensusConfig
  }
});

window.answerFields = {
  setData: store.commit.bind(null, 'setData')
};

export default app;
