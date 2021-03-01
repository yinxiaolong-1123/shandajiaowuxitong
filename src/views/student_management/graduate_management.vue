<template> 
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.path">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline" :rules="rules" ref="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse">
                            <el-button type="primary" size="mini" @click="searchTable">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" class="cm-collapse" @click="collapseShow" >{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="年级" prop="grade">
                        <!-- <el-select v-model="formInline.grade">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(graItem, graIndex) of classGradAll" :key="graIndex" :label="graItem.grade" :value="graItem.grade"></el-option>
                        </el-select> -->
                            <intelligent-year-picker style="width: 110px;"
                            v-model="formInline.grade"
                            type="year"
                            clearable 
                            value-format="yyyy" 
                            @change="changeGrage"
                            placeholder="选择年级"> 
                        </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业" prop="major">
                        <el-select v-model="formInline.major" @change="changeMajor">
                            <!-- <el-option label="全部" value=""></el-option> -->
                            <el-option v-for="(itemNature) of natures" :key="itemNature.id" :label="itemNature.name" :value="itemNature.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="班级">
                        <el-select v-model="formInline.class">
                            <el-option label="全部" value="0"></el-option>
                            <el-option v-for="(claItem, claIndex) of classData" :key="claIndex" :label="claItem.name" :value="claItem.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="选修课最少门数" prop="lessElective">
                        <el-input style="width:50px;" v-model="formInline.lessElective" ></el-input>
                        </el-form-item>
                        <el-form-item label="或最低学分" prop="minCredit">
                        <el-input style="width:50px;" v-model="formInline.minCredit" ></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="isDegree"> 
                        <el-select v-model="formInline.isDegree">
                            <el-option v-for="(degItem, degIndex) of isDegrees" :key="degIndex" :label="degItem.label" :value="degItem.value"></el-option>
                        </el-select>
                        </el-form-item>
                        <!-- <el-form-item>
                        <el-checkbox v-model="formInline.showType2">仅显示仍不及格的必修课</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                        <el-checkbox v-model="formInline.showCourse">显示选修课</el-checkbox> 
                        </el-form-item> -->
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btns">
          <el-button style="float: left;" size="mini"  type="primary" @click="degreeDialogVisible = true">生成毕业证号</el-button>
          <el-upload style="float: left; margin-left: 10px;"
            class="upload-demo"
            ref="upload"
            :headers="headers"
            :action="exportUrl"
            :show-file-list="false" 
            :before-upload="onBefore" 
            :on-success="degreeSuccess"
            >
            <el-button slot="trigger" size="mini" type="primary">导入毕业证号</el-button>
          </el-upload>
          <el-button style="float: left; margin-left: 10px;" size="mini" type="primary" @click="noDegreeDialogVisible = true">批量设置毕(结)业</el-button>
          <el-dialog
            :visible.sync="noDegreeDialogVisible"
            :append-to-body="true"
            width="400px"
            center>
                <el-form label-position="right" label-width="130px" size="mini" :model="dialogForm">
                    <el-form-item label="毕(结)业日期">
                    <el-date-picker
                        style="width:193px;"
                        v-model="dialogForm.degreeDate"
                        type="date"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                <!-- <el-form-item label="排序">
                  <el-select v-model="dialogForm.order">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(majorNum, numInde) of majorNums" :key="numInde" :label="majorNum.label" :value="majorNum.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="暂不能毕业的编号">
                  <el-select v-model="dialogForm.noGraNum">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(sortMajor, sortIndex) of sortMajors" :key="sortIndex" :label="sortMajor.label" :value="sortMajor.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业类型">
                  <el-select v-model="dialogForm.graduationType">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(graduateItem, graduateIndex) of graduationTypes" :key="graduateIndex" :label="graduateItem.label" :value="graduateItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业证最小编号">
                  <el-input style="width: 200px;" v-model="dialogForm.minGraduation"></el-input>
                </el-form-item> -->
                <el-form-item>
                    <div style="float: right; margin-right:26px;">
                        <el-button @click="noDegreeDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureDegreeDialogVisible">确 定</el-button>
                    </div>
                    
                </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog
            :visible.sync="degreeDialogVisible"
            :append-to-body="true"
            width="400px"
            center>
                <el-form label-position="right" label-width="130px" size="mini" :model="dialogForm">
                <el-form-item label="排序">
                  <el-select v-model="dialogForm.order">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(majorNum, numInde) of majorNums" :key="numInde" :label="majorNum.label" :value="majorNum.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="暂不能毕业的编号">
                  <el-select v-model="dialogForm.noGraNum">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(sortMajor, sortIndex) of sortMajors" :key="sortIndex" :label="sortMajor.label" :value="sortMajor.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业类型">
                  <el-select v-model="dialogForm.graduationType">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(graduateItem, graduateIndex) of graduationTypes" :key="graduateIndex" :label="graduateItem.label" :value="graduateItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业证最小编号">
                  <el-input style="width: 193px;" v-model="dialogForm.minGraduation"></el-input>
                </el-form-item>
                <!-- <el-form-item label="毕(结)业日期">
                  <el-date-picker
                    style="width:193px;"
                    v-model="dialogForm.degreeDate"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item> -->
                <el-form-item>
                    <div style="float:right;margin-right:26px;">
                        <el-button @click="degreeDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureNoDegreeDialogVisible">确 定</el-button>
                    </div>
                    
                </el-form-item>
                </el-form>
            </el-dialog>
            <el-button style="float: left; margin-left: 10px;" size="mini" type="primary"><a style="color: #ffffff" :href="`${publicPath}template/graduate_management.xls`" download='毕业证号下载模板.xls' >下载模板</a></el-button>
            <a v-show="false" ref="exportModel"></a>
          <!-- <el-upload style="float: left; margin-left: 10px;"
            class="upload-demo"
            ref="upload"
            :headers="headers"
            action="_op:/studentStatus/importGraduation"
            :show-file-list="false" 
            :before-upload="onBefore" 
            :on-success="degreeSuccess"
            >
            <el-button slot="trigger" size="mini" type="primary">毕业证号下载模板</el-button>
          </el-upload> -->
          <el-button style="float: left; margin-left: 10px;" size="mini" type="primary" @click="exportBDF">导出DBF</el-button>
          <a v-show="false" ref="exportBDF"></a>
          <el-button style="float: left; margin-left: 10px;" size="mini" type="primary" @click="exportEXCEL">导出EXCEL</el-button>
          <a v-show="false" ref="exportExcel"></a>
           <div style="float:right; margin-right:40px;">
            <el-form size="mini" :model="courseForm" :label-position="positionRight" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="成绩类型">
                            <el-select v-model="courseForm.courseType" style="width:100px;">
                                <el-option v-for="(item,index) in courseTypes" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                        <el-col :span="12">
                            <el-form-item label="课程属性">
                            <el-select v-model="courseForm.courseProperty" style="width:80px;">
                                <el-option v-for="(item,index) in coursePropertes" :label="item.label" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        </div>
        <div class="cm-table">
            <div class="table-container" @mousemove.prevent="move" @mouseup.prevent="end">
                <div class="course-table">
                    <el-table 
                        :data="table1Data" 
                        border 
                        :width="leftWidth" 
                        size="mini"
                        :height="tableHeight"
                        @row-click="rowClick"
                        v-loading="table1Loading" 
                        :highlight-current-row="true"
                        element-loading-text="加载中..." 
                        header-row-class-name="cm-dark">
                        <el-table-column label="序号" type="index" fixed></el-table-column>
                        <el-table-column label="学号" prop="stuNum" width="100"></el-table-column>
                        <el-table-column label="姓名" prop="name" width="95"></el-table-column>
                        <el-table-column label="性别" prop="sex" width="45"></el-table-column>
                        <!-- <el-table-column label="专业" prop="majorName" width="160"></el-table-column> -->
                        <el-table-column label="班级" prop="adminClsName" width="160"></el-table-column>
                        <el-table-column label="必修不及格门数" prop="bxNgNum" width="70"></el-table-column>
                        <el-table-column label="选修门数" prop="xxNum" width="50"></el-table-column>
                        <el-table-column label="选修学分" prop="credits" width="50"></el-table-column>
                        <el-table-column label="总学分" prop="credits" width="60"></el-table-column>
                        <el-table-column label="毕业证书编码" prop="graduationNum" width="170"></el-table-column>
                        <el-table-column label="毕业状态" prop="graduationStatus" width="75"></el-table-column>
                        <el-table-column label="备注" prop="remark" width="210"></el-table-column>
                        <!-- <el-table-column label="操作" prop="graduationSetStatus">
                            <template slot-scope="scope">
                                <el-button @click.native.stop="setGraduated(scope.row, scope.$index)" :type="scope.row.graduationStatus === '不可毕业' ? 'danger' : 'success'" size="mini">{{scope.row.graduationSetStatus}}</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <div class="drageLine" @mousedown="start"></div>
                <div class="score-table">
                    <el-table 
                        :data="table2Data" 
                        border 
                        class="table-fixed"
                        :width="rightWidth" 
                        size="mini"
                        :height="tableHeight"
                        v-loading="table2Loading" 
                        element-loading-text="加载中..." 
                        header-row-class-name="cm-dark">
                        <!-- <el-table-column label="课程编号" prop="course" fixed width="70"></el-table-column> -->
                        <el-table-column label="课程名称" prop="courseName" width="160" fixed></el-table-column>
                        <el-table-column label="学期" prop="termName" width="70"></el-table-column>
                        <el-table-column label="课程性质" prop="natureName" width="50"></el-table-column>
                        <el-table-column label="课程成绩" prop="courseGrade" width="50"></el-table-column>
                        <el-table-column label="课程成绩说明" prop="courseGradeDetail" width="300"></el-table-column>
                        <el-table-column label="原成绩" prop="courseGradeOriginal" width="100"></el-table-column>
                        <el-table-column label="原成绩说明" prop="courseGradeOriginalDetail" width="200"></el-table-column>
                        <el-table-column label="补考说明" prop="courseBkDetail" width="300"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- <div style="float:right">
            <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCout">
            </el-pagination>
        </div> -->
    </section>
