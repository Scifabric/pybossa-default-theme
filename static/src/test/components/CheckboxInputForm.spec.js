/* eslint-disable no-undef */

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import CheckboxInputForm from '../../components/builder/components/CheckboxInput/CheckboxInputForm';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Checkbox', () => {
  let storeMocks;
  let wrapper;
  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };

    wrapper = mount(CheckboxInputForm, {
      freshLocalVue,
      mocks: {
        $route: {
          params: {
            componentName: 'CHECKBOX_INPUT',
            header: 'Checkbox Input'
          }
        }
      },
      store: storeMocks.store
    });
  });

  it('It should get form from store', () => {
    expect(storeMocks.getters[types.GET_CHECKBOXLIST]).toBeCalled();
  });

  it('commits a mutation when a Add, delete button is clicked', () => {
    wrapper.find('#add').trigger('click');
    wrapper.find('#add').trigger('click');

    expect(storeMocks.mutations[types.MUTATE_CHECKBOX_ADD_LIST_ITEM]).toBeCalledTimes(2);
    expect(wrapper.html()).toContain('column-delete0');

    const deleteCol0 = wrapper.find('#column-delete0');
    deleteCol0.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_CHECKBOX_DELETE_LIST_ITEM]).toBeCalledTimes(1);
    expect(storeMocks.mutations[types.MUTATE_CHECKBOX_DELETE_LIST_ITEM]).toBeCalledWith(storeMocks.state, 'id1');
  });

  it('It should update form data.', () => {
    const input = wrapper.find('input[type="text"]');
    input.element.value = 'anschanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM]).toHaveBeenCalledTimes(1);
    expect(storeMocks.mutations[types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM])
      .toHaveBeenCalledWith(storeMocks.state,
        { 'id': 'id1',
          'initial-value': { 'value': false },
          'isVariable': true,
          'label': 'anschanged',
          'labelAdded': false,
          'pyb-answer': 'checkboxanswer' });
  });
});
