'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import TaskBrowse from './components/task_browse/task_browse'
import FiltersModal from './components/task_browse/filters_modal'

Vue.use(Vuex);

function del (obj, payload) {
    const {key, index} = payload;
    if (index === undefined) {
        obj[key] = undefined;
    } else {
        obj[key].splice(index, 1);
    }
}

const store = new Vuex.Store({
    state: {
        filters: {},
        origFilters: {}
    },

    getters: {
        getFilters(state) {
            return state.filters;
        }
    },

    mutations: {
        setFilters(state, filters) {
            state.origFilters = JSON.parse(JSON.stringify(filters));
            state.filters = JSON.parse(JSON.stringify(filters));
        },

        deleteFilter(state, payload) {
            del(state.filters, payload);
        },

        deleteUserFilter(state, payload) {
            del(state.filters.filter_by_upref, payload);
        },

        discardFilterChanges(state) {
            state.filters = JSON.parse(JSON.stringify(state.origFilters));
        }
    }
});

new Vue({
    el: '#task-browse',
    store,
    components: {
        TaskBrowse,
        FiltersModal
    }
});

window.taskBrowse = {
    setFilters: store.commit.bind(null, 'setFilters')
}
