<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import TableCreator from './Table/TableCreator.vue';
import CheckboxCreator from './CheckboxInput/CheckboxCreator.vue';
import { ClientTable } from 'vue-tables-2';

Vue.use(ClientTable, {});

const states = [
  {
    taskId: 1,
    message: { text: '' },
    active: true,
    status: {
      quizInProgress: true,
      projectCompleted: false,
      quizPassed: false,
      taskInProgress: false
    },
    alerts: {
      quizStarted: true,
      projectCompleted: false
    },
    progress: {
      total: 5,
      done: 0,
      remaining_for_user: 100,
      remaining: 100,
      quiz: {
        result: {
          right: 0,
          wrong: 0
        },
        status: 'in_progress',
        config: {
          enabled: true,
          questions: 10,
          pass: 5,
          short_circuit: true
        }
      }
    },
    expiration: {
      get seconds() {
        return Math.trunc(Date.now() / 1000) + 30;
      }
    }
  },
  {
    alerts: {
      quizStarted: false
    }
  },
  {
    taskId: 2,
    active: true,
    message: {
      text: 'You got it right',
      type: 'alert-success'
    },
    progress: {
      quiz: {
        result: {
          right: 1
        }
      }
    }
  },
  {
    taskId: 3,
    active: true,
    message: {
      text: 'You got it wrong',
      type: 'alert-danger'
    },
    progress: {
      quiz: {
        result: {
          wrong: 1
        }
      }
    }
  },
  {
    taskId: 4,
    active: true,
    message: {
      text: 'You got it right',
      type: 'alert-success'
    },
    progress: {
      quiz: {
        result: {
          right: 2
        }
      }
    }
  },
  {
    taskId: 5,
    active: true,
    message: {
      text: 'You got it right',
      type: 'alert-success'
    },
    progress: {
      quiz: {
        result: {
          right: 3
        }
      }
    }
  },
  {
    taskId: 6,
    active: true,
    message: {
      text: 'You got it right',
      type: 'alert-success'
    },
    progress: {
      quiz: {
        result: {
          right: 4
        }
      }
    }
  },
  {
    taskId: 7,
    active: true,
    message: {
      text: 'You got it right',
      type: 'alert-success'
    },
    status: {
      quizPassed: true
    },
    alerts: {
      quizPassed: true
    },
    progress: {
      quiz: {
        result: {
          right: 5
        },
        status: 'passed'
      }
    }
  },
  {
    taskId: 8,
    active: true,
    message: {
      text: '',
      type: 'alert-success'
    },
    status: {
      quizInProgress: false,
      taskInProgress: true
    },
    alerts: {
      quizPassed: false
    }
  },
  {
    taskId: 9,
    active: true,
    progress: {
      done: 1
    }
  },
  {
    taskId: 10,
    active: true,
    progress: {
      done: 2
    }
  },
  {
    taskId: 11,
    active: true,
    progress: {
      done: 3
    }
  },
  {
    taskId: 12,
    active: true,
    progress: {
      done: 4
    }
  },
  {
    taskId: 13,
    active: true,
    status: {
      projectCompleted: true
    },
    alerts: {
      projectCompleted: true
    },
    progress: {
      done: 5
    }
  }
];


export default {
  name: 'ComponentRender',
  components: { ...components, TableCreator, CheckboxCreator },
  props: {
    form: {
      type: Object,
      default: function () {
        return { label: {}, isValidForm: true };
      }
    },
    selectedComponent: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      inProgress: true
    };
  },

  async mounted() {
      const it = iterator();

      while (this.inProgress) {
        this.$store.commit(
          'TASK_PRESENTER/MERGE_STATE',
          it.next().value
        );

        await seconds(2);
      }

      function* iterator() {
        while(true) {
          yield* states;
        }
      }

      function seconds(num) {
        return new Promise(function(fulfill, reject) {
          window.setTimeout(fulfill, num * 1000);
        });
      }
  },

  beforeDestroy() {
    this.inProgress = false;
  },

  methods: {
    renderFunctions: function () {
      if (this.selectedComponent === 'text-input') {
        return {
          name: 'text-input',
          attrs: { id: this.id },
          props: { 'pyb-answer': this.form['pyb-answer'] }
        };
      } else if (this.selectedComponent === 'checkbox-creator') {
        return {
          name: 'checkbox-creator',
          attrs: { id: 'test' },
          props: { checkboxList: this.form.checkboxList }
        };
      } else if (this.selectedComponent === 'table-creator') {
        const data = this.form.data.isVariable
          ? [{}]
          : this.form.data.list;
        return {
          name: 'table-creator',
          props: {
            form: {
              columns: this.form.columns,
              data,
              options: { ...this.form.options },
              name: 'TableCreator'
            }
          }
        };
      } else if (this.selectedComponent === 'task-timer') {
        return {
          name: 'task-timer',
          props: {
            granularity: this.form.granularity
          }
        };
      }
      return {};
    }
  },
  render (h) {
    if (this.form.isValidForm) {
      return h(this.selectedComponent, {
        ...this.renderFunctions()
      });
    } else {
      return h('span', null, 'No preview available');
    }
  }
};
</script>
