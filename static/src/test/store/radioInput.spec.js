import { mutations, getters, state } from '../../components/builder/store/modules/radioInput';
import * as types from '../../components/builder/store/types';
describe('Radio setup', () => {
  let localState = { ...state };

  it('Update Label', () => {
    mutations[types.MUTATE_RADIO_GROUP_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_RADIO_GROUP_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  describe('Add and Delete, update items from list', () => {
    it('Update item', () => {
      expect(localState.radioList.length).toBe(2);
      const obj = { ...localState.radioList[0] };
      obj.label = 'labelUpdated';
      mutations[types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM](state, { radio: obj, index: 0 });
      expect(localState.radioList[0]).toBe(obj);
    });

    it('Get if form is valid', () => {
      const { isValid } = getters[types.GET_RADIO_INPUT_FORM_VALID](localState);
      expect(isValid).toBe(false);
    });

    it('Add and Delete item', () => {
      mutations[types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM](localState);
      expect(localState.radioList.length).toBe(3);

      mutations[types.MUTATE_RADIO_GROUP_DELETE_LIST_ITEM](localState, 0);
      expect(localState.radioList.length).toBe(2);
    });

    it('Clear form', () => {
      mutations[types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM](localState);
      mutations[types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM](localState);
      mutations[types.MUTATE_RADIO_GROUP_ADD_LIST_ITEM](localState);
      expect(localState.radioList.length).toBe(5);

      mutations[types.MUTATE_CLEAR_RADIO_INPUT_FORM](localState);
      expect(localState.label).toBeFalsy();
      expect(localState.radioList.length).toBe(2);
      expect(getters[types.GET_RADIO_INPUT_FORM_VALID](localState).isValid).toBe(false);
    });

    it('Pass validation', () => {
        mutations[types.MUTATE_RADIO_GROUP_NAME](localState, 'group name');
        const radio1 = { ...localState.radioList[0] };
        radio1.value = 'a';
        mutations[types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM](localState, { radio: radio1, index: 0 });
        const radio2 = { ...localState.radioList[1] };
        radio2.value = 'b';
        mutations[types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM](localState, { radio: radio2, index: 1 });
        expect(getters[types.GET_RADIO_INPUT_FORM_VALID](localState).isValid).toBe(true);
    });
  });
});
