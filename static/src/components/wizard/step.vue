<template>
  <div class="stepwizard-step" :class="activeClass">
    <a
      role="button"
      :class="stepClass"
      :href="href"
    >
      <i
        :class="iconClass"
        aria-hidden="false"
      />
    </a>
    <div class="stepwizard-label">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: {
    done: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    enable: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
      stepClass: function () {
          let classes = 'btn btn-circle btn-lg';
          classes = this.enable ? `${classes} btn-border` : classes;
          classes = this.done ? `${classes} step-done` : classes;
          classes = !this.done && !this.enable ? `${classes} step-disable` : classes;

        return classes;
      },
      iconClass: function () {
          if (this.done) {
            return `${this.icon} icon-white`;
          }
          if (this.enable) {
            return `${this.icon} icon-blue`;
          }
          return `${this.icon} icon-default`;
      },
      activeClass: function () {
        return this.active ? 'active' : '';
      }
  }

};
</script>

<style>
.stepwizard-step {
    display: table-cell;
    text-align: center;
    position: relative;
}

.stepwizard-step.active a {
  box-shadow: 0 0 0 4px lightblue;
}

.stepwizard-step.active .stepwizard-label {
  font-weight: bold;
  color: #3498db;
}

.stepwizard-step > .btn-circle {
  width: 50px;
  height: 50px;
  text-align: center;
  padding: 14px 16px;
  font-size: 1.2em;
  border-radius: 35px;
  background-color: white;
  border-color: #ccc;
  line-height: 1;
  z-index: 0;
  outline: 0;
}

.stepwizard-step > div {
    color: #666;
    text-align: center;
    width: 100%;
}

.stepwizard-step > .btn-circle:active:focus {
  outline: 0;
}
.stepwizard-step > .btn-circle.btn-border {
  border-color: #3498db;
}

.stepwizard-step >.btn-circle.step-done {
  background-color: #3498db;
}

.stepwizard-step > .btn-circle.step-disable {
  cursor:auto;
}

.stepwizard-step > .btn-circle > .icon-color::before {
    color: #546e7b;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stepwizard-step > .btn-circle > .icon-white::before {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepwizard-step > .btn-circle > .icon-blue {
    color: #3498db;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stepwizard-step > .btn-circle > .icon-default{
    color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>
