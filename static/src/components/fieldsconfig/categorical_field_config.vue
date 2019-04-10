<template>
  <div class="categorical-field">
    <field-config-base
      :name="name"
      :type="type"
      :editable="true"
      @edit="editing=!editing"
    />
    <div class="labels">
      <h4>
        Labels: <span
          v-for="(label, index) in labels || []"
          :key="index"
          class="pill label label-primary"
        >{{ label }}</span>
      </h4>
    </div>
    <div
      v-if="editing"
      class="form-inline"
    >
      <p>Add single label or multiple comma separated labels. The labels must exactly match the possible values of the response field.</p>
      <div class="form-group">
        <input
          v-model="newLabel"
          type="text"
          class="form-control input-sm"
        >
        <div
          class="btn btn-sm btn-primary"
          @click="addLabels(false)"
        >
          Add Single
        </div>
        <div
          class="btn btn-sm btn-primary"
          @click="addLabels(true)"
        >
          Add Many
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import FieldConfigBase from './field_config_base.vue';

export default {

  components: {
    FieldConfigBase
  },

  props: {
    name: String,
    type: String,
    labels: Array,
    edit: Boolean
  },
  data () {
    return {
      editing: this.edit,
      newLabel: undefined
    };
  },

  methods: {
    ...mapMutations(['addFieldConfig']),

    addLabels (split) {
      let newLabels;
      if (split) {
        newLabels = this.newLabel
          .split(',')
          .map((token) => token.trim());
      } else {
        newLabels = [this.newLabel];
      }

      const dedupe = {};
      newLabels.forEach((el) => {
        dedupe[el] = true;
      });
      newLabels = Object.keys(dedupe)
        .filter((el) => !this.labels.includes(el));

      this.addFieldConfig({
        name: this.name,
        config: {
          labels: this.labels.concat(newLabels).sort()
        }
      });
      this.newLabel = undefined;
    }
  }
};
</script>
<style>
.pill {
    margin-right: 0.3em;
    display: inline-block
}
</style>
