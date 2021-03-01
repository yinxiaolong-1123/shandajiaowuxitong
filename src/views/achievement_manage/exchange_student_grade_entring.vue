<template>
	<div class="exchange-student-grade-entring-box">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-btn-con cm-fold">
            <el-form :inline="true" size="mini" :model="queryForm">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select  v-model="queryForm.majorId" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in majorList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="grade-item" label="所在级">
	                        <intelligent-year-picker
	                            type="year"
	                            v-model="queryForm.grade" 
	                            value-format="yyyy"
	                            placeholder="请选择年级">
	                        </intelligent-year-picker>
	                    </el-form-item>
	                    <el-form-item class="student-name-item" label="学号">
							<el-input size="mini" v-model="queryForm.stuNum" placeholder="请输入学号"></el-input>
	                    </el-form-item>
	                    <el-form-item class="student-name-item" label="姓名">
							<el-input size="mini" v-model="queryForm.stuName" placeholder="请输入姓名"></el-input>
	                    </el-form-item>
                        <el-form-item class="status-item" label="状态">
                            <el-select  v-model="queryForm.status" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已发布" :value="true"></el-option>
                                <el-option label="待发布" :value="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con">
			<el-button size="medium" type="primary" @click="openDialog">新增</el-button>
        </div>
        <div class="cm-table">
			 <el-table
                ref="multipleTable"
                :data="tableData"
                border
                size="mini"
                v-loading="tableLoading"
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="学号" prop="stuNum"></el-table-column>
                <el-table-column label="姓名" prop="stuName"></el-table-column>
                <el-table-column label="专业" prop="majorName"></el-table-column>
                <el-table-column label="年级" prop="grade"></el-table-column>
                <el-table-column label="状态" prop="status">
                	<template slot-scope="scope">
                		<template v-if="scope.row.status === true">
                			已发布
                		</template>
                		<template v-else>
                			待发布
                		</template>
                	</template>
                </el-table-column>
                <el-table-column label="创建人" prop="creator"></el-table-column>
                <el-table-column label="创建日期" prop="createTime"></el-table-column>
                <el-table-column prop="createTime">
                	<template slot-scope="scope">
                		<el-button size="medium" type="text" @click="handleEditItem(scope.row)">编辑</el-button>
                		<el-button size="medium" v-if="!scope.row.status" type="text" @click="handlePublic(scope.row)">发布</el-button>
                		<el-button size="medium" type="text" @click="handleDelete(scope.row)">删除</el-button>
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

        <el-dialog
        	title="新增成绩认定"
            :visible.sync="dialog.visible"
            :modal-append-to-body="false"
            width="1100px"
            custom-class="exchange-grade-entring-dialog"
            @close="dialogClose">

            <el-form class="teacher-priority-form" :inline="true" :rules="rules" ref="affirmForm" :model="affirmForm" label-width="121px">
				<el-form-item class="input-item" label="学号" prop="stuNum">
					<el-input v-model="affirmForm.stuNum" placeholder="请输入学号"  @keyup.native="keyupHandle"><i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="stuName">
					<el-input v-model="affirmForm.stuName" disabled placeholder="请输入学号"></el-input>
				</el-form-item>
				<el-form-item label="年级" prop="grade">
					<el-input v-model="affirmForm.grade" disabled placeholder="请输入学号"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="majorId">
					<!-- <el-input v-model="affirmForm.grade" disabled placeholder="请输入学号"></el-input> -->
					<el-select v-model="affirmForm.majorId" disabled>
						<el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
            	
	            <div class="affirm-wrapper">
	                <div class="affirm-header clear">
	                    <el-button class="right" size="mini" :disabled="ctrl['button1']" @click="addItem('affirmTableList', 'affirmForm', 'button1')">新增</el-button>
	                    <span>成绩认定</span>
	                </div>
	                <div class="affirm-list cm-table">
	                    <el-table
	                        :data="affirmForm.list"
	                        border
	                        size="mini"
	                        style="width: 100%"
	                        header-row-class-name="cm-dark">
	                        <el-table-column type="index" label="序号"></el-table-column>
	                        <el-table-column v-for="(column, index) in affirmTableList" :key="index" :prop="column.prop" :label="column.label" :width="column.width">
	                            <template slot-scope="scope">
	                                <template v-if="scope.row.editing">
	                                    <el-select size="mini" v-if="column.formType === 'select'" v-model="scope.row[column.selectIdProp]" @change="changeName($event, 'affirmTableList', 'affirmForm', scope.$index, column.selectListProp, column.prop)">
	                                        <el-option v-for="item in column.selectListProp"
	                                            :key="item.id || item.courseId"
	                                            :label="item.name || item.courseName"
	                                            :value="item.id || item.courseId">
	                                        </el-option>
	                                    </el-select>
	                                    <el-input size="mini" v-model="scope.row[column.prop]" v-if="column.formType === 'input'" placeholder=""></el-input>
	                                </template>
	                                <template v-else>
	                                    {{scope.row[column.prop]}}
	                                </template>
	                            </template>
	                        </el-table-column>
	                        <el-table-column label="操作">
	                            <template slot-scope="scope">
	                                <template v-if="scope.row.editing">
	                                    <el-button size="mini" type="text" @click="handleSaveItem('affirmTableList', 'affirmForm', scope.row, scope.$index, 'button1')">保存</el-button>
	                                    <el-button size="mini" type="text" @click="handleCancel('affirmTableList', 'affirmForm', scope.row, scope.$index, 'button1')">取消</el-button>
	                                </template>
	                                <template v-else>
	                                    <el-button size="mini" type="text" @click="handleEdit('affirmTableList', 'affirmForm', scope.row, scope.$index, 'button1')">编辑</el-button>
	                                    <el-button size="mini" type="text" @click="openDeleteDialog('affirmTableList', 'affirmForm', scope.row, scope.$index)">删除</el-button>
	                                </template>
	                            </template>
	                        </el-table-column>
	                    </el-table>
	                </div>
	            </div>
				<el-form-item label="上传附件" prop="fileUrl">
					<el-input v-model="affirmForm.fileUrl" style="display: none;"></el-input>
		            <el-upload
		                class="upload-demo"
		                action="operation/data/admin/uploadFile"
		                :headers="headers"
		                :file-list="fileList"
		                :on-success="handleUploadSuccess"
		                :on-preview="handlePreview">
		                <el-button size="small" type="primary">点击上传</el-button>
		                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
		            </el-upload>
		        </el-form-item>
				<!-- <span>* 上传附件</span> -->
	        
	        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="handlePublishCourse">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="testdialog"
            width="500px"
            :modal-append-to-body="false">
            <p><i class="el-icon-info" style="color:#e6a23c;"></i> 当前操作将会直接删除该认定课程，确定继续？</p>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="testdialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="handleDeleteAffirmCourse">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	import util from '@/util'
	export default {
	    name: 'exchange_student_grade_entring',
	    data() {
	        return {
	        	breadcrumb: [
	                {label: "成绩管理"},
	                {label: "交换生成绩认定"}
	            ],
	            fold:{
		            state: false,
		            text: '展开',
		            showBtn: false,
		        },
		        queryForm: {
		        	majorId: '',
		        	grade: '',
		        	stuNum: '',
		        	stuName: '',
		        	status: ''
		        },
		        majorList: [],
		        tableLoading: false,
		        pageNo: 1,
		        pageSize: 10,
		        totalCount: 0,
		        tableData: [
		        	{id: 1, stuNum: 2013001, stuName: '张局', majorId: 22, majorName: '临床医学', grade: 2016, status: false, creator: 'superadmin', createTime: '2019-01-02', list: []},
		        	{id: 2, stuNum: 2013002, stuName: '张三', majorId: 22, majorName: '临床医学', grade: 2016, status: true, creator: 'superadmin', createTime: '2019-01-02', list: []}
		        ],
		        dialog: {
		        	visible: false
		        },
		        affirmForm: {
		        	stuNum: '',
		        	stuName: '',
		        	grade: '',
		        	majorId: '',
		        	fileUrl: '',
		        	list:[]
		        },
		        queryLoading: false,
		        rules: {
		        	stuNum: [
		        		{required: true, message: '请输入学号', trigger: 'blur'}
		        	],
		        	fileUrl: [
		        		{required: true, message: '请上传附件', trigger: 'change'}
		        	]
		        },
		        affirmTableList: [
                    {label: '学期', prop: 'semesterName', formType: 'select', selectIdProp: 'semesterId', selectListProp: []},
                    {label: '课程', prop: 'affirmCourseName', formType: 'select', selectIdProp: 'affirmCourseId', selectListProp: []},
                    {label: '认定成绩', prop: 'affirmCourseScore', formType: 'input', width: '90px'},
                    {label: '所修课程', prop: 'formerCourseName', formType: 'input'},
                    {label: '课程成绩', prop: 'formerCourseScore', formType: 'input', width: '90px'}
                ],
                editArr:{},
		        ctrl:{
		        	button1: false
		        },
		        fileList: [],
		        keyupHandle: () => {},
		        testdialog: false
	        };
	    },
	    created (){
	    	this.getMajorList();
	    	this.getTermData();
	    	this.keyupHandle = util.fnThrottle(this.getStuInfo, 700);
	    },
        computed: {
            headers (){
                return {
                    'Authorization': util.getStorage('token')
                }
            }
        },
	    mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
	    methods: {
	    	addItem (tableList, tableData, ctrlButton){
                this.ctrl[ctrlButton] = true; // 控制新增按钮
                let editItem = {
                    editing: true,
                    id: ''
                }
                for (let key of this[tableList]) {
                  
                    editItem[key.prop] = '';
                    editItem[key.selectIdProp] = ''; // new 循环
                }
                
                this[tableData].list.unshift(editItem);
            },
            // 编辑表格列
            handleEditItem (row){
            	this.dialog.visible = true;
            	for (let key in this.affirmForm) {
            	
            		this.affirmForm[key] = {...row}[key];
            	}
            },
            // 发布
            handlePublic (row){
            	this.$confirm(`确定发布学号为${row.stuNum}的数据吗`, `提示`, {
            		confirmButtonText: '确定',
            		cancelButtonText: '取消',
            		type: 'warning'
            	}).then(() => {
            		// success
            	}).catch(() => {
            		this.$message.info('已取消发布');
            	})
            },
            handleDelete (row){
            	this.$confirm(`确定删除学号为${row.stuNum}的数据吗`, `提示`, {
            		confirmButtonText: '确定',
            		cancelButtonText: '取消',
            		type: 'warning'
            	}).then(() => {
            		// success
            	}).catch(() => {
            		this.$message.info('已取消发布');
            	})
            },
            changeName (data, tableList, tableData, index, arr, prop){
                let name;

                arr.map(item => {
                    if (item.id === data || item.courseId === data) { // 因为不是所有下拉字段一致  所以增加不同判断及选择
                        name = item.name || item.courseName;
                    }
                })
                this.$set(this[tableData].list[index], prop, name);

                // 当选择的下拉是选择学期时  将请求认定课程下拉
                if (prop === 'semesterName') {
                    this.selectSemesterId = data;
                    this.getAffirmCourseList();
                }
            },
			handleSaveItem (tableList, tableData, row, index, ctrlButton){
                let patt1 = /^(?:[1-9]?\d|100)$/
                if (row.semesterId === '') {
                    this.$message.error('新增保存不能为空');
                    return false;
                }

                if (!patt1.test(row.affirmCourseScore) && row.affirmCourseScore) {
                    this.$message.error('[认定成绩]请输入0-100的正整数');
                    return ;
                }
                if (!patt1.test(row.formerCourseScore) && row.formerCourseScore) {
                    this.$message.error('[原课程成绩]请输入0-100的正整数');
                    return ;
                }

                this.editArr[`${tableList}Row`] = null;
                row.editing = false;
                delete row.editing;
                this.$set(this[tableData].list, index, row);
                // if (this.ctrl[ctrlButton] && index === 0) { // 控制新增按钮
                    this.ctrl[ctrlButton] = false;
                // }
                this.selectSemesterId = ''; // 
            },
            handleCancel (tableList, tableData, row, index, ctrlButton){
                // this.editObj
                this.ctrl[ctrlButton] = false; // 2222222222
                if (this.editArr[`${tableList}Row`]) {
                    this.$set(this[tableData].list, index, this.editArr[`${tableList}Row`]);
                    this[tableData].list[index].editing = false;
                    this.editArr[`${tableList}Row`] = null;
                } else {
                    this.ctrl[ctrlButton] = false;
                    this[tableData].list.shift();
                }
            },
			handleEdit (tableList, tableData, row, index, ctrlButton){
                if (row.isPublic == 1) {
                    this.$message.warning('该认定课程已经发布不能再进行编辑');
                    return ;
                }
                if (this.ctrl[ctrlButton]) { 
                    this.$message.warning('每次只能新增或编辑一条成绩认定');
                    return ;
                }
                row.editing = true;
                this.ctrl[ctrlButton] = true;

                this.editArr[`${tableList}Row`] = {...row};
                this.$set(this[tableData].list, index, row);
                // 点击编辑时获取认定课程下拉列表
                this.selectSemesterId = row.semesterId;
                this.getAffirmCourseList();
            },
            openDeleteDialog (row){
            	this.deleteAffirmCoureRow = row;
                this.deleteAffirmCoureIndex = index;

                if (!this.deleteAffirmCoureRow.id) { // 如果是新增按钮没有确定提交的则没有id
                    this['affirmForm'].list.splice(this.deleteAffirmCoureRow, 1);
                } else {
                    this.testdialog = true;
                }
            },
			handleDeleteAffirmCourse (row, index){
				// 注：以下第一行接口还需要修改
                this.$http.delete(`_op:/modified/courseaffirm/delete/${this.deleteAffirmCoureRow.id}`).then(res => {
                    if (res.code == 0) {
                        this.$message.success('删除成功');
                        // this.handleAffirm();
                        this['affirmForm'].list.splice(this.deleteAffirmCoureRow, 1); // 删除成功直接删除表格行显示
                        this.testdialog = false;
                    } else {
                        this.testdialog = false;
                        this.$message.error(res.msg);
                    }
                })
                
            },
	    	// 上传图片
            handleUploadSuccess (response, file, fileList){
                this.fileList1 = fileList.slice(-1);
                this.affirmForm.fileUrl = response.data.url;
            },
            // 附件下载或者预览
			handlePreview (file){
                if (/\.jpg|\.png|\.jpeg/.test(file.url)) {
                    this.previewUrl = file.url;
                    this.previewPic = true;
                } else { // 如果不是图片类型的则下载
                    // window.open(file.url);
                    // let eleIframe = document.createElement('iframe');
                    // eleIframe.src = file.url;
                    // eleIframe.style.display = 'none';
                    // document.body.appendChild(eleIframe);

                    var form = document.createElement("form");
                    form.style.display = 'none';
                    form.setAttribute("target","");
                    form.setAttribute("method","get");
                    form.setAttribute("action",file.url);
                    document.body.appendChild(form);
                    form.submit();//表单提交
                }
            },
            // 根据学号获取学生信息
            getStuInfo (){
                if (this.affirmForm.stuNum) {
                    this.queryLoading = true;
                    this.$http.get(`_op:/students/info/${this.affirmForm.stuNum}`).then(res => {
                        this.queryLoading = false;
                        if (res.data) {
                            this.affirmForm.stuName = res.data.name;
                            this.affirmForm.grade = res.data.enrollmentYear  || '';
                            // this.affirmForm.entranceDate = res.data.enrollmentDate  || '';
                            // this.affirmForm.sex = res.data.sex || '';
                            // this.affirmForm.mobile = res.data.mobile  || '';
                            this.affirmForm.majorId = res.data.majorId  || '';
                            // this.affirmForm.formerClassId = res.data.administrativeClassId  || '';
                        } else {
                        	this.$message.info('没有该学号信息记录');
                        	this.affirmForm.stuNum = '';
                        	this.affirmForm.stuName = '';
	                        this.affirmForm.grade = '';
	                        this.affirmForm.majorId = '';
                        }
                    }).catch(err => {
                        this.$message.error('网络错误或超时');
                        this.affirmForm.stuNum = '';
                        this.affirmForm.stuName = '';
                        this.affirmForm.grade = '';
                        this.affirmForm.majorId = '';
                    	this.queryLoading = false;
                    })
                }
            },
	    	handleQuery (){
	    		this.$http.post('/api', this.queryForm).then(res => {
	    		
	    		})
	    	},
	    	sizeChange (val){
	    		this.pageNo = 1;
	    		this.pageSize = val;
	    		this.handleQuery();
	    	},
	    	currentChange (val){
	    		this.pageNo = val;
	    		this.handleQuery();
	    	},
	    	handlePublishCourse (){
	    		this.$refs.affirmForm.validate(valid => {
	    			if (valid) {
                        // this.$http.post(`_op:/modified/courseaffirm/addBatch`, this.affirmForm).then(res => {
                        //     if (res.code == 0) {
                        //         this.$message.success('课程认定成功');
                        //     } else {
                        //         this.$message.error(res.msg);
                        //     }
                        // })
                    }
	    		})
	    	},
	    	openDialog (){
	    		this.dialog.visible = true;
	    	},
	    	dialogClose (){
	    		this.dialog.visible = false;
	    		this.$refs.affirmForm.resetFields();
	    	},
	    	// 获取认定课程
            getAffirmCourseList (){
                if (this.affirmForm.presentGrade && this.affirmForm.presentMajorId) {
                    this.$http.get(`_ed:/trainplan/termIds/grade/${this.affirmForm.presentGrade}/major/${this.affirmForm.presentMajorId}/term/${this.selectSemesterId}`).then(res => {
                        if (res.code == 0) {
                            this.affirmTableList[1].selectListProp = res.data;
                        }
                    })
                }
            },
	    	getMajorList (){
                this.$http.get('_op:/major/combox').then(res => {
                    if (res.code == 0) {
                        this.majorList = res.data
                    }
                })
            },
            // 获取学期下拉 
            getTermData(query){
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.termList = data.data;
                        this.affirmTableList[0].selectListProp = data.data; // 表格内下拉赋值
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
	    	collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            }
	    }
	};
</script>

<style lang="less" scoped>
	.exchange-student-grade-entring-box{
		/deep/ .grade-item{
			.el-date-editor.el-input{
				width: 130px;
			}
		}
		/deep/ .student-name-item{
			.el-form-item__content{
				width: 135px;
			}
		}
		/deep/ .status-item{
			.el-form-item__content{
				width: 135px;
			}
		}
		.exchange-grade-entring-dialog{
			.el-form-item {
                /deep/ .el-date-editor.el-input{
                    width: 217px;
                }
                /deep/ .el-form-item__content{
                    width: 217px;
                    box-sizing: border-box;
                    .el-select{
                        width: 100%; // edge
                    }
                }
                /deep/ .el-input.is-disabled .el-input__inner{
                    color:#666;
                }
            }
			.cm-table{
	            padding:0;
	            .el-table{
	                border-bottom: 1px solid #ebeef5;
	            }
	            .el-table__body-wrapper{
	                z-index: 333;
	            }
	        }
		}
		.affirm-wrapper{
            .affirm-header{
                margin:10px 0;
            }
        }
	}
</style>