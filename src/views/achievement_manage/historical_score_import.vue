<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="searchForm">
        <div class="fold box">
          <div ref="formDetail">
            <el-form-item label="学期">
              <el-select v-model="searchForm.term" clearable @change="getCourseList">
                <el-option v-for="term in termList" :key="term.id" :value="term.id" :label="term.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级">
              <intelligent-year-picker style="width: 90px;" @change="getCourseList('grade')" clearable v-model="searchForm.grade" type="year" value-format="yyyy"></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="专业">
              <el-select v-model="searchForm.major" filterable clearable @change="getCourseList">
                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="班级">
              <el-select v-model="searchForm.class" filterable clearable :disabled="!searchForm.grade || !searchForm.major">
                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="课程">
              <el-select v-model="searchForm.course" filterable clearable :disabled="!searchForm.grade || !searchForm.major" style="width: 250px;">
                <el-option v-for="list in courseList" :key="list.id" :label="list.courseName" :value="list.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select clearable v-model="searchForm.status" filterable style="width: 100px;">
                <el-option v-for="list in statusList" :key="list.courseId" :label="list.name" :value="list.courseId"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="btn">
            <el-button size="mini" type="primary" @click="onSearchQuery">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btns" style="margin-left:20px">
      <a :href="`${publicPath}template/historical-score-import-template.xls`" class="el-button el-button--default el-button--mini is-plain" download="历史成绩导入模板">下载模板</a>
      <el-button type="primary" size="mini" @click="importStuScore()">导入</el-button>
      <el-button type="primary" size="mini" @click="coatAdd">手工新增</el-button>
    </div>
    <div class="cm-table" style="padding: 10px 20px 20px 20px;box-sizing:border-box;">
      <el-table :data="importList" border size="mini">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="导入日期" prop="createTime" width="140">
          <template slot-scope="scope">
            <template>{{scope.row.createTime | formatData}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作员" prop="createUserName" width="150"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态" prop="impStatus" width="80">
          <template slot-scope="scope">
            <template>{{scope.row.impStatus | formatStatus}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button @click="showHistoryDialog(scope.row)" size="mini" type="text">详情</el-button>
            <el-button size="mini" @click="delScore(scope.row.impBatchid,'all')" v-if="scope.row.impStatus == 1 || scope.row.impStatus == 2" type="text">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;padding-top:20px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalpage"></el-pagination>
      </div>
    </div>
    <el-dialog title="历史成绩导入" :visible.sync="historyDialog" :append-to-body="true" :close-on-click-modal="false" width="85%">
      <el-table :data="historyList" border size="mini">
        <!-- <el-table-column v-for="(item, index) in historyCol" :key="index" :label="item.label" :prop="item.prop" :width="item.width"></el-table-column> -->
        <el-table-column label="学号" prop="studentNo" width="90"></el-table-column>,
        <el-table-column label="姓名" prop="studentName" width="100"></el-table-column>,
        <el-table-column label="课程" prop="courseName" width="180"></el-table-column>,
        <el-table-column label="学期" prop="term" width="40"></el-table-column>,
        <el-table-column label="阶段成绩" prop="stageGrade" width="50"></el-table-column>,
        <el-table-column label="课程成绩" prop="courseGrade" width="50"></el-table-column>,
        <el-table-column label="考试状态" prop="examStatus" width="50">
          <template slot-scope="scope">{{scope.row.examStatus | formatExamStatus}}</template>
        </el-table-column>,
        <el-table-column label="补考1" prop="firstbk" width="50"></el-table-column>,
        <el-table-column label="补考2" prop="secondbk" width="50"></el-table-column>,
        <el-table-column label="最后一次补考" prop="thirdbk" width="60"></el-table-column>,
        <el-table-column label="补考次数" prop="bkTimes" width="50"></el-table-column>,
        <el-table-column label="学时" prop="hours" width="50"></el-table-column>,
        <el-table-column label="学分" prop="credit" width="50"></el-table-column>,
        <el-table-column label="课程属性" prop="courseNature" width="70"></el-table-column>,
        <el-table-column label="状态" prop="impStatus" width="50">
          <template slot-scope="scope">{{scope.row.impStatus | formatStatus}}</template>
        </el-table-column>,
        <el-table-column label="算补考" prop="remark" width="70"></el-table-column>,
        <el-table-column label="错误说明" prop="errorNote" width="900"></el-table-column>
        <el-table-column label="操作" width="85" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.impStatus == 2" @click="showEditDialog(scope.row)">纠错</el-button>
            <el-button type="text" size="mini" v-if="scope.row.impStatus == 1 || scope.row.impStatus == 2" @click="delSingleScore(scope.row.id, scope.$index, historyList)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;padding-top:20px;">
        <el-button @click="addHistoryRow" type="primary">新增</el-button>
        <el-button @click="cancelScore('all')" type="primary">作废</el-button>
        <el-button @click="closeHistoryDialog">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入历史成绩" :visible.sync="importstudentDialog" width="450px" :append-to-body="true" :close-on-click-modal="false" class="import-teachers-list">
      <el-upload class="upload-demo" ref="upload" action :file-list="fileList" :on-success="onSuccess" :on-change="fileSelected" :before-upload="onBefore" :auto-upload="false">
        <el-button slot="trigger" size="small">选取文件</el-button>
      </el-upload>
      <el-button style="margin-left: 10px;" size="small" type="primary" :disabled="allow" @click="submitUpload()">导入</el-button>
    </el-dialog>

    <el-dialog :visible.sync="editDialog" :append-to-body="true" width="450px" @close="closeEdit" :close-on-click-modal="false" top="8vh">
      <el-form :model="form" label-width="110px" size="mini">
        <el-form-item label="学号">
          <el-input v-model="form.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.studentName"></el-input>
        </el-form-item>
        <el-form-item label="课程">
          <el-select style="width: 100%" v-model="form.courseName" @change="changeSTC" filterable>
            <el-option v-for="(courseItem,courseIndex) in courseList1" :label="courseItem.name" :value="courseItem.id" :key="courseIndex"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-else label="课程">
          <el-input v-model="form.courseName"></el-input>
        </el-form-item> -->
        <el-form-item label="学期">
          <el-select style="width: 100%" v-model="form.term" @change="changeSTC">
            <el-option v-for="(termItem,termIndex) in termList" :key="termIndex" :label="termItem.name" :value="termItem.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-else label="学期">
          <el-input v-model="form.term"></el-input>
        </el-form-item> -->
        <el-form-item label="阶段成绩">
          <el-input v-model="form.stageGrade"></el-input>
        </el-form-item>
        <el-form-item label="课程成绩">
          <el-input v-model="form.courseGrade"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.examStatus" style="width: 100%;">
            <el-option v-for="list in examStatusList" :key="list.id" :label="list.name" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补考1">
          <el-input v-model="form.firstbk"></el-input>
        </el-form-item>
        <el-form-item label="补考2">
          <el-input v-model="form.secondbk"></el-input>
        </el-form-item>
        <el-form-item label="最后补考">
          <el-input v-model="form.thirdbk"></el-input>
        </el-form-item>
        <el-form-item label="补考次数">
          <el-input v-model="form.bkTimes"></el-input>
        </el-form-item>
        <el-form-item label="学时">
          <el-input v-model="form.hours"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="form.credit"></el-input>
        </el-form-item>
        <el-form-item label="课程属性">
          <el-select style="width: 100%" v-model="form.courseNature">
            <el-option v-for="courseItem in courseNatureList" :key="courseItem.value" :label="courseItem.label" :value="courseItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="课程成绩算补考">
          <el-select style="width: 100%" v-model="form.remark">
            <el-option v-for="item in BhcourseList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
          <!-- <el-input type="textarea" v-model="form.remark"></el-input> -->
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="submitChange">保存</el-button>
        <el-button @click="editDialog=false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
			publicPath: process.env.BASE_URL,
      impBatchid: '',
      singleId: '',
			impStatus: '',
      breadcrumb: [{ label: "成绩管理" }, { label: "历史成绩导入" }],
      searchForm: {
        term: "",
        grade: "",
        major: "",
        class: "",
        status: "",
        course: ""
      },
      currentPage: 1,
      pageSize: 20,
      totalpage: 100,
      termList: [],
      BhcourseList: [
        {label: '是', value: '是'},
        {label: '否', value: '否'}
      ],
      majorList: [],
      classList: [],
      courseNatureList: [
        {label: '必修', value: 785},
        {label: '选修', value: 786},
        {label: '综考', value: 1243}
      ],
      statusList: [
        { id: "", name: "全部" },
        { id: 1, name: "成功" },
        { id: 2, name: "有错误" },
        { id: 3, name: "作废" }
      ],
      importList: [],
      courseList: [],
      courseList1: [],
      historyDialog: false,
      historyList: [],
      historyCol: [
        { label: "学号", prop: "studentNo", width: 80 },
        { label: "姓名", prop: "studentName", width: 150 },
        // { label: "班级", prop: "classes", width: 200 },
        { label: "课程", prop: "courseName", width: 180 },
        { label: "学期", prop: "term", width: 200 },
        { label: "阶段成绩", prop: "stageGrade", width: 65 },
        { label: "课程成绩", prop: "courseGrade", width: 65 },
        { label: "状态", prop: "examStatus", width: 65 },
        { label: "重修1", prop: "firstbk", width: 65 },
        { label: "重修2", prop: "secondbk", width: 65 },
        { label: "重修3", prop: "thirdbk", width: 65 },
        { label: "学时", prop: "hours", width: 65 },
        { label: "学分", prop: "credit", width: 65 },
        { label: "备注", prop: "remark", width: 65 },
        { label: "状态", prop: "impStatus", width: 65 },
        { label: "错误说明", prop: "errorNote", width: 120 }
      ],
      editDialog: false,
      newAdd: "",
      importstudentDialog: false,
      fileList: [],
      allow: false,
      examStatusList: [
        { id: 0, name: "正常", code: "ZC" },
        { id: 1, name: "缺考", code: "QK" },
        { id: 2, name: "缓考", code: "HK" },
        { id: 3, name: "作弊", code: "ZB" },
        { id: 4, name: "违纪", code: "WJ" },
        { id: 5, name: "休学", code: "XX" },
        { id: 6, name: "免修", code: "MX" }
      ],
      batchid: '',
      form: {
        studentNo: "",
        studentName: "",
        term: "",
        courseName: "",
        stageGrade: "",
        courseGrade: "",
        examStatus: "",
        firstbk: "",
        secondbk: "",
        thirdbk:"",
        bkTimes:"",
        hours: "",
        credit: "",
        remark: "否",
        impStatus: "",
        errorNote: "",
        courseNature: "",
        impBatchid: "",
        id: ""
      }
    };
  },
  filters: {
    formatData(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    formatStatus(val) {
      if (val == 1) {
        return "成功";
      } else if (val == 2) {
        return "有错";
      } else if (val == 3) {
        return "作废";
      } else {
        return "";
      }
    },
    formatExamStatus(val) {
      if (val == 0) {
        return "正常";
      } else if (val == 1) {
        return "缺考";
      } else if (val == 2) {
        return "缓考";
      } else if (val == 3) {
        return "作弊";
      } else if (val == 4) {
        return "违纪";
      } else if (val == 5) {
        return "休学";
      } else if (val == 6) {
        return "免修";
      } else {
        return "";
      }
    }
  },
  watch: {
    'form.studentNo'() {
      const search = this.form.studentNo
      if(search.length < 9) {
        return
      }else{
        this.$http.get('_op:students/info/' + search).then(res => {
          this.form.studentName = res.data.name
        })
        this.$http.post('_sc:stuScore/queryTermScore',{
          // pageNo: 1,
          // pageSize: 1000,
          param: {
            studentNo: search,
            termId: this.form.termId,
            course: -1
          }
        }).then(res => {
          if(res.result == null) {
            return
          }else{
            let result = res.result[0]
            this.form.stageGrade = result.stageGrade
            this.form.courseGrade = result.courseGrade
            this.form.examStatus = result.examStatus
            this.form.firstbk = result.firstbk
            this.form.secondbk = result.secondbk
            this.form.thirdbk = result.thirdbk
            this.form.bkTimes = result.bkTimes
            this.form.hours = result.hours
            this.form.credit = result.credit
            this.form.courseNature = result.natureId
          }
        })
      }
      
    }
  },
  computed: {},
  mounted() {
    this.getCourseData()
    this.getTermData();
    // this.getMajorList();
  },
  methods: {
		delScore(row){
      this.impBatchid = row
			this.cancelScore('all')
		},
		delSingleScore(row, index, rows){
      this.singleId = row
			this.cancelScore('single', index, rows)
		},
		cancelScore(flag, index, rows){
      this.$confirm('确定要作废吗?', '提示',{
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning',
        closeOnHashChange: true
      }).then(() => {
          let param = {}
          if(flag === 'all') {
            param = {
              impBatchid: this.impBatchid
            }
            this.historyDialog = false
          }else {
            param = {
              impBatchid: this.impBatchid,
              id: this.singleId
            }
            rows.splice(index, 1);
          }
          this.$http.post("_sc:/importHisScore/invalidImportHisScore",param).then( res => {
            if( res.code == 0){
              this.$message({
                type: 'success',
                message: '作废成功'
              })
              this.onSearch()
            } else {
              this.$message.error(data.msg);
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      })
    },
    // 关闭按钮
    closeHistoryDialog() {
      this.historyDialog = false
    },
    // 手工新增
    coatAdd() {
      this.newAdd = 'newadd'
      this.historyDialog = true
      this.historyList = []
      this.$http.get('_sc:importHisScore/getImpBatchid').then(res => {
        this.form.impBatchid = res.data
      })
    },
    // 新增
    addHistoryRow() {
      delete this.form.id
      this.newAdd = 'newadd'
      this.form.studentNo = "",
      this.form.studentName = "",
      this.form.term = "",
      this.form.courseName = "",
      this.form.stageGrade = "",
      this.form.courseGrade = "",
      this.form.examStatus = "",
      this.form.firstbk = "",
      this.form.secondbk = "",
      this.form.thirdbk = "",
      this.form.bkTimes = "",
      this.form.hours = "",
      this.form.credit = "",
      // this.form.remark = "",
      this.form.impStatus = "",
      this.form.errorNote = "",
      this.form.courseNature = "",
      this.editDialog = true
    },
		submitChange(){
      let param = this.form
      if(param.firstbk == "") {
        param.firstbk = null
      }else{
        param.firstbk = param.firstbk
      }
      if(param.secondbk == "") {
        param.secondbk = null
      }else{
        param.secondbk = param.secondbk
      }
      if(param.thirdbk == "") {
        param.thirdbk = null
      }else{
        param.thirdbk = param.thirdbk
      }
      if(param.bkTimes == "") {
        param.bkTimes = null
      }else{
        param.bkTimes = param.bkTimes
      }
      if(param.courseGrade == "") {
        param.courseGrade = null
      }else{
        param.courseGrade = param.courseGrade
      }
      if(param.credit == "") {
        param.credit = null
      }else{
        param.credit = param.credit
      }
			this.$http.post("_sc:importHisScore/updateImportHisScoreDetail", param)
				.then( res => {
					if (res.code == 0) {
            if(this.newAdd == 'newadd') {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
            }else{
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
						
						this.editDialog = false
						this.showHistoryDialog(this.form)
					} else {
            this.$message.error(data.msg);
					}
				})
		},
		closeEdit(){
      this.editDialog = false
			// this.form = {
      //   studentNo: "",
      //   studentName: "",
      //   term: "",
      //   courseName: "",
      //   stageGrade: "",
      //   courseGrade: "",
      //   examStatus: "",
      //   firstbk: "",
      //   secondbk: "",
      //   thirdbk: "",
      //   bkTimes: "",
      //   hours: "",
      //   credit: "",
      //   remark: "",
      //   impStatus: "",
      //   errorNote: "",
      //   courseNature: ""
      // }
		},
    importStuScore() {
      //批量导入
      // this.$refs.formDetails.validate(valid => {
      //   if (valid) {
      this.importstudentDialog = true;
      //   } else {
      //     return false;
      //   }
      // });
    },
    submitUpload() {
      let self = this;
      self.allow = true;

      self.startImport();
      setTimeout(function() {
        self.allow = false;
      }, 1000);
    },
    // 新增   最后请求输入课程 请求到阶段成绩，课程成绩，状态等一下数据
    changeSTC() {
      let studentNo,term,course
      if(this.form.studentNo == "") {
        studentNo = -1
      }else{
        studentNo = this.form.studentNo
      }
      if(this.form.term == "") {
        term = -1
      }else{
        term = this.form.term
      }
      if(this.form.courseName == "") {
        course = -1
      }else{
        course = this.form.courseName
      }
      let postData = {
        param: {
          studentNo: studentNo,
          termId: term,
          course: course,
        }
      }
      this.$http.post('_sc:/stuScore/queryTermScore', postData).then(res => {
        if(res.result == null) {
          this.form.stageGrade = ""
          this.form.courseGrade = ""
          this.form.examStatus = ""
          this.form.firstbk = ""
          this.form.secondbk = ""
          this.form.thirdbk = ""
          this.form.bkTimes = ""
          this.form.hours = ""
          this.form.credit = ""
          this.form.courseNature = ""
        }else{
          let result = res.result[0]
          this.form.stageGrade = result.stageGrade
          this.form.courseGrade = result.courseGrade
          this.form.examStatus = result.examStatus
          this.form.firstbk = result.firstbk
          this.form.secondbk = result.secondbk
          this.form.thirdbk = result.thirdbk
          this.form.bkTimes = result.bkTimes
          this.form.hours = result.hours
          this.form.credit = result.credit
          this.form.courseNature = result.natureId
        }
      })
      
    },
    startImport() {
      let self = this;
      if (self.fileList.length < 1) {
        self.$message.warning("请选择导入文件！");
        return;
      } else {
        let formData = new FormData();

        formData.append("file", self.fileList[0].raw);
        // formData.append("course", self.formDetails.courseId);
        // formData.append("scoreType", self.scoreType);
        // formData.append("termId", self.formDetails.semester);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.$http
          .post("_sc:/importHisScore/import", formData, config)
          .then(data => {
            if (data.code == 0) {
              self.$message({
                message: "导入成功！",
                type: "success"
              });
              self.onSearch();
              self.importstudentDialog = false;
            } else {
              self.$message.error(data.msg);
            }
          })
          .catch(error => {
            self.$message.error("导入失败!");
          });
      }
    },
    fileSelected(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    onSuccess(res, file, fileList) {
      let type = "success";
      let message = "导入成功！";
      if (res.code != 0) {
        type = "error";
        message = res.msg;
      }
      this.$message({
        type: type,
        message: message
      });
    },
    onBefore(file) {
      let extension = file.name.split(".")[1] === "xls";
      let size = file.size / 1204 / 1204 < 20;
      if (!extension) {
        this.$message.warning("上传的文件格式是 xls！");
      }
      if (!size) {
        this.$message.warning("上传的文件大小不能超过20M！");
      }
      return extension && size;
    },
    // 查询
    onSearchQuery() {
      this.currentPage = 1
      this.pageSize = 20
      this.pageNo = 1
      let query = {
        termId: this.searchForm.term,
        grade: this.searchForm.grade,
        major: this.searchForm.major,
        course: this.searchForm.course,
        impStatus: this.searchForm.status,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.$http
      .post("_sc:/importHisScore/queryImportHisScore", query)
      .then(res => {
        if (res.code == 0) {
          this.importList = res.data.dataList;
          this.totalpage = res.data.total_records;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    onSearch() {
      let query = {
        termId: this.searchForm.term,
        grade: this.searchForm.grade,
        major: this.searchForm.major,
        course: this.searchForm.course,
        impStatus: this.searchForm.status,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      this.$http
        .post("_sc:/importHisScore/queryImportHisScore", query)
        .then(res => {
          if (res.code == 0) {
            this.importList = res.data.dataList;
            this.totalpage = res.data.total_records;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    showHistoryDialog(row) {
      this.impBatchid = row.impBatchid
      this.impStatus = row.impStatus
      this.$http
        .get("_sc:importHisScore/getImportHisScoreDetail/" + row.impBatchid)
        .then(res => {
          if (res.code == 0) {
            this.historyList = res.data;
            this.form.impBatchid = res.data[0].impBatchid
            this.historyDialog = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    showEditDialog(row) {
      this.newAdd = 'error'
      this.form.impBatchid = row.impBatchid
      // 当前成表id 给 this.form
      // this.form = row;
      this.form.id = row.id
      this.form.studentNo = row.studentNo
      this.form.studentName = row.studentName
      this.form.stageGrade = row.stageGrade
      this.form.courseGrade = row.courseGrade
      this.form.examStatus = row.examStatus
      this.form.firstbk = row.firstbk
      this.form.secondbk = row.secondbk
      this.form.thirdbk = row.thirdbk
      this.form.bkTimes = row.bkTimes
      this.form.hours = row.hours
      this.form.credit = row.credit
      this.form.remark = row.remark
      this.form.impStatus = row.impStatus
      this.form.errorNote = row.errorNote
      // this.form.courseNature = row.courseId
      this.form.courseName = Number(row.course)
      this.form.term = Number(row.termId)
      if(row.courseNature == null) {
        this.form.courseNature = ""
      }else if(row.courseNature == '必修') {
        this.form.courseNature = 785
      }else if(row.courseNature == '选修') {
        this.form.courseNature = 786
      }else if(row.courseNature == '综考') {
        this.form.courseNature = 1243
      }
      this.editDialog = true;
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val;
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSearch()
    },
    getTermData(query) {
      // 获取学期列表默认当前学期数据
      if (!query) {
        query = "学期";
      }
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
          this.termList = data.data.reverse();
            for (let i = 0; i < this.termList.length; i++) {
              if (this.termList[i].name.indexOf("当前学期") != -1) {
                // this.searchForm.term = this.termList[i].id;
                this.form.term = this.termList[i].id;
              }
            }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取课程
    getCourseData() {
      let term = 0, grade = 0, major = 0
      this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
          if (data.code == 0) {
            this.courseList1 = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    getMajorList() {
      //查询专业列表
      return this.$http.get("_op:/major/combox").then(data => {
        if (data.code == 0) {
          this.majorList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // queryClassListAndCourseList() {
    //   // this.queryClassList();
    //   this.getCourseList();
    // },
    queryClassList() {
      if (!this.searchForm.grade || !this.searchForm.major) {
        return;
      }
      let params = {
        param: {
          grade: this.searchForm.grade,
          majorId: this.searchForm.major
        }
      };
      this.classList = [];
      this.$http
        .post("_op:/administrative/class/list/nopaging", params)
        .then(data => {
          if (data.code == 0) {
            this.classList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {
          this.$message.error(data.msg);
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
      if (
        !this.searchForm.grade ||
        !this.searchForm.major ||
        !this.searchForm.term
      ) {
        return;
      }
      let param = {
        grade: this.searchForm.grade,
        majorId: this.searchForm.major,
        termId: this.searchForm.term
      };
      this.$http
        .post("_sc:/courseScoreModel/getCourseByParam", param)
        .then(data => {
          if (data.code == 0) {
            if (data.data && data.data.length) {
              this.courseList = data.data;
            }
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  }
};
</script>
<style scoped lang="less">
.cm-table /deep/ .el-button--mini{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.box {
  justify-content: space-between;
  margin-bottom: 10px;
}
.upload-demo {
  position: relative;
  padding-left: 240px;
  margin-bottom: 20px;
}
.import-teachers-list .upload-demo /deep/ .el-upload-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 230px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 3px;
  max-height: 60px;
  overflow-y: scroll;
}
</style>

