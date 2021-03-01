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
                  @change="getCourseList"
                  placeholder="选择学期">
                  <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            
              <el-form-item label="所在级">
                <intelligent-year-picker style="width: 100%;" 
                 clearable
                 @change="getCourseList('grade')"
                  v-model="grade"
                  type="year" 
                  value-format="yyyy" 
                  
                  placeholder="选择年级"> 
                </intelligent-year-picker>
              </el-form-item>

              <el-form-item label="专业">
              
                <el-select v-model="majorId"
                  @change="getCourseList"
                  filterable
                  clearable
                  @clear="colsemajor"
                  placeholder="请选择">
                  <el-option v-for="list in majorList"    :key="list.id" :label="list.name" :value="list.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="课程">
                <el-select 
                clearable
                  v-model="courseId" 
                  filterable placeholder="选择课程">
                  <el-option v-for="list in courseList" :key="list.courseId" :label="list.courseName" :value="list.courseId" ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="创建日期">
                <el-date-picker
                  v-model="createdata"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

           
            <el-form-item label="姓名">
                <el-input placeholder="请输入姓名" v-model="studentName" clearable></el-input>
             </el-form-item>
            <el-form-item label="学号">
              <el-input placeholder="请输入学号" v-model="studentNo" clearable></el-input>
            </el-form-item>

            
          </div>
          <div class="btn" >
            <el-button type="primary" size="mini" @click="onSearch()" v-if="btnPerObj.query">查询</el-button>
          </div>
        </div>

      </el-form>
    </div>
    <!-- <div class="cm-fold" >
        <div class="btn" style="height:25px">
            <el-button type="primary" size="mini" @click="createlist()" v-if="btnPerObj.create">创建名单</el-button>
          </div>
    </div> -->

    <div class="cm-table">
      <el-table 
        :data="tableData" 
          border 
        style="width: 100%; margin-top: 20px" size="mini" 
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
        prop="majorName"
        label="专业" width="280" >
      </el-table-column>

       <el-table-column
        prop="courseName"
        label="课程" width="280" >
      </el-table-column>

      <el-table-column
        prop="termName"
        label="不及格学期"  width="280" >
      </el-table-column>

      <el-table-column
        prop="stageName"
        label="阶段" >
      </el-table-column>

      <el-table-column
        prop="scoreTypeName"
        label="成绩类型"  >
      </el-table-column>

      <el-table-column
        prop="studentNum"
        label="人数" >
      </el-table-column>

      <el-table-column
        prop="createUser"
        label="创建人" >
      </el-table-column>
      
      <el-table-column
        prop="createTime"
        label="创建日期"  width="150">
      </el-table-column>
 
        <el-table-column
        v-if="btnPerObj.view_list||btnPerObj.add_student||btnPerObj.delete"
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openprint(scope.row)" v-if="btnPerObj.view_list">查看名单</el-button>
            <el-button type="text" size="small" @click="addstudent(scope.row)"  v-if="btnPerObj.add_student&&scope.row.pushStatus<1">添加学生</el-button>
            <el-button type="text" size="small" @click="deletecont(scope.row)"  v-if="btnPerObj.delete&&scope.row.pushStatus<1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <div class="block_page">
      <el-pagination
      background
      class="pull-right"
	    @size-change="sizeChange"
	    @current-change="currentChange"
	    :current-page="pageNo"
	    :page-sizes="[10, 20, 50, 100]"
	    :page-size="pageSize"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog
            title="创建补缓考名单"
            :visible.sync="creatDialog"
            width="60%"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            :show-close="true"
            class="import-teachers-list">
        <div class="content1 detail" ref="formDetail" >
          <div  class="fromleft">
            <p class="tltlesize">请选择创建名单的条件，获取学生</p>
            <el-form :inline="true" size="mini" :label-position="'right'" label-width="85px">
              <el-form-item label="所在级">
                  <intelligent-year-picker style="width: 92%;" 
                    :clearable="false"
                    v-model="grade"
                    type="year" 
                    value-format="yyyy" 
                    placeholder="选择年级"> 
                  </intelligent-year-picker>
                </el-form-item>

                <el-form-item label="专业">
                  <el-select v-model="majorId"
                  @change="getCourse"
                    filterable
                    placeholder="请选择">
                    <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="学期">
                  <el-select 
                    v-model="semesters"
                    filterable
                    placeholder="选择学期">
                    <el-option v-for="(item,index) in semesterList" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="课程">
                  <el-select 
                    v-model="courseId" 
                    filterable placeholder="选择课程">
                    <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id" ></el-option>
                  </el-select>
                </el-form-item>
                <div class="btn" style="height:25px; margin-left: 80px;">
                  <el-button type="primary" size="mini" @click="onSearchNopass()">查询</el-button>
                </div>
            </el-form>
          </div>
          <div  class="fromright" size="mini">
              <p class="tltlesize">不及格学生名单</p>
              <el-table
                border
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width:100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="30">
                </el-table-column>
                <el-table-column
                  prop="studentNo"
                  label="学号"
                  width="100%">
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                </el-table-column>
                <el-table-column
                  prop="studentName"
                  label="姓名"
                  width="100%"
                >
                </el-table-column>

                <el-table-column
                  prop="stageGrade"
                  label="阶段成绩"
                  width="100%"
                  show-overflow-tooltip>
                </el-table-column>

                <el-table-column
                  prop="courseGrade"
                  label="课程成绩"
                  width="100%"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table>
          </div>
        </div>
        
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closediaong()">取 消</el-button>
            
          <el-button  size="mini" type="primary" @click="submitUpload()">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
            title="添加学生"
            :visible.sync="addDialog"
            width="60%"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            :show-close="true"
            class="import-teachers-list">
			<div class="content2 " ref="" >
         <p class="tltlesize2">所在级：{{grade}}，专业：{{majorName}}，学期：{{termName}}，课程：{{coursename}}，阶段：{{stageName}}</p>
          <div  class="fromright">
            
             <el-table
                border
                ref="multipleTable2"
                :data="tableData4"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange2">
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                  prop="studentNo"
                  label="学号"
                 >
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                </el-table-column>
                <el-table-column
                  prop="studentName"
                  label="姓名"
               
                >
                </el-table-column>

                <el-table-column
                  prop="scoreTypeName"
                  label="成绩类型"
               
                  show-overflow-tooltip>
                </el-table-column>

                <el-table-column
                  prop="score"
                  label="成绩"
                
                  show-overflow-tooltip>
                </el-table-column>

              </el-table>
				</div>
			</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDialog=false">取 消</el-button>
        <el-button  size="mini" type="primary" @click="submitadd">确 定</el-button>
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
                    <el-button size="mini" type="primary" @click="printcontent()">打印</el-button>
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
                    <td>成绩类型</td>
                    <td>补考成绩（卷面）</td>
                    <td>学生签字</td>
                </tr>
                <tr v-for="list in tableData2">
                    <td>{{list.studentNo}}</td>
                    <td>{{list.studentName}}</td>
                    <td>{{stageName}}</td>
                    <td>{{list.scoreTypeName}}
                    <td>{{list.finalGrade}}</td>
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
    const TYPE='repair_management';
    const REMARK='补考名单管理';

    export default {
      name: TYPE,
      data() {
        return {
      
          tableData2: [],
          tableData4: [],
          ifnone:true,
          resitListId:'',//新增不及格的学生
          tableData3: [],
          multipleSelection2:[],
          printDialog:false,//打印的弹框false就是隐藏
          addDialog:false,//添加学生的弹窗
          creatDialog:false,//创建名单的弹窗
          studentNo:'',//学号
          studentName:'',//姓名
          createdata:'',//创建日期
          semesters:'',//学期的第N个
          termName:'',//学期
          majorName:'',//专业
          stageName:'',//阶段
          semesterList:[],//学期列表
          courseId:'',//课程
          coursename:"",//课程名字
          courseList:[],//课程列表
          grade:'',//所在级
          majorId:'',//专业
          majorList:[],//专业列表
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
		 
          // evaluate: {
          //   administrativeClassId: [],
          //   evaluationType: 0,
          //   grade: 32,
          //   majorId: '',
          //   requiredFailedFlag: false,  //必修课不及格者复选框：0-勾选，1-未勾选
          //   schemeId: '',
          //   semesterYear: '',
          //   date1: '',
          //   date2: '',
          // },
          gradeOptions: [], //所在级
          majorIdOptions: [], //专业ID
          schemeIdOptions: [], //测评方案ID
          semesterYearOptions: [], //学年
          administrativeClassIdOptions: [], //行政班ID
          options: [
            {value: '选项1', label: '黄金糕'}, 
            {value: '选项2', label: '双皮奶'}
          ],
          tableLoading:false,
          tableData: [],
          tableList: [
            {label:'所在级', prop:'studentId'},
            {label:'专业', prop:'name'},
            {label:'课程', prop:'remark'},
            {label:'不及格学期', prop:'ranking', width:120},
            {label:'阶段', prop:'grade'},
            {label:'人数', prop:'intellectual', width:120},
            {label:'已打印', prop:'moral'},
            {label:'创建人', prop:'physical'},
            {label:'创建日期', prop:'aa', width:120}
          ],
          pageNo: 1,
          pageSize: 20,
          totalCount:0,
          multipleSelection: [],
          btnPerObj:{
            create:false,
            print_list:false,
            view_list:false,
            add_student:false,
            delete:false,
            query:false,
          }
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
         window.onmouseout=()=>{
            this.ifnoneshow();
        }
        
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
            
      },
      created(){
        this.getTermData();
        // this.getMajorList();
        //  this.getCourseList(this.majorId);// 课程默认全部
      },
       destroyed(){
        clearTimeout(this.setTimeout)
      },
       methods: {
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
          this.courseId = ''
          this.courseList = [];
          if (
            !this.grade ||
            !this.majorId ||
            !this.semesters
          ) {
            return;
          }
          let param = {
            grade: this.grade,
            majorId: this.majorId,
            termId: this.semesters
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
        },
      
            colsemajor(){
              this.courseList=""
              this.courseId=''
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
            getCourse(){
              if(this.majorId!==''){
                
              }

            },
	      deletecont(row){
                this.$confirm(`此操作将永久删除该信息信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    this.$http.delete("_sc:/resitList/"+row.id)
                    .then(data=>{
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
      printcontent(){
                let self = this
                self.ifnone = false
                setTimeout(()=>{
                    window.print();
                },100)
        },
        ifnoneshow(){
                let self = this
                self.ifnone = true;
        },
	  openprint(row){//打开打印的弹框
        this.coursename = row.courseName
        this.stageName = row.stageName
        this.printDialog =  true
        this.majorName= row.majorName
        this.grade = row.grade.toString()
        
        this.getresitList(row.id)
	  },
	  getresitList(id){
      let self =this
      let resitListId = id
      
      self.$http.get('_sc:/resitList/'+resitListId).then(data=>{
        self.tableData2 = data.data
      }).catch(err=>{
         console.log(err)
      })
	  },
      
      closeprint(){//关闭打印的弹框
          this.printDialog =  false
      },
      submitadd(){//对新增的进行提交
        let param = {};
        param.resitListId = this.resitListId;
        let studentList = []
        for(let i=0;i<this.multipleSelection2.length;i++){
            let obj ={}
            obj.courseGrade = this.multipleSelection2[i].courseGrade;
            obj.resitListId = this.resitListId;
            obj.stageGrade = this.multipleSelection2[i].stageGrade;
            obj.studentName = this.multipleSelection2[i].studentName;
            obj.studentNo = this.multipleSelection2[i].studentNo;
            obj.resitDelayedType = this.multipleSelection2[i].resitDelayedType;
            obj.id=this.multipleSelection2[i].id;
            studentList.push(obj)
        }
        
         if(studentList && studentList.length > 0){
           param.resitListStudentResultList = studentList;
            this.$http.post('_sc:/resitList/addStudent',param).then(data=>{
              if(data.code==0){
                this.$message({
                      type: 'success',
                      message: '新增成功'
                });
                  this.onSearch()
                this.addDialog = false
            }
          }).catch(err=>{
            console.log(err)
          })
         }else{
           this.$message({
              type: 'warning',
              message: '请选择学生！'
            });
         }
         
      },
      addstudent(row){
     
        this.grade = row.grade.toString()
        this.majorName = row.majorName
        this.termName = row.termName
        this.coursename = row.courseName
        this.stageName = row.stageName
        this.addDialog = true
        this.resitListId = row.id
        
        let resitListId =  this.resitListId
        //根据补缓考名单记录ID查询需要添加的学生名单
        this.$http.get('_sc:/resitList/getNeedResitList/'+resitListId).then(data=>{
        this.tableData4 = data.data
        }).catch(err=>{
          console.log(err)
        })
      },
    
      submitUpload(){ //对创建的 进行提交
         let studentList = []
         
      for(let i=0;i<this.multipleSelection.length;i++){
         let obj = {
            courseGrade:'',
            courseId:'',
            grade:'',
            majorId:'',
            semesterYear:'',
            semesterYearNumber:'',
            stageGrade:'',
            studentName:'',
            studentNo:''
         }
         obj.courseGrade=this.multipleSelection[i].courseGrade
         obj.courseId=this.multipleSelection[i].courseId
         obj.grade=this.multipleSelection[i].grade
         obj.majorId=this.multipleSelection[i].majorId
         obj.semesterYear=this.multipleSelection[i].semesterYear
         obj.stageGrade=this.multipleSelection[i].stageGrade
         obj.studentName=this.multipleSelection[i].studentName
        obj.studentNo=this.multipleSelection[i].studentNo
        studentList.push(obj)
      }
        if(studentList.length&&studentList.length>0){
          let query = {
            courseId:this.courseId,
            grade:this.grade,
            majorId:this.majorId,
            semesterYear:this.semesterList[this.semesters].year,
            semesterYearNumber:this.semesterList[this.semesters].orderNum,
            studentList:studentList
          }
          this.$http.post('_sc:/resitList',query).then(data=>{
            if(data.code==0){
                this.$message({
                      type: 'success',
                      message: '新增成功'
                });
                this.onSearch()
                this.creatDialog = false
            }else{
              this.$message({
                      type: 'error',
                      message: data.msg
                });
            }
          }).catch(err=>{
            console.log(err)
          })
        }else{
          this.$message({
                type: 'warning',
                message: '请选择学生！'
          });
        }
        
      },
      createlist(){ //打开创建的弹框
      
      this.creatDialog = true
      },
      closediaong(){
        this.creatDialog = false
      },
      onSearch(){
        this.tableData = []
      
        let query = {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            param:{
                course:this.courseId,
                grade:this.grade,
                major:this.majorId,
                termId:this.semesters,
                startCreateTime:this.createdata[0],
                endCreateTime:this.createdata[1],
                studentName:this.studentName,
                studentNo:this.studentNo,
            }
        }
            
        this.$http.post('_sc:/resitList/list',query).then(data=>{
            if( data.data.result.length>0){
              this.tableData = data.data.result
              this.totalCount = data.data.totalCount
            }
        }).catch(err=>{
          console.log(err)
        })
      },

     
           // 改变所在级请求课程
            changeGrage(){
                this.getCourseList(this.grade,this.majorId)
            },
            // 改变专业请求课程
            changeMajor(){
               this.getCourseList(this.grade,this.majorId)
            },
            // 课程下拉列表，根据所在级 专业查询
            // getCourseList(){
            //     // /course/combox/{grade}/{majorId}
            //     let  grade= this.grade;
            //     let  majorId=this.majorId;
            //     if(grade=="" || grade == null){
            //         grade=0;
            //     }else{
            //           grade= this.grade;
            //     }
            //      if(majorId=="" || majorId == null){
            //         majorId=0;
            //     }else{
            //         majorId=this.majorId;
            //     }
            //     this.$http.get("_op:/course/combox"+"/"+grade+"/"+majorId).then(data =>{
            //          if(data.code==0){
            //             this.courseList = data.data;
            //         }else{
            //             this.$message.error(data.msg);
            //         }
            //     })
            // },

      getMajorList(){//查询专业列表
        this.$http.get("_op:/major/combox").then(data=>{
          if(data.code==0){
            this.majorList = data.data;
            // this.majorId=data.data[0].id;
            // this.getCourseList(data.data[0].id)
          }else{
            this.$message.error(data.msg);
          }
        })
      },
      getTermData(){//查询学期列表
        let query="学期"
          this.$http.get('_op:/terms/'+query).then(data=>{
              if(data.code==0){
                 this.semesterList = data.data.reverse();
                   for(let i=0;i<this.semesterList.length;i++){ 
                  if(this.semesterList[i].name.indexOf('当前学期')!=-1){
                      this.semesters=this.semesterList[i].id
                  } 
                }
                this.onSearch();
                // for (let i=0;i<  this.semesterList.length;i++) {
                //   if(this.semesterList[i].name.indexOf('当前学期')!=-1) {
                //           // this.orderNum=  this.semesterList[i].orderNum;
                //           // this.semesters = i;
                //           // this.grade=  this.semesterList[i].year.toString();
                          
                //     break;
                //   }
                // }
                 
              }else{
                  this.$message.error(data.msg);
              }
          })
        },
        sizeChange(size){
          this.pageSize = size
          this.onSearch()
        
        },
        currentChange(current){
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

  // margin-left: 80px;
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
    #mytbale{
     
      tr{
        td{
          border: solid 1px #ddd;
        }
      }
      
    }
</style>