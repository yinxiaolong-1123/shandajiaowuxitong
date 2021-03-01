<template>
	<div class="automatic_arrange">
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
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
		                <el-form-item label="学期">
		                    <el-select 
		                        v-model="searchForm.semesterId"
		                        clearable
		                        filterable 
		                        placeholder="请输入课节名称">
		                        <el-option label="全部" value=" "></el-option>
		                        <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item label="排课状态">
							<el-select
								v-model="searchForm.status"
								clearable
								placeholder="全部">
								<el-option label="全部" value=" "></el-option>
								<el-option label="成功" :value="1"></el-option>
								<el-option label="失败" :value="0"></el-option>
							</el-select>
		                </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask">自动排课</el-button>
        </div>
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                v-loading="tableLoading"
                element-tableLoading-text="加载中..."
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号"></el-table-column>
				<el-table-column prop="semesterName" label="学期"></el-table-column>
				<el-table-column prop="status" label="排课状态">
					<template slot-scope="scope">
                		<template v-if="scope.row.status == 1">
            				成功
            			</template>
            			<template v-else>
            				失败
            			</template>
                	</template>
				</el-table-column>
				<el-table-column prop="publishStatus" label="发布">
					<template slot-scope="scope">
                		<template v-if="scope.row.publishStatus == 1">
            				已发布
            			</template>
            			<template v-else>
            				<!-- 只有排课成功了才显示发布 -->
            				<template v-if="scope.row.status == 1">
            					待发布
	            			</template>
	            			<template v-else>
	            				--
	            			</template>
            			</template>
                	</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建日期" >
					<template slot-scope="scope">
						{{scope.row.createTime | formatime}}
                	</template>
				</el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="272">
                    <template slot-scope="scope">
                        <el-button @click="arrangeCourseReport(scope.row)" type="text" size="small">排课报告</el-button>
                        <template v-if="scope.row.status == 1">
							<el-button @click="courseSheetPrview(scope.row)" type="text" size="small">课表预览</el-button>
	                        <el-button v-if="scope.row.publishStatus == 0" @click="handlePublish(scope.row)" type="text" size="small">发布</el-button>
	                        <el-button v-if="scope.row.publishStatus == 1"  @click="handleCancel(scope.row)" type="text" size="small">撤回发布</el-button>
                        </template>
                        <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
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

		<!-- 自动排课条件设置 -->
        <el-dialog
        	title="自动排课"
        	:visible.sync="dialog.visibleStep1"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="876px"
            custom-class="auto-conditional-dialog">
				<el-form :inline="true" :model="conditionsForm" ref="conditionsForm" :rules="rules">
					<el-tabs v-model="activeName" type="card">
					    <el-tab-pane label="排课时间约束" name="first">
							
							<div class="condition-item">
								<!-- hide-required-asterisk -->
								<span style="color:#f00;">*</span> 可排课周次从第
								<el-form-item prop="arrangeTime.enableStartWeek">
								    <el-input size="mini" v-model="conditionsForm.arrangeTime.enableStartWeek" class="auto-input"></el-input>
								</el-form-item>~<el-form-item prop="arrangeTime.enableEndWeek">
								    <el-input size="mini" class="auto-input" v-model="conditionsForm.arrangeTime.enableEndWeek"></el-input>
								</el-form-item>
								周
							</div>
							<div class="condition-item">
								<el-form-item prop="arrangeTime.relativeEquilibrium">
								    <el-checkbox v-model="conditionsForm.arrangeTime.relativeEquilibrium">每周课程总学时相对均衡</el-checkbox>
								</el-form-item>
							</div>
							<div class="condition-item">
								<el-form-item prop="arrangeTime.sameCourseMinInterval">
									<el-checkbox v-model="conditionsForm.arrangeTime.sameCourseMinInterval.need">同一课程一周多次课至少间隔</el-checkbox>
								</el-form-item>
								<el-input size="mini" class="auto-input" v-model="conditionsForm.arrangeTime.sameCourseMinInterval.minIntervalDay" :disabled="!conditionsForm.arrangeTime.sameCourseMinInterval.need"></el-input>天安排
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeTime.sameCourseInSameTime">同一课程，同一授课形式的尽量安排在每周同一时间、课节</el-checkbox>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeTime.practiceCourseMaxInterval.need">实验课距其对应的理论课最大间隔<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeTime.practiceCourseMaxInterval.intervalDays" :disabled="!conditionsForm.arrangeTime.practiceCourseMaxInterval.need"></el-input>个工作日</el-checkbox>
							</div>
					    </el-tab-pane>
					    <el-tab-pane label="授课场地约束" name="second">
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangePlace.isAcrossCampus.need">教师不可跨校区授课的课节为</el-checkbox>
									<span class="m10">第<el-form-item prop="arrangePlace.isAcrossCampus.ncStartLesson">
									    <el-input size="mini" class="auto-input" v-model="conditionsForm.arrangePlace.isAcrossCampus.ncStartLesson" :disabled="!conditionsForm.arrangePlace.isAcrossCampus.need"></el-input>
									</el-form-item>~<el-form-item prop="arrangePlace.isAcrossCampus.ncEndLesson">
									    <el-input size="mini" class="auto-input" v-model="conditionsForm.arrangePlace.isAcrossCampus.ncEndLesson" :disabled="!conditionsForm.arrangePlace.isAcrossCampus.need"></el-input>
									</el-form-item>课节</span>和<span class="m10">第<el-input size="mini" class="auto-input" v-model="conditionsForm.arrangePlace.isAcrossCampus.secStartLesson" :disabled="!conditionsForm.arrangePlace.isAcrossCampus.need"></el-input>~<el-input size="mini" class="auto-input" v-model="conditionsForm.arrangePlace.isAcrossCampus.secEndLesson" :disabled="!conditionsForm.arrangePlace.isAcrossCampus.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangePlace.studentCanNotAcrossCampus.need">学生不可跨校区上课的课节为</el-checkbox>
								<span class="m10">第<el-input size="mini" class="auto-input" v-model="conditionsForm.arrangePlace.studentCanNotAcrossCampus.firStartLesson" :disabled="!conditionsForm.arrangePlace.studentCanNotAcrossCampus.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangePlace.studentCanNotAcrossCampus.firEndLesson" :disabled="!conditionsForm.arrangePlace.studentCanNotAcrossCampus.need"></el-input>课节</span>和<span class="m10">第<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangePlace.studentCanNotAcrossCampus.secStartLesson" :disabled="!conditionsForm.arrangePlace.studentCanNotAcrossCampus.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangePlace.studentCanNotAcrossCampus.secEndLesson" :disabled="!conditionsForm.arrangePlace.studentCanNotAcrossCampus.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox  v-model.number="conditionsForm.arrangePlace.sameClassAndLessonScheduleSameRoom">同一上课班、同一课程尽量安排在相对固定的教室</el-checkbox>
							</div>
							<div class="condition-item">
								<el-checkbox v-model.number="conditionsForm.arrangePlace.diffScheduleSameArea">同一教师同一授课形式相同的课程不同上课班优先安排在同一个场地或楼栋</el-checkbox>
							</div>
							<div class="condition-item">
								<el-checkbox  v-model.number="conditionsForm.arrangePlace.buildingDis.need">同一校区相邻两次课楼栋距离不能超过<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangePlace.buildingDis.disNum" :disabled="!conditionsForm.arrangePlace.buildingDis.need"></el-input>米</el-checkbox>
							</div> 
							<div class="condition-item">
								<el-checkbox v-model.number="conditionsForm.arrangePlace.priorityMajorCourse">根据场地所属院系优先安排该院系专业下的课程</el-checkbox>
							</div>
					    </el-tab-pane>
					    <el-tab-pane label="排课课程约束" name="third">
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.coursePriorityHeight.need">课程优先级为：高 </el-checkbox>
								<span class="m10">第一优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityHeight.startLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityHeight.need"></el-input>
									~
									<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityHeight.endLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityHeight.need"></el-input>课节</span>
								<span class="m10">第二优先<el-input size="mini" class="auto-input"  v-model.number="conditionsForm.arrangeCourse.coursePriorityHeight.secStartLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityHeight.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityHeight.secEndLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityHeight.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.coursePriorityLow.need">课程优先级为：低 </el-checkbox>
								<span class="m10">
									第一优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityLow.startLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityLow.need"></el-input>
									~
									<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityLow.endLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityLow.need"></el-input>课节</span>
								<span class="m10">第二优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityLow.secStartLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityLow.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.coursePriorityLow.endStartLession" :disabled="!conditionsForm.arrangeCourse.coursePriorityLow.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox  v-model="conditionsForm.arrangeCourse.optionalRestrait.need">选修课排课约束</el-checkbox>
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseStartWeek" clearable :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								~
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseEndWeek" clearable :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								<span class="m10">第一优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseFirstStartWeek" :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseFirstEndWeek" :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need"></el-input>课节</span>
								<span class="m10">第二优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseSecStartWeek" :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.optionalRestrait.optionalCourseSecEndWeek" :disabled="!conditionsForm.arrangeCourse.optionalRestrait.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.requiredCourse.need">必修课排课约束</el-checkbox>
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.requiredCourse.requiredCourseStartWeek" clearable :disabled="!conditionsForm.arrangeCourse.requiredCourse.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								~
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.requiredCourse.requiredCourseEndWeek" clearable :disabled="!conditionsForm.arrangeCourse.requiredCourse.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								<span class="m10">第一优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.requiredCourse.firstPriorityStartLesson" :disabled="!conditionsForm.arrangeCourse.requiredCourse.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.requiredCourse.firstPriorityEndLesson" :disabled="!conditionsForm.arrangeCourse.requiredCourse.need"></el-input>课节</span>
								<span class="m10">第二优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.requiredCourse.SecPriorityStartLesson" :disabled="!conditionsForm.arrangeCourse.requiredCourse.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.requiredCourse.SecPriorityEndLesson" :disabled="!conditionsForm.arrangeCourse.requiredCourse.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.practiceCourseRestrait.need">实践课排课约束</el-checkbox>
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseStartWeek" clearable :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								~
								<el-select size="mini" v-model="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseEndWeek" clearable :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need">
									<el-option v-for="item in weeksList" :label="item.day" :value="item.id" :key="item.id"></el-option>
								</el-select>
								<span class="m10">第一优先<el-input size="mini" v-model="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseFirstStartLesson" class="auto-input" :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseFirstEndLesson" :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need"></el-input>课节</span>
								<span class="m10">第二优先<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseSecStartLesson" :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need"></el-input>~<el-input size="mini" class="auto-input" v-model.number="conditionsForm.arrangeCourse.practiceCourseRestrait.practiceCourseSecEndLesson" :disabled="!conditionsForm.arrangeCourse.practiceCourseRestrait.need"></el-input>课节</span>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.sameCourseSync">同一课程、不同上课班每周排课进度尽量同步;</el-checkbox>
							</div>
							<div class="condition-item">
								<el-checkbox v-model="conditionsForm.arrangeCourse.sameGroupSync">同一个上课班各小组进度需要同步;</el-checkbox>
							</div>
					    </el-tab-pane>
					</el-tabs>
				</el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCloseResult">取 消</el-button>
                <el-button type="primary" @click="goSecondStepHandle">开始排课</el-button>
            </span>
        </el-dialog>
        <!-- 开始自动排课弹窗 -->
        <el-dialog
        	title="自动排课"
        	:visible.sync="dialog.visibleStep2"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="550px"
            custom-class="auto-conditional-dialog">
			<el-form :model="submitForm" ref="submitForm" label-width="130px">
				<el-form-item label="学期">
				    <el-select v-model="submitForm.semesterId" clearable @change="findName">
						<!-- <el-option label="全部" value=""></el-option> -->
						<el-option v-for="item in semesterList" :label="item.name" :value="item.id" :key="item.id"></el-option>
				    </el-select>
				</el-form-item>
			</el-form>
			<div class="tip">
				<p>欢迎使用计算机自动排课！</p>
				<p>所选课程的课表将重新自动编排，现有的课表数据将被新的排课结果覆盖。</p>
			</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="goThirdStepHandle">开始自动排课</el-button>
            </span>
        </el-dialog>
        <!-- 进度条 -->
        <el-dialog
        	title="自动排课"
        	:visible.sync="dialog.visibleStep3"
        	:close-on-click-modal="false"
            :modal-append-to-body="false"
            custom-class="progress-dialog"
        	width="550px">
        	<p>正在排课，请稍候.....</p>
			<el-progress :stroke-width="10" :percentage="progress"></el-progress>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="cancelSubmit">取 消</el-button> -->
			</span>
        </el-dialog>
        <!-- 自动排课结果弹窗 -->
        <el-dialog
        	:title="`自动排课报告：${resultStatus == 1 ? '成功' : '失败'}`"
        	:visible.sync="dialog.visibleStep4"
        	:close-on-click-modal="false"
            :modal-append-to-body="false"
        	width="550px">
			<div class="report-box">
				<div class="report-item">
					<p>【排课时间】</p>
					<p>2019年01月22日 10时06分40秒</p>
				</div>
				<template>
					<div class="report-item">
						<p>【基础数据】</p>
						<p>
							<span>上课班：2014级电子医学18年上课班</span>
							<span>排课课程：古文诗词</span>
							<span>授课老师：人文1</span>
							<span>排课场地：301教室</span>
						</p>
					</div>
					<div class="report-item">
						<p>【自动排课结果】</p>
						<p>排课成功！您可以查看并可以调整课表</p>
					</div>
				</template>
				<template>
					<!-- <p>失败信息</p> -->
				</template>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" ref="bbt" v-if="resultStatus == 1" @click="courseSheetPrview">课表预览</el-button>
				<el-button @click="dialogCloseResult">取 消</el-button>	
			</span>
        </el-dialog>
	</div>
