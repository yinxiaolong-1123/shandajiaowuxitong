<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.path">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold" style="height:68px">
            <el-form :inline="true" size="mini" :model="formInline">
                <el-form-item label="学期">
                    <el-select v-model="formInline.semester" filterable clearable @change="getCourseList">
                        <el-option v-for="(item,index) in semester" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程">
                    <el-select v-model="formInline.lesson" clearable filterable>
                        <el-option v-for="(item,index) in lessonList" :key="index" :value="item.courseId" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="stage">显示阶段成绩</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="searchTable">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table 
                :data="tableData"
                border 
                style="width: 100%" 
                size="mini"
                v-loading="tableLoading" 
                element-loading-text="加载中..." 
                header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" fixed></el-table-column>
                <el-table-column label="学期" prop="termName"  width="150"></el-table-column>
                <el-table-column label="课程代码" prop="courseCode"  width="80"></el-table-column>
                <el-table-column label="课程名称" prop="courseName"  width="400"></el-table-column>
                <el-table-column label="课程性质" prop="natureName" width="75"></el-table-column>
                <el-table-column label="学时" prop="learnHour" width="60"></el-table-column>
                <el-table-column label="学分" prop="credit" width="50"></el-table-column>
                <el-table-column v-if="stage" label="阶段成绩" prop="stageGrade"  width="80"></el-table-column>
                <el-table-column label="课程成绩" prop="courseGrade" width="75"></el-table-column>
                <el-table-column label="重修1" prop="firstbk" width="60"></el-table-column>
                <el-table-column label="重修2" prop="secondbk" width="60"></el-table-column>
                <el-table-column label="重修3" prop="thirdbk" width="60"></el-table-column>
                <el-table-column label="成绩明细" prop="remark"></el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
            </el-pagination>
        </div>
    </section>
</template>
<script>
import util from "@/util";

export default {
    name:'stu_course_result_enquiry',
    data(){
        return {
            breadcrumb:[
                {label:'个人中心'},
                {label:'成绩查询'}
            ],
            formInline:{
                semester:'',
                lesson:''
            },
            semester:[],
            lessonList:[],
            stage:false,
            semesterNum:'',
            semesterID:'',
            fallYear:'',
            tableData:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            tableLoading:false
        }
    },
    created(){
        this.searchTable()
        this.getSemester()
        this.getLesson()
    },
    watch:{
        stage(newVal,oldVal){
            this.searchTable()
        }
    },
    methods:{
        getSemester(query){
            if (!query) {
                query = "学期";
            }
            this.$http.get('_op:/terms/' + query).then(data => {
                if (data.code == 0) {
                    this.semester = data.data.reverse();
                    for(let i=0;i<this.semester.length;i++){
                        if(this.semester[i].name.indexOf('当前学期')!=-1){
                            this.formInline.semester=this.semester[i].id
                            this.semesterNum = this.semester[i].orderNum;
                            this.semesterID = this.semester[i].id;
                            this.fallYear =this.semester[i].year;
                        }
                    }
                } else {
                    this.$message.error(data.msg);
                }
            })
        },
        getCourseList(item) {
            this.formInline.semester = item
            this.getLesson()
        },
        getLesson(){
            let grade = 0; let major = 0; let term = this.formInline.semester
            if(this.formInline.semester == "") {
                term = 0
            }
            this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(res => {
                if (res.code == 0) {
                    this.lessonList = res.data
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        searchTable(){
            this.tableLoading = true
            let isStage = this.stage ? 1 : 0
            let studentNo = JSON.parse(util.getStorage('vuex')).me.user.username
            this.$http.post("_sc:/scoreQueryManage/queryStdCourseScore",{
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                termId:this.formInline.semester,
                courseId:this.formInline.lesson,
                studentNo:studentNo,
                isStage:isStage
            }).then(res => {
                this.tableLoading = false
                if (res.code == 0) {
                    this.tableData = res.data.dataList
                    this.totalCount = res.data.total_records
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        sizeChange(size){
            this.pageNo = 1;
            this.pageSize = size;
            this.searchTable();
        },
        // 分页跳转
        currentChange(current){
            this.pageNo = current;
            this.searchTable();
        },
    }
}
</script>
<style lang="less" scoped>

</style>