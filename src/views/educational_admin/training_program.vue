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
      <el-form size="mini" :inline="true" :model="formSearch">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse">
              <el-button type="primary" @click="onSearch(formSearch)">查询</el-button>
            </el-form-item>
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="方案名称">
              <el-input v-model="formSearch.name" maxlength="40" clearable  placeholder="请输入方案名称"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-select v-model="formSearch.major"  clearable filterable>
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in majorArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在级">
              <intelligent-year-picker
                style="width: 100%;"
                v-model="formSearch.grade"
                type="year"
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formSearch.state"  clearable placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option 
                  v-for="list in statusOption"
                  :key="list.value"
                  :label="list.label"
                  :value="list.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn" v-if="btnPerObj.add">
            <el-button size="mini" type="primary" @click="addProgramme">新增</el-button>
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
        v-loading="tableLoading"
        element-loading-text="加载中..."
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <template v-if="item.prop==='create_time'">{{ scope.row.create_time | getTime}}</template>
            <template v-else>{{scope.row[item.prop]}}</template>
          </template>
        </el-table-column>

        <el-table-column
          v-if="btnPerObj.course||btnPerObj.assign||btnPerObj.copy||btnPerObj.view||btnPerObj.delete"
          fixed="right"
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              @click="openCourse(scope.row)"
              type="text"
              size="small"
              v-if="btnPerObj.course"
            >课程详情</el-button>
            <el-button
              @click="assignMission(scope.row)"
              type="text"
              size="small"
              v-if="btnPerObj.assign"
            >下达任务</el-button>

            <el-button
              @click="OnrepliceScheme(scope.row)"
              type="text"
              size="small"
              v-if="btnPerObj.copy"
            >复制方案</el-button>

            <a v-show="false" ref="exportExcel"></a>
            <el-button
              @click="lookEnclosure(scope.row)"
              type="text"
              size="small"
              v-if="btnPerObj.view"
              style="    margin-left: 10px;"
            >查看附件</el-button>

            <el-button
              type="text"
              size="small"
              @click="delTableRows(scope.row)"
              style="color: red;"
              v-if="btnPerObj.delete"
            >删除</el-button>
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
    <!-- 新增方案 -->
    <el-dialog
      top="1vh"
      width="75%"
      :lock-scroll="true"
      title="新增方案"
      :visible.sync="dialog.addVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @closed="dialogClose"
    >
      <div style="display:inline-flex;">
        <div style="width:23%">
          <div style=" padding-right: 20px;">
          <p style="padding-bottom: 10px;">请填写左侧方案信息</p>
          <el-form ref="addForm" :model="addForm" label-width="80px">
            <el-form-item label="专业" prop="major" :rules="rules.rules9">
              <el-select v-model="addForm.major" filterable @change="onMajor" placeholder="请选择专业">
                <el-option
                  v-for="item in majorArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在级" prop="level" :rules="rules.rules1">
              <intelligent-year-picker
                style="width: 100%;"
                v-model="addForm.level"
                type="year"
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="方案名称" prop="name" :rules="rules.rules6">
              <el-input v-model="addForm.name" maxlength="40" placeholder="请输入方案名称"></el-input>
            </el-form-item>
          </el-form>
          <div style="display: flex;font-size: 14px;box-sizing: border-box;">
            <p style="flex-grow: 1;width:70px;margin-top:6px;margin-right: 24px;">上传附件</p>
            <el-upload
              class="upload-demo"
              style="overflow: auto;width: calc(100% - (70px+24px));"
              ref="addupload"
              action="/trainplan/add"
              :file-list="fileList"
              :auto-upload="false"
              :on-remove="onRemove"
              :on-success="uploadOnsuccess"
              :before-upload="onBefore"
              :on-change="choseChange"
              show-file-lis
              :multiple="true"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">上传文件不超过20M</div>
            </el-upload>
          </div>
          </div>
        </div>
        <div  style="width:70%">
          <div style="padding-left: 20px;  border-left: solid 1px #ddd;">
            <p style="padding-bottom: 10px;">配置专业课程信息</p>
            <CourseSelectionComp
              :grade="addForm.level"
              :majorId="addForm.major"
              ref="CourseSelection"
              @onchange="selectedCourseHandler" ></CourseSelectionComp>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 下达任务 -->
    <el-dialog
      width="540px"
      title="下达任务"
      :close-on-click-modal="false"
      :visible.sync="dialog.taskVisible"
      :modal-append-to-body="false"
    >
      <el-form ref="taskForm" :model="taskForm">
        <el-form-item label="专业" :rules="rules.rules3" prop="major" class="flex-form">
          <el-input v-model="taskForm.major" :disabled="true" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="所在级" :rules="rules.rules7" prop="grade" class="flex-form">
          <el-input v-model="taskForm.grade" :disabled="true" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="方案名称" :rules="rules.rules7" prop="name" class="flex-form">
          <el-input v-model="taskForm.name" :disabled="true" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="学期" :rules="rules.rules8" prop="year" class="flex-form">
          <el-select
            v-model="taskForm.year"
            @change="onYearChange"
            style="width: 55%"
            placeholder="全部"
          >
            <el-option
              v-for="item in optionList"
              :key="item.semester_number"
              :label="item.semester_name"
              :value="item.semester_number"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="taskList"
        border
        @selection-change="onSelectionChange"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="selection" width="50" :selectable="onSelectable"></el-table-column>
        <el-table-column
          v-for="(item,index) in taskLable"
          :key="index"
          :property="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirmAssignMission">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增专业课程库"
      :visible.sync="addMajorDialog"
      :modal-append-to-body="false"
      width="460px"
      :close-on-click-modal="false"
      custom-class="cm-dialog-pad"
    >
      <el-form :model="addMajorData" ref="addMajorData" class="addinfo" :rules="rulesMajor">
        <el-form-item label="课程名称" prop="courseIds" :label-width="formLabelWidth">
          <el-select filterable  v-model="addMajorData.courseIds" @change="getType" value-key="id">
            <el-option
              v-for="list in courseNameData"
              :key="list.id"
              :label="list.name"
              :value="list"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类别" class="boxstyle" :label-width="formLabelWidth">
          <el-input v-model="addMajorData.courseCategoryName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="课程性质" prop="courseNatureId" :label-width="formLabelWidth">
          <el-select v-model="addMajorData.courseNatureId">
            <el-option
              v-for="list in courseNatureDada"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成绩计分方式" prop="scoreMethod" :label-width="formLabelWidth">
          <el-select v-model="addMajorData.scoreMethod">
            <el-option
              v-for="list in scoreMethodList"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用专业" prop="majorIds" :label-width="formLabelWidth">
          <el-select multiple v-model="addMajorData.majorIds">
            <el-option
              v-for="list in majorDataList"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-select v-model="value5" multiple placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"         
                      :value="item.value">
                    </el-option>
        </el-select>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMajorDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit(addMajorData)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 复制方案 -->
    <el-dialog
      width="400"
      title="复制方案"
      :visible.sync="dialog.repliceVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :multiple="true"
      append-to-body
      @closed="cancelAction"
      custom-class="cm-dialog-small"
    >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="同专业不同年级复制" name="first">
        <el-form ref="formData" :model="formData">
          <el-form-item label="专业" prop="major" :rules="rules.rules4" class="flex-form">
            <el-input v-model="formData.major" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所在级" class="flex-form" prop="level">
            <intelligent-year-picker
              style="width: 100%;"
              v-model="formData.level"
              type="year"
              value-format="yyyy"
              placeholder="选择年级"
            ></intelligent-year-picker>
          </el-form-item>
          <el-form-item label="方案名称" prop="name" class="flex-form">
            <el-input v-model="formData.name" maxlength="40" placeholder="请填写方案名称"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-upload">
          <span>上传附件</span>
          <el-upload
            class="upload-demo"
            ref="rupload"
            action="/trainplan/copy"
            :file-list="fileList"
            :auto-upload="false"
            :on-remove="onRemove"
            :on-success="uploadOnsuccess"
            :before-upload="onBefore"
            :on-change="choseChange"
            show-file-lis
            :multiple="true"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </div>
        <br>
        <el-checkbox v-model="isChecked">同时复制成绩模型（成绩学期权重、阶段成绩类型比例）</el-checkbox>
        <div style="float: right; margin-top:10px;" class="dialog-footer">
          <el-button @click="cancelAction">取 消</el-button>
          <el-button type="primary" @click="confirmScheme(formData)">确 定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="同年级不同专业复制" name="second">
        <el-form ref="formData1" :model="formData1">
          <el-form-item label="所在级" prop="grade" class="flex-form">
            <intelligent-year-picker
              style="width: 100%;"
              v-model="formData1.grade"
              type="year"
              value-format="yyyy"
              placeholder="选择年级"
            ></intelligent-year-picker>
          </el-form-item>
          <el-form-item label="专业" prop="major" class="flex-form">
            <el-select style="width: 100%;" v-model="formData1.major" placeholder="请选择">
              <el-option v-for="item in majorDataList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方案名称" prop="name" class="flex-form">
            <el-input v-model="formData1.planName" maxlength="40" placeholder="请填写方案名称"></el-input>
          </el-form-item>
        </el-form>
        <div style="float: right; margin-top:10px;" class="dialog-footer">
          <el-button @click="cancelAction1">取 消</el-button>
          <el-button type="primary" @click="confirmScheme1(formData)">确 定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    </el-dialog>
    <!-- 查看附件 -->
    <el-dialog
      title="附件列表"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="dialog.enclosure"
      width="30%"
    >
      <el-table :data="gridData" border header-row-class-name="cm-dark">
        <el-table-column type="index" label="附件" width="60"></el-table-column>
        <el-table-column
          v-for="(item,index) in gridList"
          :key="index"
          :property="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <template v-if="item.prop=='name'">
              <el-button
                @click="jumpEnclosure(scope.row)"
                type="text"
                size="small"
              >{{scope.row.name}}</el-button>
            </template>
            <template v-else>{{scope.row[item.prop]}}</template>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog.enclosure=false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import util from "@/util";
