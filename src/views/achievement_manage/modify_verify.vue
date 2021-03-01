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
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                       
                         <!-- <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable 
                                value-key="id"
                                placeholder="全部">  
                                <el-option v-for="(item,index) in options1" :key="item.id" :label="item.name" :value="item"></el-option>
                            </el-select>
                        </el-form-item> -->
                                 <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                filterable
                                remote
                                @change="onSelectChange" 
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程">
                            <el-select  clearable v-model="searchForm.courseId" filterable placeholder="请选择课程">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                          <el-form-item label="状态">
                             <el-select  v-model="searchForm.status" placeholder="选择状态"  clearable>
                          <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="学号">
                            <el-input  clearable v-model="searchForm.studentNo" maxlength="40" placeholder="请输入学号"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input  clearable v-model="searchForm.studentName" maxlength="40" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                         <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->

                         
                       
                    </div>
                          <div class="btn" >
                                <el-button type="primary" size="mini" @click="onSearch(formYear)"    v-if="btnPerObj.query">查询</el-button>
                            </div>
                   
                        <!-- <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch()">查询</el-button>
                        </div> -->
                </div>
            </el-form>
        </div>
         <!-- <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="batchAgree()"  v-if="btnPerObj.batchagree">批量同意</el-button>
            <el-button size="mini" type="primary" @click="batchNoAgree()"   v-if="btnPerObj.batchnoagree">批量不同意</el-button>
        </div> -->
        <el-dialog
            title="批量不同意"
            :visible.sync="batchAgreeDialog"
            width="30%"
             :modal-append-to-body='false'
            :before-close="handleClose">
            <el-form ref="form" :model="form" :rules='rulesBatch' label-width="80px">
                <el-form-item label="说明" prop="desc">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    
                    <el-button type="primary" @click="onSubmitbatchAgree('form')">确定</el-button>
                    <el-button @click="batchAgreeDialog = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                select
                style="width: 100%"
                v-loading="tableLoading"
                 @selection-change="handleSelectionChange"
                 >
               <el-table-column type="selection" label="全选" fixed width="60" :selectable='selectable' @row-click="kkkkk(row)"></el-table-column>
                <el-table-column prop="studentNo" label="学号" width='90' ></el-table-column>
                <el-table-column prop="studentName" label="姓名"   width='100' ></el-table-column>
                <el-table-column prop="majorName" label="专业"   width='110' ></el-table-column>
                <el-table-column prop="grade" label="年级"   width='50' ></el-table-column>
                <!-- <el-table-column prop="termName" label="学期" width='200'></el-table-column> -->
                <el-table-column prop="courseName" label="课程" width='120'  ></el-table-column>
                <el-table-column prop="scoreTypeName" label="成绩类型" width='70'  ></el-table-column>
                <el-table-column prop="examTime" label="考试日期" width='110'  ></el-table-column>
                <!-- <el-table-column prop="stageName" label="阶段" ></el-table-column> -->
                <el-table-column prop="oldGrade" label="原成绩"  width='60'></el-table-column>
                <el-table-column prop="newGrade" label="新成绩" width='60'></el-table-column>
                <el-table-column prop="instruction" label="修改说明"  min-width='200'></el-table-column>
                <el-table-column prop="approveRemark" label="审核意见"  min-width='200'></el-table-column>
                <!-- <el-table-column prop="approveRemark" label="审批说明"></el-table-column> -->
                <el-table-column prop="status" label="状态"  width='80'>
                   <template slot-scope="scope">
                      <span v-if="scope.row.status=='1'">已提交</span>
                      <span v-if="scope.row.status=='2'">已撤回</span>
                      <span v-if="scope.row.status=='3'">等待复核</span>
                      <span v-if="scope.row.status=='4'">处理失败</span>
                      <span v-if="scope.row.status=='5'">处理成功</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="lastUpdateUser" label="提交人"></el-table-column> -->
                <el-table-column prop="lastUpdateTime" label="提交日期" width='140' ></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="160"
                      v-if="btnPerObj.approval||btnPerObj.enclosure"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.status=='1' && hasPermission('chengjixiugaishenpi', 'confirm')" @click="examination(scope.row, 3, true)" >审批</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status=='3' &&hasPermission('chengjixiugaishenpi','approve')" @click="examination(scope.row, 5, true)" >复核</el-button>
                        <el-button type="text" size="small" @click="examination(scope.row, scope.row.status, false)" >查看</el-button>
                        <el-button type="text" size="small" @click="seeEnclosure(scope.row, scope.row.status, true)"   v-if="btnPerObj.enclosure">附件</el-button>
                    </template>
                </el-table-column>
               
            </el-table>
           
        </div>
        <!-- 查看附件弹窗 -->
        <el-dialog
            title="查看附件"
            :visible.sync="seeEnclosureDialog"
            width="50%"
             :modal-append-to-body='false'
            :before-close="handleClose">
            <img :src="imgSrc" alt=""  style="width:600px;height:400px;">
            <span slot="footer" class="dialog-footer">
                <el-button @click="seeEnclosureDialog = false">取 消</el-button>
                <el-button type="primary" @click="seeEnclosureDialog = false">确 定</el-button>
            </span>
       </el-dialog>
        <!-- 审批弹窗 -->
        <el-dialog
            :title="viewDetail?'审批':'查看审批'"
            :visible.sync="examinationDialog"
            width="800px"
            :modal-append-to-body='false'
            :before-close="handleClose">
            <div class="dialogTable"  >
                <h4 style=" margin-bottom: 10px;">学生基本信息</h4>
                <table class="examin_tab" style=" margin-bottom: 10px;">
                     <tr>
                         <td  align="center">学号</td>
                         <td  align="center">姓名</td>
                         <td  align="center">所在级</td>
                         <td  align="center">专业</td>
                         <td  align="center">行政班</td>
                     </tr>
                     <template  >
                         <tr>
                            <td align="center">{{dialogtableData.studentNo}}</td>
                            <td align="center">{{dialogtableData.studentName}}</td>
                            <td align="center">{{dialogtableData.grade}}</td>
                            <td align="center">{{dialogtableData.majorName}}</td>
                            <td align="center">{{dialogtableData.administrativeClassName}}</td>
                        </tr>
                     </template>
                 </table>
                 <div style=" margin-bottom: 10px;">
                  <h4 style=" margin-bottom: 10px;">成绩信息</h4>
                    <template  style=" margin-bottom: 10px;">
                        <span >学期:{{dialogtableData.termName}}</span>
                        <span style="margin-left:10px;">课程:{{dialogtableData.courseName}}</span>
                        <span style="margin-left:10px;">阶段:{{dialogtableData.stageName}}</span>
                    </template>
                   </div>
                  <h4 style=" margin-bottom: 10px;">成绩认定方式</h4>
                 <table>
                     <tr>
                         <td align="center">成绩</td>
                         <td align="center">{{dialogtableData.scoreTypeName}}</td>
                         <td  align="center">阶段成绩</td>
                         <td  align="center">课程成绩</td>
                     </tr>
                     <template >
                         <tr>
                            <td  align="center">原成绩</td>
                            <td  align="center">{{dialogtableData.oldGrade}}</td> 
                            <td  align="center">{{dialogtableData.oldStageGrade}}</td>
                            <td  align="center">{{dialogtableData.oldCourseGrade}}</td>
                        </tr>
                        <tr>
                            <td  align="center">修改后成绩</td>
                            <td  align="center">{{dialogtableData.newGrade}}</td>
                            <td  align="center">{{dialogtableData.newStageGrade}}</td>
                            <td  align="center">{{dialogtableData.newCourseGrade}}</td>
                        </tr>
                     </template>
                 </table>
                    <el-form :model="ruleForm"  label-width="80" class="fromStyle" :label-position="labelPosition" >
                       
                        <el-form-item label="说明:"  v-if="viewDetail">
                            <el-input type="textarea" v-model="ruleForm.textExplain"></el-input>
                        </el-form-item>
                         <el-form-item label="说明:"  v-else>
                            <div v-if="ruleForm.textExplain==''">无</div>
                            <div>{{ruleForm.textExplain}}</div>
                  
                        </el-form-item>

                        <el-form-item style="text-align:right;"> 
                            <!-- <el-button type="primary" @click="submission('ruleForm')">确 定</el-button> -->
                            <el-button v-if="viewDetail" type="primary" @click="onAgree('ruleForm')">同意</el-button>
                            <el-button v-if="viewDetail" type="primary" @click="onNoAgree('ruleForm')">不同意</el-button>
                            <el-button @click="examinationDialog = false">取 消</el-button>
                        </el-form-item>
                    </el-form>
                   
            </div>
         
        </el-dialog>
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
                labelPosition:'right',
                checkboxSelect:false,
                rulesBatch: {
                    desc: [{ required: true, message: '请填写批量不通过原因', trigger: 'blur' }]
                },
                // rules: {
                //     status: [ { required: true, message: '请选择审批选项', trigger: 'change' }],
                   
                // },
                form:{
                    desc:""
                },
                ruleForm:{
                    status:"",
                    textExplain:""
                },
                batchAgreeDialog:false,
                // textExplain:"",//文本
                imgSrc:"",
              
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                    }, {
                    value: '选项2',
                    label: '双皮奶'
                }],
                formLabelWidth: '60px',
                value:"",
                options: [{
                    value: '3',
                    label: '同意'
                    }, {
                    value: '4',
                    label: '不同意'
                }],
                seeEnclosureDialog:false,//查看附件

                examinationDialog:false,//审批弹窗
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "成绩修改审批"}
                ],
                formInline:{
                    major:""
                },
               StatusOptions: [
                  {
                    value: "1",
                    label: "已提交"
                  },
                  {
                    value: "3",
                    label: "处理成功"
                  },
                  {
                    value: "4",
                    label: "处理失败"
                  }
              ],
                dialog:{
                    status:'edit',
                    editvisible:false,
                    visible:false,
                    detailvisible:false,
                    gradeVisible:false,
                    classVisible:false
                },
                searchForm: {
                    courseId:"",//课程ID
                    semesterYear:"",//学年
                    semesterYearNumber:"",//学年号
                    status:"",//状态
                    studentName:"",//姓名
                    studentNo:"",//学号
                    newSemesData:""//接收学年学号
                },
                classData:[],
                dialogtableData:{},
                tableData:[],
                addtableData:[],
                gradetableData:[],
                editTableData:[],
                onTouchData:[],
                gridData:[],
               
                formYear:"",
                onKeyYear:"",
                options1:[],
                courseList:[],
                arrangCourseList:[],
                onSelectionChangeVal:[],//选中数据
                selectData:[],//选中ID处理
                selectStatus:[],//选中状态
                // 选中的状态
                myDate:new Date(),
                tableLoading:false,
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                viewDetail:false,
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                 btnPerObj:{//按钮权限
					query:true,
					batchnoagree:false,
                    batchagree:false,
                    approval:false,
                    enclosure:false
                    
                },
                fallYear: '',
                semesterNum: '',
            }
        },
        created(){
            this.$authorize.me();
            this.getTermData();
            this.getCourseList();//课程下拉列表
         
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
//          this.getBtnPermit();//按钮权限
        },
        filters:{
            getTime(time){
                return util.getTime(time);
            }
        },
        methods:{
            
                onSelectChange(_id) {
                this.selectChangeFun(_id)
            },
              selectChangeFun(_id) {

                let self = this;
                let id = self.formYear;
                // let grade = self.addForm.grade;
                let classNum = self.addForm.classNum; //所在级更改为分班序号

                for (let item of this.options1) {
                    if (item.id == _id) {
                        self.fallYear = item.year;
                        self.semesterNum = item.orderNum;
                    }
                }
                this.addColumn = [{
                    id: ''
                }]
                this.courseArrangeList = [];
                // this.getCourseArrange();

            },
            hasPermission(key, val) {
                return this.$authorize.hasPermission(key,val);
            },
            getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						if (item.code=="batchagree_scoreModifyApprove") {
	            		self.btnPerObj.batchagree=true;
	            	}
	            	if (item.code=="batch_noagree_scoreModifyApprove") {
	            		self.btnPerObj.batchnoagree=true;
	            	}
	            	if (item.code=="query_scoreModifyApprove") {
                        self.btnPerObj.query=true;
	            	}
	            	if (item.code=="approval_scoreModifyApprove") {
	            		self.btnPerObj.approval=true;
	            	}
	            	if (item.code=="enclosure_scoreModifyApprove") {
	            		self.btnPerObj.enclosure=true;
	            	}
                    });
                }).catch(()=>{
                })
            },
            handleClose(done){
                done();
                    
            },
            //获取列表
            getFailedGradeData(){
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                let roles = vuex.me.roles.map(item=>item.id).join();
                let query = {
                        id: 0,
                        type:"score_modify_apply_list",
                        extend: JSON.stringify({
                            approval: 1,      // --申请传0，审批传1
                            courseId: this.searchForm.courseId,     // --课程编码，如选择         
                            semesterYear: this.fallYear ? this.fallYear:'', // -- 学年
                            semesterYearNumber: this.semesterNum ? this.semesterNum :'',   //--学期
                            status: this.searchForm.status,             // --状态
                            studentName: this.searchForm.studentName,        // --学生姓名
                            studentNo: this.searchForm.studentNo,       // --学号
                            role: roles  //jxk,xuejike,cg""      --当前用户角色   /api/platform/authorize/me?_t=26687615  接口返回的roles
                    }),
                    userId: vuex.me.attributes.login_info.id    //当前用户ID"
                }
                this.$http.post("_sc:/modified/courseaffirm/pQueryCom ",query).then(data=>{
                    this.tableLoading=false;
                    this.tableData= JSON.parse(data.data);
                    this.tableData.forEach(item => {
                        item.examTime = item.examTime
                    })
                    this.totalCount=data.data.totalCount;
                            
                }).catch(()=>{
                    // this.tableLoading=true;
                })
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                return Y+M+D
            },
            //搜索
             onSearch(){
                this.pageNo=1;
                 this.getFailedGradeData();//刷新列表
            },
            selectable(row,index){
                if(row.status==1){
                    return true;
                }else{
                    return false;
                }
            },
              //选中事件
            handleSelectionChange(val){
                this.selectData=[];
                this.selectStatus=[];
                this.onSelectionChangeVal=val;
                this.onSelectionChangeVal.forEach(item => {
                this.selectData.push(item.id);
                // this.selectStatus.push(item.status)
                
                if(item.status!=1){
                    this.selectStatus.push(item.status)

                }
                });
            },
            kkkkk(row){
            
            },
            // 批量同意
            batchAgree(){
                let ids=this.selectData;
                let status='3';
                this.$http.post("_sc:/scoreModifyApply/updateStatusBatch",{
                    ids,status
                }
                ).then(res=>{
                    if(res.code==0){
                        this.$message({
                        message: '同意成功',
                        type: 'success'
                        });
                    }
                     this.getFailedGradeData();//列表获取
                }).catch(()=>{
                
                })
            },
            // 批量不同意
            batchNoAgree(){
                if(this.selectData==null||this.selectData==""){
                    this.$message({
                    message: '没有勾选项，请先勾选再操作',
                    type: 'warning'
                    });

                }else{
                 this.batchAgreeDialog=true;

                }
                

            },
            onSubmitbatchAgree(){
                this.$refs.form.validate((valid)=>{
                    if (valid){
                      this.batchNoAgreeSubmit();
                    }else{
                        return false;
                    }
                })

            },
          
            // 批量
            batchNoAgreeSubmits(){
                let ids=this.selectData;
                let status=this.ruleForm.status;
                let instruction = this.ruleForm.textExplain;
                
                if (status=="4"){
                    if(instruction==''||instruction==undefined){
                         this.$message({
                                message: '请填写不同意原因',
                                type: 'warning'
                            });
                         return false

                    }else{
                         if (ids.length){
                     this.$http.post("_sc:/scoreModifyApply/updateStatusBatch",{
                    ids,status,instruction
                }
                ).then(res=>{
                    if(res.code==0){
                        if(status==3){
                            this.$message({
                            message: '批量同意成功',
                            type: 'success'
                            });
                        }
                        this.examinationDialog=false;
                        if(status==4){
                            this.$message({
                            message: '不同意成功',
                            type: 'success'
                            });
                        this.examinationDialog=false;
                        }
                        
                    }
                    this.getFailedGradeData();//列表获取
                }).catch(()=>{
                
                })
                }else{

                    this.$message({
                        message: '请先勾选再进行操作',
                        type: 'warning'
                    });
                    return false
                }
                    }
                   
                   //不同意的接口
                }else if(status=="3"){
                     if (ids.length){
                       
                     this.$http.post("_sc:/scoreModifypply/updateStatusBatch",{
                    ids,status,instruction
                }
                ).then(res=>{
                    if(res.code==0){
                        if(status==3){
                            this.$message({
                            message: '批量同意成功',
                            type: 'success'
                            });
                        }
                        this.examinationDialog=false;
                        if(status==4){
                            this.$message({
                            message: '批量不同意成功',
                            type: 'success'
                            });
                        this.examinationDialog=false;
                        }
                        
                    }
                    this.getFailedGradeData();//列表获取
                }).catch(()=>{
                
                })
                }else{

                    this.$message({
                        message: '请先勾选再进行操作',
                        type: 'warning'
                    });
                    return false
                }
                }
            },
            // 审批
            examination(row,newStatus, viewDetail){
             
                this.newIdData=row.id;
             
                this.viewDetail = viewDetail;
                this.examinationDialog=true;
                this.dialogtableData=row;
                this.ruleForm.textExplain="";
                this.ruleForm.status="";
                this.ruleForm.textExplain = row.instruction || "";
                this.ruleForm.status = newStatus;
              
            },
            //同意  3
            onAgree(){
                let status=this.ruleForm.status;
                let ids=[this.newIdData];
              
                let params={
                     status:status,
                     ids:ids,
                     instruction: this.ruleForm.textExplain,
                }
                  this.$http.post("_sc:/scoreModifyApply/updateStatusBatch",params).then(res=>{
                     if(res.code==0){
                        this.$message({
                        message: '操作成功',
                        type: 'success'
                        });
                        this.examinationDialog = false;
                        this.getFailedGradeData();//列表获取
                    }
                   
                  })
            },
            // 不同意
            onNoAgree(){
                this.ruleForm.status=4;
                let ids=[this.newIdData];
                let status=this.ruleForm.status;
                let instruction =this.ruleForm.textExplain; 
                if(status=='4'){
                    if(this.ruleForm.textExplain==''||this.ruleForm.textExplain==undefined){
                        this.$message({
                                    message: '请填写不同意原因',
                                    type: 'warning'
                                });
                            return false
                    }else{
                        let params ={
                            status:status,
                            ids:ids,
                            instruction:instruction,
                        }
                        this.$http.post("_sc:/scoreModifyApply/updateStatusBatch",params).then(res=>{
                        if(res.code==0){
                            this.$message({
                                message: '不同意成功',
                                type: 'success'
                            });
                            this.examinationDialog = false;
                        }
                        this.getFailedGradeData();//列表获取
                    })
                    }
                }
            },
            // 审批提交
            submission(ruleForm){
                let that = this;
               
                    that.$refs[ruleForm].validate((valid)=>{
                        
                        if (valid){
                            that.batchNoAgreeSubmits();
                        }
                    })
            },
             // 查看附件
            seeEnclosure(row){
                var host = window.location.host;
                if(row.fileUrl && row.fileUrl.length > 0){
                    this.seeEnclosureDialog=true;
                    this.imgSrc='/'+row.fileUrl[0]
                }
               
            },
            // 课程下拉列表
            	getCourseList(){
                this.$http.get("_op:/course/combox")
                
                .then(data =>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
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
       
           
         
          
            confirmAdd(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addRequire();
                    } else {
                        return false;
                    }
                });
            },
         
                      // 获取学期列表默认当前学期数据
            getTermData(){
                let self = this;
                let query="学期"
                self.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){ 
                        self.options1 = data.data.reverse();
                             for(let i=0;i<this.options1.length;i++){
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                            }
                        //    this.options1.forEach(item =>{
                        //         if(item.name.indexOf("当前学期")!=-1){
                        //            this.formYear =item.name
                        //         }
                        //     })

                        self.getFailedGradeData() //请求列表
                    }else{
                        self.$message.error(data.msg);
                    }
                })
         },

        }
    }
</script>
<style scoped >
    .cm-table /deep/ .el-button--small{
        padding: 0px;
    }
    .cm-table /deep/ .el-table--mini td{
        padding: 4px 0;
    }
    .cm-addGrade p{
        margin-bottom: 12px;
    }
    .dialogTable td{
        align:center;
        border:  1px solid #ebeef5;
        width: 140px;
        height: 40px;
        padding :0  5px;
    }
    .textInput{
        width:500px;
        height: 100px;
    }
    .fromStyle{
        padding-top: 20px;
    }
   .dialogTable .examin_tab{

   }
   
   
</style>