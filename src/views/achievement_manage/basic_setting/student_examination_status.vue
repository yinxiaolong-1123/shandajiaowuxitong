<template>
    <section class="cm-container">
        <!-- 学生考试状态 -->
        <div class="cm-breadcrumb cm-bt-1px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold pd-6">
            <el-form :inline="true" size="mini" :model="param">
                <div class="fold fold-lt">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="代码">
                            <el-input v-model="param.code" placeholder="请输入代码" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="param.cnName" placeholder="请输入中文名称" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"  v-if="btnPerObj.query" >查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="addExaminationStatus"  v-if="btnPerObj.add">新增</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        
            <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                v-loading="tableLoading"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="code" label="代码" width="200"></el-table-column>
                <el-table-column prop="cnName" label="名称" width="200"></el-table-column>
                <el-table-column prop="remark" label="描述"></el-table-column>
                  <el-table-column label="状态" width="200">>
                	<template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
                </el-table-column>
                <el-table-column
                 v-if="btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editDetailData(scope.row)"  v-if="btnPerObj.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteDetailData(scope.row)" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
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
                @current-change="currentChange"
            >
            </el-pagination>
        </div>
         <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑') + remark"
            :visible.sync="dialog.visible"
            width="400px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-small"
            @closed="dialogClose"
        >
            <el-form :model="addForm" ref="addForm"   class="boxStyle" :rules="rules" >
                <el-form-item label="代码"  prop="code" :label-width="formLabelWidth">
                     <el-input v-model="addForm.code" :disabled="dialog.status!=='add'" ></el-input>
                </el-form-item>
                <el-form-item label="名称"   prop="cnName" :label-width="formLabelWidth">
                     <el-input v-model="addForm.cnName" ></el-input>
                </el-form-item>
                <el-form-item label="描述"   prop="remark" :label-width="formLabelWidth">
                     <el-input v-model="addForm.remark" type="textarea" rows="4" cols="50"   maxlength="40"></el-input>
                </el-form-item>
                   <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" :label-width="formLabelWidth" >
                    <el-radio-group v-model="addForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="commonValidate('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    //接口未调用
    import util from '@/util'
    import {mapState} from 'vuex'//1
    //每个模块的type 和remark是固定不允许改变的
    const TYPE='degree-category';
    const REMARK='学生考试状态';
    export default {
        name: TYPE,
        data() {
            // 自定义验证  代码
             var codeRules = (rule, value, callback) => {
                let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
                let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
                if (regEn.test(value) || regCn.test(value)) {
                    callback(new Error("不能包含特殊字符"));
                } else if (value.length > 20) {
                    callback(new Error("代码长度不能超过20位"));
                } else {
                    callback();
                }
            };
            // 自定义验证  名称
             var cnNameRules = (rule, value, callback) => {
                let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
                let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
                if (regEn.test(value) || regCn.test(value)) {
                    callback(new Error("不能包含特殊字符"));
                } else if (value.length > 20) {
                    callback(new Error("名称长度不能超过20位"));
                } else {
                    callback();
                }
            };
           
           
            return {
                remark:REMARK,
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "学生考试状态"},
                ],
                addForm:{  //新增表格数据
                    code:"",
                    cnName:"",
                    remark:"",
                    status:""
                },
                 formLabelWidth: '100px',
                
                  rules: {
                    code: [{ required: true, message: '请输入代码', trigger: ['change'] },
                            { validator: codeRules, trigger: ['change'] } ],
                    cnName: [{ required: true, message: '请输入名称', trigger: 'change' },
                             { validator: cnNameRules, trigger: [,'change'] } ]
                  
                },
                tableData: [],//列表数据
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                param:{
                    cnName:'',
                    code:'',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
               
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                optionItem:[],
                  btnPerObj:{//按钮权限
                  add:false,
                  edit:false,
                  query:false,
                  delete:false,

                }
            }
        },
        watch:{ 
        },
        methods: {
                //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="add_xueshengkaoshizhuangtai") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_xueshengkaoshizhuangtai") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="delete_xueshengkaoshizhuangtai") {
                            self.btnPerObj.delete=true;
                        }
                        if (item.code=="query_xueshengkaoshizhuangtai") {
                            self.btnPerObj.query=true;
                        }
                       
                      
                    });
                }).catch(()=>{
                })
            },
             // 展开收起设置
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            // 获取列表数据
            getStudentList(){
                this.tableLoading=true;
                this.$http.post('_sc:/scoreSetting/list',{
                     pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    param: {
                        type: "STUDENT_EXAM_STATUS",
                        code:this.param.code,
                        cnName:this.param.cnName
                    }
                }).then(data=>{
                    this.tableLoading=false;
                    this.tableData=data.data.result;
                    this.totalCount=data.data.totalCount;
                }).catch(()=>{
                    this.tableLoading=true;
                })
            },
            // 新增
            addExaminationStatus(){
                this.dialog.status='add';
                this.dialog.visible=true;
                 
                this.addForm.code="",
                this.addForm.cnName="",
                this.addForm.remark="",
                this.addForm.status="1"
               
            },
            // 新增提交验证
            commonValidate(ref){
                this.$refs.addForm.validate((bool)=>{
                    if(bool){
                        this.commonRequire()
                    }
                })
            },
              // 新增提交
            commonRequire(){
                let that = this;
                let url="_sc:/scoreSetting";
                if(this.dialog.status == 'add'){
                   this.addForm.type='STUDENT_EXAM_STATUS';
                };
                this.$http({
                        method:this.dialog.status == 'add'?"post":'put',
                        url:url,
                        data:this.addForm,
                    }).then(data=>{
                    let type = "success";
                    let message = `${this.dialog.status == 'add' ? '新增' : '编辑'}成功！`
                    if(data.code==0){
                        this. getStudentList();
                        this.dialog.visible = false;
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
             // 查询
            search(){
                this.pageNo=1;
                this.getStudentList();
            },
            // 编辑
            editDetailData(row){
                this.addForm.code=row.code;
                this.addForm.cnName=row.cnName;
                this.addForm.enName=row.enName;
                this.addForm.status=row.status;
                this.addForm.remark=row.remark;
                this.addForm.type=row.type;
                this.addForm.id=row.id;
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            // 翻页
            currentChange(current){
                this.pageNo=current;
                this.getStudentList();
            },
            // 删除
               deleteDetailData(row){ 
                this.$confirm(`此操作将永久删除 "${row.cnName}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('_sc:/scoreSetting'+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getStudentList();
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
            
            //关闭弹窗时重置数据
            dialogClose(){
                this.$refs.addForm.resetFields();
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                  this.getStudentList();
            },
        },
        mounted(){
             
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            this.getStudentList();//初始化列表数据
           
        },
        computed:{}
    }
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.boxStyle{
      padding-right: 10px;  
}
</style>
