
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ownershipConfig from '../../../components/setting/ownership_setting.vue';

const localVue = createLocalVue();

describe('ownershipConfig', () => {
  let fetch;
  let notify;
  let propsData;

  beforeEach(() => {
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('render fields without other coowners', () => {
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: [{ id: 1, fullname: 'user1' }]
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(4);
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(2);
  });

  it('render fields with other coowners', () => {
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }]
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(5);
  });

  it('search users', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }]
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    console.log(wrapper.findAll('p').at(0).text());
    console.log(wrapper.findAll('p').at(1).text());
    console.log(wrapper.findAll('p').at(2).text());
    console.log(wrapper.findAll('p').at(3).text());
    console.log(wrapper.findAll('p').at(4).text());
    expect(wrapper.findAll('p')).toHaveLength(5);
    const searchButton = wrapper.findAll('button').at(0);
    console.log(searchButton.text());
    searchButton.trigger('click');
    await localVue.nextTick();
    expect(wrapper.findAll('p')).toHaveLength(6);
  });

  it('add coowners', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ found: [{ id: 1111, fullname: 'found' }] })
    }));
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: [{ id: 1, fullname: 'user1' }]
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    expect(wrapper.findAll('i')).toHaveLength(1);
    const searchButton = wrapper.findAll('button').at(0);
    searchButton.trigger('click');
    await localVue.nextTick();
    const user = wrapper.findAll('p').at(5);
    user.trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(2);
  });

  it('remove coowners', () => {
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: [{ id: 1, fullname: 'user1' }, { id: 2, fullname: 'user2' }]
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    const deleteIcons = wrapper.findAll('i');
    expect(deleteIcons).toHaveLength(2);
    deleteIcons.at(0).trigger('click');
    expect(wrapper.findAll('i')).toHaveLength(1);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true
    }));
    propsData = {
      csrfToken: '',
      owner: { id: 1, fullname: 'user1' },
      coOwners: []
    };
    const wrapper = shallowMount(ownershipConfig, { propsData });
    const saveButton = wrapper.findAll('button').at(1);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});
