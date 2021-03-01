<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form size="mini" :inline="true" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="name" clearable placeholder="请输入姓名" style="width:130px"></el-input>
                        </el-form-item>
                        <el-form-item label="学号">
                            <el-input v-model="stuNum" clearable placeholder="请输入学号" style="width:130px"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="证件号">
                            <el-input v-model="cardNum" clearable placeholder="请输入证件号"></el-input>
                        </el-form-item> -->
                        <el-form-item label="所在级">
                            <intelligent-year-picker style="width:90px" @change="getMajorList" v-model="enrollmentYear" type="year" value-format="yyyy" placeholder="请选择">
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select v-model="majorId" filterable placeholder="请选择" clearable @change="getCalss">
                                <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="行政班">
                            <el-select v-model="administrativeClassId" placeholder="请选择" clearable filterable>
                                <el-option v-for="item in administrativeList" :key="item.id" :label="item.name "
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select v-model="sexNum" style="width:70px">
                                <el-option value="" label="全部"></el-option>
                                <el-option :value="846" label="男"></el-option>
                                <el-option :value="847" label="女"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="stuStatus" style="width:100px">
                                <el-option value="" label="全部"></el-option>
                                <el-option value="1" label="在籍"></el-option>
                                <el-option value="2" label="非在籍"></el-option>
                                <el-option value="4" label="休学"></el-option>
                                <el-option value="12" label="保留学籍"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="异动类型">
                            <el-select v-model="changeStatus" style="width:120px">
                                <el-option value="" label="全部"></el-option>
                                <el-option value="1" label="本硕连读"></el-option>
                                <el-option value="2" label="转入医学院"></el-option>
                                <el-option value="3" label="保留学籍"></el-option>
                                <el-option value="4" label="院内转出"></el-option>
                                <el-option value="5" label="休学"></el-option>
                                <el-option value="6" label="退学"></el-option>
                                <el-option value="7" label="降级"></el-option>
                                <el-option value="8" label="复学"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="国家">
                            <el-select v-model="countryId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族">
                            <el-select v-model="nationId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生源地">
                            <el-cascader
                                :options="cityList"
                                v-model="sourceProvinceCityId"
                                expand-trigger="hover"
                                change-on-select
                                filterable
                                clearable>
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="政治面貌">
                            <el-select v-model="politicsStatusId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in politicalList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="办学形式">
                            <el-select v-model="eduTypeId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in schoolRunType" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="层次">
                            <el-select v-model="stageId" filterable placeholder="请选择" clearable>
                                <el-option v-for="item in educationalList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="应届生">
                            <el-select v-model="stu_model_id" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in stuModelList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="户口性质">
                            <el-select v-model="registerTypeId" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in registerList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="考生特征">
                            <el-select v-model="stuFeatureId" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in stufeatureList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学习形式">
                            <el-select v-model="studyModelId" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in learFormList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="招生季节">
                            <el-select v-model="seasonId" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in seasonList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="入学方式">
                            <el-select v-model="entrance" filterable placeholder="请选择" clearable >
                                <el-option v-for="item in entranceList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="serchFn" v-if="btnPerObj.edit">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con">
            <el-button type="primary" size="mini" @click="exportExc">导出EXCEL</el-button>
            <el-button type="primary" size="mini" @click="exportDBF">导出DBF</el-button>
            <el-button size="mini" type="primary" @click="addBtn" v-if="btnPerObj.add">新增学生</el-button>
            <el-button size="mini">
                <a :href="`${publicPath}template/student-template.xls`" download="学生模板" v-if="btnPerObj.download">下载模版</a>
            </el-button>
            <el-upload v-if="btnPerObj.import" size="mini" style="display: inline-block;margin-left: 10px;"
                class="upload-demo" action="/operation/data/admin/modified/courseaffirm/importStudentTemp" :headers="headers"
                :show-file-list="false" :before-upload="onBefore" :on-success="handleAvatarSuccess">
                <el-button size="small" type="primary">导入学生</el-button>
            </el-upload>
            <a v-show="false" ref="exportExcel"></a>
            <a v-show="false" ref="exportDBF"></a>
        </div>
        <div class="cm-table">
            <el-table size="mini" ref="multipleTable" :data="tableData" border style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="50"></el-table-column>

                <el-table-column prop="name" label="姓名" width="160"></el-table-column>
                <el-table-column prop="stuNum" width="110" label="学号"></el-table-column>
                <el-table-column prop="spellName" label="拼音" width="220"></el-table-column>
                <el-table-column prop="sex" width="60" label="性别">
                    <template slot-scope="scope">
                        {{scope.row.sex | initSex}}
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
                <el-table-column prop="enrollmentYear" label="所在级" width="80"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班" width="200"></el-table-column>
                <el-table-column prop="majorName" label="专业" width="160"></el-table-column>
                <el-table-column prop="countryName" label="国家" width="120"></el-table-column>
                <el-table-column prop="nationName" label="民族" width="120"></el-table-column>
                <el-table-column prop="sourceProvinceCityName" label="生源地" width="220"></el-table-column>
                <el-table-column prop="politicsStatusName" label="政治面貌" width="160"></el-table-column>
                <el-table-column prop="eduTypeName" label="办学形式" width="120"></el-table-column>
                <el-table-column prop="stageName" label="层次" width="70"></el-table-column>
                <el-table-column prop="stuModelName" label="应届生" width="120"></el-table-column>
                <el-table-column prop="registerTypeName" label="户口性质" width="80"></el-table-column>
                <el-table-column prop="stuFeatureName" label="考生特征" width="150"></el-table-column>
                <el-table-column prop="studyModelName" label="学习形式" width="100"></el-table-column>
                <el-table-column prop="seasonName" label="招生季节" width="90"></el-table-column>
                <el-table-column prop="entranceName" label="入学方式" width="80"></el-table-column>
                <el-table-column label="状态" width="70">
                    <template slot-scope="scope">{{scope.row.status | statusFn}}</template>
                </el-table-column>

                <el-table-column fixed="right" v-if="btnPerObj.edit||btnPerObj.reset||btnPerObj.del" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editBtn(scope.row)" v-if="btnPerObj.edit">编辑
                        </el-button>
                        <el-button type="text" size="small" @click="resetPassword(scope.row.unionId)"
                            v-if="btnPerObj.reset">重置密码</el-button>
                        <el-button type="text" size="small" style="color: #F56C6C;" @click="deleteBtn(scope.row)"
                            v-if="btnPerObj.del">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tablePage.total"
                @size-change="sizeChange" @current-change="currentChange">
            </el-pagination>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-press-escape="false" append-to-body :close-on-click-modal="false"
            :fullscreen="true">
            <add-student v-if="dialogFormVisible" @closeDialog="closeDialog" @getTableData="getTableData" :stuInfo="stuInfo"
                :dialogFormVisible="dialogFormVisible" :editChecked = editChecked></add-student>
        </el-dialog>
        <el-dialog 
            title="错误说明" 
            :visible.sync="errDialog" 
            :close-on-press-escape="false" 
            append-to-body 
            :close-on-click-modal="false"
            >
            <el-table 
                size="mini"
                border
                :data="errMessage">
                <el-table-column prop="stu_num" width="180" label="学号"></el-table-column>
                <el-table-column prop="error_note" label="错误说明"></el-table-column>
            </el-table>
        </el-dialog>

    </section>
