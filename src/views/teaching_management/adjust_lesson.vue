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
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
						    <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                filterable
                                remote
                                @change="onSelectChange" 
                                :remote-method="getSemester" 
                                placeholder="全部">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="申请日期">
						    <el-date-picker
							  style="width:300px;"
						      v-model="applyDate"
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
                        
                        <el-form-item label="状态">
							<el-select v-model="status" placeholder="请选择" clearable filterable remote>
							    <el-option  label="处理中"  value="0"> </el-option>
							    <el-option  label="调课成功"  value="1"> </el-option>
							    <el-option  label="调课失败"  value="2"> </el-option>
							    <el-option  label="撤销调课"  value="3"> </el-option>
							</el-select>
                        </el-form-item>
                        
                        <el-form-item label="排课课程">
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
							    	:label="item.course_arrange+'-'+item.majorNames+'('+item.learningTime+')'" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        
                        <!--<el-form-item label="课程名称">
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
                        </el-form-item>-->
                        
                        <el-form-item label="调课类型">
							<el-select v-model="exchangeType" placeholder="请选择" clearable filterable>
							    <el-option  label="统一调课"  value="1"> </el-option>
							    <el-option  label="取消调课"  value="2"> </el-option>
								 <el-option  label="单独调课"  value="3"> </el-option>
							    <el-option  label="互相调课"  value="4"> </el-option>
							</el-select>
                        </el-form-item>
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="getTableData">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
					height='600px'
                    style="width: 100%"
					size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>

                <el-table-column prop="courseArrange" label="排课课程"  width="200"></el-table-column>
                <el-table-column label="授课日期" width="85">
                	<template slot-scope="scope">{{scope.row.scheduleitemDate | dateFn}}</template>
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
                	<template slot-scope="scope">{{scope.row.ndscheduleitemDate | dateFn}}</template>
               </el-table-column>
                <el-table-column prop="ndsectionNodenames" label="调整后课节" width="90"></el-table-column>
					<el-table-column prop="ndareaName" label="调整后场地" ></el-table-column>
                <el-table-column prop="ndTeacherNames" label="被调课老师" width="90"></el-table-column>
                <el-table-column prop="applyTeacherName" label="调课老师" width="70"></el-table-column>
                <el-table-column label="申请日期" width="85">
                	<template slot-scope="scope">{{scope.row.applyDate | dateFn}}</template>
               </el-table-column>
			   <el-table-column label="当前审批人" prop="nextApprover" width="120"></el-table-column>
                <el-table-column label="操作" width="110" fixed="right" v-if="btnPerObj.exchange||btnPerObj.detail">
                    <template slot-scope="scope">
						 <el-button v-if="scope.row.needMe==1&&btnPerObj.exchange" type="text" size="small" @click="openDialogs(0,scope.row.id)">处理</el-button>
                        <el-button v-if="btnPerObj.detail" type="text" size="small" @click="openDialogs(1,scope.row.id)">查看详情</el-button>
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
                    :total="totalCount"
                    @size-change="sizeChange"
                    @current-change="currentChange">
            </el-pagination>
        </div>

		<approval-detail v-if="dialogVisible"
			:dialogVisible.sync="dialogVisible" 
			:dialogTitle="dialogTitle"
            :showType="showType"
            :recoreid="recoreid">
		</approval-detail>

    </section>
</template>

