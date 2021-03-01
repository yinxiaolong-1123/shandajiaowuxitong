<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-flex">
            <div class="cm-tree cm-flex-item">
                <div>
                    <el-button type="primary" size="mini" @click="addItem"  v-if="btnPerObj.add"  >新增</el-button>
                    <el-button size="mini" @click="editItem"  v-if="btnPerObj.edit">编辑</el-button>
                    <el-button size="mini" @click="deleteItem"  v-if="btnPerObj.delete">删除</el-button>
                </div>
                <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                         @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
                         :expand-on-click-node="false"
                         highlight-current node-key="id" ref="tree" :default-expanded-keys="expandKeys"></el-tree>
            </div>
            <div class="cm-table cm-flex-item">
                <div style="margin-bottom:10px;">
                    <span class="el-radio__label" style="margin-right:20px;">下级部门：</span>
                    <el-radio-group v-model="tableRadio" @change="getTableData">
                        <el-radio  :label="1" >只显示直接下级</el-radio>
                        <el-radio :label="0" >显示所有下级部门</el-radio>
                    </el-radio-group>

                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%;"
                    size='mini'
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)">
                    <el-table-column type="index" label="序号"></el-table-column>

                    <el-table-column v-for="(item,index) in tableList" :key='index'
                                     :prop="item.prop" :label="item.label" :width="item.width">
                        <template slot-scope="scope">
                            <template v-if="item.prop==='orgTypeName'">
                                <template v-if="scope.row.type==1">
                                    组织
                                </template>
                                <template v-if="scope.row.type==2">
                                    部门
                                </template>
                                
                            </template>
                            <template v-if="item.prop==='status'">
                                {{Number(scope.row.status)===0?'启用':'禁用'}}
                            </template>
                            <template v-else-if="item.prop==='managerName'&& !scope.row[item.prop]" >
                                
                            	<template v-if="scope.row.managerNames">{{scope.row.managerNames}}</template>
                                <el-button v-else type="text" size="small" @click="showStaffList(scope.row)"  >去设定</el-button>
                            </template>
                            <template v-else>
                                {{scope.row[item.prop]}}
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column
                        	v-if="btnPerObj.personnel||btnPerObj.delete ||btnPerObj.edit"
                        fixed="right"
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showStaffList(scope.row)" v-if="btnPerObj.personnel" >部门人员</el-button>
                            <el-button type="text" size="small" @click="tableEditItem(scope.row)"  v-if="btnPerObj.edit" >编辑</el-button>
                            <el-button type="text" size="small" @click="tableDeleteItem(scope.row)" style="color: red;"  v-if="btnPerObj.delete" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑')+'部门信息'"
            :visible.sync="dialog.visible"
            width="400px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-small"
            @closed="dialogClose"
        >
            <el-form :model="formDialog" ref="formDialog">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):[]" class="flex-form" v-show="item.prop != 'parentName' || parentId != 1 || dialog.status != 'edit'">
                    <el-select v-if="item.type==='select'" v-model="formDialog[item.prop]"  :placeholder="'请选'+item.label" style="width:100%;">
                        <!-- <el-option label="全部" :value="0"></el-option> -->
                        <el-option v-for="item2 in getArrList(item.list)" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                    </el-select>
                    <el-input v-else v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                              :disabled="(item.editDisabled && dialog.status!=='add')||item.disabled"></el-input>
                              <!-- <template >
                                  <div :model="textSize" v-if="ddd" >{{textSize}}</div>
                              </template> -->
                           
                </el-form-item>

                <!--<p v-if="dialog.status!=='add'">-->
                    <!--<el-form-item label="状态" prop="status" class="flex-form">-->
                        <!--<el-radio-group v-model="formDialog.status">-->
                            <!--<el-radio :label="0">启用</el-radio>-->
                            <!--<el-radio :label="1">禁用</el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                <!--</p>-->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 人员列表弹窗 -->
        <el-dialog :title="staffList.title"
           :visible.sync="staffList.visible"
           append-to-body
           :close-on-click-modal="false"
           custom-class="cm-dialog-middle"
           @closed="teaDialogClose"
        >
            <div class="cm-table cm-native">
                <div class="cm-flex vertical-center" style="margin-bottom:20px;">
                    <div class="cm-flex-item auto-width">
                        当前部门：<span>{{staffList.currentDepartment}}</span>
                    </div>
                    <div class="cm-flex-item fixed-width search-box">
                    	<el-select v-model="searchType" size="small"  @change="searchTypeChange">
						    <el-option label="姓名" value="1"> </el-option>
						    <el-option label="工号" value="2"> </el-option>
						    <el-option label="手机号" value="3"> </el-option>
						</el-select>
                        <el-input v-show="searchType==1" size="small" v-model="staffList.name" placeholder="请输入姓名搜索（请按回车搜索）" @keyup.enter.native="getTeacherList" @clear="getTeacherList">
                        	<i slot="suffix" class="el-input__icon el-icon-search" @click="getTeacherList"></i>
                        </el-input>
                        <el-input v-show="searchType==2" size="small" v-model="staffList.teacherNo" placeholder="请输入工号搜索（请按回车搜索）" @keyup.enter.native="getTeacherList" @clear="getTeacherList">
                        	<i slot="suffix" class="el-input__icon el-icon-search" @click="getTeacherList"></i>
                        </el-input>
                        <el-input v-show="searchType==3" size="small" v-model="staffList.mobile" placeholder="请输入手机号搜索（请按回车搜索）" @keyup.enter.native="getTeacherList" @clear="getTeacherList">
                        	<i slot="suffix" class="el-input__icon el-icon-search" @click="getTeacherList"></i>
                        </el-input>
                    </div>
                </div>
                <el-table   ref="staffList"
                            :data="staffList.data"
                            border
                            style="width: 100%;"
                            header-row-class-name="cm-dark"
                            v-loading="tableLoading"
                            element-loading-text="加载中……"
                            element-loading-background="rgba(255, 255, 255, 0.8)">
                    <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                    <el-table-column v-for="(item,index) in staffList.tableList" :key='index'
                                     :prop="item.prop" :label="item.label" :width="item.width">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="setResponsible(scope.row)">
                            	<template v-if="!scope.row.isManager">设为负责人</template>
                            	<template v-else>取消负责人</template>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                  <!-- <el-pagination
                   @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                     :current-page="currentPage" 
                     :page-sizes="[10, 20, 30]"
                      :page-size="pageSize" 
                      layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
                 </el-pagination> -->


                <el-pagination
	                background
	                :current-page="staffList.pageNo"
	                :page-sizes="[1,10, 20, 50, 100]"
	                :page-size="staffList.pageSize"
	                layout="total, sizes, prev, pager, next, jumper"
	                :total="staffList.totalCount"
	                @size-change="sizeChange"
	                @current-change="currentChange"
	                style="text-align: right;margin-top:20px;">
                </el-pagination>
            </div>

        </el-dialog>
        
        
    </section>
