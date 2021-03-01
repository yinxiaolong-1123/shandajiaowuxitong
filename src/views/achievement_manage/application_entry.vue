<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path:item.path }"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="searchForm">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item> -->

            <el-form-item label="学号">
              <el-input style="width:130px;" clearable v-model="searchForm.stuNum" placeholder="请输入学号"></el-input>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input style="width:130px;" clearable v-model="searchForm.stuName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="学期">
              <el-select
                v-model="formYear"
                clearable
                filterable
                remote
                @change="getCourseList"
                :remote-method="getTermData"
                placeholder="请输入学期"
              >
                <el-option
                  v-for="(item,index) in options1"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="年级">
              <intelligent-year-picker
                style="width:130px;"
                v-model="searchForm.grade"
                type="year"
                clearable
                @change="getCourseList('grade')"
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">
              <el-select clearable @change="getCourseList" v-model="searchForm.majorId">
                <el-option
                  v-for="list in majorList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="课程">
              <el-select clearable v-model="searchForm.courseId" filterable placeholder="请选择课程">
                <el-option
                  v-for="(list, listIndex) in courseList"
                  :key="listIndex"
                  :label="list.courseName"
                  :value="list.courseId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="成绩标识">
              <el-select v-model="searchForm.gradeMark" clearable placeholder="请输入成绩标识" style="width: 110px;">
                <el-option
                  v-for="list in statusOption"
                  :key="list.value"
                  :label="list.label"
                  :value="list.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
            <el-button
                type="primary"
                size="mini"
                @click="onSearch(formYear)"
                v-if="btnPerObj.query"
              >查询</el-button>
           </el-form-item>
          </div>
      </el-form>
    </div>

    <div class="cm-btn-con cm-btn-others" style="margin-top:10px;">
      <el-button size="mini" type="primary" @click="batchRelease()" v-if="btnPerObj.input">录入缓考</el-button>
      <el-button size="mini" type="primary" @click="studentsEnter()">多学生批量录入</el-button>
      <el-button size="mini" type="primary" @click="coursesEnter()">多课程批量录入</el-button>
    </div>
    <el-dialog
    title="多课程批量录入"
    :visible.sync="coursesEnterVisible"
    append-to-body
    :before-close="closeCourses">
      <el-form :model="courseEnterData" :rules="courseRules" ref="coursesEnterData" label-position="right" label-width="80px">
        <el-row>
        <el-col :span="12">
            <el-form-item label="学号" prop="studNo">
              <el-input @blur="queryStudentInfo()" v-model="courseEnterData.studNo" type="text" placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="学期" prop="term">
              <el-select
                style="width: 100%"
                v-model="courseEnterData.term"
                clearable
                filterable
                remote
                @change="getCourseLists"
                :remote-method="getTermData"
                placeholder="请输入学期"
              >
                <el-option
                  v-for="(item,index) in options1"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成绩标识" prop="radio">
              <el-radio-group v-model="courseEnterData.radio">
                <el-radio :label="1">封顶60</el-radio>
                <el-radio :label="0">不封顶</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="stuName">
            <el-input disabled v-model="courseEnterData.stuName" type="text"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input disabled style="width:100%;" v-model="courseEnterData.grade"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="majorName">
            <el-input disabled style="width:100%;" v-model="courseEnterData.majorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
        <el-form-item label="备注说明" prop="textarea">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="courseEnterData.textarea">
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="11" style="border: 1px solid #EBEEF5;">
          <div style="margin: 10px;">
            <el-form-item label="课程" prop="course">
              <el-select @change="changeCourse" clearable v-model="courseEnterData.course" filterable placeholder="请选择课程" style="width: 100%">
                <el-option
                  v-for="(list, listIndex) in courseList"
                  :key="listIndex"
                  :label="list.courseName"
                  :value="list.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成绩类型" prop="type">
              <el-select @change="changeCourseType" style="width:100%;" clearable filterable v-model="courseEnterData.type" placeholder="请选择考试类型">
                <el-option
                  v-for="(item, typeIndex) in courseTypeList"
                  :key="typeIndex"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考试时间" prop="dateTime">
            <el-date-picker
              style="width: 100%"
              v-model="courseEnterData.dateTime"
              type="date"
              placeholder="考试日期"
              >
            </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="2">
          <div style="margin-top:60px;margin-left:15px;">
            <el-button @click="addCourseList" size="mini" type="primary">增加<i class="el-icon-d-arrow-right"></i></el-button><br>
            <el-button @click="delSelectionCourse" size="mini" style="margin-top:20px;" type="primary"><i class="el-icon-d-arrow-left"></i>删除</el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="cm-table">
              <el-table
                :data="cousesListRight"
                border
                height="230"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="delHandleSelectionChangeCourse"
              >
                <el-table-column type="selection" width="40" label="全选"></el-table-column>
                <el-table-column prop="courseName.courseName" label="课程"></el-table-column>
                <el-table-column prop="courseTypeName.courseTypeName" label="成绩类型"></el-table-column>
                <el-table-column prop="examTime" label="考试时间"></el-table-column>
              </el-table>
            </div>
        </el-col>
        <el-col>
          <div style="float: right; margin:20px; ">
              <el-button @click="closeCouse('coursesEnterData')" size="mini" type="primary">取消</el-button>
              <el-button @click="sureCourseList('coursesEnterData')" size="mini" type="primary">确定</el-button>
          </div>
        </el-col>
      </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
    title="多学生批量录入"
    :visible.sync="studentsEnterData.visible1"
    append-to-body
    :before-close="closestudents">
    <el-form :model="studentsEnterData" :rules="studentsRules" ref="studentsEnterData" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <intelligent-year-picker
                style="width:100%;"
                v-model="studentsEnterData.grade"
                type="year"
                clearable
                @change="changeGrade('students')"
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="学期" prop="term">
              <el-select
                style="width: 100%"
                v-model="studentsEnterData.term"
                clearable
                filterable
                remote
                @change="getTermList"
                :remote-method="getTermData"
                placeholder="请输入学期"
              >
                <el-option
                  v-for="(item,index) in options1"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程" prop="course">
              <el-select @change="changeCourseList" clearable v-model="studentsEnterData.course" filterable placeholder="请选择课程" style="width: 100%">
                <el-option
                  v-for="(list, listIndex) in courseList"
                  :key="listIndex"
                  :label="list.courseName"
                  :value="list.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
          
        </el-col>
        <el-col :span="12">
          
            <el-form-item label="专业" prop="major">
              <el-select clearable @change="changeMajor('students')" v-model="studentsEnterData.major" style="width: 100%">
                <el-option
                  v-for="list in majorList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成绩标识" prop="sign">
              <el-radio-group v-model="studentsEnterData.radio">
                <el-radio :label="1">封顶60</el-radio>
                <el-radio :label="0">不封顶</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="成绩类型" prop="type">
              <el-select style="width:100%;" clearable filterable v-model="studentsEnterData.type" placeholder="请选择考试类型">
                <el-option
                  v-for="(item, typeIndex) in courseTypeList"
                  :key="typeIndex"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注说明" prop="textarea">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="studentsEnterData.textarea">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班级" prop="class">
            <el-select v-model="studentsEnterData.class" style="width:100%" @change="changeClass">
              <el-option v-for="(item, index) in classList" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考试时间" prop="dateTime">
            <el-date-picker
              style="width: 100%;"
              v-model="studentsEnterData.dateTime"
              type="date"
              placeholder="考试日期"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
            <div class="cm-table">
              <el-table
                :data="studenListLeft"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="addHandleSelectionChange"
              >
                <el-table-column type="selection" width="40" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
        </el-col>
        <el-col :span="2">
          <div style="margin-top:60px;">
            <el-button @click="addSelection" size="mini" type="primary">增加<i class="el-icon-d-arrow-right"></i></el-button><br>
            <el-button @click="delSelection" size="mini" style="margin-top:20px;" type="primary"><i class="el-icon-d-arrow-left"></i>删除</el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="cm-table">
              <el-table
                :data="studenListRight"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="delHandleSelectionChange"
              >
                <!-- <el-table-column type="selection" :selectable="selectable" width="55" label="全选"></el-table-column> -->
                <el-table-column type="selection" width="40" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
        </el-col>
        <el-col>
          <div style="float: right; margin-right: 20px;">
              <el-button @click="closeVisible1('studentsEnterData')" size="mini" type="primary">取消</el-button>
              <el-button @click="sureSubmit('studentsEnterData')" size="mini" type="primary">确定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    </el-dialog>
    <el-dialog
      :title="(dialog.status==='add'?'新增':'编辑') + remark"
      :visible.sync="dialog.visible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="formDialog" ref="formDialog" :rules="rules">
        <el-form-item label="学号" prop="studentNo" :label-width="formLabelWidth">
          <el-input v-model="formDialog.studentNo" style="width:40%;" @blur="getStatusList()"></el-input>
        </el-form-item>

        <el-form-item label="学期" :label-width="formLabelWidth" prop="formYear">
          <el-select
            style="width:40%;"
            v-model="formDialog.formYear"
            filterable
            remote
            :remote-method="getTermData"
            placeholder="请输入学期"
            @change="getCourseData"
          >
            <el-option
              v-for="(item,index)  in options1"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="courseId" :label-width="formLabelWidth">
          <el-select
            style="width:40%;"
            clearable
            v-model="formDialog.courseId"
            filterable
            placeholder="请选择课程"
            @change="getCourseData"
          >
            <el-option
              v-for="list in courseList"
              :key="list.id"
              :label="list.courseName"
              :value="list.courseId"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="成绩类型" prop="scoreTypeId" :label-width="formLabelWidth">
          <el-select style="width:40%;" clearable filterable v-model="formDialog.scoreTypeId" placeholder="请选择考试类型">
            <el-option
              v-for="(item, typeIndex) in scoreTypes"
              :key="typeIndex"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="考试时间" prop="examTime" :label-width="formLabelWidth">
          <el-date-picker
              style="width:40%;"
              v-model="formDialog.examTime"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp"
              placeholder="选择考试时间"> 
          </el-date-picker>
        </el-form-item>


        <el-form-item label="成绩标识" prop="gradeMark" :label-width="formLabelWidth">
          <el-radio-group v-model="formDialog.gradeMark">
            <el-radio :label="1">封顶60</el-radio>
            <el-radio :label="0">不限制</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注说明" prop="remark" :label-width="formLabelWidth" style="width: 48%">
          <el-input v-model="formDialog.remark" type="textarea" maxlength="100" rows="4" cols="50"></el-input>
        </el-form-item>
      </el-form>

      <table class="minTableBox minTable" :data="minTableData">
        <tr>
          <td class="left_title">学号</td>
          <td class="right_text">{{minTableData.stuNum}}</td>
        </tr>
        <tr>
          <td class="left_title">姓名</td>
          <td class="right_text">{{minTableData.name}}</td>
        </tr>
        <tr>
          <td class="left_title">行政班</td>
          <td class="right_text">{{minTableData.administrativeClassName}}</td>
        </tr>
        <tr>
          <td class="left_title">年级</td>
          <td class="right_text">{{minTableData.enrollmentYear}}</td>
        </tr>
        <tr>
          <td class="left_title">专业</td>
          <td class="right_text">{{minTableData.majorName}}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer" style="margin-right: 10px;">
        <el-button @click="closeDialog('formDialog')">取 消</el-button>
        <el-button type="primary" @click="commonValidate('formDialog',formDialog.formYear)">确 定</el-button>
      </span>
    </el-dialog>

    <div class="cm-table">
      <el-table
        size="mini"
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号" fixed width="45"></el-table-column>
        <el-table-column prop="studentNo" label="学号" width="110"></el-table-column>
        <el-table-column prop="studentName" label="姓名" width="100"></el-table-column>
        <el-table-column prop="administrativeClassName" label="行政班" width="190"></el-table-column>
        <el-table-column prop="grade" label="年级" width="60"></el-table-column>
        <el-table-column prop="majorName" label="专业"  width="150"></el-table-column>
        <el-table-column prop="termName" label="缓考学期" width="160"></el-table-column>
        <el-table-column prop="courseName" label="课程" width="170"></el-table-column>
        <el-table-column prop="courseType" label="成绩类型" width="120"></el-table-column>
        <el-table-column prop="gradeMark" label="成绩标识" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.gradeMark=='0'">不限制</span>
            <span v-if="scope.row.gradeMark=='1'">封顶60</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注说明"></el-table-column>
        <!-- <el-table-column prop="createUser" label="创建人"></el-table-column> -->
        <el-table-column prop="createTime" label="创建日期" width="100"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          v-if="btnPerObj.edit||btnPerObj.delete"
        >
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="onIssue(scope.row)" v-if="btnPerObj.edit">编辑</el-button> -->
            <el-button type="text" size="small" @click="onIssue(scope.row)" v-if="scope.row.resitListId == null">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteTabletRow(scope.row)"
              v-if="scope.row.resitListId == null"
            >删除</el-button>
            <!-- <el-button
              type="text"
              size="small"
              @click="deleteTabletRow(scope.row)"
              v-if="btnPerObj.delete"
            >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cm-pagination">
      <el-pagination
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </section>
</template>

