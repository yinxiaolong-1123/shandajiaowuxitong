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
				      <el-button type="primary" @click="onSubmit "  v-if="btnPerObj.query">查询</el-button>
			      </el-form-item>
            <el-form-item class="cm-collapse">
              <el-button size="mini" type="primary" @click="addScheme"  v-if="btnPerObj.add">新增</el-button>
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
         :height="tableHeight()"
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
                <template v-else-if="item.prop==='proportionList'">
                  {{ scope.row.itemAndProportion }}
                </template>
                <template v-else>
                    {{scope.row[item.prop]}}
                </template>
            </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" v-if="btnPerObj.edit||btnPerObj.delete"
 width="100">
          <template slot-scope="scope">
          	<el-button type="text" size="small" @click="editItem(scope.row)"  v-if="btnPerObj.edit">编辑</el-button>
          	<el-button type="text" size="small" @click="deleteTabletRow(scope.row)"  v-if="btnPerObj.delete">删除</el-button>
          </template>	
        </el-table-column>
      </el-table>
    </div>
    <el-dialog 
      :title="(dialog.status==='add'?'新增方案':'编辑方案')"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
      @closed="dialogClose">
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog" style="margin-right: 10px;">
  	    <el-form-item label="方案名称" prop="name" :label-width="formLabelWidth">
  	      <el-input v-model="formDialog.name" placeholder="请输入方案名称" clearable style="width:400px"></el-input>
  	    </el-form-item>
  	  
        <div class="cm-table" style="width:450px">
          <span class="cm-tab-name" style="width:58px;padding-right:20px;">项目比例</span>
            <table class="mytab">
              <tr>
                <th>#</th>
                <th>测评项目</th>
                <th>比例</th>
              </tr>
              <tr v-for="lis in proportionItems">
                <td style="width:5%"> 
                  <input type="checkbox" v-model="checkbox[lis.index]" >
                  <!-- {{checkbox[lis.index]}} -->
                </td>
                <td style="width:10%">{{lis.name}}</td>
                <td style="width:20%;margin-top: 10px;">
                    <template style="margin-top: 10px;">
                       <el-input style="margin-top: 10px;" v-model="lis.proportion"  :disabled="!checkbox[lis.index]"
                       ></el-input>
                    </template>
                </td>
              </tr>
          </table>
          <!-- <el-table
            ref="multipleTable"
            :data="proportionItems"
            tooltip-effect="dark"
            border
            style="width: 88%;"
            size="mini"
            
            :header-cell-style="getRowClass"
            @row-click="openDetails"
            @select="handleSelectionChange">
            <el-table-column type="selection" label="全选" width="55"></el-table-column>
            <el-table-column prop="name" label="测评项目" >
            </el-table-column>
             <el-table-column prop="proportion" label="比例" >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.proportion"  :disabled="scope.row.disables"></el-input>
               </template>
            </el-table-column>
          </el-table> -->
        </div>
      </el-form>
  	  <div slot="footer" class="dialog-footer">
  	    <el-button @click="coseledialog()">取 消</el-button>
  	    <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put', 'save')">确 定</el-button>
  	  </div>
	 </el-dialog>
  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='graduation_rogram';
    const REMARK='毕业测评方案';

    export default {
      name: TYPE,
      data() {
          var validateName = (rule, value, callback) => {
            if (value.length>20) {
              callback(new Error('名称长度不能大于20个字符'));
            } else {
              callback();
            }
      };
        return {
          checkbox:[],
          type:REMARK,
          prohibit:1,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          formScheme: {
            scheme: ''
          },
          name: '', //方案名称
          schemeType: 1, //毕业测评方案
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
            schemeType: 1,
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
              { validator: validateName, trigger: 'change' }
            ],
            proportionList: [
              { required: true, message: '请输入项目比例', trigger: 'blur' },
            ]
          },
          tableData: [],
          tableList: [
            {label:'方案名称', prop:'name',width:340},
            {label:'测评项目及比例（%）', prop:'proportionList',},
            {label:'状态', prop:'status', width:60},
            {label:'创建人', prop:'createUser',width:90},
            {label:'创建日期', prop:'createTime', width:90}
          ],
          proportionItems: [], //获取测评项目名称
          evaluationType: 1,
          multipleSelection: [],
          isIndeterminate: true,
          btnPerObj:{
              add:false,
              edit:false,
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
       
      },
      methods: {
        tableHeight(){
          return document.body.clientHeight - 270
        },
          //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                   
                    data.data.map(item => {
                        if (item.code=="query_graduationEvaluationScheme") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="add_graduationEvaluationScheme") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_graduationEvaluationScheme") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="delete_graduationEvaluationScheme") {
                            self.btnPerObj.delete=true;
                        }
                    });
                }).catch(()=>{
                })
            },
        getTableData() {
          this.tableLoading = true;
          this.$http.post('_sc:/evaluationScheme/list',{
            name:  this.formScheme.scheme,
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
                    data.data[i].index = i
                     data.data[i].disables = true
                     data.data[i].proportion = ''
                  }
                  this.proportionItems = data.data;
             
              }else{
                  this.$message.error(data.msg);
              }
            })
        },
        changeVal(val) {
        //  this.$message({
        //       message: '请输入0-100之间的正整数',
        //       type: 'warning'
        //     });
         this.formDialog.proportionList.push((val/100));
          
        },
        addScheme() {
             this.dialog.status = 'add';
          for(let i=0;i<this.proportionItems.length;i++){
            this.proportionItems[i].proportion= ''
            this.checkbox[i]= false
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
            
            this.proportionItems[i].proportion=''
            this.checkbox[i]=false
            
          }
        },
        commonValidate(formDialog, type, val) { //确定
       
        for(let i=0;i<this.proportionItems.length;i++){
           
            
            if(this.proportionItems[i].proportion=='' && this.checkbox[i]){
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
                  if(this.checkbox[i]==true){
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
          }
          let query = {
            itemIdList:arr,
            name:this.formDialog.name,
            proportionList:arr2,
            schemeType:1,
            // status:self.prohibit,
            status:1
          }
          if(method=="put"){
           query.id = this.formDialog.id;  
          
          }
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
            
            this.proportionItems[i].proportion=''
            this.checkbox[i]=false
            
          }
        },

     
      
      editItem(row) {
        let self = this;
        this.formDialog.name = row.name
       this.dialog.visible = true;
        let b = []
        let tempTableData = this.proportionItems;
        
         let tempArr = row.itemAndProportion.split('、');
         
        
          for( let i=0;i<tempArr.length; i++){
            for(let j=0; j<tempTableData.length; j++){
              if(tempTableData[j].name == tempArr[i].split('（')[0]){
                  tempTableData[j].proportion = tempArr[i].split('（')[1].split('）')[0]
                  b.push(this.proportionItems[j]);
                  this.proportionItems[j].disables = false
                   this.checkbox[j]=true
              }
            }
          }
          this.proportionItems = tempTableData;

          this.$http.put("_sc:/evaluationScheme",{
            id: row.id,
            name: row.name,
            itemIdList: row.itemIdList,
            schemeType: 1,
            proportionList: row.proportionList,
            status: row.status
          }).then(() => { 
              this.formDialog.id = row.id
              this.formDialog.name = row.name
              this.formDialog.itemIdList = row.itemIdList;
              this.formDialog.proportionList = row.proportionList;
              this.formDialog.schemeType = 1;
              this.formDialog.status = row.status; 
           
          });
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
</style>