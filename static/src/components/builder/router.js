import Questions from './components/Questions.vue';
import Header from './components/Header.vue';
import Content from './components/Content.vue';
import CheckboxForm from './components/CheckboxInput/CheckboxInputForm.vue';
import TextInputForm from './components/TextInput/TextInputForm.vue';
import TableForm from './components/Table/TableForm.vue';
import PreviewCommons from './components/PreviewCommons.vue';
import RadioForm from './components/RadioInput/RadioInputForm.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      default: Questions,
      header: Header
    }
  },
  {
    path: '/textinput',
    name: 'TEXT_INPUT',
    components: {
      default: Content,
      header: Header
    },
    children: [
      {
        path: 'form',
        name: 'TEXT_INPUT_FORM',
        components: { default: TextInputForm }
      },
      {
        path: 'preview',
        name: 'TEXT_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TEXT_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/radioinput',
    name: 'RADIO_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'RADIO_INPUT_FORM',
        components: { default: RadioForm }
      },
      {
        path: 'preview',
        name: 'RADIO_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'RADIO_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/checkboxinput',
    name: 'CHECKBOX_INPUT',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'CHECKBOX_INPUT_FORM',
        components: { default: CheckboxForm }
      },
      {
        path: 'preview',
        name: 'CHECKBOX_INPUT_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'CHECKBOX_INPUT_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/table',
    name: 'TABLE',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'form',
        name: 'TABLE_FORM',
        components: { default: TableForm }
      },
      {
        path: 'preview',
        name: 'TABLE_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'code',
        name: 'TABLE_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  {
    path: '/helper',
    name: 'HELPER',
    components: { default: Content, header: Header },
    children: [
      {
        path: 'timer/preview',
        name: 'TIMER_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'buttonRow/preview',
        name: 'BUTTON_ROW_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'taskPresenter/preview',
        name: 'TASK_PRESENTER_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'cancelButton/preview',
        name: 'CANCEL_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitButton/preview',
        name: 'SUBMIT_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitLastButton/preview',
        name: 'SUBMIT_LAST_BUTTON_PREVIEW',
        components: { default: PreviewCommons }
      },
      {
        path: 'timer/code',
        name: 'TIMER_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'buttonRow/code',
        name: 'BUTTON_ROW_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'taskPresenter/code',
        name: 'TASK_PRESENTER_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'cancelButton/code',
        name: 'CANCEL_BUTTON_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitButton/code',
        name: 'SUBMIT_BUTTON_CODE',
        components: { default: PreviewCommons }
      },
      {
        path: 'submitLastButton/code',
        name: 'SUBMIT_LAST_BUTTON_CODE',
        components: { default: PreviewCommons }
      }
    ]
  },
  { path: '/redirect-me', redirect: { name: 'home' } },
  { path: '*', redirect: '/' }
];
