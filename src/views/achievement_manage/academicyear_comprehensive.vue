<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold" ref="">
      <el-form size="mini" :inline="true" :model="formEvaluate" @change="loadStudent" :rules="rules" ref="formEvaluate">
         <div class="fold">

            <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
              <el-form-item class="cm-collapse" v-show="fold.showBtn">
                  <el-button type="text" @click="collapseShow()">{{fold.text}}</el-button>
              </el-form-item>

         	  <el-form-item label="所在级"  prop="grade">
				      <intelligent-year-picker style="width: 100%;"
                  v-model="formEvaluate.grade"
                  type="year" 
                  value-format="yyyy" 
                  @change="getSemesterYear(formEvaluate.grade,'grade')"
                  placeholder="选择年级"> 
              </intelligent-year-picker>
			      </el-form-item>

            <el-form-item label="专业"  prop="majorId">
              <el-select v-model="formEvaluate.majorId"  @change="getSemesterYear(formEvaluate.majorId,'majorId')"  placeholder="请选择">
                <el-option
                  v-for="major in majorIdOptions"
                  :key="major.id"
                
                  :label="major.name"
                  :value="major.id">
                </el-option>
              </el-select>
            </el-form-item>
               <el-form-item label="学期" prop="semesterYear">
              <el-select style="width:220px" v-model="formEvaluate.semesterYear" :disabled="!formEvaluate.grade" multiple placeholder="请选择">
                <el-option
                  v-for="item in semesterYearOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
                 <el-form-item label="测评方案" prop="schemeId">
              <el-select v-model="formEvaluate.schemeId" placeholder="请选择"  @change="getevaluationScheme">
                <el-option
                  v-for="item in schemeIdOptions"
                  :key="item.id"
                  :label="item.name"
                 
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

             <el-form-item label="行政班">
                 
              <el-select v-model="formEvaluate.administrativeClassIds" multiple filterable @change="loadStudent" clearable placeholder="全部">
                <el-option
                  v-for="item in administrativeClassIdOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学生">
                 
              <el-select v-model="formEvaluate.stuIds" multiple clearable placeholder="全部" filterable>
                <el-option
                  v-for="item in stusIdOperations"
                  :key="item.studentno"
                  :label="item.name"
                  :value="item.studentno">
                </el-option>
              </el-select>
            </el-form-item>


       

        
            <el-form-item >
              <span v-for="(list,index) in schemeval" :key="index">
                  <span>{{list.name}}</span>
                  <span class="proportionalval">{{list.val | showPercent }}</span>
              </span>
              
            </el-form-item>
             
            
            <el-form-item>
              <el-checkbox v-model="checked">必修课不及格者不参与测评</el-checkbox>
            </el-form-item>
            <el-form-item v-if="evaluated">
                <el-button plain @click="fileResult">导出结果</el-button>
                 <a v-show="false" ref="exportExcel"></a>
            </el-form-item>
			      <el-form-item>
				      <el-button type="primary" @click="submitForm('formEvaluate')">测评</el-button>
			      </el-form-item>
         	</div>
         </div>
      </el-form>
    </div>

    <div class="cm-table" >
        <el-table 
            id="tabid"
            :max-height="calcTableHeight"
            :data="tableData2"
             class="tabstyle"
            border 
            size="mini" 
            ref="tab"
            :header-cell-style="getRowClass"
            header-row-class-name="cm-dark"
            v-loading="tableLoading"
            element-loading-text="加载中……"
            element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-table-column :label="date.name" v-for="(date, key) in tableData1" :fixed="date.fixed ? date.fixed : false" :width="date.width" :key="key" :prop="`p${key}`" :sortable="returnSortable(date)" :sort-by="`p${key}`">

            </el-table-column>
        </el-table>
    </div>
  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='academicyear_comprehensive';
    const REMARK='学年综合测评';

    export default {
      name: TYPE,
      data() {
        return {
          tableHeight:'300px',
          evaluated:false,//未测评就给按钮隐藏
          schemeval:[],
          // ruleForm: {
          //   name1: '',
          //   name2: '',
          // },
          rules: {
            grade: [
              { required: true, message: '请选择所在级', trigger: 'blur' }
             
            ],
            majorId: [
               { required: true, message: '请选择专业', trigger: 'change' }
            ],
            schemeId: [
               { required: true, message: '请选择方案', trigger: 'change' }
            ],
             semesterYear: [
               { required: true, message: '请选择学期', trigger: 'change' }
            ],
          },
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          checked: true,
          yearFlag: true,
          formLabelWidth: '60px',
          formEvaluate: {
            administrativeClassIds: [], //行政班ID
            evaluationType: 0,
            grade: '',  //所在级
            majorId: '',  //专业ID
            requiredFailedFlag:'',  //必修课不及格者复选框：0-勾选，1-未勾选
            schemeId: '',  //测评方案ID
            semesterYear: [],  //学年
            stuIds:[]
          },
          schemeType: 0,
          gradeOptions: [], //所在级
          majorIdOptions: [], //专业ID
          schemeIdOptions: [], //测评方案ID
          semesterYearOptions: [], //学年
          semesterYearOptionsBack: [], //学年
          administrativeClassIdOptions: [], //行政班ID
          stusIdOperations:[], //学生ID
          options: [
            {value: '选项1', label: '黄金糕'}, 
            {value: '选项2', label: '双皮奶'}
          ],
          tableLoading:false,
          tableData1:[],
          tableData2:[],
          ltemList: [],
          courseList: [],
          semesterList: [],
          fold:{
            state:true,
            text:'',
            showBtn:true,
         },
          sortLable: '' // 点击表头的label
        }
      },
      computed:{
         calcTableHeight() { 
          return  document.body.clientHeight-200; 
        },
      },
      filters: {
        showPercent(val) {
          const newval = val * 100;
          return newval.toFixed(2) + '%';
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
        this.tableHeight = document.getElementById("tabid").style.height = window.innerHeight-150+'px'
       
       
      },
      created(){
        //this.getTermData();
        this.getTermList()
        this.getSchemeIdSelect()
        // this.getMajorIdSelect();
      
        // this.getSemesterYear();
      },
      methods: {
        getTermList(){//查询学期列表
        let query="学期"
          return this.$http.get('_op:/terms/'+query).then(data=>{
              if(data.code==0){
                this.semesterYearOptionsBack = data.data.reverse();
                this.semesterYearOptions = data.data.reverse();
                // for(let i=0;i<this.semesterYearOptions.length;i++){
                //   if(this.formEvaluate.semesterYear.length == 0 && this.semesterYearOptions[i].name.indexOf('当前学期')!=-1){
                //     this.formEvaluate.semesterYear.push(this.semesterYearOptions[i].id);
                //   }
                // }
              }else{
                  this.$message.error(data.msg);
              }
          })
        },
        collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'':'';
        },
        getevaluationScheme(schemeId){
          this.$http.get('_sc:/evaluationScheme/'+schemeId).then(data=>{
            let self = this
            self.schemeval =data.data
          }).catch(err=>{

          })
         
        },
        //根据年级，专业，行政班加载学生列表 
        loadStudent(val) {
          let self = this;
          let ids = null;
          if(self.formEvaluate.administrativeClassIds && self.formEvaluate.administrativeClassIds.length > 0){
            ids = self.formEvaluate.administrativeClassIds.join(',');
            ids = "'"+ids.replace(',',"','")+"'";
          }
          let url = '_op:/students/queryStudentByMap';
          if(ids){
            url += '?administrativeClassIds='+ids;
          }
          let rel = '&';
          if(self.formEvaluate.majorId){
            if(url.indexOf('?')==-1){
              rel = '?'; 
            } else{
              rel = '&';
            }
            url += rel+'majorId='+self.formEvaluate.majorId;
          }

          if(self.formEvaluate.grade){
            if(url.indexOf('?')==-1){
              rel = '?'; 
            } else{
              rel = '&';
            }
            url += rel+'grade='+self.formEvaluate.grade;
          }

          self.$http.get(url).then(res=>{
            if(res.code == 0){
              
               self.stusIdOperations = res.data;
            }
           
          }).catch(err=>{

          })
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
       
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.getTermData();
            } else {
              return false;
            }
          });
      },
        getTermData () {
          this.tableLoading = true;
          if(this.checked){
             this.formEvaluate.requiredFailedFlag=0
          }else{
             this.formEvaluate.requiredFailedFlag=1
          }
          this.$http.post('_sc:/evaluation/evaluate/',{
            evaluationType: 0,
            // administrativeClassIds: this.formEvaluate.administrativeClassId,
            administrativeClassIds:this.formEvaluate.administrativeClassIds, //增加行政班多选查询
            studentNos:this.formEvaluate.stuIds,
            grade: parseInt(this.formEvaluate.grade),
            majorId: this.formEvaluate.majorId,
            requiredFailedFlag: this.formEvaluate.requiredFailedFlag,
            schemeId: this.formEvaluate.schemeId,
            termIds: this.formEvaluate.semesterYear,
          }).then(datas => {
            this.tableLoading=false;
            if(datas.code===0) {
                this.tableData2 = [];
                this.tableData1=this.initData(datas.data.columnNames);
                // this.tableData2=datas.data.resultList;
                let arr = [];
                arr=datas.data.resultList;
                for(var i=0; i<arr.length; i++){
                    let obj = {};
                    for(let key in arr[i]){
                        obj[`p${key}`] = arr[i][key];
                    }
                    this.tableData2.push(obj)
                }
                this.evaluated = true
                this.tableLoading=false;
                this.$nextTick(()=>{
                  this.$refs.tab.doLayout()
                })
              }else{
                this.$message({
                  message: datas.msg,
                  type: 'warning'
                });
              }
          }).catch(()=>{
              this.tableData=[];
              this.tableLoading=false;
          })
        },
        initData(arr){
          let temp = []
          if(arr){
            arr.forEach((item,index) => {
              if(item == '行政班'){
                temp.push({
                  name:item,
                  width:170
                })
              }else if(item == '学号' || item == '姓名'){
                temp.push({
                  name:item,
                  width:100,
                  fixed: true
                })
              }else{
                temp.push({
                  name:item,
                  width:80
                })
              }
            })
          }
          return temp
        },
        getAdministrativeClassId(val,key) { //获取行政班ID
          let slef =this
       
          // if((slef.formEvaluate.grade!=''|| slef.formEvaluate.grade!=null) &&(slef.formEvaluate.majorId!=''||slef.formEvaluate.majorId!=null)){
            let grade,
                majorId
            if(slef.formEvaluate.grade==''|| slef.formEvaluate.grade==null) {
              grade = 0
            }else {
              grade = slef.formEvaluate.grade
            }
            if(slef.formEvaluate.majorId==''|| slef.formEvaluate.majorId==null) {
              majorId = 0
            }else {
              majorId = slef.formEvaluate.majorId
            }
            this.$http.get("_op:/administrative/class/list/"+grade+'/'+majorId).then(datas=>{
              if(datas.code === 0) {
                 let data = datas.data;
                 this.administrativeClassIdOptions = data
               }
            })
          
          // }
        },
        getMajorIdSelect() { //获取专业ID
      
         this.$http.get('_op:/major/combox')
            .then(datas => {
              
              if(datas.code===0) {
                let data = datas.data;
                this.majorIdOptions=data;
              }
          }).catch(()=>{
              this.schemeIdOptions=[];
          })
        },
        getSchemeIdSelect() { //获取测评方案ID
        
          this.$http.get('_sc:/evaluationScheme/combox/'+this.schemeType)
            .then(datas => {
              if(datas.code===0) {
                let data = datas.data;
                this.schemeIdOptions=data;
              }
          }).catch(()=>{
              this.schemeIdOptions=[];
          })
        },
        getCourseList() {
          let grade
          if(this.formEvaluate.grade == '' || this.formEvaluate.grade == null) {
            grade = 0
          }else {
            grade = this.formEvaluate.grade
          }
          this.$http.get("_op:/major/getMajorByGrade/" + grade)
            .then( res => {
              if( res.code == 0) {
                this.majorIdOptions = []
                res.data.length > 0 && res.data.map( item => {
                  this.majorIdOptions.push({
                    name: item.name,
                    id: item.id
                  })
                })
              }else {

              }
            })
        },
        filterTerm() {
          this.semesterYearOptions = this.semesterYearOptionsBack.filter( item => {
            return item.year >= +this.formEvaluate.grade ? true : false
          })
        },
        getSemesterYear(val,key) { //获取学年
        if(key === 'grade') {
          this.formEvaluate.majorId = ''
          this.majorIdOptions = []
          this.formEvaluate.semesterYear = []
          this.filterTerm()
          this.getCourseList()
        }
        this.formEvaluate.administrativeClassIds = []
         this.loadStudent();//获取学生列表
         this.getAdministrativeClassId(val,key)
        
            // if(key == 'grade'){
            //       if(val) {
            //         this.yearFlag = false;
            //       }else {
            //         this.yearFlag = true;
            //         this.formEvaluate.semesterYear ='请选择';
            //       }
            //       this.semesterYearOptions.length=0;
            //       val = Number(val);
            //       for(let i=0; i<5; i++) {
            //         let year = val+'-'+(val+=1)+'学年';
            //         let obj = {
            //           id: i,
            //           name: year
            //         }
            //         this.semesterYearOptions.unshift(obj); 
            //       }
            // }
         
       
          
        },
        returnSortable (label){
            if (label == '学号'|| label == '姓名'|| label == '行政班') {
              return false;
            }
            return true;
        },
        ltemListA(row) {
          
        },
        fileResult(row) {  //导出结果
          // if(this.formEvaluate.grade==''||this.formEvaluate.majorId==''||this.formEvaluate.schemeId==''||this.formEvaluate.semesterYear==''){
          //   this.$message.warning('请先测评')
          // }
          let params = {
            evaluationType: 0,
            administrativeClassIds:this.formEvaluate.administrativeClassIds, //增加行政班多选查询
            studentNos:this.formEvaluate.stuIds,
            grade: parseInt(this.formEvaluate.grade),
            majorId: this.formEvaluate.majorId,
            requiredFailedFlag: this.formEvaluate.requiredFailedFlag,
            schemeId: this.formEvaluate.schemeId,
            termIds: this.formEvaluate.semesterYear
          }
          this.$http2.post('_sc:/evaluation/exportResult', params).then(datas => {
            let url = window.URL.createObjectURL(new Blob([datas]));
            let y = this.$refs.exportExcel;
            y.href = url;
            y.setAttribute("download", "导出文件.xls");
            y.click();
            window.URL.revokeObjectURL(url);
          })
        }
      } 
    }	
</script>

<style scoped lang="less">
.cm-table /deep/ .el-table--mini td{
  padding: 2px 0;
}
.pull-right{
  text-align: right;
  margin-right: 10px;
}
.tab2{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 40px;
            line-height: 40px;
        }
       
    }

.proportionalval{
  padding: 2px;
  border: solid 1px #ddd;
  margin-left: 5px;
  margin-right: 5px;
} 
.tabstyle{
      width: 100%; margin-top: 10px;
    }
</style>