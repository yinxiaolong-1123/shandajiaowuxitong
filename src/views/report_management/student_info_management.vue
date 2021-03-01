<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail-show-2">
                         <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;" 
                            	:clearable="false"
                                v-model="grade"
                                type="year" 
                                @change="getMajorList"
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                         <el-form-item label="专业">
                            <el-select v-model="majorId"
                            clearable
                             filterable
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="学生姓名">
                            <el-input v-model="studentName"  clearable> </el-input>
                        </el-form-item>

                         <el-form-item label="学生反馈">
                            <el-select 
                            clearable
                                v-model="feedbackid"
                                filterable
                                placeholder="请选择">
                                <el-option v-for="item in feedbacklist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
						<el-form-item >
                            <el-button type="primary" @click="lowerhair()" v-if="btnPerObj.down">下发核对</el-button>
							<el-button type="primary" @click="searchData()" v-if="btnPerObj.query">查询</el-button>
							<el-button type="primary" @click="exportExc">导出</el-button>
                            <a v-show="false" ref="exportExcel"></a>
						</el-form-item> 
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-fold">
            <p style="line-height: 30px;font-size: 14px;"><i style="color:red;">*</i>请按年级+专业 下发核对</p>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData1"
                    border
                    :height="tableHeight()"
                    style="width: 100%"
					size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column label="序号" width="50" type="index"></el-table-column>
                <el-table-column prop="enrollmentYear" label="所在级"  width="100"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班"  width="300"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="spellName" label="拼音"></el-table-column>
                <el-table-column prop="majorName" label="专业"  width="300"></el-table-column>
                <el-table-column prop="verifyStatus" label="学生反馈结果">
                    <template slot-scope="scope">
                      
                        <template v-if="scope.row.verifyStatus==0">
                            待学生反馈
                        </template>
                        <template v-if="scope.row.verifyStatus==1">
                            有异议
                        </template>
                        <template v-if="scope.row.verifyStatus==2">
                            无异议
                        </template>
                        <template v-if="scope.row.verifyStatus==3">
                            核实完毕
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                     width="120"
                  >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="checkmodify(scope.row)" v-if="btnPerObj.change">核对修改</el-button>
                    </template>
                </el-table-column>
                
            </el-table>
        </div>
  

        <div class="block_page">
        <el-pagination
         class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
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
import { debuglog } from 'util';
    export default {
        name: "student_info_management",
        data() {
            return {
                actionId:'',
                pageNo:1,
                pageSize:20,
                pageNo: 1,
                semesterid:'',//学期
                total:1,
                tableData1:[],
                feedbackid:'',
                feedbacklist:[
                    {name:'待反馈',id:0},
                    {name:'有异议',id:1},
                    {name:'无异议',id:2},
                    {name:'核实完毕',id:3},
                ],
                 tableData: [],
                semesterList:[],
                natureId:'',
                gradeName:'',//单行的年级
                majorName:'',//单行的专业
                majorId:"", 
                studentName:'',
                grade:'',
                trainPlanName:"",
                
                majorList:[],//专业列表
                breadcrumb: [//面包屑
                    {label: "学生管理"},
                    {label: "学生信息核对管理"},
                ],
                dialogTable:false,
				 btnPerObj:{
                    query:false,
                    down:false,
                    change:false,
                }
            }
        },
       
        mounted(){
            
         
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
            this.queryparam = this.$route.query.param
            
            if(this.queryparam!=undefined){
                // this.majorId = this.queryparam.majorId
                this.studentName = this.queryparam.studentName
                this.feedbackid = this.queryparam.feedbackid
                this.actionId = this.$route.query.actionId
                if (this.queryparam.grade) {
                    this.grade = this.queryparam.grade
                    this.getMajorList1()
                } else {
                    this.searchData()
                }
                this.getBtnPermit()
            }
        
        this.searchData()


        },
        created(){
            this.actionId=this.$route.query.actionId;
            // this.getMajorList();
            
            this.getTermData()
     
        },
        methods: {
            getMajorList1() {
                let grade
                if(this.grade == '' || this.grade == null) {
                    grade = 0
                }else {
                    grade = this.grade
                }
                this.majorId = ''
                this.majorList = []
                this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
                    this.majorList = res.data
                    if (this.queryparam.majorId) {
                        this.majorId = this.queryparam.majorId
                        this.searchData()
                    }
                })
            },
            getMajorList() {
                let grade
                if(this.grade == '' || this.grade == null) {
                    grade = 0
                }else {
                    grade = this.grade
                }
                this.majorId = ''
                this.majorList = []
                this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
                    this.majorList = res.data
                })
            },
            exportExc(){
				let params ={
                    pageNo:1,
                    pageSize:10000,
                    param:{
                        enrollmentYear:self.grade,
                        majorId:self.majorId,
                        studentName:self.studentName,
                        status:self.feedbackid
                    }
                }
				this.$http2.post('_op:/students/export/verifyInfo',params).then(data=>{
						let url = window.URL.createObjectURL(new Blob([data]));
						let y = this.$refs.exportExcel;
						y.href = url;
						y.setAttribute("download", "学生信息核对.xls");
						y.click();
						window.URL.revokeObjectURL(url);
				})
			},
            tableHeight(){
               return document.body.clientHeight - 270
            },
                //获取按钮权限
           getBtnPermit() {
                let self = this;
                self.actionId=this.$route.query.actionId;
                
                this.$http.get('_auth:/privilege/getList/'+self.actionId+'/2').then(data=>{
           
                    data.data.map(item => {
                        if (item.code=="query_student_information_check") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="down_check_student_information_check") {
                            self.btnPerObj.down=true;
                        }
                        if (item.code=="check_and_modify_student_information_check") {
                            self.btnPerObj.change=true;
                        }
                    });
                }).catch(()=>{
                })
            },
            // /students/getIsDeliverVerify/{enrollmentYear}/{majorId}
            lowerhair(){//下发核对
                
                    let self = this
                    if(self.grade==''||self.majorId==''){
                        self.$message({
                        type: 'warning',
                        message: '请按年级+专业下发核对'
                        });
                    }else{
                        self.getcheckstuats()
                    }
                    
            },
            getcheckstuats(){
                let self = this;
                let enrollmentYear =self.grade;
                let majorId = self.majorId;
                let majorName = '' ;
                for(let i=0;i<self.majorList.length;i++){
                    if(self.majorList[i].id==majorId){
                        majorName = self.majorList[i].name
                    }
                }
                
                this.$http.get('_op:/students/getIsDeliverVerify/'+enrollmentYear+'/'+majorId).then(data=>{
                    if(data.data==true){
                        self.$confirm(`您将对${enrollmentYear}级${majorName}，已经进行过下达学生核对任务，将以前任务迁移保存，按新的核对任务进行重新核对 确定吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            self.downcheck()
                          
                        }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '已取消下达'
                            });          
                        });
                    }else{
                         self.$confirm(`您将对${enrollmentYear}级${majorName}，进行下达学生核对任务，确定吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            self.downcheck()
                        }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '已取消下达'
                            });          
                        });

                    }
                }).catch(err=>{
                   console.log(err)
                })
            },
            downcheck(){
                let self = this
                let query = {
                    enrollmentYear: self.grade,
                    majorId: self.majorId,
                }
                self.$http.post('_op:/students/deliverVerifyInfo',query).then(data=>{
                    self.$message({
                        type: 'success',
                        message: '下发成功'
                        });
                }).catch(err=>{
                    console.log(err)
                })
            },
            checkmodify(row){//跳到核对页面
            let param = {
                grade:this.grade,
                majorId:this.majorId,
                studentName: this.studentName,
                feedbackid:this.feedbackid

            }
            let actionId = this.actionId
            
            this.$router.push({
                path:'/report_management/student_info_modify',
                query:{
                    row:row,
                    param:param,
                    actionId:actionId
                },
                

            })
            },
            searchData(){

                 this.pageNo = 1;
                  this.getgeneralstatement()
            },

            getgeneralstatement(){//查询
                let self= this
                let params ={
                    pageNo:self.pageNo,
                    pageSize:self.pageSize,
                    param:{
                        enrollmentYear:self.grade,
                        majorId:self.majorId,
                        studentName:self.studentName,
                        status:self.feedbackid
                    }
                }
                
                 self.$http.post('_op:/students/verifyInfo',params).then(data=>{
                     
                    self.tableData1 = data.data.result
                    self.total = data.data.totalCount
                     self.pageSize = data.data.pageSize;
             
                 }).catch(err=>{
                     console.log(err)
                 })
  
            },
            handleSizeChange(val) {
                 this.pageNo = 1;
                // this.pageSize = size;
              this.pageSize = val
              this.getgeneralstatement()
              
            },
            handleCurrentChange(val) {
                this.pageNo = val
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
                    			this.semesterid=data.data[i].id;
                    		}else{
                                this.semesterid=data.data[0].id;
                            }
                    	}
                        this.semesterList = data.data.reverse();;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
       
            // getMajorList(){//查询专业列表
            //     this.$http.get("_op:/major/combox").then(data=>{
            //         if(data.code==0){
            //             this.majorList = data.data;
            //             // this.majorId = data.data[0].id
            //         }else{
            //             this.$message.error(data.msg);
            //         }
            //     }).catch(err=>{
            //         console.log(err)
            //     })
            // },
      
        }
    }
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
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