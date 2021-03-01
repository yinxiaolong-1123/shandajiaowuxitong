<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{path: item.path}">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-tabs v-model="activeName" @tab-click="getDataList">
          <el-tab-pane label="已关联课程" name="relation">
              <el-form size="mini" :inline="true" :model="param">
                  <div class="fold">
                      <div class="formCourse">
                          <el-form-item label="测评项目" >
                              <el-select v-model="param.itemId" clearable :disabled="jrisdiction" placeholder="请选择测评项目">
                              <el-option label="全部" value=""></el-option>
                              <el-option
                              v-for="item in evaluationList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                          </el-form-item>

                          <el-form-item label="课程" >
                              <el-select v-model="param.courseId" filterable clearable placeholder="请选择课程">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                  v-for="item in tableData2"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                              </el-select>
                          </el-form-item>

                          <el-form-item>
                                <el-button type="primary" size="mini" @click="onSearch"  v-if="btnPerObj.query">查询</el-button>
                          </el-form-item>
                      </div>
                  </div>
              </el-form>
              <!-- <el-upload
                size="mini"
                style="display: inline-block;"
                class="upload-demo"
                :headers="headers"
                action="/score/management/evalitemCourseRel/importEvalitemCourseRel"
                :show-file-list="false"
                :before-upload="onBefore"
                :on-success="onSuccess">
                <el-button size="mini" type="primary"  v-if="btnPerObj.batchimport">批量导入</el-button>
              </el-upload>
              &nbsp;
              <template>
                <a style="color: #606266;" class="el-button el-button--default el-button--mini is-plain"  href="../../../template/evaluationItemcourseRel-template.xls" download='毕业测评关联课程模板'>下载模版</a>
              </template> -->
              <el-button size="mini" plain @click="deleteAllItem" >批量删除</el-button>
          </el-tab-pane>
          <el-tab-pane label="未关联课程" name="unrelated">
              <el-form size="mini" :inline="true" :model="param">
                    <div class="fold">
                      <div class="formCourse">

                        <el-form-item label="课程性质" >
                                <el-select v-model="param.code" clearable  placeholder="请选择测评项目">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                v-for="item in codeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                              </el-option>
                        </el-select>
                        </el-form-item>
                        
                        <el-form-item label="课程类别">
                                <el-select v-model="param.categoryId" clearable  placeholder="请选择测评项目">
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                        </el-select>
                        </el-form-item>

                        <el-form-item label="课程">
                            <el-select v-model="param.courseId" filterable clearable placeholder="请选择课程">
                              <el-option label="全部" value=""></el-option>
                              <el-option
                                v-for="item in tableData2"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                              <el-button type="primary" size="mini" @click="onSearch"  v-if="btnPerObj.query">查询</el-button>
                        </el-form-item>
                      </div>
                    </div>
                </el-form>
                <el-button size="mini" type="primary" @click="batchCorrelation()"  v-if="true">批量关联</el-button>
          </el-tab-pane>
      </el-tabs>
    
    </div>
    
    <div class="cm-table">
      <el-table 
       ref="multipleTable"
        :data="tableData" 
        border 
        style="width: 100%; margin-top: 10px" 
        size="mini" 
        :header-cell-style="getRowClass"
     
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="全选" width="60"></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>


         <el-table-column fixed="right" label="操作"  v-if="btnPerObj.delete||btnPerObj.edit"  width="96">
          <template slot-scope="scope">
          	<el-button type="text" size="small" @click="editItem(scope.row)"  v-if="param.associationFlag" >关联</el-button>
          	<el-button type="text" style="color: red;" size="small" @click="deleteTabletRow(scope.row)"  v-else>删除</el-button>
          </template>	
        </el-table-column>
      </el-table>
    </div>

    <el-dialog 
      :title="type"
      :visible.sync="dialog.visible"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      custom-class="cm-dialog-small"
      @closed="dialogClose">
  	  <el-form :model="formDialog" :rules="rules" ref="formDialog">
  	    
  	    <el-form-item label="测评项目" prop="itemId" :label-width="formLabelWidth">
  	      <el-select v-model="formDialog.itemId" clearable :disabled="jrisdiction"  placeholder="请选择测评项目">
            <el-option
              v-for="item in evaluationList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
		      </el-select>
  	    </el-form-item>
  	  </el-form>
  	  <div slot="footer" class="dialog-footer">
  	    <el-button @click="dialogClose">取 消</el-button>
  	    <el-button type="primary" @click="commonValidate('formDialog','1')">确 定</el-button>
  	  </div>
	 </el-dialog>

    <div class="block_page">
      <el-pagination
        background
        class="pull-right"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
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
var token =  localStorage.getItem('token') // 要保证取到
    import util from '@/util'
    const TYPE='graduation_courses';
    const REMARK='关联课程';

    export default {
      name: TYPE,
      data() {
        return {
          activeName:'relation',
          categoryList:[],
          codeList:[],
          tableData2:[],
             related:true,//未关联的就把删除按钮去掉
          jrisdiction:false,
          headers:{
            Access_Token:localStorage.getItem('token'),
            Authorization:localStorage.getItem('token')
          },
          type:REMARK,
          breadcrumb: [
            // {label: "成绩管理"},
            {label: "毕业测评项目", path: '/achievement_manage/graduation_assessment'},
            {label: REMARK},
          ],
          evaluationList: [], //测评项目列表
          courseList: [], //课程列表
          param: { //查询
            courseId: '',
            itemId: '',
            evaluationType: 1,
            associationFlag: false
          },
          dialog:{
            status:'add',
            visible:false,
          },
          formLabelWidth: '80px',
          formDialog: {   //新增弹框
            courseId: '',
            evaluationType: 1,
            itemId: '',
            oldCourseId: '',
            oldItemId: ''
          },
          rules: {
           itemId: [
                { required: true, message: '请选择项目', trigger: 'change' }
                   
            ]
          },
          tableData: [],
          tableList: [
            {label:'课程代码', prop:'courseCode'},
            {label:'课程名称', prop:'courseName'},
            {label:'测评项目', prop:'itemName'},
            {label:'创建人', prop:'createUser'},
            {label:'创建日期', prop:'createTime', width:120}
          ],
	        pageNo: 1,
          pageSize: 20,
          totalCount:0,
          currentPage: 1,
          checkedList: [],
           btnPerObj:{
               add:true,
               query:true,
               edit:true,
               delete:true,
               batchimport:true,
               batchdelete:true,
               batchdelete:true,
               dowmload:true,
           }
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
        //  
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
      },
      created(){
         let itemid = this.$route.query.id
        this.getTableData(itemid);
        this.getCourseList();
         this.getCategory() //获取课程类别
        this.getEvaluationList();
        this.token = localStorage.getItem('token')
        // this.$route.query.id
        
      },
      methods: {
           getDataList(){
            if(this.activeName == 'relation'){
              this.checkedList = []
              this.param.associationFlag = false
              this.getTableData(this.itemid)
            }else{
              this.checkedList = []
              this.param.associationFlag = true
              this.getTableData(this.itemid)
            }
          },
          //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="add_graduationEvalitemCourseRel") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_graduationEvalitemCourseRel") {
                            self.btnPerObj.edit=true;
                        }
                    
                        if (item.code=="query_graduationEvalitemCourseRel") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="delete_graduationEvalitemCourseRel") {
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="batchimport_graduationEvalitemCourseRel") {
                            self.btnPerObj.batchimport=true;
                        }
                        if (item.code=="batchdelete_graduationEvalitemCourseRel") {
                            self.btnPerObj.batchdelete=true;
                        }
                        if (item.code=="download_graduationEvalitemCourseRel") {
                            self.btnPerObj.download=true;
                        }
                    });
                }).catch(()=>{
                })
            },
        onBefore(file){
          
          let extension = file.name.split('.')[1]==='xls';
          let size = file.size / 1204 / 1204 < 20;
          if(!extension){
              this.$message.warning("上传的文件格式是 xls！")
          }
          if(!size){
              this.$message.warning("上传的文件大小不能超过20M！")
          }
          return size ;
        },
        onSuccess(res, file){
          
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
        addRelatedCourses() {
          this.dialog.status = 'add';
          this.dialog.visible = true;
        },
        dialogClose(){
          //关闭弹窗时重置数据
           this.dialog.visible = false
          this.checkedList = []
          this.$refs.multipleTable.clearSelection();
          this.$refs.formDialog.resetFields();
        },
           commonValidate(ref) { //确定
          this.$refs.formDialog.validate((bool)=>{
            if(bool){
              this.commonRequire()
            }
          })
        },
        commonRequire(){
          let arr =[]
          for(let  i=0;i<this.checkedList.length;i++){
           arr.push(this.checkedList[i].courseId)
         }
          let query = {
            courseIds: arr,
            evaluationType: 1,
            itemId: this.formDialog.itemId,
          }
          this.$http.post('_sc:/evalitemCourseRel',query).then(res=>{
              if(res.code==0){
                   this.$message({
                    message: '关联成功',
                    type: 'success'
                  });
              }else{
                  this.$message.error(res.msg);
              }
              this.onSearch()
              this.dialog.visible = false
          })
        },
        commonRequire2222(){//不用了
          let option=util.clone(this.formDialog);
            option.evaluationType = 1
          if(method=="post"){
            option.id = this.rowId;  
          }
        if(method=="put"){
            option.oldItemId =  option.itemId
          }
          this.$http({
              method:method,
              url:"_sc:/evalitemCourseRel",
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
          this.pageNo = 1
          if(this.param.associationFlag){
            this.related = false
          }else{
             this.related = true
          }
          this.getTableData();
          this.getCourseList();
          this.getEvaluationList();
        },
        deleteTabletRow(row){
        
          this.$confirm(`此操作将永久删除 “${row.courseName}” 所维护的信息, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.$http.post("_sc:/evalitemCourseRel/delete", {  //通过data接收
                courseId: row.courseId,
                itemId: row.itemId,
                evaluationType: 0,
                oldCourseId: 0,
                oldItemId: 0
              }).then(data=>{
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
        deleteAllItem(){
        
          if(this.checkedList.length===0){
              return  this.$message({
                  type:'warning',
                  message:'尚未选中任何数据',
                  showClose:true
              });
          }
          this.$confirm(`此操作将永久删除已选中的数据,是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            let list = [];
            for(let i=0;i<this.checkedList.length;i++){
              let query = {}
                query.courseId = this.checkedList[i].courseId
                query.itemId = this.checkedList[i].itemId
                list.push(query)
            }
              this.$http({
                method:'post',
                url:"_sc:/evalitemCourseRel/deleteBatch",
                data:list
              }).then(data=>{
                  let message='删除成功!';
                  let type='success';
                  if(Number(data.code)===0){
                      this.getTableData();
                  }else{
                    type='error';
                    message = data.msg;
                  }
                  this.$message({
                    type: type,
                    message: message
                  });
                });
          }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
          });
        },
        //编辑
        myedit(row){
            this.dialog.status = 'add';
            this.dialog.visible = true;
            this.formDialog.courseId=row.courseId
            this.formDialog.itemId=row.itemId
        },
         batchCorrelation(){ //多个编辑 关联
            this.dialog.status = 'edit';
            this.dialog.visible = true
           
        },
        editItem(row) {
            this.$refs.multipleTable.clearSelection();
            this.checkedList = []
             let courseobj = {}
              courseobj.courseId = row.courseId
            this.checkedList.push(courseobj) 
          
            this.formDialog.courseId = row.courseId
            this.formDialog.itemId =  row.itemId,
             this.formDialog.oldCourseId = row.courseId
            this.formDialog.oldItemId = this.formDialog.itemId 
             this.dialog.status = 'edit';
             this.dialog.visible = true;
             
             if(this.param.associationFlag==false){
               
                this.jrisdiction = true
             }else{
               this.jrisdiction = false
             }
     
          
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
         handleSelectionChange(selection) {
        
           this.checkedList = []
          
          for(let i=0;i<selection.length;i++){
              let courseobj = {}
            courseobj.courseId = selection[i].courseId
            if(selection[0].itemId==null){
              delete   courseobj.itemId
            }else{
              courseobj.itemId = selection[i].itemId
            }
            
              this.checkedList.push(courseobj)
          }
     
        },
          getTableData(itemid) {
          this.tableData=[];
          if(itemid!=''&&itemid!=null&&itemid!=undefined){
         
            this.param.itemId = itemid
            this.formDialog.itemId = itemid
            this.jrisdiction = true

          }
           let  query={
                param:{
                  categoryId:this.param.categoryId,
                  courseNatureCode:this.param.code,
                  courseId:this.param.courseId,
                  itemId:this.param.itemId,
                  evaluationType:1,
                  associationFlag:this.param.associationFlag
                  
                },
                  pageNo:this.pageNo,
                  pageSize:this.pageSize
           }

          this.$http.post("_sc:/evalitemCourseRel/list",query
          ).then(datas => {
              if(datas.code===0) {
                let data = datas.data;
                this.pageNo = data.pageNo;  //当前第几页
                this.pageSize = data.pageSize; //每页显示多少条
                this.totalCount = data.totalCount; //当前第总条数
                this.tableData = data.result;
           
                this.tableLoading = false;
                this.tableData.forEach(d => {
                  d.oldCourseId = d.courseId;
                  d.oldItemId = d.itemId;
                })
        
              }
          }).catch(()=>{
              this.tableData=[];
              this.tableLoading=false;
          })
        },
        getCourseList(){
         this.$http.get("_op:/course/getAllCourse").then(res=>{
            this.tableData2  =res.data
          })
        },
        getCategory(){// 查询课程类别
          let type = 'course-category' 
          this.$http.get('_op:/dicts/combox/'+type).then(res=>{
            this.categoryList = res.data
          })
            let type2 = 'course-nature'
            this.$http.get('_op:/dicts/combox/'+type2).then(res=>{
            this.codeList = res.data
          })
        },
        getEvaluationList(){
          this.$http.get("_sc:evaluationItem/combox/"+this.param.evaluationType)
            .then(data => {
                if(data.code==0){
                    this.evaluationList = data.data;
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        handleSizeChange(size) {
         
          this.pageNo = 1;
          this.pageSize = size;
          this.getTableData();
        },
        handleCurrentChange(current) {
       
          this.pageNo=current;
          this.getTableData();
        }
      }
    }	
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 3px 0;
}
.cm-table{
  margin-bottom: 5px;
}
.pull-right{
  text-align: right;
  margin-right: 10px;
}
.formCourse {
  height: 29px;
  padding: 0 0 10px 0;
}
.cm-btn-con{
  padding-bottom: 0;
}
.cm-fold .el-form-item {
    margin: 0px 20px 0 0;
}
.btn{
  margin-top:0;
}
</style>