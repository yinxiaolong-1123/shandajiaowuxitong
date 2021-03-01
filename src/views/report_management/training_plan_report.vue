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
      <el-form :inline="true" size="mini">
        <div class="fold">
          <div ref="formDetail" class="detail">
            <el-form-item label="专业">
              <el-select v-model="majorId" filterable clearable placeholder="请选择专业">
                <el-option
                  v-for="list in majorList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所在级">
              <intelligent-year-picker
                style="width: 100%;"
                clearable
                v-model="grade"
                type="year"
                value-format="yyyy"
                placeholder="请选择年级"
              ></intelligent-year-picker>
            </el-form-item>

            <el-form-item label="方案名称">
              <el-input clearable v-model="trainPlanName" placeholder="请输入方案名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchData()" v-if="btnPerObj.query">查询</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData1"
        border
        style="width: 100%"
        size="mini"
        header-row-class-name="cm-dark"
      >
        <el-table-column label="序号" width="80" type="index"></el-table-column>
        <el-table-column prop="name" label="方案名称"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="majorName" label="专业"></el-table-column>
        <el-table-column prop="createUserName" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建日期"></el-table-column>
        <el-table-column label="操作" v-if="btnPerObj.classification||btnPerObj.process_table">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="openclassificationDalong(scope.row)"
              v-if="btnPerObj.classification"
            >课程统计分类</el-button>
            <el-button
              type="text"
              size="small"
              @click="openprocesstableDalong(scope.row)"
              v-if="btnPerObj.process_table"
            >教学进程表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      id="dalongs"
      :visible.sync="classificationDalong"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      class="import-teachers-list classification"
    >
      <div slot="title" class="title">{{gradeName}}年级{{majorName}}专业课程分类学时统计报表</div>
      <div>
        <el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
          <el-tab-pane label="必修课" name="second">
            <el-table
              ref="multipleTable"
              :data="tableData3"
              border
              style="width: 100%"
              size="mini"
              show-summary
              header-row-class-name="cm-dark"
            >
              <el-table-column prop="courseCategory" label="课程类别"></el-table-column>

              <el-table-column prop="courseNum" label="规划门数"></el-table-column>

              <el-table-column prop="courseHour" label="规划学时"></el-table-column>

              <el-table-column prop="courseHourProportion" label="学时占比">
                <!-- <template slot-scope="scope">
                  {{scope.row.courseHourProportion.toFixed(2)*100+'%'}}
                </template> -->
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="课" name="first">
            <el-table
              ref="multipleTable"
              :data="tableData2"
              border
              style="width: 100%"
              size="mini"
              show-summary
              header-row-class-name="cm-dark"
            >
              <el-table-column prop="courseCategory" label="课程类别"></el-table-column>

              <el-table-column prop="courseNum" label="规划门数"></el-table-column>

              <el-table-column prop="courseHour" label="规划学时"></el-table-column>

              <el-table-column prop="courseHourProportion" label="学时占比">
                  <!-- <template slot-scope="scope">
                  {{scope.row.courseHourProportion.toFixed(2)*100+'%'}}
                </template> -->
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="classificationDalong = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      id="dalongs"
      :visible.sync="processtableDalong"
      width="70%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      class="import-teachers-list classification"
    >
      <div slot="title" class="title">{{gradeName}}年级{{majorName}}专业课程分类学时统计报表</div>
      <div>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="必修课" name="second2">
            <el-table
              ref="multipleTable"
              :data="tableData5"
              border
              style="width: 100%"
              size="mini"
              :summary-method="getSummaries"
              show-summary
              header-row-class-name="cm-dark"
            >
              <el-table-column prop="courseCategory" label="课程类别"></el-table-column>
              <el-table-column prop="courseName" label="课程名称"></el-table-column>
              <el-table-column prop="courseHour" label="学时"></el-table-column>
              <el-table-column label="第一学年">
                <el-table-column prop="reportFormType" label="学期1">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[0].novitiateHours+scope.row.semesterHourList[0].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期2">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[1].novitiateHours+scope.row.semesterHourList[1].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第二学年">
                <el-table-column prop="reportFormType" label="学期3">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[2].novitiateHours+scope.row.semesterHourList[2].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期4">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[3].novitiateHours+scope.row.semesterHourList[3].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第三学年">
                <el-table-column prop="reportFormType" label="学期5">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[4].novitiateHours+scope.row.semesterHourList[4].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期6">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[5].novitiateHours+scope.row.semesterHourList[5].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第四学年">
                <el-table-column prop="reportFormType" label="学期7">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[6].novitiateHours+scope.row.semesterHourList[6].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期8">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[7].novitiateHours+scope.row.semesterHourList[7].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第五学年">
                <el-table-column prop="reportFormType" label="学期9">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[8].novitiateHours+scope.row.semesterHourList[8].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期10">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[9].novitiateHours+scope.row.semesterHourList[9].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="选修课" name="first2">
            <el-table
              ref="multipleTable"
              :data="tableData4"
              border
              style="width: 100%"
              size="mini"
                :summary-method="getSummaries"
              show-summary
              header-row-class-name="cm-dark"
            >
              <el-table-column prop="courseCategory" label="课程类别"></el-table-column>
              <el-table-column prop="courseName" label="课程名称"></el-table-column>
              <el-table-column prop="courseHour" label="学时"></el-table-column>
              <el-table-column label="第一学年">
                <el-table-column prop="reportFormType" label="学期1">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[0].novitiateHours+scope.row.semesterHourList[0].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期2">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[1].novitiateHours+scope.row.semesterHourList[1].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第二学年">
                <el-table-column prop="reportFormType" label="学期3">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[2].novitiateHours+scope.row.semesterHourList[2].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期4">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[3].novitiateHours+scope.row.semesterHourList[3].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第三学年">
                <el-table-column prop="reportFormType" label="学期5">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[4].novitiateHours+scope.row.semesterHourList[4].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期6">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[5].novitiateHours+scope.row.semesterHourList[5].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第四学年">
                <el-table-column prop="reportFormType" label="学期7">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[6].novitiateHours+scope.row.semesterHourList[6].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期8">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[7].novitiateHours+scope.row.semesterHourList[7].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="reportFormType" label="第五学年">
                <el-table-column prop="reportFormType" label="学期9">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[8].novitiateHours+scope.row.semesterHourList[8].theoryHours}}</template>
                </el-table-column>
                <el-table-column prop="reportFormType" label="学期10">
                  <template
                    slot-scope="scope"
                  >{{scope.row.semesterHourList[9].novitiateHours+scope.row.semesterHourList[9].theoryHours}}</template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processtableDalong = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>

    <div class="block_page">
      <el-pagination
        class="pull-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage1"
        background
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </section>
</template>

