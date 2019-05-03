<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div class="form-inline ">
        <p> Consensus threshold: </p>
        <div class="input-group">
          <input
            v-model="threshold"
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
          v-model="redundancyDelta"
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
        <br>
        <div>
          <button
            class="btn btn-primary"
            @click="save"
          >
            Update
          </button>
        </div>
      </div>

      <div v-if="isDefined && threshold!=0">
        <div class="row">
          <div class="col-md-9">
            <p> Consensus threshold</p>
            <p> Add redundancy to retry</p>
            <p> Maximum redundancy</p>
          </div>
          <div class="col-md-3 align-right">
            <p> {{ threshold }}</p>
            <p> {{ redundancyDelta }}</p>
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
        <p>No consensus currently configured.</p>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
      'consensus_config': {
          type: Object,
          default: () => ({ threshold: 0, maxRetries: 0, redundancyDelta: 0 })
      }
  },
  data () {
    return {
        threshold: this.consensus_config.threshold,
        maxRetries: this.consensus_config.maxRetries,
        redundancyDelta: this.consensus_config.redundancyDelta,
        errorMsg: '',
        isDefined: true,
        capacity: 10000
    };
  },

  computed: {
    ...mapGetters(['csrfToken'])
  },

  methods: {
    ...mapMutations(['updateConfig']),

    _isIntegerNumeric: function (n) {
        var _n = Number(n);
        return Math.floor(_n) === _n;
    },

    _write: function () {
        if (!this.redundancyDelta && !this.maxRetries && !this.threshold) {
            return true;
        }

        if (!this._isIntegerNumeric(this.threshold) || this.threshold <= 50 ||
                this.threshold > 100) {
            this.errorMsg = 'Threshold should be integer in 1 - 100';
            return false;
        }
        if (!this._isIntegerNumeric(this.redundancyDelta) || this.redundancyDelta <= 0) {
            this.errorMsg = 'Redundancy should be positive integer';
            return false;
        }
        if (!this._isIntegerNumeric(this.maxRetries) || this.maxRetries <= 0 ||
                this.maxRetries > this.capacity) {
            this.errorMsg = 'Maximum redundancy should be integer in 1 - ' + this.capacity;
            return false;
        }
        this.errorMsg = '';
        this.isDefined = true;
        return true;
    },
    remove () {
        this.threshold = 0;
        this.maxRetries = 0;
        this.redundancyDelta = 0;
        this.save();
    },
    async save () {
        if (!this._write()) {
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
                body: JSON.stringify({ 'consensusConfig': {
                    threshold: this.threshold,
                    maxRetries: this.maxRetries,
                    redundancyDelta: this.redundancyDelta }
                    })
            });
            if (res.ok) {
                const data = await res.json();
                window.pybossaNotify(data.flash, true, data.status);
                this.isDefined = this.threshold !== 0;
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

.form-control-custom {
    width: 100%;

}
</style>
