<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <div class="cm-fold" style="padding-bottom:20px">
             <el-form :inline="true" size="mini">
                 <div class="fold">
                     <el-form-item label="学生" >
                        <el-select clearable filterable v-model="searchForm.studentId" @change="FliterStudent">
                            <el-option
                            
                            v-for="item in studentsList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.stu_num"
                            ></el-option>
                        </el-select>
                        </el-form-item>
                 </div>
             </el-form>
         </div>
        <div class="cm-table">
            <el-table ref="multipleTable" :data="tableData" border max-height="600"  style="width: 100%" size="mini" v-loading="tableLoading" element-loading-text="加载中..." header-row-class-name="cm-dark" >
                <el-table-column  label="姓名" prop="name"></el-table-column>
                <el-table-column  label="行政班" prop="admin_cls_name"></el-table-column>
                <el-table-column  label="日期" prop="schedule_item_date"></el-table-column>
                <el-table-column  label="周次" prop="week"></el-table-column>
                <el-table-column  label="星期" prop="weekday"></el-table-column>
                <el-table-column  label="课节" prop="section_nodenames"></el-table-column>
                <el-table-column  label="课程" prop="course_name"></el-table-column>
                <el-table-column  label="授课形式" prop="teaching_formname"></el-table-column>
                <el-table-column  label="上课班" prop="cls_name"></el-table-column>
                <el-table-column  label="分组" prop="group_names"></el-table-column>
                <el-table-column  label="教室" prop="area_name"></el-table-column>
                <el-table-column  label="学号" prop="stu_num"></el-table-column>
            </el-table>
        </div>
     </section>
</template>
<script>
import util from '@/util'
    const TYPE = 'studentsConflictReport';
    const REMARK = '学生冲突报告';
  import {mapState} from 'vuex'

export default {
    data(){
        return {
            breadcrumb: [
                { label: "教学管理" }, 
                { label: "学生冲突报告"},
            ],
            searchForm:{
                studentId:''
            },
           
            studentsList:[],
            tableData:[],
            tableData1:[],
             tableLoading: false,
        }
    },
    created(){
        this.getstudentConflict()
    },
    methods:{
        getstudentConflict(){
            this.$http.get('_op:/students/studentConflict').then(res=>{
                this.tableData = res.data
                this.tableData1 = res.data
                // this.studentsList = res.data
                this.studentsList = this.unique(res.data)
            })
        },
        FliterStudent(res){
            if (res) {
                var r = this.tableData1.filter(function (x) {
                    return x.stu_num == res
                }); 
                this.tableData=r;
                } else {
                    this.tableData = [].concat(this.tableData1);
                }
        },
        unique(arr){
            let hash = {};
                arr = arr.reduce(function(item, next) {
                hash[next.name] ? '' : hash[next.name] = true && item.push(next);
                return item
            }, [])
            
            return arr
        }
       
    }
}
</script>