<template>
    <div>
        <table class="table table-striped" v-if="languages.length">
            <thead>
                <tr>
                    <th>Language Filters</th>
                    <th><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteUserFilter({ key: 'languages' })">Delete All</div></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(language, index) in languages" :key="index">
                    <td>{{language}}</td>
                    <td><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteUserFilter({ key: 'languages', index })">Remove</div></td>
                </tr>
            </tbody>
        </table>

        <table class="table table-striped" v-if="countries.length">
            <thead>
                <tr>
                    <th>Location Filters</th>
                    <th><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteUserFilter({ key: 'locations' })">Delete All</div></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(country, index) in countries" :key="index">
                    <td>{{country}}</td>
                    <td><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteUserFilter({ key: 'locations', index })">Remove</div></td>
                </tr>
            </tbody>
        </table>
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

        countries () {
            return ((this.getFilters.filter_by_upref || {}).locations || [])
        },

        languages () {
            return ((this.getFilters.filter_by_upref || {}).languages || [])
        }
    }
}
</script>
<style>
</style>
