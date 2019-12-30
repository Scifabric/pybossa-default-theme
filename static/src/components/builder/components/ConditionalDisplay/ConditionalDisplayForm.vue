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
                Conditional display | <span class="label-tip">The condition that triggers the panel to display, if true.  (e.g. answer.field === 'yes')</span>
              </label>
              <input
                id="condition"
                placeholder="answer.field === 'yes'"
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
<script>
import '../../../../../css/component_builder.css'
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
