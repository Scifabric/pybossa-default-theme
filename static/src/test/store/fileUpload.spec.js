import { mutations, getters, state } from '../../components/builder/store/modules/fileUpload';
import * as types from '../../components/builder/store/types';
describe('file-upload setup', () => {
  let localState = { ...state };

  it('Update Label', () => {
    mutations[types.MUTATE_FILE_UPLOAD_LABEL](localState, 'testLabel');
    expect(localState.label).toBe('testLabel');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_FILE_UPLOAD_LABEL_ADDED](localState, true);
    expect(localState.labelAdded).toBe(true);
  });

  it('Update pybanswer', () => {
    mutations[types.MUTATE_FILE_UPLOAD_PYB_ANSWER](localState, 'pybanswer');
    expect(localState.pybanswer).toBe('pybanswer');
  });

  it('Update filename', () => {
    mutations[types.MUTATE_FILE_UPLOAD_FILE_NAME](localState, 'filename1');
    expect(localState.fileName).toBe('filename1');
  });

  it('Get Form', () => {
    const props = getters[types.GET_FILE_UPLOAD_PROPS](localState);
    expect(props.label).toEqual('testLabel');
    expect(props.labelAdded).toEqual(true);
    expect(props.pybanswer).toEqual('pybanswer');
    expect(props.fileName).toBe('filename1');
  });

  it('Get Form with errors', () => {
    const errors = getters[types.GET_FILE_UPLOAD_ERRORS](localState);
    expect(errors.pybanswer).toEqual(['Please ensure the answer field value ends with __upload_url.']);
  });

  it('Get Form with no errors', () => {
    localState = { id: '1', pybanswer: 'wrongname__upload_url', isValidForm: true };
    const props = getters[types.GET_FILE_UPLOAD_PROPS](localState);
    expect(props.isValidForm).toEqual(true);
    const errors = getters[types.GET_FILE_UPLOAD_ERRORS](localState);
    expect(errors.pybanswer).toBeFalsy();
  });

  it('Clear form', () => {
    mutations[types.MUTATE_CLEAR_FILE_UPLOAD_FORM](localState);
    expect(localState.label).toBeFalsy();
    expect(localState.pybanswer).toBeFalsy();
    expect(localState.labelAdded).toBe(false);
    expect(localState.isValidForm).toBeTruthy();
  });
});
