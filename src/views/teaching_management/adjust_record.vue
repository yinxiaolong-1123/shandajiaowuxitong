<!--调课记录查询  -->
<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-if="btnPerObj.query">
                          	<el-button type="primary" @click="onSubmit">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          	<el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <!-- <el-form-item class="right">
                            <el-checkbox v-model="formInline.isHandle">跟我调课的数据需要同意</el-checkbox>
                        </el-form-item> -->
                        
                        <el-form-item label="学期">
                            <el-select v-model="tempSelect" filterable @change="setSemesterId">
                            	<el-option v-for="(item, index) in termList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请日期">
                            <el-date-picker
								style="width:300px;"
						      	v-model="dateRange"
						      	type="daterange"
						      	align="right"
						      	unlink-panels
						      	range-separator="至"
						      	start-placeholder="开始日期"
						      	end-placeholder="结束日期"
						      	value-format="yyyy-MM-dd"
						      	:picker-options="pickerOptions">
						    </el-date-picker>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.semesterCourseId"  clearable  filterable placeholder="请选择">
                                <el-option v-for="item in scheduleList" :key="item.name" :label="item.displayName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <!--<el-form-item label="课程名称">
                            <el-select v-model="formInline.courseNameId" placeholder="请选择">
                                <el-option v-for="item in courseList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>-->

                        <el-form-item label="状态">
                            <el-select v-model="formInline.status" clearable  placeholder="请选择">
                                <el-option label="处理中" :value="0"></el-option>
                                <el-option label="调课成功" :value="1"></el-option>
                                <el-option label="调课失败" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="调课类型">
                            <el-select v-model="formInline.exchangeType" clearable  filterable placeholder="请选择">
                            	<el-option label="统一调课" :value="1"></el-option>
                                <el-option label="取消调课" :value="2"></el-option>
                                <el-option label="单独调课" :value="3"></el-option>
                                <el-option label="互调课程" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- <div class="btn" v-if="btnPerObj.exchange">
                        <el-button size="mini" type="primary" @click="batchAdjustment">申请调课</el-button>
                    </div> -->
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
				size="mini"
				style="width:98%;"
                header-row-class-name="cm-dark">
            	<el-table-column type="index" label="序号" fixed></el-table-column>
            	
            	<el-table-column prop="courseArrange" label="排课课程"  width="200"></el-table-column>
            	<el-table-column label="授课日期" width="85">
            		<template slot-scope="scope">{{ scope.row.scheduleitemDate | dateFn}}</template>
            	</el-table-column>
            	<el-table-column prop="sectionNodenames" label="授课课节" width="70"></el-table-column>
				<el-table-column prop="areaName" label="场地" ></el-table-column>
            	<el-table-column label="调课类型" width="70">
            		<template slot-scope="scope">{{scope.row.exchangeType | exchangeTypeFn}}</template>
            	</el-table-column>
            	<el-table-column label="状态" width="70">
            		<template slot-scope="scope">{{scope.row.status | statusFn}}</template>
            	</el-table-column>
            	<el-table-column label="调整后日期" width="85">
            		<template slot-scope="scope">{{ scope.row.ndscheduleitemDate | dateFn }}</template>
            	</el-table-column>
            	<el-table-column prop="ndsectionNodenames" label="调整后课节" width="90"></el-table-column>
				<el-table-column prop="ndareaName" label="调整后场地" ></el-table-column>
            	<el-table-column prop="ndTeacherNames" label="被调课老师" width="90"></el-table-column>
            	<el-table-column prop="applyTeacherName" label="调课老师" width="70"></el-table-column>
            	<el-table-column label="申请日期" width="85">
            		<template slot-scope="scope">{{ scope.row.applyDate | dateFn }}</template>
            	</el-table-column>
                <el-table-column label="当前审批人" prop="nextApprover" width="85"></el-table-column>
                <el-table-column
                    v-if="btnPerObj.detail||btnPerObj.revoke"
                    label="操作"
                    width="80"
                    fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button @click="exchangeDetail(scope.row)" type="text" size="small" v-if="btnPerObj.detail">查看详情</el-button> -->
						<el-button @click="openDialogs(1,scope.row.id)" type="text" size="small" v-if="btnPerObj.detail">查看详情</el-button>
                        <!-- <template v-if="scope.row.status == 0 ">
                        	<el-button v-if="scope.row.needMe == 0" @click="revoke(scope.row)" type="text" size="small">撤回</el-button>
                        	<el-button v-else @click="handleFn(scope.row)" type="text" size="small">处理</el-button>
                        </template> -->
                    </template>
                </el-table-column>
                
            </el-table>
            
        </div>
        
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="formInline.requestPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="formInline.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 批量调整时间 -->
        
        
        
        <!--查看审核记录-->
        <el-dialog 
        	title="审核记录" 
        	:visible.sync="viewRecordMark" 
        	:modal-append-to-body="false" 
        	width="50%"
        	class="apply-detail-dialog">	
        	<div class="cm-table">
		        <el-table
	                ref="multipleTable"
	                :data="gridData"
	                border
	                style="width: 100%"
	                header-row-class-name="cm-dark">               
	                <el-table-column type="index" label="序号" width="50"></el-table-column>
	                <el-table-column prop="auditRole" label="角色" width="100"></el-table-column>
					 <el-table-column prop="auditName" label="审核人" width="100"></el-table-column>
	                <el-table-column label="审核日期" width="150">
	                	<template slot-scope="scope">{{scope.row.auditDate|dateFns}}</template>
	                </el-table-column>
					<el-table-column label="审核意见">
						<template slot-scope="scope">{{scope.row.remark}}</template>
					</el-table-column>
	                <el-table-column label="审核结果"  width="100">
	                	<template slot-scope="scope">{{scope.row.auditResult==0?'通过':'不通过'}}</template>
	                </el-table-column>
	            </el-table>
	        </div>
        </el-dialog>
        
        
        
        <!-- 再次申请调课 -->
        <el-dialog
        	title="再次申请调课"
        	:visible.sync="applyClassMark"
        	:modal-append-to-body="false"
           	width="50%">
            <el-form :inline="true" size="mini" label-width="100px">
        		<el-form-item label="排课课程">{{dialogExChangeCourseDetail.courseArrange}}</el-form-item>
				<el-form-item label="授课日期">{{dialogExChangeCourseDetail.scheduleitemDate|dateFn}}</el-form-item>
				<el-form-item label="课节">{{dialogExChangeCourseDetail.sectionNodenames}}</el-form-item>
			</el-form>
			<el-form size="mini" label-width="100px">
				<el-form-item label="调课理由">
				    <el-input type="textarea" v-model="dialogExChangeCourseDetail.exchangeExcuse"></el-input>
				</el-form-item>
			
			</el-form>
			<el-form :inline="true" size="mini" label-width="100px">	
				<el-form-item label="调课类型">
				    <el-select v-model="dialogExChangeCourseDetail.exchangeType" placeholder="请选择活动区域">
				      <el-option label="单独调课" value="3"></el-option>
				      <el-option label="课程互换" value="4"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label=" " v-if="dialogExChangeCourseDetail.exchangeType == 3">
				    <el-radio v-model="dialogExChangeCourseDetail.singleType" label="2">更改授课时间地点</el-radio>
					<el-radio v-model="dialogExChangeCourseDetail.singleType" label="1">更改老师</el-radio>
				</el-form-item>
			</el-form>
			<el-form size="mini" label-width="100px">
				<el-form-item label="辅助说明" v-if="dialogExChangeCourseDetail.exchangeType == 3">
				    <el-input type="textarea" v-model="dialogExChangeCourseDetail.instruction"></el-input>
				</el-form-item>
			<!--选择课程-->
				<el-form-item label="指定互换" v-if="dialogExChangeCourseDetail.exchangeType == 4">
				 	<el-button type="primary" @click="openselectDialog">选择互换课程</el-button>
					
				    <table class="stationtable" style="margin-top: 10px;">
		        		<tr class="textweight"><td class="title"></td><td style="width: 40%;">原信息</td><td style="width: 40%;">互换信息</td></tr>
		        		<tr>
		        			<td class="title">排课名称</td>
		        			<td>{{ dialogExChangeCourseDetail.courseArrange }}</td>
		        			<td>{{ dialogExChangeCourseDetail.replacedCourseArrange }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课地点</td>
		        			<td>{{ dialogExChangeCourseDetail.areaName }}</td>
		        			<td>{{ dialogExChangeCourseDetail.ndareaName }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课形式</td>
		        			<td>{{ dialogExChangeCourseDetail.teachingFormName }}</td>
		        			<td>{{ dialogExChangeCourseDetail.ndteachingFormName }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课日期</td>
		        			<td>{{ dialogExChangeCourseDetail.scheduleitemDate | dateFn }}</td>
		        			<td>{{ dialogExChangeCourseDetail.ndscheduleitemDate | dateFn }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课课节</td>
		        			<td>{{ dialogExChangeCourseDetail.sectionNodenames }}</td>
		        			<td>{{ dialogExChangeCourseDetail.ndsectionNodenames }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课老师</td>
		        			<td>{{ dialogExChangeCourseDetail.teacherNames }}</td>
		        			<td>{{ dialogExChangeCourseDetail.ndTeacherNames }}</td>
		        		</tr>
		        	</table>
				</el-form-item>
            </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="applyClassMark=false">取  消</el-button>
	            <el-button type="primary" @click="applyClassFn">确  定</el-button>
	        </span>
        </el-dialog>



        <!-- 申请互换选择老师弹窗 -->
        <el-dialog
        	title="选择互换课程"
        	:visible.sync="exchangeEachOther.visible"
        	:modal-append-to-body="false"
           	width="80%">
           	<div class="cm-fold">
	            <el-form :inline="true" size="mini" :model="exchangeEachOther.selectTeacherForm">
					<el-form-item label="授课日期">
	                    <el-date-picker
					      	v-model="selectDateRange"
					      	type="daterange"
					      	align="right"
					      	unlink-panels
					      	range-separator="至"
					      	start-placeholder="开始日期"
					      	end-placeholder="结束日期"
					      	value-format="yyyy-MM-dd"
					      	:picker-options="pickerOptions">
					    </el-date-picker>
	                </el-form-item>
	                <el-form-item label="授课老师">
	                    <el-select v-model="exchangeEachOther.selectTeacherForm.teacherId" filterable clearable placeholder="全部">
	                        <el-option  v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                    </el-select>
	                </el-form-item>
	
	                <el-form-item label="上课班">
	                    <el-select v-model="exchangeEachOther.selectTeacherForm.clsId" clearable placeholder="全部">
	                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                    </el-select>
	                </el-form-item>
	
	                <el-form-item label="授课场地">
	                    <el-select 
	                    	v-model="exchangeEachOther.selectTeacherForm.areaId" 
	                    	filterable 
	                    	remote
	                    	reserve-keyword
	                    	clearable
	                    	:remote-method="searchAreaName"
	                    	placeholder="请输入搜索关镇键词">
	                    	<el-option v-for="item in placeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
	                    </el-select>
	                </el-form-item>
	                
	                <el-form-item label="排课课程">
	                    <el-select v-model="exchangeEachOther.selectTeacherForm.courseId" clearable placeholder="全部">
	                    	<el-option v-for="list in scheduleList" :key="list.id" :label="list.displayName" :value="list.id"></el-option>
	                    </el-select>
	                </el-form-item>
					
	                <el-form-item label="课节">
	                    <el-select v-model="exchangeEachOther.selectTeacherForm.sectionNodeids" multiple placeholder="请选择课节">
	                        <el-option v-for="(item, index) in lessonList" :label="item.name" :value="item.id" :key="index"></el-option>
	                    </el-select>
	                </el-form-item>
	            
	                <el-form-item>
	                	<el-button type="primary" size="mini" @click="selectExchangeCourse">查询</el-button>
	                </el-form-item>
	            </el-form>
			</div>
			<!-- 选择调课弹窗 -->
			<div class="cm-table">
	            <el-table
	            	size="mini"
                    ref="multipleTable"
                    :data="exchangeEachOther.selectExchangeTeacherData"
                    border
                    style="width: 100%;margin-top: 10px;"
                    header-row-class-name="cm-dark">
	                <el-table-column type="index" prop="序号"></el-table-column>
	                <el-table-column v-for="(item,index) in exchangeEachOther.tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
	                	<template slot-scope="scope">
	                		<template v-if="item.prop==='scheduleitemDate'">
	                			{{ scope.row.scheduleitemDate | dateFn }}
	                		</template>
	                		<template v-else>
	                			{{scope.row[item.prop]}}
	                		</template>
	                	</template>
	                </el-table-column>
	                <el-table-column
	                    label="操作"
	                    width="100"
	                    fixed="right">
	                    <template slot-scope="scope">
	                        <el-button @click="selectExchangeTeacher(scope.row)" type="text" size="small">选择</el-button>
	                    </template>
	                </el-table-column>
	            </el-table>
        	</div>
	        <div class="cm-pagination">
	            <el-pagination
	                background
	                :current-page="exchangeEachOther.selectTeacherForm.requestPage"
	                :page-sizes="[10, 20, 50, 100]"
	                :page-size="exchangeEachOther.selectTeacherForm.pageSize"
	                layout="total, sizes, prev, pager, next, jumper"
	                :total="exchangeEachOther.selectTeacherForm.total"
	                @size-change="otherSizeChange"
	                @current-change="otherCurrentChange">
	            </el-pagination>
	        </div>
        </el-dialog>

		<!-- 调课详情 -->
		<approval-detail v-if="detailMark"
			:dialogVisible.sync="detailMark" 
			:dialogTitle="dialogTitle"
            :showType="showType"
            :recoreid="recoreid">
		</approval-detail>
	
	
	</section>
</template>

<script>
	import util from '@/util';
	import moment from 'moment';
	import approvalDetail from './approval/approval_detail';

    import {mapState} from 'vuex';

	export default {
		data(){
			return {
		        btnPerObj:{//按钮权限
                  query:false,
                  exchange:false,
                  detail:false,
                  revoke:false
                },
				
                formInline: {//查询条件
					beginDate:'', // 开始时间
					courseId: '', // 课程id
					endDate: '', // 结束时间
					exchangeType: '', // 调课类型
					//id: this.me ? this.me.attributes.login_info.id : null,//util.getStorage('loginId'), // 从后台拿登录用户ID
					isHandle: false, // 是否同意
					semesterCourseId: '', // 学期课程id （课程名称？）
					semesterYear: '', // 学年 
					semesterYearNumber: '', // 学年的学期id （1或2）
					status: '' // 状态
                },
		        tempSelect:'', // 
		        termList:[],
                dateRange:'',//授课日期范围
				scheduleList:[],//排课课程列表
				courseList:[],//课程名称
		        tableData:[],//列表
                pageNo: 1,
	          	pageSize: 10,
	          	totalCount:0,
				detailMark:false,//详情
		        dialogExChangeCourseDetail:{},
				viewRecordMark:false,//查看审查记录
                courseId:'', // 查看审核记录id
                gridData:[],//审核记录
				selectDateRange:'',
		        teacherList: [],
		        classList:[],
				placeList:[], // 授课场地
//				scheduleList:[],//排课课程
				lessonList:[],//课节
		        courseForm:{
		            id: 0, // 课程id
					exchangeExcuse: '', // 调课理由
					exchangeType: '3', // 调课的类型
					instruction: '', // 辅助说明
					replacedCourseId: 0, // 互换课程id
					singleExchangeType: '1', // 单独调课时传的值
					// startTeacherId: 1 // 登录老师id
		        },
				
		        exchangeEachOther:{// 选择互换课程
					visible: false,
					lessonsData:[],
		        	selectTeacherForm:{
		        		areaId: '',
						beginDate: "",
						clsId: '',
						courseId: '',
						endDate: "",
						pageSize: 10,
						requestPage: 1,
						sectionNodeids: [],
						semestercourseId: '',
						teacherId: '' // 登录老师id
		        	},
		        	tableList: [
		        		{label:'排课课程', prop:'courseArrange'},
		        		{label:'授课日期', prop:'scheduleitemDate'},
		        		{label:'授课课节', prop:'sectionNodenames'},
		        		{label:'授课老师', prop:'teacherNames'},
		        		{label:'授课场地', prop:'areaName'},
		        		{label:'上课班', prop:'clsName'}
		        	],
		        	selectExchangeTeacherData:[],
					requestPage:1,
					pageSize:10,
					total_records: 0, 
		        },
		        // 处理审核传参 在这个页面只传前面四个，后面传空即可
		        handleForm: {
				  auditId:  util.getStorage('loginId'), // 登录id
				  auditName:  util.getStorage('loginName'), // 登录用户姓名
				  auditResult: 0, // 审核是否同意 0表示不同意 1同意
				  exchangeCourseId: '' //
				},
		        
		        applyClassMark: false, 
				handleMark:false,//详情dialog判断是处理还是查看
				
				
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "调课记录查询"},
                ],
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
				pagePort:{
		        	getDictsList:'_op:dicts/getDictsList',
		        	lessionsList: '_op:sections/list', // 课节查询
		        	majorList:'_op:major/getMajorList',
		        	courseList:'_op:course/combox', // 课程查询
		        	getCourseList: '_op:curriculum/list', // 课程表查询
		        	courseDetail: '_op:courseContent/', // /courseContent/{id}
		        	myExchangeList: '_ed:exchangecourse/query/allList', // 调课表格数据(分页)
					// exChangeCourseDetail: '_ed:exchangecourse/query/excourse/', // 调课详情 /exchangecourse/query/excourse/{id}
					exChangeCourseDetail: '_ed:exchangecourse/isexist/',
					// GET /exchangecourse/isexist/{id}
		        	auditlog: '_ed:exchangecourse/query/auditlog/', // exchangecourse/query/auditlog/{id}
		        	handleExchangeCourse: '_ed:exchangecourse/handle', //调课申请处理 
		        	revoke: '_ed:/exchangecourse/revoke/', // 撤回 /exchangecourse/revoke/{id}
					semestercourse: '_ed:/semestercourse/list', // 排课课程
					classesList: '_ed:/coursecls/list', // 上课班
					// addNewApply: '_ed:exchangecourse/update', // 新增调课申请
					addNewApply: '_ed:/curriculum/add', // 新增调课申请
					comboxSearch: '_op:areas/combox/search/', // {key} 关键词
					queryTeacher:'_ed:/exchangecourse/query/teacher',
					selectExchangeCourseList:'_ed:exchangecourse/query'
		        },
				pickerOptions:  {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
				dialogTitle: {},
				showType: 1,
            	recoreid: '',
			}
		},
		components: {
			approvalDetail
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
				singleTypeFn(val){
				// console.log('调课类型', val)
        		let typetext='';
        		switch (val){
        			case 1: typetext='更换老师'
        				break;
        			case 2: typetext='更换时间场地'
						break;
					
        			default:
        				break;
        		}
        		return typetext;

			},
			dateFn(val){
        		return val==null?'':moment(val).format('YYYY-MM-DD ')
        	},
				dateFns(val){
        		if (val!=null&&val!='') {
        			return moment(val).format('YYYY-MM-DD  HH:mm')
        		}
			},
        	statusFn(val){
        		let statutext='';
        		switch (val){
        			case 0: statutext='处理中'
        				break;
        			case 1: statutext='调课成功'
        				break;
        			case 2: statutext='调课失败'
        				break;
        			case 3: statutext='撤销调课'
        				break;
        			default:
        				break;
        		}
        		return statutext;
        	},
        	exchangeTypeFn(val){
        		let typetext='';
        		switch (val){
					case 1: typetext='统一调课'
        				break;
        			case 2: typetext='取消调课'
        				break;
        			case 3: typetext='单独调课'
        				break;
        			case 4: typetext='互换调课'
        				break;
        			default:
        				break;
        		}
        		return typetext;
        	}
		},
	    watch: {
	    	dateRange: function(newval){
	    		if (newval) {
	    			this.formInline.beginDate=newval[0];
	    			this.formInline.endDate=newval[1];
	    		}else{
	    			this.formInline.beginDate='';
	    			this.formInline.endDate='';
	    		}
	    	},
	    	selectDateRange: function(newval){
	    		if (newval) {
	    			this.exchangeEachOther.selectTeacherForm.beginDate=newval[0];
	    			this.exchangeEachOther.selectTeacherForm.endDate=newval[1];
	    		}else{
	    			this.exchangeEachOther.selectTeacherForm.beginDate='';
	    			this.exchangeEachOther.selectTeacherForm.endDate='';
	    		}
	    	}
	    },
		created (){
			this.$http.get('_op:/terms/'+"学期").then(data=>{
                if(data.code==0){
					this.termList =data.data;
					this.termList =data.data.reverse()
					
                    this.termList.map(item=>{
                    	if(item.name.indexOf('当前学期')!==-1){
                    		this.tempSelect=item.id;
                    		this.fallYear=this.formInline.semesterYear=item.year;
							this.semesterNum=this.formInline.semesterYearNumber=item.orderNum;
							
                    	}
					})
					 let  aaa=this.fallYear
					this.getTableData();
					this.getScheduleList();
                }else{
                    this.$message.error(data.msg);
                }
            }).catch(()=>{
                this.termList = [];
            })
		},
        computed:{
            ...mapState(['btnPermitList', 'me']),
        },
		methods:{
			openDialogs(type,id){
				this.recoreid = id.toString();
				this.showType = type;
				this.dialogTitle = this.showType === 0 ? {name:'调课审核',type:0} : {name:'调课详情',type:1};
				this.detailMark = true;
			},
			 //获取按钮权限
           	getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						if (item.code=="query_wodetiaoke") {  //查询
						self.btnPerObj.query=true;
						}
						if (item.code=="exchange_course_wodetiaoke") {  //申请调课
						self.btnPerObj.exchange=true;
						}
						if (item.code=="detail_wodetiaoke") {  //查看详情
						self.btnPerObj.revocation=true;
						}
						if (item.code=="revoke_wodetiaoke") {  //撤回
						self.btnPerObj.revoke=true;
						}
                    });
                }).catch(()=>{
                })
            },
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
			// 我的调课列表（分页）
			getTableData (){
				//this.formInline.id = this.me.attributes.login_info.id;
				this.formInline.isHandle=this.formInline.isHandle ? 1:0;
				let params ={
					pageNo:this.formInline.requestPage,
					pageSize:this.formInline.pageSize,
					totalCount:this.totalCount,
					param:{
						beginDate:this.formInline.beginDate,
						courseId:this.formInline.courseId,
						endDate:this.formInline.endDate,
						exchangeType:this.formInline.exchangeType,
						isHandle:this.formInline.isHandle,
						semesterCourseId:this.formInline.semesterCourseId,
						semesterYear:this.formInline.semesterYear,
						semesterYearNumber:this.formInline.semesterYearNumber,
						status:this.formInline.status,
					}
				}
				this.$http.post(this.pagePort.myExchangeList,params).then( data => {
			
						this.tableData = data.result;
						this.totalCount = data.totalCount;
				})
			},
			sizeChange(size){
				this.formInline.requestPage =1;
				this.formInline.pageSize = size;
				this.getTableData();
			},
			currentChange(current){
				this.formInline.requestPage = current;
				this.getTableData();
			},
			
			onSubmit(){
				this.formInline.requestPage = 1;
				this.getTableData();
			},
			// 获取对应id调课详情
			exchangeDetail (row){
				
				this.dialogExChangeCourseDetail=row;
				this.detailMark = true;
				this.courseId = row.id;
			},
			// 查看审核记录
			viewRecord(){
				this.$http.get(this.pagePort.auditlog+this.courseId).then( data => {
					if (data.code === 0) {
						this.gridData = data.data;
						this.viewRecordMark = true;
					}
				})
			},
			// 撤回调课申请 
			revoke (row){
				let _this = this;

				this.$confirm('你确定撤回本次调课吗？', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
			        _this.$http.delete(_this.pagePort.revoke+row.id).then(data => {
			        	if(data.code === 0) {
			        		_this.$message.success('撤回成功！');

			        		this.getTableData();
			        	} else {
			        		_this.$message.error(data.msg);
			        	}
			        })
		        }).catch(() => {});
			},
			handleFn(row){//处理按钮
				this.detailMark = true;
				this.handleMark = true;
				this.handleForm.exchangeCourseId = row.id;
				this.courseId = row.id; // 处理时查看
				this.exchangeDetail(row);
			},
			// 再次申请调课
			reApplyClass (row){
			
				this.$http.get(this.pagePort.exChangeCourseDetail + row.scheduleItemId).then( data => {
					if(data.code==0){
						this.applyClassMark = true;
						
						this.getDialogData(row.scheduleItemId)
					// this.dialogExChangeCourseDetail = data.data;console.log(JSON.stringify(this.dialogExChangeCourseDetail))
					// this.dialogExChangeCourseDetail.id = row.scheduleItemId;
					// this.dialogExChangeCourseDetail.exchangeType=this.dialogExChangeCourseDetail.exchangeType.toString();
					// this.dialogExChangeCourseDetail.singleType=this.dialogExChangeCourseDetail.singleType.toString();
					// this.applyClassMark = true;

					}else{
						this.$alert('调课处理中，无需重复提交', '提 示', {
				          	confirmButtonText: '确定',
				          	callback: () => {}
				        });
					}
				
				})
			},
			getDialogData(id){
			
				this.$http.get("_ed:/exchangecourse/query/"+id).then(data =>{
				
					this.dialogExChangeCourseDetail = data.data;
				
					this.dialogExChangeCourseDetail.id = data.data.scheduleItemId;
					this.dialogExChangeCourseDetail.exchangeType=this.dialogExChangeCourseDetail.exchangeType.toString();
					this.dialogExChangeCourseDetail.singleType=this.dialogExChangeCourseDetail.singleType.toString();
				})
			},

			openselectDialog(){
				this.queryTeacher('');
				this.getClassList();
				this.searchAreaName();
				this.selectExchangeCourse();
				this.getLessionsList();
				this.exchangeEachOther.visible = true;
			},
			selectExchangeCourse (){
				this.$http.post('_ed:exchangecourse/query', this.exchangeEachOther.selectTeacherForm).then(data => {
					if (data.code === 0) {
						this.exchangeEachOther.selectExchangeTeacherData = data.data.dataList;
						this.exchangeEachOther.total_records = data.data.total_records;
					}
				})
			},
			otherSizeChange (){
				this.exchangeEachOther.requestPage = 1;
				this.selectExchangeCourse();
			},
			otherCurrentChange (){
				this.selectExchangeCourse();
			},
			// 选择互换调课的老师
			selectExchangeTeacher (row){
			
		        this.dialogExChangeCourseDetail.replacedCourseId = row.id;

				this.dialogExChangeCourseDetail.replacedCourseArrange = row.courseArrange;
				this.dialogExChangeCourseDetail.ndscheduleitemDate = row.scheduleitemDate;
				this.dialogExChangeCourseDetail.ndareaName = row.areaName;
				this.dialogExChangeCourseDetail.ndsectionNodenames = row.sectionNodenames;
				this.dialogExChangeCourseDetail.ndteachingFormName = row.teachingformName;
				this.dialogExChangeCourseDetail.ndTeacherNames = row.teacherNames;

				this.exchangeEachOther.visible = false;
			},
			applyClassFn(){//申请确定（即再次申请）
				this.$http.post(this.pagePort.addNewApply, {
		            id: this.dialogExChangeCourseDetail.id, // 课程id
					exchangeExcuse: this.dialogExChangeCourseDetail.exchangeExcuse, // 调课理由
					exchangeType: this.dialogExChangeCourseDetail.exchangeType, // 调课的类型
					instruction: this.dialogExChangeCourseDetail.instruction, // 辅助说明
					replacedCourseId: this.dialogExChangeCourseDetail.replacedCourseId, // 互换课程id
					singleExchangeType: this.dialogExChangeCourseDetail.singleType, // 单独调课时传的值
		        }).then(data => {
					if (data.code === 0) {
						this.$message.success('申请调课已提交！');
						this.getTableData();
						this.applyClassMark = false;
					}
				});
			},
			
            // 授课老师
            queryTeacher (str){
            	this.$http.post(this.pagePort.queryTeacher, {
				    str: str
				}).then(data => {
            		this.teacherList = data.data;
            	})
            },
            // 获取上课班
			getClassList(){
                this.$http.post(this.pagePort.classesList, {
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
			// 授课场地
            searchAreaName (key=' '){
            	this.$http.get('_op:areas/combox/search/'+key).then(data => {
            		if (data.code === 0) {
            			this.placeList = data.data;
            		}
            	})
            },
            // 排课课程
			getScheduleList(){
                this.$http.post(this.pagePort.semestercourse, {
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                })
                .then(data=>{
                    if(data.code==0){
						data.data.forEach(x => {
							if (x.majorNames) {
								x.displayName = x.course_arrange + '(' + x.majorNames + ')'
							} else {
								x.displayName = x.course_arrange + '(未知专业)';
							}
							
						})
                        this.scheduleList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
			// 获取课节信息
			getLessionsList (){
				this.$http.get("_op:/sectionnodes/querySectionNode").then(data=>{
					if(data.code==0){
						this.lessonList=data.data;
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			

			
			// 处理调课申请
			handleExchange(auditResult){
				this.handleForm.auditResult = auditResult;
			
			},
			
            // 设置学年和学期的id
            setSemesterId (val){
            	let selectedArr = this.termList.find( item => {
            		return item.id == val;
            	})

            	this.fallYear=this.formInline.semesterYear = selectedArr.year;
            	this.semesterNum=this.formInline.semesterYearNumber = selectedArr.orderNum;
            	this.getScheduleList();
            },
			
			batchAdjustment(){//申请调课
				this.$router.push('/teaching_management/apply_class')
			}
		}
	}
</script>
<style scoped lang="less">
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
  	td {
	  border: 1px solid #dfe6ec;
	  line-height: 40px;
	}
	.title{
		background-color: #DCDFE6;
	}
	.textleft{
		text-align: left;
		padding-left: 20px;
	}
	.textweight{
		font-weight: bold;
	}
	.backgroundstyle{
		background: rgb(245, 245, 198);
	}
}
</style>