<template>
  <nav class="stepwizard ">
    <step
      v-for="tab in steps.list"
      :key="tab.id"
      :step-number="0"
      :active="tab.active"
      :enable="tab.enable"
      :href="tab.href"
      :title="tab.title"
      :icon="tab.icon"
      :fetch-page="tab.fetchPage"
      :done="tab.done"
    />
  </nav>
</template>

<script>
import step from './step.vue';
export default {
  name: 'Wizard',
  components: {
    step
  },
  props: {
    steps: {
      type: Object,
      default: () => { return { list: [] }; }
    }
  }
};
</script>

<style>

.stepwizard {
    margin-top: 40px;
    display: flex;
    width: 100%;
    position: relative;
    justify-content: space-between;
}

.stepwizard:before {
    top: 25px;
    bottom: 0;
    position: absolute;
    content:" ";
    width: 100%;
    height: 1px;
    background-color: #ccc;
}

</style>
