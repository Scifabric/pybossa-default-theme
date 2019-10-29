<template>
  <div class="row">
    <h4>Conditional display Settings</h4>
    <div class="col-md-12">
      <div class="row">
        <form>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label
                for="condition"
                class="col-form-label-sm"
              >
                Conditional display | <span class="label-tip">The condition that triggers the panel to display, if true.</span>
              </label>
              <input
                id="condition"
                :value="condition"
                :class="{'danger-validation':getErrors('condition')}"
                type="text"
                class="form-control form-control-sm"
                @input="updateCondition($event.target.value)"
              >
              <div class="danger-validation-text">
                {{ getErrors('condition') }}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.label-tip {
  font-style: italic;
  font-weight: 400;
  font-size: smaller;
}
.danger-validation {
  border-color: #d9534f;
}
.danger-validation-text {
  color: #d9534f;
}
</style>
<script>
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'ConditionaldisplayForm',
  computed: {
    ...mapState({
      condition: state => state.conditionalDisplay.condition
    })
  },
  methods: {
    ...mapMutations({
      'updateCondition': types.MUTATE_CONDITIONAL_DISPLAY_CONDITION
    }),
     getErrors (key) {
       const errors = this.$store.getters[types.GET_CONDITIONAL_DISPLAY_ERRORS];
      return (errors[key] || []).join('\n');
    }
  }
};
</script>
