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
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <!-- <el-button type="text" @click="collapseShow">{{fold.text}}</el-button> -->
            </el-form-item>
            <el-form-item label="学期" prop="year">
              <el-select
                v-model="searchForm.termId"
                clearable
                filterable
                @change="getCourseList()"
                @clear="clearTerm"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="所在级">
              <intelligent-year-picker
             
                style="width: 100%;"
                v-model="searchForm.grade"
                type="year"
                clearable
                @change="getCourseListGrade"
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
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(list,index) in courseList"
                  :key="index"
                  :label="list.name"
                  :value="list.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行政班">
              <el-select
                 multiple
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
             <el-form-item label="学号">
              <el-input clearable v-model="searchForm.studentNo" maxlength="40" placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                clearable
                v-model="searchForm.studentName"
                maxlength="40"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="成绩类型">
              <el-select clearable v-model="searchForm.type" filterable>
                <el-option label="所有成绩记录" value="0"></el-option>
                <el-option label="仅课程成绩的记录" value="1"></el-option>
                <el-option label="仅曾补考的记录" value="2"></el-option>
                <el-option label="仅仍未及格的记录" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程属性">
              <el-select clearable v-model="searchForm.nature" filterable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in courseNature" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="exportTable">导出</el-button>
              <a v-show="false" ref="exportExcel"></a>
            </el-form-item>
          </div>
          <!-- <div class="btn">
          </div> -->
        </div>
      </el-form>
        
    </div>
     <div class="cm-fold">
       
     </div>
    <div class="cm-table table-container">
      <el-table
        size="mini"
        ref="multipleTable"
        :data="tableData"
        :height="tableHeight"
        border
        v-loading="tableLoading"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号" fixed width="50"></el-table-column>
        <el-table-column prop="studentNo" label="学号" sortable fixed width="90" ></el-table-column>
        <el-table-column prop="studentName" label="姓名" fixed width="100"></el-table-column>
        <el-table-column prop="administrativeClassName" sortable fixed label="行政班" min-width="210"></el-table-column>
        <el-table-column prop="termNum" label="学期" sortable fixed width="70" sort-by="termNum"></el-table-column>
        <!-- <el-table-column prop="term_num" label="当前学期" fixed width="70"></el-table-column> -->
        <!-- <el-table-column prop="majorName" label="专业名称" sortable fixed min-width="200"></el-table-column> -->
        <el-table-column prop="courseName" label="课程名称" sortable fixed min-width="160"></el-table-column>
        <el-table-column prop="natureName" label="课程性质" fixed min-width="70"></el-table-column>
        <el-table-column prop="stageName" label="阶段" fixed width="50" ></el-table-column>
        <el-table-column prop="stageGrade" label="阶段成绩" fixed width="70" ></el-table-column>
        <el-table-column prop="courseGrade" label="课程成绩" fixed width="70"></el-table-column>
        <el-table-column prop="hours" label="学时" width="50" ></el-table-column>
        <el-table-column prop="credit" label="学分" width="50" ></el-table-column>
        <el-table-column prop="gpa" label="GPA" width="50" ></el-table-column>

        <el-table-column prop="firstbk" label="补考1" width="55"></el-table-column>
        <el-table-column prop="secondbk" label="补考2" width="55"></el-table-column>
        <el-table-column prop="thirdbk" label="最后补考" width="70"></el-table-column>
     
        <el-table-column label="阶段成绩说明" min-width="400" prop="stageGradeDetail"></el-table-column>
        <el-table-column label="课程成绩说明" min-width="400" prop="courseGradeDetail"></el-table-column>
        <el-table-column prop="makeUpExamNum" label="补考次数" width="70"></el-table-column>
        <el-table-column label="补考1成绩说明" min-width="400" prop="firstbkDetail"></el-table-column>
        <el-table-column label="补考2成绩说明" min-width="400" prop="secondbkDetail"></el-table-column>
        <el-table-column label="最后补考说明" min-width="400" prop="thirdbkDetail"></el-table-column>
        <el-table-column prop="teacherNames" label="任课老师" width="700" ></el-table-column>
        <el-table-column prop="courseManagers" label="课程负责人" width="200" ></el-table-column>
        <!-- 产品修改，不显示排名 -->
      </el-table>
      <!-- 考试记录详情弹窗 -->
      <el-dialog
        title="考试记录"
        size="mini"
        :visible.sync="detailsDialog"
        :modal-append-to-body="false"
        width="35%"
      >
        <p style="padding-bottom: 10px;">{{titleData+ '权重:'+titleWeight}}</p>
        <el-table
          size="mini"
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
        </el-table>

        <span size="mini" slot="footer" class="dialog-footer">
          <el-button @click="detailsDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="cm-pagination">
      <el-pagination
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 200]"
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
      detailsDialog: false,
      breadcrumb: [{ label: "成绩管理" }, { label: "学期成绩查询" }],
      formInline: {
        major: ""
      },
      termYear: '',
      termNum: '',
      courseNature: [],
      tableHeight: window.innerHeight - 200,
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
        administrativeClassId: [], //行政班
        studentName: "", //姓名
        type: "",
        nature: ""
      },
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
      isTableData: [],
      formYear: "",
      onKeyYear: "",
      options1: [],
      majorList: [],
      taskList: [],
      courseList: [],
      arrangCourseList: [],
      onSelectionChangeVal: [],
      myDate: new Date(),
      tableLoading:false,
      pageNo: 1,
      pageSize: 200,
      totalCount: 0,
      fold: {
        state: true,
        text: "展开",
        showBtn: false
      },
      userId: util.getStorage("loginId"),
      userName: util.getStorage("loginName"),
      administrativeList: [], //行政班
      btnPerObj: {
        query: false
      }
    };
  },
  created() {
    this.getCourseList1(0, 0, 0)
    this.getRegion()
    this.getTermData();
    // this.getMajorList();
    this.getCourseNature();
    // this.getArrangeCourse();
    // this.getCourseList(); //课程下拉列表
    // this.getAdministrative();
    this. getAdministrativeClassId()
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

    // util.openBtnPermit(this.btnPerObj);
    //          this.getBtnPermit(); //按钮权限
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    }
  },
  methods: {
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
    getCourseListGrade(item) {
        let selectMajor = []
        let str = JSON.stringify(this.isTableData)
        if(this.isTableData.length == 0) {
          this.getMajor()
          this.getAdministrativeClassId()
          this.searchForm.course = ''
          this.courseList = [];
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
        }else if(str.search(item) > -1) {
          this.isTableData.forEach(Element => {
            if(Element.grade == item) {
              selectMajor.push({
                id: Element.id,
                name: Element.majorName
              })
            }
          })
          this.majorList = selectMajor
          this.searchForm.course = ''
          this.courseList = [];
          if (
              !this.searchForm.grade ||
              !this.searchForm.major ||
              !this.searchForm.termId
          ) {
              return;
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
        }else{
          this.majorList = []
          return  this.$message.error('你只能选择自己负责的年级、专业')
        }
      },
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
    getCourseList(flag) {
    // 根据查询课程
    if(flag === 'grade') {
        this.getMajor()
    }
    this.getAdministrativeClassId()
    this.searchForm.course = ''
    this.courseList = [];
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
    getRegion() {
      let teacherId = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
      this.$http.get('_op:/administrative/class/mine/' + teacherId).then(res => {
        this.isTableData = res.data
      })
    },
    exportTable(){
      let params = {
          param: {
            administrativeClassIds: this.searchForm.administrativeClassId, //行政班
            termId: this.searchForm.termId, //学期
            studentNo: this.searchForm.studentNo, //学号
            grade: this.searchForm.grade, //所在级
            major: this.searchForm.major, //专业
            course: this.searchForm.course, //课程ID
            studentName: this.searchForm.studentName, //姓名
            gradeStatus: this.searchForm.type,
            natureId: this.searchForm.nature,
          }
        }
      this.$http2.post('_sc:/stuScore/exportTermScoreResult',params).then(data=>{
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "学期成绩.xls");
          y.click();
          window.URL.revokeObjectURL(url);
      })
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
    getCourseNature(){
      this.$http.post("_op:dicts/getDictsList", {type:'course-nature'}).then(res => {
        if(res.code == 0){
          this.courseNature = res.data
        }
      });
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
    getAdministrativeClassId() { //获取行政班ID
        let slef =this
        // if((slef.formEvaluate.grade!=''|| slef.formEvaluate.grade!=null) &&(slef.formEvaluate.majorId!=''||slef.formEvaluate.majorId!=null)){
            let grade,
                majorId
                if(slef.searchForm.grade=='' || slef.searchForm.grade==null) {
                  grade = 0
                }else {
                  grade = slef.searchForm.grade
                }
                if(slef.searchForm.major==''|| slef.searchForm.major==null) {
                  majorId = 0
                }else {
                  majorId = slef.searchForm.major
                }
                this.$http.get("_op:/administrative/class/list/"+grade+'/'+majorId).then(datas=>{
                if(datas.code === 0) {
                    let data = datas.data;
                    this.administrativeList = data
                }
            })
        // }
    },
    //   获取列表
    getFailedGradeData() {
      this.tableLoading=true;
      this.$http
        .post("_sc:/stuScore/queryTermScore", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            administrativeClassIds: this.searchForm.administrativeClassId, //行政班
            termId: this.searchForm.termId, //学期
            studentNo: this.searchForm.studentNo, //学号
            grade: this.searchForm.grade, //所在级
            major: this.searchForm.major, //专业
            course: this.searchForm.course, //课程ID
            studentName: this.searchForm.studentName, //姓名
            gradeStatus: this.searchForm.type,
            natureId: this.searchForm.nature
          }
        })
        .then(data => {
          this.tableLoading=false;
          this.tableData = data.result;
          this.totalCount = data.totalCount;
        })
        .catch(() => {
          this.tableLoading=false;
        });
    },
        changeTerm(val){
          this.getCourseList()
        },
        clearTerm(){
          this.termYear = 0
          this.termNum = 0
          this.getCourseList()
        },
     // 改变所在级请求课程
        changeGrage(){
            this.getCourseList()
        },
        // 改变专业请求课程
        changeMajor(){
            this.getCourseList()
        },
        // 课程下拉列表，根据所在级 专业查询
        // getCourseList(){
        //     // /course/combox/{grade}/{majorId}
        //     this.courseList = []
        //     this.administrativeList = []
        //     this.searchForm.course = ''
        //     this.searchForm.administrativeClassId = []
        //     let termId = this.termId
        //     let grade = ''
        //     let majorId = ''
        //     if(this.searchForm.termId=="" || this.searchForm.termId == null){
        //       termId=0;
        //     }else{
        //       termId= this.searchForm.termId;
        //     }
        //     if(this.searchForm.grade=="" || this.searchForm.grade == null){
        //       grade=0;
        //     }else{
        //       grade= this.searchForm.grade;
        //     }
        //     if(this.searchForm.major==""){
        //       majorId=0;
        //     }else{
        //       majorId=this.searchForm.major;
        //     }
        //     this.$http.get("_sc:/stuScore/getcombox"+"/"+ termId +"/"+grade+"/"+majorId).then(data =>{
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
        //   this.$http.post('_op:/administrative/class/list/nopaging',params).then(data=>{
        //     this.administrativeList=data.data
        //   }).catch(()=>{
        //   })
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
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },

    onSearch() {
      let str = JSON.stringify(this.isTableData)
      if(this.isTableData.length == 0) {
        this.pageNo = 1;
        this.getFailedGradeData(); //刷新列表
      }else if(str.search(this.searchForm.grade) > -1 && str.search(this.searchForm.major) > -1) {
        this.pageNo = 1;
        this.getFailedGradeData(); //刷新列表
      }else{
        return this.$message.error('你只能选择自己负责的年级、专业')
      }
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
    // getArrangeCourse(){
    //     this.$http.post("_ed:/semestercourse/list/detail",{
    //         semester_year:this.fallYear,
    //         semester_year_number:this.semesterNum
    //     }).then(data=>{
    //         if(data.code==0){
    //             this.arrangCourseList = data.data;
    //             for(let list of this.arrangCourseList){
    //                 if(list.teachTaskCourseList){
    //                    for(let item of list.teachTaskCourseList){
    //                         let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
    //                         this.$set(item,"name",`${item.course_name}（${item.major}，${house}）`);
    //                         this.$set(item,"courseId",list.id);
    //                     }
    //                 }
    //             }
    //         }else{
    //             this.$message.error(data.msg);
    //         }
    //     })
    // },
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
    
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
          for (let i = 0; i < data.data.length; i++) {
            let a = data.data[i].name;
            // if(a.indexOf('当前学期')!= -1){
            //     self.searchForm.termId = data.data[i].id;
            // }
          }
          self.options1 = data.data.reverse();
            for(let i=0;i<this.options1.length;i++){
              //   searchForm.termId
              if(this.options1[i].name.indexOf('当前学期')!=-1){
                this.searchForm.termId = this.options1[i].id
                this.addForm = this.options1[i].name;
                this.termNum = this.options1[i].orderNum;
                this.termYear =this.options1[i].year;
              }
                  
            }
            // this.getCourseList()
            // this.onSearch(); //请求列表
            // this.options1 = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style>
.table-container .el-table--scrollable-x .el-table__body-wrapper {
    z-index : 1;
}
</style>
<style scoped>
.cm-table /deep/ .el-table--mini td{
    padding: 4px 0;
}
.cm-fold .el-form-item{
    margin: 10px 20px 0 0;
}
.cm-fold .fold .btn {
    align-items: flex-start;
    margin-top: 10px;
}
.cm-addGrade p {
  margin-bottom: 12px;
}
</style>