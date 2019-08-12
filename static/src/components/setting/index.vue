<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div
        v-for="category in inputFields"
        :key="category.display"
        class="form-group row"
      >
        <div class="col-md-5">
          <p> {{ category.display }} </p>
        </div>
        <div class="col-md-7 pull-right">
          <div
            v-for="field in category.fields"
            :key="field.name"
          >
            <input
              v-if="field.type==='TextField'"
              v-model="externalConfigDict[field.name]"
              type="text"
              class="form-control input-sm"
            >
            <select
              v-if="field.type==='SelectField'"
              v-model="externalConfigDict[field.name]"
              class="form-control input-sm"
            >
              <option
                v-for="choice in field.choices"
                :key="choice[0]"
                :value="choice[0]"
              >
                {{ choice[1] }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        v-if="privateInstance"
        class="form-group row"
      >
        <div class="col-md-5">
          <p> data access </p>
        </div>
        <div class="col-md-7 pull-right">
          <div class="form-check">
            <span
              v-for="(lvalue, level) in accessLevels"
              :key="level"
              :value="lvalue"
            >
              <input
                v-model="accessLevels[level]"
                class="form-check-input"
                type="checkbox"
              >
              <label
                class="form-check-label"
                for="defaultCheck1"
              >
                <p> {{ level }} &nbsp;</p>
              </label>
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="privateInstance"
        class="form-group row"
      >
        <div class="col-md-5">
          <p> assign users </p>
        </div>
        <div class="col-md-7 pull-right">
          <table
            class="table table-striped table-hover"
            style="border: 1px ridge silver"
          >
            <thead>
              <tr style="border-top: 1px ridge silver">
                <th style="border-right: 1px ridge silver; text-align: center">
                  All Users
                </th>
                <th style="text-align: center">
                  Assigned Users
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border-right: 1px ridge silver; width:50%">
                  <input
                    v-model="search"
                    class="form-group input-sm"
                    type="text"
                    placeholder="Search for name.."
                    style="min-width: 250px"
                    @keyup.enter="filter"
                  >
                  <div class="col-md-12 scroll">
                    <div
                      v-for="u in searchResult"
                      id="users"
                      :key="u.id"
                      class="row"
                      :value="u"
                      @click="add($event, u)"
                    >
                      <p
                        v-if="Object.keys(assignee).includes(u.id)"
                        style="color:teal"
                      >
                        {{ u.fullname }}
                      </p>
                      <p v-else>
                        {{ u.fullname }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="col-md-12 scroll">
                    <div
                      v-for="u in assignee"
                      id="users"
                      :key="u.name"
                      class="row"
                      :value="u.field"
                      @click="remove($event, u.id)"
                    >
                      <p> {{ u.fullname }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button
          class="btn btn-sm btn-primary"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {

  props: {
    csrfToken: {
      type: String,
      default: null
    },
    dataAccessConfig: {
      type: Array,
      default: function () { return []; }
    },
    assignUsers: {
      type: Array,
      default: function () { return []; }
    },
    allUsers: {
      type: Array,
      default: function () { return []; }
    },
    privateInstance: {
      type: Boolean,
      default: true
    },
    externalConfig: {
      type: Object,
      default: () => ({})
    },
    externalConfigForm: {
      type: Object,
      default: () => ({})
    },
    validAccessLevels: {
      type: Array,
      default: () => ([])
    }
  },

  data () {
    return {
      assignee: {},
      users: {},
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      accessLevels: {},
      search: '',
      searchResult: this.users,
      inputFields: [],
      externalConfigDict: {}
    };
  },

  mounted () {
    this.assignee = this.getAssignedUsers();
    this.users = this.getUsers();
    this.searchResult = this.users;
    this.inputFields = this.getFieldsFromForm();
    this.accessLevels = this.getAccessLevels();
  },

  methods: {
    hasLevel (level) {
      return this.dataAccessConfig.includes(level);
    },

    getAccessLevels () {
      let levels = {};
      let access = this.dataAccessConfig;
      this.validAccessLevels.forEach(function (level) {
        levels[level] = access.includes(level);
      });
      return levels;
    },

    getAssignedUsers () {
      let users = {};
      this.assignUsers.forEach(function (u) {
        users[u.id] = u;
      });
      return users;
    },

    getUsers () {
      let users = {};
      let assigneeId = Object.keys(this.assignee);
      this.allUsers.forEach(function (u) {
        u['assigned'] = assigneeId.includes(u.id);
        users[u.id] = u;
      });
      return users;
    },

    // external configuration form is a tree-like distionary structure read from app.config
    // convert it to flat key-value pair 'externalConfigDict'
    // update 'externalConfigDict' based on current project configuration
    getFieldsFromForm () {
      let inputFields = [];
      let configFields = {};
      for (let [key, content] of Object.entries(this.externalConfigForm)) {
        content = this.externalConfigForm[key];
        inputFields.push(content);
        content.fields.forEach(function (f) {
          configFields[f.name] = null;
        });
      }
      this.externalConfigDict = configFields;
      this.updateExternalConfigDict();
      return inputFields;
    },

    updateExternalConfigDict () {
      for (let key of Object.keys(this.externalConfig)) {
        if (typeof this.externalConfig[key] === 'object') {
          Object.assign(this.externalConfigDict, this.externalConfig[key]);
          } else this.externalConfigDict[key] = this.externalConfig[key];
        }
    },

    constructExternalConfigFromDict () {
      let config = {};
      let dict = this.externalConfigDict;
      for (let [key, content] of Object.entries(this.externalConfigForm)) {
        let _cf = {};
        content.fields.forEach(function (f) {
          _cf[f.name] = dict[f.name];
        });
        config[key] = _cf;
      }
      return config;
    },

    add (event, ur) {
      Vue.set(this.assignee, ur.id, ur);
      this.assignee[ur.id] = ur;
    },

    remove (event, id) {
      Vue.delete(this.assignee, id);
    },

    filter () {
      if (!this.search.length) {
        this.searchResult = this.allUsers;
      } else {
        this.searchResult = this.allUsers.filter(
          user => user.fullname.toLowerCase().includes(this.search.toLowerCase()));
      }
    },

    async save () {
      let access = [];
       for (let [key, value] of Object.entries(this.accessLevels)) {
         if (value) {
           access.push(key);
         }
       }
      let assigneeId = Object.keys(this.assignee);
      try {
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 'project': {
            config: this.constructExternalConfigFromDict(),
            data_access: access,
            select_users: assigneeId
          } })
        });
        if (res.ok) {
          window.pybossaNotify('Project data Saved.', true, 'success');
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
        // const res = await fetch('/project/weirantestproject/assign-users', {
        //   method: 'POST',
        //   headers: {
        //     'content-type': 'application/json',
        //     'X-CSRFToken': this.csrfToken
        //   },
        //   credentials: 'same-origin',
        //   body: JSON.stringify({ 'project': {
        //     select_users: assigneeId
        //   } })
        // });
        // if (!res.ok) {
        //   window.pybossaNotify('An error occurred.', true, 'error');
        // }
        // res = await fetch('/project/weirantestproject/ext-config', {
        //   method: 'POST',
        //   headers: {
        //     'content-type': 'application/json',
        //     'X-CSRFToken': this.csrfToken
        //   },
        //   credentials: 'same-origin',
        //   body: JSON.stringify({ 'project': {
        //     config: this.constructExternalConfigFromDict()
        //   } })
        // });
        // if (!res.ok) {
        //   window.pybossaNotify('An error occurred.', true, 'error');
        // }
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    }
  }
};

</script>
<style>

.scroll #users:hover {background-color: #ddd}
.scroll #users {padding-left: 10px; box-sizing: border-box;}
.scroll p {
  color: black;
  padding: 2px 2px;
  text-decoration: none;
  display: block;
}
.scroll {
  overflow-x: hidden;
  max-height: 150px;
  overflow-y: scroll;
}
.form-check-label p {
  margin-right:10px
}

</style>
