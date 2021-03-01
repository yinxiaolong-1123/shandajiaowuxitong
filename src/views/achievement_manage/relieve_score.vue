<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="cm-fold">
      <el-form :inline="true" size="mini">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">

            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="所在级">
              <intelligent-year-picker style="width: 100%;" clearable v-model="grade" type="year" value-format="yyyy" placeholder="选择年级"  @change="changeGrade">
              </intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">
              <el-select clearable v-model="majorId"  placeholder="选择专业" @change="changeGrade">
                <el-option v-for="majorItem in majorList" :key="majorItem.id" :label="majorItem.name" :value="majorItem.id"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="课程">
              <el-select clearable v-model="courseId"  placeholder="选择课程">
                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="课程" prop="areaId">
              <el-select v-model="courseId" 
                :loading="loading"  
                filterable 
                clearable 
                placeholder="请输入关键字"
                >
                <el-option v-for="(list, index) in courseDirectories" :key="index" :label="list.name" :value="list.courseId"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="学期">
              <el-select clearable v-model="semesters" filterable placeholder="选择学期">
                <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item label="补考日期">
              <el-date-picker v-model="createdata" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="filestate" clearable placeholder="全部" style="    width: 100px;">
                <el-option v-for="list in statusOption" :key="list.value" :label="list.label" :value="list.value"></el-option>
              </el-select>
            </el-form-item>

          </div>

          <div class="btn">
            <el-button type="primary" size="mini" @click="onSearch()" v-if="btnPerObj.query">查询</el-button>
          </div>

        </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table :data="tableData" border style="width: 100%;" size="mini" :header-cell-style="getRowClass" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
        </el-table-column> -->
        <el-table-column prop="grade"  width="60" label="所在级">
        </el-table-column>
        <el-table-column prop="majorName" width="160"  label="专业">
        </el-table-column>
        <el-table-column prop="courseName" width="200"  label="课程">
        </el-table-column>
        <el-table-column prop="scoreTypeName" width="100"  label="成绩类型">
        </el-table-column>
        <el-table-column prop="stageName" width="50" label="阶段">
        </el-table-column>
        <el-table-column prop="studentNum" width="60" label="人数">
        </el-table-column>
        <el-table-column prop="resitTime" width="230" label="补考时间">
        </el-table-column>
        <el-table-column prop="areaName" width="120" label="场地">
        </el-table-column>
        <el-table-column prop="monitorNames" width="160" label="监考老师">
        </el-table-column>
        <el-table-column prop="pushStatus" width="50" label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.pushStatus==1">
               暂存
            </template>
            <template v-if="scope.row.pushStatus==2">
               提交
            </template>
            <template v-if="scope.row.pushStatus==3">
              发布
            </template>
            <template v-if="scope.row.pushStatus==4">
              退回
            </template>

          </template>
        </el-table-column>
        <el-table-column prop="submitUsername" width="90" label="提交人">
        </el-table-column>
        <el-table-column prop="submitTime" width="90" label="提交日期">
        </el-table-column>
        <el-table-column prop="remark" width="130" label="备注"></el-table-column>
        <el-table-column v-if="btnPerObj.see||btnPerObj.input||btnPerObj.submit" fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addachievement(scope.row, 'edit')" v-if="(scope.row.pushStatus==1||scope.row.pushStatus==4)">成绩录入</el-button>
            <el-button type="text" size="small" @click="addachievement(scope.row, 'detail')" v-if="(scope.row.pushStatus==2||scope.row.pushStatus==3)">详情</el-button>
            <el-button type="text" size="small" @click="subinfo(scope.row,'tj')" v-if="scope.row.pushStatus==1||scope.row.pushStatus==4">提交</el-button>
            <el-button type="text" size="small" @click="openprint(scope.row, 'list')" v-if="(scope.row.pushStatus==1||scope.row.pushStatus==4)&&(btnPerObj.see||hasPermission('buhaunkaochengjiluru', 'get'))">名单打印</el-button>
            <el-button type="text" size="small" @click="openprint(scope.row, 'record')" v-if="(scope.row.pushStatus==2||scope.row.pushStatus==3)&&(btnPerObj.see||hasPermission('buhaunkaochengjiluru', 'get'))">记载表打印</el-button>
             <!-- <el-button type="text" size="small" @click="subinfo(scope.row,'ch')" v-if="scope.row.pushStatus==2">撤回</el-button>
             <el-button type="text" size="small" @click="subinfo(scope.row,'fb')" v-if="scope.row.pushStatus==1">发布</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="" :visible.sync="printDialog" :fullscreen="true" append-to-body :close-on-click-modal="false" @closed="" :show-close="false" class="import-teachers-list printtable" >
      <div v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
        <div style="position: absolute;right: 0px;">
          <el-button size="mini" @click="closeprint()">关闭</el-button>
          <el-button size="mini" type="primary" @click="printcontent()">打印</el-button>
        </div>
      </div>
      <div id="printkkkk" >
      <div v-for="(item, index) of printTable" :key="index" style="page-break-after:always" class="page">
          <div>
            <p style="font-size: 20px;font-weight: bold;text-align: center"  v-if="printFlag === 'list'">{{coursename}} {{stageName}}补缓考名单</p>
            <p style="font-size: 20px;font-weight: bold;text-align: center"  v-else>{{coursename}} {{stageName}}补缓考成绩记载表</p>
          </div>
        <div style="font-size: 10px !important;width: 100%;margin: 0 auto;margin-top: 5px;min-height: 500px;" v-if="printFlag === 'list'">
          <div>
            <span style="font-size: 14px;font-weight: bold;line-height: 31px;">年级专业：{{grade}}{{majorName}}</span>
            <span style="float: right;font-size: 14px; margin-top: 10px;">{{index + 1}}/{{printTable.length}}</span>
          </div>
          <table width="100%" border="1" style="font-size: 12px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
            <tr>
              <td style="text-align: center;height: 20px; border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">学号</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">姓名</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">阶段</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">成绩类型</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">补考成绩</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">学生签字</td>
            </tr>
            <tr v-for="(list, printcontIdex) in item" :key="printcontIdex">
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">{{list.studentNo}}</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">{{list.studentName}}</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">{{stageName}}</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">{{list.scoreTypeName}}</td>
              <td style="text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;">{{list.finalGrade}}</td>
              <td style="text-align:left;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 45px;"></td>
            </tr>
          </table>
        </div >
        <div style="font-size: 10px !important;width: 100%;margin: 0 auto;margin-top: 5px;min-height: 500px;"  v-else>
          <div>
            <span style="font-size: 14px;font-weight: bold;line-height: 31px;">年级专业：{{grade}}{{majorName}}</span>
            <span style="float: right;font-size: 14px; margin-top: 10px;">{{index + 1}}/{{printTable.length}}</span>
          </div>
          
          <table border="1" width="100%" style="font-size: 12px; border-width: 2px 2px 2px 2px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
            <tr>
              <td style="width:90px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 20px;">学号</td>
              <td style="width:80px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">姓名</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">阶段</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">阶段成绩</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">课程成绩</td>
              <td style="width:260px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">成绩构成说明</td>
              <td style="width:210px; text-align:center;border-width: 0px 0px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">补考详情</td>
            </tr>
            <tr v-for="(list, printcontIdex1) in item" :key="printcontIdex1">
              <td style="width:90px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.studentNo}}</td>
              <td style="width:80px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.studentName}}</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.stageName}}</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.stageBkgrade}}</td>
              <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.courseGrade}}</td>
              <td style="width:260px; height: 41px;text-align:left;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;" >{{list.courseGradeDetail}}</td>
              <td style="width:210px; ;text-align:left;border-width: 0px 0px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;" >{{list.stageBkDetail}}</td>
            </tr>
          </table>
        </div>
        <div>
          <div style="width: 100%;margin: 0 auto;margin-top: 5px;" v-if="printFlag === 'list'">
            <div>
              备注：1、以上成绩务必按照年级、专业分页填报、以便存档
            </div>
            <div>
              &#X3000;&#X3000;&#X3000;2、补考后阶段成绩：最高按照60分 （包括补考卷面+平时成绩）
            </div>
            <div style="display: flex;flex-wrap: wrap;">
              <div style="width: 50%;line-height: 50px;">监考老师签名:</div>
              <div style="width: 50%;line-height: 50px;">补考时间:</div>
              <div style="width: 50%;line-height: 50px;">教研室主任签名:</div>
            </div>
          </div>
          <div style="width: 100%;margin: 0 auto;margin-top: 5px;" v-else>
            <div style="display: flex;flex-wrap: wrap;">
              <div style="width: 50%;line-height: 50px;">任课、监考考试签字:</div>
              <div style="width: 50%;line-height: 50px;">教研室主任、课程负责人签字:</div>
              <div style="width: 50%;line-height: 50px;">日期:</div>
              <div style="width: 50%;line-height: 50px;">日期:</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </el-dialog>
     <div class="block_page">
      <el-pagination
      background
      class="pull-right"
	    @size-change="sizeChange"
	    @current-change="currentChange"
	    :current-page="pageNo"
	    :page-sizes="[10, 20, 30, 50, 100]"
	    :page-size="pageSize"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="totalCount">
      </el-pagination>
    </div>
  </section>

