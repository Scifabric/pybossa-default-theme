<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div class="form-group row">
        <div class="col-md-6">
          <p> Task Scheduler </p>
        </div>
        <div class="col-md-6 pull-right">
          <select
            v-model="sched"
            class="form-control input-sm"
          >
            <option
              v-for="opt in sched_variants"
              :key="opt[0]"
              :value="opt[0]"
            >
              {{ opt[1] }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Randomize Order With Same Priority </p>
        </div>
        <div class="col-md-6 pull-right">
          <label class="switch">
            <input
              v-model="random"
              type="checkbox"
            >
            <span class="slider" />
          </label>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Timeout </p>
        </div>
        <div class="col-md-6 pull-right">
          <div class="input-group">
            <input
              id="timeout-form"
              v-model="timeoutMinute"
              type="text"
              class="form-control input-sm"
            >
            <span
              class="input-group-addon input-sm"
            > min </span>
            <input
              id="timeout-form"
              v-model="timeoutSecond"
              type="text"
              class="form-control input-sm"
            >
            <span
              class="input-group-addon input-sm"
            > sec </span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Default Task Redundancy </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="defaultRedundancy"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-6">
          <p> Change All Current Task Redundancy To </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="currentRedundancy"
            type="text"
            class="form-control input-sm"
          >
        </div>
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

export default {
  data () {
    return {
      csrfToken: "",
      sched: "",
      sched_variants: null,
      random: false,
      timeoutMinute: Math.floor(this.taskTimeout / 60),
      timeoutSecond: this.taskTimeout % 60,
      defaultRedundancy: null,
      currentRedundancy: null
    };
  },

  mounted: function () {
    this.getData()
  },

  methods: {

    getURL (keyword) {
      let path = window.location.pathname
      let res = path.split("/");
      res[res.length-1] = keyword
      return res.join("/")
    },

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    async getData () {
      try {
        const res = await fetch(this.getURL("tasks/redundancy"), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.defaultRedundancy = data.default_form.default_n_answers
        this.csrfToken = data.default_form.csrf
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      try {
        const res = await fetch(this.getURL("tasks/timeout"), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.timeoutMinute = data.form.minutes
        this.timeoutSecond = data.form.seconds
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

      try {
        const res = await fetch(this.getURL("tasks/scheduler"), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.sched = data.form.sched
        this.random = data.form.rand_within_priority
        this.sched_variants = data.sched_variants
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

    async save () {
      const _defaultRedundancy = parseInt(this.defaultRedundancy);
      const _currentRedundancy = parseInt(this.currentRedundancy);
      if (!this._isIntegerNumeric(_defaultRedundancy)) {
        return;
      }
      if (this.currentRedundancy && !this._isIntegerNumeric(_currentRedundancy)) {
        return;
      }
      let data = {
            sched: this.sched,
            minutes: this.timeoutMinute,
            seconds: this.timeoutSecond,
            default_n_answers: _defaultRedundancy,
            n_answers: _currentRedundancy,
            rand_within_priority: this.random
            };
      try {
        const timeoutRes = await fetch(this.getURL('tasks/timeout'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        const redundancyRes = await fetch(this.getURL('tasks/redundancy'), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        const schedulerRes = await fetch('tasks/scheduler', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify(data)
        });
        if (timeoutRes.ok && redundancyRes.ok && schedulerRes.ok) {
          window.pybossaNotify('task data Saved.', true, 'success');
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
<style scoped>
.input-group-addon {
  width: 10%
}
#timeout-form {
  width:100%
}
</style>
