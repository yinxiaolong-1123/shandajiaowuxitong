<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/" class="clear">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" >{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div  class="cm-container character-table cm-table" style="margin:0;">
            <div class="cm-btn-con">
                <el-button size="mini" type="primary" @click="addItem" v-if="btnPerObj.add">新增角色</el-button>
                <div class="right cm-character">当前选中角色：{{ currentRole || '--' }}</div>
            </div>
            <div class="cm-table" style="height: calc(100% - 110px);">
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
                    <el-table-column type="index" label="序号" ></el-table-column>

                    <el-table-column v-for="(item,index) in tableList" :key='index' :width="item.width"
                                     :prop="item.prop" :label="item.label">
                        <template slot-scope="scope">
                            <template v-if="item.prop==='description'">
                                {{scope.row.description}}
                            </template>
                            <template v-else>
                                {{scope.row[item.prop]}}
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column
                    	 v-if="btnPerObj.menu||btnPerObj.personal||btnPerObj.edit||btnPerObj.del"
                        fixed="right"
                        label="操作"
                        width="250">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="setCharge(scope.row)" v-if="btnPerObj.menu">菜单权限</el-button>
                            <el-button type="text" size="small" @click="setSecretary(scope.row)" v-if="btnPerObj.personal">人员授权</el-button>
                            <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                            <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;" v-if="btnPerObj.del">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 暂无分页 -->
            <!-- <div class="cm-pagination">
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
            </div> -->
        </div>

        <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑')+type"
            :visible.sync="dialog.visible"
            width="440px"
            append-to-body
            :close-on-click-modal="false"
            @closed="dialogClose"
            custom-class="cm-dialog-pad"
        >
            <el-form :model="formDialog" ref="formDialog" label-width="112px">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop"  :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}"  >
                    <el-select v-if="item.type==='select'" v-model="formDialog[item.prop]"  :placeholder="'请选'+item.label" style="width:100%;">
                      <el-option v-for="item2 in optionList.nature" :key="item2.id" :label="item2.name" :value="item2.id"></el-option> -->
                    </el-select>
                    <el-input   @input="changeInput(item.label,formDialog[item.prop])" v-else v-model="formDialog[item.prop]" :placeholder="'请输入'+(item.placeholder || item.label)"
                              :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
                </el-form-item> 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 菜单权限 -->
        <el-dialog
            title="菜单权限"
            :visible.sync="roleMenuDialog.visible"
            width="600px"
            height="400px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-pad role-menu-dialog"
            @closed="menuTreeDialogClose">
            <div class="my-flex" 
                style="display: flex;"
                v-loading="menuTreeLoading"
                element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <div class="cm-flex-item" style="flex: 1;"
                    v-loading="submitTreeLoading"
                    element-loading-text="正在提交……"
                    element-loading-background="rgba(255, 255, 255, 0.8)">
                    <el-tree
                        show-checkbox
                        :data="menuTreeData" 
                        :expand-on-click-node="true"
                        default-expand-all
                        highlight-current 
                        :default-checked-keys="menuCheckedId"
                        @check="handleCheck"
                        node-key="id" 
                        ref="menuTreeData" 
                        :props="defaultProps">
                    </el-tree> 
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleMenuDialog.visible = false">确认</el-button>
                <!-- <el-button type="primary" @click="roleMenuDialog.visible = false">确 定</el-button> -->
            </span>
        </el-dialog>
        
        <!-- 人员授权 -->
        <el-dialog  title=""
            :visible.sync="dialog.jurisdiction"
            width="80%"
            append-to-body
            :close-on-click-modal="false"
            @closed="deparmentClose"
            custom-class="cm-dialog-pad cm-rang-width add-pane">
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="已授权人员" name="first">
                    <el-input type="text" size="medium" suffix-icon="el-icon-search" placeholder="请输入姓名（回车搜索）"
                              class="cm-search normal" style="margin-bottom:15px;"  v-model="chargeTable.getTeaListParam.param.name" @keyup.enter.native="getUsersByRole" clearable @clear="getUsersByRole"></el-input>
                    <div class="cm-table" style="margin-bottom:15px;">
                        <el-table ref="chargeTable"
                            :data="chargeTable.data"
                            border
                            style="width: 100%"
                            header-row-class-name="cm-dark"
                            v-loading="dialog.loading"
                            element-loading-text="加载中……"
                            element-loading-background="rgba(255, 255, 255, 0.8)">
                            <!--<el-table-column type="selection"></el-table-column>-->
                            <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                            <el-table-column label="姓名" prop="name"></el-table-column>
                            <el-table-column label="工号" prop="teacherNo"></el-table-column>
                            <el-table-column label="部门职务" prop="positionName"></el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="120">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="delTeacherByRole(scope.row)">删除人员</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="cm-pagination clear" style="padding-bottom:5px;">
                        <el-pagination
                            background
                            :current-page="chargeTable.pageNo"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="chargeTable.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="chargeTable.total"
                            @size-change="chargeTableSizeChange"
                            @current-change="chargeTableCurrentChange">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="新增权限" name="second">
                    <div class="clear option-btn-box" >

                        <el-input type="text" size="medium" suffix-icon="el-icon-search" placeholder="请输入姓名（回车搜索）" class="cm-search normal" v-model="paramsGetUnauth.param.name" @keyup.enter.native="getDepartmentUser" clearable @clear="getDepartmentUser" style="margin-bottom:15px;" ></el-input>

                        <el-button class="right" type="primary" @click="batchRole">批量加入</el-button>

                        <div class="people-box right" @mouseover="selPeople=true" @mouseout="selPeople=false">
                            <span class="people-bage" v-if="checkedPeopleArr.length>0">{{ checkedPeopleArr.length }}</span>
                            <img src="../../../assets/icon_people.png" alt="">
                            <transition name="el-zoom-in-top">
                                <div class="people-inner-box" v-show="selPeople">
                                    <template v-if="checkedPeopleArr.length === 0">
                                        <p style="color: #999; text-align: center;">暂无数据！</p>
                                    </template>
                                    <template v-else>
                                        <el-tag
                                            :key="item.name"
                                            v-for="item in checkedPeopleArr"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleClose(item)"
                                        >
                                            {{item.name}}
                                        </el-tag>
                                    </template>
                                </div>
                            </transition>
                        </div>
                    </div>
                    
                    <div class="cm-flex">
                        <div class="cm-tree cm-flex-item" style="width: 35%; max-height: 200px; overflow-y: auto;min-height:160px; max-height: 270px;">
                            <el-tree
                                :default-expanded-keys="[1]"
                                :data="deparmentTreeData"
                                :props="deparmentDefaultProps"
                                :expand-on-click-node="false"
                                @node-click="deparmentHandleNodeClick"
                                highlight-current 
                                node-key="id"
                                ref="deparmentTree">
                                <!-- :default-expanded-keys="expandKeys" -->
                            </el-tree>
                        </div>
                        <div class="cm-table cm-flex-item">
                            <el-table 
                                ref="staffList" 
                                :data="staffList.departmentStaffLists"
                                border 
                                style="width: 100%;" 
                                header-row-class-name="cm-dark" 
                                @selection-change="handleSelectionChange"
                                v-loading="tableLoading"
                                element-loading-text="加载中……" 
                                element-loading-background="rgba(255, 255, 255, 0.8)">

                                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                                <template v-for="(item,index) in staffList.depTableList">
                                   
                                    <el-table-column :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                                        <template slot-scope="scope" >
                                            <template v-if="item.prop == 'type'">
                                                <span v-if="scope.row.type === 1">辅导员</span>
                                                <span v-else>班主任</span>
                                            </template>
                                            <template v-else>
                                                {{scope.row[item.prop]}}
                                            </template>
                                        </template>
                                    </el-table-column>
                                </template>
                                <el-table-column fixed="right" width="120" label="操作">
                                    <template slot-scope="scope">
                                        <!-- <el-checkbox name="type" :ref="`checkbox${scope.row.id}`"></el-checkbox> -->
                                        <template v-if="scope.row.isAccredit == true">
                                            <el-button type="text" size="small">已选择</el-button>
                                        </template>
                                        <template v-else>
                                            <el-checkbox :ref="`checked${scope.row.id}`" v-model="checked[scope.row.id]" @change="handleCheckbox(scope.row)"></el-checkbox>
                                        </template>
                                    </template>
                                </el-table-column>
                            </el-table> 
                        </div>
                    </div>

                   <!--  <el-pagination
                        background
                        :current-page="paramsGetUnauth.pageNo" 
                        :page-size="paramsGetUnauth.pageSize" 
                        :page-sizes="[10, 20, 50, 100]" 
                        layout="total, sizes, prev, pager, next, jumper" 
                        :total="staffList.totalCount" 
                        @size-change="unauthSizeChange" 
                        @current-change="unauthCurrentChange" 
                        style="text-align: right;margin-top:20px;">
                    </el-pagination> -->
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='character-authority';
    const REMARK='角色权限';
    import {mapState} from 'vuex'
    export default {
        name: TYPE,
        data() {
            return {
                type:REMARK,
                currentRole:'',
                setForm:{
                    desc:'',
                    target:'',
                    partment:''
                },
                breadcrumb: [
                    {label: "权限管理"},
                    {label: "角色权限"}
                ],
                tableList:[
                    {label:'角色名称', prop:'name'},
                    {label:'角色描述', prop:'description'},
                    // {label:'角色类型', prop:'typeName'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                roleListPram:'',
                param:{
                    status:'',
                    categoryId:'',
                    code:'',
                    name:'',
                    natureId:'',
                },
                pagePort:{
                    role: '_op:role', // 新增(post)或修改(put)角色
                    deleteRole: '_op:role', // 删除角色 {id}
                    roleLists: '_op:role', // 获取角色列表
                    departmentTree:'_op:admin/department/tree/', // 获取部门树'
                    findTeachersByRole: '_op:role/user/auth', // 获取角色已授权人员
                    findUnauthTeachersByRole: '_op:role/user/unauth', // 根据角色查询未授权的人员列表
                    optRole:'_op:role/associate/user', // 向角色中添或取消加人员
                    roleMenuTree: '_op:role/all', // 获取所有菜单
                    getCheckedMenuId: '_op:role', // 根据角色获取权限树
                    changeMenuForRole: '_op:role/role/privilege', // 修改角色权限菜单 opType: 0-删除， 1-增加
                    getStudentList: '_op:students/filter/', // get parames: {year}/{className} className 
                    // getDeparmentTeacherList: '_op:/teachers/filter/', // get params: {deptId}
                    getDeparmentTeacherList: '_op:teachers/teacher/list', // get params: {deptId}
                    change:'_op:course',
                    majorList:'_op:major/getMajorList',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                // 新增角色定义的值
                formDialog:{
                    id: 0,
                    name:'', // 角色名
                    description:'' // 角色类型
                },
                roleMenuDialog :{
                    visible: false,
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                menuTreeLoading:false,
                submitTreeLoading: false,
                menuTreeData: [],
                curRoleId:0,
                menuCheckedId: [], // 已有权限id 
                paramsChMenuForRole: {
                    opType: 0,
                    privilegeIds: [],
                    roleId: ''
                },
                paramsOptRole:{
                    opType: 0,
                    roleId: 0,
                    privilegeIds:[],
                    unionIds: []
                },
                paramsGetUnauth: {
                    pageNo:1,
                    pageSize:10,
                    param:{
                        departmentId: 1, // 默认 1
                        name: '',
                        roleId: '',
                        unionIds: [] // 传空即可
                    }
                },
                deparmentDefaultProps: {
                    children: 'children',
                    label: 'name'
                },
                deparmentTreeData:[],
                staffList: {
                    title: '角色授权人员',
                    visible: false,
                    tableList: [
                        { label: '工号', prop: 'teacherNo' }, 
                        { label: '姓名', prop: 'name' },
                        { label: '部门职务', prop: 'positionName' } // 0 表示班主任 1 表示辅导员
                    ],
                    paramUnauth:{
                        departmentId: 0,
                        name: "string",
                        roleId: 0,
                        unionList: []
                    },
                    currentDepartment: '教研室',
                    search: '',
                    // pageNo: 1,
                    // pageSize: 10,
                    totalCount: 1,
                    data: [
                        { id:1, teacherNo:'1', name:'张三', type:1 },
                        { id:2, teacherNo:'2', name:'李四', type:0 },
                        { id:3, teacherNo:'2', name:'王五', type:0 }
                    ],
                    depTableList: [
                        { label: '工号', prop: 'teacherNo' }, 
                        { label: '姓名', prop: 'name' },
                        // { label: '部门职务', prop: 'type' } // type: 0 表示班主任 1 表示辅导员
                        { label: '部门职务', prop: 'positionName' }
                    ],
                    departmentStaffLists: [
                        {id: 5, teacherNo: "363", name: "炎", positionName: "教授", isAccredit: false, unionId: 5},
                        {id: 6, teacherNo: "363", name: "炎", positionName: "教授", isAccredit: true, unionId: 6}
                    ]
                },
                dialog:{
                    status:'add',
                    visible:false,
                    setVisible:false,
                    jurisdiction:false,
                    setTitle:'负责人',
                    loading:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'角色名称',prop:'name',rule:true},
                    {label:'角色描述',prop:'description',type:'input',rule:false},
                ],
                statusList:[],
                courseList:[],
                majorList:[],
                categoryList:[],
                natureList:[],
                optionList:{
                    category:[],
                    nature:[], 
                },
                activeName:'first',
                chargeTable:{
                    getTeaListParam:{
                        pageNo: 1,
                        pageSize: 10,
                        param:{
                            departmentId: 1,
                            name: '',
                            roleId: 0,
                            unionIds: []
                        }
                    },
                    roleCode:'',
                    data:[],
                    pageNo:1,
                    pageSize:10,
                    total:0,
                },
                secretaryTable:{

                },
                checked:{},
                checkedId:[],
                batchForm:{
                    uid:'',
                    rids:[]
                },
                checkedPeopleArr:[],
                selPeople:false,
				btnPerObj:{//按钮权限
					add:false,
					menu:false,
					personal:false,
					edit:false,
					del:false
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
            // this.getOptionItem('optionList','course-category','category');
            // this.getOptionItem('optionList','course-nature','nature');
            this.statusList=util.status();
            this.getDeparmentTreeData();
            // this.getRoleMenuTree();
        },
        filters:{
            getTime(time){
                return util.getTime(time);
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
						if (item.code=="add_juesequanxian") {
	            		self.btnPerObj.add=true;
	            	}
	            	if (item.code=="menu_juesequanxian") {
	            		self.btnPerObj.menu=true;
	            	}
	            	if (item.code=="personal_juesequanxian") {
	            		self.btnPerObj.personal=true;
	            	}
	            	if (item.code=="edit_juesequanxian") {
	            		self.btnPerObj.edit=true;
	            	}
	            	if (item.code=="del_juesequanxian") {
	            		self.btnPerObj.del=true;
	            	}
                    });
                }).catch(()=>{
                })
            },
        	
            changeInput(msg,val,formDialog,item){
               if(msg.indexOf("角色描述")!= -1 && val.length>40){
                       this.editFormDetail[1].rule = true
                    }
                    else{
	            	 this.editFormDetail[1].rule = false
	            	}
            },
            // 新增校验
           commonRules(msg,val,formDialog,item){
            	let text_number = (rule, value, callback) =>{
	            	if(msg.indexOf("角色名称")!= -1 && value.length>40 ){
	            		return callback(new Error(msg+"不能超过40个字"));
                    }else if(msg.indexOf("角色描述")!= -1 && value.length>40){
                       return callback(new Error(msg+"不能超过40个字"));
                    }
                    else{
	            		return callback();
	            	}
            	}
            	return [{required: true, message: '请输入'+msg , trigger: 'blur' },
                    { validator: text_number, trigger: 'change' }];
            },
            deparmentClose(){
                this.checkedId.map((item,i)=>{
                    this.checked[item] = false;
                });
                this.checkedPeopleArr = [];
            },
            addItem(){
                this.getRoleType();
                this.dialog.status='add';
                this.dialog.visible=true;
                this.formDialog.name='';
                this.formDialog.description='';
               

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
                
                    delete option.id;
                
                }
                this.$http(
                    {
                        method:method,
                        url:this.pagePort.role,
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
                this.currentRole = row.name;
                this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(`${this.pagePort.deleteRole}/${row.id}`)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                if(data.data&&data.data.length>0){
                                    
                                    type = "warning";
                                    message = data.data;
                                }
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
                this.formDialog.name = '';
                this.formDialog.type = '';
                this.formDialog.id = '';
                // this.$refs['formDialog'].resetFields();
            },
            editItem(row){
                this.currentRole = row.name;
                this.formDialog.id = row.id;
                this.formDialog.name = row.name;
                this.formDialog.description = row.description;
                this.getRoleType();
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            // 获取角色列表
            getTableData(){
                this.tableLoading=true;
                this.$http.get(this.pagePort.roleLists).then(data => {
                    this.tableData=data.data;
                    this.tableLoading=false;
                }).catch(()=>{
                    // this.tableData=[]; 
                    this.tableLoading=false;
                })
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData();
            },
            getOptionItem(str,type,attr){
                let data={};
                let url=this.pagePort[str];
                if(type){
                    data.type=type;
                }
                this.$http.post(url,data).then(data=>{
                    if(type && attr){
                        this[str][attr]=data.data;
                    }else{
                        this[str]=data.data;
                    }
                });
            },
            // 获取菜单树
            getRoleMenuTree (){
                this.$http.get(this.pagePort.roleMenuTree).then(data => {
                    if (data.code === 0) {
                        this.menuTreeData = data.data;
                    }
                })
            },
            loopTree(arr) {
                let _this = this;
                // console.log(arr)
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].checked == true) {
                        _this.menuCheckedId.push(arr[i].id);
                    }
                    if (arr[i].children && arr[i].children.length > 0) {
                        _this.loopTree(arr[i].children);
                    }
                }
            },
            getCheckedMenuId (){
                this.$http.get(`${this.pagePort.getCheckedMenuId}/${this.curRoleId}`).then(data => {
                    if (data.code === 0) {
                        // this.menuCheckedId = data.data;
                        this.menuTreeData = data.data;
                        this.loopTree(data.data);
                        this.menuTreeLoading = false;
                    } else {
                        this.menuTreeLoading = false;
                    }
                }).catch(err => {
                    this.menuTreeLoading = false;
                })
            },
            // 关闭菜单权限对话框原来的权限id
            menuTreeDialogClose (){
                this.menuTreeData = [];
                this.menuCheckedId = [];
            },
            // 更改角色菜单权限
            handleCheck(data, obj) {
                this.submitTreeLoading = true;
                if (this.menuCheckedId.length < obj.checkedKeys.length) {
                    // 增加权限 
                    let addIds = this.compareArrDiff(obj.checkedKeys, this.menuCheckedId);

                    this.paramsChMenuForRole.opType = 1;
                    this.paramsChMenuForRole.privilegeIds = addIds;
                    this.changeMenuForRole();
                } else {
                    //取消权限！
                    let delArr = this.compareArrDiff(this.menuCheckedId, obj.checkedKeys);
                    this.paramsChMenuForRole.opType = 0;
                    this.paramsChMenuForRole.privilegeIds = delArr;
                    this.changeMenuForRole();
                } 
                this.menuCheckedId = obj.checkedKeys;
                // this.getTreeData();
            },
            changeMenuForRole (){
                this.$http.put(this.pagePort.changeMenuForRole, this.paramsChMenuForRole).then(data => {
                    if (data.code === 0) {
                        this.getCheckedMenuId(); //2018/10/17
                        this.submitTreeLoading = false;
                    } else {
                        this.$message({
                          message: data.msg,
                          type: 'warning'
                        });
                        this.submitTreeLoading = false;
                    }
                }).catch(error => {
                    this.submitTreeLoading = false;
                })
            },
            getDeparmentTreeData(id=1){
                this.$http.get(this.pagePort.departmentTree+id).then(data=>{
                    this.deparmentTreeData=[data.data];
                    let key=this.defaultKeys;
                })
            },
            deparmentHandleNodeClick (obj, nodeObj){
                this.paramsGetUnauth.param.departmentId = obj.id;
                this.paramsGetUnauth.pageNo = 1;
                this.getDepartmentUser();
                // this.getTeachersList(obj.id);
            },
            // 获取部门下的教职工列表
            getTeachersList (deptId){
                this.$http.get(this.pagePort.getDeparmentTeacherList+deptId).then(data => {
                    if(data.code === 0) {
                        this.staffList.departmentStaffLists = data.data;
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            getArrList(str,come){
                if(come){
                    return this[come][str];
                }
                return this[str];
            },
            setCharge(row){
                this.currentRole = row.name;
                this.curRoleId = row.id;
                this.paramsChMenuForRole.roleId = this.curRoleId;
                this.roleMenuDialog.visible=true;
                this.menuTreeLoading = true;
                this.getCheckedMenuId();
                // this.getRoleMenuTree();
            },
            setSecretary(row){
                this.currentRole = row.name;
                this.curRoleId = row.id;
                this.paramsGetUnauth.param.roleId = row.id;
                this.dialog.jurisdiction=true;
                // this.batchForm.uid = 1;
                this.getUsersByRole();
                this.getDepartmentUser();
            },
            handleTabClick(tab,event){
            
            },
            searchChange(){
               
            },
            // 选中人员 
            handleCheckbox (row){
                this.checkedId.push(row.id);
                this.paramsOptRole.privilegeIds.push(row.id);
                let pos = this.checkedPeopleArr.indexOf(row);
                if (pos < 0) {
                    this.checkedPeopleArr.push(row);
                    this.checked[row.id] = true; // 选中的老师与复选框同步是否选中
                } else {
                    this.checkedPeopleArr.splice(pos, 1);
                    this.checked[row.id] = false; // 选中的老师与复选框同步是否选中
                }
            },
            handleClose(tag) {
                this.checkedPeopleArr.splice(this.checkedPeopleArr.indexOf(tag), 1);
                this.checked[tag.id] = false; // 选中的老师与复选框同步是否选中
            },
            reset(){
                this.checkedPeopleArr = [];
                for (let i in this.checked) {
                    this.checked[i] = false; // 选中的老师与复选框同步是否选中
                }
            },
            // 获取角色已授权人员列表
            getUsersByRole (){
                this.chargeTable.getTeaListParam.param.roleId = this.curRoleId;
                this.$http.post(this.pagePort.findTeachersByRole, this.chargeTable.getTeaListParam).then(data => {
                    this.chargeTable.data = data.data.result;
                    this.chargeTable.total = data.data.totalCount
                })
            },
            chargeTableSizeChange (val){
                this.chargeTable.pageNo = 1;
                this.getUsersByRole();
            },
            chargeTableCurrentChange (val){
                this.chargeTable.pageNo = val;
                this.getUsersByRole();
            },
            // 获取包含已授权
            getDepartmentUser (){
                this.$http.post(this.pagePort.findUnauthTeachersByRole, this.paramsGetUnauth).then(data => {
                
                    this.staffList.departmentStaffLists = data.data.result;
                    this.staffList.totalCount = data.data.totalCount
                })
            },
            unauthSizeChange (val){
                this.paramsGetUnauth.pageNo = 1;
                this.paramsGetUnauth.pageSize = val;
                this.getDepartmentUser();
            },
            unauthCurrentChange (val){
                this.paramsGetUnauth.pageNo = val;
                this.getDepartmentUser();
            },
            // 批量加入
            batchRole (){
                if (this.checkedPeopleArr.length === 0) {
                    this.$message.warning('请选择授权人员！');
                    return ;
                } else {
                    for (var i = 0; i < this.checkedPeopleArr.length; i++) {
                        this.paramsOptRole.unionIds.push(this.checkedPeopleArr[i].unionId);
                    }
                    this.paramsOptRole.opType = 1;
                    
                    this.optTeacherByRole();
                }
            },
            // 删除角色人员
            delTeacherByRole (row){
                this.paramsOptRole.privilegeIds = [];
                this.paramsOptRole.opType = 0;
                this.paramsOptRole.privilegeIds.push(row.id);
                this.paramsOptRole.roleId = this.curRoleId;
                this.paramsOptRole.unionIds.push(row.unionId);
                this.optTeacherByRole();
            },
            optTeacherByRole (){
                this.paramsOptRole.roleId = this.curRoleId;
                this.$http.put(this.pagePort.optRole, this.paramsOptRole).then( data => {
                    if (data.code === 0) {
                        this.checkedId.map((item,i)=>{
                            this.checked[item] = false;
                        })
                        this.activeName = "first";
                        
                        this.getUsersByRole();
                        this.getDepartmentUser();
                        this.paramsOptRole.unionIds = [];
                        this.paramsOptRole.privilegeIds = [];
                        this.reset();
                    } else {
                        this.$message.error(data.msg);
                    }
                    this.checkedId = [];
                }).catch(err => {
                    this.paramsOptRole.unionIds = [];
                })
            },
            handleSelectionChange(val) {

            },
            getRoleType(){/*获取角色类型*/
                this.$http.post("_op:dicts/getDictsList",{type:"organization-category"})
                .then(data => {
                    if(data.code==0){
                        this.optionList.nature = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            compareArrDiff (moreArr, lessArr){
                let arr3 =[];  
                for (let key in moreArr) {
                    let stra = moreArr[key];
                    let count = 0;  
                    for(let j= 0; j < lessArr.length; j++){  
                        let strb = lessArr[j];  
                        if(stra == strb) {  
                            count++;  
                        }  
                    }  
                    if(count===0) {//表示数组1的这个值没有重复的，放到arr3列表中
                        arr3.push(stra);  
                    }  
                }  
                return arr3;
            }
        },
        
    }
</script>

<style scoped lang="less">
    @fff:#fff;
    .character-table{
        padding:10px 24px 10px 10px;
        background-color: @fff;
    }
    .people-box{
        position: relative; 
        z-index: 10;
        width: 60px; 
        height: 40px; 
        box-sizing: border-box; 
        border:1px solid #ddd; 
        border-radius: 4px; 
        margin-right:20px; 
        padding-top: 2px;
        padding-left: 15px;
        .people-bage{
            position: absolute;
            top: -10px; 
            right:-10px; 
            z-index: 666; 
            padding:2px 6px;
            background-color: #f00; 
            color:#fff;
            border-radius: 50%;
        }
        .people-inner-box{
            position: absolute; 
            top:41px; 
            right:0; 
            z-index: 333; 
            width:200px; 
            min-height: 50px; 
            padding:15px; 
            height: auto; 
            box-shadow: 0 0 3px 1px #eee;
            background-color: #fff;
        }
    }
</style>

<style lang="less">
.boxForm{
    width:100%;
    height:200px;
   

}
    .role-menu-dialog {
        .el-dialog__body {
            min-height: 150px;
            height: 350px;
            overflow-y: auto;
        }
    }
    
    .add-pane .el-tabs__content{
        overflow: unset;
    }

</style>