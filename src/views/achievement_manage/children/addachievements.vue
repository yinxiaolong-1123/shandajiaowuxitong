<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="cm-fold" >
        <div class="btn" style="height:25px;padding-top: 20px;">
            <el-button type="primary" size="mini" @click="save()" v-if="formDetails.stat!='查看'" >保 存</el-button>
             <el-button type="primary" size="mini" @click="goback()" >返 回</el-button>
          </div>
    </div> -->
    <div class="cm-fold">
         <el-form size="mini" :inline="true" :model="formDetails" :rules="rules" ref="formDetails">
        <div class="fold" >
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
              
              <el-form-item label="学期" prop="semesters"> 
                <el-select 
                clearable
                  v-model="formDetails.semesters"
                  filterable
                  disabled
                  placeholder="选择学期">
                  <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            
              <el-form-item label="所在级"  prop="grade">
                <intelligent-year-picker style="width: 100px;" 
                 clearable disabled
                  v-model="formDetails.grade"
                  type="year" 
                  value-format="yyyy" 
                  placeholder="选择年级"> 
                </intelligent-year-picker>
              </el-form-item>

              <el-form-item label="专业"  prop="majorId">
              
                <el-select v-model="formDetails.majorId"
                  @change="changeGetNewCoure"  disabled
                  filterable
                  clearable
                  placeholder="请选择">
                  <el-option v-for="list in majorList"    :key="list.id" :label="list.name" :value="list.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="课程"  prop="courseId">
                <el-select 
                clearable  disabled
                  v-model="formDetails.courseId" 
                  filterable placeholder="选择课程">
                  <el-option v-for="list in courseList" :key="list.id" :label="list.courseName" :value="list.courseId" ></el-option>
                </el-select>
              </el-form-item>



                <!-- :disabled="disableInput" -->
              <el-form-item label="成绩类型"  prop="scoreType">
                <el-select 
                clearable 
                disabled
                @change="findscoretype"
                  v-model="formDetails.scoreType" 
                  filterable placeholder="选择成绩类型">
                  <el-option v-for="list in examinationlist" :key="list.id" :label="list.name" :value="list.id" ></el-option>
                </el-select>
              </el-form-item>
              

              <el-form-item label="考试日期"  prop="examTime">
                 <!-- <el-date-picker style="width: 100%;"
                     clearable  disabled
                  v-model="formDetails.examTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker> -->
                  <el-date-picker 
                        clearable 
                        disabled
                        style="width:170px"
                      v-model="formDetails.examTime"
                        type="date"
                         format="yyyy 年 MM 月 dd 日"
                          value-format="timestamp"
                        placeholder="选择日期">
                      </el-date-picker>
              </el-form-item>
              <el-form-item label=""  >

              </el-form-item>
              
          </div>
           
        </div>

      </el-form>
    </div>
    <div class="cm-fold" >
      <div class="command-bar">
        <div class="btn">
            <a v-show="false" ref="exportExcel"></a>
            <el-button size="mini" type="primary" @click="exportResult()" >导 出</el-button>
            <el-button size="mini" type="primary" @click="importStuScore()" v-if="formDetails.auditStatus!=2&&formDetails.auditStatus!=3">导 入</el-button>
            <el-button size="mini" type="primary" @click="newlyadded()" v-if="formDetails.auditStatus!=2&&formDetails.auditStatus!=3">新 增</el-button>
            <el-button type="primary" v-if="!disableInput" size="mini" @click="updateTableHeader">保 存</el-button>
            <el-button type="primary" size="mini" @click="goback()" >返 回</el-button>
                      <el-button size="mini" type="primary" @click="newlyadded()" v-if="formDetails.auditStatus!=2&&formDetails.auditStatus!=3">新 增</el-button>
            <el-button size="mini" type="primary" @click="exportResult()" >下载模板</el-button>					  
