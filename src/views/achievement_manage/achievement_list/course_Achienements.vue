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
    <div class="cm-fold" style="margin-bottom:10px;">
      <el-form :inline="true" size="mini" :model="searchForm">
            <el-form-item  label="学期">
              <el-select 
                  v-model="searchForm.termId"
                  clearable
                  filterable
                  @change="getCourseList()"
                  placeholder="请选择学期">
                  <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

             <el-form-item label="所在级">
              <intelligent-year-picker
                style="width: 100%;"
                v-model="searchForm.grade"
                type="year"
                clearable
                @change="getCourseList('grade')"
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">
              <el-select  clearable v-model="searchForm.major" @change="getCourseList()">
                <el-option label="全部" :value="0"></el-option>
                <el-option
                  v-for="list in majorList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="课程">
              <el-select clearable v-model="searchForm.course" filterable placeholder="请选择课程">
                <el-option
                  v-for="(list, ListIndex) in courseList"
                  :key="ListIndex"
                  :label="list.name"
                  :value="list.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item label="行政班">
               <!-- multiple -->
              <el-select
                
                clearable
                v-model="searchForm.administrativeClassId"
                filterable
                placeholder="全部"
              >
                <el-option label="全部" :value="0"></el-option>
                <el-option
                  v-for="list in administrativeList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学号/姓名">
              <el-input
                clearable
                v-model="searchForm.studentName"
                maxlength="40"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item> 

            <el-form-item  label="类型">
              <el-select 
                  v-model="searchForm.type"
                  clearable
                  placeholder="">
                  <el-option label="所有" value=""></el-option>
                  <el-option label="曾补考的" value="1"></el-option>
                  <el-option label="仍未及格的" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item  label="课程属性">
              <el-select 
                  v-model="searchForm.natureId"
                  clearable
                  filterable
                  placeholder="">
                  <el-option v-for="item in natureList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
            </el-form-item>    
          
      </el-form>
      
    </div>
    <div class="cm-table" >
      <!-- <el-button type="primary" size="mini"  style="margin-bottom:10px;" @click="opne_dalong">打印学生成绩单</el-button> -->

      <ElBigdataTable
        size="mini"
        ref="multipleTable"
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
        <el-table-column prop="studentNo" label="学号" sortable fixed="left" width="100"></el-table-column>
        <el-table-column prop="studentName" label="姓名" fixed="left" width="100"></el-table-column>
        <el-table-column prop="termName" label="学年" width="100"></el-table-column>
        <el-table-column prop="administrativeClassName" sortable width="230" label="行政班"></el-table-column>
        <el-table-column prop="termNum" label="学期" sortable width="70"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" sortable width="240"></el-table-column>
        <el-table-column prop="natureName" label="属性" sortable width="70"></el-table-column>
      
        <el-table-column prop="courseGrade" label="成绩" width="58"></el-table-column>
        <el-table-column prop="hours" label="学时" width="58"></el-table-column>
        <el-table-column prop="credit" label="学分" width="58">
          <template slot-scope="scope">
            {{Number(scope.row.credit).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="gpa" label="GPA" width="60"></el-table-column>
     
        <el-table-column label="课程成绩明细" prop="courseGradeDetail" width="500" style="text-align:left;">
          <template slot-scope="scope">
             <span v-html="scope.row.courseGradeDetail"></span>
          </template>
        </el-table-column>
        <el-table-column prop="courseGradeOriginal" label="原成绩" width="70"></el-table-column>
        <el-table-column label="课程原成绩明细" prop="courseGradeOriginalDetail" width="500" style="text-align:left;">
          <template slot-scope="scope">
             <span v-html="scope.row.courseGradeOriginalDetail"></span>
          </template>
        </el-table-column>
        <el-table-column prop="courseBkDetail" label="补考详情" width="300"></el-table-column>
        <!-- 产品修改，不显示排名 -->
      </ElBigdataTable>

      <!-- 选择打印的学生 -->
      <el-dialog 
        title="选择打印的学生"
        size="mini"
        :visible.sync="selectStudents_dialog"
        :modal-append-to-body="false" 
        width="50%">
         <ElBigdataTable  size="mini" 
          border
          :height="450"
          :data="studentList"
         >
             <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
             <el-table-column prop="studentNo" label="学号"></el-table-column>
             <el-table-column prop="studentName" label="姓名"></el-table-column>
             <el-table-column prop="administrativeClassName" label="行政班"></el-table-column>
             <el-table-column prop="" label="操作" width="200">
               <template slot-scope="scope">
                    <el-button size="mini"   type="text" @click="openprint('Cn',scope.row)"> 打印中文版</el-button>
                    <el-button size="mini"   type="text" @click="openprint('En',scope.row)"> 打印英文版</el-button>
               </template>
             </el-table-column>
         </ElBigdataTable>

         <div class="cm-pagination">
          <el-pagination
              background
              :current-page="pageNo1"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount1"
              @size-change="sizeChange1"
              @current-change="currentChange1"
            ></el-pagination>
        </div>
        

        <span size="mini" slot="footer" class="dialog-footer">
          <el-button  size="mini"  @click="selectStudents_dialog = false">关 闭</el-button>
        </span>
      </el-dialog>

      <!-- 成绩的弹框 -->
    <el-dialog 
        id='printContent'  ref="printContent"
        :show-close="false"
        :fullscreen="true"
        :visible.sync="score_dialog"
        :modal-append-to-body="false"
        width="50%"
        :center="true" >
        <div > 
          <div style="line-height:43px;">
              <img  style="position: absolute; right:3px; " :src="logoUrl" width="75" height="85" />
              <div size="mini"   style="width:100%;text-align:center;font-size:14px;">
                <span class="center" v-html="printTitleName[printLanguage][0]"> </span>   
              </div> 
              <div style="display:flex;align-items:left;">
                <div style="flex:1;">
                  <span>{{printTitleName[printLanguage][1]}}:{{allData.studentNo}}</span>  
                  <span style="margin-left:10px;">{{printTitleName[printLanguage][2]}}:{{allData['student'+ printLanguage +'Name']}}</span>
                </div> 
                <div  style="flex:1;">
                  <span>{{printTitleName[printLanguage][3]}}:{{allData['major'+ printLanguage +'Name']}}</span>  
                  <span  style="margin-left:10px;">{{printTitleName[printLanguage][4]}}:{{allData['lengthOfSchooling'+ printLanguage +'Name']}}</span>
                  <span style="background:url('')"></span>
                </div> 
            </div>
          </div>
          <div  style="display: flex;">
              <table width="100%" style="flex: 1 1 0%; font-size: 12px; border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;">
                <tr style="display: flex;height:16px;line-height:16px;">
                    <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                    <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 35px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                </tr>
                <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in leftTableData"  :key="index">
                    <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                    <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:16px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 35px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                </tr>  
              </table> 

              <table width="100%" style="flex: 1 1 0%; font-size: 12px; border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;">
                <tr style="display: flex;height:16px;line-height:16px;">
                    <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                    <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                    <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 35px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                </tr>
                <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in rightTableData"  :key="index">
                    <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                    <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:16px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                    <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(173, 217, 192); border-image: initial; width: 35px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                </tr>  
              </table>  
      
          </div> 
          <div  style="line-height:20px;margin-top:10px;font-size:12px;"  >
              <div style=" display: flex;  flex-wrap: wrap; justify-content: space-between;"><span>{{printTitleName[printLanguage][11]}}</span>　<span  v-html="printTitleName[printLanguage][5] +'　'+ nowTime(printLanguage)"></span></div>
          </div>
        </div>
        <span size="mini" slot="footer" class="dialog-footer no-print" >
            <el-button  size="mini"  @click="score_dialog=false">取 消</el-button>
            <!-- @click="printHtml" -->
             <!-- v-print="'#printContent'" -->
            <el-button  size="mini" type="primary"  @click="printHtml" >打 印</el-button>
        </span>
     
      </el-dialog>


      <!-- 考试记录详情弹窗 -->
      <el-dialog
        title="考试记录"
        size="mini"
        :visible.sync="detailsDialog"
        append-to-body
        :close-on-click-modal="false" 
        width="80%"
      >
        <p style="padding-bottom: 10px;">{{titleData+ '权重:'+titleWeight}}</p>
        <ElBigdataTable
          size="mini"
          :height="300"
          ref="multipleTable"
          :data="dialogData"
          border
          style="width: 100%; "
          header-row-class-name="cm-dark"
        >
          <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
          <el-table-column prop="resit" label="考试性质">
            <template slot-scope="scope">
              <span v-if="scope.row.resit==0">正常</span>
              <span v-if="scope.row.resit==1">补考</span>
            </template>
          </el-table-column>

          <el-table-column prop="regularGrade" label="平时成绩"></el-table-column>
          <el-table-column prop="finalExamGrade" label="期末成绩"></el-table-column>
          <el-table-column prop="stageGrade" label="阶段成绩"></el-table-column>
          <el-table-column prop="courseGrade" label="课程成绩"></el-table-column>
        </ElBigdataTable>

        <span size="mini" slot="footer" class="dialog-footer">
          <el-button @click="detailsDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
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
import printJS from 'print-js';

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
      tableHeight: 50,
      logoUrl:'img/stdx_log.png',
      tablength2:80,
      tablength1:80,
      studentsrecoreds:[],
      studentsrecoreds2:[],
      ifnone:false,//用来隐藏打印按钮
      studentList:[],
      score_dialog:false,
      selectStudents_dialog:false,
      detailsDialog: false,
      breadcrumb: [{ label: "成绩管理" }, { label: "学生课程总成绩查询" }],
      // 学时总成绩查询
      formInline: {
        major: ""
      },
      dialog: {
        status: "edit",
        editvisible: false,
        visible: false,
        detailvisible: false,
        gradeVisible: false,
        classVisible: false
      },
      searchForm: {
        termId: "", //学期
        course: "", //课程ID
        studentNo: "", //学号
        grade: "", //所在级
        major: "", //专业
        administrativeClassId: '', //行政班
        studentName: "", //姓名
        type: '',
        natureId: ''
      },
      natureList: [],
      classData: [],
      tableData: [],
      dialogData: [],
      titleData: "",
      titleWeight: "",
      addtableData: [],
      gradetableData: [],
      editTableData: [],
      onTouchData: [],
      gridData: [],

      formYear: "",
      onKeyYear: "",
      options1: [],
      majorList: [],
      taskList: [],
      courseList: [],
      arrangCourseList: [],
      onSelectionChangeVal: [],
      myDate: new Date(),
      // tableLoading:false,
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      pageNo1: 1,
      pageSize1: 10,
      totalCount1: 0,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      userId: util.getStorage("loginId"),
      userName: util.getStorage("loginName"),
      administrativeList: [], //行政班
      btnPerObj: {
        query: false
      },
      terms:[],
      printTitleName:{
        Cn:['汕头大学医学院学生成绩单','学号','名称','专业','全日制','汕头大学医学院教务处  学籍科  日期:','课程内容','学时','学分','成绩','序号','注:标有\'*\'为选修课'],
        En:['Students Records Of Shantou University Medical College','No','Name','Major','Full Time','The Student Status Section Of Dean\'s Office Of Shantou University Medical College  Date:','Course','Hour','Crdt','Score','No','Note: Marked \'*\' as an Optional Course']
      },
      printLanguage:'Cn',
      leftTableData:[],
      rightTableData:[],
      allData:{},
      lineHeight:16,
      rowCount:56
    };
  },
  created() {
    this.getTermData();
    // this.getMajorList();
    this.getNatureList();
    this.getCourseList1(0, 0, 0)
    // this.getCourseList(); //课程下拉列表
    // this.getAdministrative();
    // this.getFailedGradeData(); //列表获取
    // this.onSearch(); //查询
  },
  computed: {
    ...mapState(["btnPermitList"])
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
     window.onmouseout=()=>{
        this.ifnoneshow();
    };

    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 120;
        
        // 监听窗口大小变化
        let self = this;
        window.onresize = function() {
            self.tableHeight = window.innerHeight - self.$refs.multipleTable.$el.offsetTop - 120;
        }
    })
    //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
