-<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
                
        <div class="cm-fold">
            <el-form :inline="true" size="medium">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        
                        <el-form-item label="授课日期2222">
						    <el-date-picker
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
                        
                        <el-form-item label="排课课程2222">
							<el-select 
								v-model="semesterCourseId" 
								placeholder="请选择" 
								clearable 
								filterable
								remote
								:remote-method="getSemesterCourse"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in semesterCourseList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="课程名称">
							<el-select 
								v-model="courseId" 
								placeholder="请选择" 
								clearable 
								filterable
								remote
								:remote-method="getCourse"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in courseList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="上课班">
							<el-select 
								v-model="courseclsId" 
								placeholder="请选择" 
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
                        
                        <el-form-item label="授课老师">
							<el-select 
								v-model="teacherId" 
								placeholder="请选择" 
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
                    <div class="btn">
                        <el-button type="primary" size="medium" @click="getTableData">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div> 
        
        <div class="cm-btn-con"  >
            <el-button size="medium" type="primary" @click="batch" style="visibility:hidden ">批量调整时间</el-button>
        </div>
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
	                @selection-change="handleSelectionChange"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column type="selection" label="全选" fixed width="80"></el-table-column>

                <el-table-column label="排课课程">
                	<template slot-scope="scope">
                		<el-button type="text" size="small" @click="courseDet(scope.row)">{{scope.row.courseArrange}}</el-button>
                	</template>
                </el-table-column>
                <el-table-column label="授课日期">
                	<template slot-scope="scope">{{scope.row.scheduleitemDate | dateFn}}</template>
                </el-table-column>
                <el-table-column prop="sectionNodenames" label="授课课节"></el-table-column>
                <el-table-column prop="teacherNames" label="授课老师"></el-table-column>
                <el-table-column prop="areaName" label="授课场地"></el-table-column>
                <el-table-column label="上课班">
                	<template slot-scope="scope">
                		<el-button type="text" size="small" @click="clsDet(scope.row.clsId)">{{scope.row.clsName}}</el-button>
                	</template>
                </el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small" @click="adjustLesson(scope.row,'adjust')">调课</el-button>
                        <el-button type="text" size="small" @click="cancelBtn(scope.row)">取消</el-button> -->
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
        
        <!----------------编辑调课-------------------->
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
						v-model="adjustObj.areaId" 
						placeholder="请搜索选择" 
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
				</div>
				<div class="adjust-line">
					<label>授课形式</label>
					<el-select 
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
						v-model="adjustObj.teachingcontentId" 
						placeholder="请搜索选择" 
						clearable 
						filterable
						remote
						:remote-method="getCourseContent"
						:loading="loading">
					    <el-option 
					    	v-for="(item,index) in courseContentList" 
					    	:key="index" 
					    	:label="item.name" 
					    	:value="item.id"> 
					    </el-option>
					</el-select>
				</div>
				<div class="adjust-line">
					<label>授课老师</label>
					<el-select 
						v-model="adjustObj.teacherIds" 
						placeholder="请搜索选择" 
						multiple 
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
                		<p v-for="item in scope.row.cls_infos">{{item.class_belong}}</p>
                	</template>
                </el-table-column>

            </el-table>
			
		</el-dialog>
		
		<!----------------排课课程详情-------------------->
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
			
			<!-- <p style="margin-bottom: 20px;">上课班:{{coursedetail.name}}</p> -->
			<el-table
                    ref="multipleTable"
                    :data="coursedetail.data"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column prop="major" label="专业"></el-table-column>
                <el-table-column prop="course_name" label="课程名称"></el-table-column>

            </el-table>
		</el-dialog>
		
		<!----------------批量调整时间-------------------->
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
		
		
    </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'
    export default {
        name: "adjust_lesson",
        data() {
            return {
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "课程表查询"}
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
            }
        },
        filters: {
        	dateFn(val){
        		return moment(val).format('YYYY-MM-DD')
        	}
        },
        methods: {
        	getCourse(str){
        		this.$http.post("_ed:/exchangecourse/query/course",{
        			str:str
        		}).then(data=>{
        			this.courseList=data.data;
                }).catch(()=>{
                })
        	},
        	getSemesterCourse(str){
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/semestercourse",{
        			str:str
        		}).then(data=>{
        			this.semesterCourseList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
        	},
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
        	getTeacher(str){
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/teacher",{
        			str:str
        		}).then(data=>{
        			this.teacherList=data.data;
        			this.loading = false;
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
            
            adjustLesson(row,type){
            	let self=this;
            	this.$http.get("_ed:/exchangecourse/query/"+row.id).then(data=>{
        			data.data.scheduleitemDate=moment(data.data.scheduleitemDate).format('YYYY-MM-DD') 
        			if(type=='adjust'){
        				
        				this.teachcontentobj={
        					id:data.data.teachingcontentId,
        					name:data.data.teachingContent
        				}
        				
	        			this.getArea(data.data.areaName);
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
	        			this.adjustObj=data.data;
	            		this.dialogAdjust=true;
	            		this.geLessonList();
        			}else{
        				this.adjustObj=data.data;
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
				
				let login_id = '';
				let a = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info;
					a && (login_id = a.id);

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
					sectionNodeidsJson: sectionArr,
					startTeacherId: login_id
        		}).then(data=>{
        			if(data.code==0){
        				this.getTableData()
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
            }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
        created(){
        	this.getTableData();
        	this.getCourse();
        	this.getSemesterCourse();
        	this.getCoursecls();
        	this.getArea();
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
	label{width: 15%;margin-right: 20px;text-align: right;}
	.el-input , .el-select{width: 60%;}
}
</style>