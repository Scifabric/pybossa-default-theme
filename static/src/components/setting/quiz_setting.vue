/* eslint-disable vue/no-v-html */
<template>
  <div v-if="dataLoaded">
    <label>
      Number of gold tasks: {{ model.n_gold_unexpired }}
    </label>
    <p>
      In order to enable and configure quiz mode, this project must have at least one gold question. Please click
      <a
        href="/project/test-public-quiz-vue/make-random-gold"
      >here</a> to create gold questions.
    </p>
    <vue-form-generator
      ref="formTest"
      :schema="schema"
      :model="model"
      :options="formOptions"
      @validated="onValidated"
      @model-updated="onModelUpdate"
    />
    <table-quiz
      :users="users"
      :model="model"
      @updateUsers="updateUsers"
    />
    <div>
      <button
        :disabled="!validForm"
        class="btn btn-sm btn-primary"
        @click="save"
      >
        Save
      </button>
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.test-hide {
  display: none
}
</style>
<script>
import './form.css';

import VueFormGenerator from './quiz_form_validators';
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import TableQuiz from './quiz_result_table.vue';

Vue.component('multiselect', Multiselect);
Vue.component('table-quiz', TableQuiz);

export default {
  components: {
        'vue-form-generator': VueFormGenerator.component },
  data () {
    return {
      csrfToken: null,
      users: {},
      dataLoaded: false,
      validForm: false,
      model: {
        n_gold_unexpired: 0,
        enabled: false,
        questions: 0,
        passing: 0,
        completion_mode: '' },
        schema: {
              fields: [
                {
                        type: 'switch',
                        label: 'Make workers have to pass the quizzes to proceed',
                        model: 'enabled',
                        multi: true,
                        default: false,
                        textOn: 'Quiz On',
                        textOff: 'Quiz Off',
                        validator: ['enabledValidation'] },
                     {
                        type: 'input',
                        inputType: 'number',
                        label: 'Number of questions per quiz',
                        model: 'questions',
                        min: 1,
                        required: true,
                        validator: ['minQuestions', VueFormGenerator.validators.number] },
                      {
                        id: 'passing',
                        type: 'input',
                        inputType: 'number',
                        label: 'Number of correct answers to pass quiz',
                        model: 'passing',
                        min: 1,
                        required: true,
                        validator: ['maxPassingQuestions', VueFormGenerator.validators.number]
                      },
                      {
                        type: 'select',
                        label: 'Finish the quiz session when:',
                        model: 'completion_mode',
                        required: true,
                        values: function () {
                          return [
                            { id: 'all_questions', name: 'all questions answered' },
                            { id: 'short_circuit', name: 'pass/fail is identified' }
                          ];
                        },
                        default: 'short_circuit'
                        }
            ]
        },
        formOptions: {
                      validateAfterLoad: true,
                      validateAfterChanged: true,
                      validationErrorClass: 'quiz-error'

        }
      };
  },
  created () {
    this.getData();
  },

  methods: {
    initialize (data) {
      this.model.n_gold_unexpired = data.n_gold_unexpired;
      this.csrfToken = data.csrf;
      this.users = this.getQuizUser(data.all_user_quizzes);
      this.model.enabled = data.form.enabled;
      this.model.questions = data.form.questions;
      this.model.passing = data.form.passing;
      this.model.completion_mode = data.form.completion_mode;
      this.dataLoaded = true;
},
  onValidated (isValid, errors) {
    this.validForm = isValid;
    console.log('Validation result: ', isValid, ', Errors:', errors);
  },
  onModelUpdate () {
    // fix this force update
        this.$refs.formTest.$children[1].$children[0].validate();
        this.$refs.formTest.$children[2].$children[0].validate();
  },

    updateUsers (user) {
      this.users[user.id] = user;
    },

    getQuizUser (allUserQuiz) {
      var users = {};
      for (var i = 0; i < allUserQuiz.length; i++) {
        var u = allUserQuiz[i];
        u.quiz.config.reset = false;
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
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
              enabled: this.model.enabled,
              questions: this.model.questions,
              passing: this.model.passing,
              completion_mode: this.model.completion_mode,
              users: Object.values(this.users)
          })
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          window.pybossaNotify(data['flash'], true, data['status']);
        } else {
          window.pybossaNotify('An error occurred configuring quiz config.', true, 'error');
        }
      } catch (error) {
        window.pybossaNotify('An error occurred configuring quiz config.', true, 'error');
      }
     }
  }
};
</script>