<script>
import util from "@/util";
export default {
  name: "training_plan_report",
  data() {
    return {
      total: 1,
      pageSize: 10, //每个的数量
      currentPage1: 1, //当前页
      schemename: "",
      activeName1: "second",
      activeName2: "second2",
      processtableDalong: false,
      classificationDalong: false,
      tableData5: [],
      tableData4: [],
      tableData3: [],
      tableData1: [],
      tableData2: [],
      tableData: [
        {
          reportFormType: "高基312",
          reportFormName: " 2017年高基322招生在校生来源情况------111",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: " 高基341",
          reportFormName: " 2017年高基322招生在校生来源情况-----222",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: "高基322",
          reportFormName: " 2017年高基322招生在校生来源情况------333",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: "高基331",
          reportFormName: " 2017高基331 学生变动情况-----444",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: "高基321",
          reportFormName: " 2017高基321 在校分年龄情况------555",
          Founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: "高基附一表",
          reportFormName: "  2017年高基附一表------666",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        },
        {
          reportFormType: "高基附二表",
          reportFormName: " 2017年高基附二表------777",
          founder: "华佗",
          reportDate: "2017-10-02",
          status: 0
        }
      ],
      gradeName: "", //单行的年级
      majorName: "", //单行的专业
      majorId: "",
      grade: "",
      trainPlanName: "",

      majorList: [], //专业列表
      breadcrumb: [
        //面包屑
        { label: "报表管理" },
        { label: "培养方案报表" }
      ],
      dialogTable: false,
      btnPerObj: {
        //按钮权限
        query: false,
        classification: false,
        process_table: false
      }
    };
  },

  mounted() {
    
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit(); //按钮权限
  },
  created() {
    this.getMajorList();
    this.getgeneralstatement();
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
  
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总学时";
          return;
        }
        
        if (index > 2) {
          let record = 0;
        //   let total = 0;
          for (let i = 0; i < data.length; i++) {
            let c = data[i].semesterHourList[index - 3];
            // total += data[i].courseHour;
            if (c) {
              record = record + c.theoryHours;
            }
          }
          sums[index] = record;
        } else if (index == 2) {
          let total2 = 0;
          for (let i = 0; i < data.length; i++) {
            total2 += data[i].courseHour;
          }
          sums[index] = total2;
        } 
      });

      return sums;
    },
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
      
          data.data.map(item => {
            if (item.code == "query_training_plan_talble") {
              self.btnPerObj.query = true;
            }
            if (item.code == "curriculum_classification_training_plan_talble") {
              self.btnPerObj.classification = true;
            }
            if (item.code == "teaching_process_table_training_plan_talble") {
              self.btnPerObj.process_table = true;
            }
          });
        })
        .catch(() => {});
    },

    searchData() {
      this.getgeneralstatement();
    },
    getgeneralstatement() {
      let params = {
        pageNo: this.currentPage1,
        pageSize: this.pageSize,
        param: {
          grade: this.grade,
          majorId: this.majorId,
          trainPlanName: this.trainPlanName
        }
      };
      this.$http
        .post("_ed:/trainPlanReport/list", params)
        .then(data => {
          this.tableData1 = data.data.result;
          this.total = data.data.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getgeneralstatement();
  
    },
    handleCurrentChange(val) {
      this.currentPage1 = val;
      this.getgeneralstatement();

    },
    handleClick(tab, event) {

    },
    openprocesstableDalong(row) {
      //打开进程表的弹窗

      this.tableData4 = [];
      this.tableData5 = [];
      let trainPlanId = row.id;

      this.$http
        .get("_ed:/trainPlanReport/statTeachTask/" + trainPlanId)
        .then(data => {
          this.processtableDalong = true;
          this.tableData5 = data.data.dataList1; //dataList1 赋值给必修
          this.tableData4 = data.data.dataList2; //dataList2 赋值给选修
        })
        .catch(err => {
          console.log(err);
        });
    },
    openclassificationDalong(row) {
      //打开课程分类的弹窗
  
      this.gradeName = row.grade;
      this.majorName = row.majorName;
      this.tableData2 = [];
      this.tableData3 = [];
      let trainPlanId = row.id;
      this.$http
        .get("_ed:/trainPlanReport/statCourse/" + trainPlanId)
        .then(data => {
          this.classificationDalong = true;
          
          this.tableData2 = data.data.dataList2; //dataList2 赋值给选修
          this.tableData3 = data.data.dataList1; //dataList1 赋值给必修
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMajorList() {
      //查询专业列表
      this.$http.get("_op:/major/combox").then(data => {
        if (data.code == 0) {
          this.majorList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.classification {
  .title {
    text-align: center;
  }
}
.pull-right {
  text-align: right;
  margin-right: 10px;
}
</style>