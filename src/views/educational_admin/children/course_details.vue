<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-btn-con cm-fold">
      <el-form :inline="true" size="small" :model="formSearch">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item v-for="(list,index) in formList" :key="index" :label="list.label">
              <el-input v-model="formSearch[list.model]" :disabled="list.disabled"></el-input>
            </el-form-item>
            {{courseChange}}
             <el-form-item label="课程名称">
              <el-select  @change="courseChangeValue(curriculumName)" v-model="curriculumName"  clearable filterable>
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option
                 filterable
                  v-for="item in curriculumArr"
                  :key="item.id"
                  :label="item.course_name"
                  :value="item.course_platform_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-btn-con">
      <el-button size="medium" type="primary" @click="addCourse">新增课程</el-button>
      <el-button v-if="!tableEditable" size="medium" type="primary" @click="toggleEditable">编辑学时</el-button>
      <el-button v-if="tableEditable" size="medium" type="primary" @click="toggleEditable">确定学时</el-button>
      <el-button v-if="!sortEditing" size="medium" type="primary" @click="toggleSortEditable">编辑排序</el-button>
      <el-button v-if="sortEditing" size="medium" type="primary" @click="toggleSortEditable">保存排序</el-button>
      <el-button size="medium" type="primary" @click="exportPlan">导出</el-button>
      <a v-show="false" ref="exportExcel"></a>
      <el-button class="cm-btn-def" size="medium" type="primary" @click="goBack">返回</el-button>
       <p class="testStyle">学期学时为红色，表示各学期的学时之和不等于标准学时；各专业的授课学时允许有差异，以实际安排为准，确认即可！</p>

    </div>
    <div class="cm-table" id="xue">
      <el-table id="dataTable" ref="multipleTable" class="tableBox" :height="tableHeight" :data="tableData" border v-loading="tableLoading" element-loading-text="加载中..." style="width: 100%" header-row-class-name="cm-dark">
        <!-- <el-table-column fixed type="index" label="序号" width="50"></el-table-column> -->
        <el-table-column fixed   label="序号" width="50">
          <template slot-scope="{row, $index}">
            <el-input v-if="sortEditing" v-model="row.sort"></el-input>
            <span v-else>{{$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :fixed="item.fixed" :width="item.width"></el-table-column>
        <el-table-column label="课程学时" fixed>
          <template  slot-scope="scope">
              <el-input v-if="tableEditable==false" v-model="scope.row.totalHours" @blur="onUpdateTotalHours(scope.row)" :disabled="true"></el-input>
              <el-input v-else v-model="scope.row.totalHours" @blur="onUpdateTotalHours(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="学分" width="60" fixed>
          <template slot-scope="scope">
              <el-input v-if="tableEditable==false" v-model="scope.row.credit" @blur="onUpdateScore(scope.row)" :disabled="true"></el-input>
              <el-input v-else v-model="scope.row.credit" @blur="onUpdateScore(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="学期安排" id="xue">
          <el-table-column label="学期1" prop="semester1">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status1==1 || tableEditable==false" v-model="scope.row.semester1" @blur="onBlurChange1(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester1" @blur="onBlurChange1(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期2" prop="semester2">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status2==1 || tableEditable==false" v-model="scope.row.semester2" @blur="onBlurChange2(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester2" @blur="onBlurChange2(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期3" prop="semester3">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status3==1 || tableEditable==false" v-model="scope.row.semester3" @blur="onBlurChange3(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester3" @blur="onBlurChange3(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期4" prop="semester4">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status4==1 || tableEditable==false" v-model="scope.row.semester4" @blur="onBlurChange4(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester4" @blur="onBlurChange4(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期5" prop="semester5">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status5==1 || tableEditable==false" v-model="scope.row.semester5" @blur="onBlurChange5(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester5" @blur="onBlurChange5(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期6" prop="semester6">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status6==1 || tableEditable==false" v-model="scope.row.semester6" @blur="onBlurChange6(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester6" @blur="onBlurChange6(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期7" prop="semester7">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status7==1 || tableEditable==false" v-model="scope.row.semester7" @blur="onBlurChange7(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester7" @blur="onBlurChange7(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期8" prop="semester8">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status8==1 || tableEditable==false" v-model="scope.row.semester8" @blur="onBlurChange8(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester8" @blur="onBlurChange8(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期9" prop="semester9">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status9==1 || tableEditable==false" v-model="scope.row.semester9" @blur="onBlurChange9(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester9" @blur="onBlurChange9(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="学期10" prop="semester10">
            <template slot-scope="scope">
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-if="scope.row.publish_status10==1 || tableEditable==false" v-model="scope.row.semester10" @blur="onBlurChange10(scope.row)" :disabled="true"></el-input>
              <el-input :class="{'red-font': needRedColor(scope.row)}" v-else v-model="scope.row.semester10" @blur="onBlurChange10(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="学时安排" width="100">
          <template slot-scope="scope">
            <span :class="{'red-font': needRedColor(scope.row)}">{{ scope.row.hours }}</span>
            <!-- <span v-if="scope.row.totalHours==scope.row.hours ">{{ scope.row.hours }}</span>
              <span v-else style="color: red">{{ scope.row.hours }}</span> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="delTableRows(scope.row)" type="text" size="small" style="color: red;">删除课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="cm-pagination">
      <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange"></el-pagination>
    </div> -->
    <!-- 新增课程 -->
    <el-dialog width="1050px" title="新增课程" top='1vh' :visible.sync="dialogFormVisible" :close-on-click-modal="false" :modal-append-to-body="false">
      <course-selection :grade="formSearch.grade" :majorId="formSearch.majorId" :planId="row.id" @onchange="handleSelectedCourses" ref="CourseSelection"></course-selection>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogForm">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
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
          <el-select  filterable  v-model="addMajorData.courseIds" @change="getType" value-key="id">
            <el-option
              v-for="list in courseNameData"
              :key="list.id"
              :label="list.name"
              :value="list"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="课程类别" prop="courseNatureId" class="inputStyle" :label-width="formLabelWidth">
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
  </section>
</template>
<script>
  import util from '@/util'
  import courseSelection from '../components/course_selection_component';

  const TYPE = 'course-details';
  const REMARK = '课程详情';
  export default {
    name: TYPE,
    data() {
      return {
        curriculumName:"",
        curriculumArr:[],
        courseChange:null,
        newDatas:null,
        planId: {
          value: Number,
          default: -100
        },
        tableHeight: (window.innerHeight - 256), // talbe高度，默认640
        sortEditing: false, // 排序编辑状态
        formLabelWidth: "120px",
        formLabelWidth2:"80%",
        addMajorDialog: false, //新增专业弹窗
        rulesMajor: {
            courseIds: [
              { required: true, message: "请输入课程名称", trigger: "blur" }
            ],
            // classHour: [
            //   { required: true, message: "请输入理论/实践学时", trigger: "change" }
            // ],
            // credit: [{ required: true, message: "请输入学分", trigger: "blur" }],
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
      courseNameData: [], //课程名称数据
      courseNatureDada: [], //课程性质数据
       majorDataList: [], //适用专业数据
      scoreMethodList: [
        {
          name: "百分制",
          id: "100"
        }
      ], //计分方式
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
        tableEditable: false,
        checkList: [],
        // 已选课程
        choiceList: [],
        deleteList: [],
        breadcrumb: [{
          label: "教务管理"
        },
        {
          label: "培养方案",
          path: '/educational_admin/training_program'
        },
        {
          label: REMARK
        }],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        tableLoading: false,
        dialogFormVisible: false,
        formSearch: {
          major: '',
          grade: '',
          name: '',
          majorId: ''
        },
        formList: [{
          label: '专业',
          model: 'major',
          disabled: true
        },
        {
          label: '年级',
          model: 'grade',
          disabled: true
        },
        {
          label: '方案名称',
          model: 'name',
          disabled: true
        }],
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        tableList: [{
          label: '课程',
          prop: 'course_name',
          width: 200,
          fixed: true
        },
        {
          label: '必选修',
          prop: 'course_property',
          width: 65
        },
        {
          label: '课程类别',
          prop: 'course_cls',
          width: 120
        }],
        hour: {
          theory: "",
          novitiate: ""
        },
        courseData: [],
        tableData: [],
        // courseList:[],
        categoryOption: [],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      }
    },
    components: {
      courseSelection,
    },
    computed: {
     
      shownChoiceList() {
        var objArr = [];
     
        for (let k in this.choiceList) {
       
          if (typeof (this.choiceList[k]) !== 'function') {
            if (this.choiceList[k].length > 0) {
              var key = k.replace('C', '');
              var obj = {
                id: k,
                type: 0,
                courseDetail: this.categoryOption.filter(t => t.id == Number(key))[0].name,
                children: this.choiceList[k]
              };
              objArr.push(obj);
            }
          }
        }
   
        return objArr;
      }
    },
    created() {
      this.getCourseType();
      this.getcourseNameData(); //课程名称数据获取
      this.getCourseNatureData(); //获取课程性质数据
      this.getMajorDataList(); //获取适用专业数据

      this.row = JSON.parse(this.$route.query.row);
      this.formSearch.major = this.row.major_name;
      this.formSearch.grade = this.row.grade;
      this.formSearch.name = this.row.name;
      this.formSearch.majorId = this.row.major_id;
    },
    mounted() {
      this.getTableList();
      this.userId = util.getStorage('loginId');
      this.userName = util.getStorage('loginName');
   
    },
    methods: { 
      exportPlan(){
        this.$http2.get(`_ed:/trainplan/export/coursedetails/plan/${this.row.id}`).then(datas => {
					let url = window.URL.createObjectURL(new Blob([datas]));
					let y = this.$refs.exportExcel;
					y.href = url;
					y.setAttribute("download", "培养方案.xls");
					y.click();
					window.URL.revokeObjectURL(url);
				})
      },
      courseChangeValue(res){
 
        if (res) {
          var r = this.curriculumArr.filter(function (x) {
              return x.course_platform_id == res
          }); 
         
          this.tableData=r;
        } else {
          this.tableData = this.curriculumArr;
        }
      },
      onUpdateScore(row) {
        let  params={
          coursePlatformId:row.course_platform_id,
          credit:row.credit,
          year:this.formSearch.grade
        }
        this.$http.post("_op:/coursePlatformYear/updateByCredit",params).then(data =>{
        
        })
      },

      saveSort(success) {
          var sortedData = this.tableData.sort(function(a,b) {
            return a.sort - b.sort;
          });
          var req = sortedData.map((item, index) => {
            var r = {};
            r.planId = item.plan_id;
            r.platformId = item.course_platform_id;
            r.sort = (index+1) * 10;
            return r;
          });
          this.$http.post("_ed:/trainplan/course/sort", req).then(resp => {
            if (success) {
              if(typeof(success) === 'function') {
                success();
              }
            }
          }).catch(err => {
            this.$message({
              type: "error",
              message: "系统异常，请联系管理员"
            })
          });
      },

      // 编辑排序
      toggleSortEditable() {
        if (this.sortEditing) {
          this.saveSort(() => {
            this.$message({
              type: "success",
              message: "排序已保存"
            });
            this.getTableList();
          });
      
          
        }
        this.sortEditing = !this.sortEditing;
      },
      // 计算字体颜色
      needRedColor(row) {
        var hours = {
          theory: '0',
          novitiate: '0',
        };
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester1).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester1).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester2).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester2).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester3).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester3).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester4).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester4).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester5).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester5).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester6).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester6).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester7).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester7).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester8).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester8).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester9).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester9).novitiate)) + '';
        hours.theory = (Number(hours.theory) + Number(this.splitHours(row.semester10).theory)) + '';
        hours.novitiate = (Number(hours.novitiate) + Number(this.splitHours(row.semester10).novitiate)) + '';

        row.hours = hours.theory+'/'+hours.novitiate;
        return (row.totalHours != row.hours);
      },
      // 新增专业，课程下拉获取
     getcourseNameData() {
      this.$http.get("_op:course/combox")
        .then(data => {
          this.courseNameData = data.data;
        })
        .catch(() => {
          this.courseNatureData = [];
        });
    },
       //新增专业课程库-----课程性质数据查询
    getCourseNatureData() {
      let params = {
        type: "course-nature"
      };
      this.$http
        .post("_op:dicts/getDictsList", params)
        .then(data => {
          this.courseNatureDada = data.data;
        
        })
        .catch(() => {
          this.courseNatureDada = [];
       
        });
    },
     // majorDataList  适用专业
    getMajorDataList() {
      this.$http.get("_op:major/combox").then(data => {
        if (data.code == 0) {
          this.majorDataList = data.data;
          
        }
      });
    },
    addSubmit(addMajorData) { 
      this.addMajorData.courseId = this.addMajorData.courseIds.courseId;
      this.addMajorData.courseCategoryId = this.addMajorData.courseIds.courseCategoryId;
      this.$refs.addMajorData.validate(valid => {
        if (valid) {
            let option = util.cloneObj(this.addMajorData);
            // if (option.classHour.indexOf("/") === -1) {
            //   option.classHour += "/";
            // }
            // option.classHour = option.classHour.split("/");
            // option.theoryHour = option.classHour[0] || 0;
            // option.practiceHour = option.classHour[1] || 0;
            // delete option.classHour;
            this.addMajorData=option;
              //  if (this.addMajorData.classHour.indexOf("/") === -1) {
              //     this.addMajorData.classHour += "/";
              //   }
              //    this.addMajorData = this.addMajorData.classHour[0] || 0;
              //    this.addMajorData.practiceHour = this.addMajorData.classHour[1] || 0;
              //    delete   this.addMajorData.classHour
                  // this.addMajorData.classHour= this.addMajorData.classHour.split("/");
          this.$http
            .post("_op:coursePlatform", this.addMajorData)
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: "新增专业课程成功",
                  type: "success"
                });
                  this.addMajorDialog = false;
                  let that=this;
                  that.$refs.CourseSelection.getCoursePlatform( );
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
            this.addMajorData[key] = '';
        }
      this.addMajorDialog = true;
    },
       getType() {
      this.addMajorData.courseCategoryName = this.addMajorData.courseIds.courseCategoryName;
    },
      goBack() {
      
        this.$router.push({
              path: "/educational_admin/training_program",
              query: { row: JSON.stringify( this.row) }
          });
      },
      sizeChange(size) {
        this.pageNo = 1;
        this.pageSize = size;
        this.getTableList();
      },
      currentChange(current) {
        this.pageNo = current;
        this.getTableList();
      },
      addCourse() {
        this.dialogFormVisible = true;
        if (this.$refs.CourseSelection) {
          this.$refs.CourseSelection.reset();
        }
        // this.getCourseType();
      },
      cancelDialogForm() { //新增取消方法
        this.dialogFormVisible = false;
        this.form.region = '请选择课程';
        this.courseData = [];
        this.checkList = [];
        this.choiceList = [];
       

      },

      splitHours(hours) {
        let ret = {
          theory: '',
          novitiate: ''
        };
        let hour = [];
        let hourStr; //字符串类
        let hourArr = hours.split('/');
        if (hours) {
          //输入整数时补零
          if (hourArr.length == 1 && hourArr[0]) {
            hourStr = `${hours}/0`;
            hour = hourStr.split('/');
          } else {
            hour = hourArr;
          }
        } else {
          //输入为空时处理
          hourStr = `0/0`;
          hour = hourStr.split('/');
        }
        for (let i = 0, len = hour.length; i < len; i++) {
          ret.theory = hour[0];
          ret.novitiate = hour[1];
        }
        return ret;
      },

      setSchoolHours(hours) {
        this.hour = this.splitHours(hours);
        return this.hour;
      },
      // 更新总学时
      onUpdateTotalHours(row) {
        var theoryHour = row.totalHours.split('/')[0] || 0;
        var practiceHour = row.totalHours.split('/')[1] || 0;

        var updateDao = {
          coursePlatformId: row.course_platform_id,
          theoryHour: Number(theoryHour),
          practiceHour: Number(practiceHour),
          year:this.formSearch.grade,
          majorId:this.formSearch.majorId 
        }
        this.$http({
          method: 'post',
          url: '_op:coursePlatformYear',
          data: {
            ...updateDao
          }
        }).then(data => {
        });
      },
      onBlurChange1(row) {
        this.setSchoolHours(row.semester1);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id1,
          grade:this.formSearch.grade,
          plan_id: this.row.id,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange2(row) {
   
        this.setSchoolHours(row.semester2);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id2,
          grade:this.formSearch.grade,
          plan_id: this.row.id,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange3(row) {
        this.setSchoolHours(row.semester3);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id3,
          grade:this.formSearch.grade,
          plan_id: this.row.id,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange4(row) {
        this.setSchoolHours(row.semester4);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id4,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange5(row) {
        this.setSchoolHours(row.semester5);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id5,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange6(row) {
        this.setSchoolHours(row.semester6);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id6,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange7(row) {
        this.setSchoolHours(row.semester7);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id7,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange8(row) {
        this.setSchoolHours(row.semester8);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id8,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange9(row) {
        this.setSchoolHours(row.semester9);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id9,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      onBlurChange10(row) {
        this.setSchoolHours(row.semester10);
        this.$http.post('_ed:/trainplan/course/edit', {
          id: row.id10,
          plan_id: this.row.id,
          grade:this.formSearch.grade,
          course_platform_id: row.course_platform_id,
          theory_hours: this.hour.theory,
          novitiate_hours: this.hour.novitiate
        }).then(data => {
          if (data.code == 0) {
            // this.getTableList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },

      // 处理对话框中的已选课程
      handleSelectedCourses(val) {
        this.addCourseList = [].concat(val);
      },

      addConfirm() {
        this.$http.post('_ed:/trainplan/addcourses', {
          plan_id: this.row.id,
          create_user: '', //this.userId,
          create_username: '', //this.userName,
          courselist: this.addCourseList
        }).then(data => {
          let type = "success";
          let message = "新增成功！"
          if (data.code == 0) {
            this.dialogFormVisible = false;
            this.getTableList(() => {
              this.saveSort();
            });
          } else {
            type = "error";
            message = data.msg;
          }
          this.$message({
            type: type,
            message: message
          })
        });
      },
      delTableRows(row) {
        let that = this;
        this.$confirm(`此操作将永久删除 "${row.course_name}" 的维护信息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('_ed:/trainplan/course/delete/' +
              row.plan_id + '/' + row.course_platform_id)
            .then(data => {
              let message = '删除成功!';
              let type = 'success';
              if (data.code == 0) {
                if (this.tableData.length == 1) {
                  this.pageNo = 1;
                }
                that.getTableList();
              } else {
                type = 'error';
                message = data.msg;
              }
              this.$message({
                type,
                message,
              });
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val) {
        this.checkList = val;
      },
      handleRemoveChange(val) {
        this.deleteList = val;
      },
      onCourseSelect(val) {
        var c = `C${val}`;
        if (!this.choiceList[c]) {
          this.choiceList[c] = [];
        }
        // this.choiceList = [];
        this.getCoursePlatform(val);
      },
      addRight() {
        this.deleteList = [];
        this.addCourseList = [];
        var c = `C${this.form.region}`;
        var temp = [];
        if (this.checkList.length > 0) {
          temp = this.choiceList[`C${this.form.region}`].concat(this.checkList);
          for (let i = this.courseData.length - 1; i >= 0; i--) {
            for (let j = this.checkList.length - 1; j >= 0; j--) {
              if (this.courseData[i] == this.checkList[j]) {
                this.courseData.splice(i, 1);
              }
            }
          }
          for (let list of temp) {
            this.addCourseList.push(list.id)
            list.courseDetail = list.courseName + `(${list.totalClassHour})`;
            list.type = 1;
            list.category = this.form.region;
          }
          delete this.choiceList[c];
          this.$set(this.choiceList, c, temp);
        }
      },
      deletedRight() {
        this.addCourseList = [];
        for (let i = this.deleteList.length - 1; i >= 0; i--) {
          for (let k in this.choiceList) {
            if (typeof (this.choiceList[k]) !== 'function') {
              for (let j = this.choiceList[k].length - 1; j >= 0; j--) {
              
                if (this.deleteList[i].id == this.choiceList[k][j].id) {
                  this.choiceList[k].splice(j, 1);
                }
              }
            }
          }
        }
        for (let k in this.choiceList) {
          if (typeof (this.choiceList[k]) !== 'function') {
            for (let list of this.choiceList[k]) {
              this.addCourseList.push(list.id)
            }
          }
        }
        this.deleteList.forEach(d => {
          if (d.type == 1 && d.category == this.form.region) {
            this.courseData.push(d);
          }
        });
      
      },
      getCourseType() {
        this.$http.post('_op:/dicts/getDictsList', {
          type: 'course-category'
        }).then(datas => {

          if (datas.code == 0) {
            this.categoryOption = datas.data;
          } else {
            this.$message.error(data.msg);
          }
        }).catch((error) => {
          this.categoryOption = [];
        });
      },

      getTableList(sort) {
        this.tableLoading = true;
        this.coursePlatformId = [];
        this.$http.get('_ed:/trainplan/coursedetails/plan/' + this.row.id + /page/ +
            this.pageNo + /size/ + this.pageSize)
          .then(data => {
            if (data.code == 0) {
              this.tableLoading = false;
              this.totalCount = data.data.total_records;
              
              let datas = data.data.dataList;
          
              this.curriculumArr=datas
              for (let i = 0, len = datas.length; i < len; i++) {

                this.coursePlatformId.push(datas[i].course_platform_id);

                if (datas[i].total_theory_hours == null) {
                  datas[i].total_theory_hours = 0;
                }
                if (datas[i].total_novitiate_hours == null) {
                  datas[i].total_novitiate_hours = 0;
                }
                this.$set(datas[i], 'totalHours', datas[i].total_theory_hours + "/" + datas[i]
                  .total_novitiate_hours);

                let idx = 1;
                for (let j = 0, length = datas[i].detailList.length; j < length; j++) {
                  let childList = datas[i].detailList[j];
                  this.$set(datas[i], 'semester' + idx, childList.theory_hours + "/" + childList
                    .novitiate_hours);
                  this.$set(datas[i], 'publish_status' + idx, datas[i].detailList[j]
                    .publish_status);
                  this.$set(datas[i], 'id' + idx, childList.id);
                  if (j == 0) {
                    this.$set(datas[i], 'hours_theory', childList.theory_hours);
                    this.$set(datas[i], 'hours_novitiate', childList.novitiate_hours);
                  } else {

                    let totalhour_theory = childList.theory_hours;
                    let totalhour_novitiate = childList.novitiate_hours;

                    datas[i].hours_theory += totalhour_theory;
                    datas[i].hours_novitiate += totalhour_novitiate;
                  }
                  idx++;
                }
                this.$set(datas[i], 'hours', datas[i].hours_theory + "/" + datas[i]
                  .hours_novitiate);
              }

              datas.forEach((item, index) => {
                if (!item.sort) {
                  item.sort = (datas.length) * 10;
                } else {
                  if (item.sort <= 0) {
                    item.sort = (datas.length) * 10;
                  }
                }
              });
              this.tableData = datas.sort(function(a,b) {
                return a.sort - b.sort;
              });
              if (sort) {
                if (typeof(sort) === 'function') {
                  sort();
                }
              }
            } else {
              this.$message.error(data.msg);
            }
          }).catch((error) => {
            this.tableLoading = false;
          })
      },

      toggleEditable() {
        this.tableEditable = !this.tableEditable;
      }
    }
  }
</script>
<style scoped>
  .cm-table /deep/ .el-input .el-input__inner {
    text-align: center;
    padding: 0;
    border: 0;
  }

  .cm-table /deep/ .el-table td,
  .el-table th {
    padding: 2px 0;
  }

  .cm-btn-def {
    color: #333;
    background-color: #fff;
    border-color: #fff;
  }

  .cm-fold .fold .el-input__inner {
    width: 160px;
  }

  .dialog-container {
    margin: 0 20px;
    display: flex;
    flex-direction: column;
  }

  .dialog-container .dialog-top {
    width: 100%;
  }

  .dialog-container .dialog-transfer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: nowrap;
    align-items: center;
  }

  .dialog-container .dialog-transfer .transfer-left {
    width: 0;
    flex-grow: 2;
  }

  .dialog-container .dialog-transfer .transfer-middle {
    width: 0;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dialog-container .dialog-transfer .transfer-right {
    width: 0;
    flex-grow: 2;
  }

  .transfer-left-list {
    height: 480px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: scroll
  }

  .transfer-right-list {
    height: 480px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: scroll;
  }
  .addstyle{
    cursor: pointer;
    color: blue;
  }
  .boxstyle {
  /* width: 360px; */
  margin-right: 20px;
}
.addMajorStyle{
  margin-left: 18px;
}
.addMajorStyles{
  margin-left: 300px;
  position: relative;
}
  .boxstyles {
  position: absolute;

  width: 360px;
  margin-right: 20px;
}
.red-font {
  color: red;
}
.el-input.is-disabled.red-font /deep/ .el-input__inner {
  color: red;
}
.red-font /deep/ .el-input__inner {
  color:red;
}
.testStyle{
  color: red;
  text-align: right;
  padding-right: 20px;
  margin-top: 10px;
  margin-bottom: -10px;
}
.inputStyle{
  width:340px;
}

  /* 对话框样式 王凯*/ 
  /* /deep/.el-dialog__footer{
  padding: 10px 40px 20px;
} */
/* .tableBox{
   height: 650px;
   overflow:scroll;
}
@media screen and (max-height: 1000px) { 
  .tableBox {
      height: 620px;
      overflow:scroll;
  }
}
@media screen and (max-height: 850px) { 
  .tableBox {
   height: 450px;
   overflow:scroll;
  }
}
@media screen and (max-height: 850px) { 
  .tableBox {
     height: 500px;
   overflow:scroll;
  }
} */
</style>