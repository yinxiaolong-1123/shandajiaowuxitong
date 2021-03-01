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
                    <div ref="formDetail" class="detail">
                        <el-form-item class="cm-collapse">
                            <el-button type="primary" @click="addGroup">新增</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-input v-model="row.semester_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-input v-model="row.course_namelist" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="上课班">
                            <el-input v-model="row.name" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                  
                    
                     <el-form-item class="cm-collapse">
                            <el-button type="primary" @click="onAutoGroup">分配学生</el-button>
                        </el-form-item>

                          <div class="btn">
                        <el-button size="mini" @click="onClosed">关 闭</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    :row-style="{height:0+'px'}"
                    :cell-style="{padding:0+'px'}"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" width="80"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <template v-if="item.prop=='student_number'">
                            <span style="color: #66b1ff;">{{ scope.row.student_number}}</span>
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
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="editGroup(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="associateStudents(scope.row)" type="text" size="small">关联学生</el-button>
                        <el-button @click="delTableRow(scope.row)" type="text" size="small">删除</el-button>
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
        <!-- 新增分组 -->
        <el-dialog
            class="pm-margin"
           width="800px;"
           :title="dialog.status==='add'?'新增分组':'编辑分组'"
           :visible.sync="dialog.visible"
           @closed="dialogClose"
           :close-on-click-modal="false"
           :modal-append-to-body="false">
            <el-form ref="addForm" :model="addForm"  :rules="rules" label-position="left">
            	<el-form-item label="排课课程" class="flex-form">
				    <el-input v-model="row.course_namelist" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="授课形式" prop="teaching_form" class="flex-form" >
				    <el-select v-model="addForm.teaching_form" value-key="id" :disabled="dialog.status==='edit' ? true : false" placeholder="请选择授课形式" @change="getteachingFormName" style="width: 100%;">
				      <el-option v-for="item in teachList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				    </el-select>
				</el-form-item>
                <el-row type="flex">
                    <el-col :span="12">
                        <el-form-item label="总组数" prop="group_number" :disabled="dialog.status==='edit' ? true : false" class="flex-form">
                            <el-input v-model="addForm.group" :disabled="dialog.status==='edit' ? true : false" placeholder="请输入总组数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="dialog.status==='edit'" label="组号" class="flex-form">
                            <el-input v-model="addForm.num" :disabled="dialog.status==='edit' ? true : false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="dialog.status==='edit'" label="分组名" class="flex-form">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <div v-if="dialog.status==='edit'">
                    <el-form-item>
                        <span>和其他班的小组一起上课，则本分组不需要单独维护课表，请选择关联上课班、上课组</span>
                    </el-form-item>
                    <el-form-item label="关联上课班" class="flex-form">
                        <el-select style="width: 100%" value-key="id" filterable clearable v-model="associatedClass" @change="fetchGroups">
                            <el-option v-for="c in classes" :value="c" :label="c.name" :key="c.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联上课组" class="flex-form">
                        <el-select style="width: 100%" value-key="id" filterable clearable v-model="associatedGroup" @change="changeassociatedGroup">
                            <el-option v-for="g in groups" :value="g" :label="g.name" :key="g.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联课程" class="flex-form">
                        <el-select style="width: 100%" value-key="semesterCourseId" filterable clearable v-model="coursecls">
                            <el-option v-for="g in courseclsList" :value="g" :label="g.semesterCourseName" :key="g.semesterCourseId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" " class="flex-form">
                        <span>只能选择其他班当前授课形式独立上课的分组</span>
                    </el-form-item>
                </div>
                <el-checkbox v-if="dialog.status=='add'" v-model="checked">按照分组数分配学生</el-checkbox>
            </el-form>
            <div class="tips" v-if="dialog.status=='add'">
	            <p class="tips-title">学生自动分配原则：</p>
	            <p>1、上课班已维护学生（勾选按照组分数分组学生时，会校验上课班是否维护学生）</p>
				<p>	2、上课班的学生数/组数获取小数1位（小数位直接获取，不进行四舍五入） </p>
				    <p>A、小数位&lt;5 ,按照组数，进行余数减一，最后一组按照总数-已分配人数：例如21人/5组,每组人数：4,4,4,4,5</p>
				    <p>B、小数位数≥5，进行隔组加一，减一方法，最后一组按照总数-已分配人数：例如24人/5组，每组人数：5,4,5,4,4</p>
				    <p> C、小数位=0，直接平均分配</p>
            </div>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogClose">取 消</el-button>
	            <el-button type="primary" @click="confirmAddClass">确 定</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
	const TYPE='group-management';
    const REMARK='分组管理';
	export default {
        name:TYPE,
		data(){
            var validateGroup = (rule, value, callback) => {
                if (!value) {
                    callback(new Error("输入不能为空"));
                    return;
                }
                var aaa=/^[0-9]\d*$/
            if(!aaa.test(value)){
                    callback(new Error("课时只能输入4位的整数"));
                }else {
                    callback();
                }
            };
           
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "上课班管理",path:'/teaching_management/class_management'},
                    {label: REMARK},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                courseclsList:[],
                coursecls:'',
                tableLoading: false,
                classes: [], // 上课班
                associatedClass: {}, // 已选上课班
                groups: [], // 上课组
                associatedGroup: {},
                row:{
                	semester_name:"",
                	name:""
                },
                addForm:{
                	courseId:"",
                	teaching_form:"",
                	group:1,
                	num:"",
                    name:""
                },
                formInline: {},
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
		            {label:'授课形式', prop:'teaching_formname'},
		            {label:'总组数', prop:'total_group'},
                    {label:'组号', prop:'group_number'},
                    {label:'组名', prop:'group_name'},
                    // {label:'分组数', prop:'group_number'},
		            {label:'学生数', prop:'student_number'},
		            {label:'创建人', prop:'create_username'},
		            {label:'创建日期', prop:'create_time'}
		        ],
                tableData:[],
                gridData:[
                	{date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
                ],
                gridList:[
                	{label:'创建人', prop:'name',width:100},
                	{label:'创建日期', prop:'date',width:120},
                	{label:'备注内容', prop:'code',},
                ],
                dateOption:[
                	{label:"全部",value:"全部"},
                	{label:"2014",value:"2014"},
                	{label:"2015",value:"2015"},
                	{label:"2016",value:"2016"},
                	{label:"2017",value:"2017"},
                	{label:"2018",value:"2018"},
                	{label:"2020",value:"2020"},
                	{label:"2021",value:"2021"},
                	{label:"2022",value:"2022"},
                	{label:"2023",value:"2023"}
                ],
                row:"",
                teachList:[],
                checked:true,
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
                rules: {
                     teaching_form: [
                        { required: true, message: '请选择授课形式', trigger:['blur','change' ] }
                    ],
                     group: [
                          { required: true, message: '请输入分数组', trigger: 'blur' },
                          { validator: validateGroup, trigger: ['change' ] }
                    ]
                  
               }
			}
		},
        created(){
            this.row = JSON.parse(this.$route.query.row);
            this.getTableList();
            this.getTeachType();
        },
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};

	    },
        filters:{
            getTime(time){
                return util.getTime(time);
            }
        },
		methods:{
            changeassociatedGroup(val){
                if(!val.id){
                    this.coursecls = ' '
                    this.associatedClass = ' '
                    return;
                }
            },
            // 获取上课组
            fetchGroups(val) {
                
                if (!val.id) {
                    this.groups.splice(0)
                    this.associatedGroup = {};
                    this.coursecls = ' '
                    return;
                }
                this.$http.get(`_ed:/coursecls/group/cls/${val.id}/teachingform/${this.addForm.teaching_form}/without`)
                .then(resp => {
                    if (resp.code == 0) {
                        this.groups = resp.data;
                    }
                }).catch(err => {
                    this.$message.error("获取{}上课组失败", val.name);
                })
                this.$http.get('_ed:/coursecls/getCourseById/'+val.id).then(res=>{
                    
                    this.courseclsList = res.data
                })
            },
            // 获取上课班列表
            fetchClasses(callback) {
                this.$http.post(`_ed:/coursecls/query`,{
                    page_size: 10000,
                    request_page: 1
                }).then(resp => {
                    if (resp.data.dataList) {
                        this.classes = resp.data.dataList;
                    }
                    if (typeof(callback) === 'function') {
                        callback();
                    }
                }).catch(err => {
                    this.$message.error("获取上课班数据失败，请联系管理员");
                    if (typeof(callback) === 'function') {
                        callback();
                    }
                })
            },
            // 自动分组
            onAutoGroup(){
                   
                    if(this.row.id){
                         var loading = this.$loading({
                            lock: true,
                            text: "分组中...",
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                         });
                         this.$http.get("_ed:coursecls/assignStudent/"+this.row.id).then(data=>{
                             if (data.code == 0) {
                                 this.$message.success('分组成功');
                                 this.getTableList();
                             } else {
                                 this.$message.error(data.data);
                             }
                             loading.close();
                            //  this.tableList=data.data.result;
                         })
                    }
            },
            getGroupList(){
			

			},
            getteachingFormName (val){
                this.teachList.map(item => {
                    if (item.id === val) {
                        this.addForm.teaching_formname = item.name;
                    }
                })
            },
			onClosed(){
                this.$router.go(-1);
			},
			sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableList();
			},
			currentChange(current){
				this.pageNo = current;
                this.getTableList();
			},
            dialogClose(){
                this.dialog.visible = false;
                this.$refs.addForm.resetFields();
            },
			addGroup(){
                this.checked = true;
                this.dialog.status='add';
                this.addForm.group=""
				this.dialog.visible = true;
			},
			editGroup(row){
                const loading = this.$loading({
                    lock: true,
                    text: "数据准备中...",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                if(row.semesterCourseId){
                    this.coursecls = {semesterCourseId: row.semesterCourseId};
                }else{
                    this.coursecls = {};
                }
                
                this.fetchClasses(() => {
                    loading.close();
                    this.editId = row.id;

                    this.addForm.teaching_form = row.teaching_form;
                    this.addForm.name = row.group_name;
                    this.addForm.num = row.group_number;
                    this.addForm.group = row.total_group;
                     let self = this
                    if (row.rel_cls_id) {
                       
                        self.associatedClass = {id: row.rel_cls_id};
                        
                    } else {
                        self.associatedClass = {};
                        self.associatedGroup = {};
                        self.coursecls = {};
                    }
                    if (this.associatedClass.id) {
                        this.fetchGroups(this.associatedClass);
                        this.$nextTick(() => {
                            if (row.rel_group_id) {
                                
                                self.associatedGroup = {id: row.rel_group_id};
                            } else {
                                self.associatedGroup = {};
                            }
                            if(row.semesterCourseId){
                                self.coursecls =  {semesterCourseId: row.semesterCourseId};
                            }else{
                                self.coursecls = {}
                            }
                        })
                    }
                    
                    this.dialog.status='edit';
                    this.dialog.visible = true;
                });
			},
            confirmAddClass(){
              
                if(this.associatedClass.id&&this.associatedClass.id!=''&&this.associatedGroup.id==undefined){
                    
                    this.$message.error('请选择上课组')
                    return
                }
                 if(this.associatedClass.id&&(this.coursecls.semesterCourseId==''||this.coursecls.semesterCourseId==undefined)){
                    
                    this.$message.error('请关联课程')
                    return
                }
                if (this.dialog.status=='add'){
                    this.$refs.addForm.validate((valid) => {
                        if (valid) {
                            
                            if(this.checked){
                                this.checkedStatus = 1;
                            }else{
                                this.checkedStatus = 0;
                            }
                        }
                   });
                }
                
                this.addOrEditRequire();
            },
            addOrEditRequire(){
                
                  this.$refs.addForm.validate((valid) => {
                        if (valid) {
                            let url;
                let option = {};
                if(this.dialog.status=="add"){
                    url = "_ed:/coursecls/group/add";
                    option = {
                        cls_id:this.row.id,
                        teaching_form:this.addForm.teaching_form,
                        teaching_formname:this.addForm.teaching_formname,
                        total_group:this.addForm.group,
                        auto_grouping:this.checkedStatus,
                        // create_user:this.userId,
                        create_username:this.userName
                      
                    }
                }else{
                    url = "_ed:/coursecls/group/edit";
                    option = {
                        id:this.editId,
                        name:this.addForm.name,
                        relativeClassId: this.associatedClass.id,
                        relativeGroupId: this.associatedGroup.id,
                        semesterCourseId:this.coursecls.semesterCourseId
                    }
                }
                this.$http({
                    method:"post",
                    url:url,
                    data:{
                        ...option
                    }
                }).then(data=>{
                    let type = "success";
                    let message = `${this.dialog.status=='add'? '新增' : '编辑'}成功！`;
                    if(data.code==0){
                        this.checked = false;
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
                    this.coursecls = {};
                })
                           
                        }
                   });

                
            },
			associateStudents(row){
                this.row.group_id = row.id;
                this.row.teaching_form = row.teaching_form;
                this.row.teaching_formname = row.teaching_formname;
                this.row.group_num = row.name;
                this.row.group_number = row.group_number;
                this.row.group_name = row.group_name;
				this.$router.push({path:"/teaching_management/group_students",query:{row:JSON.stringify(this.row)}});
			},
			delTableRow(row){
               
				this.$confirm( `此操作将永久删除“${row.group_name}”所维护的信息, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$http.delete("_ed:/coursecls/group/delete/"+row.id)
                    .then(data=>{
                        let type = "success";
                        let message = "删除成功！"
                        if(data.code==0){
                            if(this.tableData.length==1){
                                this.pageNo = 1;
                            }
                            this.getTableList();
                        }else{
                            type = "error";
                            let arr = data.msg.split("，"); //修改删除截取掉ID
                            let msg = (arr[0]+'，'+arr[1]);
                            message = msg;
                           
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
                this.$http.post("_ed:/coursecls/group/query",{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    param:{
                        cls_id:this.row.id
                    }
                }).then(data=>{
                    if(data.code==0){
                        // this.totalCount = data.data.total_records;
                        this.totalCount = data.data.totalCount;
                        // this.tableData = data.data.dataList;
                        this.tableData = data.data.result;
                    }else{
                        this.$message.error(data.msg);
                    }
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
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
            }

		}
	}
</script>
<style scoped>
    .cm-fold {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        background-color: #f7f7f7;
    }
	.cm-fold-bg {
		background-color: #f7f7f7;
	}
	.cm-btn-others {
		padding: 0 20px 10px;
	}
	.tips p {
		font-size: 13px;
    	line-height: 20px;
        text-indent:1em;
	}
	.tips .tips-title{
        margin-top: 20px;
		font-size: 14px;
		padding: 8px;
	}
    .pm-margin /deep/.el-dialog__body{
        padding: 10px 40px;
    }
    

    .flex-form /deep/.el-form--label-left .el-form-item__label{
        text-align: right;
   }
    .flex-form /deep/.el-form-item__label{
        text-align: right;
    }
</style>