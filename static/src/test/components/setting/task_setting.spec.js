
import taskConfig from '../../../components/setting/task_setting.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();

describe('taskConfig', () => {
  let fetch;
  let notify;
  let propsData;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('render fields', () => {
    propsData = {
      csrfTRoken: null,
      config: { sched: 'default', rand_within_priority: false, sched_variants: [] },
      taskTimeout: 600,
      taskRedundancy: 2
     };
    const wrapper = shallowMount(taskConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(5);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    propsData = {
      csrfTRoken: null,
      config: { sched: 'default', rand_within_priority: false, sched_variants: [] },
      taskTimeout: 600,
      taskRedundancy: 2
     };
    const wrapper = shallowMount(taskConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});
