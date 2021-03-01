<!--申请调课-->
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
                        <el-form-item label="学期">
                            <el-select v-model="tempSelect" placeholder="全部">
                            	<el-option v-for="(item, index) in termList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
						
						<el-form-item label="授课日期">
                            <el-date-picker
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
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                header-row-class-name="cm-dark">
                <!--<el-table-column type="index" prop="序号"></el-table-column>-->
                <el-table-column prop="week" label="周次" width="60"></el-table-column>
                <el-table-column label="日期" width="100">
                	<template slot-scope="scope">{{scope.row.scheduleitemDate|dateFn}}</template>
                </el-table-column>
                <el-table-column prop="weekName" label="星期"></el-table-column>
                <el-table-column prop="sectionNodenames" label="课节"></el-table-column>
                <el-table-column prop="sectionNodeidsNum" label="节数"></el-table-column>
                <el-table-column prop="areaName" label="授课场地"></el-table-column>
                <el-table-column prop="courseArrange" label="排课课程"></el-table-column>
                <el-table-column prop="teachingformName" label="授课形式"></el-table-column>
                <el-table-column prop="teachingContent" label="授课内容"></el-table-column>
                <el-table-column prop="clsName" label="上课班"></el-table-column>
                <el-table-column prop="groupNames" label="分组"></el-table-column>
                <el-table-column prop="stuNum" label="学生数"></el-table-column> 
                <el-table-column
                    label="操作"
                    width="100"
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button
                        	:disabled="verifyDate(scope.row.scheduleitemDate)" 
                        	@click="applyClass(scope.row)" 
                        	type="text" size="small">
                        	申请调课
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="formInline.current"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="formInline.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="formInline.total"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
         <!-- 批量调整时间 -->

        <!-- 申请调课 -->
        <el-dialog
        	title="申请调课"
        	:visible.sync="applyClassMark"
        	:modal-append-to-body="false"
           	width="80%">
           	<el-form :inline="true" size="mini" label-width="100px">
        		<el-form-item label="排课课程">{{showExCourseInfo.applyCourseName}}</el-form-item>
				<el-form-item label="授课日期">{{showExCourseInfo.applyCourseDate|dateFn}}</el-form-item>
				<el-form-item label="课节">{{showExCourseInfo.lessonsNode}}</el-form-item>
			</el-form>
			<el-form size="mini" label-width="100px">
				<el-form-item label="调课理由">
				    <el-input type="textarea" v-model="courseForm.exchangeExcuse"></el-input>
				</el-form-item>
			
			</el-form>
			<el-form :inline="true" size="mini" label-width="100px">	
				<el-form-item label="调课类型">
				    <el-select v-model="courseForm.exchangeType" placeholder="请选择活动区域">
				      <el-option label="单独调课" value="3"></el-option>
				      <el-option label="课程互换" value="4"></el-option>
				    </el-select>
				</el-form-item>
				<!-- <el-form-item label=" " v-if="courseForm.exchangeType == 3">
				    <el-radio v-model="courseForm.singleExchangeType" label="2">更改授课时间地点</el-radio>
					<el-radio v-model="courseForm.singleExchangeType" label="1">更改老师</el-radio>
				</el-form-item> -->
			</el-form>
			<el-form size="mini" label-width="100px">
				<el-form-item v-if="courseForm.exchangeType == 3">
					<el-radio v-model="courseForm.singleExchangeType" label="2">更改授课时间地点</el-radio>
				</el-form-item>
				<el-form-item v-if="courseForm.exchangeType == 3">
					<div class="teacher-select">
						<div class="teacher-select-radio">
							<el-radio v-model="courseForm.singleExchangeType" label="1">更改老师</el-radio>
						</div>
						<div class="teacher-select-list">
							<template v-if="courseForm.singleExchangeType == 1">
								<div class="label">新上课老师</div>
								<div>
									<el-select
										filterable
										clearable
										placeholder="全部"
										v-model="courseForm.exchangeTeacherId"
										multiple
										style="width: 300px;"
										remote
										:remote-method="queryTeacherRemote"
										:loading="queryTeacherLoading"
										reserve-keyword>
										<el-option  v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
									</el-select>
								</div>
							</template>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="辅助说明" v-if="courseForm.exchangeType == 3">
				    <el-input type="textarea" v-model="courseForm.instruction"></el-input>
				</el-form-item>
			<!--选择课程-->
				<el-form-item label="指定互换" v-if="courseForm.exchangeType == 4">
				 	<el-button type="primary" @click="selectExchangeCourse">选择互换课程</el-button>
					
				    <table class="stationtable">
						<tr class="textweight">
							<td class="title"></td>
							<td class="title" colspan="2">申请调课课程</td>
							<td class="title" colspan="2">互调课程</td>
						</tr>
		        		<tr class="textweight">
							<td class="title" style="width:12%;"></td>
							<td class="title" style="width:22%;">原安排</td>
							<td class="title" style="width:22%;">新安排</td>
							<td class="title" style="width:22%;">原安排</td>
							<td class="title" style="width:22%;">新安排</td>
						</tr>
		        		<tr>
		        			<td class="title">排课名称</td>
		        			<td>{{ showExCourseInfo.applyCourseName }}</td>
		        			<td class="newarrange">{{ showExCourseInfo.applyCourseName }}</td>
							<td>{{ showNewExCourseInfo.applyCourseName }}</td>
		        			<td class="newarrange">{{ showNewExCourseInfo.applyCourseName }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课地点</td>
		        			<td>{{ showExCourseInfo.areaName }}</td>
		        			<td class="newarrange  textColor">{{ showNewExCourseInfo.areaName }}</td>
		        			<td>{{ showNewExCourseInfo.areaName }}</td>
		        			<td class="newarrange   textColor">{{ showExCourseInfo.areaName }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课形式</td>
		        			<td>{{ showExCourseInfo.teachingForm }}</td>
		        			<td class="newarrange ">{{ showExCourseInfo.teachingForm }}</td>
		        			<td>{{ showNewExCourseInfo.teachingForm }}</td>
		        			<td class="newarrange  ">{{ showNewExCourseInfo.teachingForm }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课日期</td>
		        			<td>{{ showExCourseInfo.applyCourseDate | dateFn }}</td>
		        			<td class="newarrange textColor">{{ showNewExCourseInfo.applyCourseDate | dateFn }}</td>
		        			<td>{{ showNewExCourseInfo.applyCourseDate | dateFn }}</td>
		        			<td class="newarrange  textColor">{{ showExCourseInfo.applyCourseDate | dateFn }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课课节</td>
		        			<td>{{ showExCourseInfo.lessonsNode }}</td>
		        			<td class="newarrange textColor">{{ showNewExCourseInfo.lessonsNode }}</td>
		        			<td>{{ showNewExCourseInfo.lessonsNode }}</td>
		        			<td class="newarrange textColor">{{ showExCourseInfo.lessonsNode }}</td>
		        		</tr>
		        		<tr>
		        			<td class="title">授课老师</td>
		        			<td>{{ showExCourseInfo.teacherNames }}</td>
		        			<td class="newarrange">{{ showExCourseInfo.teacherNames }}</td>
		        			<td>{{ showNewExCourseInfo.teacherNames }}</td>
		        			<td class="newarrange">{{ showNewExCourseInfo.teacherNames }}</td>
		        		</tr>
		        	</table>
				</el-form-item>
           </el-form>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="closeApplyClass">取  消</el-button>
	            <el-button type="primary" @click="applyClassFn">确  定</el-button>
	        </span>
        </el-dialog>
		<!-- 冲突明细弹窗 -->
		<el-dialog
			title="冲突明细"
			:visible.sync="conflictDetails"
			:close-on-click-modal="false"
			:append-to-body="true"
			width="50%"
			>
			<el-table
			      class="boxStyle"
                    ref="multipleTable"
                    :data="conflictData"
	                @selection-change="handleSelectionChange"
                    border
                    style="width: 100%"
					height="500"
					 size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column prop="type" label="冲突类别" width="100" ></el-table-column>
				<el-table-column prop="conflict" label="冲突描述 " ></el-table-column>
            </el-table>
			<div class="adjust-box">	
			</div>
			<span slot="footer" class="dialog-footer">
					<el-button @click="conflictDetails = false">关 闭</el-button>
			</span>
		</el-dialog>

        <!-- 申请互换选择老师弹窗 -->
        <el-dialog
        	title="选择互换课程"
        	:visible.sync="exchangeEachOther.visible"
        	:modal-append-to-body="false"
           	width="1300px">
           	<div class="cm-fold apply-course">
	            <el-form :inline="true" size="mini" :model="exchangeEachOther.selectTeacherForm" >
	                <div class="fold">
	                    <div ref="formDetail" class="detail-show">
	                        <el-form-item label="上课班">
	                            <el-select v-model="exchangeEachOther.selectTeacherForm.clsId" clearable placeholder="全部">
	                                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                            </el-select>
	                        </el-form-item>
							 <el-form-item label="排课课程"  width="600">
	                            <el-select   class="pkkcBox" v-model="exchangeEachOther.selectTeacherForm.semestercourseId"
								 clearable
								 filterable
								  placeholder="全部 ">
                                	<el-option   class="pkkc"  v-for="list in scheduleList" :key="list.id" :label="list.displayName" :value="list.id"></el-option>
	                            </el-select>
	                        </el-form-item>
							  <el-form-item label="授课场地">
	                            <el-select 
									clearable
	                            	v-model="exchangeEachOther.selectTeacherForm.areaId" 
	                            	filterable 
	                            	remote
	                            	reserve-keyword
	                            	:remote-method="searchAreaName"
	                            	placeholder="请输入搜索关镇键词">
                                	<el-option v-for="item in placeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
	                            </el-select>
	                        </el-form-item>

	                        <el-form-item label="授课老师">
	                            <el-select v-model="exchangeEachOther.selectTeacherForm.teacherId" filterable clearable placeholder="全部" remote :remote-method="queryTeacherRemote" :loading="queryTeacherLoading" reserve-keyword>
	                                <el-option  v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                            </el-select>
	                        </el-form-item>
	                      

								<el-form-item label="授课日期">
	                            <el-date-picker  class="skrqBox"
									clearable
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
							
	                        <el-form-item label="课节"  width="40px" >
	                            <el-select  class="kjBox" v-model="exchangeEachOther.selectTeacherForm.sectionNodeids" clearable multiple placeholder="请选择课节">
	                                <el-option  class="kj"  v-for="(item, index) in lessonList" :label="item.name" :value="item.id" :key="index"></el-option>
	                            </el-select>
	                        </el-form-item>
	                    </div>
	                    <div class="btn">
	                        <el-button type="primary" size="mini" @click="searchExchangeCourse">查询</el-button>
	                    </div>
	                </div>
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
	                    width="50"
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
           	<!--<span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="exchangeEachOther.visible = false">取  消</el-button>
	        </span>-->
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util';
	import {mapState} from 'vuex';
	import moment from 'moment';
import { constants } from 'crypto';

	export default {
		data(){
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "我的调课",path:"/teaching_management/my_class"},
                    {label: "申请调课"},
				],
					/**/
				conflictDetails:false,//冲突明细
				conflictData:[],
		        tableData:[],
				dateRange:'',
                tempSelect:'',
				termList:[],
                formInline: {
				  beginDate: '',
				  endDate: '',
				  semesterYear: '', // 学年
				  semesterYearNumber: '', // 学年学期
				  teacherId: '', // 登录老师id
				  size: 10,
				  current:1,
				  total:0
				},
				
				
				applyClassMark:false,//申请调课
		        showExCourseInfo: { // 只作显示
		        	applyCourseName:'',
		        	applyCourseDate:'', //授课日期
		        	areaName:'',
		        	lessonsNode:'',
		        	teachingForm:'3', // 授课形式
		        	scheduleitemDate:'',
		        	teacherNames:'' // 申请调课老师（可能要从登录信息拿）
		        },
		        showNewExCourseInfo: {
		        	applyCourseName:'',
		        	applyCourseDate:'', //授课日期
		        	areaName:'',
		        	lessonsNode:'',
		        	teachingForm:'', // 授课形式
		        	scheduleitemDate:'',
		        	teacherNames:''
		        },
                courseForm:{
		            courseId: '', // 课程id
					exchangeExcuse: '', // 调课理由
					exchangeType: '3', // 调课的类型
					instruction: '', // 辅助说明
					replacedCourseId: '', // 互换课程id
					singleExchangeType: '2', // 单独调课时传的值
					startTeacherId: '', // 登录老师id
					exchangeTeacherId: [] // 互换老师id
		        },
		        
				
		        // 选择互换课程
		        exchangeEachOther:{
					visible: false,
		        	selectTeacherForm:{
		        		areaId: '',
						beginDate: "",
						clsId: '',
						courseId: '',
						endDate: "",
						pageSize: 10,
						requestPage: 1,
						total: 0,
						sectionNodeids: [],
						semestercourseId: '',
						teacherId: '' ,// 登录老师id
						teacherName:'',
		        	},
		        	tableList: [
						{label:'排课课程', prop:'courseArrange',width:150},
						{label:'授课内容', prop:'teachingContent',width:200},
						{label:'授课形式', prop:'teachingformName',width:75},
						{label:'授课老师', prop:'teacherNames' ,width:100},
		        		{label:'授课场地', prop:'areaName' ,width:150},
		        		{label:'授课日期', prop:'scheduleitemDate' ,width:90},
		        		{label:'课节', prop:'sectionNodenames' ,width:60},
						{label:'上课班', prop:'clsName',width:250},
						{label:'上课组', prop:'groupNames',width:280}
		        	],
		        	selectExchangeTeacherData:[]
		        },
		        selectDateRange:'',//选择日期
				
		        teacherList: [],
		        classList:[],
				placeList:[], // 授课场地
				scheduleList:[],//排课课程
				lessonList:[],//课节
		        
				
        		nowDay: new Date(new Date().getTime() - 24*60*60*1000).getTime(),
				
				
				pickerOptions: {
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
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
				queryTeacherLoading:false,
			}
		},
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
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
	    	},
			applyClassMark(val){
				if(!val){
					for(let key in this.showExCourseInfo){
						this.$set(this.showExCourseInfo,key,'');
					}
					for(let key in this.showNewExCourseInfo){
						this.$set(this.showNewExCourseInfo,key,'');
					}
					this.$set(this.courseForm,'exchangeType','3');
					this.$set(this.courseForm,'singleExchangeType','2');
					this.$set(this.courseForm,'exchangeTeacherId','');
					this.$set(this.courseForm,'instruction','');
					this.$set(this.courseForm,'exchangeExcuse','');
				}
			},
	    },
		created (){
			// var teacherId = this.me ? this.me.attributes.login_info.id : null;
			var teacherId = null; // teacherId由后台通过token获取，前端传递空值
			this.courseForm.startTeacherId=this.formInline.teacherId=teacherId;
//			this.exchangeEachOther.selectTeacherForm.teacherId=parseInt(util.getStorage('loginId')) ;
//			this.exchangeEachOther.selectTeacherForm.teacherName=util.getStorage('loginName');
			this.$http.get('_op:/terms/'+"学期").then(data=>{
                if(data.code==0){
                    this.termList =data.data.reverse();
                    this.termList.map(item=>{
                    	if(item.name.indexOf('当前学期')!==-1){
                    		this.tempSelect=item.id;
                    		this.fallYear=this.formInline.semesterYear=item.year;
                    		this.semesterNum=this.formInline.semesterYearNumber=item.orderNum;
//                  		this.setSemesterId(this.tempSelect);
							this.getClassList();
							this.getScheduleList();
                    	}
                    })
                    this.getEnableCourseList();
					this.queryTeacher();
					this.searchAreaName();
                }else{
                    this.$message.error(data.msg);
                }
            }).catch(()=>{
                this.termList = [];
            })
			
			
			
			this.getLessionsList();
		},
		filters:{
			dateFn(val){
        		return val==''?'':moment(val).format('YYYY-MM-DD')
        	}
		},
        computed:{
            ...mapState(['btnPermitList', 'me']),
        },
		methods:{
			  handleSelectionChange(val){
          
            	// this.batchSelected=val;
            },
			// 获取老师列表
			fetchTeachers(query) {
			
			},
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
			// 我的可调课列表
			getEnableCourseList (){
				this.$http.post("_ed:exchangecourse/query/courselist", {
					beginDate: this.formInline.beginDate,
					endDate: this.formInline.endDate,
					pageSize: this.formInline.size,
					requestPage: this.formInline.current,
					semesterYear: this.formInline.semesterYear, // 学年
					semesterYearNumber: this.formInline.semesterYearNumber, // 学年学期
					teacherId: this.formInline.teacherId // 登录老师id
				}).then(data => {
					if (data.code === 0) {
						this.tableData = data.data.dataList;
						this.formInline.total = data.data.total_records;
					}
				})
			},
            sizeChange(size){
				this.formInline.current = 1;
				this.formInline.size = size;
                this.getEnableCourseList();
            },
            currentChange(current){
				this.formInline.current = current;
                this.getEnableCourseList();
            },
			onSubmit(){
            	let selectedArr = this.termList.find( item => {
            		return item.id == this.tempSelect;
            	})
            	this.fallYear=this.formInline.semesterYear = selectedArr.year;
            	this.semesterNum=this.formInline.semesterYearNumber = selectedArr.orderNum;
				this.formInline.current = 1;
				this.getEnableCourseList();
				this.getClassList();
				this.getScheduleList();
			},
			applyClass(row){
				var tempClsList = this.classList;
				// 互换课程默认值
				if (row.areaIds == null) row.areaIds = new Array();
				this.exchangeEachOther.selectTeacherForm.semestercourseId = row.semestercourseId;
				this.exchangeEachOther.selectTeacherForm.areaId = row.areaIds[0] || '';

				// 检查是否能发起调课
				this.$http.get('_ed:exchangecourse/isexist/' + row.id).then(data => {
					if (data.code === 0) {
					
						this.applyClassMark = true;
						this.courseForm.courseId = row.id;
						this.showExCourseInfo.applyCourseName = row.courseArrange;
						this.showExCourseInfo.applyCourseDate = row.scheduleitemDate;
						this.showExCourseInfo.lessonsNode = row.sectionNodenames; // 课节
						this.showExCourseInfo.teachingForm = row.teachingformName; 
						this.showExCourseInfo.areaName = row.areaName;
						this.showExCourseInfo.teacherNames = row.teacherNames;

						var temp = tempClsList.filter(x => x.name == row.clsName);
						if (temp.length > 0) {
							this.exchangeEachOther.selectTeacherForm.clsId = temp[0].id;
						}
					
					} else {
						this.$alert('调课处理中，无需重复提交', '提 示', {
				          	confirmButtonText: '确定',
				          	callback: () => {}
				        });
					}
				})
			},
			applyClassFn(){//申请确定（即新增）
				if (this.courseForm.exchangeType == 4 && !this.courseForm.replacedCourseId) {
					this.$message.warning('您还没选择调课课程！')
					return false;
				} else {
					if (this.courseForm.exchangeType == 3 && this.courseForm.singleExchangeType == 1) {
						this.courseForm.newTeacherIds = [];
						if (this.courseForm.exchangeTeacherId != null && this.courseForm.exchangeTeacherId != '') {
							this.courseForm.newTeacherIds = JSON.parse(JSON.stringify(this.courseForm.exchangeTeacherId));
						}
					}
				
					this.$http.post('_ed:exchangecourse/add', this.courseForm).then(data => {
						if (data.code == 0) {
							this.$message.success('申请调课已提交！');
							 window.history.back(-1); 
							this.courseForm.replacedCourseId = '';
							this.applyClassMark = false;
							// this.conflictDetails=true;
						}else{
							// console.log('冲突', data.msg)

						}
						if (data.code!==0) {
					
							// console.log('1111------------', data.data)
							this.conflictData=data.data
						    this.conflictDetails=true;
						}
					});
				}
			},
			closeApplyClass(){
				this.courseForm.replacedCourseId = '';
				this.applyClassMark = false;
			},
			selectExchangeCourse (){//查询课程
				this.$http.post('_ed:exchangecourse/query', this.exchangeEachOther.selectTeacherForm).then(data => {
					if (data.code === 0) {
						this.exchangeEachOther.selectExchangeTeacherData = data.data.dataList;
						this.exchangeEachOther.selectTeacherForm.total=data.data.total_records;
						this.exchangeEachOther.visible = true;
					}
				})
			},
			searchExchangeCourse() {
				this.exchangeEachOther.selectTeacherForm.requestPage = 1;
				this.selectExchangeCourse();
			},
			otherSizeChange (size){
				this.exchangeEachOther.selectTeacherForm.requestPage = 1;
				this.exchangeEachOther.selectTeacherForm.pageSize = size;
				this.selectExchangeCourse();
			},
			otherCurrentChange (current){
				this.exchangeEachOther.selectTeacherForm.requestPage = current;
				this.selectExchangeCourse();
			},
			// 选择互换调课的老师
			selectExchangeTeacher (row){
		        this.courseForm.replacedCourseId = row.id;

				this.showNewExCourseInfo.applyCourseName = row.courseArrange;
				this.showNewExCourseInfo.applyCourseDate = row.scheduleitemDate;
				this.showNewExCourseInfo.areaName = row.areaName;
				this.showNewExCourseInfo.lessonsNode = row.sectionNodenames;
				this.showNewExCourseInfo.teachingForm = row.teachingformName;
				this.showNewExCourseInfo.teacherNames = row.teacherNames;

				this.exchangeEachOther.visible = false;
			},
            // 授课老师
            queryTeacher (){
            	this.$http.post('_ed:/exchangecourse/query/teacher', {
				    str: ''
				}).then(data => {
//          		let isteacher=false;
//          		data.data.map(item=>{
//          			if(this.exchangeEachOther.selectTeacherForm.teacherId==item.id){
//          				isteacher=true;
//          			}
//          		})
//          		if(!isteacher){
//          			data.data.push({
//          				id:this.exchangeEachOther.selectTeacherForm.teacherId,
//          				name:this.exchangeEachOther.selectTeacherForm.teacherName
//          			})
//          		}
            		this.teacherList = data.data;
            	})
            },
			queryTeacherRemote(query){
				let filterList = [];
				if(this.courseForm.exchangeTeacherId&&this.courseForm.exchangeTeacherId.length>0){
					filterList = this.teacherList.filter(item1=>this.courseForm.exchangeTeacherId.find(item2=>item2==item1.id));
				}
				if (query !== '') {
					this.queryTeacherLoading = true;
					this.$http.post('_ed:/exchangecourse/query/teacher', {
						str: query
					}).then(data => {
						this.queryTeacherLoading = false;
						let tempArr = data.data.filter(item1=>!filterList.find(item2=>item2.id==item1.id));
						this.teacherList = [...tempArr,...filterList];
					})
				}
			},
			// 获取上课班
			getClassList(){
                let self = this;
                this.$http.post('_ed:/coursecls/list', {
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                       self.classList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
			// 排课课程
			getScheduleList(){
                this.$http.post('_ed:/semestercourse/list', {
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
						data.data.forEach(x => {
							if (x.majorNames) {
								x.displayName = x.course_arrange + '(' + x.majorNames + ')'
							} else {
								x.displayName = x.course_arrange + '(未知专业)'
							}
							
						})
                        this.scheduleList = data.data;
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
			
            // 设置学年和学期的id
            setSemesterId (val){
				this.getClassList();
				this.getScheduleList();
            },
        	verifyDate(val){
        		return val-this.nowDay<0 ? true:false;
        	},
		}
	}
</script>
<style scoped lang="less">
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
  	margin-top: 10px;
  	td {
	  border: 1px solid #dfe6ec;
	  line-height: 20px;
	  padding: 10px;
	}
	.title{
		background-color: #DCDFE6;
	}
	.textweight{
		font-weight: bold;
	}
}

.teacher-select {
	display: flex;
	flex-direction: row;

	.teacher-select-radio {
		margin-right: auto;
	}

	.teacher-select-list {
		flex: 0 0 auto;
		display: flex;
		flex-direction: row;

		.label {
			margin-right: 8px;
		}
	}
}

.newarrange {
	background: #CCFFFF;
	

}
.textColor{
	color:#0000FF;

}
.pkkcBox {
  width: 450px !important;
}
.pkkc {
  width: 450px !important;
}
.skrqBox{
	// width: 250px;
}
.kjBox{
	width: 150px;

}
.kj{
	width: 100px;
}
.cm-table{
	margin-top: 25px;
}
</style>
