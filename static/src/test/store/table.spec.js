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

  it('MUTATE_TABLE_DATA', () => {
    mutations[types.MUTATE_TABLE_DATA](localState, { value: 'name', isVariable: true, isDirty: false });
    expect(localState.data).toEqual({ value: 'name', isVariable: true, isDirty: false });
  });

  it('MUTATE_TABLE_UPDATE_COLUMN', () => {
    const col = { ...localState.columnsListObj[localState.columnKeys[0]] };
    col.name = 'colName';
    mutations[types.MUTATE_TABLE_UPDATE_COLUMN](localState, col);
    expect(localState.columnsListObj[localState.columnKeys[0]]).toEqual({
      component: 'plain-text',
      header: '',
      id: 'Column 1',
      isDirty: false,
      name: 'colName'
    });
  });
  it('MUTATE_TABLE_ADD_COLUMN MUTATE_TABLE_DELETE_COLUMN', () => {
    const currState = initialState();
    mutations[types.MUTATE_TABLE_ADD_COLUMN](currState);
    expect(currState.columnKeys).toEqual(['Column 1', 'Column 2']);

    mutations[types.MUTATE_TABLE_DELETE_COLUMN](currState, 'Column 1');
    expect(currState.columnKeys).toEqual(['Column 2']);
  });

  it('MUTATE_TABLE_ADD_DATA_ROW and MUTATE_TABLE_DELETE_DATA_ROW, MUTATE_TABLE_UPDATE_DATA_ROW', () => {
    const currState = initialState();
    mutations[types.MUTATE_TABLE_ADD_DATA_ROW](currState);
    expect(currState.dataRowKeys.length).toBe(1);
    expect(currState.dataRowObj[currState.dataRowKeys[0]]['Column 1']).toBeDefined();

    mutations[types.MUTATE_TABLE_UPDATE_DATA_ROW](currState, { 'Column 1': 'TEST', id: currState.dataRowKeys[0] });
    expect(currState.dataRowObj[currState.dataRowKeys[0]]['Column 1']).toBe('TEST');
    mutations[types.MUTATE_TABLE_DELETE_DATA_ROW](currState, currState.dataRowKeys[0]);
    expect(currState.dataRowKeys.length).toBe(0);
  });

  it('MUTATE_CLEAR_TABLE_FORM', () => {
    const currState = initialState();
    const col = { ...currState.columnsListObj[currState.columnKeys[0]] };
    col.name = 'colName';
    mutations[types.MUTATE_TABLE_UPDATE_COLUMN](localState, col);
    mutations[types.MUTATE_TABLE_ADD_DATA_ROW](currState);
    mutations[types.MUTATE_TABLE_UPDATE_DATA_ROW](currState, { 'Column 1': 'TEST', id: currState.dataRowKeys[0] });
    expect(currState).not.toEqual(initialState());
    mutations[types.MUTATE_CLEAR_TABLE_FORM](currState);

    const initial = initialState();
    expect(currState.name).toEqual(initial.name);
    expect(currState.data).toEqual(initial.data);
    expect(currState.dataRowKeys.length).toBe(0);
    expect(currState.dataRowObj).toEqual({});
    expect(currState.columnKeys.length).toBe(1);
    expect(currState.columnsListObj['Column 1']).toBeDefined();
    expect(currState.colCounter).toBe(1);
  });
});
