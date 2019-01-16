<template>
    <browse-modal>
        <template slot="title">Applied Filters</template>
        <template slot="body">
            <browse-filters></browse-filters>
        </template>
        <template slot="footer">
            <div class="btn btn-primary" @click="clear">Clear Filters</div>
            <div class="btn btn-default" data-dismiss="modal">Close</div>
        </template>
    </browse-modal>
</template>

<script>
import BrowseModal from './browse_modal'
import BrowseFilters from './browse_filters'
import { mapGetters } from 'vuex'

export default {
    data () {
        return {};
    },

    methods: {
        clear () {
            window.dispatchEvent(new CustomEvent('clearFilters'));
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
