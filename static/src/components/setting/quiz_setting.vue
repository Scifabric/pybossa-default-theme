<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div class="form-group row">
        <div class="col-md-6 ">
          <p> Quiz Status </p>
        </div>
        <div class="col-md-6 pull-right">
          <label class="switch">
            <input
              v-model="enabled"
              type="checkbox"
            >
            <span class="slider" />
          </label>
        </div>
      </div>
      <div
        v-if="enabled"
        class="form-group row"
      >
        <div class="col-md-6">
          <p> Number Of Questions Per Quiz  </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="questions"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div
        v-if="enabled"
        class="form-group row"
      >
        <div class="col-md-6">
          <p> Number Of Correct Answers To Pass Quiz  </p>
        </div>
        <div class="col-md-6 pull-right">
          <input
            v-model="passing"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div
        v-if="enabled"
        class="form-group row"
      >
        <div class="col-md-6">
          <p> Quiz Completion Mode </p>
        </div>
        <div class="col-md-6">
          <select
            v-model="mode"
            class="form-control input-sm"
          >
            <option
              v-for="opt in mode_choices"
              :key="opt[0]"
              :value="opt[0]"
            >
              {{ opt[1] }}
            </option>
          </select>
        </div>
      </div>
      <br>
      <table
        id="quiz_result_table"
        class="table table-bordered table-striped table-hover"
      >
        <thead>
          <tr>
            <th>User</th>
            <th>Enabled</th>
            <th>Status</th>
            <th>Right</th>
            <th>Wrong</th>
            <th>Questions</th>
            <th>Passing</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            :value="user"
          >
            <td>{{ user.fullname }}</td>
            <td>{{ user.quiz.config.enabled }}</td>
            <td>{{ user.quiz.status }}</td>
            <td>{{ user.quiz.result.right }}</td>
            <td>{{ user.quiz.result.wrong }}</td>
            <td>{{ user.quiz.config.questions }}</td>
            <td>{{ user.quiz.config.passing }}</td>
            <td>
              <button
                v-if="!resetUser.includes(user.id)"
                class="btn btn-sm btn-primary"
                @click="reset($event, user.id)"
              >
                Reset
              </button>
              <button
                v-else
                class="btn btn-sm btn-primary active"
              >
                Reset
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
      csrfToken: null,
      enabled: false,
      questions: null,
      passing: null,
      mode: null,
      mode_choices: [],
      resetUser: [],
      users: {}
    };
  },

  created () {
    this.getData();
  },

  methods: {

    initialize (data) {
      this.csrfToken = data.csrf;
      this.users = this.getQuizUser(data.all_user_quizzes);
      this.mode_choices = data.quiz_mode_choices;
      this.enabled = data.form.enabled;
      this.questions = data.form.questions;
      this.passing = data.form.passing;
      this.mode = data.form.completion_mode;
    },

    getQuizUser (allUserQuiz) {
      var users = {};
      for (var i = 0; i < allUserQuiz.length; i++) {
        var u = allUserQuiz[i];
        users[u.id] = u;
      }
      return users;
    },

    getURL () {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = 'quiz-mode';
      return res.join('/');
    },

   reset (event, id) {
     this.resetUser.push(id);
   },

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    async getData () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

    async save () {
      try {
        const _questions = parseInt(this.questions);
        const _passing = parseInt(this.passing);
        if (this.enabled && (!this._isIntegerNumeric(_questions) || !this._isIntegerNumeric(_passing))) {
          throw Error('Parameter is not a number!');
        }
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
              enabled: this.enabled,
              questions: this.questions,
              passing: this.passing,
              completion_mode: this.mode,
              reset: this.resetUser
          })
        });
        if (res.ok) {
          const data = await res.json();
          window.pybossaNotify(data['flash'], true, data['status']);
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
