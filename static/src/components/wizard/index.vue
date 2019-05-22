<template>
  <div class="pad-from-nav">
    <div class="stepwizard ">
      <div
        class="stepwizard-row "
      />

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
    </div>
  </div>
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

.pad-from-nav{
  padding-top: 20px
}

.stepwizard-row {
    display: flex;
    justify-content: space-between;
    padding-top: 20px
}

.stepwizard {
    margin-top:20px;
    display: table;
    width: 100%;
    position: relative;
}

.stepwizard-row:before {
    top: 25px;
    bottom: 0;
    position: absolute;
    content:" ";
    width: 100%;
    height: 1px;
    background-color: #ccc;
}

</style>
