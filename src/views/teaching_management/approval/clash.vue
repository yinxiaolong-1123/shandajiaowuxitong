<template>
    <section>
        <el-dialog
            title="冲突明细"
            :visible.sync="conflictDetails"
            :before-close="closeClash"
            :close-on-click-modal="false"
            width="60%"
            append-to-body>
            <el-table
                :data="conflictData"
                border
                style="width: 100%"
                height="500"
                size="mini"
                header-row-class-name="cm-dark">
                <el-table-column prop="type" label="冲突类别" width="100"></el-table-column>
                <el-table-column prop="conflict" label="冲突描述"></el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="closeClash">关 闭</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
import {mapState} from 'vuex';

export default {
    name: 'clash',
    props: {
        conflictDetails: {
            type: Boolean,
            default: false
        },
        conflictData: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            
        }
    },
    mounted () {

    },
    methods: {
        closeClash(){
            this.$emit('update:conflictDetails',false);
        },
    },
}
</script>