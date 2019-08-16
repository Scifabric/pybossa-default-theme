import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import ConsensusConfig from '../../../components/fieldsconfig/consensus_config.vue';
import { storeSpecs } from '../../../components/fieldsconfig/store';
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

  it('does not load data', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retryForConsensus: false
        }
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(0);
  });

  it('loads empty config', () => {
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue });
    const p = wrapper.findAll('p');
    expect(p).toHaveLength(3);
  });

  it('load non-empty config', () => {
    const propsData = {
      consensusConfig: { consensus_threshold: 10, max_retries: 0, redundancy_config: 0 }
    };
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      },
      consensus: {
        consensus_threshold: 70,
        max_retries: 10,
        redundancy_config: 1
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue, propsData });
    const p = wrapper.findAll('p');
    const button = wrapper.findAll('button');
    expect(button).toHaveLength(1);
    expect(p).toHaveLength(3);
  });

  it('save config (without consensus config)', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });

  it('save config (with consensus config)', async () => {
    fetch.mockImplementation((arg) => ({
      ok: true,
      json: () => Promise.resolve({ flash: 'hello', status: 'success' })
    }));
    const propsData = {
      consensusConfig: { consensus_threshold: 10, max_retries: 0, redundancy_config: 0 }
    };
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      },
      consensus: {
        consensus_threshold: 70,
        max_retries: 10,
        redundancy_config: 1
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue, propsData });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });

  it('save incorrect config - threshold', () => {
    const propsData = {
      consensusConfig: { consensus_threshold: 10, max_retries: 0, redundancy_config: 0 }
    };
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      },
      consensus: {
        consensus_threshold: 10,
        max_retries: 0,
        redundancy_config: 0
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue, propsData });
    expect(wrapper.findAll('.error-msg')).toHaveLength(0);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    expect(wrapper.findAll('.error-msg')).toHaveLength(1);
  });

  it('save incorrect config', () => {
    const propsData = {
      consensusConfig: { consensus_threshold: 70, max_retries: 0, redundancy_config: 0 }
    };
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: true
        }
      },
      consensus: {
        consensus_threshold: 70,
        max_retries: 0,
        redundancy_config: 0
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue, propsData });
    expect(wrapper.findAll('.error-msg')).toHaveLength(0);
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    expect(wrapper.findAll('.error-msg')).toHaveLength(1);
  });

  it('save config fails', async () => {
    fetch.mockImplementation((arg) => ({
      ok: false
    }));
    store.commit('setData', {
      answerFields: {
        testField: {
          type: 'categorical',
          config: {
            labels: ['A', 'B', 'C']
          },
          retry_for_consensus: false
        }
      }
    });
    const wrapper = mount(ConsensusConfig, { store, localVue });
    const saveButton = wrapper.findAll('button').at(0);
    saveButton.trigger('click');
    await localVue.nextTick();
    expect(fetch.mock.calls).toHaveLength(1);
    expect(notify.mock.calls).toHaveLength(1);
  });
});
