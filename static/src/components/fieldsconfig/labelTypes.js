'use strict';

const _types = {
  CATEGORICAL: 'categorical',
  CATEGORICAL_NESTED: 'categorical_nested',
  FREETEXT: 'freetext'
};

const config = {
  [_types.CATEGORICAL]: {
    display: 'Categorical',
    component: 'CategoricalFieldConfig',
    defaultConfig () {
      return { labels: [] };
    }
  },
  [_types.CATEGORICAL_NESTED]: {
    display: 'Categorical Nested',
    component: 'CategoricalNestedFieldConfig',
    defaultConfig () {
      return {
          kevValues: [],
          keys: []
        };
    }
  },
  [_types.FREETEXT]: {
    display: 'Free Text',
    component: 'FieldConfigBase',
    defaultConfig () {
      return {};
    }
  }
};

export default {
  default: _types.CATEGORICAL,
  config
};
