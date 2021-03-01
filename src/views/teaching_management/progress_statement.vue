<!--进度报表-->
<template>
  <section class="cm-container" v-loading="conflictLoading">
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
      <el-form :inline="true" size="mini" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="学期">
              <el-select
                v-model="formYear"
                value-key="item.name"
                filterable
                @change="onSelectChange"
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

            <el-form-item label="排课课程">
              <el-select
                class="pkkcBox"
                v-model="formInline.semester_course_id"
                filterable
                clearable
                placeholder="全部"
                @change="onCourseChange"
              >
                <el-option
                  class="pkkc"
                  v-for="(list, ListIndex) in se_courseList"
                  :key="ListIndex"
                  :label="list.displayName"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在年级" class="szjBox">
              <intelligent-year-picker
                style="width:90px"
                v-model="formInline.grade"
                type="year"
                value-format="yyyy"
                placeholder="请选择"
                clearable
                @change="onGradeChange"
              ></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="上课班">
              <el-select
                class="skbBox"
                v-model="formInline.cls_id"
                filterable
                placeholder="全部"
                clearable
                @change="onClassChange"
              >
                <el-option
                  class="skb"
                  v-for="list in classList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                class="ztBox"
                v-model="formInline.status"
                clearable
                placeholder="全部"
                @change="onStatusChange"
              >
                <el-option class="zt" label="未提交" :value="0"></el-option>
                <el-option label="已提交" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="formInline.course_name" clearable placeholder="输入课程名称模糊查询"></el-input>
            </el-form-item>
            <!--<el-form-item label="课程">
                            <el-select v-model="formInline.region" placeholder="全部">
                                 <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
            </el-form-item>-->
          </div>
          <div class="btn" v-if="btnPerObj.query">
            <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        header-row-class-name="cm-dark"
				v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
      >
        <el-table-column type="selection"></el-table-column>

        <!-- <el-table-column prop="name" label="进度表名称" width="200"></el-table-column> -->
        <!-- <el-table-column prop="semester_name" label="学期" width="200"></el-table-column> -->
        <el-table-column label="排课课程">
          <template slot-scope="scope">
            <el-button
              @click="getSeDetail(scope.row)"
              type="text"
              size="small"
            >{{scope.row.course_name}}</el-button>
          </template>
        </el-table-column>
       
        <el-table-column label="上课班" >
          <template slot-scope="scope">
            <el-button
              @click="classInformation(scope.row)"
              type="text"
              size="small"
            >{{scope.row.cls_name}}</el-button>
          </template>
        </el-table-column>
         <el-table-column prop="grade" label="所在级" width="70"></el-table-column>
        <el-table-column prop="arranged_theory_hours" label="总学时理论/实践" width="120"> 
          <template
            slot-scope="scope"
          >{{scope.row.arranged_theory_hours+" / "+scope.row.arranged_novitiate_hours}}</template>
        </el-table-column>
        <el-table-column prop="submitted_theory_hours" label="提交学时理论/实践" width="130" >
          <template
            slot-scope="scope"
          >{{scope.row.submitted_theory_hours+" / "+scope.row.submmited_novitiate_hours}}</template>
        </el-table-column>
        
        <el-table-column prop="last_submit_time" width="130" label="提交日期">
          <template slot-scope="scope">{{scope.row.last_submit_time | getTime}}</template>
        </el-table-column>

        <el-table-column
          v-if="btnPerObj.edit||btnPerObj.submit||btnPerObj.return"
          label="操作"
          width="170"
           fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              @click.native="linkSubmission(scope.row)"
              type="text"
              size="small"
              style="margin-left:5px;"
              v-if="scope.row.status != 0"
            >条目详情</el-button>
            <el-button
              @click.native="exportExcel(scope.row)"
              type="text"
              size="small"
              style="margin-left:5px;"
            >导出</el-button>
            <el-button
              @click.native="linkUnSibmit(scope.row)"
              type="text"
              size="small"
              style="margin-left:5px;"
              v-if="scope.row.status == 0"
            >编辑条目</el-button>
            <el-button
              @click="prostateSubmit(scope.row)"
              type="text"
              size="small"
              style="margin-left:5px;"
              v-if="scope.row.status == 0"
            >提交</el-button>
            <el-button
              @click="recallFn(scope.row)"
              type="text"
              size="small"
              style="margin-left:5px;"
              v-if="scope.row.status == 1"
            >撤回</el-button>
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

    <!-- 排课课程弹框 -->
    <el-dialog title="提示信息" :visible.sync="lecture" :modal-append-to-body="false" width="50%">
      <div class="classinfo-title se-title">
        <span>学期：{{row_detail.semester_name}}</span>
        <span>所在级：{{row_detail.semester_year}}</span>
        <span>排课课程：{{row_detail.course_name}}</span>
      </div>
      <p>教学任务信息</p>
      <el-table :data="se_detail" border class="grid-table">
        <el-table-column
          v-for="(item,index) in gridList"
          :key="index"
          :property="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeLecture">关 闭</el-button>
      </span>
    </el-dialog>
    <!--上课班-->
    <el-dialog title="提示信息" :visible.sync="classInfor" :modal-append-to-body="false" width="50%">
      <p>上课班：{{courseclsDataDetail.name}}&emsp;&emsp; 人数：{{courseclsDataDetail.stu_number}}人</p>
      <el-table :data="courseclsDataDetail.groups" border class="grid-table">
        <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
        <el-table-column label="授课形式" prop="teaching_formname"></el-table-column>
        <el-table-column label="分组" prop="group_name"></el-table-column>

        <el-table-column label="学生信息">
          <template slot-scope="scope">
            <template
              v-for="item in scope.row.cls_infos"
            >{{item.class_belong}} ( {{item.stu_Number}}人 )</template>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="classInfor = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--撤回-->
    <el-dialog title="撤回" :visible.sync="showrecall" :modal-append-to-body="false" width="50%">
      <div>你确定撤回{{recall_row.semester_name}}{{recall_row.grade}}所在级{{recall_row.cls_name}}上课班的进度表数据吗？</div>

      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="showrecall = false">取 消</el-button>
        <el-button type="primary" @click="saveRecall">确 定</el-button>
      </span>
    </el-dialog>
    <progress-conflict :loading.sync="conflictLoading" ref="progressConflictDialog"></progress-conflict>

  </section>
