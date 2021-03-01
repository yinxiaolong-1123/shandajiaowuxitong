<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="site-search">
            <el-form :inline="true" size="mini" label-width="60px" class="search-form">
				<div style="display:inline-flex;">
					<el-form-item label="场地">
						<el-select v-model="areaId" placeholder="请选择" clearable filterable remote :remote-method="getAreas" :loading="loading">
							<el-option 
								v-for="(item,index) in areaList" 
								:key="index" 
								:label="item.name" 
								:value="item.id"> 
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="学期">
						<el-select v-model="semester" placeholder="请选择" clearable filterable>
							<el-option 
								v-for="(item,index) in semesterList" 
								:key="index" 
								:label="item.semesterName" 
								:value="item.semesterId"> 
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div style="display:inline-flex;">
					<el-button @click="queryPlaceList" type="primary" size="mini">查询</el-button>
					<el-button @click="closeBtn" size="mini">关闭</el-button>
				</div>
            </el-form>
        </div>
        
        <el-table class="course-table" style="width:100%"
			v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="努力加载中···" 
			border :max-height="windowHeight - 290" :data="tableList" :span-method="arraySpanMethod" v-if="tableList && tableList.length">
            <el-table-column prop="week" label="周次" width="50" fixed='left' align="center"></el-table-column>
            <!-- 周几 -->
            <el-table-column :label='week.title' v-for='(week,i) in tableList[0].daysList' align="center">
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
										@click="queryCourseDetail(item4,item2.titleList,scope.row.area_id)" 
										class='item'
										:class="{'have-content': item4.coursename,
										'have-content1':m=='morning'&&item4.coursename&&item4.type==0,
										'have-content2':m=='afternoon'&&item4.coursename&&item4.type==0,
										'have-content3':m=='night'&&item4.coursename&&item4.type==0,
										'order-place':item4.coursename&&item4.type==1,
										'no-content1':m=='morning'&&!item4.coursename,
										'no-content2':m=='afternoon'&&!item4.coursename,
										'no-content3':m=='night'&&!item4.coursename}">
										{{ item4.coursename ? (item4.status === 1 ? '√' : '-') : '&nbsp;' }}
									</span>
									<!-- <span v-if="node.node == item4.node" v-for="(item4,n) in item3" 
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
        
        <!----------------课程详情-------------------->
        <course-detail
			:dialogDet.sync="dialogDet"
			:adjustObj="adjustObj">
		</course-detail>
        
		<!-- 场地预约 -->
		<order-dialog v-if="orderDialog"
			:orderDialog.sync="orderDialog"
			:areaList="areaList"
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
    </section>
</template>

<script>
import util from "@/util";
import moment from "moment";
import courseDetail from './place_manage/course_detail_dialog';
import orderDialog from './place_manage/order_dialog';

