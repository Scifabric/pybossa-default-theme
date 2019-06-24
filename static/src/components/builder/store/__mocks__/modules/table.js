import * as types from '../../types';

export const state = {
  table: {
    id: 'idTable',
    name: { value: 'ansName', isDirty: true },
    data: { value: 'sourceData', isVariable: true, isDirty: true },
    columnKeys: ['Column 1', 'Column 2'],
    columnsListObj: {
      'Column 1': {
        name: 'col1',
        header: 'col1 header',
        component: 'plain-text',
        id: 'Column 1',
        isDirty: true
      },
      'Column 2': {
        name: 'col2',
        header: 'col2 header',
        component: 'text-input',
        id: 'Column 2',
        isDirty: true
      }
    },
    dataRowKeys: ['id1'],
    dataRowObj: { 'id1': { id: 'id1', 'Column 1': 'testCol1Value', 'Column 2': 'testCol2Value' } },
    colCounter: 2
  }
};

export const getters = {
  [types.GET_TABLE_COLUMNS_LIST]: jest.fn().mockReturnValue(
    state.table.columnKeys.map(id => (state.table.columnsListObj[id]))
  ),

  [types.GET_TABLE_DATA_LIST]: jest.fn().mockReturnValue(
    [{ id: 'id1', 'Column 1': 'testCol1Value', 'Column 2': 'testCol2Value' }]
  ),
  [types.GET_TABLE_PROPS]: jest.fn().mockReturnValue(
    { 'columns': [{ name: 'col1',
      header: 'col1 header',
      component: 'plain-text',
      id: 'Column 1',
      isDirty: true },
    { name: 'col2',
      header: 'col2 header',
      component: 'plain-text',
      id: 'Column 2',
      isDirty: true }
    ],
    'data': [{ 'col1': 'testCol1Value' }, { 'col2': 'testCol2Value' }],
    'options': { 'headings': { 'col1': 'col1 header', 'col2': 'col2 header' } },
    'name': 'ansName' }
  ),
  [types.GET_TABLE_FORM_VALID]: jest.fn().mockReturnValue(true),
  [types.GET_TABLE_ERRORS]: jest.fn().mockReturnValue({})
};

export const mutations = {
  [types.MUTATE_TABLE_DELETE_DATA_ROW]: jest.fn(),
  [types.MUTATE_TABLE_ADD_DATA_ROW]: jest.fn(),
  [types.MUTATE_TABLE_UPDATE_DATA_ROW]: jest.fn(),
  [types.MUTATE_TABLE_ADD_COLUMN]: jest.fn(),
  [types.MUTATE_TABLE_DELETE_COLUMN]: jest.fn(),
  [types.MUTATE_TABLE_UPDATE_COLUMN]: jest.fn(),
  [types.MUTATE_TABLE_DATA]: jest.fn(),
  [types.MUTATE_TABLE_NAME]: jest.fn()

};

export default {
  state,
  mutations,
  actions: {},
  getters
};
