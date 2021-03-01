<template>
	<div class="automatic-placement">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabs-box">
        	<el-tabs v-model="activeName">
				<el-tab-pane label="自动分班设置" name="first">
					<div class="cm-btn-con cm-fold">
			            <el-form :inline="true"  size="mini" :model="queryForm1">
			                <div class="fold">
			                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
			                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
			                          	<el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
			                        </el-form-item> -->
			                        <el-form-item label="年级">
										<intelligent-year-picker
											class="grade-input"
											v-model="queryForm1.classId"
											type="year"
											value-format="yyyy"
											placeholder="请选择年级">
										</intelligent-year-picker>
			                        </el-form-item>
			                        <el-form-item label="学期">
										<el-select v-model="queryForm1.semesterId" size="mini" placeholder="请选择学期"  style="width:100%;">
											<el-option label="全部" value=" "></el-option>
				                            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				                        </el-select>
			                        </el-form-item>
			                        <el-form-item label="专业名称">
										<el-select v-model="queryForm1.majorId" size="mini" clearable filterable>
					                        <el-option label="全部" value=""></el-option>
					                        <el-option v-for="item in majorList"  :key="item.index" :label="item.name" :value="item.id"></el-option>
					                    </el-select>
			                        </el-form-item>
				                    <el-form-item label="班级">
			                            <el-select v-model="queryForm1.classId" size="mini" clearable filterable>
			                                <el-option label="全部" value=""></el-option>
			                                <el-option v-for="item in courseList" :key="item.index" :label="item.name" :value="item.id"></el-option>
			                            </el-select>
			                        </el-form-item>
			                    </div>
		                        <div class="btn">
		                            <el-button type="primary" size="mini" @click="handleQuery1">查询</el-button>
		                        </div>
			                </div>
			            </el-form>
			        </div>
			        <div class="cm-btn-con">
			            <el-button size="medium" type="primary" @click="openAddClass">新增</el-button>
			        </div>
			        <div class="cm-table">
			            <el-table
		                    ref="multipleTable"
		                    :data="tableData"
		                    border
		                    size="mini"
		                    style="width: 100%"
		                    header-row-class-name="cm-dark">
			                <el-table-column label="序号" type="index" width="80"></el-table-column>
			                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :min-width="item.width"></el-table-column>
			                <el-table-column
		                        label="操作"
		                        fixed="right"
		                        width="200">
			                    <template slot-scope="scope">
			                        <el-button @click="editClass(scope.row)" type="text" size="small">编辑</el-button>
			                        <el-button @click="groupDetail(scope.row)" type="text" size="small">分组详情</el-button>
			                        <el-button @click="deleteTeacher(scope.row)" type="text" size="small">删除</el-button>
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
				</el-tab-pane>
				<el-tab-pane label="待分班数据" name="second">
					<div class="cm-btn-con cm-fold">
			            <el-form :inline="true" size="mini" :model="queryForm2">
			                <div class="fold">
			                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
			                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
			                          	<el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
			                        </el-form-item> -->
			                        <el-form-item label="年级">
										<intelligent-year-picker
											class="grade-input"
											v-model="queryForm2.classId"
											type="year"
											value-format="yyyy"
											placeholder="请选择年级">
										</intelligent-year-picker>
			                        </el-form-item>
			                        <el-form-item label="学期">
										<el-select v-model="queryForm2.semesterId" size="mini" placeholder="请选择学期"  style="width:100%;">
				                            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				                        </el-select>
			                        </el-form-item>
			                        <el-form-item label="专业名称">
										<el-select v-model="queryForm2.majorId" size="mini" clearable filterable>
					                        <el-option label="全部" value=""></el-option>
					                        <el-option v-for="item in majorList" :key="item.index" :label="item.name" :value="item.id"></el-option>
					                    </el-select>
			                        </el-form-item>
			                    </div>
		                        <div class="btn">
		                            <el-button type="primary" size="mini" @click="handleQuery1">查询</el-button>
		                        </div>
			                </div>
			            </el-form>
			        </div>
			        <div class="cm-table">
			            <el-table
		                    ref="hadClassTable"
		                    :data="tableData2"
		                    border
		                    size="mini"
		                    style="width: 100%"
		                    header-row-class-name="cm-dark">
			                <el-table-column label="序号" type="index" width="80"></el-table-column>
			                <el-table-column v-for="(item,index) in tableList2" :key='index' :prop="item.prop" :label="item.label" :min-width="item.width"></el-table-column>
			                <el-table-column
		                        label="操作"
		                        fixed="right"
		                        width="200">
			                    <template slot-scope="scope">
			                        <el-button @click="handleOpenDivideDetail(scope.row)" type="text" size="small">查看详情</el-button>
			                    </template>
			                </el-table-column>
			            </el-table>
			        </div>
				</el-tab-pane>
        	</el-tabs>
        </div>

        <!-- 自动分班设置新增/编辑弹窗 -->
        <el-dialog
        	:title="dialog.status === 'add'? '新增' : '编辑'"
        	:visible.sync="dialog.classesSetVisible"
        	:modal-append-to-body="false"
        	:close-on-click-modal="false"
        	custom-class="had-class-dialog"
        	width="800px">
			<el-form class="teacher-priority-form" :inline="true" :rules="rules" ref="setClassForm" :model="setClassForm" label-width="100px">
            	 <!-- class="flex-form" -->
            	<div class="clear inline-group">
            		<div class="left" style="width:50%">
            			<el-form-item label="年级">
						    <intelligent-year-picker
								class="grade-input"
								v-model="setClassForm.grade"
								type="year"
								value-format="yyyy"
								placeholder="请选择年级">
							</intelligent-year-picker>
						</el-form-item>
						<el-form-item label="教学模式" prop="teachingFormId">
						    <el-select v-model="setClassForm.teachingFormId" placeholder="分班数">
						    	<el-option label="普通教学" :value="1"></el-option>
							    <el-option label="全英教学" :value="2"></el-option>
						    </el-select>
						</el-form-item>
            		</div>
            		<div class="right" style="width:50%">
						<el-form-item label="学期" prop="semesterId">
							<el-select v-model="setClassForm.semesterId" placeholder="请输入学期">
								<el-option label="1" :value="1"></el-option>
							    <el-option label="2" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item class="fenban-item" label="分班数" prop="classNum">
						    <el-input v-model="setClassForm.classNum" maxlength="2" placeholder="请输入分班数"></el-input>
						</el-form-item>
            		</div>
            	</div>
				<div class="block">
					<el-form-item label="专业" style="display: block;">
						<el-select v-model="setClassForm.majorId" multiple placeholder="请输入专业" style="width: 100%;">
					        <el-option label="主授课老师" :value="1"></el-option>
					      	<el-option label="辅授课老师" :value="2"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="班级"  style="display: block;">
					    <el-select  v-model="setClassForm.classesId" multiple placeholder="请输入班级" style="width: 100%;">
					        <el-option label="主授课老师" :value="1"></el-option>
					      	<el-option label="辅授课老师" :value="2"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="排课课程"  style="display: block;">
					    <el-select v-model="setClassForm.teacherCourse" multiple placeholder="授课老师类型" style="width: 100%;">
					      	<el-option label="主授课老师" :value="1"></el-option>
					      	<el-option label="辅授课老师" :value="2"></el-option>
					    </el-select>
					</el-form-item>
				</div>
            </el-form>
            <div class="table-item">
            	<div class="clear">
            		<div class="btn-box"><el-button size="mini" :disabled="ctl.button" @click="addGroup">新增</el-button></div>
            		<div class="label-txt left">每班分组数</div>
	            	<div class="table-box left">
	            		<el-table
	            			:data="groupTableData"
		            		size="mini"
		            		border>
		            		<el-table-column align="center" label="授课形式" prop="teachingFormName">
		            			<template slot-scope="scope">
		            				<el-input size="mini" v-model="scope.row.teachingFormName" v-if="scope.row.editing"></el-input>
									<span v-if="!scope.row.editing">{{scope.row.teachingFormName}}</span>
		            			</template>
		            		</el-table-column>
		            		<el-table-column align="center" label="每班分组数" prop="groupNum">
		            			<template slot-scope="scope">
		            				<el-input size="mini" v-model.number="scope.row.groupNum" v-if="scope.row.editing"></el-input>
									<span v-if="!scope.row.editing">{{scope.row.groupNum}}</span>
		            			</template>
		            		</el-table-column>
		            		<el-table-column align="center" label="操作">
		            			<template slot-scope="scope">
		            				<el-button type="text" size="small" v-if="scope.row.editing" @click="saveGroupItem(scope.row, scope.$index)">保存</el-button>
		            				<el-button type="text" size="small" v-if="scope.row.editing" @click="handleCancel(scope.row, scope.$index)">取消</el-button>

		            				<el-button type="text" size="small"  v-if="!scope.row.editing" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
		            				<el-button type="text" size="small"  v-if="!scope.row.editing" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
		            			</template>
		            		</el-table-column>
		            	</el-table>
	            	</div>
            	</div>
            </div>
        	<span slot="footer" class="dialog-footer">
        		<el-button @click="dialog.classesSetVisible = false">取 消</el-button>
        		<el-button type="primary" @click="ensureSetClass('setClassForm')">确定</el-button>
        	</span>
        </el-dialog>

        <!-- 已创建上课班弹窗 -->
        <el-dialog
        	title="已创建上课班"
        	:visible.sync="dialog.hadClassVisible"
        	:modal-append-to-body="false"
        	:close-on-click-modal="false"
        	custom-class="had-class-dialog"
        	width="1000px">
			<div class="cm-table" style="margin: 0 -20px;">
				<el-table
					:data="hadClassTableData"
					size="mini"
					border
					header-row-class-name="cm-dark">
					<el-table-column type="index" label="序号"></el-table-column>
					<el-table-column v-for="(item, index) in hadClassTableList" :key="index" :label="item.label" :prop="item.prop" :width="item.width"></el-table-column>
				</el-table>
			</div>
        	<span slot="footer" class="dialog-footer">
        		<el-button @click="dialog.hadClassVisible = false">取 消</el-button>
        	</span>
        </el-dialog>
	</div>
