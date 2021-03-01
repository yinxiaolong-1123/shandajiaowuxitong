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
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="param.name" placeholder="请输入姓名" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="工号">
                            <el-input v-model="param.teacherNo" placeholder="请输入工号" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="部门">                         
                            <!-- <el-autocomplete value-key='name' clearable v-model="param.departmentName"
                                :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
                            </el-autocomplete> -->
                            <el-select v-model="param.departmentid" filterable clearable>
                                <el-option v-for="item in allDepartments" :value="item.id" :label="item.name" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="param.status" placeholder="请选择状态" style="width:100%;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="启用" :value="1"></el-option>
                                <el-option label="禁用" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="职称">
                            <el-select v-model="param.positionId" filterable placeholder="请选择职称" style="width:100%;">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in optionList.positional" :label="item.name"
                                    :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="search" v-if="btnPerObj.query">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con">
            <el-button size="mini" type="primary" @click="addItem" v-if="btnPerObj.add">新增</el-button>
            <el-button size="mini" @click="importTeacherList" v-if="btnPerObj.import">导入名单</el-button>
            <el-button size="mini" @click="syncFromUC">从其他系统同步</el-button>
            <el-dropdown @command="handleCommand" size="mini" v-if="btnPerObj.opt" trigger="click" placement="bottom"
                style="margin-left:10px;">
                <el-button type="default" size="mini">
                    批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="forbidden" :disabled="forbidden">禁用</el-dropdown-item>
                    <el-dropdown-item command="enabled" :disabled="enabled">启用</el-dropdown-item>
                    <el-dropdown-item command="deleteAll" :disabled="deleteAll">删除</el-dropdown-item>
					<!--
						<el-dropdown-item command="resetPwd" :disabled="resetPwd">重置密码</el-dropdown-item>
					-->
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="cm-table">
            <el-table ref="multipleTable" :data="tableData" border style="width: 100%" size="mini"
                header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"
                    :width="item.width">
                    <template slot-scope="scope">

                        <template v-if="item.prop==='status'">
                            {{Number(scope.row.status)===1?'启用':'禁用'}}
                        </template>
                        <template v-else-if="item.prop==='departments'">
                            {{ scope.row[item.prop] | showDeptName}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column v-if="btnPerObj.edit||btnPerObj.reset||btnPerObj.delete" fixed="right" label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑
                        </el-button>
                        <el-button type="text" size="small" @click="resetTeachersPwd(scope.row)" v-if="btnPerObj.reset">
                            重置密码</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;"
                            v-if="btnPerObj.delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 30, 35, 40, 50, 100]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增教职工对话框 -->
        <el-dialog :title="(dialog.status==='add'?'新增':'编辑')+type" :visible.sync="dialog.visible" width="800px"
            append-to-body :close-on-click-modal="false" @closed="dialogClose" @click.prev="hideca">
            <el-form :model="formDialog" :rules="rules" ref="formDialog"
                class="cm-flex-wrap big-form teacing-staff-addform">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index" :label="item.label" :prop="item.prop"
                    :rules="item.rule" class="flex-form" :style="`width: ${item.width}; margin-left:${item.ml}`">

                    <el-select v-if="item.type==='select1'" v-model="formDialog[item.prop]" :prop="item.prop"
                        :placeholder="'请选择'+item.label" style="width:100%;"
                        @change="testSelect(formDialog[item.prop],item.prop)">
                        <el-option v-for="item2 in getArrList(item.list, item.dataCome)" :key="item2.id"
                            :label="item2.name" :value="item2.id"></el-option>
                    </el-select>

                    <el-select v-else-if="item.type==='select2'" :disabled="dialog.status!='add' && !cardNoEditabled"
                        v-model="formDialog.cardCategoryId" :prop="item.prop" :placeholder="'请选择'+item.label"
                        style="width:100%;" @change="testSelect(formDialog[item.prop],item.prop)">
                        <el-option v-for="item2 in getArrList(item.list, item.dataCome)" :key="item2.id"
                            :label="item2.cnName" :value="item2.id"></el-option>
                    </el-select>

                    <el-select v-else-if="item.type==='selectdep'" value-key="id" v-model="formDialog[item.prop]" multiple clearable filterable
                        style="width:100%;" placeholder="请输入部门名称">
                        <el-option v-for="item in allDepartments" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>

                    <el-radio-group v-else-if="item.type==='radio'" v-model="formDialog[item.prop]" :prop="item.prop">
                        <el-radio v-for="(radioItem, radioItemIndex) in item.options" :key="radioItemIndex"
                            :label="radioItem.value">{{radioItem.label}}</el-radio>
                    </el-radio-group>
                    <el-input v-else-if="item.prop == 'teacherNo'" v-model="formDialog['teacherNo']"
                        :placeholder="'请输入'+item.label"
                        :disabled="dialog.status!='add' && formDialog.teacherNo.length > 0"
                        @blur="testInput(formDialog[item.prop],item.prop)">
                    </el-input>

                    <el-input v-else-if="item.prop == 'mobile'" v-model="formDialog['mobile']"
                        :placeholder="'请输入'+item.label" :disabled="dialog.status!='add' && !mobileEditabled"
                        @blur="testInput(formDialog[item.prop],item.prop)">
                    </el-input>

                    <el-input v-else-if="item.prop == 'cardNo'" v-model="formDialog['cardNo']"
                        :placeholder="'请输入'+item.label" :disabled="dialog.status!='add' && !cardNoEditabled"
                        @blur="testInput(formDialog[item.prop],item.prop)">
                    </el-input>

                    <el-input v-else v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                        @blur="testInput(formDialog[item.prop],item.prop)">
                    </el-input>
                </el-form-item>
                <el-form-item label="发送短信验证" prop="sendValidMessage" class="flex-form">
                    <el-radio-group v-model="formDialog.sendValidMessage" @change="changeMobileRequire">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" class="flex-form">
                    <el-radio-group v-model="formDialog.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span v-if="teacherDetail === false" slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary"
                    @click="commonValidate('formDialog',dialog.status==='add'?'post':'put',formDialog)">确 定</el-button>
            </span>
            <span v-else slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :model-append-to-body="false"
            :before-close="handleClose">
            <span>存在相似教职工信息，{{teacherName+"性别"+teacherGender}} 是否继续添加？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
         </el-dialog> -->
        <!-- 导入名单对话框 -->
        <el-dialog title="批量导入教职工" :visible.sync="importTeacherDialog" width="450px" append-to-body
            :close-on-click-modal="false" @closed="" class="import-teachers-list">
            <p style="margin-bottom: 30px;">下载模版 <a href="../../../template/teachers-template.xls"
                    download='教职工基本信息导入模板'><span class="link-module-file"
                        style="color:#409eff; text-decoration: underline; cursor:pointer;">教职工基本信息导入模板.xlsx</span></a>
            </p>
            <el-upload class="upload-demo" ref="upload" action="/operation/data/admin/teachers/importTeachers"
                :file-list="fileList" :on-success="onSuccess" :on-change="fileSelected" :before-upload="onBefore"
                :headers="headers" :auto-upload="false">
                <el-button slot="trigger" size="small">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">导入</el-button>
            </el-upload>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import {
        mapState
    } from 'vuex' //1
    import {
        encodeQueryParam
    } from '@/api/utils'
    import Department from '@/api/department'
    export default {
        name: 'teaching-staff',
        data() {
            let commonRules = msg => {
                return {
                    required: true,
                    message: '请输入' + msg,
                    trigger: 'blur'
                }
            };
            let mobile = msg => {
                return {
                    validator: validateMmobile,
                    message: '请输入手机号',
                    trigger: 'blur'
                }
            };
            let cardNo = msg => {
                return {
                    min: 18,
                    max: 18,
                    message: '长度在 18个字符',
                    trigger: 'blur'
                }
            };
            let cardInfo = msg => {
                return {
                    max: 40,
                    message: '长度不能超过40个字符',
                    trigger: 'blur'
                }
            };
            var validateMmobile = (rule, value, callback) => {
                let val = !(/^1[34578]\d{9}$/.test(value))
                if (val && value != '') {
                    this.$message({
                        message: '手机号码有误，请输入有效手机号',
                        type: 'warning'
                    });
                } else {
                   
                    callback();
                }
            };
            return {
                mobileEditabled: false,
                cardNoEditabled: false,
                loading: false,
                Jurisdiction: false, //输入框为TRUE 不给编辑
                dialogVisible: false, //提示弹窗
                props: {
                    value: 'id',
                    label: "name"
                },

                allDepartments: [],
                headers: {
                    Access_Token: localStorage.getItem('token'),
                    Authorization: localStorage.getItem('token')

                },
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                param: { //列表参数
                    name: '',
                    departmentid: '',
                    teacherNo: '',
                    departmentName: '',
                    status: '',
                    positionId: ''
                },
                restaurants: [],

                timeout: null,
                optionItem: [],

                optionList: {
                    positional: [], //职称列表
                    selectDeparment: [], //部门列表
                    cardCategory: [] //证件类别
                },
                cardNum: "", //证件号
                cardNumName: "", //证件号
                cardType: "", //证件类型
                cardTypeName: "", //证件类型名称
                phone: "", //手机号
                username: "", //工号
                usernameId: "", //用户名id
                phoneId: "", //手机号码id
                phoneName: "", //手机号码有值名字
                phoneGender: "", //手机号码有值性别
                editFormDetail: [{
                        label: '姓名',
                        prop: 'name',
                        length: 40,
                        editDisabled: false,
                        rule: commonRules('姓名')
                    },
                    {
                        label: '工号',
                        prop: 'teacherNo',
                        length: 20,
                        editDisabled: true,
                        rule: commonRules('工号')
                    },
                    {
                        label: '职称',
                        prop: 'positionalTitleId',
                        type: "select1",
                        editDisabled: false,
                        rule: commonRules('职称'),
                        list: 'positional',
                        dataCome: 'optionList'
                    },
                    {
                        label: '性别',
                        prop: 'sex',
                        editDisabled: false,
                        type: 'radio',
                        options: [{
                            label: '男',
                            value: 1
                        }, {
                            label: '女',
                            value: 0
                        }],
                        rule: commonRules('性别')
                    },
                    {
                        label: '手机号',
                        prop: 'mobile',
                        type: "mobile",
                        editDisabled: true
                    },
                    {
                        label: '邮箱',
                        prop: 'email',
                        length: 40,
                        editDisabled: false
                    },
                    {
                        label: '证件类型',
                        prop: 'cardCategoryId',
                        editDisabled: false,
                        type: "select2",
                        list: 'cardCategory',
                        dataCome: 'optionList',
                    },
                    {
                        label: '证件号码',
                        prop: 'cardNo',
                        rule: cardNo('证件号码'),
                        editDisabled: true,
                    },
                    {
                        label: '一卡通信息',
                        prop: 'cardInfo',
                        rule: cardInfo('一卡通信息'),
                        editDisabled: false,
                        ml: '-0.3em'
                    },
                    {
                        label: '办公地址',
                        prop: 'address',
                        length: 100,
                        editDisabled: false
                    },
                    {
                        label: '部门',
                        prop: 'departments',
                        editDisabled: false,
                        type: 'selectdep',
                        rule: commonRules('部门'),
                        list: 'selectDeparment',
                        dataCome: 'optionList',
                        width: '100%'
                    },
                    // {label:'发送短信验证', prop:'sendValidMessage', editDisabled:false, type:'radio', options: [{label:'是', value:true}, {label:'否', value: false}]}
                ],
                rules: {
                    mobile: [{
                            required: false,
                            message: '请输入手机号',
                        },
                        {
                            validator: validateMmobile,
                            trigger: 'blur'
                        }
                    ],
                    sendValidMessage: [{
                        required: true,
                        message: '请选择是否发送短信验证',
                        trigger: 'blur'
                    }]
                },
                dialog: {
                    status: 'add',
                    visible: false,
                },
                formDialog: {
                    address: '',
                    cardCategoryId: '',
                    cardInfo: '',
                    cardNo: '',
                    createTime: '', /// "2018-07-30T11:20:22.089Z"
                    createUserId: 1,
                    // departmentList: [],
                    // departmentIds: [],
                    departments: [],
                    email: '',
                    mobile: '',
                    name: '',
                    positionalTitleId: '',
                    sex: 1,
                    status: 0,
                    teacherNo: '',
                    id: '', // 教职工id
                    unionId: '',
                    sendValidMessage: ''
                },
                type: '教职工',
                forbidden: false,
                enabled: false,
                deleteAll: false,
                resetPwd: false,
                breadcrumb: [{
                        label: "基础数据"
                    },
                    {
                        label: '教职工管理'
                    },
                ],
                importExcelData: [], // 导入教职工基本信息表数据 
                positionList: [], // 职称列表
                fileList: [], // 上传文件列表
                tableList: [{
                        label: '姓名',
                        prop: 'name'
                    },
                    {
                        label: '工号',
                        prop: 'teacherNo'
                    },
                    {
                        label: '手机号',
                        prop: 'mobile'
                    },
                    {
                        label: '所属部门',
                        prop: 'departments',
                        width:350
                    },
                    {
                        label: '职称',
                        prop: 'positionName',
                        width:100
                    },
                    {
                        label: '角色',
                        prop: 'roleName',
                         width:240
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        width:100
                    },
                ],
                dictsParam: {
                    cnName: '',
                    code: '',
                    type: 'ID-category',
                },
                importTeacherDialog: false, // 导入名单对话框
                tableData: [],
                pagePort: {
                    cardType: '_op:dicts/list',
                    addTeacher: '_op:teachers',
                    addTeacherBatch: '_op:teachers/add/list',
                    // getAllDeparment: '_op:admin/department/list/0/1', // 获取所有部门   原有接口
                    // getAllDeparment: '_auth:orgDepartment/department'  ,// 获取所有部门   更改后接口
                    getAllDeparment: '_auth:/department/tree', // 获取所有部门   更改后接口


                    depList: '_op:admin/department/tree/', // 获取部门树
                    positionLsit: '_op:dicts/position/list', // 获取职称列表
                    table: '_op:teachers/list', // 查询教职工列表
                    status: '_op:teachers/status', // 职工状态变更 批量put  单个用post
                    deleteTeacher: '_op:teachers/', // delete: teachers/{id} 单个删除；  
                    deleteTeacherList: '_op:teachers/remove/list', // delete: /teachers/remove/list 批量删除
                    change: '_op:majorCode',
                    option: '_op:majorCategory/getMajorCategoryList',
                    resetTeachersPwd: '_auth:/user/password/reset/'
                },
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                tableLoading: false,
                resetPwdIds: [],
                selectTeacherLists: [],
                teacherDetail: false,
                fileList: [],
                treeData: [],
                paramResetPwd: {
                    optType: 2, // 操作类型；1：修改 2：重置 (当前页面只用2)
                    password: '168168', // resetPwd
                    unionIds: [],
                    userType: 1

                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                expandKeys: [],
                depSelects: [],
                isShow: false,
                iconDelShow: false,
                btnPerObj: { //按钮权限
                    add: true,
                    query: true,
                    edit: true,
                    delete: true,
                    import: true,
                    opt: true,
                    reset: true,
                },
                teacherName: "", //老师名字
                teacherId: "", //id
                teacherGender: "", //老师性别  
            }
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
                if (window.innerWidth <= 1280) {
                    this.pageNo = 1
                    this.pageSize = 10
                    this.getTableData();
                }
                if (window.innerWidth >= 1280 && window.innerWidth <= 1360) {
                    this.pageNo = 1
                    this.pageSize = 20
                    this.getTableData();
                }
                if (window.innerWidth >= 1360 && window.innerWidth <= 1600) {
                    this.pageNo = 1
                    this.pageSize = 30
                    this.getTableData();
                }
                if (window.innerWidth >= 1600 && window.innerWidth <= 1768) {
                    this.pageNo = 1
                    this.pageSize = 35
                    this.getTableData();
                }
                if (window.innerWidth >= 1768 && window.innerWidth <= 1920) {
                    this.pageNo = 1
                    this.pageSize = 40
                    this.getTableData();
                }
                if (window.innerWidth >= 1920) {
                    this.pageNo = 1
                    this.pageSize = 50
                    this.getTableData();
                }
            };
            // 
            util.openBtnPermit(this.btnPerObj);
            //          this.getBtnPermit();//按钮权限
        },
        created() {
            this.getTableData(); //查询列表
            this.getPosList(); //查询职称列表
            this.getDepList();// 获取部门列表
            this.getCardType(); // 获取证件类别
            //          this.getOptionItem();
        },
        computed: {
            ...mapState(['btnPermitList']), //33333333
        },
        filters: {
            showDeptName(val) {
                if (Array.isArray(val)) {
                    return val.map(d => d.name).join(",");
                }
                return val;
            }
        },
        methods: {
            // 从UC同步教职工
            syncFromUC() {
                const loading = this.$loading({
                    lock: true,
                    text: "数据同步中...",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$http.get(`_op:/teachers/sync/uc`).then(resp => { 
                    loading.close();
                    this.$message.success("同步成功，新增" + resp.data.add + "个教职工," + "修改" + resp.data.edit + "个教职工信息");
                }).catch(err => {
                    loading.close();
                    this.$message.error("教职工数据同步失败，请联系管理员"+'['+err.code+']');
                })
            },
            //提示弹窗关闭
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            // 校验
            testInput(value, prop) {
             
                if (prop === "mobile") { //手机号码
                    //  this.inputCheck('phone',value);
                }
                if (prop === "teacherNo") { //工号
                    // this.inputCheck('username',value);
                }
                if (prop === "cardNo") { //证件号码
                    // this.inputCertificate("cardNum",value);
                }

            },
            changeMobileRequire(value) {
                if (value) {
                    this.rules.mobile[0].required = true;
                } else {
                    this.rules.mobile[0].required = false;
                    this.$refs.formDialog.clearValidate('mobile');
                    if (this.dialog.status === 'add') {
                        this.formDialog.mobile = '';
                    }
                }
            },
            testSelect(value, prop) {
                if (prop === "cardCategoryId") { //证件类型
                    //    this.inputCertificate("cardType",value);
                    
                }

            },
           
            handleChange(value) {
              
            },
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                  
                    data.data.map(item => {
                        if (item.code == "query_jiaozhigong") {
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "add_jiaozhigong") {
                            self.btnPerObj.add = true;
                        }
                        if (item.code == "edit_jiaozhigong") {
                            self.btnPerObj.edit = true;
                        }
                        if (item.code == "del_jiaozhigong") {
                            self.btnPerObj.delete = true;
                        }
                        if (item.code == "import_list_jiaozhigong") { //导入

                            self.btnPerObj.import = true;
                        }

                        if (item.code == "opt_batch_jiaozhigong") { //批量操作
                            self.btnPerObj.opt = true;
                        }

                        if (item.code == "reset_password_jiaozhigong") { //重置密码
                            self.btnPerObj.reset = true;
                        }

                    });
                }).catch(() => {

                })
            },
            // let params=`terms[0].column=name$LIKE&terms[0].value=%${searchText}%`;  根据不同的组织查部门
            // // 获取部门列表
            //获取 新增部门数据
            getDepList() {
               this.$http.get(`_op:/admin/department/byname`).then(resp => {
                   this.allDepartments = [].concat(resp.data);
               }).catch(err => console.error(err));
            },
            //  如果没有子数据，删除子数据
            deleteChildren(arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].children && arr[i].children.length < 1) {
                        delete arr[i].children;
                    } else {
                        let children = arr[i].children
                        this.deleteChildren(children);
                    }
                }
               
            },
           
            querySearchAsync(queryString, cb) {
                this.$http.get(`_op:/admin/department/byname/${queryString}`).then(resp => {
                    cb(resp.data);
                }).catch(err => {
                    console.error(err);
                })
                // if (queryString.length > 1) {
                //     let self = this;
                //     let params = encodeQueryParam({
                //         name$LIKE: queryString,
                //         code$LIKE: queryString
                //     });
                //     Department.list(params).then(res => {
                //         self.restaurants = res.data;
                //         clearTimeout(self.timeout);
                //         self.timeout = setTimeout(() => {
                //             cb(self.restaurants);
                //         }, 3000 * Math.random());

                //     });
                // }

            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.name.indexOf(queryString) === 0);
                };
            },
            handleSelect(item) {
                // if(this.param.departmentName==''){
                //      this.param.departmentid = ''
                // }else{
                //     this.param.departmentid = item.id
                // }
                //  this.param.departmentid  = 'e8b76c10393d703fd375518d4baa51f6'
                this.param.departmentid = item.id

              
            },
            //请求部门数据
            getDepartmentTree() {
                this.$http.get("_auths:/department/tree").then(res => {
                  
                })
            },

            getTableData() { //查询列表
                // if (this.param.departmentName == '') {
                //     this.param.departmentid = ''
                // }
                this.tableLoading = true;
                // this.$http.post('_op:teachers/list',{
                this.$http.post('_op:teachers/list', {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    param: this.param
                }).then(data => {
                    if (data.code === 0) {
                        this.tableData = data.data.result;
                        this.pageNo = data.data.pageNo;
                        this.pageSize = data.data.pageSize;
                        this.totalCount = data.data.totalCount;
                        this.tableLoading = false;
                    } else {

                    }
                }).catch(() => {
                    this.tableData = [];
                    this.tableLoading = false;
                })
            },
            //          getOptionItem(){//查询专业分类
            //              this.$http.post('_op:majorCategory/getMajorCategoryList',{}).then(data=>{
            //                  this.optionItem=data.data;
            //              })
            //          },
            // 获取职称列表
            getPosList() {
                this.$http.get('_op:dicts/position/list').then(data => {
                    if (data.code === 0) {
                        this.optionList.positional = data.data;
                    }
                })
            },

            // 获取证件类别
            getCardType() {
                this.$http.post(this.pagePort.cardType, {
                    param: this.dictsParam
                }).then(data => {
                    this.optionList.cardCategory = data.result;
                })
            },
            commonRules(msg) {
                return {
                    required: true,
                    message: msg,
                    trigger: 'blur'
                }
            },
            addItem() {
                this.dialog.status = 'add';
                this.dialog.visible = true;
                this.Jurisdiction = false
            },

            dialogClose() {
                //关闭弹窗时重置数据
                this.depSelects = [];
                this.$refs.formDialog.clearValidate('mobile');
                this.rules.mobile[0].required = false;
                this.formDialog.departmentIds = [];

                // this.$refs.formDialog.resetFields();
                this.formDialog.address = '';
                this.formDialog.cardCategoryId = null;
                this.formDialog.cardInfo = '';
                this.formDialog.cardNo = '';
                this.formDialog.createTime = ''; /// "2018-07-30T11:20:22.089Z"
                this.formDialog.createUserId = 1;
                // this.formDialog.departmentList = [];
                this.formDialog.email = '';
                this.formDialog.mobile = '';
                this.formDialog.name = '';
                this.formDialog.positionalTitleId = null;
                this.formDialog.sex = 1;
                this.formDialog.status = 0;
                this.formDialog.teacherNo = '';
                this.formDialog.id = ''; // 教职工id
                this.formDialog.unionId = '';
                this.formDialog.sendValidMessage = 'false';
            },
            hideca() {
                this.isShow = false;
            },
           

            commonValidate(ref, type, value1) {
                this.$refs[ref].validate((bool) => {
                    if (bool) {
                        this.commonRequire(type)
                    }
                })
            },
            commonRequire(method) {
                let option = util.clone(this.formDialog);
                option.departmentList = option.departments.map(d => d.id);
                delete option.departments;

                if (method === 'post') {
                    option.id && delete option.id;
                    delete option.status;
                }
                this.$http({
                    method: method,
                    url: this.pagePort.addTeacher,
                    data: {
                        ...option
                    },
                }).then(data => {
                    let message = (method === 'post' ? '新增' : '编辑') + '成功！';
                    let type = 'success';
                    if (Number(data.code) === 0) {
                        this.dialog.visible = false;
                        this.depSelects = [];
                        this.formDialog.departmentIds = [];
                    } else {
                        message = data.msg;
                        type = 'warning'
                    }
                    this.$message({
                        type,
                        message,
                        showClose: true,
                    });
                    //更新数据列表
                    this.getTableData();
                })
            },
            // 根据id删除教职工（单个）
            deleteItem(row) {
                this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.deleteTeacher + row.id)
                        .then(data => {
                            let message = '删除成功!';
                            let type = 'success';
                            if (Number(data.code) === 0) {
                                this.getTableData();
                            } else {
                                type = 'error';
                                message = data.msg;
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
            importTeacherList() {
                this.importTeacherDialog = true;
            },
            getArrList(str, come) {
                return this[come][str]
            },
            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            },
            // 表格复选框操作
            handleSelectionChange(val) {
                let valArr = [];
                this.paramResetPwd.unionIds = [];

                this.selectTeacherLists = val;
                // this.selectTeacherLists = new Set(this.selectTeacherLists); // 去重

                if (val.length == 0) {
                    this.paramResetPwd.unionIds = [];
                }
                for (let i = 0; i < val.length; i++) {
                    this.paramResetPwd.unionIds.push(val[i].id);
                    for (let key in val[i]) {
                        if (key == 'status') {
                            valArr.push(val[i][key]);
                        }
                    }
                }
              
                this.paramResetPwd.unionIds = new Set(this.paramResetPwd.unionIds); // 重置密码un去重

                /**
                 * [if description] 如果不包含1（即状态全部是禁用，则禁用批量操作不能点击）; 
                 * 如果不包含0（即状态全部是禁用，则启用批量操作不能点击）
                 */
                if (valArr.length > 0 && valArr.indexOf(1) < 0) {
                    this.forbidden = true;
                } else if (valArr.length > 0 && valArr.indexOf(0) < 0) {
                    this.enabled = true;
                } else {
                    this.forbidden = false;
                    this.enabled = false;
                }

            },
            currentChange(current) {
                this.pageNo = current;
                this.getTableData();
            },
            sizeChange(size) {
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableData();
            },
            handleCommand(command) {
                let params = this.selectTeacherLists;

                if (params.length === 0) {
                    // statement
                    this.$message.warning('请先选择要进行批量操作的教职工！');
                } else {
                    switch (command) {
                        case 'forbidden':
                        case 'enabled':
                            let statusArr = [];

                            for (var i = 0; i < params.length; i++) {
                                let obj = {};
                                obj.status = (flag => {
                                    return ~flag + 2
                                })(params[i].status); // 1 / 0 状态取反 例： 启用状态为1 则要传 0 去禁用
                                obj.teacherId = params[i].id;
                                statusArr.push(obj);
                            }
                            // 状态更改 再过滤是禁用还是启用的实际传参 最后状态要取反传参
                            if (command === 'forbidden') {
                                statusArr.filter((item) => {
                                    return item.status === 0;
                                })

                            } else if (command === 'enabled') {
                                statusArr.filter((item) => {
                                    return item.status === 1;
                                })
                            }
                            this.pageNo = 1;
                            this.changeTeacherStatus('put', statusArr)
                            break;
                        case 'deleteAll': // 删除
                            let deleteArr = [];

                            for (let i = 0; i < params.length; i++) {
                                // let deleteObj = {};
                                // deleteObj.id = params[i].id;
                                // deleteObj.departments = params[i].departments
                                // deleteArr.push(deleteObj);
                                deleteArr.push(params[i].id);
                            }
                            this.deleteTeacherList(deleteArr);
                            break;
                        case 'resetPwd':
                            if (this.paramResetPwd.unionIds.length < 1) {
                                this.$message.warning('请选择要进行批量操作的教职工！');
                            } else {
                                this.resetTeachersPwd();
                            }
                            break;
                        default:
                            // statements_def
                            break;
                    }
                }

            },

            // 批量删除教职工
            deleteTeacherList(params) {
                this.$confirm(`确定要删除已选中教职工的基本信息吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.deleteTeacherList, {
                            data: params
                        })
                        // this.$http.delete('http://192.168.1.173:18088/teachers/remove/list', {data:params})
                        .then(data => {
                            let message = '删除成功!';
                            let type = 'success';

                            if (Number(data.code) === 0) {
                                if (data.data.length > 0) {
                                    this.$alert(`由于id为${data.data}的教职工有关联的部门，故不能删除！`, '提示', {
                                        confirmButtonText: '确定',
                                        callback: () => {}
                                    })
                                }
                                this.getTableData();
                                return;
                            } else {
                                type = 'error';
                                message = data.msg;
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
            // 更改教职工状态 在操作删除按钮中单个删除用post方法
            changeTeacherStatus(method = 'post', params) {
                let inParams;

                if (method === 'post') {
                    let obj = {};
                    obj.status = (flag => {
                        return ~flag + 2
                    })(params.status); // 1 / 0 状态取反 例：启用状态为1 则要传 0去禁用;
                    obj.teacherId = params.id;
                    inParams = obj;
                } else {
                    inParams = [...params]
                }

                this.$http({
                    method: method,
                    url: this.pagePort.status,
                    data: inParams,
                }).then(data => {
                    this.$message.success('状态更改成功！');
                    this.getTableData();
                }).catch(error => {
                    console.log(error)
                })
            },
            // 重置密码
            resetTeachersPwd(row) {
                this.$confirm(`确定要重置密码吗？`, `提 示`, {
                    comfireButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (row) {
                      
                        row.id = String(row.id)
                        this.paramResetPwd.unionIds.push(row.id);
                    }
                    this.$http.post(this.pagePort.resetTeachersPwd, {
						 id: row.unionId,
						 newPassword: 123456
					}).then(data => {
                        if (data.code === 0) {
                            this.$alert(data.msg, '提 示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    this.paramResetPwd.unionIds = [];
                                    //  this.paramResetPwd.unionIds.push(row.id);
                                    this.getTableData();
                                }

                            });


                        } else if (data.code === 1) {
                            this.$message.error('重置密码失败，请重新尝试！');
                        }
                    })
                    this.$message.success('密码修改成功！');
                }).catch(() => {
                    this.paramResetPwd.unionIds = [];
                })

            },
            // 导入文件选择文件
            fileSelected(file, fileList) {
                this.fileList = fileList.slice(-1);
                this.importExcel();
            },
            onSuccess(res, file, fileList) {
                let type = "success";
                let message = "导入成功！";
                if (res.code != 0) {
                    type = "error";
                    message = res.data.errors[1][0]
                }
                this.$message({
                    type: type,
                    message: message
                })
            },
            onBefore(file) {
                let extension = file.name.split('.')[1] === 'xls';
                let size = file.size / 1204 / 1204 < 20;
                if (!extension) {
                    this.$message.warning("上传的文件格式是 xls！")
                }
                if (!size) {
                    this.$message.warning("上传的文件大小不能超过20M！")
                }
                return extension && size;
            },
            submitUpload() {
                this.$refs.upload.submit();
                return;
                if (this.importExcelData.length < 1) {
                    this.$message.warning('请选择导入文件！');
                    return;
                } else {
                    // let headers = {
                    //     Access_Token:localStorage.getItem('token'),
                    //     Authrization:localStorage.getItem('token')
                    // }
                    this.$http.post(this.pagePort.addTeacherBatch, this.importExcelData,

                    ).then(data => {
                        if (data.code === 0) {
                            if (data.data.failed > 0 && data.data.failedData.length > 0) {
                                let resFailed = data.data.failedData;
                                let ids = data.data.failedData.slice(0);
                                let failedName = [];
                                for (var i = 0; i < resFailed.length; i++) {
                                    failedName.push(resFailed[i].name)
                                }

                                this.$message.warning(
                                    `名字为${failedName.join('、').slice(0,5)}的教职工上传失败，请检查是否重复或重新上传！`)
                            } else {
                                this.$message.success('上传成功！');
                                this.importTeacherDialog = false;
                                this.getTableData();
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    }).catch(error => {
                        this.$message.error('上传出错！')
                    })
                }
            },
            editItem(row) {
                let self = this;
                // if (row.departmentIds) {
                //     let data = {};
                //     row.departmentIds.forEach((item, index) => {
                //         data['id' + index + 'end'] = item;
                //     });
                //     let param = encodeQueryParam(data);
                //     let query = param.replace(/id[0-9+]end/g, 'id');
                //     Department.list(query).then(res => {
                //         self.options = res.data;
                //     });
                // }
                // this.formDialog=data.data;

                for (let key in this.formDialog) {
                    if (Array.isArray(row[key])) {
                        this.formDialog[key] = JSON.parse(JSON.stringify(row[key]));
                    } else {
                        this.formDialog[key] = row[key];
                    }
                }

                if (row.cardCategoryId === 0) {
                    this.formDialog['cardCategoryId'] = "";
                }

                if (row.cardNo == null) {
                    row.cardNo = '';
                }
                if (row.cardNo.trim().length > 0) {
                    this.cardNoEditabled = false;
                } else {
                    this.cardNoEditabled = true;
                }

                if (row.mobile == null) {
                    row.mobile = '';
                }
                if (row.mobile.trim().length > 0) {
                    this.mobileEditabled = false;
                } else {
                    this.mobileEditabled = true;
                }


                // if(this.formDialog.cardNo ==''){
                //     this.Jurisdiction = false
                // }else{
                //     this.Jurisdiction = true
                // }
                this.dialog.status = 'edit';
                this.dialog.visible = true;
                if (row.sendValidMessage) { // 如果发送短信验证
                    this.rules.mobile[0].required = true;
                } else {
                    this.rules.mobile[0].required = false;
                }

                // this.$http.get('_op:/teachers/detail/'+row.id).then(data=>{
                //     data.data.cardCategoryId=data.data.cardCategoryId==0?'':data.data.cardCategoryId
                //     this.formDialog=data.data;

                //     this.dialog.status='edit';
                //     this.dialog.visible=true;
                //     if (row.sendValidMessage) { // 如果发送短信验证
                //         this.rules.mobile[0].required = true;
                //     }
                // }).catch(()=>{
                // })
            },

            search() {
                this.pageNo = 1;
                this.getTableData();
            },
            // 导入excel表格数据
            importExcel(obj) {
                let _this = this;
                // let nowDate = '' , years = '', month = '', day = '';
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                // this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                        this.da = [...outdata];
                        let arr = [];
                        for (let i = 0; i < outdata.length; i++) {
                            let tempOjb = {};
                            tempOjb.departmentIds = [];
                            for (let key in outdata[i]) {
                                if (key == '*姓名') {
                                    tempOjb.name = outdata[i][key];
                                }
                                if (key == '*工号') {
                                    tempOjb.teacherNo = outdata[i][key];
                                }
                                if (key == '职称') { // 职称id
                                    let posList = _this.positionList;

                                    // tempOjb.positionalTitleId = outdata[i][key];
                                    for (let j = 0; j < posList.length; j++) {
                                        if (posList[j].cnName == outdata[i][key]) {
                                            tempOjb.positionalTitleId = (posList[j].id);
                                        }
                                    }
                                }
                                if (key == '一卡通') {
                                    tempOjb.cardInfo = outdata[i][key];
                                }
                                if (key == '*性别') {
                                    if (outdata[i][key] == '男') {
                                        tempOjb.sex = 1;
                                    } else {
                                        tempOjb.sex = 0;
                                    }
                                }
                                if (key == '邮箱') {
                                    tempOjb.email = outdata[i][key];
                                }
                                if (key == "手机号") {
                                    tempOjb.mobile = outdata[i][key];
                                }
                                if (key == "证件号") {
                                    tempOjb.cardNo = outdata[i][key];
                                }
                                if (key == "证件类型") {
                                    let cardCategory = _this.optionList.cardCategory;

                                    for (let j = 0; j < cardCategory.length; j++) {
                                        if (outdata[i][key].indexOf('身份证') > -1 && outdata[i][key].indexOf(
                                                '中国') > -1) {
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        } else if (outdata[i][key].indexOf('身份证') > -1) { // 港澳台身份证
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        } else if (cardCategory[j].name == outdata[i][key]) { // 其他证件
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        }
                                    }
                                }
                                if (key == "地址") {
                                    tempOjb.address = outdata[i][key];
                                }
                                // if (key == "部门") {
                                //     let  _this=this
                                //     let depList = _this.departmentData;
                                //     for (let j = 0; j < depList.length; j++) {
                                //         if(depList[j].name == outdata[i][key]) {
                                //             tempOjb.departmentList.push(depList[j].id);
                                //         }
                                //     }
                                // }
                                let years = new Date().getFullYear();
                                let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() +
                                    1) : (new Date().getMonth() + 1);
                                let day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date()
                                    .getDate();
                                // nowDate = `${year-month-day}` // '2018-08-03'; // 创建时间
                                tempOjb.createTime = `${years}-${month}-${day}`;
                                tempOjb.status = 1;
                                tempOjb.createUserId = 1; // 动态读取
                            }
                            arr.push(tempOjb);
                        }
                        _this.importExcelData = arr;

                    }
                    // reader.readAsArrayBuffer(f);
                }
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            }
        }
    }
</script>

<style lang="less">
    .teacing-staff-addform {
        .dep-select-item.flex-form {
            position: relative;
            width: 100%;

            .secitem {
                width: 100%;
                margin-bottom: 22px;

                .inner-item {
                    position: relative;
                    display: inline-block;
                    width: 43.3333%;
                }

                .el-tree {
                    position: absolute;
                    top: 40px;
                    left: 0;
                    right: 0;
                    z-index: 999;
                    min-height: 100px;
                    max-height: 200px;
                    overflow-y: scroll;
                    border-radius: 0;
                    box-shadow: 0px 3px 3px 1px #eee;
                    line-height: 40px;
                }

                .el-tree-node__content {
                    height: 40px;
                }
            }

            .my-icon {
                color: #999;
                font-size: 22px;
                line-height: 40px;
                cursor: pointer;
            }

            .my-icon-del {
                margin-left: 130px;
                vertical-align: middle;
            }

            .addCount {
                margin-left: 15px;
                position: absolute;
                left: 375px;
                bottom: 22px;
            }
        }
    }

    .import-teachers-list {
        .upload-demo {
            position: relative;
            padding-left: 240px;
            margin-bottom: 20px;

            .el-upload-list {
                position: absolute;
                top: 0px;
                left: 0;
                width: 230px;
                min-height: 30px;
                border: 1px solid #ddd;
                border-radius: 3px;
                max-height: 60px;
                overflow-y: scroll;

                li {
                    margin-top: 3px;
                    box-sizing: border-box;
                    width: 230px;
                    padding-right: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>