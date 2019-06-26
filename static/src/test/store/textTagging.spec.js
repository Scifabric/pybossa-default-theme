import { mutations, getters as _getters, state } from '../../components/builder/store/modules/textTagging';
import * as types from '../../components/builder/store/types';
import { bindGetters } from '../utils/getters';

describe('Text Tagging setup', () => {
  const localState = { ...state };
  const getters = bindGetters(_getters, localState);

  function isValid () {
    expect(getters[types.GET_TEXT_TAGGING_FORM_VALID].isValid).toBe(true);
  }

  function isNotValid () {
    expect(getters[types.GET_TEXT_TAGGING_FORM_VALID].isValid).toBe(false);
  }

  it('Update Label', () => {
    mutations[types.MUTATE_TEXT_TAGGING_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_TEXT_TAGGING_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  describe('Add and Delete, update tags from list', () => {
    // it('Update item', () => {
    //   expect(localState.tagList.length).toBe(1);
    //   const obj = { ...localState.tagList[0] };
    //   obj.label = 'labelUpdated';
    //   mutations[types.MUTATE_RADIO_GROUP_UPDATE_LIST_ITEM](state, { radio: obj, index: 0 });
    //   expect(localState.radioList[0]).toBe(obj);
    // });

    it('Get if form is valid', () => {
      const { isValid } = getters[types.GET_TEXT_TAGGING_FORM_VALID];
      expect(isValid).toBe(false);
    });

    it('Add and Delete tag', () => {
      mutations[types.MUTATE_TEXT_TAGGING_ADD_TAG](localState);
      expect(localState.tagList.length).toBe(2);

      mutations[types.MUTATE_TEXT_TAGGING_DELETE_TAG](localState, 0);
      expect(localState.tagList.length).toBe(1);
    });

    it('Add and Delete entity', () => {
      mutations[types.MUTATE_TEXT_TAGGING_ADD_ENTITY](localState);
      expect(localState.entities.static.length).toBe(1);

      mutations[types.MUTATE_TEXT_TAGGING_DELETE_ENTITY](localState, 0);
      expect(localState.entities.static.length).toBe(0);
    });

    it('Clear form', () => {
      mutations[types.MUTATE_TEXT_TAGGING_ADD_TAG](localState);
      mutations[types.MUTATE_TEXT_TAGGING_ADD_TAG](localState);
      mutations[types.MUTATE_TEXT_TAGGING_ADD_TAG](localState);
      expect(localState.tagList.length).toBe(4);

      mutations[types.MUTATE_CLEAR_TEXT_TAGGING_FORM](localState);
      expect(localState.label).toBeFalsy();
      expect(localState.tagList.length).toBe(1);
      expect(getters[types.GET_TEXT_TAGGING_FORM_VALID].isValid).toBe(false);
    });

    it('Pass validation', () => {
        const tag1 = localState.tagList[0];
        isNotValid();
        tag1.name = 'a';
        isNotValid();
        tag1.display = 'b';
        isNotValid();
        tag1.color = 'red';
        isNotValid();
        mutations[types.MUTATE_TEXT_TAGGING_TEXT](localState, 'task.info.text');
        isValid();
        mutations[types.MUTATE_TEXT_TAGGING_READONLY](localState, true);
        isNotValid();
        mutations[types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE](localState, 'task.info.entities');
        isValid();
        mutations[types.MUTATE_TEXT_TAGGING_SOURCE_TYPE](localState, 'static');
        isNotValid();
        mutations[types.MUTATE_TEXT_TAGGING_TEXT](localState, 'Four score and seven years ago');
        isNotValid();
        mutations[types.MUTATE_TEXT_TAGGING_ADD_ENTITY](localState);
        isNotValid();
        const entity1 = localState.entities.static[0];
        entity1.headoffset = 1;
        isNotValid();
        entity1.tailoffset = 2;
        isNotValid();
        entity1.taggedtype = 'a';
        isValid();
        entity1.headoffset = -1;
        isNotValid();
    });
  });
});
