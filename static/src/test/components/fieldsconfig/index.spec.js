import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FieldsConfig from '../../../components/fieldsconfig/index.vue';
import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('fieldsconfig', () => {
  let store;
  let fetch;
  let notify;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('loads', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const p = wrapper.find('p');
    expect(p.text()).toEqual('No fields currently configured.');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(0);
  });

  it('loads fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Categorical Field - testField');
  });

  it('shows error if name is empty', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    wrapper.vm._addField();
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(0);
    expect(wrapper.vm.error).toBe('Field Name is Required.');
  });

  it('adds categorical fields', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'new_1', fieldType: 'categorical' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Categorical Field - new_1');
  });

  it('adds freetext fields', () => {
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'new_2', fieldType: 'freetext' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
    const field = fields.at(0);
    expect(field.text()).toContain('Free Text Field - new_2');
  });

  it('saves fields', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'new_1', fieldType: 'categorical' });
    button.trigger('click');
    wrapper.setData({ fieldName: 'new_2', fieldType: 'freetext' });
    button.trigger('click');
    const saveButton = wrapper.findAll('button').at(1);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('hello');
    expect(dismissable).toBe(true);
    expect(status).toBe('success');
  });

  it('notifies request errors', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    const wrapper = mount(FieldsConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(1);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('An error occurred.');
    expect(dismissable).toBe(true);
    expect(status).toBe('error');
  });

  it('notifies save errors', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'there was an error', status: 'error' })
    }));
    const wrapper = mount(FieldsConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(1);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('there was an error');
    expect(dismissable).toBe(true);
    expect(status).toBe('error');
  });

  it('notifies exceptions', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => { throw new Error('error'); }
    }));
    const wrapper = mount(FieldsConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(1);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('An error occurred.');
    expect(dismissable).toBe(true);
    expect(status).toBe('error');
  });

  it('deletes fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const deleteButton = wrapper.find('span.btn-danger');
    deleteButton.trigger('click');
    const p = wrapper.find('p');
    expect(p.text()).toEqual('No fields currently configured.');
  });

  it('does not add duplicate fields', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          }
        }
      }
    });
    const wrapper = mount(FieldsConfig, { store, localVue });
    const button = wrapper.find('button');
    wrapper.setData({ fieldName: 'testField', fieldType: 'categorical' });
    button.trigger('click');
    const fields = wrapper.findAll('.field-config');
    expect(fields.length).toEqual(1);
  });
});
