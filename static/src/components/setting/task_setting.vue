<template>
  <div class="stats-config row">
    <div class="col-sm-12">
      <div class="form-group row">
        <div class="col-sm-6">
          <p> task scheduler </p>
        </div>
        <div class="col-sm-6 pull-right">
          <select :disabled="!editable" v-model="sched" class="form-control input-sm" >
            <option
              v-for="opt in getOptions()"
              v-bind:key="opt.text"
              :value="opt.value"
            >
              {{ opt.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-6">
          <p> randomize order with same priority </p>
        </div>
        <div class="col-sm-6 pull-right">
          <label class="switch">
            <input type="checkbox" :disabled="!editable" v-model="random">
            <span class="slider"></span>
         </label>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-6">
          <p> timeout </p>
        </div>
        <div class="col-sm-6 pull-right">
          <div class="input-group">
            <input
              :disabled="!editable"
              v-model="timeoutMinute"
              type="text"
              class="form-control input-sm"
              style="width: 100%"
            >
            <span
              class="input-group-addon input-sm"
              style="width:10%"
            > min </span>
            <input
              :disabled="!editable"
              v-model="timeoutSecond"
              type="text"
              class="form-control input-sm"
              style="width: 100%"
            >
            <span
              class="input-group-addon input-sm"
              style="width:10%"
            > sec </span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-6">
          <p> default task redundancy </p>
        </div>
        <div class="col-sm-6 pull-right">
          <input
            :disabled="!editable"
            v-model="defaultRedundancy"
            type="text"
            class="form-control input-sm"
            />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-6">
          <p> change all current task redundancy to </p>
        </div>
        <div class="col-sm-6 pull-right">
          <input
            :disabled="!editable"
            v-model="currentRedundancy"
            type="text"
            class="form-control input-sm"
            />
        </div>
      </div>
      <div v-if="!editable">
        <button
        class="btn btn-sm btn-primary"
        @click="toggleEditable"
        >
        Edit
        </button>
      </div>
      <div v-else>
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


export default {

  props: {
    csrfToken: {
      type: String,
      default: null
    },
    config: {
      type: Object,
      default: () => ({sched: "default", rand_within_priority: false, sched_variants: []})
    },
    'taskTimeout': {
      type: Number
    },
    'taskRedundancy': {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      sched: this.config.sched,
      random: this.config.rand_within_priority,
      timeoutMinute: Math.floor(this.taskTimeout/60),
      timeoutSecond: this.taskTimeout%60,
      defaultRedundancy: this.taskRedundancy,
      editable: false,
      currentRedundancy: null
    };
  },



  methods: {
    getOptions() {
      var options = []
      var i;
      for (i = 0; i < this.config.sched_variants.length; i++){
        var opt = {
          text: this.config.sched_variants[i][1],
          value: this.config.sched_variants[i][0]
        }
        options.push(opt)
      }
      return options
    },

    toggleEditable() {
      console.log("toggle")
      this.editable = !this.editable;
    },

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    async save () {
      const _defaultRedundancy = parseInt(this.defaultRedundancy);
      const _currentRedundancy = parseInt(this.currentRedundancy);
      if (!this._isIntegerNumeric(_defaultRedundancy)){
        return ;
      }
      if (this.currentRedundancy && !this._isIntegerNumeric(_currentRedundancy)){
        return ;
      }
      try {
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 'task': {
            sched: this.sched,
            timeout: this.timeoutMinute*60 + this.timeoutSecond,
            default_redundancy: _defaultRedundancy,
            current_redundancy: _currentRedundancy,
            random: this.random
          }})
        });
        if (res.ok) {
          this.toggleEditable();
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
      } catch (error) {
        console.log("catch")
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    }
  }
};

</script>

