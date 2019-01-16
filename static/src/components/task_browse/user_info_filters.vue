<template>
    <div>
        <div v-if="languages">
            <h4>Language Filters
                <div class="btn btn-xs btn-danger pull-right"
                    @click="deleteUserFilter({ key: 'languages' })">Delete All</div>
            </h4>
            <p class="pill-list">
                <span v-for="(language, index) in languages"
                    :key="index"
                    class="btn btn-info btn-xs"
                    @click="deleteUserFilter({ key: 'languages', index })">{{language}}
                <span aria-hidden="true">&times;</span></span>
            </p>
        </div>

        <div v-if="locations">
            <h4>Location Filters
                <div class="btn btn-xs btn-danger pull-right"
                    @click="deleteUserFilter({ key: 'locations' })">Delete All</div>
            </h4>
            <p class="pill-list">
                <span v-for="(location, index) in locations"
                    :key="index"
                    class="btn btn-info btn-xs"
                    @click="deleteUserFilter({ key: 'locations', index })">{{location}}
                <span aria-hidden="true">&times;</span></span>
            </p>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    methods: {
        ...mapMutations(['deleteUserFilter'])
    },

    computed: {
        ...mapGetters(['getFilters']),

        locations () {
            return ((this.getFilters.filter_by_upref || {}).locations || [])
        },

        languages () {
            return ((this.getFilters.filter_by_upref || {}).languages || [])
        }
    }
}
</script>
<style>
.pill-list {
    display: flex;
    flex-wrap: wrap;
}

.pill-list span {
    margin-right: .2em;
    margin-bottom: .2em;
}
</style>
