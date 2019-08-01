
import { shallowMount, createLocalVue } from '@vue/test-utils';
import projectConfig from '../../../components/setting/index.vue';

const localVue = createLocalVue();

describe('projectConfig', () => {
  let fetch;
  let notify;
  let propsData;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('public gigwork hides assigned users and data access', () => {
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [],
      allUsers: [],
      isPrivate: false,
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(1);
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(1);
  });

  it('private gigwork shows assigned users and data access', () => {
    propsData = {
        csrfTRoken: null,
        dataAccess: [],
        assignUsers: [],
        allUsers: [],
        isPrivate: true,
        externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(7);
  });

  it('render data in private', () => {
    propsData = {
      csrfTRoken: null,
      dataAccess: ['L1'],
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }],
      isPrivate: true,
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(9);
  });

  it('add assigned user', () => {
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }],
      isPrivate: true,
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    expect(wrapper.findAll('p')).toHaveLength(10);
    const user2 = wrapper.findAll('p').at(8);
    user2.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(11);
  });

  it('remove assigned user', () => {
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [{ id: 1, fullname: 'user1' }],
      allUsers: [{ id: 1, fullname: 'user1' }],
      isPrivate: true,
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    expect(wrapper.findAll('p')).toHaveLength(9);
    const user1 = wrapper.findAll('p').at(8);
    user1.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(8);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    propsData = {
      csrfTRoken: null,
      dataAccess: [],
      assignUsers: [],
      allUsers: [],
      isPrivate: true,
      externalConfig: { gigwork_poller: { target_bucket: null } }
    };
    const wrapper = shallowMount(projectConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});
