import Vue from 'vue';

function _addField (state, { name, type, config, retryForConsensus, newField = false }) {

  if (state.answerFields.hasOwnProperty(name)) {
    return;
  }
  if (newField) {
    state.newFields[name] = true;
  }
  Vue.set(state.answerFields, name, { type, config, retryForConsensus });
  state.fieldNames.push(name);
}

const storeSpecs = {
  state: {
    csrf: '',
    fieldNames: [],
    answerFields: {},
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

    consensusConfig (state) {
      return state.consensusConfig;
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
      delete state.answerFields[name];
    },

    changeRetryConfig (state, {name, retry}) {
      state.answerFields[name].retryForConsensus = retry;
      this.retryForConsensus = retry;
    },

    setData (state, { csrf, answerFields }) {
      state.csrf = csrf;
      const fields = answerFields;
      for (const name in answerFields) {
        _addField(state, { name, ...fields[name] });
      }
    }
  }
};

export { storeSpecs };
