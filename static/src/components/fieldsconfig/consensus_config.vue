<template>
  <div
    class="stats-config row"
  >
    <div
      v-if="hasRetryFields"
      class="col-md-12 consensus"
    >
      <div class="form-group row">
        <div class="col-md-4">
          <p> Consensus Threshold </p>
        </div>
        <div class="col-md-8">
          <input
            v-model="consensusThreshold"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Add Redundancy To Retry </p>
        </div>
        <div class="col-md-8 pull-right">
          <input
            v-model="redundancyConfig"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Maximum Retry </p>
        </div>
        <div class="col-md-8 pull-right">
          <input
            v-model="maxRetries"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <div
        v-if="errorMsg"
        class="error-msg"
      >
        {{ errorMsg }}
      </div>
      <div>
        <button
          class="btn btn-sm btn-primary"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
      'consensusConfig': {
          type: Object,
          default: () => ({ consensusThreshold: undefined, maxRetries: undefined, redundancyConfig: undefined })
      }
  },
  data () {
    return {
        consensusThreshold: this.consensusConfig['consensus_threshold'],
        maxRetries: this.consensusConfig['max_retries'],
        redundancyConfig: this.consensusConfig['redundancy_config'],
        errorMsg: '',
        capacity: 10000
    };
  },

  computed: {
    ...mapGetters(['csrfToken', 'hasRetryFields', 'hasConsensusConfig', 'answerFields'])
  },

  methods: {
    ...mapMutations(['updateConsensusConfig']),

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    _write: function (_consensusThreshold, _redundancyConfig, _maxRetries) {
        if (!this._isIntegerNumeric(_consensusThreshold) || _consensusThreshold <= 50 ||
          _consensusThreshold > 100) {
            this.errorMsg = 'Threshold should be integer within 50 - 100';
            return false;
        }
        if (!this._isIntegerNumeric(_redundancyConfig) || _redundancyConfig <= 0) {
            this.errorMsg = 'Redundancy should be positive integer';
            return false;
        }
        if (!this._isIntegerNumeric(_maxRetries) || _maxRetries <= 0 ||
                _maxRetries > this.capacity) {
            this.errorMsg = 'Maximum redundancy should be integer within 1 - ' + this.capacity;
            return false;
        }
        this.errorMsg = '';
        return true;
    },

    async save () {
        let data = { answer_fields: this.answerFields };
        if (this.hasRetryFields) {
            let _consensusThreshold = parseInt(this.consensusThreshold, 10);
            let _redundancyConfig = parseInt(this.redundancyConfig, 10);
            let _maxRetries = parseInt(this.maxRetries, 10);
            if (!this._write(_consensusThreshold, _redundancyConfig, _maxRetries)) {
                return;
            }
            data['consensus_config'] = {
                    'consensus_threshold': _consensusThreshold,
                    'max_retries': _maxRetries,
                    'redundancy_config': _redundancyConfig
                  };
            this.updateConsensusConfig({
                    'consensus_threshold': _consensusThreshold,
                    'max_retries': _maxRetries,
                    'redundancy_config': _redundancyConfig
                });
        }
        try {
            const res = await fetch(window.location.pathname, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            if (res.ok) {
                window.pybossaNotify('Answer Fields saved', true, 'success');
            } else {
                window.pybossaNotify('An error occurred.', true, 'error');
            }
        } catch (error) {
            window.pybossaNotify('An error occurred.', true, 'error');
        }
    }
  }
};
</script>
<style>
.error-msg {
    color: red;
}

.form-control.input-sm {
    width: 280px;
}
.align-right {
    text-align:right;
}
.consensus {
    width: 85%
}
</style>
