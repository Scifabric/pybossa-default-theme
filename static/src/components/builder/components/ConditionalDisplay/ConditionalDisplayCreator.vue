<template>
  <div class="row">
    <input
      id="condition"
      v-model="condition"
      class="form-control-sm"
      type="checkbox"
    >If this checkbox is checked the conditional display will show the content.
    <conditional-display
      :condition="condition"
    >
      <h2>Content Displayed!</h2>
    </conditional-display>
  </div>
</template>
<script>
import components from '@dtwebservices/task-presenter-components';
export default {
  name: 'ConditionaldisplayCreator',
  components: { ...components },
  data () {
    return { condition: false };
  }
};
</script>
