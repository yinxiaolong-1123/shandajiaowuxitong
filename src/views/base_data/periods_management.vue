<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-btn-con" v-if="btnPerObj.add">
            <el-button size="mini" type="primary" @click="addItem" style="margin-top: 20px;">新增</el-button>
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
                    element-loading-background="rgba(255, 255, 255, 0.8)">
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
            		v-if="btnPerObj.setting||btnPerObj.edit||btnPerObj.del"
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                        <!--<el-button type="text" size="small" @click="editItem(scope.row)">禁用</el-button>-->
                        <el-button type="text" size="small" @click="periodsSetting(scope.row)" v-if="btnPerObj.setting">课节设置</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
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
                @closed="dialogClose('formDialog')"
                >
            <el-form :model="formDialog" ref="formDialog" label-width="95px">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}" >
                    <el-input v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                              :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
                </el-form-item>

                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" >
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
        <el-dialog :visible.sync="excess.visible"
                   :title="excess.title"
                   width="800px"
                   append-to-body
                   :close-on-click-modal="false"
                   custom-class="cm-dialog-pad"
        >
            <div class="cm-btn-con">
                <el-button size="medium" type="primary" @click="excess.addItem=true">新增</el-button>
            </div>
            <div class="cm-table">
                <el-table
                    ref="multipleTable"
                    :data="excess.table"
                    border
                    style="width: 100%"
                   
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                >
                    <el-table-column label="课节" prop="name"></el-table-column>
                    <el-table-column label="上课时间" prop="startTime"></el-table-column>
                    <el-table-column label="下课时间" prop="endTime"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="deleteItem(scope.row,'excess')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="excess.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="excess.visible && excess.addItem"
                   title="新增课节计划"
                   width="500px"
                   append-to-body
                   :close-on-click-modal="false"
                   @closed="dialogClose('excessForm')"
                   custom-class="cm-dialog-pad">
            <!-- <el-form :model="excessForm" ref="excessForm" label-width="95px" > -->
                <!-- <el-form-item v-for="(item,index) in excessFormList" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?addCommonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}" >
                    <el-time-picker v-if="item.type==='time'" style="width:100%" value-format="HH:mm:ss"
                                    v-model="excessForm[item.prop]" :placeholder="'请选择'+item.label"
                    ></el-time-picker>
                    <el-input v-else v-model="excessForm[item.prop]" :placeholder="'请输入'+item.label"></el-input>
                </el-form-item> -->

            <el-form :model="excessForm" ref="excessForm" :rules="rules" label-width="100px">
				<el-form-item label="课节名称" prop="name" required>
				    <el-input v-model="excessForm.name"  style="width:90%" placeholder="请输入代码"></el-input>
				</el-form-item>
				<el-form-item label="上课时间" prop="startTime" required>
				     <el-time-picker style="width:90%" value-format="HH:mm:ss" format='HH:mm:ss'  type="time" v-model="excessForm.startTime"
                                   placeholder="请选择上课时间"
                    ></el-time-picker>
				</el-form-item>
				<el-form-item label="下课时间" prop="endTime"  required >
				     <el-time-picker  style="width:90%" value-format="HH:mm:ss" format='HH:mm:ss'  type="time" v-model="excessForm.endTime"
                                 placeholder="请选择下课时间"
                    ></el-time-picker>
				</el-form-item>
            </el-form>
            <!-- </el-form> -->
            <span slot="footer" class="dialog-footer" >
                <el-button @click="excess.addItem = false">取 消</el-button>
                <el-button type="primary" @click="addExcessItem('excessForm')">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='periods-management',REMARK='课节管理';
    
    import {mapState} from 'vuex'

    export default {
        name: TYPE,
        data() {
            let commonRules=msg=>{
                return {required: true, message: msg, trigger: 'blur' }
            };
            let addCommonRules=msg=>{
                return {required: true, message: msg, trigger: 'blur' }
            };

            return {
                type:REMARK,
                breadcrumb: [
                    {label: "基础数据"},
                    {label: REMARK},
                ],
                tableList:[
                    {label:'课节计划名称', prop:'name'},
                    {label:'状态', prop:'status'},
                    {label:'创建人', prop:'createUser'},
                    {label:'创建时间', prop:'createTime'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    // cnName:'',
                    // code:'',
                },
                pagePort:{
                    table:'_op:sections/list',
                    change:'_op:sections',
                    excess:'_op:sectionnodes',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    name:'',
                    id:'',
                    status:1,
                },
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'课节计划名',prop:'name',rule:true},
                ],
                excess:{
                    visible:false,
                    title:'课节设置',
                    table:[],
                    addItem:false,
                },
                excessForm:{
                    name:'',
                    startTime:'',
                    endTime:'',
                    sid:'',
                },
                rules:{
                    name:[{ required: true, message: '请输入名字', trigger: 'blur', }],
                    startTime:[{ required: true, message: '请输入上课时间', trigger: 'blur' }],
                    endTime:[{ required: true, message: '请输入下课时间', trigger: 'blur' }],
            	},
				btnPerObj:{//按钮权限
					add:false,
					edit:false,
					setting:false,
					delete:false
				}
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
        },
        computed:{
        	...mapState(['btnPermitList']),
        },
        methods: {
        	getBtnPermit(){//获取按钮权限
        		let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item=>{
                        if (item.code=="add_kejieguanli") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_kejieguanli") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="setting_sections_kejieguanli") {
                            self.btnPerObj.setting=true;
                        }
                        if (item.code=="del_kejieguanli") {
                            self.btnPerObj.delete=true;
                        }
                        
                    })
                })
	            // this.btnPermitList.map(item=>{
	            // 	if (item.code=="add_kejieguanli") {
	            // 		self.btnPerObj.add=true;
	            // 	}
	            // 	if (item.code=="edit_kejieguanli") {
	            // 		self.btnPerObj.edit=true;
	            // 	}
	            // 	if (item.code=="setting_sections_kejieguanli") {
	            // 		self.btnPerObj.setting=true;
	            // 	}
	            // 	if (item.code=="del_kejieguanli") {
	            // 		self.btnPerObj.delete=true;
	            // 	}
	            	
	            // })
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
            commonRequire(method){
                let option=util.clone(this.formDialog);
                if(method==='post'){
                    option.id && delete option.id;
                    // delete option.status;
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
            addCommonRules(msg,val,formDialog,item){
				
            	let text_number = (rule, value, callback) =>{
            		// value = value.replace(/\s*/g,"");
            		// formDialog[item] = value;
	            	if(msg.indexOf("课节名称")!= -1 && value.length>10 ){
	            		
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
            currentChange(current){
                this.pageNo=current;
                this.getTableData();
            },
            deleteItem(row,url='change'){
                this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort[url]+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                if(url==='change'){
                                    this.getTableData();
                                }else{
                                    this.getExcessTable();
                                }
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
            dialogClose(ref){
                //关闭弹窗时重置数据
                if(typeof ref!=='string'){
                    ref='formDialog';
                }
                this.$refs[ref].resetFields();
            },
            editItem(row){
                // this.$http.get(this.pagePort.change+'/'+row.id)
                //     .then(data=>{
                //         this.formDialog=data.data;
                //     });
                this.formDialog.name=row.name;
                this.formDialog.status=row.status;
                this.formDialog.id=row.id;
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            getTableData(){
                this.tableLoading=true;
                this.$http.post(this.pagePort.table,{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    customStringSplicing:true
                })
                    .then(data=>{
                        if(Number(data.code)===0){
                            this.tableData=data.data.records;
                            this.totalCount=data.data.total;
                        }

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
            },
            periodsSetting({id}){
                this.excess.visible=true;
                this.excessForm.sid=id;
                this.getExcessTable();
            },
            getExcessTable(){
                this.$http({
                    method:'get',
                    url:this.pagePort.excess,
                    data:{
                        customStringSplicing:true,
                        id:this.excessForm.sid
                    }
                }).then(data=>{
                    if(Number(data.code)===0){
                        this.excess.table=data.data;
                    }
                })
            },
            addExcessItem(excessForm){
                this.$refs[excessForm].validate(valid => {
                 if (valid) {
                this.$http.post(this.pagePort.excess,{...this.excessForm}).then(data=>{
                    this.excess.addItem=false;
                    if(Number(data.code)===0){
                        this.getExcessTable();
                    }
                  })
                }

             });
            }
        }
    }
</script>

<style scoped lang="less">
</style>
