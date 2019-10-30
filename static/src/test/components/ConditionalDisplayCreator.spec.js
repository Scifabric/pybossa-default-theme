import { mount } from '@vue/test-utils';
import ConditionaDisplayCreator from '../../components/builder/components/ConditionalDisplay/ConditionalDisplayCreator';

describe('ConditionalDisplayCreator', () => {
  it('Render ConditionalDisplayCreator', () => {
    const wrapper = mount(ConditionaDisplayCreator);
    expect(wrapper.find('conditional-display')).toEqual({ 'selector': 'conditional-display' });
  });
});
