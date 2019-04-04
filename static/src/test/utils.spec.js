import utils from '../components/builder/utils';
import { state as textInput } from '../components/builder/store/modules/textInput';
import { state as checkboxInput } from '../components/builder/store/modules/checkboxInput';
test('getTextInputCode for TEXT_INPUT', () => {
  textInput['pyb-answer'] = 'answername';
  textInput['label'] = 'labelName';
  const componentCode = utils.getTextInputCode(textInput, 'TEXT_INPUT');

  expect(componentCode.includes('<text-input')).toBeTruthy();
  expect(componentCode.includes('</text-input>')).toBeTruthy();
  expect(
    componentCode.includes(`pyb-answer="${textInput['pyb-answer']}"`)
  ).toBeTruthy();
  expect(componentCode.includes(`id="${textInput.id}"`)).toBeTruthy();
});

it('getCheckboxInputCode for CHECKBOX_INPUT', () => {
  checkboxInput.labelAdded = true;
  checkboxInput.label = 'Test label';
  checkboxInput.checkboxList = [];
  checkboxInput.checkboxList[0] = {
    id: 'id0',
    'pyb-answer': 'checkboxanswer0',
    label: 'test checkbox0 label',
    labelAdded: false,
    'initial-value': { value: true, isVariable: true },
    isVariable: true,
    isValidForm: true
  };
  checkboxInput.checkboxList[1] = {
    id: 'id1',
    'pyb-answer': 'checkboxanswer',
    label: 'test checkbox1 label',
    labelAdded: false,
    'initial-value': { value: false, isVariable: true },
    isVariable: true,
    isValidForm: true
  };
  const componentCode = utils.getCheckboxInputCode(checkboxInput, 'CHECKBOX_INPUT');
  expect(componentCode.includes('<checkbox-input')).toBeTruthy();
  expect(componentCode.includes('</checkbox-input>')).toBeTruthy();
  expect(componentCode.includes('Test label')).toBeTruthy();
  expect(componentCode.includes(checkboxInput.checkboxList[0].label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer="${checkboxInput.checkboxList[0]['pyb-answer']}"`)).toBeTruthy();
  expect(componentCode.includes(
    `:initial-value="${checkboxInput.checkboxList[0]['initial-value'].value}"`
  )).toBeTruthy();
  expect(componentCode.includes(`id="${checkboxInput.checkboxList[0].id}"`)
  ).toBeTruthy();
  expect(componentCode.includes(checkboxInput.checkboxList[1].label)).toBeTruthy();
  expect(componentCode.includes(
    `pyb-answer="${checkboxInput.checkboxList[1]['pyb-answer']}"`)).toBeTruthy();
  expect(componentCode.includes(
    `:initial-value="${checkboxInput.checkboxList[1]['initial-value'].value}"`
  )).toBeTruthy();
  expect(componentCode.includes(`id="${checkboxInput.checkboxList[1].id}"`)
  ).toBeTruthy();
});