</template>
<script>
	import axios from 'axios';
	import util from '@/util';

export default {
    name: 'automatic_arrange',
    data() {
    	var checkNumber = (rule, value, callback) => {
    		if (!value) {
    			return callback(new Error('不能为空'));
    		} else if (!/^[0-9]+$/.test(value)) {

    			return callback(new Error('需为正整数'));
    		} else {
    			callback();
    		}
    	}
    	var validCheckbox = (rule, value, callback) => {
    		if (!value) {
    			return callback(new Error('请勾选该条件'));
    		} else {
    			callback();
    		}
    	}
        return {
            breadcrumb: [
                {label: "自动排课管理"},
                {label: "自动排课"}
            ],
            fold:{
                state:false,
                text:'展开',
                showBtn:false,
            },
            api:'http://192.168.5.139:8080',
            searchForm:{
            	semesterId:'',
            	status: ''
            },
            pageNo: 0,
            pageSize: 10,
            totalCount: 0,
            semesterList: [],
			tableList:[
                {label:'学期', prop:'semesterId'},
                {label:'排课状态', prop:'status'},
                {label:'发布', prop:'publishStatus'},
                {label:'创建日期', prop:'createTime'}
            ],
            tableData: [],
            tableLoading: false,
            dialog: {
            	visible: false,
            	visibleStep1: false,
            	visibleStep2: false,
            	visibleStep3: false,
            	visibleStep4: false
            },
            activeName: 'first',
            submitForm: {
            	constraint: {},
				semesterId: '',
				semesterName: '',
            },
            conditionsForm: {
            	arrangeTime: {
            		enableStartWeek: '', // 可排课周次从第 start~ 周
            		enableEndWeek: '',  // 可排课周次从第 ~ end周
            		relativeEquilibrium: '', // 每周课程总学时相对均衡
            		sameCourseMinInterval:{need: false, minIntervalDay: ''}, //同一课程一周多次课至少间隔 
            		sameCourseInSameTime: false, // 同一课程，同一授课形式的尽量安排在每周同一时间、课节
            		practiceCourseMaxInterval: {need: false, intervalDays: ''}, // 同一课程，同一授课形式的尽量安排在每周同一时间、课节
            	},
            	arrangePlace: {
            		isAcrossCampus: {need: false, ncStartLesson: '', ncEndLesson:'', secStartLesson:'', secEndLesson: ''}, // 老师不可跨样区的课节约束
            		studentCanNotAcrossCampus:{need: false, firStartLesson: '', firEndLesson: '', secStartLesson: '', secEndLesson: ''}, // 学生不可跨样区的课节约束
            		sameClassAndLessonScheduleSameRoom: false,
            		diffScheduleSameArea: false,
            		buildingDis:{need: false, disNum: ''},
            		priorityMajorCourse: false
            	},
            	arrangeCourse: {
            		coursePriorityHeight: {
            			need: false,
            			startLession: '',
	            		endLession: '',
	            		secStartLession: '',
	            		secEndLession: '',
            		},
            		coursePriorityLow:{
            			need: false,
            			startLession: '',
	            		endLession: '',
	            		secStartLession: '',
	            		secEndLession: '',
            		},
            		optionalRestrait:{
            			need: false,
	            		optionalCourseStartWeek:'',
	            		optionalCourseEndWeek: '',
	            		optionalCourseFirstStartWeek: '',
	            		optionalCourseFirstEndWeek: '',
	            		optionalCourseSecStartWeek: '',
	            		optionalCourseSecEndWeek: '',
            		},
            		requiredCourse: {
            			need: false,
            			requiredCourseStartWeek: '',
	            		requiredCourseEndWeek: '',
	            		firstPriorityStartLesson: '',
	            		firstPriorityEndLesson: '',
	            		SecPriorityStartLesson: '',
	            		SecPriorityEndLesson: '',
            		},
            		practiceCourseRestrait: {
            			need: false,
            			practiceCourseStartWeek: '',
	            		practiceCourseEndWeek: '',
	            		practiceCourseFirstStartLesson: '',
	            		practiceCourseFirstEndLesson: '',
	            		practiceCourseSecStartLesson: '',
	            		practiceCourseSecEndLesson: '',
            		},
            		sameCourseSync: false,
            		sameGroupSync: false
            	}
            },
            rules:{
            	arrangeTime:{
            		enableStartWeek:[
            			{validator: checkNumber, trigger:'blur'}
            		],
            		enableEndWeek: [
            			{validator: checkNumber, trigger:'blur'}
            		]
            	}
            },
            weeksList: [
            	{id:1, day:'星期一'},
                {id:2, day:'星期二'},
                {id:3, day:'星期三'},
                {id:4, day:'星期四'},
                {id:5, day:'星期五'},
                {id:6, day:'星期六'},
                {id:7, day:'星期日'}
            ],
            gradeList: [],
            majorList: [],
            semesterList: [],
            courseList: [],
            progress: 0,
            resultStatus: '',
            progressTimer: null,
            cancelPost: null,
            source: null,
            autoScheduleId: ''
        };
    },
    created (){
    	this.getMajorList();
    	this.getTermData();
    	this.getSemesterCourse();
    	this.onSearch();
    },
    methods: {
    	formatDate (row){
    		let semester ;
    		this.semesterList.map(item => {
    			if (item.id == row.semesterId) {
    				semester = item.name;
    			}
    		})
    		return semester;
    	},
    	findName (val){
    		for (var i = 0; i < this.semesterList.length; i++) {
    			if (val == this.semesterList[i].id) {
    				this.submitForm.semesterName = this.semesterList[i].name;
    			}
    		}
    	},
    	ctrlInput (val, test){
    
    	},
    	onSearch (){
    		let param1 = `&terms[0].column=semester_id&terms[0].value=${this.searchForm.semesterId}&terms[0].type=and`;
    		let param2 = ` &terms[1].column=status&terms[1].value=${this.searchForm.status}&terms[1].type=and`
    		// let query = `http://192.168.5.175:8060/auto/schedule/schedule?pageIndex=${this.pageNo}&pageSize=${this.pageSize}`;
    		let query = `_as:/schedule?pageIndex=${this.pageNo}&pageSize=${this.pageSize}`;

    		this.tableLoading = true;
    		if (this.searchForm.semesterId) {
    			query += param1
    		}
    		if (String(this.searchForm.status).length > 0) {
    			query += param2
    		}

    		this.$http.get(encodeURI(query)).then(res => {
    			this.tableLoading = false;
    			this.tableData = res.result.data;
    			this.totalCount = res.result.total;
    		}).catch(err => {
    			this.tableLoading = false;
    		})
    	},
    	sizeChange (val){
    		this.pageNo = 0;
    		this.pageSize = val;
    		this.onSearch();
    	},
    	currentChange (val){
    		this.pageNo = val - 1;
    		this.onSearch();
    	},
    	addTask (){
    		this.dialog.visibleStep1 = true;
    		if (this.tableData.length > 0) {
    			this.$http.get(`_as:/schedule/constraint`).then(res => {
	    			if (Object.keys(res.result).length > 0) {
	    				this.conditionsForm = res.result;
	    			}
	    		})
    		}
    	},
    	dialogClose (){
    		this.dialog.visibleStep1 = false;
    		this.dialog.visibleStep2 = false;
    	},
    	arrangeCourseReport (row){
    		this.autoScheduleId = row.id;
    		this.resultStatus = row.status;
    		this.dialog.visibleStep4 = true;
    	},
    	dialogCloseResult (){
    		this.dialog.visibleStep1 = false;
    		this.dialog.visibleStep2 = false;
    		this.dialog.visibleStep4 = false;
    	},
    	// 发布 
    	handlePublish (row){
    		this.submitPushCourse('发布', 1, row);
    	},
    	// 撤销发布
    	handleCancel (row){
    		this.submitPushCourse('撤回发布', 0, row);
    	},
    	submitPushCourse (msg, publishStatus, row){
    		this.$confirm(`确定${msg}`, '提示',  {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
            }).then(() => {
            	let params = {...row};
            	if (publishStatus == 1) {
            		params.publishStatus = 1;
            	} else {
            		params.publishStatus = 0;
            	}

            	this.$http.put(`_as:/schedule/${row.id}`, params).then(res => {
	    			if (res.status == 200 || res.status == 201) {
	    				// 发布成功 
	    				this.$message.success(`${msg}成功`)
	    				this.onSearch();
	    			}
	    		})
            })
    	},
    	handleDelete (row){
			this.$confirm(`此操作将永久删除该信息, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            	// this.$http.delete(`http://192.168.5.175:8060/schedule/hard/${row.id}`).then(res => {
            	this.$http.delete(`_as:/schedule/${row.id}`).then(res => {
            		let type = 'success';
                    let message = '删除成功!'

                    if(res.status==200 || res.status == 201){
                        if(this.tableData.length==1){
                            this.pageNo = 0;
                        }
                        this.onSearch();
                    }else{
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        type: type,
                        message: message
                    });
            	})
            })
    	},
    	transferToArr (tagName, propObj, firStartKey, firEndKey, secStartKey, secEndKey){
    		let obj = this.conditionsForm[tagName][propObj];
    		let resultArr = [];
    		let arr1 = [];
    		let arr2 = [];
    		let n11 = obj[firStartKey];
    		let n12 = obj[firEndKey];
    		let n21 = obj[secStartKey];
    		let n22 = obj[secEndKey];
    		if (n11 && n12) {
    			arr1.push(n11);
    			arr1.push(n12);
    		}
    		if (n21 && n22) {
    			arr2.push(n21);
    			arr2.push(n22);
    		}
    		if (arr1.length > 0 && arr2.length < 1) {
    			resultArr = Array.from([arr1])
    		} else if (arr1.length < 1 && arr2.length > 0) {
    			resultArr = Array.from([arr2])
    		} else if (arr1.length > 0 && arr2.length > 0) {
    			resultArr = Array.from([arr1, arr2]);
    		}

    		let result = this.filterEmptyArray(resultArr);

    		return result;
    	},
    	/**
    	 * [filterEmptyArray 如果传入的数组为空 则过滤掉]
    	 * @param  {[type]} args [description]
    	 * @return {[Array]}      [description]
    	 */
    	filterEmptyArray (args){
    		let newArr = [];

    		for (var i = 0; i < arguments.length; i++) {
    			newArr = arguments[i];
    		}
    		return newArr;
    	},
    	goSecondStepHandle (){
    		this.$refs['conditionsForm'].validate((valid) => {
    			if (valid) {
    				// ---数组自身开始值与结束值比较--授课场地(以下调用参数即是约束块  约束条件字段 约束输入械字段)
    				let isAcrossCampusArr = this.transferToArr('arrangePlace', 'isAcrossCampus', 'ncStartLesson', 'ncEndLesson', 'secStartLesson', 'secEndLesson');
    				let studentCanNotAcrossCampusArr = this.transferToArr('arrangePlace', 'studentCanNotAcrossCampus', 'firStartLesson', 'firEndLesson', 'secStartLesson', 'secEndLesson');
    				// ---数组自身开始值与结束值比较--排课课程约束
    				let coursePriorityHeightSecArr = this.transferToArr('arrangeCourse', 'coursePriorityHeight', 'secStartLesson', 'secEndLesson');
    				let coursePriorityLowSecArr = this.transferToArr('arrangeCourse', 'coursePriorityLow', 'secStartLesson', 'secEndLesson');
    				//---数组自身开始值与结束值比较--排课课程约束-->选修排课--优先
    				let optionalRestraitArr = this.transferToArr('arrangeCourse', 'optionalRestrait', 'optionalCourseFirstStartWeek', 'optionalCourseFirstEndWeek', 'optionalCourseSecStartWeek', 'optionalCourseSecEndWeek');
    				//---数组自身开始值与结束值比较--排课课程约束-->必修优先
    				let requiredCourseArr = this.transferToArr('arrangeCourse', 'requiredCourse', 'firstPriorityStartLesson', 'firstPriorityEndLesson', 'SecPriorityStartLesson', 'SecPriorityEndLesson');
    				//---数组自身开始值与结束值比较--排课课程约束-->实践课优先
    				let practiceCourseRestraitArr = this.transferToArr('arrangeCourse', 'practiceCourseRestrait', 'practiceCourseFirstStartLesson', 'practiceCourseFirstEndLesson', 'practiceCourseSecStartLesson', 'practiceCourseSecEndLesson');

    				// 排课课程约束 课程优先级高与低比较
    				let coursePriorityHeightArr = this.transferToArr('arrangeCourse', 'coursePriorityHeight', 'startLession', 'endLession');
    				let coursePriorityLowArr = this.transferToArr('arrangeCourse', 'coursePriorityLow', 'startLession', 'endLession');

    				let vArr = [isAcrossCampusArr,studentCanNotAcrossCampusArr,coursePriorityHeightSecArr,coursePriorityLowSecArr,optionalRestraitArr,requiredCourseArr,practiceCourseRestraitArr];

    				for (var i = 0; i < vArr.length; i++) {
    					let mr = this.validate(vArr[i]);
    					if(!mr) return false;
    				}

    				let r = this.validate(coursePriorityHeightArr, coursePriorityLowArr);
    			
    				if (!r) return false;
    				this.dialog.visibleStep1 = false;
    				this.dialog.visibleStep2 = true;
    			} else {
    				this.activeName = 'first';
    			}
    		})
    	},
    	// 新增
    	goThirdStepHandle (){
    		let params = {};
    		this.dialog.visibleStep2 = false;
    		this.dialog.visibleStep3 = true;
    		this.submitForm.constraint = this.conditionsForm;

    		// 提交自动排课约束时 如果没有选中复选框 则清空输入框所填写的约束条件数据
    		for(let key in this.conditionsForm) { // 对应三个标签
    			for (let childKey in this.conditionsForm[key]) {
    				if (Object.prototype.toString.call(this.conditionsForm[key][childKey])==='[object Object]') {
    					if (!this.conditionsForm[key][childKey].need) {
    						for (let childInnerKey in this.conditionsForm[key][childKey]) {
    							if (childInnerKey != 'need') {
    								this.conditionsForm[key][childKey][childInnerKey] = '';
    							}
    						}
    					}
    				}
    			}
    		}

    		// this.$http.post(`http://192.168.5.175:8060/auto/schedule/schedule/begin`, this.submitForm).then(res => {
    		this.$http.post(`_as:/schedule/begin`, this.submitForm).then(res => {
    			if (res.status == 200 || res.status == 201) {
    				this.onSearch();
    				this.dialog.visibleStep3 = false;
    			}
    		}).catch(err => {
    			this.dialog.visibleStep3 = false;
    		})

    	
    	},
    	cancelSubmit (){
    		let _this = this;
    		this.dialog.visibleStep3 = false;
    		// this.cancelPost();
    		this.source.cancel('取消请求');
    		this.progress = 0;
    		
    		if (this.progressTimer) {
    			clearInterval(_this.progressTimer);
    		}
    	},
    	getMajorList(){
            this.$http.get("_op:/major/combox").then(data=>{
                if(data.code==0){
                    this.majorList = data.data;
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        courseSheetPrview (row){
        	if (row.id) {
        		this.autoScheduleId = row.id;
        	}

    		this.$router.push({
    			path:'/teaching_management/class_schedule_preview',
    			query:{
    				autoScheduleId: this.autoScheduleId // row.id
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
                    this.semesterList = data.data.reverse();;
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
     //    getSemesterCourse(str){//排课课程
    	// 	this.loading = true;
    	// 	this.$http.post("_ed:/semestercourse/list2",{
    	// 		str:str
    	// 	}).then(data=>{
    	// 		this.courseList=data.data;
     //        }).catch(()=>{
     //        })
    	// },
    	getSemesterCourse(str){//排课课程
    		this.loading = true;
    		this.$http.post("_ed:/exchangecourse/query/semestercourse",{
    			str:str
    		}).then(data=>{
    			this.courseList=data.data;
    			// this.loading = false;
            }).catch(()=>{
            })
		},
		coreCompare (arr1, arr2){
			// let com1A = arr2[0] - arr1[0];
			// let com1B = arr2[0] - arr1[1];
			// let com2A = arr2[1] - arr1[0];
			// let com2B = arr2[1] - arr1[1];

			// let com1A = arr2[0] - arr1[0];
			// let com1B = arr2[1] - arr1[0];
			// let com2A = arr2[1] - arr1[0];
			// let com2B = arr2[1] - arr1[1];
			
			let com1A = arr2[0] - arr1[0];
			let com1B = arr2[1] - arr1[0];
			let com2A = arr2[0] - arr1[1];
			let com2B = arr2[1] - arr1[1];

			// if (!((com1A < 0 || com1B > 0) && (com2A < 0 || com2B > 0))) {
			if (!((com1A < 0 && com1B < 0) || (com2A > 0 && com2B > 0))) {
				// 设置的区间已在已设置的区间值内  不成立
				this.$message.error('设置的区间不能在已设置的区间值内')
				return false;
			}

			return true;
		},
		/**
		 * [validate 约束条件冲突检查]
		 * @param  {[type]} arr  [同一个约束条件设置值的数组 例： 教师场地约束->老师不可跨校区授课主题主题课节 [[1,3],[5,6]]]
		 * @param  {[type]} arr2 [比较的另外同一个约束条件设置值的数组 例：[[1,3],[5,6]]]
		 * @return {[boolean]}      [true or false]
		 */
		validate (arr, arr2){ // arr = [[22,3],[33,3]]
			if (arr && arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i][0]-arr[i][1] > 0) {
						// msg = 设置的初始值不能大于结束值
						this.$message.error('设置的初始值不能大于结束值');
						return false;
					}
				}
			}
			if (arr2 && arr2.length > 0) {
				for (var i = 0; i < arr2.length; i++) {
					if (arr2[i][0]-arr2[i][1] > 0) {
						// msg = 设置的初始值不能大于结束值
						this.$message.error('设置的初始值不能大于结束值');
						return false;
					}
				}
				for (var j = 0; j < arr2.length; j++) {
					if (arr2.length > 1 && j < (arr2.length - 1)) { // 自身大数组内不同数组先进行比较
						if (!this.coreCompare(arr2[j], arr2[j+1])) {
							return false;
						};
					}
				}
			}

			// 首先自身数组有多个数组时  进行自身多个数组之间的比较
			for (var i = 0; i < arr.length; i++) {
				if (arr.length > 1 && i < (arr.length - 1)) { // 自身大数组内不同数组先进行比较
					if (!this.coreCompare(arr[i], arr[i+1])) {
						return false
					};
				}
				if (arr2 && arr2.length > 0) {
					for (var j = 0; j < arr2.length; j++) {
						if (arr2.length > 1 && j < (arr2.length - 1)) { // 自身大数组内不同数组先进行比较
							if (!this.coreCompare(arr2[j], arr2[j+1])) {
								return false;
							};
						}
						if (!this.coreCompare(arr[i], arr2[j])) { // 两个大数组（不同条件设置）进行比较
							return false;
						}
					}
				}
			}

			return true;
		}
    },
    filters: {
    	formatime: util.getTime1
    }
};
</script>
<style lang="less" scoped>
	.auto-conditional-dialog{
		.condition-item{
			margin: 15px 0;
			line-height: 28px;
			.m10{
				margin:0 15px;
			}
			/deep/ .el-form-item{
				margin-bottom: 0;
				margin-right: 0;
			}
			/deep/ .el-form-item__content{
				line-height: 28px;
			}
			.auto-input{
				width: auto;
				display: inline-block;
			}
			/deep/ .el-input__inner{
				margin:0 5px;
				width:50px;
				padding-left: 5px;
				padding-right: 5px;
			}
			/deep/ .el-select{
				.el-input__inner{
					width: 70px;
				}
			}
			/deep/ .el-checkbox{
				cursor: default;
				&.is-checked{
					.el-checkbox__label{
						color:#666;
					}
				}
				
			}
		}
	}
</style>