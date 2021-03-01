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
				      <el-input v-model="param.code" placeholder="请输入代码"></el-input>
			      </el-form-item>
			      <el-form-item label="名称">
				      <el-input v-model="param.name" placeholder="请输入名称"></el-input>
		        </el-form-item>
			      <el-form-item>
				      <el-button type="primary" @click="onSearch" v-if="btnPerObj.query">查询</el-button>
			      </el-form-item>
            <el-form-item class="cm-collapse">
              <el-button size="mini" type="primary" @click="addSchoolYearEvaluation" v-if="btnPerObj.add">新增</el-button>
            </el-form-item>
         	</div>
         </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%; margin-top: 20px" size="mini" 
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
            <template slot-scope="scope">
                <template v-if="item.prop==='status'">
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
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
          	<el-button type="text" size="small" @click="editTabletRow(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
          	<el-button type="text" size="small" @click="coursesSt(scope.row)" v-if="btnPerObj.relatedcourses&&scope.row.status==1">关联课程</el-button>
          	<el-button type="text" size="small" @click="deleteTabletRow(scope.row)" v-if="btnPerObj.delete">删除</el-button>
          </template>	
        </el-table-column>
      </el-table>
    </div>

    <el-dialog 
      :title="(dialog.status==='add'?'新增':'编辑')+type"
      
      :visible.sync="dialog.visible"
      width="540px"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogClose"
      >
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog" style="width:85%;padding-left:45px">
  	    <el-form-item label="代码" prop="code" :label-width="formLabelWidth">
  	      <el-input v-model="formDialog.code"  placeholder="请输入代码"></el-input>
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
        <!-- {{formDialog.curriculumMode}} -->
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
    const TYPE='academic_year';
    const REMARK='学年测评项目';

    export default {
      name: TYPE,
      data() {
         var validateName = (rule, value, callback) => {
     
            if (value.length>20) {
              callback(new Error('名字不能超过20个字符'));
            } else {
            
              callback();
            }
          };
         var validateCode = (rule, value, callback) => {
        
            if (value.length>20) {
              callback(new Error('代码不能超过20个字符'));
            } else {
              callback();
            }
          };
        return {
          enable:false,// 如果查到数据说明已经启用 不能再选禁用
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
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
          param: {
            code: '',
            name: '',
            evaluationType: 0,
            isDelete: 0
          },
          dialog:{
            status:'add',
            visible:false,
          },
          formLabelWidth: '110px',
          formDialog: {
            code: '',
            name: '',
            remark: '',
            evaluationType: 0,
            // curriculumMode:"",
            relationType: 0,            
            status:1 //1-启用，0-禁用

          },
          rules: {
            code: [
              { required: true, message: '请输入代码', trigger: 'blur' },
              { validator: validateCode, trigger: 'change' }
            ],
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' },
                // { validator: validateName, trigger: 'change' }
            ],
            //  curriculumMode: [
            //   { required: true, message: '课程关联方式', trigger: 'change' },
            // ],
            
            relationType: [
              { required: true, message: '请选课程关联方式', trigger: 'change' },
                { validator: validateName, trigger: 'change' }
            ],
            computeType: [
              { required: true, message: '请选择计算方式', trigger: 'change' },
               
            ]
          },
          tableData: [],
          tableList: [
            {label:'代码', prop:'code'},
            {label:'名称', prop:'name'},
            {label:'描述', prop:'remark'},
            {label:'状态', prop:'status', width:120},
            {label:'创建人', prop:'createUser'},
            {label:'创建日期', prop:'createTime', width:120}
          ],
          relationList:[
            {label:'按关联课程进行测评', value:0},
            // {label:'按学年必修课进行测评', value:1}
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
              query:false,
              add:false,
              edit:false,
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
                        if (item.code=="add_xueniancepingxiangmu") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_xueniancepingxiangmu") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="query_xueniancepingxiangmu") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="delete_xueniancepingxiangmu") {
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="relationcurriculum_xueniancepingxiangmu") {
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
        dialogClose(){
          //关闭弹窗时重置数据
          this.$refs.formDialog.resetFields();
        },
        commonValidate(ref, type, val) { //确定
          this.$refs[ref].validate((bool)=>{
            if(bool){
              this.commonRequire(type,val)
            }
          })
        },
        commonRequire(method,val){
          let option=util.clone(this.formDialog);
    
          
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
              let message = `${this.dialog.status=='add'?'新增':'编辑'}成功！`;
              if(data.code==0){
                if(val=="save"){
                  this.$refs.formDialog.resetFields();
                }else{
                  this.dialog.visible = false;
                }
                this.dialog.visible=false;
                this.getTableData();
              }else{
                type = "error";
                message = data.msg;
              }
              this.$message({
                type:type,
                message:message
              })
          })
        },
        onSearch() {
          this.getTableData()
     
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
        // let itemId = row.id

        //   this.$http.put("_sc:/evaluationItem",{
        //     code: row.code,
        //     id: row.id,
        //     evaluationType: row.evaluationType,
        //     computeType:row.computeType,
        //     relationType:0,
        //     name: row.name,
        //     status: row.status
        //   }).then(() => {
        //       this.formDialog=row;
        //   });
          // this.getTableData();
          this.formDialog = JSON.parse(JSON.stringify(row));
          this.dialog.status='edit';
          this.dialog.visible=true;
        },

        // 编辑
        coursesSt(row) {
         
          let id = row.id
          this.$router.push({
            path:'/achievement_manage/academicyear_courses',
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