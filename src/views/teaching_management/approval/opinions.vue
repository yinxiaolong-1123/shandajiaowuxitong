<template>
    <section>
        <el-dialog 
            title="审核意见" 
            :visible.sync="opinionDiolog"  
            :before-close="handleClose"
            width="60%" 
            append-to-body>
            <span>
                <el-form ref="form">
                    <el-input type="textarea" :rows="8" :cols="200" class="textStyle" v-model="opinion" >
                    </el-input>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDialog" :disabled="setDisbled">确 定</el-button>
            </span>
        </el-dialog>

        <clash-box
        :conflictDetails.sync="conflictDetails"
        :conflictData="conflictData"
        ></clash-box>
    </section>
</template>
<script>
import util from '@/util';
import moment from 'moment';
import {mapState} from 'vuex';
import clashBox from './clash';

export default {
    name: 'opinions',
    inject: ['getTableData','closeDetail'],
    props: {
        opinionDiolog: {
            type: Boolean,
            default: false,
        },
        excourseObj: {
            type: Object,
            default: {}
        },
        type: {
            type: Number,
            default: 0
        }
    },
    components: {
        clashBox
    },
    data () {
        return {
            setDisbled: false,
            conflictDetails: false,
            conflictData: [],
            opinion: "",
        }
    },
    methods: {
        handleClose(){
            this.$emit('update:opinionDiolog',false);
        },
        showConfilct(data){
            this.conflictData = data;
            this.conflictDetails = true;
        },
        submitDialog(){
            this.setDisbled = true;
            let data = {
                adjustCourseTaskId: this.excourseObj.adjustCourseTaskId,
                adjustedAreaIds: this.excourseObj.ndareaId,
                adjustedAreaName: this.excourseObj.ndareaName,
                adjustedScheduleItemDate: this.excourseObj.ndscheduleitemDate,
                adjustedSectionNodeIds: this.excourseObj.ndsectionNodeids,
                adjustedSectionNodeNames: this.excourseObj.ndsectionNodenames,
                auditResult: this.type,
                remark: this.opinion,
                teacherIds: this.excourseObj.ndTeacherId,
            }
            if (!Array.isArray(data.adjustedSectionNodeNames)) {
                data.adjustedSectionNodeNames = data.adjustedSectionNodeNames.split(',')
            }
        
            this.$http.post('_ed:/exchangecourse/handle', data).then(res => {
                if (res.code == 0) {
                    (this.type == 1) && (this.$message.success("审批失败"));
                    (this.type == 0) && (this.$message.success("审批成功"));
                    //通知父组件关闭弹窗
                    this.$emit('update:opinionDiolog',false);
                    this.closeDetail();
                    //通知最外层组件刷新列表
                    this.getTableData();
                    
                    this.handleClose();
                } else {
                    if(res.data && res.data.length > 0){ 
                        this.$message.error("存在冲突，审批失败！");
                        //调课不成功有冲突
                        setTimeout(()=>{
                            this.conflictData = res.data;
                            this.conflictDetails = true;
                        },800)
                    }else{
                        this.$message.error('审批失败');
                    }	
                }
                this.setDisbled = false;
            }).catch(err => {
                this.setDisbled = false;
                this.$message.error("后台错误");
            })
        },
    },
}
</script>