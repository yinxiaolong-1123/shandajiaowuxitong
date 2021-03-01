<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
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
                                
                                @change="onSearchYear"
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- {{courseList}} -->
                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.courseId"  @change="changeClass()" clearable filterable placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList"  :key="list.id" :label="list.course_arrange+ '   ('+list.majorNames+')'" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上课班">
                            <el-select v-model="formInline.classId"  filterable clearable placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.query">
                          	<el-button type="primary" size="mini" @click="onSearch">查询</el-button>
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
                    v-loading="tableLoading"
                    element-loading-text="加载中..."
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <template v-if="item.prop=='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
<template v-else>
                            {{scope.row[item.prop]}}
                        </template>
</template>
</el-table-column>

<el-table-column v-if="btnPerObj.edit||btnPerObj.relation" fixed="right" label="操作" width="200">
    <template slot-scope="scope">
                        <el-button @click="editGroup(scope.row)" type="text" size="small" v-if="btnPerObj.edit">编辑</el-button>
                        <el-button @click="associateStudents(scope.row)" type="text" size="small" v-if="btnPerObj.relation">关联学生</el-button>
                    </template>
</el-table-column>
</el-table>
</div>
<div class="cm-pagination">
    <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
    </el-pagination>
</div>
<!-- 编辑分组 -->
<el-dialog title="编辑分组" :visible.sync="dialog.visible" :close-on-click-modal="false" :modal-append-to-body="false" custom-class="cm-dialog-small" @closed="dialogClose">
    <el-form ref="editForm" :model="editForm">
        <el-form-item label="课程" class="flex-form">
            <el-input v-model="editForm.course" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="授课形式" :rules="rules.rule" class="flex-form">
            <el-input v-model="editForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分组数" class="flex-form">
            <el-input v-model="editForm.group" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="组号" class="flex-form">
            <el-input v-model="editForm.num" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分组名" class="flex-form">
            <el-input v-model="editForm.name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogClose">取 消</el-button>
	            <el-button type="primary" @click="editConfirm">确 定</el-button>
	        </span>
</el-dialog>
</section>
</template>

