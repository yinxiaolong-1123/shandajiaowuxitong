<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true" :model="row">
        <div class="fold">
          <div class="formDetail">
            <el-form-item label="所在级">
              <el-input v-model="row.grade" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="专业">
              <el-input v-model="row.majorName" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="学期">
              <el-input v-model="row.termName" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="课程">
              <el-input v-model="row.courseName" disabled="disabled"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="conbox">
      <div class="btnbox" v-if="true">
        <el-button size="mini" type="primary" @click="subinfo()" v-if="row.status<1 && !isDisabled">提交</el-button>
        <el-button size="mini" type="primary" @click="goback()">返回</el-button>
      </div>
      <div class="btnbox2" v-if="row.examTypeCode=='XN'">
        共
        <i>{{courseScoreModel.total&&courseScoreModel.total!=null?courseScoreModel.total:'-'}}</i>阶段，当前第
        <i>{{courseScoreModel.stage&&courseScoreModel.stage!=null?courseScoreModel.stage:'-'}}</i>阶段；权重：
        <i>{{courseScoreModel.stageWeight&&courseScoreModel.stageWeight!=null?courseScoreModel.stageWeight+'%':'-'}}</i>；比例：
        <i>{{courseScoreModel.scoreTypeProportion&&courseScoreModel.scoreTypeProportion!=null?courseScoreModel.scoreTypeProportion:'-'}}</i>
        计分方式:
        <template style="width:150px">
          <el-select v-model="value" :disabled="isDisabled" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </div>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width:100%;"
        size="mini"
        margin-top="0px"
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
      >
        <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
        <el-table-column prop="studentNo" label="学号"></el-table-column>
        <el-table-column prop="studentName" label="姓名"></el-table-column>
        <el-table-column prop="courseName" label="课程"></el-table-column>
        <el-table-column prop="scoreTypeName" label="成绩类型"></el-table-column>
        <el-table-column label="成绩">
          <template slot-scope="scope">          
            <el-input v-model="scope.row.finalGrade" size="mini" :disabled="isDisabled" @change="updata(scope.row,'inpt1')"></el-input>
          </template>
        </el-table-column>


        <el-table-column prop="examStatusId" label="考试状态">
          <template slot-scope="scope">
            <!-- :disabled="scope.row.examStatusId>0" -->
            <el-select
            style="width:80px;"
              v-model="scope.row.examStatusId"
              placeholder="请选择"
              :disabled="isDisabled"
              size="mini"
              filterable
              @change="updata(scope.row,'selIpt')"
            >
              <el-option
                v-for="item in examinationstutslist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="400" prop="scoreRemark" label="备注说明">
             <template slot-scope="scope">          
            <el-input v-model="scope.row.scoreRemark" size="mini" :disabled="isDisabled" @change="updata(scope.row,'inpt2')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="提交人"></el-table-column>
        <!-- <el-table-column prop="createTime" label="创建日期"></el-table-column> -->
      </el-table>
    </div>
  </section>
</template>

<script>
import util from "@/util";
const TYPE = "resultInput_entry";
const REMARK = "成绩录入";

