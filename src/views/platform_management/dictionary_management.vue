<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="代码">
                            <el-input size="mini" v-model="code" placeholder="请输入代码" onkeyup="this.value=this.value.trim()" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input size="mini" v-model="cnName" placeholder="请输入中文名称" onkeyup="this.value=this.value.trim()" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="旧类别名" v-if="this.typecode=='course-category'">
                            <el-input size="mini" v-model="oldName" placeholder="请输入旧类别名" clearable></el-input>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.query">
                         	<el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.add">
                         	<el-button size="mini" type="primary" @click="addBtn">新增</el-button>
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
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="代码" prop="code"> </el-table-column>
                <el-table-column label="名称" prop="cnName"> </el-table-column>
                <el-table-column label="简称" prop="shortName" v-if="showSN"></el-table-column>
                <el-table-column label="英文名称" prop="enName" v-if="typecode!='course-category'">
                	<template slot-scope="scope">{{scope.row.enName}}</template>
                </el-table-column>
                <template  v-if="typecode=='course-category'">
                	<el-table-column label="旧类别码"> 
	                    <template slot-scope="scope">
	                    	{{scope.row.extend==null?'':scope.row.extend.oldCode}}
	                    </template>
	                </el-table-column>
                	<el-table-column label="旧类别名">
	                    <template slot-scope="scope">
	                        {{scope.row.extend==null?'':scope.row.extend.oldName}}
	                    </template>
	                 </el-table-column>
                </template>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{Number(scope.row.status)===1?'启用':'禁用'}}
                    </template>
                </el-table-column>
                <el-table-column
                	v-if="btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="90">
                    <template slot-scope="scope" v-if="scope.row.code!='GJKS'&&scope.row.code!='JXK'&&scope.row.code!='DYKS'">
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
                @current-change="currentChange">
            </el-pagination>
        </div>
        
        <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑') + titletext"
            :visible.sync="dialog.visible"
            width="400px"
            append-to-body
            @closed="dialogClose('formDialog')"
            :close-on-click-modal="false"
            custom-class="cm-dialog-small">
            
            <el-form :model="formDialog" ref="formDialog" :rules="rules" label-width="70px">
				<el-form-item label="代码" prop="code">
				    <el-input v-model="formDialog.code" clearable placeholder="请输入代码" :disabled="dialog.status!='add'"></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="cnName">
				    <el-input v-model="formDialog.cnName" clearable placeholder="请输入名称"></el-input>
				</el-form-item>
				<!--新增课程类别-->
				<template v-if="this.typecode=='course-category'">
					<el-form-item label="旧类别码" prop="oldCode">
					    <el-input v-model="formDialog.oldCode" clearable placeholder="请输入代码"></el-input>
					</el-form-item>
					<el-form-item label="旧类别名" prop="oldName">
					    <el-input v-model="formDialog.oldName" clearable placeholder="请输入名称"></el-input>
					</el-form-item>
				</template>
				
				<el-form-item label="简称" prop="shortName" v-if="showSN">
				    <el-input v-model="formDialog.shortName" clearable placeholder="请输入简称"></el-input>
				</el-form-item>
				<el-form-item label="英文名称" prop="enName"  v-if="this.typecode!=='course-category'">
				    <el-input v-model="formDialog.enName" clearable placeholder="请输入英文名称"></el-input>
				</el-form-item>
				<el-form-item label="状态" v-if="dialog.status!=='add'">
					<el-radio v-model="formDialog.status" label="1">启用</el-radio>
 					<el-radio v-model="formDialog.status" label="0">禁用</el-radio>
				</el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClose('formDialog')">取 消</el-button>
                <el-button type="primary" @click="sureBtn('formDialog')">确 定</el-button>
            </span>
        </el-dialog>
        
    </section>
</template>

