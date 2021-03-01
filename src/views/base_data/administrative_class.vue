<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="选择年级">
                        	<intelligent-year-picker
                        		@change="onGradeSearchChange"
                        		v-model="enrollmentYear" 
                        		type="year" 
                        		value-format="yyyy" 
                        		placeholder="请选择">  </intelligent-year-picker>
                        </el-form-item>
						<el-form-item label="专业">
							<el-select v-model="major">
								<el-option v-for="majorItem in majorList" :label="majorItem.name" :value="majorItem.id" :key="majorItem.id"></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="老师">
							<el-select v-model="teacher" filterable :remote-method="remoteMethod" remote clearable reserve-keyword>
								<el-option v-for="teacher in searchTeacherList"  :label="teacher.name" :value="teacher.id" :key="teacher.id"></el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="老师">
							<el-select 
							v-model="teacher"
							filterable
							remote
							clearable
							:loading="loading"
							:remote-method="remoteMethod"
							reserve-keyword>
								<el-option v-for="teacher in searchTeacherList"  :label="teacher.name" :value="teacher.id" :key="teacher.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary"  @click="searchData">查询</el-button>
						</el-form-item>
                        <!-- <el-form-item v-if="btnPerObj.add">
                        	<el-button type="primary" size="mini" @click="addBtn">新增</el-button>
                        	<el-button type="primary" size="mini" @click="exportExc">导出</el-button>
						              <a v-show="false" ref="exportExcel"></a>
                        </el-form-item> -->
                    </div>
                </div>
            </el-form>
			<div v-if="btnPerObj.add" style="margin-bottom: 10px;">
				<el-button type="primary" size="mini" @click="addBtn">新增</el-button>
                <el-button type="primary" size="mini" @click="exportExc">导出</el-button>
				 <a v-show="false" ref="exportExcel"></a>
			</div>
        </div>
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
					size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号"></el-table-column>

                <el-table-column prop="num" label="班级代码"></el-table-column>
                <el-table-column prop="name" label="行政班名"></el-table-column>
                <el-table-column prop="male_qty" width="100" label="男生数"></el-table-column>
                <el-table-column prop="female_qty" width="100" label="女生数"></el-table-column>
                <el-table-column width="100" label="总学生数">
					<template slot-scope="scope">
						{{scope.row.male_qty + scope.row.female_qty}}
					</template>
				</el-table-column>
                <el-table-column prop="grade" label="所在级"></el-table-column>
                <el-table-column prop="majorName" label="所属专业"></el-table-column>
				<el-table-column prop="bzr" label="班主任"></el-table-column>
				<el-table-column prop="fdy" label="辅导员"></el-table-column>
                <el-table-column label="状态">
                	<template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
                </el-table-column>

                <el-table-column label="操作" width="240" v-if="btnPerObj.setting||btnPerObj.classStu||btnPerObj.edit||btnPerObj.del">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small" @click="setTeacher(scope.row.id)" v-if="btnPerObj.setting">设置班/辅</el-button> -->
						<el-button type="text" size="small" @click="setTeacher(scope.row.id, 'bzr')" v-if="btnPerObj.setting">班主任</el-button>
						<el-button type="text" size="small" @click="setTeacher(scope.row.id, 'fdy')" v-if="btnPerObj.setting">辅导员</el-button>

                        <el-button type="text" size="small" @click="classStu(scope.row.id)" v-if="btnPerObj.classStu">班级学生</el-button>
                        <el-button type="text" size="small" @click="editClasss(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteClass(scope.row.id,scope.row.name)" style="color: red;" v-if="btnPerObj.del">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
		<el-dialog 
        	:title="dialogStatu=='add'?'新增行政班':'编辑行政班'" 
        	:visible.sync="dialogFormVisible"  
        	append-to-body 
        	:close-on-click-modal="false"
        	width="400px">
        	
        	<el-form :model="formDialog" :rules="formDialogRules" ref="formDialog" label-width="100px" class="demo-ruleForm">
				<el-form-item label="所在级">
                    <intelligent-year-picker
                    	style="width: 100%;"
                		v-model="formDialog.grade" 
						@change="changeGrade"
                		type="year" 
                		value-format="yyyy" 
                		placeholder="请选择">  
                	</intelligent-year-picker>
				</el-form-item>
				<el-form-item label="所在专业" prop="specialty">
                    <el-select style="width:  100%;"   @change="changeMajor" v-model="formDialog.specialty"   value-key="id"  placeholder="请选择">
					    <el-option
					      v-for="item in majorList"
					      :key="item.id"
					      :label="item.name"
					      :value="item">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级名称" prop="name">
                    <el-input placeholder="请输入班级名称" v-model="formDialog.name"></el-input>
				</el-form-item>
				<!-- <el-form-item label="班级代码" prop="num">
                    <el-input placeholder="请输入班级代码" v-model="formDialog.num"></el-input>
				</el-form-item> -->
				<el-form-item label="班级代码" >  
                    <el-input placeholder="请输入班级代码" v-model="formDialog.num"></el-input>
				</el-form-item>
				<el-form-item label="状态" v-if="dialogStatu!=='add'">
					<el-radio v-model="formDialog.status" label="1">启用</el-radio>
 					<el-radio v-model="formDialog.status" label="0">禁用</el-radio>
				</el-form-item>
        	</el-form>
        	
        	<span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible= false">取 消</el-button>
                <el-button type="primary" @click="sureBtn('formDialog')">确 定</el-button>
            </span>
        	
		</el-dialog>


		<el-dialog 
        	title="班级学生" 
        	:visible.sync="dialogStu"  
        	append-to-body 
        	:close-on-click-modal="false"
        	width="50%">
        	
        	<el-table
                ref="multipleTable"
                :data="tableStu"
                border
				size="mini"
				
			   :row-style="{ height: '15px' }"

                style="width: 100%"
                header-row-class-name="cm-dark">
	            <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
	
	            <el-table-column prop="name" label="姓名"></el-table-column>
	            <el-table-column prop="stuNum" label="学号"></el-table-column>
	            <el-table-column prop="mobile" label="手机号"></el-table-column>
	        
	        </el-table>
        	<div class="dialog-page">
	            <!-- <el-pagination
                    background
                    :current-page="stuPage.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="stuPage.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="stuPage.total"
                    @size-change="sizeChangeStu"
                    @current-change="currentChangeStu">
	            </el-pagination> -->
	        </div>
		</el-dialog>

		<el-dialog 
        	title="设置班主任/辅导员" 
        	:visible.sync="dialogTeacher"  
        	append-to-body 
        	:close-on-click-modal="false"
        	width="500px">
        	
        	<el-form label-width="100px" class="demo-ruleForm">
				<el-form-item label="班主任">
					<el-button style="width: 100%;overflow-x: auto;" @click="showTeacher(listTeacher,0)">
						{{listTeacher.length!=0 ? '':'去设置'}}
						<template v-for="item in listTeacher">{{item.teacherName}} &nbsp;</template>
					</el-button>
				</el-form-item>
				<el-form-item label="辅导员">
					<el-button style="width: 100%;overflow-x: auto;" @click="showInstructor(listAssistant,1)">
						{{listAssistant.length!=0 ? '':'去设置'}}
						<template v-for="item in listAssistant">{{item.teacherName}} &nbsp;</template>
					</el-button>
				</el-form-item>
        	</el-form>
		</el-dialog>
		
		 <el-dialog 
		 			:title="dialogselectedStatus=='tea'?'设置班主任':'设置辅导员'"
                    :visible.sync="dialogSelected"
                    width="89%"
                    ref="detailDialog"
                   
                    append-to-body
                    :close-on-click-modal="false"
                    @closed="reloadinfo"
                    custom-class="cm-dialog-pad">
    
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="已授权人员" name="first">
                <teachersauthorized ref="teachersauthorized" :classId="classId" :teacherType="teacherType" :dialogSelected="dialogSelected"></teachersauthorized>
                </el-tab-pane>
                <el-tab-pane label="新增授权" name="second">
                <teachersUnauthorized ref="teachersUnauthorized" :classId="classId" :teacherType="teacherType" :dialogSelected="dialogSelected"></teachersUnauthorized>
                </el-tab-pane>
            </el-tabs>
        
        </el-dialog>
		<!-- <el-dialog  
			:title="dialogselectedStatus=='tea'?'设置班主任':'设置辅导员'"
            :visible.sync="dialogSelected"
            width="80%"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            custom-class="cm-dialog-pad cm-rang-width">
            <div style="min-height: 500px;">
            	
	            <el-tabs v-model="activeName" @tab-click="handleTabClick">
	                <el-tab-pane :label=" '已设置人员('+isAuthNum+ ')' " name="0"> 
	                	<el-table 
	                      	:data="listSelected"
	                      	border
	                      	style="width: 100%;"
	                      	header-row-class-name="cm-dark" 
	                      	element-loading-text="加载中……"
	                      	element-loading-background="rgba(255, 255, 255, 0.8)">
			                <el-table-column type="index" label="序号"  width="50"></el-table-column>
			                <el-table-column label="姓名" prop="teacherName"></el-table-column>
			                <el-table-column label="工号" prop="teacherNo"></el-table-column>
			                <el-table-column label="部门职务" prop="cnName"></el-table-column>
			                <el-table-column
			                    fixed="right"
			                    label="操作"
			                    width="120">
			                    <template slot-scope="scope">
			                        <el-button type="text" size="small" @click="cancelFn(scope.row.id)">删除人员 </el-button>
			                    </template>
			                </el-table-column>
			
			            </el-table>
			            
	                </el-tab-pane>
	                <el-tab-pane label="新增授权" name="1">
	                	
			            <div class="top-search">
			            	<el-input
							    placeholder="请输入姓名搜索"
							    v-model="managerName">
							    <i slot="suffix" class="el-input__icon el-icon-search" @click=""></i>
							</el-input>
			            	<el-button v-if="activeName== 1 " type="primary" size="small" @click="addListFn(addList)" :disabled="addList.length==0">批量加入({{addnum}})人</el-button>
			            </div>
			            
			            <div class="manager-box">
			            	<div class="left-content" v-show="activeName==1 ">
			            		<el-input
								  placeholder="输入部门进行筛选"
								  v-model="departmentText">
								</el-input>
								
								<el-tree
			                        class="filter-tree"
			                        :default-expanded-keys="defaultkeys"
			                        :data="departmentTree"
			                        :props="defaultProps"
			                        :filter-node-method="filterNode"
			                        :expand-on-click-node="false"
			                        @node-click="handleNodeClick"
			                        highlight-current 
			                        node-key="id"
			                        ref="tree">
								</el-tree>
			            	</div>
			            	<div class="right-content-change">
				                <el-table 
			                      	:data="teacherList"
			                     	@selection-change="handleSelectionChange"
			                      	border
			                      	style="width: 100%;"
			                      	header-row-class-name="cm-dark" 
			                      	element-loading-text="加载中……"
			                      	element-loading-background="rgba(255, 255, 255, 0.8)">
			                      
					                <el-table-column type="selection" width="50"></el-table-column>
					                <el-table-column label="姓名" prop="name"></el-table-column>
					                <el-table-column label="工号" prop="teacherNo"></el-table-column>
					                <el-table-column label="部门职务" prop="cnName"></el-table-column>
					                <el-table-column
					                    fixed="right"
					                    label="操作"
					                    width="120">
					                    <template slot-scope="scope">
					                        <el-button type="text" size="small" @click="addListFn([scope.row])">添加人员</el-button>
					                    </template>
					                </el-table-column>
					
					            </el-table>
					            <div class="bottom-content">
					                <el-pagination
					                    background
					                    :current-page="teacherPage.current"
					                    :page-sizes="[10, 20, 50, 100]"
					                    :page-size="teacherPage.size"
					                    layout="total, sizes, prev, pager, next, jumper"
					                    :total="teacherPage.total"
					                    @size-change="sizeChangeTeacher"
					                    @current-change="currentChangeTeacher">
					                </el-pagination>
					            </div>
			            	</div>
			            </div>
	                	
	                </el-tab-pane>
	            </el-tabs>
	            
            </div>
        </el-dialog> -->
		

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
	import {mapState} from 'vuex'
	 import teachersauthorized from '@/views/base_data/components/teachersauthorized';
    import teachersUnauthorized from '@/views/base_data/components/teachersUnauthorized';
    export default {
        name: "administrative_class",
        data() {
            return {
				pageNo:1,
				pageSize:20,
				total:1,
				classId:'',
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "班级类"},
                    {label: "行政班管理"},
                ],
				enrollmentYear: '',
				major: '',
				teacher: '',
				searchTeacherList: [],
                tableData: [],
                tablePage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
                dialogStatu:'add',
                dialogFormVisible:false,
				options: '',
				loading: false,
	            formDialog: {//弹框参数
	                id:'',
	                grade: '',
	                name: '',
	                num: null,
	                specialty: {},
	                status: 1
	            },
                formDialogRules: {
                	specialty:[{ required: true, message: '请选择所在专业', trigger: 'change' }],
                	name:[
                	 	{required: true, message: '请输入班级名称', trigger: 'blur' },
            			{max: 40, message: '长度少于40 个字符', trigger: 'blur' }
                	],
                	num:[
                		{required: true, message: '请输入班级代码', trigger: 'blur' },
            			{max: 20, message: '长度少于20 个字符', trigger: 'blur' }
                	]
                },
	            
	            majorList:[],//专业列表
                
                
                stuPage: {
                    current: 1,
                    size: 1000,
                    total:0,
                },
                dialogStu:false,
                tableStu:[],
                dialogTeacher:false,
                listTeacher:[],//班主任
                listAssistant:[],//辅导员
                
                listSelected:[],//已选人员
                dialogSelected:false,
                dialogselectedStatus:'tea',//tea班主任，ass辅导员
                activeName:"first",
                isAuthNum:'',
                managerName:'',//姓名搜索
		        addnum:0,//批量设置人数
		   
				teacherType:'',//老师类型
				
		        departmentText:'',//部门名字
                departmentTree:[],//部门树
                defaultkeys:[],//默认展示二级
                defaultProps: {
		          children: 'children',
		          label: 'name',
		        },
		        departmentId:'',
		        teacherList:[],//教师列表
		        teacherPage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
		        addList:[],//批量加入列表 
				btnPerObj:{//按钮权限
					add:false,
					setting:false,
					classStu:false,
					edit:false,
					del:false
				}
		        
            }
		},
		  components: {
            teachersauthorized,
            teachersUnauthorized
        },

        computed:{
			
        	...mapState(['btnPermitList']),
        },
	    watch: {
	      departmentText(val) {
	        this.$refs.tree.filter(val);
	      }
	    },
        mounted(){
        	
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
			// this.getTeacherData()
        	this.getTableData();
        	this.getMajorList();
	        this.getDepartmentTree();
        },
        methods: {
			exportExc(){
				let query = {
					pageNo: '',
					pageSize:'',
					param: {
							grade:this.enrollmentYear
						}
				}
				this.$http2.post('_op:administrative/class/export/classList',query).then(data=>{
						let url = window.URL.createObjectURL(new Blob([data]));
						let y = this.$refs.exportExcel;
						y.href = url;
						y.setAttribute("download", "行政班.xls");
						y.click();
						window.URL.revokeObjectURL(url);
				})
			},
			onGradeSearchChange(val) {
				this.pageNo = 1;
				// this.getTableData();
			},
			changeGrade(){
				// if(this.formDialog.specialtyId ==""){
				// 	this.formDialog.specialtyId.name==""
				// }
				this.formDialog.name=this.formDialog.grade
			},
			changeMajor(){
					if(this.formDialog.specialty.name==undefined){
					this.formDialog.specialty.name==""
				}
				this.formDialog.name=this.formDialog.grade+this.formDialog.specialty.name
			},
			// 模糊查找老师
			remoteMethod(query) {
				if(query !== "") {
					this.loading = true;
					this.$http.post('_ed:/exchangecourse/query/teacher/', {
						str: query
					}).then( res =>{
						if(res.code == 0){
							this.searchTeacherList = res.data;
							this.loading = false;
						}
					}) 
				}
			},
			reloadinfo(){
                this.dialogSelected = false
            },
			    handleSizeChange(val) {
              this.pageSize = val
              this.getTableData()
            
            },
            handleCurrentChange(val) {
                this.pageNo = val
                this.getTableData()
            
            },
				  //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
					if (item.code=="add_xingzhengbanguanli") {
					self.btnPerObj.add=true;
	            	}
	            	if (item.code=="setting_manage_xingzhengbanguanli") {
	            		self.btnPerObj.setting=true;
	            	}
	            	if (item.code=="class_stu_xingzhengbanguanli") {
	            		self.btnPerObj.classStu=true;
	            	}
	            	if (item.code=="edit_xingzhengbanguanli") {
	            		self.btnPerObj.edit=true;
	            	}
	            	if (item.code=="del_xingzhengbanguanli") {
	            		self.btnPerObj.del=true;
	            	}
                    });
                }).catch(()=>{
                })
            },

        	
            getMajorList(){//专业列表
        		this.$http.get("_op:major/combox").then(data=>{
                	this.majorList=data.data;
                }).catch(()=>{
                })
            },
            getTableData(){
				let query = {
					pageNo: this.pageNo,
					pageSize:this.pageSize,
					param: {
							grade:this.enrollmentYear
						}
				}
				this.$http.post("_op:administrative/class/new/list/",query).then(data=>{
					
					this.tableData=data.result;
					 this.total = data.totalCount;
				
					 this.pageSize= data.pageSize;
					}).catch(()=>{
				})

            },
            sizeChange(size){
                this.tablePage.current=1;
                this.tablePage.size=size;
                this.getTableData();
            },
            currentChange(current){
                this.tablePage.current=current;
                this.getTableData();
            },
            
            addBtn(){//新增行政班
            	this.dialogStatu='add';
            	this.dialogFormVisible=true;
            },
            sureBtn(formDialog){
            	this.$refs[formDialog].validate((valid) => {//表单校验
			        if (valid) {
			        	if (this.dialogStatu=='add') { //新增
							
			        		this.$http.post("_op:administrative/class",{
				        		grade:this.formDialog.grade,
				        		name:this.formDialog.name,
				        		num:this.formDialog.num,
				        		specialtyId:this.formDialog.specialty.id
				        	}).then(data=>{
									if(data.code==0){
									this.$message({
									message: this.formDialog.name+'新增成功',
									type: 'success'
									});
								}else{
									this.$message.error(data.msg)
								}
								this.formDialog.grade = ''
								this.$refs[formDialog].resetFields();
	        					this.getTableData();
	        					this.dialogFormVisible=false;
			                }).catch(()=>{
			                })
			        	} else{
			        		this.$http.put("_op:administrative/class",{ //编辑
				        		grade:this.formDialog.grade.substring(0,4),
				        		name:this.formDialog.name,
				        		num:this.formDialog.num,
				        		specialtyId:this.formDialog.specialty.id,
				        		status:this.formDialog.status,
				        		id:this.formDialog.id
				        	}).then(data=>{
								if(data.code==0){
									this.$message({
									message: this.formDialog.name+'编辑成功',
									type: 'success'
									});
								}else{
									this.$message.error(data.msg)
								}
									this.formDialog.grade = ''
								this.$refs[formDialog].resetFields();
	        					this.getTableData();
	        					this.dialogFormVisible=false;
			                }).catch(()=>{
			                })
			        	}
			        	
			        	
			        } else {
			            ('error submit!!');
			            return false;
			        }
		        });
            },
            
            deleteClass(id,name){//删除班级
            	this.$confirm('确认删除'+name+'?').then(_ => {
		            this.$http.delete("_op:administrative/class/"+id).then(data=>{
		            	if(data.code==0){
		            		this.getTableData();
							this.$message({
					          message: name+'删除成功',
					          type: 'success'
					        });
		            	}else{
		            		this.$message.error(data.msg)
		            	}
						
	                }).catch(()=>{
	                })
		        }).catch(()=> {
		        });
			},
			// 获取老师列表
			// getTeacherData() {
			// 	let param = {
			// 		str: ''
			// 	}
			// 	this.$http.post('_ed:exchangecourse/query/teacher', param).then(res => {
			// 		if(res.code == 0) {
			// 			this.searchTeacherList = res.data
			// 		}else{
			// 			this.$message.error(res.msg)
			// 		}
					
			// 	})
			// },
			searchData() {
				let query = {
					pageNo: this.pageNo,
					pageSize:this.pageSize,
					param: {
						grade:this.enrollmentYear,
						majorId:  this.major,
						teacherId: this.teacher
					}
				}
				this.$http.post("_op:administrative/class/new/list/",query).then(data=>{
					
					this.tableData=data.result;
					 this.total = data.totalCount;
				
					 this.pageSize= data.pageSize;
					}).catch(()=>{
				})
			},
            editClasss(row){//编辑班级
	            this.formDialog.id=row.id;
	            this.formDialog.grade=row.grade+'-01-01';
	            this.formDialog.name=row.name;
	            this.formDialog.num=row.num.toString();
	            this.formDialog.specialty=this.majorList.filter(x => x.id == row.specialtyId)[0];
	            this.formDialog.status=row.status.toString();
            	this.dialogStatu='edit';
            	this.dialogFormVisible=true;
            },
			classStu(id){//行政班学生
				let self = this;
				self.classId = id;
				// debugger
            	this.$http.get("_op:/students/list/"+self.classId+"/"+this.stuPage.current+"/"+this.stuPage.size).then(data=>{
				
            		this.tableStu=data.data.records;
            		this.stuPage.total=data.data.total;
					this.dialogStu=true;
                }).catch(()=>{
                })
            },
            sizeChangeStu(size){
				let self = this;
                self.stuPage.current=1;
                self.stuPage.size=size;
                self.classStu(self.classId);
            },
            currentChangeStu(current){
				let self = this;
				self.stuPage.current = current;
                self.classStu(self.classId);
            },
            setTeacher(id, val){//设置班辅
            	this.classId=id;
				if (val == 'bzr') {
					this.showTeacher(this.listTeacher, 0)
				}else{
					this.showInstructor(this.listAssistant,1)
				}
                
                // this.dialogTeacher=true;
            },
            getTeacherList(id,type){//获取已选择的班主任/辅导员
            	this.$http.get("_op:teacher/administrative/class/teacher/list/"+id+"/"+type).then(data=>{
            		if(type==0){
            			this.listTeacher=data.data;
            		}else{
            			this.listAssistant=data.data;
            		}
            		this.listSelected=data.data;
            		this.isAuthNum=data.data.length;
                }).catch(()=>{
                })
            },
			showTeacher(list,type){//班主任

				this.teacherType=0;
				this.dialogselectedStatus = 'tea'
            	this.listSelected=list;
            	this.isAuthNum=list.length;
            	this.activeName='first';
            	this.dialogSelected=true;
			},
			showInstructor(list,type){//辅导员的
				this.dialogselectedStatus='Instructor'
				this.teacherType=1;
            	this.listSelected=list;
            	this.isAuthNum=list.length;
            	this.activeName='first';
            	this.dialogSelected=true;
			},
            getDepartmentTree(){//责任人列表
            	this.$http.get("_op:/admin/department/tree/1").then(data=>{
            		this.departmentId=data.data.id;
            		this.departmentTree.push(data.data);
                    this.departmentTree.map((item,i)=>{
                        this.defaultkeys.push(i+1);
                    })
                }).catch(()=>{
                })
            },
            handleTabClick(){//active
            	if (this.activeName=='0') {
            		this.getTeacherList(this.classId,this.teacherType)
            	} else{
            		this.getManager();
            	}
            },
            getManager(){//获得部门人员
            	let self=this;
            	this.$http.post("_op:/teachers/filter/page",{
            		pageNo:this.teacherPage.current,
            		pageSize:this.teacherPage.size,
            		param:{
            			deptId:this.departmentId
            		}
            	}).then(data=>{
                 
                    this.teacherPage.total=data.data.totalCount; //总条数
            		this.teacherPage.current=data.data.pageNo; //当前页数
            		this.teacherList=[];
            		data.data.result.map(item1=>{
            			let isItem=false;
            			self.listSelected.map(item2=>{
            				if(item1.teacherNo==item2.teacherNo){
                                this.teacherPage.total--; //新增
            					isItem=true; 
            				}
            			})
            			if(!isItem){
            				self.teacherList.push(item1);
            			}
            		})
                }).catch(()=>{
                })
            },
            sizeChangeTeacher(size){
                this.teacherPage.current=1;
                this.teacherPage.size=size;
                this.getManager();
            },
            currentChangeTeacher(current){
                this.teacherPage.current=current;
                this.getManager();
            },
            filterNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
		    }, 
		    handleNodeClick(data) {//点击部门
		        this.departmentId=data.id;
		        this.getManager();
		    },
            handleSelectionChange(list){//批量选择
            	this.addnum=list.length;
            	this.addList=list;
            },
            addListFn(list){
            	let teacherList=[];
            	list.map(item=>{
            		teacherList.push(item.id);
            	})
            	this.$http.post("_op:/teacher/administrative/class",{
            		classId:this.classId,
            		teacherList:teacherList,
            		type:this.teacherType
            	}).then(data=>{
            		this.$message({
			          message: '添加成功',
			          type: 'success'
			        });
			        this.getTeacherList(this.classId,this.teacherType)
			        this.getManager();
                }).catch(()=>{
                })
            },
            cancelFn(id){//取消人员
            	this.$http.delete("_op:/teacher/administrative/class/"+id).then(data=>{
            		this.$message({
			          message: '删除成功',
			          type: 'success'
			        });
            		this.getTeacherList(this.classId,this.teacherType)
                }).catch(()=>{
                })
            }
            
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
.pull-right{
  text-align: right;
  margin-right: 10px;
}

.dialog-page{
	text-align: right;
	margin-top: 20px;
}
.top-search{
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	.el-input{
		width: 300px;
	}
}
.manager-box{
	display: flex;
	padding-bottom: 20px;
	.left-content{
		width: 20%;
		min-width: 200px;
        max-height: 700px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		margin-right: 2%;
        overflow: auto;
	}
	.right-content{
		width: 100%;
	}
	.right-content-change{
		width: 78%;
	}
	.bottom-content{
		text-align: right;
		margin-top: 20px;
	}
}
</style>