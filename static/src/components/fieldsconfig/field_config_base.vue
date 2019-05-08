<template>
  <div class="field-config">
    <div class="row col-md-12">
      <div v-if="!this.collaps" class="btn-group pull-right">
        <div  class="pull-right" stylr="margin-bottom: 5px">
          <span v-if="editing"
                :disabled="!editable"
                class="btn btn-sm btn-success"
                id="disable-edit"
                @click="toggleEdit"
          >
                Finish
          </span>
          <span v-else
                :disabled="!editable"
                class="btn btn-sm btn-warning"
                id="enable-edit"
                @click="toggleEdit"
          >
                Edit
          </span>
          <span v-if="this.retry" type="button"
                class="btn btn-sm btn-default"
                @click="changeRetryStatus">
                Disable Retry
          </span>
          <span v-else type="button"
                class="btn btn-sm btn-success"
                @click="changeRetryStatus">
                Enable Retry
          </span>
          <span class="btn btn-sm btn-danger"
                 @click="deleteField({ name })"
          >
                Delete
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10">
        <label> {{ type }} Field - {{ name }} </label>
        <span v-if="this.retry" class="retry">  (Retry) </span>
      </div>
      <div class="col-md-2" >
        <span @click="changeCollapsStatus">
          <i
            v-if="this.collaps"
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
    editable: Boolean,
    edit: Boolean
  },

  data () {
    return {
      editing: this.edit,
      retry: this.retryForConsensus,
      collaps: !this.edit
    };
  },

  methods: {
    ...mapMutations(['deleteField', 'changeRetryConfig']),

    toggleEdit () {
      if (!this.editable) {
        return;
      }
      this.editing = !this.editing;
      this.$emit('edit', this.editing);
    },

    changeRetryStatus() {

      this.retry = !this.retry;
      this.$emit('retryForConsensus', this.retry)
      this.changeRetryConfig({name: this.name,
                              retry: this.retry});

    },

    changeCollapsStatus() {
      this.collaps = !this.collaps;
    }
  }
};
</script>

