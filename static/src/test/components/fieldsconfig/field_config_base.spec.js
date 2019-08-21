import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import FieldConfigBase from '../../../components/fieldsconfig/field_config_base';
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
          type: 'freetext',
          config: {}
        }
      }
    });
  });

  it('loads', () => {
    const wrapper = shallowMount(FieldConfigBase, { store, localVue });
    wrapper.setProps({
      name: 'field_1',
      type: 'freetext'
    });
    expect(wrapper.html()).toContain('freetext Field - field_1');
  });
});
