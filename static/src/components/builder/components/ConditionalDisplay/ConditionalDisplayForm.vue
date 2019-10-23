<template>
  <div class="row">
    <h4>Text Input Settings</h4>
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
                class="form-control form-control-sm"
                type="text"
                @input="updateCondition($event.target.value)"
              >
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
</style>
<script>
import * as types from '../../store/types';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'CondditionalDisplayForm',
  computed: {
    ...mapState({
      condition: state => state.conditionalDisplay['condition']
    })
  },
  methods: {
    ...mapMutations({
      'updateCondition': types.MUTATE_CONDITIONAL_DISPLAY_CONDITION
    })
  }
};
</script>