<!--           <el-button size="mini" @click="" v-if="formDetails.auditStatus!=2&&formDetails.auditStatus!=3"> <a href="../../../template/course-texplate.xlsx" download='形成性成绩导入模板.xlsx' >下载模板</a></el-button> -->
            <el-button type="primary" size="mini" @click="save()"  v-if="formDetails.stat=='确认'">确 认</el-button>
        </div>
        <div class="btn">
          <span style="font-size: 14px; padding-right:12px">行政班</span>
          <el-select 
            size="mini"
            clearable 
            v-model="formDetails.administrativeId" 
            :multiple="true"
            @change="findScoreByAdministrative" 
            filterable placeholder="选择行政班">
            <el-option v-for="list in administratives" :key="list.id" :label="list.name" :value="list.id" ></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="cm-table">
     <ElBigdataTable highlight-current-row  v-loading="tableLoading" element-loading-text="加载中..." 
        :data="tableData"  
        :height="calcTableHeight"
        style="width: 100%; margin-top: 20px" size="mini" 
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark" 
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
         <el-table-column
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
            prop="administrativeclassname"
            label="行政班" >
        </el-table-column>

          <el-table-column
            prop="studentno"
            label="学号" >
          </el-table-column>

          <el-table-column
            prop="name"
            label="姓名" >
          </el-table-column>
          
          <el-table-column
            label="成绩" >
             <template slot-scope="scope">
                <span v-if="scope.row.examStatus==2"></span>
                <el-input :ref="scope.$index" v-else
                :disabled="disableInput||scope.row.disableInput||scope.row.examStatus!=0" @keyup.enter.native="nextFocus(scope.row, scope.$index, $event)" class="myinput"  @blur="updateImportScore(scope.row,'inpt')" :size="'mini'" :maxlength="5" v-model="scope.row.score"></el-input>
            </template>
          </el-table-column>


          <el-table-column 
            label="考试状态" >
            
             <!-- <template slot-scope="scope" v-if="scope.row.examStatus==2">
                缓考
            </template> -->
            <template slot-scope="scope" >
                <template v-if="scope.row.examStatus==2">
                  <p style="padding-left:5%"
                  :class="{'examStatus':disableInput||scope.row.disableInput||scope.row.examStatus!=0}">缓考</p>
                </template>
                <el-select v-model="scope.row.examStatus" class="myinput" :size="'mini'"
                :disabled="disableInput || scope.row.examStatus == 6"
                @change="updateImportScore(scope.row,'inselect')" placeholder="请选择" v-else>
                  <el-option
                    v-for="item in examStatuss"
                    :key="item.id"
                    :label="item.cnName"
                    :value="item.id"
                    :disabled="item.cnName=='已及格'">
                  </el-option>
                </el-select> 
              
            </template>
          </el-table-column>

          <el-table-column  label="说明"  prop="remark" width="400" >
              <template slot-scope="scope">
                <el-input :id="`add${scope.$index}`" v-model="scope.row.remark"  :disabled="disableInput||scope.row.disableInput" @keyup.enter.native="nextFocus2(scope.row, scope.$index, $event)"  @change="updateImportScore(scope.row,'inpt2')" class="myinput2" :size="'mini'">

                </el-input>
              </template>
    

          </el-table-column>
     
      </ElBigdataTable>
    
  
      <div  class="cm-table" v-if="formDetails.stat=='确认'">
            <el-form :model="approval" ref="approval"   class="boxStyle" :rules="rules" >
              

                <el-form-item  label="审核  :" prop="status" :label-width="formLabelWidth" >
                  <el-radio-group v-model="approval.status">
                    <!-- <el-radio v-for="list in radiolist :key=list.id" :label="list.val" :value="list.examTypeId"></el-radio> -->
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="0">驳回</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="说明 :"  prop="explain" :label-width="formLabelWidth" v-if="approval.status==0">
                      <!-- <el-input v-model="approval.code" ></el-input> -->
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="approval.explain">
                      </el-input>
                </el-form-item>
            </el-form>
        </div>
      </div>

     

    <!-- --------------新增-------------- -->
    <el-dialog
            width="425px" 
            :close-on-click-modal="false"
            :title="dialog.status=='add'?'新增':'编辑'"
            :visible.sync="dialog.visible"
            :modal-append-to-body="false"
            @closed="dialogClose('formDetail')">
                <el-form ref="formDetail" :rules="rules2"  :model="formDetail"  class="adddialog">
                
                    <el-form-item label="学号" class="flex-form" prop="studentNo">
                         <!-- <el-autocomplete  v-model="formDetail.studentNo" value-key="name" :fetch-suggestions="verification"></el-autocomplete> -->
                         <el-select v-model="formDetail.student" value-key="id" filterable remote placeholder="请输入学号" :remote-method="verification" :loading="loadingStudent">
                           <el-option v-for="item in students" :key="item.id" :label="item | showStudent" :value="item">
                           </el-option>
                         </el-select>
                    </el-form-item>

