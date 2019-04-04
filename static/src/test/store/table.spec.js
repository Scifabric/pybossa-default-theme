/* eslint-disable no-undef */
import { mutations, getters, state, getColumnObject, initialState } from '../../components/builder/store/modules/table';
import * as types from '../../components/builder/store/types';
describe('Table store', () => {
  let localState = { ...state };

  it('Initial State', () => {
    expect(localState.id).toBeDefined();
    expect(localState.name).toBeDefined();
    expect(localState.name.value).toBeDefined();
    expect(localState.name.isDirty).toBeDefined();
    expect(localState.data).toBeDefined();
    expect(localState.data.list).toBeDefined();
    expect(localState.data.value).toBeDefined();
    expect(localState.data.isVariable).toBeDefined();
    expect(localState.data.isDirty).toBeDefined();
    expect(localState.dataRowKeys).toBeDefined();
    expect(localState.dataRowObj).toBeDefined();
    expect(localState.columnKeys).toBeDefined();
    expect(localState.columnsListObj).toBeDefined();
    expect(localState.dataRowKeys).toBeDefined();
    expect(localState.colCounter).toBeDefined();
  });

  it('getColumnObject ', () => {
    const column = getColumnObject(1);
    expect(column).toEqual({
      name: '',
      header: '',
      component: 'plain-text',
      id: `Column 1`,
      isDirty: false
    });
  });

  it('GET_TABLE_PROPS ', () => {
    const currState = initialState();
    currState.columnsListObj[currState.columnKeys[0]].name = 'testColName';
    currState.columnsListObj[currState.columnKeys[0]].header = 'Header testColName';
    currState.dataRowKeys = ['id1'];
    currState.dataRowObj['id1'] = { id: 'id1', [currState.columnKeys[0]]: 'test data for testName' };
    currState.data.isVariable = false;
    currState.data.value = 'dataName';
    currState.name.value = 'ansTableName';

    const props = getters[types.GET_TABLE_PROPS](currState);
    const expectedOptions = { headings: { testColName: 'Header testColName' } };
    expect(props.options).toEqual(expectedOptions);

    const expectedData = { isVariable: false,
      value: 'dataName',
      list: [{ testColName: 'test data for testName' }],
      isDirty: false };
    expect(props.data).toEqual(expectedData);

    const expectedColumns = [{
      component: 'plain-text',
      header: 'Header testColName',
      id: 'Column 1',
      isDirty: false,
      name: 'testColName'
    }];
    expect(props.columns).toEqual(expectedColumns);

    expect(props.name).toBe('ansTableName');
  });

  it('GET_TABLE_COLUMNS_LIST', () => {
    const currState = initialState();
    currState.columnsListObj[currState.columnKeys[0]].name = 'testColName';
    currState.columnsListObj[currState.columnKeys[0]].header = 'Header testColName';
    const columns = getters[types.GET_TABLE_COLUMNS_LIST](currState);
    const expectedColumns = [{
      component: 'plain-text',
      header: 'Header testColName',
      id: 'Column 1',
      isDirty: false,
      name: 'testColName'
    }];
    expect(columns).toEqual(expectedColumns);
  });

  it('GET_TABLE_DATA_LIST', () => {
    const currState = initialState();
    let data = getters[types.GET_TABLE_DATA_LIST](currState);
    let expectedData = [];

    currState.columnsListObj[currState.columnKeys[0]].name = 'testColName';
    currState.columnsListObj[currState.columnKeys[0]].header = 'Header testColName';
    currState.dataRowKeys = ['id1'];
    currState.dataRowObj['id1'] = { id: 'id1', [currState.columnKeys[0]]: 'test data for testName' };
    data = getters[types.GET_TABLE_DATA_LIST](currState);
    expectedData = [{ id: 'id1', 'Column 1': 'test data for testName' }];
    expect(data).toEqual(expectedData);
  });

  it('GET_TABLE_FORM_VALID repeatedColName', () => {
    const currState = initialState();
    // repeatedColName
    currState.data.isVariable = false;
    currState.columnKeys.push('Column 2');
    currState.columnsListObj[currState.columnKeys[0]].name = 'testColName';
    currState.columnsListObj[currState.columnKeys[0]].header = 'Header testColName';
    currState.columnsListObj[currState.columnKeys[1]] = { ...currState.columnsListObj[currState.columnKeys[0]] };
    currState.columnsListObj[currState.columnKeys[1]].id = 'Column 2';
    currState.columnsListObj[currState.columnKeys[1]].isDirty = true;

    currState.columnsListObj[currState.columnKeys[1]].name = 'Column 2adfsadfas';
    let isValid = getters[types.GET_TABLE_FORM_VALID](currState);
    expect(isValid).toBeTruthy();
  });

  it('GET_TABLE_FORM_VALID isFormUntouched ', () => {
    const currState = initialState();
    const isValid = getters[types.GET_TABLE_FORM_VALID](currState);
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID anyDirtyColumn', () => {
    const currState = initialState();
    currState.columnsListObj[currState.columnKeys[0]].isDirty = true;
    const isValid = getters[types.GET_TABLE_FORM_VALID](currState);
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID isDataNameEmptyAndRequired', () => {
    const currState = initialState();
    currState.data.isVariable = true;
    currState.data.value = '';
    currState.data.isDirty = true;
    const isValid = getters[types.GET_TABLE_FORM_VALID](currState);
    expect(isValid).toBeFalsy();
  });

  it('GET_TABLE_FORM_VALID isAnswerFieldDirty', () => {
    const currState = initialState();
    currState.columnsListObj[currState.columnKeys[0]].component = 'text-input';
    currState.name.isDirty = true;
    const isValid = getters[types.GET_TABLE_FORM_VALID](currState);
    expect(isValid).toBeFalsy();
  });

  it('MUTATE_TABLE_NAME', () => {
    mutations[types.MUTATE_TABLE_NAME](localState, 'name');
    expect(localState.name).toBe('name');
  });

  it('Update labelAdded', () => {
    mutations[types.MUTATE_TABLE_DATA](localState, { value: 'testVal', isVariable: true });
    expect(localState.data).toEqual({ value: 'testVal', isVariable: true });
  });

  it('Update pybanswer', () => {
    mutations[types.MUTATE_TEXT_INPUT_PYB_ANSWER](localState, 'pybanswer');
    expect(localState['pyb-answer']).toBe('pybanswer');
  });
});

// it('Update pybanswer', () => {
//   mutations[types.MUTATE_TEXT_INPUT_PYB_ANSWER](localState, 'pybanswer');
//   expect(localState['pyb-answer']).toBe('pybanswer');
// });

// it('Get Form', () => {
//   const props = getters[types.GET_TEXT_INPUT_PROPS](localState);
//   expect(props.label).toEqual('testLabel');
//   expect(props.labelAdded).toEqual(true);
//   expect(props['pyb-answer']).toEqual('pybanswer');
//   expect(props.isValidForm).toEqual(true);
// });

// it('Clear form', () => {
//   mutations[types.MUTATE_CLEAR_TEXT_INPUT_FORM](localState);
//   expect(localState.label).toBeFalsy();
//   expect(localState['pyb-answer']).toBeFalsy();
//   expect(localState.labelAdded).toBe(false);
//   expect(localState.isValidForm).toBeTruthy();
// });
