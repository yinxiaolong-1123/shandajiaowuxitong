<template>
	<div class="cm-container">
        <div class="cm-breadcrumb">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
				</el-breadcrumb-item>
			</el-breadcrumb>
        </div>
        <div class="place-index">
			<el-form :inline="true" size="mini">
				<div style="display:flex;justify-content:space-between;" ref="selectArea">
					<div>
						<el-form-item label="学期">
							<el-select v-model="semester" placeholder="请选择" @change="onSemesterChange">
								<el-option
									v-for="(item,i) in semesterList"
									:key="i"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="课室单位">
							<el-select v-model="department" filterable placeholder="请选择"
							@change="onDepartmentChange">
								<el-option label="全部" value=""></el-option>
								<el-option
									v-for="(item,i) in departmentList"
									:key="i"
									:label="item.name"
									:value="item.departmentid">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="楼栋">
							<el-select v-model="building" filterable placeholder="请选择"
								@change="onBuildingChange">
								<el-option label="全部" value=""></el-option>
								<el-option
									v-for="(item,i) in buildingList"
									:key="i"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="楼层">
							<el-select v-model="floor" filterable placeholder="请选择" clearable
								@change="onFloorChange">
								<el-option label="全部" value=""></el-option>
								<el-option
									v-for="(item,i) in floorList"
									:key="i"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="场地">
							<el-select v-model="areaId" filterable placeholder="请选择" 
							@change="onAreaChange" style="width:180px;">
								<el-option label="全部" value=""></el-option>
								<el-option
									v-for="(item,i) in areaList"
									:key="i"
									:label="item.area_name"
									:value="item.area_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="周次">
							<el-select v-model="week" filterable placeholder="请选择" 
							@change="onWeekChange" clearable style="width:90px;">
								<el-option
									v-for="(item,i) in weekList"
									:key="item"
									:label="'第'+item+'周'"
									:value="item">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="日期">
							<el-date-picker
								@change="onDateRangeChange"
								v-model="dateRange"
								type="date"
								unlink-panels
								value-format="yyyy-MM-dd" style="width:130px;">
							</el-date-picker>
						</el-form-item>
					</div>
					<div style="margin-top: 10px;margin-left:30px;">
						<el-button type="primary" size="mini" @click="queryWeekAndDayList">查询</el-button>
					</div>
				</div>
			</el-form>
        </div>
		<el-table class="place-table" style="width:100%;margin-top:10px;" 
		v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="努力加载中···"
		:max-height="windowHeight-180-$refs.selectArea.offsetHeight" border :data="tableList" :span-method="arraySpanMethod" v-if="tableList && tableList.length">
            <el-table-column label="场地" width="120" fixed='left' align="center">
                <template slot-scope='scope'>
					<div style="line-height: normal">
						<p class="place-name" style="padding:2px;">{{ scope.row.area_name }}</p>
                    	<el-button @click="scanArea(scope.row.area_id)" 
							type="text" size="mini" style="font-size:10px;">查看场地详情
						</el-button>
					</div>
                </template>
            </el-table-column>
            <!-- 周几 -->
            <el-table-column :label='"第" + week.titleList.week + "周 " + week.title +" " + week.titleList.week_date' 
                v-for='(week,i) in tableList[0].daysList' align="center">
                <!-- 时段 -->
                <el-table-column :label="key == 'morning' ? '上午' : (key == 'afternoon' ? '下午' : '晚上')" 
					v-for='(stage,key,j) in week.timeStage' align="center">
                    <!-- 课节 -->
					<el-table-column :label='node.node' v-for='(node,k) in stage'
						align="center" width="20">
						<!-- 数据 同一周-->
						<template slot-scope='scope'>
							<!-- 相同天 -->
							<template v-if="week.title == item2.title" v-for="(item2,l) in scope.row.daysList">
								<!-- 相同时段 -->
								<template v-if="key == m" v-for="(item3,m) in item2.timeStage">
									<!-- 相同课节 -->
									<span v-if="node.node == item4.node"
										v-for="(item4,n) in item3" 
										@click="queryCourseDetail(item4,item2.titleList,scope.row.area_id,scope.row.key_id)" 
										class='item'
										:class="{'have-content': item4.coursename,
										'have-content1':m=='morning'&&item4.coursename&&item4.type==0,
										'have-content2':m=='afternoon'&&item4.coursename&&item4.type==0,
										'have-content3':m=='night'&&item4.coursename&&item4.type==0,
										'order-place':item4.coursename&&item4.type==1,
										'no-content1':m=='morning'&&!item4.coursename,
										'no-content2':m=='afternoon'&&!item4.coursename,
										'no-content3':m=='night'&&!item4.coursename}">
										<template v-if="item4.status==-1||item4.status==-2">
											--
										</template>
										<template v-else>
											{{ item4.coursename ? (item4.status === 1 ? '√' : '-') : '&nbsp;' }}
										</template>
									</span>
									<!-- <span v-if="node.node == item4.node" v-for="(itemy4,n) in item3" 
									@click="queryCourseDetail2(item4,scope.row.week,week,scope.$index)" 
									class='item' :class="{'have-content': item4.coursename}">
										{{ item4.coursename ? '√' : '' }}
									</span> -->
								</template>
							</template>
						</template>
					</el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>

		<div class="cm-pagination" style="padding-top:10px;">
			<el-pagination
				background
				:current-page.sync="pageNo"
				:page-sizes="[5, 10, 15, 30]"
				:page-size.sync="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="totalCount"
				@size-change="sizeChange"
				@current-change="currentChange">
			</el-pagination>
		</div>

		<!----------------课程详情-------------------->
		<course-detail
			:dialogDet.sync="dialogDet"
			:adjustObj="adjustObj">
		</course-detail>
			
		<!-- 场地预约 -->
		<order-dialog v-if="orderDialog"
			:orderDialog.sync="orderDialog"
			:areaList="areaList2"
			:nodeList="nodeList"
			:semesterId="semester"
			:startTime="startTime"
			:endTime="endTime"
			:chooseAreaid="choose_areaid"
			:chooseDate="choose_date"
			:chooseNode="choose_node"
			:detailStatus="recordStatus"
			:applyId="applyid"
			:usedEdit="false">
		</order-dialog>

		<add-course-detail ref="addCourseDetail">
        </add-course-detail>
		<div class="myhidden">
			<enter-curriculum :isComponent="true" ref="enterCurriculum"></enter-curriculum>
		</div>
	</div>