<!-- 
                    <el-form-item label="姓名" prop="studentname"  class="flex-form ">
                        <el-input  v-model="formDetail.studentname" readonly></el-input>
                    </el-form-item> -->


                    <el-form-item label="成绩" class="flex-form" prop="score">
                           <el-input  v-model="formDetail.score"   placeholder="请输入成绩"></el-input>
                    </el-form-item>


                    <el-form-item label="考试状态" class="flex-form" prop="status">
                          <el-select 
                            v-model="formDetail.status"
                           filterable
                            placeholder="请选择考试状态">
                            <el-option 
                                v-for="item in examinationstutslist" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id" >
                            </el-option>
                        </el-select >
                    </el-form-item>
                    
                
                </el-form>
             
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogClose('formDetail')">取 消</el-button>
                <el-button size="mini" type="primary" @click="addsubmitForm('formDetail')">确 定</el-button>
            </span>
      </el-dialog>
       <!-- 导入名单对话框 -->
        <el-dialog
            title="导入成绩"
            :visible.sync="importstudentDialog"
            width="450px"
            append-to-body
            :close-on-click-modal="false"
            class="import-teachers-list">
          
            <el-upload
                class="upload-demo" 
                ref="upload"
                action=""
                :file-list="fileList"
                :on-success="onSuccess"
                :on-change="fileSelected"
                :before-upload="onBefore"
                :auto-upload="false">
                <el-button slot="trigger" size="small">选取文件</el-button>
            </el-upload>
            <el-button style="margin-left: 10px;" size="small" type="primary" :disabled="allow" @click="submitUpload">导入</el-button>
           
        </el-dialog>

  </section>
</template>