<script>
    import util from '@/util';
    import moment from 'moment';
  
	import {mapState} from 'vuex';
	import approvalDetail from './approval/approval_detail';

    export default {
		name: "adjust_lesson",
		provide(){
			return {
				getTableData: this.getTableData
			}
		},
        data() {
            return {
				opinionForm:{
					opinion:"",
					type:"",
				},
				opinionDiolog:false,
				pageNo:1,
				pageSize:10,
				totalCount:0,
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "调课管理"},
                    {label: "调课审核"}
                ],
                semesterList:[],//学期列表
				semester:'',//学期
				formYear:'',//学期
			
                applyDate:'',//申请日期
                status:'',//状态
                semesterCourseList:[],//排课课程
                semesterCourseId:'',//排课课程
                courseList:[],//课程名称
                courseId:'',//课程名称
                exchangeType:'',//调课类型
                tableData: [],
                tablePage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
                
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
				myDate:new Date(),//学期设置为当前
				dialogVisible:false,
				dialogTitle:{},
				showType: 1,
            	recoreid: '',
                
                teacherId:util.getStorage('loginId'),
                teacherName:util.getStorage('loginName'),
                btnPerObj:{//按钮权限
                    query:false,
                    exchange:false,
                    detail:false
                }
                
            }
		},
		components: {
			approvalDetail
		},
        filters: {
			formatTime: util.getTime1,
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
				// console.log('调课类型', val)
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
			},
			dateFn(val){
        		if (val!=null&&val!='') {
        			return moment(val).format('YYYY-MM-DD ')
        		}
        	}
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            
            util.openBtnPermit(this.btnPerObj);
        },
        computed:{
            ...mapState(['btnPermitList']),
        },
        created(){
        	this.getSemester();
			this.getSemesterCourse();
        },
        methods: {
			onSelectChange(_id) {
                this.selectChangeFun(_id)
			},
			selectChangeFun(_id) {

                let self = this;
                let id = self.formYear;
                // let grade = self.addForm.grade;
                let classNum = self.addForm.classNum; //所在级更改为分班序号

                for (let item of this.options1) {
                    if (item.id == _id) {
                        self.fallYear = item.year;
                        self.semesterNum = item.orderNum;
                    }
                }
                this.addColumn = [{
                    id: ''
                }]
                this.courseArrangeList = [];
                this.getCourseArrange();

			},
			getCourseArrange(callback) {
                let self = this;
                this.$http.post("_ed:/semestercourse/list/detail", {
                    semester_year: self.fallYear,
                    semester_year_number: self.semesterNum,
                    grade: self.addForm.grade,
                    classNum: self.addForm.classNum //所在级更改分班序号
                }).then(res => {
                    if (res.code == 0) {
                        this.courseArrangeList = res.data;
                        if (typeof callback === 'function') {
                            callback(this.courseArrangeList);
                        }
                        // for(let list of this.courseArrangeList){
                        //     // this.newData=list.teachTaskCourseList;
                        //     let majorName = '';
                        //     if(list.teachTaskCourseList){

                        //         for(let item of list.teachTaskCourseList){
                        //             let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;

                        //             this.$set(item,"name",`${item.course_name}（${item.majorNames}，${house}）`);
                        //             this.$set(item,"courseId",list.id);
                        //             majorName += '+' + item.major;
                        //             this.$set(list, 'major', majorName.substring(1));  
                        //         } 
                        //     }
                        // }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
			 //获取按钮权限
           	getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						 if (item.code=="query_tiaokeguanli") {  //查询
						self.btnPerObj.query=true;
						}
						if (item.code=="exchange_course_tiaokeguanli") {  //处理
						self.btnPerObj.exchange=true;
						}
						if (item.code=="detail_tiaokeguanli") {  //查看详情
						self.btnPerObj.detail=true;
						}
                    });
                }).catch(()=>{
                })
            },
        	getSemester(){//学期
                this.$http.get('_op:/terms/new/'+"学期").then(data=>{
					this.semesterList=data.data.reverse() //获取学期数据

					let findItem = this.semesterList.find(item=>item.stage==2||item.name.indexOf('当前学期')>-1);
					this.formYear = findItem.id;
					this.addForm = findItem.name;
					this.semesterNum = findItem.orderNum;
					this.fallYear = findItem.year;

					this.getTableData();

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
        	getSemesterCourse(str){//排课课程
        		this.loading = true;
        		this.$http.post("_ed:/semestercourse/list2",{
        			str:str
        		}).then(data=>{
        			this.semesterCourseList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
			},

            getTableData(){
				let semester = this.semesterList.find(item=>item.id==this.formYear);
				
				let params = {
					pageNo: this.tablePage.current,
					pageSize:this.tablePage.size,
					param:{
						beginDate: this.applyDate!=null?this.applyDate[0]:"",
						endDate: this.applyDate!=null?this.applyDate[1]:"",
						courseId: this.courseId,
						exchangeType: this.exchangeType,
						requestPage: this.tablePage.current,
						semesterCourseId: this.semesterCourseId,
						semesterYear: semester.year,
						semesterYearNumber: semester.orderNum,
						status: this.status
					}
				}
                this.$http.post("_ed:/exchangecourse/query/manage",params).then(data=>{
				
					this.tableData=data.result;
                    this.totalCount=data.totalCount;
                }).catch(()=>{
                    // this.tableData=[];
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
			openDialogs(type,id){
				this.recoreid = id.toString();
				this.showType = type;
				this.dialogTitle = this.showType === 0 ? {name:'调课审核',type:0} : {name:'调课详情',type:1};
				this.dialogVisible = true;
			},
			audit(type){
				this.opinionDiolog=true;
				this.opinionForm.type=type;
				this.opinionForm.opinion="";
			},
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
        }
    }
</script>

<style scoped lang="less">

</style>