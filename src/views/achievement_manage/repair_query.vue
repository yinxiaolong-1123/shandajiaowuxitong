<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>

            <el-form-item label="学期">
              <el-select clearable v-model="termId" @clear="changeTerm" @change="getCourseList" filterable placeholder="选择学期">
                <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="所在级">
              <intelligent-year-picker style="width: 100%;" @clear="changeGrage" @change="getCourseList('grade')" clearable v-model="grade" type="year" value-format="yyyy" placeholder="选择年级">
              </intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">

              <el-select v-model="majorId" @change="getCourseList" filterable clearable @clear="colsemajor" placeholder="请选择">
                <el-option v-for="(list,index) in majorList" :key="index" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="课程">
              <el-select clearable v-model="courseId" filterable placeholder="选择课程">
                <el-option v-for="(list,index) in courseList" :key="index" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="已补考次数">
              <el-select clearable v-model="resitNum" filterable placeholder="请选择补考次数">
                <el-option v-for="list in resitlist" :key="list.id" :label="list.num" :value="list.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="状态">
              <el-select clearable v-model="printStatus" filterable placeholder="请选择状态">
                <el-option v-for="list in printStatuslist" :key="list.val" :label="list.name" :value="list.val"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学号">
              <el-input placeholder="请输入学号" v-model="studentNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="成绩类型">
              <el-select v-model="scoreTypeId" placeholder="请输入成绩类型" clearable>
                <el-option v-for="scoreItem in examinationlist" :label="scoreItem.name" :value="scoreItem.id" :key="scoreItem.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="onSearch()" v-if="btnPerObj.query">查询</el-button>
          </div>
        </div>

      </el-form>
    </div>
    <div class="cm-fold">
      <div class="btn" style="height:25px">
        <el-button type="primary" size="mini" @click="createlist()"  :disabled="disableResitBtn" v-if="btnPerObj.create">安排补考</el-button>
         <!-- <el-button type="primary" size="mini" @click="toggleSelection()" v-if="btnPerObj.create">取消全选</el-button> -->
        
      </div>
    </div>

    <div class="cm-table">
      <el-table :data="tableData" ref="multipleTable2" :height="tableHeight()" border style="width: 100%; margin-top: 20px" size="mini" :filter-method="findrepeat"  :header-cell-style="getRowClass" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……" @selection-change="handleSelectionChange" element-loading-background="rgba(255, 255, 255, 0.8)">
         <el-table-column type="selection"  label="全选" fixed  :selectable="selectable" width="55">
         </el-table-column>

        <el-table-column prop="studentNo"   width="100" fixed="left" label="学号">
        </el-table-column>

        <el-table-column prop="studentName"  width="90" fixed="left"  label="姓名">
        </el-table-column>
        <el-table-column prop="grade" width="60"  label="所在级">
        </el-table-column>

        <el-table-column prop="majorName" label="专业" width="180">
        </el-table-column>

        <el-table-column prop="courseName" label="课程" width="210">
        </el-table-column>

        <el-table-column prop="termName" label="不及格学期" width="170">
        </el-table-column>

        <el-table-column prop="stageName"  width="70"  label="阶段">
        </el-table-column>

        <el-table-column prop="score"  width="70"  label="成绩">
        </el-table-column>

            <el-table-column prop="scoreRemark"  width="200"  label="成绩说明">
        </el-table-column>

        <el-table-column prop="scoreTypeName"  width="100"  label="考试类型">
        </el-table-column>

        <el-table-column prop="bkTimes"   width="90" label="已补考次数">
        </el-table-column>

        <el-table-column prop="printStatus"  width="70"  label="状态">
          <template slot-scope="scope">

            <template v-if="scope.row.printStatus==0||scope.row.printStatus==null">
              未安排
            </template>
            <template v-if="scope.row.printStatus==1">
              已安排
            </template>
            <template v-if="scope.row.printStatus==2">
              已打印
            </template>
          </template>
        </el-table-column>

        <el-table-column prop="resitDelayedType"  width="120" label="补考类型">
          <template slot-scope="scope">

            <template v-if="scope.row.resitDelayedType==1">
              缓考
            </template>
            <template v-if="scope.row.resitDelayedType==2">
              不及格
            </template>
          </template>
        </el-table-column>

        <el-table-column prop="areatime" label="补考场地时间" min-width="400">
          <template slot-scope="scope">
            {{scope.row.areaName}}
            {{getnewdate(scope.row.startResitTime)}}
            <template v-if="scope.row.startResitTime">
                          到

            </template>
            {{getnewdate(scope.row.endResitTime)}}

          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog title="创建补缓考名单" :visible.sync="creatDialog" width="100%" :fullscreen="true" append-to-body :close-on-click-modal="false" @closed="" :show-close="true" class="import-teachers-list">
      <div class="cm-fold">
        <el-form size="mini" :inline="true" :model="formDetails" ref="formDetails" :rules="rules">
          <div class="fold">
            <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">

              <el-form-item label="补考场地" prop="areaId">
                <el-select v-model="formDetails.areaId" :loading="loading"  filterable remote @change="getcapacity" clearable placeholder="请输入关键字"
                   reserve-keyword 
                   value-key="id"
                   :remote-method="remoteMethod" >
                  <el-option v-for="list in arelist" :key="list.id" :label="list.name" :value="list"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="容量" prop="capacity">
                <el-input placeholder="" v-model="formDetails.capacity" disabled></el-input>
              </el-form-item>

              <el-form-item label="考试时间" prop="examinationTime">
                <el-date-picker v-model="formDetails.examinationTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <!-- <el-date-picker
                      v-model="value4"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                  </el-date-picker> -->
              </el-form-item>
              <el-form-item label="监考老师">
                <el-select 
                    v-model="addExceptionForm.teachers" 
                    value-key = "id" style="width:300px"
                    placeholder="请选择监考老师" 
                    multiple 
                    clearable 
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="getTeacher">
                    <el-option 
                        v-for="(item) in teacherList"
                        :key="item.id" 
                        :label="item.name" 
                        :value="item"> 
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input style="width: 300px;" v-model="remarks"></el-input>
            </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="cm-table">
        <el-table :data="multipleSelection"  border style="width: 100%; margin-top: 20px" size="mini" highlight-current-row :header-cell-style="getRowClass"   v-loading="tableLoading" element-loading-text="加载中……" @selection-change="handleSelectionChange" element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-table-column type="index" width="50">
          </el-table-column>

          <el-table-column prop="grade" label="所在级">
          </el-table-column>

          <el-table-column prop="majorName" label="专业">
          </el-table-column>

          <el-table-column prop="courseName" label="课程">
          </el-table-column>

          <el-table-column prop="termName" label="考试学期">
          </el-table-column>

          <el-table-column prop="studentNo" label="学号">
          </el-table-column>

          <el-table-column prop="studentName" label="姓名">
          </el-table-column>


          <el-table-column prop="stageName" label="阶段">
          </el-table-column>

          <el-table-column prop="scoreTypeName" label="成绩类型">
          </el-table-column>

          <el-table-column prop="score" label="成绩">
          </el-table-column>

          <el-table-column prop="resitNum" label="已补考次数">
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deletecont(scope.row,scope.$index)" v-if="btnPerObj.delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer" v-if="ifnone">
        <el-button size="mini" @click="closediaong()">取 消</el-button>
        <el-button size="mini" type="primary" @click="determine()" :disabled="nomine">确 定</el-button>
        <!-- <el-button size="mini" type="primary" @click="openprint()">确定并打印</el-button> -->
      </span>
    </el-dialog>
     <el-dialog
            title=""
            :visible.sync="printDialog"
             :fullscreen="true"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            :show-close="true"
            class="import-teachers-list printtable">
        <div  v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                <div>
                   请使用A4纸张打印进行打印 
                </div>
                <div class="btnbox">
                    <el-button size="mini" @click="closeprint()">关闭</el-button>
                    <el-button size="mini" type="primary" @click="printcontent()">确定并打印</el-button>
                </div>
        </div>
        <div>
          <p class="printtitle">{{coursename}} {{stageName}}阶段补考名单</p>
        </div>
        <div>
          
          <div class="printcont">
            <P class="printtitle2">年级专业：{{grade}}{{majorName}}</P>
             <table border="1" width="100%" class="tab2">
                <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>阶段</td>
                    <td>补考成绩（卷面）</td>
                    <td>学生签字</td>
                </tr>
                <tr v-for="list in multipleSelection">
                    <td>{{list.studentNo}}</td>
                    <td>{{list.studentName}}</td>
                    <td>{{list.stageName}}</td>
                    <td>{{list.score}}</td>
                    <td></td>
                </tr>
            </table>
          </div>

          <div class="printfont">
            <div>
              备注：1、以上成绩务必按照年级、专业分页填报、以便存档
            </div>
            <div>
               &#X3000;&#X3000;&#X3000;2、补考后阶段成绩：最高按照60分 （包括补考卷面+平时成绩）
            </div>
            <div class="autograph">
              <div class="autograph1">监考老师签名:</div>
              <div class="autograph1">补考时间:</div>
              <div class="autograph1">教研室主任签名:</div>
            </div>
          </div>
        </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '@/util'
  const TYPE = 'repair_query';
  const REMARK = '补考名单查询';

  export default {
    name: TYPE,
    data() {
      return {
        printDialog:'',//打印的弹框
        nomine:false,
        ifnone: true,
        arelist: [], //场地列表
        tableData2: [],
        tableData4: [],
        ifnone: true,
        teacherList: [],
        resitListId: '', //新增不及格的学生
        tableData3: [],
        multipleSelection: [],
        printDialog: false, //打印的弹框false就是隐藏
        addDialog: false, //添加学生的弹窗
        creatDialog: false, //创建名单的弹窗
        studentNo: '', //学号
        resitNum: '', //补考次数
        addExceptionForm: {
          teachers: [], //授课教师
          teacher: ''
      },
      remarks: '',
        formDetails: {
          areaId: '', //
          capacity: '', //容量
          examinationTime: '', //考试时间
        },

        rules: {
          areaId: [
            { required: true, message: '请选择场地', trigger: 'change' }

          ],
          capacity: [
            { required: true, message: '请输入容量', trigger: 'blur' }
          ],
          examinationTime: [
            { required: true, message: '请选考试时间', trigger: 'change' }
          ],
        },
        resitlist: [
        {
          num: '0次',
          id: 1
        },
        {
          num: '1次',
          id: 2
        },
        {
          num: '2次',
          id: 3
        },
        {
          num: '3次',
          id: 4
        },
        {
          num: '4次',
          id: 5
        }, ], //补考次数
        printStatus: '',
        printStatuslist: [
        {
          val: '0',
          name: '未安排'
        },
        {
          val: '1',
          name: '已安排'
        },
        {
          val: '2',
          name: '已打印'
        }, ], //补考状态
        // createdata:'',//创建日期
        termId: '', //学期的第N个
        termName: '', //学期
        majorName: '', //专业
        stageName: '', //阶段
        semesterList: [], //学期列表
        courseId: '', //课程
        scoreTypeId: '', // 成绩类型
        examinationlist: [],
        coursename: "", //课程名字
        courseList: [], //课程列表
        grade: '', //所在级
        majorId: '', //专业
        majorList: [], //专业列表
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        type: REMARK,
        breadcrumb: [
          { label: "成绩管理" },
          { label: REMARK },
        ],
        checked: true,
        formLabelWidth: '60px',

        gradeOptions: [], //所在级
        majorIdOptions: [], //专业ID
        schemeIdOptions: [], //测评方案ID
        semesterYearOptions: [], //学年
        administrativeClassIdOptions: [], //行政班ID
        options: [
          { value: '选项1', label: '黄金糕' },
          { value: '选项2', label: '双皮奶' }
        ],
        tableLoading: false,
        tableData: [],
        tableList: [
          { label: '所在级', prop: 'studentId' },
          { label: '专业', prop: 'name' },
          { label: '课程', prop: 'remark' },
          { label: '不及格学期', prop: 'ranking', width: 120 },
          { label: '阶段', prop: 'grade' },
          { label: '人数', prop: 'intellectual', width: 120 },
          { label: '已打印', prop: 'moral' },
          { label: '创建人', prop: 'physical' },
          { label: '创建日期', prop: 'aa', width: 120 }
        ],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        loading:false,
        btnPerObj: {
          create: false,
          print_list: false,
          view_list: false,
          add_student: false,
          delete: false,
          query: false,
        }
      }
    },
    mounted() {
      util.resize(this);
      window.onresize = () => {
        util.resize(this);
      };
      window.onmouseout = () => {
        this.ifnoneshow();
      }

      util.openBtnPermit(this.btnPerObj);
      //          this.getBtnPermit();//按钮权限

    },
    computed:{
        disableResitBtn:function(){
          return this.multipleSelection.length>0?false:true;
        }
    },
    created() {
      this.getscoreSett()
      this.getTermData();
      // this.getMajorList();
      // this.onSearch()
    },
    destroyed() {
      clearTimeout(this.setTimeout)
    },
    methods: {
      changeTerm(val){
        this.courseList=""
        this.courseId=''
        this.getCourseList()
      },
      changeGrage(){
        this.courseList=""
        this.courseId=''
        this.getCourseList()
      },
      tableHeight(){
        return window.innerHeight - 190
      },
       remoteMethod(query) {
         let self = this;
        if (query && query.length > 0) {
          self.loading = true;
          self.setTimeout = setTimeout(() => {
            self.$http.get('_op:/areas/combox/search/'+query).then( res =>{
                if(res.code == 0){
                  self.arelist = res.data;
                  self.loading = false;
                  clearTimeout(self.setTimeout);
                }
            }) 
          }, 200);
        } else {
          this.options = [];
        }
      },
      selectable(row,index){
          if(row.printStatus == 0 || !row.printStatus){
              return true;
          }else{
              return false;
          }
      },
      findrepeat(val,row,column){
      
      },
      formatDate(now) { //时间转换
       

        var y = now.getFullYear();
        var m = now.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = now.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = now.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = now.getMinutes();
        var second = now.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second;

      },
      getCourseList1(grade, major, term) {
          if(this.grade == "") {
              grade = 0
          }else{
              grade = grade
          }
          if(this.majorId == "") {
              major = 0
          }else{
              major = major
          }
          if(this.termId == "") {
              term = 0
          }else{
              term = term
          }
          this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
            if (data.code == 0) {
                this.courseList = data.data;
            } else {
                this.$message.error(data.msg);
            }
          });
      },
      getnewdate(timers) {
        if(timers){
           return this.formatDate(new Date(timers))
        }
       
      },
      getscoreSett(){ //查询成绩类型列表
        return this.$http.get('_sc:/scoreSetting/combox/SCORE_TYPE').then(res=>{
         this.examinationlist =  res.data
        }) 
      },
      // 模糊搜索匹配多个老师
  getTeacher(str, callback){
    this.teacherStr = str
    let self = this
    let teacherTemp = []
    if (str == null || str.length <= 0) return;
            
        return this.$http.post("_ed:/exchangecourse/query/teacher",{
          str:str
        }).then(data=>{
                
      var temp = data.data;
      temp.forEach(item => {
        teacherTemp.push({
          id: item.id,
          name: item.name
        })
      })
      if (! this.teachersList)  this.teachersList = [];
      // if (self.addExceptionForm.teachers.length > 0) {
        
      //   self.addExceptionForm.teachers.forEach(x => {
      //     var l = teacherTemp.filter(t => t.id == x.id);
      //     if (l.length <= 0) {
      //       teacherTemp = teacherTemp.concat(x);
      //     }
      //   })
      // }
      self.teacherList=teacherTemp;
      self.loading = false;
      if (callback != null) {
        if (typeof(callback) == 'function') {
          callback(teacherTemp);
        }
      }
            }).catch((res)=>{
                this.$message.error(res.msg);
                this.load_model.close();
            })
      },
      determine() {
          this.$refs.formDetails.validate((valid) => {
          if (valid) {
           
            if(this.formDetails.examinationTime[0]>this.formDetails.examinationTime[1]){
              this.$message({
                  type: 'waring',
                  message: '考试时间填写错误'
              });
            }else{
                let stuats = 1
                let self = this
                this.getsubmit(stuats)
            }
            
          } else {
         
          return false;
          }
      });
       
      },
      
      determineAndPrinting() {
        let self = this
        self.ifnone = false
        setTimeout(() => {
          window.print();
        }, 100)
        // let stuats = 2
        // this.getsubmit(stuats)

      },
      editTimestampToTime(timestamp) {
        let date = new Date(timestamp);  // times 时间戳（通常为13位）
        let  Y = date.getFullYear();
        let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
        let  D = (date.getDate() < 10 ?'0'+ date.getDate() : date.getDate());
        let  H = date.getHours() < 10 ?'0'+ date.getHours() : date.getHours();
        let  Min = date.getMinutes() < 10 ?'0'+ date.getMinutes() : date.getMinutes();
        let  S = date.getSeconds() < 10 ?'0'+ date.getSeconds() : date.getSeconds();
        return Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
      },
       getsubmit(stuats){ //确定并打印
          let studentList = []
          let message =''
          if(stuats==1){
            message = '保存成功'
          }else{
              message = '保存并打印成功'
          }
  
            for(let i=0;i<this.multipleSelection.length;i++){
               let obj = {}
               obj.gradeMark = this.multipleSelection[i].gradeMark
               obj.studentName = this.multipleSelection[i].studentName
               obj.studentNo = this.multipleSelection[i].studentNo
              obj.course = this.multipleSelection[i].course
              obj.grade = this.multipleSelection[i].grade
              obj.id = this.multipleSelection[i].id
              obj.major = this.multipleSelection[i].major
              obj.stageName = this.multipleSelection[i].stageName
              obj.termId = this.multipleSelection[i].termId
              obj.resitDelayedType = this.multipleSelection[i].resitDelayedType
              obj.scoreTypeId = this.multipleSelection[i].scoreTypeId
              studentList.push(obj)
            }
        if(!this.formDetails.areaId){
           this.$message({
                type: 'error',
                message: '请选择场地'
            });
            return ;
        }
         let query = {
            remark: this.remarks,
            monitorTeachers: this.addExceptionForm.teachers,
            areaId: this.formDetails.areaId.id,
            printStatus: stuats,
            endResitTime: this.editTimestampToTime(this.formDetails.examinationTime[1]) ,
            startResitTime: this.editTimestampToTime(this.formDetails.examinationTime[0]) ,
            studentList:studentList
         }
         this.$http.post('_sc:/resitList',query).then(res=>{
              if(res.code==0){
                   this.$message({
                        type: 'success',
                        message: message
                    });
                    this.$refs.formDetails.resetFields();
                   self.nomine = true
                  this.creatDialog = false
                  this.onSearch()
              }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
              }
           
         })
      },
            getcapacity(item){
              this.formDetails.capacity = item.data.capacity;
            },
            colsemajor(){
              this.courseList=""
              this.courseId=''
              this.getCourseList()
            },
       //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                  
                    data.data.map(item => {
                        if (item.code=="create_list_resitList") {//创建名单
                            self.btnPerObj.create=true;
                        }
                        if (item.code=="print_list_resitList") { //打印名单
                            self.btnPerObj.print_list=true;
                        }
                        if (item.code=="view_list_resitList") {//查看名单
                            self.btnPerObj.view_list=true;
                        }
                        if (item.code=="add_student_resitList") {//添加学生
                            self.btnPerObj.add_student=true;
                        }
                        if (item.code=="del_resitList") { 
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="query_resitList") {
                            self.btnPerObj.query=true;
                        }
                    });
                }).catch(()=>{
                })
            },

      // 创建补缓考名单 根据专业获取课程
      getCourse() {
        if (this.majorId !== '') {

        }

      },
      deletecont(row,index) {
        this.$confirm(`此操作将永久删除该信息信息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           
            this.multipleSelection.splice(index,1)
    
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      printcontent() {
        let self = this
      
        
        if(self.formDetails.areaId==''||self.formDetails.areaId==null){
          
          self.$message.error('请选择场地')
          
        }else{
            self.ifnone = false
            setTimeout(() => {
              window.print();
            }, 100)
          this.determine()
          this.closeprint()
        }
        
      },
      ifnoneshow() {
        let self = this
        self.ifnone = true;
      },
     openprint(){//打开打印的弹框
        this.printDialog =  true
      
        this.getresitList()
	  },
	  getresitList(){
      let self =this
      let resitListId = 100
      
      self.$http.get('_sc:/resitList/'+resitListId).then(data=>{
        self.tableData2 = data.data
      }).catch(err=>{
        console.log(err)
      })
	  },

      closeprint() { //关闭打印的弹框
        this.printDialog = false
      },
      closediaong() {
        
        this.creatDialog = false
        this.$refs.multipleTable2.clearSelection();
        this.$refs.formDetails.resetFields();
      },  
     


      addstudent(row) {
     
        this.grade = row.grade.toString()
        this.majorName = row.majorName
        this.termName = row.termName
        this.coursename = row.courseName
        this.stageName = row.stageName
        this.addDialog = true
        this.resitListId = row.id

        let resitListId = this.resitListId
        //根据补缓考名单记录ID查询需要添加的学生名单
        this.$http.get('_sc:/resitList/getNeedResitList/' + resitListId).then(data => {
          this.tableData4 = data.data
        }).catch(err => {
          console.log(err)
        })
      },
    
      createlist(){ //打开创建的弹框
            this.nomine = false;
            this.creatDialog = true;
            this.formDetails.areaId = null;
          
          
      },
       handleSelectionChange(val) {
      
        this.multipleSelection = val;
        
       
      },
      onSearch() {
        this.tableData = []
        let printStatus
        if(this.printStatus == "") {
          printStatus = null
        }else{
          printStatus = Number(this.printStatus)
        }
        this.$http.get('_auths:authorize/me').then(me_resp => {
            let r = me_resp.result.attributes
            let b= ''
            if(r.login_info){
              b = r.login_info.id
                // util.setStorage('teacherId',b.id);
            } else {
              b= ''
            }

            let roles = [];
            if(me_resp.result.roles && me_resp.result.roles.length){
                me_resp.result.roles.map(item => {
                    roles.push(item.id)
                })
                // util.setStorage('teacherRoles',roles.join(','));
                roles = roles.join(',')
            }else{
                // util.setStorage('teacherRoles','');
                roles = ''
            }
            let query = {
              course: this.courseId,
              grade: Number(this.grade),
              major: this.majorId,
              printStatus: printStatus,
              resit: null,
              resitNum: this.resitNum,
              studentNo: this.studentNo,
              termId: this.termId,
              scoreTypeId: this.scoreTypeId,
              userId: b,
              roles
            }
            this.$http.post("_sc:/scoreSetting/queryExamApply", query).then(res => {
              this.tableData = res.data
            })
        })
      },

      changeGetNewCoure(val) {
        if (this.majorId !== '') {
          this.getCourseList(val);
        }

      },
      getMajor() {
        let grade
        if(this.grade == '' || this.grade == null) {
            grade = 0
        }else {
            grade = this.grade
        }
        this.majorId = ''
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
      this.getCourseList1(this.grade, this.majorId, this.termId)
      this.courseId = ''
      this.courseList = [];
      let param = {
        grade: this.grade,
        majorId: this.majorId,
        termId: this.termId
      };
      // this.$http
      //   .post("_sc:/courseScoreModel/getCourseByParam", param)
      //   .then(data => {
      //     if (data.code == 0) {
      //       if (data.data && data.data.length) {
      //         this.courseList = data.data;
      //       }
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },
      // getCourseList(val) { //查询课程
      //   this.courseList = []
      //   this.courseId = ''
      //   let termId = this.termId
      //   let grade = ''
      //   let majorId = ''
      //   if(this.termId=="" || this.termId == null){
      //     termId=0;
      //   }else{
      //     termId= this.termId;
      //   }
      //   if(this.grade=="" || this.grade == null){
      //     grade=0;
      //   }else{
      //     grade= this.grade;
      //   }
      //   if(this.majorId==""){
      //     majorId=0;
      //   }else{
      //     majorId=this.majorId;
      //   }
      //   this.$http.get("_sc:/stuScore/getcombox"+"/"+ termId +"/"+grade+"/"+majorId).then(data =>{
      //         if(data.code==0){
      //           this.courseList = data.data;
      //       }else{
      //           this.$message.error(data.msg);
      //       }
      //   })
      // },
      getMajorList() { //查询专业列表
        this.$http.get("_op:/major/combox").then(data => {
          if (data.code == 0) {
            this.majorList = data.data;
            // this.majorId=data.data[0].id;
            // this.getCourseList(data.data[0].id)
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      getTermData() { //查询学期列表
        let query = "学期"
        this.$http.get('_op:/terms/' + query).then(data => {
          if (data.code == 0) {
            this.semesterList = data.data.reverse();;
              for(let i=0;i<this.semesterList.length;i++){ 
                  if(this.semesterList[i].name.indexOf('当前学期')!=-1){
                      this.termId=this.semesterList[i].id
                  } 
              }
              this.getCourseList()            
              this.onSearch()

          } else {
            this.$message.error(data.msg);
          }
        })
      },
      sizeChange(size) {
     
      },
      currentChange(current) {
      
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#EFEFEF'
        } else {
          return ''
        }
      },
      onEvaluation() {
      
      },


      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
    }
  }
</script>

<style scoped lang="less">
  .pull-right {
    text-align: right;
    margin-right: 10px;
  }

  .content1 {
    display: flex;
    margin-left: 20px;

    .fromleft {
      width: 40%
    }

    .tltlesize {
      font-size: 16px;
      font-weight: bold;
      line-height: 35px;
      padding-left: 35px;
    }

  }

  .content2 {

    margin-left: 80px;

    .fromright {
      width: 100%;
    }

    .tltlesize2 {
      font-size: 16px;
      line-height: 35px;
    }

  }

  .dialogheader {
    display: flex;
    position: relative;
    border-bottom: solid 1px #66666636;
    height: 33px;

    .btnbox {
      position: absolute;
      right: 0px;
    }
  }

  .printtable {
    /deep/.el-dialog__body {
      padding-top: 0px
    }

    .printtitle {
      font-size: 18px;
      font-weight: bold;
      text-align: center
    }

    .printtitle2 {
      font-size: 14px;
      font-weight: bold;
      line-height: 31px;
    }

    .printcont {
      width: 90%;
      margin: 0 auto;
      margin-top: 5px;
      min-height: 500px;

    }

    .printfont {
      width: 90%;
      margin: 0 auto;
      margin-top: 5px;
    }

    .autograph1 {
      width: 50%;
    }
  }

  .autograph {
    display: flex;
    flex-wrap: wrap;

    .autograph1 {
      width: 50%;
      line-height: 50px;
    }
  }

  .tab2 {
    border: solid 1px #66666636;

    td {
      text-align: center;
      height: 40px;
    }

  }
</style>