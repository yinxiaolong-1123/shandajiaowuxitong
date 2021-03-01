<template>
    <section class="cm-container">
        <!-- 考试类型关联课程 -->
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="考试类型">
                            <el-select 
                                v-model="formInline.examTypeId"
                                @change="getCourseList(formInline.examTypeId)"
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                      
                         <el-form-item label="课程">
                             
                            <el-select 
                                :disabled="!formInline.examTypeId"
                                v-model="formInline.courseId" 
                                filterable clearable placeholder="请选择课程">
                                <el-option label="全部" value=""></el-option>
                               
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item >
                            <el-checkbox-group   v-model="formInline.associationFlag">
                            <el-checkbox label="未关联课程" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                    <div class="btn" >
                        <el-button type="primary" size="mini" @click="onSearch()" v-if="btnPerObj.query">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask" v-if="btnPerObj.add">新增</el-button>
              <el-upload
                size="mini"
                style="display: inline-block;margin-left: 10px; margin-left: 5px;width:89px;height:25px;"
                class="upload-demo"
                action="/score/management/examTypeCourseRel/importExamTypeCourseRel"
                :headers="headers"
                :show-file-list="false"
                :before-upload="onBefore"
                :on-success="onSuccess">
                <el-button size="mini" type="primary"  v-if=" btnPerObj.batchimport">批量导入</el-button>
                </el-upload>
           
                  <el-button size="mini" plain>
                        <a style="color: #606266;" href="../../../template/examination_type_courses.xlsx" download='考试类型关联'  v-if=" btnPerObj.batchdownload">下载模版</a>
                    </el-button>
        </div>
        <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="courseName" label="课程名称" width="200"></el-table-column> courseName
                <el-table-column prop="examTypeName" label="考试类型" width="200"></el-table-column>
                <el-table-column prop="createUser" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建日期"></el-table-column>
                <el-table-column
                  v-if="btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editTask(scope.row)"  v-if="btnPerObj.edit" >编辑</el-button>
                        <el-button type="text" size="small" @click="deleteDetailData(scope.row)" style="color: red;"  v-if="btnPerObj.delete" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增及编辑 -->
        <el-dialog
            width="400px"
            :title="dialog.status==='add'?'新增考试类型关联课程':'编辑考试类型关联课程'"
            :visible.sync="dialog.visible"
            :modal-append-to-body="false"
            @closed="addDialogClose">
                <el-form ref="addForm" :rules="rules" class="boxStyle" :model="addForm">
                    <el-form-item label="考试类型" prop="examTypeId" class="flex-form">
                        <el-select v-model="addForm.examTypeId" 
                            placeholder="请选择教学模式" 
                            filterable
                            style="width: 100%;">
                            <el-option v-for="list in options1" :key="list.id" :label="list.name" :value="list.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程" prop="courseId" class="flex-form">
                        <!-- <el-input v-model="addForm.courseId"  ></el-input> -->
                        <el-select v-model="addForm.courseId" 
                             filterable
                             :disabled="dialog.status!=='add'"
                            placeholder="请选择教学模式" 
                            style="width: 100%;">
                            <el-option v-for="list in courseList2" :key="list.id" :label="list.name" :value="list.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import util from '@/util'
    const TYPE='class-management';
    const REMARK='上课班管理';

    import {mapState} from 'vuex'


    export default {
        data(){
            return {
                newSize:[],
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "考试类型关联课程"},
                ],
                dialog:{
                    status:'add',
                    remark:false,
                    visible:false
                },
                options1:[],
                formInline: {
                    examTypeId:"",//考试类型ID
                    courseId: "",//课程ID
                    associationFlag:false,//是否关联课程  默认FALSE
                    type:"EXAM_TYPE"
                },
                addForm:{
                    examTypeId:"",//考试类型
                    courseId:"",//课程
                    id:"",
                    newCourseId:"",
                    editId:'',
                },
              
                rules:{
                    examTypeId: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
                    courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
                },
                tableData:[],//表格数据
              
                addColumn:[  
                    { id: ''} 
                ],
                tableLoading:false,
                myDate:new Date(),
                courseList:[],
                courseList2:[],
                formYear:"",
                fallYear:"",
                semesterNum:"",
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                tableHandle:{
                    status:"",
                    dest:"",
                    url:""
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                CourseClass: '',
                userId:util.getStorage('loginId'),
                userName:util.getStorage('loginName'),
                newStatus:"",
                
                btnPerObj:{//按钮权限
                  query:false,
                  add:false,
                  batchdownload:false,
                  batchimport:false,
                  edit:false,
                  delete:false
                }
            }
        },
        created(){
            this.getTermData();//考试类型下拉列表
            this.getExaminationList();//获取列表
        },
        mounted(){ 
             
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        filters:{},
        watch:{
            ['formInline.associationFlag'](val){
             
                this.newStatus=val;
                if (val==true){
                      this.btnPerObj.delete=false;
                      this.formInline.examTypeId="";
                      this.formInline.courseId="";
                }
                if (val==false){
                      this.btnPerObj.delete=true;
                }
              
            }
        },
        methods:{
            //获取按钮权限  
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="add_kaoshileixingguanliankecheng") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="delete_kaoshileixingguanliankecheng") {
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="edit_kaoshileixingguanliankecheng") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="query_kaoshileixingguanliankecheng") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="download_kaoshileixingguanliankecheng") {
                            self.btnPerObj.batchdownload=true;
                        }
                        if (item.code=="batch_import_kaoshileixingguanliankecheng") {
                            self.btnPerObj.batchimport=true;
                        }
	            	
                    });
                }).catch(()=>{
                })
            },
             //考试类型关联课程   获取列表
            getExaminationList(){
               
               this.tableLoading=true;
               let params={
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    
                    param:{
                        examTypeId:this.formInline.examTypeId,//考试类型ID
                        associationFlag:this.formInline.associationFlag,//是否关联课程  默认FALSE
                        courseId:this.formInline.courseId
                    }
               }
          
            //  当勾选未关联课程，  搜索数据课程，考试类型为空
               if (this.formInline.associationFlag==true){
                   params.param.examTypeId=""
                   params.param.courseId=""
                  
               }else{
                    params.param.examTypeId=this.formInline.examTypeId;
                   params.param.courseId=this.formInline.courseId;

               }
           
               this.$http.post("_sc:/examTypeCourseRel/list",params).then(data=>{
                  
                    this.tableLoading=false;
                 
                    this.tableData=data.data.result;
                  
                    this.totalCount=data.data.totalCount;
                }).catch(()=>{
                      this.tableLoading=true;
                })
            },
            // 查询
            onSearch(){
                this.pageNo=1;
                this.getExaminationList();//获取列表
            },
           // 考试类型下拉列表获取
            getTermData(){
                let query="EXAM_TYPE";
                this.$http.get('_sc:/scoreSetting/combox/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data;
                    }else{
                       this.$message.error(data.data);
                    }
                })
            },
            // 展开合并
            collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            },
            // 显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getExaminationList();//获取列表
            },
            // 翻页
            currentChange(current){
                this.pageNo=current;
                this.getExaminationList();//获取列表
            },
          // 课程下拉数据获取   搜索课程根据考试类型关联   
            getCourseList(id){
               
                if(id){
                this.$http.get("_sc:/examTypeCourseRel/stuScoreCourseRel/"+id)
                .then(data=>{
                    if(data.code==0){
                        this.courseList = data.data;
                      
                        // this.$message.error(data.data);
                    }else{
                        this.$message.error(data.data);
                       
                    }
                })
                }
            },
             // 弹框里边课程下拉数据获取
            getdalongCourseList(){
                this.tableLoading=true;
               this.$http.get("_op:/course/combox"
                ).then(data=>{
                    
                    this.tableLoading=false;
                    this.courseList2=data.data;
                 
                    // this.totalCount=data.data.totalCount;
                }).catch(()=>{
                      this.tableLoading=true;
                })
            },
             // 新增验证
            submitForm(addForm){
                let self = this
                self.$refs.addForm.validate((valid) => {
                    
                if (valid) {
                    self.commonRequire();
                } else {
                    return ;
                }
            });
            },


            
          // 新增提交
            commonRequire(){
                if(this.formInline.associationFlag==true){
                    this.dialog.status=='add'
                    this.addForm.courseId = this.addForm.editId;
                }else{
                    this.addForm.courseId = this.addForm.editId;
                }
               // this.addForm.courseId=this.newCourseId;
                
                let url="_sc:/examTypeCourseRel";
                this.$http({
                        method:this.dialog.status == 'add'?"post":'put',
                        url:url,
                        data:this.addForm,
                      
                    }).then(data=>{
                        
                    let type = "success";
                    let message = `${this.dialog.status == 'add' ? '新增' : '编辑'}成功！`
                    if(data.code==0){
                        this.dialog.visible = false;
                  
                        this.getExaminationList();//刷新列表
                    }else{
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        type:type,
                        message:message
                    });
                })
            },
            addTask(addForm){// 新增弹窗
                this.dialog.status='add';
                this.dialog.visible = true;
                this.getdalongCourseList()
                //   this.$refs[addForm].resetFields(); //清除数据记录
            },
            onBefore(file){// 导入限制提示
                let extension = file.name.split('.')[1]==='xlsx';
                let size = file.size / 1204 / 1204 < 20;
                if(!extension){
                    this.$message.warning("上传的文件格式是 xls！")
                }
                if(!size){
                    this.$message.warning("上传的文件大小不能超过20M！")
                }
                return size ;
            },
            onSuccess(res,file){// 模板导入
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
      
          // 编辑
            editTask(row){
             
                let self = this
                self.addForm.examTypeId=row.examTypeId;
                self.addForm.courseId=row.courseName;
                self.addForm.editId = row.courseId;
                //self.addForm.courseId=row.courseName;
                // self.courseList2 = row;
                //  this.addForm.newCourseId=row.courseId;
                self.addForm.id=row.id;
                self.dialog.status='edit';
                self.dialog.visible=true;
                
                if(self.formInline.associationFlag==true){
                     self.addForm.examTypeId="";
                     //self.addForm.courseId="";
                     self.dialog.status="编辑考试类型关联课程"
                    //  self.addForm.examTypeId=row.examTypeId;
                    //  self.addForm.courseId=row.courseId;
                    //  dialog.status
                    //  self.addForm.examTypeId=row.examTypeName;
                     self.addForm.courseId=row.courseName;
                    self.addForm.editId = row.courseId;
                }
               
            },
            // 关闭窗口清空数据
            addDialogClose(){
                this.dialog.visible=false;
                this.addForm.type = "";
                this.addForm.examTypeId = '';
                this.addForm.courseId = '';
                this.addForm.id = '';
            },
              // 删除
               deleteDetailData(row){ 
                this.$confirm(`此操作将永久删除 "${row.courseName}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('_sc:/examTypeCourseRel/delete'+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getExaminationList();
                            }else{
                                type='error';
                                message=data.msg;
                            }
                            this.$message({
                                type,
                                message,
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
        computed:{
            ...mapState(['btnPermitList']),
            headers (){
                return {
                    'Authorization': util.getStorage('token')
                }
            },
            _upload_data(){
                return {
                    _upload_data:JSON.stringify({
                        create_user:this.userId,
                        create_username:this.userName
                    })
                }
            }
        },
    }
</script>
<style scoped>
.boxStyle{
      padding-right: 10px;  
}

    .table{
        width: calc(100% - 86px)!important;
        border: solid 1px lightgray;
    }
    .addClass>div{
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }
    .addClass div label {
        width: 88px;
        margin-left: 14px;
    }
    .table>thead>tr>th {
        padding: 8px;
        vertical-align: bottom;
        border: 1px solid #ddd;
        border-bottom: 2px solid #ddd;
        background-color: #f7f7f7;
    }
    .table>tbody>tr>td { 
        padding: 8px;
        border: 1px solid #ddd;
    }
    .addClass /deep/ .el-select {
        width: 100%;
    }
    .addClass /deep/ .el-input--small .el-input__inner {
        height: 40px;
    }
    .el-form /deep/ .flex-form.el-form-item .el-form-item__label {
        min-width: 100px;
    }
</style>