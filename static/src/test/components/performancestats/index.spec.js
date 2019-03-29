import { shallowMount, createLocalVue } from '@vue/test-utils';
import PerformanceStats from '../../../components/performancestats/index';

const localVue = createLocalVue();

describe('performancestats', () => {
  it('', () => {
    const wrapper = shallowMount(PerformanceStats, { localVue });
  });
});
