<template>
  <div
    v-if="hasRetryFields"
    class="stats-config row"
  >
    <div class="col-md-12">
      <h3> Consensus Configuration </h3>
      <div class="form-inline ">
        <p> Consensus threshold: </p>
        <div class="input-group">
          <input
            v-model="consensusThreshold"
            type="text"
            class="form-control "
            style="width: 100%"
          >
          <span
            class="input-group-addon"
            style="width:10%"
          > % </span>
        </div>
        <p> Add redundancy to retry: </p>
        <input
          v-model="redundancyConfig"
          type="text"
          class="form-control"
          style="width: 100%"
        >
        <p> Maximum redundancy: </p>
        <input
          v-model="maxRetries"
          type="text"
          class="form-control "
          style="width: 100%"
        >
        <div
          v-if="errorMsg != ''"
          class="errorMsg"
        >
          {{ errorMsg }}
        </div>
        <div>
          <br>
          <button
            class="btn btn-primary"
            @click="save"
          >
            Update
          </button>
        </div>
      </div>
      <div v-if="hasConsensusConfig">
        <br>
        <div class="row">
          <div class="col-md-9">
            <p> Consensus threshold</p>
            <p> Add redundancy to retry</p>
            <p> Maximum redundancy</p>
          </div>
          <div class="col-md-3 align-right">
            <p> {{ consensusThreshold }}</p>
            <p> {{ redundancyConfig }}</p>
            <p> {{ maxRetries }}</p>
          </div>
        </div>
        <button
          class="btn btn-danger"
          @click="remove"
        >
          Delete
        </button>
      </div>
      <div v-else>
        <p> No consensus currently configured.</p>
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
    ...mapGetters(['csrfToken', 'hasRetryFields', 'hasConsensusConfig'])
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
        const _consensusThreshold = parseInt(this.consensusThreshold, 10);
        const _redundancyConfig = parseInt(this.redundancyConfig, 10);
        const _maxRetries = parseInt(this.maxRetries, 10);
        if (!this._write(_consensusThreshold, _redundancyConfig, _maxRetries)) {
            return;
        }
        try {
            const res = await fetch(window.location.pathname, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'same-origin',
                body: JSON.stringify({ 'consensus_config': {
                    'consensus_threshold': _consensusThreshold,
                    'max_retries': _maxRetries,
                    'redundancy_config': _redundancyConfig }
                    })
            });
            if (res.ok) {
                const data = await res.json();
                window.pybossaNotify(data.flash, true, data.status);
                this.updateConsensusConfig({
                    'consensus_threshold': _consensusThreshold,
                    'max_retries': _maxRetries,
                    'redundancy_config': _redundancyConfig
                });
            } else {
                window.pybossaNotify('An error occurred.', true, 'error');
            }
        } catch (error) {
                window.pybossaNotify('An error occurred.', true, 'error');
        }
    },

    async remove () {
        try {
            const res = await fetch(window.location.pathname, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.csrfToken
                },
                credentials: 'same-origin',
                body: JSON.stringify({ consensusConfig: {} })
            });
            if (res.ok) {
                const data = await res.json();
                window.pybossaNotify(data.flash, true, data.status);
                this.consensusThreshold = 0;
                this.maxRetries = 0;
                this.redundancyConfig = 0;
                this.updateConsensusConfig({});
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
.errorMsg {
    color: red;
}

.form-control.input-sm {
    width: 280px;
}
.align-right {
    text-align:right;
}
</style>
