<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-btn-con cm-fold">
            <el-form :inline="true"  size="mini" :model="queryForm">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <!-- <el-form-item v-for="(list,index) in formList" :key="index" :label="list.label">
                            <el-input v-model="formDetail[list.model]" :placeholder="item.placeholder"></el-input>
                        </el-form-item> -->
                        <el-form-item label="部门">
							<el-select v-model="queryForm.departmentId" filterable clearable placeholder="请选择">
							    <!-- <el-option label="工信部" :value="1"></el-option> -->
							    <el-option
							      	v-for="item in departmentList"
							      	:key="item.id"
							      	:label="item.name"
							      	:value="item.id">
							    </el-option>
							  </el-select>
                        </el-form-item>
                        <el-form-item label="姓名">
							<el-input v-model="queryForm.teacherName" clearable placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="工号">
							<el-input v-model="queryForm.teacherNo" clearable placeholder="请输入工号"></el-input>
                        </el-form-item>
                        <el-form-item label="电梯">
							<el-select v-model="queryForm.hasElevator" clearable placeholder="请选择">
							    <el-option label="是" :value="true"></el-option>
							    <el-option label="否" :value="false"></el-option>
							</el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="handleQuery">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con">
            <el-button size="medium" type="primary" @click="addTask">新增</el-button>
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
                <el-table-column prop="teacherName" label="姓名" ></el-table-column>
                <el-table-column prop="teacherNo" label="工号"></el-table-column>
                <el-table-column prop="departments" label="部门">
                    <template slot-scope="scope">
                        <template v-for="(department, index) in scope.row.departments">
                            {{department.name}}<span v-if="index<(scope.row.departments.length - 1)">,</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="职称"></el-table-column>
                <el-table-column prop="extend.maxLessonEveryDay" label="每天最大课时" width="95"></el-table-column>
                <el-table-column prop="extend.maxLessonEveryWeek" label="每周最大课时" width="95"></el-table-column>
                <el-table-column prop="extend.semesterMinLesson" label="学期学时下限" width="105"></el-table-column>
                <el-table-column prop="extend.semesterMaxLesson" label="学期学时上限" width="105"></el-table-column>
                <el-table-column prop="extend.classHourDistributeId" label="课时分布">
                    <template slot-scope="scope">
                        <template v-if="scope.row['extend.classHourDistributeId'] == 1">集中分布</template>
                        <template v-else-if="scope.row['extend.classHourDistributeId'] == 2">均匀分布</template>
                        <template v-else>随机</template>
                    </template>
                </el-table-column>
                <el-table-column prop="extend.hasElevator" label="电梯教室优先" width="105">
                    <template slot-scope="scope">
                        <template v-if="scope.row.extend.hasElevator">是</template>          
                        <template v-else>否</template>
                    </template>
                </el-table-column>
                <!-- <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :min-width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop === 'departments'">
                            <template v-for="(department, index) in scope.row[item.prop]">
                                {{department.name}}<span v-if="index<(scope.row[item.prop].length - 1)">、</span>
                            </template>
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column
                        label="操作"
                        fixed="right"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="planAdjustment(scope.row, 'editDialog')" type="text" size="small">编辑</el-button>
                        <el-button @click="planAdjustment(scope.row, 'editSettingDialog')" type="text" size="small">排课设置</el-button>
                        <!-- <el-button @click="openDialogCourseSetting(scope.row)" type="text" size="small">排课设置</el-button> -->
                        <el-button @click="deleteTeacher(scope.row)" type="text" size="small" style="color:red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo+1"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增或编辑对话框 -->
        <el-dialog
          	:title="dialog.status==='add'?'新增':'编辑'"
            :visible.sync="dialog.visible"
            :modal-append-to-body="false"
            :close-on-click-modal='false'
        	width="760px"
        	custom-class="teacher-constraint-dialog">
            <el-form class="teacher-priority-form" :inline="true" ref="teacherForm" :model="teacherForm" :rules="rules" :label-width="labelWidth">
            	 <!-- class="flex-form" -->
                <!-- <el-form-item label="姓名" prop="teacherName">
					<el-input v-model="teacherForm.teacherName"  placeholder="姓名" @keyup.native="queryTeacherNo"><i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i></el-input>
				</!--> 
                 <el-form-item label="姓名" prop="teacherNameWithNo">
                    <el-autocomplete ref="teacherInput" v-model="teacherForm.teacherName" :fetch-suggestions="querySearchAsync" placeholder="请输入姓名" @select="handleSelect" :trigger-on-focus="false"></el-autocomplete>
                </el-form-item>
            	<el-form-item label="工号" prop="teacherNo">
				    <el-input v-model.trim="teacherForm.teacherNo" disabled  placeholder="请输入工号" ></el-input>
				</el-form-item>
			
				<el-form-item label="部门" prop="departmentName">
				    <el-input v-model="teacherForm.departmentName" disabled placeholder="部门"></el-input>
				</el-form-item>
				<el-form-item label="职称" prop="title">
				    <el-input v-model="teacherForm.title" disabled placeholder="职称"></el-input>
				</el-form-item>
				<el-form-item label="每天最大课时" prop="extend.maxLessonEveryDay">
				    <el-input v-model="teacherForm.extend.maxLessonEveryDay" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="每周最大课时" prop="extend.maxLessonEveryWeek">
				    <el-input v-model="teacherForm.extend.maxLessonEveryWeek" placeholder=""></el-input>
				</el-form-item>
				<div class="form-items">
					<el-form-item label="学期学时上下限">
				    <el-input v-model="teacherForm.extend.semesterMinLesson" placeholder=""></el-input></el-form-item>
				    ~
				    <el-form-item>
				    <el-input v-model="teacherForm.extend.semesterMaxLesson" placeholder=""></el-input></el-form-item>
				</div>
				<el-form-item class="lesson-distribution" label="课时分布(多上课班)" prop="extend.classHourDistributeId">
				    <el-select v-model="teacherForm.extend.classHourDistributeId" placeholder="请选择课时分布" style="width: 100%;">
				      	<el-option label="集中分布" :value="1"></el-option>
				      	<el-option label="均匀分布" :value="2"></el-option>
				      	<el-option label="随机" :value="3"></el-option>
				    </el-select>
				</el-form-item>
                <el-form-item label="电梯教室优先" prop="extend.hasElevator">
                  	<el-select v-model="teacherForm.extend.hasElevator" placeholder="请选择是否电梯教室优先" style="width: 100%;">
				      	<el-option label="是" :value="true"></el-option>
				      	<el-option label="否" :value="false"></el-option>
				    </el-select>
                </el-form-item>
            </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogClose">取 消</el-button>
	            <el-button type="primary" @click="handleRestraint('teacherForm',dialog.status==='add'?'post':'patch')">确 定</el-button>
	        </span>
        </el-dialog>

        <!-- 排课设置弹窗 -->
        <el-dialog
            width="900px"
            title="排课设置"
            :visible.sync="dialog.editvisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            custom-class="arrange-setting-dialog">
            <div class="table-box cm-table">
                <div class="table-item">
                    <p class="clear">不排课时间设置 <el-button size="mini" class="right" :disabled="ctrl.button1" @click="addItem('notArrangeTableList', 'notScheduleTimeTableData', 'button1')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="notScheduleTimeTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in notArrangeTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>

                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="" @change="changeName($event, 'notArrangeTableList', 'notScheduleTimeTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}
                                </template>                          
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('notArrangeTableList', 'notScheduleTimeTableData', scope.row, scope.$index, 'button1')">保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('notArrangeTableList', 'notScheduleTimeTableData', scope.row, scope.$index, 'button1')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('notArrangeTableList', 'notScheduleTimeTableData', scope.row, scope.$index, 'button1')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('notArrangeTableList', 'notScheduleTimeTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="table-box cm-table">
                <div class="table-item">
                    <p class="clear">不排课日期设置 <el-button size="mini" class="right" :disabled="ctrl.button2" @click="addItem('priorityPlaceTableList', 'notScheduleDateTableData', 'button2')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="notScheduleDateTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in priorityPlaceTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>
                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="请选择" @change="changeName($event, 'priorityPlaceTableList', 'notScheduleDateTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-date-picker
                                    	size="mini"
								      	v-model="scope.row[col.prop]"
								      	v-if="col.inputType === 'datePick'"
								      	type="date"
								      	value-format="yyyy-MM-dd"
								      	placeholder="请选择日期">
								    </el-date-picker>
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}
                                </template>                          
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('priorityPlaceTableList', 'notScheduleDateTableData', scope.row, scope.$index, 'button2')">保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('priorityPlaceTableList', 'notScheduleDateTableData', scope.row, scope.$index, 'button2')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('priorityPlaceTableList', 'notScheduleDateTableData', scope.row, scope.$index, 'button2')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('priorityPlaceTableList', 'notScheduleDateTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="table-box cm-table">
                <div class="table-item">
                    <p class="clear">优先安排时间设置 <el-button size="mini" class="right" :disabled="ctrl.button3" @click="addItem('priorityTableList', 'priorityScheduleTimeTableData', 'button3')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="priorityScheduleTimeTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in priorityTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>
                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="" @change="changeName($event, 'priorityTableList', 'priorityScheduleTimeTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select> 
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}                             
                                </template>                          
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('priorityTableList', 'priorityScheduleTimeTableData', scope.row, scope.$index, 'button3')">1保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('priorityTableList', 'priorityScheduleTimeTableData', scope.row, scope.$index, 'button3')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('priorityTableList', 'priorityScheduleTimeTableData', scope.row, scope.$index, 'button3')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('priorityTableList', 'priorityScheduleTimeTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="confirmEditGrade('teacherForm', 'patch')">确 定</el-button>
            </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
    const TYPE='place-priority';
    const REMARK='设置地点优先级';
	export default {
        name:TYPE,
		data(){
			var weekDay = [
                {id:1, name: '星期一'},
                {id:2, name: '星期二'},
                {id:3, name: '星期三'},
                {id:4, name: '星期四'},
                {id:5, name: '星期五'},
                {id:6, name: '星期六'},
                {id:7, name: '星期日'}
            ]
            var validateLesson = (rule, value, callback) => {
                if (value != '') {
                    if (!/^\d{1,2}$/.test(value)) {
                        callback(new Error('请输入小100的正整数'))
                    }else{
                        callback();
                    }
                } else {
                    callback();
                }
            }
			return {
				breadcrumb: [
                    {label: "自动排课"},
                    {label: '授课老师约束设置'},
                    // path:`/educational_admin/course_content?actionId=${this.$route.query.actionId}`
                    // {label: REMARK},
                ],
                // autoapi: process.env.NODE_ENV === 'development' ? 'http://192.168.5.175:8060' : '',
                autoapi: 'http://192.168.0.101:8060',
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false,
                	editvisible: false
                },
                formDetail:{},
                queryForm: {
                    departmentId:'',
                    teacherName:'',
                    teacherNo:'',
                	hasElevator:''
                },
                departmentList: [],
                teacherForm:{
                    id: '', 
                    // createTime:'',
                    // lastUpdateTime: '',
                    // createUserId: util.getStorage('loginId'), // 新增时需要  修改时清空
                    // lastUpdateUserId: util.getStorage('loginId'), // 新增时清空  修改时需要
                    teacherId: '',
		            teacherNo:'', // 教师工号
		            teacherName:'', 
		            title:'', // 职称
		            departmentId:'', // 
                    departmentName: '',
                    departments: [],
                    universityId: '',
                    extend:{ // 约束条件
                        maxLessonEveryDay: '',
                        maxLessonEveryWeek: '',
                        semesterMinLesson: '',
                        semesterMaxLesson: '',
                        classHourDistributeId: '',
                        hasElevator: '',
                        notScheduleTimeTableData:[], // 排课设置--
                        priorityScheduleTimeTableData:[],  // 排课设置--
                        notScheduleDateTableData: []  // 排课设置--
                    },
                    // properties: {},
                    // wasDelete: 0,
                    // wasDeleted: 0
                    // maxLessonEveryDay: '',
                    // maxLessonEveryWeek: '',
                    // semesterMinLesson: '',
                    // semesterMaxLesson: '',
                    // classHourDistributeId: '',
                    // hasElevator: ''
		        },
		        rules: {
		        	teacherNo: [
		        		{required: false, message: '请输入工号', trigger: 'blur'}
		        	],
		        	teacherName: [
		        		{required: true, message: '请输入教职工名称', trigger: 'blur'}
		        	],
		        	departmentId: [
		        		{required: false, message: '请输入部门', trigger: 'blur'}
		        	],
		        	title: [
		        		{required: false, message: '请输入职称', trigger: 'blur'}
		        	],
		        	extend:{
                        maxLessonEveryDay: [
                            {required: false, validator: validateLesson, trigger: 'change'},
                        ],
                        maxLessonEveryWeek: [
                            {required: false, validator: validateLesson, trigger: 'change'}
                        ],
                        classHourDistributeId: [
                            {required: true, message: '请选择课时分布', trigger: 'blur'}
                        ],
                        hasElevator: [
                            {required: true, message: '请选择是否电梯教室优先', trigger: 'blur'}
                        ]
                    },
		        },
		        labelWidth: '132px',
		        formList:[
		        	{label:'部门',model:'departmentId', placeholder:''},
		        	{label:'姓名',model:'name', placeholder:''},
		        	{label:'工号',model:'teacherNo', placeholder:''},
		        	{label:'电梯',model:'lift', placeholder:''}
		        ],
                tableList:[
		            // {label:'工号', prop:'teacherNo'},
		            {label:'姓名', prop:'teacherName'},
		            {label:'工号', prop:'teacherNo'},
		            {label:'部门', prop:'departments'},
		            {label: '职称', prop:'title'},
		            {label:'每天最大课时', prop:'extend.maxLessonEveryDay', width: 95},
		            {label:'每周最大课时', prop:'extend.maxLessonEveryWeek', width: 95},
		            {label:'学期学时下限', prop:'extend.semesterMinLesson', width: 105},
		            {label:'学期学时上限', prop:'extend.semesterMaxLesson', width: 105},
		            {label:'课时分布', prop:'extend.classHourDistribute'},
		            {label:'电梯教室优先', prop:'extend.liftClassRoomPriority', width: 105}
		        ],
                tableData:[],
                pageNo: 0,
	          	pageSize: 10,
	          	totalCount:0,
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
		        notArrangeTableList:[
                    {label: '开始周', prop: "startWeek", inputType: 'input'},
                    {label: '结束周', prop: "endWeek", inputType: 'input'},
                    {label: '星期', prop: "weekDay", inputType: 'select', selectIdProp: 'weekDayIds', selectListProp: weekDay, selectLabelName:'name', multiple: true},
                    {label: '课节', prop: "lessons", inputType: 'select', selectIdProp: 'lessonsId', selectListProp: [], selectLabelName:'name', multiple: true}
                ],
                notScheduleTimeTableData: [
                    // {startWeek: '3', endWeek:'5', weekDayIds:[1,2], weekDay:'星期一、星期二', lessonsId:[77, 78], lessons:'5、6'}
                ],
                priorityTableList: [
                    {label: '开始周', prop: "startWeek", inputType: 'input'},
                    {label: '结束周', prop: "endWeek", inputType: 'input'},
                    {label: '星期', prop: "weekDay", inputType: 'select', selectIdProp: 'weekDayIds', selectListProp: weekDay, selectLabelName:'name', multiple: true},
                    {label: '课节', prop: "lessons", inputType: 'select', selectIdProp: 'lessonsId', selectListProp: [], multiple: true}
                ],
                priorityScheduleTimeTableData: [],
                priorityPlaceTableList: [
                    {label: '开始日期', prop: 'notArrangeStartDate', inputType: 'datePick'},
                    {label: '结束日期', prop: 'notArrangeEndDate', inputType: 'datePick'}
                ],
                notScheduleDateTableData: [
                    // {teachingForm: '理论', teachingFormId: 26, campus:'汕大医学院', campusId:27, placeType:'多媒体教室', building:'逸夫楼', placeId: 80, placeName: 'N401'}
                    // {notArrangeStartDate: '2018-09-01', notArrangeEndDate: '2018-09-03'}
                ],
                editArr: {},
                teachingFormList: [],
                queryLoading: false,
                queryTeacherNo: () => {},
                ctrl:{
                    button1:false,
                    button2:false,
                    button3:false
                }
			}
		},
        created (){
            this.getDepartmentSelect();
            this.handleQuery();
            this.getLessonList();
            this.queryTeacherNo = this.fnThrottle(this.querySearchAsync, 500);
        },
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
	    },
		methods:{
                querySearchAsync() { 
                if (this.teacherForm.teacherNo == '') {
                    this.queryLoading = false;
                    this.teacherForm.teacherNo = '';
                    this.teacherForm.teacherName = '';
                    this.teacherForm.title = '';
                    this.teacherForm.departmentName = '';
                    this.teacherForm.departments = [];
                    return ;
                }
                this.queryLoading = true;
                let params = {
                    pageNo: 1,
                    pageSize: 1,
                    param: {
                        teacherNo:  this.teacherForm.teacherNo // 315
                    }
                }
              
                this.$http.post('_op:teachers/list', params).then(res => {
                    let result = res.data.result;
                    this.queryLoading = false;
                    
                    if (result.length == 0) {
                        this.teacherForm.teacherId = '';
                        this.teacherForm.teacherName = '';
                        this.teacherForm.title = '';
                        this.teacherForm.departmentName = '';
                        this.teacherForm.departments = [];
                        this.$message.info('找不到该工号信息记录')
                    } else {
                        this.teacherForm.departments = [];
                        this.teacherForm.teacherId = result[0].id;
                        this.teacherForm.teacherName = result[0].name;
                        this.teacherForm.title = result[0].positionName;
                        this.teacherForm.departmentName = result[0].departments;
                        for (var i = 0; i < result[0].departmentIds.length; i++) {
                            let obj = {};
                            obj.id = result[0].departmentIds[i];
                            obj.name = result[0].departments.split(',')[i];
                            this.teacherForm.departments.push(obj);
                        }
                    }
                })
              
            },
             querySearchAsync(queryString, cb) {
                 console.log('搜索内容', queryString)
                 console.log('222', cb)
                if (queryString) {
                let params = {
                    pageNo: 1,
                    pageSize: 1000,
                    param: {
                    name: queryString
                    }
                }
                this.$http.post(`_op:teachers/list`, params).then(res => {
                    var result = [];
                    if (Array.isArray(res.data.result) && res.data.result.length > 0) {
                    res.data.result.forEach(r => {
                        var obj = {};
                        obj.value = `${r.name}(${r.teacherNo})`;
                        obj.item = r;
                        result.push(obj);
                    })
                    }
                    cb(result);
                    
                }).catch(err => {
                    console.info(err);
                    cb([]);
                });
                }
            },
              handleSelect(val) {
                  console.log('???', val)
                  if(val.length=0){
                      this.teacherForm.teacherId = '';
                        this.teacherForm.teacherNo = '';
                        this.teacherForm.title = '';
                        this.teacherForm.departmentName = '';
                        this.teacherForm.departments = [];
                        this.$message.info('找不到该姓名信息记录')
                  }else{
                        this.teacherForm.departments = [];
                        this.teacherForm.teacherId = val.item.id;
                        this.teacherForm.teacherNo = val.item.teacherNo;
                        this.teacherForm.title = val.item.positionName
                        this.teacherForm.departmentName = val.item.departments;
                        for (var i = 0; i < val.item.departments.length; i++) {
                            let obj = {};
                            obj.id = val.item.departments[i];
                            obj.name = val.item.departments.split(',')[i];
                            this.teacherForm.departments.push(obj);
                        }

                  }

                // this.teacherForm.teacherId = val.item.id;
                // this.teacherForm.teacherNo = val.item.teacherNo;
                // this.teacherForm.teacherName = val.item.name;
                // this.teacherForm.title = val.item.positionName;
                // this.teacherForm.departmentName = val.item.departments;
            },
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
			handleQuery(){
               
                let params = {
                    pageIndex: this.pageNo,
                    pageSize: this.pageSize,
                    param: this.queryForm 
                }
              
                this.$http.post(`_as:/teacher/restraint/search`, params).then(data => {
                    if (data.status == 200) {
                        this.tableData = data.result.data;
                        this.totalCount = data.result.total;
                    }
                })
			},
			onClose(){
				this.$router.push({
					path: '/educational_admin/course_content',
					query: {
						actionId: this.$route.query.actionId
					}
				})
			},
			addTask(){
				this.dialog.status='add';
				this.dialog.visible = true;
			},
			dialogClose (){
				for (let key in this.teacherForm) {
					if (key != 'extend') {
                        this.teacherForm[key] = '';
                    } else {
                        this.teacherForm.extend.classHourDistributeId = '';
                        this.teacherForm.extend.hasElevator = '';
                        this.teacherForm.extend.maxLessonEveryDay = '';
                        this.teacherForm.extend.maxLessonEveryWeek = '';
                        this.teacherForm.extend.semesterMaxLesson = '';
                        this.teacherForm.extend.semesterMinLesson = '';
                        this.teacherForm.extend.notScheduleDateTableData = [];   
                        this.teacherForm.extend.notScheduleTimeTableData = [];   
                        this.teacherForm.extend.priorityScheduleTimeTableData = [];  
                    }
				}
				this.dialog.visible = false;
                this.queryLoading = false;
			},
			sizeChange(val){
                this.pageSize = val;
                this.pageNo = 0;
                this.handleQuery();
			},
			currentChange(val){
                this.pageNo = val-1;
                this.handleQuery();
			},
        
            // handleSelect (){

            // },
            // 排课设置（弹窗）编辑
            confirmEditGrade (teacherForm, method){
                let params = this.teacherForm;
                
                for (let key in this.ctrl) {
                    if (this.ctrl[key]) {
                        this.$message.warning('请先保存设置');
                        return false;
                    }
                }

                this.teacherForm.extend.notScheduleTimeTableData = this.notScheduleTimeTableData;
                this.teacherForm.extend.priorityScheduleTimeTableData = this.priorityScheduleTimeTableData;
                this.teacherForm.extend.notScheduleDateTableData = this.notScheduleDateTableData;   
                this.submitData(teacherForm, method, params);
            },
            // 新增或编辑确定事件
			handleRestraint (teacherForm, method){
				let params = this.teacherForm;
                if (this.dialog.status === 'add') {
                    delete this.teacherForm.id;
                }
                delete params.departmentId;
                delete params.departmentName;

                this.$refs[teacherForm].validate((valid) => {
                    if (valid) {
                        this.submitData(teacherForm, method, params);
                    }
                })
			},
            // 新增或编辑提交
            submitData (teacherForm, method, params){

                this.$http({
                    // url: `${this.autoapi}/teacher/restraint`,
                    url: `_as:/teacher/restraint`,
                    method: method,
                    data: params
                }).then(data => {
                    this.$message.success('操作成功');
                    this.dialog.visible = false;
                    this.dialog.editvisible = false;
                    this.handleQuery();
                })
            },
			planAdjustment(row, dialog){
				let depArr = [];

                this.dialog.status='edit';
				this.teacherForm = this.deepClone(row);

                if (dialog === 'editDialog') {
                    this.dialog.visible = true;
                } else if (dialog === 'editSettingDialog') {
                    // let extend = {...row.extend};
                    this.dialog.editvisible=true;
                    this.notScheduleTimeTableData = this.deepClone(row.extend.notScheduleTimeTableData); 
                    this.priorityScheduleTimeTableData = this.deepClone(row.extend.priorityScheduleTimeTableData);
                    this.notScheduleDateTableData = this.deepClone(row.extend.notScheduleDateTableData);
                }

                for (var i = 0; i < row.departments.length; i++) {
                    depArr.push(row.departments[i].name);
                }
                this.teacherForm.departmentName = depArr.join(',');
			},
			deleteTeacher (row){
                // this.$http.delete(`${this.autoapi}/teacher/restraint/hard/${row.id}`).then(data => {
				this.$confirm(`确定删除该老师约束数据吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                    this.$http.delete(`_as:/teacher/restraint/hard/${row.id}`).then(data => {
                        this.$message.success('删除成功');
                        this.handleQuery();
                    })
                }).catch(() => {
                    this.$message.info('已取消删除');
                })
			},
			// openDialogCourseSetting(row){
            //     // this.teacherForm = {...row};
            //     this.teacherForm.id = row.id;
            //     this.teacherForm.teacherId = row.teacherId;
            //     this.teacherForm.teacherNo = row.teacherNo;
            //     this.teacherForm.teacherName = row.teacherName;
            //     this.teacherForm.title = row.title;
            //     this.teacherForm.departmentId = row.departmentId;
            //     this.teacherForm.departmentName = row.departmentName;
            //     this.teacherForm.departments = row.departments;
            //     this.teacherForm.universityId = row.universityId;
            //     this.teacherForm.extend.maxLessonEveryDay = row.extend.maxLessonEveryDay;
            //     this.teacherForm.extend.maxLessonEveryWeek = row.extend.maxLessonEveryWeek;
            //     this.teacherForm.extend.semesterMinLesson = row.extend.semesterMinLesson;
            //     this.teacherForm.extend.semesterMaxLesson = row.extend.semesterMaxLesson;
            //     this.teacherForm.extend.classHourDistributeId = row.extend.classHourDistributeId;
            //     this.teacherForm.extend.hasElevator = row.extend.hasElevator;

            //     this.notScheduleTimeTableData = [...row.extend.notScheduleTimeTableData];
            //     this.priorityScheduleTimeTableData = [...row.extend.priorityScheduleTimeTableData];
            //     this.notScheduleDateTableData = [...row.extend.notScheduleDateTableData];
            //     this.dialog.editvisible=true;
            // },
            closeEditDialog (){
                this.notScheduleTimeTableData = [];
                this.priorityScheduleTimeTableData = [];
                this.notScheduleDateTableData = [];
                for (let key in this.ctrl) {
                    this.ctrl[key] = false;
                }

                this.dialog.editvisible = false;
            },
			// 排课课程限制弹窗新增表格行按钮 ----- edit in table
            addItem (tableList, tableData, button1){
                this.ctrl[button1] = true;
                let editItem = {
                    editing: true,
                    // id: ''
                }
                for (let key of this[tableList]) {
                    editItem[key.prop] = '';
                }

                this[tableData].unshift(editItem);
            },
            /**
             * [changeName 根据选中的值更改表格中当前行的对应的名称显示]
             * @param  {[type]} data      [当前选中的id值]
             * @param  {[Array]} tableList [各个表格的列属性数组]
             * @param  {[Array]} tableData [当前表格]
             * @param  {[number]} index     [当前表格行]
             * @param  {[type]} arr       [选中的下拉菜单数组]
             * @param  {[type]} prop      [名称属性]
             */
            changeName (data, tableList, tableData, index, arr, prop){
                let name;

                if (Array.isArray(data)) { // 多选下拉
                    let tempArr = [];
                    data.map(item => {
                        for (var i = 0; i < arr.length; i++) {
                            if (item == arr[i].id) {
                                tempArr.push(arr[i].name);
                            }
                        }
                    })
                    name = tempArr.join('、');
                } else { // 单选下拉
                    arr.map(item => {
                        if (item.id === data) {
                            name = item.name;
                        }
                    })
                }

                this.$set(this[tableData][index], prop, name);
            },
            // (弹窗)保存编辑
            handleSaveItem (tableList, tableData, row, index, ctrlButton){
              
                 console.log('tag111', tableList)
                console.log('tag222', row.startWeek)
                let _this = this;

                if (tableList === 'notArrangeTableList' || tableList === 'priorityTableList') {

                    if (row.startWeek === '' || row.endWeek === '' || row.lessonsId.length < 1 || row.weekDayIds.length < 1) {
                        this.$message.error('新增或者编辑保存不能为空');
                        return false;
                    }
                } else if (tableList === 'priorityPlaceTableList') {
                    if (row.teachingForm === '' || row.campus === '' || row.building === '' || row.placeType === '' || row.placeName === ''|| row.notArrangeStartDate === '' || row.notArrangeEndDate === '') {
                        this.$message.error('新增或者编辑保存不能为空');
                        return false;
                    }
                }

                if (tableData == 'notScheduleTimeTableData') {
                    if (this.validate('priorityScheduleTimeTableData', tableData, row.startWeek, row.endWeek, index)) {
                        this.ctrl[ctrlButton] = false;
                        // this.editObj = null;
                        this.editArr[`${tableList}Row`] = null;
                        row.editing = false;
                        delete row.editing;
                        this.$set(this[tableData], index, row);
                    } else {
                        // this.$message.error('设置的值不能在已设置条件的区间内');
                        return false;
                    }
                } else if (tableData == 'priorityScheduleTimeTableData'){
                    if (this.validate('notScheduleTimeTableData', tableData,  row.startWeek, row.endWeek, index)) {
                        
                        this.ctrl[ctrlButton] = false;
                        // this.editObj = null;
                        this.editArr[`${tableList}Row`] = null;
                        row.editing = false;
                        delete row.editing;
                        this.$set(this[tableData], index, row);
                    } else {
                        // this.$message.error('设置的值不能在已设置条件的区间内');
                        return false;
                    }
                }

                if (tableData === 'notScheduleDateTableData') {
                    if ((new Date(this[tableData][index].notArrangeStartDate).getTime() - new Date(this[tableData][index].notArrangeEndDate).getTime() < 0)) {
                        this.ctrl[ctrlButton] = false;
                        // this.editObj = null;
                        this.editArr[`${tableList}Row`] = null;
                        row.editing = false;
                        delete row.editing;
                        this.$set(this[tableData], index, row);
                    } else {
                        this.$message.error('开始日期不能大于结束日期');
                        return false;
                    }
                }
            },
            /**
             * [handleCancel 弹窗内编辑表格]
             * 取消有二种情况 ：
             * 1、如果是新增的 则直接删除；
             * 2、如果是原有的 则要取消编辑并保存原来的数据
             */
            handleCancel (tableList, tableData, row, index, ctrlButton){
                // this.editObj
                this.ctrl[ctrlButton] = false;
                if (this.editArr[`${tableList}Row`]) {
                    this.$set(this[tableData], index, this.editArr[`${tableList}Row`]);
                    this[tableData][index].editing = false;
                    // this.editObj = null;
                    this.editArr[`${tableList}Row`] = null;
                } else {
                    this[tableData].shift();
                }
            },
            // 新增/编辑弹窗编辑表格行 
            handleEdit (tableList, tableData, row, index, ctrlButton){
                if (this.ctrl[ctrlButton]) {
                    this.$message.warning('每个设置表格只能编辑一条哦');
                    return false;
                }
                row.editing = true;
                // this.editObj = {...row};
                this.editArr[`${tableList}Row`] = {...row};
                this.$set(this[tableData], index, row);
                this.ctrl[ctrlButton] = true;
            },
            // （弹窗）删除 ----- edit in table
            handleDelete (tableList, tableData, row, index){
                this[tableData].splice(index, 1);
            },
			teachingRemark(){
				this.dialog.remark = true;
			},
			handleClick(){

			},
            // 获取部门列表
            getDepartmentSelect (){
                this.$http.get('_op:/admin/department/list/0/1').then(data => {
                    if (data.code == 0) {
                        this.departmentList = data.data;
                    }
                })
            },
            //获取课节
            getLessonList(){
                this.$http.get("_op:/sections/find").then(data=>{
                    if(data.code==0){
                        if(data.data){
                            // this.lessonList = data.data;
                            this.notArrangeTableList[3].selectListProp = data.data
                            this.priorityTableList[3].selectListProp = data.data
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            /**
             * [fnThrottle 节流函数]
             * @param  {Function} fn      [回调函数]
             * @param  {[type]}   delay   [延迟]
             * @param  {[type]}   atleast [至少多时时间执行一次]
             */
            fnThrottle (fn, delay, atleast) {
                let timer = null
                let previous = null
                return function () {
                    let now = +new Date()
                    if (!previous) previous = now
                    if (atleast && now - previous > atleast) {
                        fn()
                        previous = now
                        clearTimeout(timer)
                    } else {
                        clearTimeout(timer)
                        timer = setTimeout(function () {
                            fn()
                            previous = null
                        }, delay)
                    }
                }
            },
            deepClone(obj){
                var str, newobj = obj.constructor === Array ? [] : {};
                if(typeof obj !== 'object'){
                    return;
                } else if(window.JSON){
                    str = JSON.stringify(obj), //系列化对象
                    newobj = JSON.parse(str); //还原
                } else {
                    for(var i in obj){
                        newobj[i] = typeof obj[i] === 'object' ? 
                        this.deepClone(obj[i]) : obj[i]; 
                    }
                }
                return newobj;
            },
            /**
             * [validate 根据属性校验一个数组设置的数字间隔不在另外一个数组的数字区间内]
             * @param  {[type]} arrA      [被校验的数组]
             * @param  {[type]} targetArr [需要校验的数组]
             * @param  {[type]} beginKey  [数组属性]
             * @param  {[type]} endKey    [数组属性]
             * @return {[type]}           [booleen]
             */
            validate (arrA, targetArr, beginKey, endKey, index) {
                let _this = this;

                if ((this[targetArr][index][beginKey] - this[targetArr][index][endKey])>0) {
                    this.$message.error('设置的初始值不能大于结束值');
                    return false;
                } else {
                
                    for (var i = 0; i < this[arrA].length; i++) {
                        if (this[arrA].length > 1 && i < (this[arrA].length - 1)) {
                            if (!this.coreCompare(this[arrA][i], this[arrA][i+1], beginKey, endKey)) return false;
                        }
                        for (var j = 0; j < this[targetArr].length; j++) {
                            if (this[targetArr].length > 1 && i < (this[targetArr].length - 1)) {
                                if (!this.coreCompare(this[targetArr][i], this[targetArr][i+1], beginKey, endKey)) return false;
                            }
                            if (!this.coreCompare(this[arrA][i], this[targetArr][j], beginKey, endKey)) return false;
                        }
                    }
                    if (this[arrA].length) {
                        for (var j = 0; j < this[targetArr].length; j++) {
                            if (this[targetArr].length > 1 && i < (this[targetArr].length - 1)) {
                                if (!this.coreCompare(this[targetArr][i], this[targetArr][i+1], beginKey, endKey)) return false;
                            }
                            if (!this.coreCompare(this[arrA][i], this[targetArr][j], beginKey,endKey)) return false;
                        }
                    }
                    return true;
                }
            },
            coreCompare (arr1, arr2, startProp, endProp){
                let com1A = arr2[startProp] - arr1[startProp];
                let com1B = arr2[endProp] - arr1[startProp];
                let com2A = arr2[startProp] - arr1[endProp];
                let com2B = arr2[endProp] - arr1[endProp];
                    debugger
                // if (!((com1A < 0 || com1B > 0) && (com2A < 0 || com2B > 0))) {
                if (!((com1A < 0 && com1B < 0) || (com2A > 0 && com2B > 0))) {
                    // 设置的区间已在已设置的区间值内  不成立
                    this.$message.error('【不排课时间】、【优先安排时间】设置的区间不能在已设置的区间值内')
                    return false;
                }

                return true;
            }
		}
	}
</script>
<style lang="less" scoped>
	.dv-wrap{
		display: flex;
	}
	.form-items{
		display: inline-block;
		line-height: 40px;
		/deep/ .el-form-item{
			.el-input__inner{
				width: 70px !important;
				padding: 0 5px;
			}
		}
	}
	.lesson-distribution{
		float: right;
		/deep/ .el-form-item__label{
			width: 145px !important;
		}
	}
    
	.arrange-setting-dialog{
        .inline{
            margin-left: 50px;
            line-height: 40px;
        }
        .week-input{
            /deep/ .el-input__inner{
                margin:0 5px;
                width:50px;
                padding-left: 5px;
                padding-right: 5px;
            }
        }
        .table-item{
            p{
                margin: 20px 0 10px;
            }
            &:first-child{
            	p{
            		margin-top: 0;
            	}
            }
        }
    }
</style>

<style lang="less">
    .teacher-constraint-dialog{
        /deep/ .el-form-item__content{
            .el-input{
                .el-input__inner{
                    width: 217px;
                }
            }
        }
        /deep/ .el-form-item {
            .el-input.is-disabled .el-input__inner{
                color:#666;
            }
        }
    }
</style>