</template>

<script>
    import util from '@/util'
    import {mapState} from 'vuex'//1
    //每个模块的type 和remark是固定不允许改变的
    const TYPE='department-management';
    const REMARK='部门管理';
    const treeID=1;//树结构起始id；

    export default {
        name: TYPE,
        data() {
            let commonRules=msg=>{
                return {required: true, message: msg, trigger: 'blur' }
            };
            return {
                // textSize:"已经输入多少字",
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "行政类"},
                    {label: "部门管理"},
                ],
                tableList:[
                    {label:'部门编号', prop:'code'},
                    {label:'部门名称', prop:'name'},
                    {label:'组织类型', prop:'orgTypeName'},
                    {label:'上级部门', prop:'parentName'},
                    {label:'部门负责人', prop:'managerName'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    name:'',
                    universityCode:'',
                },
                pagePort:{
                    
                    // tree:'_op:admin/department/tree/',
                    tree:'_auth:/sysUserOrgDepartmentRole/orgdepartment',
                    // /auth/center/orgDepartment/
                    list:'_auth:/orgDepartment/', //orgDepartment
                    // /admin/departmen

                    // /auth/center/orgDepartment
                    operation:'_auth:/orgDepartment',//编辑、新增
                    optionType:'_op:dicts/getDictsList',
                    staffList:'',
                    goStaff:'',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    code:'', 
                    name:'',
                    parentName:'',
                    sort:'',
                    orgTypeId:'',
                    type:2,
                },
                dialog:{
                    status:'add',
                    visible:false,
                },

                tableLoading:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                editFormDetail:[
                    //editDisabled:true
                    {label:'上级部门',prop:'parentName',editDisabled:true,disabled:true},
                    {label:'部门编码',prop:'code', editDisabled: true, rule:true},
                    {label:'部门名称',prop:'name',rule:true},
                    {label:'部门排序',prop:'sort',rule:commonRules('请输入部门排序')},
                    {label:'组织类型',prop:'orgTypeId',type:'select',list:'optionType'},
                    // {label:'类型',prop:'type'},
                ],
                tableRadio:1,
                targetId:'',
                parentId:treeID,
                tarNode:'',
                parentNode:'',
                treeData:[],
                // defaultKeys:treeID,
                defaultKeys:'',
                expandKeys:[],
                optionType:[],
                staffList:{
                    title:'人员列表',
                    visible:false,//设定弹窗
                    tableList:[
                        {label:'姓名',prop:'name'},
                        {label:'工号',prop:'teacherNo'},
                        {label:'手机号',prop:'mobile'}
                        ],
                    currentDepartment:'',
                    mobile:'',
                    name:'',
                    teacherNo:'',
                    pageNo:1,
                    pageSize:10,
                    totalCount:1,
                    data:[]
                },
                searchType:'1',
                departmentId:'',
                btnPerObj:{//按钮权限  22222
					add:false,
					query:false,
					edit:false,
                    delete:false,
                    setting:false,//去设定
                    personnel:false//部门人员

				}
            }
        },
        watch:{
            //  ["excavateForm.platformName"](val) {
            ['formDialog.sort'](val){
              
            },
            ['formDialog.orgTypeName'](val){
               
                //  params.keywords = this.keywordsArr;
        
                if (val==null){
                   
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
							if (item.code=="query_bumenguanli") {
	            		self.btnPerObj.query=true;
	            	}
	            	if (item.code=="add_bumenguanli") {
	            		self.btnPerObj.add=true;
	            	}
	            	if (item.code=="edit_bumenguanli") {
	            		self.btnPerObj.edit=true;
	            	}
	            	if (item.code=="del_bumenguanli") {
	            		self.btnPerObj.delete=true;
	            	}
	            	if (item.code=="setting_bumenguanli") {//去设定
	            		self.btnPerObj.setting=true;
	            	}
	            	if (item.code=="personnel_bumenguanli") {//部门人员
	            		self.btnPerObj.personnel=true;
	            	}
	            	
                    });
                }).catch(()=>{
                })
            },
        	
            	
            // 新增信息
            addItem(){
                if(this.mustGetId()){
                    for(let key of Object.keys(this.formDialog)){
                        this.formDialog[key]='';
                    }
                    this.formDialog.parentName=this.tarNode.name;
                    this.formDialog.parentId=this.tarNode.id;

                    this.dialog.status='add';
                    this.dialog.visible=true;
                }
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
            		if (typeof value === 'string') {
                        value = value.replace(/\s*/g,"");
                    }
            		formDialog[item] = value;
	            	if((msg.indexOf("代码")!= -1 || msg.indexOf("编码")!= -1) && value.length>20 ){
	            		return callback(new Error("代码长度不能超过20个字"));
	            	}else if(msg.indexOf("简称")!= -1 && value.length>20){
	            		return callback(new Error("简称字数不能超过20个字"));
	            	}else if(msg.indexOf("名称")!= -1 && value.length>40){
	            		return callback(new Error("名称字数不能超过40个字"));
	            	} else if (msg.indexOf("部门排序") != -1 && !/^\d+$/.test(value)) {
                        return callback(new Error("部门排序为纯数字"));
                    }else if(msg.indexOf("部门排序") != -1 && value.length>20){
                         return callback(new Error("部门排序不能超过20个字"));
                    }
                    else{
	            		return callback();
	            	}
            	}
            	
            	return [{required: true, message: '请输入'+msg , trigger: ['blur',"change" ]},
                    { validator: text_number, trigger: ['blur',"change" ] }];
            },
            // 编辑提交
            commonRequire(method){
                
                let option=util.cloneObj(this.formDialog);
                if(method=='post'){
                    option.type = 2
                }
                option.parentName && delete option.parentName;
                  option = { ...option };
          for (const key in option) {
            if (option.hasOwnProperty(key)) {
              const element = option[key];

              if (element === 0 || element == null) delete option[key];
            }
          }
         let aaa=option; 
        
                this.$http(
                    {
                        method:method,
                        url:this.pagePort.operation,
                        data:{
                            ...aaa
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
                    this.getTreeData();
                    this.getTableData();
                })
            },
       
            // 删除部门
            tableDeleteItem(row){
             
                this.$confirm(`此操作将删除 "${row.name}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.operation+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getTableData();
                                this.getTreeData();
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
            deleteItem(){
                if(this.mustGetId()){
                    let row=this.tarNode;
                    this.$confirm(`此操作将删除 "${row.name}" , 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.delete(this.pagePort.operation+'/'+row.id)
                            .then(data=>{
                                let message='删除成功!';
                                let type='success';
                                if(Number(data.code)===0){
                                    this.defaultKeys=treeID;
                                    this.getTableData();
                                    this.getTreeData();
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
                }
            },
            dialogClose(){
                //关闭弹窗时重置数据
                this.$refs.formDialog.resetFields();
            },
          
            editItem(){
                if(this.mustGetId()){
                 
                    this.formDialog=util.cloneObj(this.tarNode);
                   
                    if(this.formDialog.id==1){
                        this.$message.error('根目录不能编辑');
                        return ;
                        
                    }else{
                        
                        this.formDialog.parentName=this.parentNode.data.name;
                     
                        this.dialog.status='edit';
                        this.dialog.visible=true;
                    }

                    this.dialog.status='edit';
                    this.dialog.visible=true;
                }
            },
            // 点击编辑按钮
            tableEditItem(row){
              
                 let num=row;
                  if(row.orgTypeId==0)
                  {
                      row.orgTypeId=null
                  }
                this.targetId=row.id;
             
                this.formDialog=util.cloneObj(row);
             
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            getTableData(){
                this.tableLoading=true;
                this.$http.get(this.pagePort.list+`${this.tableRadio}/${this.parentId}`)

                    .then(data=>{
                    this.tableData=data.data;
                 
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
            //分页
            sizeChange(size){
                this.staffList.pageNo=1;
                this.staffList.pageSize=size;
                this. getTeacherList();
            },
            currentChange(current){
               
                this.staffList.pageNo=current;
                this. getTeacherList();
            },
            handleNodeClick(obj,nodeObj) {
                this.tarNode=obj;
                this.parentNode=nodeObj.parent;
                this.targetId=obj.id;
                this.parentId=obj.id;
                this.defaultKeys=obj.id;
                this.getTableData();
            },
            handleNodeExpand(obj){
                this.extendTree(obj.id);
            },
            handleNodeCollapse(obj){
                this.collapseTree(obj.id);
            },
            getTreeData(id=1){
                // this.$http.get(this.pagePort.tree+id).then(data=>{
                this.$http.get(this.pagePort.tree).then(data=>{
                    // this.treeData=[data.data];
                    this.treeData=data.data;
                    // let key = this.defaultKeys;
                    let key = data.data[0].id;
                    // let key = data.data[0].id;
                    this.extendTree(key);//设定默认展开的
                    
                    //编辑或者新增后
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(key);
                        let nodeObj=this.$refs.tree.getNode(key);
                        
                        this.tarNode=nodeObj.data;
                        if(nodeObj.parent.level===0){
                            this.parentNode={};
                        }else{
                            this.parentNode=nodeObj.parent;
                        }
                        this.targetId=nodeObj.data.id;
                        this.parentId=nodeObj.data.id;
                    })
                })
            },
            //查询教师列表 人员列表查询
            getTeacherList(){
            	this.$http.post('_op:/admin/department/teacher/list',{
            		pageNo:this.staffList.pageNo,
            		pageSize:this.staffList.pageSize,
            		param:{
            			departmentId:this.departmentId,
            			mobile:this.staffList.mobile,
            			name:this.staffList.name,
            			teacherNo:this.staffList.teacherNo
            		}
            	}).then(data=>{
                    this.staffList.data=data.result;
                    this.staffList.totalCount=data.totalCount;
                }).catch(()=>{

                })
            },
            searchTypeChange(val){//
            	if (val==1) {
            		this.staffList.teacherNo='';
            		this.staffList.mobile='';
            	}else if (val==2) {
            		this.staffList.name='';
            		this.staffList.mobile='';
            	} else{
            		this.staffList.name='';
            		this.staffList.teacherNo='';
            	}
            },
            teaDialogClose (){
                this.searchType = '1',
                this.staffList.name = '';
                this.staffList.mobile = '';
                this.staffList.teacherNo = '';
            },
            mustGetId(key=this.targetId){
                // let key=this.$refs.tree.getCurrentKey();
                if(!key && key!==0){
                    this.$message({
                        showClose:true,
                        message:'请先选中区域节点！',
                        type:'warning'
                    });
                    key=false;
                }else{
                    key=true;
                }
                return key;
            },
            getArrList(str){
                return this[str];
            },
            getOptionItem(str){
                let data={};
                let url=this.pagePort[str];
                if(url.indexOf('dicts/')!==-1){
                    data.type='organization-category';
                    data.isDelete = 0;
                    data.status = 1;
                }
                this.$http.post(url,data).then(data=>{
                    this[str]=data.data;
                })
            },
            // 设定弹窗弹出
            showStaffList(row){
              
            	this.departmentId=row.id;
                this.staffList.currentDepartment=row.name;
             
            	this.getTeacherList();
                this.staffList.visible=true;//弹窗
            },
            setResponsible(row){
            	var action= row.isManager ? 0 : 1;
            	var resText= row.isManager ? '取消负责人成功' : '设置负责人成功';
            	this.$http.put('_op:/admin/department/manager/'+this.departmentId+'/'+row.id+'/'+action).then(data=>{
                    if(data.code==0){
                        this.staffList.visible = false;
                        this.getTeacherList();
                        this.getTableData();
                    }
            		this.$message({
			          	message: resText,
			          	type: 'success'
			        });
                    
                }).catch(()=>{
                })
            },
            //保存默认展开的树列表
            extendTree(key){
                let val=new Set(this.expandKeys);
                if(!val.has(key)){
                    val.add(key);
                }
                this.expandKeys=Array.from(val);
            },
            collapseTree(key){
                let val=new Set(this.expandKeys);
                if(val.has(key)){
                    val.delete(key);
                }
                this.expandKeys=Array.from(val);
            }
        },
         computed:{
        	...mapState(['btnPermitList']),//3
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

            this.getTableData(this.pageNo,this.pageSize);
            this.getTreeData();
            this.getOptionItem('optionType');
        }
    }
</script>

<style scoped lang="less">
.search-box{
	display: flex;
	.el-select{
		width: 120px;
	}
}
.cm-flex > .cm-flex-item.cm-tree {
    width: 210px;
    flex: 1 0 auto;
    background-color: #f0f0f0;
    padding: 10px 10px 20px;
    margin-right: 20px;
    box-sizing: border-box;
}
</style>
