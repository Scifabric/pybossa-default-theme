import * as types from '../types';
import utils from '../../utils';

export function initialState () {
  const firstTag = getTagObject();
  return {
    label: '',
    labelAdded: false,
    tagList: [firstTag],
    pybAnswer: '',
    readOnly: false,
    sourceType: 'variable',
    useStaticInPreview: false,
    text: {
      variable: '',
      static: ''
    },
    entities: {
      static: [],
      variable: ''
    }
  };
}

export function getTagObject () {
  return {
    name: '',
    display: '',
    color: '#000000'
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

function isPositiveInteger (value) {
  return Number.isInteger(value) && value > 0;
}

function getEntities (state) {
  switch (state.sourceType) {
    case 'variable':
      const preview = state.useStaticInPreview ? getStaticEntities() : [];
      return {
        snippet: state.entities.variable.trim() || [],
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
  switch (state.sourceType) {
    case 'static':
      const staticText = state.text.static.trim();
      return { snippet: staticText, preview: staticText };
    case 'variable':
      const preview = state.useStaticInPreview ? state.text.static.trim() : '';
      return { snippet: state.text.variable.trim(), preview };
  }
}

function getTagDict (state) {
  return getTrimmedTags(state.tagList).reduce(reducer, {});

  function reducer (result, tag) {
    result[tag.name] = tag;
    // This tag is a clone of the state so it's OK to mutate it.
    delete tag.name;
    return result;
  }
}

function* getErrors (state) {
  const uniqueTagNames = new Set();
  for (const [index, { name, display, color }] of getTrimmedTags(state.tagList).entries()) {
    const tagId = `Tag ${index + 1}`;
    let key = `tagList[${index}].display`;
    if (!display) yield [key, `${tagId} display is required.`];

    key = `tagList[${index}].color`;
    if (!color) yield [key, `${tagId} color is required.`];
    else if (!isValidColor(color)) yield [key, `${tagId} color is not a valid color.`];

    key = `tagList[${index}].name`;
    if (!name) yield [key, `${tagId} name is required.`];
    else if (uniqueTagNames.has(name)) yield [key, `${tagId} name is not unique.`];
    else uniqueTagNames.add(name);
  }

  if (state.sourceType === 'static') yield * validateStatic(state);
  else { // sourceType === 'variable'
    if (state.useStaticInPreview) {
      for (const [key, message] of validateStatic(state)) {
        yield [key, message];
        yield ['useStaticInPreview', message];
      }
    }

    if (!state.text.variable.trim()) yield ['text.variable', 'Text variable is required.'];
  }

  yield * validateReadOnly(state);
}

function* validateReadOnly (state) {
  if (!state.readOnly) return;

  const message = 'Read-Only mode requires entities.';

  if (state.sourceType === 'static' && !state.entities.static.length) yield ['entities.static', message];
  else if (state.sourceType === 'variable' && !state.entities.variable.trim()) yield ['entities.variable', message];
  else return;

  yield ['readOnly', message];
}

function* validateStatic (state) {
  for (const [index, { headoffset, tailoffset, taggedtype }] of state.entities.static.entries()) {
    const entityId = `Entity ${index + 1}`;
    let key = `entities.static[${index}].`;
    if (!taggedtype) yield [key + 'taggedtype', `${entityId} tag name is required.`];

    const headValid = isNonNegativeInteger(headoffset);
    const headKey = key + 'headoffset';
    if (!headValid) yield [headKey, `${entityId} head offset must be a non-negative integer.`];
    else if (state.text.static.length <= headoffset) {
      const message = `${entityId} head offset exceeds the length of the text.`;
      yield [headKey, message];
      yield ['text.static', message];
    }

    const tailValid = isPositiveInteger(tailoffset);
    const tailKey = key + 'tailoffset';
    if (!tailValid) yield [tailKey, `${entityId} tail offset must be a positive integer.`];
    else if (state.text.static.length < tailoffset) {
      const message = `${entityId} tail offset exceeds the length of the text.`;
      yield [tailKey, message];
      yield ['text.static', message];
    }

    if (headValid && tailValid) {
      if (tailoffset <= headoffset) {
        const message = `${entityId} tail offset must be greater than head offset.`;
        yield [tailKey, message];
        yield [headKey, message];
      }
    }
  }

  if (!state.text.static.trim()) yield ['text.static', 'Text is required.'];
}

export const getters = {
  [types.GET_TEXT_TAGGING_PROPS] (state) {
    return {
      label: state.label,
      labelAdded: state.labelAdded,
      tags: getTagDict(state),
      pybAnswer: state.pybAnswer.trim(),
      readOnly: state.readOnly,
      text: getText(state),
      entities: getEntities(state)
    };
  },
  [types.GET_TEXT_TAGGING_FORM_VALID] (state, getters) {
    return utils.toFormValidation(getters[types.GET_TEXT_TAGGING_ERRORS]);
  },
  [types.GET_TEXT_TAGGING_ERRORS] (state) {
    return utils.toMultiDict(getErrors(state));
  }
};

export const mutations = {
  [types.MUTATE_TEXT_TAGGING_ANSWER_FIELD] (state, payload) {
    state.pybAnswer = payload;
  },
  [types.MUTATE_TEXT_TAGGING_TEXT] (state, payload) {
    state.text[state.sourceType] = payload;
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
  [types.MUTATE_TEXT_TAGGING_SOURCE_TYPE] (state, payload) {
    state.sourceType = payload;
  },
  [types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE] (state, payload) {
    state.entities.variable = payload;
  },
  [types.MUTATE_TEXT_TAGGING_USE_STATIC_IN_PREVIEW] (state, payload) {
    state.useStaticInPreview = payload;
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
