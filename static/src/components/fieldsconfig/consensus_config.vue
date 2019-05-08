<template>
  <div class="stats-config row">
    <div class="col-xs-12">
      <div class="form-inline">
        <p> Consensus threshold: </p>
        <input
            v-model="threshold"
            type="text"
            class="form-control input-sm"
            placeholder="eg: 70"
        ><span> %</span>
        <p> Add redundancy to retry: </p>
        <input
            v-model="redundancyDelta"
            type="text"
            class="form-control input-sm"
            value="%"
        >
        <p> Maximum redundancy: </p>
        <input
            v-model="maxRetries"
            type="text"
            class="form-control input-sm"
        >
        <div>
            <br> </br>
            <button
                class="btn btn-primary"
                @click="save"
            >
                Save
            </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapMutations } from 'vuex';

export default {
  data () {
    return {
        isDefined: false,
        // mutableThreshold: this.threshold,
        // mutableMaxRetries: this.maxRetries,
        // mutableRedundancyDelta: this.redundancyDelta
        threshold: 0,
        maxRetries: 0,
        redundancyDelta: 0
    }
  },

//   props: {
//     threshold: Number,
//     maxRetries: Number,
//     redundancyDelta: Number
//   },

  computed: {
    ...mapGetters(['csrfToken', 'consensusConfig'])
  },

  methods: {
    ... mapMutations(['updateConfig']),

    _write: function() {
        if (!this.redundancyDelta || !this.maxRetries || !this.threshold) {
            this.error = 'error: missing information.';
            return false;
        }
        if (this.threshold <= 50 || this.threshold > 100) {
            this.error = 'error: threshold should be greater than 50';
            return false;
        }
        if (this.redundancyDelta <= 0) {
            this.error = 'invalid redundancy value';
            return false;
        }
        if (this.maxRetries <= 0) {
            this.error = 'invalid maximum redundancy value';
            return false;
        }
        this.isDefined = true;
        this.updateConfig({
            threshold: this.threshold,
            redundancyDelta: this.redundancyDelta,
            maxRetries: this.maxRetries
        });
        return true;
    },

    async save () {
        if (!this._write())
            return ;
        try {
            console.log(JSON.stringify(this.consensusConfig))
            const res = await fetch(window.location.pathname, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': this.csrfToken
            },
            body: JSON.stringify({consensusConfig: this.consensusConfig})
            });
            if (res.ok) {
            const data = await res.json();
            window.pybossaNotify(data.flash, true, data.status);
            } else {
            window.pybossaNotify('An error occurred.', true, 'error');
            }
        } catch (error) {
            console.warn(error);
            window.pybossaNotify('An error occurred.', true, 'error');
        }
    }
  }
}
//   data () {
//     return {
//       editing: this.edit,
//       newLabel: undefined
//     };
//   },

//   methods: {
//     ...mapMutations(['addFieldConfig']),

//     addLabels (split) {
//       let newLabels;
//       if (split) {
//         newLabels = this.newLabel
//           .split(',')
//           .map((token) => token.trim());
//       } else {
//         newLabels = [this.newLabel];
//       }

//       const dedupe = {};
//       newLabels.forEach((el) => {
//         dedupe[el] = true;
//       });
//       newLabels = Object.keys(dedupe)
//         .filter((el) => !this.labels.includes(el));

//       this.addFieldConfig({
//         name: this.name,
//         config: {
//           labels: this.labels.concat(newLabels).sort()
//         }
//       });
//       this.newLabel = undefined;
//     }
//   }
// };
</script>
<style>
.pill {
    margin-right: 0.3em;
    display: inline-block
}
.field-config-wrapper {
    margin-bottom: 0.5em
}
</style>
