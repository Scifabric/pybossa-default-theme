<template>
  <div class="row" style="margin-top:15px">
    <div class="form-group">
      <input
        id="add-label"
        v-model="labelAdded"
        type="checkbox"
      >
      <label for="add-label">
        Add Label
      </label>
      <input
        v-if="labelAdded === true"
        id="component-label"
        v-model="label"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        for="pyb-answer"
      >
        Answer field name | <span class="label-tip">The field where the worker's answer is stored.</span>
      </label>
      <input
        id="pyb-answer"
        v-model="pybAnswer"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <label
        for="editMode"
      >
        Edit mode
      </label>
      <select
        id="editMode"
        v-model="editMode"
        :class="{'danger-validation':getErrors(`readOnly`)}"
      >
        <option
          selected
          value="readWrite"
        >
          Add new tags and edit/remove existing tags
        </option>
        <option value="readOnly">
          Only view existing tags
        </option>
      </select>
      <div class="danger-validation-text">
        {{ getErrors(`readOnly`) }}
      </div>
    </div>
    <hr>
    <h4>
      Tags
    </h4>
    <div
      id="tags"
      class="scroll col-md-12"
    >
      <div class="row">
        <div class="col-md-12">
          <div
            v-for="(tag, index) in tagList"
            :key="index"
            class="row"
          >
            <hr
              v-if="index != 0"
              size="100px"
            >
            <label>Tag {{ index + 1 }}</label>
            <button
              v-if="tagList.length > 1"
              :id="`column-delete${index}`"
              class="btn btn-times-delete pull-right fa fa-times"
              :title="`Delete Tag ${index + 1}`"
              @click="deleteTag(index)"
            /><br>
            <label
              class="col-labels"
              for="component-label"
            >
              Name | <span class="label-tip">The tag name to store in the answer</span>
            </label>
            <input
              id="component-label"
              v-model="tag.name"
              class="form-control form-control-sm"
              :class="{'danger-validation':getErrors(`tagList[${index}].name`)}"
              type="text"
            >
            <div class="danger-validation-text">
              {{ getErrors(`tagList[${index}].name`) }}
            </div>
            <label
              class="col-labels"
              for="value"
            >
              Display | <span class="label-tip">The tag name to display in the selection menu</span>
            </label>
            <input
              id="value"
              v-model="tag.display"
              class="form-control form-control-sm"
              :class="{'danger-validation':getErrors(`tagList[${index}].display`)}"
              type="text"
            >
            <div class="danger-validation-text">
              {{ getErrors(`tagList[${index}].display`) }}
            </div>
            <label
              class="col-labels"
              for="value"
            >
              Color | <span class="label-tip">The background color for the tag.</span>
            </label>
            <input
              id="value"
              v-model="tag.color"
              class="form-control form-control-sm"
              :class="{'danger-validation':getErrors(`tagList[${index}].color`)}"
              type="color"
            >
            <div class="danger-validation-text">
              {{ getErrors(`tagList[${index}].color`) }}
            </div>
          </div>
          <br>
        </div>
      </div>
    </div>
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-2"
      @click="addTag"
    >
      Add Tag
    </button>
    <div class="row">
      <h4 class="col-sm-12">
        Text &amp; Entities
      </h4>
      <div class="col-sm-12">
        <label
          class="col-labels right-padding-radio"
        >
          <input
            v-model="sourceType"
            value="variable"
            type="radio"
          >
          From Variable
        </label>
        <label
          class="col-labels"
        >
          <input
            v-model="sourceType"
            value="static"
            type="radio"
          >
          Static
        </label>
      </div>
    </div>
    <div
      v-if="sourceType==='variable'"
      class="form-group"
    >
      <input
        id="useStatic"
        v-model="useStaticInPreview"
        style="vertical-align:top"
        type="checkbox"
      >
      <label
        for="useStatic"
      >
        Use static in preview.<br><span class="label-tip">Check this if you want to configure some sample data under the static option for preview purposes while using a variable in your code.</span>
      </label>
      <div class="danger-validation-text">
        {{ getErrors(`useStaticInPreview`) }}
      </div>
    </div>
    <label
      class="col-labels"
      for="textSource"
    >
      Text {{ sourceType === "variable" ? "Variable": "" }} | <span class="label-tip">{{ (sourceType === 'variable') ? 'The variable in your code that holds the text to display. For example, task.info.text.' : 'The static text to display' }}</span>
    </label>
    <input
      id="textSource"
      v-model="textSource"
      type="text"
      class="form-control form-control-sm"
      :class="{'danger-validation':getErrors(`text.${sourceType}`)}"
    >
    <div class="danger-validation-text">
      {{ getErrors(`text.${sourceType}`) }}
    </div>
    <template v-if="sourceType==='variable'">
      <label
        class="col-labels"
        for="entitySource"
      >
        Entities Variable | <span class="label-tip">The variable in your code that contains the entities. For example, task.info.entities.</span>
      </label>
      <input
        id="entitySource"
        v-model="entitySource"
        type="text"
        class="form-control form-control-sm"
        :class="{'danger-validation':getErrors(`entities.variable`)}"
      >
      <div class="danger-validation-text">
        {{ getErrors(`entities.variable`) }}
      </div>
    </template>
    <template v-else-if="sourceType==='static'">
      <label
        class="col-labels"
        :class="{'danger-validation-text':getErrors(`entities.static`)}"
      >
        {{ entityList.length ? "Entities" : "No Entities" }}
      </label>
      <div class="danger-validation-text">
        {{ getErrors(`entities.static`) }}
      </div>
      <div
        id="entities"
        class="scroll col-md-12"
      >
        <div class="row">
          <div class="col-md-12">
            <div
              v-for="(entity, index) in entityList"
              :key="index"
              class="row"
            >
              <hr
                v-if="index != 0"
                size="100px"
              >
              <label>Entity {{ index + 1 }}</label>
              <button
                :id="`column-delete${index}`"
                class="btn btn-times-delete pull-right fa fa-times"
                :title="`Delete Entity ${index + 1}`"
                @click="deleteEntity(index)"
              /><br>
              <label
                class="col-labels"
                for="headoffset"
              >
                Head Offset | <span class="label-tip">The character position where the entity starts. Count starts with 0.</span>
              </label>
              <input
                id="headoffset"
                v-model.number="entity.headoffset"
                class="form-control form-control-sm"
                :class="{'danger-validation':getErrors(`entities.static[${index}].headoffset`)}"
                type="text"
              >
              <div class="danger-validation-text">
                {{ getErrors(`entities.static[${index}].headoffset`) }}
              </div>
              <label
                class="col-labels"
                for="tailoffset"
              >
                Tail Offset | <span class="label-tip">The character position AFTER the entity ends. Count starts with 0.</span>
              </label>
              <input
                id="tailoffset"
                v-model.number="entity.tailoffset"
                class="form-control form-control-sm"
                :class="{'danger-validation':getErrors(`entities.static[${index}].tailoffset`)}"
                type="text"
              >
              <div class="danger-validation-text">
                {{ getErrors(`entities.static[${index}].tailoffset`) }}
              </div>
              <label
                class="col-labels"
                for="taggedtype"
              >
                Tag Name | <span class="label-tip">The tag to apply to the entity. Must be one of the configured tags.</span>
              </label>
              <select
                id="taggedtype"
                v-model="entity.taggedtype"
                :class="{'danger-validation':getErrors(`entities.static[${index}].taggedtype`)}"
                class="form-control form-control-sm"
              >
                <option
                  v-for="tagName in tagNames"
                  :key="tagName"
                  :value="tagName"
                >
                  {{ tagName }}
                </option>
              </select>
              <div class="danger-validation-text">
                {{ getErrors(`entities.static[${index}].taggedtype`) }}
              </div>
            </div>
            <br>
          </div>
        </div>
      </div>
      <button
        id="addEntity"
        class="btn btn-default btn-sm col-sm-2 col-md-2"
        @click="addEntity"
      >
        Add Entity
      </button>
    </template>
  </div>
