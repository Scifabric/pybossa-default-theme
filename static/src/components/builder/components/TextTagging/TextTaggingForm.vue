<template>
  <div class="row">
    <h4>Text Tagging Settings</h4>
    <div class="form-group">
      <input
        id="add-label"
        v-model="labelAdded"
        type="checkbox"
      >
      <label for="add-label">
        Add Text Tagging Label
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
        Answer field name
      </label>
      <input
        id="pyb-answer"
        v-model="pybAnswer"
        class="form-control form-control-sm"
        type="text"
      >
    </div>
    <div class="form-group">
      <input
        id="readOnly"
        v-model="readOnly"
        type="checkbox"
      >
      <label
        for="readOnly"
      >
        Read-only
      </label>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <label>Text</label><br>
        <label
          class="col-labels right-padding-radio"
        >
          <input
            value="variable"
            v-model="textSourceType"
            type="radio"
          >
          Get text from variable
        </label>
        <label
          class="col-labels"
        >
          <input
            value="static"
            v-model="textSourceType"
            type="radio"
          >
          Enter static text
        </label>
      </div>
    </div>
    <input
      id="textSource"
      v-model="textSource"
      type="text"
      class="form-control form-control-sm"
      :title="(textSourceType === 'variable') ? 'The variable in your code that holds the text to display. For example, task.info.text.' : 'The static text to display'"
    >
    <hr>
    <h4>
      Tags
    </h4>
    <div id="tags" class="scroll col-md-12">
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
              @click="deleteTag(index)"
              :title="`Delete Tag ${index + 1}`"
            /><br>
            <label
              class="col-labels"
              for="component-label"
            >
              Name
            </label>
            <input
              id="component-label"
              v-model="tag.name"
              class="form-control form-control-sm"
              type="text"
              title="The tag name to store in the answer"
            >
            <label
              class="col-labels"
              for="value"
            >
              Display
            </label>
            <input
              id="value"
              class="form-control form-control-sm"
              type="text"
              v-model="tag.display"
              title="The tag name to display in the selection menu"
            >
            <label
              class="col-labels"
              for="value"
            >
              Color
            </label>
            <input
              id="value"
              class="form-control form-control-sm"
              type="text"
              v-model="tag.color"
              title="The background color for the tag. Can be any valid CSS color specification. For example, blue, #8A2BE2, RGB(80, 80, 80), HSL(0, 100%, 50%)."
            >
          </div>
          <br>
        </div>
      </div>
    </div>
    <div class="col-sm-10 col-md-11" />
    <button
      id="add"
      class="btn btn-default btn-sm col-sm-2 col-md-1"
      @click="addTag"
      title="Add a tag"
    >
      Add
    </button>
    <hr>
    <h4>
      Entities (Optional)
    </h4>
    <div class="row">
      <div class="col-sm-12">
        <label
          class="col-labels right-padding-radio"
        >
          <input
            value="none"
            v-model="entitySourceType"
            type="radio"
          >
          None
        </label>
        <label
          class="col-labels right-padding-radio"
        >
          <input
            value="variable"
            v-model="entitySourceType"
            type="radio"
          >
          From Variable
        </label>
        <label
          class="col-labels"
        >
          <input
            value="static"
            v-model="entitySourceType"
            type="radio"
          >
          Static
        </label>
      </div>
    </div>
    <template v-if="entitySourceType==='variable'">
      <input
        id="entitySource"
        v-model="entitySource"
        type="text"
        class="form-control form-control-sm"
        title="The variable in your code that contains the entities. For example, task.info.entities."
      >
      <div class="form-group">
        <input
          id="useStatic"
          type="checkbox"
          v-model="useStaticInPreview"
        >
        <label
          title="Check this and enter some static entities if you want to see pre-tagged entites in the preview while still using a variable in your code."
          for="useStatic">
          Use static in preview
        </label>
      </div>
    </template>
    <template v-else-if="entitySourceType==='static'">
      <div id="entities" class="scroll col-md-12">
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
                @click="deleteEntity(index)"
                :title="`Delete Entity ${index + 1}`"
              /><br>
              <label
                class="col-labels"
                for="headoffset"
              >
                Head Offset
              </label>
              <input
                id="headoffset"
                v-model.number="entity.headoffset"
                class="form-control form-control-sm"
                type="text"
                title="The character position where the entity starts. Count starts with 0."
              >
              <label
                class="col-labels"
                for="tailoffset"
              >
                Tail Offset
              </label>
              <input
                id="tailoffset"
                class="form-control form-control-sm"
                type="text"
                v-model.number="entity.tailoffset"
                title="The character position after the entity ends. Count starts with 0."
              >
              <label
                class="col-labels"
                for="taggedtype"
              >
                Tag Name
              </label>
              <select
                id="taggedtype"
                class="form-control form-control-sm"
                v-model="entity.taggedtype"
                title="The tag to apply to the entity. Must be one of the configured tags."
              >
                <option v-for="tagName in tagNames"
                  :key="tagName"
                  :value="tagName"
                >
                  {{ tagName }}
                </option>
              </select>
            </div>
            <br>
          </div>
        </div>
      </div>
      <div class="col-sm-10 col-md-11" />
      <button
        id="addEntity"
        class="btn btn-default btn-sm col-sm-2 col-md-1"
        @click="addEntity"
        title="Add an entity"
      >
        Add
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

.scroll {
  width: flex;
  max-height: 300px;
  overflow-x: hidden;
  max-height: 600px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
</style>
<script>
import { mapMutations, mapState } from 'vuex';
import * as types from '../../store/types';
import { cloneDeep, chain } from 'lodash';

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
        return this.$store.state.textTagging.entities.useStaticInPreview;
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
    entitySourceType: {
      get () {
        return this.$store.state.textTagging.entities.sourceType;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_ENTITY_SOURCE_TYPE, newValue);
      }
    },
    textSourceType: {
      get () {
        return this.$store.state.textTagging.text.sourceType;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_TEXT_SOURCE_TYPE, newValue);
      }
    },
    textSource: {
      get () {
        return this.$store.state.textTagging.text[this.textSourceType];
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_TEXT, newValue);
      }
    },
    readOnly: {
      get () {
        return this.$store.state.textTagging.readOnly;
      },
      set (newValue) {
        this.$store.commit(types.MUTATE_TEXT_TAGGING_READONLY, newValue);
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
      'deleteEntity': types.MUTATE_TEXT_TAGGING_DELETE_ENTITY,
    }),
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
