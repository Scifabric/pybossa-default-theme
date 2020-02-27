import * as types from '../types';
import utils from '../../utils';

export function initialState () {
  const firstElement = getChoiceObject();
  return {
    label: '',
    labelAdded: false,
    choiceList: [firstElement],
    pybAnswer: '',
    initialValue: '',
    validations: []
  };
}

export function getChoiceObject () {
  return {
    display: '',
    value: ''
  };
}

function getTrimmedChoices (choiceList) {
  return choiceList.map(trimChoice);

  function trimChoice ({ value, display }) {
    return { value: value.trim(), display: display.trim() };
  }
}

function getChoiceDict (state) {
  return getTrimmedChoices(state.choiceList).reduce(reducer, {});

  function reducer (result, choice) {
    result[choice.value] = choice.display || choice.value;
    return result;
  }
}

export const state = {
  ...initialState()
};

function* getErrors (state) {
    const uniqueValues = new Set();
    for (const [index, { value }] of state.choiceList.entries()) {
        const key = `choiceList[${index}].value`;
        const trimmedValue = value.trim();
        if (!trimmedValue) yield [key, `Choice ${index + 1} value is required.`];
        else if (uniqueValues.has(trimmedValue)) yield [key, `Choice ${index + 1} value is not unique.`];
        else uniqueValues.add(trimmedValue);
    }
}

export const getters = {
  [types.GET_DROPDOWN_INPUT_PROPS] (state) {
    return {
      label: state.label,
      labelAdded: state.labelAdded,
      choices: getChoiceDict(state),
      pybAnswer: state.pybAnswer,
      initialValue: state.initialValue,
      validations: JSON.stringify(state.validations.map((e) => { return e.name; }))
    };
  },
  [types.GET_DROPDOWN_INPUT_FORM_VALID] (state, getters) {
    return utils.toFormValidation(getters[types.GET_DROPDOWN_INPUT_ERRORS]);
  },
  [types.GET_DROPDOWN_INPUT_ERRORS] (state) {
    return utils.toMultiDict(getErrors(state));
  }
};

export const mutations = {
  [types.MUTATE_DROPDOWN_ANSWER_FIELD] (state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_DROPDOWN_INITIAL_VALUE] (state, payload) {
    state.initialValue = payload;
  },
  [types.MUTATE_CLEAR_DROPDOWN_INPUT_FORM] (state) {
    Object.assign(state, initialState());
  },
  [types.MUTATE_DROPDOWN_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_DROPDOWN_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_DROPDOWN_UPDATE_CHOICE] (state, { choice, index }) {
    state.choiceList.splice(index, 1, choice);
  },
  [types.MUTATE_DROPDOWN_DELETE_CHOICE] (state, index) {
    state.choiceList.splice(index, 1);
  },
  [types.MUTATE_DROPDOWN_ADD_CHOICE] (state) {
    const newObj = getChoiceObject();
    state.choiceList.push(newObj);
  },
  [types.MUTATE_DROPDOWN_VALIDATIONS] (state, payload) {
    state.validations = payload;
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
