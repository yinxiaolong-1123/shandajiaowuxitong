<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formDetail">
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
                                @change="onYear"
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                          <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="formDetail.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select v-model="formDetail.majorId"
                             filterable
                             @change="onMajor"
                             placeholder="全部">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程">
                            <el-select v-model="formDetail.courseId" value-key="id" :disabled="formDetail.majorId==0" filterable placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask" v-if="btnPerObj.add">新增例外</el-button>
            <el-button size="mini" type="primary" @click="setEnable" v-if="btnPerObj.able">设置启用</el-button>
            <el-button size="mini" type="primary" @click="setFailure" v-if="btnPerObj.unable">设置失效</el-button>
            <el-button size="mini" @click="batchDelet" v-if="btnPerObj.delBatch">批量删除</el-button>
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
                    @selection-change="onSelectionChange"
                    header-row-class-name="cm-dark">
                <el-table-column type="selection" width="50" fixed></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='状态'">
                            <template v-if="scope.row.status==0">
                                <span>创建</span>
                            </template>
                            <template v-else-if="scope.row.status==1">
                                <span>启用</span>
                            </template>
                            <template v-else-if="scope.row.status==2">
                                <span>失效</span>
                            </template>
                        </template>
                        <template v-else-if="item.prop=='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                        v-if="btnPerObj.edit||btnPerObj.delete"
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="editException(scope.row)" type="text" size="small" v-if="btnPerObj.edit">编辑</el-button>
                        <el-button @click="delTableRows(scope.$index,scope.row)" type="text" size="small" style="color: red;" v-if="btnPerObj.delete">删除</el-button>

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
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增、编辑例外数据 -->
        <el-dialog
             class="pm-margin"
          :title="dialog.status==='add'?'新增例外数据':'编辑例外数据'"
          :visible.sync="dialog.exception"
           :modal-append-to-body="false"
           :close-on-click-modal="false"
           @closed="dialogClose"
           custom-class="cm-dialog-small">
            <el-form ref="addForm" :rules="rules" :model="addForm">
            	<el-form-item label="学期" class="flex-form">
                    <el-select 
                        style="width: 100%;"
                        v-model="addYear"
                        clearable
                        filterable
                        remote
                        @change="onAddYear"
                        :remote-method="getTermData" 
                        :disabled="dialog.status=='edit'?true:false"
                        placeholder="全部">
                        <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="所在级" prop="grade" class="flex-form">
				    <el-select 
                        style="width: 100%;"
                        v-model="addForm.grade" 
                        placeholder="请选择所在级" 
                        :disabled="dialog.status=='edit'?true:false">
					       <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="专业" filterable prop="majorId" class="flex-form">
				    <el-select
                     v-model="addForm.majorId"
                     style="width: 100%;"
                     @change="onSeachMajor"
                     :disabled="dialog.status=='edit' || addForm.grade == ''?true:false" 
                     placeholder="请选择专业">
			           <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="教学任务" filterable prop="courseId" class="flex-form">
				    <el-select v-model="addForm.courseId" placeholder="请选择教学任务" 
                    :disabled="dialog.status=='edit' || addForm.majorId == ''?true:false" style="width: 100%;">
				      <el-option v-for="list in taskList" :key="list.id" :label="list.course_name" :value="list.id"></el-option>
				    </el-select>
				</el-form-item>
                <el-form-item label="授课形式" filterable prop="teachId" class="flex-form">
                    <el-select v-model="addForm.teachId" placeholder="请选择授课形式" 
                        @change="onSelectionDurg" style="width: 100%;"
                        :disabled="dialog.status=='edit'?true:false">
                         <el-option v-for="list in teachList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学时" prop="hours" class="flex-form">
                    <el-input v-model="addForm.hours" maxlength="4" placeholder="请输入学时"></el-input>
                </el-form-item>
                <el-form-item v-if="dialog.status!=='add'" label="已提交学时" prop="submitHoues" class="flex-form">
                    <el-input v-model="addForm.submitHoues" :disabled="dialog.status=='edit'?true:false"></el-input>
                </el-form-item>
            </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogClose">取 消</el-button>
	            <el-button type="primary" @click="addException('addForm')">确 定</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
    const TYPE='exception-data';
    const REMARK='例外数据管理';
    const regNum = /^[1-9]\d*$/;

    import {mapState} from 'vuex';

	export default {
        name:TYPE,
		data(){
         
                var validateTime = (rule, value, callback) => {

                    if (!value) {
                        callback(new Error("输入不能为空"));
                        return;
                    }
                    if (value.length>4){
                        callback(new Error("课时不能超过4位数字")); 
                    }else if(!regNum.test(value)){
                        callback(new Error("课时只能输入4位的整数"));
                    }else {
                        callback();
                    }
                };
			return {
                  value5: '',
				breadcrumb: [
                    {label: "教学管理"},
                    {label: REMARK},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	exception:false
                },
                formYear:'',
                addYear:"",
                formDetail: {
                    grade:"",
                    majorId: 0,
                    courseId:{id:"",name:""}
                },
                addForm:{
		            grade:'',
                    majorId:'',
                    courseId:'',
                    teachId:'',
                    hours:'',
                    submitHoues:''
		        },
                rules:{
                    grade:[{required: true, message: '请选择所在级', trigger: 'change'}],
                    majorId:[{required: true, message: '请选择专业', trigger: 'change'}],
                    // courseId:[{required: true, message: '请选择教学任务', trigger: 'change'}],
                    teachId:[{required: true, message: '请选择授课形式', trigger: 'change'}],
                    hours:[{required: true, message: '请输入学时', trigger: 'blur'},
                    { validator: validateTime, trigger:  "change"}]
                },
                tableList:[
                    {label:'学期', prop:'semester_name',width:200},
		            {label:'所在级', prop:'grade'},
		            {label:'专业', prop:'major',width:200},
		            {label:'课程名称', prop:'course_name',width:300},
		            {label:'授课形式', prop:'teaching_form',width:100},
		            {label:'学时', prop:'total_hours'},
		            {label:'剩余可用学时', prop:'surplus_hours'},
		            {label:'状态', prop:'date'},
		            {label:'创建人', prop:'create_username',width:100},
                    {label:'创建日期', prop:'create_time',width:120}
		        ],
                gradeList:[
                	{label:"2014",value:"2014"},
                	{label:"2015",value:"2015"},
                	{label:"2016",value:"2016"},
                	{label:"2017",value:"2017"},
                	{label:"2018",value:"2018"},
                    {label:"2019",value:"2019"},
                	{label:"2020",value:"2020"},
                	{label:"2021",value:"2021"},
                	{label:"2022",value:"2022"},
                	{label:"2023",value:"2023"}
                ],
                tableLoading:false,
                myDate:new Date(),
                tableData:[],
                teachList:[],
                options1:[],
                majorList:[],
                courseList:[],
                taskList:[],
                onSelectionVal:[],
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
                  add:false,
                  able:false,
                  unable:false,
                  delBatch:false,
                  edit:false,
                  delete:false
                }
			}
		},
        created(){
            this.getTermData();
            this.getMajorList();
            this.getTeachType();
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
             //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                       if (item.code=="query_liwaishuju") {  //查询
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="add_liwaishuju") {  //新增例外
                        self.btnPerObj.add=true;
                        }
                        if (item.code=="setting_able") {  //设置启用
                        self.btnPerObj.able=true;
                        }
                        if (item.code=="setting_unable") {  //设置失效
                        self.btnPerObj.unable=true;
                        }
                        if (item.code=="del_batch_liwaishuju") {  //批量删除
                        self.btnPerObj.delBatch=true;
                        }
                        if (item.code=="edit_liwaishuju") {  //编辑
                        self.btnPerObj.edit=true;
                        }
                        if (item.code=="del_liwaishuju") {  //删除
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
            onYear(val){
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum
                        }
                    }
                }else{
                    this.fallYear = 0;
                    this.semesterNum = 0;
                }
            },
            onMajor(val){
                if(val){
                    this.formDetail.courseId = {};
                    this.getCourseList(val);
                }
            },
            onAddYear(value){
                if(value){
                    for(let list of this.options1){
                        if(list.id==value){
                            this.addfallYear = list.year;
                            this.addsemesterNum = list.orderNum
                        }
                    }
                }
            },
            onSeachMajor(val){
                if(val){
                    this.getTeachtaskData(val);
                }
            },
			onSearch(){
                this.getTableList();
			},
            addTask(){
                this.dialog.status='add';
                this.dialog.exception = true;
            },
            dialogClose(){
                this.dialog.exception = false;
                this.$refs.addForm.resetFields();
            },
            editException(row){
                this.rowId = row.id;
                this.dialog.status='edit';
                this.dialog.exception = true;
                this.addYear = row.semester_name;
                this.addForm.grade = row.grade;
                this.addForm.majorId = row.major;
                this.addForm.courseId = row.course_name;
                this.addForm.teachId = row.teaching_form;
                this.addForm.hours = row.surplus_hours;
                this.addForm.submitHoues = row.submitted_hours;
            },
            onSelectionDurg(id){
                for(let item of this.teachList){
                    if(item.id==id){
                        this.categoryId = item.categoryId;
                    }
                }
            },
            addException(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addRequire();
                    } else {
                        return false;
                    }
                });
            },
            addRequire(){
                let url;
                let option={};
                if(this.dialog.status=='add'){
                    url = "_ed:/teachexception/add";
                    option = {
                        task_id:this.addForm.courseId,
                        total_hours:this.addForm.hours,
                        // create_user:this.userId,
                        create_username:this.userName,
                        exception_type:this.addForm.teachId,
                        class_hour_category:this.categoryId
                    };
                }else{
                    url = "_ed:/teachexception/edit";
                    option = {
                        id:this.rowId,
                        total_hours:this.addForm.hours
                    }
                }
                this.$http(
                    {
                        method:"post",
                        url:url,
                        data:{
                            ...option
                        },
                    }
                ).then(data=>{
                    let message=(this.dialog.status==='add'?'新增':'编辑')+'成功！';
                    let type='success';
                    if(Number(data.code)===0){
                        this.dialog.exception=false;
                        this.getTableList();
                    }else{
                        message=data.msg;
                        type='error'
                    }
                    this.$message({
                        type,
                        message,
                        showClose:true,
                    });
                })
            },
            onSelectionChange(val){
                this.onSelectionVal = val;
            },
            setEnable(){
                let idlist = [];
                for(let item of this.onSelectionVal){
                    idlist.push(item.id);
                };
                if(this.onSelectionVal.length>0){
                    this.$confirm(`你将设置例外数据为启用状态，请确认！`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.post("_ed:/teachexception/active",{
                            idlist:idlist
                        }).then(data=>{
                                let message='设置成功!';
                                let type='success';
                                if(Number(data.code)===0){
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
                            message: '已取消设置'
                        });
                    });
                }else{
                    this.$message('请先选择要设置启动');
                }
            },
            setFailure(){
                let idlist = [];
                for(let item of this.onSelectionVal){
                    idlist.push(item.id);
                };
                if(this.onSelectionVal.length>0){
                    this.$alert('你将设置例外数据为失效状态，请确认！<br/><br/>注意事项：<br/>1、失效状态后，例外学时不再填报<br/>2、失效状态后，已填报的数据不受影响', '提示', 
                        {
                            dangerouslyUseHTMLString: true,
                            showCancelButton:true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(() => {
                            this.$http.post("_ed:/teachexception/disable",{
                                idlist:idlist
                            }).then(data=>{
                                    let message='设置成功!';
                                    let type='success';
                                    if(Number(data.code)===0){
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
                                message: '已取消设置'
                        });
                    });
                }else{
                    this.$message("请选择需要设置失效的数据！");
                }
            },
            onSelectionFun(){
                this.idlist = [];
                this.major =[];
                for(let item of this.onSelectionVal){
                    this.idlist.push(item.id);
                    this.major.push(item.major);
                };
            },
            batchDelet(){
                this.onSelectionFun();
                if(this.onSelectionVal.length>0){
                    this.$confirm(`此操作将永久删除“${this.major}”所维护的数据, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.post("_ed:/teachexception/delete",{
                            idlist:this.idlist
                        }).then(data=>{
                            let type='success';
                            let message='删除成功!';
                            if(data.code==0){
                                if(data.data){
                                    type = "error"
                                    message = data.msg+"："+data.data;
                                }
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
                }else{
                    this.$message.warning("请勾选批量删除的数据！");
                }
            },
			sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableList();
			},
			currentChange(current){
                this.pageNo=current;
                this.getTableList();
			},
			delTableRows(index,row){
				let idlist = [];
                idlist.push(row.id);
                this.$confirm('您确定删除“'+row.course_name+row.teaching_form+'”的例外数据吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                    this.$http.post("_ed:/teachexception/delete",{
                        idlist:idlist
                    }).then(data=>{
                        let type = "success";
                        let message = "删除成功";
                        if(data.code==0){
                            if(data.data){
                                type = "error";
                                if(data.data.length>0){
                                  message=data.data[0];	
                                }else{
                                  message=message; //添加逻辑判断
                                }    
                            }
                            if(this.tableData.length==1){
                                this.pageNo = 1;
                            }
                            this.getTableList();
                        }else{
                            type="error";
                            message=data.msg;
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
            getTableList(){
                this.tableLoading = true;
                let option = {
                        course_name:this.formDetail.courseId.name,
                        grade:this.formDetail.grade,
                        major_id:this.formDetail.majorId,
                        course_platform_id:this.formDetail.courseId.id,
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum,
                        request_page:this.pageNo,
                        page_size:this.pageSize,
                    }
                this.$http({
                    method:'post',
                    url:"_ed:teachexception/query",
                    data:{
                        ...option
                    },
                }).then(data=>{
                    if(data.code==0){
                        this.tableLoading = false;
                        this.pageNo= data.data.total_pages;
                        this.totalCount=data.data.total_records;
                        this.tableData = data.data.dataList;
                        for(let item of this.tableData){
                            this.$set(item,'surplus_hours',item.total_hours - item.submitted_hours);
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                }).catch((error)=>{
                    this.tableLoading = false;
                })
            },
            getTeachtaskData(major){
                this.$http.post("_ed:/teachtask/courselist",{
                    grade:this.addForm.grade,
                    major_id:major,
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
            getTeachType(){
                this.$http.get("_op:/teaching/form/combox")
                .then(data=>{
                    if(data.code==0){
                        this.teachList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getCourseList(val){
                this.courseList = [];
                this.$http.get("_op:/coursePlatform/combox/"+val)
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
                    query = "学期"
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                              for(let i=0;i<this.options1.length;i++){
                                if(this.options1[i].stage==1){
                                    this.formYear=this.options1[i].id
                                    // this.addForm = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear =this.options1[i].year;
                                    break
                                }else{
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        // this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                }
                            }
                     
                        
                       
                        this.getTableList();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            }

		}
	}
</script>
<style >
      .pm-margin /deep/.el-dialog__body{
        padding: 10px 40px;
    }   


</style>