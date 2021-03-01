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
                            <el-input v-model="param.code" placeholder="请输入院系代码" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="param.cnName" placeholder="请输入中文名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"  v-if="btnPerObj.query">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                        	<el-button size="mini" type="primary" @click="addItem"  v-if="btnPerObj.add">新增</el-button>
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
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)"  v-if="btnPerObj.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;"  v-if="btnPerObj.delete">删除</el-button>
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
                :title="(dialog.status==='add'?'新增':'编辑')+type"
                :visible.sync="dialog.visible"
                width="400px"
                append-to-body
                :close-on-click-modal="false"
                custom-class="cm-dialog-small"
                @closed="dialogClose"
                >
            <el-form :model="formDialog" ref="formDialog">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}" class="flex-form">
                    <el-input v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                              :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
                </el-form-item>

                <el-form-item label="学校名称" class="flex-form" prop="universityId">
                    <el-select v-model="formDialog.universityId"  placeholder="请选择学校名称" style="width:100%;">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option v-for="item in optionItem" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" class="flex-form">
                    <el-radio-group v-model="formDialog.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

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
     import {mapState} from 'vuex'//1
    const TYPE='院系维护',REMARK='department-maintenance';

    export default {
        name: REMARK,
        data() {
            let commonRules=(msg)=>{
                return {required: true, message: "hehe", trigger: 'blur' }
            };
            
//          let code_rule = (rule, value, callback)=>{
//          	value = value.replace(/\s*/g,"");
//          	if(value.length>10){
//          		return callback(new Error("代码长度不能超过10个"));
//          	}
//          	
//          }
            return {
                type:TYPE,
                breadcrumb: [
                    {label: "基础管理"},
                    {label: TYPE},
                ],
                tableList:[
                    {label:'院系代码', prop:'code'},
                    {label:'院系名称', prop:'cnName'},
                    {label:'英文名称', prop:'enName'},
                    {label:'学校名称', prop:'universityName'},
                    {label:'状态', prop:'status'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    cnName:'',
                    code:'',
                },
                pagePort:{
                    table:'_op:teachDepartment/list',
                    change:'_op:teachDepartment',
                    option:'_op:university/getUniversityList',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    code:'',
                    cnName:'',
                    enName:'',
                    universityId:0,
                    status:0,
                },
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'院系代码',prop:'code',editDisabled:true,rule:true},
                    {label:'院系名称',prop:'cnName',editDisabled:false,rule:true},
                    {label:'英文名称',prop:'enName',editDisabled:false,},
                ],
                optionItem:[],
                	btnPerObj:{//按钮权限  22222
					add:false,
					query:false,
					edit:false,
					delete:false
				}
            }
        },
          computed:{
        	...mapState(['btnPermitList']),//
        },
        methods: {
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						if (item.code=="query_yuanxiweihu") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="add_yuanxiweihu") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_yuanxiweihu") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="del_yuanxiweihu") {
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
                if(this.formDialog.enName.length>60){
                    this.$message.warning("英文名称长度不能超过60！");
                    return ;
                }
                let option=util.clone(this.formDialog);
                if(method==='post'){
                    option.id && delete option.id;
                    option.universityName && delete option.universityName;
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
                this.$confirm(`此操作将永久删除该${row.cnName}的学校信息, 是否继续?`, '提示', {
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
            getOptionItem(){
                this.$http.post(this.pagePort.option,{}).then(data=>{
                    this.optionItem=data.data;
                })
            }
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
            this.getOptionItem();
        }
    }
</script>

<style scoped lang="less">

</style>
