<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-btn-con cm-fold">
      <el-form :inline="true" size="mini" :model="formSearch" label-width="58px">
        <div class="fold">
          <div ref="formDetail" class="detail select-con" :class="{'detail-show':fold.state}">
      
           <el-form-item label="所在级">
                <intelligent-year-picker v-model="formSearch.grade" type="year" value-format="yyyy" placeholder="请选择">  </intelligent-year-picker>
            </el-form-item>
            
            <el-form-item label="专业">
                <el-select v-model="formSearch.major" placeholder="请选择" clearable filterable>
                    <el-option 
                        v-for="item in majorList" 
                        :key="item.id" 
                        :label="item.name" 
                        :value="item.id"> 
                    </el-option>
                </el-select>
            </el-form-item>
                <el-form-item label="课程">
                <el-select v-model="formSearch.courseId" placeholder="请选择" clearable filterable>
                    <el-option 
                        v-for="item in courseList"
                        :key="item.id" 
                        :label="item.name" 
                        :value="item.id"> 
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" @click="onSearch()">查询</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    
    <div class="cm-table" id="xue">
        <el-table  id="dataTable" ref="multipleTable" class="tableBox" :max-height="tableHeight" :data="tableData" border v-loading="tableLoading" element-loading-text="加载中..." style="width: 100%" header-row-class-name="cm-dark">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column label="类别" prop="cn_name" width="110"></el-table-column>
            <el-table-column label="课程" prop="course_name"  width="260"></el-table-column>
            <el-table-column label="学时" prop="hours" width="80"></el-table-column>
            <el-table-column label="学分" prop="credit" width="50"></el-table-column>
             <el-table-column label="年级" prop="grade" width="60"></el-table-column>
            
            <el-table-column label="专业" prop="major_names"></el-table-column>
            <el-table-column label="第一学期" prop="semester_number1_hours" width="60"></el-table-column>
            <el-table-column label="第二学期" prop="semester_number2_hours" width="60"></el-table-column>
            <el-table-column label="第三学期" prop="semester_number3_hours" width="60"></el-table-column>
            <el-table-column label="第四学期" prop="semester_number4_hours" width="60"></el-table-column>
            <el-table-column label="第五学期" prop="semester_number5_hours" width="60"></el-table-column>
            <el-table-column label="第六学期" prop="semester_number6_hours" width="60"></el-table-column>
            <el-table-column label="第七学期"  prop="semester_number7_hours" width="60"></el-table-column>
            <el-table-column label="第八学期"  prop="semester_number8_hours" width="60"></el-table-column>
            <el-table-column label="第九学期"  prop="semester_number9_hours" width="60"></el-table-column>
            <el-table-column label="第十学期"  prop="semester_number10_hours" width="60"></el-table-column>
            <el-table-column label="操作"  prop="" width="120px">
               <template slot-scope="scope">
                  <el-button type="text" size="small" @click="changeSchoolHoursDialog(scope.row)">改学时</el-button>
                  <el-button type="text" size="small" @click="changeCourseDialog(scope.row)">换课程</el-button>
                </template>
            </el-table-column>
        </el-table>
       
        
    </div>
    <el-dialog title="批量学时修改" width="80%"   :visible.sync="dialog.hours"   append-to-body :close-on-click-modal="false">
                <el-row  type="flex" justify="space-between" class="row-bg" >
                    <el-col :span="18" style="padding-left: 15px;" >
                        <template>
                          <div>
                            <el-table :data="tableData1" border @row-click="getPro"  header-row-class-name="cm-dark"> 
                                  <el-table-column label="年级" prop="grade" width="60"></el-table-column>
                                  <el-table-column label="专业" prop="major_names"></el-table-column>
                                  <el-table-column label="第一学期" prop="semester_number1_hours" width="60"></el-table-column>
                                  <el-table-column label="第二学期" prop="semester_number2_hours" width="60"></el-table-column>
                                  <el-table-column label="第三学期" prop="semester_number3_hours" width="60"></el-table-column>
                                  <el-table-column label="第四学期" prop="semester_number4_hours" width="60"></el-table-column>
                                  <el-table-column label="第五学期" prop="semester_number5_hours" width="60"></el-table-column>
                                  <el-table-column label="第六学期" prop="semester_number6_hours" width="60"></el-table-column>
                                  <el-table-column label="第七学期"  prop="semester_number7_hours" width="60"></el-table-column>
                                  <el-table-column label="第八学期"  prop="semester_number8_hours" width="60"></el-table-column>
                                  <el-table-column label="第九学期"  prop="semester_number9_hours" width="60"></el-table-column>
                                  <el-table-column label="第十学期"  prop="semester_number10_hours" width="60"></el-table-column>
                            </el-table>
                          </div>
                            <div  style="display: flex;flex-direction: row; justify-content: left; align-items: center;">
                             <div style="display: inline-block; padding: 10px; padding-top: 30px;border-radius: 5px;height: 400px;width: 50%;overflow: auto;">
                             <!-- <el-form :inline="true" size="small" >
                                  <el-form-item label="年级">
                                      <intelligent-year-picker v-model="fiftgrade" type="year" value-format="yyyy" placeholder="请选择" @change="getchangeSchoolHours()">  </intelligent-year-picker>
                                  </el-form-item>
                              </el-form> -->
                            <el-table :data="transferdata" border tooltip-effect="dark" ref="leftTable" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_change">
                              <el-table-column type="selection" width="35"></el-table-column>
                              <el-table-column label="年级" width="60" prop="grade">
                                 <!-- <template slot-scope="scope">
                                    {{fiftgrade}}
                                 </template> -->
                              </el-table-column>
                              <el-table-column label="专业" property="majorname" width="300"></el-table-column>
                            </el-table>
                          </div>

                          
                          <div  class="boxStyle" style=" text-align: center;width: 20%;">
                            <el-button style="margin: 10px 10px;" @click="torightSelected" :disabled="false" size="small">增加<i class="el-icon-d-arrow-right" style="margin-left: 5px;"></i></el-button>
                            <el-button style="margin: 10px 10px;" @click="torightDelete" :disabled="false" size="small"><i class="el-icon-d-arrow-left" style="margin-left: 5px;"></i>删除</el-button>
                          </div>
                          
                          <div style=" border-radius: 5px; height: 380px;width: 50%; overflow: auto;">
                             <p style=" line-height: 30px">批量修改时的年级专业</p>
                              <el-table :data="selectedList" border tooltip-effect="dark" ref="leftTable" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_changes">
                                <el-table-column type="selection" width="35"></el-table-column>
                                    <el-table-column label="年级" width="60" property="grade">
                                      <!-- <template slot-scope="scope">
                                          {{fiftgrade}}
                                      </template> -->
                                    </el-table-column>
                                    <el-table-column label="专业" property="majorname" width="250"></el-table-column>
                            </el-table>
                          </div>
                        </div>
                        </template>
                        
                    </el-col>
                  

                    <el-divider direction="vertical" height="100%"></el-divider>
                    <el-col :span="5" style=" #ddd;justify-content: center;    align-items: center;">
                        <div class=" grid-content bg-purple;">
                              <el-form :inline="true" size="small"  :model="formSearch" style="">
                                    <el-form-item label="课程：">
                                      <el-input v-model="getmajorbycourse_name" disabled></el-input>
                                        
                                    </el-form-item>
                                    <el-form-item label="学分：">
                                        <el-input v-model="credit_sorce" @blur="rulshouw1(credit_sorce)"></el-input>
                                    </el-form-item>
                                </el-form>
                                <el-table :data='termlist' style="">
                               
                                    <el-table-column  label="学期" prop="termname" ></el-table-column>
                                    <el-table-column label="理论学时"  >
                                        <template slot-scope="scope">
                                          <el-input v-model="scope.row.termhouw1" style="height: 30px;line-height: 30px;" @blur="rulshouw1(scope.row.termhouw1)"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="实践学时" >
                                        <template slot-scope="scope">
                                          <el-input v-model="scope.row.termhouw2" style="height: 30px;line-height: 30px;"  @blur="rulshouw1(scope.row.termhouw2)"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </div>
                    </el-col>
                </el-row>
      


            <span slot="footer" class="dialog-footer">
                <el-button @click="colsesubHouer()" >取 消</el-button>
                <el-button type="primary" @click="subHouer()">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="换课程" width="30%"   :visible.sync="dialog.course"   append-to-body :close-on-click-modal="false">
        <div style="width: 300px;
    margin: 0 auto;">
     
            <el-form :label-position="labelPosition" label-width="80px" :model="changecourses" ref="formDetails" :rules="rules">
                <el-form-item label="年级" prop="grade">
                   <intelligent-year-picker v-model="changecourses.grade" type="year" value-format="yyyy" placeholder="请选择">  </intelligent-year-picker>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-select v-model="changecourses.major" placeholder="请选择" clearable filterable>
                        <el-option 
                            v-for="item in majorList" 
                            :key="item.id" 
                            :label="item.name" 
                            :value="item.id"> 
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="旧课程" prop="oldmajor">
                    <el-select v-model="changecourses.oldmajor" placeholder="请选择" clearable filterable>
                        <el-option 
                            v-for="item in courseList" 
                            :key="item.id" 
                            :label="item.name" 
                            :value="item.id"> 
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="新课程" prop="newmajor">
                   <el-select v-model="changecourses.newmajor" placeholder="请选择" clearable filterable>
                        <el-option 
                            v-for="item in courseList" 
                            :key="item.id" 
                            :label="item.name" 
                            :value="item.id"> 
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
         <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.course = false" size="small">取 消</el-button>
            <el-button type="primary"  size="small" @click="addsubmitForm('formDetails')">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>
