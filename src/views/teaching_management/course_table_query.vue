-<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
			<!-- 课程表查询 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
                
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':true}">
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
						<el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                @change="onYearChange"
                                placeholder="全部"
                                :remote-method="getTermData">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期">
						    <el-date-picker
							  style="width:205px;"
						      v-model="courseDate"
						      type="daterange"
						      value-format="yyyy-MM-dd"
						      align="right"
						      unlink-panels
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期"
						      :picker-options="pickerOptions">
						    </el-date-picker>
                        </el-form-item>

						   <el-form-item label="老师">
							<el-select 
								v-model="teacherId" 
								placeholder="请选择" 
								clearable 
								filterable
								remote
								style="width:85px;"
								:remote-method="getTeacher"
								:loading="loading">
								<el-option
							    	label="全部" 
							    	value=""> 
							    </el-option>
							    <el-option 
							    	v-for="(item,index) in teacherList" 
							    	:key="item.id" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="排课课程">
							<el-select 
							style="width:350px"
								v-model="semesterCourseId" 
								placeholder="请选择" 
								clearable 
								filterable 
								:loading="loading">
							    <el-option 
							    	v-for="item in semesterCourseList" 
							    	:key="item.id" 
							    	:label="item.displayName" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="上课班">
							<el-select style="width:230px"
								v-model="courseclsId" 
								placeholder="请选择" 
								clearable 
								filterable
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in courseclsList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>

                        <el-form-item label="年级">
							<intelligent-year-picker
							style="width:90px"
							v-model="grade"
							type="year"
							value-format="yyyy"
							placeholder="请选择"
							clearable
							></intelligent-year-picker>
						</el-form-item>

                        <el-form-item label="场地">
							<el-select style="width:220px"
								v-model="areaId" 
								placeholder="请选择" 
								clearable 
								filterable
								remote
								:remote-method="getArea"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in areaList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="课节">
							<el-select
								v-model="lessonIds" 
								placeholder="请选择" 
								multiple 
								clearable 
								filterable>
							    <el-option 
							    	v-for="(item,index) in lessonList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
							<el-select  style="width:90px"
								v-model="lessonType" 
								placeholder="请选择">
							    <el-option 
							    	v-for="(item,index) in lessonTypeList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
						
						<el-form-item label="授课形式">
							<el-select style="width:120px"
								v-model="shape" 
								placeholder="请选择" 
								clearable 
								filterable>
							    <el-option 
							    	v-for="(item,index) in shapeList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>

						<el-form-item label="网课平台">
							<el-select v-model="netType" size="small" style="width:110px;margin-right:20px" filterable>
								<el-option label="所有" value="0">
								</el-option>
								<el-option label="已填" value="2">
								</el-option>
								<el-option label="没填" value="1">
								</el-option>
								<el-option v-for="item in netList" :label="item.cn_name":value="item.id" :key="item.id">
								</el-option>
							</el-select>
                        </el-form-item>

						<el-form-item label="专业">
							<el-select style="width:140px"
								v-model="majorId" 
								placeholder="请选择" 
								clearable 
								filterable>
							    <el-option 
							    	v-for="(item,index) in majorList" 
							    	:key="item.id"
							    	:label="item.name"
							    	:value="item.id">
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="searchList">查询</el-button>
						<el-button type="primary" size="mini" @click="fileResult">导出</el-button>
						<a v-show="false" ref="exportExcel"></a>
                    </div>
                </div>
            </el-form>
        </div> 
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                @selection-change="handleSelectionChange"
                border
                style="width: 100%"
			    size="mini"
                header-row-class-name="cm-dark">
				<el-table-column
					type="index"
					width="50">
				</el-table-column>
                <el-table-column label="排课课程" width="180">
                	<template slot-scope="scope">
                		<!-- <el-button type="text" size="small" @click="courseDet(scope.row)">{{scope.row.courseArrange}}</el-button> -->
						{{scope.row.courseArrange}}
                	</template>
                </el-table-column>
				<el-table-column prop="week" label="周次" width="45"></el-table-column>
				<el-table-column prop="weekDay" label="星期" width="60">
					<template slot-scope="scope">
						{{scope.row.weekDay|filtersTextChange}}
					</template>
				</el-table-column>
                <el-table-column label="授课日期" width="85">
                	<template slot-scope="scope">{{scope.row.scheduleitemDate | dateFn}}</template>
                </el-table-column>
                <el-table-column prop="sectionNodenames" label="授课课节" width="70"></el-table-column>
                <el-table-column prop="teacherNames" label="授课老师" width="70"></el-table-column>
				   <el-table-column prop="teachingContent" label="授课内容"  width="280"></el-table-column>
				   <el-table-column prop="teachingformName" label="授课形式" width="80"></el-table-column>
                <el-table-column prop="areaName" label="授课场地"  width="130"></el-table-column>
				<!-- <el-table-column prop="grade" label="年级" width="60"></el-table-column>
				<el-table-column prop="major" label="专业" width="80"></el-table-column> -->
				<el-table-column prop="stuNum" label="学生数" width="60"></el-table-column>
					<el-table-column prop="groupNames" label="上课组" width="160"></el-table-column>
                <el-table-column label="上课班"  width="400">
                	<template slot-scope="scope">
                		<el-button type="text" size="small" @click="clsDet(scope.row.clsId)">{{scope.row.clsName}}</el-button>
                	</template>
                </el-table-column>
				<el-table-column label="网课平台" prop="cn_name" width="100">

				</el-table-column>
				<el-table-column label="备注" prop="remark" width="400">

				</el-table-column>
                <el-table-column label="操作" width="50" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="adjustLesson(scope.row,'det')">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <div class="cm-pagination">
            <el-pagination
                    background
                    :current-page="tablePage.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="tablePage.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tablePage.total"
                    @size-change="sizeChange"
                    @current-change="currentChange">
            </el-pagination>
        </div>
        
        <el-dialog
			title="课程详情"
			:visible.sync="dialogDet"
			:append-to-body="true"
			:close-on-click-modal="false"
			width="800px">
			
			<div class="adjust-box">
				<div class="det-box">
					<p class="title">课程</p>
					<p class="adjust-line">排课课程： {{adjustObj.courseArrange}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">课程内容</p>
					<p class="adjust-line">授课形式： {{adjustObj.teachingformName}}</p>
					<p class="adjust-line">授课内容： {{adjustObj.teachingContent}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">授课资源</p>
					<p class="adjust-line">授课老师： {{adjustObj.teacherNames}}</p>
					<p class="adjust-line">授课场地： {{adjustObj.areaName}}</p>
					<p class="adjust-line">课程时间： {{adjustObj.scheduleitemDate}}</p>
					<p class="adjust-line">课 &nbsp; &nbsp; 节： {{adjustObj.sectionNodenames}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">上课班信息</p>
					<p class="adjust-line">上课班： {{adjustObj.clsName}}</p>
					<p class="adjust-line">教学模式： {{adjustObj.teachingMode==0?'普通教学':'全英教学'}}</p>
					 <p class="adjust-line">分组号： {{adjustObj.groupNames}}</p>
				</div>
				<div class="det-box">
					<span style="font-weight:bold;margin-right:15px;">网课平台</span>
					<el-select v-model="adjustObj.net_type" size="small" style="width:78%;margin-right:20px" filterable>
						<el-option v-for="item in netList" :label="item.cn_name":value="item.id" :key="item.id">

						</el-option>
					</el-select>
					<el-button @click="addIntCoursePlatform" type="primary" size="small">新增</el-button>
				</div>
				<div class="det-box">
					<div>
						<span class="title">备注</span>
						<span style="color:blue;">（可填写网课地址、课前任务等信息，提前发给学生）</span>
					</div>
					<el-input v-model="adjustObj.remark" type="textarea" row="4" size="small" :maxlength="200"></el-input>
				</div>
			</div>
			<div style="text-align:right;padding-right:35px;">
				<el-button @click="saveRemark" size="small" type="primary">保 存</el-button>
			</div>
		</el-dialog>  
        <el-dialog
			title="上课班详情"
			:visible.sync="dialogClsDet"
			:append-to-body="true"
			:close-on-click-modal="false"
			width="50%">
			
			<p style="margin-bottom: 20px;">上课班:{{classdetail.name}}</p>
			<el-table
                    ref="multipleTable"
                    :data="classdetail.groups"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column prop="teaching_formname" label="授课形式"></el-table-column>
                <el-table-column prop="group_name" label="分组"></el-table-column>
                <el-table-column label="学生信息">
                	<template slot-scope="scope">
                		<p v-for="item in scope.row.cls_infos">{{item.class_belong}}<template v-if="classdetail.stu_number">({{classdetail.stu_number}})</template></p>
                	</template>
                </el-table-column>

            </el-table>
			
		</el-dialog>
		
        <el-dialog
			title="排课课程详情"
			:visible.sync="dialogCourseDet"
			:close-on-click-modal="false"
			:append-to-body="true"
			width="50%">
			<div style="margin-bottom: 20px;font-weight: 600;">
				<span style="margin-right: 20px;">学期：{{coursedetail.year}}</span>
				<span style="margin-right: 20px;">所在级：{{coursedetail.grade}}</span>
				<span>排课课程：{{coursedetail.courseArrange}}</span>
			</div>
			
			<el-table
                ref="multipleTable"
                :data="coursedetail.data"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
            <el-table-column prop="major_name" label="专业"></el-table-column>
            <el-table-column prop="course_name" label="课程名称"></el-table-column>
            </el-table>
		</el-dialog>
		
        <el-dialog
			title="批量调整时间"
			:visible.sync="dialogBatch"
			:close-on-click-modal="false"
			:append-to-body="true"
			width="40%">
			
			<div class="adjust-box">
				<div class="adjust-line">
					<label>调整后日期</label>
					<el-date-picker
				      v-model="batchDate"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期">
				    </el-date-picker>
				</div>
				<div class="adjust-line">
					<label>课节</label>
					<el-select 
						v-model="batchLesson" 
						placeholder="请选择" 
						multiple 
						clearable 
						filterable>
					    <el-option 
					    	v-for="(item,index) in lessonList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select>
				</div>
			</div>
			
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogBatch = false">取 消</el-button>
			    <el-button type="primary" @click="saveBatch">确 定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog 
			title="网课平台" 
			:visible.sync="IntCourseDialog" 
			:close-on-click-modal="false"
			:append-to-body="true"
			width="600px">
				<span style="padding-right:5px;font-weight:bold;">网课平台</span>
				<el-input v-model.trim="newCourse" size="small" style="width: 87%;"></el-input>
				<p v-show="tip" style="padding: 5px 60px;color: red;">{{ tip }}</p>
				<p style="text-align: right;padding: 20px 12px;">
					<el-button @click="saveNetType" size="small" type="primary">保 存</el-button>
				</p>
		</el-dialog>
		
    </section>
</template>

<script>
    import util from '@/util';
    import moment from 'moment';

    import {mapState} from 'vuex';

    export default {
        name: "adjust_lesson",
        data() {
            return {
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "课程表查询"}
				],
				options1:[],//学期列表
                courseDate:'',//授课日期
                semesterCourseList:[],//排课课程
                semesterCourseId:'',//排课课程
                courseList:[],//课程名称
                courseId:'',//课程名称
                courseclsList:[],//上课班
                courseclsId:'',
                areaList:[],//场地
                areaId:'',
                teacherList:[],//授课老师
                teacherId:'',
                lessonList:[],//授课老师
				lessonType: 0,
				lessonTypeList:[
					{id: 0,name: '包含'},
					{id: 1,name: '等于'}
				],
				shapeList:[],//授课形式
				shape: '',
				grade: '',
				majorId: '',
				majorList: [],
                lessonIds:[],
                tableData: [],
                tablePage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
                /**/
                dialogAdjust:false,
                adjustObj:{},//调课详情
                teachingTypeList:[],//授课类型
                clsTeamList:[],//上课班分组
                courseContentList:[],//上课内容
                dialogDet:false,//详情
                dialog_semesterCourseId:'',
                dialogClsDet:false,//上课班详情
                classdetail:{},//上课班详情
                teachcontentobj:{},//授课内容
                dialogCourseDet:false,//排课课程详情
                coursedetail:{},
                dialogBatch:false,//批量调课
                batchSelected:[],//已选课程
                batchDate:'',//调整后日期
                batchLesson:[],//调整后课节
				loading: false,
				formYear:"",
				fallYear: 0,
				semesterNum: 0,
				startTime: '',
				endTime: '',
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                btnPerObj:{//按钮权限
                  query:false
				},
				IntCourseDialog: false,
				newCourse: '',
				netList: [],
				tip: '',
				netType:'0',
            }
        },
        computed:{
			...mapState(['btnPermitList']),
			pickerOptions(time){
				let datePicker = {
					shortcuts: [],
					disabledDate: false
				};

				let range = [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [end,start ]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [ end,start]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [end,start]);
					}
				}];
				
				let start = new Date(this.startTime);
				let starttime = new Date(start.setDate(start.getDate() - 1)).getTime();//原来基础上减一天
				let endtime = new Date(this.endTime).getTime();
				let disabled = function (time){
					if (starttime < time.getTime() && time.getTime() <= endtime) {
						return false
					}
					return true
				}
				
				datePicker.shortcuts = range;
				datePicker.disabledDate = disabled;

				return datePicker;
        	},
        },
 
		watch:{
			courseDate(val){
			
			},
			IntCourseDialog(){
				(!this.IntCourseDialog) && (this.tip = '');
			}
		},
		filters:{
			dateFn(val){
        		return moment(val).format('YYYY-MM-DD')
        	},
			filtersTextChange(dataStr){
				let value;
				let arrayList  = [
					{num:'1',name:"星期一"},
					{num:'2',name:"星期二"},
					{num:'3',name:"星期三"},
					{num:'4',name:"星期四"},
					{num:'5',name:"星期五"},
					{num:'6',name:"星期六"},
					{num:'7',name:"星期天"},
				]
				for (let b of arrayList) {
					if (b.num == dataStr) {
						value = b.name;
						break;
						}
					}
     			   return value;
			}
		},
        methods: {
			// 新增网课平台
			addIntCoursePlatform(){
				this.newCourse = '';
				this.IntCourseDialog = true;
			},
			saveNetType(){
				if(!this.newCourse){
					this.tip = '请输入内容再保存';
					return;
				}else if(this.netList.find(item=>item.cn_name==this.newCourse)){
					this.tip = '此名称已存在';
					return;
				}else{
					this.tip = '';
				}

				this.$http.post('_ed:/term/add/courseurl/category',{
					cn_name: this.newCourse,
					type: 'net-semester_course_type'
				}).then(res => {
					if(res.code == 0){
						this.$message.success("新增成功");
						this.queryNetList(this.newCourse);
						this.IntCourseDialog = false;
					}else{
						this.$message.error(res.msg);
					}
				})
			},
			//更改学期
            onYearChange(val){
				this.semesterCourseId = '';
				this.courseclsId = '';
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
							this.chooseSemesterObj(list)
                        }
                    }
                }else{
                    this.fallYear = 0;
                    this.semesterNum = 0;
				}
				this.getTermRange();
				this.getCourseAss();
                this.getClassList();
			},
			//保存备注
			saveRemark(){
				this.$http.post('_ed:/schedule/update/course/remark',{
					schedule_item_id: this.adjustObj.id,
					remark: this.adjustObj.remark,
					net_type: this.adjustObj.net_type
				}).then(res => {
					if(res.code == 0){
						this.$message.success("保存成功");
						this.dialogDet = false;
					}else{
						this.$message.error(res.msg);
					}
				})
			},
			queryNetList(cn_name=''){
				this.$http.post('_ed:/term/queryCategoryList',{
					type: "net-semester_course_type"
				}).then(res => {
					if(res.code == 0){
						this.netList = res.data;
						if(cn_name){
							this.netList.map(item => {
								(item.cn_name == cn_name) && (this.$set(this.adjustObj,'net_type',item.id));
							})
						}
					}else{
						this.$message.error(res.msg);
					}
				})
			},
			  //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						 if (item.code=="query_kechengbiaochaxun") {  //查询
						self.btnPerObj.query=true;
						}
                    });
                }).catch(()=>{
                })
            },
        	
			//获取课程名称
        	getCourse(str){
        		this.$http.post("_ed:/exchangecourse/query/course",{
        			str:str
        		}).then(data=>{
        			this.courseList=data.data;
                }).catch(()=>{
                })
			},
			getTermData(query) {
				if (!query) {
					query = "学期";
				}
				this.$http.get("_op:/terms/" + query).then(data => {
					if (data.code == 0) {
						this.options1 = data.data.reverse();
						let chooseSemester = {};
						for(let i = 0; i < this.options1.length; i++){
							if(this.options1[i].stage==1){
								chooseSemester = this.options1[i];
								break
							}else if(this.options1[i].name.indexOf('当前学期')!=-1){
								chooseSemester = this.options1[i];
							}
						}
						this.chooseSemesterObj(chooseSemester);

						this.$nextTick(()=>{
							this.getTermRange();
							this.getCourseAss();
							this.getClassList();
						})
					} else {
						this.$message.error(data.msg);
					}
				});
			},
			chooseSemesterObj(chooseSemester){
				this.formYear = chooseSemester.id;
				this.semesterNum = chooseSemester.orderNum;
				this.fallYear = chooseSemester.year;
				this.startTime = chooseSemester.startTime;
				this.endTime = chooseSemester.endTime;
			},
        	getCourseAss(){
				//刘均要求 这里只查本学期的排课课程 9-24
        		this.loading = true;
        		this.$http.post("_ed:/semestercourse/list",{
					 semester_year: this.fallYear,
         			 semester_year_number: this.semesterNum
				}).then(data=>{
					 data.data.forEach(
						x => (x.displayName = x.course_arrange + "(" + x.majorNames + ")")
					);

        			this.semesterCourseList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
			},
			//获取课节
        	geLessonList(){
				this.$http.get("_op:/sections/find")
                .then(data=>{
					if(data.code==0){
                        if(data.data){
    						this.lessonList = data.data;
                        }
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			//获取授课形式
			getShape(){
				this.$http.post("_op:teaching/form/list",{
					pageNo:1,
					pageSize:100
				})
                .then(data=>{
					if(data.result && data.result.length){
						this.shapeList = data.result;
					}else{
						this.$message.error('未查询到授课形式');
					}
				})
			},
			//获取上课班级
        	getCoursecls(str=''){
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/coursecls",{
        			str:str
        		}).then(data=>{
        			this.courseclsList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
			},
			// 获取上课班级
			getClassList(){
                this.$http.post("_ed:/coursecls/list",{
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.courseclsList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
			//获取授课场地
        	getArea(str){
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/area",{
        			str:str
        		}).then(data=>{
        			this.areaList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
			},
			//获取教师名单列表
        	getTeacher(str){
        		this.loading = true;
        		return this.$http.post("_ed:/exchangecourse/query/teacher",{
        			str:str
        		}).then(data=>{
					this.teacherList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
        	},
        	// getTeachingCombox(){
        	// 	this.$http.get("_op:/teaching/form/combox").then(data=>{
        	// 		this.teachingTypeList=data.data;
            //     }).catch(()=>{
            //     })
        	// },
			//获取专业列表
			queryMajorList(){
				this.$http.get('_op:major/combox').then(res => {
					(res.code == 0) && (this.majorList = res.data);
				}).catch(err => {
				})
			},
        	getClsTeam(cls_id,teaching_form){
        		this.$http.get("_ed:/coursecls/group/cls/"+cls_id+"/teachingform/"+teaching_form).then(data=>{
        			if(data.data){
						this.clsTeamList=data.data;
					
						
        			}
        			
                }).catch(()=>{
                })
        	},
        	getCourseContent(str){
        		let self=this;
        		this.$http.post("_op:/courseContent/combox",{
        		    content:str,
        			semesterCourseId:this.dialog_semesterCourseId
        		}).then(data=>{
        			let iscontent=false;
        			data.data.map(item=>{
        				if(item.id==self.teachcontentobj.id){
        					iscontent=true;
        				}
        			})
        			if(!iscontent){
        				data.data.push(self.teachcontentobj)
        			}
        			this.courseContentList=data.data;
                }).catch(()=>{
                })
			},
			//获取多少天以前的时间
			getBeforeTime(n) {
			var n = n;
			var d = new Date();
			var year = d.getFullYear();
			var mon = d.getMonth() + 1;
			var day = d.getDate();
			if (day <= n) {
				if (mon > 1) {
				mon = mon - 1;
				} else {
				year = year - 1;
				mon = 12;
				}
			}
			d.setDate(d.getDate() - n);
			year = d.getFullYear();
			mon = d.getMonth() + 1;
			day = d.getDate();
			return (
				year +
				"-" +
				(mon < 10 ? "0" + mon : mon) +
				"-" +
				(day < 10 ? "0" + day : day)
			);
			},
			//计算本月有多少天
			getCountDays() {
			var curDate = new Date();
			var curMonth = curDate.getMonth();
			curDate.setMonth(curMonth + 1);
			curDate.setDate(0);
			return curDate.getDate();
			},
			fileResult(row) {  //导出结果
				this.$http2.post('_ed:/export/schedule/course',{
					beginDate: this.courseDate==null? '':this.courseDate[0],
					endDate: this.courseDate==null? '': this.courseDate[1],
					areaId: this.areaId,
					clsId: this.courseclsId,
					courseId: this.courseId,
					pageSize: this.tablePage.size,
					requestPage: this.tablePage.current,
					sectionNodeids: this.lessonIds,
					semestercourseId: this.semesterCourseId,
					teacherId: this.teacherId,
					teachingForm: this.shape,
					type: this.lessonType
				}).then(datas => {
					let url = window.URL.createObjectURL(new Blob([datas]));
					let y = this.$refs.exportExcel;
					y.href = url;
					y.setAttribute("download", "课程表.xls");
					y.click();
					window.URL.revokeObjectURL(url);
				})
			},
			searchList(){
				this.tablePage.current = 1;
				this.getTableData();
			},
			//搜索查询方法 获取列表
            getTableData(){
			// 			if(this.$route.query){
			// 	this.courseDate[0]= this.$route.query.todays
			// 	this.courseDate[1] = this.$route.query.todays
			// }
				let params = {};
				if(this.netType < 3){
					params.n_type = this.netType;
				}else{
					params.n_type = 3;
					params.net_type = this.netType;
				}
                this.$http.post("_ed:/exchangecourse/query",{
                	beginDate: this.courseDate==null? '':this.courseDate[0],
					endDate: this.courseDate==null? '': this.courseDate[1],
					areaId: this.areaId,
					clsId: this.courseclsId,
					courseId: this.courseId,
					pageSize: this.tablePage.size,
					requestPage: this.tablePage.current,
					sectionNodeids: this.lessonIds,
					semestercourseId: this.semesterCourseId,
					teacherId: this.teacherId,
					teachingForm: this.shape,
					type: this.lessonType,
					grade: this.grade,
					major_id: this.majorId,
					...params,
                }).then(data=>{
                    this.tableData=data.data.dataList;
                    this.tablePage.total=data.data.total_records;
                }).catch(()=>{
                    this.tableData=[];
                })
            },
            sizeChange(size){
                this.tablePage.current=1;
                this.tablePage.size=size;
                this.getTableData();//查询方法
            },
            currentChange(current){
                this.tablePage.current=current;
				this.getTableData();//查询方法
            },
            handleSelectionChange(val){
            
            	this.batchSelected=val;
            },
            batch(){
            	this.batchDate='';
            	this.batchLesson=[];
            	this.dialogBatch=true;
            },
            saveBatch(){
            	let idlist=[];
            	let lessonlist=[];
            	let sectionArr=[];
            	this.batchSelected.map(function(item){
            		idlist.push(item.id);
            		lessonlist.push(item.courseArrange)
            	})
            	
            	for (let i = 0; i < this.batchLesson.length; i++) {
            		for (let j = 0; j < this.lessonList.length; j++) {
            			if (this.batchLesson[i]==this.lessonList[j].id) {
            				sectionArr.push(this.lessonList[j])
            			}
            		}
            	}
            
	          	this.$http.post("_ed:/exchangecourse/exbatch",{
	              	idlist: idlist,
					ndscheduleitemDate: this.batchDate,
					sectionNodeidsJson: sectionArr
	            }).then(data=>{
						this.$message({
				          message: '课程'+lessonlist.join()+'调课成功！',
				          type: 'success'
				        });
	            }).catch(()=>{
	            })
            },
            // 获取详情列表
            adjustLesson(row,type){
            	let self=this;
            
            	this.$http.get("_ed:/exchangecourse/query/"+row.id).then(data=>{
					
				//	时间格式化   moment().format()
					data.data.scheduleitemDate=moment(data.data.scheduleitemDate).format('YYYY-MM-DD') 
				
        			if(type=='adjust'){
        				this.teachcontentobj={
        					id:data.data.teachingcontentId,
        					name:data.data.teachingContent
						}
					
						
	        			this.getArea(data.data.areaName);//获取授课场地？？
	        			this.getClsTeam(row.clsId,data.data.teachingForm);
	        			this.dialog_semesterCourseId=data.data.semestercourseId;
	        			this.getCourseContent("")
	        			let teacherArr=data.data.teacherNames.split(",");
	        			data.data.teachingForm= parseInt(data.data.teachingForm) ;
	        			data.data.teacherIds.map(function(item,index){
	        				let istea=true;
	        				self.teacherList.map(function(item_t){
	        					if(item==item_t.id){
	        						istea=false
	        					}
	        				})
	        				if(istea){
	        					self.teacherList.push({
		        					id:item,
		        					name:teacherArr[index]
		        				})
	        				}
	        				
						})
	        			this.adjustObj = {...data.data, net_type: data.data.net_type ? +data.data.net_type : ''};
	            		this.dialogAdjust=true;
	            		this.geLessonList();//获取节课
        			}else{
        				this.adjustObj = {...data.data, net_type: data.data.net_type ? +data.data.net_type : ''};
	            		this.dialogDet=true;
					}
                }).catch(()=>{
                })
            },
            saveAdjust(){
            
            	let areaname='';
            	let groupnameArr=[];
            	let groupnumberArr=[];
            	let teachernameArr=[];
            	let teachingcontentName='';
            	let teachingformName='';
            	let sectionArr=[];
            	for (let i = 0; i < this.areaList.length; i++) {
            		if (this.adjustObj.areaId==this.areaList[i].id) {
            			areaname=this.areaList[i].name;
            		}
            	}
            	
            	for (let i = 0; i < this.adjustObj.groupIds.length; i++) {
            		for (let j = 0; j < this.clsTeamList.length; j++) {
            			if (this.adjustObj.groupIds[i]==this.clsTeamList[j].id) {
            				groupnameArr.push(this.clsTeamList[j].name);
            				groupnumberArr.push(this.clsTeamList[j].group_number);
            			}
            		}
            	}
            	
            	for (let i = 0; i < this.adjustObj.teacherIds.length; i++) {
            		for (let j = 0; j < this.teacherList.length; j++) {
            			if (this.adjustObj.teacherIds[i]==this.teacherList[j].id) {
            				teachernameArr.push(this.teacherList[j].name);
            			}
            		}
            	}
            		
            	for (let i = 0; i < this.courseContentList.length; i++) {
            		if (this.adjustObj.teachingcontentId==this.courseContentList[i].id) {
            			teachingcontentName=this.courseContentList[i].name;
            		}
            	}
            	
            	for (let i = 0; i < this.teachingTypeList.length; i++) {
            		if (this.adjustObj.teachingForm==this.teachingTypeList[i].id) {
            			teachingformName=this.teachingTypeList[i].name;
            		}
            	}
            	
            	for (let i = 0; i < this.adjustObj.sectionNodeids.length; i++) {
            		for (let j = 0; j < this.lessonList.length; j++) {
            			if (this.adjustObj.sectionNodeids[i]==this.lessonList[j].id) {
            				sectionArr.push(this.lessonList[j])
            			}
            		}
            	}
            	
            	this.$http.post("_ed:/exchangecourse/exone",{
            		ndareaId: this.adjustObj.areaId,
					ndareaName: areaname,
					ndgroupIds: this.adjustObj.groupIds,
					ndgroupNames: groupnameArr.join(','),
					ndgroupNumbers: groupnumberArr,
					ndscheduleitemDate: this.adjustObj.scheduleitemDate,
					ndteacherIds: this.adjustObj.teacherIds,
					ndteacherNames: teachernameArr.join(','),
					ndteachingContentId: this.adjustObj.teachingcontentId,
					ndteachingContent: teachingcontentName,
					ndteachingForm: this.adjustObj.teachingForm,
					ndteachingFormname: teachingformName,
					scheduleitemId: this.adjustObj.id,
					sectionNodeidsJson: sectionArr
        		}).then(data=>{
        			if(data.code==0){
        				this.getTableData() //查询方法
	            		this.dialogAdjust=false;
        				this.$message({
				          message: '编辑成功',
				          type: 'success'
				        });
        			}
                }).catch(()=>{
                })
            },
            cancelBtn(row){
            	this.$http.delete("_ed:/exchangecourse/cancel/"+row.id).then(data=>{
        			this.getTableData()//查询方法
        			this.$message({
			          message: '取消成功',
			          type: 'success'
			        });
                }).catch(()=>{
                })
            },
        	
        	clsDet(clsId){
        		this.$http.get("_ed:/coursecls/detail/"+clsId).then(data=>{
        			this.classdetail=data.data;
        			this.dialogClsDet=true;
                }).catch(()=>{
                })
        	},
        	courseDet(row){
        		this.$http.get("_ed:/semestercourse/detail/"+row.semestercourseId).then(data=>{
        			this.coursedetail.data=data.data;
        			this.coursedetail.year=data.data[0].semester_name;
        			this.coursedetail.grade=data.data[0].grade;
        			this.coursedetail.courseArrange=row.courseArrange;
        			this.dialogCourseDet=true;
                }).catch(()=>{
                })
        	},
        
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },

			// 获取当前学期的开始日期和结束日期
			getTermRange(){
				let today = new Date();
				let start = new Date(this.startTime);
				let s = new Date(start.setDate(start.getDate() - 1));
				let e = new Date(this.endTime);
				let _start = '';
				if(today >= s && today <= e){
					_start = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
				}else{
					_start = this.startTime;
				}
				
				this.courseDate = [_start,this.endTime];
			},
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
			
			this.getTermData();//获取当前学期

			this.getCountDays();//计算本月多少天算法
			this.getBeforeTime();//获取多少天以前的方法
        	this.getCourse();//获取课程名称
        
        	// this.getCoursecls();//获取上课班级
        	this.getArea();//获取授课场地列表
			this.geLessonList();//获取节课
			this.getShape();//获取授课形式
			this.queryNetList();//网课列表
			this.queryMajorList();//专业列表
			//获取教师名单列表并且获取学期
			Promise.all([this.getTeacher('')])
        	.then(()=>{
				let vuex = JSON.parse(localStorage.getItem('vuex'));
				let teacherId = vuex&&vuex.me&&vuex.me.attributes&&vuex.me.attributes.login_info&&vuex.me.attributes.login_info.id;
				if(teacherId){
					this.teacherId = teacherId*1;
					if(!this.teacherList.find(item=>item.id==teacherId)){
						let teacherName = vuex&&vuex.me&&vuex.me.user&&vuex.me.user.name || '';
						this.teacherList = [...this.teacherList,{id:teacherId,name:teacherName}];
					}
				}


			}).then(this.getTableData);
			// this.getTeachingCombox();
        }
    }
</script>

<style scoped lang="less">
.adjust-box{
	width: 90%;
	margin: auto;
	.det-box{
		margin-bottom: 30px;
		.title{
			font-weight: bold;
			margin-bottom: 10px;
		}
	}
}
.adjust-line{
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	label{width: 15%;margin-right: 20px;text-align: right;}
	.el-input , .el-select{width: 60%;}
}
</style>