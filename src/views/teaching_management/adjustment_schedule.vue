<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
                
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-if="btnPerObj.query">
                            <el-button type="primary" @click="condition">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        
                        <el-form-item label="授课日期">
						    <el-date-picker
							  style="width:300px;"
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
<!--                         
                        <el-form-item label="排课课程">
							<el-select 
								v-model="semesterCourseId" 
								placeholder="请搜索查询选择" 
								clearable 
								filterable
								
								:remote-method="getSemesterCourse"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in semesterCourseList" 
							    	:key="index" 
							    	:label="item.name+'('+item.major_names+')'" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item> -->

						  <el-form-item label="排课课程">
							<el-select
								class="pkkcBox"
								v-model="semesterCourseId"
								filterable
								clearable
								placeholder="全部"
								
							>
								<el-option
							
								v-for="list in se_courseList"
								:key="list.id"
								:label="list.displayName"
								:value="list.id"
								></el-option>
							</el-select>
							</el-form-item>

                        
                        <el-form-item label="上课班">
							<el-select 
								v-model="courseclsId" 
								placeholder="请搜索查询选择" 
								clearable 
								filterable
								remote
								:remote-method="getCoursecls"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in courseclsList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="授课场地">
							<el-select 
								v-model="areaId" 
								placeholder="请搜索查询选择" 
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
                        
                        <el-form-item label="授课老师">
							<el-select 
								v-model="teacherId" 
								placeholder="请搜索查询选择" 
								clearable 
								filterable
								remote
								:remote-method="getTeacher"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in teacherList" 
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
							    <el-option label="X" :value="9999"></el-option>
							</el-select>
                        </el-form-item>
                        
                    </div>
                    <div class="btn" v-if="btnPerObj.edit">
                        <el-button size="mini" type="primary" @click="batch" :disabled="batchSelected.length==0">批量调整</el-button>
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
                <el-table-column type="selection" label="全选" fixed width="38"></el-table-column>

                <el-table-column label="排课课程" width="160">
                	<template slot-scope="scope">
                		<el-button type="text" size="small" @click="courseDet(scope.row)">{{scope.row.courseArrange}}</el-button>
                	</template>
                </el-table-column>
					<el-table-column prop="week" label="周次" width="48"></el-table-column>
				<el-table-column prop="weekDay" label="星期" width="60">
					<template slot-scope="scope">
						{{scope.row.weekDay|filtersTextChange}}
					</template>
				</el-table-column>
                <el-table-column label="授课日期"  width="85">
                	<template slot-scope="scope">{{scope.row.scheduleitemDate | dateFn}}</template>
                </el-table-column>
                <el-table-column prop="sectionNodenames" label="课节" width="60"></el-table-column>
				<el-table-column prop="teachingContent" label="授课内容" width="320"></el-table-column>
				<el-table-column prop="teachingformName" label="授课形式" width="80"></el-table-column>
                <el-table-column prop="teacherNames" label="授课老师" width="70"></el-table-column>
                <el-table-column prop="areaName" label="授课场地" width="150"></el-table-column>
				 <el-table-column prop="groupNames" label="分组"  ></el-table-column>
                <el-table-column label="上课班" width="200">
                	<template slot-scope="scope">
						<el-button @click="clsDet(scope.row.clsId)" type="text" size="small">{{scope.row.clsName}}</el-button>
                	</template>
                </el-table-column>

                <el-table-column label="操作" width="120" v-if="btnPerObj.exchange||btnPerObj.cancel||btnPerObj.detail">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" 
                        	:disabled="verifyDate(scope.row.scheduleitemDate)"
                        	@click="adjustLesson(scope.row,'adjust')" 
                        	v-if="btnPerObj.exchange">
                        	调课
                        </el-button>
                        <el-button type="text" size="small" 
                        	:disabled="verifyDate(scope.row.scheduleitemDate)"
                        	@click="cancelBtn(scope.row)" 
                        	v-if="btnPerObj.cancel">
                        	取消
                        </el-button>
                        <el-button type="text" size="small" @click="adjustLesson(scope.row,'det')" v-if="btnPerObj.detail">详情</el-button>
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
			title="编辑调课"
			:visible.sync="dialogAdjust"
			:append-to-body="true"
			width="70%">
			
			<div class="adjust-box">
				<div class="adjust-line">
					<label>排课课程</label>
					<el-input :disabled="true" v-model="adjustObj.courseArrange"></el-input>
				</div>
				<div class="adjust-line">
					<label>上课班</label>
					<el-input :disabled="true" v-model="adjustObj.clsName"></el-input>
				</div>
				<div class="adjust-line">
					<label>日期</label>
					<el-date-picker
				      v-model="adjustObj.scheduleitemDate"
				      type="date"
				      value-format="yyyy-MM-dd"
				      placeholder="选择日期">
				    </el-date-picker>
				</div>
				<div class="adjust-line">
					<label>课节</label>
					<el-select 
						v-model="adjustObj.sectionNodeids" 
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
				<div class="adjust-line">
					<label>授课场地</label>
					<el-select 
						v-model="adjustObj.areas"
						value-key="id"
						placeholder="请搜索选择" 
						clearable 
						filterable
						multiple
						remote
						reserve-keyword
						:remote-method="getArea"
						:loading="loading">
					    <el-option 
					    	v-for="(item) in areaList" 
					    	:key="item.id" 
					    	:label="item.name" 
					    	:value="item"> 
					    </el-option>
					</el-select>
				</div>
				<div class="adjust-line">
					<label>授课形式</label>
					<el-select 
						@change="teachingTypeChange"
						v-model="adjustObj.teachingForm" 
						placeholder="请选择" 
						clearable 
						filterable>
					    <el-option 
					    	v-for="(item,index) in teachingTypeList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select>
				</div>
				<div class="adjust-line">
					<label>分组</label>
					<el-select 
						v-model="adjustObj.groupIds" 
						placeholder="请选择" 
						multiple 
						clearable 
						filterable>
					    <el-option 
					    	v-for="(item,index) in clsTeamList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select>
				</div>
				<div class="adjust-line">
					<label>授课内容</label>
					<el-select 
						v-model="adjustObj.teachingcontentIds" 
						placeholder="请搜索选择" 
						clearable 
						multiple
						filterable
						:loading="loading">
					    <el-option 
					    	v-for="(item,index) in courseContentList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select>
						<!-- <el-select 
						v-model="adjustObj.areaIds" 
						placeholder="请搜索选择" 
						clearable 
						filterable
						multiple
						remote
						:remote-method="getArea"
						:loading="loading">
					    <el-option 
					    	v-for="(item,index) in areaList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select> -->
				</div>
				<div class="adjust-line">
					<label>授课老师</label>
					<el-select 
						v-model="adjustObj.teachers" 
						value-key = "id"
						placeholder="请搜索选择" 
						multiple 
						clearable 
						filterable
						remote
						reserve-keyword
						:remote-method="getTeacher"
						:loading="loading2">
					    <el-option 
					    	v-for="(item) in teacherList"
					    	:key="item.id" 
					    	:label="item.name" 
					    	:value="item"> 
					    </el-option>
					</el-select>
				</div>
			</div>
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogAdjust = false">取 消</el-button>
			    <el-button type="primary" @click="saveAdjust">确 定</el-button>
			</span>
		</el-dialog>
        <!----------------调课详情-------------------->
        <el-dialog
			title="调课详情"
			:visible.sync="dialogDet"
			:append-to-body="true"
			width="40%">
			
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
					<!--<p class="adjust-line">教学模式： {{adjustObj.areaName}}</p>-->
					<p class="adjust-line">分组号： {{adjustObj.groupNames}}</p>
				</div>
			</div>
		</el-dialog>


		<!----------------上课班详情-------------------->
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
                		<p v-for ="item in scope.row.cls_infos" >{{item.class_belong}} ({{item.stu_Number}}人)</p>
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
				<span style="margin-right: 20px;">学期：{{coursedetail.semester}}</span>
				<span style="margin-right: 20px;">所在级：{{coursedetail.grade}}</span>
				<span>排课课程：{{coursedetail.courseArrange}}</span>
			</div>
			
			<!-- <p style="margin-bottom: 20px;">上课班:{{coursedetail.name}}</p> -->
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
		<!-- 冲突明细弹窗 -->
		<el-dialog
			title="冲突明细"
			:visible.sync="conflictDetails"
			:close-on-click-modal="false"
			:append-to-body="true"
			width="70%"
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
			  	<el-button @click="conflictDetails = false">确 定</el-button> 
			</span>
		</el-dialog>
		
		<!----------------批量调整-------------------->
        <el-dialog
			title="批量调整"
			:visible.sync="dialogBatch"
			:close-on-click-modal="false"
			:append-to-body="true"
			width="40%">
			
			<div class="adjust-box">
				<el-tabs v-model="activeName">
					<el-tab-pane label="时间" name="1">
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
					</el-tab-pane>
					<el-tab-pane label="场地" name="2">
						<div class="adjust-line">
							<label>调整后场地</label>
							<el-select 
								v-model="batchArea"
								placeholder="请搜索选择" 
								clearable 
								filterable
								multiple
								remote
								reserve-keyword
								:remote-method="getArea2"
								:loading="loading">
								<el-option 
									v-for="(item) in areaList2"
									:key="item.id" 
									:label="item.name" 
									:value="item.id"> 
								</el-option>
							</el-select>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogBatch = false">取 消</el-button>
			    <el-button type="primary" @click="saveBatch">确 定</el-button>
			</span>
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
                    {label: "调课进度表"}
                ],
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
                lessonIds:[],
                tableData: [],
                tablePage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
                
				/**/
				conflictDetails:false,//冲突明细
				conflictData:[],
				dialogAdjust:false,
				// adjustObj:{},
                adjustObj:{
					
				},//调课详情
                teachingTypeList:[],//授课类型
                clsTeamList:[],//上课班分组
                courseContentList:[],//上课内容
                dialogDet:false,//详情
                dialog_semesterCourseId:'',
                dialogClsDet:false,//上课班详情
                classdetail:{},//上课班详情
				options1:'',//学期列表
				fallYear:'',
				semesterNum:'',
				se_courseList:[],
                teachcontentobj:{},//授课内容
                
                dialogCourseDet:false,//排课课程详情
                coursedetail:{},
                
                dialogBatch:false,//批量调课
                batchSelected:[],//已选课程
                batchDate:'',//调整后日期
                batchLesson:[],//调整后课节
				batchArea:[],//调整后场地
				areaList2:[],
                
        		nowDay: new Date(new Date().getTime() - 24*60*60*1000).getTime(),
                
                loading: false,
				loading2:false,
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
                btnPerObj:{//按钮权限
                  query:false,
                  edit:false,
                  exchange:false,
                  cancel:false,
                  detail:false
                },
				areaIdsTemp:[],
				activeName:'1',
            }
        },
        filters: {
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
			 //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						if (item.code=="query_tiaokejindubiao") {  //查询
						self.btnPerObj.query=true;
						}
						if (item.code=="edit_batch_tiaokejindubiao") {  //批量调整时间
						self.btnPerObj.edit=true;
						}
						if (item.code=="exchange_course_tiaokejindubiao") {  //调课
						self.btnPerObj.exchange=true;
						}
						if (item.code=="cancel_course_tiaokejindubiao") {  //取消
						self.btnPerObj.cancel=true;
						}
						if (item.code=="detail_tiaokejindubiao") {  //详情
						self.btnPerObj.detail=true;
						}
						
                    });
                }).catch(()=>{
                })
            },
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
						for (let i = 0; i < this.options1.length; i++) {
						
							if (this.options1[i].name.indexOf("当前学期") != -1) {
								this.formYear = this.options1[i].id;
								this.addForm = this.options1[i].name;
								this.semesterNum = this.options1[i].orderNum;
								this.fallYear = this.options1[i].year;
							
							}
						}

						this.getCourseAss(this.formYear);
						// this.getTableList();
						// this.getClassList();
						} else {
						this.$message.error(data.msg);
						}
					});
					},

			 /*获取排课课程*/
				getCourseAss(_id) {

					//刘均要求只查当前学期的排课课程 9-12
				for (let item of this.options1) {
					if (item.id == _id) {
					this.fallYear = item.year;
					this.semesterNum = item.orderNum;
					}
				}

				this.$http
					.post("_ed:/semestercourse/list", {
					semester_year: this.fallYear,
					semester_year_number: this.semesterNum
					})
					.then(data => {
					if (data.code == 0) {
						data.data.forEach(
						x => (x.displayName = x.course_arrange + "(" + x.majorNames + ")")
						);
						this.se_courseList = data.data;
					} else {
						this.$message.error(data.msg);
					}
					});
				
				},
        	// getSemesterCourse(str){ // 9-12前获取的排课课程
        	// 	this.loading = true;
        	// 	this.$http.post("_ed:/exchangecourse/query/semestercourse",{
        	// 		str:str
        	// 	}).then(data=>{
			// 		debugger
			// 		this.semesterCourseList=data.data;
			// 		console.log('排课课程明细', this.semesterCourseList)
        	// 		this.loading = false;
            //     }).catch(()=>{
            //     })
        	// },
        	geLessonList(){//获取课节
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
        	getCoursecls(str){
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/coursecls",{
        			str:str
        		}).then(data=>{
        			this.courseclsList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
        	},
        	getArea(str, callback){
				if(str == null || str.length <= 0) return;
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/area",{
        			str:str
        		}).then(data=>{
					
					var temp = data.data;
					if (!this.adjustObj.areas) this.adjustObj.areas = [];
					if (this.adjustObj.areas.length > 0) {
						this.adjustObj.areas.forEach(x => {
							var l = temp.filter(a => a.id == x.id);
							if (l.length <= 0) {
								temp = temp.concat(x);
							}
						});
					}
					this.areaList = JSON.parse(JSON.stringify(temp));
					this.loading = false;
					if (callback != null) {
						if (typeof(callback) == 'function') {
							callback(JSON.parse(JSON.stringify(temp)));
						}
					}
                }).catch(()=>{
                })
        	},
			getArea2(query){
				let filterList = [];
				if(this.batchArea&&this.batchArea.length>0){
					filterList = this.areaList2.filter(item1=>this.batchArea.find(item2=>item2==item1.id));
				}
				if (query !== '') {
					this.loading = true;
					this.$http.post('_ed:/exchangecourse/query/area', {
						str: query
					}).then(data => {
						this.loading = false;
						let tempArr = data.data.filter(item1=>!filterList.find(item2=>item2.id==item1.id));
						this.areaList2 = [...tempArr,...filterList];
					})
				}
			},
        	getTeacher(str, callback){
				let self = this
				if (str == null || str.length <= 0) return;
        		self.loading2 = true;
        		this.$http.post("_ed:/exchangecourse/query/teacher",{
        			str:str
        		}).then(data=>{
					var temp = data.data;
					
					if (!self.adjustObj.teachers) self.adjustObj.teachers = [];
					if (self.adjustObj.teachers.length > 0) {
						
						self.adjustObj.teachers.forEach(x => {
							var l = temp.filter(t => t.id == x.id);
							if (l.length <= 0) {
								temp = temp.concat(x);
							}
						})
					}
					self.teacherList=JSON.parse(JSON.stringify(temp));
					
					self.loading2 = false;
					if (callback != null) {
						if (typeof(callback) == 'function') {
							callback(JSON.parse(JSON.stringify(temp)));
						}
					}
                }).catch(()=>{
                })
        	},
        	getTeachingCombox(){
        		this.$http.get("_op:/teaching/form/combox").then(data=>{
        			this.teachingTypeList=data.data;
                }).catch(()=>{
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
        	teachingTypeChange(){
        		this.adjustObj.groupIds=[];
        		this.getClsTeam(this.adjustObj.clsId,this.adjustObj.teachingForm)
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
			condition(){
				this.tablePage.current = 1;
				this.getTableData();
			},
            getTableData(){
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
					teacherId: this.teacherId
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
                this.getTableData();
            },
            currentChange(current){
                this.tablePage.current=current;
                this.getTableData();
            },
            handleSelectionChange(val){
          
            	this.batchSelected=val;
            },
            batch(){
            	this.batchDate='';
            	this.batchLesson=[];
				this.batchArea = [];
				this.activeName = '1';
            	this.dialogBatch=true;
            },
            saveBatch(){
            	let idlist=[];//id数组
            	let lessonnamelist=[];//排课 课程名称的数组
				let sectionArr=[];//课节名称数组
				let areaIds = [] ;//场地数组
				let areaNamearr = [] //场地名称
				// let updateType  = 1

				//选中的数组 循环 出来 ID数组 拍客数组  课节数组 场地数组 场地名称数组
            	this.batchSelected.map(function(item){
					idlist.push(item.id);
					areaIds.push(item.areaId)
					areaNamearr.push(item.areaName)
            		lessonnamelist.push(item.courseArrange)
            	})
				
				// 用选中的课节数组 batchLesson 与 全部的课节数组对比 找出对应的ID 拿到选中的课节数组名称
            	for (let i = 0; i < this.batchLesson.length; i++) {
            		for (let j = 0; j < this.lessonList.length; j++) {
            			if (this.batchLesson[i]==this.lessonList[j].id) {
            				sectionArr.push(this.lessonList[j].name)
            			}
            		}
            	}
            	let query = {
					// area_ids:areaIds,
					// area_name:areaNamearr.join(','),
					schedule_item_date :this.batchDate,
					section_nodeids:this.batchLesson,
					section_nodenames:sectionArr.join(','),
					schedule_item_ids  : idlist,
					sectionNodeidsJson: sectionArr,
					// updateType:updateType
	            }
				if(this.activeName=='1'){
					query.area_ids = areaIds;
					query.area_name = areaNamearr.join(',');
					query.updateType = 1;
				}else{
					query.area_ids = this.batchArea;
					let tempArr = this.areaList2.filter(item1=>this.batchArea.find(item2=>item2==item1.id));
					query.area_name = tempArr.map(item=>item.name).join(',');
					query.updateType = 2;
				}
            	
	          	this.$http.post("_ed:/schedule/item/batchUpdateDateArea",query).then(data=>{
					if(data.code==0){
						this.$message({
							message: '课程'+lessonnamelist.join()+'调课成功！',
							type: 'success'
						});
						this.getTableData();
					}else if(data.code==1){
						let datalist = []
						if(data.msg.length>0){
							datalist = JSON.parse(data.msg);
							this.conflictData = datalist
							this.conflictDetails=true;
						}
					}
					this.dialogBatch=false;
	            }).catch(()=>{
	            })
            },
            
            adjustLesson(row,type){
				let self=this;
            	this.$http.get("_ed:/exchangecourse/query/"+row.id).then(data=>{
        			data.data.scheduleitemDate=moment(data.data.scheduleitemDate).format('YYYY-MM-DD');
					this.$set(this.adjustObj,'areas',[]);
					this.$set(this.adjustObj,'teachers',[]);
					this.areaIdsTemp = data.data.areaIds;
        			if(type=='adjust'){
        				
        				this.teachcontentobj={
        					id:data.data.teachingcontentId,
        					name:data.data.teachingContent
        				}
						for(let key in data.data){
							this.$set(this.adjustObj,key,data.data[key]);
						}
						this.getArea(data.data.areaName, (areas) => {
							this.$set(this.adjustObj,'areas',areas);
						});


	        			this.getClsTeam(row.clsId,data.data.teachingForm);
	        			this.dialog_semesterCourseId=data.data.semestercourseId;
	        			this.getCourseContent("")
	        			let teacherArr=data.data.teacherNames.split(",");
						data.data.teachingForm= parseInt(data.data.teachingForm) ;
						this.getTeacher(data.data.teacherNames, (teachers) => {
							let filterResult = teachers.filter(teacherItem=>data.data.teacherIds.find(teacher_idItem=>teacherItem.id==teacher_idItem));
							this.$set(this.adjustObj,'teachers',filterResult);
						});
						
	            		self.dialogAdjust=true;
						self.geLessonList();
        			}else{
        				for(let key in data.data){
							this.$set(this.adjustObj,key,data.data[key]);
						}
	            		self.dialogDet=true;
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
				let tempArr = [];
				// this.adjustObj.areaIds.forEach(id => {
				// 	let t = this.areaList.filter(a => a.id == id);
				// 	tempArr = tempArr.concat(t.map(x => { return x.name}));
				// });
				// areaname = tempArr.join(',');
				// console.info(areaname);
				var areaIds = [];
				if (this.adjustObj.areas.length > 0) {
					this.adjustObj.areas.forEach(a => {
						tempArr.push(a.name);
						areaIds.push(a.id);
					});
				}
				areaname = tempArr.join(',');
            	// for (let i = 0; i < this.areaList.length; i++) {
            	// 	if (this.adjustObj.areaIds==this.areaList[i].id) {
            	// 		areaname=this.areaList[i].name;
            	// 	}
            	// }           	
				let tempArr2 = [];
				// console.log('22222', this.adjustObj)
				this.adjustObj.teachingcontentIds.forEach(id => {
					let t = this.courseContentList.filter(a => a.id == id);
					tempArr2 = tempArr2.concat(t.map(x => { return x.name}));
				});
				teachingcontentName = tempArr2.join(',');
				console.info(teachingcontentName);
            		
            	// for (let i = 0; i < this.courseContentList.length; i++) {
            	// 	if (this.adjustObj.teachingcontentId==this.courseContentList[i].id) {
            	// 		teachingcontentName=this.courseContentList[i].name;
            	// 	}
				// }
				
				for (let i = 0; i < this.adjustObj.groupIds.length; i++) {
            		for (let j = 0; j < this.clsTeamList.length; j++) {
            			if (this.adjustObj.groupIds[i]==this.clsTeamList[j].id) {
            				groupnameArr.push(this.clsTeamList[j].name);
            				groupnumberArr.push(this.clsTeamList[j].group_number);
            			}
            		}
            	}
            	
            	// for (let i = 0; i < this.adjustObj.teacherIds.length; i++) {
            	// 	for (let j = 0; j < this.teacherList.length; j++) {
            	// 		if (this.adjustObj.teacherIds[i]==this.teacherList[j].id) {
            	// 			teachernameArr.push(this.teacherList[j].name);
            	// 		}
            	// 	}
				// }
				var teacherIds = [];
				if (this.adjustObj.teachers.length > 0) {
					this.adjustObj.teachers.forEach(t => {
						teachernameArr.push(t.name);
						teacherIds.push(t.id);
					})
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
            	
            	if (!this.adjustObj.scheduleitemDate) {
            		this.$message.error('请选择日期');
            		return false;
            	} else if (sectionArr.length==0) {
            		this.$message.error('请选择课节');
            		return false;
            	} else if (!this.adjustObj.areaId) {
            		this.$message.error('请选择授课场地');
            		return false;
            	} else if (!this.adjustObj.teachingForm) {
            		this.$message.error('请选择授课形式');
            		return false;
            	} else if (  this.adjustObj.groupIds.length==0) {
            		this.$message.error('请选择分组');
            		return false;
            	} else if (!this.adjustObj.teachingcontentId) {
            		this.$message.error('请选择授课内容');
            		return false;
            	} else if (this.adjustObj.teachers.length==0) {
            		this.$message.error('请选择授课老师');
            		return false;
				} 
				let login_id = '';
				let a = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info;
					a && (login_id = a.id);

            	 console.log('???授课场地', this.adjustObj)
            	this.$http.post("_ed:/exchangecourse/exone",{
					// ndareaId: this.adjustObj.areaId,
					areaIds:this.areaIdsTemp,
					ndareaIds:areaIds,
					
					ndareaName: areaname,
					ndgroupIds: this.adjustObj.groupIds,
					ndgroupNames: groupnameArr.join(','),
					ndgroupNumbers: groupnumberArr,
					ndscheduleitemDate: this.adjustObj.scheduleitemDate,
					ndteachingContentIds:this.adjustObj.teachingcontentIds,
					// ndteachingContentId: this.adjustObj.teachingcontentId,
					ndteacherIds: teacherIds,
					ndteacherNames: teachernameArr.join(','),
				
					ndteachingContent: teachingcontentName,
					ndteachingForm: this.adjustObj.teachingForm,
					ndteachingFormname: teachingformName,
					scheduleitemId: this.adjustObj.id,
					sectionNodeidsJson: sectionArr,
					startTeacherId: login_id
        		}).then(data=>{
        			if(data.code==0){
        				this.getTableData()
	            		this.dialogAdjust=false;
        				this.$message({
				          message: '调课成功',
				          type: 'success'
				        });
        			}else{
						this.conflictData= JSON.parse(data.data[0]) 
						this.conflictDetails=true;
        			}
                }).catch(()=>{
                })
            },
            cancelBtn(row){
            	this.$http.delete("_ed:/exchangecourse/cancel/"+row.id).then(data=>{
        			this.getTableData()
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
        			this.coursedetail.semester=data.data[0].semcourse_semester_name;
        			this.coursedetail.grade=data.data[0].grade;
        			this.coursedetail.courseArrange=row.courseArrange;
        			this.dialogCourseDet=true;
                }).catch(()=>{
                })
        	},
        	verifyDate(val){
				
        		return val-this.nowDay<0 ? true:false;
        	},
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            }
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
        created(){
        	this.getTableData();
        	this.getCourse();
        	// this.getSemesterCourse();
        	this.getCoursecls();
        	this.getTermData();
        	this.geLessonList();
        	this.getTeacher();
        	this.getTeachingCombox();
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
	label{width: 17%;margin-right: 20px;text-align: right;}
	.el-input , .el-select{width: 80%;}
}
.boxStyle{
	height: 500px;
}
.tableLineFeed{
	width: 195px;
	color: #409EFF;
}
</style>