<script>
  import util from '@/util'
  import courseSelection from './components/course_selection_component';

  const TYPE = 'detailed_maintenance';
  const REMARK = '培养方案明细维护';
  export default {
    name: TYPE,
    data() {
            
      return {
        changecourses:{
            grade:'',
            oldmajor:'',
            newmajor:''
        },
        credit_sorce:'',
      	checkstdlist:[],//选中学生列表将添加
        checkstdlists:[],//选中学生列表将删除
        romovelist:[],
				selectedList:[],//已选学生列表
        tableData1:[],
        getmajorbycourseid:"",//课程基库ID
        getmajorbycourse_name:'',
        fiftgrade:'',
        labelPosition: 'left',
        value: [],
        transferdata:[{ key: '1', majorname: '' },
        { key: '2', majorname:  '' },],
        planId: {
          value: Number,
          default: -100
        },
        tableHeight: (window.innerHeight - 256), // talbe高度，默认640
       
      scoreMethodList: [
        {
          name: "百分制",
          id: "100"
        }
      ], //计分方式
  
    
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
        termlist:[ 
          { termname:'第一学期', termId:'1',termhouw1:'',termhouw2:''},
          { termname:'第二学期', termId:'2',termhouw1:'',termhouw2:''},
          { termname:'第三学期', termId:'3',termhouw1:'',termhouw2:''},
          { termname:'第四学期', termId:'4',termhouw1:'',termhouw2:''},
          { termname:'第五学期', termId:'5',termhouw1:'',termhouw2:''},
          { termname:'第六学期', termId:'6',termhouw1:'',termhouw2:''},
          { termname:'第七学期', termId:'7',termhouw1:'',termhouw2:''},
          { termname:'第八学期', termId:'8',termhouw1:'',termhouw2:''},
          { termname:'第九学期', termId:'9',termhouw1:'',termhouw2:''},
          { termname:'第十学期', termId:'10',termhouw1:'',termhouw2:''}
        ],
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
        dialog:{
            hours:false,
            course:false
        },
        formSearch: {
          grade: '',
         courseId:'',
          majorId: ''
        },
        majorList:[],
        courseList:[],
      
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        courseData: [],
        tableData: [],
         rules: {
            grade: [
            { required: true, message: '请选择所在级', trigger: 'change' }
            ],
            major: [
            { required: true, message: '请选择专业', trigger: 'change' }
            ],
            oldmajor: [
            { required: true, message: '请选择课程', trigger: 'change' }
            ],
            newmajor: [
            { required: true, message: '请选择课程', trigger: 'change' }
            ],
            
        },
   
       
      }
    },
  
    computed: {

    },
    created() {
        this.getMajorList()
        this.getCourseList()
        // this.onSearch()
        // this.generateData()
    },
    mounted() {
  
    },
    methods: { 
    colsesubHouer(){
				this.dialog.hours = false
				for(let i=0;i<this.termlist.length;i++){
					this.termlist[i].termhouw1 = ''
					this.termlist[i].termhouw2 = ''
					
				}
				this.credit_sorce = ''
				this.fiftgrade = ''
				this.transferdata = []
				this.selectedList = []
				this.romovelist = []
				this.checkstdlist = []
        this.checkstdlists = []
        this.onSearch()
			},
     
     
    rulshouw1(row){
      
      if(isNaN(row)){
        
        this.$message({
              type: 'waring',
              message: '请输入数字类型!'
        })
      }
    },
    subHouer(){
      
      let arr = []
      let arr2 = []
      let slef = this
      if(slef.selectedList.length==0){
        this.$message({
                  type: 'error',
                  message: '请选择年级专业!'
            })
            return
      }
      for(let i=0;i<slef.selectedList.length;i++){
        arr.push(slef.selectedList[i].grade+':'+slef.selectedList[i].majorid)
      }
     
      this.termlist.forEach(ele => {
        if (ele.termhouw1 || ele.termhouw2) {
          arr2.push(ele.termId + ":" + (ele.termhouw1 || 0) + '/' + (ele.termhouw2 || 0));
        }
      })

      if(arr2.length==0){
            this.$message({
                  type: 'error',
                  message: '请输入要修改的学时!'
            })
             this.termlist.map((item, index) => {
              item.termhouw1 = '';
              item.termhouw2 = '';
              });
              return
      }
      arr = arr.join(',') 
      arr2 = arr2.join(',')
      
       let credit = this.credit_sorce==''?-1: this.credit_sorce

      let query = {
          courseId:this.getmajorbycourseid,
          gradeMajor :arr,
          hourStr:arr2,
          credit:credit*1
      }
      this.$http.post('_ed:/trainplan/updateHour',query).then(res =>{
          if(res.msg=='success'){
            this.$message({
                  type: 'success',
                  message: '保存成功!'
            })
            this.colsesubHouer()
          }
        
      })
    },
    checkstd_change(value){//添加勾选事件
				this.checkstdlist = value;  
    },
    checkstd_changes(value){ //删除筛选事件
      this.checkstdlists = value
    },
    torightSelected(){//添加
				let self=this;
	    		if(self.checkstdlist.length > 0){ 	   
           
            self.selectedList = self.selectedList.concat(self.checkstdlist);//已选学生的列表
	    			// self.selectedList = self.checkstdlist;//已选学生的列表
        }
        for(let i=0;i<self.transferdata.length;i++){
            for(let k=0;k<self.checkstdlist.length;k++){
                if(self.transferdata[i].majorid==self.checkstdlist[k].majorid){
                 self.transferdata.splice(i,1)
                }
            }
        }
    },
    torightDelete(){
      let self = this; 
        for(let i=0;i<self.selectedList.length;i++){
            for(let k=0;k<self.checkstdlists.length;k++){
                if(self.selectedList[i].majorid==self.checkstdlists[k].majorid){
                 self.selectedList.splice(i,1)
                }
            }
        }
      	if(self.checkstdlists.length > 0){ 	   
           
            self.transferdata = self.transferdata.concat(self.checkstdlists);//已选学生的列表
	    			// self.selectedList = self.checkstdlist;//已选学生的列表
        }
    },
    addsubmitForm(){
      
       this.$refs.formDetails.validate(valid => {
          if (valid) {
        
            let query = {
                grade:this.changecourses.grade,
                major_id:this.changecourses.major,
                oldCourseId:this.changecourses.oldmajor,
                courseId:this.changecourses.newmajor

            }
            this.$http.post("_ed:/trainplan/replaceCourse",query).then(res=>{
                if(res.msg=='success'){
                  this.$message({
                    type: 'success',
                    message: '换课成功!'
                  });
                  this.dialog.course = false
                }else{
                  this.$message({
                    type: 'success',
                    message:res.msg
                  });
                }
                
            })

          } else {
           
            return false;
          }
        });
    },
    generateData(){
      this.termlist = [
        { termname:'第一学期',termhouw1:'1',termhouw2:'2'},
        { termname:'第二学期',termhouw1:'3',termhouw2:'3'},
      
      ]
    
      
    },
    changeCourseDialog(row){
       this.dialog.course =  true
       this.changecourses.oldmajor = row.course_id
    },
    changeSchoolHoursDialog(row){
        this.dialog.hours =  true
        this.transferdata = []
        this.getmajorbycourseid = row.course_id
        this.gethuous(row.course_id)
        this.getmajorbycourse_name = row.course_name
        this.fiftgrade = ''
       
    },
    getPro(row){
      this.fiftgrade = row.grade;
      this.getchangeSchoolHours();
    },
    getchangeSchoolHours(){
      let self = this
      let query = {
            courseId:self.getmajorbycourseid,
            grade:self.fiftgrade
      }
      this.transferdata.map((item2)=>{
            item2.majorname =  ''
        })
      this.$http.post("_ed:/trainplan/getMajorByGradeCourse",query).then(data=>{
        data.data.forEach(d => {
          d.grade = self.fiftgrade;
        })
        self.transferdata = data.data
      })
    },
    onSearch(){
        this.tableLoading = true
        let query = {
            courseId:this.formSearch.courseId,
            grade:this.formSearch.grade,
            major_id:this.formSearch.major
        }
         this.$http.post("_ed:/trainplan/getTrainPlanCourseDetail",query).then(data=>{
             if(data.code==0){
                this.tableLoading = false;
                 this.tableData = data.data
             
             }
           
        }).catch(err=>{
             this.tableLoading = false;
        })
       
    },
    gethuous(courseId){
         let query = {
            courseId:courseId,
            grade:this.formSearch.grade,
            major_id:this.formSearch.major
        }
         this.$http.post("_ed:/trainplan/getTrainPlanCourseDetail",query).then(data=>{
             if(data.code==0){
                // this.tableLoading = false;
                 this.tableData1 = data.data
             
             }
           
        }).catch(err=>{
             this.tableLoading = false;
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
    getCourseList(){
        this.$http.get("_op:/course/getAllCourse").then(res=>{
        this.courseList  =res.data
        })

    },
    }
  }
</script>
<style>
  .select-con .el-date-editor.el-input{
    width: 150px;
  }
</style>

<style scoped>
  .row-bg /deep/.el-divider--vertical{
    height: auto;
  }
  .grid-content /deep/.el-table td, .el-table th{
    padding:4px 0;
  }
.grid-content .el-input /deep/.el-input__inner{
  height: 30px;
  line-height: 30px;
}
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
  color:red;
   padding-left:47%;
  /* padding-right:20px; */
}
.inputStyle{
  width:340px;
}
 /deep/ .el-transfer-panel{
    width: 25%;
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