import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import TextInputForm from '../../components/builder/components/TextInput/TextInputForm';
import * as types from '../../components/builder/store/types';

jest.mock('../../components/builder/store');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TextInput', () => {
  let storeMocks;
  let wrapper;

  beforeEach(() => {
    const freshLocalVue = createLocalVue();
    storeMocks = { ...createStoreMocks(), dispatch: jest.fn() };
    wrapper = mount(TextInputForm, {
      freshLocalVue,
      mocks: {
        $route: {
          params: {
            componentName: 'TEXT_INPUT',
            header: 'Text Input'
          }
        }
      },
      store: storeMocks.store
    });
  });

  it('Update pyb-answer.', () => {
    const input = wrapper.find('#pyb-answer');
    input.element.value = 'anschanged';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TEXT_INPUT_PYB_ANSWER]).toBeCalledWith(storeMocks.state, 'anschanged');
  });

  it('Update labeladded.', () => {
    expect(wrapper.html()).toContain('component-label');
    const input = wrapper.find('#component-label');
    input.element.value = 'labelupdated';
    input.trigger('input');
    expect(storeMocks.mutations[types.MUTATE_TEXT_INPUT_LABEL]).toBeCalledWith(storeMocks.state, 'labelupdated');
  });

  it('Update label.', () => {
    const checkbox = wrapper.find('#add-label');
    checkbox.trigger('click');
    expect(storeMocks.mutations[types.MUTATE_TEXT_INPUT_LABEL_ADDED]).toBeCalledWith(storeMocks.state, false);
  });
});
