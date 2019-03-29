<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <div
          v-if="selectedFields.length && Object.keys(users).length"
          class="form-inline"
        >
          <select
            v-model="user"
            class="form-control input-sm"
          >
            <option
              value=""
              disabled
              selected
            >
              Select User
            </option>
            <option value="project">
              project
            </option>
            <option
              v-for="(userName, id) in users"
              :key="id"
              :value="id"
            >
              {{ userName }}
            </option>
          </select>
          <select
            v-model="selectedField"
            class="form-control input-sm"
          >
            <option
              value=""
              disabled
              selected
            >
              Select Field
            </option>
            <option
              v-for="field in selectedFields"
              :key="field"
              :value="field"
            >
              {{ field }}
            </option>
          </select>
          <button
            class="btn btn-primary btn-sm"
            :disabled="waiting || !user || !selectedField"
            @click="show(selectedField, user, projectId)"
          >
            Show
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="waiting || stats.length"
      class="row"
    >
      <div class="col-xs-12">
        <gig-spinner v-if="waiting" />
        <component
          :is="displayComponent"
          v-else
          v-bind="fields[activeField].config"
          :stats="stats"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ConfusionMatrix from './confusion_matrix.vue';
import AccuracyTable from './accuracy_table.vue';
import GigSpinner from '../common/gig_spinner.vue';

export default {

  components: {
    ConfusionMatrix,
    AccuracyTable,
    GigSpinner
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Object,
      default: () => {}
    },
    projectId: Number
  },

  data () {
    return {
      user: '',
      selectedField: '',
      activeField: '',
      stats: [],
      displayComponent: null,
      waiting: false
    };
  },

  computed: {
    selectedFields () {
      return Object.keys(this.fields).sort();
    }
  },

  methods: {
    async show (selectedField, user, projectId) {
      this.waiting = true;
      this.activeField = selectedField;

      const url = new URL('/api/performancestats', window.location.href);
      if (user !== 'project') {
        url.searchParams.append('user_id', user);
      }
      url.searchParams.append('field', selectedField);
      url.searchParams.append('project_id', projectId);
      try {
        const res = await fetch(url);
        this.stats = await res.json();
      } catch (e) {
        this.stats = [];
        window.pybossaNotify('An Error Occurred.', true, 'error');
      } finally {
        this.waiting = false;
      }
      this.showStats();
    },

    showStats () {
      this.displayComponent = {
        'categorical': 'ConfusionMatrix',
        'freetext': 'AccuracyTable'
      }[this.fields[this.selectedField].type];
    }
  }
};
</script>
