<template>
  <div class="row">
    <div class="col-md-12">
      <field-config-base
        :name="name"
        :type="type"
        :retry-for-consensus="retryForConsensus"
        :edit="editing"
        @edit="editing=!editing"
      />
    </div>
    <div
      v-if="editing"
      class="col-md-12 form-group"
    >
      <div class="checkbox">
        <label>
          <input
            v-model="isBoolean"
            type="checkbox"
            @input="setTrueFalse"
          >
          <p>True/False</p>
        </label>
      </div>
    </div>
    <div class="row col-md-12">
      <div class="col-md-12">
        <p>
          Labels: <span
            v-for="(label, index) in labels || []"
            :key="index"
            class="pill label label-primary"
          >{{ label }}</span>
        </p>
      </div>
      <div
        v-if="editing && !isBoolean"
        class="form-inline col-md-12"
      >
        <p>Add single label or multiple comma separated labels. The labels must exactly match the possible values of the response field.</p>
        <div class="form-group">
          <input
            v-model="newLabel"
            type="text"
            class="form-control input-sm"
          >
          <div style="margin-top: 8px">
            <span
              class="btn btn-sm btn-primary"
              @click="addLabels(false)"
            >
              Add Single
            </span>
            <span
              class="btn btn-sm btn-primary"
              @click="addLabels(true)"
            >
              Add Many
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import FieldConfigBase from './field_config_base.vue';

export default {

  components: {
    FieldConfigBase
  },

  props: {
    name: String,
    type: String,
    retryForConsensus: Boolean,
    labels: Array,
    edit: Boolean
  },
  data () {
    return {
      editing: this.edit,
      newLabel: undefined,
      isBoolean: this.checkIfTrueFalse()
    };
  },

  methods: {
    ...mapMutations(['addFieldConfig', 'changeRetryConfig']),

    setLabels (labels) {
      this.addFieldConfig({
        name: this.name,
        config: {
          labels
        }
      });
    },

    setTrueFalse (evt) {
      this.isBoolean = evt.target.checked;
      if (this.isBoolean) {
        this.setLabels([true, false]);
      } else {
        this.setLabels([]);
      }
    },

    checkIfTrueFalse () {
      const labels = this.labels || [];
      return labels.length === 2 &&
        [true, false].every(b => {
          return labels.includes(b);
        });
    },

    addLabels (split) {
      let newLabels;
      const label = (this.newLabel || '').trim();
      if (!label) {
        return;
      }
      if (split) {
        newLabels = label
          .split(',')
          .map(token => token.trim())
          .filter(token => token);
      } else {
        newLabels = [label];
      }

      const dedupe = {};
      newLabels.forEach((el) => {
        dedupe[el] = true;
      });
      newLabels = Object.keys(dedupe)
        .filter((el) => !this.labels.includes(el));

      this.setLabels(this.labels.concat(newLabels).sort());
      this.newLabel = undefined;
    }
  }
};
</script>
<style>
.pill {
    margin-right: 0.3em;
    display: inline-block;
}

.card {
  padding-left: 2px;
  padding-right: 10px;
}

.card-body {
  box-shadow: 1px 1px 4px 0px grey;
  padding-left: 10px;
  margin-bottom: 10px;
  margin-top: 3px;
}
</style>
