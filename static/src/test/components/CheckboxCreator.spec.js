/* eslint-disable no-undef */
import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import CheckboxCreator from '../../../src/components/builder/components/CheckboxInput/CheckboxCreator';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Checkbox setup', () => {
  it('Preview Checkbox', () => {
    const wrapper = mount(CheckboxCreator, {});
    wrapper.setProps({
      checkboxList: [{
        id: 'id1',
        'pyb-answer': 'checkboxanswer',
        label: 'test checkbox1 label',
        labelAdded: false,
        'initial-value': { value: false },
        isVariable: true,
        isValidForm: true
      },
      {
        id: 'id2',
        'pyb-answer': 'checkboxanswer',
        label: 'test checkbox2 label',
        labelAdded: false,
        'initial-value': { value: false },
        isVariable: true,
        isValidForm: true
      }]
    });
    expect(wrapper.html()).toContain('test checkbox1 label');
    expect(wrapper.html()).toContain('test checkbox2 label');
  });
});
