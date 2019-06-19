<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import TableCreator from '../Table/TableCreator.vue';
import CheckboxCreator from '../CheckboxInput/CheckboxCreator.vue';
import RadioCreator from '../RadioInput/RadioCreator.vue';
import { ClientTable } from 'vue-tables-2';
import componentStates from './states';

Vue.use(ClientTable, {});

export default {
  name: 'ComponentRender',
  components: { ...components, TableCreator, CheckboxCreator, RadioCreator },
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

  data () {
    return {
      inProgress: true
    };
  },

  async mounted () {
    const { intervalSeconds, states } = componentStates[this.selectedComponent] || componentStates.default;

    // If there is just a single state then set it and return.
    if (!Array.isArray(states)) {
      return this.$store.commit(
        'TASK_PRESENTER/MERGE_STATE',
        states
      );
    }

    // Otherwise loop over all the states forever.
    const it = iterator();

    while (this.inProgress) {
      this.$store.commit(
        'TASK_PRESENTER/MERGE_STATE',
        it.next().value
      );

      await seconds(intervalSeconds);
    }

    function* iterator () {
      while (true) {
        yield * states;
      }
    }

    function seconds (num) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, num * 1000);
      });
    }
  },

  beforeDestroy () {
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
      } else if (this.selectedComponent === 'radio-creator') {
        return {
          name: 'radio-creator',
          attrs: { id: 'test' },
          props: {
            radioList: this.form.radioList,
            pybAnswer: this.form.pybAnswer,
            initialValue: this.form.initialValue,
            name: this.form.name
          }
        };
      } else if (this.selectedComponent === 'text-tagging') {
        return {
          name: 'text-tagging',
          attrs: { id: 'test' },
          props: {
            readOnly: this.form.readOnly,
            pybAnswer: this.form.pybAnswer,
            tags: this.form.tagList.reduce((acc, tag)=> (acc[tag.name] = tag, acc), {}),
            text: this.form.text.preview,
            nlpnedEntities: this.form.entities.preview
          }
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
      }
      return {};
    }
  },
  render (h) {
    if (this.form.isValidForm.isValid) {
      return h(this.selectedComponent, {
        ...this.renderFunctions()
      });
    }

    const message = (this.form.isValidForm.messages || ['No preview available']).join('\n');

    return h('span', { attrs: { style: 'white-space: pre' } }, message);
  }
};
</script>