</template>

<script>
import util from "@/util";

import { mapState } from "vuex";
import progressConflict from './progress_conflict'

export default {
  components:{
    progressConflict,
  },
  data() {
    return {
      schedule_id:'',
      tableLoading: false,
      startDateTeaching: "", //授课日期
      endDateTeaching: "",
      lecture: false, //排课
      classInfor: false, //上课班
      courseList: [], //
      options1: [],
      se_courseList: [], //排课课程
      classList: [], //上课班
      courseclsDataDetail: [], //table里点上课班弹框详情
      showrecall: false, //撤回
      recallid: "", //撤回的id
      se_detail: [], //排课详情
      row_detail: "",
      recall_row: "",
      formYear: "",
      myDate: new Date(),
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      //		        gradeOption:[//所在级
      //                  {label:2014,value:2014},
      //                  {label:2015,value:2015},
      //                  {label:2016,value:2016},
      //                  {label:2017,value:2017},
      //                  {label:2018,value:2018},
      //                  {label:2019,value:2019},
      //                  {label:2020,value:2020},
      //                  {label:2021,value:2021},
      //                  {label:2022,value:2022},
      //                  {label:2023,value:2023}
      //              ],
      breadcrumb: [{ label: "教学管理" }, { label: "进度表填报" }],
      dialog: {
        status: "add",
        remark: false,
        visible: false
      },
      formInline: {
        semester_course_id: "", //排课课程
        region: "",
        grade: "", //所在级
        cls_id: "", //上课班
        status: "",
        course_platform_id: "", //课程
        course_name:''
      },

      tableData: [],
      gridData: [],
      gridList: [
        { label: "专业", prop: "major", width: 100 },
        { label: "课程名称", prop: "course_name", width: 120 }
      ],
      pageNo: Number(this.$route.query.pageNo) || 1,
      pageSize: 10,
      totalCount: 0,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      btnPerObj: {
        //按钮权限
        query: false,
        edit: false,
        submit: false,
        return: false
      },
      semesterNum:'',
      fallYear:'',
      conflictLoading:false,
      tempTerm:{},
    };
  },
  computed: {
    ...mapState(["btnPermitList"])
  },
  created() {
    this.getQueryData();
    util.openBtnPermit(this.btnPerObj);

    this.getTermData();

    //this.getCourseList();//获取课程
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
  },
  filters: {
    getTime(time) {
      if (time) {
        return util.getTime(time);
      } else {
        return "";
      }
    }
  },
  methods: {
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "query_jindubiaotianbao") {
              //查询
              self.btnPerObj.query = true;
            }
            if (item.code == "edit_jindubiaotianbao") {
              //编辑条目
              self.btnPerObj.edit = true;
            }
            if (item.code == "submit_jindubiaotianbao") {
              //提交
              self.btnPerObj.submit = true;
            }
            if (item.code == "return_jindubiaotianbao") {
              //撤回
              self.btnPerObj.return = true;
            }
          });
        })
        .catch(() => {});
    },
    getTableList() {
      this.$router.replace({ query: { ...this.$route.query, course_name: this.formInline.course_name } });
			this.tableLoading = true;
      this.tempTerm = this.options1.find(item=>item.id==this.formYear);
      this.$http
        .post("_ed:/schedule/query", {
          semester_year: this.fallYear,
          semester_year_number: this.semesterNum,
          course_name: this.formInline.course_name,
          semester_course_id: this.formInline.semester_course_id,
          grade: this.formInline.grade,
          cls_id: this.formInline.cls_id,
          status: this.formInline.status,
          course_platform_id: this.course_platform_id,
          request_page: this.pageNo,
          page_size: this.pageSize
        })
        .then(data => {
          if (data.code == 0) {
            this.tableData = data.data.dataList;
            this.totalCount = data.data.total_records;
          }
          this.tableLoading = false;
				})
				.catch(err => {
					this.tableLoading = false;
				})
    },
    linkSubmission(item) {
      //已提交跳转
      this.$router.replace({query:{...this.$route.query,pageNo:this.pageNo}});
      this.$router.push({
        name: "fill_details",
        query: item
      });
    },
    linkUnSibmit(item) {
      this.$router.replace({query:{...this.$route.query,pageNo:this.pageNo}});
      this.$router.push({
        name: "fill_details",
        query: item
      });
    },
    onSelectChange(_id) {
      if (_id) {
        for (let list of this.options1) {
          if (list.id == _id) {
            this.fallYear = list.year;
            this.semesterNum = list.orderNum;
          }
        }
      } else {
        this.fallYear = "";
        this.semesterNum = "";
      }
      this.getCourseAss(_id);
      this.$router.replace({ query: { ...this.$route.query, formYear: _id } });
    },
    onCourseChange(val) {
      this.$router.replace({ query: { ...this.$route.query, course: val } });
    },
    onGradeChange(val) {
      this.$router.replace({ query: { ...this.$route.query, grade: val } });
    },
    onClassChange(val) {
      this.$router.replace({ query: { ...this.$route.query, class: val } });
    },
    onStatusChange(val) {
      this.$router.replace({ query: { ...this.$route.query, status: val } });
    },
    getQueryData() {
      let query = this.$route.query;
      query.formYear && (this.formYear = +query.formYear);
      query.class && (this.formInline.cls_id = +query.class);
      query.course && (this.formInline.semester_course_id = +query.course);
      query.grade && (this.formInline.grade = query.grade);
      query.status && (this.formInline.status = +query.status);
      query.course_name && (this.formInline.course_name = query.course_name);
    },

    getSeDetail(row) {
      //排课详情
      this.lecture = true;
      this.row_detail = row;

      this.$http
        .get("_ed:/semestercourse/detail/" + row.semester_course_id)
        .then(data => {
          if (data.code == 0) {
            this.se_detail = data.data || [];
          }
        });
    },
    closeLecture() {
      this.lecture = false;
    },
    courseclsDetail(row) {
      //上课班详情

      this.$http.get("_ed:/coursecls/detail/" + row.cls_id).then(data => {
        if (data.code == 0) {
          this.courseclsDataDetail = data.data;
        }
      });
    },
    getTermData(query) {
      if (!query) {
        query = "学期";
      }
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
          this.options1 = data.data.reverse();
          for (let i = 0; i < this.options1.length; i++) {
            if (this.options1[i].stage == 1) {
              this.formYear = this.options1[i].id;
              this.addForm = this.options1[i].name;
              this.semesterNum = this.options1[i].orderNum;
              this.fallYear = this.options1[i].year;
              break;
            } else {
              if (this.options1[i].name.indexOf("当前学期") != -1) {
                this.formYear = this.options1[i].id;
                this.addForm = this.options1[i].name;
                this.semesterNum = this.options1[i].orderNum;
                this.fallYear = this.options1[i].year;
              }
            }
          }

          this.getCourseAss(this.formYear);
          this.getTableList();
          this.getClassList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    getCourseList() {
      this.$http.post("_op:/course/menuList").then(data => {
        if (data.code == 0) {
          this.courseList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    /*获取排课课程*/
    getCourseAss(_id) {
      for (let item of this.options1) {
        if (item.id == _id) {
          this.fallYear = item.year;
          this.semesterNum = item.orderNum;
        }
      }

      this.$http
        .post("_ed:/semestercourse/list", {
          semester_year: this.fallYear,
          semester_year_number: this.semesterNum
        })
        .then(data => {
          if (data.code == 0) {
            data.data.forEach(
              x => (x.displayName = x.course_arrange + "(" + x.majorNames + ")")
            );
            this.se_courseList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
      this.getClassList();
    },
    getClassList() {
      //上课班
      this.$http
        .post("_ed:/coursecls/list", {
          semester_year: this.fallYear,
          semester_year_number: this.semesterNum
        })
        .then(data => {
          if (data.code == 0) {
            this.classList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    onSearch() {
      //查询
      this.pageNo = 1;
      this.getTableList();
    },
    addTask() {
      this.dialog.status = "add";
      this.dialog.visible = true;
    },
    sizeChange(val) {
      this.pageNo = 1;
      this.pageSize = val;
      this.getTableList();
    },
    currentChange(val) {
      this.pageNo = val;
      this.getTableList();
    },
    lectureDetails() {
      //排课弹窗
      this.lecture = true; //排课
    },
    classInformation(row) {
      //上课班弹窗
      this.classInfor = true; //上课班
      this.courseclsDetail(row);
    },
    planAdjustment(row) {
      this.dialog.status = "edit";
      this.dialog.visible = true;
    },
    teachingRemark() {
      this.dialog.remark = true;
    },
    handleClick() {},
    recallFn(row) {
      //撤回
      if(this.tempTerm.status==2){
        this.$message.warning('进度表已生效，如切实需要撤回修改，请联系教学科退回。');
        return;
      }
      this.showrecall = true;
      this.recallid = row.id;
      this.recall_row = row;
    },

    saveRecall() {
      this.$http
        .post("_ed:/schedule/withdrawsubmit", {
          id: this.recallid,
          create_user: "",
          create_username: ""
        })
        .then(data => {
          this.showrecall = false;
          if (data.code == 0) {
            this.getTableList();
            this.$message.success("撤回成功");
            data.data.forEach(
              x => (x.displayName = x.course_arrange + "(" + x.majorNames + ")")
            );
            this.se_courseList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    //			aa(){
    //
    //				this.$http.post("_ed:/schedule/autogenerate",{
    //                  semester_year:2018,
    //                  semester_year_number:2,
    //                  create_user:"234",
    //                  create_username:"234"
    //              }).then(data=>{
    //                  if(data.code==0){
    //                      //this.$message.success("提交成功");
    //                  }else{
    //                      this.$message.error(data.msg);
    //                  }
    //              })
    //			},
    prostateSubmit(row) {
      this.schedule_id = row.id;
      this.conflictLoading = true;
      this.$http.post("_ed:/schedule/submit", {
          id: row.id,
          create_user: '',
          create_username: ""
        })
        .then(data => {
          if (data.code == 0) {
            this.$message.success("提交成功");
            this.conflictLoading = false;
            this.getTableList();
          } else {
            if(data.data&&data.data.length==0 || !data.data){
               this.$message.error(data.msg);
               this.conflictLoading = false;
            }else{
              this.$refs.progressConflictDialog.openDialog(row);
            } 
          
          }
        });
    },
    
    colsedelis(dialog){
      if(dialog=='dialogdelisone'){
        this.dialogdelisone = true
      }else if(dialog=='dialogdelistwo'){
        this.dialogdelistwo = true
      }else if(dialog=='dialogdelisthree'){
        this.dialogdelisthree = true
      }else if(dialog=='dialogdelisfour'){
        this.dialogdelisfour = true
      }
 
    },
    // 导出表格
    exportExcel(row){
      let query = {
        schedule_id: row.id,
        teacher_id: '',
        area_id: '',
        teaching_form: '',
        group_id: '',
      };
      this.$http2.post(`_ed:/schedule/exportResult`,query).then(datas => {
          let url = window.URL.createObjectURL(new Blob([datas]));
          let y = document.createElement('a');
          y.style.display = 'none';
          y.href = url;
          y.download = `${row.grade}-${row.course_name}-${row.cls_name}-进度表.xls`;
          document.body.appendChild(y);
          y.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(y);
      })
    },
  }
};
</script>
<style scoped="scoped">
.datamsg{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  z-index: 100000;
  overflow: auto;
}
.datamsgdelis{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100001;
}
.none{
  display: none;
}
.datamsg .datamhsbody,.datamsgdelis .datamhsbody{
    background:#f5f7fa;
   width:85%;
    border: solid 1px #ddd;
    margin: 100px auto;
    padding: 20px 20px;
  }
  .datamsg .datamhsbody{
  background:#f5f7fa;
   width:72%;
   
  }
.datamhsbody /deep/.dialog-footer{
    /* padding: 10px 20px 20px; */
    text-align: right;
}


.dv-wrap {
  display: flex;
}
/*.cm-fold .fold .detail{
		height:120px;
	}*/
.cm-fold .fold .el-input__inner {
  width: 100px;
}
.cm-fold .fold .el-input__inner {
  width: 100px;
}
.grid-table {
  margin-top: 10px;
}
.el-dropdown-link {
  font-size: 12px;
}
.se-title {
  font-weight: bold;
  padding-bottom: 20px;
}
.se-title span {
  padding-right: 20px;
}

.pkkcBox {
  width: 350px !important;
}
.pkkc {
  width: 350px !important;
}
.szjBox {
  width: 160px !important;
}
.szj {
  width: 100px !important;
}
.skbBox {
  width: 240px !important;
}
.skb {
  width: 220px !important;
}
.ztBox {
  width: 100px !important;
}
.zt {
  width: 100px !important;
}
</style>