<template>
    <el-dialog 
        title="审核记录" 
        :visible.sync="dialogAudit"
        :before-close="handleClose"
        width="60%"
        append-to-body>
        <el-table
            ref="multipleTable"
            :data="auditlogList"
            border
            style="width: 100%"
            header-row-class-name="cm-dark">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="auditRole" label="角色" width="100"></el-table-column>
            <el-table-column prop="auditName" label="审核人" width="100"></el-table-column>
            <el-table-column label="审核时间" width="150">
                <template slot-scope="scope">{{scope.row.auditDate | dateFns}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="审核意见"></el-table-column>
            <el-table-column prop="auditResult" label="审核结果" width="100">
                <template slot-scope="scope">{{scope.row.auditResult==1?"不同意":"同意"}}</template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
import util from '@/util';
import moment from 'moment';
import {mapState} from 'vuex';

export default {
    name: 'records',
    props: {
        dialogAudit:{
            type:Boolean,
            default: false
        },
        semestercourseid: {
            type: Number,
            default: 0
        },
    },
    data () {
        return {
            opinionForm:{
                opinion:"",
                type:"",
            },
            auditlogList:[]
        }
    },
    filters: {
        dateFns(val){
            if (val!=null&&val!='') {
                return moment(val).format('YYYY-MM-DD  HH:mm')
            }
        },
    },
    mounted() {
        this.checkRecord();
    },
    methods: {
        checkRecord(){
            this.$http.get("_ed:/exchangecourse/query/auditlog/"+this.semestercourseid).then(data=>{
                this.auditlogList=data.data;
            }).catch(()=>{

            })
        },
        handleClose(){
            this.$emit('update:dialogAudit',false);
        },
    },
}
</script>