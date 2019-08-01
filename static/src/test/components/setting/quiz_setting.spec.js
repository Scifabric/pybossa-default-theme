
import { shallowMount, createLocalVue } from '@vue/test-utils';
import quizConfig from '../../../components/setting/quiz_setting.vue';

const localVue = createLocalVue();

describe('quizConfig', () => {
  let fetch;
  let notify;
  let propsData;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('render fields - switch quiz mode', () => {
    propsData = {
      csrfTRoken: null,
      config: {
        enabled: false,
        questions: 0,
        passing: 0,
        complete_mode: null,
        short_circuit: false,
mode_choices: []
      },
      allUserQuiz: []
    };
    const wrapper = shallowMount(quizConfig, { propsData });
    expect(wrapper.findAll('p')).toHaveLength(1);
  });

  it('render fields - enabled quiz mode', () => {
    propsData = {
      csrfTRoken: null,
      config: {
        enabled: true,
        questions: 0,
        passing: 0,
        complete_mode: null,
        short_circuit: false,
mode_choices: []
      },
      allUserQuiz: []
    };
    const wrapper = shallowMount(quizConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(4);
  });

  it('render users quiz stats', () => {
    propsData = {
      csrfTRoken: null,
      config: {
        enabled: false,
        questions: 0,
        passing: 0,
        complete_mode: null,
        short_circuit: false,
mode_choices: []
      },
      allUserQuiz: []
    };
    const wrapper = shallowMount(quizConfig, { propsData });
    expect(wrapper.findAll('tr')).toHaveLength(propsData.allUserQuiz.length + 1);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    propsData = {
      csrfTRoken: null,
      config: {
        enabled: false,
        questions: 0,
        passing: 0,
        complete_mode: null,
        short_circuit: false,
mode_choices: []
      },
      allUserQuiz: []
    };
    const wrapper = shallowMount(quizConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});
