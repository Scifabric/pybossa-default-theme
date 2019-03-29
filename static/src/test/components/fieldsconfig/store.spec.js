import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('fieldsconfig', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
  });

  it('sets fields', () => {
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
    expect(store.state.fieldNames).toHaveLength(1);
    expect(store.state.fieldNames[0]).toBe('testField');
  });

  it('does not delete invalid fields', () => {
    store.commit('deleteField', { name: 'invalid' });
  });
});
