<template>
  <div class="stats-config row">
    <div class="col-sm-12">
      <div class="form-group row">
        <div class="col-sm-4">
          <p> bcos bucket </p>
        </div>
        <div class="col-sm-8 pull-right">
          <input
            v-model="bcos"
            type="text"
            class="form-control input-sm"
          >
        </div>
      </div>
      <div
        v-if="isPrivate"
        class="form-group row"
      >
        <div class="col-sm-4">
          <p> data access </p>
        </div>
        <div class="col-sm-8 pull-right">
          <div class="form-check">
            <input
              v-model="L1"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="defaultCheck1"
            >
              <p> L1: Personnel access </p>
            </label>
          </div>
          <div class="form-check">
            <input
              v-model="L2"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="defaultCheck1"
            >
              <p> L2: Vendor, Contingent Worker and users in L1 access </p>
            </label>
          </div>
          <div class="form-check">
            <input
              v-model="L3"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="defaultCheck1"
            >
              <p> L3: Freelancer and users in L2 access</p>
            </label>
          </div>
          <div class="form-check">
            <input
              v-model="L4"
              class="form-check-input"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="defaultCheck1"
            >
              <p> L4: Crowdsourcing Worker and users in L3 access  </p>
            </label>
          </div>
        </div>
      </div>
      <div
        v-if="isPrivate"
        class="form-group row"
      >
        <div class="col-sm-4">
          <p> assign users </p>
        </div>
        <div class="col-sm-8 pull-right">
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
                  <div class="col-sm-12 scroll">
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
                  <div class="col-sm-12 scroll">
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
    dataAccess: {
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
    isPrivate: {
      type: Boolean,
      default: true
    },
    externalConfig: {
      type: Object,
      default: () => ({ gigwork_poller: { target_bucket: null } })
    }
  },

  data () {
    return {
      bcos: this.externalConfig.gigwork_poller.target_bucket,
      assignee: {},
      users: {},
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      search: '',
      searchResult: this.users
    };
  },

  mounted: function () {
    var _this = this;
    _this.assignee = _this.getAssignedUsers();
    _this.users = _this.getUsers();
    _this.searchResult = _this.users;
    _this.L1 = _this.hasLevel('L1');
    _this.L2 = _this.hasLevel('L2');
    _this.L3 = _this.hasLevel('L3');
    _this.L4 = _this.hasLevel('L4');
  },

  methods: {
    hasLevel (level) {
      for (var i = 0; i < this.dataAccess.length; i++) {
        if (this.dataAccess[i] === level) {
          return true;
        }
      }
      return false;
    },

    getAssignedUsers () {
      var users = {};
      for (var i = 0; i < this.assignUsers.length; i++) {
        users[this.assignUsers[i].id] = this.assignUsers[i];
      }
      return users;
    },

    getUsers () {
      var users = {};
      for (var i = 0; i < this.allUsers.length; i++) {
        var u = this.allUsers[i];
        u['assigned'] = Object.keys(this.assignee).includes(u.id);
        users[u.id] = u;
      }
      return users;
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
      }
      else {
        this.searchResult = this.allUsers.filter(
          user => user.fullname.toLowerCase().includes(this.search.toLowerCase()))
      }
    },

    async save () {
      var access = [];
      if (this.L1) {
        access.push('L1');
      }
      if (this.L2) {
        access.push('L2');
      }
      if (this.L3) {
        access.push('L3');
      }
      if (this.L4) {
        access.push('L4');
      }
      var assigneeId = Object.keys(this.assignee);
      try {
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 'project': {
            target_bucket: this.bcos,
            data_access: access,
            project_users: assigneeId
          } })
        });
        if (res.ok) {
          window.pybossaNotify('Project data Saved.', true, 'success');
        } else {
          window.pybossaNotify('An error occurred.', true, 'error');
        }
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
