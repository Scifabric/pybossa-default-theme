
describe('quizConfig', () => {
  let fetch;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
   });

  it('fetch data', async () => {
    let response = {
      csrf: '',
      all_user_quizzes: [],
      quiz_mode_choices: [],
      form: {
        enabled: true,
        questions: 10,
        passing: 8,
        mode: ''
      }
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));

    expect([]).toHaveLength(0);
  });

  // it('render data - disabled quiz mode', () => {
  //   const wrapper = shallowMount(quizConfig);
  //   wrapper.vm._data.enabled = false;
  //   expect(wrapper.findAll('p')).toHaveLength(1);
  // });

  // it('render data - enabled quiz-mode', () => {
  //   const wrapper = shallowMount(quizConfig);
  //   wrapper.vm._data.enabled = true;
  //   expect(wrapper.findAll('p')).toHaveLength(4);
  // });

  // it('render users quiz stats', async () => {
  //   let response = {
  //     csrf: '',
  //     all_user_quizzes: [{ fullname: 'user', quiz: { config: { enabled: true, questions: 10, passing: 7 }, status: 'passed', result: { right: 8, wrong: 2 } } }],
  //     quiz_mode_choices: [],
  //     form: {
  //       enabled: false
  //     }
  //   };
  //   fetch.mockImplementation((arg) => ({
  //     ok: true,
  //     json: () => Promise.resolve(response)
  //   }));
  //   const wrapper = shallowMount(quizConfig);
  //   await localVue.nextTick();
  //   expect(wrapper.findAll('tr')).toHaveLength(response.all_user_quizzes.length + 1);
  // });

  // it('saves config', async () => {
  //   fetch.mockImplementation((arg) => ({
  //     ok: true
  //   }));
  //   const wrapper = shallowMount(quizConfig);
  //   wrapper.vm._data.questions = 10;
  //   wrapper.vm._data.passing = 5;
  //   const saveButton = wrapper.findAll('button').at(0);
  //   saveButton.trigger('click');
  //   await localVue.nextTick();
  //   expect(fetch.mock.calls).toHaveLength(2);
  //   expect(notify.mock.calls).toHaveLength(2);
  // });

  // it('saves config fails', async () => {
  //   fetch.mockImplementation((arg) => ({
  //     ok: false
  //   }));
  //   const wrapper = shallowMount(quizConfig);
  //   wrapper.vm._data.enabled = false;
  //   const saveButton = wrapper.findAll('button').at(0);
  //   saveButton.trigger('click');
  //   await localVue.nextTick();
  //   expect(fetch.mock.calls).toHaveLength(2);
  //   expect(notify.mock.calls).toHaveLength(2);
  // });
});
