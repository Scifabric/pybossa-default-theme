import { shallowMount } from '@vue/test-utils';
import Wizard from '../../../../src/components/wizard/index';
import Step from '../../../../src/components/wizard/step';

describe('wizard', () => {
  let wrapper = shallowMount(Wizard);

  it('Zero steps loaded', () => {
    expect(wrapper.findAll(Step).length).toBe(0);
  });

  it('Two steps loaded', () => {
    let propsData = { steps: {
      list: [{
      done: false,
      active: false,
      enable: false,
      href: '',
      title: 'Step Title',
      icon: 'fa fa-test'
    },
    {
      done: false,
      active: false,
      enable: false,
      href: '',
      title: 'Step Title 2',
      icon: 'fa fa-test 2'
    }] } };

    wrapper = shallowMount(Wizard, { propsData });
    expect(wrapper.findAll(Step).length).toBe(2);
  });

  it('Wizard classes', () => {
    expect(wrapper.html()).toContain('pad-from-nav');
    expect(wrapper.html()).toContain('tepwizard-row');
    expect(wrapper.html()).toContain('stepwizard');
    expect(wrapper.html()).toContain('stepwizard-row');
  });
});
