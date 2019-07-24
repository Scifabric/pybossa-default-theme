<template>
  <div class="stats-config row">
    <div class="col-sm-12">
      {{assignee}}
  {{assignUsers}}
      <div class="form-group row">
        <div class="col-sm-4">
          <p> bcos bucket </p>
        </div>
        <div class="col-sm-8 pull-right">
          <input
            :disabled="!editable"
            v-model="bcos"
            type="text"
            class="form-control input-sm"
            />
        </div>
      </div>
      <div v-if="isPrivate" class="form-group row">
        <div class="col-sm-4">
          <p> data_access </p>
        </div>
        <div class="col-sm-8 pull-right">
          <span >
            <div class="form-check">
              <input :disabled="!editable" class="form-check-input" type="checkbox" v-model="L1">
              <label class="form-check-label" for="defaultCheck1">
                <p > L1  </p>
              </label>
              <input :disabled="!editable" class="form-check-input" type="checkbox" v-model="L2">
              <label class="form-check-label" for="defaultCheck1">
                <p> L2  </p>
              </label>
              <input :disabled="!editable" class="form-check-input" type="checkbox" v-model="L3">
              <label class="form-check-label" for="defaultCheck1">
                 <p> L3  </p>
              </label>
              <input :disabled="!editable" class="form-check-input" type="checkbox" v-model="L4">
              <label class="form-check-label" for="defaultCheck1">
                 <p> L4  </p>
              </label>
            </div>
          </span>
        </div>
      </div>
      <div v-if="isPrivate" class="form-group row">
        <div class="col-sm-4">
          <p> assign users </p>
        </div>
        <div class="col-sm-8 pull-right">
          <div v-if="Object.keys(assignee).length">
            <p>
              <span
                v-for="u in assignee"
                :key="u.name"
                :value="u.field"
                class=" label label-lg label-info"
                @click="remove($event, u.id)"
              >
                {{u.fullname}}
              </span>
            </p>
          </div>
          <div v-else> <p> No users are assigned to this project yet </p></div>
          <div v-if="editable" class="dropdown-content">
            <input :disabled="!editable"
              class="form-group input-sm"
              type="text"
              placeholder="Search for name.."
              style="min-width: 250px"
              v-on:keyup.enter="filter"
              v-model="search"
            >
            <div class="scroll" style="max-height: 150px;">
            <div
              v-for="u in searchResult"
              :key="u['id']"
              :value="u"
              class="row"
              @click="add($event, u)"
            >
            <p> {{u['fullname']}} </p>
            </div>
            </div>
        </div>
        </div>
      </div>
      <div  class="row">

      </div>

      <div v-if="!editable">
        <button
        class="btn btn-sm btn-primary"
        @click="toggleEditable"
        >
        Edit
        </button>
      </div>
      <div v-else>
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
      default: []
    },
    assignUsers: {
      type: Array,
      default: []
    },
    allUsers: {
      type: Array,
      default: []
    },
    isPrivate: {
      type: Boolean,
      default: true
    },
    externalConfig: {
      type: Object,
      default: () => ({gigwork_poller: {target_bucket: null} })
    }
  },

  data () {
    return {
      editable: false,
      bcos: null,
      assignee: {},
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      search: "",
      searchResult: this.allUsers
    };
  },

  mounted: function () {
    var _this = this
    _this.assignee = _this.getUsers()
    _this.L1 = _this.hasLevel("L1")
    _this.L2 = _this.hasLevel("L2")
    _this.L3 = _this.hasLevel("L3")
    _this.L4 = _this.hasLevel("L4")
  },

  methods: {

    toggleEditable() {
      this.editable = !this.editable;
    },

    hasLevel(level) {
      for(var i=0; i<this.dataAccess.length; i++){
        if (this.dataAccess[i] === level){
          return true;
        }
      }
      return false
    },

    getUsers() {
      var users = {}
      for (var i=0; i < this.assignUsers.length; i++) {
        users[this.assignUsers[i].id] = this.assignUsers[i]
      }
      return users
    },

    add( event, ur ){
      if (this.editable) {
        Vue.set(this.assignee, ur.id, ur)
        this.assignee[ur.id] = ur
      }
    },

    remove( event, id ) {
      if (this.editable) {
        Vue.delete(this.assignee, id)
      }
    },

    filter(){
      if (!this.search.length){
        this.searchResult = this.allUsers
      }
      else {
        this.searchResult = []
        for (var i=0; i< this.allUsers.length; i++){
          var name = this.allUsers[i].fullname.toLowerCase()
          if (name.includes(this.search.toLowerCase())){
            this.searchResult.push(this.allUsers[i])
          }
        }
      }
    },

    async save () {
      var access = []
      if (this.L1){
        access.push("L1")
      }
      if (this.L2){
        access.push("L2")
      }
      if (this.L3){
        access.push("L3")
      }
      if (this.L4){
        access.push("L4")
      }
      var assigneeId = Object.keys(this.assignee)
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
            project_users: assigneeId,
          }})
        });
        if (res.ok) {
          this.toggleEditable();
          const data = await res.json();
          window.pybossaNotify(data.flash, true, data.status);
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
ƒ

.dropbtn:hover, .dropbtn:focus {
  background-color: #3e8e41;
}

.dropdown-content {

  position: absolute;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
}

.dropdown-content a {
  color: black;
  padding: 12px 15px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #ddd;}
.dropdown-content .row:hover {background-color: #ddd}
.dropdown-content .row {padding-left: 30px; box-sizing: border-box;}

.scroll #users {
  overflow-x: hidden;
  max-height: 150px;
  overflow-y: scroll;
}
.form-check-label p {
  margin-right:10px
}
</style>