export default {
  name: TYPE,
  data() {
    return {
      curractionId: "",
      isDisabled: false,
      params: {}, //上页传过来的对像
      readyToPrint: true,
      examinationstutslist: [], //考试的状态列表
      courseScoreModel: "", //权重
      row: {}, //上页传过来的对像
      type: REMARK,
      breadcrumb: [
        { label: "成绩管理" },
        { label: "补缓考成绩录入" },
        { label: REMARK }
      ],
      checked: true,
      formLabelWidth: "60px",
      evaluate: {
        administrativeClassId: [],
        evaluationType: 0,
        grade: 32,
        majorId: "",
        requiredFailedFlag: false, //必修课不及格者复选框：0-勾选，1-未勾选
        schemeId: "",
        semesterYear: ""
      },
      gradeOptions: [], //所在级
      majorIdOptions: [], //专业ID
      schemeIdOptions: [], //测评方案ID
      semesterYearOptions: [], //学年
      administrativeClassIdOptions: [], //行政班ID
      value: "选项1",
      options: [
        {
          value: "选项1",
          label: "百分制"
        }
      ],
      tableLoading: false,
      tableData: []
    };
  },
  created() {
    this.curractionId = this.$route.query.actionId;
    this.isDisabled = this.$route.query.isDisabled;
    this.row = JSON.parse(this.$route.query.row);
    this.params = JSON.parse(this.$route.query.params);

  },
  mounted() {
    this.getweight();
    this.getStudentList();
    this.getexaminationstuts();
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
  },
  methods: {
    updata(row, intype) {
      let self = this;
      if (intype == "inpt1") {
        if (row.finalGrade) {
          if (
            /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(row.finalGrade) == false
          ) {
            self.$message.error("请输入有效数字");
            row.finalGrade = "";
            return;
          }

          if (row.finalGrade > 100 || row.finalGrade < 0) {
            row.finalGrade = 100;
            self.$message.error("请填写大于等于0,小于等于100的数字");
            return;
          }
          row.finalGrade = row.finalGrade;
          // row.finalGrade = parseInt(row.finalGrade);
        }
      }

      let arr = [];
      let obj = {};
      obj.examStatusId = row.examStatusId;
      obj.finalGrade = row.finalGrade,
      obj.resitDelayedType = row.resitDelayedType;
      obj.resitDelayedId = row.resitDelayedId;
      obj.remark = row.scoreRemark
      obj.id = row.id;
      arr.push(obj);
      this.$http
        .post("_sc:/resitScore/recordScore", arr)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            data.finalGrade = res.data[0].finalGrade;

            // this.getStudentList();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    subinfo() {
      let resitListId = this.row.id;
      let status = 1; //1是提交  0 是暂存 2 是发布

      this.$http
        .get(
          "_sc:/resitScore/updateScoreRecordStatus/" +
            resitListId +
            "/" +
            status
        )
        .then(data => {
          if (data.code == 0) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.row.status = 1;
            this.getStudentList();
          }
        })
        .catch(err => {
          console.log(er);
        });
    },

    getStudentList() {
      //获取学生的列表
      // let params = {
      //   courseId:this.row.courseId,
      //   grade:this.row.grade,
      //   majorId:this.row.majorId,
      //   resitListId:this.row.resitListId,
      //   semesterYear:this.row.semesterYear,
      //   semesterYearNumber:this.row.semesterYearNumber

      // }

      this.$http
        .get("_sc:/resitList/" + this.row.id)
        .then(data => {
          if (data.data != null && data.data.length > 0) {
            this.tableData = data.data;
            // this.row.status = 1
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    goback() {
      //返回上一层
    
      this.$router.push({
        path: "/achievement_manage/relieve_score",
        query: {
          params: this.params,
          actionId: this.curractionId
        }
      });
    },
    // 获取考试状态
    getexaminationstuts() {
      let query = "STUDENT_EXAM_STATUS";
      let url = "_sc:/scoreSetting/combox/";
      this.$http.get(url + query).then(data => {
        if (data.code == 0) {
          let self = this;
          let res = data.data
          self.examinationstutslist = res.filter(item => {
            return item.name != '缓考'
          })
        }
      });
    },
    getweight() {
      let params = {
        courseId: this.row.course,
        grade: this.row.grade,
        majorId: this.row.major,
        termId: this.row.termId
      };

      this.$http
        .post("_sc:/courseScoreModel/detail", params)
        .then(data => {
          if (data.data != null) {
            this.courseScoreModel = data.data;
          }

        
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    onEvaluation() {

    },
    getTermData() {
      this.$http.post("_op:/evaluation/evaluate", {
        //TODO:
        evaluationType: this.evaluate.evaluationType
        //FIXME:
      });
    }
  }
};
</script>

<style scoped lang="less">
.element.style {
  width: 100%;
  margin-top: 0px;
}

.pull-right {
  text-align: right;
  margin-right: 10px;
}

.conbox {
  padding: 20px 20px;
  display: flex;

  .btnbox {
    width: 49%;
  }

  .btnbox2 {
    width: 60%;
    text-align: right;
  }
}
</style>