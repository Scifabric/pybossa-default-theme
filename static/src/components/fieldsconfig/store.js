import Vue from 'vue';

function _addField (state, { name, type, config, retryForConsensus, newField = false }) {
  name = name.toLowerCase();
  if (state.answerFields.hasOwnProperty(name)) {
    return;
  }
  if (newField) {
    state.newFields[name] = true;
  }
  Vue.set(state.answerFields, name, { type, config, retryForConsensus });
  state.fieldNames.push(name);
}

function _updateConsensusConfig (state, config) {
  state.consensusConfig = config;
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
      return (state.consensusConfig && state.consensusConfig.threshold);
    },

    hasRetryFields (state) {
      for (const name in state.answerFields) {
        if (state.answerFields[name].retryForConsensus) {
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
      }
      state.answerFields[name].retryForConsensus = false;
      delete state.answerFields[name];
    },

    updateConsensusConfig (state, config) {
      _updateConsensusConfig(state, config);
    },

    changeRetryConfig (state, { name, retry }) {
      state.answerFields[name].retryForConsensus = retry;
    },

    setData (state, { csrf, answerFields, consensus }) {
      state.csrf = csrf;
      const fields = answerFields;
      for (const name in answerFields) {
        _addField(state, { name, ...fields[name] });
      }
      _updateConsensusConfig(state, consensus);
    }
  }
};

export { storeSpecs };