</template>
<script>
import util from '@/util'
import addStudent from './add_student'
import {
    mapState
} from 'vuex' //引入状态
import * as API from '@/api/API'
// import selectTree from './el_tree_select'
export default {
    name:"graduate_management",
    data(){
        return {
            publicPath: process.env.BASE_URL,
            exportUrl: '_op:/studentStatus/importGraduation',
            breadcrumb:[
                {label:'学生管理'},
                {label:'毕业管理'}
            ],
            positionRight: 'right',
            formInline:{
                grade: '',
                major: '',
                class: '0',
                lessElective: '',
                minCredit: '',
                order: '',
                noGraNum: '',
                minGraduation: '',
                showType1: '',
                showType2: '',
                showCourse: '',
                isDegree: '0'
            },
            fold:{
                state:false,
                text:'展开',
                showBtn:false,
            },
            rules:{
                grade: [
                    { required: true, message: '请选择年级', trigger: 'change' },
                ],
                major: [
                    {required: true, message: '请输选择专业', trigger: 'change' },
                ],
                lessElective:[
                    {required: true, message: '请输入选修课最少门数', trigger: 'change' },
                ],
                minCredit:[
                    {required: true, message: '请输入最低学分', trigger: 'change' },
                ],
                isDegree:[
                    {required: true, message: '请选择毕业类型', trigger: 'change' },
                ]
            },
            isDegrees: [
                {label: '所有学生', value: '0'},
                {label: '不可毕业的学生', value: '1'},
                {label: '可毕业的学生', value: '2'},
            ],
            courseForm: {
                courseType: '0',
                courseProperty: ''
            },
            courseTypes: [
                {label: '全部', value: '0'},
                {label: '曾补考', value: '1'},
                {label: '仍不及格', value: '2'},
            ],
            coursePropertes:[
                {label: '全部', value: ''},
                {label: '必修', value: '785'},
                {label: '选修', value: '768'},
                {label: '综考', value: '1234'},
            ],
            dialogForm: {
                order: '',
                noGraNum: '',
                minGraduation: '',
                graduationType: '',
                degreeDate: ''
            },
            degreeDialogVisible: false,
            noDegreeDialogVisible: false,
            pageNo: 1,
            pageSize: 10,
            totalCout: 20,
            // 排序下拉
            majorNums:[
                {label: '按专业，学号', value: '1'},
                {label: '按班级、学号', value: '2'}
            ],
            // 暂不毕业下拉
            sortMajors: [
                {label: '排在专业或班级最后', value: '1'},
                {label: '排在年级最后', value: '2'}
            ],
            // 专业下拉
            natures: [],
            // 毕业类型
            graduationTypes: [
                {label: '学士', value: '04'},
                {label: '硕士', value: '02'},
                {label: '博士', value: '01'},
                {label: '本科', value: '05'},
                {label: '已毕业', value: '99'},
            ],
            fileList: [],
            grade: '',
            // 年级下拉
            classGradAll: [],
            // 班级下拉
            classData1: [],
            // 左边table数据
            table1Data:[],
            // 右边table 数据
            table2Data:[],
            table1Loading:false,
            table2Loading:false, 
            // table 高度
            tableHeight:window.innerHeight - 152,
            startFlag: false,
            startX: 0,
            tempX: 0,
            tableWidth: 0,
            leftWidth: 0,
            rightWidth: 0
        }
    },
    watch: {},
    computed: {
        classData() {
            const grade = this.formInline.grade
            if (grade) {
                let classData2 = []
                this.classData1.filter(item => {
                    if (item.grade == grade) {
                        classData2.push(item)
                    }
                })
                return classData2
            }else{
                return this.classData1
            }
        },
        headers() {
            return {
                'Access_Token': util.getStorage('token'),
                'Authorization': util.getStorage('token')
            }
        }
    },
    created(){
        if (process.env.NODE_ENV === "production") {
            this.exportUrl = '/operation/data/admin/studentStatus/importGraduation'
        }
        // this.getSemester()
        // this.getAdministrative()
    },
    mounted(){
        this.tableWidth = document.querySelector('.table-container').clientWidth
        this.leftWidth = document.querySelector('.course-table').clientWidth
        this.rightWidth = document.querySelector('.score-table').clientWidth
        this.getHeight()
        util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        this.save()
    }, 
    // components:{
    //     selectTree
    // },  
    methods:{
        collapseShow(){
            this.fold.state=!this.fold.state;
            this.fold.text=this.fold.state?'收起':'展开';
        },
        // 鼠标按下事件
        start(e){
            this.startFlag = true
            this.startX = e.clientX
        },
        // 鼠标移动事件
        move(e){
            if(this.startFlag){
                let temp = this.tempX + (e.clientX - this.startX)
                document.querySelector('.drageLine').style.transform = `translateX(${temp}px)`
            }
        },
        // 鼠标抬起事件
        end(e){
            if(this.startFlag){
                this.tempX = this.tempX + (e.clientX - this.startX)
                document.querySelector('.course-table').style.width = `${this.leftWidth + this.tempX}px`
                document.querySelector('.score-table').style.width = `${this.rightWidth - this.tempX}px`
                this.startFlag = false
            }
        },
        // 获取div 高度
        getHeight(){
            let DomH = document.querySelector('.cm-btns').offsetHeight
            // let DomH = document.querySelector('.cm-main').offsetHeight
            let crumbH = document.querySelector('.cm-breadcrumb').offsetHeight
            let foldH = document.querySelector('.cm-fold').offsetHeight
            this.tableHeight = DomH-crumbH-foldH
            console.log(DomH,crumbH,foldH,window.innerHeight)
        },
        // 获取班级
        getAdministrative() { //行政班
                // let params = {
                //     pageNo: 1,
                //     pageSize: 100,
                //     param: {
                //         administrativeClassName: "",
                //         grade: "",
                //         majorId: "",
                //     }
                // }
                let grade = this.formInline.grade;
                let majorId = this.formInline.major
                this.$http.get('_op:/administrative/class/list/'+grade+'/'+majorId).then(data => {
                    this.classData1 = data.data
                }).catch(() => {})
            },
        // 生成毕业证号
        getDialogData(gra,graduationDate) {
            let search = 'sure'
            let postData
            if (gra == "graduation") {
                let data = {
                grade:  this.formInline.grade,
                majorId:  this.formInline.major,
                administrativeClassId:  this.formInline.class,
                optionCourseNum:  this.formInline.lessElective,
                minCredits:  this.formInline.minCredit,
                startNo:  this.dialogForm.minGraduation,
                degreeType:  this.dialogForm.graduationType,
                sortType:  this.dialogForm.order, 
                sortNgType:  this.dialogForm.noGraNum,
                graduationDate: graduationDate
            }
            postData = data
            } else if (gra == "noGraduation") {
                let data = {
                grade:  this.formInline.grade,
                majorId:  this.formInline.major,
                administrativeClassId:  this.formInline.class,
                optionCourseNum:  this.formInline.lessElective,
                minCredits:  this.formInline.minCredit,
                startNo:  "",
                degreeType:  "",
                sortType:  "", 
                sortNgType:  "",
                graduationDate: graduationDate
            }
            postData = data
        }
        this.$http.post('_op:/studentStatus/getStudentGraduation', postData).then((res, error) => {
                if(res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '生成成功'
                    })
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '生成失败,参数错误'
                })
            })
        this.clickSave(search)
        },
        // 打开页面查询 param 参数
        save() {
            let data = {
                sys_code: 'edu',
                param_code: 'graduation_num_format'
            }
            this.$http.post('_ed:/sysparameter/queryParameterDetail', data).then(res => {
                this.formInline.lessElective = res.data.param_5
                this.formInline.minCredit = res.data.param_6
                this.dialogForm.minGraduation = res.data.param_2,
                this.dialogForm.order = res.data.param_3,
                this.dialogForm.noGraNum = res.data.param_4,
                this.dialogForm.graduationType = res.data.param_7
            })
        },
        // 点击查询保存参数
        clickSave(search) {
            let postData
            if (search === 'searchData') {
                let data = {
                    param_type: 1, 
                    sys_code: "edu",
                    param_code: "graduation_num_format",
                    param_5: this.formInline.lessElective,
                    param_6: this.formInline.minCredit
                }
                postData = data
            }else{
                let data = {
                    param_type: 1, 
                    sys_code: "edu",
                    param_code: "graduation_num_format",
                    param_2: this.dialogForm.minGraduation,
                    param_3: this.dialogForm.order,
                    param_4: this.dialogForm.noGraNum,
                    param_7: this.dialogForm.graduationType
                }
                postData = data
            }
            this.$http.post('_ed:/sysparameter/modifyParameter',postData).then(res => {
                // console.log('33333',res)
            })
        },
        // 毕业管理查询
        searchTable() {
            let search = 'searchData'
            this.$refs['formInline'].validate((valid => {
                if (valid) {
                    this.table1Loading = true
                    let param = {
                        grade:  this.formInline.grade,
                        majorId:  this.formInline.major,
                        administrativeClassId:  this.formInline.class,
                        optionCourseNum:  this.formInline.lessElective,
                        minCredits:  this.formInline.minCredit,
                        graduationType:  this.formInline.isDegree
                    }
                    this.$http.post('_op:/studentStatus/queryGraduationStudentList',param).then(res => {
                        if (res.code == 0) {
                            this.table1Data = res.data
                            this.table1Data.forEach(item => {
                                if (item.graduationStatus == "可毕业") {
                                    item.graduationSetStatus = "设为毕业"
                                }
                                if (item.graduationStatus == "结业") {
                                    item.graduationSetStatus = "已经结业"
                                }
                                if (item.graduationStatus == "毕业") {
                                    item.graduationSetStatus = "已经毕业"
                                }
                            });
                            this.table1Loading = false
                        }
                    }).catch(error => {
                        this.$message.error('查询失败')
                        this.table1Loading = false
                    })
                    this.clickSave(search)
                }
            }))
        },
        // 改变专业
        changeMajor() {
            this.getAdministrative()
        },
        // 切换毕业时间
        changeGrage () {
            let grade = this.formInline.grade
            this.getAdministrative()
            this.$http.get('_op:/major/getMajorByGrade/' + grade).then(res => {
                this.natures = res.data
            })
        },
        // 批量生成毕结业证
        sureDegreeDialogVisible() {
            let year = new Date(this.dialogForm.degreeDate).getFullYear()
            let month = new Date(this.dialogForm.degreeDate).getMonth() + 1
            month < 10 ? month = '0'+ month : month = month
            let day = new Date(this.dialogForm.degreeDate).getDate()
            day < 10 ? day = '0'+ day : day = day
            let graduationDate = year + '-' + month + '-' + day
            this.noDegreeDialogVisible = false
            let graduation = 'noGraduation'
            this.getDialogData(graduation,graduationDate)
        },
        // 取消生成毕业证
        closeDegreeDialogVisible() {
            this.degreeDialogVisible = false
            this.formInline.grade = ''
            this.formInline.major = ''
            this.formInline.class = ''
            this.formInline.lessElective = ''
            this.formInline.minCredit = ''
            this.dialogForm.minGraduation = ''
            this.dialogForm.graduationType = ''
            this.dialogForm.order = ''
            this.dialogForm.noGraNum = ''
            this.dialogForm.graduationDate = ''
        },
        // 确认生成毕业证
        sureNoDegreeDialogVisible() {
            this.degreeDialogVisible = false
            let graduation = 'graduation'
            let graduationDate = null
            this.getDialogData(graduation,graduationDate)
        },
        // 请求课程成绩
        queryCourse (studentNo) {
            this.table2Loading = true
            let param = {
                studentNo: studentNo,
                natureId: this.courseForm.courseProperty,
                type: this.courseForm.courseType
            }
            this.$http.post('_sc:/stuScore/queryStudentCourseGrade', param).then(res => {
                if(res.code == 0){
                    this.table2Data = res.data.result
                    this.table2Loading = false
                }else{
                     this.$message.error(res.msg)
                     this.table2Loading = false
                 }
            }).catch(res => {
                this.$message.error('查询课程失败')
                this.table2Loading = false
            })
        },
        // 课程点击
        rowClick(row, column, event){
            console.log(row)
            let stuNum = row.stuNum
            this.queryCourse(stuNum)
        },
        // 设置毕业
        setGraduated(row, index) {
            let graduationStatuValue
            if (row.graduationStatus == '可毕业') {
                graduationStatuValue = '1'
            }else{
                graduationStatuValue = '2'
            }
            let param = {
                stuNum: row.stuNum,
                graduationStatus: graduationStatuValue
            }
            if (row.graduationStatus == '结业') {
                return this.$message.success('该学生已结业')
            } else if (row.graduationStatus == '毕业'){
                return this.$message.success('该学生已毕业')
            } else{
                 this.$http.put('_op:/studentStatus',param).then((res, error) => {
                     console.log('888',res)
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '设置成功'
                        })
                    }
                }).catch(error => {
                    this.$message.error('设置失败')
                })
            } 
        },
        // sizeChange(size){
        //     this.pageNo = 1;
        //     this.pageSize = size;
        //     this.searchTable();
        // },
        // // 分页跳转
        // currentChange(current){
        //     this.pageNo = current;
        //     this.searchTable();
        // },
        // 验证文件上传格式
        onBefore(file) {
            let extension = file.name.split('.')[1] === 'xls';
                let size = file.size / 1204 / 1204 < 20;
                if (!extension) {
                    this.$message.warning("上传的文件格式是 xls！")
                    return
                }
                if (!size) {
                    this.$message.warning("上传的文件大小不能超过20M！")
                    return
                }
                return size;
        },
        //  文件上传成功提示
        degreeSuccess(res, file) {
            let type = "success";
                let message = "导入成功！";
                if (res.code != 0) {
                    type = "error";
                    message = res.msg;
                }
                this.$message({
                    type: type,
                    message: message
                })
        },
         // 导出EXCEL
        exportEXCEL() {
            let data = {
                grade: this.formInline.grade,
                majorId: this.formInline.major,
                // administrativeClassId: this.formInline.class,
                // optionCourseNum: this.formInline.lessElective,
                // minCredits: this.formInline.minCredit,
                // graduationType: this.formInline.isDegree
            }
            this.$http({
                method:'post',
                url: '_op:/studentStatus/export/graduationList',
                responseType: 'blob',
                data: data
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "毕业管理.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        // 导出BDF
        exportBDF() {
             let data = {
                grade: this.formInline.grade,
                majorId: this.formInline.major,
                // administrativeClassId: this.formInline.class,
                // optionCourseNum: this.formInline.lessElective,
                // minCredits: this.formInline.minCredit,
                // graduationType: this.formInline.isDegree
            }
            this.$http({
                method:'post',
                url: '_op:/studentStatus/export/exportGraduationListToDBF',
                responseType: 'blob',
                data: data
            }).then(data => {
                let blob = new Blob([data], {type: 'application/dbf; charset= UTF-8; filename="downloaded.dbf'});
                let url = window.URL.createObjectURL(blob);
                let y = this.$refs.exportBDF;
                y.href = url;
                y.download = '毕业管理.dbf'
                y.click();
                window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('必须输入年级')
            })
        },
    }
}
</script>
<style>
.cm-main{
    padding:0!important;
}
/* .table-fixed /deep/ .el-table__fixed-right{
    height: 100% !important;
}
.table-fixed /deep/ .el-table__fixed{
    height: 110px !important;
} */
.table-container .el-table--scrollable-x .el-table__body-wrapper {
    z-index : 1;
}
</style>
<style lang="less" scoped>
.cm-btns{
    height: 29px;
    margin-top: 10px;
    margin-left: 10px;
    padding: 0 20px 10px 10px;
}
.cm-container{
    // display: flex;
    // flex-direction: column;
    // height: 100%;
    .cm-table{
        clear: both;
        margin-bottom:10px;
    }
}
.el-scrollbar{
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
        background-color: #FFF;
    }
}
.table-container{
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    .course-table{
        width: 69%
    }
    .score-table{
        width:29%
    }
    .drageLine{
        width: 2px;
        height: 100%;
        position: absolute;
        left: 70%;
        cursor: col-resize;
        background-color: #ccc;
        transform: translateX(-1px);
        z-index: 9999;
    }
}
</style>