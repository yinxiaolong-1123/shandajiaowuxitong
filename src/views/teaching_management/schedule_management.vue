<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formSearch">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-if="btnPerObj.query">
                            <el-button type="primary" @click="onSearch">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                @change="onYearChange"
                                placeholder="全部"
                                :remote-method="getTermData">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                   
                        <el-form-item label="排课课程">
                            <el-select filterable class="pkkcBox"
                                v-model="formSearch.course" placeholder="请选择"
                                clearable
                                @change="onCourseChange">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in scheduleList" :key="list.id" :label="list.displayName" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <intelligent-year-picker  style="width:90px"
                                v-model="formSearch.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"
                                @change="onGradeChange">
                            </intelligent-year-picker>
                        </el-form-item>

                        <el-form-item label="上课班">
                            <el-select v-model="formSearch.class" filterable class="skbBox"
                                @change="onClassChange"
                                clearable
                                :placeholder=" classList.length==''?'该学期无上课班':'请选择' " 
                                :disabled="classList.length==0">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="formSearch.status"  class="ztBox" placeholder="请选择"
                                @change="onStatusChange">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option label="未提交" :value="0"></el-option>
                                <el-option label="已提交" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="formSearch.course_name" clearable placeholder="输入课程名称模糊查询" style="width:165px"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="课程">
                            <el-select v-model="formSearch.courseId" filterable placeholder="请选择">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>-->
                    </div>
                    <!-- <div class="btn" v-if="btnPerObj.onestep">
                        <el-button size="mini" type="primary" @click="addTask">一键生成</el-button>
                    </div> -->
                </div>
            </el-form>
        </div> 
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                     
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed></el-table-column>
                <el-table-column  class="boxtable" v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='排课课程'">
                            <span style="color: #409EFF;">{{ scope.row.course_name}}</span>
                        </template>
                        <template v-else-if="item.label=='上课班'">
                            <span style="color: #409EFF;">{{ scope.row.cls_name}}</span>
                        </template>
                        <template v-else-if="item.prop=='submitted_hours'" >     
                                <span :class="{fontcolor:scope.row.submitted_hours!= scope.row.total_hours}">{{ scope.row.submitted_hours}}</span>
                        </template>
                        <template v-else-if="item.prop=='status'">
                            {{scope.row.status == 0 ? "未提交" : "已提交"}}
                        </template>
                        <template v-else-if="item.prop=='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else-if="item.prop=='last_submit_time'">
                            {{ scope.row.last_submit_time | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                        v-if="btnPerObj.progress||btnPerObj.return||btnPerObj.delete"
                        fixed="right"
                        label="操作"
                        
                        width="110"
                       >
                    <template slot-scope="scope">
                        <el-button @click="schedulView(scope.row)" type="text" size="mini" v-if="btnPerObj.progress">查看进度</el-button>
                        <!-- <el-button @click="onBackOff(scope.row,'tj')"  v-if="scope.row.status==0" type="text" size="mini" >提交</el-button> -->
                        <el-button @click="onBackOff(scope.row,'th')"  v-if="scope.row.status != 0 &&scope.row.status != 2 &&  btnPerObj.return" type="text" size="mini" >退回</el-button>
                        <el-button @click="delItem(scope.row)"  type="text" size="mini" style="color: red;" v-if="scope.row.status == 0 && btnPerObj.delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination" style="margin-bottom: 20px;">
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
        <!-- 一键生成 -->
        <el-dialog
            title="一键生成进度表"
            width="600px"
            @closed="DialogClose"
            :visible.sync="dialog.visible"
            :close-on-click-modal="false"
            :modal-append-to-body="false">
            <el-form ref="courseForm" :model="courseForm" size="medium" label-width="50px">
                <el-form-item label="学期">
                    <el-select 
                        v-model="addYear"
                        clearable
                        filterable
                        @change="onKeyYearChange"
                        placeholder="全部">
                        <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <div class="cm-table">
                        <el-table :data="scheduleData" border header-row-class-name="cm-dark">
                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column v-for="(item,index) in oneTouchList" :key="index" :property="item.prop" :label="item.label" :width="item.width">
                                
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogClose">取 消</el-button>
                <el-button type="primary" @click="oneTouch">确 定</el-button>
            </span>
        </el-dialog>

        
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='schedule-management';
    const REMARK='进度表管理';

    import {mapState} from 'vuex';

    export default {
        name:TYPE,
        data(){
            return {
                breadcrumb: [
                    {label: "教学管理"},
                    {label: REMARK},
                ],
                dialog:{
                    visible:false
                },
                formSearch: {
                    course:'',//排课课程
                    grade:'',
                    class:'',//上课班
                    status:'',
                    courseId: '',//课程
                    course_name: ''
                },
                courseForm:{
                    courseCode:'',
                    name:'',
                    remark:'',
                    enName:'',
                    oldCode:'',
                    nature:'',
                    category:'',
                    id:'',
                    status:0
                },
                tableList:[
                    // {label:'进度表名称', prop:'name',width:240},
                    // {label:'学期', prop:'semester_name',width:180},
                    {label:'上课班', prop:'cls_name',width:320},
                    {label:'排课课程', prop:'course_name',width:320},
                    {label:'所在级', prop:'grade',width:70},
                    {label:'状态', prop:'status',width:70},
                    {label:'提交人', prop:'submit_username',width:90},
                    {label:'提交日期', prop:'last_submit_time',width:130},
                    {label:'总学时理论/实践', prop:'total_hours', width:90},
                    {label:'提交学时理论/实践', prop:'submitted_hours',width:90},
                    {label:'创建人', prop:'create_username' ,width:90},
                    {label:'创建日期', prop:'create_time' ,width:130}
                ],
                tableData:[],
                scheduleData:[],
                oneTouchList:[
                    {label:'课程表名称', prop:'name'},
                    {label:'年级', prop:'grade',width:100}
                ],
                options1:[],
                classList:[],
                courseList:[],
                scheduleList:[],
                formYear:"",
                addYear:"",
                tableLoading:false,
                myDate:new Date(),
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                userId:util.getStorage('loginId'),
                userName:util.getStorage('loginName'),
                btnPerObj:{//按钮权限
                  query:false,
                  onestep:false,
                  progress:false,
                  submit:false,
                  return:false,
                  delete:false
                }
            }
        },
        created(){
            this.getQueryData();
            this.getTermData();
            this.getCourseList();
            // this.getScheduleList();
        },
        computed:{
            ...mapState(['btnPermitList']),
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        filters:{
            getTime(time){
                if(time){
                    return util.getTime(time);
                }else{
                    return "";
                }
                
            }
        },
        methods:{
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_jindubiaoguanli") {  //查询
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="onestep_build_jindubiaoguanli") {  //一键生成
                        self.btnPerObj.onestep=true;
                        }
                        if (item.code=="progress_jindubiaoguanli") {  //查看进度
                        self.btnPerObj.progress=true;
                        }
                        if (item.code=="submit_jindubiaoguanli") {  //提交
                        self.btnPerObj.submit=true;
                        }
                        if (item.code=="return_jindubiaoguanli") {  //退回
                        self.btnPerObj.return=true;
                        }
                        if (item.code=="del_jindubiaoguanli") {  //删除
                        self.btnPerObj.delete=true;
                        }
                      
                    });
                }).catch(()=>{
                })
            },
            collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            },
            onSearch(){
                this.pageNo = 1;
                this.getTableList();
            },
            DialogClose(){
                this.addYear = "";
                this.scheduleData = [];
                this.dialog.visible = false;
            },
            //更改学期
            onYearChange(val){
                // debugger
                this.formSearch.class="";
                this.formSearch.course_name="";
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
                            
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum;
                        }
                    }
                }else{
                    this.fallYear = 0;
                    this.semesterNum = 0;
                }
                this.getClassList();
                this.getScheduleList(val);
                this.$router.replace({query:{...this.$route.query,formYear:val}});
            },
            onClassChange(val){
                this.$router.replace({query:{...this.$route.query,class:val}});
            },
            onCourseChange(val){
                this.$router.replace({query:{...this.$route.query,course:val}});
            },
            onGradeChange(val){
                this.$router.replace({query:{...this.$route.query,grade:val}});
            },
            onStatusChange(val){
                this.$router.replace({query:{...this.$route.query,status:val}});
            },
            getQueryData(){
                let query = this.$route.query;
                query.formYear && (this.formYear = +query.formYear);
                query.class && (this.formSearch.class = +query.class);
                query.course && (this.formSearch.course = +query.course);
                query.grade && (this.formSearch.grade = query.grade);
                query.status && (this.formSearch.status = +query.status);
                query.course_name && (this.formSearch.course_name = query.course_name);
            },
            onKeyYearChange(value){
                if(value){
                    for(let list of this.options1){
                        if(list.id==value){
                            this.keyfallYear = list.year;
                            this.keysemesterNum = list.orderNum;
                        }
                    }
                    let a = {}
                    a.id = asdf;
                    this.getOnKeyData();
                }
            },
            getOnKeyData(){
                 this.scheduleData = [];
                this.$http.post("_ed:/curriculum/list/unpublished",{
                    semester_year:this.keyfallYear,
                    semester_year_number:this.keysemesterNum 
                }).then(data=>{
                    if(data.code==0){
                        this.scheduleData = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            addTask(){
                this.getOnKeyData();
                this.dialog.visible = true;
            },
            sizeChange(size){
                console.log('t??', size)
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableList();
            },
            currentChange(current){
                 console.log('555555', current)
                this.pageNo = current;
                this.getTableList();
            },
            oneTouch(){
                this.$http.post("_ed:/schedule/autogenerate",{
                    // create_user:this.userId,
                    semester_year:this.keyfallYear,
                    // create_username:this.userName,
                    semester_year_number:this.keysemesterNum 
                }).then(data=>{
                    let type = "success";
                    let message = "生成成功！"
                    if(data.code==0){
                        this.dialog.visible = false;
                        this.addYear = "";
                        this.getTableList();
                    }else{
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        type:type,
                        message:message
                    })
                })
            },
            onBackOff(row,status){
                if(status=='th'){
                    if(row.status==1){
                        this.$confirm(`你确定退回${row.name}所维护的数据？, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$http.post("_ed:/schedule/cancelsubmit",{
                                id:row.id,
                                create_user:this.userId,
                                create_username:this.userName
                            }).then(data=>{
                                let type = "success";
                                let message = "退回成功！";
                                if(data.code==0){
                                    this.getTableList();
                                }else{
                                    type = "error";
                                    message = data.msg;
                                }
                                this.$message({
                                    type: type,
                                    message: message
                                });
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消退回'
                            });          
                        });
                    }else{
                        this.$alert(`进度表${row.name}的数据，未提交无需退回！`, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                            type: 'info',
                            message: `取消退回`
                            });
                        }
                        });
                    }
                }else if(status=='tj'){
                      this.$http.post("_ed:/schedule/submit",{
                                id:row.id,
                                create_user:this.userId,
                                create_username:this.userName
                            }).then(res=>{
                                 if(res.code==0){
                                      this.$message({
                                        type: 'success',
                                        message: '提交成功!'
                                    });     
                                     this.getTableList(); 
                                 }
                            })
                }
                
            },
            delItem(row){
                this.$confirm(`你确定删除${row.name}所维护的数据？, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$http.post("_ed:/schedule/delete",{
                        id:row.id,
                        create_user:this.userId,
                        create_username:this.userName
                    }).then(data=>{
                        let type = "success";
                        let message = "删除成功！";
                        if(data.code==0){
                            if(this.tableData.length==1){
                                this.pageNo = 1;
                            }
                            this.getTableList();
                        }else{
                            type = "error";
                            message = data.msg;
                        }
                        this.$message({
                            type: type,
                            message: message
                        });
                    })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
            },
            schedulView(row){
                this.$router.push({path:"/teaching_management/schedule_view",query:{row:JSON.stringify(row)}});
            },
            getTableList(){
                this.$router.replace({query:{...this.$route.query,course_name:this.formSearch.course_name}});
                this.tableLoading = true;
                this.$http.post("_ed:/schedule/query",{
                    request_page:this.pageNo,
                    page_size:this.pageSize,
                    course_name: this.formSearch.course_name,
                    grade : this.formSearch.grade,
                    semester_year : this.fallYear,
                    cls_id : this.formSearch.class,
                    status : this.formSearch.status,
                    semester_year_number : this.semesterNum,
                    semester_course_id : this.formSearch.course,
                    course_platform_id : this.formSearch.courseId
                }).then(data=>{
                    if(data.code==0){
                        this.tableLoading = false;
                        this.totalCount = data.data.total_records;
                        this.tableData = data.data.dataList;
                        
                        for(let list of this.tableData){
                            let datas = `${list.total_item}/${list.total_submitted}`;
                            let hours = `${list.arranged_theory_hours} / ${list.arranged_novitiate_hours}`;
                            let submitted_hours = `${list.submitted_theory_hours} / ${list.submmited_novitiate_hours}`;
                            this.$set(list,"item_data",datas);
                            this.$set(list,"total_hours",hours);
                            this.$set(list,"submitted_hours",submitted_hours);
                        }
                        console.log( this.tableData ,'表格')
                    }else{
                        this.$message.error(data.msg);
                    }
                }).catch((error)=>{
                    this.tableLoading = false;
                })
            },
            getScheduleList(_id){
                for(let item of this.options1){
                    if(item.id==_id){
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                    }
                }
                this.$http.post("_ed:/semestercourse/list",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                })
                .then(data=>{
                    if(data.code==0){
                        
                        data.data.forEach(x => x.displayName = x.course_arrange + '(' + x.majorNames + ')');
                        
                        this.scheduleList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getClassList(){
                this.$http.post("_ed:/coursecls/list",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.classList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getCourseList(){
                this.$http.get("_op:/course/combox")
                .then(data=>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getTermData(query){
                if(!query){
                   query = "学期"; 
                }
                this.$http.get('_op:/terms/'+query).then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                      
                              for(let i=0;i<this.options1.length;i++){
                                if(this.options1[i].stage==1){
                                    this.formYear=this.options1[i].id
                                    this.addForm = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear =this.options1[i].year;
                                    break
                                }else{
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                }
                            } 

                        // if(!this.$route.query.formYear){
                        //     let defaultTerm = this.options1.find(item=>item.stage==1);
                        //     if(defaultTerm){
                        //         this.formYear = defaultTerm.id;
                        //     }
                        // }
                        
                        // let year = this.myDate.getFullYear();
                        // let month = this.myDate.getMonth()+1;
                        // for(let i=0,len=this.options1.length;i<len;i++){

                        //     let termYear = this.options1[i].name.substring(0,4);
                        //     let termMonth = this.options1[i].startTime.substring(6,7);

                        //     if(year==termYear&&(month>=2&&month<=8)){
                        //         if(this.options1[i].orderNum==1){
                        //             // !this.$route.query.formYear && (this.formYear = this.options1[i].name);
                        //             this.addYear =  this.options1[i].name;
                        //             this.keyfallYear = this.fallYear = this.options1[i].year;
                        //             this.keysemesterNum = this.semesterNum = this.options1[i].orderNum;
                        //         }
                        //     }else if((year==termYear)&&(month>8||month<2)){
                        //       if(this.options1[i].orderNum==2){
                        //             // !this.$route.query.formYear && (this.formYear = this.options1[i].name);
                        //             this.keyfallYear = this.fallYear = this.options1[i].year;
                        //             this.keysemesterNum = this.semesterNum = this.options1[i].orderNum;
                        //         }
                        //     }
                        // }
                        this.getScheduleList(this.formYear);
                        this.getTableList();
                        this.getClassList();
                    }else{
                        this.$message.error(data.msg);
                    }


                }).catch(()=>{
                    this.options1 = [];
                })
            }

        }
    }
</script>
<style scoped>
    .pkkcBox{
       width:340px !important;
	 }
	.pkkc{
      width:340px !important;
    }

	
	.skbBox{
		width:320px !important;
	}

	.ztBox{
		width:100px !important;
	}
    .boxtable{
        height: 500px !important;
    }
    .cm-container{
      height:500px !important;
    }
	.fontcolor{
        color: red;
    }
</style>