<template>
    <section>
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="schedule-bar">
            <div class="schedule">
                <span class="schedule-label" style="width:40px;">学期</span>
                <el-select v-model="semester" @change="changeSemester" size="small" value-key="id" style="width:250px;">
                    <el-option v-for="item in semesterList" :label="item.name" :value="item"></el-option>
                </el-select>
                <span class="schedule-label" style="width:60px;">课程表</span>
                <el-select v-model="course" @change="changeCourse" size="small" style="width:350px;">
                    <el-option v-for="item in semesterCourse" :label="item.curriculum_name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="schedule">
                <el-button @click="imitate" type="primary" size="small">查询</el-button>
                <el-button @click="produce" :disabled="publish_status === false || publish_status === 2" size="small">生成进度表</el-button>
                <el-button @click="withdraw(2)" :disabled="publish_status === false || publish_status === 0" type="primary" size="small">撤回进度表</el-button>
                <el-button @click="enterRecord" size="small" style="margin-left:20px;">编辑</el-button>
            </div>
        </div>
        <div v-if="showTab" style="padding: 0 20px;">
            <el-tabs v-model="activeTab" @tab-click="changeTab">
                <el-tab-pane name="matching">
                    <p slot="label">已匹配的进度表（<span style="color:red">{{ match_qty }}</span>）</p>
                </el-tab-pane>
                <el-tab-pane name="mismatching">
                    <p slot="label">未自动匹配的课表明细（<span style="color:red">{{ unmatch_qty }}</span>）</p>
                </el-tab-pane>
                <el-tab-pane name="elective">
                    <p slot="label">选修课（<span style="color:red">{{ option_course_num }}</span>）</p>
                </el-tab-pane>
            </el-tabs>
            <div v-show="activeTab == 'matching'" class="create-schedule">
                <div style="width:35%">
                    <el-table :data="scheduleList" highlight-current-row size="mini" border>
                        <el-table-column prop="name" label="进度表名称">
                            <template slot-scope="scope">
                                <p @click="showDetail(scope.row)" style="course:pointer;color:#2e8abe;">{{ scope.row.name }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="115">
                            <template slot-scope="scope">
                                <el-button @click="modifyName(scope.row)" type="text" size="mini">修改</el-button>
                                <el-button v-if="scope.row.type == 1 && scope.row.publish_status === 0" 
                                @click="addManualMatch(scope.row)" type="text" size="mini">
                                    手工匹配
                                </el-button>
                                <el-button v-if="scope.row.type == 2 && scope.row.publish_status === 0" 
                                @click="removeMatching(scope.row)" type="text" size="mini">
                                    解除匹配
                                </el-button>
                                <el-button v-if="scope.row.publish_status == 2" @click="withdraw(1,scope.row)" type="text" size="mini">
                                    撤回
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="width:63%">
                    <el-table :data="courseList" size="mini" border>
                        <el-table-column type="index" label="序号" fixed width="50"> </el-table-column>
                        <el-table-column prop="course_arrange" label="课程" width="150"> </el-table-column>
                        <el-table-column prop="admin_cls_names" label="行政班级" width="250"></el-table-column>
                        <el-table-column prop="week_names" label="周次" width="100"></el-table-column>
                        <el-table-column prop="weekday" label="星期" width="50">
                            <template slot-scope="scope">
                                {{scope.row.weekday | weekdayMap}}
                            </template></el-table-column>
                        <el-table-column prop="section_nodenames" label="课节" width="60"></el-table-column>
                        <el-table-column prop="area_names" label="授课场地" width="200"></el-table-column>
                        <el-table-column prop="teaching_formname" label="授课形式" width="80"></el-table-column>
                        <el-table-column prop="group_names" label="分组名称" min-width="350"></el-table-column>
                        <el-table-column prop="note" label="描述" width="100"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-show="activeTab == 'mismatching'">
                <div class="mis-tip">
                    <span style="font-size: 12px;color: #2e8abe;">
                        下面是因班级交叉无法自动匹配的记录，请根据内容需要显示在哪个班级的进度表中，手工匹配到该班级的进度表上
                    </span>
                    <div>
                        <span style="font-size:14px;padding-right: 5px;">课程</span>
                        <el-select v-model="currentCourse" @change="searchCourse" size="mini" filterable clearable>
                            <el-option v-for="item in semesterCourseList" :label="item.course_arrange" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-table :data="misCourseList" size="mini" highlight-current-row border>
                    <el-table-column type="index" label="序号" fixed width="50"> </el-table-column>
                    <el-table-column prop="course_arrange" label="课程" width="160"> </el-table-column>
                    <el-table-column prop="admin_cls_names" label="行政班级" width="300"></el-table-column>
                    <el-table-column prop="week_names" label="周次" width="100"></el-table-column>
                    <el-table-column prop="weekday" label="星期" width="50">
                        <template slot-scope="scope">
                            {{scope.row.weekday | weekdayMap}}
                        </template></el-table-column>
                    <el-table-column prop="section_nodenames" label="课节" width="60"></el-table-column>
                    <el-table-column prop="area_names" label="授课场地" width="200"></el-table-column>
                    <el-table-column prop="teaching_formname" label="授课形式" width="80"></el-table-column>
                    <el-table-column prop="group_names" label="分组名称" min-width="350">
                        <template slot-scope="scope">
                            <span v-for="cls in scope.row.group_names">{{ cls }}；</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deputy_cls_name" label="班级代表" width="200"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="50">
                        <template slot-scope="scope">
                            <el-button @click="matchingSchedule(scope.row)" type="text" size="mini">匹配</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="activeTab == 'elective'">
                <div style="text-align:right;padding-bottom:5px;">
                    <el-button @click="showTimeDialog = true" size="small">批量设置报名时间</el-button>
                </div>
                <el-table :data="electiveList" highlight-current-row size="mini" border>
                    <el-table-column prop="name" label="课程" min-width="300"></el-table-column>
                    <el-table-column prop="option_remark" label="选修说明" min-width="200"></el-table-column>
                    <el-table-column prop="schedule_date" label="上课时间" min-width="280"></el-table-column>
                    <el-table-column prop="deadline_date" label="报名开始时间" width="150">
                        <template slot-scope="scope">
                            {{scope.row.start_date && typeof scope.row.start_date == 'number' ? (scope.row.start_date | timestampToTime(2)) : (scope.row.start_date || '')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deadline_date" label="报名截止时间" width="150">
                        <template slot-scope="scope">
                            {{scope.row.deadline_date && typeof scope.row.deadline_date == 'number' ? (scope.row.deadline_date | timestampToTime(2)) : (scope.row.deadline_date || '')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="max_stu_num" label="人数上限" width="80"></el-table-column>
                    <el-table-column prop="student_num" label="已选修人数" width="90">
                        <template slot-scope="scope">
                            <el-button @click="showStu(scope.row)" type="text">{{ scope.row.student_num }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="55">
                        <template slot-scope="scope">
                            <el-button @click="editElective(scope.row)" type="text">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 修改进度表名称 -->
        <el-dialog :visible.sync="modifyDialog" append-to-body width="700px" :close-on-click-modal="false">
            <span>进度表名称:</span>
            <el-input v-model.trim="modifyMsg.name" size="small" style="width: 86%;"></el-input>
            <p style="text-align:right;padding:20px 0 50px;">
                <el-button @click="saveModify" size="small" type="primary">确定</el-button>
                <el-button @click="modifyDialog=false" size="small">取消</el-button>
            </p>
        </el-dialog>
        <!-- 匹配进度表 -->
        <el-dialog title="选择班级代表" :visible.sync="matchingDialog" append-to-body width="700px"  :close-on-click-modal="false">
            <span>班级&emsp;</span>
            <el-select v-model="chooseSchedule" @change="changeSchedule" value-key="id" size="small" style="width: 90%;">
                <el-option v-for="item in scheduleNameList" :label="item.schedule_name" :value="item"></el-option>
            </el-select>
            <p style="height:20px;"></p>
            <!-- <span>重命名&emsp;</span>
            <el-input v-model.trim="scheduleName" size="small" style="width: 90%;"></el-input> -->
            <p style="text-align:right;padding:20px 0 0;">
                <el-button @click="checkScheduleName" size="small" type="primary">确定</el-button>
                <el-button @click="matchingDialog = false" size="small">取消</el-button>
            </p>
        </el-dialog>
        <!-- 学生详情 -->
        <el-dialog title="选修名单" :visible.sync="showStudent" append-to-body width="900px"  :close-on-click-modal="false">
            <el-table :data="studentlist" highlight-current-row size="mini" border>
                <el-table-column prop="enrollment_year" label="年级" width="55"></el-table-column>
                <el-table-column prop="cn_name" label="专业"></el-table-column>
                <el-table-column prop="class_name" label="行政班"></el-table-column>
                <el-table-column prop="stu_num" label="学号" width="100"></el-table-column>
                <el-table-column prop="student_name" label="姓名" width="100"></el-table-column>
                <el-table-column prop="sex" label="性别" width="50"></el-table-column>
                <el-table-column prop="c_date" label="报名时间" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.c_date | timestampToTime(1) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button v-show="studentlist.length" @click="exportExcel" type="primary" size="small">导出EXCEL</el-button>
                <el-button @click="showStudent = false" size="small">关 闭</el-button>
                <a v-show="false" ref="exportExcel"></a>
            </span>
        </el-dialog>
        <!-- 选修课设置 -->
        <el-dialog title="选修课设置" :visible.sync="showElective" :close-on-click-modal="false" append-to-body width="750px">
            <el-form :model="electiveSetting" ref="electiveSetting" :rules="rules" label-width="120px" size="mini">
                <el-form-item label="课程:" prop="course_arrange">
                    <p>{{ electiveSetting.course_arrange }}</p>
                </el-form-item>
                <el-form-item label="班级:" prop="admin_cls_names">
                    <p>{{ electiveSetting.admin_cls_names }}</p>
                </el-form-item>
                <el-form-item label="报名开始时间:" prop="start_date">
                    <el-date-picker type="datetime" v-model="electiveSetting.start_date" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报名截止时间:" prop="deadline_date">
                    <el-date-picker type="datetime" v-model="electiveSetting.deadline_date" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="人数上限:" prop="max_stu_num">
                    <el-input-number v-model="electiveSetting.max_stu_num" 
                    :controls="false" :min="0" label="请输入数值"></el-input-number>
                    <span>&emsp;0 - 表示不限</span>
                </el-form-item>
                <el-form-item label="选修类型:" prop="option_type">
                    <el-select v-model="electiveSetting.option_type" style="width:220px;">
                        <el-option v-for="item in classType" :label="item.name" :value="item.type" :key="item.type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注意事项:" prop="option_remark">
                    <el-input v-model.trim="electiveSetting.option_remark" :rows="5" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveElevtive('electiveSetting')" type="primary" size="small">确 定</el-button>
                <el-button @click="hideElective('electiveSetting')" size="small">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 生成进度表-异常提示 -->
        <el-dialog title="提示" :visible.sync="showTip" top="10vh" :close-on-click-modal="false" append-to-body width="900px">
            <p style="color:blue;">同一门课、同一授课形式、一个行政班只能在一种分组方式中，如下分组方式有冲突：</p>
            <el-table :data="showTipList" size="mini" border max-height="650" style="width:100%">
                <el-table-column prop="admin_cls_names" label="分组方式"></el-table-column>
                <el-table-column prop="conflict" label="冲突提示" min-width="200"></el-table-column>
            </el-table>
            <p style="color:red;">如果一个授课形式不同的内容需要按不同的方式分组，另外一种方式请选择提别的授课形式</p>
        </el-dialog>
        <!-- 批量设置报名时间 -->
        <el-dialog title="批量设置报名时间" :visible.sync="showTimeDialog" :close-on-click-modal="false" append-to-body width="400px">
            <el-form :model="timeRange" :rules="timeRule" ref="timeRange" label-width="120px" size="small">
                <el-form-item label="报名开始时间" prop="startTime">
                    <el-date-picker type="datetime" v-model="timeRange.startTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报名截止时间" prop="endTime">
                    <el-date-picker type="datetime" v-model="timeRange.endTime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div style="text-align:right;padding: 5px 20px;">
                <el-button @click="setTime" type="primary" size="small">确认</el-button>
                <el-button @click="showTimeDialog = false" size="small">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
export default {
    data(){
        let validcodeNum=(rule,value,callback)=>{
            let reg=/^\d+$/;
            if(!reg.test(value)){
                callback(new Error('人数必须是整数'))
            }else{
                callback()
            }
        };
        return {
            userid: '',
            username: '',
            publish_status: false,
            showTab: false,
            modifyDialog: false,
            matchingDialog: false,
            activeTab: 'matching',
            breadcrumb: [
                {label: "教学管理"},
                {label: "课程表管理",path:"/teaching_management/visualized_course/visualized_list"},
                {label: "生成进度表"}
            ],
            match_qty: 0,
            unmatch_qty: 0,
            option_course_num: 0,
            semester: {},
            year: '',
            orderNum: '',
            course: '',
            courseItem: {},
            chooseRow: {},
            modifyMsg: {},
            semesterList: [],
            semesterCourse:[],
            scheduleList: [],
            scheduleNameList: [],
            chooseSchedule: {},
            scheduleName: '',
            courseRow: {},
            courseList: [],
            misCourseList: [],
            currentCourse: '',
            semesterCourseList: [],
            
            //选修课
            electiveList: [],
            showStudent: false,
            showElective: false,
            studentlist: [],
            current_elective: {},
            electiveSetting:{
                id: '',
                course_arrange:'',
                admin_cls_names: '',
                start_date: '',
                deadline_date: '',
                max_stu_num: '',
                option_type: '',
                option_remark: '',
            },
            rules: {
                course_arrange: [{ required: true }],
                admin_cls_names: [{ required: true }],
                start_date: [
                    { required: true, message: '请设置开始时间', trigger: 'blur' }
                ],
                deadline_date: [
                    { required: true, message: '请设置截止时间', trigger: 'blur' }
                ],
                max_stu_num: [
                    { required: true, message: '请设置人数', trigger: 'blur' },
                    { validator: validcodeNum, trigger:'blur' }
                ],
                option_type: [
                    { required: true, message: '请设置类型', trigger: 'blur' }
                ],
            },
            classType: [
                { name: '选定班级', type:0 },
                { name: '选定年级', type:1 },
                { name: '所有学生', type:2 }
            ],
            showTip: false,
            showTipList: [],
            //批量设置报名时间
            showTimeDialog: false,
            timeRange:{
                startTime: '',
                endTime: ''
            },
            timeRule: {
                startTime: [
                    { required: true, message: '请设置开始时间', trigger: 'blur' }
                ],
                endTime: [
                    { required: true, message: '请设置截止时间', trigger: 'blur' }
                ],
            }
        }
    },
    filters:{
        weekdayMap(val){
            let tempObj = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',7:'日'};
            return tempObj[val];
        },
        timestampToTime(timestamp,type) {
            if(!timestamp){
                return '';
            }
            let date = new Date(timestamp);  // times 时间戳（通常为13位）
            let  Y = date.getFullYear();
            let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let  D = (date.getDate() < 10 ?'0'+ date.getDate() : date.getDate());
            let  H = date.getHours() < 10 ?'0'+ date.getHours() : date.getHours();
            let  Min = date.getMinutes() < 10 ?'0'+ date.getMinutes() : date.getMinutes();
            let  S = date.getSeconds() < 10 ?'0'+ date.getSeconds() : date.getSeconds();
            // let times =  Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
            // let times =  Y + '-'+ M+ '-' + D;
            // return times;  //  eg:  2018-08-02 09:30:12
            if(type==1){
                return Y + '-'+ M+ '-' + D;
            }else if(type==2){
                return Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
            }
        }
    },
    mounted(){
        this.year = this.$route.query.semesterYear || (util.getStorage('currentYear') ? +util.getStorage('currentYear') : '');
        this.orderNum = this.$route.query.semesterYearNumber  || (util.getStorage('currentSemester') ? +util.getStorage('currentSemester') : '');
        this.course =  +this.$route.query.curriculum_visual_id || (util.getStorage('currentCourseTable') ? +util.getStorage('currentCourseTable') : '');
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userid = storage.me.attributes.login_info.id || '';
            this.username = storage.me.user.name || '';
        }
        this.querySemesterList('学期')
    },
    methods: {
        searchCourse(){
            this.queryMisMatching();
        },
        timestampToTime(timestamp,type) {
            if(!timestamp){
                return '';
            }
            let date = new Date(timestamp);  // times 时间戳（通常为13位）
            let  Y = date.getFullYear();
            let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let  D = (date.getDate() < 10 ?'0'+ date.getDate() : date.getDate());
            let  H = date.getHours() < 10 ?'0'+ date.getHours() : date.getHours();
            let  Min = date.getMinutes() < 10 ?'0'+ date.getMinutes() : date.getMinutes();
            let  S = date.getSeconds() < 10 ?'0'+ date.getSeconds() : date.getSeconds();
            if(type==1){
                return Y + '-'+ M+ '-' + D;
            }else if(type==2){
                return Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
            }
        },
        editTimestampToTime(timestamp) {
            let date = new Date(timestamp);  // times 时间戳（通常为13位）
            let  Y = date.getFullYear();
            let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let  D = (date.getDate() < 10 ?'0'+ date.getDate() : date.getDate());
            let  H = date.getHours() < 10 ?'0'+ date.getHours() : date.getHours();
            let  Min = date.getMinutes() < 10 ?'0'+ date.getMinutes() : date.getMinutes();
            let  S = date.getSeconds() < 10 ?'0'+ date.getSeconds() : date.getSeconds();
            return Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
        },
        changeSemester(){
            this.publish_status = false;
            this.courseList = [];
            this.showTab = false;
            //替换地址栏参数
            this.$router.replace({query:{...this.$route.query,semesterYear:this.semester.year}});
            this.$router.replace({query:{...this.$route.query,semesterYearNumber:this.semester.orderNum}});
            //将选择的学年、学期存本地，下次直接定位
            util.setStorage('currentYear',this.semester.year);
            util.setStorage('currentSemester',this.semester.orderNum);
            // 查询学期下课程表列表
            this.querySemesterCourse(1);
        },
        enterRecord(){
            // 录入
            if(!this.checkEmpty()){
                return;
            }
            let row = this.semesterCourse.find(item => item.id == this.course);
            this.$router.push({
                path:'/teaching_management/visualized_course/write_down',
                query:{
                    cls_name: row.curriculum_name,
                    grade: JSON.stringify(row.grades),
                    curriculum_visual_id: row.id,
                    term_name:this.semester.name,
                    year:this.semester.year,
                    semesterNum:this.semester.orderNum,
                    semesterID:this.semester.id
                }
            })
        },
        changeCourse(){
            this.publish_status = false;
            this.showTab = false;
            this.courseList = [];
            this.scheduleList = [];
            this.misCourseList = [];
            //替换地址栏参数
            this.$router.replace({query:{...this.$route.query,curriculum_visual_id:this.course}});

            util.setStorage('currentCourseTable',this.course);
            this.courseItem = this.semesterCourse.find(item => item.id == this.course);
        },
        changeTab(){
            (this.activeTab == 'matching') && (this.queryMatching());
            (this.activeTab == 'mismatching') && (this.queryMisMatching());
            (this.activeTab == 'elective') && (this.queryElectivesList());
        },
        showStu(row){
            //查询学生列表
            this.studentlist = [];
            this.current_elective = row || {};
            this.$http.get('_ed:/scheduleVisualizing/queryElectivesStudents/'+ row.id).then(res => {
                if(res.code === 0){
                    this.studentlist = res.data;
                    this.showStudent = true;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        editElective(row){
            this.$http.get('_ed:/scheduleVisualizing/queryElectivesDetail/'+ row.id).then(res => {
                if(res.code === 0){
                    this.electiveSetting.id = res.data.id || '';
                    this.electiveSetting.admin_cls_names = res.data.admin_cls_names || '';
                    this.electiveSetting.course_arrange = res.data.course_arrange || '';
                    this.electiveSetting.start_date = res.data.start_date && typeof res.data.start_date == 'number' ? this.timestampToTime(res.data.start_date,2) : res.data.start_date;
                    this.electiveSetting.deadline_date = res.data.deadline_date && typeof res.data.deadline_date == 'number' ? this.timestampToTime(res.data.deadline_date,2) : res.data.deadline_date;
                    this.electiveSetting.max_stu_num = res.data.max_stu_num;
                    this.electiveSetting.option_remark = res.data.option_remark || '';
                    this.electiveSetting.option_type = res.data.option_type;
                    this.showElective = true;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        saveElevtive(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.updateElectivesDetail(formName);
                } else {
                    return false;
                }
            });
        },
        updateElectivesDetail(formName){
            this.$http.post('_ed:/scheduleVisualizing/updateElectivesDetail',{
                start_date:  this.editTimestampToTime(this.electiveSetting.start_date),
                deadline_date: this.editTimestampToTime(this.electiveSetting.deadline_date),
                detail_visual_id: this.electiveSetting.id,
                max_stu_num: this.electiveSetting.max_stu_num,
                option_remark: this.electiveSetting.option_remark,
                option_type: this.electiveSetting.option_type,
            }).then(res => {
                if(res.code === 0){
                    this.$message.success('保存成功！');
                    this.queryElectivesList();
                    this.hideElective(formName);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        hideElective(formName){
            this.showElective = false;
            this.$refs[formName].resetFields();
        },
        setTime(){
            this.$refs['timeRange'].validate(valid => {
                if (valid) {
                    this.$http.post('_ed:/scheduleVisualizing/modifyDateTime',{
                        curriculum_visual_id: this.course,
                        start_date: this.timeRange.startTime,
                        deadline_date: this.timeRange.endTime,
                    }).then(res => {
                        if(res.code === 0){
                            this.$message.success('设置成功');
                            this.showTimeDialog = false;
                            this.queryElectivesList();
                            this.timeRange = {
                                startTime: '',
                                endTime: ''
                            }
                        }else{
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        // 导出学生列表
        exportExcel(){
            this.$http2.post('_ed:/export/electives/students',{
                detail_visual_id: this.current_elective.id
            }).then(res => {
                let url = window.URL.createObjectURL(new Blob([res]));
                let y = this.$refs.exportExcel;
                y.href = url;
                y.setAttribute("download", "选修名单.xls");
                y.click();
                window.URL.revokeObjectURL(url);
            })
        },
        queryScheduleNameList(){
            this.$http.post('_ed:/scheduleVisualizing/queryScheduleNameList',{
                admin_cls_ids: this.courseRow.admin_cls_ids,
                curriculum_visual_id: this.course,
                // new_name: "string",
                // old_name: "string",
                // schedule_name: "string",
                semester_course_id: this.courseRow.semester_course_id,
                // semester_year: this.semester.year,
                // semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    this.scheduleNameList = res.data;
                }
            });
        },
        queryMisMatching(){
            this.$http.post('_ed:/scheduleVisualizing/query/classPoorer',{
                // admin_cls_ids: [0],
                curriculum_visual_id: this.course,
                // new_name: "string",
                // old_name: "string",
                // schedule_name: "string",
                semester_course_id: this.currentCourse || '',
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    this.misCourseList = res.data;
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        queryElectivesList(){
            this.$http.post('_ed:/scheduleVisualizing/queryElectivesList',{
                curriculum_visual_id: this.course,
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    this.electiveList = res.data;
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        queryMatching(){
            this.$http.get('_ed:/scheduleVisualizing/query/schedule/visualDetail/'+ this.course).then(res => {
                if(res.code === 0){
                    this.scheduleList = res.data;
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        checkEmpty(){
            if(!this.course && this.course !== 0){
                this.$message.warning('请先选择课程表');
                return false;
            }else{
                return true;
            }
        },
        imitate(){
            this.currentCourse = '';
            if(!this.checkEmpty()){
                return;
            }
            this.$http.post('_ed:/scheduleVisualizing/queryCurriculumDetailVisualPrepare',{
                curriculum_visual_id: this.course,
                // admin_cls_ids: [
                //     0
                // ],
                // detail_visual_id: 0,
                // schedule_name: "string",
                // semester_course_id: 0
            }).then(res => {
                if(res.code === 0){
                    let num = JSON.parse(res.data);
                    this.match_qty = num.match_qty;
                    this.unmatch_qty = num.unmatch_qty;
                    this.option_course_num = num.option_course_num;
                    this.publish_status = +num.publish_status;
                    // this.activeTab = 'matching';
                    this.queryMatching();
                    this.queryMisMatching();
                    this.queryElectivesList();
                }else{
                    this.$message.error(res.msg)
                }
            });
            this.showTab = true;
        },
        produce(){
            this.showTipList = [];
            this.currentCourse = '';
            if(!this.checkEmpty()){
                return;
            }
            this.$http.post('_ed:/scheduleVisualizing/createVisualSchedule',{
                curriculum_visual_id:this.course,
                create_user: this.userid,
                create_username: this.username,
            }).then(res => {
                if(res.code === 0){
                    this.publish_status === 2;
                    // (res.data) && (this.$alert(res.data,'提示'));
                    (!res.data) && (this.$message.success('成功生成进度表'));
                    if(res.data){
                        try{
                            this.showTipList = JSON.parse(res.data);
                            this.showTip = true;
                        }catch(e){
                            this.$alert(res.data,'提示')
                        }
                    }
                    // this.querySemesterCourse();
                    this.imitate();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        matchingSchedule(row){
            this.scheduleName = '';
            this.chooseSchedule = {};
            this.courseRow = JSON.parse(JSON.stringify(row));
            this.queryScheduleNameList();
            
            this.matchingDialog = true;
        },
        changeSchedule(){
            this.scheduleName = this.chooseSchedule.schedule_name;
            // 调班级校验接口
            if(this.chooseSchedule.sort === 2){
                this.$confirm(`【${this.courseRow.admin_cls_names}】
                班级中有班级不在选择的 ${this.scheduleName} 
                进度表包含的【${this.chooseSchedule.admin_cls_names}】班级中，确认吗?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.checkScheduleName();
                }).catch(() => {
                    this.matchingDialog = false;
                });
            }
        },
        // scheduleClass(){
        //     //班级校验接口
        //     this.$http.post('_ed:/scheduleVisualizing/check/scheduleClass',{
        //         admin_cls_ids: this.chooseSchedule.admin_cls_ids,
        //         curriculum_visual_id: this.course,
        //         semester_course_id: this.chooseSchedule.semester_course_id
        //     }).then(res => {
        //         if(res.code === 0){
        //             this.checkScheduleName();
        //         }else{
        //             this.$message.error(res.msg);
        //         }
        //     })
        // },
        checkScheduleName(){
            // 调重名校验接口，校验成功再调提交接口
            if(Object.keys(this.chooseSchedule).length === 0){
                this.$message.warning('请选择进度表');
                return;
            }else if(!this.scheduleName){
                this.$message.warning('进度表名称不能为空');
                return;
            }
            this.$http.post('_ed:/scheduleVisualizing/checkScheduleName',{
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum,  
                curriculum_visual_id: this.course,
                new_name: this.scheduleName
            }).then(res => {
                if(res.code === 0){
                    this.saveSchedule();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        saveSchedule(){
            // 提交接口
            this.$http.post('_ed:/scheduleVisualizing/queryCurriculumDetailVisualPrepare',{
                admin_cls_ids: this.chooseSchedule.admin_cls_ids,
                curriculum_visual_id: this.course,
                detail_visual_id: this.courseRow.id,
                schedule_name: this.scheduleName,
                semester_course_id: this.courseRow.semester_course_id
            }).then(res => {
                if(res.code === 0){
                    this.$message.success('匹配成功');
                    this.matchingDialog = false;
                    // 刷新列表
                    // this.imitate();
                    this.queryMisMatching()
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        showDetail(row){
            this.courseList = [];
            this.$http.post('_ed:/scheduleVisualizing/queryScheduleDetailVisual',{
                course_id: row.semester_course_id,
                visual_id: row.curriculum_visual_id,
                schedule_name: row.name
            }).then(res => {
                if(res.code === 0){
                    this.courseList = res.data.dataList;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        modifyName(row){
            this.chooseRow = row;
            this.modifyMsg = JSON.parse(JSON.stringify(row));
            this.modifyDialog = true;
        },
        removeMatching(row){
            this.$confirm('是否确定解除匹配?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeMatch(row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        addManualMatch(row){
            this.$http.post('_ed:/scheduleVisualizing/addManualMatch',{
                curriculum_visual_id: this.course,
                schedule_name: row.name,
                semester_course_id: row.semester_course_id,
            }).then(res => {
                if(res.code == 0) {
                    this.$message.success('已解除自动匹配，请到“未自动匹配的课表明细”中选择代表班级，手工匹配！');
                    // this.imitate();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        removeMatch(row){
            this.$http.post('_ed:/scheduleVisualizing/removeMatching',{
                // admin_cls_ids: [0],
                curriculum_visual_id: this.course,
                // new_name: "string",
                // old_name: "string",
                schedule_name: row.name,
                // semester_course_id: 0,
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    (res.data) && (this.$alert(res.data,'提示'));
                    (!res.data) && (this.$message.success('已成功解除匹配'));
                    this.imitate();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        withdraw(type,row){
            if(!this.checkEmpty()){
                return;
            }
            this.$confirm('是否确定需要撤回?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.withdrawScheduleByDetail(type,row);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        withdrawScheduleByDetail(type,row){
            let param = new Object();
            if(type == 1){
                param = {
                    // admin_cls_ids: [0],
                    curriculum_visual_id: this.course,
                    // new_name: "string",
                    // old_name: "string",
                    schedule_name: row.name,
                    // semester_course_id: row.semester_course_id,
                    // semester_year: this.semester.year,
                    // semester_year_number: this.semester.orderNum
                }
            }else{
                param = {
                    curriculum_visual_id: this.course
                }
            }
            this.$http.post('_ed:/scheduleVisualizing/withdrawScheduleByDetail',param).then(res => {
                if(res.code === 0){
                    (res.data) && (this.$alert(res.data,'提示'));
                    (!res.data) && (this.$message.success('已成功撤回'));
                    (type == 2) && (this.querySemesterCourse());
                    this.imitate();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        saveModify(){
            if(!this.modifyMsg.name){
                this.$message.warning('进度表名称不能为空');
                return;
            }
            this.$http.post('_ed:/scheduleVisualizing/updateScheduleName',{
                // admin_cls_ids: [0],
                curriculum_visual_id: this.course,
                new_name: this.modifyMsg.name,
                old_name: this.chooseRow.name,
                detail_visual_id: this.chooseRow.id,
                // schedule_name: 'string',  //(撤回进度表使用-''为撤回所有进度表)
                // semester_course_id: 0,
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    this.$message.success('改名成功');
                    this.modifyDialog = false;
                    //刷新进度表
                    this.changeTab();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        querySemesterList(query){
            this.$http.get('_op:/terms/' + query).then(res => {
                if(res.code == 0){
                    this.semesterList = res.data.reverse();
                    if(!this.year || !this.orderNum){
                        let currentObj = this.semesterList.find(item => item.status === 2); //当前学年、学期
                        this.year = currentObj.year;
                        this.orderNum = currentObj.orderNum;
                        util.setStorage('currentYear',this.year);
                        util.setStorage('currentSemester',this.orderNum);
                    }
                    this.semester = this.semesterList.find(item => item.year == this.year && item.orderNum == this.orderNum );
                    let type = this.course ? 0 : 1;
                    this.querySemesterCourse(type);
                    this.queryCourseList();
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                this.$message.error(err);
            });
        },
        querySemesterCourse(type=0){
            this.$http.post('_ed:/scheduleVisualizing/queryCurriculumList',{
                // admin_cls_id: 0,
                // curriculum_visual_name: "string",
                // grade: 0,
                // page_size: 0,
                semesterId: this.semester.id,
                // semester_course_id: 0,
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
                // start_index: 0
            }).then(res => {
                if(res.code == 0){
                    if(res.data && res.data.dataList && res.data.dataList.length){
                        this.semesterCourse = res.data.dataList;
                        if(type == 1){
                            this.course = this.semesterCourse[0].id;
                            util.setStorage('currentCourseTable',this.course);
                        };
                        this.$nextTick(()=>{
                            this.courseItem = this.semesterCourse.find(item => item.id == this.course);
                        })
                    }else{
                        this.course = '';
                        this.courseItem = {};
                        this.semesterCourse = [];
                    }
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                this.$message.error(err)
            })
        },
        queryCourseList(){
            this.$http.post('_ed:/semestercourse/list/detail',{
                semester_year: this.semester.year,
                semester_year_number: this.semester.orderNum
            }).then(res => {
                if(res.code === 0){
                    this.semesterCourseList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            })
        }
    },
}
</script>
<style>
    .create-schedule .el-table--mini td, .create-schedule .el-table--mini th{
        padding: 3px 0;
    }
    .create-schedule .el-button+.el-button{
        margin-left: 0px;
    }
    .create-schedule .el-button--text{
        padding-right: 8px;
    }
</style>

<style lang="less" scoped>
    .schedule-bar{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .schedule{
            display: inline-flex;
            margin:10px;
            .schedule-label{
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                padding-right:5px;
                justify-content: flex-end;
            }
        }
    }
    .create-schedule{
        width:100%;
        display:flex;
        justify-content:space-between;
    }
    .mis-tip{
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
