<template>
  <div>
    <table
      v-if="Object.values(users).length > 0"
      id="quiz_result_table"
      class="table table-bordered table-striped table-hover"
    >
      <thead>
        <tr>
          <th>
            <input
              id="all"
              type="checkbox"
              :value="allRowsSelected"
              :checked="allRowsSelected"
              @change="updateAllEnable($event)"
            >
            Enable
          </th>
          <th>User</th>
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
          <td>
            <input
              :id="user.id"
              v-model="user.quiz.config.enabled"
              :value="user.quiz.config.enabled"
              :check="user.quiz.config.enabled"
              type="checkbox"
              @change="checkEnable($event, user.id)"
            >{{ user.quiz.config.enabled ? ' Must pass' : ' No quiz' }}
          </td>

          <td>{{ user.fullname }}</td>
          <td :class="{'bg-success': user.quiz.status == 'passed', 'bg-danger': user.quiz.status == 'failed' }">
            {{ getStatus(user) }}
          </td>
          <td>{{ !user.quiz.config.reset ? user.quiz.result.right : 0 }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.result.wrong : 0 }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.config.questions : model.questions }}</td>
          <td>{{ !user.quiz.config.reset ? user.quiz.config.passing : model.passing }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              @click="user.quiz.config.reset = !user.quiz.config.reset"
            >
              {{ users[user.id].quiz.config.reset ? 'Undo' : 'Reset' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: ['model', 'users'],
  data () {
    return { };
  },
  computed: {
    allRowsSelected () {
      for (let id in this.users) {
        if (!this.users[id].quiz.config.enabled) {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    getStatus: function (user) {
      let status = user.quiz.status;
      if (user.quiz.config.reset) {
        status = user.quiz.config.enabled ? 'in_progress' : 'not_started';
      }
      return status;
    },

    updateUsers (user) {
      this.$emit('updateUsers', user);
    },

    checkEnable (event, id) {
      this.updateUsers(this.users[id]);
    },

    updateAllEnable (event) {
      Object.values(this.users).forEach((user) => {
            user.quiz.config.enabled = event.target.checked;
            this.updateUsers(this.users[user.id]);
      });
    },

    reset (event, id) {
      this.users[id].quiz.config.reset = !this.users[id].quiz.config.reset;
      this.updateUsers(this.users[id]);
    }
  }
};
</script>
