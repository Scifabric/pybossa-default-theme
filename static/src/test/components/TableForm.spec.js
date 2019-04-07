import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import TableForm from '../../components/builder/components/Table/TableForm';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TableForm', () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };
    wrapper = mount(TableForm, {
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

  it('GET_TABLE_COLUMNS_LIST store', () => {
    expect(storeMocks.getters[types.GET_TABLE_COLUMNS_LIST]).toBeCalled();
  });

  it('Update data source name', () => {
    const input = wrapper.find('#data-source-name');
    input.element.value = 'updateValue';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TABLE_DATA])
      .toBeCalledWith(storeMocks.state, {
        isVariable: true,
        value: 'updateValue'
      });
  });

  it('Update column component', () => {
    const input = wrapper.find('#table-answer-name');
    input.element.value = 'answerUpdate';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TABLE_NAME])
      .toBeCalledWith(storeMocks.state, {
        value: 'answerUpdate'
      });
  });

  it('Update column name', () => {
    const input = wrapper.find('#column-name-0');
    input.element.value = 'updateValue';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TABLE_UPDATE_COLUMN])
      .toBeCalledWith(storeMocks.state, {
        name: 'updateValue',
        header: 'col1 header',
        component: 'plain-text',
        id: 'Column 1',
        isDirty: true
      });
  });

  it('Delete Column', () => {
    const table = wrapper.find('#delete-column-0');
    table.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_TABLE_DELETE_COLUMN]).toBeCalledWith(storeMocks.state, 'Column 1');
  });

  it('Add Column', () => {
    const table = wrapper.find('#addButton');
    table.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_TABLE_ADD_COLUMN]).toBeCalled();
  });
});
