<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formDetail">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期" prop="year">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                @change="onYear"
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="所在级">
                            <el-select v-model="formDetail.grade" placeholder="全部">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in gradeList" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item> -->
                         <el-form-item label="所在级">
                            <!-- <el-date-picker style="width: 100%;"
                                v-model="formDetail.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </el-date-picker> -->
                            <intelligent-year-picker
                                v-model="formDetail.grade"
                                placeholder="选择年级">
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select
                             v-model="formDetail.majorId"
                             filterable
                             clearable
                             @change="onMajor"
                             placeholder="全部">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务状态">
                            <el-select v-model="formDetail.status"   filterable placeholder="全部">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in taskStaus" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程">
                            <el-select
                             v-model="formDetail.couese"
                             value-key="name"
                             filterable
                             clearable
                             placeholder="全部">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    size="mini"
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" fixed></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='课程标识'">
                            <!-- 状态-1 全部， 0正常开课， 1延期，2提前， 3 增加 -->
                            <template v-if="scope.row.status==-1">
                                <span>全部</span>
                            </template>
<template v-else-if="scope.row.status==0">
                                <span>正常开课</span>
                            </template>
<template v-else-if="scope.row.status==1">
                                <span style="color: red;">延</span>
                            </template>
<template v-else-if="scope.row.status==2">
                                <span style="color: red;">提</span>
                            </template>
<template v-else-if="scope.row.status==3">
                                <span style="color: red;">增</span>
                            </template>
<template v-else-if="scope.row.semester_hours!=scope.row.progress_hours">
                                <span style="color: red;">{{scope.row.progress_hours}}</span>
                            </template>
</template>
<template v-else>
                            {{scope.row[item.prop]}}
                        </template>
</template>
</el-table-column>

<el-table-column v-if="btnPerObj.view||btnPerObj.add" fixed="right" label="操作" width="160">
    <template slot-scope="scope">
                        <el-button @click="planAdjustment(scope.row)" type="text" size="small" v-if="btnPerObj.view">查看例外明细</el-button>
                        <el-button @click="addNotes(scope.row)" type="text" size="small" v-if="btnPerObj.add">添加备注</el-button>
                    </template>
</el-table-column>
</el-table>
</div>
<div class="cm-pagination">
    <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
    </el-pagination>
</div>
<!-- 查看例外明细 -->
<el-dialog class="pm-margin" title="查看例外数据" :visible.sync="dialog.visible" :close-on-click-modal="false" :modal-append-to-body="false" width="56%">
    <el-form :inline="true" ref="exceptionForm" :model="exceptionForm" label-width="80px">
        <el-form-item label="学期">
            <el-input v-model="exceptionForm.year" :disabled="true" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="所在级">
            <el-input v-model="exceptionForm.grade" :disabled="true" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="专业">
            <el-input v-model="exceptionForm.majorId" :disabled="true" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="课程">
            <el-input v-model="exceptionForm.coueseId" :disabled="true" placeholder="请输入内容"></el-input>
        </el-form-item>
    </el-form>
    <el-form ref="exceptionForm" :model="exceptionForm" label-width="80px" class="p-margin">
        <el-form-item label="例外数据">
            <el-table :data="gridData" border>
                <el-table-column v-for="(item,index) in gridList" :key="index" :property="item.prop" :label="item.label" :width="item.width">

                </el-table-column>
            </el-table>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
	            <el-button type="primary" size="medium" @click="dialog.visible=false">关 闭</el-button>
	        </span>
</el-dialog>
<!-- 添加备注 -->
<el-dialog title="教学备注" class="pm-margin" :visible.sync="dialog.remark" :close-on-click-modal="false" :modal-append-to-body="false" @closed="dialogClose" width="48%">
    <el-table border class="" style="width:100%;margin: 0 auto;
}" header-row-class-name="cm-dark" :data="teachRemarkData">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column v-for="(item,index) in teachRemarkList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
            <template slot-scope="scope">
                        <template v-if="item.prop==='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
            <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                        <el-button @click="addTeachRemark(scope.row,'edit')" type="text" size="small">编辑</el-button>
                    </template>
        </el-table-column>
    </el-table>
    <div class="cm-nodes p-">
        <div class="title">
            <span>{{titleTxt}}</span>
        </div>
        <div>
            <el-input type="textarea" :rows="2" maxlength="200" placeholder="请输入教学备注信息，最多支持200多文字" v-model="textarea">
            </el-input>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogClose">取 消</el-button>
                <el-button type="primary" size="medium" @click="addTeachNodes">保 存</el-button>
	        </span>
</el-dialog>
</section>
</template>

