
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

  it('fetch external config and access data', async () => {
    let response = {
      valid_access_levels: [ [ 'L1', 'L1' ], [ 'L2', 'L2' ], [ 'L3', 'L3' ], [ 'L4', 'L4' ] ],
      forms: {
        gigwork_poller: { display: 'test1', fields: [{ type: 'TextField', name: 'target_bucket' }] },
        hdfs: { display: 'test2', fields: [{ type: 'SelectField', name: 'cluster', choices: [('c1', 'option1'), ('c2', 'option2')] }] }
      },
      external_config_dict: JSON.stringify({ target_bucket: 'bucket' }),
      data_access: ['L1']
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(projectConfig);
    await localVue.nextTick();
    expect(wrapper.vm._data.validAccessLevels).toHaveLength(4);
    expect(Object.keys(wrapper.vm._data.inputFields)).toHaveLength(2);
    expect(Object.keys(wrapper.vm._data.externalConfigDict)).toHaveLength(1);
    expect(Object.keys(wrapper.vm._data.accessLevels)).toHaveLength(4);
  });

  it('fetch assign-user data', async () => {
    let response = {
      project_users: ['1'],
      all_users: [{ id: 1, fullname: 'user1' }]
    };
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve(response)
    }));
    const wrapper = shallowMount(projectConfig);
    await localVue.nextTick();
    await localVue.nextTick();
    expect(wrapper.vm._data.assignee).toHaveLength(1);
    expect(Object.keys(wrapper.vm._data.users)).toHaveLength(1);
    expect(wrapper.vm._data.searchResult).toHaveLength(1);
  });

  // it('load empty data', () => {
  //   propsData = {
  //     csrfTRoken: null,
  //     externalConfig: {},
  //     externalConfigForm: []
  //   };
  //   const wrapper = shallowMount(projectConfig, { propsData });
  //   const p = wrapper.findAll('p');
  //   expect(p).toHaveLength(0);
  //   const button = wrapper.findAll('button');
  //   expect(button).toHaveLength(1);
  // });

  it('show assigned users config', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.assignee = ['1'];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user' }];
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(3);
  });

  it('show data access config', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.validAccessLevels = [ [ 'L1', 'L1' ], [ 'L2', 'L2' ], [ 'L3', 'L3' ], [ 'L4', 'L4' ] ];
    wrapper.vm._data.accessLevels = { 'L1': true, 'L2': false, 'L3': false, 'L4': true };
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(5);
  });

  it('show external config', () => {
    const wrapper = shallowMount(projectConfig, { propsData });
    wrapper.vm._data.externalConfigDict = { target_bucket: 'bucket', cluster: 'c1' };
    wrapper.vm._data.inputFields = {
      gigwork_poller: { display: 'test1', fields: [{ type: 'TextField', name: 'target_bucket' }] },
      hdfs: { display: 'test2', fields: [{ type: 'SelectField', name: 'cluster', choices: [('c1', 'option1'), ('c2', 'option2')] }] }
    };
    expect(wrapper.findAll('p')).toHaveLength(2);
    expect(wrapper.findAll('input')).toHaveLength(1);
    expect(wrapper.findAll('select')).toHaveLength(1);
  });

  it('add assigned user', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.assignee = ['1'];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user1' }, 2: { id: 2, fullname: 'user2' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }];

    expect(wrapper.findAll('p')).toHaveLength(4);
    const user2 = wrapper.findAll('p').at(2);
    user2.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(5);
  });

  it('remove assigned user', () => {
    const wrapper = shallowMount(projectConfig);
    wrapper.vm._data.assignee = ['1'];
    wrapper.vm._data.users = { 1: { id: 1, fullname: 'user' } };
    wrapper.vm._data.searchResult = [{ id: 1, fullname: 'user' }];

    expect(wrapper.findAll('p')).toHaveLength(3);
    const user1 = wrapper.findAll('p').at(2);
    user1.trigger('click');
    expect(wrapper.findAll('p')).toHaveLength(2);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(4);
    expect(notify.mock.calls).toHaveLength(3);
  });

  it('saves config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(4);
    expect(notify.mock.calls).toHaveLength(3);
  });

  it('saves config fails wit flash error', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'error', 'status': 'error' })
    }));
    const wrapper = shallowMount(projectConfig);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(4);
    expect(notify.mock.calls).toHaveLength(3);
  });
});
