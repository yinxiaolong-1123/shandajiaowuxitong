<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
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
                            <el-button type="primary" size="mini" @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="addItem">新增</el-button>
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
                <el-table-column type="index" label="序号"></el-table-column>

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
                        fixed="right"
                        label="操作"
                        width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;">删除</el-button>
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
            <el-form :model="formDialog" ref="formDialog" label-width="111px">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}" >
                    <el-input v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                              :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
                </el-form-item>
                <!--新增--><span v-show="promptShow" style="position: absolute;bottom:145px;left:143px; z-index: 2; display:inline-block;width:100%;color:#f56c6c">英文名称不能超过64个字</span>
                <el-form-item label="专业门类"  prop="majorCategoryId">
                    <el-select v-model="formDialog.majorCategoryId = formDialog.majorCategoryId===0? '':formDialog.majorCategoryId"  placeholder="请选择层次" style="width:100%;">
                        <!--<el-option label="" value=""></el-option>-->
                        <el-option v-for="item in optionItem" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status">
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
    const TYPE='专业代码',REMARK='professional-code';

    export default {
        name: REMARK,
        data() {
//          let commonRules=msg=>{
//              return {required: true, message: msg, trigger: 'blur' }
//          };
            return {
                type:TYPE,
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "专业类"},
                    {label: "专业代码"},
                ],
                tableList:[
                    {label:'代码', prop:'code',},
                    {label:'名称', prop:'cnName',},
                    {label:'英文名称', prop:'enName',},
                    {label:'专业门类', prop:'majorCategoryName'},
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
                    table:'_op:majorCode/list',
                    change:'_op:majorCode',
                    option:'_op:majorCategory/getMajorCategoryList',
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
                    majorCategoryNam: '', //新增 majorCategoryNam 属性
                    majorCategoryId:'',
                    status:0,
                },
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'专业国家代码',prop:'code',editDisabled:true,rule:true},
                    {label:'专业名称',prop:'cnName',editDisabled:false,rule:true},
                    {label:'英文名称',prop:'enName',editDisabled:true,}
                ],
                optionItem:[],
                promptShow: false,
                 btnPerObj:{//按钮权限
                  query:false
                }
            }
        },
       watch: {
       	['formDialog.enName']: function(val) {
             if (val.length>63 && val != null) {
                 this.promptShow = true;
             }else {
             	 this.promptShow = false;
             }
        }
       },
        methods: {
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						 if (item.code=="query_kechengbiaochaxun") {  //查询
						self.btnPerObj.query=true;
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
            		value = value.replace(/\s*/g,"");
            		formDialog[item] = value;
	            	if(msg.indexOf("代码")!= -1 && value.length>20 ){
	            		return callback(new Error("代码长度不能超过20个字"));
	            	}else if(msg.indexOf("简称")!= -1 && value.length>20){
	            		return callback(new Error("简称字数不能超过20个字"));
	            	}else if(msg.indexOf("名称")!= -1 && value.length>20){
	            		return callback(new Error("名称字数不能超过20个字"));
	            	}else{
	            		return callback();
	            	}
            	}
            	
            	return [{required: true, message: '请输入' + msg, trigger: 'blur' },
                    { validator: text_number, trigger: 'change' },];
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
