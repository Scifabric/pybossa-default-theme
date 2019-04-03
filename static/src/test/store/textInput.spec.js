import { mutations, getters, state } from '../../components/builder/store/modules/textInput';
import * as types from '../../components/builder/store/types';
describe('Text-Input setup', () => {
  let localState = { ...state };

  it('Update Label', () => {
    mutations[types.MUTATE_TEXT_INPUT_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_TEXT_INPUT_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  it('Update pybanswer', () => {
    mutations[types.MUTATE_TEXT_INPUT_PYB_ANSWER](localState, 'pybanswer');
    expect(localState['pyb-answer']).toBe('pybanswer');
  });

  it('Get Form', () => {
    const props = getters[types.GET_TEXT_INPUT_PROPS](localState);
    expect(props.label).toEqual('testLabel');
    expect(props.labelAdded).toEqual(true);
    expect(props['pyb-answer']).toEqual('pybanswer');
    expect(props.isValidForm).toEqual(true);
  });

  it('Clear form', () => {
    mutations[types.MUTATE_CLEAR_TEXT_INPUT_FORM](localState);
    expect(localState.label).toBeFalsy();
    expect(localState['pyb-answer']).toBeFalsy();
    expect(localState.labelAdded).toBe(false);
    expect(localState.isValidForm).toBeTruthy();
  });
});
