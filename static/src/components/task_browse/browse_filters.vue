<template>
    <div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Filter</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(filter, key) in filters" :key=key>
                    <td class="col-xs-4">{{allFilters[key]}}</td>
                    <td class="col-xs-4">{{filter}}</td>
                    <td class="pull-right">
                        <button class="btn btn-xs btn-danger"
                                @click="deleteFilter({ key })">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <task-info-filters></task-info-filters>
        <user-info-filters></user-info-filters>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import TaskInfoFilters from './task_info_filters'
import UserInfoFilters from './user_info_filters'


export default {
    data () {
        return {
            allFilters: {
                'priority_from': 'Priority From',
                'priority_to': 'Priority To',
                'created_from': 'Created Time From',
                'created_to': 'Created Time To',
                'pcomplete_from': '% Completed From',
                'pcomplete_to': '% Completed To',
                'ftime_from': 'Finish Time From',
                'ftime_to': 'Finish Time To'
            }
        };
    },

    methods: {
        ...mapMutations(['deleteFilter'])
    },

    computed: {
        ...mapGetters(['getFilters']),

        filters () {
            const rv = {};
            for (const k of Object.keys(this.allFilters)) {
                if (this.getFilters[k]) {
                    rv[k] = this.getFilters[k];
                }
            }
            return rv;
        }
    },

    components: { TaskInfoFilters, UserInfoFilters }
}
</script>
<style>
</style>