</template>

<script>
  import util from '@/util'
  import printJS from "print-js";
  const TYPE = 'relieve_score';
  const REMARK = '补缓考成绩录入';

  export default {
    name: TYPE,
    data() {
      return {
        printTable: [],
        printFlag: '',
        curractionId: '',
        tableData1: [],
        tableData: [],
        scoreTypeList: [],  //成绩类型列表
        ifnone: true,
        semesterYear: '', //学年
        semesterYearNumber: '', //学年号
        printDialog: false, //打印的弹框false就是隐藏
        studentNo: '', //学号
        studentName: '', //姓名
        createdata: [JSON.parse(localStorage.getItem('relieve')).param.startCreateTime, JSON.parse(localStorage.getItem('relieve')).param.endCreateTime], //创建日期
        semesters: '', //学期的第N个
        termName: '', //学期
        majorName: '', //专业
        stageName: '', //阶段
        semesterList: [], //学期列表
        courseId: JSON.parse(localStorage.getItem('relieve')).param.course, //课程
        coursename: "", //课程名字
        courseList: [], //课程列表
        courseDirectories: [],
        grade: JSON.parse(localStorage.getItem('relieve')).param.grade == null ? "" : JSON.parse(localStorage.getItem('relieve')).param.grade, //所在级
        majorId: JSON.parse(localStorage.getItem('relieve')).param.major, //专业
        majorList: [], //专业列表
        type: REMARK,
        filestate: JSON.parse(localStorage.getItem('relieve')).param.pushStatus, //文件状态
        statusOption: [ //装填
          { label: "全部", value: '' },
          { label: "暂存", value: 1 },
          { label: "提交", value: 2 },
          { label: "发布", value: 3 },
          { label: "退回", value: 4 }

        ],
        breadcrumb: [
          { label: "成绩管理" },
          { label: REMARK },
        ],
        checked: true,
        loading: false,
        formLabelWidth: '60px',
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
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
        pageNo: 1,
        pageSize: 20,
        totalCount: 0,
        multipleSelection: [],
        btnPerObj: {
          query: false,
          see: false,
          input: false,
          submit: false,

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
    created() {
      this.getCourseList(0, 0, 0)
      this.curractionId = this.$route.query.actionId
      let params = this.$route.query.params
      this.getTermData();
      this.getMajorList();
      this.getScoreType()
    },
    destroyed() {
      clearTimeout(this.setTimeout)
    },
    methods: {
      changeGrade(term, grade, major) {
        if(this.grade == "" || this.grade == null){
          grade = 0
        }else{
          grade = this.grade
        }
        if(this.majorId == "") {
          major = 0
        }else{
          major = this.majorId
        }
        term = 0
        this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
          if (data.code == 0) {
            this.courseDirectories = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      hasPermission(key, val) {
        return this.$authorize.hasPermission(key,val);
      },
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      //获取按钮权限
      getBtnPermit() {
        let self = this;

        this.$http.get('_auth:/privilege/getList/' + self.curractionId + '/2').then(data => {
      
          data.data.map(item => {
            if (item.code == "see_resitScore") {
              self.btnPerObj.see = true;
            }
            if (item.code == "resultInput_resitScore") {
              self.btnPerObj.query = true;
            }
            if (item.code == "submit_resitScore") {
              self.btnPerObj.input = true;
            }
            if (item.code == "query_resitScore") {
              self.btnPerObj.submit = true;
            }
          });
        }).catch(() => {})
      },
      subinfo(row,msg) { 
        let pushStatus = row.pushStatus;
        let message = '提交成功';
        if(msg=='tj'){
           this.$confirm('相同年级、专业、课程阶段的补缓考将一并提交，确认提交吗?',{
              cancelButtonText: '取消',
              confirmButtonText: '确认提交',
            }).then(() => {
              this.getupdateStatus(pushStatus,row,message)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            })
        //   let istrue = true
          
        //   pushStatus = 1
        //   message = '提交成功'
        //   let resitListId = row.id
        //   let arr = []
        //   this.$http.get('_sc:/resitList/' + resitListId).then(data => {
        //   arr = data.data
        //   for(let i=0;i<arr.length;i++){

        //     if(arr[i].finalGrade===''||arr[i].finalGrade===null){

        //       istrue = false
        //     }
        //   }
        //   if(istrue==false){
        //       this.$confirm(`有考生未录入成绩，确认提交吗?`, '提示', {
        //         confirmButtonText: '确认提交',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(() => {
        //           for(let i=0;i<arr.length;i++){

        //         if(arr[i].finalGrade===''||arr[i].finalGrade===null){
        //           arr[i].finalGrade = 0
        //           istrue = true
                  
        //         }
        //          if(istrue){
        //           this.getupdateStatus(pushStatus,row,message)
        //         }
        //       }
          
        //       }).catch(() => {
        //         this.$message({
        //           type: 'info',
        //           message: '已取消删除'
        //         });
        //       });

        //   }else if(istrue){
        //      this.$confirm('相同年级、专业、课程阶段的补缓考将一并提交，确认提交吗?',{
        //       cancelButtonText: '取消',
        //       confirmButtonText: '确认提交',
        //     }).then(() => {
        //       this.getupdateStatus(pushStatus,row,message)
        //     }).catch(() => {
        //       this.$message({
        //         type: 'info',
        //         message: '已取消'
        //       });
        //     })
        //   }
        // }).catch(err => {
        //   console.log(err)
        // })

        // }else if(msg=='fb'){
        //   pushStatus = 2
        //   message = '发布成功'
       
        //    this.getupdateStatus(pushStatus,row,message)

        // }else if(msg=='ch'){
        //   pushStatus = 3
        //   message = '撤回成功'
        //    this.getupdateStatus(pushStatus,row,message)
        // }
      
      
        }
      },
      getScoreType() {
        let postData = {
          pageNo: 1,
          pageSize: 5000,
          param: {
            type: "SCORE_TYPE"
          }
        }
        this.$http.post('_sc:/scoreSetting/list', postData).then(res => {
          this.scoreTypeList = res.data.result
        })
      },
      getupdateStatus(pushStatus,row,message){
         let query = {
          pushStatus: pushStatus,
          resitListId: row.id,
        }
        this.$http.post('_sc:/resitList/updateStatus', query).then(data => {
          if (data.code == 0) {
            this.$message({
              type: 'success',
              message: message
            });
            this.onSearch()
          }else{
            this.$message.error(data.data)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 获取课程
      getCourseList(grade, major, term) {
        if(this.grade == "" || this.grade == null) {
          grade = 0
        }else{
          grade = this.grade
        }
        if(this.majorId == "") {
          major = 0
        }else{
          major = this.majorId
        }
        term = 0
        this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
            if (data.code == 0) {
              this.courseDirectories = data.data;
            } else {
              this.$message.error(data.msg);
            }
          });
    },
      addachievement(row, flag) {
        let params = {
          courseId: this.courseId,
          grade: this.grade,
          semesters: this.semesters,
          createdata: this.createdata,
          status: 1
        }

        this.$router.push({
          path: '/achievement_manage/resultInput_entry',
          query: {
            row: JSON.stringify(row),
            params: JSON.stringify(params),
            actionId: this.curractionId,
            isDisabled: flag == 'detail' ? true : false  
          }

        })
     

      },
      printcontent() {
        let self = this
        self.ifnone = false
        setTimeout(() => {
          printJS({
            printable: "printkkkk",
            type: "html",
            targetStyles: ['*'],
            ignoreElements:['no-print','bc','gb'],
            // css: [
            //   "../../../../static/css/processinfo.css",
            //   "../../../../static/css/element-ui/index.css"
            // ], //引入css文件
            scanStyles: false
          });
          // window.print();
        }, 100)
      },
      ifnoneshow() {
        let self = this
        self.ifnone = true;
      },
      openprint(row, flag) { //打开打印的弹框
      console.log(flag)
        this.printFlag = flag
        this.printDialog = true
        this.majorName = row.majorName
        this.coursename = row.courseName
        this.stageName = row.stageName
        this.grade = row.grade.toString()
        if(flag == 'list') {
          this.getresitList1(row.id)
        }else{
          this.getresitList(row.recordId)
        }
      },
      // 名单打印
      getresitList1(id) {
        let self = this
        self.printTable = []
        let resitListId = id
        let array = []
        self.$http.get('_sc:/resitList/' + resitListId).then(data => {
          self.tableData1 = data.data
          let index = 0
          while(index < data.data.length) {
            array.push(data.data.slice(index, index += 13));
          }
        self.printTable = array
          // self.tableData1 = data.data
        }).catch(err => {
          console.log(err)
        })
      },
      // 记载表打印
      getresitList(id) {
        let self = this
        self.printTable = []
        let record_id = id
        let array = []
        self.$http.get('_sc:/resitList/recordId/' + record_id).then(data => {
          self.tableData1 = data.data
          let index = 0
          while(index < data.data.length) {
            array.push(data.data.slice(index, data.data[index].courseGradeDetail != "" && data.data[index].courseGradeDetail.length > 100 ? index += 5 : index += 13));
          }
        self.printTable = array
        }).catch(err => {
          console.log(err)
        })
      },
      //  getcapacity(item){
      //   if(item) {
      //     this.arelist.forEach(Element => {
      //       if(item == Element.data.id) {
      //         this.formDetails.capacity = Element.data.capacity;
      //       }
      //     })
      //   }else {
      //     this.formDetails.capacity = null
      //   }
      // },
      closeprint() { //关闭打印的弹框
        this.printDialog = false
      },
      onSearch() {
        this.tableData = []
        let startCreateTime = this.createdata == null ? '' : this.createdata[0]
        let endCreateTime = this.createdata == null ? '' : this.createdata[1]
        let query = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            course: this.courseId,
            grade: this.grade,
            major: this.majorId,
            // termId: this.semesters,
            pushStatus:this.filestate,
            startCreateTime: startCreateTime,
            endCreateTime: endCreateTime,
            // studentName: this.studentName,
            // studentNo: this.studentNo,
          }
        }
        localStorage.setItem('relieve', JSON.stringify(query))
        this.$http.post('_sc:/resitList/list', query).then(data => {
          if (data.data.result.length > 0) {
            let scoreTypeArr = data.data.result
            scoreTypeArr.forEach(item => {
              if(item.id) {
                this.scoreTypeList.forEach(scoreItem => {
                  if(item.scoreTypeId == scoreItem.id) {
                    item['scoreTypeName'] = scoreItem.cnName
                  }
                })
              }
            });
            this.tableData = scoreTypeArr
            this.totalCount = data.data.totalCount
          }
        }).catch(err => {
          console.log(err)
        })

      },
      // getCourseList() { //查询课程
      //   this.$http.get("_op:/course/combox/").then(data => {

      //     if (data.code == 0) {
      //       if (data.data.length > 0) {
      //         // this.courseId = data.data[0].id
      //         // this.coursename = data.data[0].name
      //       }
      //       this.courseList = data.data;
      //     } else {
      //       this.$message.error(data.msg);
      //     }
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
      getTermData(params) { //查询学期列表
      
        let query = "学期"
        this.$http.get('_op:/terms/' + query).then(data => {
          if (data.code == 0) {
            if (params == undefined) {
              for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].name.indexOf('当前学期') != -1) {
                  // this.orderNum=data.data[i].orderNum;
                  // this.semesters = i
                  // this.grade=data.data[i].year.toString();
                  // break;
                }

              }
              this.semesterList = data.data.reverse();
                  for(let i=0;i<this.semesterList.length;i++){ 
                                if(this.semesterList[i].name.indexOf('当前学期')!=-1){
                                    this.semesters=this.semesterList[i].id
                                } 
                            }
                          
              this.onSearch()
            } else {
              
              this.courseId = params.courseId;
              this.grade = params.grade.toString();
              this.semesters = params.semesters
              this.createdata = params.createdata
              this.filestate = params.status
              this.semesterList = data.data.reverse();
                     
                  
            
            }

          } else {
            this.$message.error(data.msg);
          }
        })
      },

      sizeChange(size) {
        this.pageSize = size
        this.onSearch()
      
      },
      currentChange(current) {
        this.pageNo = current
        this.onSearch()
      
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // getTermData () {
      //   this.$http.post('_op:/evaluation/evaluate',{
      //     //TODO:
      //     evaluationType: this.evaluate.evaluationType
      //     //FIXME:
      //   })
      // }
    }
  }
</script>
<style >
  @page {
    size: A4;
}
</style>

<style scoped lang="less">
  .cm-table /deep/ .el-button--small{
      padding: 0px;
    }
  .cm-table /deep/ .el-table--mini td{
      padding: 5px 0;
  }
  .pull-right {
    text-align: right;
    margin-right: 10px;
  }

  .line {
    padding: 0 10px;
  }

  .el-col-2 {
    width: 0;
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
      font-size: 20px;
      font-weight: bold;
      text-align: center
    }

    .printtitle2 {
      font-size: 14px;
      font-weight: bold;
      line-height: 31px;
    }

    .printcont {
      font-size: 10px !important;
      width: 100%;
      margin: 0 auto;
      margin-top: 5px;
      min-height: 500px;

    }

    .printfont {
      width: 100%;
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
@media print {
    .pages {
        margin: 0;
        border: initial;
        border-radius: initial;
        width: initial;
        min-height: initial;
        box-shadow: initial;
        background: initial;
        page-break-after: always;
    }
}
</style>