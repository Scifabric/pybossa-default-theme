<template>
  <div class="row">
    <div class="form-row">
      <div class="form-group col-md-12">
        <div>
          <label
            class="col-labels"
          >
            Validations | <span class="label-tip">Validations to be applied before submitting the task.</span>
          </label>
          <multiselect
            :value="validations"
            :options="validationOptions"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Select Validations"
            label="name"
            track-by="name"
            :preselect-first="true"
            @input="updateValidations($event)"
          >
            <template
              slot="selection"
              slot-scope="{ values, search, isOpen }"
            >
              <span
                v-if="values.length &amp;&amp; !isOpen"
                class="multiselect__single"
              >{{ values.length }} options selected</span>
            </template>
          </multiselect>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../../css/multiselect_overwrite_colors.css';
import Multiselect from 'vue-multiselect';
export default {
  name: 'Validator',
  components: { Multiselect },
  props: {
    validations: Array,
    validationOptions: Array,
    updateValidations: Function
  }
};
</script>
