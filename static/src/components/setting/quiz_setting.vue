<template>
 <div class="stats-config row">
    <div class="col-sm-12">
      <div class="form-group row">
        <div class="col-sm-6 ">
         <p> quiz status </p>
        </div>
        <div class="col-sm-6 pull-right">
          <label class="switch">
            <input type="checkbox" v-model="enabled">
            <span class="slider"></span>
         </label>
        </div>
      </div>
      <div v-if="enabled" class="form-group row">
        <div class="col-sm-6">
          <p> number of questions per quiz  </p>
        </div>
        <div class="col-sm-6 pull-right">
          <input
            v-model="questions"
            type="text"
            class="form-control input-sm"
            />
        </div>
      </div>
      <div v-if="enabled" class="form-group row">
        <div class="col-sm-6">
          <p> number of correct answers to pass quiz  </p>
        </div>
        <div class="col-sm-6 pull-right">
          <input
            v-model="passing"
            type="text"
            class="form-control input-sm"
            />
        </div>
      </div>
      <div v-if="enabled" class="form-group row">
        <div class="col-sm-6">
          <p> quiz completion mode </p>
        </div>
        <div class="col-sm-6">
          <select v-model="mode"  class="form-control input-sm" >
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
      {{allUserQuiz}}
      <table id="quiz_result_table" class="table table-bordered table-striped table-hover" style="margin-top:15px">
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
          <tr v-for="user in users" :key="user.id" :value="user">
            <td>{{user.fullname}}</td>
            <td>{{user.quiz.config.enabled}}</td>
            <td>{{user.quiz.status}}</td>
            <td>{{user.quiz.result.right}}</td>
            <td>{{user.quiz.result.wrong}}</td>
            <td>{{user.quiz.config.questions}}</td>
            <td>{{user.quiz.config.passing}}</td>
            <td>
              <button v-if="!resetUser.includes(user.id)" class="btn btn-sm btn-primary" @click="reset($event, user.id)">Reset</button>
              <button v-else class="btn btn-sm btn-primary active" @click="reset($event, user.id)">Reset</button>
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

  props: {
    csrfToken: {
      type: String,
      default: null
    },
    config: {
      tyoe: Object,
      default: () => ({ enabled: false, questions: 0, passing: 0, complete_mode: null, short_circuit: false, mode_choices: []})
    },
    allUserQuiz: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      enabled: this.config.enabled,
      questions: this.config.questions,
      passing: this.config.passing,
      mode: this.config.completion_mode,
      resetUser: [],
      users: {},
    };
  },

  mounted: function() {
    var _this = this
    _this.users = _this.getQuizUser()
  },

  methods: {

    getOptions(){
      var options = []
      var i;
      for (i = 0; i < this.config.mode_choices.length; i++){
        var opt = {
          text: this.config.mode_choices[i][1],
          value: this.config.mode_choices[i][0]
        }
        options.push(opt)
      }
      return options
    },

    getQuizUser() {
      var users = {}
      for (var i=0; i<this.allUserQuiz.length; i++) {
        var u = this.allUserQuiz[i]
        if (u.quiz.status === "bg-success"){
          u.quiz.status = 'pass'
        }
        else if (u.quiz.status === "bg-danger"){
          u.quiz.status = 'fail'
        }
        users[u.id] = u
      }
      return users
    },

   reset (event, id) {
     this.resetUser.push(id)
   },

    _isIntegerNumeric: function (_n) {
        return Math.floor(_n) === _n;
    },

    async save () {
      const _questions = parseInt(this.questions)
      const _passing = parseInt(this.passing)
      if (!this._isIntegerNumeric(_questions) || !this._isIntegerNumeric(_passing)){
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
          body: JSON.stringify({ 'quiz': {
            config: {
              enabled: this.enabled,
              questions: _questions,
              passing: _passing,
              completion_mode: this.mode
            },
            reset: this.resetUser
          }})
        });
        if (res.ok) {
          window.pybossaNotify('quiz data Saved.', true, 'success');
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
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #26abe3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.field-config-wrapper {
    margin-bottom: 0.5em;
}
</style>
