<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="param">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="代码">
                            <el-input v-model="param.universityCode" placeholder="请输入学校代码" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="param.cnName" placeholder="请输入中文名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search" v-if="btnPerObj.query" >查询</el-button>
                        </el-form-item>
                        <el-form-item>
                        <el-button size="mini" type="primary" @click="addItem" v-if="btnPerObj.add">新增</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    size="mini"
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
            >
                <el-table-column type="index" label="序号" fixed></el-table-column>

                <el-table-column v-for="(item,index) in tableList" :key='index'
                                 :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <template v-if="item.prop==='status'">
                            {{Number(scope.row.status)===1?'启用':'禁用'}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                        v-if="btnPerObj.edit||btnPerObj.delete"
                        fixed="right"
                        label="操作"
                        width="90">
                    <template slot-scope="scope" >
                        <el-button type="text" size="small" @click="editItem(scope.row)"   v-if="btnPerObj.edit"  >编辑</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;"   v-if="btnPerObj.delete" >删除</el-button>
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
                :title="dialog.status==='add'?'新增学校信息':'编辑学校信息'"
                :visible.sync="dialog.visible"
                width="400px"
                append-to-body
                :close-on-click-modal="false"
                custom-class="cm-dialog-small"
                @closed="dialogClose"
                >
            <el-form :model="formDialog"  ref="formDialog">
                <p>
                    <el-form-item label="学校代码" prop="universityCode" :rules="commonRules('学校代码',formDialog.universityCode,formDialog,'universityCode')" class="flex-form">
                        <el-input v-model="formDialog.universityCode" placeholder="请输入学校代码"
                                  :disabled="dialog.status!=='add'"
                        ></el-input>
                    </el-form-item>
                </p>
                <p>
                    <el-form-item label="学校名称" prop="cnName" :rules="commonRules('学校名称',formDialog.cnName,formDialog,'cnName')" class="flex-form">
                        <el-input v-model="formDialog.cnName" placeholder="请输入学校中文名称"></el-input>
                    </el-form-item>
                </p>
                <p>
                    <el-form-item label="英文名称" prop="enName" class="flex-form">
                        <el-input v-model="formDialog.enName" placeholder="请输入学校英文名称"></el-input>
                    </el-form-item>
                </p>
                <p>
                    <el-form-item label="学校国标代码" prop="nationalCode" :rules="commonRules('学校国际代码',formDialog.nationalCode,formDialog,'nationalCode')" class="flex-form">
                        <el-input v-model="formDialog.nationalCode" placeholder="请输入学校国际代码"></el-input>
                    </el-form-item>
                </p>
                <p v-if="dialog.status!=='add'">
                    <el-form-item label="状态" prop="status" class="flex-form">
                        <el-radio-group v-model="formDialog.status">
                            <el-radio :label="1">启用</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </p>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import {mapState} from 'vuex'//111

    export default {
        name: "school-maintenance",
        data() {
//          let commonRules=msg=>{
//              return {required: true, message: msg, trigger: 'blur' }
//          };
            return {
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "学校维护"},
                ],
                tableList:[
                    {label:'学校代码', prop:'universityCode'},
                    {label:'学校名称', prop:'cnName'},
                    {label:'英文名称', prop:'enName'},
                    {label:'学校国际代码', prop:'nationalCode'},
                    {label:'状态', prop:'status'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    cnName:'',
                    universityCode:'',
                },
                pagePort:{
                    table:'_op:university/list',
                    change:'_op:university',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    universityCode:'',
                    cnName:'',
                    enName:'',
                    nationalCode:'',
                    status:0,
                },
                dialog:{
                    status:'add',
                    visible:false,
                },
//              rules:{
//	                	formDialog:{
//	                    universityCode:'',
//	                    cnName:'',
//	                    enName:'',
//	                    nationalCode:'',
//	                    status:0,
//	                },
//                  universityCode:[
//                     // commonRules('请输入学校代码'),
//                      commonRules('学校代码'),
//                  ],
//                  cnName:[
//                      commonRules('中文名称'),
//                  ],
//                  nationalCode:[
//                      commonRules('学校国际代码'),
//                  ]
//              },
                tableLoading:false,
                btnPerObj:{//按钮权限  22222
					add:false,
					query:false,
					edit:false,
					delete:false
				}
            }
        },
         computed:{
        	...mapState(['btnPermitList']),//333
        },
        methods: {
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                     if (item.code=="query_xuexiaoweihu") {
                    self.btnPerObj.query=true;
	            	}
	            	if (item.code=="add_xuexiaoweihu") {
	            		self.btnPerObj.add=true;
	            	}
	            	if (item.code=="edit_xuexiaoweihu") {
	            		self.btnPerObj.edit=true;
	            	}
	            	if (item.code=="del_xuexiaoweihu") {
	            		self.btnPerObj.delete=true;
	            	}
                    });
                }).catch(()=>{
                })
            },
            	
            addItem(){
                this.dialog.status='add';
                this.dialog.visible=true;
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            commonValidate(ref,type){
                this.$refs[ref].validate((bool)=>{
                    if(bool){
                        this.commonRequire(type)
                    }
                })
            },
            commonRules(msg,val,formDialog,item){
				
            	let text_number = (rule, value, callback) =>{
            		// value = value.replace(/\s*/g,"");
            		// formDialog[item] = value;
	            	if(msg.indexOf("代码")!= -1 && value.length>20 ){
	            		
	            		return callback(new Error(msg+"代码长度不能超过20个字"));
	            	}else if(msg.indexOf("简称")!= -1 && value.length>20){
	            		return callback(new Error(msg+"简称字数不能超过20个字"));
	            	}else if(msg.indexOf("名称")!= -1 && value.length>40){
	            		return callback(new Error(msg+"字数不能超过40个字"));
	            	}else{
	            		return callback();
	            	}
            	}
            	
            	return [{required: true, message: '请输入'+msg , trigger: 'blur' },
                    { validator: text_number, trigger: 'change' }];
            },
            commonRequire(method){
                let option=util.clone(this.formDialog);
                if(method==='post'){
                    option.id && delete option.id;
                    delete option.status;
                }
                this.$http(
                    {
                        method:method,
                        url:this.pagePort.change,
                        data:{
                            ...option
                        },
                    }
                ).then(data=>{
                    let message=(method==='post'?'新增':'编辑')+'成功！';
                    let type='success';
                    if(Number(data.code)===0){
                        this.dialog.visible=false;
                    }else{
                        message=data.msg;
                        type='warning'
                    }
                    this.$message({
                        type,
                        message,
                        showClose:true,
                    });
                    //更新数据列表
                    this.getTableData();
                })
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableData();
            },
            deleteItem(row){
                this.$confirm(`此操作将永久删除 "${row.cnName}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.change+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getTableData();
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
            dialogClose(){
                //关闭弹窗时重置数据
                this.$refs.formDialog.resetFields();
            },
            editItem(row){
                this.$http.get(this.pagePort.change+'/'+row.id)
                    .then(data=>{
                        this.formDialog=data.data;
                    });
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            getTableData(){
                this.tableLoading=true;
                this.$http.post(this.pagePort.table,{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    param:this.param
                }).then(data=>{
                    this.tableData=data.result;
                    this.pageNo=data.pageNo;
                    this.pageSize=data.pageSize;
                    this.totalCount=data.totalCount;
                    this.tableLoading=false;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
            search(){
                this.pageNo=1;
                this.getTableData();
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData();
            },
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
            this.getTableData();
        }
    }
</script>

<style scoped lang="less">

</style>
