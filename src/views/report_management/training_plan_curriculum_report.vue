<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formDetails" ref="formDetails" :rules="rules">
                <div class="fold">
                    <div ref="formDetail" class="detail-show-2">
                        
                         <el-form-item label="学期"  prop="semesterid">
                            <el-select 
                                clearable 
                                v-model="formDetails.semesterid"
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.val" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="专业" prop="majorId">
                            <el-select v-model="formDetails.majorId"
                            clearable 
                             filterable
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                         <el-form-item label="所在级" prop="grade">
                            <intelligent-year-picker style="width: 100%;" 
                            	clearable 
                                v-model="formDetails.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                        
                        <el-form-item label="课程性质" >
                            <el-select v-model="formDetails.natureId"
                                clearable 
                                filterable
                             placeholder="请选择">
                                <el-option v-for="list in naturelist" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

						<el-form-item >
							<el-button type="primary" @click="submitForm('formDetails')" v-if="btnPerObj.query">查询</el-button>
						</el-form-item> 
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData1"
                    border
                    style="width: 100%"
					size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column label="序号" width="80" type="index"></el-table-column>
                <el-table-column prop="courseName" label="课程名称"></el-table-column>
                <el-table-column prop="categoryName" label="课程类别"></el-table-column>
                <el-table-column prop="natureName" label="选必修"></el-table-column>
                <el-table-column prop="total_theory_hours" label="课程学时">
                    <template slot-scope="scope">
                        {{scope.row.totalNovitiateHours*1+scope.row.totalTheoryHours*1}}
                    </template>
                </el-table-column>
                <el-table-column prop="semester_number" label="课程学期">
                    <template slot-scope="scope">
                        {{scope.row.semesterName}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
  

        <div class="block_page">
       <el-pagination
       class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
        background
      :page-size="pageSize"
       :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
    </section>
</template>

<script>
    import util from '@/util'
    export default {
        name: "training_plan_curriculum_report",
        data() {
            return {
                naturelist:[],
                currentPage1:1,
                pageSize:10,
           
                total:200,
                tableData1:[],
                tableData: [],
                formDetails:{
                    semesterid:'',//学期
                    grade:'',
                    majorId:"",
                    natureId:''
                },
                rules:{
                    semesterid: [
                        { required: true, message: '请选择学期', trigger: 'change' },
                    ],
                    grade: [
                        { required: true, message: '请选择所在级', trigger: 'change' },
                    ],
                    majorId: [
                        { required: true, message: '请选择专业', trigger: 'change' },
                    ],
                },
                semesterList:[
                    {
                        id:1,val:'学期1'
                    },
                    {
                        id:2,val:'学期2'
                    },
                    {
                        id:3,val:'学期3'
                    },
                    {
                        id:4,val:'学期4'
                    },
                    {
                        id:5,val:'学期5'
                    },
                    {
                        id:6,val:'学期6'
                    },
                    {
                        id:7,val:'学期7'
                    },
                    {
                        id:8,val:'学期8'
                    },
                    {
                        id:9,val:'学期9'
                    },
                    {
                        id:10,val:'学期10'
                    }


                ],
              
                gradeName:'',//单行的年级
                majorName:'',//单行的专业
               
              
                trainPlanName:"",
                
                majorList:[],//专业列表
                breadcrumb: [//面包屑
                    {label: "报表管理"},
                    {label: "培养方案课程报表"},
                ],
                dialogTable:false,
				 btnPerObj:{//按钮权限
                  query:false
                }
            }
        },
       
        mounted(){
		   
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            this.getMajorList();
            this.getcoursenature()
            this.getgeneralstatement()
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                   this.searchData()
                } else {
                   
                    return false;
                }
                });
            },
             //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_training_programme_table") {
                            self.btnPerObj.query=true;
                        }
                      
                    });
                }).catch(()=>{
                })
            },

            searchData(){
                  this.getgeneralstatement()
            },
            getgeneralstatement(){
                let self= this
                
                let params ={
                    pageNo:self.currentPage1,
                    pageSize:self.pageSize,
                    param:{
                        grade:self.formDetails.grade,
                        majorId:self.formDetails.majorId,
                        natureId:self.formDetails.natureId,
                        semesterNumber:self.formDetails.semesterid
                    }
                }
                 this.$http.post('_ed:/report/trainplan/course',params).then(data=>{
                       console.log('tag', data.data)
                    self.tableData1 = data.data.result
                    self.total = data.data.totalCount
                 }).catch(err=>{
                     console.log(err)
                 })
  
            },
            handleSizeChange(val) {
              this.pageSize = val
              this.getgeneralstatement()
              
            },
            handleCurrentChange(val) {
                this.currentPage1 = val
                this.getgeneralstatement()
              
            },
            handleClick(tab, event) {
                
            },

            getcoursenature(){
                this.$http.get("_op:/dicts/combox/course-nature").then(data=>{
                    this.naturelist = data.data
                 
                }).catch(err=>{
                    console.log(err)
                })
            },
            getMajorList(){//查询专业列表
                this.$http.get("_op:/major/combox").then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
      
        }
    }
</script>

<style scoped lang="less">
.classification{
    .title{
        text-align: center;
    }
}
.pull-right{
  text-align: right;
  margin-right: 10px;
}

</style>