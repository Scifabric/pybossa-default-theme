import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CategoricalFieldConfig from '../../../components/fieldsconfig/categorical_field_config';
import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('fieldsconfig', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
    store.commit('setData', {
      answerFields: {
        field_1: {
          type: 'categorical',
          config: {
            labels: []
          }
        }
      }
    });
  });

  it('loads', () => {
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue });
    wrapper.setProps({
      name: 'field_1',
      type: 'categorical',
      labels: ['LA', 'LB']
    });
    const labels = wrapper.findAll('.label');
    expect(labels.length).toBe(2);
    expect(labels.at(0).text()).toBe('LA');
    expect(labels.at(1).text()).toBe('LB');
  });

  it('adds a single label', async () => {
    const propsData = {
      name: 'field_1',
      type: 'categorical',
      labels: [],
      edit: true
    };
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue, propsData });

    wrapper.setData({ newLabel: 'label_1' });
    const addButton = wrapper.findAll('.btn').at(0);
    addButton.trigger('click');
    expect(store.state.answerFields.field_1.config.labels[0]).toBe('label_1');
  });

  it('does not add empty label', async () => {
    const propsData = {
      name: 'field_1',
      type: 'categorical',
      labels: [],
      edit: true
    };
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue, propsData });

    wrapper.setData({ newLabel: undefined });
    const addButton = wrapper.findAll('.btn').at(0);
    addButton.trigger('click');
    expect(store.state.answerFields.field_1.config.labels).toHaveLength(0);
  });

  it('adds many label', async () => {
    const propsData = {
      name: 'field_1',
      type: 'categorical',
      labels: [],
      edit: true
    };
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue, propsData });

    wrapper.setData({ newLabel: 'label_1,label_2,label_3,label_1' });
    const addButton = wrapper.findAll('.btn').at(1);
    addButton.trigger('click');
    expect(store.state.answerFields.field_1.config.labels).toHaveLength(3);
    expect(store.state.answerFields.field_1.config.labels[0]).toBe('label_1');
    expect(store.state.answerFields.field_1.config.labels[1]).toBe('label_2');
    expect(store.state.answerFields.field_1.config.labels[2]).toBe('label_3');
  });

  it('adds bool labels', async () => {
    const propsData = {
      name: 'field_1',
      type: 'categorical',
      labels: [],
      edit: true
    };
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue, propsData });

    const boolCheckbox = wrapper.find('#boolean-type-checkbox');
    boolCheckbox.trigger('click');
    const labels = store.state.answerFields.field_1.config.labels;
    expect(labels).toHaveLength(2);
    expect(labels).toContain(true);
    expect(labels).toContain(false);
    boolCheckbox.trigger('click');
    expect(store.state.answerFields.field_1.config.labels).toHaveLength(0);
  });

  it('toggles text labels', async () => {
    const propsData = {
      name: 'field_1',
      type: 'categorical',
      labels: [true, false],
      edit: true
    };
    const wrapper = shallowMount(CategoricalFieldConfig, { store, localVue, propsData });

    let labelInput = wrapper.find('input[type=text]');
    expect(labelInput.exists()).toBe(false);
    const boolCheckbox = wrapper.find('#boolean-type-checkbox');
    boolCheckbox.trigger('click');
    labelInput = wrapper.find('input[type=text]');
    expect(labelInput.exists()).toBe(true);
  });
});
