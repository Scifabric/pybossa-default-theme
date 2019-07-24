<template>
  <div class="stats-config row">
    <div class="col-sm-12">
      <div class="form-group row">
        <div class="col-sm-4">
          <p> project owner </p>
        </div>
        <div class="col-sm-8 pull-right">
          <p> name </p>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-4">
          <p> co-owners </p>
        </div>
        <div class="col-sm-8 pull-right">
          <div v-if="Object.keys(coowners).length">
            <p>
              <span
                v-for="u in coowners"
                :key="u.name"
                class=" label label-lg label-info"
                @click="remove($event, u.id)"
              >
                {{u.fullname}}
              </span>
            </p>
          </div>
          <div v-else>
            <p> This project doesn't have co-owners </p>
          </div>
        </div>
      </div>
      <div v-if="editable" class="form-group row">
        <div class="col-sm-4">
          <p> manage co-owners </p>
        </div>
        <div class="col-sm-8 pull-right">
            <div class="input-group">
              <input
                type="text"
                :disabled="!editable"
                v-model="search"
                class="form-control input-sm"
                placeholder="Try with full name or nick name"
              >
              <span class="input-group-append">
                <button
                  class="btn btn-sm btn-primary "
                  @click="getData"
                >
                  <i class="fa fa-search"></i>
                  Search
                </button>
              </span>
            </div>
        </div>
      </div>
      <div class="form-group row">
        <div v-for="u in searchResult" :key="u.id" :value="u" class="col-sm-3">
          <div class="thumbnail card-body text-center" >
            <p class="card-title">{{u.fullname}}</p>
            <p class="card-text">{{u.name}}</p>
              <button
                class="btn btn-sm btn-link"
                @click="add($event, u)"
                >
                Add to Co-owners
              </button>
          </div>
        </div>
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
    owner: {
      type: String,
      default: null
    },
    ownerId: {
      type: Number,
      default: null
    },
    coOwners: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      coowners: {},
      searchResult: [],
      search: "",
      editable: false

    };
  },

  mounted: function () {
    var _this = this
    _this.coowners = _this.getCoowners()

  },

  methods: {
    toggleEditable() {
      this.editable = !this.editable;
    },

    getCoowners() {
      var users = {}
      for (var i=0; i < this.coOwners.length; i++) {
        if (this.coOwners[i].id != this.ownerId){
          users[this.coOwners[i].id] = this.coOwners[i]
        }

      }
      return users
    },

    add( event, ur ){
      if (this.editable) {
        Vue.set(this.coowners, ur.id, ur)
        this.coowners[ur.id] = ur
      }
    },

    remove( event, id ) {
      if (this.editable) {
        Vue.delete(this.coowners, id)
      }
    },
    async getData() {

      try {
        const res = await fetch(window.location.pathname + '/coowners', {
          method: 'POST',
          headers: {
            'content-type':  'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({query: this.search})
        });
        const data = await res.json();
        console.log(data)
        this.searchResult = data['found']
      }
      catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }

    },

    async save () {
      var coownerId = Object.keys(this.coowners)
      coownerId.push(this.ownerId)
      try {
        console.log("try")
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ 'ownership': {
            coowners: coownerId
          }})
        });
        console.log(res)
        if (res.ok) {
          this.toggleEditable();
          this.searchResult = []
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
