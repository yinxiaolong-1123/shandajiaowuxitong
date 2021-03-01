<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{path: item.path}">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待安排" name="first">
            <div class="cm-fold">
              <el-form :model="formInline1" :inline="true" size="mini">
                <div class="fold">
                  <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                    <el-form-item class="cm-collapse">
                      <el-button type="primary" @click="getPlan">查询</el-button>
                    </el-form-item>
                    <el-form-item class="cm-collapse" v-show="fold.showBtn">
                      <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                    </el-form-item>
                <el-form-item label="学期">
                  <el-select v-model="formInline1.termId" @change="getCourseList" clearable>
                    <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="有课的课程"></el-form-item>
                <el-form-item label="年级">
                  <intelligent-year-picker
                    style="width: 100px"
                    v-model="formInline1.grade"
                    type="year"
                    clearable
                    @change="getCourseList('waitGrade')"
                    value-format="yyyy"
                  ></intelligent-year-picker>
                </el-form-item>
                <el-form-item label="专业">
                  <el-select v-model="formInline1.majorId" @change="majorChange('wait')" clearable>
                    <el-option v-for="(list,index) in majorList" :key="index" :label="list.name" :value="list.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="课程">
                  <el-select v-model="formInline1.courseId" 
                  clearable
                  filterable
                  placeholder="请输入关键词"
                  :loading="loading">
                    <el-option v-for="(list,index) in courseList1" :key="index" :label="list.name" :value="list.courseId"></el-option>
                  </el-select>
                </el-form-item>
                 <!-- <el-form-item label="课程">
                  <el-select v-model="formInline1.courseId" @change="getScoreType" clearable>
                    <el-option v-for="(list,index) in courseList" :key="index" :label="list.courseName" :value="list.courseId"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="成绩类型">
                  <el-select v-model="formInline1.scoreTypeId" clearable>
                    <el-option v-for="(list, index) in examTypeList" :key="index" :label="list.name" :value="list.id" ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="补考次数小于">
                  <el-input style="width:70px" v-model="formInline1.bkTimes" clearable></el-input>
                </el-form-item>
                <el-form-item label="学生">
                  <el-input style="width:100px" v-model="formInline1.studentName" clearable></el-input>
                </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
            <div class="btns">
              <el-button type="primary" @click="createlist('makeup')" size="mini">补考安排</el-button>
            </div>
            <div class="cm-table">
              <el-table
                :data="tableData1"
                border
                :height="tableHeight()"
                :row-class-name="tableRowClassName"
                :span-method="objectSpanMethod"
                @selection-change="handleSelectionChange"
                size="mini"
                >
                <el-table-column label="课程" prop="courseName" width="315"></el-table-column>
                <el-table-column label="年级专业" prop="gradeMajor" width="240"></el-table-column>
                <el-table-column label="本次安排补缓的学生" prop="studnetNames" width="580"></el-table-column>
                <el-table-column label="本次不安排的学生" prop="unArr">
                  <template slot-scope="scope">
                    <span>{{scope.row.unArr}}</span>
                    <el-button @click="cellDbc(scope.row, scope.column)" type="text" size="small">...</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="安排学生数" prop="stuQty" width="85"></el-table-column>
                <el-table-column label="选择" type="selection">
                  <!-- <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.choice"></el-checkbox>
                  </template> -->
                </el-table-column>
              </el-table>

              <!-- 本次不安排学生弹窗 -->
              <el-dialog
                title="本次不安排的学生"
                :visible.sync="noPlanDialog"
                :close-on-click-modal="false"
                @close="closePlan"
                :append-to-body="true">
                <div class="noPlanContainer">
                  <div class="noPlanTitle">
                    <span>课程: </span>
                    <span>{{noPlanDialogTitle}}</span>
                  </div>
                  <div class="noPlanTable">
                    <span>学生名单</span>
                    <el-table 
                      :data="noPlanDialogTable"
                      border
                      size="mini">
                      <el-table-column label="学号" prop="student_no" width="120"></el-table-column>
                      <el-table-column label="姓名" prop="student_name" width="120"></el-table-column>
                      <el-table-column label="年级专业" prop="gradeMajor" width="200"></el-table-column>
                      <el-table-column label="安排补考" prop="checked" width="80">
                        <template slot-scope="scope">
                          <el-checkbox size="mini" v-model="scope.row.checked">安排</el-checkbox>
                        </template>
                      </el-table-column>
                      <el-table-column label="备注,可说明不安排的原因" width="390">
                        <template slot-scope="scope">
                          <el-input size="mini" style="width:375px" v-model="scope.row.remark"></el-input>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer" v-if="ifnone">
                  <el-button size="mini" @click="closePlan()">取 消</el-button>
                  <el-button size="mini" type="primary" @click="subPlan()" :disabled="nomine">确 定</el-button>
                </span>
              </el-dialog>
              <!-- 补考安排弹窗 -->
              <el-dialog title="创建补缓考名单" :visible.sync="creatDialog" width="100%" :fullscreen="true" append-to-body :close-on-click-modal="false" @closed="" :show-close="true" class="import-teachers-list">
                <div class="cm-fold">
                  <el-form size="mini" :inline="true" :model="formDetails" ref="formDetails" :rules="rules">

                    <div class="fold">
                      <div>
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
                        <el-form-item label="补考场地" prop="areaId">
                          <el-select v-model="formDetails.areaId" :loading="loading"  filterable remote @change="getcapacity" clearable placeholder="请输入关键字"
                            reserve-keyword 
                            value-key="id"
                            :remote-method="remoteMethod" >
                            <el-option v-for="list in arelist" :key="list.id" :label="list.name" :value="list.id"></el-option>
                          </el-select>
                        </el-form-item>

                        <el-form-item label="容量" prop="capacity">
                          <el-input style="width:60px" v-model="formDetails.capacity" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="考试时间" prop="examinationTime">
                          <!-- <el-date-picker
                            v-model="formDetails.examinationTime"
                            type="datetime"
                            placeholder="选择日期时间">
                          </el-date-picker> -->
                          <el-date-picker :default-time="['08:00:00', '12:00:00']" v-model="formDetails.examinationTime" type="datetimerange" range-separator="至" start-placeholder="考试开始日期" end-placeholder="考试结束日期">
                          </el-date-picker>
                          <!-- <el-date-picker
                                v-model="value4"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker> -->
                        </el-form-item>
                        <el-form-item label="监考老师">
                            <el-select 
                                v-model="addExceptionForm.teachers" 
                                value-key = "id" style="width:300px"
                                placeholder="请选择监考老师" 
                                multiple 
                                clearable 
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="getTeacher">
                                <el-option 
                                    v-for="(item) in teacherList"
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item"> 
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                          <el-input style="width: 300px;" v-model="remarks"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form>
                </div>
                <div class="cm-table">
                  <el-table :data="multipleSelection"  border style="width: 100%; margin-top: 20px" size="mini" highlight-current-row :header-cell-style="getRowClass">
                    <el-table-column type="index" width="50">
                    </el-table-column>

                    <el-table-column prop="grade" label="所在级" width="60">
                    </el-table-column>

                    <el-table-column prop="majorName" label="专业">
                    </el-table-column>

                    <el-table-column prop="courseName" label="课程">
                    </el-table-column>

                    <el-table-column prop="termName" label="考试学期">
                    </el-table-column>

                    <el-table-column prop="studentNo" label="学号" width="100">
                    </el-table-column>

                    <el-table-column prop="studentName" label="姓名">
                    </el-table-column>


                    <el-table-column prop="stageName" label="阶段">
                    </el-table-column>

                    <el-table-column prop="scoreTypeName" label="成绩类型">
                    </el-table-column>

                    <el-table-column prop="score" label="成绩">
                    </el-table-column>

                    <el-table-column prop="resitNum" label="已补考次数">
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deletecont(scope.row,scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <span style="margin-right:20px;" slot="footer" class="dialog-footer" v-if="ifnone">
                  <el-button size="mini" @click="closediaong()">取 消</el-button>
                  <el-button size="mini" type="primary" @click="determine()" :disabled="nomine">确 定</el-button>
                  <!-- <el-button size="mini" type="primary" @click="openprint()">确定并打印</el-button> -->
                </span>
              </el-dialog>
              <el-dialog
                title=""
                :visible.sync="printDialog"
                :fullscreen="true"
                append-to-body
                :close-on-click-modal="false"
                @closed=""
                :show-close="true"
                class="import-teachers-list printtable">
                <div v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                  <!-- <div>
                    请使用A4纸张打印进行打印 
                  </div> -->
                  <div class="btnbox">
                    <el-button size="mini" @click="closeprint()">关闭</el-button>
                    <el-button size="mini" type="primary" @click="printcontent()">确定并打印</el-button>
                  </div>
                </div>
                <div>
                  <p class="printtitle">阶段补考名单</p>
                </div>
                <div>
                  <div class="printcont">
                    <P class="printtitle2">年级专业：</P>
                    <table border="1" width="100%" class="tab2">
                      <tr>
                        <td>学号</td>
                        <td>姓名</td>
                        <td>阶段</td>
                        <td>补考成绩（卷面）</td>
                        <td>学生签字</td>
                      </tr>
                      <tr v-for="(list, index) in multipleSelection" :key="index">
                        <td>{{list.studentNo}}</td>
                        <td>{{list.studentName}}</td>
                        <td>{{list.stageName}}</td>
                        <td>{{list.score}}</td>
                        <td></td>
                      </tr>
                    </table>
                  </div>

                  <div class="printfont">
                    <div>
                      备注：1、以上成绩务必按照年级、专业分页填报、以便存档
                    </div>
                    <div>
                      &#X3000;&#X3000;&#X3000;2、补考后阶段成绩：最高按照60分 （包括补考卷面+平时成绩）
                    </div>
                    <div class="autograph">
                      <div class="autograph1">监考老师签名:</div>
                      <div class="autograph1">补考时间:</div>
                      <div class="autograph1">教研室主任签名:</div>
                    </div>
                  </div>
                </div>
              </el-dialog>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已安排" name="second">
            <div class="cm-fold">
              <el-form :model="formInline2" :inline="true" size="mini">
                <div class="fold">
                  <div>
                    <el-form-item class="cm-collapse">
                      <el-button type="primary" @click="getReadyPlan">查询</el-button>
                       <el-button type="primary" @click="importExcel">导出</el-button>
                    </el-form-item>
                    <a href="" style="display: none;" ref="exportExcel"></a>
                    <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                      <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                    </el-form-item> -->
                    <!-- <el-form-item label="学期">
                      <el-select v-model="formInline2.termId" @change="getCourseList">
                        <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item> -->
                     <el-form-item label="年级">
                      <intelligent-year-picker
                        style="width: 100px;"
                        v-model="formInline2.grade"
                        type="year"
                        clearable
                        @change="getCourseList('grade')"
                        value-format="yyyy"
                      ></intelligent-year-picker>
                    </el-form-item>
                    <el-form-item label="专业">
                      <el-select v-model="formInline2.majorId" clearable @change="majorChange('already')">
                        <el-option v-for="(list,index) in majorList" :key="index" :label="list.name" :value="list.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="课程">
                      <el-select v-model="formInline2.courseId" 
                      clearable
                      filterable
                      placeholder="请输入关键词"
                      :loading="loading">
                        <el-option v-for="(list,index) in courseList1" :key="index" :label="list.name" :value="list.courseId"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="成绩类型">
                      <el-select v-model="formInline2.scoreTypeId" clearable>
                        <el-option v-for="(list, index) in examTypeList" :key="index" :label="list.name" :value="list.id" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="考试日期">
                      <el-date-picker
                        style="width: 130px"
                        clearable
                        v-model="formInline2.startTime"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至">
                      <el-date-picker
                        style="width: 130px"
                        clearable
                        v-model="formInline2.endTime"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="教室">
                      <el-select v-model="formInline2.areaId" clearable>
                        <el-option v-for="(arrangedClassroom, arrangedClassroomIndex) in tableData2" :key="arrangedClassroomIndex" :label="arrangedClassroom.areaName" :value="arrangedClassroom.areaId"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="监考老师">
                      <el-select v-model="formInline2.teacher" clearable>
                        <el-option v-for="(arrangedTeacher, arrangedTeacherIndex) in tableData2" :key="arrangedTeacherIndex" :label="arrangedTeacher.monitorNames" :value="arrangedTeacher.areaId"></el-option>
                      </el-select>
                    </el-form-item> -->
                   <el-form-item label="监考老师">
                      <el-select 
                        v-model="formInline2.teacher" 
                        placeholder="请选择" 
                        clearable 
                        filterable
                        remote
                        :remote-method="getTeacherSingle">
                          <el-option label="全部" value=""></el-option>
                          <el-option 
                            v-for="item in teacherList1" 
                            :key="item.id" 
                            :label="item.name" 
                            :value="item.id"> 
                          </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="学生">
                      <el-input v-model="formInline2.studentName" placeholder="请输入学生名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                      <el-select v-model="formInline1.order">
                        <el-option v-for="(item, orderIndex) in orderLists" :label="item.label" :value="item.value" :key="orderIndex"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="学生">
                      <el-select v-model="formInline2.studentName" clearable>
                        <el-option v-for="(arrangedStudents, arrangedStudentsIndex) in tableData2" :key="arrangedStudentsIndex" :label="arrangedStudents.studnetNames" :value="arrangedStudents.areaId"></el-option>
                      </el-select>
                    </el-form-item> -->
                  </div>
                </div>
              </el-form>
            </div>
            <div class="cm-table" style="margin-top:10px;">
              <el-table
                :data="tableData2"
                :height="tableHeight()"
                :span-method="objectSpanMethod1"
                border
                size="mini"
                >
                <el-table-column prop="courseName" label="课程" width="190"></el-table-column>
                <el-table-column prop="gradeMajor" label="年级专业" width="180"></el-table-column>
                <el-table-column prop="studnetNames" label="学生" width="400"></el-table-column>
                <el-table-column prop="stuQty" label="学生数" width="60"></el-table-column>
                <el-table-column prop="resitTime" label="考试时间">
                  <!-- <template slot-scope="scope">
                    {{`${scope.row.resitDate} 周${scope.row.resitDay} ${scope.row.resitAm} ${scope.row.resitTime}`}}
                  </template> -->
                </el-table-column>
                <el-table-column prop="areaName" label="教室" width="130"></el-table-column>
                <el-table-column prop="monitorNames" label="监考老师" width="150"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.pushStatus == 1 || scope.row.pushStatus == 4"  type="text" @click="deleteReadyPlan(scope.row,scope.$index, 'update')">修改</el-button>
                    <el-button v-if="scope.row.pushStatus == 1 || scope.row.pushStatus == 4"  type="text" @click="deleteReadyPlan(scope.row,scope.$index, 'delete')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </section>  
</template>

<script>
import util from '@/util'
import { locale } from 'moment';
export default {
  name: 'makeup_exam_plan',
  data() {
    return {
      breadcrumb: [
        {
          label: '成绩管理'
        },
        {
          label: '补缓考安排'
        }
      ],
      activeName: 'first',
      orderLists:[
        {label: '按考试时间', value: '1'},
        {label: '按年级', value: '2'},
        {label: '按课程', value: '3'},
      ],
      formInline1: {
        termId: '',
        courseId: '',
        scoreTypeId: '',
        grade: '',
        majorId: '',
        bkTimes: '',
        studentName: '',
        order: ''
      },
      formInline2: {
        termId: '',
        courseId: '',
        scoreTypeId: '',
        grade: '',
        majorId: '',
        startTime: '',
        endTime: '',
        areaId: '',
        teacher: '',
        studentName: '',

      },
      arranged: {},
      isBtn: true,
      role: '',
      resitListId: '',
      fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
      courseList1: [],
      examTypeList: [],
      semesterList: [],
      majorList: [],
      courseList: [],
      tableData1: [],
      tableData2: [],
      teacherList:[],
      teacherList1:[],
      addExceptionForm: {
          teachers: [], //授课教师
          teacher: ''
      },
      remarks: '',
      noPlanDialog: false,
      noPlanDialogTitle: '',
      noPlanDialogTable: [],
      creatDialog: false,
      formDetails: {
        areaId: '', // 考试场地
        capacity: '', //容量
        examinationTime: '', //考试时间
        teacherId: '' // 监考老师
      },
      multipleSelection: [],
      selectExamList: [],
      loading: false,
      tableData2: [],
      printDialog: false,
      ifnone: true,
      arelist: [],
      nomine: false,
      rules: {
        areaId: [
          { required: true, message: '请选择场地', trigger: 'change' }

        ],
        capacity: [
          { required: true, message: '请输入容量', trigger: 'blur' }
        ],
        examinationTime: [
          { required: true, message: '请选考试时间', trigger: 'change' }
        ],
      },
    }
  },
  created() {
    this.getTermData();
    this.getTeacherSingle('')
    // this.getTeacher()
    this.getScoreType()
    // this.getPlan()
    this.getMajor()
    this.getCourseList1('already', 0, 0, 0)
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
  },
  methods: {
    getCourseList1(isAlready,grade, major, term) {
      if(isAlready == 'already') {
        if(this.formInline2.grade == "") {
          grade = 0
          }else{
            grade = grade
          }
          if(this.formInline2.majorId == "") {
            major = 0
          }else{
            major = major
          }
          if(this.formInline2.termId == "") {
            term = 0
          }else{
            term = term
          }
      }else if(isAlready == 'wait') {
        if(this.formInline1.grade == "") {
            grade = 0
          }else{
            grade = grade
          }
          if(this.formInline1.majorId == "") {
            major = 0
          }else{
            major = major
          }
          if(this.formInline1.termId == "") {
            term = 0
          }else{
            term = term
          }
      }
      this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
          if (data.code == 0) {
            this.courseList1 = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    deleteReadyPlan(row, index, val) {
      this.role = val
      this.arranged = JSON.parse(row.stageName)
      this.resitListId = row.resitListId
      let user_id = JSON.parse(localStorage.getItem("vuex")).me.attributes.login_info.id
      if(row.pushStatus == 1 || row.pushStatus == 4) {
         if(val == 'update') {
          this.addExceptionForm.teachers = []
          this.getTeacher(row.monitorNames, (teachers) => {
            row.monitorNames.split(",").filter(item => {
              teachers.map(Element => {
                if(item == Element.name) {
                  this.addExceptionForm.teachers.push(Element)
                }
              })
            })

          });
          this.remoteMethod(row.areaName)
          this.formDetails.areaId = this.arranged.area_id
          this.formDetails.examinationTime = [this.arranged.start_resit_time, this.arranged.end_resit_time]
          this.remarks = this.arranged.remark
          this.$http.get("_sc:/resitList/" + row.resitListId).then(res => {
            this.multipleSelection = res.data
          })
            this.creatDialog = true
          }else if(val == 'delete') {
            let param = {
              id:row.resitListId,
              type:1,
              extend:'',
              user_id: user_id
            }
            this.$confirm(`确定要删除吗?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http.post('_sc:/scoreRecord/pTransCom', param).then(res => {
                if(res.code == 0) {
                  this.tableData2.splice(index,1)
                  this.getReadyPlan()
                }else{
                  this.$message.error(res.msg)
                }
              })
            })
          }
        }else{
          return
        }
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? '收起' : '展开';
    },
    getScoreType(){
      let query = {
        termId: this.formInline1.termId,
        grade: this.formInline1.grade,
        major: this.formInline1.majorId,
        course: this.formInline1.courseId
      }
      this.$http.post("_sc:/scoreSetting/queryImportScoreType", query)
        .then( res => {
          let exam = res.data
          var uniques = [];
          var stringify = {};
          for (var i = 0; i < exam.length; i++) {
              var keys = Object.keys(exam[i]);
              keys.sort(function(a, b) {
                  return (Number(a) - Number(b));
              });
              var str = '';
              for (var j = 0; j < keys.length; j++) {
                  str += JSON.stringify(keys[j]);
                  str += JSON.stringify(exam[i][keys[j]]);
              }
              if (!stringify.hasOwnProperty(str)) {
                  uniques.push(exam[i]);
                  stringify[str] = true;
              }
          }
          uniques = uniques;
          this.examTypeList =  uniques
        })
    },
    tableHeight(){
      return window.innerHeight - 250
    },
    getMajor(isAlready,grade) {
      if(isAlready == 'already') {
         if(this.formInline2.grade == '' || this.formInline2.grade == null) {
              grade = 0
          }else {
              grade = grade
          }
          this.formInline2.majorId = ''
      }else {
        if(this.formInline1.grade == '' || this.formInline1.grade == null) {
              grade = 0
          }else {
              grade = grade
          }
          this.formInline1.majorId = ''
      }
      this.majorList = []
      this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
          this.majorList = res.data
      })
    },
    getCourseList(flag) {
      // 根据查询课程
      let grade, major, term
      if(flag === 'grade') {
        if(this.formInline2.grade == '' || this.formInline2.grade == null) {
          grade = 0
        }else{
          grade = this.formInline2.grade
        }
        if(this.formInline2.majorId == '' || this.formInline2.majorId == null) {
          major = 0
        }else{
          major = this.formInline2.majorId
        }
        if(this.formInline2.termId == '' || this.formInline2.termId == null) {
          term = 0
        }else{
          term = this.formInline2.termId
        }
        this.getCourseList1('already',grade, major, term)
        this.getMajor('already',grade)
      }else if (flag === 'waitGrade') {
        let grade, major, term
        if(this.formInline1.grade == '' || this.formInline1.grade == null) {
          grade = 0
        }else{
          grade = this.formInline1.grade
        }
        if(this.formInline1.majorId == '' || this.formInline1.majorId == null) {
          major = 0
        }else{
          major = this.formInline1.majorId
        }
        if(this.formInline1.termId == '' || this.formInline1.termId == null) {
          term = 0
        }else{
          term = this.formInline1.termId
        }
        this.getCourseList1('wait',grade, major, term)
        this.getMajor('wait',grade)
      }
      this.formInline1.courseId = ''
      this.courseList = [];
      this.formInline1.scoreTypeId = ''
      this.examTypeList = []
      // this.getMajor()
      this.getScoreType()
      // if (
      //   !this.formInline1.grade ||
      //   !this.formInline1.majorId ||
      //   !this.formInline1.termId
      // ) {
      //   return;
      // }
      // this.getScoreType()
      // let param = {
      //   grade: this.formInline1.grade,
      //   majorId: this.formInline1.majorId,
      //   termId: this.formInline1.termId
      // };
      // this.$http
      //   .post("_sc:/courseScoreModel/getCourseByParam", param)
      //   .then(data => {
      //     if (data.code == 0) {
      //       if (data.data && data.data.length) {
      //         this.courseList = data.data;
      //       }
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },
  // 模糊搜索匹配多个老师
  getTeacher(str, callback){
    let self = this
    self.teacherStr = str
    let teacherTemp = []
    if (str == null || str.length <= 0) return;
            
        return self.$http.post("_ed:/exchangecourse/query/teacher",{
          str:str
        }).then(data=>{
                
      var temp = data.data;
      temp.forEach(item => {
        teacherTemp.push({
          id: item.id,
          name: item.name
        })
      })
      if (! self.teachersList)  self.teachersList = [];
      // if (self.addExceptionForm.teachers.length > 0) {
        
      //   self.addExceptionForm.teachers.forEach(x => {
      //     var l = teacherTemp.filter(t => t.id == x.id);
      //     if (l.length <= 0) {
      //       teacherTemp = teacherTemp.concat(x);
      //     }
      //   })
      // }
      self.teacherList=teacherTemp;
      self.loading = false;
      if (callback != null) {
        if (typeof(callback) == 'function') {
          callback(teacherTemp);
        }
      }
            }).catch((res)=>{
                self.$message.error(res.msg);
                self.load_model.close();
            })
      },
    // 选择专业
    majorChange(val) {
      let grade, major, term
      if(val == 'already') {
        grade = this.formInline2.grade
        major = this.formInline2.majorId
        term = this.formInline2.termId
      }else{
        term = this.formInline1.termId
        grade = this.formInline1.grade
        major = this.formInline1.majorId
      }
      this.getCourseList1(val,grade, major, term)
    },
    // 导出ECXCEL
    importExcel() {
      let data = {
        termId: this.formInline2.termId,
        courseId: this.formInline2.courseId,
        scoreTypeId: this.formInline2.scoreTypeId,
        grade: this.formInline2.grade,
        majorId: this.formInline2.majorId,
        startTime: this.editTimestampToTime(this.formInline2.startTime),
        endTime: this.editTimestampToTime(this.formInline2.endTime),
        areaId: this.formInline2.areaId,
        teacher: this.formInline2.teacher,
        studentName: this.formInline2.studentName,
        orderby: this.formInline1.order
      }
      this.$http({
        method:'post',
        url: '_sc:/resitList/exportResult',
        responseType: 'blob',
        data: data
      }).then(data => {
        let url = window.URL.createObjectURL(new Blob([data]));
        let y = this.$refs.exportExcel;
        y.href = url;
        y.setAttribute("download", "已安排.xls");
        y.click();
        window.URL.revokeObjectURL(url);
      }).catch(error => {
          this.$message.error('导出失败')
      })
    },
    getTermData() { //查询学期列表
      let query = "学期"
      this.$http.get('_op:/terms/' + query).then(data => {
        if (data.code == 0) {
          this.semesterList = data.data.reverse();;
            for(let i=0;i<this.semesterList.length;i++){ 
                if(this.semesterList[i].name.indexOf('当前学期')!=-1){
                    this.formInline1.termId=this.semesterList[i].id
                } 
            }
            this.getCourseList()            
            this.getPlan()

        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleSelectionChange(val) {
      this.selectExamList = val
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return row.row
      }
    },
    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return row.row
      }else if (columnIndex === 5) {
        return row.row
      }else if (columnIndex === 6) {
        return row.row
      }
    },
    getPlan() {
      this.$http.post('_sc:/resitList/resitunArrangeList', this.formInline1).then( res => {
        if(res.code == 0) {
          let temp = res.data,
              arr = []
          temp != null && Object.keys(temp).forEach((item,index) => {
            let len = temp[item].length
            temp[item].map( (val,i) => {
              val.unArr = ""
              if(val.unArrangeStudents != '') {
                JSON.parse(val.unArrangeStudents).forEach( v => {
                  val.unArr += v.student_name
                })
              }
              if(i === 0) {
                val.row = {
                  rowspan: len,
                  colspan: 1
                }
              }else {
                val.row = {
                  rowspan: 0,
                  colspan: 0
                }
              }
              arr.push(val)
            })
          })
          // arr.forEach( item => {
          //   if(item.unArrangeStudents != '') {

          //   }
          // })
          this.tableData1 = this.sortBykey(arr,'courseName')
        }else {
          this.$message({
            type: 'error',
            message: res.msg
        });
        }
      })
    },
    // 根据名称排序
    sortBykey(ary, key) {
        return ary.sort(function (a, b) {
            let x = a[key]
            let y = b[key]
            return ((x < y) ? -1 : (x > y) ? 1 : 0)
        })
    },
    handleClick(tab, event) {
      if(tab.name == 'second') {
        this.getReadyPlan()
      }else{
        this.getPlan()
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
    getReadyPlan() {
      let param = {
        termId: this.formInline2.termId,
        courseId: this.formInline2.courseId,
        scoreTypeId: this.formInline2.scoreTypeId,
        grade: this.formInline2.grade,
        majorId: this.formInline2.majorId,
        startTime: this.editTimestampToTime(this.formInline2.startTime),
        endTime: this.editTimestampToTime(this.formInline2.endTime),
        areaId: this.formInline2.areaId,
        teacher: this.formInline2.teacher,
        studentName: this.formInline2.studentName,
        orderby: this.formInline1.order
      }
      this.$http.post('_sc:/resitList/resitArrangeList', param).then( res => {
        if(res.code == 0) {
          let temp = res.data,
              arr = []
          temp != null && Object.keys(temp).forEach((item,index) => {
            let len = temp[item].length
            temp[item].map( (val,i) => {
              if(i === 0) {
                val.row = {
                  rowspan: len,
                  colspan: 1
                }
              }else {
                val.row = {
                  rowspan: 0,
                  colspan: 0
                }
              }
              arr.push(val)
            })
          })
          this.tableData2 = this.sortBykey(arr,'courseName')
        }else {
          this.$message({
            type: 'error',
            message: res.msg
        });
        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex
    },
    closePlan() {
      this.noPlanDialogTable = []
      this.remarks = ""
      this.arelist = []
      this.teacherList = []
      this.addExceptionForm.teachers = []
      this.formDetails.areaId = "" 
      this.formDetails.examinationTime = []
      this.noPlanDialog = false
    },
    subPlan() {
      let arr = []
      let unArr = []
      let unStr = []
      let arrName = []
      let stuNum
      let i = undefined
      this.noPlanDialogTable.forEach( item => {
        i = item.index
        if(item.checked) {
          arr.push(item)
          arrName.push(item.student_name + '\xa0' +  item.remark)
        }else {
          unArr.push(item)
          unStr.push(item.student_name)
        }
      })
      if(arr.length > 0) {
        this.tableData1[i].studnetNames = arrName.join(',')
        this.tableData1[i].stuQty = arrName.length
        this.tableData1[i].arrangeStudents = JSON.stringify(arr)
      }else {
        this.tableData1[i].studnetNames = ''
        this.tableData1[i].stuQty = 0
        this.tableData1[i].arrangeStudents = ''
      }
      if(unArr.length > 0) {
        this.tableData1[i].unArrangeStudents = JSON.stringify(unArr)
      }else {
        this.tableData1[i].unArrangeStudents = ''
        this.tableData1[i].unArr = ''
      }
      unStr.length > 0 ? this.tableData1[i].unArr = unStr.join(',') : ''
      this.noPlanDialog = false
    },
    // 本次不安排的学生  双击事件
    cellDbc(row, column, cell, event) {
      this.noPlanDialogTitle = row.courseName
      if(column['property'] === 'unArr') {
        this.noPlanDialogTable = []
        if(row.arrangeStudents !== '') {
          let temp1 = JSON.parse(row.arrangeStudents)
          temp1.forEach(item => {
            item.checked = true
            item.index = row.index
            item.gradeMajor = row.gradeMajor
            this.noPlanDialogTable.push(item)
          })
        }
        if(row.unArrangeStudents !== '') {
          let temp2 = JSON.parse(row.unArrangeStudents)
          temp2.forEach(item => {
            item.checked = false
            item.index = row.index
            item.gradeMajor = row.gradeMajor
            this.noPlanDialogTable.push(item)
          })
        }
        this.noPlanDialog = true
      }
    },
    createlist(val){ //打开创建的弹框
    this.role = val
      this.formDetails.areaId = '', // 考试场地
      this.formDetails.capacity = '', //容量
      this.formDetails.examinationTime = '', //考试时间
      this.addExceptionForm.teachers = [] // 监考老师
      this.remarks = ''
      
      if(this.selectExamList.length == 0) {
        this.$message.warning('请选择要安排的补考')
        return
      }
      let failScoreIds = []
      this.selectExamList.forEach( item => {
        if(item.arrangeStudents != '') {
          let temp = JSON.parse(item.arrangeStudents)
          temp.forEach( val => {
            let failScoreId = {}
            failScoreId.id = val.fail_score_id
            failScoreId.type = val.resit_delayed_type
            failScoreIds.push(failScoreId)
            failScoreId = null
          })
        }
      })
      this.$http.post("_sc:/resitList/queryResitStudentList", {
        failScoreIds
      }).then( res => {
        if(res.code == 0) {
          this.multipleSelection = res.data
        }else {
          this.$message.error(res.msg)
        }
      })
      this.nomine = false;
      this.creatDialog = true;
      this.formDetails.areaId = null;
    },
    // 监考老师查询 
    getTeacherSingle(str){
        this.teacherList1=[];
        return this.$http.post("_ed:/exchangecourse/query/teacher",{
          str:str
        }).then(data=>{
          if(data.code == 0){
            this.teacherList1=data.data;
          }
        }).catch(()=>{
          
        })
      },
    getcapacity(item){
      if(item) {
        this.arelist.forEach(Element => {
          if(item == Element.data.id) {
            this.formDetails.capacity = Element.data.capacity;
          }
        })
      }else {
        this.formDetails.capacity = null
      }
    },
    remoteMethod(query) {
      let self = this;
      if (query && query.length > 0) {
        self.loading = true;
        self.$http.get('_op:/areas/combox/search/'+query).then( res =>{
            if(res.code == 0){
              self.arelist = res.data;
              self.arelist.forEach(item => {
                if(query) {
                  this.formDetails.capacity = item.data.capacity
                }
              })
              self.loading = false;
            }
        }) 
      } else {
        this.options = [];
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#EFEFEF'
      } else {
        return ''
      }
    },
    deletecont(row,index) {
      console.log(row)
      let user_id = JSON.parse(localStorage.getItem("vuex")).me.attributes.login_info.id
      let param = {
        id:row.id,
        type:2,
        extend:'',
        user_id: user_id
      }
      this.$confirm(`此操作将永久删除该信息信息, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            this.$http.post('_sc:/scoreRecord/pTransCom', param).then(res => {
              if(res.code == 300) {
                this.$message.error(res.msg)
              }else{
                this.multipleSelection.splice(index,1)
              }
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    closediaong() {
      this.creatDialog = false
      // this.$refs.multipleTable2.clearSelection();
      this.$refs.formDetails.resetFields();
    },  
    //确定并打印
    getsubmit(stuats){
      if(this.isBtn == true) {
        let studentList = []
        let monitor_ids = []
        let monitor_names = []
        let message =''
        let param = {}
        let url
        let user_id = JSON.parse(localStorage.getItem("vuex")).me.attributes.login_info.id
        this.isBtn = false
        if(stuats==1){
          message = '保存成功'
        }else{
            message = '保存并打印成功'
        }

        for(let i=0;i<this.multipleSelection.length;i++){
          let obj = {}
          obj.gradeMark = this.multipleSelection[i].gradeMark
          obj.studentName = this.multipleSelection[i].studentName
          obj.studentNo = this.multipleSelection[i].studentNo
          obj.course = this.multipleSelection[i].course
          obj.grade = this.multipleSelection[i].grade
          obj.id = this.multipleSelection[i].id
          obj.major = this.multipleSelection[i].major
          obj.stageName = this.multipleSelection[i].stageName
          obj.termId = this.multipleSelection[i].termId
          obj.resitDelayedType = this.multipleSelection[i].resitDelayedType
          // obj.resitDelayedType = 2
          obj.scoreTypeId = this.multipleSelection[i].scoreTypeId
          studentList.push(obj)
        }
      if(!this.formDetails.areaId){
          this.$message({
              type: 'error',
              message: '请选择场地'
          });
          return ;
      }
        this.addExceptionForm.teachers.forEach(item => {
          monitor_ids.push(item.id)
          monitor_names.push(item.name)
        })
        monitor_names = monitor_names.join(',')
        if(this.role == 'makeup') {
          url = '_sc:/scoreRecord/pTransCom'
          let query = {
              id: -1,
              type: 1000,
              user_id: user_id,
              extend: JSON.stringify({remark: this.remarks, monitorTeachers: this.addExceptionForm.teachers,areaId: this.formDetails.areaId,printStatus: stuats,endResitTime: this.editTimestampToTime(this.formDetails.examinationTime[1]),startResitTime:  this.editTimestampToTime(this.formDetails.examinationTime[0]),studentList:studentList}),
          }
          param = query
          this.$http.post(url,param).then(res=>{
              if(res.code==0){
                  this.$message({
                    type: 'success',
                    message: message
                  });
              this.$refs.formDetails.resetFields();
              self.nomine = true
              this.creatDialog = false
              this.isBtn = true
              this.getPlan()
              }else{
                return this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
          })
      }else{
        url = '_sc:/scoreRecord/pTransCom'
        let query = {
          id:this.resitListId,
          type:1000,
          extend: JSON.stringify({area_id:this.formDetails.areaId,start_resit_time: this.editTimestampToTime(this.formDetails.examinationTime[0]),end_resit_time: this.editTimestampToTime(this.formDetails.examinationTime[1]),monitor_ids:monitor_ids,monitor_names: monitor_names, remark:this.remarks}) ,
          user_id: user_id,
        }
        param = query
        this.$http.post(url,param).then(res=>{
          if(res.code==0){
            this.$message({
                type: 'success',
                message: message
            });
            this.$refs.formDetails.resetFields();
            self.nomine = true
            this.creatDialog = false
            this.isBtn = true
            this.getReadyPlan()
          }else{
            return this.$message({
              type: 'error',
              message: res.msg
            });
          }
        
        })
          
        }
        }else{
          return
        }
    },
    determine() {
      this.$refs.formDetails.validate((valid) => {
        if (valid) {
          if(this.formDetails.examinationTime[0]>this.formDetails.examinationTime[1]){
            this.$message({
              type: 'waring',
              message: '考试时间填写错误'
            });
          }else{
              let stuats = 1
              let self = this
              this.getsubmit(stuats)
          }
        } else {
        
        return false;
        }
      });
    },
    openprint(){//打开打印的弹框
      this.printDialog =  true
      this.getresitList()
    },
    getresitList(){
      let self =this
      let resitListId = 100
      
      self.$http.get('_sc:/resitList/'+resitListId).then(data=>{
        self.tableData2 = data.data
      }).catch(err=>{
        console.log(err)
      })
    },
    closeprint() { //关闭打印的弹框
      this.printDialog = false
    },
    printcontent() {
      let self = this
      if(self.formDetails.areaId==''||self.formDetails.areaId==null){
        self.$message.error('请选择场地')
      }else{
        self.ifnone = false
        setTimeout(() => {
          window.print();
        }, 100)
        this.determine()
        this.closeprint()
      }
      
    },
  }
}
</script>

<style lang="less" scoped>
.cm-tab /deep/  .el-table--border th.gutter:last-of-type { 
    display: table-cell!important; 
    width: 17px!important; 
}
.el-button--text{
  float: right;
}
.cm-tab{
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
  /deep/ .el-tabs__header{
    margin: 0;
  }
  .btns{
    margin: 10px 0 10px 20px;
    box-sizing: border-box;
  }
}
.noPlanContainer{
  font-size: 16px;
  .noPlanTitle{
    padding: 10px 0;
    span:last-child{
      margin-left: 20px;
    }
  }
  .noPlanTable{
    span:first-child{
      margin-bottom: 20px;
    }
  }
}
.dialogheader {
  display: flex;
  position: relative;
  border-bottom: solid 1px #66666636;
  height: 33px;

  .btnbox {
    position: absolute;
    right: 0px;
  }
}
.printtable {
  /deep/.el-dialog__body {
    padding-top: 0px
  }

  .printtitle {
    font-size: 18px;
    font-weight: bold;
    text-align: center
  }

  .printtitle2 {
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
  }

  .printcont {
    width: 90%;
    margin: 0 auto;
    margin-top: 5px;
    min-height: 500px;

  }

  .printfont {
    width: 90%;
    margin: 0 auto;
    margin-top: 5px;
  }

  .autograph1 {
    width: 50%;
  }
}
.tab2 {
  border: solid 1px #66666636;

  td {
    text-align: center;
    height: 40px;
  }

}

</style>