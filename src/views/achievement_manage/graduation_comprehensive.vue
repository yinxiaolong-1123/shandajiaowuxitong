<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true" :model="formEvaluate" :rules="rules" ref="formEvaluate">
         <div class="fold">
              <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
              <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow()">{{fold.text}}</el-button>
            </el-form-item>
         	  <el-form-item label="所在级"  prop="grade">
				      <intelligent-year-picker style="width:120px"
                  v-model="formEvaluate.grade"
                  type="year" 
                  @change="getSemesterYear"
                  value-format="yyyy" 
                  placeholder="选择年级"> 
              </intelligent-year-picker>
			      </el-form-item>
            <el-form-item label="专业"    prop="majorId">
              <el-select  v-model="formEvaluate.majorId" filterable placeholder="请选择">
                <el-option
                  v-for="major in majorIdOptions"
                  :key="major.id"
                  :label="major.name"
                  :value="major.id">
                </el-option>
              </el-select>
            </el-form-item>

             <el-form-item label="行政班">
                 
              <el-select v-model="formEvaluate.cls" multiple filterable @change="loadStudent" clearable placeholder="全部">
                <el-option
                  v-for="item in administrativeClassIdOptions"
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

        

            <el-form-item v-if="evaluated">
                <el-button plain @click="fileResult">导出结果</el-button>
                <a v-show="false" ref="exportExcel"></a>
            </el-form-item>
			      <!-- <el-form-item>
				      <el-button type="primary" @click="submitForm('formEvaluate')">测评</el-button>
			      </el-form-item> -->
         	</div>
            <div >
                <el-form-item>
				          <el-button type="primary" @click="submitForm('formEvaluate')">测评</el-button>
			          </el-form-item>
            </div>
         </div>
      </el-form>
      <p style="margin-left:20px">
          <span v-for="(list,index) in schemeval" :key="index">
              <span>{{list.name}}</span>
              <span class="proportionalval">{{list.val == 0.58 || list.val ==  0.57 ? Math.round(list.val * 100) : list.val * 100}}%</span>
          </span>
        </p>
    </div>

    <div class="cm-table">
      <el-table 
            :data="tableData2"
             id="tabid"
             :height="calcTableHeight"
            border 
            class="tabstyle"
             size="mini" 
            :header-cell-style="getRowClass"
            header-row-class-name="cm-dark"
            v-loading="tableLoading"
            element-loading-text="加载中……"
            element-loading-background="rgba(255, 255, 255, 0.8)">
            <el-table-column :label="date.name" v-for="(date, key) in tableData1" :width="date.width" :key="key" :prop="`p${key}`" :sortable="returnSortable(date)" :sort-by="`p${key}`">
            </el-table-column>
        </el-table>

    </div>

  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='graduation_comprehensive';
    const REMARK='毕业综合测评';

    export default {
      name: TYPE,
      data() {
        return {
          tableHeight:'300px',
          evaluated:false,//未测评就给隐藏
          tableData2:[],
          tableData1:[],
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          checked: true,
          yearFlag: true,
          formLabelWidth: '60px',
          formEvaluate: {
            cls: [],
            administrativeClassId: [], //行政班ID
            evaluationType: 1,
            grade: '',  //所在级
            majorId: '',  //专业ID
            requiredFailedFlag: '',  //必修课不及格者复选框：0-勾选，1-未勾选
            schemeId: '',  //测评方案ID
            semesterYear: '',
          },
          schemeval:[],
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
               { required: true, message: '请选择学年', trigger: 'change' }
            ],
          },
          schemeType: 1, //毕业
          gradeOptions: [], //所在级
          majorIdOptions: [], //专业ID
          schemeIdOptions: [], //测评方案ID
          administrativeClassIdOptions: [], //行政班ID
          tableLoading:false,
          tableData: [],
          tableList: [
           
          ],
            fold:{
                state:false,
                text:'展开',
                showBtn:false,
            },
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
     
        this.getSchemeIdSelect();
        // this.getMajorIdSelect();
      
      },
      computed:{
         calcTableHeight() { 
          return  document.body.clientHeight-180; 
        },
      },
      watch:{
      },
      methods: {
        returnSortable (label){
            if (label == '学号'|| label == '姓名'|| label == '行政班') {
              return false;
            }
            return true;
        },
         getevaluationScheme(schemeId){
          this.$http.get('_sc:/evaluationScheme/'+schemeId).then(data=>{
            let self = this
            self.schemeval =data.data
          }).catch(err=>{

          })
        
        },
        collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
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
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
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
        getTermData () {
          this.tableLoading = true;
         
           this.formEvaluate.requiredFailedFlag=1
          // if(this.checked){
          //    this.formEvaluate.requiredFailedFlag=0
          // }else{
          //    this.formEvaluate.requiredFailedFlag=1
          // }
          this.$http.post('_sc:/evaluation/evaluate/',{
            evaluationType: 1,
           administrativeClassIds:this.formEvaluate.cls,
            //administrativeClassId: this.formEvaluate.administrativeClassId,
            grade: parseInt(this.formEvaluate.grade),
            majorId: this.formEvaluate.majorId,
            requiredFailedFlag: this.formEvaluate.requiredFailedFlag,
            schemeId: this.formEvaluate.schemeId,
         
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
                  width:100
                })
              }else{
                temp.push({
                  name:item,
                  width:''
                })
              }
            })
          }
          return temp
        },
       getAdministrativeClassId(grade) { //获取行政班ID
           this.$http.get('_op:/administrative/class/list/'+grade)
             .then(datas=>{
               if(datas.code === 0) {
                 let data = datas.data;
                 this.administrativeClassIdOptions = data
               }
             }).catch(()=>{
               this.administrativeClassIdOptions = [];
            })
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
        getSemesterYear(val) { //获取学年
        
          this.getAdministrativeClassId(val*1)
          this.formEvaluate.majorId = ''
          this.majorIdOptions = []
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
        fileResult(row) {  //导出结果
      
          this.$http2.post('_sc:/evaluation/exportResult',{
            evaluationType: 1,
            administrativeClassIds:this.formEvaluate.cls,
            grade: parseInt(this.formEvaluate.grade),
            majorId: this.formEvaluate.majorId,
            requiredFailedFlag: 1,
            schemeId: this.formEvaluate.schemeId,
          
          }).then(datas => {
              let url = window.URL.createObjectURL(new Blob([datas]));
              let y = this.$refs.exportExcel;
              y.href = url;
              y.setAttribute("download", "导出文件.xlsx");
              y.click();
              window.URL.revokeObjectURL(url);
          })
        }
      } 
    }	
</script>

<style scoped lang="less">
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.cm-fold .detail {
    height: auto;
    padding-bottom: 20px;
}
.pull-right{
  text-align: right;
  margin-right: 10px;
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