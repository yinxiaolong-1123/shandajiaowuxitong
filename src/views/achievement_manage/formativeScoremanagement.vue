<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true">
        <div class="fold" >
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
              <el-form-item class="cm-collapse" v-show="fold.showBtn">
                <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
              </el-form-item>

              
              <el-form-item label="学期">
                <el-select 
                clearable
                  v-model="semesters"
                  filterable
                  @change="getCourseList('semesters',semesters)"
                  placeholder="选择学期">
                  <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            
              <el-form-item label="所在级">
                <intelligent-year-picker style="width: 100%;" 
                 clearable
                  v-model="grade"
                  type="year" 
                  value-format="yyyy" 
                  @change="getCourseList('grade',grade)"
                  placeholder="选择年级"> 
                </intelligent-year-picker>
              </el-form-item>

              <el-form-item label="专业">
              
                <el-select v-model="majorId"
                  @change="getCourseList('majorId',majorId)"
                  filterable
                  clearable
                 
                  placeholder="请选择">
                  <el-option v-for="list in majorList"    :key="list.id" :label="list.name" :value="list.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="课程">
                <el-select 
                clearable
                  v-model="courseId" 
                  @change="reset('courseId',courseId)"
                  filterable placeholder="选择课程">
                    <el-option v-for="list in courseList1" :key="list.id" :label="list.courseName" :value="list.courseId" ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="创建日期">
                <el-date-picker
                  v-model="createdata"
                  @change="reset('createdata',createdata)"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

                <el-form-item label="状态">
                <el-select 
                clearable
                  v-model="auditStatus" 
                  @change="reset('auditStatus',auditStatus)"
                  filterable placeholder="选择状态">
                  <el-option v-for="list in statusList" :key="list.id" :label="list.name" :value="list.id" ></el-option>
                </el-select>
              </el-form-item>
          </div>
          <div class="btn" >
            <el-button type="primary" size="mini" @click="Searchcoent()">查询</el-button>
          </div>
        </div>

      </el-form>
    </div>
    <div class="cm-fold" >
        <div class="btn" style="height:25px">
            <el-button type="primary" size="mini" @click="addteam()" v-if="hasPermission('xingchengxingchengjiluru', 'add')">新增</el-button>
          </div>
    </div>

    <el-dialog
      class="choiceReport"
      :close-on-click-modal="false"
      title="选择"
      :visible.sync="choiceReportStatus"
      :modal-append-to-body="false"
      >
      <el-table 
        :data="choiceReportData" 
        ref="choiceReportTable"
        border
        @selection-change="handleReportChange"
        >
        <el-table-column prop="grade" width="60" label="年级"></el-table-column>
        <el-table-column prop="majorName" label="专业"></el-table-column>
        <el-table-column prop="examTime" label="考试时间"></el-table-column>
        <el-table-column 
          type="selection"
          width="50"
          label="选择">
        </el-table-column>
      </el-table>
      <div class="reportTip">
        <span>请选择需要合并生成一份分析报告的年级、专业</span>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitChoiceReport">确 定</el-button>
          <el-button size="mini" @click="closeChoiceReport">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      class="addformLabelAlign"
            width="425px"
            :close-on-click-modal="false"
            :title="adddialog.status=='add'?'新增':'编辑'"
            :visible.sync="adddialog.visible"
            :modal-append-to-body="false"
            @closed="dialogClose('formLabelAlign')">
            <el-form ref="formLabelAlign"  :rules="rules" :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
              <el-form-item label="学期" prop="semesters">
                <el-select 
                    clearable
                      v-model="formLabelAlign.semesters"
                      filterable
                      @change="getcoursebysemesters(formLabelAlign.semesters,'semesters')"
                      placeholder="选择学期">
                      <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
              </el-form-item>
              <el-form-item label="年级" prop="grade">
                <intelligent-year-picker 
                    clearable
                      v-model="formLabelAlign.grade"
                      type="year" 
                      value-format="yyyy" 
                      @change="getcoursebysemesters(formLabelAlign.grade,'grade')"
                      placeholder="选择年级"> 
                    </intelligent-year-picker>
              </el-form-item>
              <el-form-item label="专业"  prop="majorId">
                  <el-select v-model="formLabelAlign.majorId"
                      @change="getcoursebysemesters(formLabelAlign.majorId,'majorId')"
                      filterable
                      clearable
                      placeholder="请选择专业">
                      <el-option v-for="list in majorList1"    :key="list.id" :label="list.name" :value="list.id"></el-option>
                    </el-select>
              </el-form-item>

               <el-form-item label="课程"  prop="courseId">
                    <el-select 
                    clearable
                      v-model="formLabelAlign.courseId" 
                      @change="getScoreType"
                      filterable placeholder="选择课程">
                      <el-option v-for="(list,index) in courseList"  :disabled="prohibit1" :key="index" :label="list.courseName" :value="list.courseId" ></el-option>
                    </el-select>
                  </el-form-item>



                  <el-form-item label="成绩类型"  prop="scoreType">
                    <el-select 
                      clearable
                      v-model="formLabelAlign.scoreType" 
                      filterable placeholder="选择成绩类型">
                      <el-option v-for="(list, index) in examTypeList" :key="index" :label="list.name" :value="list.id" ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="考试日期"  prop="examTime">
                    <el-date-picker 
                        clearable
                      v-model="formLabelAlign.examTime"
                        type="date"
                         format="yyyy 年 MM 月 dd 日"
                          value-format="timestamp"
                        placeholder="选择日期">
                      </el-date-picker>
                  </el-form-item>
            </el-form>
             
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogClose('formLabelAlign')">取 消</el-button>
                <el-button size="mini" type="primary" @click="addsubmitForm('formLabelAlign')">确 定</el-button>
            </span>
      </el-dialog>

    <div class="cm-table">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%; margin-top: 10px" size="mini" 
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
         <el-table-column
      type="index"
      width="55">
    </el-table-column>
        <el-table-column
        prop="grade"
        label="所在级" width="80" >
      </el-table-column>

      <el-table-column
        prop="termName"
        label="学期" width="260" >
      </el-table-column>

        <el-table-column
        prop="majorName"
        label="专业"  width="260">
      </el-table-column>
       <el-table-column
        prop="courseName"
        label="课程"  width="260">
      </el-table-column>
       <el-table-column
        prop="scoreTypeName"
        label="成绩类型" >
      </el-table-column>

      <el-table-column
        prop="examTime"
        label="考试时间">
        <template  slot-scope="scope">
          <!-- {{scope.row.examTime}} -->
          {{getnewdate(scope.row.examTime)}}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="createTime"
        label="创建时间" >
        <template slot-scope="scope">
            <!-- {{scope.row.createTime}} -->
          {{getnewdate(scope.row.createTime)}}
        </template>
      </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="lookcontent(scope.row)" v-if="(scope.row.auditStatus==3||scope.row.auditStatus==2)&&hasPermission('xingchengxingchengjiluru', 'get')">查看</el-button>
              <el-button type="text" size="small" @click="fenxi(scope.row)" v-if="(scope.row.auditStatus==3)&&hasPermission('xingchengxingchengjiluru', 'get')">分析报告</el-button>
              <!-- <el-button type="text" size="small" @click="fenxi(scope.row)" v-if="(scope.row.auditStatus==3)&&hasPermission('xingchengxingchengjiluru', 'get')">记载表</el-button> -->
              <el-dropdown size="small" trigger="click" style="margin-left:10px" @visible-change="(flag) => {getweight(flag, scope.row)}" @command="queryScoreRecordDetails" v-if="(scope.row.auditStatus==3)&&hasPermission('xingchengxingchengjiluru', 'get')">
                <span class="el-dropdown-link">
                  记载表<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="composeValue('stage', null, scope.row)">阶段成绩</el-dropdown-item>
                  <el-dropdown-item :command="composeValue('course', null, scope.row)">课程成绩</el-dropdown-item>
                  <template v-if="courseScoreModel != null">
                    <el-dropdown-item v-for="(item, index) in courseScoreModel.scoreTypeMap" :key="index" :command="composeValue('normal', item, scope.row)">{{item.name}}</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            <el-button type="text" size="small" @click="withdraw(scope.row)" v-if="scope.row.auditStatus==2">撤回</el-button>
            <el-button type="text" size="small" @click="edit(scope.row)" v-if="(scope.row.auditStatus==1||scope.row.auditStatus==4) && hasPermission('xingchengxingchengjiluru', 'update')"  >编辑</el-button>
            <el-button type="text" size="small" @click="submission(scope.row)" v-if="scope.row.auditStatus==1||scope.row.auditStatus==4">提交</el-button>
            <el-button type="text" size="small" @click="confirmsubmission(scope.row)" v-if="scope.row.auditStatus==2">确认</el-button>
            <el-button type="text" size="small" @click="deletecont(scope.row)" v-if="(scope.row.auditStatus==1||scope.row.auditStatus==4)&&hasPermission('xingchengxingchengjiluru', 'delete')"  >删除</el-button>
            <!-- <el-button type="text" size="small" @click="deletecont(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
       
    </div>
       <div class="cm-pagination">
        <el-pagination
              background
              :current-page="pageNo"
              :page-sizes="[5,10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
              @size-change="sizeChange"
              @current-change="currentChange">
          </el-pagination>
      </div>
  </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'
    const TYPE='formativeScoremanagement';
    const REMARK='形成性成绩管理';

    export default {
      name: TYPE,
      data() {
        return {
          courseScoreModel:null,
          examTypeList: [],
          // semesters: this.$route.query.semesters ? +this.$route.query.semesters : "",
          semesters: localStorage.getItem('searchQuery') ? JSON.parse(localStorage.getItem('searchQuery')).param.termId : undefined,
          // grade: this.$route.query.grade || '',//所在级
          grade: localStorage.getItem('searchQuery') ? JSON.parse(localStorage.getItem('searchQuery')).param.grade : undefined,
          // majorId: this.$route.query.majorId ? +this.$route.query.majorId : '',//专业
          majorId: localStorage.getItem('searchQuery') ? JSON.parse(localStorage.getItem('searchQuery')).param.major : undefined,//专业
          // courseId: this.$route.query.courseId ? +this.$route.query.courseId : '',//课程
          courseId: localStorage.getItem('searchQuery') ? JSON.parse(localStorage.getItem('searchQuery')).param.course : undefined,//课程
          createdata: localStorage.getItem('searchQuery') ? [JSON.parse(localStorage.getItem('searchQuery')).param.startExamTime, JSON.parse(localStorage.getItem('searchQuery')).param.endExamTime] : ['',''],//创建日期
          tableData: [],
          // auditStatus: this.$route.query.auditStatus ? +this.$route.query.auditStatus : '',
          auditStatus: localStorage.getItem('searchQuery') ? JSON.parse(localStorage.getItem('searchQuery')).param.auditStatus : undefined,
          curryear:'',//当前年份
          semesterList:[],//学期列表
          totalRecords:0,
          // coursename:"",//课程名字

          courseList1:[],//查询的课程列表
          courseList:[],//课程列表
          prohibit:true,//为空就禁止
          prohibit1:true,//为空就禁止
          adddialog:{ //新增弹框
            status:false,
            visible:false,
           },
          choiceReportStatus: false,
          choiceReportData: [],
          reportItem:[],
          reportCourseName: '',
          reportCourseId: '',
          reportTermId: '',
          reportScoreTypeId: '',
          labelPosition: 'right',

          examinationlist:[],//成绩类型
           formLabelAlign:{
               semesters:"",//学期ID
              grade:'',//所在级
              majorId:'',//专业
              courseId:'',//课程
             scoreType:'',// 成绩类型
              examTime:'',//考试日期
              stat:''
           },
            rules: {
            semesters: [
            { required: true, message: '请选择学期', trigger: 'change' }
            
            ],
            grade: [
            { required: true, message: '请选年级', trigger: 'change' }
            
            ],
            majorId: [
            { required: true, message: '请选择专业', trigger: 'change' }
            ],

            courseId: [
            { required: true, message: '请选择课程', trigger: 'change' }
            ],

             scoreType: [
            { required: true, message: '请选择成绩类型', trigger: 'change' }
            ],
            
             examTime: [
            { required: true, message: '请输入考试日期', trigger: 'blur' }
            ],
          },
          statusList:[
            {
              id:1,name:'新建'
            },
            {
              id:2,name:'已提交'
            },
            {
              id:3,name:'已确认'
            },
            {
              id:4,name:'已驳回'
            }
          ],  
      
          majorList:[],//专业列表
          majorList1:[],//专业列表
          fold:{
            state:false,
            text:'展开',
            showBtn:false,
          },
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          checked: true,
		      formLabelWidth: '60px',
          tableLoading:false,
            pageNo: 1,
            pageSize: 20,
            totalCount:0,
         
  
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
      // this.onSearch()

      },
      created(){
        // this.createdata = this.$route.query.createdata && 
        // JSON.parse(this.$route.query.createdata).length == 2 && 
        // this.$route.query.createdata[0] && 
        // this.$route.query.createdata[1] ? 
        // [JSON.parse(this.$route.query.createdata)[0],JSON.parse(this.$route.query.createdata)[1]] : ['',''];
        
        this.$authorize.me();
        Promise.all([this.getTermData(),this.getMajorList(),this.getscoreSett()]).then(res => {
          this.getCourseList()
        })
        // this.getTermData();
        // this.getMajorList();
        // this.getscoreSett();
        // this.getCourseList()
      },
       destroyed(){
        clearTimeout(this.setTimeout)
      },
    methods: {
      composeValue(type, it, row) {
          return {
              'type': type,
              'scoreType': it,
              'row': row
          }
      },
      queryScoreRecordDetails(cmd){
        this.$http.post('_sc:/scoreRecord/queryPageList',{
          pageNo: 1,
          pageSize: 20,
          param: {termId: cmd.row.termId, status: "", courseId: cmd.row.course, examTypeCode: "", majorId: cmd.row.major, grade: cmd.row.grade, resit:0}
        }).then(data=>{
            if(data.result!=null) {
              data.result.forEach(item => {
                if(item.resit == 0) {
                  this.recordId = item.id
                }else{
                  return this.$message.warning('请先到阶段及课程成绩提交中核对并提交记载表，再打印')
                }
              })
              this.hrefMethod(cmd)
            }else {
              this.$message.warning('请先到阶段及课程成绩提交中核对并提交记载表，再打印')
            }
        }).catch(err=>{
            console.log(err)
        })
        
    },
    hrefMethod(cmd) {
      let param = {
            scoreType: cmd.scoreType,
            type: cmd.type,
            recordId: this.recordId,
            resit: 0
        }
        let prefix = '';
        if (process.env.NODE_ENV === 'production') {
            prefix = '/edm';
        }
        let amdd = JSON.stringify(param)
        let token = localStorage.getItem("token");
        this.$router.replace({
            query:{
                ...this.$route.query,
                semester: this.semesters,
                grade: this.grade,
                majorId: this.majorId,
                courseId: this.courseId,
            }
        })
        // window.location.href = 'file:///D:/minxing/汕头大学教务系统/intelligent-tutoring-web/intelligent-tutoring-web/public/pages/page/myprint.html'
        window.location.href = prefix + '/pages/page/myprint.html?cmd='+amdd+'&token='+token;
    },
      getweight(flag, row){
        if(flag){
          let params = {
              courseId:row.course,
              grade:row.grade,
              majorId:row.major,
              termId:row.termId
          }
          
          this.$http.post('_sc:/courseScoreModel/detail',params).then(data=>{
              if(data.data!=null){
                this.courseScoreModel = data.data
              }
          }).catch(err=>{
              console.log(err)
          })
        }else {
          this.courseScoreModel = null
        }
    },
      reset(item,value){
        let obj = {...this.$route.query};
        if(typeof value == 'string'){
          obj[item] = value;
        }else{
          obj[item] = JSON.stringify(value);
        }
        this.$router.replace({ query:obj });
      },
      submitChoiceReport(){
        if(this.reportItem.length == 0){
          this.$message.warning('请选择需要合并生成一份分析报告的年级、专业')
          return
        }
        let gradeArr = []
        let majorArr = []
        let examTimeArr = []
        this.reportItem.map(item => {
          // if(!gradeArr.includes(item.grade)){
            gradeArr.push(item.grade)
          // }
          if(!majorArr.includes(item.major)){
            majorArr.push(item.major)
          }
          examTimeArr.push(item.examTime)
        })
        let param = {
          termId: this.reportTermId,
          gradeArray: gradeArr,
          majorArray: majorArr,
          courseName: this.reportCourseName,
          courseId: this.reportCourseId,
          scoreTypeId: this.reportScoreTypeId,
          examTime: examTimeArr
        }
        let prefix = '';
        if (process.env.NODE_ENV === 'production') {
            prefix = '/edm';
        }
        let amdd = JSON.stringify(param)
        let token = localStorage.getItem("token");
        window.location.href = prefix + '/pages/page/analysisreport.html?cmd='+amdd+'&token='+token;
      },
      closeChoiceReport(){
        this.choiceReportStatus = false
        this.reportItem = []
        this.reportCourseId = ''
        this.reportTermId = ''
        this.reportScoreTypeId = ''
      },
      handleReportChange(val){
        this.reportItem = val
      },
      fenxi(row){
        let _this = this
        let param = {
          courseId: row.course,
          termId: row.termId,
          scoreTypeId: row.scoreTypeId
        }
        console.log(row)
        this.reportCourseName = row.courseName
        this.reportCourseId = row.course
        this.reportTermId = row.termId
        this.reportScoreTypeId = row.scoreTypeId
        this.$http.post("_sc:/importScore/queryImportScoreAnalyse",param).then( res => {
          if(res.code == 0){
            _this.choiceReportData = res.data
            let currentIndex = ''
            _this.choiceReportData.map((item,index) => {
              item.examTime = moment(item.examTime).format('YYYY-MM-DD')
              if(item.major == row.major){
                currentIndex = index
              }
            })
            if(res.data.length > 1){
              _this.choiceReportStatus = true
              this.$nextTick(() => {
                _this.$refs.choiceReportTable.toggleRowSelection(_this.choiceReportData[currentIndex],true)
              })
            }else{
              _this.reportItem = _this.choiceReportData
              _this.submitChoiceReport()
            }
          }else{
            _this.$message.error(res.msg)
          }
        }).catch(error => {
          console.log(error)
        })
        // let param = {
        //     courseName: row.courseName,
        //     courseId: row.course,
        //     termId: row.termId,
        //     scoreTypeId: row.scoreTypeId,
        //     examTime: row.examTime
        // }
        // let prefix = '';
        // if (process.env.NODE_ENV === 'production') {
        //     prefix = '/edm';
        // }
        // let amdd = JSON.stringify(param)
        // let token = localStorage.getItem("token");
        // window.location.href = prefix + '/pages/page/analysisreport.html?cmd='+amdd+'&token='+token;
      },
      hasPermission(key, val) {
        let ret = this.$authorize.hasPermission(key, val);
      
        return ret;
      },
      getNewMajor() {
        this.majorId = ''
        let grade
        if(this.grade === '' || this.grade == null) {
          grade = 0          
        }else {
          grade = this.grade
        }
        this.$http.get("_op:/major/getMajorByGrade/" + grade)
          .then( res => {
            if(res.code == 0){
              this.majorList = res.data
            }else{
              this.$message.error(data.msg);
            }
          })
      },
      getCourseList(item,value){// 根据查询课程
            (item) && (this.reset(item,value));
            // this.courseId = ''
            if(item === 'grade') {
              this.getNewMajor()
            }
            // let param = {
            //     "grade":this.grade,
            //     "majorId":this.majorId,
            //     "termId":this.semesters
            // }
            let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            let roles = JSON.parse(localStorage.getItem('vuex')).me.roles.map(item=>item.id).join()
            let param = {
              id:0,
              type:"couse_from_score_model",
              extend:JSON.stringify({
                teacher_id:user_id,  //--当前用户ID
                roles:roles,  //--当前用户的角色
                term_id:this.semesters || 0,   //--选择的学期；如果没选则传0
                grade:this.grade || 0,      //--选择的年级，如果没选则传0
                major_id:this.majorId || 0 //--选择的专业，如果没选则传0
              }),
              userId: user_id //当前用户ID
            }
            this.$http.post("_sc:/modified/courseaffirm/pQueryCom",param).then(data=>{
                if(data.code==0){
                  var temp = []
                  var res = []
                  let jsons = data.data ? JSON.parse(data.data) : ''
                  if(jsons && jsons.length){
                    jsons.forEach(x => {
                      if (temp.indexOf(x.courseId) == -1) {
                        temp.push(x.courseId)
                        res.push(x)
                      }
                    })   
                  }
                  
                  this.courseList1 = res;
                }else{
                  this.$message.error(data.msg);
                }
            })
        },
        addsubmitForm(formName) {
          
        this.$refs[formName].validate((valid) => {
          if (valid) {
              let query = {
                  termId:this.formLabelAlign.semesters,
                  grade :this.formLabelAlign.grade,
                  major:this.formLabelAlign.majorId,
                  course:this.formLabelAlign.courseId,
                  // scoreTypeId:this.formLabelAlign.scoreType,
                  // examTime:this.formLabelAlign.examTime
              }
              
              this.$http.post("_sc:/importScore/checkImportScore",query).then(res=>{
                if(res.data>0){
                     this.$message({
                        type: "warning",
                        message:"本次成绩已存在!"
                    });
                    // this.adddialog.visible = false
                }else{
                    this.formLabelAlign.stat = 'add';
                    // this.formLabelAlign.auditStatus = 1
                    this.goAddachievements(this.formLabelAlign)
                }
                  
              }).catch(err=>{

              })
              
                  
          } else {
         
            return false;
          }
        });
      },
      submission(row){ //提交单条信息
    
        this.getimportScore(row,'sub')
        
      },
      goAddachievements(params){
        this.$router.replace({
          query: {
            ...this.$route.query,
            semesters: this.semesters,
            grade: this.grade,
            majorId: this.majorId,
            courseId: this.courseId,
            createdata: this.createdata != null && this.createdata[0] && this.createdata[1] ? JSON.stringify(this.createdata) : JSON.stringify(['','']),
            auditStatus: this.auditStatus
          }
        })
        this.$router.push({
          path:'/achievement_manage/addachievements',
          query:params
        })
      },
      confirmsubmission(row){//对提交的信息进行确认
        //  this.getimportScore(row,'confirm')
        row.stat = '确认';
        this.goAddachievements(row)
      },
    lookcontent(row){//查看
      row.stat = '查看';
      this.goAddachievements(row)
	  },
      withdraw(row){ //对已经提交的信息进行撤回
         this.getimportScore(row,'withdraw')
      },
      edit(row){ //对未提交的进行编辑
        row.stat = 'edit'
        this.goAddachievements(row)
      },
      getimportScore(row,status){
        let auditStatus = ''
        let msg = ''
   
        if(status=='sub'){
          auditStatus  = 2
           msg = '提交成功!'
        }else if(status=='withdraw'){
           auditStatus  = 1
           msg = '撤回成功!'
        }
        let query = {
          auditStatus: auditStatus,
          course: row.course,
          // createTime: row.createTime,
          examTime: row.examTime,
          grade: row.grade,
          major: row.major,
          scoreTypeId: row.scoreTypeId,
          termId:row.termId
          }
        this.$http.put("_sc:/importScore/updateAuditStatus",query).then(res=>{
          if(res.code=='0'){
            this.$message({
                type: "success",
                message:msg
            });
            this.onSearch()
          }
        }).catch(err=>{

        })
      },
      handlePageSizeChange(size) { 
        this.pageNo = 1;
        this.pageSize = size;
      
          this.onSearch();
      },

      handlePageIndexChange(current) {
        this.pageNo = current;
       
          this.onSearch();
      },

       //获取按钮权限

	      deletecont(row){
          
                this.$confirm(`此操作将永久删除该信息信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  let param = {
                    scoreTypeId:row.scoreTypeId,
                    course: row.course,
                    createTime: row.createTime,
                    examTime: row.examTime,
                    grade: row.grade,
                    major: row.major,
                    termId: row.termId,
                    uuid:row.uuid
                  }
                  this.$http.post("_sc:/importScore/batchDelete",param).then(data=>{
                    
                        let type = "success";
                          let message = "删除成功！";
                        if(data.code==0){
                          
                           let self = this
                             self.onSearch()
                        }else{
                            type = "error";
                            message = data.msg;
                        }
                    
                        this.$message({
                        type: type,
                        message: message
                        });
                  })

                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });          
                });
            },
  
        ifnoneshow(){
                let self = this
                self.ifnone = true;
        },

	  getresitList(id){
     
	  },
      
      closeprint(){//关闭打印的弹框
          this.dialog.status = 'add' 
          this.printDialog =  false
      },
  
      addteam(){
        this.adddialog.status = 'add'
        this.adddialog.visible = true
      },
      onSearchNopass(){
        
      }, 
      Searchcoent(){
        this.pageNo = 1
        this.onSearch()
      },
      onSearch(){
        
        let self = this
        // self.pageNo = 1
        if(self.createdata == null){
          self.createdata = [];
          self.createdata[0] = '';
          self.createdata[1] = '';
        }
        let query = {
          pageNo: self.pageNo,
          pageSize: self.pageSize,
          param : {
            auditStatus:self.auditStatus,
            course:self.courseId,
            major:self.majorId,
            grade:self.grade,
            termId:self.semesters,
            startExamTime:self.createdata[0],
            endExamTime:self.createdata[1],
          }
        }
        localStorage.setItem('searchQuery', JSON.stringify(query))
        this.tableLoading = true;
        this.$http.post("_sc:/importScore/queryImportRecord",query).then(res=>{
      
          self.tableData = res.result
          // res.result.res.result
          self.totalCount = res.totalCount
          this.tableLoading = false;
          
        }).catch(err=>{
          this.tableLoading = false;
        })
        
        
      },
      formatDate(now)   {     
          var   year=now.getFullYear();     
          var   month=now.getMonth()+1;     
          var   date=now.getDate();
          return   year+"-"+month+"-"+date   
      },   
      getnewdate(timers){
        
          return this.formatDate(new Date(timers))
      },
              
      getScoreType(){
        if(this.formLabelAlign.semesters == '' || this.formLabelAlign.grade == '' || this.formLabelAlign.majorId == '' || this.formLabelAlign.courseId == '') {
          return
        }
        let query = {
          termId: this.formLabelAlign.semesters,
          grade: this.formLabelAlign.grade,
          major: this.formLabelAlign.majorId,
          course: this.formLabelAlign.courseId
        }
        this.$http.post("_sc:/scoreSetting/queryImportScoreType", query)
          .then( res => {
            this.examTypeList =  res.data
          })
      },
      getMajor() {
          let grade
          if(this.formLabelAlign.grade == '' || this.formLabelAlign.grade == null) {
              grade = 0
          }else {
              grade = this.formLabelAlign.grade
          }
          this.formLabelAlign.majorId = ''
          this.majorList1 = []
          this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
              this.majorList1 = res.data
          })
      },
      getcoursebysemesters(val,type){
        this.getScoreType()
        this.formLabelAlign.courseId = ''
        this.formLabelAlign.scoreType = ''
        this.courseList = []
     
        if(type=='grade'){
           let year = ''
          for(let i=0;i<this.semesterList.length;i++){
            if(this.semesterList[i].id==this.formLabelAlign.semesters){
              year = this.semesterList[i].year
            }
          }
          if(val>year){
            this.formLabelAlign.grade = ''
            this.$message({
                  type: "waring",
                  message:"学期与所在及不相符合!"
              });
              return
          }else{
             this.formLabelAlign.grade = val
             this.getMajor()
          }
    
        }
       
        // if(type=='semesters1'){
        //     let year = ''
        //   for(let i=0;i<this.semesterList.length;i++){
        //     if(this.semesterList[i].id==val){
        //       year = this.semesterList[i].year
        //     }
        //   }
        //   if(this.grade>year){
        //     this.semesters = ''
        //     this.$message({
        //           type: "waring",
        //           message:"学期与所在及不相符合!"
        //       });
        //   }else{
        //     //  this.formLabelAlign.grade = val
        //      this.semesters = val
        //   }
              
        // }
         if(type=='semesters'){
             let year = ''
          for(let i=0;i<this.semesterList.length;i++){
            if(this.semesterList[i].id==val){
              year = this.semesterList[i].year
            }
          }
          if(this.formLabelAlign.grade>year){
            this.formLabelAlign.semesters = ''
            this.$message({
                  type: "waring",
                  message:"学期与所在及不相符合!"
              });
          }else{
            //  this.formLabelAlign.grade = val
              this.formLabelAlign.semesters = val
          }
             
        }
        // if(type=='majorId1'){
        //       this.majorId = val
        // } 
        if(type=='majorId'){
              this.formLabelAlign.majorId = val
        } 
        // 当semesters  majorId  grade 都有值的情况下请求 新增窗口里面的课程列表
        if(this.formLabelAlign.semesters!=''&&this.formLabelAlign.grade!=''&&this.formLabelAlign.majorId!=''){
              this.prohibit1 = false
              this.getnewcoueselistbymodel(this.formLabelAlign.semesters,this.formLabelAlign.grade,this.formLabelAlign.majorId)
        }else{
          this.prohibit1 = true
        }
        //  if(this.semesters!=''&&this.grade!=''&&this.majorId!=''){
        //    debugger
        //       this.prohibit = false
        //       this.getnewcoueselistbymodel(this.semesters,this.grade,this.majorId)
        // }else{
        //   this.prohibit = true
        // }



      },

        comparativeTerm(val){
        let year = ''
        for(let i=0;i<this.semesterList.length;i++){
          if(this.semesterList[i].id==this.semesters){
            year = this.semesterList[i].year
          }
        }
        if(val>=year){
          this.grade = ''
          this.$message({
                type: "waring",
                message:"学期与所在及不相符合!"
            });
        }else{
            this.grade = val
        }
      },
       getscoreSett(){ //查询成绩类型列表
        return this.$http.get('_sc:/scoreSetting/combox/SCORE_TYPE').then(res=>{
         this.examinationlist =  res.data
        }) 
      },
     getnewcoueselistbymodel(trem,grade,major){
        // let query = {
        //     grade:grade,
        //     majorId:major,
        //     termId:trem,
        // }
        let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
        let roles = JSON.parse(localStorage.getItem('vuex')).me.roles.map(item=>item.id).join()
        let param = {
          id:0,
          type:"couse_from_score_model",
          extend:JSON.stringify({
            teacher_id:user_id,  //--当前用户ID
            roles:roles,  //--当前用户的角色
            term_id:trem,   //--选择的学期；如果没选则传0
            grade:grade,      //--选择的年级，如果没选则传0
            major_id:major //--选择的专业，如果没选则传0
          }),
          userId: user_id //当前用户ID
        }
       this.$http.post("_sc:/modified/courseaffirm/pQueryCom",param).then(data=>{
          // this.courseList = res.data;
          if(data.code==0){
            var temp = []
            var res = []
            let jsons = data.data ? JSON.parse(data.data) : ''
            if(jsons && jsons.length){
              jsons.forEach(x => {
                if (temp.indexOf(x.courseId) == -1) {
                  temp.push(x.courseId)
                  res.push(x)
                }
              })   
            }
            
            this.courseList = res;
          }else{
            this.$message.error(data.msg);
          }
        
       })
     },
  
      getMajorList(){//查询专业列表
        return this.$http.get("_op:/major/combox").then(data=>{
          if(data.code==0){
            this.majorList = data.data;
          }else{
            this.$message.error(data.msg);
          }
        })
      },
       getTermData(){//查询学期列表
        let query="学期"
          return this.$http.get('_op:/terms/'+query).then(data=>{
              if(data.code==0){
                for (let i=0;i<data.data.length;i++) {
                  if (data.data[i].name.indexOf('当前学期')!=-1) {
                    this.curryear=data.data[i].year;
                    // this.semesters = data.data[i].id;
                    // this.grade=data.data[i].year.toString();
                    break;
                  }
                }
                this.semesterList = data.data.reverse();
                for(let i=0;i<this.semesterList.length;i++){
                  if(!this.semesters && this.semesterList[i].name.indexOf('当前学期')!=-1){
                    // this.semesters=this.semesterList[i].id;
                    this.semesters= this.semesters ? this.semesters : this.semesterList[i].id;
                    this.grade=this.grade ? this.grade : this.semesterList[i].year.toString();
                    console.log(this.grade)
                    this.reset('semesters',this.semesters)
                  }
                }
                this.onSearch();
              }else{
                  this.$message.error(data.msg);
              }
          })
        },
     //  显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.onSearch();
            },
            // 翻页
            currentChange(current){
                this.pageNo=current;
                this.onSearch();
            },
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
         dialogClose(formDialog){//关闭弹窗重置数据
        this.$refs[formDialog].resetFields();
        this.adddialog.visible = false
        this.examTypeList = []
          
      },
        onEvaluation () {
        
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handleSelectionChange2(val) {
          this.multipleSelection2 = val;
        },
        
		collapseShow(){
          this.fold.state=!this.fold.state;
          this.fold.text=this.fold.state?'收起':'展开';
        },
      } 
    }	
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.pull-right{
  text-align: right;
  margin-right: 10px;
}

.content1{
  display: flex;
  margin-left: 20px;
  .fromleft{
    width: 40%
  }
  .tltlesize{
    font-size: 16px;
    font-weight: bold;
    line-height: 35px;
    padding-left: 35px;
  }
  
}
.content2{

  margin-left: 80px;
  .fromright{
  width: 100%;
  }
  .tltlesize2{
    font-size: 16px;
    line-height: 35px;
  }
  
}
.dialogheader{
    display: flex;
    position: relative;
    border-bottom: solid 1px #66666636;
    height: 33px;
    .btnbox{
        position: absolute;
        right: 0px;
    }
}
.printtable{
  /deep/.el-dialog__body{
      padding-top: 0px
  }
  .printtitle{
    font-size: 18px;
    font-weight: bold;
    text-align: center
  }
  .printtitle2{
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
  }
  .printcont{
     width: 90%;
    margin: 0 auto;
    margin-top: 5px;
    min-height: 500px;
    
  }
    .printfont{
     width: 90%;
    margin: 0 auto;
    margin-top: 5px;
  }
  .autograph1{
    width: 50%;
  }
}
.autograph{
  display: flex;
  flex-wrap: wrap;
   .autograph1{
    width: 50%;
    line-height: 50px;
  }
}
.tab2{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 40px;
        }
       
    }
  .addformLabelAlign /deep/.el-input--suffix .el-input__inner {
      height: 35px;
      line-height: 35px;
      width: 250px;
}
 .addformLabelAlign /deep/.el-dialog__body{
   padding: 30px 40px;
 }
 .reportTip{
   span{
     font-style:italic;
     font-size: 12px;
     margin-top:10px;
     color:#409EFF
   }
 }
</style>