<script>

    import moment from 'moment'
    import {mapState} from 'vuex'
    import util from '@/util'
    const TYPE='addachievements';
    const REMARK='新增';

    export default {
      name: TYPE,
      data() {
        return {
          focusIndex: 0,
          students: [], // 学生列表
          loadingStudent: false,
          formDetails:{
              semesters:"",//学期ID
              grade:'',//所在级
              majorId:'',//专业
              courseId:'',//课程
              scoreType:'',// 成绩类型
              examTime:'',//考试日期
              auditStatus:'',
              stat:'',
              createTime:'',
              uuid:'',
              administrativeId:'' //行政班ID
          },
          administratives:[],
          formDetail:{
            student: null, // 学生对象
            studentNo:"",
            studentname:"",
            score:"",
            status:"",
            id:''
          },
          approval:{
            status:1,
            explain:''

          },
          radiolist:[
            {
              id:'1',val:'通过',
              id:'2',val:'驳回' 
            }
          ],
          importantscore:false,
          examTypeId:'',//成绩类型
           tableData: [],
           dialog:{
             status:false,
             visible:false,
           },
        importstudentDialog:false,
        fileList:[],//文件列表
        allow:false,//按钮状态
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
          rules2:{
             studentNo: [
              { required: true, message: '请输入学号', trigger: 'blur' }
            ],
             studentname:[
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
             score: [
              { required: true, message: '请输入分数', trigger: 'change' }
            ],
             status: [
              { required: true, message: '请选择考试状态', trigger: 'change' }
            ],
          },
          semesterList:[],//学期列表
          examinationlist:[
            
            
          ],//成绩类型
          // coursename:"",//课程名字
          courseList:[],//课程列表
       
        examinationstutslist:[],//考试状态
          majorList:[],//专业列表
          fold:{
            state:true,
            text:'展开',
            showBtn:false,
          },
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: "成绩录入", path: "/achievement_manage/addachievements"},
            {label: REMARK},
          ],
          checked: true,
		      formLabelWidth: '60px',
          tableLoading:false,
         
          pageNo: 1,
          pageSize: 10,
          totalCount:0,
          examStatuss:[], //考试状态
          curruuid:'', //当前主表UUID
        }
      
      },

      filters: {
        showStudent(value) {
          return value.name + '(' + value.stuNum + ')';
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
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
      },
      computed:{
         calcTableHeight() { 
          return  document.body.clientHeight - 220; 
        },
      },
      created(){
        this.getTermData();
        this.getMajorList();
        this.getscoreType();
        this.getscoreSett();
        this.getexaminationstuts();
        let self = this;
        let infomsg = this.$route.query
        this.curruuid = infomsg.uuid;
        if(!infomsg.auditStatus){
          this.disableInput = false;
        }else{
          this.disableInput = parseInt(infomsg.auditStatus) == 2 || parseInt(infomsg.auditStatus) == 3
        }
        if(infomsg.stat == 'add'){
            if(infomsg.auditStatus == undefined){
              infomsg.auditStatus = 1
            }
            this.formDetails.auditStatus = infomsg.auditStatus
            this.formDetails.semesters= infomsg.semesters*1
            this.formDetails.grade= infomsg.grade.toString()
            this.formDetails.majorId= infomsg.majorId*1
            this.formDetails.courseId= infomsg.courseId*1
            this.formDetails.scoreType= infomsg.scoreType*1
            this.formDetails.examTime= infomsg.examTime
            this.formDetails.stat= infomsg.stat
            // this.formDetails.createTime = infomsg.createTime
        }else{
             if(infomsg.auditStatus==undefined){
                return
              }else{
                this.formDetails.auditStatus = infomsg.auditStatus
                this.formDetails.semesters= infomsg.termId*1
                this.formDetails.grade= infomsg.grade.toString()
                this.formDetails.majorId= infomsg.major*1
                this.formDetails.courseId= infomsg.course*1
                this.formDetails.scoreType= infomsg.scoreTypeId*1
                this.formDetails.examTime= infomsg.examTime
                this.formDetails.stat= infomsg.stat
                this.formDetails.createTime = infomsg.createTime
              }
        }
        this.getCourseList(  this.formDetails.grade, this.formDetails.majorId,  this.formDetails.semesters)
        
        //加载行政班列表
         self.$http.get("_op:/administrative/class/list/"+this.formDetails.grade+"/"+this.formDetails.majorId).then(res=>{
              if(res.code === 0){
                self.administratives = res.data;
              } 
            }).catch(err=>{

            })

        this.onSearch()
        
        
        
      },
       destroyed(){
        clearTimeout(this.setTimeout)
      },
    methods: {
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
       
       slef.$refs[nextId].focus()
    
      },
         nextFocus2(row, index, e) {
         
            let slef = this
            e.target.blur()
            var nextId;
            var loop;
        
            if (index >= slef.tableData.length-1) {
              index = -1;
            }
            for (loop = index+1; loop < slef.tableData.length; loop++) {
            
              // if (slef.tableData[loop].examStatus == 0) {
              
                nextId = loop;
                break;
              // }
            }
            
            document.getElementById(`add${nextId}`).focus()
       
    
      },
       

      exportResult(){
        let self = this
        let query = {
          scoreTypeId:self.formDetails.scoreType,
          course:self.formDetails.courseId,
          major:self.formDetails.majorId,
          grade:self.formDetails.grade,
          termId:self.formDetails.semesters,
          examTime: self.formDetails.examTime,
          administrativeClassIds:self.administrativeClassIds,
          auditStatus: this.$route.query.auditStatus
        }
        var templateName = "形成性成绩录入";
        templateName = templateName + `-${self.formDetails.grade}`
        let majors = this.majorList.filter(x => x.id == self.formDetails.majorId);
        if (majors.length > 0) {
          templateName = templateName + `-${majors[0].name}`;
        }

        let courses = this.courseList.filter(x => x.courseId == self.formDetails.courseId);
        if (courses.length > 0) {
          templateName = templateName + `-${courses[0].courseName}`;
        }

        let scoreTypes = this.examinationlist.filter(x => x.id == this.formDetails.scoreType);
        if (scoreTypes.length > 0) {
          templateName = templateName + `-${scoreTypes[0].name}`
        }
        templateName = templateName + ".xls";
      
        this.$http2.post('_sc:/importScore/exportResult',query).then(data=>{
              let url = window.URL.createObjectURL(new Blob([data]));
              let y = this.$refs.exportExcel;
              y.href = url;
              y.setAttribute("download", templateName);
              y.click();
              window.URL.revokeObjectURL(url);
        })
      },

      findScoreByAdministrative(value){
      
         let ids = "";
          if(value && value.length > 0){
            ids = value.join(',');
            ids = "'"+ids.replace(/,/g,"','")+"'";
          }
          let self = this;
          self.onSearch(ids); 
      },
      updateTableHeader(){ //根据uuid 更新主表记录
        let self = this;
        if(self.curruuid!==null && self.curruuid.length > 0){
            let query = {
              // createTime: this.formDetails.createTime,
              examTime: self.formDetails.examTime,
              scoreTypeId: self.formDetails.scoreType,
              uuid:self.curruuid
            }
            self.$http.put("_sc:/importScore/updateByUuid",query).then(res=>{
              if(res.code === 0){
                this.$message({
                  type:"success",
                  message:"更新成功!"
                })
                // this.onSearch()
                // this.dialogClose('formDetail')
              }else{
                  this.$message({
                  type:"error",
                  message:res.msg
                })
              }
            }).catch(err=>{

            })

        }
      },
      updateImportScore(row,intype){
        let self = this;
        if(intype == 'inpt'){ 
          if(row.score!=''){
             if (
                /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(row.score) == false
              ) {
            
                self.$message.error("请输入有效数字");
                row.score = "";
                return;
              }

              // if (row.score > 999.9 || row.score < 0) {
              //   row.score = 999.9;
              //   self.$message.error("请填写大于等于0,小于等于999.9的数字");
              //   return;
              // }
              // if(/^[+]?\d*\.?\d{0,10}$/.test(row.score)==false){
              //     self.$message.error("只能有一位小数");
              //     row.score = "";
              //     return;
             
              // }
          }else{
               self.$message.error("请输入有效数字")
                return;
          }
        }
        var st = this.examStatuss.filter(x => x.id == row.examStatus);
        if (st.length > 0) {
          if (st[0].code == 'ZC') {
            row.scoreDisabled = false;
          } else {
            row.scoreDisabled = true
          }
        }
     
        let query = {
            id:row.id,
            uuid:self.curruuid,
            score:row.score,
            remark:row.remark,
            examStatus: row.examStatus,
            studentName: row.name,
            studentNo: row.studentno,
            scoreTypeId:self.formDetails.scoreType,
            course:self.formDetails.courseId,
            major:self.formDetails.majorId,
            grade:self.formDetails.grade,
            termId:self.formDetails.semesters,
            examTime: self.formDetails.examTime,

            // auditStatus:self.formDetails.auditStatus,
          }
          this.$http.put("_sc:/importScore/saveImportScore",query).then(res=>{
            if(res.code == '0'){
              row.id = res.data.id;
              self.curruuid = res.data.uuid;
              row.score = res.data.score;
              this.$message({
                type:"success",
                message:"录入成功!"
              })
              // this.onSearch()
              // this.dialogClose('formDetail')
            }else{
                this.$message({
                type:"error",
                message:res.msg
              })
            }
          }).catch(err=>{

          })
      },
      save(){
          let msg = ''
        if(this.approval.status==1){
                msg = '确认成功'
                this.confirmsave(3,msg)
              }else{
                msg = '驳回成功'
                if(this.approval.explain==''){
                this.$message({
                      type:'warning',
                      message:'驳回说明不能为空！'
                  })
                }else{
                  this.confirmsave(4,msg)
                }
          }

        // this.calculationresults()aa
      },
      jiaoyan2(formDetail){
              this.$refs.formDetail.validate((valid2) => {
                if (valid2) {
                    
                } else {
                  this.dialog.visible = true
              
                return false;
                }
            });
      },
      confirmsave(auditStatus,msg){
        let self = this;
        let rejectRemark = ''
        if(auditStatus==4){
          rejectRemark = this.approval.explain
        }
              let query = {
            auditStatus: auditStatus,
            course: this.formDetails.courseId,
            // createTime: this.formDetails.createTime,
            examTime: this.formDetails.examTime,
            grade:this.formDetails.grade,
            major:this.formDetails.majorId,
            scoreTypeId: this.formDetails.scoreType,
            termId:this.formDetails.semesters,
            rejectRemark:rejectRemark
          }
          // param.rejectRemark = self.approval.explain;
          self.$http.put("_sc:/importScore/updateAuditStatus",query).then(res=>{
         
            if(res.code=='0'){
                self.$message({
                type: "success",
                message:"确认成功"
            });
                self.goback();
                self.onSearch();
            }else{
              
               self.$message({
                type: "error",
                message:res.msg
            });
            }
          }).catch(err=>{

          })
          // if(auditStatus === 4){
              
          // }else if(auditStatus === 3){
          //     // self.calculationresults();
          // }
       
      },
      
    calculationresults(){
       
      let query = {
          course:this.formDetails.courseId,
          // examTypeId: this.examTypeId,
          grade: this.formDetails.grade,
          major: this.formDetails.majorId,
          scoreTypeId: this.formDetails.scoreType,
          termId:this.formDetails.semesters,
      }
      this.$http.post("_sc:/stuScore/addStageGrade",query).then(res=>{
        if(res.code=='0'){
            this.$message({
                type: "success",
                message:"计算成功"
            });
             this.goback()
        }else{
          this.$message({
                type: "waring",
                message:"计算失败!请重新计算"
            });
        }
      }).catch(err=>{

      })
    },
      editcontent(row){ // 编辑入口
        // debugger
        this.dialog.status = "edit";
        this.dialog.visible = true
        this.formDetail.studentNo = row.studentNo
        this.formDetail.studentname = row.studentName
        this.formDetail.scoreType = row.scoreTypeId
        this.formDetail.status = row.examStatus
        this.formDetail.score = row.score
        this.formDetail.id = row.id
      
      },
        newlyadded(){ //新增入口
          let self = this;
          
          this.$refs.formDetails.validate((valid) => {
              if (valid) {
                
                    self.formDetail.status = self.examinationstutslist.filter(item => item.code === 'ZC')[0].id;
                    this.dialog.status = "add";
                    this.dialog.visible = true;
                
              } else {
            
              return false;
              }
          });

      },
      addsubmitForm(formDetail){
        this.formDetail.studentNo = this.formDetail.student.stuNum || null;
        this.formDetail.studentname = this.formDetail.student.name || null;
           this.$refs.formDetail.validate((valid2) => { 
                if (valid2) { 
                  if(this.dialog.status == "edit"){
                    this.editImportScore()
                  }else if(this.dialog.status == "add"){
                     this.formDetails.auditStatus = 1
                    this.addImportScore()
                   
                  }
                  this.students = [];
                } else {
                  this.students = [];
                  return false;
                }
            });
        
      },
      addImportScore() {//新增录入成绩请求接口
        let self = this
        if(self.formDetail.score<0||self.formDetail.score>100){
                this.$message({
              type:"error",
              message:'您输入的分数不正确！'
          })
        }else{
            let query = {
              score:self.formDetail.score,
              examStatus: self.formDetail.status,
              studentName: self.formDetail.studentname,
              studentNo: self.formDetail.studentNo,
              scoreTypeId:self.formDetails.scoreType,
              course:self.formDetails.courseId,
              major:self.formDetails.majorId,
              grade:self.formDetails.grade,
              termId:self.formDetails.semesters,
              examTime: self.formDetails.examTime,
              // auditStatus:self.formDetails.auditStatus,
            }
            this.$http.put("_sc:/importScore/editImportScore",query).then(res=>{
                if(res.code == '0'){
                  this.$message({
                    type:"success",
                    message:"新增成功!"
                  })
                  this.onSearch()
                  this.dialogClose('formDetail')
                }else{
                    this.$message({
                    type:"error",
                    message:res.msg
                  })
                }
              }).catch(err=>{

              })
        }
     
    
      },
      editImportScore(){ //编辑录入成绩请求接口

        if(this.formDetail.score<0||this.formDetail.score>100){
                this.$message({
              type:"error",
              message:'您输入的分数不正确！'
          })
        }else{
          let query = {
            examStatus: this.formDetail.status,
            id: this.formDetail.id,
            score:this.formDetail.score,
           
            studentName: this.formDetail.studentname,
            studentNo: this.formDetail.studentNo
          }
          this.$http.put("_sc:/importScore/editImportScore",query).then(res=>{
            if(res.code == '0'){
              this.$message({
                 type:"success",
                 message:"修改成功!"
              })
              this.onSearch()
           
              this.dialogClose('formDetail')
             
              
            }
          }).catch(err=>{

          })
        }
    
      },
      dialogClose(formDialog){//关闭弹窗
        this.$refs[formDialog].resetFields();//todo 重置数据未生效
        this.formDetail.studentNo=''
        this.formDetail.studentname=''
        this.formDetail.scoreType=''
        this.formDetail.status=''
        this.formDetail.id = ''
        this.dialog.visible=false;
        this.dialog.status = ''
        this.students = [];
          
      },
      getstudentname(val){
        let studentNo = '' ;
        let self = this
             if(val!=undefined){
                studentNo = val
                this.verification(val)
            }
            
            
      },

      verification(studentNo) {

        if (studentNo != '') {
          this.loadingStudent = true;
          var query = {
            pageNo: 1,
            pageSize: 10,
            param: {
              stuNum: studentNo,
              status: 1
            }
          };
          this.$http.post('_op:/students/list', query).then(res => {
            this.loadingStudent = false;
            this.students = res.data.records;
          })
        }
      },
     
     
      goback(){
        history.go(-1)
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
      findscoretype(val){
       
      },
      getscoreSett(){
      
        this.$http.get('_sc:/scoreSetting/combox/SCORE_TYPE').then(res=>{
         this.examinationlist =  res.data
        })
         
      },
       
    
      importStuScore(){//批量导入
      
          this.$refs.formDetails.validate((valid) => {
              if (valid) {
              this.importstudentDialog=true
              } else {
            
              return false;
              }
          });
          
      },
        // 导入文件选择文件
            fileSelected (file, fileList){
                this.fileList = fileList.slice(-1);
            },
            onSuccess(res,file, fileList){
             
              let type = "success";
              let message = "导入成功！";
              if(res.code!=0){
                 type = "error";
                 message = res.msg;
              }
              this.$message({
                 type:type,
                 message:message
              })
            },
            onBefore(file) {
              let extension = file.name.split('.')[1]==='xls';
              let size = file.size / 1204 / 1204 < 20;
              if(!extension){
                this.$message.warning("上传的文件格式是 xls！")
              }
              if(!size){
                this.$message.warning("上传的文件大小不能超过20M！")
              }
              return extension && size;
            },

            submitUpload(){
                let self = this
                self.allow = true
               
                self.startImport()
                 setTimeout(function(){ 
                     self.allow = false
                 }, 1000);
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
            startImport() {
                let self = this
                // let examTime = this.getnewdate(self.formDetails.examTime)
                if (self.fileList.length < 1) {
                    self.$message.warning('请选择导入文件！');
                    return ;
                } else{
                   
                    let formData = new FormData();
                        formData.append('file', self.fileList[0].raw);
                    
                        formData.append('scoreTypeId', self.formDetails.scoreType);
                        formData.append('course', self.formDetails.courseId);
                        formData.append('major', self.formDetails.majorId);
                        formData.append('grade', self.formDetails.grade);
                        formData.append('termId', self.formDetails.semesters);
                        formData.append('examTime',self.formDetails.examTime);
                         
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                    }
               
                    const loading = this.$loading({
                      lock: true,
                      text: "导入中...",
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                    });
                    this.$http.post('_sc:/importScore/import', formData,config).then(data => {
                      loading.close();
                        if(data.code == 0) {
                             self.$message({
                                message: '导入成功！',
                                type: 'success'
                            });
                             self.fileList = []
                            self.onSearch()
                            self.importstudentDialog=false
                        } else {
                            self.$message.error(data.msg);
                        }
                    }).catch(error => {
                        loading.close();
                        // self.$message.error(data.msg)
                    })
                }
            },

           //获取考试类型
            getscoreType(){
                let query = "EXAM_TYPE"
                let url = "_sc:/scoreSetting/combox/"
                this.$http.get(url+query).then(data=>{
                    if(data.code==0){
                        for(let i=0;i<data.data.length;i++){
                            if(data.data[i].name.indexOf('校内')>-1){
                                let self = this
                                // self.examTypeId = data.data[i].id
                            }
                        }
                    }
                })
            },
            
            // 获取考试状态
            getexaminationstuts(){
                let query = "STUDENT_EXAM_STATUS"
                let url = "_sc:/scoreSetting/combox/"
                this.$http.get(url+query).then(data=>{
                    if(data.code==0){
                        let self = this
                        self.examinationstutslist = data.data;
                        self.formDetail.status = data.data[0];
                    }
                })
            },
            
       //获取按钮权限
	      deletecont(row){
                this.$confirm(`此操作将永久删除该信息信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("_sc:/importScore/"+row.id)
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
  
        ifnoneshow(){
                let self = this
                self.ifnone = true;
        },
	  openprint(row){//打开打印的弹框
       
	  },
	  getresitList(id){
     
	  },
      
      closeprint(){//关闭打印的弹框
          this.printDialog =  false
      },
      submitadd(){//对新增的进行提交
       
         
      },
      addstudent(row){
        
      },
      onSearchNopass(){
        
      },
    
      onSearch(ids){
        let self = this
        let query = {
            scoreTypeId:self.formDetails.scoreType,
            course:self.formDetails.courseId,
            major:self.formDetails.majorId,
            grade:self.formDetails.grade,
            termId:self.formDetails.semesters,
            examTime: self.formDetails.examTime,
            administrativeClassIds:ids,
            auditStatus: this.$route.query.auditStatus
        }
        this.tableLoading = true;
        this.$http.post('_sc:/importScore/queryList',query).then(res=>{
          let arr =  res.data.examStatuss;
          for(let i=0;i<arr.length;i++){
            if(arr[i].cnName=='缓考'){
              arr.splice(i,1)
            }
          }
          self.examStatuss = arr.concat();          
          res.data.students.forEach(x => {
            x.scoreDisabled = false;
            var st = self.examStatuss.filter(y => y.id == x.examStatus);
            if (st.length > 0) {
              if (st[0].code == 'ZC') {
                x.scoreDisabled = false;
              } else {
                x.scoreDisabled = true;
              }
            }
          })
          self.tableData = res.data.students;
          this.tableLoading = false;
        }).catch(err=>{
          this.tableLoading = false;
        })
        
      },
     
      changeGetNewCoure(val){
      },
      getCourseList(grade,major,trem){//查询课程
          let query = {
            grade:grade,
            majorId:major,
            termId:trem,
          }
          this.$http.post("_sc:/courseScoreModel/getCourseByParam",query).then(res=>{
              this.courseList = res.data; 
          }) 
      },
      getMajorList(){//查询专业列表
        this.$http.get("_op:/major/combox").then(data=>{
          if(data.code==0){
            this.majorList = data.data;
            // this.majorId=data.data[0].id;
            // this.getCourseList(this.formDetails.majorId)
          }else{
            this.$message.error(data.msg);
          }
        })
      },
       getTermData(){//查询学期列表
        let query="学期"
          this.$http.get('_op:/terms/'+query).then(data=>{
              if(data.code==0){
                for (let i=0;i<data.data.length;i++) {
                  if (data.data[i].name.indexOf('当前学期')!=-1) {
                    
                          // this.orderNum=data.data[i].orderNum;
                          this.semesters = data.data[i].id;
                          // this.grade=data.data[i].year.toString();
                    break;
                  }
                }
                  this.semesterList = data.data.reverse();
              }else{
                  this.$message.error(data.msg);
              }
          })
        },
        sizeChange(size){
       
        },
        currentChange(current){
      
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
.examStatus{
  color: #C0C4CC;
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
      .addformDetail /deep/.el-input--suffix .el-input__inner,.el-input {
      // height: 35px;
      // line-height: 35px;
      width: 200px;
}
 .addformDetail /deep/.el-dialog__body{
   padding: 30px 40px;
 }

 .myinput {
   width:100px;
 }
 .myinput2 {
   width:300px;
 }
 .command-bar {
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: center;
	.el-input{
		width: 35px;
  }
 }
</style>