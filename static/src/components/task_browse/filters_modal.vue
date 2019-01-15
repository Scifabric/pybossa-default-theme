<template>
    <browse-modal>
        <template slot="title">Applied Filters</template>
        <template slot="body">
            <browse-filters></browse-filters>
        </template>
        <template slot="footer">
            <div class="btn btn-primary" @click="update">Update</div>
            <div class="btn btn-default" data-dismiss="modal" @click="close">Close</div>
        </template>
    </browse-modal>
</template>

<script>
import BrowseModal from './browse_modal'
import BrowseFilters from './browse_filters'
import { mapGetters, mapMutations } from 'vuex'

export default {
    data () {
        return {};
    },

    methods: {
        ...mapMutations(['discardFilterChanges']),

        update () {
            window.dispatchEvent(new CustomEvent('filtersUpdated', {detail: this.getFilters}));
        },

        close () {
            this.discardFilterChanges();
        }
    },

    computed: {
        ...mapGetters(['getFilters'])
    },

    components: {
        BrowseModal,
        BrowseFilters
    }
}
</script>
<style>
</style>
