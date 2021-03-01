<template> 
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.path">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" :rules="rules" size="mini" :model="formInline" ref="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse">
                            <el-button type="primary" size="mini" @click="searchTable">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" class="cm-collapse" @click="collapseShow" >{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="年级" prop="grade">
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
                        <el-select v-model="formInline.major" style="width: 160px;" @change="changeMajor">
                            <el-option v-for="(itemNature) of natures" :key="itemNature.id" :label="itemNature.name" :value="itemNature.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="班级">
                        <el-select v-model="formInline.class" style="width: 180px;">
                            <el-option label="全部" value="0"></el-option>
                            <el-option v-for="(claItem, claIndex) of classData" :key="claIndex" :label="claItem.name" :value="claItem.id"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="曾不及格门数<=" prop="fails">
                        <el-input style="width:50px;" v-model="formInline.fails"></el-input>
                        </el-form-item>
                        <el-form-item label="且" prop="and">
                        <el-select v-model="formInline.and" style="width:100px;"> 
                            <el-option label="全部课" value="1"></el-option>
                            <el-option v-for="(courseAll, courseIndex) of courseAlls" :key="courseIndex" :label="courseAll.label" :value="courseAll.value"></el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="平均分>=" prop="avg">
                        <el-input style="width:60px;" v-model="formInline.avg"></el-input>
                        </el-form-item>
                        <el-form-item label="或 最低平均绩点" prop="minAvg">
                        <el-input style="width:60px;" v-model="formInline.minAvg"></el-input>
                        </el-form-item>
                        <el-form-item label="学位" prop="isDegreeType">
                        <el-select v-model="formInline.isDegreeType" style="width:90px;">
                            <el-option v-for="(degreeItem, degreeIndex) of isDegreeType" :key="degreeIndex" :label="degreeItem.label" :value="degreeItem.value"></el-option>
                        </el-select>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btns">
          <el-button style="float: left;" size="mini"  type="primary" @click="degreeDialogVisible = true">生成学位证号</el-button>
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
                <el-form-item label="暂不能授予的编号">
                  <el-select v-model="dialogForm.noGraNum">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(sortMajor, sortIndex) of sortMajors" :key="sortIndex" :label="sortMajor.label" :value="sortMajor.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学位证最小编号">
                  <el-input style="width:193px;" v-model="dialogForm.minGraduation"></el-input>
                </el-form-item>
                <el-form-item label="学位类型">
                  <el-select v-model="dialogForm.degreeType">
                    <el-option v-for="(degreeItem, degreeIndex) of degreeTypes" :key="degreeIndex" :label="degreeItem.label" :value="degreeItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学位结议编号">
                  <el-input style="width:193px;" v-model="dialogForm.degreeConclusion"></el-input>
                </el-form-item>
                <el-form-item label="获得学位日期">
                    <el-date-picker
                    style="width:193px;"
                    v-model="dialogForm.degreeDate"
                    type="date"
                    placeholder="选择学位日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <div style="float:right; margin-right:28px;">
                        <el-button @click="degreeDialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sureDegreeDialogVisible">确 定</el-button>
                    </div>
                    
                </el-form-item>
            </el-form>
          </el-dialog>
          <el-upload style="float: left; margin-left: 10px;"
            class="upload-demo"
            ref="upload"
            :action="exportUrl"
            :headers="headers"
            :show-file-list="false" 
            :before-upload="onBefore" 
            :on-success="degreeSuccess"
            >
            <el-button slot="trigger" size="mini" type="primary">导入学位证号</el-button>
          </el-upload>
          <!-- <el-upload style="float: left; margin-left: 10px;"
            class="upload-demo"
            ref="upload"
            :headers="headers"
            action="_op:/studentStatus/importDiploma"
            :show-file-list="false" 
            :before-upload="onBefore" 
            :on-success="degreeSuccess"
            >
            <el-button style="float: left;" slot="trigger" size="mini" type="primary">下载模板</el-button>
          </el-upload> -->
          <el-button style="float: left; margin-left: 10px;" size="mini" type="primary"><a style="color: #ffffff" :href=" `${publicPath}template/degree_management.xls`" download='学位证号下载模板.xls' >下载模板</a></el-button>
          <el-button style="float: left; margin-left:10px;" size="mini" type="primary" @click="exportEXCEL">导出EXCEL</el-button>
          <a v-show="false" ref="exportExcel"></a>
          <el-button style="float: left; margin-left:10px;" size='mini' type="primary" @click="exportBDF">导出DBF</el-button>
          <a v-show="false" ref="exportBDF"></a>
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
                        <el-table-column label="学号" prop="stuNum" fixed width="100"></el-table-column>
                        <el-table-column label="姓名" prop="name" fixed width="95"></el-table-column>
                        <el-table-column label="性别" prop="sex" width="45"></el-table-column>
                        <!-- <el-table-column label="专业" prop="majorName" width="160"></el-table-column> -->
                        <el-table-column label="班级" prop="adminClsName" width="160"></el-table-column>
                        <el-table-column label="毕业状态" prop="graduationStatus" width="70"></el-table-column>
                        <el-table-column label="曾不及格门数" prop="bxCngNum" width="60"></el-table-column>
                        <el-table-column label="必修课平均分" prop="avgGrade" width="60"></el-table-column>
                        <el-table-column label="平均绩点" prop="avgPpa" width="50"></el-table-column>
                        <el-table-column label="学位状态" prop="diplomaStatus" width="70"></el-table-column>
                        <el-table-column label="备注" prop="diplomaRemark" width="160"></el-table-column>
                        <el-table-column label="学位证书编号" prop="diplomaNum" width="160"></el-table-column>
                        <el-table-column label="学位决议编号" prop="decisionNum" width="150"></el-table-column>
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
                        <!-- <el-table-column fixed label="课程编号" prop="course" width="70"></el-table-column> --> 
                        <el-table-column label="课程名称" prop="courseName" width="160" fixed></el-table-column>
                        <el-table-column label="学期" prop="termName" width="70"></el-table-column>
                        <el-table-column label="课程性质" prop="natureName" width="50"></el-table-column>
                        <el-table-column label="课程成绩" prop="courseGrade" width="50"></el-table-column>
                        <el-table-column label="课程成绩说明" prop="courseGradeDetail" width="300"></el-table-column>
                        <el-table-column label="原成绩" prop="courseGradeOriginal" width="100"></el-table-column>
                        <el-table-column label="原成绩成绩说明" prop="courseGradeOriginalDetail" width="200"></el-table-column>
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
    name:"degree_management",
    data(){
        return {
            publicPath: process.env.BASE_URL,
            exportUrl: '_op:/studentStatus/importDiploma',
            breadcrumb:[
                {label:'学生管理'},
                {label:'学位管理'}
            ],
            positionRight: 'right',
            formInline:{
                grade: '',
                major: '',
                class: '0',
                and: '',
                avg: '',
                minAvg: '',
                fails: '',
                isDegreeType: '0',
                degreeCourseType: ''

            },
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
            isDegreeType: [
                {label: '全部', value: '0'},
                {label: '没学位', value: '1'},
                {label: '有学位', value: '2'}
            ],
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
                fails:[
                    {required: true, message: '请输入不及格的门数', trigger: 'change' },
                ],
                avg:[
                    {required: true, message: '请输入平均成绩', trigger: 'change' },
                ],
                minAvg:[
                    {required: true, message: '请输入最低平均绩点', trigger: 'change' },
                ],
                isDegreeType: [
                    {required: true, message: '请选择毕业类型', trigger: 'change' },
                ],
                and: [
                    {required: true, message: '请选择课程类型', trigger: 'change' },
                ]
            },
            dialogForm: {
                order: '',
                noGraNum: '',
                degreeType: '4',
                showType1: '',
                showCourse: '',
                minGraduation: '',
                degreeConclusion: '',
                degreeDate: ''

            },
            degreeDialogVisible: false,
            pageNo: 1,
            pageSize: 10,
            totalCout: 20,
            // 学位下拉
            degreeTypes: [
                {label: '学士', value: '4'},
                {label: '硕士', value: '3'},
                {label: '博士', value: '2'},
            ],
            // 专业下拉
            natures: [],
            courseAlls: [
                {label: '必修课', value: '2'},
                {label: '必修和综考', value: '3'},
            ],
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
            fileList: [],
            grade: '',
            classData1: [],
            classGradAll: [],
            table1Data:[],
            table2Data:[],
            table1Loading:false,
            table2Loading:false,
            tableHeight:window.innerHeight - 154,
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
            this.exportUrl = '/operation/data/admin/studentStatus/importDiploma'
        }
        // this.getSemester()
        // this.getAdministrative()
    },
    mounted(){
        this.tableWidth = document.querySelector('.table-container').clientWidth
        this.leftWidth = document.querySelector('.course-table').clientWidth
        this.rightWidth = document.querySelector('.score-table').clientWidth
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
            // let DomH = document.querySelector('.cm-main').offsetHeight  cm-btns
            let crumbH = document.querySelector('.cm-breadcrumb').offsetHeight
            let foldH = document.querySelector('.cm-fold').offsetHeight
            this.tableHeight = DomH-crumbH-foldH
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
        // 生成 学位证号
        getDialogData(graduationDate) {
            let search = 'sure'
            let data = {
                grade:  this.formInline.grade,
                majorId:  this.formInline.major,
                administrativeClassId:  this.formInline.class,
                ngCourseNum: this.formInline.fails,
                courseType: this.formInline.and,
                minAvgScore: this.formInline.avg,
                minAvgScoreGpa: this.formInline.minAvg,
                degreeType: this.dialogForm.degreeType,
                startNo: this.dialogForm.minGraduation,
                sortType: this.dialogForm.order,
                sortNgType: this.dialogForm.noGraNum,
                diplomaDecisionNo: this.dialogForm.degreeConclusion,
                diplomaDate: graduationDate
            }
            this.$http.post('_op:/studentStatus/getStudentDiploma', data).then(res => {
                if(res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '生成成功'
                    })
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '生成失败,对应的参数'
                })
            })
            this.clickSave(search) 
        },
        // // 班级下拉切换
        // handleCheckChange(data){
        //     if(data.id){
        //         this.selectValue = data.id
        //         this.formInline.class = data.label
        //         this.$refs.selectClass.blur()
        //     }
        // },
        // 改变专业
        changeMajor() {
            this.getAdministrative()
        },
        // 获取专业
        changeGrage () {
            let grade = this.formInline.grade
            this.getAdministrative()
            this.$http.get('_op:/major/getMajorByGrade/' + grade).then(res => {
                this.natures = res.data
            })
        },
        // 学位查询
        searchTable() {
            let search = 'searchData'
            this.$refs['formInline'].validate((valid => {
                if(valid) {
                    this.table1Loading = true
                    let param = {
                        grade:  this.formInline.grade,
                        majorId:  this.formInline.major, 
                        administrativeClassId:  this.formInline.class,
                        ngCourseNum: this.formInline.fails,
                        courseType: this.formInline.and,
                        minAvgScore: this.formInline.avg,
                        minAvgScoreGpa: this.formInline.minAvg,
                        degreeType: this.dialogForm.degreeType,
                        diplomaType: this.formInline.isDegreeType
                    }
                    this.$http.post('_op:/studentStatus/queryDiplomaStudentList',param).then(res => {
                        if (res.code == 0) {
                            this.table1Data = res.data
                            this.table1Loading = false
                        }
                    }).catch(error => {
                        this.$message.error('查询失败,参数有误')
                        this.table1Loading = false
                    })
                    this.clickSave(search)
                }
            }))
        },
        save() {
            let data = {
                sys_code: 'edu',
                param_code: 'diploma_num_format'
            }
            this.$http.post('_ed:/sysparameter/queryParameterDetail', data).then(res => {
                this.formInline.fails = res.data.param_5
                this.formInline.and = res.data.param_6
                this.formInline.avg = res.data.param_7
                this.formInline.minAvg = res.data.param_8
                this.dialogForm.minGraduation = res.data.param_2
                this.dialogForm.order = res.data.param_3,
                this.dialogForm.noGraNum = res.data.param_4,
                this.dialogForm.degreeType = res.data.param_9
            })
        },
        // 点击查询保存参数
        clickSave(search) {
            let postData
            if (search === 'searchData') {
                let data = {
                    param_type: 1,
                    sys_code: "edu",
                    param_code: "diploma_num_format",
                    param_5: this.formInline.fails,
                    param_6: this.formInline.and,
                    param_7: this.formInline.avg,
                    param_8: this.formInline.minAvg,
                }
                postData = data
            } else{
                let data = {
                    param_type: 1,
                    sys_code: "edu",
                    param_code: "diploma_num_format",
                    param_2: this.dialogForm.minGraduation,
                    param_3: this.dialogForm.order,
                    param_4: this.dialogForm.noGraNum,
                    param_9: this.dialogForm.degreeType
               }
               postData = data
            }
            this.$http.post('_ed:/sysparameter/modifyParameter',postData).then(res => {
                // console.log('33333',res)
            })
        },
        // 请求课程成绩
        queryCourse (studentNo, type, natureId) {
            this.table2Loading = true
            let param = {
                studentNo: studentNo,
                type: type,
                natureId: natureId
            }
            this.$http.post('_sc:/stuScore/queryStudentCourseGrade', param).then(res => {
                if(res.code == 0){
                    this.table2Data = res.data.result
                    this.table2Loading = false
                }else{
                     this.$message.error(res.msg)
                     this.table2Loading = false
                 }
            })
        },
        // 课程点击
        rowClick(row, column, event){
            let stuNum = row.stuNum
            let type = this.courseForm.courseType
            let natureId = this.courseForm.courseProperty
            this.queryCourse(stuNum, type, natureId)
        },
        // 生成学位证号
        sureDegreeDialogVisible() {
            let year = new Date(this.dialogForm.degreeDate).getFullYear()
            let month = new Date(this.dialogForm.degreeDate).getMonth() + 1
            month < 10 ? month = '0'+ month : month = month
            let day = new Date(this.dialogForm.degreeDate).getDate()
            day < 10 ? day = '0'+ day : day = day
            let graduationDate = year + '-' + month + '-' + day
            this.degreeDialogVisible = false
            this.getDialogData(graduationDate)
        },
        // 导出EXCEL
        exportEXCEL() {
            let data = {
                grade:  this.formInline.grade,
                majorId:  this.formInline.major, 
                // administrativeClassId:  this.formInline.class,
                // ngCourseNum: this.formInline.fails,
                // courseType: this.formInline.and,
                // minAvgScore: this.formInline.avg,
                // minAvgScoreGpa: this.formInline.minAvg,
                // diplomaType: this.formInline.isDegreeType
            }
            this.$http({
                method:'post',
                url: '_op:/studentStatus/export/diplomaList',      
                responseType: 'blob',
                data: data
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "学位管理.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        // 导出BDF
        exportBDF() {
             let data = {
                grade:  this.formInline.grade,
                majorId:  this.formInline.major, 
                // administrativeClassId:  this.formInline.class,
                // ngCourseNum: this.formInline.fails,
                // courseType: this.formInline.and,
                // minAvgScore: this.formInline.avg,
                // minAvgScoreGpa: this.formInline.minAvg,
                // diplomaType: this.formInline.isDegreeType
            }
            this.$http({
                method:'post',
                url: '_op:/studentStatus/export/exportDiplomaListToDBF',
                responseType: 'blob',
                data: data
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/dbf; charset= UTF-8; filename="downloaded.dbf'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportBDF;
                    y.href = url;
                    y.download = '学位管理.dbf';
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('必须输入年级')
            })
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
        // 验证上传文件格式
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
        // 文件上传成功提示
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
        // flex:1;
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