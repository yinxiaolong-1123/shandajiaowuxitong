<template>
  <div>
    <div class="bar">
      <div class="cm-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label="年级" class="small-grade">
            <intelligent-year-picker
              width="60px"
              class="boxStyle"
              :clearable="false"
              v-model="formInline.grade"
              type="year"
              @change="refresh()"
              value-format="yyyy"
              placeholder="选择年级"
            ></intelligent-year-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="opencopydalong()" class="styleBox">复制</el-button>
            <el-button size="mini" @click="substuats()" v-if="substuat==0" class="  styleBoxtj" type="primary" :disabled="showtuat">提交</el-button>
            <el-button size="mini" @click="backstuats()" v-else :disabled="showtuat"  class="styleBoxch" type="primary">撤回</el-button>
          </el-form-item>
          <el-button @click="checkSchedule" size="mini" :loading="loadCheckSchedule" style="margin-bottom:5px;">
                {{ loadCheckSchedule ? '正在加载' : '进度表课时校对' }}
          </el-button>
          <el-form-item>
            <el-button
              size="mini"
              style="display: inline-block;margin-right: 10px;"
              type="primary"
              class="styleBoxx" 
              :disabled="disabledBatchCommand"
              @click="handleBatchCommand('batchSetTabDialog')"
            >批量设置</el-button>
            <el-radio v-model="showAll"  class="styleBox"  label="true">显示所有课程内容</el-radio>
            <el-radio v-model="showAll" label="false">显示专业课程内容</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <p v-show="showTitle" class="hoursize3">多个专业的计划学时不一致，请立即修正！</p>
      <div class="info">
        <el-button type="text" @click="outerVisible = true">
          <a @click="showDialog()">适用专业: {{newNameTitle}}</a>
        </el-button>
      </div>
    </div>
    <!-- 适用专业弹窗 -->
    <el-dialog title="适用专业" :visible.sync="outerVisible" :modal-append-to-body="false">
      <div class="cm-table">
        <p>年级:{{formInline.grade}}</p>
        <el-table
          size="mini"
          ref="multipleTable"
          :data="majorTableList"
          border
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          header-row-class-name="cm-dark"
        >
          <el-table-column align="center" width="150" prop="majorname" label="专业"></el-table-column>
          <el-table-column prop="planPeriod" label="计划学时">
            <template slot-scope="scope">
              <!-- {{scope.row.red}} -->
              <p :class="{hoursize:duibiSytle(scope.row)}">{{scope.row.termhoursdetail}}</p>
              <!-- <p   class="redStyle1" > {{scope.row.termhoursdetail}} </p> -->
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-button
                type="text"
                size="small"
                v-if="scope.row.exit==0"
                @click="signOut(scope.row)"
              >退 出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btStyleBox" type="primary" @click="getAddDataDialog">新增</el-button>
        <el-button @click="outerVisible = false">关 闭</el-button>
      </div>
      <!-- 退出弹窗 -->
    </el-dialog>
    <el-dialog width="30%" title="退出" :visible.sync="signOutDialog" :modal-append-to-body="false">
      <!-- <template slot-scope="scope" > -->
      <p>你正在将 【{{titleName}} 】专业从当前专业课程组中解除关系,独立维护,确认吗？</p>
      <!-- <p>你正在将{{titleName}}专业从当前专业课程组中解除关系,独立维护,确认吗？</p> -->

      <!-- </template> -->
      <!-- <p>你正在将++++专业从当前专业课程组中解除关系,独立维护,确认吗？</p> -->
      <div slot="footer" class="dialog-footer">
        <el-button class="btStyleBox" type="primary" @click="signOutDialog =false">再想想,重新选择</el-button>
        <el-button type="primary" @click="outdMajor">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 新增适用专业 -->
    <el-dialog width="40%" title="适用专业" :visible.sync="innerVisible" :modal-append-to-body="false">
      <div class="cm-table">
        <p>年级:{{formInline.grade}}</p>
        <el-table
          size="mini"
          ref="multipleTable"
          :data="majorData"
          border
    
          @closed="dialogClose"
          v-loading="tableLoading"
          @selection-change="handleSelectionChange"
          header-row-class-name="cm-dark"
        >
          <!-- <div  class="cm-table">
          <p>年级:{{formInline.grade}}</p>-->
          <el-table-column align="center" prop="majorName" label="专业"></el-table-column>

          <el-table-column
            @selection-change="handleSelectionChange"
            fixed="right"
            label="操作"
            width="200"
          >
            <template scope="scope">
              <el-checkbox v-model="scope.row.checked" @change="seletetData(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <!-- </div  > -->
        <div slot="footer" class="dialog-footer bottonstyle">
          <!-- <template slot-scope="scope" > -->
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addApplyMajor()">确 定</el-button>

          <!-- </template> -->
        </div>
      </div>
    </el-dialog>
    <!-- 新增确定提示弹窗 -->
    <el-dialog
      width="30%"
      title="增加适用专业"
      :visible.sync="addMajiorMessage"
      :modal-append-to-body="false"
    >
      <p>你选择了将{{newmMarjor}}专业加入到当前当前专业课程组中，同步维护维护专业课程内容的数据；</p>
      <p>这些专业，【{{formInline.grade}}】年级以前维护的数据将给覆盖，确认吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button class="btStyleBox" type="primary" @click="addMajiorMessage =false">再想想,重新选择</el-button>
        <el-button type="primary" @click="outAddMajiorMessage">确 认</el-button>
      </div>
    </el-dialog>

    <div class="cm-table" id="dataTable">
      <ElBigdataTable
        ref="multipleTable"
        :data="showData"
        border
        v-loading="tableLoading"
        :height="tableHeight"
        element-loading-text="加载中..."
        header-row-class-name="cm-dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column label="序号" type="index" fixed></el-table-column>
        <!-- 优化：拖拽排序，这里如果使用tableList数组进行绑定，会出现更新不及时的问题，所以这里暂时先铺开 -->
        <el-table-column label="课程内容" prop="content" width="480"></el-table-column>
        <el-table-column label="授课形式" prop="teachingFormName" width="100"   :filter-method="filterTerm" :filters="teachingFormNames"></el-table-column>
        <el-table-column label="学时" prop="learningHour" width="80"></el-table-column>
        <el-table-column
          label="学期"
          prop="termName"
          :filters="termNames"
          :filter-method="filterTerm"
          width="86"
        ></el-table-column>
        <!-- <el-table-column label="学时" prop="learningHour" width="80"></el-table-column> -->
        <el-table-column label="选用" prop="checked" width="80">
          <template slot="header" slot-scope="scope">
              <el-checkbox v-model="checkedAll" @change="saveCheckedAllContents" :disabled="substuat==1">选用</el-checkbox>
          </template>
          <template scope="scope">
            <div style="display: flex; justify-content: center;">
              <el-checkbox v-model="scope.row.checked" @change="saveCheckedContents(scope.row)" :disabled="substuat==1"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="科室" prop="adminDepartmentId">
          <template
            slot-scope="scope"
          >{{scope.row.adminDepartmentId | showDepartmentName(departmentList)}}</template>
        </el-table-column>
        <el-table-column label="老师优先级" prop="teacherPriority"></el-table-column>
        <el-table-column label="场地优先级" prop="placePriority"></el-table-column>
        <el-table-column label="是否有隐私" prop="privacy" width="96">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center;">
              {{ scope.row.privacy | boolean2String }}
            </div>
          </template>
        </el-table-column>
      </ElBigdataTable>
      <div style="display: flex;
    flex-wrap: wrap;" v-if="termslist.length>0">
        <p v-for="(item,index) in termslist" :key="index">
          第{{item.semesternumber}}学期:计划学时
          <span
            :class="{hoursize:duibi(item)}"
          >{{item.plantheoryhours}}/{{item.plannovitiatehours}}</span>
          已安排学时
          <span
            :class="{hoursize:duibi(item)}"
          >{{item.actualtheoryhours}}/{{item.actualnovitiatehours}}</span>
          &nbsp; &nbsp; &nbsp;
        </p>
      </div>
      <div v-else>未计划</div>
    </div>

    <div>
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
        <el-form :model="batchSetDepartmentDialog" width="100%">
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

      <el-dialog
        width="380px"
        title="专业课程内容复制"
        :visible.sync="copydialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
      >
        <el-form :inline="true" width="100%" v-model="copyeobj">
          <el-form-item label="从年级">
            <intelligent-year-picker
              size="mini"
              :clearable="false"
              v-model="copyeobj.oldYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年级"
            ></intelligent-year-picker>
          </el-form-item>
          <el-form-item label="复制到">
            <intelligent-year-picker
              size="mini"
              :clearable="false"
              v-model="copyeobj.newYear"
              type="year"
              value-format="yyyy"
              placeholder="选择年级"
            ></intelligent-year-picker>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="mini" @click="copydialog = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="iscopy()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 进度表课时校对 -->
    <el-dialog title="进度表课时校对" :visible.sync="showCheckSchedule" width="800px" 
        append-to-body top="10vh" :close-on-click-modal="false">
        <p style="font-size: 16px;padding-bottom:10px;">授课形式学时不匹配</p>
        <el-table :data="checkList1" max-height="350" size="mini" border>
            <el-table-column prop="teaching_form_name" label="授课形式"></el-table-column>
            <el-table-column prop="content_row_num" label="内容条数"></el-table-column>
            <el-table-column prop="row_num" label="进度表条数"></el-table-column>
            <el-table-column prop="content_hours" label="内容总学时"></el-table-column>
            <el-table-column prop="schedule_hours" label="课表总学时"></el-table-column>
        </el-table>
        <p style="font-size: 16px;padding: 20px 0 10px;">内容异常</p>
        <el-table :data="checkList2" max-height="350" size="mini" border>
            <el-table-column prop="abnormal_type" label="异常类型" width="180"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="teaching_form_name" label="授课形式"  width="80"></el-table-column>
            <el-table-column prop="learning_hour" label="学时" width="50"></el-table-column>
        </el-table>
    </el-dialog>

    <!-- 批量设置tab页 -->
    <el-dialog
      
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
          <el-form :model="batchSetDepartmentDialog" :inline="true" width="100%">
            <el-form-item label="科室" prop="department">
              <el-select
                v-model="batchSetDepartmentDialog.department"
                value-key="id"
                filterable
                width="100%"
                size="mini"
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
              <el-select
                v-model="batchSetDepartmentDialog.term"
                value-key="id"
                filterable
                width="100%"
                size="mini"
              >
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
    <el-dialog title="提示" :visible.sync="sureSubmit" v-if="sureSubmit" append-to-body width="500px">
      <div>
        <p v-for="err in errorList">
          第{{ err.semesternumber }}学期，标准学时是
          <span class="redStyle">{{ err.plantheoryhours }}/{{ err.plannovitiatehours }}</span>，
          您提交的内容库学时是
          <span class="redStyle">{{ err.actualtheoryhours }}/{{ err.actualnovitiatehours }}</span>;
        </p>
        学时有差异,不同专业实际上课学时与标准学时允许有差异，以您提交的内容库学时为准，确认要提交吗？</div>
      <div style="text-align:right;padding-top: 30px;">
        <el-button @click="sureSubmit=false" size="medium">取消</el-button>
        <el-button @click="updateStatus(1)" size="medium" type="primary">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from "@/util";
