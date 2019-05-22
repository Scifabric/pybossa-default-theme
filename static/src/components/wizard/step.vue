<template>
  <div class="stepwizard-step">
    <button
      role="button"
      :class="stepClass"
      @click="fetchPage"
    >
      <i
        :class="iconClass"
        aria-hidden="false"
      />
    </button>
    <span :class="activeClass">
      {{ title }}
    </span>
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
          if (this.active || this.enable) {
            classes = `${classes} btn-border`;
          }
          if (this.done) {
            classes = `${classes} step-done`;
          } else {
            classes = `${classes} step-disable`;
          }
        return classes;
      },
      iconClass: function () {
          if (this.done) {
            return `${this.icon} icon-white`;
          }
          if (this.active || this.enable) {
            return `${this.icon} icon-blue`;
          }
          return `${this.icon} icon-default`;
      },
      activeClass: function () {
        let activeClass = '';
        if (this.active) {
            activeClass = 'active-title';
        }
        return activeClass;
      }
  },
  methods: {
      fetchPage: function () {
          window.location.href = `${window.location.origin}${this.href}`;
      }
  }

};
</script>

<style>
.active-title {
font-weight: bold!important;
color: #3AB0D5!important;
}

.stepwizard-step {
    display: table-cell;
    text-align: center;
    position: relative;
}
.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 12px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  text-align: center;
  padding: 14px 16px;
  font-size: 18px;
  line-height: 1.33;
  border-radius: 35px;
  background-color: white;
  border-color: #ccc;
  z-index:0;

}

.btn-border {
  border-color: #3AB0D5!important
}

.stepwizard-step > span {
    color: #666;
    position: absolute;
    left: 0;
    top: 3.5em;
    text-align: center;
    width: 100%;
    padding: 0 25%;
}

.step-done {
  background-color: #3AB0D5!important
}

.step-disable{
  background-color: #ccc
}

.icon-color::before {
    color: #546e7b;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-white::before {
  color: white;
  display: flex;
    align-items: center;
    justify-content: center;
  }

.icon-blue{
    color: #3AB0D5;
    display: flex;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;}

.icon-default{
    color: #ccc;
    display: flex;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;}

</style>
