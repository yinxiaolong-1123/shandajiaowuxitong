<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="searchForm">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <!-- <el-button type="text" @click="collapseShow">{{fold.text}}</el-button> -->
                        </el-form-item>
                        <el-form-item label="学期" prop="year">
                            <el-select 
                                v-model="searchForm.termId"
                                clearable
                                filterable
                                remote
                                :remote-method="getTermData"
                                placeholder="请输入学期">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>  <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="searchForm.grade"
                                type="year"
                                 clearable
                                @change="changeGrage"
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                            <el-form-item label="专业">
                            <el-select  @change="changeMajor" clearable v-model="searchForm.major" >
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="课程">
                            <el-select  clearable v-model="searchForm.course" filterable placeholder="请选择课程">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="行政班">
                            <el-select  multiple  clearable v-model="searchForm.administrativeClassId" filterable  placeholder="全部">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in administrativeList"  :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="学号">
                            <el-input  clearable v-model="searchForm.studentNo" maxlength="40" placeholder="请输入学号"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input  clearable v-model="searchForm.studentName" maxlength="40" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </div>
                    <div class="btn" >
                        <el-button type="primary" size="mini" @click="onSearch" >查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                :height="tableHeight"
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
                <el-table-column prop="studentNo" label="学号" width="110"></el-table-column>
                <el-table-column prop="studentName" label="姓名" width="110"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班" width="260"></el-table-column>
                <el-table-column prop="termName" label="学期"  width="170px;"></el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="280"></el-table-column>
                <el-table-column prop="stageName" label="阶段" ></el-table-column>
                <el-table-column prop="regularGrade" label="平时成绩"></el-table-column>
                <el-table-column prop="finalExamGrade" label="期末成绩"></el-table-column>
                <el-table-column prop="stageGrade" label="阶段成绩"></el-table-column>
                <el-table-column prop="courseGrade" label="课程成绩"></el-table-column>
                <el-table-column prop="makeUpExamNum" label="补考次数"></el-table-column>
            </el-table>
           
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
       
       
       

    </section>
</template>

