import { shallowMount } from '@vue/test-utils';
import CheckboxCreator from '../../../src/components/builder/components/CheckboxInput/CheckboxCreator';

describe('Checkbox setup', () => {
  it('Preview Checkbox', () => {
    const propsData = { checkboxList: [{
      id: 'id1',
      'pyb-answer': 'checkboxanswer',
      label: 'test checkbox1 label',
      labelAdded: false,
      'initial-value': { value: false },
      isVariable: true
    },
    {
      id: 'id2',
      'pyb-answer': 'checkboxanswer',
      label: 'test checkbox2 label',
      labelAdded: false,
      'initial-value': { value: false },
      isVariable: true
    }] };
    const wrapper = shallowMount(CheckboxCreator, { propsData });
    expect(wrapper.html()).toContain('test checkbox1 label');
    expect(wrapper.html()).toContain('id1');

    expect(wrapper.html()).toContain('test checkbox2 label');
    expect(wrapper.html()).toContain('id2');
  });
});