</template>
<script>
	import util from '@/util'
	const REMARK = '自动创建上课班';
	export default {
	    name: 'automatic_placement',
	    data() {
	        return {
	        	breadcrumb: [
	                {label: "教学管理"},
	                {label: "自动排课", path:`/educational_admin/course_content?actionId=${this.$route.query.actionId}`},
	                {label: REMARK},
	            ],
                fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
	            activeName: 'first',
	            queryForm1: {
	            	grade: '',
	            	classId: '',
	            	semesterId: '',
	            	majorId: ''
	            },
	            termList: [],
	            majorList: [],
	            courseList: [],
	            pageNo: 1,
	            pageSize: 10,
	            totalCount: 0,
	            tableList: [
	            	{label:'年级', prop:'grade'},
		            {label:'学期', prop:'semester'},
		            {label:'专业', prop:'majorName'},
		            {label: '班级', prop:'class'},
		            {label:'教学模式', prop:'teachingModel'},
		            {label:'分班数', prop:'classNum'},
		            {label:'分班总人数', prop:'totalPeople'},
		            {label:'排课课程', prop:'arrangeCourse'},
		            {label:'创建人', prop:'creator'},
		            {label:'创建日期', prop:'createdTime'}
	            ],
	            tableData: [
	            	{grade: '2018级', semester: '2018-2019学年第一学期', majorName: '全部', class: '护理1班', teachingModel: '普通教学', classNum: '2', totalPeople: 100, arrangeCourse: '大学英语、体育', creator: '张三', createdTime: '2018/01/03'},
	            	{grade: '2018级', semester: '2018-2019学年第一学期', majorName: '全部', class: '护理1班、护理2班', teachingModel: '普通教学', classNum: '2', totalPeople: 100, arrangeCourse: '影像医学', creator: '张三', createdTime: '2018/01/03'}
	            ],
	            queryForm2: {
	            	grade: '',
	            	semesterId: '',
	            	majorId: ''
	            },
	            tableList2: [
	            	{label:'年级', prop:'grade'},
		            {label:'学期', prop:'semester'},
		            {label:'专业', prop:'majorName'},
		            {label:'总学生数', prop:'totalPeople'},
		            {label:'已分班学生数', prop:'hadClassStudentNum'},
		            {label:'排课课程', prop:'arrangeCourse'}
	            ],
	            tableData2: [
	            	{grade: '2018级', semester: '2018-2019学年第一学期', majorName: '全部', totalPeople: 100, hadClassStudentNum: '80', arrangeCourse: '影像医学'},
	            	{grade: '2018级', semester: '2018-2019学年第一学期', majorName: '全部', totalPeople: 100, hadClassStudentNum: '70', arrangeCourse: '影像医学'}
	            ],
	            hadClassTableList:[
	            	{label: '年级', prop:'grade'},
	            	{label: '学期', prop:'semesterName', width: 155},
	            	{label: '专业', prop:'majorName'},
	            	{label: '班级', prop:'class'},
	            	{label: '排课课程', prop:'course'},
	            	{label: '教学模式', prop:'teachingModel'},
	            	{label: '分班数', prop:'divideClassNum'},
	            	{label: '分班总人数', prop:'divideTotalStudent'}
	            ],
	            hadClassTableData: [
	            	{grade:'2018', semesterName:'2018-2019学年第一学期', majorName:'护理', class: '护理3班', course:'影像医学', teachingModel: '普通教学', divideClassNum: '3', divideTotalStudent:'100'},
	            	{grade:'2018', semesterName:'2018-2019学年第一学期', majorName:'护理', class: '护理3班', course:'影像医学', teachingModel: '全英教学', divideClassNum: '3', divideTotalStudent:'100'}
	            ],
	            dialog:{
	            	status: 'add',
	            	classesSetVisible: false,
	            	hadClassVisible: false
	            },
	            setClassForm: {
	            	grade: '',
	            	semesterId: '',
	            	teachingFormId: '',
	            	classNum: '',
	            	classesId: [],
	            	majorId: [],
	            	teacherCourse: []
	            },
	            rules: {
	            	semesterId: [
	            		{ required: true, message: '请选择学期', trigger: 'change' },
	            	],
	            	classNum: [
	            		{ required: true, message: '请输入分班数', trigger: 'change' },
	            	],
	            	teachingFormId: [
	            		{ required: true, message: '请选择教学模式', trigger: 'change' },
	            	]
	            },
	            groupTableData:[
	            	{teachingFormName: '理论', groupNum: 2}
	            ],
	            editObj: null,
	            ctl:{
	            	button: false
	            }
	        };
	    },
	    created (){
	    	this.getMajorList();
	    	this.getTermData();
	    },
	    mounted(){
	    	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
	    },
	    methods: {
	    	collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
	        handleQuery1 (){

	        },
	        openAddClass (){
	        	this.dialog.classesSetVisible = true;
	        },
	        currentChange (val){
	        	this.pageNo = 1;
	        	// query
	        },
	        sizeChange (val){
	        	this.pageNo = 1;
	        	this.pageSize = val;
	        	// query
	        },
	        // 添加新表格行
	        addGroup (){
	        	let editItem = {
	            	id: '',
	            	teachingFormName: '',
	            	groupNum: '',
	            	editing: true
	            }

	            this.ctl.button = true;
	        	this.groupTableData.unshift(editItem);
	        },
	        // 打开编辑弹窗
	        editClass (row){
	        	this.dialog.status = 'edit';
	        	this.dialog.classesSetVisible = true;
	        },
	        groupDetail (row){

	        },
	        deleteTeacher (row){
	        	this.$confirm(`确定删除当前数据吗？`, `提示`, {
	        		confirmButtonText: '确定',
	        		cancelButtonText:'取消',
	        		type: 'warning'
	        	}).then(() => {
	        		// delelte code
	        	}).catch(() => {
	        		this.$message({
			            type: 'info',
			            message: '已取消删除'
			        }); 
	        	})
	        },
	        // (弹窗)保存编辑
	        saveGroupItem (row, index){
	        	if (row.teachingFormName === '' || row.groupNum === '') {
	        		this.$message.error('新增保存不能为空');
	        		return false;
	        	}
	        	this.editObj = null;
	        	delete row.editing;
	        	this.ctl.button = false;
	        	this.$set(this.groupTableData, index, row);
	        },
	        /**
	         * [handleCancel 弹窗内编辑表格]
	         * 取消有二种情况 ：
	         * 1、如果是新增的 则直接删除；
	         * 2、如果是原有的 则要取消编辑并保存原来的数据
	         */
	        handleCancel (row, index){
	        	this.ctl.button = false;
	        	if (this.editObj) {
	        		this.$set(this.groupTableData, index, this.editObj);
	        		this.groupTableData[index].editing = false;
	        		this.editObj = null;
	        	} else {
	        		this.groupTableData.shift();
	        	}
	        },
	        // 新增/编辑弹窗编辑表格行
	        handleEdit (row, index){
	        	if (this.ctl.button) {
	        		this.$message.warning('只能同时编辑一条');
	        		return ;
	        	}
	        	this.ctl.button = true;
	        	row.editing = true;
	        	this.editObj = {...row};
	        	this.$set(this.groupTableData, index, row);
	        },
	        // （弹窗）删除
	        handleDelete (row, index){
	        	this.groupTableData.splice(index, 1);
	        },
	        // （弹窗）确定提交
	        ensureSetClass (formName){
	        	this.$refs[formName].validate((valid) => {
	        		if (valid) {
	        			this.$http.post('/api').then(data => {
	        				// res code
	        				// this.dialog.classesSetVisible = false;
	        			})
	        		} else {
	        			return false;
	        		}
	        	})
	        	this.dialog.classesSetVisible = false;
	        },
	        handleOpenDivideDetail (row){
	        	this.dialog.hadClassVisible = true;
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
            getTermData(query){
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.termList = data.data.reverse();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            }
	    }
	};
</script>

<style lang="less" scoped>
	.automatic-placement{
		.tabs-box{
			/deep/ .el-tabs__header{
				margin:20px 30px 0 20px;
			}
			.grade-input{
				width: 130px;
				// /deep/ .el-input__inner{
				// 	width: 130px;
				// }
			}
		}
		.had-class-dialog{
			/deep/ .el-table{
				text-align: center;
				th{
					background-color: #f7f7f7;
				}
				td{
					text-align: center;
				}
			}
			.inline-group{
				.el-form-item{

				}
			}
			.block{
				.el-form-item{
					/deep/ .el-form-item__content{
						width: 86%;
					}
				}
			}
			.btn-box{
				margin:10px 0;
				padding-right: 15px;
				text-align: right;
			}
			.label-txt{
				width:88px;
				padding-right: 12px;
				text-align: right;
			}
			.table-box{
				width: 85%;
				/deep/ .el-table{
					th{
						text-align: center;
						background-color: #f7f7f7;
					}
					.cell{
						display:inline-block;
					}
				}
			}
			.fenban-item{
				/deep/ .el-input__inner{
					width: 217px;
				}
			}
		}
	}
	
</style>