</template>
<style>
.col-labels {
  color: black;
  font-size: 16px;
  font-weight: 400;
}
.label-tip {
  font-style: italic;
  font-weight: 400;
  font-size: smaller;
}
.scroll {
  width: flex;
  max-height: 300px;
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.danger-validation {
  border-color: #d9534f;
}
.danger-validation-text {
  color: #d9534f;
}
</style>
<script>
import { mapMutations, mapState } from 'vuex';
import * as types from '../../store/types';
import { chain } from 'lodash';

function scrollToEnd (selector) {
  const container = document.querySelector(selector);
  if (container) {
    const scrollHeight = container.scrollHeight;
    container.scrollTop = scrollHeight;
  }
}

export default {
  name: 'TextTaggingForm',
  components: {},
  data () {
    return {
      scrollToEndSelectors: []
    };
  },
  computed: {
    useStaticInPreview: {
      get () {
        return this.$store.state.textTagging.useStaticInPreview;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_USE_STATIC_IN_PREVIEW, newValue);
      }
    },
    tagNames: {
      get () {
        return chain(this.tagList).map('name').filter().uniq().value();
      }
    },
    entitySource: {
      get () {
        return this.$store.state.textTagging.entities.variable;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE, newValue);
      }
    },
    sourceType: {
      get () {
        return this.$store.state.textTagging.sourceType;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_SOURCE_TYPE, newValue);
      }
    },
    textSource: {
      get () {
        return this.$store.state.textTagging.text[this.sourceType];
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_TEXT, newValue);
      }
    },
    editMode: {
      get () {
        return this.$store.state.textTagging.readOnly ? 'readOnly' : 'readWrite';
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_READONLY, newValue === 'readOnly');
      }
    },
    pybAnswer: {
      get () {
        return this.$store.state.textTagging.pybAnswer;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_ANSWER_FIELD, newValue);
      }
    },
    labelAdded: {
      get () {
        return this.$store.state.textTagging.labelAdded;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_LABEL_ADDED, newValue);
      }
    },
    label: {
      get () {
        return this.$store.state.textTagging.label;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_LABEL, newValue);
      }
    },
    ...mapState({
      tagList: state => state.textTagging.tagList,
      entityList: state => state.textTagging.entities.static
    })
  },
  updated () {
    this.scrollToEndSelectors.forEach(scrollToEnd);
    this.scrollToEndSelectors = [];
  },
  methods: {
    ...mapMutations({
      'deleteTag': types.MUTATE_TEXT_TAGGING_DELETE_TAG,
      'deleteEntity': types.MUTATE_TEXT_TAGGING_DELETE_ENTITY
    }),
    getErrors (key) {
      return (this.$store.getters[types.GET_TEXT_TAGGING_ERRORS][key] || []).join('\n');
    },
    addTag () {
      this.$store.commit(types.MUTATE_TEXT_TAGGING_ADD_TAG);
      this.scrollToEndSelectors.push('#tags');
    },
    addEntity () {
      this.$store.commit(types.MUTATE_TEXT_TAGGING_ADD_ENTITY);
      this.scrollToEndSelectors.push('#entities');
    }
  }
};
</script>