<script>
    import util from '@/util';

    import {
        mapState
    } from 'vuex';

    export default {
        data() {
            return {
                breadcrumb: [{
                    label: "教学管理"
                }, {
                    label: "确认教学任务管理"
                }, ],
                dialog: {
                    status: 'add',
                    remark: false,
                    visible: false
                },
                formDetail: {
                    grade: "",
                    majorId: 0,
                    status: -1,
                    couese: {}
                },
                exceptionForm: {
                    year: "",
                    grade: "",
                    majorId: "",
                    coueseId: ""
                },
                tableList: [{
                    label: '学期',
                    prop: 'semester_name',
                    width: 200
                }, {
                    label: '所在级',
                    prop: 'grade',
                    width:100
                }, {
                    label: '专业',
                    prop: 'major',
                     width:200
                }, {
                    label: '课程名称',
                    prop: 'course_name',
                     width:200
                }, {
                    label: '本学期学时理论/实践',
                    prop: 'semester_hours',
                     width:140
                }, {
                    label: '例外学时理论/实践',
                    prop: 'exception_hours',
                     width:140
                }, {
                    label: '进度表学时理论/时间',
                    prop: 'progress_hours',
                     width:140
                }, {
                    label: '课程标识',
                    prop: 'status',
                }, {
                    label: '课程负责人',
                    prop: 'course_responsible_persons'
                }],
                tableData: [],
                gridData: [],
                gridList: [{
                    label: '授课形式',
                    prop: 'teaching_form'
                }, {
                    label: '学时',
                    prop: 'total_hours'
                }, ],
                teachRemarkList: [{
                    label: '创建人',
                    prop: 'create_username',
                    width: 80
                }, {
                    label: '创建日期',
                    prop: 'create_time',
                    width: 120
                }, {
                    label: '备注内容',
                    prop: 'content'
                }],
                teachRemarkData: [],
                gradeList: [{
                    label: "2014",
                    value: "2014"
                }, {
                    label: "2015",
                    value: "2015"
                }, {
                    label: "2016",
                    value: "2016"
                }, {
                    label: "2017",
                    value: "2017"
                }, {
                    label: "2018",
                    value: "2018"
                }, {
                    label: "2019",
                    value: "2019"
                }, {
                    label: "2020",
                    value: "2020"
                }, {
                    label: "2021",
                    value: "2021"
                }, {
                    label: "2022",
                    value: "2022"
                }, {
                    label: "2023",
                    value: "2023"
                }],
                taskStaus: [{
                    name: "正常开课",
                    id: "0"
                }, {
                    name: "延期开课",
                    id: "1"
                }, {
                    name: "提前开课",
                    id: "2"
                }, {
                    name: "增加开课",
                    id: "3"
                }, ],
                formYear: "",
                textarea: "",
                titleTxt: "添加备注",
                options1: [],
                majorList: [],
                courseList: [],
                myDate: new Date(),
                tableLoading: false,
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                userId: util.getStorage('loginId'),
                userName: util.getStorage('loginName'),
                btnPerObj: { //按钮权限
                    query: false,
                    view: false,
                    add: false
                }
            }
        },
        created() {
            this.getTermData();
            this.getMajorList();
            this.getCourseList();
        },
        computed: {
            ...mapState(['btnPermitList']),
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
            };

            util.openBtnPermit(this.btnPerObj);
            //          this.getBtnPermit();
        },
        filters: {
            getTime(time) {
                return util.getTime(time);
            }
        },
        methods: {
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                    data.data.map(item => {
                        if (item.code == "query_querenjiaoxuerenwu") { //查询
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "view_exception_details") { //查看例外明细
                            self.btnPerObj.view = true;
                        }
                        if (item.code == "add_remark") { //添加备注
                            self.btnPerObj.add = true;
                        }

                    });
                }).catch(() => {})
            },
            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            },
            onSearch() {
                 this.pageNo = 1;
                this.getTableList();
            },
            sizeChange(size) {
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableList();
            },
            currentChange(current) {
                this.pageNo = current;
                this.getTableList();
            },
            dialogClose() {
                this.textarea = '';
                this.dialog.remark = false;
            },
            onYear(value) {
                if (value) {
                    for (let list of this.options1) {
                        if (list.id == value) {
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum;
                        }
                    }
                } else {
                    this.fallYear = "";
                    this.semesterNum = "";
                }
            },
            onMajor(val) {
                if (val) {
                    this.formDetail.couese = {};
                    // this.getCourseList(val);
                }
            },
            planAdjustment(row) {
                this.dialog.visible = true;
                this.exceptionForm.year = row.semester_name;
                this.exceptionForm.grade = row.grade;
                this.exceptionForm.majorId = row.major;
                this.exceptionForm.coueseId = row.course_name;
                this.$http.get("_ed:/teachexception/list/" + row.id)
                    .then(data => {
                        if (data.code == 0) {
                            this.gridData = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            addNotes(row) {
                this.taskId = row.id;
                this.dialog.remark = true;
                this.tasknoteRequire(row.id);
            },
            tasknoteRequire(id) {
                this.$http.get("_ed:/tasknote/list/" + id)
                    .then(data => {
                        if (data.code == 0) {
                            this.teachRemarkData = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            addTeachNodes() {
                if (!this.textarea) {
                    this.$message.warning("请填写备注！");
                    return;
                }
                let option = {
                    task_id: this.taskId,
                    content: this.textarea,
                    create_user: this.userId,
                    create_username: this.userName
                }
                let url = "_ed:/tasknote/add"
                if (this.editVal) {
                    url = "_ed:/tasknote/edit";
                    option = {
                        id: this.rowId,
                        content: this.textarea
                    }
                }

                this.$http({
                    method: "post",
                    url: url,
                    data: {
                        ...option
                    }
                }).then(data => {

                    let type = "success";
                    let message = `${this.editVal=="edit" ? "编辑" : "添加"}成功！`;
                    if (data.code == 0) {

                        this.textarea = "";
                        this.titleTxt = `添加备注`;
                        this.dialog.remark = false;
                        this.tasknoteRequire(this.taskId);
                    } else {
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        type: type,
                        message: message
                    })
                })
            },
            addTeachRemark(row, value) {
                this.editVal = value;
                this.rowId = row.id;
                this.textarea = row.content;
                this.titleTxt = "编辑备注"
            },
            getTableList() {
                this.tableLoading = true;
                this.$http.post("_ed:teachtask/query", {
                    course_name: this.formDetail.couese.name,
                    grade: this.formDetail.grade,
                    status: this.formDetail.status,
                    major_id: this.formDetail.majorId,
                    courseId: this.formDetail.couese.id,
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum,
                    request_page: this.pageNo,
                    page_size: this.pageSize,
                }).then(data => {
                    if (data.code == 0) {
                      
                        this.tableLoading = false;
                        this.totalCount = data.data.total_records;
                        this.tableData = data.data.dataList;
                        for (let item of this.tableData) {
                            if (item.semester_theory_hours == null) {
                                item.semester_theory_hours = 0;
                            }
                            if (item.semester_novitiate_hours == null) {
                                item.semester_novitiate_hours = 0;
                            }
                            if (item.schedule_theory_hours == null) {
                                item.schedule_theory_hours = 0;
                            }
                            if (item.schedule_novitiate_hours == null) {
                                item.schedule_novitiate_hours = 0;
                            }
                            if (item.exception_theory_hours == null) {
                                item.exception_theory_hours = 0;
                            }
                            if (item.exception_novitiate_hours == null) {
                                item.exception_novitiate_hours = 0;
                            }
                            this.$set(item, "semester_hours", item.semester_theory_hours + "/" + item.semester_novitiate_hours);
                            this.$set(item, 'progress_hours', item.schedule_theory_hours + "/" + item.schedule_novitiate_hours);
                            this.$set(item, 'exception_hours', item.exception_theory_hours + "/" + item.exception_novitiate_hours);

                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((error) => {
                    this.tableLoading = false;
                })
            },
            getMajorList() {
                this.$http.get("_op:/major/combox")
                    .then(data => {
                        if (data.code == 0) {
                            this.majorList = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            getCourseList(val) {
                this.$http.post("_op:course/list", {
                        "pageNo": 1,
                        "pageSize": 1000,
                        "param": {
                            "status": "",
                            "categoryId": "",
                            "code": "",
                            "name": "",
                            "natureId": "",
                            "remark": ""
                        }
                    })
                    .then(res => {
                        if (res.result) {
                            this.courseList = res.result;
                        }
                    })
            },
            getTermData(query) {
                if (!query) {
                    query = "学期"
                }
               
                this.$http.get('_op:/terms/' + query)
                    .then(data => {
                        
                        if (data.code == 0) {
                            this.options1 = data.data.reverse();  
                          
                                  for(let i=0;i<this.options1.length;i++){
                                if(this.options1[i].stage==1){
                                    this.formYear=this.options1[i].id
                                    this.addForm = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear =this.options1[i].year;
                                    break
                                }else{
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                }
                            }           
                     
                        } else {
                            this.$message.error(data.msg);
                        }

                        this.getTableList();
                    })
            }

        }
    }
</script>
<style scoped>
    .cm-nodes {
        margin-top: 40px;
        border-top: 1px solid #909399;
        padding-top: 10px;
    }
    
    .cm-nodes .title {
        margin-bottom: 10px;
    }
    
    .cm-nodes .title span {
        margin-right: 20px;
    }
    
    .p-margin {
        padding: 0 20px
    }
    
    .p-margin {}
</style>
<style>
    .pm-margin /deep/.el-dialog__body {
        padding: 10px 40px;
    }
</style>