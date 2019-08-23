<template>
  <div class="stats-config row">
    <div class="col-md-12">
      <div class="form-group row">
        <div class="col-md-4">
          <p> Project Owner </p>
        </div>
        <div class="col-md-8 pull-right">
          <p> {{ owner.fullname }} </p>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Co-owners </p>
        </div>
        <div class="col-md-8 pull-right">
          <div v-if="Object.keys(coowners).length">
            <p>
              <span
                v-for="u in coowners"
                :key="u.name"
                class=" label label-lg label-info"
              >
                {{ u.fullname }}
                <i
                  v-if="u.id!==owner.id"
                  class="fa fa-times"
                  aria-hidden="true"
                  @click="remove($event, u.id)"
                />
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-4">
          <p> Manage Co-owners </p>
        </div>
        <div class="col-md-8 pull-right">
          <div class="input-group">
            <input
              v-model="search"
              type="text"
              class="form-control input-sm"
              placeholder="Try with full name or nick name"
            >
            <span class="input-group-append">
              <button
                class="btn btn-sm btn-primary "
                @click="searchUsers"
              >
                <i class="fa fa-search" />
                Search
              </button>
            </span>
          </div>
          <div
            v-if="searchResult.length"
            class="dropdown-content"
          >
            <div
              class="scroll"
              style="max-height: 150px;"
            >
              <div
                v-for="u in searchResult"
                :key="u.id"
                :value="u"
                class="row"
                @click="add($event, u)"
              >
                <p> {{ u['fullname'] }} </p>
              </div>
            </div>
          </div>
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
  data () {
    return {
      owner: {},
      coowners: {},
      searchResult: [],
      search: ''

    };
  },

  created () {
    this.getData();
  },

  methods: {

    initialize (data) {
      this.coowners = this.getCoowners(data.coowners_dict);
      this.owner = data.owner;
      this.csrfToken = data.form.csrf;
    },

    getCoowners (coownerData) {
      let users = {};
      coownerData.forEach(function (u) {
        users[u.id] = u;
      });
      return users;
    },

    getURL () {
      let path = window.location.pathname;
      let res = path.split('/');
      res[res.length - 1] = 'coowners';
      return res.join('/');
    },

    add (event, ur) {
      Vue.set(this.coowners, ur.id, ur);
      this.coowners[ur.id] = ur;
    },

    remove (event, id) {
      Vue.delete(this.coowners, id);
    },

    async searchUsers () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({ user: this.search })
        });
        const data = await res.json();
        this.searchResult = data['found'];
        if (data['flash']) {
          window.pybossaNotify(data['flash'], true, data['status']);
        }
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

    async getData () {
      try {
        const res = await fetch(this.getURL(), {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'same-origin'
        });
        const data = await res.json();
        this.initialize(data);
      } catch (error) {
        window.pybossaNotify('An error occurred.', true, 'error');
      }
    },

    async save () {
      let coownerId = Object.keys(this.coowners);
      try {
        const res = await fetch(this.getURL(), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-CSRFToken': this.csrfToken
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            coowners: coownerId
          })
        });
        if (res.ok) {
          this.searchResult = [];
          const data = await res.json();
          window.pybossaNotify(data['flash'], true, data['status']);
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
<style scoped>
.label {
  font-size: 100%;
  margin-right: 10px
}
.fa-times {
  margin-left:3px;
  color:silver
}
.fa-times:hover {
  color: red
}
.form-control.input-sm {
    width: 280px;
}
</style>
