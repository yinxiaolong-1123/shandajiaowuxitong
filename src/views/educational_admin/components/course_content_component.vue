<template>
  <div>
    <div class="button-bar">
      <div>
        <el-button size="mini" type="primary" @click="addContent" v-if="btnPerObj.add">新增内容</el-button>
        <el-button size="mini" plain @click="fileResult">导出内容库</el-button>
        <a v-show="false" ref="exportExcel"></a>
        <el-upload
          size="mini"
          style="display: inline-block;margin-left: 10px;"
          class="upload-demo"
          :data="daochuData"
          :headers="headers"
          action="/operation/data/admin/courseContent/addBatch"
          :show-file-list="false"
          :before-upload="onBefore"
          :on-success="onSuccess"
        >
          <el-button size="mini" type="primary" v-if="btnPerObj.import">导入内容库</el-button>
        </el-upload>

        <el-button
          size="mini"
          style="display: inline-block;margin-left: 10px;"
          type="primary"
          :disabled="disabledBatchCommand"
          @click="handleBatchCommand('batchSetTabDialog')"
        >批量设置</el-button>
      </div>
      <div>
        <el-checkbox v-model="showSortField" @change="onToggleShowSortField">编辑排序顺序</el-checkbox>
        <el-button
          size="mini"
          type="primary"
          @click="saveSort"
          style="margin-left: 15px;"
          :disabled="!showSortField"
        >排序整理</el-button>
      </div>
    </div>
    <div class="cm-table" id="dataTable">
      <!-- <bigdata-table ref="table" :row-num="30" :col-num="8" show-index fixed :columns="tableColumns" v-model="tableData" :fixed-col="0" :operation-column="true" :operationRender="operationRender">
      </bigdata-table>-->
      <ElBigdataTable
      
        highlight-current-row
        v-loading="tableLoading"
        element-loading-text="加载中..."
        ref="multipleTable"
        :data="tableData"
        :height="tableHeight"
        header-row-class-name="cm-dark"
        border
        id="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="38"></el-table-column>
        <el-table-column label="序号" width="80" prop="sort" fixed>
          <template scope="{row, $index}">
            <el-input v-if="showSortField" v-model="row.sort" size="mini"></el-input>
            <span v-else>{{$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程内容" width="400" prop="content"></el-table-column>
        <el-table-column label="授课形式" prop="teachingFormName" :filter-method="termFilterHandler" width="100" :filters="teachingFormNames"></el-table-column>
        <el-table-column
          label="学期"
          prop="termName"
          :filters="termNames"
          :filter-method="termFilterHandler"
        ></el-table-column>  
        <el-table-column label="学时" prop="learningHour" width="55"></el-table-column>
        <el-table-column label="科室" prop="adminDepartmentId" width="130">
          <template
            slot-scope="scope"
          >{{scope.row.adminDepartmentId | showDepartmentName(departmentList)}}</template>
        </el-table-column>
        <el-table-column label="老师优先级" prop="teacherPriority" width="130"></el-table-column>
        <el-table-column label="场地优先级" prop="placePriority"  width="300"></el-table-column>
        <el-table-column label="是否有隐私" prop="privacy" width="96">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center;">
              {{ scope.row.privacy | boolean2String }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="知识点" prop="knowledgePoints"  width="70">
          <template slot-scope="scope">{{ scope.row.knowledgePoints | array2String}}</template>
        </el-table-column>
        <!-- <el-table-column label="提前准备课时" prop="prepareHours"></el-table-column> -->

        <el-table-column
          v-if="btnPerObj.edit||btnPerObj.delete"
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button @click="insertContent(scope.row)" type="text" size="small">向下插入</el-button>
            <el-button
              @click="editTabletRow(scope.row)"
              type="text"
              size="small"
              v-if="btnPerObj.edit"
            >编辑</el-button>
            <el-button
              @click="setTeacherPrority(scope.row)"
              :class="{hadSet: scope.row.teacheSet}"
              type="text"
              size="small"
            >老师优先级</el-button>
            <el-button
              @click="placePrority(scope.row)"
              :class="{hadSet: scope.row.placeSet}"
              type="text"
              size="small"
            >场地优先级</el-button>
            <el-button
              @click="deleteTabletRow(scope.row)"
              type="text"
              size="small"
              style="color: red;"
              v-if="btnPerObj.delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </ElBigdataTable>
    </div>
    <div
      style="padding: 0 20px; font-size: 14px; font-weight: 500; color: #66b1ff"
    >需要调整内容的顺序时，请点击“编辑排序顺序”后输入排序序号，点击”排序整理“按钮进行保存！</div>

    <!-- 新增、编辑 -->
    <el-dialog
      width="400px"
      :title="dialog.status==='add'?'新增课程内容':'编辑课程内容'"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @closed="dialogClose"
      custom-class="cm-dialog-small"
    >
      <el-form ref="addForm" :rules="rules" class="boxStyle" :model="addForm">
        <el-form-item label="课程" class="flex-form" prop="courseId">
          <el-select
            v-model="addForm.courseId"
            placeholder="请选择课程"
            :disabled="true || dialog.status!=='add'"
            style="width:100%;"
          >
            <el-option v-for="list in courses" :key="list.id" :label="list.name" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程内容" prop="content" clearable class="flex-form">
          <el-input v-model="addForm.content" clearable placeholder="请输入课程内容"></el-input>
        </el-form-item>
        <el-form-item label="授课形式" prop="teachingFormId" class="flex-form">
          <el-select v-model="addForm.teachingFormId" placeholder="请选择授课形式" style="width:100%;">
            <el-option v-for="list in teachs" :key="list.id" :label="list.name" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="termId" class="flex-form">
          <el-select v-model="addForm.termId" style="width:100%;" placeholder="请选择学期">
            <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学时" clearable prop="learningHour" class="flex-form">
          <el-input v-model="addForm.learningHour" clearable placeholder="请输入内容学时"></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="adminDepartmentId" class="flex-form">
          <el-select
            clearable
            filterable
            v-model="addForm.adminDepartmentId"
            placeholder="请输入科室关键字"
            style="width:100%;"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- Begin 新增是否涉及隐私、知识点和提前准备课时 -->
        <el-form-item label="知识点" prop="knowledgePoints" class="flex-form">
          <el-select
            v-model="addForm.knowledgePoints"
            placeholder="无"
            style="width:100%;"
            multiple
            filterable
            allow-create
          >
            <el-option
              v-for="item in knowledgePoints"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否涉及隐私" prop="privacy" class="flex-form">
          <el-checkbox v-model="addForm.privacy"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">关 闭</el-button>
        <el-button
          v-if="dialog.status==='add'"
          type="primary"
          @click="addConfirm('addForm',dialog.status==='add'?'post':'put', 'add')"
        >保存并新增</el-button>
        <el-button
          v-if="dialog.status==='add'"
          type="primary"
          @click="addConfirm('addForm',dialog.status==='add'?'post':'put','copy')"
        >保存并复制</el-button>
        <el-button
          v-else
          type="primary"
          @click="addConfirm('addForm','put','close')">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 设置学期的对话框 -->
    <el-dialog
      width="560px"
      title="批量设置课程内容所属学期"
      :visible.sync="batchSetTermsDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form :model="batchSetTermsDialog" label-width="80px" width="100%">
        <el-form-item label="学期" prop="term">
          <el-select v-model="batchSetTermsDialog.term" value-key="id" width="100%">
            <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="batchSetTermsDialog.close()">取 消</el-button>
        <el-button size="mini" type="primary" @click="termBatchUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量设置老师优先级对话框 -->
    <el-dialog
      width="960"
      title="批量设置课程内容老师优先级"
      :visible.sync="batchSetTeachersDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <teacherPrioritySetting ref="teacherPrioritySetting" @onchange="teacherPrioritySelected"></teacherPrioritySetting>
      <span slot="footer">
        <el-button size="mini" @click="batchSetTeachersDialog.close()">取 消</el-button>
        <el-button size="mini" type="primary" @click="teacherPriorityUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量设置场地优先级对话框 -->
    <el-dialog
      width="960"
      title="批量设置课程内容场地优先级"
      :visible.sync="batchSetPlacesDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <placePrioritySetting ref="placePrioritySetting" @onchange="areaPrioritySelected"></placePrioritySetting>
      <span slot="footer">
        <el-button size="mini" @click="batchSetPlacesDialog.close()">取 消</el-button>
        <el-button size="mini" type="primary" @click="areaPriorityUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量设置科室 -->
    <el-dialog
      width="560px"
      title="批量设置课程内容的科室"
      :visible.sync="batchSetDepartmentDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form :model="batchSetDepartmentDialog" label-width="80px" width="100%">
        <el-form-item label="科室" prop="term">
          <el-select
            v-model="batchSetDepartmentDialog.department"
            value-key="id"
            filterable
            width="100%"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="batchSetDepartmentDialog.close()">取 消</el-button>
        <el-button size="mini" type="primary" @click="departmentBatchUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量设置tab页 -->
    <el-dialog
      width="600"
      title="批量设置"
      :visible.sync="batchSetTabDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-tabs
        ref="batchSetTabRef"
        v-model="batchSetTabDialog.activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="老师优先级" name="first">
          <teacherPrioritySetting ref="teacherPrioritySetting" @onchange="teacherPrioritySelected"></teacherPrioritySetting>
        </el-tab-pane>
        <el-tab-pane label="场地优先级" name="second">
          <placePrioritySetting ref="placePrioritySetting" @onchange="areaPrioritySelected"></placePrioritySetting>
        </el-tab-pane>
        <el-tab-pane label="科室&学期" name="third">
          <el-form :model="batchSetDepartmentDialog" :inline="true" label-width="80px" width="100%">
            <el-form-item label="科室" prop="department">
              <el-select
                v-model="batchSetDepartmentDialog.department"
                value-key="id"
                filterable
                width="100%"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学期" prop="term">
              <el-select v-model="batchSetTermsDialog.term" value-key="id" width="100%">
                <el-option v-for="item in terms" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchSetTabDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveBatchData">确 定</el-button>
      </span>
    </el-dialog>

    <div :class="{datamsg:true,none:datamsgnone}">
      <div class="datamhsbody">
         <p>结果明细</p>
        <div class="cm-table">
          <el-table    
           ref="datamsgTable"
          :data="datamsglist"
          border
          style="width: 100%"
          height="300px"
          header-row-class-name="cm-dark">
           <el-table-column type="index" label="行号" width="60"></el-table-column>
            <el-table-column label="描述" prop="desc"> </el-table-column>
          </el-table>
        </div>
         <div style=" text-align: right;padding-top: 10px;">
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="colsedatamsg">确 定</el-button>
          </span>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/util";
import teacherPrioritySetting from "./teacher_priority_setting_componment";
import placePrioritySetting from "./place_priority_setting_componment";
import Sortable from "sortablejs";

export default {
  name: "CourseContentTable",
  props: {
    courseId: {
      value: Number,
      default: 0
    },
    yearId: {
      value: Number,
      default: 0
    },
    courses: {
      value: Array,
      default: []
    },
    terms: {
      value: Array,
      default: []
    }
  },

  components: {
    teacherPrioritySetting,
    placePrioritySetting
  },

  data() {
    //课时长度限制  限制不能超4位数
    var validateTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入课时不能为空"));
        return;
      }
      var regEn = /^[0-9]*$/;
      if (value.length > 4) {
        callback(new Error("课时不能超过4位数字"));
      } else if (!regEn.test(value)) {
        callback(new Error("请输入4位以内纯数字"));
      } else {
        callback();
      }
    };
    //课时内容限制，不能超过60长度
    var validateContent = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      }
      callback();
      // if (value.length > 60) {
      //   callback(new Error("课程内容不能超过60位"));
      // } else {
      //   callback();
      // }
    };

    return {
      datamsgnone:true,
      datamsglist:[],//报错的数组
      importing: false,
      daochuData: {
        courseId: String(this.$route.query.courseId)
      },
      tableHeight: window.innerHeight - 280,
      showSortField: false,
      headers: {
        Access_Token: localStorage.getItem("token"),
        Authorization: localStorage.getItem("token")
      },
      multipleSelection: [],
      tableData: [],
      tableLoading: false,
      btnPerObj: {
        //按钮权限
        query: false,
        add: false,
        download: false,
        import: false,
        edit: false,
        delete: false
      },
      departments: [],
      departmentList: [],
      teachs: [],
      dialog: {
        status: "add",
        remark: false,
        visible: false
      },
      batchSetTermsDialog: {
        visible: false,
        term: {},
        close: function() {
          this.visible = false;
        },
        selected: []
      },
      batchSetTeachersDialog: {
        visible: false,
        close: function() {
          this.visible = false;
        },
        selected: []
      },
      batchSetPlacesDialog: {
        visible: false,
        close: function() {
          this.visible = false;
        },
        selected: []
      },
      batchSetDepartmentDialog: {
        visible: false,
        department: {},
        close: function() {
          this.visible = false;
        }
      },
      batchSetTabDialog: {
        visible: false,
        activeName: "first"
      },
      // 全局知识点
      knowledgePoints: [],
      // 添加/修改表单
      addForm: {
        termId: "",
        content: "",
        courseName: "",
        learningHour: "",
        teachingFormId: "",
        adminDepartmentId: "",
        privacy: false,
        knowledgePoints: [],
        prepareHours: 0
      },
      // 校验规则
      rules: {
        courseId: [
          {
            required: true,
            message: "请选择课程",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "请输入课程内容",
            trigger: "blur"
          },
          {
            validator: validateContent,
            trigger: "change"
          }
        ],
        adminDepartmentId: [
          {
            required: true,
            message: "请选择科室",
            trigger: "blur"
          }
        ],
        termId: [
          {
            required: true,
            message: "请选择学期",
            trigger: "change"
          }
        ],
        teachingFormId: [
          {
            required: true,
            message: "请选择授课形式",
            trigger: "change"
          }
        ],
        learningHour: [
          {
            required: true,
            message: "请输入内容学时",
            trigger: "blur"
          },
          {
            validator: validateTime,
            trigger: "change"
          }
        ]
      }
    };
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    },
    array2String(value) {
      if (Array.isArray(value)) {
        return value.join(",");
      }
      return value;
    },
    boolean2String(value) {
      if (value == true) {
        return "是";
      }
      return "否";
    },
    showDepartmentName(val, departments) {
      if (!val) return "";
      var t = departments.filter(d => d.id == val);
      if (t.length > 0) {
        return t[0].name;
      }
      return "";
    }
  },
  computed: {
    termNames: function() {
      var temp = {};
      this.tableData.forEach(item => {
        temp[item.termName] = {
          text: item.termName,
          value: item.termName
        };
      });
      var results = [];
      for (let key in temp) {
        results.push(temp[key]);
      }
      return results;
    },
  teachingFormNames:function(){
      var temp = {};
      this.tableData.forEach(item => {
        temp[item.teachingFormName] = {
          text: item.teachingFormName,
          value: item.teachingFormName
        };
      });
      var results = [];
      for (let key in temp) {
        results.push(temp[key]);
      }
      return results;
    
    },
    disabledBatchCommand: function() {
      if (Array.isArray(this.multipleSelection)) {
        return this.multipleSelection.length <= 0;
      }
      return false;
    }
  },
  created() {
    this.getDepartments();
    this.getTeachTypes();
    this.getContents(this.courseId);
  },
  mounted() {
 
    util.openBtnPermit(this.btnPerObj);
    this.tableHeight = window.innerHeight - 128;
    const _this = this;
  },
  methods: {
    // 关闭错误对话框
    colsedatamsg(){
      this.datamsgnone = true
      this.datamsglist = []
    },
    getDepartmentName(val, departments) {
      if (!val) return "";
      var t = departments.filter(d => d.id == val);
      if (t.length > 0) {
        return t[0].name;
      }
      return "";
    },
    handleClick(tab, event) {
      this.batchSetTabDialog.activeName = tab.name;
   
    },
    fileResult(row) {
      //导出结果
      // if(this.formEvaluate.grade==''||this.formEvaluate.majorId==''||this.formEvaluate.schemeId==''||this.formEvaluate.semesterYear==''){
      //   this.$message.warning('请先测评')
      // }
      this.$http2
        .get(
          "_op:/courseContent/template/download/" + this.$route.query.courseId
        )
        .then(datas => {
          let url = window.URL.createObjectURL(new Blob([datas]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "课程内容库模板.xls");
          y.click();
          window.URL.revokeObjectURL(url);
        });
    },
    onDownClick() {},
    // table多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 批量设置按钮
    handleBatchCommand(command) {
      if (command == "batchSetTerms") {
        this.batchSetTermsDialog.term = this.terms[0];
        this.batchSetTermsDialog.visible = true;
      } else if (command == "batchSetTeachers") {
        this.batchSetTeachersDialog.visible = true;
        if (this.$refs.teacherPrioritySetting) {
          this.$refs.teacherPrioritySetting.clear();
        }
      } else if (command == "batchSetPlaces") {
        this.batchSetPlacesDialog.visible = true;
        if (this.$refs.placePrioritySetting) {
          this.$refs.placePrioritySetting.clear();
        }
      } else if (command == "batchSetDepartment") {
        this.batchSetDepartmentDialog.visible = true;
      } else if (command == "batchSetTabDialog") {
        this.batchSetTabDialog.visible = true;
        this.batchSetTabDialog.activeName = "first";
      }
    },

    // 返回上一下
    handleBackFrom() {},

    // 批量更新学期
    termBatchUpdate() {
      var arrs = [];
      this.multipleSelection.forEach(c => {
        var nc = JSON.parse(JSON.stringify(c));
        nc.termId = this.batchSetTermsDialog.term.id;
        nc.termName = this.batchSetTermsDialog.term.name;
        arrs.push(nc);
      });
      if (arrs.length <= 0) return;
      this.$http.put("_op:/courseContent/updateBatch", arrs).then(res => {
        this.$message.success("批量设置成功");
        this.batchSetTermsDialog.close();
        this.getContents(this.courseId);
        this.$emit("onchange");
      });
    },

    // 批量设置部门
    departmentBatchUpdate() {
      var arrs = [];
      this.multipleSelection.forEach(c => {
        var nc = JSON.parse(JSON.stringify(c));
        // nc.termId = this.batchSetTermsDialog.term.id;
        // nc.termName = this.batchSetTermsDialog.term.name;
        nc.adminDepartmentId = this.batchSetDepartmentDialog.department.id;
        nc.adminDepartmentName = this.batchSetDepartmentDialog.department.name;
        arrs.push(nc);
      });
  
      if (arrs.length <= 0) return;
      this.$http.put("_op:/courseContent/updateBatch", arrs).then(res => {
        this.$message.success("批量设置成功");
        this.batchSetDepartmentDialog.close();
        this.getContents(this.courseId);
        this.$emit("onchange");
      });
    },

    // 批量设置部门和学期
    batchUpdateTermAndDepartment() {
      var arrs = [];
      this.multipleSelection.forEach(c => {
        if (this.batchSetDepartmentDialog.department.id) {
          c.adminDepartmentId = this.batchSetDepartmentDialog.department.id;
          c.adminDepartmentName = this.batchSetDepartmentDialog.department.name;
        }

        if (this.batchSetTermsDialog.term.id) {
          c.termId = this.batchSetTermsDialog.term.id;
          c.termName = this.batchSetTermsDialog.term.name;
        }
        arrs.push(c);
      });
      if (arrs.length <= 0) return;
      this.$http.put("_op:/courseContent/updateBatch", arrs).then(res => {
        this.$message.success("批量设置成功");
        this.batchSetDepartmentDialog.close();
        this.getContents(this.courseId);
        this.$emit("onchange");
      });
    },

    // 老师优先级选择
    teacherPrioritySelected(val) {
      this.batchSetTeachersDialog.selected = val;
     
    },

    // 老师优先级
    teacherPriorityUpdate() {
      var arrs = [];
      this.batchSetTeachersDialog.selected.forEach(t => {
        this.multipleSelection.forEach(c => {
          var nt = JSON.parse(JSON.stringify(t));
          nt.courseContentId = c.id;
          arrs.push(nt);
        });
      });
      if (arrs.length <= 0) return;
      this.$http.post("_op:/teachersCourseContentRel/batch", arrs).then(res => {
        this.$message.success("批量设置成功");
        this.batchSetTeachersDialog.close();
        this.getContents(this.courseId);
        this.$emit("onchange");
      });
    },

    // 场地优先级选择
    areaPrioritySelected(val) {
      this.batchSetPlacesDialog.selected = val;
    },

    areaPriorityUpdate() {
      var arrs = [];
      this.batchSetPlacesDialog.selected.forEach(t => {
        this.multipleSelection.forEach(c => {
          var nt = JSON.parse(JSON.stringify(t));
          nt.courseContentId = c.id;
          arrs.push(nt);
        });
      });
      if (arrs.length <= 0) return;
      this.$http.post("_op:/areaCourseContentRel/batch", arrs).then(res => {
        this.$message.success("批量设置成功");
        this.batchSetPlacesDialog.close();
        this.getContents(this.courseId);
        this.$emit("onchange");
      });
    },

    // 添加内容
    addContent() {
      this.dialog.status = "add";
      this.dialog.visible = true;
      this.addForm.courseId = parseInt(this.$route.query.courseId);
      // // 清空添加表单
      this.addForm.termId = "";
      this.addForm.content = "";
      this.addForm.courseName = "";
      this.addForm.learningHour = "";
      this.addForm.teachingFormId = "";
      this.addForm.adminDepartmentId = "";
      // 优化：添加4个字段
      this.addForm.knowledgePoints = [];
      this.addForm.privacy = false;
      this.addForm.prepareHours = 0;
      this.addForm.sort = this.tableData.length + 1;
    },

    insertContent(row) {
      this.dialog.status = "add";
      this.dialog.visible = true;
      this.addForm.courseId = parseInt(this.$route.query.courseId);
      // // 清空添加表单
      this.addForm.termId = "";
      this.addForm.content = "";
      this.addForm.courseName = "";
      this.addForm.learningHour = "";
      this.addForm.teachingFormId = "";
      this.addForm.adminDepartmentId = "";
      // 优化：添加4个字段
      this.addForm.knowledgePoints = [];
      this.addForm.privacy = false;
      this.addForm.prepareHours = 0;
      this.addForm.sort = row.sort + 1;
    },

    // 获取课程内容
    getContents(courseId, yearId) {
      this.tableLoading = true;
      this.$http({
        method: "post",
        url: "_op:/courseContent/list",
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            courseId: courseId,
            yearId: yearId
          }
        }
      })
        .then(resp => {
          if (resp.code == 0) {
            this.tableLoading = false;

            // if (resp.data == null) {
            //   this.tableData = [];
            //   this.totalCount = 0;
            //   return;
            // }
            // this.totalCount = resp.data.totalCount;
            if (Array.isArray(resp.data) && resp.data.length > 0) {
              // this.tableData = data.data;
              // 优化1: 支持排序，根据排序来显示
              this.tableData = [];
              var op_data = [];
              op_data = resp.data.sort((a, b) => {
                return a.sort - b.sort;
              });
              // 优化2:处理老师优先级和场地优先级
              op_data.forEach(c => {
                c.teacherPriority = [];
                if (Array.isArray(c.teachersRel)) {
                  c.teacherPriority = c.teachersRel
                    .sort((a, b) => a.priority - b.priority)
                    .map(t => t.teacherName)
                    .join(",");
                }

                if (Array.isArray(c.placesRel)) {
                  c.placePriority = c.placesRel
                    .sort((a, b) => a.priority - b.priority)
                    .map(p => p.areaName)
                    .join(",");
                }

                // let arr = [
                //   c.content,
                //   c.teachingFormName,
                //   c.termName,
                //   c.teacherPriority,
                //   c.placePriority,
                //   c.privacy == true ? '是' : '否',
                //   c.knowledgePoints,
                //   c.prepareHours
                // ];
                // this.tableData.push(arr);
                this.tableData = op_data;
              });
            } else {
              this.tableData = [];
              this.tableData.push({});
              this.tableData.pop();
            }
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(resp => {});
    },

    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "query_kechengneirongku") {
              //查询
              self.btnPerObj.query = true;
            }
            if (item.code == "add_kechengneirongku") {
              //新增任务
              self.btnPerObj.add = true;
            }
            if (item.code == "download_template_kechengneirongku") {
              //下载模板
              self.btnPerObj.download = true;
            }
            if (item.code == "import_template_kechengneirongku") {
              //导入模板
              self.btnPerObj.import = true;
            }
            if (item.code == "edit_kechengneirongku") {
              //编辑
              self.btnPerObj.edit = true;
            }
            if (item.code == "del_kechengneirongku") {
              //删除
              self.btnPerObj.delete = true;
            }
          });
        })
        .catch(() => {});
    },

    // 保存排序
    saveSort() {
      const _this = this;
      this.$confirm("此操作将改变课程内容的排序, 是否继续?", "提示", {
        confirmButtonText: "继续",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var sorted = this.tableData.sort((a, b) => a.sort - b.sort);
          sorted.forEach((v, i) => {
            v.sort = (i + 1) * 10;
          });
       
          // 拖拽完成后，批量更新所有的课程库内容
          _this.$http
            .put("_op:/courseContent/updateBatch", sorted)
            .then(resp => {
              _this.getContents(_this.courseId, _this.yearId);
              _this.$emit("onchange");
            });
        })
        .catch(() => {});
    },

    // 下载模板
    downTemplate() {},
    // 数据导入
    onBefore(file) {
      let extension = file.name.split(".")[1] === "xls";
      let size = file.size / 1204 / 1204 < 20;
      if (!extension) {
        this.$message.warning("上传的文件格式是 xls！");
      }
      if (!size) {
        this.$message.warning("上传的文件大小不能超过20M！");
      }
      this.importing = this.$loading({
        lock: true,
        text: '处理中',
        spinnner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
      return size;
    },
    onSuccess(res, file) {
      // let type = "success";
      // let message = "导入成功！";
      // if (res.code != 0) {
      //   type = "error";
      // }
      // message = res.msg;
      if (res.data && res.data.errorMsg) {
        var arr = new Array();
        for(var err in res.data.errors) {
          // message = message +  res.data.errors[err][0];
          var e = res.data.errors[err].join(',')
          arr.push({desc: e})
        }
        this.datamsglist = arr;
        this.datamsgnone = false;
        this.importing.close();
        this.getContents(this.courseId, this.yearId); //导入成功后刷新列表
        return
      }
      // if (message == '') {
      //   message = "导入成功!";
      // }
      this.$message({
        type: 'success',
        message: '导入成功!'
      });
      this.getContents(this.courseId, this.yearId); //导入成功后刷新列表
      this.importing.close();
    },

    // 对话框关闭
    dialogClose() {
      this.$refs.addForm.resetFields();
      this.dialog.visible = false;
    },

    getDepartments() {
      this.$http
        .get("_auths:/department/tree")
        .then(resp => {
          this.departments = resp.result;
          this.departmentList = util.tree2Array(
            util.clone(this.departments),
            "children"
          );
        })
        .catch(resp => {
          throw resp;
        });
    },

    getTeachTypes() {
      this.$http.get("_op:/teaching/form/combox").then(data => {
        if (data.code == 0) {
          this.teachs = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 编辑行记录
    editTabletRow(row) {
      this.rowId = row.id;
      this.$http.get("_op:/courseContent/" + row.id).then(data => {
        if (data.code == 0) {
          this.addForm = data.data;
          if (this.addForm.adminDepartmentId == "") {
            delete this.addForm.adminDepartmentId;
          }
          // if(this.addForm.adminDepartmentId==""){
          //     delete this.addForm.adminDepartmentId;
          // });
          if (this.addForm.termId == 0) {
            this.addForm.termId = "";
          }
          if (
            typeof this.addForm.knowledgePoints == "undefined" ||
            this.addForm.knowledgePoints == null ||
            this.addForm.knowledgePoints == ""
          ) {
            this.addForm.knowledgePoints = [];
          } else {
            this.addForm.knowledgePoints = this.addForm.knowledgePoints.split(
              ","
            );
          }
          this.dialog.status = "edit";
          this.dialog.visible = true;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 处理新增和修改
    addConfirm(addForm, type, val) {
      this.$refs[addForm].validate(valid => {
        if (valid) {
          this.commonRequire(type, val);
        }
      });
    },
    commonRequire(method, val) {
      let option = util.clone(this.addForm);
      option.adminDepartmentName = this.getDepartmentName(option.adminDepartmentId, this.departmentList);
      option.knowledgePoints = option.knowledgePoints.join(","); // 将数组转成字符串存储
      if (method == "put") {
        option.id = this.rowId;
      }
      this.$http({
        method: method,
        url: "_op:/courseContent",
        data: {
          ...option
        }
      }).then(data => {
        let type = "success";
        let message = `${this.dialog.status == "add" ? "新增" : "编辑"}成功！`;
        if (data.code == 0) {
          if (val == 'close') {
            this.dialog.visible = false;
          } else if (val == 'copy') {
            this.addForm.content = "";
          } else {
            this.$refs.addForm.resetFields();
          }
          // this.dialog.visible = false;
          this.getContents(this.courseId, this.yearId);
        } else {
          type = "error";
          message = data.msg;
        }
        this.$message({
          type: type,
          message: message
        });
      });
    },

    // 处理新增和修改
    addConfirms(addForm, type, val) {
      this.$refs[addForm].validate(valid => {
        if (valid) {
          this.commonRequires(type, val);
        }
      });
    },
    commonRequires(method, val) {
      let option = util.clone(this.addForm);
      option.adminDepartmentName = this.getDepartmentName(option.adminDepartmentId, this.departmentList);
      option.knowledgePoints = option.knowledgePoints.join(","); // 将数组转成字符串存储
      if (method == "put") {
        option.id = this.rowId;
      }
      this.$http({
        method: method,
        url: "_op:/courseContent",
        data: {
          ...option
        }
      }).then(data => {
        let type = "success";
        let message = `${this.dialog.status == "add" ? "新增" : "编辑"}成功！`;
        if (data.code == 0) {
          if (val != "save") {
      
            this.$refs.addForm.resetFields();
          }
          this.dialog.visible = false;
          this.getContents(this.courseId, this.yearId);
        } else {
          type = "error";
          message = data.msg;
        }
        this.$message({
          type: type,
          message: message
        });
      });
    },

    // 删除行记录
    deleteTabletRow(row) {
      this.$confirm(
        `此操作将永久删除 “${row.courseName}” 所维护的信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete("_op:/courseContent/" + row.id).then(data => {
            let type = "success";
            let message = "删除成功！";
            if (data.code == 0) {
              if (this.tableData.length == 1) {
                this.pageNo = 1;
              }
              this.getContents(this.courseId, this.yearId);
            } else {
              type = "error";
              message = data.msg;
            }
            this.$message({
              type: type,
              message: message
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 优先级
    setTeacherPrority(row) {
      var param = this.$route.query;
      param.courseName = row.courseName;
      param.courseContentId = row.id;
      param.content = row.content;
      param.teachingFormName = row.teachingFormName;
      this.$router.push({
        path: "/educational_admin/teacher_priority",
        query: param
        // query: {
        //     courseId: this.courseId,
        //     coursePlatformId: this.coursePlatformId,
        //     courseContentId: row.id,
        //     courseName: row.courseName,
        //     content: row.content,
        //     teachingFormName: row.teachingFormName,
        //     actionId: this.$route.query.actionId,
        //     searchCourseId: this.searchCourseId,
        //     searchYearId: this.searchYearId
        // }
      });
    },
    placePrority(row) {
      var param = this.$route.query;
      param.courseName = row.courseName;
      param.courseContentId = row.id;
      param.content = row.content;
      param.teachingFormName = row.teachingFormName;
      this.$router.push({
        path: "/educational_admin/place_priority",
        query: param
      });
  
    },

    // 表格过滤
    termFilterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },

    onToggleShowSortField() {
      this.$nextTick(() => {
        this.showSortField = !!this.showSortField;
      });
    },
    saveBatchData() {
      let current = this.batchSetTabDialog.activeName;
      this.teacherPriorityUpdate();
      this.areaPriorityUpdate();
      this.batchUpdateTermAndDepartment();
      // if(current == 'first'){

      //     // this.termBatchUpdate();
      //     // this.departmentBatchUpdate();
      // }else if(current == 'second'){
      //     this.teacherPriorityUpdate();
      //     this.areaPriorityUpdate();
      //     this.batchUpdateTermAndDepartment();
      //     // this.termBatchUpdate();
      //     // this.departmentBatchUpdate();
      // }else if(current == 'third'){
      //     this.teacherPriorityUpdate();
      //     this.areaPriorityUpdate();
      //     this.batchUpdateTermAndDepartment();
      //     // this.termBatchUpdate();
      //     // this.departmentBatchUpdate();
      // }
      this.$refs.teacherPrioritySetting.clear();
      this.$refs.placePrioritySetting.clear();
      this.batchSetTabDialog.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.button-bar {
  margin-bottom: 8px;
  padding: 0 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.datamsg{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
 
  z-index: 100000;
}
.none{
  display: none;
}
.datamsg .datamhsbody{
  background:#f5f7fa;
  width: 30%;
    border: solid 1px #ddd;
    margin: 100px auto;
    padding: 20px 20px;
  }
    
.datamhsbody /deep/.dialog-footer{
    /* padding: 10px 20px 20px; */
    text-align: right;
}
</style>