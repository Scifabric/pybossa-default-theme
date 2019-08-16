
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

  it('render fields - disabled quiz mode', () => {
    propsData = {
      csrfTRoken: null,
      config: {
        enabled: false,
        questions: 0,
        passing: 0,
        complete_mode: null,
        short_circuit: false,
        mode_choices: [('mode_1', 'show all data'), ('mode_2', 'show partial data')]
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
        mode_choices: [('mode_1', 'show all data'), ('mode_2', 'show partial data')]
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
      allUserQuiz: [{ fullname: 'user', quiz: { config: { enabled: true, questions: 10, passing: 7 }, status: 'bg-success', result: { right: 8, wrong: 2 } } }]
    };
    const wrapper = shallowMount(quizConfig, { propsData });
    expect(wrapper.findAll('tr')).toHaveLength(propsData.allUserQuiz.length + 1);
  });

  // it('reset users', () => {
  //   propsData = {
  //     csrfTRoken: null,
  //     config: {
  //       enabled: false,
  //       questions: 0,
  //       passing: 0,
  //       complete_mode: null,
  //       short_circuit: false,
  //       mode_choices: []
  //     },
  //     allUserQuiz: [{ fullname: 'user', quiz: { config: { enabled: true, questions: 10, passing: 7 }, status: 'bg-success', result: { right: 8, wrong: 2 } } }]
  //   };
  //   const wrapper = shallowMount(quizConfig, { propsData });
  //   expect(wrapper.findAll('.btn-primary')).toHaveLength(2);
  //   wrapper.findAll('button').at(0);
  //   expect(wrapper.findAll('.active')).toHaveLength(1);
  // });

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

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
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
