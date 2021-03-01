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
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="学期" prop="year">
              <el-select
                v-model="searchForm.termId"
                clearable
                filterable
               
                :remote-method="getTermData"
              
              >
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
			<el-form-item label="授课老师">
              <el-select clearable v-model="searchForm.course" filterable placeholder="请选择课程">
                <el-option
                  v-for="list in courseList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
			<el-form-item label="年级">
              <intelligent-year-picker
                style="width: 100%;"
                v-model="searchForm.grade"
                type="year"
                clearable
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>
			<el-form-item label="专业">
              <el-select clearable v-model="searchForm.major">
                <el-option label="全部" :value="0"></el-option>
                <el-option
                  v-for="list in majorList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
			 <el-form-item label="授课场地">
              <el-select clearable v-model="searchForm.course" filterable placeholder="请选择课程">
                <el-option
                  v-for="list in courseList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
			 <el-form-item label="上课班">
              <el-select clearable v-model="searchForm.course" filterable placeholder="请选择课程">
                <el-option
                  v-for="list in courseList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
			<el-form-item label="课节">
              <el-input clearable v-model="searchForm.studentNo" style="width:70px;"></el-input>  ~
			   <el-input clearable v-model="searchForm.studentNo"  style="width:70px;"></el-input>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="onSearch" v-if="btnPerObj.query">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <el-row>
       
      </el-row>
    <div class="page-go flex" >
     
        <i class="el-icon-caret-left boxstyle" @click="goToPreWeek"></i>
        <div>&nbsp;第&nbsp;{{week}} &nbsp;周&nbsp;</div> 
        <i class="el-icon-caret-right boxstyle" @click="goToNextWeek"></i>
       
      </div>

    <div class="cm-table">
      <el-table
        size="mini"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >

		 <el-table-column prop="studentNo" label="授课老师 / 星期" width="220px;"></el-table-column>
        <el-table-column prop="studentNo" label="星期一"></el-table-column>
        <el-table-column prop="studentName" label="星期二"></el-table-column>
        <el-table-column prop="administrativeClassName" label="星期三"></el-table-column>
        <el-table-column prop="termName" label="星期四"></el-table-column>
        <el-table-column prop="courseName" label="星期五"></el-table-column>
        <el-table-column prop="stageName" label="星期六"></el-table-column>
        <el-table-column prop="regularGrade" label="星期日"></el-table-column>
		

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
      week:1,
      detailsDialog: false,
      breadcrumb: [{ label: " 自动排课" }, { label: "课表预览" }],
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
        administrativeClassId: "", //行政班
        studentName: "" //姓名
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
      pageSize: 10,
      totalCount: 0,
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
      }
    };
  },
  created() {
    this.getTermData();
    this.getMajorList();
    // this.getArrangeCourse();
    this.getCourseList(); //课程下拉列表
    this.getAdministrative();
    this.getFailedGradeData(); //列表获取
    this.onSearch();//查询
  },
  computed: {
    ...mapState(["btnPermitList"])
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
    
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit(); //按钮权限
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    }
  },
  methods: {
    //上一周
    goToPreWeek(){ 
      if(this.week>1){
        this.week-=1;
      }
    },
     //下一周
     goToNextWeek(){ 
      this.week+=1;
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
    getAdministrative() {
      //行政班
      let params = {
        pageNo: 1,
        pageSize: 100,
        param: {
          administrativeClassName: this.searchForm.administrativeClassId,
          grade: this.searchForm.grade,
          majorId: this.searchForm.major
        }
      };
      this.$http
        .post("_op:/administrative/class/list", params)
        .then(data => {
          this.administrativeList = data.result;
        })
        .catch(() => {});
    },

    //   获取列表
    getFailedGradeData() {
      // this.tableLoading=true;
      this.$http
        .post("_sc:/stuScore/queryTermScore", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            administrativeClass: this.searchForm.administrativeClassId, //行政班
            termId: this.searchForm.termId, //学期
            studentNo: this.searchForm.studentNo, //学号
            grade: this.searchForm.grade, //所在级
            major: this.searchForm.major, //专业
            course: this.searchForm.course, //课程ID
            studentName: this.searchForm.studentName //姓名
          }
        })
        .then(data => {
          // this.tableLoading=false;
          this.tableData = data.result;
          this.totalCount = data.totalCount;
        })
        .catch(() => {
          // this.tableLoading=true;
        });
    },
    // 课程下拉列表
    getCourseList() {
      this.$http
        .get("_op:/course/combox")

        .then(data => {
          if (data.code == 0) {
            this.courseList = data.data;
           
            if (this.courseList.length>0){
               this.searchForm.course=this.courseList[0].id
            }
           
          } else {
            this.$message.error(data.msg);
          }
        });
    },
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
        let self = this
       
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
            for(let i=0;i<data.data.length;i++){
                            let a = data.data[i].name
                            if(a.indexOf('当前学期')!= -1){
                                self.searchForm.termId = data.data[i].id;
                            }
                        }
                          self.options1 = data.data;
                           this.onSearch() //请求列表

          // this.options1 = data.data;
          
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
  .page-go{
    width: 56%;
    background: #efefef;
    margin: 0 300px 0 20px;
    text-align: center;
    padding-left: 41%;
    height: 25px;
    display: table-cell;
    vertical-align: middle;
    text-align: center; 
    /* padding-top:10px; */


  }
  .boxstyle{
    margin-top:3px;
    
  }

  .flex{
    display: flex
  }
.cm-addGrade p {
  margin-bottom: 12px;
}
</style>