import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import StaticData from '../../components/builder/components/Table/StaticData';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('StaticData', () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };
    wrapper = mount(StaticData, {
      freshLocalVue,
      mocks: {
        $route: {
          params: {
            componentName: 'TABLE',
            header: 'Table'
          }
        }
      },
      store: storeMocks.store
    });
  });

  it('It should get form from store', () => {
    expect(storeMocks.getters[types.GET_TABLE_PROPS]).toBeCalled();
    expect(storeMocks.getters[types.GET_TABLE_DATA_LIST]).toBeCalled();
  });

  it('Update data row', () => {
    const input = wrapper.find('#column-0');
    input.element.value = 'updateValue';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TABLE_UPDATE_DATA_ROW])
      .toBeCalledWith(storeMocks.state, { 'id': 'id1', 'Column 1': 'updateValue', 'Column 2': 'testCol2Value' });
  });

  it('Delete Row', () => {
    const table = wrapper.find('#delete-id1');
    table.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_TABLE_DELETE_DATA_ROW]).toBeCalledWith(storeMocks.state, 'id1');
  });

  it('Add Row', () => {
    const table = wrapper.find('#addButton');
    table.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_TABLE_ADD_DATA_ROW]).toBeCalled();
  });
});
