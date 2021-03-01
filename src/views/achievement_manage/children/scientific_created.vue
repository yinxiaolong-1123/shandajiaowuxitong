<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>


    <div class="cm-fold">
 <el-form size="mini" :inline="true"  :model="formDetails" ref="formDetails" :rules="rules" >
                <div class="fold">
                         <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期" prop="semester">
                            <el-select 
                                v-model="formDetails.semester"
                                @change="getCourseList()"
                               clearable
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="所在级" prop="grade">
                            <intelligent-year-picker
                            	:clearable="false"
                                v-model="formDetails.grade"
                                @change="getCourseList('grade')"
                                style="width:120px"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        
                        <el-form-item label="专业" prop="majorId">
                            <el-select v-model="formDetails.majorId"
                             filterable
                            @change="getCourseList()"
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="课程" prop="courseId">
                            <el-select clearable
                            	v-model="formDetails.courseId" 
                            	filterable placeholder="选择课程">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id" ></el-option>
                            </el-select>
                        </el-form-item>
                        
                    </div>
                    <div class="btn">
                          <el-button type="primary" size="mini" @click="submitForm('formDetails')" >查询</el-button>
                    </div>
                </div>
             
            </el-form>
    </div>

    <div class="cm-btn-con " style="padding:0  0  10px 20px;">
      <div class="conbox">
        <div class="btnbox" >
           
          <el-button size="mini" type="primary" v-if="readyToPrint" @click="delColumns()">批量删除</el-button>
          <el-button size="mini" type="primary" @click="openPrintDalong()" v-if="!readyToPrint">打印</el-button>
          <el-button size="mini" type="primary" @click="submitScore()" v-if="readyToPrint">提交</el-button>
          <el-button size="mini" type="primary" @click="importStuScore()"  v-if="readyToPrint">批量导入</el-button>
          <el-button size="mini" type="primary" @click="addcontent()" v-if="readyToPrint">新增</el-button>

          <!-- <el-button size="mini" @click=""> <a href="../../../template/moral-texplate.xlsx" download='教学科与德育通用模板.xlsx'>下载模板</a></el-button> -->
          <el-button size="mini" type="primary" @click="exportTable('formDetails')" >导出</el-button>
           <a v-show="false" ref="exportExcel"></a>
        </div>
      

      </div>
    </div>
    <el-dialog width="425px" class="addformDetail" :close-on-click-modal="false" :title="dialog.status=='add'?'新增':'编辑'" :visible.sync="dialog.visible" :modal-append-to-body="false" @closed="dialogClose('formDetail')">
      <el-form ref="formDetail" :rules="rules2" :model="formDetail" class="adddialog">

        <el-form-item label="学期" prop="termId" class="flex-form">
          <el-select v-model="formDetail.termId" filterable clearable placeholder="选择学期">
            <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

           <el-form-item label="所在级" prop="grade"  class="flex-form">
            <intelligent-year-picker   :clearable="false"  v-model="formDetail.grade" type="year"   value-format="yyyy"  placeholder="选择年级"> 
            </intelligent-year-picker>
        </el-form-item>
                        
        <el-form-item label="专业" prop="majorId"  class="flex-form">
            <el-select v-model="formDetail.majorId" clearable filterable placeholder="请选择">
                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="课程" prop="courseId" class="flex-form">
          <el-select v-model="formDetail.courseId" filterable clearable placeholder="选择课程">
            <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学号" class="flex-form" prop="studentNo" placeholder="请输入学号">
          <el-input v-model="formDetail.studentNo" @blur="getstudentname(formDetail.studentNo)"></el-input>
        </el-form-item>


        <el-form-item label="姓名" prop="studentname" class="flex-form ">
          <el-input v-model="formDetail.studentname" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="课程成绩" class="flex-form" prop="courseGrade">
          <el-input-number v-model="formDetail.courseGrade" :min="0" :max="100" label="请输入成绩"></el-input-number>
        </el-form-item>


        <el-form-item label="考试状态" class="flex-form" prop="stauts">
          <el-select v-model="formDetail.stauts" filterable placeholder="请选择考试状态">
            <el-option v-for="item in examinationstutslist" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogClose('formDetail')">取 消</el-button>
        <el-button size="mini" type="primary" @click="addsubmitForm('formDetail')">确 定</el-button>
      </span>
    </el-dialog>
    <div class="cm-table">
      <ElBigdataTable
        border
        size="mini"
        :height="tableHeight()"
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column type="selection" :selectable="canChoice" prop="status" label="序号" fixed width="45"></el-table-column>

        <el-table-column prop="administrativeclassname" label="行政班"></el-table-column>

        <el-table-column prop="studentno" label="学号"></el-table-column>

        <el-table-column prop="name" label="姓名"></el-table-column>

        <el-table-column prop="courseName" label="课程"></el-table-column>

        <el-table-column prop="courseGrade" label="课程成绩">
          <template slot-scope="scope">
               <el-input :id="`s${scope.$index}`" @keyup.enter.native="nextFocus(scope.row, scope.$index, $event)" class="myinput"  @blur="OnBlurEvent(scope.row, scope.$index)" size="mini" :maxlength="5" 
               :disabled="scope.row.status != 0 || (tableData1[scope.$index].examStatus == 1 || tableData1[scope.$index].examStatus == 4 || tableData1[scope.$index].examStatus == 6 || tableData1[scope.$index].examStatus == 3)" 
               v-model="scope.row.courseGrade" ></el-input>
          </template>
        </el-table-column>

        <el-table-column prop="examStatus" label="考试状态">
          <template slot-scope="scope">
            <el-select v-model="tableData1[scope.$index].examStatus" :disabled="scope.row.status != 0" placeholder="请选择" filterable @change="OnBlurEvent(scope.row, scope.$index)" size="mini">
              <el-option v-for="item in examinationstutslist" :key="item.id" :disabled="item.name == '免修'" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注说明">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" 
            :disabled="scope.row.status != 0 || (tableData1[scope.$index].examStatus == 1 || tableData1[scope.$index].examStatus == 4 || tableData1[scope.$index].examStatus == 6 || tableData1[scope.$index].examStatus == 3)" @change="OnBlurEvent(scope.row, scope.$index)" size="mini"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createUserName" label="创建人"></el-table-column> -->
 
      </ElBigdataTable>
    </div>
    <el-dialog title="批量导入学生成绩" :visible.sync="importstudentDialog" width="450px" append-to-body :close-on-click-modal="false" @closed="" class="import-teachers-list">
      <!-- <div style="margin-bottom: 30px;">
                <el-button size="mini" @click=""> <a href="../../../template/教学科与德育通用模板.xlsx" download='教学科与德育通用模板.xlsx'>下载模板</a></el-button>
            </div>
             -->
      <el-upload class="upload-demo" ref="upload" action="" :file-list="fileList" :on-success="onSuccess" :on-change="fileSelected" :before-upload="onBefore" :auto-upload="false">
        <el-button slot="trigger" size="small">选取文件</el-button>
      </el-upload>
      <el-button style="margin-left: 10px;" size="small" type="primary" :disabled="allow" @click="submitUpload()">导入</el-button>

    </el-dialog>
    <el-dialog id="dalongs" :visible.sync="printDalong" append-to-body :fullscreen="true" :close-on-click-modal="false" :show-close="false" class="import-teachers-list printtable">
      <div v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
        <div>
          请使用A4纸张打印 &#X3000;按所在级+专业生成，进行打印
        </div>
        <div class="btnbox">
          <el-button size="mini" @click="printDalong=false">关闭</el-button>
          <el-button size="mini" type="primary" @click="Print()">打印</el-button>
        </div>
      </div>
      <div class="printcontent">
        <p class="title">
          汕头大学医学院课程成绩登记表
        </p>
      </div>

      　<template>
        <!-- 手动切换轮播 -->
        <el-carousel indicator-position="none" :autoplay="false" :height="contentHeight">
          <el-carousel-item v-for="(ScoreRecordDetails,index) in scoresheet" :key="index">
            <div class="printcontent">
              <p class="text" style="text-align: center;">
                <span class="subTime1">{{ScoreRecordDetails.grade}}级-{{ScoreRecordDetails.majorName}}专业 &#X3000;（{{ScoreRecordDetails.termName}}）</span>
                <span class="subTime">提交日期:{{ScoreRecordDetails.submitDate}}</span>
              </p>
              <table border="1" width="100%" class="tab1">
                <tr>
                  <td class="title1">课程名称</td>
                  <td class="curriculumName" colspan="2">{{ScoreRecordDetails.courseName}}</td>

                  <td class="title1">课程英文名称</td>
                  <td class="curriculumName" colspan="2">{{ScoreRecordDetails.courseEnName}}</td>
                </tr>
              </table>
            </div>
            <template v-for="list in ScoreRecordDetails.classStuScoreResultList">
              <p class="printtltle">
                {{list.administrativeClassName}} 学生总数：{{list.totalNum}}
              </p>
              <div style="display:flex">
                <table border="1" class="tab2" style="width:33.3%">
                  <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>课程成绩</td>
                  </tr>
                  <template v-if="list.mytabel1.length>0">
                    <tr v-for="lis in list.mytabel1">
                      <td>{{lis.studentNo}}</td>
                      <td>{{lis.studentName}}</td>
                      <td>{{lis.courseGrade}}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </template>
                </table>
                <table border="1" class="tab2" style="width:33.3%">
                  <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>课程成绩</td>
                  </tr>
                  <template v-if="list.mytabel2.length>0">
                    <tr v-for="lis in list.mytabel2">
                      <td>{{lis.studentNo}}</td>
                      <td>{{lis.studentName}}</td>
                      <td>{{lis.courseGrade}}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </template>
                </table>
                <table border="1" class="tab2" style="width:33.3%">
                  <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>课程成绩</td>
                  </tr>
                  <template v-if="list.mytabel3.length>0">
                    <tr v-for="lis in list.mytabel3">
                      <td>{{lis.studentNo}}</td>
                      <td>{{lis.studentName}}</td>
                      <td>{{lis.courseGrade}}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </template>
                </table>
                
              </div>
            </template>
          </el-carousel-item>
        </el-carousel>
      </template>


      <div style="display:flex;margin-top: 50px;">
        <div style="width:50%;padding-left:100px;">
          <p>监考老师签字:</p>
          <p>日期:</p>
        </div>
        <div style="width:50%;padding-left:100px;">
          <p>负责人签字:</p>
          <p>日期:</p>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '@/util'
  import moment from 'moment'
  const TYPE = "scientifiCreated";
  const dictionaryCode = "KYCX";
  const REMARK = "科研创新成绩录入";
  export default {
    name: TYPE,
    data() {
      return {
        tecId: '',
        tableLoading: false,
        multipleSelection: [],
        examinationstutslist: [],
        contentHeight: '300px', //默认轮播容器高度
        allow: false, //按钮状态
        swiperOption: {
          notNextTick: true, // 必须为true,保证的vue-awsome-swiper先加载
          loop: true, //循环
          slidesPerView: 1, //每页 的页数
          // speed: 400,         //轮播速度 
          // autoplay: true,     //自动轮播  
          grabCursor: true, //鼠标悬浮小手形状  
          //左右点击
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },

        dialog: {
          status: "add",
          visible: false
        },
        formDetail: {
          termId: '',
          grade:'',
          majorId:'',
          courseId: '',
          studentNo: "",
          studentname: "",
          courseGrade: "",
          stauts: "",

        },
        rules2: {
          termId: [
            { required: true, message: '请选择考试状态', trigger: 'change' }
          ],
           grade: [
            { required: true, message: '请选择所在级', trigger: 'change' }
          ],
          majorId: [
            { required: true, message: '请选择专业', trigger: 'change' }
          ],
          courseId: [
            { required: true, message: '请选择考试状态', trigger: 'change' }
          ],
          studentNo: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
     
          studentname: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          courseGrade: [
            { required: true, message: '请输入分数', trigger: 'blur' }
          ],
          stauts: [
            { required: true, message: '请选择考试状态', trigger: 'change' }
          ],
        },
        scoresheet: [],
        ifnone: true, //印的时候变为false
        ScoreRecordDetails: "", //成绩详情
        courseScoreModel: '',
        value: "选项1",
        options: [
        {
          value: '选项1',
          label: '百分制'
        }],
        type: REMARK,
        breadcrumb: [
          { label: "成绩管理" },
          { label: REMARK }
        ],
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        radio: '1',
        radio1: '1',
        recordId: null, //保存信息用的id
        importstudentDialog: false, //导入学生表的对话框
        fileList: [], //文件列表
        printDalong: false, //为true就是打开打印的弹框
        readyToPrint: true, ////为flase因此打印按钮
        semesterList: [], //学期列表
        majorList:[],//专业列表
        formDetails: { 
          semester: this.$route.query.semester ? +this.$route.query.semester : '', //学期
          grade: this.$route.query.grade || '',//所在级
          majorId: this.$route.query.majorId ? +this.$route.query.majorId : '',//专业
          courseId: this.$route.query.courseId ? +this.$route.query.courseId : '',//课程
        },
        rules: {
          semester: [
            { required: true, message: '请选择学期', trigger: 'change' }

          ],
           grade: [
            { required: true, message: '请选择所在级', trigger: 'change' }

          ],
           majorId: [
            { required: true, message: '请选择专业', trigger: 'change' }

          ],

          courseId: [
            { required: true, message: '请选择课程', trigger: 'change' }
          ],
        },
        courseList: [], //课程列表
        scoreType: "", //成绩类型
        tableData1: [],
        tableData: [],
        btnPerObj: {
          query: false,
          submit: false,
          batchimport: false,
          // printing:false

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
      if(this.formDetails.semester && this.formDetails.grade && this.formDetails.majorId && this.formDetails.courseId){
        this.onSearch();
      }
    },
    destroyed() {
      clearTimeout(this.setTimeout)
    },
    created() {
      this.getMajorList()
      this.getTermData();
      this.getCourseList();
      this.getexaminationstuts()
      this.$authorize.me().then(res => {
        this.tecId = res.attributes.login_info.id
      });
    },
    methods: {
       getMajor() {
          let grade
          if(this.formDetails.grade == '' || this.formDetails.grade == null) {
              grade = 0
          }else {
              grade = this.formDetails.grade
          }
          this.formDetails.majorId = ''
          this.majorList = []
          this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
              this.majorList = res.data
          })
      },
      getCourseList(flag){// 根据查询课程
        this.formDetails.courseId = ''
        this.courseList = []
        if(flag === 'grade') {
            this.getMajor()
        }
        if(this.formDetails.grade!=''&&this.formDetails.majorId!=''&&this.formDetails.semester!=''){
              let param = {
                "grade":this.formDetails.grade,
                "majorId":this.formDetails.majorId,
                "termId":this.formDetails.semester
            }
            let query = dictionaryCode
            this.$http.get("_op:/course/getCourseByCategoryCode/" + query).then(res => {
              this.courseList = res.data;
            }).catch(err => {

            })
            // this.$http.post("_sc:/courseScoreModel/getCourseByParam",param).then(data=>{
            //     if(data.code==0){
                    
            //         // if (data.data.length>0) {
            //         //     this.formDetails.courseId = data.data[0].id 
            //         // }
            //         this.courseList = data.data;
            //         if(this.formDetails.courseId && this.courseList && this.courseList.length){
            //             let have = this.courseList.find(item => item.courseId == this.formDetails.courseId);
            //             (have == undefined) && (this.formDetails.courseId = '');
            //         }
            //     }else{
            //         this.$message.error(data.msg);
            //     }
            // })
        }
    },
      canChoice(row, index){
        if (row.status == 0 && row.stuScoreId!=undefined) {
          return true
        } else {
          return false
        }
      },
      delColumns() {
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据!'
          })
          return
        }
        let query = {
          params: []
        }
        this.multipleSelection.map( item => {
          query.params.push(item.stuScoreId)
        })
        this.$http.post('_sc:/stuScore/batchDeleteStuScore',query).then( res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.onSearch()
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            });
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tableHeight(){
        return document.body.clientHeight - 210
      },
      nextFocus(row, index, e) {
        
            let slef = this
            e.target.blur()
            var nextId;
            var loop;
        
            if (index >= slef.tableData.length-1) {
              index = -1;
            }
            for (loop = index+1; loop < slef.tableData.length; loop++) {
            
              if (slef.tableData[loop].examStatus == 0) {
              
                nextId = loop;
                break;
              }
            }
            document.getElementById(`s${nextId}`).focus()
       
      },
      exportTable(formName){
          this.$refs[formName].validate(valid => {
          if (valid) {
              this.exportResult()
           

          } else {
          
            return false;
          }
        });
      },
      exportResult(){
        let params = {
          grade:this.formDetails.grade,
          major:this.formDetails.majorId,
          course: this.formDetails.courseId,
          termId: this.formDetails.semester
        }
        let semesterName = ''
        let majorName = ''
        let courseName = ''
        this.semesterList.forEach( item => {
          if(item.id == this.formDetails.semester) {
            semesterName = item.name
          }
        })
        this.majorList.forEach( item => {
          if(item.id == this.formDetails.majorId) {
            majorName = item.name
          }
        })
        this.courseList.forEach( item => {
          if(item.id == this.formDetails.courseId) {
            courseName = item.name
          }
        })
        this.$http2.post('_sc:/stuScore/exportResult',params).then(data=>{
              let url = window.URL.createObjectURL(new Blob([data]));
              let y = this.$refs.exportExcel;
              y.href = url;
              y.setAttribute("download", `${semesterName}-${courseName}-${this.formDetails.grade}-${majorName}.xls`);
              y.click();
              window.URL.revokeObjectURL(url);
        })
       
      },
      addcontent() {
        this.formDetail.termId = this.formDetails.semester
        this.formDetail.grade = this.formDetails.grade
        this.formDetail.majorId = this.formDetails.majorId
        this.formDetail.courseId = this.formDetails.courseId
        this.dialog.visible = true
        this.dialog.status = 'add'
      },

      addsubmitForm() {
        this.$refs.formDetail.validate(valid => {
          if (valid) {
            if (this.formDetail.courseGrade < 0 || this.formDetail.courseGrade > 100) {
              this.$message({
                type: 'warning',
                message: '您输入的分数不正确！'
              });

            } else {
              this.formDetails.semester = this.formDetail.termId
              this.formDetails.grade = this.formDetail.grade
              this.formDetails.majorId = this.formDetail.majorId
              this.formDetails.courseId = this.formDetail.courseId
              this.dialog.visible = true
              this.dialog.status = 'add'
              this.addstuScore()
            }

          } else {
        
            return false;
          }
        });

      },
      addstuScore() {
       
        let stuScoreList = [];
          let obj = {};
          
           obj.studentName = this.formDetail.studentname,
           obj.studentNo = this.formDetail.studentNo,
           obj.courseGrade =  this.formDetail.courseGrade,
           obj.examStatus= this.formDetail.stauts

          stuScoreList.push(obj)

          let query = {
              examTypeCode:dictionaryCode,
              grade:this.formDetail.grade,
              major:this.formDetail.majorId,
              course: this.formDetail.courseId,
              termId: this.formDetail.termId,
              stuScoreList:stuScoreList

          }
        this.$http.post("_sc:/stuScore/addList", query).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: "新增成功!"
            });
            // this.dialogClose('formDetail')
            this.formDetail.studentname = "";
            this.formDetail.studentNo = "";
            this.formDetail.courseGrade = "";
            this.onSearch();
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            });
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
      },
      getstudentname(val) {
        if (!val) return;
        let query = {
          pageNo: 1,
          pageSize: 10,
          param: {
            stuNum: val,
                status:1
          }
        }
        this.$http.post('_op:/students/list', query).then(data => {

          let self = this
          if (data.data.records.length < 1) {
            // self.showstudentsinfo = false
            self.formDetail.studentNo = ''
            self.$message.error('数据库找不到该学号')
          } else {
            self.formDetail.studentname = data.data.records[0].name
            self.formDetail.studentNo = data.data.records[0].stuNum
         
          }
        }).catch(err => {
          console.log(err)
        })
      },
      dialogClose(formDialog) { //关闭弹窗
        this.$refs[formDialog].resetFields(); //todo 重置数据未生效
        this.formDetail.studentNo = ''
        this.formDetail.studentname = ''
        this.formDetail.scoreType = ''
        this.formDetail.stauts = ''
        this.formDetail.id = ''
        this.formDetail.candidateNum = ''
        this.dialog.visible = false;
        this.dialog.status = ''

      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.onSearch();
          } else {
        
            return false;
          }
        });
      },
      //获取按钮权限
      getBtnPermit() {
        let self = this;
        let actionId = this.$route.query.actionId;
        this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
        
          data.data.map(item => {
            if (item.code == "query_jiaoxuekechengjiluru") {
              self.btnPerObj.query = true;
            }
            if (item.code == "submit_jiaoxuekechengjiluru") {
              self.btnPerObj.submit = true;
            }
            if (item.code == "batch_import_jiaoxuekechengjiluru") {
              self.btnPerObj.batchimport = true;
            }
          });
        }).catch(() => {})
      },
      // getCourseList() {
      //   //查询课程
      //   let query = dictionaryCode
      //   this.$http.get("_op:/course/getCourseByCategoryCode/" + query).then(res => {
      //     this.courseList = res.data;
      //   }).catch(err => {

      //   })
      // },
      handleDelete(row) {
        this.$confirm(`此操作将永久删除${row.studentName} 的 ${row.courseName} 成绩信息 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("_sc:/stuScore/" + row.id)
            .then(data => {
              let type = "success";
              let message = "删除成功！";
              if (data.code === 0) {
                this.onSearch();
              } else {
                type = "error";
                message = data.data;
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
      closebox() { //关闭弹窗盒子
        this.printDalong = false
      },
      openPrintDalong(recordId) {
        // this.printDalong = true
        // this.queryScoreRecordDetails()
        let param = {
            scoreType: null,
            type: 'JXK',
            recordId: this.recordId,
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
                semester: this.formDetails.semester,
                grade: this.formDetails.grade,
                majorId: this.formDetails.majorId,
                courseId: this.formDetails.courseId
            }
        })
        // window.location.href = 'file:///D:/minxing/汕头大学教务系统/intelligent-tutoring-web/intelligent-tutoring-web/public/pages/page/myprint.html'
        window.location.href = prefix + '/pages/page/myprint.html?cmd='+amdd+'&token='+token;
      },
      Print() {
        let self = this
        self.ifnone = false
        setTimeout(() => {
          window.print();
        }, 100)
      },
      ifnoneshow() {
        let self = this
        self.ifnone = true;
      },
      queryScoreRecordDetails() {
        let id = this.recordId
        // let id = 319
        let ads = []

        if (id == null || id == '' || id == undefined) {
          return
        } else {
          let url = '_sc:/scoreRecord/queryScoreRecordDetails/' + id
          this.$http.get(url).then(data => {
          
            let self = this
            let totalrow = 0
            for (let k = 0; k < data.data.length; k++) {

              for (let i = 0; i < data.data[k].classStuScoreResultList.length; i++) {
                let leth = Math.ceil(data.data[k].classStuScoreResultList[i].stuScoreList.length / 3)

                data.data[k].classStuScoreResultList[i].mytabel1 = data.data[k].classStuScoreResultList[i].stuScoreList.slice(0, leth)
                totalrow += data.data[k].classStuScoreResultList[i].mytabel1.length
                totalrow = totalrow * data.data[k].classStuScoreResultList.length + 1
                data.data[k].classStuScoreResultList[i].mytabel2 = data.data[k].classStuScoreResultList[i].stuScoreList.slice(leth, 2 * leth)
                if (data.data[k].classStuScoreResultList[i].stuScoreList.length > 2) {
                  data.data[k].classStuScoreResultList[i].mytabel3 = data.data[k].classStuScoreResultList[i].stuScoreList.slice(2 * leth, 3 * leth)
                } else {
                  data.data[k].classStuScoreResultList[i].mytabel3 = []
                }
              }
            }
            self.scoresheet = data.data
         
            self.contentHeight = (totalrow + 6) * 26 + 'px'
          }).catch(err => {
            console.log(err)
          })
        }
      },
      submitScore() { //把表单提交到记载
        if (this.tableData.length==0) {
          this.$message({
            message: '没有数据提交！',
            type: 'warning'
          });
        }else if(this.tableData.length>0){
          let flag = false
          this.tableData.forEach(item => {
            if(item.courseGrade === ''){
              flag = true
              return
            }
          })
          if(flag){
            this.$message({
              type: 'warning',
              message: '需填写所有课程成绩才能提交!'
            })
            return
          }
          let query = {
             grade:this.formDetails.grade,
              major:this.formDetails.majorId,
              course: this.formDetails.courseId,
              termId: this.formDetails.semester,
              examTypeCode:dictionaryCode
          }
          this.$http.post('_sc:/scoreRecord',query
            ).then(data => {
              if (data.code == 0) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                });
                this.onSearch()
                this.readyToPrint = false
                this.importstudentDialog = false
                // this.readyToPrint = false
                this.importstudentDialog = false
              } else {
                this.$message.error(data.msg)
              }
            }).catch(err => {
              this.$message.error(err.msg)
            })
        }
      },
      OnBlurEvent(row,index) { //光标离开时的事件
        let examStatus = this.tableData1[index].examStatus
        if(row.courseGrade=='' && (examStatus == 2 || examStatus == 5 || examStatus == 0)){
          row.courseGrade = ''
          return;
        }
        let tempScore
        if(examStatus == 6 || examStatus == 1 || examStatus == 4 || examStatus == 3){
           tempScore = 0
           row.courseGrade = 0
        }else{
          tempScore = row.courseGrade
        }
        // if(/^[+]?\d*\.?\d{0,1}$/.test(row.courseGrade)==false){
        //     self.$message.error("只能有一位小数");
        //     row.courseGrade = "";
        //     return;
        
        // }
        if (row.courseGrade < 0) {
          this.$message({
            message: '输入的分数错误！请重新输入',
            type: 'error'
          });
        } else {
          let stuScoreList = [];
          let obj = {};
          obj.administrativeClassId = row.administrativeclassid
           obj.studentName = row.name,
           obj.studentNo = row.studentno,
           obj.courseGrade = tempScore,
           obj.examStatus= examStatus,
          //  obj.examStatus= row.examStatus,
           obj.remark = row.remark
          stuScoreList.push(obj)

          let query = {
            
              examTypeCode:dictionaryCode,
              grade:this.formDetails.grade,
              major:this.formDetails.majorId,
              course: this.formDetails.courseId,
              termId: this.formDetails.semester,
              stuScoreList:stuScoreList

          }
          this.$http.post('_sc:/stuScore/addList',query).then(data => {
            if (data.code === 0) {

              if( self.examStatuss &&  self.examStatuss.length > 0){
                  let esItem = self.examStatuss.filter(item => item.id===examStatus);
                  if(esItem&&esItem.length > 0 &&esItem[0].code!='ZC'){
                    row.courseGrade = 0;
                  }
              }

              this.$message({
                message: '设置成功！',
                type: 'success'
              });
            } else {
              this.$message.error(data.data)
            }
          }).catch(err => {
            this.$message.error(err.msg)
          })
        }


      },
      onSearch() { //根据参数查询成绩
        let params = {
          grade:this.formDetails.grade,
          major:this.formDetails.majorId,
          course: this.formDetails.courseId,
          termId: this.formDetails.semester
        }
        this.tableLoading = true;
        this.$http.post('_sc:/stuScore/queryList', params).then(data => {
          this.readyToPrint = true
          this.tableData = []
          if (data.code == 0) {
              if(data.data.status>0){ //已提交
                 this.readyToPrint = false
                 this.recordId = data.data.recordId
              }else{ //未提交
                 this.readyToPrint = true
              }
             
              if(data.data.students.length>0){
                this.tableData = data.data.students
                this.tableData1 = JSON.parse(JSON.stringify(this.tableData))
                this.examStatuss = data.data.examStatuss
              }
          } else {
            this.$message.error(data.data);
          }
          this.tableLoading = false;
        }).catch(err => {
          this.tableLoading = false;
        })
      },
           
      getexaminationstuts() { // 获取考试状态
        let query = "STUDENT_EXAM_STATUS"
        let url = "_sc:/scoreSetting/combox/"
        this.$http.get(url + query).then(data => {
          if (data.code == 0) {
            let self = this
            self.examinationstutslist = data.data
            self.formDetail.stauts =  data.data[0].id
          }
        })
      },
      getMajorList(){//查询专业列表
          this.$http.get("_op:/major/combox").then(data=>{
              if(data.code==0){
                  this.majorList = data.data;
              }else{
                  this.$message.error(data.msg);
              }
          })
      },
      
  
      submitUpload() {
        let self = this
        self.allow = true

        self.startImport()
        setTimeout(function () {
          self.allow = false
        }, 1000);
      },
      startImport() {
        let self = this
        if (self.fileList.length < 1) {
          self.$message.warning('请选择导入文件！');
          return;
        } else {
          let formData = new FormData();
          formData.append('file', self.fileList[0].raw);
          formData.append('course', self.formDetails.courseId);
          // formData.append('scoreType', self.scoreType);
          formData.append('termId', self.formDetails.semester);

          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }

          this.$http.post('_sc:/stuScore/importStuScore', formData, config).then(data => {

            if (data.code == 0) {

              self.$message({
                message: '导入成功！',
                type: 'success'
              });
              self.onSearch()
              self.importstudentDialog = false
            } else {
              self.$message.error(data.msg);
            }
          }).catch(error => {
            self.$message.error(data.msg)
          })
        }
      },
      // 导入文件选择文件
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
        })
      },
      onBefore(file) {
        let extension = file.name.split('.')[1] === 'xls';
        let size = file.size / 1204 / 1204 < 20;
        if (!extension) {
          this.$message.warning("上传的文件格式是 xls！")
        }
        if (!size) {
          this.$message.warning("上传的文件大小不能超过20M！")
        }
        return extension && size;
      },
      importStuScore() { //批量导入

        this.importstudentDialog = true
      },
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      getTermData() { //查询学期列表
        let query = "学期"
        this.$http.get('_op:/terms/' + query).then(data => {
          if (data.code == 0) {
            for (let i = 0; i < data.data.length; i++) {
              if (!this.formDetails.semester && data.data[i].name.indexOf('当前学期') != -1) {
                this.formDetails.semester = data.data[i].id;
                // this.grade = data.data[i].startTime;
                break;
              }
            }
            this.semesterList = data.data.reverse();;
          } else {
            this.$message.error(data.data);
          }
        })
      },
      getdata(val) {
        let date = new Date(val)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        return Y + M + D
      }
    }
  }
</script>

<style scoped lang="less">
  .none {
    display: none;
  }

  .conbox {
    display: flex;
    justify-content: space-between;

    .el-input {
      width: 35px;
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

  .printcontent {
    border: solid 1px #66666636;

    .title {
      font-size: 18px;
      text-align: center;
      line-height: 30px;
    }

    .text {
      position: relative;
      font-size: 16px;
      text-align: center;

      .subTime {
        position: absolute;
        right: 20px;
      }
    }

    .tab1 {
      border: solid 1px #66666636;

      td {
        text-align: center;
        height: 25px;
        line-height: 25px
      }

      .title1 {
        width: 180px;
      }

      .curriculumName {
        width: 400px
      }
    }

  }
  .myinput {
   width:100px;
 }
  .printtltle {
    line-height: 30px;
    height: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333;

  }

  .tab2 {
    border: solid 1px #66666636;

    td {
      font-size: 12px;
      text-align: center;
      height: 25px;
      line-height: 25px;
    }

  }

  .printtable {
    /deep/.el-dialog__body {
      padding-top: 0px
    }

    /deep/.el-dialog__header {
      padding: 4px 19px 0px;
    }
  }

  .addformDetail {

    /deep/.el-input--suffix .el-input__inner,
    .el-input {
      height: 35px;
      line-height: 35px;
      width: 250px;
    }
  }

  .addformDetail /deep/.el-dialog__body {
    padding: 30px 40px;
  }
</style>