　　　　 //50表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度　

    // util.openBtnPermit(this.btnPerObj);
    //          this.getBtnPermit(); //按钮权限
  },
  filters: { 
     showCredit(val) {
      if (val <= 0) return null;
      return val;
    }
  },
  methods: {
    getCourseList1(grade, major, term) {
        if(this.searchForm.grade == "") {
            grade = 0
        }else{
            grade = grade
        }
        if(this.searchForm.major == "") {
            major = 0
        }else{
            major = major
        }
        if(this.searchForm.termId == "") {
            term = 0
        }else{
            term = term
        }
        this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
          if (data.code == 0) {
              this.courseList = data.data;
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
        this.searchForm.major = ''
        this.majorList = []
        this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
            this.majorList = res.data
        })
    },
    getCourseList(flag) {
    // 根据查询课程
    if(flag === 'grade') {
        this.getMajor()
    }
    this.searchForm.course = ''
    this.courseList = [];

    if(this.searchForm.grade || this.searchForm.major){
      this.queryClassList()
    }
    let termId = ''
    let grade = ''
    let majorId = ''
    if(this.searchForm.termId=="" || this.searchForm.termId == null){
        termId=0;
    }else{
        termId= this.searchForm.termId;
    }
    if(this.searchForm.grade=="" || this.searchForm.grade == null){
        grade=0;
    }else{
        grade= this.searchForm.grade;
    }
    if(this.searchForm.major=="" || this.searchForm.major == null){
        majorId=0;
    }else{
        majorId=this.searchForm.major;
    }
    this.$http.get("_sc:/stuScore/getcombox"+"/"+ termId +"/"+grade+"/"+majorId).then(data =>{
        if(data.code==0){
            this.courseList = data.data;
        }else{
            this.$message.error(data.msg);
        }
    })
    // let param = {
    //     grade: this.searchForm.grade,
    //     majorId: this.searchForm.major,
    //     termId: this.searchForm.termId
    // };
    // this.$http
    //     .post("_sc:/courseScoreModel/getCourseByParam", param)
    //     .then(data => {
    //     if (data.code == 0) {
    //         if (data.data && data.data.length) {
    //         this.courseList = data.data;
    //         }
    //     } else {
    //         this.$message.error(data.msg);
    //     }
    //     });
    },
    queryClassList(){
      this.searchForm.administrativeClassId = '';
      let params = {
          param:{
            administrativeClassIds:this.searchForm.administrativeClassId,
            grade:this.searchForm.grade || '',
            majorId:this.searchForm.major || '',
          }
      }
      this.$http.post('_op:/administrative/class/list/nopaging',params).then(data=>{
        this.administrativeList=data.data
      }).catch(()=>{
      })
    },
    getNatureList() {
      this.$http.post("_op:dicts/getDictsList", {type:'course-nature'}).then(res => {
        if(res.code == 0){
          this.natureList = res.data
        }
      });
    },
    showLogo(){
      // let self = this;
      // // debugger;
      // self.logoUrl = '';
      // self.nextTick(function () {
      //   debugger;
      //   self.logoUrl = 'img/stdx_log.png';
      // })
    },
    printHtml(){
      this.$print(this.$refs.printContent)
      
    },
    nowTime(lan){
      if("Cn" === lan){
        return util.cnTime();
      }else{
        return util.enTime();
      }
      console.info(lan)
    },
    ifnoneshow(){
        let self = this
        self.ifnone = true;

    },
    preview(){
        let self = this
        self.ifnone = false
        setTimeout(()=>{
            window.print();
        },100)
    },
    openprint(printLanguage,row){
        this.score_dialog = true ;
        this.printLanguage = printLanguage; 
        let self = this;
        self.leftTableData = [];
        self.rightTableData = [];  
        this.$http.get("_sc:/stuScore/transcript/"+row.studentNo+"/"+printLanguage+"/"+ self.rowCount).then(res => {
          if(res.code == 0){ 
            self.allData = res.data;
            self.leftTableData = res.data.leftTranscriptOfCourse;
            self.rightTableData = res.data.rightTranscriptOfCourse;
          }
        })
        .catch((err) => {
          console.error(err);
        });
        // this.getrecoreds()
    },
    getrecoreds(){
      
       const zongth = 50
      this.studentsrecoreds = [
        {
          classname:'Term NO: 1',
          courselist:[
            {  no:1,coursename:'课程1',hour:'25',crdt:'33',score:'90'},
            {  no:2,coursename:'课程2',hour:'25',crdt:'33',score:'90'},
            {  no:3,coursename:'课程3',hour:'25',crdt:'33',score:'90'},
            {  no:4,coursename:'课程5',hour:'25',crdt:'33',score:'90'}
          
          ],
          classlength:4,
        },
        {
          classname:'Term NO: 2',
          courselist:[
            {  no:1,coursename:'课程1',hour:'25',crdt:'33',score:'90'},
            {  no:2,coursename:'课程2',hour:'25',crdt:'33',score:'90'},
            {  no:3,coursename:'课程3',hour:'25',crdt:'33',score:'90'},
            {  no:4,coursename:'课程5',hour:'25',crdt:'33',score:'90'},
            {  no:5,coursename:'课程5',hour:'25',crdt:'33',score:'90'},
            {  no:6,coursename:'课程5',hour:'25',crdt:'33',score:'90'}
          
          ],
            classlength:'6'
        },
     
      ]
      // 业务逻辑
      //  如果数组页面固定是60行  查出来的数组超过60 行 多出了的放第二个数组里面 显示在右边 

    //  空格逻辑
    //  不管左边还是右边 用60去减掉数组长度 得到一个数字x  去显示 x 行的空行
      var tab1th = 12
     
      if(tab1th<zongth){
        this.tablength1 = zongth-tab1th
      }else{
         this.tablength1 = 0
      }
      
       this.studentsrecoreds2 = []
        var tab2th = 0
        if(tab2th<zongth){
          this.tablength2 = zongth-tab2th
        }else{
          this.tablength2 = 0
        }
      
    },
    opne_dalong(){
        this.selectStudents_dialog = true
        this.queryPrintStudent();
    },queryPrintStudent(){
         this.$http
        .post("_sc:/stuScore/queryPrintStudent", {
          pageNo: this.pageNo1,
          pageSize: this.pageSize1,
          param: {
            administrativeClassId: this.searchForm.administrativeClassId,
            termId: this.searchForm.termId, //学期
            studentNo: this.searchForm.studentNo, //学号
            grade: this.searchForm.grade, //所在级
            majorId: this.searchForm.major, //专业
            courseId: this.searchForm.course, //课程ID
            studentName: this.searchForm.studentName //姓名
          }
        })
        .then(res => {
          if(res.code == 0){
             this.studentList = res.data.result;
             this.totalCount1 = res.data.totalCount;
          }
           
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "query_xueshengchengjichaxun") {
              self.btnPerObj.query = true;
            }
          });
        })
        .catch(() => {});
    },
    // 补考次数详情
    handleClick(row) {
      this.detailsDialog = true;
      this.getExaminationList(row); //获取考试记录，成绩详情
      this.getAssessmentMethod(row); //获取评定方式数据
    },
    // 获取评定方式数据
    getAssessmentMethod(val) {
      let params = {
        courseId: val.course,
        grade: val.grade,
        majorId: val.major,
        termId: val.termId
      };
      this.$http
        .post("_sc:/courseScoreModel/detail", params)
        .then(res => {
          if (res.code == 0) {
            this.titleData = res.data.scoreTypeProportion;
            this.titleWeight = res.data.allStageWeight;
          
          }
        })
        .catch(() => {});
    },

    // 获取考试记录列表
    getExaminationList(val) {
      let params = {
        course: val.course,
        resit: 1,
        studentNo: val.studentNo,
        termId: val.termId
      };
      this.$http
        .post("_sc:/stuScore/queryList", params)
        .then(res => {
          if (res.code == 0) {
            this.dialogData = res.data.stuScoreResult;
          }
        })
        .catch(() => {});
    },
    // getAdministrative() {
    //   //行政班
    //   let params = {
    //     pageNo: 1,
    //     pageSize: 100,
    //     param: {
    //       administrativeClassIds: this.searchForm.administrativeClassId,
    //       grade: this.searchForm.grade,
    //       majorId: this.searchForm.major
    //     }
    //   };
    //   this.$http
    //     .post("_op:/administrative/class/list/nopaging", params)
    //     .then(data => {
    //       // this.administrativeList = data.result;
    //       this.administrativeList = data.data;
    //     })
    //     .catch(() => {});
    // },

    //   获取列表
    getFailedGradeData() {
      this.tableLoading = true;
      this.$http
        .post("_sc:/stuScore/queryStudentCourseGrade", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          // administrativeClassIds: this.searchForm.administrativeClassId, //行政班
          administrativeClassId: this.searchForm.administrativeClassId,
          termId: this.searchForm.termId, //学期
          studentNo: this.searchForm.studentNo, //学号
          grade: this.searchForm.grade, //所在级
          majorId: this.searchForm.major, //专业
          courseId: this.searchForm.course, //课程ID
          studentName: this.searchForm.studentName, //姓名
          natureId: this.searchForm.natureId,
          type: this.searchForm.type
        })
        .then(res => {
          if(res.code == 0){
             this.tableData = res.data.result;
             this.totalCount = res.data.totalCount;
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading=true;
        });
    },
     // 改变所在级请求课程
        changeGrage(){
            this.getCourseList(this.searchForm.grade,this.searchForm.major)
        },
        // 改变专业请求课程
        changeMajor(){
            this.getCourseList(this.searchForm.grade,this.searchForm.major)
        },
        // 课程下拉列表，根据所在级 专业查询
        // getCourseList(){
        //     // /course/combox/{grade}/{majorId}
        //     this.courseList = []
        //     this.administrativeList = []
        //     this.searchForm.course = ''
        //     this.searchForm.administrativeClassId = ''
        //     let  grade= this.searchForm.grade;
        //     let  majorId=this.searchForm.major;
        //     if(grade=="" || grade == null){
        //         grade=0;
        //     }else{
        //           grade= this.searchForm.grade;
        //     }
        //       if(majorId==""){
        //         majorId=0;
        //     }else{
        //         majorId=this.searchForm.major;
        //     }
        //     this.$http.get("_op:/course/combox"+"/"+grade+"/"+majorId).then(data =>{
        //           if(data.code==0){
        //             this.courseList = data.data;
        //         }else{
        //             this.$message.error(data.msg);
        //         }
        //     })
        //     let params = {
        //         param:{
        //           administrativeClassIds:this.searchForm.administrativeClassId,
        //           grade:this.searchForm.grade || '',
        //           majorId:this.searchForm.major || '',
        //         }
        //     }
        //     this.$http.post('_op:/administrative/class/list/nopaging',params).then(data=>{
        //       this.administrativeList=data.data
        //     }).catch(()=>{
        //     })
        // },
   
    // 显示条数
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getFailedGradeData(); //刷新列表
    },
    currentChange(current) {
      this.pageNo = current;
      this.getFailedGradeData(); //刷新列表
    },
    sizeChange1(size) {
      this.pageNo1 = 1;
      this.pageSize1 = size;
      this.queryPrintStudent();
    },
    currentChange1(current) {
      this.pageNo1 = current;
      this.queryPrintStudent();
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },

    onSearch() {
      this.pageNo = 1;
      this.getFailedGradeData(); //刷新列表
    },

    confirmAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRequire();
        } else {
          return false;
        }
      });
    },

    seeTableDetail(row) {
      this.semester = row.semester_name;
      this.dialog.status = "detail";
      this.dialog.editvisible = true;
      this.getTableDetail(row.id);
    },
    getTableDetail(_id) {
      this.$http.get("_ed:/semestercourse/detail/" + _id).then(data => {
        if (data.code == 0) {
          this.editTableData = data.data;
          for (let item of this.editTableData) {
            let surplus_theory_hours =
              item.semester_theory_hours - item.arranged_theory_hours;
            let surplus_novitiate_hours =
              item.semester_novitiate_hours - item.arranged_novitiate_hours;
            this.$set(item, "semester_name", this.semester);
            this.$set(
              item,
              "surplus_hours",
              `${surplus_theory_hours}/${surplus_novitiate_hours}`
            );
            this.$set(
              item,
              "semester_hours",
              `${item.semester_theory_hours}/${item.semester_novitiate_hours}`
            );
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    closeDetail() {
      this.dialog.detailvisible = false;
    },
    teachingRemark() {
      this.dialog.remark = true;
    },

    getMajorList() {
      this.$http.get("_op:/major/combox").then(data => {
        if (data.code == 0) {
          this.majorList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  
    getTaskData() {
      this.$http
        .post("_ed:/teachtask/courselist", {
          semester_year: this.addfallYear,
          semester_year_number: this.addsemesterNum
        })
        .then(data => {
          if (data.code == 0) {
            this.taskList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    getTermData(query) {
      if (!query) {
        query = "学期";
      }
      let self = this;
     
      this.$http.get("_op:/terms/" + query).then(res => {
        if (res.code == 0) {
           self.terms = res.data.reverse();
           for(let i=0;i<this.terms.length;i++){
              //   searchForm.termId
              if(this.terms[i].name.indexOf('当前学期')!=-1){
                this.searchForm.termId = this.terms[i].id
              }
                  
            }
        }
      });
    },
    cellStype(row){
      if(row.columnIndex === 1 && row.term){
        return "text-align:center;padding:0px;";
      }else{
        return "text-align:left;padding:0px;";
      } 
    }
  }
};
</script>
<style scoped lang="less">
.cm-table{
    margin-top: 20px;
}
.cm-addGrade p {
  margin-bottom: 12px;
}
.pro_btn{
  margin-bottom: 20px
}
.printstyle{ 

  .tab1{
    td{
       border: 1px solid black;
        font-size: 12px;
    }
  }

 .tab1 tr{
   display: flex;
   line-height: 12px;
  .first_td{
     width:25px;
     height: 12px;
     text-align: right;
  }

  .two_td{
    flex: 1 ;
    height: 12px;
  }
  .third_td{
     width:25px;
     height: 12px;
     text-align: left;
  }

  .four_td{
    width:25px;
    height: 12px;
    text-align: left;
  }

  .five_td{
    width:28px;
    height: 12px;
    text-align: left;
  } 
 }
} 

.term{
  display: flex;
  width: 100%;
}
.termname1{
  width: 5%;
    height: 25px;
    line-height: 25px;
    border-left: solid 1px #ddd;
    
    text-align: center;
} 

.termname{
  width: 76%;
    height: 25px;
    line-height: 25px;
    border-left: solid 1px #ddd;
    // border-right: solid 1px #ddd;
    text-align: center;
} 
.termname3{
  width: 7%;
    height: 25px;
    line-height: 25px;
    border-left: solid 1px #ddd;
    
    text-align: center;
} 
.termname4{
  width: 7%;
    height: 25px;
    line-height: 25px;
    border-left: solid 1px #ddd;
    
    text-align: center;
} 
.termname5{
  width:7%;
    height: 25px;
    line-height: 25px;
    border-left: solid 1px #ddd;
    border-right: solid 1px #ddd;
    text-align: center;
} 
 
</style>
<style>
 
  .el-table.customer-class /deep/ .cell{
    line-height: normal;
  }

 

    #printContent /deep/ .el-dialog__header{
        text-align: center;
        padding: 0px;
    }
    #printContent /deep/ .el-dialog__body{
        padding: 0px 0px;
    }

    #printContent /deep/ .full-size-scroll{
        overflow:hidden;
    }

    



</style>