const TYPE = "training-program";
const REMARK = "培养方案";

import { mapState } from "vuex";
import CourseSelectionComp from "./components/course_selection_component";

export default {
  name: TYPE,
  components: {
    CourseSelectionComp
  },
  data() {
    return {
      newPram:null,
      param: {},
      courseNatureList: [
        //状态-1 全部， 0正常开课， 1延期，2提前， 3 增加
        { label: "选修", value: 0 },
        { label: "必修", value: 1 }
      ],
      scoreMethodList: [
        {
          name: "百分制",
          id: "100"
        }
      ], //计分方式
      courseNatureData: [], //?????
      courseNameData: [], //课程名称数据
      courseNatureDada: [], //课程性质数据
      majorDataList: [], //适用专业数据
      rulesMajor: {
        courseIds: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        classHour: [
          { required: true, message: "请输入理论/实践学时", trigger: "change" }
        ],
        credit: [{ required: true, message: "请输入学分", trigger: "blur" }],
        courseNatureId: [
          { required: true, message: "请输入课程性质", trigger: "change" }
        ],
        scoreMethod: [
          { required: true, message: "请输入成绩计分方式", trigger: "change" }
        ],
        majorIds: [
          { required: true, message: "请输入适用专业", trigger: "change" }
        ]
      },
      formLabelWidth: "140px",
      addMajorData: {
        courseCategoryId: "", //课程列表ID
        courseId: "", //课程
        classHour: "", //学时
        theoryHour: 0, //理论
        practiceHour: 0, //实践
        credit: "", //课程学分
        courseNatureId: "", //课程性质
        majorIds: [], //专业
        scoreMethod: "", //成绩计分方式
        status: 1 //1-启用，0-禁用
      },
      activeName: 'first',
      addMajorDialog: false, //新增专业弹窗
      checkList: [],
      choiceList: [],
      deleteList: [],
      optionList: [],
      majorArr: [],
      tableRow: "",
      fileList: [],
      formData1: {
        grade:'',
        major: '',
        planName: ''
      },
      onSelectionVal: [],
      uploadForm: new FormData(),
      categoryOption: [], //课程类别
      breadcrumb: [{ label: "教务管理" }, { label: REMARK }],
      _upload_data: {},
      _addUpload_data: {},
      statusOption: [
        { label: "未下达", value: 0 },
        { label: "部分下达", value: 1 },
        { label: "全部下达", value: 2 }
      ],
      rules: {
        rules1: { required: true, message: "所在级不能为空", trigger: "blur" },
        rules2: {
          required: true,
          message: "课程类别不能为空",
          trigger: "change"
        },
        rules3: { required: true, message: "专业不能为空", trigger: "change" },
        rules4: { required: true, message: "专业不能为空", trigger: "blur" },
        rules5: { required: true, message: "请选择课程", trigger: "change" },
        rules6: { required: true, message: "请填写方案名称", trigger: "blur" },
        rules7: { required: true, message: "请填写所在级", trigger: "blur" },
        rules8: { required: true, message: "请选择学期", trigger: "change" },
        rules9: { required: true, message: "请选择专业", trigger: "change" }
      },
      isChecked: true,
      loadingTerm: false,
      tableLoading: false,
      dialog: {
        addVisible: false,
        taskVisible: false,
        repliceVisible: false,
        enclosure: false
      },
      addForm: {
        major: "",
        level: "",
        name: "",
        category: ""
      },
      formSearch: {
        name: "",
        major: "",
        grade: "",
        state: ""
      },
      formData: {
        major: "",
        level: "",
        name: ""
      },
      taskForm: {
        major: "",
        grade: "",
        name: "",
        year: ""
      },
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      tableList: [
        { label: "方案名称", prop: "name"  , width:300 },
        { label: "所在级", prop: "grade" , width:100},
        { label: "专业", prop: "major_name"  , width:300},
        { label: "状态", prop: "publish_status" , width:120},
        { label: "创建人", prop: "create_username" },
        { label: "创建日期", prop: "create_time" }
      ],
      gridList: [
        { label: "附件名称", prop: "name", width: 240 },
        { label: "文件类型", prop: "suffix" }
      ],
      gridData: [],
      taskLable: [
        { label: "学期", prop: "semester_name" },
        { label: "课程名称", prop: "course_name" }
      ],
      courseList: [
        { label: "课程", prop: "courseName" },
        { label: "学时", prop: "totalClassHour", width: 50 }
      ],
      taskList: [],
      addCourseList: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      tableData: [],
      courseData: [],
      userId: util.getStorage("loginId"),
      userName: util.getStorage("loginName"),
      btnPerObj: {
        //按钮权限
        add: false,
        course: false,
        assign: false,
        copy: false,
        view: false,
        delete: false
      },
      url: ""
    };
  },
  created() {
   
    // if(this.$route.query.row){
    //   let aaa = JSON.parse(this.$route.query.row)
    //    console.log('需要的参数',aaa)

       
      
    //    this.formSearch.name=this.newPram.name;
    //    this.formSearch.major=this.newPram.major_id;
    //    this.formSearch.grade= JSON.stringify(aaa.grade);
      
    //      switch ( aaa.publish_status) {
    //               case "全部状态":
    //                 aaa.publish_status = -1;
    //                 break;
    //               case 0:
    //                  aaa.publish_status = 0;
    //                 break;
    //               case "部分下达":
    //                  aaa.publish_status = 1;
    //                 break;
    //               case  "全部下达":
    //                  aaa.publish_status = 2;
    //                 break;
    //             }
                
    //    this.formSearch.state=aaa.publish_status;
    //    console.log('状态', this.formSearch.state)
    //    console.log('canshu',this.formSearch.name,this.formSearch.major,this.formSearch.grade,this.formSearch.state)
    //    this.newPram
    //   this.getTableData( this.formSearch.name,this.formSearch.major,this.formSearch.grade,this.formSearch.state);
    // }
   
    this.getTableData();
    this.getCourseType();
    this.getMajorList();
    this.getcourseNameData(); //课程名称数据获取
    this.getCourseNatureData(); //获取课程性质数据
    this.getMajorDataList(); //获取适用专业数据
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };

    util.openBtnPermit(this.btnPerObj);
    //          this.getBtnPermit();
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    }
  },
  methods: {
    getType() {
      this.addMajorData.courseCategoryName = this.addMajorData.courseIds.courseCategoryName;
    },
    //新增专业课程库-----课程名称获取
    getcourseNameData() {
      //  let params ={
      //           pageNo: this.pageNo,
      //           pageSize: this.pageSize,
      //           param:this.param
      //  }
      this.$http
        .get("_op:course/combox")
        .then(data => {
          this.courseNameData = data.data;
          // console.log(data, "获取课程名称");
        })
        .catch(() => {
          this.courseNatureData = [];
        });
    },
    // dicts/getDictsList  课程性质数据接口
    // courseNatureDada
    //新增专业课程库-----课程性质数据查询
    getCourseNatureData() {
      let params = {
        type: "course-nature"
      };
      this.$http
        .post("_op:dicts/getDictsList", params)
        .then(data => {
          this.courseNatureDada = data.data;
          // console.log(data, "获取-----课程性质");
        })
        .catch(() => {
          this.courseNatureDada = [];
          // console.log(66666);
        });
    },
    //major/combox  适用专业数据请求
    // majorDataList
    getMajorDataList() {
      this.$http.get("_op:major/combox").then(data => {
        if (data.code == 0) {
          this.majorDataList = data.data;
          // console.log(data, "适用专业数据");
        }
      });
    },

    // 新增专业课程库

    addSubmit(addMajorData) {
      // console.log(addMajorData, "新增传参数");
      this.addMajorData.courseId = this.addMajorData.courseIds.courseId;
      this.addMajorData.courseCategoryId = this.addMajorData.courseIds.courseCategoryId;
      this.$refs.addMajorData.validate(valid => {
        if (valid) {
           let option = util.cloneObj(this.addMajorData);
            if (option.classHour.indexOf("/") === -1) {
              option.classHour += "/";
            }
            option.classHour = option.classHour.split("/");
            option.theoryHour = option.classHour[0] || 0;
            option.practiceHour = option.classHour[1] || 0;
            delete option.classHour;
            this.addMajorData=option;
          this.$http
            .post("_op:coursePlatform", this.addMajorData)
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: "新增专业课程成功",
                  type: "success"
                });
                this.addMajorDialog = false;
                this.$refs.CourseSelection.getCoursePlatform(
                  this.addMajorData.courseCategoryId,
                  this.addMajorData.courseId
                  // this.addForm.major
                ); //
              } else {
                this.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            });
        }
      }); 
    },

    //新增专业课程
    addMajor() { 
        for( let key in this.addMajorData){
            this.addMajorData[ key ] = '';
        }
      this.addMajorDialog = true;
    },

    selectedCourseHandler(val) {
      this.addCourseList = [].concat(val);
    },

    getBtnPermit() {
      //获取按钮权限
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "add_peiyangfangan") {
              //新增方案
              self.btnPerObj.add = true;
            }
            if (item.code == "course_detail") {
              //课程详情
              self.btnPerObj.course = true;
            }
            if (item.code == "assign_mission") {
              //下达任务
              self.btnPerObj.assign = true;
            }
            if (item.code == "copy_fangan") {
              //复制方案
              self.btnPerObj.copy = true;
            }
            if (item.code == "view_attachment") {
              //查看附件
              self.btnPerObj.view = true;
            }
            if (item.code == "del_peiyangfangan") {
              //删除
              self.btnPerObj.delete = true;
            }
          });
        })
        .catch(() => {});
    },
    handleClick() {
      this.formData1.grade =  ""
      this.formData1.planName = ""
      this.formData1.major = ""
      if(this.activeName == 'second') {
        this.getMajorDataList()
      }
    },
    confirmScheme1() {
      let userId = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
      this.$http.post('_op:/approve/pTransCom', {
        id:this.tableRow.id,
        type:10001,
        extend: JSON.stringify({grade:this.formData1.grade,major:this.formData1.major,train_plan_name:this.formData1.planName}),
        user_id:userId
      }).then(res => {
        if(res.code == 0) {
          this.dialog.repliceVisible = false;
          this.onSearch()
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    onSearch(form) {
        this.pageNo = 1;
        let condition = {
          name: this.formSearch.name,
          grade: this.formSearch.grade,
          major_id: this.formSearch.major,
          publish_status: this.formSearch.state,
          request_page: 1,
          page_size: this.pageSize
        }
      localStorage.setItem("condition",JSON.stringify(condition)) //存储名字为name值为Amy的变量
      this.getTableData();
    },
    dialogClose() {
      this.courseData = [];
      this.fileList = [];
      this.addForm.category = "请选择课程类别";
      this.dialog.addVisible = false;
      this.choiceList = [];
      this.$refs.addForm.resetFields();
      this.$refs.addupload.clearFiles();
    },
    cancelAction1() {
      this.fileList = [];
      this.$refs.formData1.resetFields();
      this.dialog.repliceVisible = false;
    },
    cancelAction() {
      this.fileList = [];
      this.$refs.formData.resetFields();
      this.$refs.rupload.clearFiles();
      this.dialog.repliceVisible = false;
    },
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getTableData();
    },
    currentChange(current) {
      this.pageNo = current;
      this.getTableData();
    },
    onMajor() {
      //选择专业把已选的课程清空
      if (this.choiceList) {
        this.choiceList = [];
      }
    },

    addProgramme() {
      if (this.$refs.CourseSelection) {
        this.$refs.CourseSelection.reset();
      }
      this.dialog.addVisible = true;
    },
    onBefore(file) {
      let size = file.size / 1204 / 1204 < 20;
      if (!size) {
        this.$message.warning("上传的文件大小不能超过20M！");
      }
      return size;
    },
    //做两次提示
    choseChange(file, fileList) {
      this.fileList = fileList;
      let size = file.size / 1204 / 1204 < 20;
      if (!size) {
        this.$message.warning("上传的文件大小不能超过20M！");
      }
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    addConfirm() {
      if (!this.addForm.major) {
        this.$message.warning("请选择专业！");
        return;
      }
      if (!this.addForm.level) {
        this.$message.warning("请选择所在级！");
        return;
      }
      if (!this.addForm.name) {
        this.$message.warning("请填写方案名称！");
        return;
      }
      if (this.addCourseList.length == 0) {
        this.$message.warning("请添加课程！");
        return;
      }

      let newForm = new FormData();

      this.uploadForm = newForm;

      this.uploadForm.append(
        "_upload_data",
        this.addUpload_Data._addUpload_data
      );

      for (var i = 0; i < this.fileList.length; i++) {
        this.uploadForm.append("file_" + i, this.fileList[i].raw);
      }
      this.$http.post("_ed:/trainplan/add", this.uploadForm).then(data => {
        let type = "success";
        let message = "新增成功！";
        if (data.code == 0) {
          this.dialog.addVisible = false;
          this.getTableData();
          this.$refs.addupload.clearFiles();
          this.choiceList = [];
          this.fileList = [];
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
    uploadOnsuccess(response, file, fileList) {
      // console.log(file)
      if (response.code == 0) {
        this.$refs.rupload.clearFiles();
        this.$refs.addupload.clearFiles();
        this.$message({
          message: "上传成功",
          type: "success"
        });
      } else {
        this.$message.error(response.msg);
      }
    },
    onSelectionChange(val) {
      console.info(val);
      this.onSelectionVal = val;
    },
    cancel() {
      this.dialog.taskVisible = false;
      // this.taskForm.year = "";
      this.taskList = [];
    },
    confirmAssignMission() {
      if (this.onSelectionVal.length == 0) {
        this.$message.warning("请选择下达的课程！");
        return;
      }
      var ids = [];
      this.onSelectionVal.forEach(element => {
        ids.push(element.id);
      });
      console.info(ids);
      this.$http
        .post("_ed:/teachtask/publish", {
          // idlist: this.onSelectionVal
          idlist: ids
        })
        .then(data => {
          let type = "success";
          let message = "方案下达成功！";
          if (data.code == 0) {
            this.dialog.taskVisible = false;
            // this.taskForm.year = "";
            this.taskList = [];
            this.getTableData();
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
    confirmScheme(datas) {
      if (!this.formData.level) {
        this.$message.warning("请选择所在级！");
        return;
      }
      if (!this.formData.name) {
        this.$message.warning("请填写方案名称！");
        return;
      }
      let newForm = new FormData();
      this.uploadForm = newForm;

      this.uploadForm.append("_upload_data", this.upload_Data._upload_data);

      for (var i = 0; i < this.fileList.length; i++) {
        this.uploadForm.append("file_" + i, this.fileList[i].raw);
      }
      this.$http.post("_ed:/trainplan/copy", this.uploadForm).then(data => {
        let type = "success";
        let message = "复制成功！";
        if (data.code == 0) {
          this.dialog.repliceVisible = false;
          this.getTableData();
          this.fileList = [];
          this.$refs.rupload.clearFiles();
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
    openCourse(row) {
 
      console.log(row, "跳转详情");
      this.$router.push({
        path: "/educational_admin/course_details",
        query: { row: JSON.stringify(row) }
      });
     
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    handleSelectionChange(val) {
      this.checkList = val;
    },
    addRight() {
      this.deleteList = [];
      this.addCourseList = [];
      if (this.checkList.length > 0) {
        this.choiceList = this.choiceList.concat(this.checkList);
        for (let i = this.courseData.length - 1; i >= 0; i--) {
          for (let j = this.checkList.length - 1; j >= 0; j--) {
            if (this.courseData[i] == this.checkList[j]) {
              this.courseData.splice(i, 1);
            }
          }
        }
        for (let list of this.choiceList) {
          this.addCourseList.push(list.id);
        }
      }
    },
    deletedRight() {
      this.addCourseList = [];
      for (let i = this.deleteList.length - 1; i >= 0; i--) {
        for (let j = this.choiceList.length - 1; j >= 0; j--) {
          if (this.deleteList[i].id == this.choiceList[j].id) {
            this.choiceList.splice(j, 1);
          }
        }
      }
      for (let list of this.choiceList) {
        this.addCourseList.push(list.id);
      }
      this.courseData = this.courseData.concat(this.deleteList);
      this.deleteList = [];
    },
    assignMission(row) {
     
      this.taskForm.major = row.major_name;
      this.taskForm.grade = row.grade;
      this.taskForm.name = row.name;
      this.dialog.taskVisible = true;
      this.getSemesters(row);
      this.rowid = row.id;
      // this.getCourseDetails(this.rowid,this.taskForm.year);
    },
    onYearChange(selVal) {
      this.getCourseDetails(selVal);
    },
    onSelectable(row, index) {
      for (let i = 0, len = this.taskList.length; i < len; i++) {
        if (row.publish_status == 0 && i == index) {
          return true;
        }
      }
    },
    OnrepliceScheme(row) {
      this.activeName = 'first'
      this.tableRow = row;
      this.formData.major = row.major_name;
      this.dialog.repliceVisible = true;
    },
    lookEnclosure(row) {
      //查看附件
      //获取附件列表
      this.$http.get("_ed:/trainplan/attachments/" + row.id).then(data => {
        if (data.code == 0) {
          let type;
          let message;
          let dataList = data.data === null ? [] : data.data;

          // console.log("请求的数据", dataList);
          if (dataList.length > 0) {
            // if (dataList.length == 1) {
            //   for (let item of dataList) {
            //     if (item.suffix == "zip") {
            //       this.$message.warning("此文件不能查看！");
            //     } else {
            //       let a = document.createElement("a");
            //       let url = dataList[0].src;
            //       a.href = url;
            //       a.setAttribute("download", `${item.name}.xlsx`);
            //       a.click();
            //       window.URL.revokeObjectURL(a.href);
            //     }
            //   }
            // } else {
            this.gridData = dataList;
            this.dialog.enclosure = true;
            // }
          } else {
            this.$message.warning("没有要查看的附件！");
          }
        } else {
          this.$message.error(data.msg);
        }
        // let url = window.URL.createObjectURL(new Blob([data]));
        // let y = this.$refs.exportExcel;
        // y.href = url;
        // y.setAttribute("download", "导出文件.xlsx");
        // y.click();
        // window.URL.revokeObjectURL(url);
      });
    },
    jumpEnclosure(row) {
      //多个附件查看

      let a = document.createElement("a");
      let url = dataList[0].src;
      a.href = row.src;
      a.click();
      // if (row.suffix == "zip") {
      //   this.$message("此文件不能查看！");
      // } else {
      //   this.$router.push({
      //     path: "/educational_admin/enclosure",
      //     query: { src: JSON.stringify(row) }
      //   });
      // }
    },
    delTableRows(row) {
      this.$confirm(
        `此操作将永久删除方案 "${row.name}" 的信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete("_ed:/trainplan/delete/" + row.id).then(data => {
            let message = "删除成功!";
            let type = "success";
            if (Number(data.code) === 0) {
              if (this.tableData.length == 1) {
                this.pageNo = 1;
              }
              this.getTableData();
            } else {
              type = "error";
              message = data.msg;
            }
            this.$message({
              type,
              message
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
    getNewTable(){
     this.getTableData(this.$route.query)
    },
    getTableData() {
      let that = this;
      this.tableLoading = true;
      console.info('Condition: ', JSON.parse(localStorage.getItem("condition")));
      var condition = JSON.parse(localStorage.getItem("condition"));
      console.log('2222222222222tag', condition)
      if (!condition) {
        condition = {
          name: this.formSearch.name,
          grade: this.formSearch.grade,
          major_id: this.formSearch.major,
          publish_status: this.formSearch.state,
          request_page: this.pageNo,
          page_size: this.pageSize
        }
      } else {
        condition.request_page = this.pageNo;
        condition.page_size = this.pageSize;
      }
     
      
  
      // let newGrade=JSON.parse(localStorage.getItem("name")).grade;
      // let newmajor_id=JSON.parse(localStorage.getItem("name")).major_id;
      // let newpublish_status=JSON.parse(localStorage.getItem("name")).publish_status;

    //  this.getTableData(newName)
      
      this.$http
        .post("_ed:trainplan/query", {
          name: condition.name,
          grade: condition.grade,
          major_id: condition.major_id,
          publish_status: condition.publish_status,
          request_page: this.pageNo,
          page_size: this.pageSize
        })
        .then(datas => {
           this.formSearch.name=condition.name
            this.formSearch.grade=condition.grade
             this.formSearch.major=condition.major_id
              this.formSearch.state=condition.publish_status
          if (datas.code == 0) {
            this.totalCount = datas.data.total_records;
            this.tableData = datas.data.dataList;
            // this.pageSize  = datas.data.pageSize;
            console.log('tag111', datas.data)
            // this.pageParm = datas.data.total_pages;
            this.tableLoading = false;
            if (this.tableData.length > 0) {
              for (let i = 0, len = this.tableData.length; i < len; i++) {
                this.$set(this.tableData[i], "show", false);
                switch (this.tableData[i].publish_status) {
                  case -1:
                    this.tableData[i].publish_status = "全部状态";
                    break;
                  case 0:
                    this.tableData[i].publish_status = "未下达";
                    break;
                  case 1:
                    this.tableData[i].publish_status = "部分下达";
                    break;
                  case 2:
                    this.tableData[i].publish_status = "全部下达";
                    break;
                }
              }
            }
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(error => {
          this.tableData = [];
          this.tableLoading = false;
        });
    },
    getCourseDetails() {
      /*获取下达任务课程详情*/
      this.taskList = [];
      this.$http
        .get(
          "_ed:trainplan/course/publishinfo/plan/" +
            this.rowid +
            /semester/ +
            this.taskForm.year
        )
        .then(data => {
          if (data.code == 0) {
            console.log('???',this.taskList)
            this.taskList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // 专业数据获取
    getMajorList() {
      this.$http.get("_op:/major/combox").then(data => {
        if (data.code == 0) {
          this.majorArr = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getCourseType() {
      this.$http
        .post("_op:/dicts/getDictsList", {
          type: "course-category"
        })
        .then(datas => {
          if (datas.code == 0) {
            this.categoryOption = datas.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(error => {
          this.categoryOption = [];
        });
    },
    getSemesters(row) {
      /*获取下达任务学期*/
      this.$http
        .get("_ed:/semester/plan/" + row.id)
        .then(data => {
          if (data.code == 0) {
            this.optionList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {
          this.optionList = [];
        });
    }
  },
  computed: {
    ...mapState(["btnPermitList"]),
    addUpload_Data() {
      return {
        _addUpload_data: JSON.stringify({
          name: this.addForm.name,
          grade: this.addForm.level,
          major_id: this.addForm.major,
          create_user: this.userId,
          create_username: this.userName,
          courselist: this.addCourseList
        })
      };
    },
    upload_Data() {
      return {
        _upload_data: JSON.stringify({
          name: this.formData.name,
          id: this.tableRow.id,
          grade: this.formData.level,
          create_username: this.userName,
          create_user: this.userId
        })
      };
    }
  }
};
</script>
<style scoped>
.cm-table /deep/ .el-table__body-wrapper {
  height: 100% !important;
}

.dialog-container {
  display: flex;
  box-sizing: border-box;
  overflow: auto;
}

.dialog-container p {
  padding-bottom: 10px;
}

.dialog-container p span {
  color: red;
}

.dialog-left {
  width: 300px;
  padding-right: 20px;
  border-right: 1px solid #ddd;
}

.dialog-right {
  width: 800px;
  padding-left: 20px;
}

.transfer-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 600px;
  padding: 10px;
  margin: 0 auto;
  overflow: hidden;
}

.transfer-wrapper .list {
  width: 220px;
  height: 270px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto;
}

.list-right {
  padding-left: 10px;
}

/*.transfer-right{
        width: 220px;
    }*/
.btnB {
  display: inline-block;
  align-self: center;
}

.btnB .el-button {
  padding: 8px 16px;
  margin-bottom: 20px;
}

.dialog-corse {
  width: 200px;
  height: 270px;
  margin-left: 30px;
  overflow: auto;
  border: 1px solid #ebeef5;
}

.dialog-upload {
  display: flex;
}

.dialog-upload span {
  display: inline-block;
  margin: 6px 14px 0 10px;
}

.dialog-upload /deep/ .upload-demo {
  flex-grow: 1;
  width: 200px;
}

.addMajor {
  position: relative;
  /* margin-left: 64px; */
}
.el-input__inner {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.boxstyle {
  width: 360px;
  margin-right: 20px;
}
.element.style {
  width: 120px;
}
.style {
  width: 110px;
}
.element.style {
  width: 107px;
}
.addstyles {
  color: blue;
  cursor: pointer;
}
.addMajorStyles{
    position: absolute;
    padding-left: 358px;
    margin-bottom: -46px;
    top: -20px;
}
</style>
