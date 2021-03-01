<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true" :model="param">
         <div class="fold">
         	<div class="formDetail">
         	  <el-form-item label="代码">
				      <el-input v-model="param.code" placeholder="代码"></el-input>
			      </el-form-item>
			      <el-form-item label="名称">
				      <el-input v-model="param.name" placeholder="名称"></el-input>
		        </el-form-item>
			      <el-form-item>
				      <el-button type="primary" @click="onSearch"  v-if="btnPerObj.query">查询</el-button>
			      </el-form-item>
            <el-form-item class="cm-collapse">
              <el-button size="mini" type="primary" @click="addSchoolYearEvaluation"  v-if="btnPerObj.query">新增</el-button>
            </el-form-item>
         	</div>
         </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px" size="mini" :header-cell-style="getRowClass">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
            <template slot-scope="scope">
                <template v-if="item.prop==='graduationType'">
                  {{ Number(scope.row.graduationType) === 0 ? '系统' : '自定义' }}
                </template>
                <template v-else-if="item.prop==='status'">
                  {{ Number(scope.row.status) === 1 ? '启用' : '禁用' }}
                </template>
                <template v-else-if="item.prop==='createTime'">
                    {{ scope.row.createTime}}
                </template>
                <template v-else>
                    {{scope.row[item.prop]}}
                </template>
            </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作"      v-if="btnPerObj.teaching||btnPerObj.plan||btnPerObj.delete" width="200">
          <template slot-scope="scope">
          	<el-button type="text" size="small" @click="editTabletRow(scope.row)"  v-if="btnPerObj.edit">编辑</el-button>
          	<el-button type="text" size="small" @click="coursesSt(scope.row)"  v-if="btnPerObj.relatedcourses&&scope.row.status==1">关联课程</el-button>
          	<el-button type="text" size="small" @click="deleteTabletRow(scope.row)"  v-if="btnPerObj.delete">删除</el-button>
          </template>	
        </el-table-column>
      </el-table>
    </div>
 <!-- custom-class="cm-dialog-small"  弹框的样式 -->
    <!-- <el-dialog 
      :title="(dialog.status==='add'?'新增':'编辑')+type"
      :visible.sync="dialog.visible"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
   
      @closed="dialogClose"
      >
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog" style="width:77%;padding-left:45px">

        <div class="customize"  v-show="formDialog.graduationType=='1'">
                 
          <el-form-item label="代码" prop="code" :label-width="formLabelWidth">
                    
            <el-input v-model="formDialog.code"   :disabled="dialog.status!=='add'"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
            
             <el-input v-model="formDialog.name"></el-input>
          </el-form-item>

          <el-form-item label="计算方式" prop="computeType" :label-width="formLabelWidth">
            <el-select v-model="formDialog.computeType" placeholder="请选择计算方式">
            <el-option
                v-for="item in calculationList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
  	    </el-form-item>
        </div>

  	    <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
  	      <el-input 
            type="textarea" 
            style="width:220px"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入描述" 
             maxlength="40"
            v-model="formDialog.remark">
          </el-input>
  	    </el-form-item>
        <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" :label-width="formLabelWidth">
    		  <el-radio-group v-model="formDialog.status" :disabled="enable">
    		    <el-radio :label="1">启用</el-radio>
    		    <el-radio :label="0">禁用</el-radio>
    		  </el-radio-group>
  		  </el-form-item>
  	  </el-form>
  	  <div slot="footer" class="dialog-footer">
  	    <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put', 'save')">确 定</el-button>
  	  </div>
	 </el-dialog> -->

     <el-dialog 
      :title="(dialog.status==='add'?'新增':'编辑')+type"
      :visible.sync="dialog.visible"
      width="550px"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogClose"
      >
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog" style="width:85%;padding-left:45px">
  	    <el-form-item label="代码" prop="code" :label-width="formLabelWidth">
  	      <el-input v-model="formDialog.code"   placeholder="请输入代码"></el-input>
  	    </el-form-item>
  	    <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
  	      <el-input v-model="formDialog.name" placeholder="请输入名称"></el-input>
  	    </el-form-item>
  
        <el-form-item label="计算方式" prop="computeType" :label-width="formLabelWidth">
            <el-select v-model="formDialog.computeType" placeholder="请选择计算方式">
            <el-option
                v-for="item in calculationList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
  	    </el-form-item>
          <el-form-item label="课程关联方式" prop="relationType" :label-width="formLabelWidth">
            <el-select v-model="formDialog.relationType" placeholder="请选择计算方式">
            <el-option
                v-for="item  in incurriculumModeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
  	    </el-form-item>
  	    <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
  	      <el-input 
            type="textarea" 
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入描述" 
            maxlength="100"
            v-model="formDialog.remark">
          </el-input>
  	    </el-form-item>
        <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" :label-width="formLabelWidth">
    		  <el-radio-group v-model="formDialog.status"  >
    		    <el-radio :label="1">启用</el-radio>
    		    <el-radio :label="0">禁用</el-radio>
    		  </el-radio-group>
  		  </el-form-item>
  	  </el-form>
  	  <div slot="footer" class="dialog-footer">
  	    <el-button @click="dialog.visible = false">取 消</el-button>
  	    <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put', 'save')">确 定</el-button>
  	  </div>
	 </el-dialog>


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
  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='graduation_assessment';
    const REMARK='毕业测评项目';

    export default {
      name: TYPE,
      data() {
        
           // 自定义验证代码
             let codeRules = (rule, value, callback) => {
                let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
                let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
                if (regEn.test(value) || regCn.test(value)) {
                    callback(new Error("不能包含特殊字符"));
                } else if ((value.length )> 20) {
                    callback(new Error("代码长度不能超过20位"));
                } else {
                    callback();
                }
            };
           // 自定义验证代码
             let nameRules = (rule, value, callback) => {
                let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
                let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
                if (regEn.test(value) || regCn.test(value)) {
                    callback(new Error("不能包含特殊字符"));
                } else if ((value.length )> 20) {
                    callback(new Error("名称长度不能超过20位"));
                } else {
                    callback();
                }
            };
        return {
           enable:false,// 如果查到数据说明已经启用 不能再选禁用
          codes:'',
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          param: {
            code: '',
            name: '',
            evaluationType: 1,
            isDelete: 0
          },
          dialog:{
            status:'add',
            visible:false,
          },
          customizeVisible: true,
          formLabelWidth: '110px',
          formDialog: {
            graduationType: 1, //0-系统，1-自定义
            code1: '',
            code: '',
            name: '',
            remark: '',
            evaluationType: 1,
            curriculumMode:"",
            status:1 //1-启用，0-禁用
          },
          codeSel: '',
          codeVal: '',
           incurriculumModeList:[
            {
              value:0,
              label:"手工关联课程",
              id:0,
            },
             {
              value:1,
              label:"自动关联必修(没被手工关联的所有必修课)",
              id:1,
            },
             {
              value:2,
              label:"自动关联选修(没被手工关联的所有选修课)",
              id:0,
            },
             {
              value:3,
              label:"自动关联所有课程(没被手工关联的所有课程)",
              id:3,
            },
           

          ],
          rules: {
             code1: [
              { required: true, message: '请输入名称', trigger: 'change' },
              //  { validator: codeRules, trigger: ['change',blur] } ,
            ],
            code: [
              { required: true, message: '请输入代码', trigger: 'change' },
               { validator: codeRules, trigger: ['change','blur'] } ,
            ],
            relationType: [
              { required: true, message: '课程关联方式', trigger: 'change' },
            ],
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' },
               { validator: nameRules, trigger: ['change','blur'] } ,
            ],
            computeType: [
              { required: true, message: '请选择计算方式', trigger: 'change' },
            ]
          },
          optionsName: [], //课程性质
          tableData: [],
          tableList: [
            {label:'代码', prop:'code'},
            {label:'名称', prop:'name'},
            {label:'描述', prop:'remark'},
            // {label:'属性', prop:'graduationType'},
            {label:'状态', prop:'status', width:120},
            {label:'创建人', prop:'createUser'},
            {label:'创建日期', prop:'createTime', width:120}
          ],
            calculationList:[
            {label:'按课程学时加权平均值', value:0},
            {label:'按课程门数平均值', value:1},
            {label:'课程总成绩', value:2}
          ],
	        pageNo: 1,
          pageSize: 20,
          totalCount:0,
          btnPerObj:{
             add:false,
             edit:false,
             query:false,
             delete:false,
             relatedcourses:false,
           }
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
          
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
      },
    
      created(){
         
        this.getTableData();
        this.getCourseNature();
        this.propertyChange();
      },
      filters:{
        getTime(time){
          return util.getTime(time);
        }
      },
      methods: {
          //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                  
                    data.data.map(item => {
                        if (item.code=="add_graduationEvaluationItem") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="query_graduationEvaluationItem") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="edit_graduationEvaluationItem") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="delete_graduationEvaluationItem") {
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="relationcurriculum_graduationEvaluationItem") {
                            self.btnPerObj.relatedcourses=true;
                        }
                    });
                }).catch(()=>{
                })
            },
        sizeChange(size){
        
          this.pageNo = 1;
          this.pageSize = size;
          this.getTableData();
        },
        currentChange(current){
        
          this.pageNo=current;
          this.getTableData();
        },
        addSchoolYearEvaluation() {
          this.dialog.status = 'add';
          this.dialog.visible = true;
          this.formDialog.remark = ''
          this.formDialog.code = ''
          this.formDialog.name = ''
          this.formDialog.computeType = ''
          this.formDialog.relationType = ''
        },
        getTableData() {
      
          this.tableLoading = true;
          this.$http.post('_sc:/evaluationItem/list',{
            param: this.param,
            pageNo:this.pageNo,
            pageSize:this.pageSize
          }).then(datas => {
              if(datas.code===0) {
                let data = datas.data;
                this.pageNo = data.pageNo;  //当前第几页
                this.pageSize = data.pageSize; //每页显示多少条
                this.totalCount = data.totalCount; //当前第总条数
                this.tableData=data.result;
                this.tableLoading=false;
              }
          }).catch(()=>{
              this.tableData=[];
              this.tableLoading=false;
          })
        },
        getCourseNature(){  //课程性质
          this.$http.get('_op:/dicts/combox/'+ 'course-nature').then(data=>{
            
              this.optionsName=data.data;
          })
        },
        propertyChange(val) {
        
        },
        selCode(val) {

          this.codeSel = val;
        },
        
        dialogClose(){
         
        },
        commonValidate(ref, type, val) { //确定
         
            if(this.formDialog.graduationType=='0'){
       
              this.rules.code1[0].required = true;
              this.rules.code[0].required = false;
              this.rules.name[0].required = false;
             
            } else if(this.formDialog.graduationType=='1') {
              this.rules.code1[0].required = false;
              this.rules.code[0].required = true;
               this.rules.name[0].required = true;
            }
            this.$refs[ref].validate((bool)=>{
                if(bool){
                  this.commonRequire(type,val)
                }
            })

         
        },
        // 新增编辑提交
        commonRequire(method,val){
               
          let option=util.clone(this.formDialog);
          option.evaluationType = 1
          let self = this
          // if(self.formDialog.graduationType==1){
              option.code = self.formDialog.code
              option.name = self.formDialog.name
           
                  delete option.code1
          // }else if(self.formDialog.graduationType==0){
              // option.name  =  self.formDialog.code1
            
              // option.name = self.optionsName[self.formDialog.code1].name;
              // option.code = self.optionsName[self.formDialog.code1].code;
              delete option.code1
                // delete option.code
          // }

     option.remark = self.formDialog.remark
          if(method=="post"){
            option.id = this.rowId;  
          }
          this.$http({
              method:method,
              url:"_sc:/evaluationItem",
              data:{
                  ...option
              }
          }).then(data=>{
            
              let type = "success";
              let message = `${self.dialog.status=='add'?'新增':'编辑'}成功！`;
              if(data.code==0){
                if(val=="save"){
                  self.$refs.formDialog.resetFields();
                }else{
                  self.dialog.visible = false;
                }
                self.dialog.visible=false;
                this.formDialog.code1=''
                this.formDialog.code=''
                this.formDialog.name=''
                this.formDialog.remark=''
                self.getTableData();
                self.getCourseNature();
              }else{
                type = "error";
                message = data.msg;
              }
              self.$message({
                type:type,
                message:message
              })
          })
        },
        onSearch() {
          this.getTableData();
        },
        deleteTabletRow(row){
          let itemId = row.id
          this.$http.get('_sc:/evaluationScheme/getEvaluationSchemeByItemId/'+itemId).then(res=>{
            if(res.data.length>0){
                 this.$message({
                  type: 'wanring',
                  message: '已经关联不能删除'
                });
            }else{
              this.$confirm(`此操作将永久删除 “${row.name}” 所维护的信息, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                  this.$http.delete("_sc:/evaluationItem/"+row.id)
                  .then(data=>{
                    let type = "success";
                    let message = "删除成功！";
                    if(data.code===0){
                      this.getTableData();
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
            }
          })
          
        },
        editTabletRow(row) { //编辑
          //   let itemId = row.id

          // this.$http.put("_sc:/evaluationItem",{
          //   code: row.code,
          //   id: row.id,
          //   evaluationType: row.evaluationType,
          //   computeType:row.computeType,
          //   relationType:1,
          //   name: row.name,
          //   status: row.status
          // }).then(() => {
          //     this.formDialog=row;
          // });
          // this.getTableData();
          this.formDialog = JSON.parse(JSON.stringify(row));
          this.dialog.status='edit';
          this.dialog.visible=true;
        },
        coursesSt(row) {
       
          let id = row.id
          this.$router.push({
            path:'/achievement_manage/graduation_courses',
            query:{
                id:id
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
        handleSizeChange(val) {
      
        },
        handleCurrentChange(val) {
         
        }
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
.el-select{
  width: 100%
}
</style>