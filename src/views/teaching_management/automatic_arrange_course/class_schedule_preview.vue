<template>
	<div class="classes-preview">
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
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="授课日期">
							<el-date-picker
								v-model="dateRange"
								clearable
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
							</el-date-picker>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select v-model="searchForm.courseId" filterable  placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(list, index) in arrangCourseList" :key="index" :label="list.course_arrange+` (${list.major} ${list.arranged_theory_hours}/${list.arranged_novitiate_hours})`" :value="list.id"></el-option>
                                <!-- <template v-for="item in arrangCourseList">
                                    <el-option v-for="list in item.teachTaskCourseList" :key="list.courseId" :label="list.name" :value="list.courseId"></el-option>
                                </template> -->
                            </el-select>
                        </el-form-item>
		                <el-form-item label="上课班">
		                    <el-select
		                        v-model="searchForm.courseClassId"
		                        clearable
		                        filterable
		                        placeholder="请输入课节名称">
		                        <el-option label="全部" value=""></el-option>
		                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item label="授课场地">
		                    <el-select
		                        v-model="searchForm.areaId"
		                        clearable
		                        filterable
		                        placeholder="请输入授课场地">
		                        <el-option label="全部" value=""></el-option>
		                        <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item label="授课老师">
		                    <el-select
		                        v-model="searchForm.teacherId"
		                        clearable
		                        filterable
		                        placeholder="请输入授课老师">
		                        <el-option label="全部" value=""></el-option>
		                        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
                        <el-form-item label="课节">
                            <el-select
                                multiple
                                v-model="searchForm.lesson"
                                placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in lessonList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
            <div class="btn" style="margin: 15px 0;">
                <el-button size="small" @click="goback">返回</el-button>
            </div>
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
                <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                	<template slot-scope="scope">
                		<template v-if="item.prop==='semeterCourseName'">
	                		<el-button @click="getScheduleCourse(scope.row)" type="text" size="small">{{ scope.row.semeterCourseName }}</el-button>
	                	</template>
                        <template v-else-if="item.prop==='teachingDate'">
                            {{scope.row[item.prop] | formatTime}}
                        </template>
                        <template v-else-if="item.prop==='courseClassName'">
                            <el-button @click="getScheduleClass(scope.row)" type="text" size="small">{{ scope.row.courseClassName }}</el-button>
                        </template>
                        <template v-else-if="item.prop==='lessons'">
                            {{scope.row[item.prop].join(',')}}
                        </template>
                        <template v-else-if="item.prop==='teachersInfo'">
                            {{JSON.parse(scope.row[item.prop]).name}}                            
                        </template>
	                	<template v-else>
							{{scope.row[item.prop]}}
	                	</template>
                	</template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="50">
                    <template slot-scope="scope">
                        <el-button @click="getScheduleDetail(scope.row)" type="text" size="small">详情</el-button>
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
        
        <!-- 排课课程弹窗 -->
        <el-dialog
            title="排课课程详情"
            :visible.sync="dialog.dialogScheduleCourse"
            width="700"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            @close="">
            <p>
                <strong style="margin-right: 20px;">学期：{{coursedetail.year}}</strong>
                <strong style="margin-right: 20px;">所在级：{{coursedetail.grade}}</strong>
                <strong>排课课程：{{coursedetail.semeterCourseName}}</strong>
            </p>
            <!-- <p>教学任务信息</p> -->
            <div class="cm-table" style="margin: 20px -20px;">
                <el-table 
                    :data="courseTableData"
                    size="mini"
                    border
                    header-row-class-name="cm-dark">
                    <el-table-column prop="major" label="专业" width=""></el-table-column>
                    <el-table-column prop="course_name" label="课程名称" width=""></el-table-column>
                </el-table>
            </div>
            <span slot="footer">
                <el-button @click="dialog.dialogScheduleCourse = false">取 消</el-button>
                <!-- <el-button type="primary" @click="">确 定</el-button> -->
            </span>
        </el-dialog>

        <!-- 上课班弹窗 -->
        <el-dialog
            title="上课班详情"
            :visible.sync="dialog.dialogCourseClass"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="700"
            @close="">
            <p>上课班：{{dialogClassName}}</p>
            <div class="cm-table" style="margin: 20px -20px;">
                <el-table 
                    :data="classDetail"
                    size="mini"
                    border
                    header-row-class-name="cm-dark">
                    <el-table-column prop="teaching_formname" label="授课形式" width=""></el-table-column>
                    <el-table-column prop="group_name" label="分组" width=""></el-table-column>
                    <el-table-column label="学生信息" width="">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.cls_infos">{{item.class_belong}} ({{item.stu_Number}})人 </p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer">
                <el-button @click="dialog.dialogCourseClass = false">取 消</el-button>
                <!-- <el-button type="primary" @click="">确 定</el-button> -->
            </span>
        </el-dialog>

        <!-- 详情弹窗 -->
        <el-dialog
            title="课程详情"
            :visible.sync="dialog.dialogScheduleCourseDetail"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            width="700">
            <div class="adjust-box">
                <div class="det-box">
                    <p class="title">课程</p>
                    <p class="adjust-line">排课课程：  {{adjustObj.semeterCourseName}} </p> 
                </div>
                
                <!-- <div class="det-box">
                    <p class="title">课程内容</p>
                    <p class="adjust-line">授课形式： {{adjustObj.teachingformName}}</p>
                    <p class="adjust-line">授课内容： {{adjustObj.teachingContent}}</p>
                </div> -->
                
                <div class="det-box">
                    <p class="title">授课资源</p>
                    <p class="adjust-line">授课老师： {{detailTeacher}}</p>
                    <p class="adjust-line">授课场地： {{adjustObj.areaName}}</p>
                    <p class="adjust-line">课程时间： {{adjustObj.teachingDate | formatTime}}</p>
                    <p class="adjust-line">课&ensp;&ensp;&ensp;&ensp;节： {{detailLessons}}</p>
                </div>
                
                <div class="det-box">
                    <p class="title">上课班信息</p>
                    <p class="adjust-line">上课班： {{adjustObj.courseClassName}}</p>
                    <!-- <p class="adjust-line">教学模式： {{adjustObj.teachingformName}}</p> -->
                    <!-- <p class="adjust-line">分组号： {{adjustObj.groupNames}}</p> -->
                </div>
            </div>
        </el-dialog>
	</div>