</template>

<script>
    import util from '@/util'
    import addStudent from './add_student'
    import {
        mapState
    } from 'vuex' //引入状态
    import * as API from '@/api/API'
    const parametersList = ["sex-code", "political-status", "ID-category", "learning-form", "schooling-length",
		"educational-level", "school-running", "student-feature", "nation-code", "student-modal", "register-type",
		"admissions-season", "study-year", "education-modality","country-code", "entrance"
	];
    export default {
        name: "student-management",
        data() {
            return {
                errMessage: null,
                errDialog: false,
                publicPath: process.env.BASE_URL,
                breadcrumb: [{
                    label: "学生管理"
                }],
                sexNum: '',
                pageSize: 20,
                pageNo: 1,
                tableData: [],
                tablePage: {
                    current: 1,
                    size: 10,
                    total: 0,
                },
                editChecked: false,
                cardNum: '',
                administrativeClassId: '',
                enrollmentYear: '',
                majorId: '',
                name: '',
                stuNum: '',
                cardNum: '',
                stuStatus: '',
                changeStatus: '',
                stuInfo: {
                    dialogStatus: "",
                }, //学生信息

                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                dialogFormVisible: false,
                dialogTitle: '',
                majorList: [], //专业
                administrativeList: [], //行政班

                formInline: {
                    user: '',
                    region: ''
                },
                btnPerObj: { //按钮权限  
                    add: false, //新增
                    query: false, //查询
                    edit: false, //编辑
                    del: false, //删除
                    import: false,
                    opt: false, //批量操作
                    reset: false, //重置密码
                    download: false //下载模板
                },
                cityList: [],
                sexList: [],
                countryList: [],
                idCategoryList: [],
                learFormList: [],     
                schoolingList: [],
                educationalList: [],
                schoolRunType: [],
                stufeatureList: [],
                nationList: [],
                stuModelList: [],
                registerList: [],   
                seasonList: [],
                yearList: [],
                politicalList: [],
                modalityList: [],
                entranceList: [],
                nationId: '',
                politicsStatusId: '',
                sourceProvinceCityId: '',
                stageId: '',
                eduTypeId: '',
                stu_model_id: '',
                stuFeatureId: '',
                registerTypeId: '',
                studyModelId: '',
                seasonId: '',
                entrance: '',
                countryId: '',
        }      
            
            
        },
        components: {
            addStudent
        },
        filters: {
            initSex(val){
                if(val == 846){
                    return '男'
                }else if(val == 847){
                    return '女'
                }else{
                    return ''
                }
            },
            statusFn(val) {
                let valText = '';
                switch (val) {
                    case 1:
                        valText = "在籍"
                        break;
                    case 2:
                        valText = "非在籍"
                        break;
                    case 4:
                        valText = "休学"
                        break;
                    case 12:
                        valText = "保留学籍"
                        break;
                    default:
                        break;
                }
                return valText;
            },
        },
        computed: {
            ...mapState(['btnPermitList']), //
            headers() {
                return {
                    'Access_Token': util.getStorage('token'),
                    'Authorization': util.getStorage('token')
                }
            }
        },
        methods: {
            getMajorList() {
                let grade
                if(this.enrollmentYear == '' || this.enrollmentYear == null) {
                    grade = 0
                }else {
                    grade = this.enrollmentYear
                }
                this.majorId = ''
                this.majorList = []
                this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
                    this.majorList = res.data
                })
                this.getAdministrativeClassId()
            },
            getCityTree(){//地点树
            
            	let self=this;
            	this.$http.get('_op:/province/city/tree/1').then(data=>{
	            	self.cityList=this.mapTree(data.data.children)
                }).catch(()=>{
                })
            },
            mapTree(children){
            	let self=this;
            	let objlist=[];
            	if (children.length>0) {
            		children.map(function(item){
            			if (item.children&&item.children.length>0) {
	            			objlist.push({
		            			value:item.id.toString(),
		            			label:item.cnName,
		            			children: self.mapTree(item.children)
		            		})
            			}else{
            				objlist.push({
		            			value:item.id.toString(),
		            			label:item.cnName
		            		})
            			}
            		})
            	}
            	return objlist;
            },
            exportExc(){
				let params ={
                    pageNo: 1,
                    pageSize: 20000,
                    param: {
                        cardNum: this.cardNum,
                        administrativeClassId: this.administrativeClassId,
                        enrollmentYear: parseInt(this.enrollmentYear),
                        majorId: this.majorId,
                        name: this.name,
                        stuNum: this.stuNum,
                        sex: this.sexNum,
                        status: this.stuStatus,
                        eduModalityId: this.changeStatus
                    }
            }
                this.$http2.post('_op:/students/export/list',params).then(data=>{
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "学生管理.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
                })
            },
            // 导出dbf
            exportDBF() {
                if (this.enrollmentYear == '') {
                    return this.$message.error('请输入年级')
                }else{
                    let param = {
                        grade : this.enrollmentYear,
                        majorId: this.majorId
                    }
                    this.$http2.post('_op:/studentStatus/export/exportStdRegisterToDBF',param).then(data=>{
                        let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportDBF;
                        y.href = url;
                        y.setAttribute("download", "学生管理.dbf");
                        y.click();
                        window.URL.revokeObjectURL(url);
                    })
                }
            },
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                    data.data.map(item => {
                        if (item.code == "query_xueshengguanli") { //查询
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "add_xueshengguanli") { //新增
                            self.btnPerObj.add = true;
                        }
                        if (item.code == "download_template_xueshengguanli") { //下载模板
                            self.btnPerObj.download = true;
                        }

                        if (item.code == "import_students_xueshengguanli") { //导入
                            self.btnPerObj.import = true;
                        }
                        if (item.code == "edit_xueshengguanli") { //编辑
                            self.btnPerObj.edit = true;
                        }
                        if (item.code == "del_xueshengguanli") { //删除
                            self.btnPerObj.del = true;
                        }

                        if (item.code == "opt_batch_jiaozhigong") { //批量操作
                            self.btnPerObj.opt = true;
                        }
                        if (item.code == "reset_password_xueshengguanli") { //重置密码
                            self.btnPerObj.reset = true;
                        }

                    });
                }).catch(() => {})
            },
            serchFn() {
                this.pageNo = 1;
                this.getTableData();
            },
            onBefore(file) {
                let extension = file.name.split('.')[1] === 'xls';
                let size = file.size / 1204 / 1204 < 20;
                if (!extension) {
                    this.$message.warning("上传的文件格式是 xls！")
                    return
                }
                if (!size) {
                    this.$message.warning("上传的文件大小不能超过20M！")
                    return
                }
                return size;
            },
            getDictsList(type) {
            //字典查询
            this.$http
                .post("_op:/dicts/getDictsList", {
                type: type
                })
                .then(data => {
                if (type === "sex-code") {
                    this.sexList = data.data;
                } else if (type === "country-code") {
                    this.countryList = data.data;
                } else if (type === "political-status") {
                    this.politicalList = data.data;
                } else if (type === "ID-category") {
                    this.idCategoryList = data.data;
                } else if (type === "learning-form") {
                    this.learFormList = data.data;
                } else if (type === "schooling-length") {
                    this.schoolingList = data.data;
                } else if (type === "educational-level") {
                    this.educationalList = data.data;
                } else if (type === "school-running") {
                    this.schoolRunType = data.data;
                } else if (type === "student-feature") {
                    this.stufeatureList = data.data;
                } else if (type === "nation-code") {
                    this.nationList = data.data;
                } else if (type == "student-modal") {
                    this.stuModelList = data.data;
                } else if (type == "register-type") {
                    this.registerList = data.data;
                } else if (type == "admissions-season") {
                    this.seasonList = data.data;
                } else if (type == "study-year") {
                    this.yearList = data.data;
                } else if (type == "education-modality") {
                    this.modalityList = data.data;
                }else if (type == 'entrance') {
                    this.entranceList = data.data;
                }
                })
                .catch(() => {});
            },
            handleAvatarSuccess(res, file) {
                if (res.code != 0) {
                    if (res.code == 1) {
                        this.errMessage = JSON.parse(res.msg)
                        this.errDialog = true
                    } else {
                        this.$message({
                            type: "error",
                            message: res.msg || '导入失败'
                        })
                    }
                } else {
                    this.$message({
                        type: "success",
                        message: "导入成功！"
                    })
                }
            },

            getTableData() {
                this.$http.post("_op:/students/list", {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    param: {
                        cardNum: this.cardNum,
                        administrativeClassId: this.administrativeClassId,
                        enrollmentYear: parseInt(this.enrollmentYear),
                        majorId: this.majorId,
                        name: this.name,
                        stuNum: this.stuNum,
                        sex: this.sexNum,
                        status: this.stuStatus,
                        eduModalityId: this.changeStatus,
                        nationId: this.nationId,
                        politicsStatusId: this.politicsStatusId,
                        sourceProvinceCityId: this.sourceProvinceCityId == "" ? "" : this.sourceProvinceCityId[this.sourceProvinceCityId.length - 1],
                        stageId: this.stageId,
                        eduTypeId: this.eduTypeId,
                        stu_model_id: this.stu_model_id,
                        stuFeatureId: this.stuFeatureId,
                        registerTypeId: this.registerTypeId,
                        studyModelId: this.studyModelId,
                        seasonId: this.seasonId,
                        entrance :this.entrance,
                        countryId : this.countryId
                    }
                }).then(data => {
                    this.tableData = data.data.records;
                    this.tablePage.total = data.data.total;
                    this.pageSize = data.data.size;
                }).catch(() => {
                    this.tableData = [];
                })
            },
            // getMajorCategory() { //专业
            //     this.$http.get('_op:/major/combox', {}).then(data => {
            //         this.majorList = data.data
            //     }).catch(() => {})
            // },
            // getAdministrative() { //行政班
            //     let params = {
            //         pageNo: 1,
            //         pageSize: 100,
            //         param: {
            //             administrativeClassName: this.administrativeClassId,
            //             grade: this.enrollmentYear,
            //             majorId: this.major,
            //         }
            //     }
            //     this.$http.post('_op:/administrative/class/list', params).then(data => {
            //         this.administrativeList = data.result
            //     }).catch(() => {})
            // },
            getAdministrativeClassId() { //获取行政班ID
                let slef =this
                // if((slef.formEvaluate.grade!=''|| slef.formEvaluate.grade!=null) &&(slef.formEvaluate.majorId!=''||slef.formEvaluate.majorId!=null)){
                    let grade,
                        majorId
                        if(slef.enrollmentYear=='' || slef.enrollmentYear==null) {
                          grade = 0
                        }else {
                          grade = slef.enrollmentYear
                        }
                        if(slef.majorId==''|| slef.majorId==null) {
                          majorId = 0
                        }else {
                          majorId = slef.majorId
                        }
                        this.$http.get("_op:/administrative/class/list/"+grade+'/'+majorId).then(datas=>{
                        if(datas.code === 0) {
                            let data = datas.data;
                            this.administrativeList = data
                        }
                    })
                // }
            },
            getCalss() {
                this.getAdministrativeClassId()
            },
            addBtn() {
                this.editChecked = false
                this.stuInfo = {};
                this.dialogTitle = "新增学生";
                this.stuInfo.dialogStatus = "新增";
                this.dialogFormVisible = true;
            },
            closeDialog() {
                this.dialogFormVisible = false;
            },
            resetPassword(unionId) {
                let self = this;
                self.$confirm('确认重置密码？').then(_ => {

                    API.POST('_auth:/user/password/reset/', {
                        id: unionId,
                        newPassword: 123456
                    }).then(response => {
                        if (response.status == 200) {
                            self.$message({
                                message: '重置密码成功',
                                type: 'success'
                            });
                        }
                        return null;
                    }).catch(error => {
                        debugger
                        return null;
                    })
                });

            },
            deleteBtn(row) {

                this.$confirm(`此操作将永久删除“${row.name}”所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("_op:/students/" + row.id).then(data => {
                        let type = "success";
                        let message = "删除成功！";
                        if (data.code == 0) {
                            this.getTableData();
                        } else {
                            type = "error";
                            message = data.msg;
                        }
                        this.$message({
                            type: type,
                            message: message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            editBtn(row) {
                this.editChecked = true
                this.dialogTitle = "编辑学生";
                this.stuInfo.dialogStatus = "编辑";
                this.stuInfo = row;
                this.dialogFormVisible = true;
                this.stuInfo.cardTypeId = parseInt(row.cardTypeId);
            },

            sizeChange(size) {
                this.pageNo = 1;
                this.pageSize = size;
              
                this.getTableData();
            },
            currentChange(current) {
                this.pageNo = current;
                // this.tablePage.current = current;
                this.getTableData();
            },

            handleClick(row) {
                
            },
            onSubmit() {
              
            },
            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            }
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
            };
            let self = this;
            parametersList.map(function(item) {
                self.getDictsList(item);
            });
            util.openBtnPermit(this.btnPerObj);
           
        },
        created() {
            this.getTableData();
            this.getCityTree()
            // this.getMajorCategory();
            // this.getAdministrative();
            this.getAdministrativeClassId()
        }
    }
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.cm-btn-con {
    padding: 0 20px 10px 20px;
}
</style>