import teacherPrioritySetting from "./teacher_priority_setting_componment";
import placePrioritySetting from "./place_priority_setting_componment";

export default {
  name: "ProfessionCourseContentTable",
  components: {
    teacherPrioritySetting,
    placePrioritySetting
  },
  props: {
    courseId: {
      value: Number,
      default: 0
    },
    yearId: {
      value: Number,
      default: 0
    },
    platformId: {
      value: Number,
      default: 0
    },
    majorName: {
      value: String,
      default: ""
    },
    majorId: {
      value: String,
      default: ""
    },
    terms: {
      value: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    var date = new Date();
    return {
      // 进度表课时校对
      showCheckSchedule: false,
      checkList1:[],
      checkList2:[],
      loadCheckSchedule:false,

      loadingContent: '',
      currentTerm: {}, // 当前学期
      checkedAll: false, // 全选
      newId: "",
      tableHeight: (window.innerHeight - 300),
      sCoursePlatformIds: "",
      newNameTitle: [], //适用专业集合
      submitTips: "",
      showTitle: false,
      newmMarjor: [],
      newSeleteList: [],
      addNewData: "",
      titleName: "",
      addMajiorMessage: false,
      substuat: 1, //提交状态
      showtuat: true,
      outerVisible: false,
      innerVisible: false,
      signOutDialog: false, //退出弹窗
      majorTableList: [], //适用专业弹窗列表
      majorData: [],

      ifquanddeng: false,
      formInline: {
        grade: date.getFullYear() + "",
        hours: "2",
        minute: "20"
      },
      copyeobj: {
        oldYear: "",
        newYear: ""
      },
      copydialog: false,
      termslist: [],
      showAll: "true",
      tableData: [],
	  copyTableDate: [],
      professionCoursesTableData: [],
      tableLoading: false,
      departments: [],
      departmentList: [],
      multipleSelection: [],

      // 对话框
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
        term: {},
        close: function() {
          this.visible = false;
        }
      },
      batchSetTabDialog: {
        visible: false,
        activeName: "first"
      },
      sureSubmit:false,
      errorList:[]
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
    showData: function() {
      //老师优先级数据
      if (this.showAll == "true") {
        return this.tableData;
      }
      return this.tableData.filter(t => t.checked == true);
    },

    disabledBatchCommand() {
      if (Array.isArray(this.multipleSelection)) {
        return this.multipleSelection.length <= 0;
      }
      return false;
    }
    // ifquanddeng(){

    //       this.updateStatus()

    // }
  },
  watch: {},
  created() {
  
    
    this.$http.get(`_op:/terms/current`).then((resp) => {
      this.currentTerm = resp.data;
    }).catch((err) => {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 9) {
        year = year - 1;
      }
      this.currentTerm.year = year;
      this.currentTerm.orderNum = (month < 9) ? 2: 1;
      this.refresh();
      this.getDepartments();
    })
    // this.tableHeight = window.clientHeight - document.querySelector('#dataTable').offsetTop - 330;
  },

  mounted() {
  },

  methods: {
    dialogClose() {
      //关闭弹窗时重置数据
      this.$refs.formInline.resetFields();
    },
    checkSchedule(){
      this.loadCheckSchedule = true;
      this.checkList1 = [];
      this.checkList2 = [];
      let query = {
          semester_year: this.currentTerm.year,
          semester_year_number: this.currentTerm.orderNum,
          type: 2,
          curriculum_visual_id: 0,
          semester_course_id: this.sCoursePlatformIds,
          grade: +this.formInline.grade,
      }
      this.$http.post('_ed:/scheduleVisualizing/checkScheduleItemContent', query).then(res => {
          this.loadCheckSchedule = false;
          if(res.code == 0){
              let checkList = JSON.parse(res.data);
              if(checkList.hours_dif && JSON.stringify(checkList.hours_dif) != '[{}]'){
                  this.checkList1 = checkList.hours_dif[0];
              }
              if(checkList.content_dif && JSON.stringify(checkList.content_dif) != '[{}]'){
                  this.checkList2 = checkList.content_dif[0];
              }
              this.showCheckSchedule = true;
          }
      }).catch(err => {
          console.log(err)
      })
    },
    // /coursePlatformUnion/checkTermHours/{sCoursePlatformId}/{year}
    getCourselibrary() {
      this.$http
        .get(
          "_op:/coursePlatformUnion/checkTermHours/" +
            this.newId +
            "/" +
            this.formInline.grade
        )
        .then(data => {
       
          this.submitTips = data.data;
          if (data.data.length > 0) {
            this.showTitle = true;
          }
          if (data.data.length == 0) {
            this.showTitle = false;
          }
        });
    },

    // 适用专业弹窗  获取列表
    showDialog() {
      let year = this.formInline.grade;
      this.$http
        .get(
          "_ed:/report/trainplan/getPlanHoursDetail" +
            "/" +
            this.newId +
            "/" +
            year
        )
        .then(data => {
        
          let array = data.data;
          array.forEach(element => {
            this.newNameTitle.push(element.majorname);
            this.newNameTitle = Array.from(new Set(this.newNameTitle));
          
          });
          this.majorTableList = data.data;
        });
    },
    // 适用专业弹窗列表
    getmajorTableList() {
      this.platformId + "/" + this.formInline.grade;
     

      let params = {
        courseId: this.courseId,
        
        scoursePlatformId: this.newId,
        year: year
      };
      this.$http
        .post("_op:/coursePlatformUnion/getMergeMajor", params)
        .then(data => {
          // (data,"适用专业请求列表")
        });
    },
    //  退回
    signOut(row) {
      this.rat = row;
   
      this.titleName = row.majorname;
      this.signOutDialog = true;
    },
    //  退出确定
    outdMajor(row) {
   
      //  majorname
      this.titleName = this.rat.majorname;
      let params = {
        coursePlatformIdList: [this.rat.courseplatformid],
        mergeOrSplit: 1,
        scoursePlatformId: this.newId,
        year: this.formInline.grade
      };
     
      this.$http
        .post("_op:/coursePlatformUnion/updateCoursePlatformId", params)
        .then(data => {
          if (data.code == 0) {
            this.signOutDialog = false;
            //  this.outerVisible=false;
            this.refresh();
            //  this.getmajorTableList();//刷新列表， getmajorTableList
          }
        });
    },
    //  勾选的参数
    seletetData(row) {
    
      this.newSeleteList.push(row.coursePlatformId);
      this.newmMarjor.push(row.majorName);
     
      this.addNewData = row.coursePlatformId;
    },
    //  新增适用专业
    addApplyMajor(row) {
    
      this.addMajiorMessage = true;
    },
    //  新增专业，提交信息提示弹窗
    outAddMajiorMessage(row) {
      this.addMajiorMessage = false;
      let that = this;
      this.addMajiorMessage = true;
      let params = {
        coursePlatformIdList: this.newSeleteList,
        mergeOrSplit: 0,
        // scoursePlatformId:this.platformId,
        scoursePlatformId: this.newId,
        year: this.formInline.grade
      };
      this.$http
        .post("_op:/coursePlatformUnion/updateCoursePlatformId", params)
        .then(data => {
          if (data.code == 0) {
            this.addMajiorMessage = false;
            this.innerVisible = false;
            this.showDialog(); //刷新列表
          }
        });
    },

    // 点击新增。请求新增列表---需要合并的列表  /coursePlatformUnion/getMergeMajor
    getAddDataDialog() {
      this.innerVisible = true;
      let params = {
        courseId: this.courseId,
        scoursePlatformId: this.newId,
        year: this.formInline.grade
      };
      this.$http
        .post("_op:/coursePlatformUnion/getMergeMajor", params)
        .then(data => {
          this.majorData = data.data;
        
        });
    },
    // 请求课程总ID
    getSumplatformId() {
      this.$http
        .get(
          "_op:/coursePlatformUnion/getByScoursePlatFormId" +
            "/" +
            this.platformId +
            "/" +
            this.formInline.grade
        )
        .then(data => {
       
          if (data.data == null || data.data == "") {
            this.newId = this.platformId;
            // this.getProfessoinContents(this.platformId,this.formInline.grade)
          } else {
            this.newId = data.data;
            // this.getProfessoinContents(data.data,this.formInline.grade);
          }
          this.getContents(this.courseId, this.yearId, this.formInline.grade)

          this.getCourselibrary();
          this.gethours();
          this.showDialog();
        });
    },

    duibi(item) {
      if (
        item.plantheoryhours == item.actualtheoryhours &&
        item.plannovitiatehours == item.actualnovitiatehours
      ) {
        return false;
      } else {
        return true;
      }
    },
    duibiSytle(item) {
      if (item.red == 0) {
        return false;
      } else {
        return true;
      }
    },
    backstuats() {
      // let query = {
      //     coursePlatformId:this.platformId,
      //     status:0,
      //     year:this.formInline.grade
      // }
      // this.$http.post('_op:/coursePlatformYear/updateStatus',query).then(res=>{
      //     if(res.code==0){
      //       this.$message({
      //         message: '撤回成功!',
      //         type: 'success'
      //       });
      //     }else{
      //       this.$message.error(res.msg);
      //     }
      //     this.refresh()
      // })
      this.updateStatus(0); // 撤回
    },
    updateStatus(status) {
      let query = {
        coursePlatformId: this.newId,
        status: status,
        year: this.formInline.grade
      };
      console.info("submit status");
      const loading = this.$loading({
          lock: true,
          text: "数据提交中...",
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http
        .post("_op:/coursePlatformYear/updateStatus", query)
        .then(res => {
          if (res.code == 0) {
            // this.$message({
            //   message: "提交成功!",
            //   type: "success"
            // });
            loading.close();
            if(status==1){
              this.$message({
                message: "提交成功!",
                type: "success"
              });
              this.sureSubmit=false;
            }
            if(status==0){
              this.$message({
                message: "撤回成功!",
                type: "success"
              });
            }
            
          } else {
            loading.close();
            this.$message.error(res.msg);
          }
          this.refresh();
        });
    },
    substuats() {
      let find = this.tableData.find(item => item.checked == true);
      if(typeof find === 'undefined'){
        this.$message.warning("未选用课程，请选用课程后再提交");
        return;
      }
      if(this.submitTips.length > 0) {
        this.$message.error("本课程下多个专业的计划学时不一致，请修正后再提交！");
        return;        
      }

      this.gethours(() => {
        this.errorList = [];
        if (this.termslist.length <= 0) {
          this.$message.warning("未安排学时，请安排学时后再提交");
          return;
        }
        
        if(this.termslist.length > 0) {
          this.termslist.map(item => {
              if (
                item.plantheoryhours !== item.actualtheoryhours ||
                item.plannovitiatehours !== item.actualnovitiatehours
              ) {
                this.errorList.push(item);
              }
          });
          if(this.errorList.length){
            this.sureSubmit = true;
          }else{
            this.updateStatus(1)
          }
        }
      })
    },
    iscopy(done) {
      this.$confirm(
        `你选择了将${this.copyeobj.oldYear}级的内容复制到${
          this.copyeobj.newYear
        }级，原先录入${this.copyeobj.newYear}级的内容将被覆盖，确认吗？`
      )
        .then(_ => {
          let query = {
            coursePlatformId: this.newId,
            oldYear: this.copyeobj.oldYear,
            newYear: this.copyeobj.newYear
          };

          this.$http
            .post("_op:/coursePlatform/copyCoursePlatformContent", query)
            .then(res => {
              if (res.code == 0) {
                this.copydialog = false;
                this.$message({
                  message: "复制成功!",
                  type: "success"
                });
                this.formInline.grade = this.copyeobj.newYear;
                this.refresh();
              } else {
                this.$message.error(res.msg);
                this.copydialog = false;
              }
            })
            .catch(err => {
              this.copydialog = false;
            
            });
        })
        .catch(_ => {
          this.copydialog = false;
        });
    },

    opencopydalong() {
      //打开负责的弹框
      this.copydialog = true;
    },
    gethours(callback) {
      this.termslist = [];
      let query = {
        coursePlatformId: this.newId,
        grade: this.formInline.grade,
        majorId: this.majorId
      };
       this.$http
        .post("_ed:/report/trainplan/getHours", query)
        .then(res => {
          if (res.data != null && res.data.length > 0) {
            var temp = res.data.sort((a, b) => a.semesternumber - b.semesternumber)
            this.termslist = temp;
            // this.termslist = res.data;
          } else {
            this.termslist = [];
          }
          if (typeof(callback) === 'function') {
            callback();
          }
        })
        .catch(err => {});
      this.getstuats();
    },
    getstuats() {
      this.showtuat = true;
        this.$http
        .get(
          "_op:/coursePlatformYear/getByCoursePlatformIdMajor/" +
            this.newId +
            "/" +
            this.formInline.grade
        )
        .then(res => {
          if (res.data.length > 0) {
            this.substuat = res.data[0].status;
          }
          if (res.data.length == 0) {
            this.substuat = 0;
          }
          this.showtuat = false;
        });
    },
    clearTabledata() {},
    handleClick(tab, event) {
      this.batchSetTabDialog.activeName = tab.name;
     
    },
    saveBatchData() {
      let current = this.batchSetTabDialog.activeName;
      this.updatePriority();
      this.departmentBatchUpdate();

      this.$refs.teacherPrioritySetting.clear();
      this.$refs.placePrioritySetting.clear();
      this.batchSetTabDialog.visible = false;
    },
    selectable(row, index) {
      return row.checked;
    },
    handleSelectionChange(val) {
     
      this.multipleSelection = [].concat(val);
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

    areaPrioritySelected(val) {
      this.batchSetPlacesDialog.selected = [].concat(val);
    },

    teacherPrioritySelected(val) {
      this.batchSetTeachersDialog.selected = [].concat(val);
    },

    termBatchUpdate() {},

    teacherPriorityUpdate() {
      //老师优先级
      this.multipleSelection.forEach(m => {
        m.teachersRel = [].concat(this.batchSetTeachersDialog.selected);
      });

      this.$http({
        method: "post",
        url: `_op:coursePlatform/${this.newId}/${
          this.formInline.grade
        }/content`,
        data: this.multipleSelection
      })
        .then(resp => {
          this.$message.success("批量设置成功");
          this.batchSetTeachersDialog.close();
          this.refresh();
          this.$emit("onchange");
        })
        .catch(resp => {});
    },

    areaPriorityUpdate() {
      //场地优先级
      this.multipleSelection.forEach(m => {
        m.placesRel = [].concat(this.batchSetPlacesDialog.selected);
      });
     

      this.$http({
        method: "post",
        url: `_op:coursePlatform/${this.newId}/${
          this.formInline.grade
        }/content`,
        data: this.multipleSelection
      })
        .then(resp => {
          this.$message.success("批量设置成功");
          this.batchSetPlacesDialog.close();
          this.refresh();
          this.$emit("onchange");
        })
        .catch(resp => {});
    },

    // 更新老师和场地优先级
    updatePriority() {
      this.multipleSelection.forEach(m => {
        if (this.batchSetTeachersDialog.selected.length > 0) {
          m.teachersRel = [].concat(this.batchSetTeachersDialog.selected);
        }
        if (this.batchSetPlacesDialog.selected.length > 0) {
          m.placesRel = [].concat(this.batchSetPlacesDialog.selected);
        }

        if (this.batchSetDepartmentDialog.department.id) {
          m.adminDepartmentId = this.batchSetDepartmentDialog.department.id;
          m.adminDepartmentName = this.batchSetDepartmentDialog.department.name;
        }

        if (this.batchSetDepartmentDialog.term.id) {
          m.termId = this.batchSetDepartmentDialog.term.id;
          m.termName = this.batchSetDepartmentDialog.term.name;
        }
      });

      const loading = this.$loading({
        lock: true,
        text: '处理中',
        spinnner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.7)'
      });
      this.$http({
        method: "put",
        url: `_op:coursePlatform/${this.newId}/${
          this.formInline.grade
        }/content`,
        data: this.multipleSelection
      })
        .then(resp => {
          loading.close();
          this.$message.success("批量设置成功");
          this.batchSetPlacesDialog.close();
          this.batchSetTeachersDialog.close();
          this.refresh();
          this.$emit("onchange");
        })
        .catch(resp => {
          loading.close();
        });
    },

    departmentBatchUpdate() {
      //科室优先级
    },

    getContents(courseId, yearId, grade) {
      this.formInline.grade = grade;
        this.$http({
        method: "post",
        url: "_op:/courseContent/list",
        data: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            courseId: courseId,
            yearId: yearId,
            grade: grade
          }
        }
      })
        .then(resp => {
          if (resp.code == 0) {
            if (Array.isArray(resp.data) && resp.data.length > 0) {
          
              var tempData = resp.data.sort((a, b) => {
                return a.sort - b.sort;
              });
              // 优化2:处理老师优先级和场地优先级
              tempData.forEach(c => {
                c.checked = false;
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
              });
              this.tableData = tempData.concat();
							this.copyTableDate = JSON.parse(JSON.stringify(this.tableData));
            } else {
              this.tableData = [];
            }

            if (this.newId == null || this.newId == "") {
              this.sCoursePlatformIds = this.platformId;
            } else {
              this.sCoursePlatformIds = this.newId;
            }
            this.getProfessoinContents(this.sCoursePlatformIds, this.formInline.grade);
            
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(resp => {
          this.tableLoading = false;
          this.$message.error("请求课程内容数据失败，请刷新页面重试!");
        });
    },

    getProfessoinContents(platformId, grade) {
			this.checkedAll = false;
      this.$http
        .get(`_op:coursePlatform/${platformId}/${grade}/content`)
        .then(resp => {

          this.professionCoursesTableData = [].concat(resp.data);
          if (Array.isArray(this.professionCoursesTableData)) {
            this.professionCoursesTableData.forEach(t => {
              this.tableData.forEach(s => {
                if (s.id == t.id) {
                  s.checked = true;
                  s.teacherPriority = [];
                  s.teachersRel = [].concat(t.teachersRel);
                  if (Array.isArray(s.teachersRel)) {
                    s.teacherPriority = t.teachersRel
                      .sort((a, b) => a.priority - b.priority)
                      .map(tr => tr.teacherName)
                      .join(",");
                  }

                  s.placesRel = [].concat(t.placesRel);
                  if (Array.isArray(t.placesRel)) {
                    s.placePriority = t.placesRel
                      .sort((a, b) => a.priority - b.priority)
                      .map(p => p.areaName)
                      .join(",");
                  }

                  s.termId = t.termId;
                  s.termName = t.termName;
                  s.adminDepartmentId = t.adminDepartmentId;
								}
              });
            });
            this.tableData.push({});
            this.tableData.pop();
						this.tableLoading = false;
						this.checkItemNum();
          }
        })
        .catch(resp => {
          this.tableLoading = false;
          this.$message.error("请求专业课程内容数据失败，请刷新页面重试！");
        });
    },
		checkItemNum(){
			let checkNum = 0;
			this.checkedAll = false;
			this.tableData.map(item => {
				(item.checked) && (checkNum++);
			});
			(checkNum == this.tableData.length) && (this.checkedAll = true);
		},
    saveCheckedAllContents() {
			this.tableData.forEach(d => d.checked = this.checkedAll);
      this.saveCheckedContents({},true);
    },
    
    saveCheckedContents(row={},all=false) {
      var filteredData = this.tableData.filter(d => d.checked == true);
			(row.id) && (this.checkItemNum());
      if (this.newId == null || this.newId == "") {
        this.sCoursePlatformIds = this.platformId;
      } else {
        this.sCoursePlatformIds = this.newId;
      }

      this.loadingContent = this.$loading({lock: true, text: '处理中', spinner: 'el-icon-loading', background: 'rgba(0,0,0,0.7)'});
      this.$http({
        method: "post",
        url: `_op:coursePlatform/${this.sCoursePlatformIds}/${
          this.formInline.grade
        }/content`,
        data: filteredData
      })
        .then(resp => {
					this.reloadItem(row,all);	//不选中时，列表重新渲染
					this.gethours();
          // this.getContents(this.courseId, this.yearId, this.formInline.grade);
        })
        .catch(resp => {
            this.loadingContent.close();
        });
    },
    reloadItem(row,all){
			if(row.id && !row.checked){  //当行操作
        // 在大列表中匹配当前行，并替换
				let list = JSON.parse(JSON.stringify(this.copyTableDate));
				let checkRow = list.filter(item => row.id == item.id);
				for(let i = 0; i < this.tableData.length; i++){
					if(checkRow[0].id == this.tableData[i].id){
						this.$set(this.tableData,i,checkRow[0]);
						break;
					}
				}
			}

			if(all && !this.checkedAll){  //全部取消，用大列表渲染
				let list = JSON.parse(JSON.stringify(this.copyTableDate));
				list.forEach(item => item.checked = false);
				this.tableData = JSON.parse(JSON.stringify(list));
			}

			this.loadingContent.close();
    },
    filterTerm(value, row, column) {
      
      const property = column["property"];
      return row[property] === value;
    },

    refresh() {
     
      this.tableLoading = true;
      this.getSumplatformId(this.platformId,this.formInline.grade);

      this.newNameTitle = [];
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
    }
  }
};
</script>

<style lang="less" scoped>
.styleBox{
  margin-left: 15px;
  // margin-right: 20px;
}
.styleBoxtj{
margin-left: 20px;
}
.styleBoxs{
  margin-left: 15px;

}
.styleBoxx{
  margin-left: 12px;

}
.styleBoxch{
   margin-left: 20px;

}

.bar {
  margin-bottom: 8px;
  padding: 0 20px;

  display: flex;
  justify-content: space-between;

  .info {
    font-size: 14px;
    color: blue;
    // width: 200px;
    text-align: center;
    position: relative;
  }
  .bottomStyle {
    width: 200px;
    height: 0px;
    border: 1px solid #409eff;
  }
  // display: flex;
  // justify-content: space-between;
  // width: 100%;

  // .info {
  //     font-size: 14px;
  //     margin-right: 60px;
  // }
}
.hoursize {
  display: inline-block;
  color: red;
}
.hoursize3 {
  position: absolute;
  display: inline-block;
  color: red;
  width: 326px;
  top: 25px;
  left: 75%;
}
.tableStyle {
  text-align: center;
}
.tableBox {
  border: solid 1px #dcdfe6;
  width: 100%;
}
.tableBox td {
  border: solid 1px #dcdfe6;
  width: 30%;
  height: 30px;
  text-align: center;
}
.tableBox th {
  border: solid 1px #dcdfe6;
  width: 30%;
  height: 30px;
  color: gray;
}
.outDialog {
  color: #409eff;
}
.btStyle {
  margin: 10px;
}
.boxstyle {
  text-align: center;
}
.small-grade  /deep/ .el-date-editor.el-input{
  width: 90px;
}
.bottonstyle {
  margin-top: 20px;
  width: 200px;
  margin-left: 64%;
}
.redStyle {
  color: red;
}
.redStyle1 {
  color: gray;
}
//  .el-form-item .el-form-item--mini{
//    width: 60px;
//  }
//     /deep/  .el-input--mini .el-input__inner  .el-date-picker {
//      width: 60px;
//  }
//  .el-date-picker
//      /deep/ .boxStyle{
//    width: 60px;

//  }
.cm-container /deep/.el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
  // width: 100px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  //  width: 100px;
}
</style>