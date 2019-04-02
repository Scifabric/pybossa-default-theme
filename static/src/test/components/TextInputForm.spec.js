import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../components/builder/store';
import TextInput from '../../components/builder/components/TextInput/TextInputForm';
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
    wrapper = mount(TextInput, {
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

  it('It should get form from store', () => {
    expect(storeMocks.getters[types.GET_TEXT_INPUT_PROPS]).toBeCalled();
    expect(wrapper.vm.form['pyb-answer'].value).toBe('pybanswer');
  });

  it('It should update form data.', () => {
    const input = wrapper.find('input[type="text"]');
    input.element.value = 'anschanged';
    input.trigger('input');
    expect(wrapper.vm.form['pyb-answer'].value).toBe('anschanged');
    expect(storeMocks.getters[types.GET_TEXT_INPUT_PROPS]).toHaveBeenCalledTimes(
      2
    );
  });

  it('Label should be hide until it is clicked.', () => {
    expect(wrapper.vm.form.labelAdded).toBe(false);
    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.trigger('click');
    expect(wrapper.vm.form.labelAdded).toBe(true);
    expect(storeMocks.getters[types.GET_TEXT_INPUT_PROPS]).toHaveBeenCalledTimes(
      3
    );
  });
});