<script>
import util from "@/util";
const regNum = /^[\d\/]+$/; //匹配数字跟斜杠

import { mapState } from "vuex";
const REMARK = "缓考申请";
export default {
  data() {
    var validateTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      }
      if (!regNum.test(value)) {
        callback(new Error("请输入9位以内整数"));
        return;
      }
    };
    return {
      scoreTypes: [],
      formYear: "",
      semesterNum: "",
      remark: REMARK,
      statusOption: [
        //成绩标识
        { label: "封顶60", value: 1 },
        { label: "不限制", value: 0 }
      ],
      breadcrumb: [{ label: "成绩管理" }, { label: "缓考申请录入" }],
      formDialog: {
        addYear: "",
        courseId: "", //课程ID
        gradeMark: 0, //成绩标识
        remark: "", //备注
        formYear: "", //学期
        studentNo: "", //学号
        newSemeterData: "",
        scoreTypeId: "",
        examTime: "",
      },
      formLabelWidth: "100px",
      rules: {
        studentNo: [{ required: true, message: "请输入学号", trigger: "blur" }],
        formYear: [{ required: true, message: "请选择学期", trigger: "blur" }],
        scoreTypeId: [{ required: true, message: "请选择考试类型", trigger: "blur" }],
      
        courseId: [
          { required: true, message: "请选择课程", trigger: "change" }
        ],
        gradeMark: [
          { required: true, message: "请选择成绩标识", trigger: "change" }
        ]
      },
      formInline: {
        major: ""
      },
      courseTypeList: [],
      dialog: {
        status: "edit",
        editvisible: false,
        visible: false,
        detailvisible: false,
        gradeVisible: false,
        classVisible: false
      },
      coursesEnterVisible: false,
      studentsEnterData: {
        visible1: false,
        grade: '',
        term: '',
        course: '',
        radio: 0,
        textarea: '',
        major: '',
        type: '',
        dateTime: '',
        class: '',
      },
      courseEnterData: {
        grade: '',
        term: '',
        course: '',
        radio: 0,
        textarea: '',
        major: '',
        majorName: '',
        type: '',
        dateTime: '',
        class: '',
        studNo: '',
        stuName: '',
      },
      courseRules: {
        course: [{ required: true, message: '请选择课程', trigger: 'change' }],
        type: [{ required: true, message: '请选择成绩类型', trigger: 'change' }],
        studNo: [{ required: true, message: '请选择成绩类型', trigger: 'change' }],
        term: [{ required: true, message: '请选择成绩类型', trigger: 'change' }],
      },
      studentsRules: {
        grade: [{required: true, message: '请选择年级', trigger: 'change' }],
        term: [{required: true, message: '请选择学期', trigger: 'change' }],
        course: [{required: true, message: '请选择课程', trigger: 'change' }],
        major: [{required: true, message: '请选择专业', trigger: 'change' }],
        type: [{required: true, message: '请选择类型', trigger: 'change' }],
        class: [{required: true, message: '请选择班级', trigger: 'change' }],
      },
      courseTypeObj: {},
      courseObj: {},
      studenListLeft: [],
      studenListRight: [],
      classList: [],
      cousesListRight: [],
      delCousesListRight: [],
      multipleSelection: [],
      deltipleSelection: [],
      courseinfo: [],
      //搜索
      searchForm: {
        courseId: "", //课程id
        grade: "", ////所在级
        gradeMark: "", //成绩标识
        majorId: "", //专业id
        stuName: "", //姓名
        stuNum: "" //学号
      },
      classData: [],
      tableData: [],
      addtableData: [],
      gradetableData: [],
      editTableData: [],
      onTouchData: [],
      gridData: [],

      formYear: "",
      onKeyYear: "",
      options1: [],
      majorList: [], //专业
      courseList: [], //课程
      courseList1: [], //课程
      myDate: new Date(),
      tableLoading: false,
      pageNo: 1,
      pageSize: 50,
      totalCount: 0,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      minTableData: [], //学生信息数据
      newRecords: "", //
      btnPerObj: {
        edit: false,
        delete: false,
        query: false,
        input: false
      }
    };
  },
  created() {
    this.getCourseTypeList()
    this.getTermData(); //学期列表
    this.getMajor()
    this.getCourseList1(0,0,0); //课程下拉列表
    // this.getBtnPermit()//按钮权限
    //   this.getFailedGradeData(); //列表获取
    util.openBtnPermit(this.btnPerObj);
  },
  computed: {
    ...mapState(["btnPermitList"])
  },
  watch: {
    'formDialog.studentNo'() {
      if(this.formDialog.studentNo.length > 8) {
        this.getscoreType()
      }else{
        return
      }
    }
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
  },
  filters: {},
  methods: {
    getCourseList1(grade, major_id, term_id) {
        if(grade == "" || grade == null) {
          grade = 0
        }else{
          grade = grade
        }
        if(major_id == "" || major_id == null) {
          major_id = 0
        }else{
          major_id = major_id
        }
        if(term_id == "" || term_id == null) {
          term_id = 0
        }else{
          term_id = term_id
        }
        let vuex = JSON.parse(localStorage.getItem('vuex'));
        this.$http.post("_sc:/modified/courseaffirm/pQueryCom",{
          id: 0,
          type:"couse_from_score_model",
          extend:JSON.stringify({teacher_id:vuex.me.attributes.login_info.id,roles:vuex.me.roles.map(item=>item.id).join(),term_id:term_id,grade:grade,major_id:major_id}),
          user_id: vuex.me.attributes.login_info.id,
        }).then(data => {
            if (data.code == 0) {
              this.courseList = JSON.parse(data.data);
            } else {
              this.$message.error(data.msg);
            }
          });
    },
    getMajor() {
        let grade
        if(this.searchForm.grade == '' || this.searchForm.grade == null) {
            grade = 0
        }else {
            grade = this.searchForm.grade
        }
        this.searchForm.majorId = ''
        this.majorList = []
        this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
            this.majorList = res.data
        })
    },
    getTermList() {
      this.getCourseList1(this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
      this.getCourseTypeList(this.studentsEnterData.course, this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
    },
    changeGrade(flag) {
      let grade, major
      if(flag == 'course') {
        grade = this.courseEnterData.grade
        major = this.courseEnterData.major
      }else{
        grade = this.studentsEnterData.grade
        major = this.studentsEnterData.major
      }
      this.studentsEnterData.class = ""
      this.getMajor()
      this.getClassList(grade, major)
      this.getCourseList1(this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
      this.getCourseTypeList(this.studentsEnterData.course, this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
    },
    changeCourseList() {
      this.getCourseList1(this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
      this.getCourseTypeList(this.studentsEnterData.course, this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
    },
    changeMajor(flag) {
      let grade, major
      if(flag == 'course') {
        this.courseEnterData.course = ""
        grade = this.courseEnterData.grade
        major = this.courseEnterData.major
      }else{
        this.studentsEnterData.course = ""
        grade = this.studentsEnterData.grade
        major = this.studentsEnterData.major
      }
      this.studentsEnterData.class = ""
      this.getClassList(grade, major)
      this.getCourseList1(this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
      this.getCourseTypeList(this.studentsEnterData.course, this.studentsEnterData.grade, this.studentsEnterData.major, this.studentsEnterData.term)
    },
    changeClass(item) {
      this.$http.get(`_op:/students/list/${item}/1/100`).then(res => {
        if(res.code == 0) {
          res.data.records.forEach(item => {
            this.studenListLeft.push(item)
          })
        }else{
          this.$message.error(res.msg)
        }
        
      })
    },
    queryStudentInfo(){  //根据学号查询学生信息
        let self = this;
        self.$http.get('_op:/students/getByStuNum/'+ self.courseEnterData.studNo).then(res=>{
            if(res.code == 0){
                if(res.data==null){
                    self.courseEnterData.stuName = '';
                    self.courseEnterData.grade = '';
                    self.courseEnterData.major =  '';
                }else{
                    self.courseEnterData.stuName = res.data.name;
                    self.courseEnterData.grade = res.data.grade.toString();
                    self.courseEnterData.majorName = res.data.majorName;
                    self.courseEnterData.major =res.data.majorId;
                }
                
            }
            
        }).catch(err=>{
          
        }) 
    },
    // 增加>>
    addSelection() {
      this.studenListRight = []
      this.studenListRight = this.multipleSelection
    },
    // <<删除
    delSelection() {
      for (var i = 0; i < this.deltipleSelection.length; i++) {
        this.removeAaary(this.studenListRight, this.deltipleSelection[i]);
      }
    },
    delSelectionCourse() {
      for (var i = 0; i < this.delCousesListRight.length; i++) {
        this.removeAaary(this.cousesListRight, this.delCousesListRight[i]);
      }
    },
    removeAaary(arr, obj) {
      var length = arr.length;
      for (var i = 0; i < length; i++) {
        if (arr[i] == obj) {
          if (i == 0) {
            arr.shift(); //删除并返回数组的第一个元素
            return arr;
          } else if (i == length - 1) {
            arr.pop(); //删除并返回数组的最后一个元素
            return arr;
          } else {
            arr.splice(i, 1); //删除下标为i的元素
            return arr;
          }
        }
      }
    },
    // 增加多选
    addHandleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除多选
    delHandleSelectionChange(val) {
      this.deltipleSelection = val;
    },
    delHandleSelectionChangeCourse(val) {
      this.delCousesListRight = val
    },
    // 取消
    closeVisible1(studentsEnterData) {
      this.studentsEnterData.visible1 = false
      this.$refs[studentsEnterData].resetFields();
    },
    closeCouse(coursesEnterData) {
      this.coursesEnterVisible = false
      this.$refs[coursesEnterData].resetFields();
    },
    closeCourses() {
      this.coursesEnterVisible = false
      this.$refs['coursesEnterData'].resetFields()
    },
    closestudents() {
      this.studentsEnterData.visible1 = false
      this.$refs["studentsEnterData"].resetFields();
    },
    formatDate(now) { //时间转换
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = now.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = now.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = now.getMinutes();
      var second = now.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d;
      // return y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second;

    },
    // 增加课程
    addCourseList() {
      let courseName,courseTypeName,courseTime,courseId,courseTypeId
      this.courseList.forEach(item => {
        if(this.courseEnterData.course == item.courseId) {
          courseName = item.courseName
          courseId = item.courseId
        }
      })
      this.courseTypeList.forEach(item => {
        if(this.courseEnterData.type == item.id) {
          courseTypeName = item.name
          courseTypeId = item.id
        }
      })
      courseTime = this.courseEnterData.dateTime
      if(this.courseEnterData.course == "" || this.courseEnterData.course == null) {
        return this.$message.error('请选择课程')
      }
      if(this.courseEnterData.type == "" || this.courseEnterData.type == null) {
        return this.$message.error('请选择成绩类型')
      }
      if(this.cousesListRight.length == 0) {
        this.cousesListRight.unshift({
          courseName: {courseName: courseName, courseId : courseId},
          courseTypeName: {courseTypeName: courseTypeName, courseTypeId : courseTypeId},
          examTime: this.courseEnterData.dateTime !== "" && this.courseEnterData.dateTime !== null ? this.formatDate(courseTime) : ""
        })
      }else{
        let str
        this.cousesListRight.forEach(item => {
          if(this.courseEnterData.course == item.courseName.courseId && this.courseEnterData.type == item.courseTypeName.courseTypeId) {
            str = '请勿重复选择'
            return this.$message.error('请勿重复选择')
          }
        })
        if(str == '请勿重复选择') {
          return
        }else{
          this.cousesListRight.unshift({
            courseName: {courseName: courseName, courseId : courseId},
            courseTypeName: {courseTypeName: courseTypeName, courseTypeId : courseTypeId},
            examTime: this.courseEnterData.dateTime !== "" && this.courseEnterData.dateTime !== null ? this.formatDate(courseTime) : ""
          })
        }
        
      }
      
      
    },
    // 改变课程
    changeCourse(val) {
      this.getCourseTypeList(this.courseEnterData.course, this.courseEnterData.grade, this.courseEnterData.major, this.courseEnterData.term)
    },
    // 改变成绩类型
    changeCourseType(val) {
      this.courseTypeList.forEach(item => {
        if(val == item.id) {
          this.courseTypeObj = item
        }
      })
    },
    // 确认
    sureCourseList(coursesEnterData) {
      let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
      this.$refs[coursesEnterData].validate((valid) => {
        if (valid) {
          if(this.cousesListRight.length == 0) {
              return this.$message({
                type: 'warning',
                message: '请添加课程'
              })
            }
            this.courseinfo = []
            this.cousesListRight.forEach(item => {
              this.courseinfo.push({
                courseId : item.courseName.courseId,
                scoreTypeId : item.courseTypeName.courseTypeId,
                examTime : item.examTime
              })
            })
          this.$http.post('_sc:/scoreRecord/pTransCom',{
            id:0,
            type:1001,
            extend: JSON.stringify({grade:this.courseEnterData.grade, major:this.courseEnterData.major,gradeMark: this.courseEnterData.radio,remark: this.courseEnterData.textarea,courseinfo:this.courseinfo,studentinfo: [{studentNo: this.courseEnterData.studNo, studentName: this.courseEnterData.stuName}],termId: this.courseEnterData.term}),
            user_id:user_id
          }).then(res => {
            if(res.code == 0) {
              this.$message({
                type: 'success',
                message: '录入成功'
              })
              this.closeCourses()
              this.getFailedGradeData()
            }else{
              return this.$message.error(res.msg)
            }
          })
        } else {
          return false;
        }
      });
    },
    sureSubmit(studentsEnterData) {
      this.$refs[studentsEnterData].validate((valid) => {
        if (valid) {
          let studentinfo = []
          if(this.studenListRight.length == 0) {
            return this.$message({
              type: 'warning',
              message: '请选择添加要录入的学生'
            })
          }
          this.studenListRight.forEach(item => {
            studentinfo.push({
              studentNo: item.stuNum,
              studentName: item.name
            })
          })
          let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
          this.$http.post('_sc:/scoreRecord/pTransCom', {
            id:0,
            type:1001,
            extend: JSON.stringify({grade:this.studentsEnterData.grade, major:this.studentsEnterData.major,gradeMark: this.studentsEnterData.radio,remark: this.studentsEnterData.textarea,courseinfo:[{courseId: this.studentsEnterData.course,scoreTypeId: this.studentsEnterData.type,examTime: this.studentsEnterData.dateTime}],studentinfo: studentinfo,termId: this.studentsEnterData.term}),
            user_id:user_id
          }).then(res => {
            if(res.code == 0) {
              this.$message({
                type: 'success',
                message: '录入成功'
              })
              this.closestudents()
              this.getFailedGradeData()
            }else{
              return this.$message.error(res.msg)
            }
          })
        }else{
          return false;
        }
      })
      
    },
    getCourseLists() {
      this.courseEnterData.course = ''
      this.getCourseList1(this.courseEnterData.grade, this.courseEnterData.major, this.courseEnterData.term)
      this.getCourseTypeList(this.courseEnterData.course, this.courseEnterData.grade, this.courseEnterData.major, this.courseEnterData.term)
    },
    getCourseList(flag) {
      // 根据查询课程
      if(flag === 'grade') {
          this.getMajor()
      }
      this.searchForm.courseId = ''
      this.courseList = [];
      // this.getCourseList1(this.searchForm.grade, this.searchForm.majorId, this.formYear)
      this.getCourseList1(this.studentsEnter.grade, this.studentsEnter.major, this.studentsEnter.term)
      this.getCourseTypeList(this.studentsEnter.course, this.studentsEnter.grade, this.studentsEnter.major, this.studentsEnter.term)
      // if (
      //   !this.searchForm.grade ||
      //   !this.searchForm.majorId ||
      //   !this.formYear
      // ) {
      //   return;
      // }
      // let param = {
      //   grade: this.searchForm.grade,
      //   majorId: this.searchForm.majorId,
      //   termId: this.formYear
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
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "edit_delayedExamApply") {
              self.btnPerObj.edit = true;
            }
            if (item.code == "query_delayedExamApply") {
              self.btnPerObj.query = true;
            }
            if (item.code == "input_slow_examination_delayedExamApply") {
              self.btnPerObj.input = true;
            }
            if (item.code == "del_delayedExamApply") {
              self.btnPerObj.delete = true;
            }
          });
        })
        .catch(() => {});
    },
    // 输入学号获取信息
    // getStatusList(){
    //     if (this.formDialog.studentNo==null||this.formDialog.studentNo==""){
    //         return;
    //     }
    //     this.$http.post("_op:/students/list",{
    //         pageNo: 1,
    //         pageSize: 10,
    //         param:{
    //             administrativeClassId: null,
    //             cardNum: "",
    //             enrollmentYear: null,
    //             majorId: null,
    //             name: "",
    //             stuNum:String(this.formDialog.studentNo)
    //         }
    //         }).then(res=>{
    //             if(res.data.records.length<1){
    //                this.newRecords=res.data.records;
    //                this.$message.error('学号不存在,请重新输入');
    //                return ;
    //             }
    //             this.minTableData=res.data.records;
    //         })
    // },
    // 输入学号获取信息
    getStatusList() {
      if (
        this.formDialog.studentNo == null ||
        this.formDialog.studentNo == ""
      ) {
        return;
      }
      let params = this.formDialog.studentNo;
   
      this.$http.get("_op:/students/info/" + params).then(res => {
     
        if (res.data == null) {
          this.formDialog.studentNo == "";
          this.$message.error("学号不存在,请重新输入");
        } else {
          this.minTableData = res.data;
          this.formDialog.studentNo = res.data.stuNum
        }
      });
    },
    // 获取多学生批量录入班级
    getClassList(grade, major) {
      this.$http.get('_op:/administrative/class/list/' + grade + '/' + major).then(res => {
        if(res.code == 0) {
          this.classList = res.data
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    // 获取学期列表默认当前学期数据
    getTermData(query) {
      if (!query) {
        query = "学期";
      }
      let self = this;
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
          // for (let i = 0; i < data.data.length; i++) {
          //   let a = data.data[i].name;
          //   if (a.indexOf("当前学期") != -1) {
              
          //   }
          // }
          self.options1 = data.data.reverse();
               for(let i=0;i<this.options1.length;i++){   
                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                        this.formYear=this.options1[i].id
                        this.addForm = this.options1[i].name;
                        this.semesterNum = this.options1[i].orderNum;
                        this.fallYear =this.options1[i].year;
                    }                       
                 } 
          this.getFailedGradeData(); //请求列表
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  
    getFailedGradeData() {
      let query = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        param: {
          courseId: this.searchForm.courseId, //行政班
          grade: this.searchForm.grade, //所在级
          gradeMark: this.searchForm.gradeMark, //成绩标识
          majorId: this.searchForm.majorId, //专业id
          termId: this.formYear,
          stuName: this.searchForm.stuName, //姓名
          stuNum: this.searchForm.stuNum ////学号
        }
      };
      this.tableLoading = true;
      this.$http
        .post("_sc:/delayedExamApply/list", query)
        .then(data => {
          this.tableLoading = false;
          let courseType = data.data.result
          if(courseType == null) {
            return this.tableData = courseType;
          }else{
            courseType.forEach(item => {
              this.courseTypeList.forEach(Element => {
                if(item.scoreTypeId == Element.id) {
                  item["courseType"] = Element.name
                }
              })
            });
            this.tableData = courseType;
            this.totalCount = data.data.totalCount;
          }
        })
        .catch(() => {
          this.tableLoading = true;
        });
    },
    // 获取成绩类型
    getCourseTypeList(course, grade, major, term) {
      this.$http.post("_sc:/scoreSetting/queryImportScoreType",{
        course: course,
        grade: grade,
        major: major,
        termId: term
      }).then(res => {
        if(res.code == 0) {
          let exam = res.data
          this.courseTypeList = this.cancelDuplicate(exam);
        }
      })
    },
    //多课程批量录入
    coursesEnter() {
      this.cousesListRight = []
      this.coursesEnterVisible = true

    },
    // 多学生批量录入
    studentsEnter() {
      this.classList = []
      this.studenListLeft = []
      this.studenListRight = []
      this.studentsEnterData.visible1 = true
    },
    //  录入缓考  新增
    batchRelease() {
      this.dialog.status = "add";
      this.formDialog.courseId = ""
      this.getscoreType();
      this.getCourseList1(this.searchForm.grade, this.searchForm.majorId, this.formYear)
      this.dialog.visible = true;
      this.formDialog.gradeMark = 0;
      this.formDialog.remark = "";
      this.formDialog.studentNo = "";
      this.formDialog.newSemeterData = "";
      this.formDialog.scoreTypeId = ""
      this.formDialog.formYear = ""
      this.minTableData = [];
      this.minTableData = {}
    },
    // 编辑
    onIssue(row) {
      this.getCourseList1(this.searchForm.grade, this.searchForm.majorId, this.formYear)
      this.formDialog.courseId = row.courseId
      this.dialog.status = "edit";
      this.dialog.visible = true;
      this.formDialog.studentNo = row.studentNo;
      this.formDialog.termName = row.termName;
      this.formDialog.courseName = row.courseName;
      this.formDialog.remark = row.remark;
      this.formDialog.gradeMark = row.gradeMark;
      this.formDialog.courseId = row.courseId;
      this.formDialog.id = row.id;
      this.formDialog.formYear = row.termId;
      this.formDialog.examTime = row.examTime;
      let scoreTypeStr = JSON.stringify(this.scoreTypes)
      if(scoreTypeStr.indexOf(row.scoreTypeId) != -1) {
        this.formDialog.scoreTypeId = row.scoreTypeId
      }else{
        this.formDialog.scoreTypeId = ""
      }
      
      
      // this.formDialog.newSemeterData=row.semesterYear+'-'+row.semesterYearNumber
      // this.dialog.status='edit';
      // this.dialog.visible=true;
      this.getStatusList();
    },
    getCourseData(item) {
      this.getCourseList1(this.searchForm.grade, this.searchForm.majorId, this.formDialog.formYear)
      this.getscoreType()
    },
    // 课程下拉列表
    // getCourseList2() {
    //   let vuex = JSON.parse(localStorage.getItem('vuex'));
    //     this.$http.post("_sc:/modified/courseaffirm/pQueryCom",{
    //       id: 0,
    //       type:"couse_from_score_model",
    //       extend:JSON.stringify({teacher_id:vuex.me.attributes.login_info.id,roles:vuex.me.roles.map(item=>item.id).join(),term_id:this.formDialog.formYear,grade:this.minTableData.enrollmentYear,major_id:this.minTableData.majorId}),
    //       userId: vuex.me.attributes.login_info.id,
    //     }).then(data => {
    //       if (data.code == 0) {
    //         if (data.data && data.data.length) {
    //           let course = JSON.parse(data.data) 
    //           this.courseList1 = this.cancelDuplicate(course);
    //         }
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //       });
    // },
    // 取消
    closeDialog(formDialog) {
      this.dialog.visible = false
      this.$refs[formDialog].resetFields()
    },
    // 新增提交
    commonValidate(formDialog, val) {
      this.$refs.formDialog.validate(valid => {
        if (valid) {
          this.commonRequire(formDialog, val);
        } else {
          return false;
        }
      });
    },
    // 新增提交
    commonRequire(formDialog, val) {
      let url = "_sc:/delayedExamApply";
      if (this.dialog.status == "add") {
        //   let newDialogNum=this.formDialog.newSemeterData.split("-");
        let params = {
          courseId: this.formDialog.courseId,
          gradeMark: this.formDialog.gradeMark,
          studentNo: this.formDialog.studentNo,
          remark: this.formDialog.remark,
          termId: this.formDialog.formYear,
          scoreTypeId: this.formDialog.scoreTypeId,
          examTime: this.formDialog.examTime
        };

        this.$http
          .post("_sc:/delayedExamApply", params)
          .then(res => {
            if (res.code == 0) {
              this.$message({
                message: "录入缓考成功",
                type: "success"
              });
            } else {
              this.$message.error(res.msg);
              return;
            }

            this.getFailedGradeData(); //列表获取
            this.dialog.visible = false;
          })
          .catch(() => {});
      }
      if (this.dialog.status == "edit") {
        let newDialogNum = this.formDialog.newSemeterData.split("-");
        let params = {
          courseId: this.formDialog.courseId,
          gradeMark: this.formDialog.gradeMark,
          studentNo: this.formDialog.studentNo,
          remark: this.formDialog.remark,
          termId: this.formDialog.formYear,
          termName: this.formDialog.termName,
          courseName: this.formDialog.courseName,
          id: this.formDialog.id,
          scoreTypeId: this.formDialog.scoreTypeId,
          examTime: this.formDialog.examTime
        };
        this.$http
          .put("_sc:/delayedExamApply", params)
          .then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.dialog.visible = false;
              this.getFailedGradeData(); //列表获取
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
      }
    },
    // 删除
    deleteTabletRow(row) {
      this.$confirm(
        `此操作将永久删除 “${row.studentName}” 所维护的信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .delete("_sc:/delayedExamApply/delete/" + row.id)
            .then(data => {
              let type = "success";
              let message = "删除成功！";
              if (data.code === 0) {
                //   this.getTableData();
              } else {
                type = "error";
                message = data.msg;
              }
              this.$message({
                type: type,
                message: message
              });
              this.onSearch();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示条数
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getFailedGradeData();//刷新列表
    },
    // 翻页
    currentChange(current) {
      this.pageNo = current;
      this.getFailedGradeData();//刷新列表
    },
    // 展开收起
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    // 查询
    onSearch() {
      this.pageNo = 1
      this.pageSize = 50
      this.getFailedGradeData(); //刷新列表
    },
    //专业下拉列表
    // getMajorList() {
    //   this.$http.get("_op:/major/combox").then(data => {
    //     if (data.code == 0) {
    //       this.majorList = data.data;
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   });
    // },
    // 去重复函数
    cancelDuplicate(arr) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < arr.length; i++) {
          var keys = Object.keys(arr[i]);
          keys.sort(function(a, b) {
              return (Number(a) - Number(b));
          });
          var str = '';
          for (var j = 0; j < keys.length; j++) {
              str += JSON.stringify(keys[j]);
              str += JSON.stringify(arr[i][keys[j]]);
          }
          if (!stringify.hasOwnProperty(str)) {
              uniques.push(arr[i]);
              stringify[str] = true;
          }
      }
      return uniques = uniques;
    },
    getscoreType() {
      let url = "_sc:/scoreSetting/queryImportScoreType";
      this.$http.post(url, {
        course: this.formDialog.courseId,
        grade: this.minTableData.enrollmentYear,
        major: this.minTableData.majorId,
        termId: this.formDialog.formYear
      }).then(data => {
        if (data.code == 0) {
          let exam = data.data
          this.scoreTypes = this.cancelDuplicate(exam);
        }
      });
    }
    //学期下拉列表
    // getTermData(query){
    //     if(!query){
    //         query = "学期";
    //     }
    //     this.$http.get('_op:/terms/'+query)
    //     .then(data=>{
    //         if(data.code==0){
    //             this.options1 = data.data;
    //         }else{
    //             this.$message.error(data.msg);
    //         }
    //     })
    // }
    // 学期数据下拉获取
  }
};
</script>
<style scoped>
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.cm-btn-con{
  padding: 0 20px 10px 20px;
}
.cm-addGrade p {
  margin-bottom: 12px;
}
.minTableBox {
  position: relative;
}
.minTable {
  position: absolute;
  top: 83px;
  right: 80px;
}
.minTable td {
  border: 1px solid #ebeef5;
  width: 100px;
  height: 40px;
  padding: 0 10px;
}
.minTableBox .left_title {
  /* background-color:#f7f7f7; */
  color: #606266;
  width: 100px;
  text-align: right;
  border: none;
}
.minTableBox .right_text {
  width: 180px;
}

.cm-el-dialog .cm-dialog-small-small {
  min-width: 1200px;
}
table{
  text-align: center;
}
</style>
