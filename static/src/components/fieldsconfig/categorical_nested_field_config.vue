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

    <div class="col-md-12">
      <p>Build nested consensus on dot paths combining field values with field names.</p>
      <p>Example: Answers recorded for multiple companies quarterly stock price per year, month. Generate consensus on price considering year, month values. Consensus to be built on fields with dot path as q1.2020.1.price, q1.2020.2.price ...</p>
      <p>Ordered list of keys whose values to be part of dot path</p>
      <p>
        Key Values: <span
          v-for="(keyvalue, index) in keyValues || []"
          :key="index"
          class="pill label label-primary"
        >{{ keyvalue }}</span>
      </p>
      <input
        v-model="newKeyValues"
        type="text"
        class="form-control input-sm"
      >
      <div style="margin-top:5px; margin-bottom:20px">
        <span
          class="btn btn-sm btn-primary"
          @click="addKeyValues"
        >
          Update
        </span>
      </div>
      <p>List of keys on which consensus to be build</p>
      <p>
        Keys: <span
          v-for="(key, index) in keys || []"
          :key="index"
          class="pill label label-primary"
        >{{ key }}</span>
      </p>
      <input
        v-model="newKeys"
        type="text"
        class="form-control input-sm"
      >
      <div style="margin-top:5px; margin-bottom:20px">
        <span
          class="btn btn-sm btn-primary"
          @click="addKeys"
        >
          Update
        </span>
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
    edit: Boolean,
    keyValues: Array,
    keys: Array
  },
  data () {
    return {
      editing: this.edit,
      newKeyValues: undefined,
      newKeys: undefined
    };
  },

  methods: {
    ...mapMutations(['addFieldConfig', 'changeRetryConfig']),

    setKeyValues (keyValues) {
      this.addFieldConfig({
        name: this.name,
        config: {
          keyValues,
          keys: this.keys
        }
      });
    },

    setKeys (keys) {
      this.addFieldConfig({
        name: this.name,
        config: {
          keyValues: this.keyValues,
          keys
        }
      });
    },

    addKeyValues () {
      let newKeyValues;
      const keyValues = (this.newKeyValues || '').trim();
      if (!keyValues) {
        return;
      }
      newKeyValues = keyValues
        .split(',')
        .map(token => token.trim())
        .filter(token => token);

      this.setKeyValues(newKeyValues);
      this.newKeyValues = undefined;
    },

    addKeys () {
      let newKeys;
      const keys = (this.newKeys || '').trim();
      if (!keys) {
        return;
      }
      newKeys = keys
        .split(',')
        .map(token => token.trim())
        .filter(token => token);

      this.setKeys(newKeys);
      this.newKeys = undefined;
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
