<template>
  <div class="field-config">
    <div class="row col-md-12">
      <div
        v-if="!collapse"
        class="btn-group pull-right"
      >
        <div
          class="pull-right"
          stylr="margin-bottom: 5px"
        >
          <span
            v-if="retry"
            class="btn btn-sm btn-default"
            @click="changeRetryStatus"
          >
            Disable Retry
          </span>
          <span
            v-else
            class="btn btn-sm btn-success"
            @click="changeRetryStatus"
          >
            Enable Retry
          </span>
          <span
            class="btn btn-sm btn-danger"
            @click="deleteField({ name })"
          >
            Delete Field
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10">
        <label> {{ type }} Field - {{ name }} </label>
        <span
          v-if="retry"
          class="retry"
        >  (Retry) </span>
      </div>
      <div class="col-md-1 pull-right">
        <span @click="changeCollapseStatus">
          <i
            v-if="collapse"
            class="fa fa-angle-up"
            aria-hidden="true"
          />
          <i
            v-else
            class="fa fa-angle-down"
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import { mapMutations } from 'vuex';

export default {
  props: {
    name: String,
    type: String,
    retryForConsensus: Boolean,
    edit: Boolean,
    isEditable: Boolean
  },

  data () {
    return {
      editing: this.edit,
      retry: this.retryForConsensus,
      collapse: !this.edit
    };
  },

  methods: {
    ...mapMutations(['deleteField', 'changeRetryConfig']),


    changeRetryStatus () {
      this.retry = !this.retry;
      this.changeRetryConfig({ name: this.name,
                              retry: this.retry });
    },

    changeCollapseStatus () {

      this.collapse = !this.collapse;
      this.$emit('edit', !this.collapse);


    }
  }
};
</script>