</template>
<script>
import util from "@/util";
import moment from "moment";
import courseDetail from './place_manage/course_detail_dialog';
import orderDialog from './place_manage/order_dialog';
import addCourseDetail from './visualized_course/add_course_detail';
import enterCurriculum from './children/enter_curriculum';
export default {
	name:'sitestatus',
	provide(){
		return {
			queryPlaceList: this.queryPlaceList
		}
	},
	data(){
		return {
			breadcrumb: [
				{label: "教学管理",},
				{label: "场地使用情况",},
			],
			semester:'',
			department:'',
			building:'',
			floor:'',
			week:'',
			dateRange:'',
			areaList: [],
			areaList2: [],
			departmentList:[],
			buildingList:[],
			floorList:[],
			weekList:[],
			loading: false,
			headerList: [],
			tableList: [
				// 	{
				// 	week: "",
				// 	daysList: [{
				// 		title: "",
				// 		timeStage: {
				// 			morning: [
				// 				{
				// 					node: "",
				// 					courseid: "",
				// 					coursename: ""
				// 				},
				// 				{
				// 					node: "",
				// 					courseid: "",
				// 					coursename: ""
				// 				},
				// 				{
				// 					node: "",
				// 					courseid: "",
				// 					coursename: ""
				// 				}
				// 			],
				// 		}
				// 	}]
				// }
			],
			tableList2: [],
			basicTitleMsg: {
				daysList: []
			},
			courseList: [],
			areaId: this.$route.query.areaid || '',
			semester: this.$route.query.semester,
			dialogDet: false,
			// adjustObj: {
			// 	courseArrange:'', teachingForm:'', teachingContent:'', teacherNames:'', areaName:'', schedule_item_date:'', sectionNodenames:'', className:'', groupNames:''
			// },
			adjustObj: {
				course_name:'', teaching_formname:'', teaching_content:'', teacher_names:'', area_name:'', schedule_item_date:'', section_nodenames:'', cls_name:'', group_names:'',
			},
			semesterList: [],	
			pageNo: 1,
			pageSize: 15,
			totalCount: 0,
			scrollLoading: {},
			fullscreenLoading: false,
			orderDialog: false,
			startTime: '',
			endTime: '',
			windowHeight: window.top.innerHeight,

			choose_areaid: '',
			choose_date: '',
			choose_node: '',
			recordStatus: 'edit',
			applyid: '',
			nodeList: [],
		}
	},
	components: {
		courseDetail,
		orderDialog,
		addCourseDetail,
		enterCurriculum,
	},
	created(){
		this.getQueryData();
		this.getWeeks();
		this.getdepartmentList();
		this.getAreas2('');
		this.getbuildList1();
		this.getAreas();
	},
	mounted(){
		this.querySectionList();
	},
	watch:{
		department(val){
			this.getbuildList1();
			this.getAreas();
		},
		building(val){
			this.getAreas();
		},
	},
	methods:{
		openFullScreen() {
			this.scrollLoading = this.$loading({
				lock: true,
				text: '努力加载中···',
			});
		},
        getWeeks(str=''){ //获取周
			this.$http.post("_ed:/term/queryWeekAndDayList",{
                "week":str
            }).then(res=>{
            	if(!this.$route.query.week && !this.$route.query.dateRange){
					let finder = res.data.dataList.find(item=>item.current_week == 't');
					this.week = finder&&finder.week || '';
				}
				this.weekList = res.data.dataList.map(item=>item.week);    
				this.getSemester();
			}).catch(()=>{
			})
		},
		numberToChinese(day) {
			switch (+day) {
				case 1: day = "星期一"; break;
				case 2: day = "星期二"; break;
				case 3: day = "星期三"; break;
				case 4: day = "星期四"; break;
				case 5: day = "星期五"; break;
				case 6: day = "星期六"; break;
				case 7: day = "星期日"; break;
			}
			return day;
		},
		chineseToNumber(day){
			switch (day) {
				case "星期一": day = '1'; break;
				case "星期二": day = '2'; break;
				case "星期三": day = '3'; break;
				case "星期四": day = '4'; break;
				case "星期五": day = '5'; break;
				case "星期六": day = '6'; break;
				case "星期日": day = '7'; break;
			}
			return day;
		},
		arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 0) {
                return;
            }
            if (!this.tableList2 || !this.tableList2[rowIndex] || !this.tableList2[rowIndex][columnIndex - 1]) {
                return;
            }
            let spanArr = this.tableList2[rowIndex][columnIndex - 1].spanArr;
            if (spanArr) {
                return spanArr;
            }
		},
		scanArea (areaid) {
            this.$router.push({
                path: '/teaching_management/site_status_term_2',
                query: {
                    areaid: areaid,
                    semester: this.semester
                }
            })
        },
		getAreas2(str='') {
			this.loading = true;
			this.$http.get("_op:/areas/combox/search/" + str).then(data => {
				this.areaList2 = data.data;
				this.loading = false;
			}).catch(() => {});
		},
		getSemester() {
			this.$http.get("_op:/terms/new/学期").then(data => {
				this.semesterList = data.data.reverse();
				if(!this.$route.query.semester){
					let nowTerm = this.semesterList.find(item=>item.stage==2||item.name.indexOf('当前学期')>-1);
					nowTerm && nowTerm.id && (this.semester = nowTerm.id);
				}
				// this.queryWeekAndDayList();
			}).catch(() => {});
		},
		queryWeekAndDayList () {
			this.$http.post("_ed:/term/queryWeekAndDayList",{
				week:this.week,
				weekdate:this.dateRange,
				semesterId:this.semester,
			}).then(res => {
				this.headerList = res.data.dataList[0];
				this.basicTitle();
				this.queryPlaceList();
			}).catch(err => {})
		},
		basicTitle () {
			this.basicTitleMsg = {
                daysList: []
            };
            this.headerList.weekDayDtoList.forEach(item => {
                let morning = [], afternoon = [], night = [], _morning = [], _afternoon = [], _night = [];
                let arrStage = ['morningSection','afternoonSection','eveningSection'];
                
                arrStage.forEach(stage => {
                    if(item[stage] && item[stage].length){
                        for(let i in item[stage][0]){
                            if(item[stage][0][i] !== null && item[stage][0][i] !== 'null'){
                                let inner = {
                                    node: item[stage][0][i],
                                    area_id: '',
                                    area_name: '',
                                    courseDate: '',
									coursename: '',
									status: null,
                                    schedule_item_id: '',
									type: '',
                                };
                                if(stage == 'morningSection'){
                                    morning.push(inner);
                                    _morning.push( item[stage][0][i] )
                                }else if(stage == 'afternoonSection'){
                                    afternoon.push(inner);
                                    _afternoon.push( item[stage][0][i] )
                                }else if(stage == 'eveningSection'){
                                    night.push(inner);
                                    _night.push( item[stage][0][i] )
                                }
                            }
                        }
                    }
                })
                this.basicTitleMsg.daysList.push({
                    title: this.numberToChinese(item.week_day),
                    titleList: { week:item.week,week_date:item.week_date},
                    timeStage: { morning, afternoon, night },
                    _morning: _morning,
                    _afternoon: _afternoon,
                    _night: _night,
                })
            })
			// console.log('this.basicTitleMsg',this.basicTitleMsg)
		},
		queryPlaceList () {
			this.openFullScreen();
			this.fullscreenLoading = true;
			let params = {
				area_id: this.areaId,//场地ID
				semesterId: this.semester,	//学期ID
				build_id:this.building,
				department_id:this.department,
				start_index:this.pageNo,
				page_size:this.pageSize,
			};
			if(this.dateRange){
				params.weekdate = this.dateRange;
			}else{
				params.week = this.week;
			}
			this.$http.post("_ed:/apply/area/queryApplyAndUseArea",params).then(res => {
                this.tableList = [];
				this.tableList2 = [];
                this.totalCount = res.data.total_records;
                if(res.code == 0 && res.data && res.data.dataList && res.data.dataList.length){
                    this.courseList = res.data.dataList;
                    let areaMark = [];
                    this.courseList.forEach(item => {
                        try{
							if(areaMark.indexOf(item.area_id) == -1){
								areaMark.push(item.area_id);

                            	this.basicTitleMsg.area_id = item.area_id;
								this.basicTitleMsg.area_name = item.area_name;
								this.basicTitleMsg.key_id = item.key_id;

								let copyList = JSON.parse(JSON.stringify(this.basicTitleMsg));
								this.tableList.push( copyList );
							}
							
							let weekday = null, new_weekday = '';
							
							for(let j = 1; j < 8; j++){
								new_weekday = item['weekday'+j]?(item['weekday'+j].replace(/{"/g,"").replace(/"}/g,"")):'';
								if(new_weekday){
									weekday = j;
									break;
								}
							}
							
							if(weekday !== null){
								this.tableList.forEach((item2,index2) => {
									if(item2.area_id == item.area_id){
										item2.daysList.forEach((item3,j) => {
											if(item3.title == this.numberToChinese(weekday)){
												let arr = ['morning','afternoon','night'];
												arr.forEach(name => {
													item3.timeStage[name].forEach(item4 => {
														if(item4.node == item.section_node.toString()){
															let maybe = new_weekday.split("@");
															item4.area_id = item.area_id;
															item4.area_name = item.area_name;
															item4.courseDate = item.cuorseDate;
															item4.status = item.status;
															item4.schedule_item_id = maybe[maybe.length-1] || '';
															item4.coursename = new_weekday;
															item4.type = item.type;
														}
													})
												})
											}
										})
									}
								})
							}
						}catch(err){
							console.log(err);
						}
                    })
                    this.handleTableData();
                }else if(res.code == 0){
					this.$message('未查询到数据');
					this.scrollLoading.close();
					this.fullscreenLoading = false;
                }else{
					this.$message.error(res.msg)
                }
            }).catch(err => {
				this.scrollLoading.close();
				this.fullscreenLoading = false;
            })
		},
		queryCourseDetail(item,title,areaid,key_id){
			// console.log('课节',item.node);
			// console.log('日期',title.week_date);
			// console.log('场地',areaid);

			// 双击调出可视化排课明细
			if(item.status==-1){
				this.$refs.addCourseDetail.getParams({
					detail_visual_id:key_id,
					// publish_status,
					action:'show',
					// 课程表名称
					clsName:'asdfasdfsf',
					semesterID:this.semester,
				});

				return;
			}
			// 双击调出手工课表的明细
			if(item.status==-2){
				let semesterName = this.semesterList.find(item=>item.id==this.semester).name;
				this.$refs.enterCurriculum.showSchedule({id:key_id},semesterName,this.semester);
				return;
			}
			if(item.type == 0){
				this.choose_areaid = areaid;
				this.choose_date = title.week_date;
				this.choose_node = item.node;
				
				this.clearDetail();
				this.dialogDet = false;
				if(item.coursename){
					this.queryDetailInfo(item);
				}
			}
			if(item.type == 1){
				this.applyid = item.schedule_item_id;
				this.recordStatus = 'scan';
				this.orderDialog = true;
			}
		},
		queryDetailInfo(item){
			this.openFullScreen();
			this.$http.get("_ed:/schedule/detail/info/" + item.schedule_item_id).then(res => {
				if(res.data){
					this.adjustObj = res.data;
					this.adjustObj.schedule_item_date = moment(
						this.adjustObj.schedule_item_date
					).format("YYYY-MM-DD");
					this.scrollLoading.close();
					this.dialogDet = true;
				}else{
					this.scrollLoading.close();
					this.$message(res.msg);
				}
			}).catch(() => {
				this.scrollLoading.close();
			});
		},
		orderPlace(item){
            this.$http.get("_ed:/term/queryStartAndEndTimeById/" + this.semester).then(res => {
                if(res.data){
                    this.startTime = res.data.startTime;
					this.endTime = res.data.endTime;
					this.recordStatus = 'edit';
					this.applyid = 0;					
					this.orderDialog = true;
                }
			}).catch(() => {});
		},
		queryCourseDetail2(item,week,weeks,index){
			this.clearDetail();
			this.dialogDet = false;
			if(item.coursename){
				this.openFullScreen();
				let _node = [item.node];
				this.tableList2[index].forEach((cell,where) => {
				if(cell.spanArr && cell.spanArr[1] > 1){
					if(cell.coursename == item.coursename 
						&& cell.courseDate == item.courseDate
						&& cell.node == item.node){		//同一节课
						let _where = where;
							let repeat = cell.spanArr[1];
							for(let i = 1; i < repeat; i++){
								_node.push(this.tableList2[index][++where].node);
							}
						}
					}
				})
				// console.log("节点",_node);

				let whatday = this.chineseToNumber(weeks.title);

				this.$http.post("_op:/curriculum/area", {
					locationId: this.areaId,
					courseDate: item.courseDate,
					courseNameId: _node.toString(),
					week: week,
					whatDay: whatday
				}).then(res => {
					if(res.data && res.data[0]){
						this.adjustObj = res.data[0];
						this.adjustObj.scheduleItemDate = moment(
							this.adjustObj.scheduleItemDate
						).format("YYYY-MM-DD");
						this.scrollLoading.close();
						this.dialogDet = true;
					}else if(res.code == 0){
						this.scrollLoading.close();
						this.$message('未查询到课程详情');
					}
				}).catch(() => {
					this.scrollLoading.close();
				});
			}
		},
		// tableList 生成后调用这个方法
		handleTableData() {
			let tableList2 = [];
            this.tableList.forEach(weekItem => {
                let weekArr = [];
                weekItem.daysList.forEach(dayItem => {
                    let tempArr = ['morning','afternoon','night'];
                    tempArr.forEach(key => {
                        dayItem.timeStage[key].forEach(courseItem => {
                            weekArr.push({
                                ...courseItem,
                                timeStage: key,
                                day: dayItem.title
                            });
                        });
                    });
                });
                tableList2.push(weekArr);
            });
            // console.log(tableList2)
            tableList2.forEach((weekItem, i) => {
                weekItem.forEach((dayItem, j) => {
                    if (j > 0) {
                        let previous = tableList2[i][j - 1];
                        if (previous && previous.day == dayItem.day && dayItem.coursename && previous.coursename == dayItem.coursename) {
                            tableList2[i][j].spanArr = [0, 0];
                            return;
                        }
                    }
                    if (j < weekItem.length - 1) {
                        let colspan = 1;
                        for (let k = j + 1; k < weekItem.length; k++) {
                            let behind = tableList2[i][k];
                            if (behind && behind.day == dayItem.day && dayItem.coursename && behind.coursename == dayItem.coursename) {
                                colspan++;
                            } else {
                                break;
                            }
                        }
                        if (colspan > 1) {
                            tableList2[i][j].spanArr = [1, colspan];
                        }
                    }
                });
            });
            // console.log(tableList2)
			this.tableList2 = tableList2;
			this.scrollLoading.close();
			this.fullscreenLoading = false;
		},
		clearDetail(){
			// this.adjustObj = {
			// 	courseArrange:'', teachingForm:'', teachingContent:'', teacherNames:'', areaName:'', schedule_item_date:'', sectionNodenames:'', className:'', groupNames:''
			// }
			this.adjustObj = {
				course_name:'', teaching_formname:'', teaching_content:'', teacher_names:'', area_name:'', schedule_item_date:'', section_nodenames:'', cls_name:'', group_names:''
			}
		},
		querySectionList(){
            this.$http.get("_ed:/apply/area/sectionnode/list").then(res => {
                if(res.data && res.data.length){
                    res.data.sort((a, b) => {
                        return a.id - b.id;
                    });
                }
                this.nodeList = res.data;
			}).catch(() => {});
        },
		closeBtn() {
			this.$router.back();
		},
		sizeChange(val) {
			this.pageNo = 1;
			this.queryWeekAndDayList();
		},
		currentChange(val) {
			this.queryWeekAndDayList();
		},
		getdepartmentList(){
			this.departmentList = [];
			this.buildingList = [];
			this.areaList = [];
			this.$http.get("_ed:/department/queryAreaDepartmentList").then(res=>{
				this.departmentList = res.data;
			})
		},
		getbuildList1() {
			// this.buildingList = [];
			// this.areaList = [];
			this.$http.post('_ed:/term/queryBuildList', {
				department_id: this.department || ''
			}).then(data => {
				this.buildingList = data.data;
			}).catch(() => {
				this.buildingList = [];
			})
		},
		getAreas() {
			this.loading = true;
			this.$http.post("_ed:/term/queryAreaList",{
				department_id: this.department,
				build_id: this.building
			}).then(data => {
				this.areaList = data.data;
				this.loading = false;
			}).catch(() => {});
		},
		onSemesterChange(val){
			this.$router.replace({query:{...this.$route.query,semester:val}});
		},
		onDepartmentChange(val){
			this.$router.replace({query:{...this.$route.query,department:val}});
			this.building = '';
			this.areaId = '';
			this.buildingList = [];
			this.areaList = [];
			// this.getbuildList1();
			// this.getAreas();
		},
		onBuildingChange(val){
			this.$router.replace({query:{...this.$route.query,building:val}});
			this.areaId = '';
			this.areaList = [];
			// this.getAreas();
		},
		// onFloorChange(val){
		// 	this.$router.replace({query:{...this.$route.query,floor:val}});
		// },
		onAreaChange(val){
			this.$router.replace({query:{...this.$route.query,area:val}});
		},
		onWeekChange(val){
			this.$router.replace({query:{...this.$route.query,week:val}});
			if(val){
				this.dateRange='';
				this.$router.replace({query:{...this.$route.query,dateRange:''}});
			}
		},
		onDateRangeChange(val){
			this.$router.replace({query:{...this.$route.query,dateRange:val}});
			if(val){
				this.week='';
				this.$router.replace({query:{...this.$route.query,week:''}});
			}
		},
		getQueryData(){
			let query = this.$route.query;
			query.semester && (this.semester = +query.semester);
			query.department && (this.department = +query.department);
			query.building && (this.building = +query.building);
			query.area && (this.areaId = +query.area);
			query.week && (this.week = query.week);
			query.dateRange && (this.dateRange = query.dateRange);

		},
	}
}
</script>
<style>
	.place-index .el-form-item{
		margin: 10px 0  0!important;
	}
	.place-index .el-form--inline .el-form-item__label{
		padding-left: 10px !important;
	}
	.place-table .el-button--mini, .place-table .el-button{
		padding: 0 !important;
	}
	.place-table .el-table__fixed-body-wrapper .el-table__body{
		padding-bottom: 8px !important;
	}
	.place-table .cell.el-tooltip{
		min-width: auto !important;
	}
	.place-table{
		font-size: 13px !important;
	}
	.place-table .cell{
		cursor: pointer;
		display: block;
		height: 40px !important;
		line-height: 40px !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	}
	.place-table table thead th>.cell{
		height: 28px !important;
		line-height: 28px !important;
	}
	.place-table td{
		padding: 0 !important;
	}
	.place-table th{
		padding: 0 !important;
	}
	.place-table .item{
		display: block !important;
	}
	.place-table .have-content{
		color: #fff;
	}
	.place-table tbody tr:hover>td {
		background-color: #e6e8eb !important
	}
	</style>
	<style  scoped lang="less">
	.have-content1{
		background-color: rgb(17,223,134);
	}
	.have-content2{
		background-color: rgb(67,158,255);
	}
	.have-content3{
		background-color: rgb(163,175,192);
	}
	.order-place{
		background-color: rgba(252,167,75);
	}
	.no-content1{
		background-color: rgba(17,223,134,.1);
	}
	.no-content2{
		background-color: rgba(67,158,255,.1);
	}
	.no-content3{
		// background-color: #FFFFFF;
	}
	.place-index{
		padding-right: 20px;
	}
	.place-name{
		font-size: 12px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.myhidden{
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>