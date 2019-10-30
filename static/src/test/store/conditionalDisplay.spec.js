import { mutations, getters, state } from '../../components/builder/store/modules/conditionalDisplay';
import * as types from '../../components/builder/store/types';
describe('conditional-display setup', () => {
  let localState = state;

  it('Update condition', () => {
    const props = getters[types.GET_CONDITIONAL_DISPLAY_PROPS](localState);
    expect(props.condition).toEqual('');
    mutations[types.MUTATE_CONDITIONAL_DISPLAY_CONDITION](localState, "'b'=='b'");
    expect(localState.condition).toBe("'b'=='b'");
  });

  it('Get Form after update', () => {
    const props = getters[types.GET_CONDITIONAL_DISPLAY_PROPS](localState);
    expect(props.condition).toEqual("'b'=='b'");
    expect(props.isValidForm).toEqual(true);
    const errors = getters[types.GET_CONDITIONAL_DISPLAY_ERRORS](localState);
    expect(errors.condition).toBeFalsy();
  });

  it('Get Form with errors', () => {
    localState = { id: '1', condition: '"', isValidForm: false };
    const props = getters[types.GET_CONDITIONAL_DISPLAY_PROPS](localState);
    expect(props.isValidForm).toEqual(false);
    const errors = getters[types.GET_CONDITIONAL_DISPLAY_ERRORS](localState);
    expect(errors.condition).toEqual(["Please avoid using [ \" ] and use [ ' ] instead."]);
  });

  it('Clear form', () => {
    mutations[types.MUTATE_CLEAR_CONDITIONAL_DISPLAY_FORM](localState);
    expect(localState.condition).toBe('');
    expect(localState.isValidForm).toBeTruthy();
  });
});
