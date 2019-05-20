import Vue from 'vue';

function _addField (state, { name, type, config, retryForConsensus, newField = false }) {
  name = name.toLowerCase();
  if (state.answerFields.hasOwnProperty(name)) {
    return;
  }
  if (newField) {
    state.newFields[name] = true;
  }
  Vue.set(state.answerFields, name, { type, config, 'retry_for_consensus': retryForConsensus });
  state.fieldNames.push(name);
}

function _updateConsensusConfig (state, config) {
  if (config) {
    const cf = {
      consensusThreshold: config['consensus_threshold'],
      maxRetries: config['max_retries'],
      redundancyConfig: config['redundancy_config']
    };
    state.consensusConfig = cf;
  }
}

const storeSpecs = {
  state: {
    csrf: '',
    fieldNames: [],
    answerFields: {},
    consensusConfig: {},
    newFields: {}
  },

  getters: {
    answerFields (state) {
      const rv = {};
      state.fieldNames.forEach((name) => {
        rv[name] = state.answerFields[name];
      });
      return rv;
    },

    csrfToken (state) {
      return state.csrf;
    },

    isNewField: (state) => (name) => {
      const f = state.newFields[name] || false;
      return f;
    },

    hasConsensusConfig (state) {
      return (state.consensusConfig && state.consensusConfig.consensusThreshold > 0);
    },

    hasRetryFields (state) {
      for (const name in state.answerFields) {
        if (state.answerFields[name]['retry_for_consensus']) {
            return true;
        }
      }
      return false;
    }
  },

  mutations: {
    addField (state, payload) {
      _addField(state, payload);
    },

    addFieldConfig (state, { name, config }) {
      state.answerFields[name].config = config;
    },

    deleteField (state, { name }) {
      const ix = state.fieldNames.indexOf(name);
      if (ix >= 0) {
        state.fieldNames.splice(ix, 1);
        state.answerFields[name]['retry_for_consensus'] = false;
      }
      delete state.answerFields[name];
    },

    updateConsensusConfig (state, config) {
      _updateConsensusConfig(state, config);
    },

    changeRetryConfig (state, { name, retry }) {
      state.answerFields[name]['retry_for_consensus'] = retry;
    },

    setData (state, { csrf, answerFields, consensus }) {
      console.log(answerFields);
      state.csrf = csrf;
      const fields = answerFields;
      for (const name in answerFields) {
        const retryForConsensus = fields[name]['retry_for_consensus'];
        const { type, config } = fields[name];
        _addField(state, { name, type, config, retryForConsensus });
      }
      _updateConsensusConfig(state, consensus);
    }
  }
};

export { storeSpecs };
