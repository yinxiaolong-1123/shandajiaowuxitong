<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search-human"></div>
        <div class="cm-flex">
            <div class="cm-tree cm-flex-item" style="width: 320px; position: relative;">
                <el-input type="text" size="medium" placeholder="请输入姓名（回车搜索）"
                    class="cm-search normal"  v-model="searchName" @keyup.enter.native="getUsersByPeople" @clear="getUsersByPeople"></el-input>
                <el-button
                  icon="el-icon-search" 
                  size="mini" 
                  style="font-size: 18px; border:none; padding:5px; margin-top:5px; color:#ccc; position: absolute; left:180px;" 
                  @click="getUsersByPeople">
                </el-button>
                <el-tree 
                    :data="treeData" 
                    :props="defaultProps" 
                    @node-click="handleNodeClick"
                    @node-expand="handleNodeExpand" 
                    @node-collapse="handleNodeCollapse"
                    :expand-on-click-node="false"
                    highlight-current node-key="id" 
                    ref="tree" 
                    :default-expanded-keys="expandKeys"
                ></el-tree>
            </div>
            <div class="cm-table cm-flex-item" style="width: 72%;">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%;"
                    size="mini"
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                >
                    <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                    <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                        <!-- <template slot-scope="scope"></template> -->
                    </el-table-column>
                    <el-table-column
                    	v-if="btnPerObj.rolebtn"
                        fixed="right"
                        label="操作"
                        width="180">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showRoleDialog(scope.row)">角色授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="cm-pagination" style="height: 32px; margin:20px 0;">
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
            </div>
        </div>
        
        <!-- 角色授权 -->
        <el-dialog
            title="角色授权"
            :visible.sync="dialog.visible"
            width="800px"
            append-to-body
            @closed="roleClose"
            :close-on-click-modal="false"
            custom-class="cm-dialog-big add-pane"
        >
            <p class="clear" style="position: relative; z-index: 5;"><span class="right" style="position: absolute; right:5px; top:9px; z-index: 2;">当前人员：{{ roleAuthList.currentTeacher }}</span></p>
            <el-tabs  v-model="roleAuthList.activeName">
                <el-tab-pane label="已授权角色" name="first">
                    <div class="cm-table">
                        <el-table
                            ref="multipleTable"
                            :data="roleAuthList.roleData"
                            border
                             align="center"
                            style="width: 100%;"
                            header-row-class-name="cm-dark"
                            element-loading-background="rgba(255, 255, 255, 0.8)">

                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column v-for="(item, index) in roleAuthList.tableList" :label="item.label" :prop="item.prop" :key="index">
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="deleteTeacherRole(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="新增授权" name="second">
                    <div class="clear option-btn-box" style="margin-bottom: 20px;">
                        
                        <el-button class="right" type="primary" @click="addTeacherRoles">批量加入</el-button>

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
                                            @close="handleClose(item)">
                                            {{item.name}}
                                        </el-tag>
                                    </template>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div class="cm-table">
                        <el-table
                            ref="multipleTable"
                            :data="roleAuthList.addTeacherRoleData"
                            border
                             align="center"
                            style="width: 100%;"
                            header-row-class-name="cm-dark"
                            element-loading-background="rgba(255, 255, 255, 0.8)">

                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column v-for="(item, index) in roleAuthList.tableList" :label="item.label" :prop="item.prop" :key="index">
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <template v-if="scope.row.isDelete === 1">
                                        <el-button type="text" size="small" @click="">
                                            已选择
                                        </el-button>
                                    </template>
                                    <template v-else>
                                        <el-checkbox name="type" :ref="`checkbox${scope.row.id}`" v-model="checked[scope.row.id]" @change="handleCheckbox(scope.row)"></el-checkbox>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    
                    <!-- <div class="cm-pagination">
                        <el-pagination
                            background
                            :current-page="roleAuthList.pageNo"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="roleAuthList.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="roleAuthList.optTotalCount"
                            @size-change="roleAuthListSizeChange"
                            @current-change="roleAuthListCurrentChange"
                        >
                        </el-pagination>
                    </div> -->
                </el-tab-pane>
            </el-tabs>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    //每个模块的type 和remark是固定不允许改变的
    const TYPE='human-authority';
    const REMARK='人员权限';
    const treeID=1;//树结构起始id；
    import {mapState} from 'vuex'

    export default {
        name: TYPE,
        data() {
            let commonRules=msg=>{
                return {required: true, message: msg, trigger: 'blur' }
            };
            return {
                breadcrumb: [
                    {label: "权限管理"},
                    {label: "人员角色"}
                ],
                // 表格头
                tableList:[
                    {label:'姓名', prop:'name',width:160},
                    {label:'工号', prop:'teacherNo',width:120},
                    {label:'部门职务', prop:'positionName'}
                ],
                searchName:"",
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    name:'',
                    universityCode:'',
                },
                pagePort:{
                    tree:'_op:admin/department/tree/', // 部门树
                    list:'_op:admin/department/list/',
                    // getDeparmentTeacherList: '_op:teachers/filter/', // get params: {deptId}
                    getDeparmentTeacherList: '_op:teachers/teacher/list', // get params: {deptId}
                    operation:'_op:admin/department',
                    roleLists: '_op:role/role/associate', // 根据人员查询其已关联的角色列表 params: {unionId}
                    // delUserRole: '/user/delUserRole',
                    unauthRole:'_op:role/role/un/associate',// 根据人员查询未关联的角色列表 {unionId}
                    getRolesByUid:'/users/getRolesByUid', // get: /users/getRolesByUid/{uid}
                    delTeacherRole:'_op:roles/delUserRole', // 删除教职工的角色中
                    addTeacherRoles: '_op:roles/agree', // 增加教职工的角色中
                    optRoleByTeacher:'_op:role/associate/role' // 给某人员添或取消加角色
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
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableRadio:1,
                targetId:'',
                departmentId:1,
                parentId:treeID,
                tarNode:'',
                parentNode:'',
                treeData:[],
                defaultKeys:treeID,
                expandKeys:[],
                staffList:{
                    title:'人员列表',
                    visible:false,
                    tableList:[
                        {label:'姓名',prop:'name'},
                        {label:'工号',prop:'teacherNo'},
                        {label:'手机号',prop:'name'},
                        {label:'职务',prop:'name'},
                    ],
                    currentDepartment:'教研室',
                    search:'',
                    pageNo:1,
                    pageSize:10,
                    totalCount:1,
                },
                uid:'',
                selPeople: false,
                checkedPeopleArr:[], // 批量勾选显示
                checked:{},
                roleIdList:[],
                curUnionId:'',
                paramsOptRole: {
                    opType: 0,
                    roleIds: [],
                    unionId: 0
                },
                roleAuthList: {
                    visible: false,
                    activeName:'first',
                    currentTeacher: '',
                    tableList: [
                        {label:'角色名称',prop:'name'},
                        {label:'角色类型',prop:'typeName'}
                    ],
                    // 已授权角色
                    roleData:[],
                    roleTypeList:[],//角色类型
                    // 新增授权
                    addTeacherRoleData: [],
                    pageNo:1,
                    pageSize:10,
                    totalCount:1,
                    optTotalCount:0,
                    rids:[], // 批量加入角色id
                    optRoleParams:{
                        uid:1, // 当前用户id
                        name: '', // 角色名称
                        currPage: 1,
                        pageSize: 10
                    }
                },
                roleOprationList: {
                    visible: false,
                    activeName: 'first',
                    valSearch: '',
                    currentTeacher: '',
                    tableList: [
                        {label:'业务类型',prop:'optType'},
                        {label:'角色类型',prop:'roleType'}
                    ],
                    hadOptData:[
                        {id:1, optType:'规培业务'},
                        {id:2, optType:'教务业务'},
                    ],
                    addOptData:[

                    ],
                    // 数据授权 -> 新增权限
                    optSelectTableList:[
                        {label:'已选择部门', prop:'name'},

                    ],
                    currPage:1,
                    pageSize:10,
                    totalCount:0,
                    optSelectData:[]
                },
                tempArr:[],
                tranfer:[],
                treeTeamArr: [],
				btnPerObj:{//按钮权限
					rolebtn:false
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
            this.getTreeData();
            this.getTeachersList();
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
						if (item.code=="role_grant_renyuanjuese") {
	            		self.btnPerObj.rolebtn=true;
	            	}
                    });
                }).catch(()=>{
                })
            },
            getUsersByPeople() {
                this.$http.post("_op:teachers/list",{param:{name:this.searchName}}).then(data => {
                    if(data.code === 0) {
                      this.tableData = data.data.result;
                      this.totalCount = data.data.totalCount;
                    }
                })
            },
            roleClose(){
                this.roleIdList.map((item,i)=>{
                    this.checked[item] = false;
                });
                this.checkedPeopleArr = [];
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            // 获取部门下的教职工列表
            getTeachersList (deptId = 1){
                this.tableLoading = true;
                // this.$http.get(this.pagePort.getDeparmentTeacherList+deptId).then(data => {
                this.$http.post(this.pagePort.getDeparmentTeacherList,{
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    param: {
                        departmentId: deptId
                    }
                }).then(data => {
                 
                    if(data.code === 0) {
                        this.tableData = data.data.result;
                        this.totalCount = data.data.totalCount;
                        this.tableLoading = false;
                        
                    }
                }).catch(error => {
                    this.$message.error(error.msg);
                    this.tableLoading = false;
                })
            },
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize=size;
                this.getTeachersList(this.departmentId);
            },
            currentChange(current){
                this.pageNo = current;
                this.getTeachersList(this.departmentId);
            },
            dialogClose(){
                //关闭弹窗时重置数据
                // this.$refs.formDialog.resetFields();
            },
            handleNodeClick(obj,nodeObj) {
                this.departmentId = obj.id;
                this.tarNode=obj;
                
                this.defaultKeys=obj.id;
                this.getTeachersList(this.departmentId);
            },
            handleNodeExpand(obj){
                this.extendTree(obj.id);
            },
            handleNodeCollapse(obj){
                this.collapseTree(obj.id);
            },
            optHandleNodeClick (obj,nodeObj){ // 选择的角色组
                let selectOjb = {}; 
                selectOjb.id = obj.id
                selectOjb.name = obj.name
                this.tempArr = obj;
                this.parentNode=nodeObj.parent;
                this.targetId=obj.id;
                this.parentId=obj.id;
                this.roleOprationList.optSelectData.push(selectOjb);
            },
            opthandleNodeExpand (obj){
              
            },
            getTreeData(id=1){
                this.$http.get(this.pagePort.tree+id).then(data=>{
                    this.treeData=[data.data];
                    let key=this.defaultKeys;
                    this.extendTree(key);//设定默认展开的
                    
                })
            },
            getArrList(str){
                return this[str];
            },
            showRoleDialog (row){
                this.dialog.visible = true;
                this.roleAuthList.currentTeacher = row.name;
                this.uid = row.id;
                this.curUnionId = row.unionId;
                this.getHadRole();
                this.getOptRole();
                this.getRoleType();
            },
            showOptAuth (row){
                this.roleOprationList.visible = true;
                this.roleOprationList.currentTeacher = row.name
            },
            showStaffList(row){
                this.staffList.visible=true;
            },
            tabsHandleClick (tab){
                if(tab.name == 'second') {
                    this.setSelectDep(); // 默认设置已选择的部门树
                }
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
            },
            // 选择部门
            getDepNode (){
             
                this.treeTeamArr = this.$refs.authDepTree.getCheckedNodes();
                this.$refs.authDepTree.setCheckedNodes([]);
            },
            // 获取已授权角色列表
            getHadRole (){
                this.$http.get(`${this.pagePort.roleLists}/${this.curUnionId}`).then(data => {
                    if (data.code === 0) {
                        this.roleAuthList.roleData = data.data;
                    
                        for(let list of this.roleAuthList.roleData){
                            for(let item of this.roleTypeList){
                                if(list.type==item.id){
                                    list.typeName = item.name;
                                }
                            }
                        }
                    }
                })
            },
            // 获取包含是授权状态的角色列表
            getOptRole (){
                 this.$http.get(`${this.pagePort.unauthRole}/${this.curUnionId}`).then(data => {
                    this.roleAuthList.addTeacherRoleData = data.data;
                    this.roleAuthList.optTotalCount = data.data.total;
                    //根据组织类型获取角色类型
                    for(let list of this.roleAuthList.addTeacherRoleData){
                        for(let item of this.roleTypeList){
                            if(list.type==item.id){
                                list.typeName = item.name;
                            }
                        }
                    }
                })
            },
            getRoleType(){/*获取角色类型*/
                this.$http.post("_op:dicts/getDictsList",{type:"organization-category"})
                .then(data => {
                    if(data.code==0){
                        this.roleTypeList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            // 删除已授权角色
            deleteTeacherRole (row){
                this.paramsOptRole.opType = 0;
                this.paramsOptRole.roleIds.push(row.id);
                this.paramsOptRole.unionId = row.unionId
                
                this.optRoleByTeacher();
            },
            // checkbox选中角色组
            handleCheckbox (row){
                this.roleIdList.push(row.id);
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
            roleNameChange (){
                this.roleAuthList.pageNo = 1;
                if (!this.roleAuthList.optRoleParams.name) {
                    this.$message.error('请输入角色名称！')
                } else {
                     this.getOptRole();
                }
            },
            // 新增授权
            addTeacherRoles (){
                for (let i = 0; i < this.checkedPeopleArr.length; i++) {
                    this.paramsOptRole.roleIds.push(this.checkedPeopleArr[i].id)
                }

                if (this.paramsOptRole.roleIds.length < 1) {
                    this.$message.warning('您还没选择授权的角色！');
                    return ;
                } else {
                    this.paramsOptRole.opType = 1;
                    this.paramsOptRole.roleIds = new Set(this.paramsOptRole.roleIds)
                    this.optRoleByTeacher();
                }
            },
            roleAuthListSizeChange (val){
                this.roleAuthList.pageNo = 1;
                this.getOptRole();
            },
            roleAuthListCurrentChange (val){
                this.roleAuthList.pageNo = 1;
                this.roleAuthList.pageSize = val;
                this.getOptRole();
            },
            optRoleByTeacher (){
                this.paramsOptRole.unionId = this.curUnionId;
                this.$http.put(this.pagePort.optRoleByTeacher, this.paramsOptRole).then(data => {
                    let type = "success";
                    let message = "操作成功！"
                    if (data.code === 0) {
                        this.getHadRole();
                        this.getOptRole();
                        this.paramsOptRole.roleIds = [];
                        this.reset();
                        this.roleIdList.map((item,i)=>{
                            this.checked[item] = false;
                        });
                        if(data.msg!="ok"){
                            type = "warning";
                            message = data.msg;
                        }
                        this.roleAuthList.activeName = "first";
                    }else{
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        type:type,
                        message:message
                    })
                    this.roleIdList = [];
                }).catch(error => {
                    this.paramsOptRole.roleIds = [];
                })
            },
            roleSizeChange (){

            },
            roleCurrentChange (){

            }

        },
       
    }
</script>

<style lang="less">
    .my-opt-dialog {
        .left-wrapper {
            background-color: #f0f0f0;
            padding: 10px;
            line-height: 36px;
            text-align: center;
            ul {
                min-height: 180px;
                max-height: 260px;
                background-color: #fff;
            }
            li {
                height: 36px;
                
                cursor: pointer;
                border-bottom: 1px solid #eee;
            }
        }
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
    /deep/ .el-tab-pane{
        padding-top: 10px; 
    }
</style>