</template>
<script>
import util from '@/util'

export default {
    // name: 'classes_preview',
    data() {
        return {
			breadcrumb: [
                {label: "自动排课"},
                {label: "课表预览"}
            ],
            fold:{
                state:false,
                text:'展开',
                showBtn:false,
            },
            pageIndex: 0,
            pageSize: 10,
            dateRange: [],
            searchForm: {
            	// dateRange: [],
            	// courseId:'',
            	// classesId: '',
            	// placeId: '',
            	// teacherId: '',
            	// lessons: '',

                areaId: '', // 场地id
                autoScheduleId: this.$route.query.autoScheduleId, // 自动排课结果id 从自动排课页面传递过来
                beginTeachingDate: '',
                courseClassId: '', // 上课班id
                endTeachingDate: '',
                lesson: [], // 课节
                semeterCourseId: '', // 学期id
                teacherId: ''
            },
            arrangCourseList: [],
            semesterList: [],
            lessonList:[],
            classList: [],
            areaList: [],
            teacherList: [],
            teachTaskCourseList:[],
            tableList:[
            	{label:'排课课程', prop: 'semeterCourseName'},
            	{label: '授课日期', prop: 'teachingDate'},
            	{label: '周次', prop: 'week'},
            	{label: '星期', prop: 'weekDay'},
            	{label: '授课课节', prop: 'lessons'},
            	{label: '授课老师', prop: 'teachersInfo'},
            	{label: '授课场地', prop: 'areaName'},
            	{label: '上课班', prop: 'courseClassName'}
            ],
            tableData: [],
            pageNo: 0,
            pageSize: 10,
            totalCount: 0,
            tableLoading: false,
            dialog:{
                dialogScheduleCourse: false,
                dialogCourseClass: false,
                dialogScheduleCourseDetail: false
            },
            scheduleCourseTableData: [],
            dialogClassName:'',
            coursedetail: {},
            classDetail: [],
            adjustObj: {}, // 课程详情
            detailTeacher: '',
            detailLessons: '',
            courseTableData: []
        };
    },
    created (){
        // this.currentTimeData();
        this.getArea();
        this.getLessonList();
    	this.getArrangeCourse();
        this.getClassList();
        this.getTeacher();
        this.onSearch();
    },
    mounted (){
    	util.resize(this);
        window.onresize=()=>{
            util.resize(this);
        };
    },
    methods: {
    	collapseShow(){
          	this.fold.state=!this.fold.state;
          	this.fold.text=this.fold.state?'收起':'展开';
        },
        onSearch (){
            let params = {};
            let param = {};

            if (this.dateRange == null) {
                 param.beginTeachingDate = '';
                 param.endTeachingDate = '';
            } else {
                param.beginTeachingDate = this.dateRange[0] || ''
                param.endTeachingDate = this.dateRange[1] || ''
            }
            
            param.areaId = this.searchForm.areaId; 
            param.autoScheduleId = this.searchForm.autoScheduleId;  // 'be654ec4eb5fd56e1587a71c0d4481ef' 
            // param.beginTeachingDate = this.searchForm.beginTeachingDate; 
            param.courseClassId = this.searchForm.courseClassId; 
            param.lesson = this.searchForm.lesson.join(',');
            param.semeterCourseId = this.searchForm.semeterCourseId; 
            param.teacherId = this.searchForm.teacherId; 
            
            params = {
                pageIndex: this.pageNo,
                pageSize: this.pageSize,
                param: param
            }
            
            // this.$http.post(`http://192.168.5.175:8060/auto/schedule/schedule/item/search`, params).then(res => {
            this.$http.post(`_as:/schedule/item/search`, params).then(res => {
                if (res.status == 200) {
                    this.tableData = res.result.data;
                    this.totalCount = res.result.total;
                }
            })
        },
        sizeChange (val){
            this.pageNo = 0;
            this.pageSize = val;
            this.onSearch();
        },
        currentChange (val){
            this.pageNo = val-1;
            this.onSearch();
        },

         // 点击排课课程
        getScheduleCourse(row){
            // 27  row.semeterCourseId
            this.dialog.dialogScheduleCourse = true;
            this.coursedetail.semeterCourseName=row.semeterCourseName;
            this.courseTableData = [];

            this.$http.get(`_ed:/semestercourse/detail/${row.semeterCourseId}`).then(data=>{
                // this.coursedetail.data=data.data || [];
                this.courseTableData=data.data || [];
                this.coursedetail.year=data.data[0].semester_name;
                this.coursedetail.grade=data.data[0].grade;
            }).catch(()=>{
            })
        },
        // 点击上课班
        getScheduleClass(row){
            this.dialogClassName = row.courseClassName;
            this.dialog.dialogCourseClass = true;
            this.$http.get(`_ed:/coursecls/detail/${row.courseClassId}`).then(data=>{
                this.classDetail=data.data.groups || [];
                this.dialogClsDet=true;
            }).catch(()=>{
            })
        },
        // 点击详情
        getScheduleDetail (row){
            this.dialog.dialogScheduleCourseDetail = true;
            this.$http.get(`_as:/schedule/item/${row.id}`).then(res => {
                this.adjustObj = res.result;
                this.detailTeacher = JSON.parse(res.result.teachersInfo).name;
                this.detailLessons = res.result.lessons.join(',');
            })
        },
        // 获取排课课程
        getArrangeCourse(){
            this.$http.post("_ed:/semestercourse/list/detail",{
                semester_year:this.fallYear,
                semester_year_number:this.semesterNum
            }).then(data=>{
                if(data.code==0){
                    this.arrangCourseList = data.data;
                    for(let list of this.arrangCourseList){
                        let majorName = '';
                        if(list.teachTaskCourseList){
                           for(let item of list.teachTaskCourseList){
                                let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
                                this.$set(item,"name",`${item.course_name}（${item.major}，${house}）`);
                                this.$set(item,"courseId",list.id); 
                                majorName += '+' + item.major;
                                this.$set(list, 'major', majorName.substring(1));
                            } 
                        }   
                    }
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
         // 获取排课课程
        // getArrangeCourse(str){
        //     this.loading = true;
        //     this.$http.post("_ed:/exchangecourse/query/semestercourse",{
        //         str:str
        //     }).then(data=>{
        //         this.teachTaskCourseList=data.data;
        //         // this.loading = false;
        //     }).catch(()=>{
        //     })
        // },
        goback (){
            this.$router.push({
                path: '/teaching_management/automatic_arrange',
                // query: {
                //     action: this.$router.query.action
                // }
            })
        },
        // 默认时间为一周
        currentTimeData() {
            let dateObj = new Date();
            let _end = `${dateObj.getFullYear()}-${dateObj.getMonth() +
                1}-${dateObj.getDate()}`;
            let _start = null;
                _start = this.getBeforeTime(-7);
            this.dateRange = [ _end,_start];
            // this.getTableData(); //查询方法
        },
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
        //获取授课场地
        getArea(str){
            this.$http.post("_ed:/exchangecourse/query/area",{
                    str:str
            }).then(data=>{
                    this.areaList=data.data;
                    this.loading = false;
            }).catch(()=>{
            })
        },
        getLessonList(){//获取课节
            this.$http.get("_op:/sections/find").then(data=>{
                if(data.code==0){
                    if(data.data){
                        this.lessonList = data.data;
                    }
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        // 获取上课班
        // getClassList(){
        //     let self = this;
        //     this.$http.post('_ed:/coursecls/list', {
        //         semester_year:this.fallYear,
        //         semester_year_number:this.semesterNum
        //     }).then(data=>{
        //         if(data.code==0){
        //            self.classList = data.data;
        //         }else{
        //             this.$message.error(data.msg);
        //         }
        //     })
        // },
        getClassList(str){
            this.$http.post("_ed:/exchangecourse/query/coursecls",{
                str:str
            }).then(data=>{
                this.classList=data.data;
            }).catch(()=>{
            })
        },
        // 获取授课老师
        getTeacher(str){
            this.loading = true;
            this.$http.post("_ed:/exchangecourse/query/teacher",{
                str:str
            }).then(data=>{
                this.teacherList=data.data;
            }).catch(()=>{
            })
        },
    },
    filters: {
        formatTime: util.getTime1,
        findNameById: (id, arr)=> {
            this[arr].map(item => {
                if (id == item.id) {
                    return item.name;
                }
            })
        },
        toStr:(arr) => {
            return JSON.parse(arr).join(',');
        }
    }
};
</script>
<style lang="less" scoped>
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
</style>