<script>
    import util from '@/util'

    import {
        mapState
    } from 'vuex';

    export default {
        data() {
            return {
                breadcrumb: [{
                    label: "教学管理"
                }, {
                    label: "上课组关联学生"
                }, ],
                dialog: {
                    status: 'add',
                    remark: false,
                    visible: false
                },
                formInline: {
                    courseId: null,
                    classId: null
                },
                editForm: {
                    course: "",
                    type: "",
                    group: "",
                    num: "",
                    name: ""
                },
                tableList: [{
                        label: '授课形式',
                        prop: 'teaching_formname',
                    }, {
                        label: '总组数',
                        prop: 'total_group',
                    }, {
                        label: '学生总数',
                        prop: 'cls_student_number',
                    }, {
                        label: '组号',
                        prop: 'group_number',
                    }, {
                        label: '上课班',
                        prop: 'name',
                    }, //新增
                    {
                        label: '组名',
                        prop: 'group_name',
                    }, {
                        label: '学生数',
                        prop: 'student_number',
                    },
                    // {label:'创建人', prop:'create_username',},
                    {
                        label: '创建日期',
                        prop: 'create_time',
                    },
                ],
                tableData: [],
                rules: {
                    rule: {
                        required: true,
                        message: '请输入授课形式',
                        trigger: 'blur'
                    }
                },
                myDate: new Date(),
                formYear: "",
                courseList: [],
                options1: [],
                classList: [],
                tableLoading: false,
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                btnPerObj: { //按钮权限
                    query: false,
                    edit: false,
                    relation: false
                }
            }
        },
        created() {
            this.getTermData();
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
                        if (item.code == "query_shangkezuguanli") { //查询
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "edit_shangkezuguanli") { //编辑
                            // self.btnPerObj.add=true;
                            self.btnPerObj.edit = true;
                        }
                        if (item.code == "relation_stu_shangkezuguanli") { //关联学生
                            // self.btnPerObj.revocation=true;
                            self.btnPerObj.relation = true;
                        }

                    });
                }).catch(() => {})
            },

            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
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
            onSearchYear(val) {
           
                if (val) {

                    for (let list of this.options1) {
                        if (list.id == val) {
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum;
                            this.getClassList(this.fallYear, this.semesterNum, this.formInline.courseId); //学期改变调用参数请求上课班
                            this.getCourseList(this.fallYear, this.semesterNum); //学期改变调用参数请求排课课程
                        }
                    }
                } else {
                    this.fallYear = "";
                    this.semesterNum = "";
                }
                this.getClassList(this.fallYear, this.semesterNum, this.formInline.courseId); //学期改变调用参数请求上课班
            },
            onSelectChange(_id) {
                for (let item of this.options1) {
                    if (item.id == _id) {
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                    }
                }
                this.getCourseList();
            },
            onSearch() {
                this.getTableList('search');
            },
            dialogClose() {
                this.editForm.name = "";
                this.dialog.visible = false;
            },
            editGroup(row) {
                this.rowId = row.id;
                this.dialog.visible = true;
                this.editForm.type = row.teaching_formname;
                this.editForm.group = row.total_group;
                this.editForm.num = row.group_number;
                this.editForm.name = row.group_name;
            },
            editConfirm() {
                this.$http.post("_ed:/coursecls/group/edit", {
                    id: this.rowId,
                    name: this.editForm.name
                }).then(data => {
                    let type = "success";
                    let message = "编辑成功！"
                    if (data.code == 0) {
                        this.dialog.visible = false;
                        this.getTableList();
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
            associateStudents(row) {
               
                row.semester_name = this.formYear
                this.$router.push({
                    path: "/teaching_management/class_student",
                    query: {
                        row: JSON.stringify(row)
                    }
                });
            },
            getTableList() {
                this.tableLoading = true;
                // classId
                this.$http.post("_ed:/coursecls/group/query2", {
                    cls_id: this.formInline.classId,
                    // cls_id:'',
                    request_page: this.pageNo,
                    page_size: this.pageSize,
                    semester_course_id: this.formInline.courseId,
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum
                }).then(data => {
                    if (data.code == 0) {
                        this.tableLoading = false;
                        this.totalCount = data.data.total_records;
                        this.tableData = data.data.dataList;
                        if (this.tableData.name) {
                            //上课班name是一样的，取第一个就行
                            this.editForm.course = this.tableData[0].name;
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((error) => {
                    this.tableLoading = false;
                })
            },
            //排课课程请求列表
            getCourseList() {

                this.$http.post("_ed:/semestercourse/list", {
                        cls_id: this.formInline.classId,
                        request_page: this.pageNo,
                        page_size: this.pageSize,
                        semester_course_id: this.formInline.courseId,
                        semester_year: this.fallYear,
                        semester_year_number: this.semesterNum
                            //  "grade": 0,
                            //   "semester_year": 0,
                            //   "semester_year_number": 0,
                            // grade:
                            // semester_year
                            // semester_year_number
                            // semester_year:this.fallYear,
                            // semester_year_number:this.semesterNum
                    })
                    .then(data => {
                        if (data.code == 0) {
                            this.courseList = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            //  学期  排课课程  请求上课班
            changeClass(val) {
                this.getClassList(this.fallYear, this.semesterNum, this.formInline.courseId); //学期改变调用参数请求上课班
            },
            // 上课班数据请求
            getClassList(val1, val2) {
                let that = this;

                this.$http.post("_ed:/coursecls/list", {
                    semester_course_id: this.formInline.courseId,
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum
                }).then(data => {
                    if (data.code == 0) {
                        this.classList = data.data;
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            getTermData(query) {
                if (!query) {
                    query = "学期";
                }
                this.$http.get('_op:/terms/' + query)
                    .then(data => {
                        if (data.code == 0) {
                            this.options1 = data.data;
                              
                            for(let i=0;i<this.options1.length;i++){
                             
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                               
                            }
                            // this.options1.forEach(item =>{
                            //     if(item.name.indexOf("当前学期")!=-1){
                            //         this.formYear=this.options1[i].id
                            //         this.addForm = this.options1[i].name;
                            //         this.semesterNum = this.options1[i].orderNum;
                            //         this.fallYear =this.options1[i].year;
                            //     }else {
                                   

                            //     }
                            // })
                           
                            // this.getTableList();
                            this.onSearch();
                            this.getClassList(this.formYear, this.semesterNum);
                            this.getCourseList(this.formYear, this.semesterNum);
                        } else {
                            this.$message.error(data.msg);
                        }

                    })
            }

        }
    }
</script>
<style>
    .dv-wrap {
        display: flex;
    }
</style>