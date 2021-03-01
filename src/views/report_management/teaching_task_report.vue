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
                    <div ref="formDetail" class="detail">
                        
                         

                        <el-form-item label="专业"  prop="majorId">
                            <el-select v-model="formDetails.majorId"
                             filterable
                             clearable
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                         <el-form-item label="所在级"  prop="grade">
                            <intelligent-year-picker style="width: 100%;" 
                            	clearable
                                v-model="formDetails.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                        <el-form-item label="学期" prop="semesterid">
                            <el-select 
                                v-model="formDetails.semesterid"
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                       
						<el-form-item >
							<el-button type="primary" @click="submitForm('formDetails')"  v-if="btnPerObj.query">查询</el-button>
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
              
                <el-table-column prop="courseNature" label="选必修"></el-table-column>
                <el-table-column prop="totalHours" label="规划总学时(理论/实战)">
                  
                </el-table-column>
                <el-table-column prop="teachedHours" label="已授学时(理论/实战)">
                  
                </el-table-column>
                <el-table-column prop="semesterHours" label="本学期学时(理论/实战)">
                 
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
        name: "teaching_task_report",
        data() {
            return {
                naturelist:[],
                currentPage1:1,
                pageSize:10,
               
                total:0,
                tableData1:[],
              
                 tableData: [],
                semesterList:[],
                natureId:'',
                gradeName:'',//单行的年级
                majorName:'',//单行的专业
                
               
                trainPlanName:"",
                formDetail:{},
                formDetails:{
                    semesterid:'',//学期
                    grade:'',
                    majorId:"",
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
                majorList:[],//专业列表
                breadcrumb: [//面包屑
                    {label: "报表管理"},
                    {label: "教学任务报表"},
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
            this.getTermData()
     
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                   this.searchData()
                } else {
                    console.log('error submit!!');
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
                        if (item.code=="query_semester_teaching_tasks") {
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
                        grade:self.formDetails.grade*1,
                        majorId:self.formDetails.majorId,
                        termId:self.formDetails.semesterid
                    }
                   
                }
                 self.$http.post('_ed:/termTeachTaskReport/list',params).then(data=>{
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
            getTermData(){//查询学期列表
            	let query="学期"
                this.$http.get('_op:/terms/'+query).then(data=>{
                    
                    if(data.code==0){
                    	for (let i=0;i<data.data.length;i++) {
                    		if (data.data[i].name.indexOf('当前学期')!=-1) {
                                this.formDetails.semesterid=data.data[i].id;
                           }
                    		
                    	}
                        this.semesterList = data.data.reverse();;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
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
                        // this.majorId = data.data[0].id
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