<template>
    <el-dialog
        :before-close="handleClose"
        class="course-detail"
        title="课程详情"
        :visible.sync="dialogDet"
        :append-to-body="true"
        width="40%">
        <div class="adjust-box">
            <div class="det-box">
                <p class="title">课程</p>
                <!-- <p class="adjust-line">排课课程： {{adjustObj.courseArrange}}</p> -->
                <p class="adjust-line">排课课程： {{adjustObj.course_name}}</p>
            </div>
            
            <div class="det-box">
                <p class="title">课程内容</p>
                <!-- <p class="adjust-line">授课形式： {{adjustObj.teachingForm}}</p>
                <p class="adjust-line">授课内容： {{adjustObj.teachingContent}}</p> -->
                <p class="adjust-line">授课形式： {{adjustObj.teaching_formname}}</p>
                <p class="adjust-line">授课内容： {{adjustObj.teaching_content}}</p>
            </div>
            
            <div class="det-box">
                <p class="title">授课资源</p>
                <!-- <p class="adjust-line">授课老师： {{adjustObj.teacherNames}}</p>
                <p class="adjust-line">授课场地： {{adjustObj.areaName}}</p>
                <p class="adjust-line">课程时间： {{adjustObj.scheduleItemDate}}</p>
                <p class="adjust-line">课 &nbsp; &nbsp; 节： {{adjustObj.sectionNodenames}}</p> -->
                <p class="adjust-line">授课老师： {{adjustObj.teacher_names}}</p>
                <p class="adjust-line">授课场地： {{adjustObj.area_name}}</p>
                <p class="adjust-line">课程时间： {{adjustObj.schedule_item_date}}</p>
                <p class="adjust-line">课&emsp;&emsp;节： {{adjustObj.section_nodenames}}</p>
            </div>
            
            <div class="det-box">
                <p class="title">上课班信息</p>
                <!-- <p class="adjust-line">上课班： {{adjustObj.className}}</p>
                <p class="adjust-line">分组号： {{adjustObj.groupNames}}</p> -->
                <p class="adjust-line">上&ensp;课&ensp;班： {{adjustObj.cls_name}}</p>
                <p class="adjust-line">分&ensp;组&ensp;号： {{adjustObj.group_names}}</p>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import util from "@/util";

export default {
    props: {
        dialogDet: {
            type: Boolean,
            default: false
        },
        adjustObj: {
            type: Object,
            default: {}
        },
    },
    data () {
        return {}
    },
    mounted () {

    },
    methods: {
        handleClose(){
            this.$emit('update:dialogDet',false);
        },
    }
}
</script>
<style>
    .course-detail .el-dialog__body{
		padding-top: 0!important;
	}
</style>
<style lang="less" scoped>
    .adjust-box {
		width: 90%;
		margin: auto;
		.det-box {
			// margin-bottom: 30px;
			.title {
				font-weight: bold;
				margin-top: 30px;
			}
		}
    }
    .adjust-line {
		display: flex;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;
		label {
			width: 10%;
			margin-right: 20px;
			text-align: right;
		}
		.el-input,
		.el-select {
			width: 60%;
		}
	}
</style>
