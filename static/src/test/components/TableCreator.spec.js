import { mount } from '@vue/test-utils';
import TableCreator from '../../../src/components/builder/components/Table/TableCreator';

describe('TableCreator', () => {
  it('Render TableCreator', () => {
    const propsData = { 'name': 'table-creator',
      'form': { 'columns': [{ 'name': 'testCol1', 'header': 'Col 1', 'component': 'plain-text', 'id': 'Column 1', 'isDirty': true }],
        'data': [{ 'testCol1': 'a' }],
        'options': { 'headings': { 'testCol1': 'Col 1' } },
        'name': 'TableCreator' } };
    const wrapper = mount(TableCreator, {
      propsData });

    expect(wrapper.find('table-element')).toEqual({ 'selector': 'table-element' });
    expect(wrapper.html()).toContain('Col 1');
  });

  it('Render TableCreator', () => {
    const propsData = { 'name': 'table-creator',
      'form': { 'columns': [{ 'name': 'testCol1', 'header': 'Col 1', 'component': 'plain-text', 'id': 'Column 1', 'isDirty': true }],
        'data': 'sourceName',
        'options': { 'headings': { 'testCol1': 'Col 1' } },
        'name': 'TableCreator' } };
    const wrapper = mount(TableCreator, {
      propsData });

    expect(wrapper.find('table-element')).toEqual({ 'selector': 'table-element' });
    expect(wrapper.html()).toContain('Col 1');
  });
});
