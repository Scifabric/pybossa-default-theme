<template>
  <div class="row">
    <div
      v-for="(radio, i) in radioList"
      :key="i"
      class="col-md-12"
    >
      <div class="radio">
        <label :for="radio.id">
          <radio-input
            :id="radio.id"
            :value="radio.value"
            :pyb-answer="pybAnswer"
            :initial-value="!!initialValue && (initialValue == radio.value)"
            :name="name"
          />
          {{ radio.label }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import components from '@dtwebservices/task-presenter-components';
export default {
  name: 'RadioCreator',
  components: { ...components },
  props: {
    name: {
      type: String
    },
    initialValue: {
      type: String
    },
    pybAnswer: {
      type: String
    },
    radioList: {
      type: Array
    }
  }
};
</script>
