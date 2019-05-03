import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import ConsensusConfig from '../../../components/fieldsconfig/consensus_config.vue';
import { storeSpecs } from '../../../components/fieldsconfig/store';

// import { storeSpecs } from '../../../components/fieldsconfig/store';
import { cloneDeep } from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ConsensusConfig', () => {
  let store;
  let fetch;
  let notify;

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeSpecs));
    fetch = global.fetch = jest.fn();
    notify = window.pybossaNotify = jest.fn();
  });

  it('loads empty config', () => {
    const wrapper = mount(ConsensusConfig);
    const p = wrapper.findAll('p').at(3);
    expect(p.text()).toEqual('No consensus currently configured.');
  });

  it('load non-empty config', () => {
    const wrapper = mount(ConsensusConfig, {
      propsData: {
        consensus_config: { threshold: 70, maxRetries: 10, redundancyDelta: 1 }
      }
    });
    wrapper.setProps({ 'consensus_config': { threshold: 70, maxRetries: 10, redundancyDelta: 1 } });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(9);
  });

  it('saves config', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    const wrapper = mount(ConsensusConfig, { store, localVue });
    wrapper.setData({ threshold: 80, maxRetries: 15, redundancyDelta: 3 });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
    const [ msg, dismissable, status ] = notify.mock.calls[0];
    expect(msg).toBe('hello');
    expect(dismissable).toBe(true);
    expect(status).toBe('success');
  });
});
