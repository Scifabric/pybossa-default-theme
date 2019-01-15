<template>
    <div v-if="filters.length">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Task Info Filters</th>
                    <th><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteFilter({ key: 'filter_by_field' })">Delete All</div></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(el, index) in filters" :key="index">
                    <td>{{el}}</td>
                    <td><div class="btn btn-xs btn-danger pull-right"
                             @click="deleteFilter({ key: 'filter_by_field', index })">Remove</div></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    methods: {
        ...mapMutations(['deleteFilter'])
    },

    computed: {
        ...mapGetters(['getFilters']),

        filters () {
            return (this.getFilters.filter_by_field || [])
                .map((filter) => filter.join(' '));
        }
    }
}
</script>
<style>
</style>
