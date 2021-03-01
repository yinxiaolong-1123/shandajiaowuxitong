<template>
    <section class="cm-container">
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
                            <el-input v-model="param.code" placeholder="请输入学位类别代码" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="param.cnName" placeholder="请输入中文名称" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"  v-if="btnPerObj.query">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="addSchool" v-if="btnPerObj.add">新增</el-button>
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
                        {{scope.row[item.prop]}}
                    </template>
                </el-table-column>
                <el-table-column
                v-if="btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editDetailData(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
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
           
              <el-form :model="addForm" ref="addForm"  :rules="ruless" >
                <el-form-item label="代码"  prop="code" :label-width="formLabelWidth">
                     <el-input v-model="addForm.code"   :disabled="dialog.status!=='add'"></el-input>
                </el-form-item>
                <el-form-item label="名称"   prop="cnName" :label-width="formLabelWidth">
                     <el-input v-model="addForm.cnName" ></el-input>
                </el-form-item>
                <el-form-item label="简称"   prop="shortName" :label-width="formLabelWidth">
                     <el-input v-model="addForm.shortName" ></el-input>
                </el-form-item>
                <el-form-item label="英文名称"   prop="enName" :label-width="formLabelWidth" >
                     <el-input v-model="addForm.enName"  maxlength="40" ></el-input>
                </el-form-item>
               
                 <el-form-item label="层次" prop="educationalLevelId" class="flex-form" style="position: relative;">
                    <el-select v-model="addForm.educationalLevelId" placeholder="请选择层次" style="width:100%;">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option v-for="item in optionItem" :key="item.name" :label="item.name" :value="item.id"></el-option>
                    </el-select>
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
                <el-button type="primary" @click="commonValidate('addForm',dialog.status==='add'?'post':'put')">确 定</el-button>
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
    const REMARK='学位类别';

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
            // 自定义验证  名称
             let cnNameRules = (rule, value, callback) => {
                let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
                let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
                if (regEn.test(value) || regCn.test(value)) {
                    callback(new Error("不能包含特殊字符"));
                } else if ((value.length) > 20) {
                    callback(new Error("名称长度不能超过20位"));
                }  else {
                    callback();
                }
            };
            
         
            return {
                remark:REMARK,
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "专业类"},
                    {label: "学位类别"},
                ],
                tableList:[
                    {label:'代码', prop:'code'},
                    {label:'名称', prop:'cnName'},
                    {label:'简称', prop:'shortName'},
                    {label:'英文名称', prop:'enName'},
                    {label:'层次', prop:'educationalLevelName'}
                    //{label:'专业代码（国家）',prop:'countryMajorId',type:'select',list:'countryList'},
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
                    table:'_op:degreeCategory/list',
                    change:'_op:degreeCategory',
                    option:'_op:dicts/getDictsList',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                // formDialog:{
                //     code:'',
                //     cnName:'',
                //     enName:'',
                //     shortName:'',
                //     educationalLevelId:0,
                //     status:0,
                // },
                  addForm:{
                    code:"",
                    cnName:"",
                    enName:"",
                    addForm:"",
                    status:1,
                    educationalLevelId:"",
                    id:""
                },
                ruless: {
                    code: [{ required: true, message: '请输入代码', trigger: ['blur'] },
                            { validator: codeRules, trigger: ['blur','change'] } ],
                    cnName: [{ required: true, message: '请输入名称', trigger:  ['blur']},
                             { validator: cnNameRules, trigger:  ['blur','change']} ],
                    educationalLevelId: [{ required: true, message: '请选择层次', trigger:  ['change']},
                            ]
                },
                 formLabelWidth: '100px',
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                optionItem:[],
                btnPerObj:{//按钮权限  22222
					add:false,
					query:false,
					edit:false,
					delete:false
				}
            }
        },
        watch:{  //新增
        ['formDialog.enName'](val) {
          val = val.replace(/\s*/g,"");
          if (val.length > 10) {
           
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
                    if (item.code=="query_xueweileibie") {
                    self.btnPerObj.query=true;
	            	}
	            	if (item.code=="add_xueweileibie") {
	            		self.btnPerObj.add=true;
	            	}
	            	if (item.code=="edit_xueweileibie") {
	            		self.btnPerObj.edit=true;
	            	}
	            	if (item.code=="del_xueweileibie") {
	            		self.btnPerObj.delete=true;
	            	}
                    });
                }).catch(()=>{
                })
            },
    
            addSchool(){
                this.dialog.status='add';
                this.dialog.visible=true;
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            // 提交验证
            commonValidate(addForm,type){
                this.$refs.addForm.validate((bool)=>{
                    if(bool){
                        this.commonRequire(type)
                    }
                })
            },
            commonRequire(method){
                let option=util.cloneObj(this.addForm);
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
            deleteDetailData(row){
             
                this.$confirm(`此操作将永久删除 "${row.cnName}" 的${REMARK}信息, 是否继续?`, '提示', {
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
                this.$refs.addForm.resetFields();
            },
            editDetailData(row){
            
                this.addForm.cnName=row.cnName,
                this.addForm.enName=row.enName,
                this.addForm.shortName=row.shortName,
                this.addForm.educationalLevelId=row.educationalLevelId,
                this.addForm.id=row.id,
                this.dialog.status='edit';
                this.dialog.visible=true;
                
            },
            getTableData(){
                this.tableLoading=true;
                this.param.type=TYPE;
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
                this.$http.post(this.pagePort.option,{
                    type:'educational-level'
                }).then(data=>{
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
        },
        computed:{
            showExtend(){
                return JSON.stringify(this.extendList)==='{}';
            },
            ...mapState(['btnPermitList']),//33333333
        }
    }
</script>

<style scoped lang="less">
</style>
