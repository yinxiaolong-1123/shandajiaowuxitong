<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true" :model="formScheme">
         <div class="fold">
         	<div class="formScheme">
         	  <el-form-item label="方案名称">
				      <el-input v-model="formScheme.scheme" placeholder="请输入方案"></el-input>
			      </el-form-item>
			      <el-form-item>
				      <el-button type="primary" @click="onSubmit"  v-if="btnPerObj.query">查询</el-button>
			      </el-form-item>
            <el-form-item class="cm-collapse">
              <el-button size="mini" type="primary" @click="addScheme"  v-if="btnPerObj.query">新增</el-button>
            </el-form-item>
         	</div>
         </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table 
         :data="tableData" 
         border 
         style="width: 100%; margin-top: 20px" 
         size="mini" 
         :header-cell-style="getRowClass"
         :height="tableHeight()"
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
               <template v-else-if="item.prop==='proportionList'">
                  {{ scope.row.itemAndProportion }}
                </template>
                <template v-else>
                    {{scope.row[item.prop]}}
                </template>
            </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope"
             v-if="btnPerObj.query||btnPerObj.query"
>
          	<el-button type="text" size="small" @click="editItem(scope.row)"  v-if="btnPerObj.query">编辑</el-button>
          	<el-button type="text" size="small" @click="deleteTabletRow(scope.row)"  v-if="btnPerObj.query">删除</el-button>
          </template>	
        </el-table-column>
      </el-table>
    </div>
    <el-dialog 
      :title="(dialog.status==='add'?'新增方案':'编辑方案')"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogClose">
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog" style="padding:0 20px; font-size:14px">
  	    <el-form-item label="方案名称" prop="name" :label-width="formLabelWidth">
  	      <el-input  style="width:360px; padding-left:20px" v-model="formDialog.name" placeholder="请输入方案名称" clearable></el-input>
  	    </el-form-item>
  	  
        <div class="cm-table">
          <span class="cm-tab-name"   >项目比例</span>
          <table class="mytab">
              <tr>
                <th class="fontStyle">#</th>
                <th  class="fontStyle">测评项目</th>
                <th  class="fontStyle">比例</th>
              </tr>
              <tr v-for="(lis,index) in proportionItems" :key="index">
                <td style="width:5%"> 
                  <!-- <input type="checkbox" v-model="checkbox[lis.index]" > -->
                  <input type="checkbox" v-model="lis.checked">
                </td>
                <td style="width:10%">{{lis.name}}</td>
                <td style="width:20%;margin-top: 10px;">
                    <template style="margin-top: 10px;">
                       <!-- <el-input style="margin-top: 10px;" v-model="lis.proportion"  :disabled="!checkbox[lis.index]"></el-input> -->
                       <el-input style="margin-top: 10px;" v-model="lis.proportion"  :disabled="!lis.checked"></el-input>
                    </template>
                </td>
              </tr>
          </table>
        </div>
      </el-form>
  	  <div slot="footer" class="dialog-footer">
  	    <el-button @click="coseledialog()">取 消</el-button><!--:disabled="true"  :ref="'input'+item.id"-->
  	    <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put', 'save')">确 定</el-button>
  	  </div>
	 </el-dialog>
  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='academicyear_rogram';
    const REMARK='学年测评方案';

    export default {
      name: TYPE,
      data() {
         var validateName = (rule, value, callback) => {
        if (value.length>20) {
          callback(new Error('方案名称不得大于20个字符'));
        } else {
          
          callback();
        }
      };
        return {
          checkbox:[],
          prohibit:1,
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          formScheme: {
            scheme: ''
          },
          name: '', //方案名称
          schemeType: 0, //学年测评方案
          dialog:{
            status:'add',
            visible:false,
          },
          formLabelWidth: '80px',
          formDialog: {
            id: '',
            itemIdList: [],
            name: '',
            proportionList: [],
            schemeType: 0,
            status: 1, //状态：0-禁用，1-启用
          },
          evaluationData: [], //弹窗测评名称
          evaluationList: [
            {label:'测评项目', prop:'itemIdList'},
            {label:'比例(%)', prop:'proportionList'}
          ],
          rules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' },
               { validator: validateName, trigger: ['change', 'blur'] }
            ],
            proportionList: [
              { required: true, message: '请输入项目比例', trigger: 'blur' },
            ]
          },
          tableData: [],
          tableList: [
            {label:'方案名称', prop:'name'},
            {label:'测评项目及比例（%）', prop:'proportionList'},
            {label:'状态', prop:'status', width:150},
            {label:'创建人', prop:'createUser', width:150},
            {label:'创建日期', prop:'createTime', width:150}
          ],
          proportionItems: [], //获取测评项目名称
          evaluationType: 0,
          multipleSelection: [],
          isIndeterminate: true,
          btnPerObj:{
              add:false,
              query:false,
              edit:false,
              delete:false,
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
        this.getProportionList();
      },
      filters:{
        getTime(time){
          return util.getTime(time);
        }
      },
      computed: {
        proportionItem() {
          let rseult = [];
          this.tableData.forEach(items => {
            items.itemIdList.map((list,index,arr) => {
              if(arr.length === items.proportionList.length) {
                this.proportionItems.map((item,index) => {
                  if(item.id == list) {
                    rseult.push(`${item.name}(${items.proportionList[index]*100}%)`);
                  }
                })
              }
            })
          })
          if(rseult.length>1) {
            return rseult.join('、');
          }else {
            return rseult.join();
          }
          
        },
      },
      methods: {
        tableHeight(){
          return document.body.clientHeight - 210
        },
         //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                 
                    data.data.map(item => {
                        if (item.code=="add_schoolYearEvaluationScheme") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_schoolYearEvaluationScheme") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="query_schoolYearEvaluationScheme") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="delete_schoolYearEvaluationScheme") {
                            self.btnPerObj.delete=true;
                        }
                    });
                }).catch(()=>{
                })
            },
       
        getTableData() {
          this.tableLoading = true;
          this.$http.post('_sc:/evaluationScheme/list',{
            name: this.formScheme.scheme,
            schemeType: this.schemeType,
          }).then(datas => {
            
              if(datas.code===0) {
                let data = datas.data;
                this.tableData=data;
                this.tableLoading=false;
              }
          }).catch(()=>{
              this.tableData=[];
              this.tableLoading=false;
          })
        },
        getProportionList() {
          this.$http.get("_sc:evaluationItem/combox/"+this.evaluationType)
            .then(data => {
              if(data.code==0){
                for(let i=0;i<data.data.length;i++){
                    data.data[i].index = i;
                     data.data[i].disables = true;
                     data.data[i].proportion = '';
                     data.data[i].checked = false;
                  }
                  this.proportionItems = data.data;
                 
              }else{
                  this.$message.error(data.msg);
              }
            })
        },
        changeVal(val) {
          // var reg = /^(?:0|[1-9][0-9]?|100)$/;
          // if(!reg.test(val)) {
          //   this.$message({
          //     message: '请输入0-100之间的正整数',
          //     type: 'warning'
          //   });
           
          // }
          this.formDialog.proportionList.push((val/100));
        },
        addScheme() {
          this.dialog.status = 'add';
          for(let i=0;i<this.proportionItems.length;i++){
            this.proportionItems[i].proportion= '';
            this.proportionItems[i].checked = false;
            // this.checkbox[i]= false
          }
          this.dialog.visible = true;
          this.$nextTick(()=> {
            // this.$refs.multipleTable.clearSelection();
          })
          
        },
        dialogClose(){
          //关闭弹窗时重置数据
         this.dialog.visible = false
          this.formDialog.name = ''
          for(let i=0;i<this.proportionItems.length;i++){
            
            this.proportionItems[i].proportion='';
            this.proportionItems[i].checked = false;
            // this.checkbox[i]=false
            
          }
        },
        commonValidate(formDialog, type, val) { //确定
       
          for(let i=0;i<this.proportionItems.length;i++){
            if(this.proportionItems[i].proportion=='' && this.proportionItems[i].checked){
              
                this.$message({
                  type:'error',
                  message:'值不能为0'
                })
                return false;
            }
          }
          this.$refs.formDialog.validate((bool)=>{
                if(bool){
               
                  this.commonRequire(type,val)
                }
              })
        },
         commonRequire(method,val){

           let arr = []
           let arr2 = []
        
          for(let i=0;i<this.proportionItems.length;i++){
                if(this.proportionItems[i].proportion!=''){
                    if(this.proportionItems[i].checked==true){
                        arr.push(this.proportionItems[i].id)
                        arr2.push(this.proportionItems[i].proportion/100)
                    }
                   
                }
          }
      
        for(let i=0;i<arr2.length;i++){
            if(arr2[i]<0){
                this.$message({
                  type:'error',
                  message:'值不能小于0'
                })
                return false;
            }
            if(isNaN(arr2[i])){
              this.$message({
                  type:'error',
                  message:'填写错误！'
                })
            }
          }
      
          let query = {
            itemIdList:arr,
            name:this.formDialog.name,
            proportionList:arr2,
            schemeType:0,
            status:this.prohibit
          }
          if(method=="put"){
           query.id = this.formDialog.id;  
          
          }

     
;
            this.$http({
              method:method,
              url:'_sc:/evaluationScheme',
              data:{
                  ...query
              }
          },query).then(data=>{
                   
                let type = "success";
                let message = `${this.dialog.status=='add'?'新增':'编辑'}成功！`;
                if(data.code==0){
                  
                  if(val=="save"){
                    this.$refs.formDialog.resetFields();
                  }else{
                    this.dialog.visible = false;
                  }
                  // this.$refs.multipleTable.clearSelection();
                  for(let i=0;i<this.proportionItems.length;i++){
                    this.proportionItems[i].proportion= ''
                    this.proportionItems[i].disables= true
                  }
                  this.dialog.visible=false;
                  this.getTableData();
                    
                }else{
                  type = "error";
                  message = data.msg;
                }
                this.formDialog.itemIdList.length = 0
                 this.formDialog.proportionList.length = 0
               this.$message({
                  type:type,
                  message:message
                })
            })
        },
        onSubmit() {
          this.getTableData()
        },
         coseledialog(){
           
          this.dialog.visible = false
          this.formDialog.name = ''
          for(let i=0;i<this.proportionItems.length;i++){
            
            this.proportionItems[i].proportion='';
            this.proportionItems[i].checked = false;
            // this.checkbox[i]=false
            
          }
        },
    
        editItem(row) {
    
        let self = this;
        this.formDialog.name = row.name
        this.dialog.visible = true;
        // let b = []
        let tempTableData = this.proportionItems;
        
         let tempArr = row.itemAndProportion.split('、');
          for( let i=0;i<tempArr.length; i++){
            for(let j=0; j<tempTableData.length; j++){
              
              if(tempTableData[j].name == tempArr[i].split('（')[0]){
                  tempTableData[j].proportion = tempArr[i].split('（')[1].split('）')[0];
                  tempTableData[j].checked = true;
              }
            }
          }
          this.proportionItems = tempTableData;
          
     
          // this.$http.put("_sc:/evaluationScheme",{
          //   id: row.id,
          //   name: row.name,
          //   itemIdList: row.itemIdList,
          //   schemeType:0,
          //   proportionList: row.proportionList,
          //   status: row.status
          // }).then(() => { 
          //     this.formDialog.id = row.id
          //     this.formDialog.name = row.name
          //     this.formDialog.itemIdList = row.itemIdList;
          //     this.formDialog.proportionList = row.proportionList;
          //     this.formDialog.schemeType = 1;
          //     this.formDialog.status = row.status;
          // });
          this.formDialog.id = row.id
              this.formDialog.name = row.name
              this.formDialog.itemIdList = row.itemIdList;
              this.formDialog.proportionList = row.proportionList;
              this.formDialog.schemeType = 1;
              this.formDialog.status = row.status;
          this.getTableData();
          this.dialog.status = 'edit';
          
        },
        deleteTabletRow(row){
          this.$confirm(`此操作将永久删除 “${row.name}” 所维护的信息, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.$http.delete("_sc:/evaluationScheme/"+row.id)
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
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
     
        openDetails(row) {
        
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
.cm-tab-name{
  width: 12%; 
  float: left; 
  position: relative; 
  left:-10px;
}
.cm-table{
  padding-right:0;
}
.mytab{
      width: 75%;
      // font-size: 14px;
      .fontStyle{
        font-size: 14px;

      }
  tr{
    font-size: 14px;
    text-align: center;
    // border: solid 1px #999
  }
}
</style>