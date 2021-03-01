<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期" prop="year">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                @change="onYearChange"
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="formInline.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select v-model="formInline.major" filterable  clearable @change="onMajorChange">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务状态">
                            <el-select v-model="formInline.status">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in statesList" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 暂时不做 -->
                        <!-- <el-form-item label="课程" filterable>
                            <el-select v-model="formInline.course" :disabled="formInline.major==0">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item> -->
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-position ">
            <el-button size="mini" type="primary" @click="addTask" v-if="btnPerObj.add">新增任务</el-button>
            <el-button size="mini" @click="revocation" v-if="btnPerObj.revocation">撤回任务</el-button>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    size="mini"
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    header-row-class-name="cm-dark"
                    @selection-change="onSelectionChange">
                <el-table-column type="selection" fixed width="38px"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='课程标识'">
                            <!-- 状态-1 全部， 0正常开课， 1延期，2提前， 3 增加 -->
                            <template v-if="scope.row.status==-1">
                                <span>全部</span>
                            </template>
                            <template v-else-if="scope.row.status==0">
                                <span>正常开课</span>
                            </template>
                            <template v-else-if="scope.row.status==1">
                                <span style="color: red;">延</span>
                            </template>
                            <template v-else-if="scope.row.status==2">
                                <span style="color: red;">提</span>
                            </template>
                            <template v-else-if="scope.row.status==3">
                                <span style="color: red;">增</span>
                            </template>
                        </template>
                        <template v-else-if="item.prop=='progress_hours'">
                            <template v-if=" scope.row.progress_hours!= scope.row.semester_hours">
                                <span style="color: red;">{{ scope.row.progress_hours}}</span>
                            </template>
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                    v-if="btnPerObj.teaching||btnPerObj.plan||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==3 || scope.row.is_aarrange == 1">
                            <el-button @click="delTableItem(scope.row)" type="text" size="small" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
                        </template>
                        <template v-else>
                            <el-button @click="planAdjustment(scope.row)" type="text" size="small" v-if="btnPerObj.plan">计划调整</el-button>
                        </template>
                        <el-button @click="teachingRemark(scope.row)" type="text" size="small" v-if="btnPerObj.teaching">教学备注</el-button>
                    </template>
                </el-table-column>
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
                @current-change="currentChange">"
            </el-pagination>
        </div>
        <!-- 新增教学任务(增加） -->
        <el-dialog
            width='400px'
            title="新增教学任务(增加）"
            :visible.sync="dialog.visible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            @closed="dialogClose"
            custom-class="cm-dialog-small">
            <el-form ref="courseForm" :rules="rules" class="boxStyle" :model="courseForm">
            	<el-form-item label="学期" prop="year" class="flex-form">
                    <el-select 
                        style="width: 100%;"
                        v-model="addYear"
                        clearable
                        filterable
                        ref = "termRef"
                        remote
                        @change="onaddyear"
                        :remote-method="getTermData" 
                        placeholder="全部">
                        <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在级" prop="grade" class="flex-form">
                    <intelligent-year-picker v-if="hackReset" style="width: 100%;" ref="gradeRef"
                        v-model="courseForm.grade"
                        type="year" 
                        value-format="yyyy" 
                        @change="changeEnd"
                        :picker-options="pickerOptionsEnd"
                        placeholder="选择年级"> 
                    </intelligent-year-picker>
                </el-form-item>
                <el-form-item label="专业" prop="majorId" class="flex-form">
                    <el-select   v-model="courseForm.majorId"
                      placeholder="请选择专业"
                     @change="onMajorChange"
                      style="width: 100%;">
                        <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" prop="courseId"
                 placeholder="请选择课程"
                  filterable class="flex-form">
                    <el-select  :disabled="!this.courseForm.majorId||!this.courseForm.grade" v-model="courseForm.courseId" style="width: 100%;">
                        <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="学时" prop="hours" class="flex-form">
                  <el-input v-model="courseForm.hours" maxlength="9" @blur="OnBlurEvent" placeholder="格式：理论学时/实践学时"></el-input>
                </el-form-item>
            </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogCancel">取 消</el-button>
	            <el-button type="primary" @click="addConfirm('courseForm')">确 定</el-button>
	        </span>
        </el-dialog>
        <!-- 教学任务调整 -->
        <el-dialog
          title="教学任务调整"
          width='400px'
          :visible.sync="dialog.edit"
          :close-on-click-modal="false"
           :modal-append-to-body="false"
           custom-class="cm-dialog-small">
            <el-form ref="courseForm" :model="courseForm">
                
                <el-form-item label="所在级" class="flex-form">
                    <intelligent-year-picker style="width: 100%;"
                        :disabled="true"
                        v-model="editForm.grade"
                        type="year" 
                        value-format="yyyy" 
                        placeholder="选择年级"> 
                    </intelligent-year-picker>
                </el-form-item>
                <el-form-item label="专业" class="flex-form">
                    <el-select v-model="editForm.majorId" :disabled="true" style="width: 100%;">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" filterable :disabled="true" class="flex-form">
                    <el-select v-model="editForm.courseId" :disabled="true" style="width: 100%;">
                        <el-option label="全部" value=""></el-option>
                        <!-- <el-option v-for="list in formList.statesList" :key="list.value" :label="list.label" :value="list.value"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="任务状态" filterable placeholder="请选择任务状态" class="flex-form">
                    <el-select v-model="editForm.statusId" style="width: 100%;">
                        <el-option v-for="list in statesList" :key="list.value" :label="list.label" :value="list.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学期" prop="year" class="flex-form">
                    <el-select 
                        style="width: 100%;"
                        v-model="taskYear"
                        clearable
                        filterable
                        remote
                        @change="onTearmChange"
                        :remote-method="getTermData" 
                        :disabled="editForm.statusId==0?true:false"
                        placeholder="全部">
                        <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.edit=false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 教学备注 -->
        <el-dialog 
        	title="教学备注" 
        	:visible.sync="dialog.remark" 
            :close-on-click-modal="false"
        	:modal-append-to-body="false"
           	width="640px">
	        <el-table :data="gridData">
	          	<el-table-column type="index" label="序号" width="50"></el-table-column>
	            <el-table-column v-for="(item,index) in gridList" :key="index" :property="item.prop" :label="item.label" :width="item.width">
	            	 <template slot-scope="scope">
                        <template v-if="item.label=='创建日期'">
                            {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
	            </el-table-column>
	        </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="tasknoteClose">关 闭</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
    const TYPE='teaching-task';
    const REMARK='教学任务管理';

    import {mapState} from 'vuex';

	export default {
        name:TYPE,
		data(){
            var validateTime = (rule, value, callback)=>{
                if(!value){
                    callback(new Error("输入学时不能为空"));
                    return;
                }
                let reg = /^[\d\/]+$/;//匹配数字跟斜杠
                if (value.length>9){
                    callback(new Error("学时输入不能超过9位数字")); 
                }else if(!reg.test(value)){
                    callback(new Error("请输入9位以内整数"));
                }else {
                    callback();
                }
            };
			return {
                hackReset:false,
                options1:[],
				breadcrumb: [
                    {label: "教务管理"},
                    {label: REMARK},
                ],
                dialog:{
                    edit:false,
                	remark:false,
                	visible:false
                },
                formInline: {
                    year:'',
                    major:0,
                    grade: "",
                    course:'',
                    status: -1
                },
                formYear:'',
                addYear:"",
                taskYear:"",
                courseForm:{
                    grade:'',
		            majorId:'',
		            courseId:'',
                    hours:''
		        },
                editForm:{
                    grade:'',
                    majorId:'',
                    courseId:'',
                    statusId:''
                },
                rules:{
                    grade: { required: true, message: '请选择所在级', trigger: 'change' },
                    majorId: { required: true, message: '请选择专业', trigger: 'change' },
                    courseId: { required: true, message: '请选择课程', trigger: 'change' },
                    hours: [{ required: true, message: '请输入学时', trigger: 'blur' },
                            { validator: validateTime, trigger:  "change"}
                        ]
                },
                tableList:[
		            {label:'所在级', prop:'grade',width:100},
		            {label:'专业', prop:'major',width:180},
		            {label:'学期', prop:'semester_name',width:200},
                    {label:'课程名称', prop:'course_name',width:220},
		            {label:'总学时理论/实践', prop:'total_hourse',width:140},
		            {label:'已授学时理论/实践', prop:'teached_hourse',width:140},
		            {label:'本学期学时理论实践', prop:'semester_hours',width:140},
                    {label:'进度表学时理论/实践', prop:'progress_hours',width:140},
		            {label:'课程标识', prop:'status',},
		            {label:'模块负责人', prop:'course_responsible_persons',}
		        ],
                gridList:[
                	{label:'创建人', prop:'create_username'},
                	{label:'创建日期', prop:'create_time'},
                	{label:'备注内容', prop:'content'},
                ],
                statesList:[//状态-1 全部， 0正常开课， 1延期，2提前， 3 增加
                    {label:'正常开课',value:0},
                    {label:'延期上课',value:1},
                    {label:'提前上课',value:2},
                    // {label:'增加',value:3}
                ],
                tableLoading:false,
                tableData:[],
                majorList:[],
                courseList:[],
                gridData:[],
                onSelectionChoseVal:[],
                pageNo: 1,
	          	pageSize: 10,
	          	totalCount:0,
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
                myDate:new Date(),
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                userId:util.getStorage('loginId'),
                userName:util.getStorage('loginName'),
                btnPerObj:{//按钮权限
                  query:false,
                  add:false,
                  revocation:false,
                  plan:false,
                  teaching:false,
                  delete:false
                },
                pickerOptionsEnd: {},
			}
		},
        created(){
            this.getTermData();
            this.getMajorList();
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
                return util.getTime(time);
            }
        },
		methods:{
            getSelectItem(item){
                let self = this;
                self.selectItem = item;
            },
        //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_jiaoxuerenwuguanli") {  //查询
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="add_task") {  //新增任务
                        self.btnPerObj.add=true;
                        }
                        if (item.code=="revocation") {  //撤回任务
                        self.btnPerObj.revocation=true;
                        }
                        if (item.code=="plan_adjustment") {  //计划调整
                        self.btnPerObj.plan=true;
                        }
                        if (item.code=="teaching_remark") {  //查看附件
                        self.btnPerObj.teaching=true;
                        }
                        if (item.code=="del_jiaoxuerenwuguanli") {  //删除
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
            onYearChange(val){
              
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
            },
            onaddyear(val){
                let self = this;
                for(let list of self.options1){
                   if(list.id==val){
                        self.addfallYear = list.year;
                        self.addsemesterNum = list.orderNum; 

                        delete this.pickerOptionsEnd.disabledDate;
                        this.courseForm.grade = String(self.addfallYear);
                        this.pickerOptionsEnd.disabledDate = function(time) {
                            return time.getFullYear() > self.addfallYear;
                        }
                   } 
                }  
            },
            changeEnd(val){
                //修改所在级时，禁用下拉列表中的值 
                let self = this;
                //删除所有diabledkey
                self.options1.forEach(item=>{
                    if(item.disabled){
                         delete item["disabled"];
                    }
                })

                self.options1.forEach(item=>{
                    if(self.addYear){
                        if(item.year < self.addYear){
                            item.disabled = true;
                        }
                    }
                })
            },
            OnBlurEvent(){
                let hours = this.courseForm.hours.split('/');
                if(hours.length==1&&hours[0]){
                    this.courseForm.hours = `${this.courseForm.hours}/0`;
                }else{
                    // this.courseForm.hours = `0/0`;
                }
            },
            dialogClose(){
                this.addYear = '';
                this.$refs.courseForm.resetFields();
            },
            dialogCancel(){
                this.addYear = '';
                this.dialog.visible = false;
                this.$refs.courseForm.resetFields();
            },
            onMajorChange(_id){
                if(_id){
                    this.getCourseList(_id);
                }else{
                    this.formInline.course = "";
                }
            },
            addConfirm(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.addRequire();
                  } else {
                    return false;
                  }
                });
            },
            addRequire(){//新增教学任务
                let theory;
                let novitiate;
                let hours = this.courseForm.hours.split('/');
                if(!this.courseForm.majorId){
                    this.$message.warning("请选择专业");
                    return ;
                }
                if(!this.courseForm.courseId){
                    this.$message.warning("请选择课程");
                    return ;
                }
                if(!this.courseForm.hours){
                    this.$message.warning("请输入学时");
                    return ;
                }
                for(let i=0,len = hours.length; i<len; i++){
                    theory = hours[0];
                    novitiate = hours[1];
                }
                this.$http.post("_ed:/teachtask/add",{
                    grade:this.courseForm.grade,
                    major_id:this.courseForm.majorId,
                    semester_year:this.addfallYear,
                    semester_year_number:this.addsemesterNum,
                    course_platform_id:this.courseForm.courseId,
                    semester_theory_hours:theory,
                    semester_novitiate_hours:novitiate
                }).then(data=>{
                    let type = "success";
                    let message = "新增成功！";
                    if(data.code==0){
                        this.dialog.visible = false;
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
            delTableItem(row){
                this.$confirm(`此操作将永久删除 "${row.major}" 专业的维护信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("_ed:/teachtask/delete/"+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                if(this.tableData.length==1){
                                    this.pageNo = 1;
                                }
                                this.getTableList();
                            }else{
                                type='error';
                                message=data.msg;
                            }
                            this.$message({
                                type,
                                message,
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            planAdjustment(row){
                this.$http.post("_ed:/semestercourse/query",{
                    grade:row.grade,
                    major_id:row.major_id,
                    page_size:10,
                    course_name:row.course_name,
                    request_page:1,
                    course_platform_id:row.course_platform_id,
                    semester_year:row.semester_year,
                    semester_year_number:row.semester_year_number
                }).then(data=>{
                    if(data.code==0){
                        if(data.data.dataList.length>0){
                            this.$message.warning("该教学任务已经生成学期课程库，不能在做调整！");
                        }else{
                            this.rowId = row.id;
                            this.editForm.grade = `${row.grade}/0/0`;
                            this.editForm.majorId = row.major;
                            this.editForm.courseId = row.course_name;
                            this.editForm.statusId = row.status;
                            this.editForm.statusId = row.status;
                            this.taskYear = row.semester_name;
                            this.taskfallYear = row.semester_year;
                            this.tasksemesterNum = row.semester_year_number;
                            this.dialog.edit = true;
                        }
                    }
                })
                
            },
            onTearmChange(id){
                for(let list of this.options1){
                    if(list.id==id){
                        this.taskfallYear = list.year;
                        this.tasksemesterNum = list.orderNum;
                    }
                }
            },
            confirmEdit(){//教学任务调整
                this.$http.post("_ed:/teachtask/adjust",{
                    id:this.rowId,
                    status:this.editForm.statusId,
                    semester_year_adjust_to:this.taskfallYear,
                    semester_year_number_adjust_to:this.tasksemesterNum
                }).then(data=>{
                    let type = "success";
                    let message = "教学任务调整成功！"
                    if(data.code==0){
                        this.dialog.edit = false;
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
            },
			addTask(){
				this.dialog.visible = true;
			},
            revocation(){
                if(this.onSelectionChoseVal.length>0){
                    let idList = [];
                    let grade = [];
                    let major = [];
                    let lens;
                    for(let i=0,len=this.onSelectionChoseVal.length;i<len;i++){ 
                        let value = this.onSelectionChoseVal[i];
                        lens = len;
                        idList.push(value.id); 
                        if(value.major==null){
                            value.major = "";
                        }
                        major.push(`${value.grade}${value.major}`);
                    };
                    this.$confirm(`你确定撤回任务吗？
                        <br/> `+major+"，任务数共"+lens+"笔", '提示', {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(() => {
                        this.$http.post("_ed:/teachtask/withdraw",{
                            idlist:idList
                        }).then(data=>{
                                let type='success';
                                let message = "撤回成功！";
                                if(data.code==0){
                                    this.getTableList();
                                }else{
                                    if(data.data&&data.data.length>0){
                                        type="warning";
                                        message =  `${data.msg}${data.data}`;
                                        
                                    }else{
                                        type='error';
                                        message=data.msg;
                                    } 
                                }
                                this.$message({
                                    type,
                                    message,
                                });
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消撤回'
                        });
                    });
                    
                }else{
                    this.$message.warning("请先选择您要撤回的任务！");
                }
            },
            onSelectionChange(val){
                this.onSelectionChoseVal = val;
            },
			sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableList();
			},
			currentChange(current){
                this.pageNo=current;
                this.getTableList();
			},
			teachingRemark(row){
				this.dialog.remark = true;
                this.$http.get("_ed:/tasknote/list/"+row.id)
                .then(data=>{
                    if(data.code==0){
                        this.gridData = data.data;
                    }else{
                        this.$message.error(data.msg)
                    }
                })
			},
            tasknoteClose(){
                this.dialog.remark = false;
            },
            // 新增课程列表下拉
            getCourseList(_id){
                this.$http.get("_op:/coursePlatform/combox/"+_id)
                .then(data=>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            }, 
            // getCourseList(){
            //     this.$http.get("_op:/coursePlatform/combox/with/trainplan/filter/"+ this.courseForm.grade +'/'+this.courseForm.majorId)
            //     .then(data =>{
            //     if(data.code==0){
            //                 this.courseList = data.data;
            //             }else{
            //                 this.$message.error(data.msg);
            //             }

            //     })

            // },

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
            getTableList(val){
             
                let  option = {
                        // course_name:this.formInline.course,
                        grade:this.formInline.grade,
                        major_id:this.formInline.major,
                        status:this.formInline.status,
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum,
                        // course_platform_id:this.formInline.course,
                        request_page:this.pageNo,
                        page_size:this.pageSize,
                    }
                this.tableLoading = true;
                this.$http({
                    method:'post',
                    url:"_ed:/teachtask/query",
                    data:{
                        ...option
                    },
                }).then(data=>{
                    if(data.code==0){
                        this.tableLoading = false;
                        this.totalCount=data.data.total_records;
                       
                        this.tableData = data.data.dataList;
                        for(let item of this.tableData){
                            if(item.total_theory_hours==null){
                                item.total_theory_hours = 0;
                            }
                            if(item.total_novitiate_hours==null){
                                item.total_novitiate_hours = 0;
                            }
                            if(item.teached_theory_hours==null){
                                item.teached_theory_hours = 0;
                            }
                            if(item.teached_novitiate_hours==null){
                                item.teached_novitiate_hours = 0;
                            }
                            if(item.semester_theory_hours==null){
                                item.semester_theory_hours = 0;
                            }
                            if(item.semester_novitiate_hours==null){
                                item.semester_novitiate_hours = 0;
                            }
                            if(item.schedule_theory_hours==null){
                                item.schedule_theory_hours = 0;
                            }
                            if(item.schedule_novitiate_hours==null){
                                item.schedule_novitiate_hours = 0;
                            }
                            this.$set(item,'total_hourse',item.total_theory_hours + "/"+item.total_novitiate_hours);
                            this.$set(item,'teached_hourse',item.teached_theory_hours + "/"+item.teached_novitiate_hours);
                            this.$set(item,'semester_hours',item.semester_theory_hours + "/"+item.semester_novitiate_hours);
                            this.$set(item,'progress_hours',item.schedule_theory_hours + "/"+item.schedule_novitiate_hours);
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                }).catch((error)=>{
                    this.tableLoading=false;
                })
            },
            // 学期数据下拉获取
            getTermData(query){
                let self = this;
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                        // 		this.options1.forEach(item =>{
                        //         if (item.stage==1){
                        //            this.formYear=item.name
                        //         }else{
                        //              if(item.name.indexOf("当前学期")!=-1){
                        //              this.formYear=item.name
						// 		   }
						// 	  }
                        // })
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
                        
                        // let year = this.myDate.getFullYear();
                        // let month = this.myDate.getMonth()+1;
                        // let currentSelectYear = 0;
                        // for(let i=0,len=this.options1.length;i<len;i++){

                        //     let termYear = this.options1[i].name.substring(0,4);
                        //     let termMonth = this.options1[i].startTime.substring(6,7);
                        //     if(year==termYear&&(month>=2&&month<=8)){
                        //         if(this.options1[i].orderNum==1){
                        //             this.formYear = this.options1[i].name;
                        //             this.addYear = this.options1[i].name;
                        //             this.taskYear = this.options1[i].name;
                        //             this.taskfallYear = this.options1[i].year;
                        //             this.tasksemesterNum = this.options1[i].orderNum;
                        //             this.addsemesterNum = this.semesterNum = this.options1[i].orderNum;
                        //             this.addfallYear = this.fallYear = this.options1[i].year;
                        //         }
                        //     }else if((year==termYear)&&(month>8||month<2)){
                        //       if(this.options1[i].orderNum==2){
                        //             this.formYear = this.options1[i].name;
                        //             this.addYear = this.options1[i].name;
                        //             this.taskYear = this.options1[i].name;
                        //             this.taskfallYear = this.options1[i].year;
                        //             this.tasksemesterNum = this.options1[i].orderNum;
                        //             this.addsemesterNum = this.semesterNum = this.options1[i].orderNum;
                        //             this.addfallYear = this.fallYear = this.options1[i].year;
                        //         }
                        //     }
                        // }
                        self.pickerOptionsEnd.disabledDate = function (time) {
                            return time.getFullYear() > self.taskfallYear;
                        }

                        self.$nextTick(() => {
                            self.hackReset = true;
                        });
                        this.getTableList();
                    }else{
                        this.$message.error(data.msg);
                    }


                })
            }
		}
	}
</script>
<style scoped>
.boxStyle{
      padding-right: 10px;  
}
    .cm-btn-position{
        position: relative;
    }
</style>