<script>
    import util from '@/util';
    const regNum = /^[\d\/]+$/;//匹配数字跟斜杠

    import {mapState} from 'vuex';

    export default {
        data(){
            var validateTime = (rule, value, callback) => {
                if(!value){
                    callback(new Error("输入不能为空"));
                    return;
                }
                if(!regNum.test(value)){
                    callback(new Error("请输入9位以内整数"));
                    return;
                }
            };
            return {
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "补考记录成绩查询"},
                ],
                formInline:{
                    major:""
                },
                dialog:{
                    status:'edit',
                    editvisible:false,
                    visible:false,
                    detailvisible:false,
                    gradeVisible:false,
                    classVisible:false
                },
                searchForm: {
                    termId:"",//学期
                    course:"",//课程ID
                    studentNo:"",//学号
                    grade:"",//所在级
                    major:"",//专业
                    administrativeClassId:[],//行政班
                    studentName:""//姓名
                },
                tableHeight: window.innerHeight - 210,
                classData:[],
                tableData:[],
              
                onTouchData:[],
                gridData:[],
               
                formYear:"",
                onKeyYear:"",
                options1:[],
                majorList:[],
                taskList:[],
                courseList:[],
                arrangCourseList:[],
                onSelectionChangeVal:[],
                myDate:new Date(),
                // tableLoading:false,
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                fold:{
                    state:true,
                    text:'展开',
                    showBtn:false,
                },
                userId:util.getStorage('loginId'),
                userName:util.getStorage('loginName'),
                 administrativeList:[],//行政班
                  btnPerObj:{
                     query:false
                 }
            }
        },
        created(){
            this.getTermData();
            this.getMajorList();
            this.getArrangeCourse();
            this.getCourseList();//课程下拉列表
            // this.getAdministrative();
            // this.getFailedGradeData();//列表获取

        },
        computed:{
           
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
         
            // util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        filters:{
          
        },
        methods:{
            //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_bukaojiluchengjichaxun") {
                            self.btnPerObj.query=true;
                        }
                    });
                }).catch(()=>{
                })
            },
            //    getAdministrative(){//行政班
            //    let params = {
            //        pageNo:1,
            //        pageSize:100,
            //        param:{
            //           administrativeClassIds:this.searchForm.administrativeClassId,
            //           grade:this.searchForm.grade,
            //           majorId:this.searchForm.major,
            //        }
            //    }
            // 	this.$http.post('_op:/administrative/class/list/nopaging',params).then(data=>{
            // 		this.administrativeList=data.result
            //     }).catch(()=>{
            //     })
            //  },
           

                
                 //   获取列表
            getFailedGradeData(){
                this.tableLoading=true;
                this.$http.post("_sc:/stuScore/queryMakeUpExam",{
                        pageNo: this.pageNo,
                        pageSize: this.pageSize,
                        param:{
                            administrativeClassIds:this.searchForm.administrativeClassId,//行政班
                            termId:this.searchForm.termId,//学期
                            studentNo:this.searchForm.studentNo,//学号
                            grade:this.searchForm.grade,//所在级
                            major:this.searchForm.major,//专业
                            course:this.searchForm.course,//课程ID
                            studentName: this.searchForm.studentName
                        }
                        }).then(data=>{
                            this.tableLoading=false;
                            this.tableData=data.result;
                            this.totalCount=data.totalCount;
                            
                        }).catch(()=>{
                            this.tableLoading=true;
                  })
            },
             // 改变所在级请求课程
            changeGrage(){
                this.getCourseList(this.searchForm.grade,this.searchForm.major)
            },
            // 改变专业请求课程
            changeMajor(){
               this.getCourseList(this.searchForm.grade,this.searchForm.major)
            },
            // 课程下拉列表，根据所在级 专业查询
            getCourseList(){
                // /course/combox/{grade}/{majorId}
                this.courseList = []
                this.administrativeList = []
                this.searchForm.course = ''
                this.searchForm.administrativeClassId = []
                let  grade= this.searchForm.grade;
                let  majorId=this.searchForm.major;
                if(grade=="" || grade == null){
                    grade=0;
                }else{
                    grade= this.searchForm.grade;
                }
                if(majorId==""){
                    majorId=0;
                }else{
                    majorId=this.searchForm.major;
                }
                this.$http.get("_op:/course/combox"+"/"+grade+"/"+majorId).then(data =>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
                let params = {
                    param:{
                    administrativeClassIds:this.searchForm.administrativeClassId,
                    grade:this.searchForm.grade || '',
                    majorId:this.searchForm.major || '',
                    }
                }
            this.$http.post('_op:/administrative/class/list/nopaging',params).then(data=>{
                this.administrativeList=data.data
            }).catch(()=>{
            })
            },
            // 显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getFailedGradeData();//刷新列表
            },
            currentChange(current){
                this.pageNo=current;
                this.getFailedGradeData();//刷新列表
            },
            collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            },
       
            onSearch(){
                this.pageNo=1;
                 this.getFailedGradeData();//刷新列表
            },
         
          
            confirmAdd(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addRequire();
                    } else {
                        return false;
                    }
                });
            },
          
            seeTableDetail(row){
                this.semester = row.semester_name;
                this.dialog.status='detail';
                this.dialog.editvisible = true;
                this.getTableDetail(row.id);
            },
            getTableDetail(_id){
                this.$http.get("_ed:/semestercourse/detail/"+_id)
                .then(data=>{
                    if(data.code==0){
                       this.editTableData =  data.data;
                       for(let item of this.editTableData){
                            let surplus_theory_hours = item.semester_theory_hours - item.arranged_theory_hours;
                            let surplus_novitiate_hours = item.semester_novitiate_hours - item.arranged_novitiate_hours;
                            this.$set(item,'semester_name',this.semester);
                            this.$set(item,'surplus_hours',`${surplus_theory_hours}/${surplus_novitiate_hours}`);
                            this.$set(item,'semester_hours',`${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
                       }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            closeDetail(){
                this.dialog.detailvisible = false;
            },
            teachingRemark(){
                this.dialog.remark = true;
            },
          
              getMajorList(){
                this.$http.get("_op:/major/combox")
                .then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getMajorList(){
                this.$http.get("_op:/major/combox")
                .then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getArrangeCourse(){
                this.$http.post("_ed:/semestercourse/list/detail",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.arrangCourseList = data.data;
                        for(let list of this.arrangCourseList){
                            if(list.teachTaskCourseList){
                               for(let item of list.teachTaskCourseList){
                                    let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
                                    this.$set(item,"name",`${item.course_name}（${item.major}，${house}）`);
                                    this.$set(item,"courseId",list.id); 
                                } 
                            }   
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getTaskData(){
               this.$http.post("_ed:/teachtask/courselist",{
                    semester_year:this.addfallYear,
                    semester_year_number:this.addsemesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.taskList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
          
            getTermData(query){
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                          for(let i=0;i<this.options1.length;i++){
                            //   searchForm.termId
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.searchForm.termId=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                
                            }
                            this.onSearch();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            }

        }
    }
</script>
<style scoped>
    .cm-fold .el-form-item{
        margin: 10px 20px 0 0;
    }
    .cm-fold .fold .btn {
        align-items: flex-start;
        margin-top: 10px;
    }
    .cm-addGrade p{
        margin-bottom: 12px;
    }
</style>