export default {
	name: "sitestatusterm",
	provide(){
		return {
			queryPlaceList: this.queryPlaceList
		}
	},
	data() {
		return {
			scrollLoading: {},
			breadcrumb: [
				{ label: "教学管理" },
				{ label: "场地使用情况" },
				{ label: "学期下使用情况" }
			],
			areaList: [],
			loading: false,
			total_pages: 0,
			total_records: 0,
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
				//			afternoon:[...]
				// 		}
				// 	}]
				// }
			],
			tableList2: [],
			basicTitleMsg: {
				week: '',
				daysList: []
			},
			courseList: [],
			areaId: this.$route.query.areaid,
			semester: this.$route.query.semester,
			dialogDet: false,
			// adjustObj: {
			// 	courseArrange:'', teachingForm:'', teachingContent:'', teacherNames:'', areaName:'', schedule_item_date:'', sectionNodenames:'', className:'', groupNames:''
			// },
			adjustObj: {
				course_name:'', teaching_formname:'', teaching_content:'', teacher_names:'', area_name:'', schedule_item_date:'', section_nodenames:'', cls_name:'', group_names:'',
			},
			semesterList: [],
			fullscreenLoading: false,
			windowHeight: window.screen.availHeight,

			orderDialog: false,
			startTime: '',
			endTime: '',
			choose_areaid: '',
			choose_date: '',
			choose_node: '',
			recordStatus: 'edit',
			applyid: '',
			nodeList: [],
		};
	},
	components: {
		courseDetail,
		orderDialog
	},
	methods: {
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
		getAreas(str) {
			this.loading = true;
			this.$http.get("_op:/areas/combox/search/" + str).then(data => {
				this.areaList = data.data;
				this.loading = false;
			}).catch(() => {});
		},
		getSemester() {
			this.$http.get("_op:/area/detail/term/list").then(data => {
				this.semesterList = data.data.reverse();
			}).catch(() => {});
		},
		queryWeekAndDayList () {
			this.$http.post("_ed:/term/queryWeekAndDayList",{
				week:'',
			}).then(res => {
				this.headerList = res.data.dataList[0];
				this.total_pages = +res.data.total_pages;
				this.total_records = +res.data.total_records;
				this.basicTitle();
				this.queryPlaceList();
			}).catch(err => {})
		},
		basicTitle () {
			this.basicTitleMsg = {
				week: '',
				daysList: []
			};
			this.headerList.weekDayDtoList.forEach(item => {
				let morning = [], afternoon = [], night = [],_morning = [], _afternoon = [], _night = [];
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
					timeStage: { morning, afternoon, night },
					_morning: _morning,
					_afternoon: _afternoon,
					_night: _night,
				})
			})
			// console.log('this.basicTitleMsg',this.basicTitleMsg)
		},
		queryPlaceList () {
			if(!this.areaId || !this.semester){
				this.$message({
					message: '场地、学期为必填项！',
					type: 'warning'
				});
				return;
			}
			this.openFullScreen();
			this.fullscreenLoading = true;
			this.$http.post("_ed:/term/queryPlaceList",{
				area_id: this.areaId,	//场地ID
				semesterId: this.semester,	//学期ID
			}).then(res => {
				this.tableList = [];
				this.tableList2 = [];
				if(res.code == 0){
					this.courseList = res.data;
					for(let k = this.total_pages; k <= this.total_records; k++){
						this.basicTitleMsg.week = k;
						let copyList = JSON.parse(JSON.stringify(this.basicTitleMsg));
						this.tableList.push( copyList );
					}
					this.courseList.forEach(item => {
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
								if(item2.week == item.week){
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
					})

					this.handleTableData();
				}else if(res.code !== 0){
					this.scrollLoading.close();
					this.fullscreenLoading = false;
					this.$message('查询失败');
				}
			}).catch(err => {
				this.tableList = [];
				this.scrollLoading.close();
				this.fullscreenLoading = false;
				this.$message('查询失败');
			})
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
					if(res.code == 0 && res.data && res.data[0]){
						this.adjustObj = res.data[0];
						this.adjustObj.scheduleItemDate = moment(
							this.adjustObj.scheduleItemDate
						).format("YYYY-MM-DD");
						this.scrollLoading.close();
						this.dialogDet = true;
					}else if(res.code == 0){
						this.scrollLoading.close();
						this.$message('未查询到课程详情');
					}else{
						this.$message.error(res.msg)
					}
				}).catch(() => {
					this.scrollLoading.close();
				});
			}
		},
		queryCourseDetail(item,title,areaid){
			if(item.coursename && item.type == 0){
				this.clearDetail();
				this.dialogDet = false;
				this.queryDetailInfo(item);
			}
			if(item.coursename && item.type == 1){
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
		closeBtn() {
			this.$router.back();
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
		openFullScreen() {
			this.scrollLoading = this.$loading({
				lock: true,
				text: '努力加载中···',
			});
		}
	},
	mounted() {
		util.resize(this);
		window.onresize = () => {
			util.resize(this);
		};
		this.querySectionList()
	},
	created() {
		this.getAreas('');
		this.getSemester();
		this.queryWeekAndDayList();
	}
};
</script>
<style>
	.course-detail .el-dialog__body{
		padding-top: 0!important;
	}
	.site-search .search-form{
		height: 50px !important;
		display: flex !important;
		justify-content: space-between !important;
		align-items:center !important;
	}
	.course-table .el-table__fixed-body-wrapper .el-table__body{
		padding-bottom:8px !important;
	}
	.course-table .cell.el-tooltip{
		min-width: auto !important;
	}
	.course-table{
		font-size: 13px !important;
	}
	.course-table .cell{
		cursor: pointer;
		display: block;
		height: 22px !important;
		line-height: 22px !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	}
	.course-table td{
		padding: 0 !important;
	}
	.course-table th{
		padding: 0 !important;
	}
	.course-table .item{
		display: block !important;
	}
	.course-table .have-content{
		color: #fff;
	}
	.course-table tbody tr:hover>td {
		background-color: #e6e8eb !important
	}
</style>

<style scoped lang="less">
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
	.site-search{
		padding-right: 20px;
	}
</style>