<script>
    import util from '@/util'
    
    import {mapState} from 'vuex'


    export default {
        name: "dictionary",
        data() {
            return {
                breadcrumb: [
                    {label: "基础数据"},
                    {label: ''},
                ],
                oldName:'',//旧类别名
                cnName:'',//中文名
            	code:'',//代码
            	typecode:'',//字典类型
                tableData: [],//
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                dialog:{//新增、编辑dialog
                    status:'add',
                    visible:false,
                },
                titletext:'',//
                formDialog:{
                	id:'',
                    code:'',
                    cnName:'',
                    enName:'',
                    shortName:'',
                    status:'',
            		oldCode:'',
            		oldName:'',
                    type:''
                },
                
            	rules:{
            		code:[
            			{ required: true, message: '请输入代码', trigger: 'blur' },
            			{max: 20, message: '长度不多于20 个字符', trigger: 'blur' }
            		],
            		cnName:[
            			{ required: true, message: '请输入名称', trigger: 'blur' },
            			{max: 40, message: '长度不多于40 个字符', trigger: 'blur' }
            		],
            		shortName:[
            			{ required: true, message: '请输入简称', trigger: 'blur' },
            			{max: 40, message: '长度不多于40 个字符', trigger: 'blur' }
            		],
            		enName:[
            			{max: 40, message: '长度不多于40 个字符', trigger: 'blur' }
            		],
            		oldCode:[
            			{max: 40, message: '长度不多于40 个字符', trigger: 'blur' }
            		],
            		oldName:[
            			{max: 40, message: '长度不多于40 个字符', trigger: 'blur' }
            		],
            	},
            	
            	showSN:true,
            	
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
				btnPerObj:{//按钮权限
					add:false,
					query:false,
					edit:false,
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
            this.formDialog.type=this.typecode=this.$route.name;
    		this.titletext=this.breadcrumb[1].label=this.titleFn(this.typecode);
        	this.getTableData();
        	//这些基础数据的简称没有
        	if (this.typecode=='sex-code'||this.typecode=='school-running'||this.typecode=='organization-category'||this.typecode=='schooling-length'||this.typecode=='course-nature'||this.typecode=='course-category') {
        		this.showSN=false;
        	}
        	
        },
        watch:{
        	'$route':function(to,from){
        		this.tableData=[];
        		this.showSN=true;
	        	this.formDialog.type=this.typecode=this.$route.name;
	    		this.titletext=this.breadcrumb[1].label=this.titleFn(this.typecode);
	        	this.getTableData();
	        	if (this.typecode=='sex-code'||this.typecode=='school-running'||this.typecode=='organization-category'||this.typecode=='schooling-length'||this.typecode=='course-category'||this.typecode=='course-nature') {
	        		this.showSN=false;
	        	}
        	}
        },
        computed:{
        	...mapState(['btnPermitList']),
        },
        methods: {
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        let codetext=item.code.split('_')[0];
                        if (codetext=="query") {
                            self.btnPerObj.query=true;
                        }
                        if (codetext=="add") {
                            self.btnPerObj.add=true;
                        }
                        if (codetext=="edit") {
                            self.btnPerObj.edit=true;
                        }
                        if (codetext=="del") {
                            self.btnPerObj.delete=true;
                        }
						
                    });
                }).catch(()=>{
                })
            },
        	// getBtnPermit(){//获取按钮权限
        	// 	let self=this;
	        //     this.btnPermitList.map(item=>{
	        //     	let codetext=item.code.split('_')[0];
	        //     	if (codetext=="query") {
	        //     		self.btnPerObj.query=true;
	        //     	}
	        //     	if (codetext=="add") {
	        //     		self.btnPerObj.add=true;
	        //     	}
	        //     	if (codetext=="edit") {
	        //     		self.btnPerObj.edit=true;
	        //     	}
	        //     	if (codetext=="del") {
	        //     		self.btnPerObj.delete=true;
	        //     	}
	            	
	        //     })
        	// },
            titleFn(text){
	        	let name='';
	        	switch (text){
	        		case 'country-code': 			name='国家/地区'; break;
	        		case 'nation-code':  			name='民族代码'; break;
	        		case 'sex-code':     			name='性别维护'; break;
	        		case 'school-running': 			name='办学类型'; break;
	        		case 'political-status':		name='政治面貌'; break;
	        		case 'ID-category': 			name='证件类型'; break;
	        		case 'organization-category':	name='组织类型'; break;
	        		case 'educational-level': 		name='学历层次'; break;
	        		case 'learning-form': 			name='学习形式'; break;
	        		case 'admissions-season': 		name='招生季节'; break;
	        		case 'schooling-length': 		name='学制维护'; break;
	        		case 'course-category': 		name='课程类别'; break;
	        		case 'course-nature': 			name='课程性质'; break;
	        		case 'place-category': 			name='场地类型'; break;
	        		default: break;
	        	}
	        	return name
            },
            getTableData(){
                this.tableLoading=true;

                this.$http.post('_op:dicts/list',{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    param:{
	                    cnName:this.cnName,
	                    code:this.code,
	                    type:this.typecode,
	                    searchParam:this.oldName
	                }
                }).then(data=>{
                    this.tableData=data.result;
                    this.pageNo=data.pageNo;
                    this.pageSize=data.pageSize;
                    this.totalCount=data.totalCount;
                    this.pageSize=data.pageSize;
                   
                    this.tableLoading=false;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData();
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableData();
            },
            search(){
                this.pageNo=1;
                this.getTableData();
            },
            
            addBtn(){//新增
                this.formDialog.code='';
                this.formDialog.cnName='';
                this.formDialog.enName='';
                this.formDialog.shortName='';
                this.dialog.status='add';
                this.dialog.visible=true;
            },
            dialogClose(formDialog){//关闭弹窗
            	this.$refs[formDialog].resetFields();
                this.dialog.visible=false;
            },
            sureBtn(formDialog){//确认新增、编辑
            	this.$refs[formDialog].validate((valid) => {//表单校验
			        if (valid) {
		            	if (this.dialog.status=='add') {
		            		let extend={};
		            		if (this.typecode=='course-category') {
				                extend={
			                		oldCode:this.formDialog.oldCode,
			                		oldName:this.formDialog.oldName
				                }
		            		}
			            	this.$http.post('_op:dicts',{
			            		code:this.formDialog.code,
			                    cnName:this.formDialog.cnName,
			                    enName:this.formDialog.enName,
			                    shortName:this.formDialog.shortName,
			                    extend:extend,
			                    type:this.formDialog.type
			            	}).then(data=>{
			            		if(data.code==0){
				            		this.dialogClose('formDialog');
				            		this.getTableData();
				            		this.$message({
							          message: '新增成功',
							          type: 'success'
							        });
			            		}else{
			            			this.$message.error(data.msg)
			            		}
			            		
			                }).catch(()=>{
			                })
		            	} else{
		            		this.$http.put('_op:dicts',{
		            			id:this.formDialog.id,
		            			status:this.formDialog.status,
			            		code:this.formDialog.code,
			                    cnName:this.formDialog.cnName,
			                    enName:this.formDialog.enName,
			                    shortName:this.formDialog.shortName,
			                    type:this.formDialog.type
			            	}).then(data=>{
			            		if(data.code==0){
			            			this.dialogClose('formDialog');
				            		this.getTableData();
				            		this.$message({
							          message: '编辑成功',
							          type: 'success'
							        });
						        }else{
						        	this.$message.error(data.msg)
						        }
			                }).catch(()=>{
			                })
		            	}
			        } else {
			          
			            return false;
			        }
		        });
            	
            	
            },
            editDetailData(row){//编辑
                this.$http.get('_op:dicts/'+row.id).then(data=>{
                        if(Number(data.code)===0){
                        	this.dialog.status='edit';
                			this.dialog.visible=true;
                			
			                this.formDialog.code=data.data.code;
			                this.formDialog.cnName=data.data.cnName;
			                this.formDialog.enName=data.data.enName;
			                this.formDialog.shortName=data.data.shortName;
			                this.formDialog.id=data.data.id;
			                this.formDialog.status=data.data.status.toString();
			                if (this.typecode=='course-category') {
				                this.formDialog.oldCode=data.data.extend.value.oldCode;
				                this.formDialog.oldName=data.data.extend.value.oldName;
		            		}
                        }else{
                            this.$message.error(data.msg);
                        }
                    });
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            deleteDetailData(row){
                this.$confirm(`此操作将永久删除 "${row.cnName}" 的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('_op:dicts/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.pageNo = 1;
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
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            }
        }
        
    }
</script>

<style scoped lang="less">

</style>
