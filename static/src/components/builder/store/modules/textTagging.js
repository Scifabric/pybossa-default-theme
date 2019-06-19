import * as types from '../types';
import { flatten } from 'lodash';

export function initialState () {
  const firstTag = getTagObject();
  return {
    label: '',
    labelAdded: false,
    tagList: [firstTag],
    pybAnswer: '',
    readOnly: false,
    text: {
      sourceType: 'variable',
      variable: '',
      static: ''
    },
    entities: {
      sourceType: 'none',
      static: [],
      variable: '',
      useStaticInPreview: false
    }
  };
}

export function getTagObject () {
  return {
    name: '',
    display: '',
    color: ''
  };
}

export function getEntityObject () {
  return {
    headoffset: '',
    tailoffset: '',
    taggedtype: ''
  };
};

export const state = {
  ...initialState()
};

function getTrimmedTags (tagList) {
  return tagList.map(trimTag);

  function trimTag ({ name, display, color }) {
    return { name: name.trim(), display: display.trim(), color: color.trim() };
  }
}

function getColorCSS (colorString) {
    const ele = document.createElement('div');
    ele.style.color = colorString;
    return ele.style.color.split(/\s+/).join('').toLowerCase();
}

function isValidColor (colorString) {
  return !!getColorCSS(colorString);
}

function isNonNegativeInteger (value) {
  return Number.isInteger(value) && value >= 0;
}

function getEntities (state) {
  switch (state.entities.sourceType) {
    case 'none':
      return { snippet: [], preview: [] };
    case 'variable':
      const preview = state.entities.useStaticInPreview ? getStaticEntities() : [];
      return {
        snippet: state.entities.variable,
        preview
      };
    case 'static':
      const staticEntities = getStaticEntities();
      return { snippet: staticEntities, preview: staticEntities };
  }

  function getStaticEntities () {
      return state.entities.static.map(entity => ({ recognized: entity }));
  }
}

function getText (state) {
  switch (state.text.sourceType) {
    case 'static':
      const staticText = state.text.static.trim();
      return { snippet: staticText, preview: staticText };
    case 'variable':
      return { snippet: state.text.variable.trim(), preview: '' };
  }
}

export const getters = {
  [types.GET_TEXT_TAGGING_PROPS] (state) {
    return {
      label: state.label,
      labelAdded: state.labelAdded,
      tagList: getTrimmedTags(state.tagList),
      pybAnswer: state.pybAnswer.trim(),
      readOnly: state.readOnly,
      text: getText(state),
      entities: getEntities(state)
    };
  },
  [types.GET_TEXT_TAGGING_FORM_VALID] (state, getters) {
    const messages = flatten(Object.values(getters[types.GET_TEXT_TAGGING_ERRORS]));
    const isValid = !messages.length;
    return { isValid, messages };
  },
  [types.GET_TEXT_TAGGING_ERRORS] (state) {
    const errors = {};
    for (const [key, message] of getErrors()) {
      let messages = errors[key];
      if (!messages) {
        messages = errors[key] = [];
      }
      messages.push(message);
    }
    return errors;

    function* getErrors () {
      const uniqueTagNames = new Set();
      for (const [index, { name, display, color }] of getTrimmedTags(state.tagList).entries()) {
        const tagId = `Tag ${index + 1}`;
        let key = `tagList[${index}].display`;
        if (!display) yield [key, `${tagId} display cannot be blank.`];

        key = `tagList[${index}].color`;
        if (!color) yield [key, `${tagId} color cannot be blank.`];
        else if (!isValidColor(color)) yield [key, `${tagId} color is not a valid color.`];

        key = `tagList[${index}].name`;
        if (!name) yield [key, `${tagId} name cannot be blank.`];
        else if (uniqueTagNames.has(name)) yield [key, `${tagId} name is not unique.`];
        else uniqueTagNames.add(name);
      }

      if (state.entities.sourceType === 'static') {
          for (const [index, { headoffset, tailoffset, taggedtype }] of state.entities.static.entries()) {
            const entityId = `Entity ${index + 1}`;
            let key = `entities.static[${index}].`;
            if (!taggedtype) yield [key + 'taggedtype', `${entityId} tag name cannot be blank.`];
            if (!isNonNegativeInteger(headoffset)) yield [key + 'headoffset', `${entityId} head offset must be a non-negative integer.`];

            if (!isNonNegativeInteger(tailoffset)) yield [key + 'tailoffset', `${entityId} tail offset must be a non-negative integer.`];
            else if (state.text.sourceType === 'static') {
              if (state.text.static.length < tailoffset) {
                const message = `${entityId} tail offset exceeds the length of the text.`;
                yield [key + 'tailoffset', message];
                yield ['text.static', message];
              }
            }
          }
      } else if (state.entities.sourceType === 'variable') {
          if (!state.entities.variable.trim()) yield ['entities.variable', 'Entities variable cannot be blank.'];
      }

      if (state.text.sourceType === 'static' && !state.text.static.trim()) yield ['text.static', 'Text is required.'];
      if (state.text.sourceType === 'variable' && !state.text.variable.trim()) yield ['text.variable', 'Text variable is required.'];
    }
  }
};

export const mutations = {
  [types.MUTATE_TEXT_TAGGING_ANSWER_FIELD] (state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_TEXT_TAGGING_TEXT] (state, payload) {
    state.text[state.text.sourceType] = payload;
  },
  [types.MUTATE_TEXT_TAGGING_TEXT_SOURCE_TYPE] (state, payload) {
    state.text.sourceType = payload;
  },
  [types.MUTATE_CLEAR_TEXT_TAGGING_FORM] (state) {
    Object.assign(state, initialState());
  },
  [types.MUTATE_TEXT_TAGGING_LABEL_ADDED] (state, payload) {
    state.labelAdded = payload;
  },
  [types.MUTATE_TEXT_TAGGING_LABEL] (state, payload) {
    state.label = payload;
  },
  [types.MUTATE_TEXT_TAGGING_READONLY] (state, payload) {
    state.readOnly = payload;
  },
  [types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE_TYPE] (state, payload) {
    state.entities.sourceType = payload;
  },
  [types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE] (state, payload) {
    state.entities.variable = payload;
  },
  [types.MUTATE_TEXT_TAGGING_USE_STATIC_IN_PREVIEW] (state, payload) {
    state.entities.useStaticInPreview = payload;
  },
  [types.MUTATE_TEXT_TAGGING_DELETE_TAG] (state, index) {
    state.tagList.splice(index, 1);
  },
  [types.MUTATE_TEXT_TAGGING_ADD_TAG] (state) {
    const newObj = getTagObject();
    state.tagList.push(newObj);
  },
  [types.MUTATE_TEXT_TAGGING_ADD_ENTITY] (state) {
    const newObj = getEntityObject();
    state.entities.static.push(newObj);
  },
  [types.MUTATE_TEXT_TAGGING_DELETE_ENTITY] (state, index) {
    state.entities.static.splice(index, 1);
  }
};

export default {
  state,
  mutations,
  actions: {},
  getters
};
