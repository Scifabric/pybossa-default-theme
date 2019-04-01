/* eslint-disable no-undef */
import { mutations, getters, state } from '../../components/builder/store/modules/checkboxInput';
import * as types from '../../components/builder/store/types';
describe('Checkbox setup', () => {
  let localState = { ...state };

  it('Update Label', () => {
    mutations[types.MUTATE_CHECKBOX_LABEL](localState, 'testLabel');
    expect(localState.form.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_CHECKBOX_LABEL_ADDED](localState, true);
    expect(localState.form.labelAdded).toBe(true);
  });

  describe('Add and Delete, update items from list', () => {
    it('Update item', () => {
      const keyCheckbox0 = localState.form.checkboxIdKeys[0];
      expect(localState.form.checkboxIdKeys.length).toBe(1);
      expect(localState.form.checkboxListObj[keyCheckbox0].id).toBe(keyCheckbox0);
      const obj = { ...localState.form.checkboxListObj[keyCheckbox0] };
      obj.label = 'labelUpdated';
      obj['pyb-answer'] = 'pybanswerUpdated';
      obj['initial-value'] = 'initialValueUpdated';
      mutations[types.MUTATE_CHECKBOX_UPDATE_LIST_ITEM](state, obj);
      expect(localState.form.checkboxListObj[keyCheckbox0]).toBe(obj);
    });

    it('Get if form is valid', () => {
      const isValid = getters[types.GET_CHECKBOX_INPUT_FORM_VALID](localState);
      expect(isValid).toBeTruthy();
    });

    it('Get Form', () => {
      const keyCheckbox0 = localState.form.checkboxIdKeys[0];
      const form = getters[types.GET_CHECKBOX_INPUT_FORM](localState);
      expect({ checkboxList: [localState.form.checkboxListObj[keyCheckbox0]],
        label: 'testLabel',
        labelAdded: true,
        isValidForm: true
      }).toEqual(form);
    });

    it('Add and Delete item', () => {
      mutations[types.MUTATE_CHECKBOX_ADD_LIST_ITEM](localState);
      expect(localState.form.checkboxIdKeys.length).toBe(2);
      localState.form.checkboxIdKeys.forEach(e => {
        expect(localState.form.checkboxListObj).toHaveProperty(e);
      });

      const keyToRemove = localState.form.checkboxIdKeys[0];
      mutations[types.MUTATE_CHECKBOX_DELETE_LIST_ITEM](localState, keyToRemove);
      expect(localState.form.checkboxListObj).not.toHaveProperty(keyToRemove);
      expect(localState.form.checkboxIdKeys).not.toContain(keyToRemove);
    });

    it('Clear form', () => {
      mutations[types.MUTATE_CHECKBOX_ADD_LIST_ITEM](localState);
      mutations[types.MUTATE_CHECKBOX_ADD_LIST_ITEM](localState);
      mutations[types.MUTATE_CHECKBOX_ADD_LIST_ITEM](localState);
      expect(localState.form.checkboxIdKeys.length).toBe(4);

      mutations[types.MUTATE_CLEAR_CHECKBOX_INPUT_FORM](localState);
      expect(localState.form.label).toBeFalsy();
      expect(localState.form.checkboxIdKeys.length).toBe(1);
      expect(localState.form.isValidForm).toBeTruthy();
    });
  });
});
