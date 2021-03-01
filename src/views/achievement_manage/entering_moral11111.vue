<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
 
    <div class="cm-fold">
         <el-form size="mini" :inline="true" :model="formDetails" :rules="rules" ref="formDetails">
            <div class="fold" >
                 <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期" prop="semester">
                            <el-select 
                                v-model="formDetails.semester"
                                
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="所在级" prop="grade">
                            <intelligent-year-picker
                            	:clearable="false"
                                v-model="formDetails.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        
                        <el-form-item label="专业" prop="majorId">
                            <el-select v-model="formDetails.majorId"
                             filterable
                      
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="课程" prop="courseId">
                            <el-select 
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
       <div class="cm-table">
          <ElBigdataTable highlight-current-row :height="450" v-loading="tableLoading" element-loading-text="加载中..." 
        :data="tableData"  
        style="width: 100%; margin-top: 20px" size="mini" 
   
        header-row-class-name="cm-dark" 
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
         <el-table-column type="index" label="序号" fixed width="80"></el-table-column>

         <el-table-column prop="administrativeclassname" label="行政班"></el-table-column>

        <el-table-column prop="studentno" label="学号"></el-table-column>

        <el-table-column prop="name" label="姓名"></el-table-column>


        <el-table-column prop="courseName" label="课程"></el-table-column>

         <el-table-column prop="courseGrade"  label="课程成绩" >
             <template slot-scope="scope">
                <!-- {{scope.row.courseGrade+fag}} -->
                   <el-input :id="`s${scope.$index}`" @keyup.enter.native="nextFocus(scope.row, scope.$index, $event)" class="myinput"  @blur="OnBlurEvent(scope.row)" :size="'mini'" :maxlength="3"  v-model="scope.row.courseGrade" ></el-input>
            </template>
          </el-table-column>

        <el-table-column prop="examStatus" label="考试状态">
          <template slot-scope="scope">
            <el-select v-model="scope.row.examStatus" size="mini" placeholder="请选择" :disabled="!readyToPrint" filterable @change="OnBlurEvent(scope.row)">
              <el-option v-for="item in examinationstutslist" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注说明">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" size="mini" :disabled="!readyToPrint" @change="OnBlurEvent(scope.row)"></el-input>
          </template>
        </el-table-column>


        
     
      </ElBigdataTable>
       </div>

  </section>
</template>

<script>
import util from '@/util'
import moment from 'moment'
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
const dictionaryCode = "DYKS"
  export default {
   name: "entering-course",
   data(){
     return{
       fag:0,
        tableLoading:false,
        students:[],
        loadingStudent: false,
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
        breadcrumb: [
          { label: "成绩管理" },
          { label: "德育成绩录入" },
        ],
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        dialog: {
          status: "add",
          visible: false
        },
        formDetail: {
          termId: '',
          grade:"",
          majorId:'',
          courseId: '',
          studentNo: "",
          studentname: "",
          candidateNum: "", //准考证号
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
            { required: true, message: '请选择考专业', trigger: 'change' }
          ],
              courseId: [
            { required: true, message: '请选择考试状态', trigger: 'change' }
          ],
          studentNo: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          candidateNum: [
            { required: true, message: '请输入准考证', trigger: 'blur' }
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
        examinationstutslist: [], //考试的状态列表
        radio: '1',
        radio1: '1',
        printDalong: false, //为true就是打开打印的弹框
        recordId: null, //保存信息用的id,
        importstudentDialog: false, //导入学生表的对话框
        fileList: [], //文件列表

        readyToPrint: true, ////为flase因此打印按钮
       formDetails: {
          semester: '', //学期
          grade:'',//所在级
          majorId:'',//专业
          courseId: '', //课程
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
        semesterList: [], //学期列表
        majorList:[],//专业列表
        courseList: [], //课程列表
        scoreType: "", //成绩类型
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
    },
      directives: {
        focus: {
          update: function(el, {value}) {
            if (value) {
              el.focus();
            }
          }
        }
      },
    created(){
      this.getTermData();
      this.getMajorList();
      this.getCourseList();
      this.getscoreType();
      this.getexaminationstuts()
    },
    methods:{
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
          // slef.$refs[nextId].focus()
    
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
        ifnoneshow() {
        let self = this
        self.ifnone = true;
      },

      OnBlurEvent(row) { //光标离开时的事件

        if (row.courseGrade < 0 || row.courseGrade > 100) {
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
           obj.courseGrade = row.courseGrade,
           obj.examStatus= row.examStatus,
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
          let self = this;
          this.$http.post('_sc:/stuScore/addList',query).then(data => {
            if (data.code === 0) {
              if( self.examStatuss &&  self.examStatuss.length > 0){
                  let esItem = self.examStatuss.filter(item => item.id===row.examStatus);
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

        this.$http.post('_sc:/stuScore/queryList', params).then(data => {
          this.readyToPrint = true
          this.tableData = []
          if (data.code == 0) {
              if(data.data.status>0){
                 this.readyToPrint = false
                 this.recordId = data.data.recordId
              }else{
                 this.readyToPrint = true
              }
              // this.examinationstutslist = data.data.examStatuss
             
              if(data.data.students.length>0){
                this.tableData = data.data.students.concat();
                this.examStatuss = data.data.examStatuss
              }
          } else {
            this.$message.error(data.data);
          }
        })
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
              if (data.data[i].name.indexOf('当前学期') != -1) {
                this.formDetails.semester = data.data[i].id;
                this.grade = data.data[i].startTime;
                break;
              }
            }
            this.semesterList = data.data.reverse();
          } else {
            this.$message.error(data.data);
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
           getCourseList() { //查询课程
        //查询课程
        let query = dictionaryCode
        this.$http.get("_op:/course/getCourseByCategoryCode/" + query).then(res => {

          this.courseList = res.data;
        }).catch(err => {

        })

      },
       getscoreType() { //获取考试类型
        let query = "EXAM_TYPE"
        let url = "_sc:/scoreSetting/combox/"
        this.$http.get(url + query).then(data => {
          if (data.code == 0) {

            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].name.indexOf('德育') > -1) {
                let self = this
                self.scoreType = data.data[i].id
                // self.getCourseList(data.data[i].id)
              }
            }
          }
        })
      },
       getexaminationstuts() { // 获取考试状态
        let query = "STUDENT_EXAM_STATUS"
        let url = "_sc:/scoreSetting/combox/"
        this.$http.get(url + query).then(data => {
          if (data.code == 0) {
            let self = this
            self.examinationstutslist = data.data
            self.formDetail.stauts = data.data[0].id
          }
        })
      },
    }
  }

</script>