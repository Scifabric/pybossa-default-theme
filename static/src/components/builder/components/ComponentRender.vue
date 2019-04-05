<script>
import Vue from 'vue';
import components from '@dtwebservices/task-presenter-components';
import TableCreator from './Table/TableCreator.vue';
import CheckboxCreator from './CheckboxInput/CheckboxCreator.vue';
import { ClientTable } from 'vue-tables-2';

Vue.component('static-task-timer', {
  template: '<p>Time Remaining: 59 minute s, 43 seconds</p>'
});

Vue.use(ClientTable, {});

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
