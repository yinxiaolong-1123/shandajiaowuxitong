<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold" style="padding-bottom: 20px;">
            <el-form :inline="true" size="small" label-width="68px">
                <div class="fold">
                    <div ref="formDetail" class="">
                        <el-form-item label="学期">
                            <el-input v-model="row.semester_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <el-input v-model="row.grade" :disabled="true" class="szj" width="100px;"></el-input>
                        </el-form-item>
                        <el-form-item label="排课课程" class="pkkcBOX">
                            <el-input v-model="row.course_name" :disabled="true" class="pkkc"></el-input>
                        </el-form-item>
                        <el-form-item label="上课班" class="skbbox">
                            <el-input v-model="row.cls_name" :disabled="true" class="skb"></el-input>
                        </el-form-item>
                        <el-form-item label="" class="">
                            <el-button size="small" @click="onClosed">关 闭</el-button>
                        </el-form-item>

                    </div>
                </div>
                <div class="fold">
                    <div ref="formDetail2" class="">
                        <el-form-item label="授课老师">
              <el-select v-model="newData1" clearable   placeholder="请选择授课老师">
                      <el-option
                    v-for="item in array1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="授课场地">
              <el-select v-model="newData2" clearable  placeholder="请选择场地">
                    <el-option
                    v-for="item in array2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="授课形式">
              <el-select v-model="newData3" clearable   placeholder="请选择授课形式">
                    <el-option
                    v-for="item in array3"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="分组">
              <el-select v-model="newData4" clearable   placeholder="请选择分组">
                    <el-option
                    v-for="item in array4"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="">
             <el-button size="small" type="primary" class="" @click="onSearch">
                 查询
                </el-button>
            </el-form-item>
                    </div>
                </div>
            </el-form>

        </div>
        <div class="cm-table">
            <el-table ref="multipleTable" :data="tableData" border v-loading="tableLoading"
                header-row-class-name="cm-dark" max-height="600">
                <el-table-column label="序号" type="index" fixed width="50"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"
                    :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop=='section_nodeids'">
                            <template v-if="scope.row.section_nodeids">
                                {{ scope.row.section_nodeids.length}}
                            </template>
                        </template>
                        <template v-else-if="item.prop=='schedule_item_date'">
                            {{ scope.row.schedule_item_date | getTime}}
                        </template>
                        <template v-else-if="item.prop=='cls_name'">
                            {{ row.cls_name }}
                        </template>
                        <template v-else-if="item.prop=='status'">
                            {{ scope.row.status == 0 ? "未提交" : "已提交" }}
                        </template>
                        <template v-else-if="item.prop=='stu_num'">
                            <el-button type="text" @click="showAssociateDialog(scope.row)">{{scope.row[item.prop]}}
                            </el-button>
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="140" v-if="submit==0">
                    <template slot-scope="scope">
                        <el-button @click="copySchedule(scope.row)" type="text" size="small">复制</el-button>
                        <el-button @click="editSchedule(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="delTableRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div class="data-wrap">
                <div class="data-list">
                    实际理论/实践：<span>{{real_theory+"/"+real_novitiate}}</span>
                    理论：{{real_theory}} 实验：{{real_novitiate}}
                </div>
                <div class="data-list borderNone">
                    指导理论/实践：<span>{{exception_theory+"/"+exception_novitiate}}</span>
                    理论：{{exception_theory}} 实验：{{exception_novitiate}}
                </div>
            </div>
        </div>
          <el-button size="mini" class="backfrom"  type="primary" @click="handleBackFrom">返回</el-button>

       
        <!-- 复制，编辑 -->
        <el-dialog width="500px" :title="dialog.status==='copy'?'复制进度表条目':'编辑进度表条目'" :visible.sync="dialog.visible"
            :close-on-click-modal="false" :modal-append-to-body="false">

            <el-form ref="addForm" :model="addForm" :rules="rules">
                <span class="redStyle" style="color:red;">*</span>
                <el-form-item label="排课课程" class="flex-form">
                    <el-input v-model="row.course_name" :disabled="true"></el-input>
                </el-form-item>
                <span class="redStyle1" style="color:red;">*</span>
                <el-form-item label="上课班" class="flex-form">
                    <el-input v-model="row.cls_name" :disabled="true"></el-input>
                </el-form-item>
                <!-- <span class="redStyle2" style="color:red;">*</span> -->
                <el-form-item label="日期" prop="date" class="flex-form">
                    <el-date-picker style="width: 100%;" clearable v-model="addForm.date" type="date" value-format="yyyy-MM-dd" format="yyyy 年 MM 月 dd 日" placeholder="请选择日期"></el-date-picker>
                </el-form-item>
                 <!-- <span class="redStyle3" style="color:red;">*</span> -->
                <el-form-item label="课节" prop="section_nodeids" class="flex-form">
                    <el-select v-model="addForm.section_nodeids" multiple filterable value-key="id"
                        @change="onSectionChange" style="width: 100%;">
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <span class="redStyle4" style="color:red;">*</span> -->
                <el-form-item label="授课场地" prop="area" class="flex-form">
                    <el-select style="width: 100%;" v-model="addForm.area" multiple filterable value-key="id"
                        placeholder="请选择授课场地">
                        <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                 <!-- <span class="redStyle5" style="color:red;">*</span> -->
                <el-form-item label="授课形式" prop="type" class="flex-form">
                    <el-select v-model="addForm.type" value-key="id" placeholder="请选择授课形式" style="width: 100%;" @change="onTeachFormChanged">
                        <el-option v-for="item in teachList" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <!-- <span class="redStyle6" style="color:red;">*</span> -->
                <el-form-item label="分组" prop="groups" class="flex-form">
                    <el-select v-model="addForm.groups" value-key="id" multiple filterable placeholder="请设置分组"
                        style="width: 100%;">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <!-- <span class="redStyle7" style="color:red;">*</span> -->
                <el-form-item label="授课内容" prop="conten" class="flex-form">
                    <el-input v-model="addForm.conten" :disabled="true"></el-input>
                </el-form-item>
                 <!-- <span class="redStyle8" style="color:red;">*</span> -->
                <el-form-item label="授课老师" class="flex-form">
                    <el-input v-model="addForm.theach" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible=false">取 消</el-button>
                <el-button type="primary" @click="copyConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 关联学生 -->
        <el-dialog ref="associateDialog" width="1180px" title="关联学生" :visible.sync="associateDialog.visible"
            :modal-append-to-body="false" :show-close="false">
            <div class="cm-flod">
                <el-form :inline="true">
                    <el-form-item label="年级">
                        <intelligent-year-picker v-model="associateDialog.selectedGrade" type="year" value-format="yyyy"
                            size="small" style="width: 120px;" @change="getMajorsAndClasses"></intelligent-year-picker>
                    </el-form-item>
                    <el-form-item label="专业">
                        <el-select v-model="associateDialog.selectedMajor" size="small" value-key="id" clearable
                            filterable @change="getClassList">
                            <el-option v-for="major in associateDialog.majors" :key="major.id" :label="major.name"
                                :value="major"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-select v-model="associateDialog.selectedClass" size="small" value-key="id" clearable
                            filterable @change="getStudentWithClassId">
                            <el-option v-for="cls in associateDialog.classes" :key="cls.id" :label="cls.name"
                                :value="cls"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学号从">
                        <el-input clearable v-model="associateDialog.minStudentNum" size="small" maxlength="12"
                            style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-input clearable v-model="associateDialog.maxStudentNum" size="small" maxlength="12"
                            style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="filterStudents">查询学生</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <div style="display: flex; flex-direction: column;">
                    <span>上课内容</span>
                    <el-table ref="scheduleItemSelectionTable" border style="width: 360px;"
                        :data="associateDialog.candidateContents" @selection-change="scheduleItemSelectedChange"
                        max-height="420">
                        <el-table-column label="全选" type="selection"></el-table-column>
                        <el-table-column label="授课内容" width="240px" prop="teaching_content"></el-table-column>
                        <el-table-column label="授课形式" prop="teaching_formname"></el-table-column>
                        <el-table-column label="上课组" prop="group_names"></el-table-column>
                        <el-table-column label="上课日期" prop="schedule_item_date"></el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"></el-table-column>
                        <el-table-column label="周次" prop="week"></el-table-column>
                        <el-table-column label="星期几" prop="week_name"></el-table-column>
                    </el-table>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span>可选学生</span>
                    <el-table border style="width: 300px;" :data="associateDialog.shownCandidates"
                        @selection-change="candidatesSelectedChange" max-height="420"
                        v-loading="associateDialog.loadingCandidates" element-loading-text="加载中……"
                        element-loading-background="rgba(255, 255, 255, 0.8)">
                        <el-table-column label="全选" type="selection"></el-table-column>
                        <el-table-column label="学号" prop="studentNo"></el-table-column>
                        <el-table-column label="姓名" prop="name"></el-table-column>
                        <el-table-column label="行政班" prop="administrativeClassName"></el-table-column>
                    </el-table>
                </div>
                <div
                    style="display: flex; flex-direction: column; align-items:center; justify-content: center; align-content: center;">
                    <div>
                        <el-button size="small" type="primary" style="width: 80px;"
                            @click="appendCandidatesToSelectedStudent()">添加</el-button>
                    </div>
                    <div>
                        <el-button size="small" type="primary" style="width: 80px; margin-top: 13px;"
                            @click="removeSelectedStudents">删除</el-button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span>已选上课学生</span>
                    <div style="padding: 0px; height: 420px; overflow: auto;">
                        <el-collapse style="width: 370px;" v-if="associateDialog.refreshCollapse"
                            v-model="associateDialog.collapseActived">
                            <el-collapse-item v-for="(v,k) in associateDialog.selectedStudents" :key="k" :name="k"
                                :title="k">
                                <el-table border style="width: 365px;" :data="associateDialog.selectedStudents[k]"
                                    @selection-change="selectedStudentChange($event, k)">
                                    <el-table-column label="全选" type="selection"  width="40"></el-table-column>
                                    <el-table-column label="学号"  prop="studentNo"  width="110" ></el-table-column>
                                    <el-table-column label="姓名" prop="name" width="70"></el-table-column>
                                    <el-table-column label="行政班" prop="administrativeClassName"></el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAssociateDialog">取 消</el-button>
                <el-button type="primary" @click="associateStudents">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 冲突检查 -->
        <div :class="{datamsg:true,none:datamsgnone}">
            <div class="datamhsbody">
                <p>冲突明细</p>
                <div class="cm-table">
                    <el-table    
                    ref="datamsgTable"
                    :data="datamsglist"
                    border
                    style="width: 100%"
                    height="300px"
                    header-row-class-name="cm-dark">
                    <el-table-column label="冲突类别" prop="type"  width="100px"> </el-table-column>
                    <el-table-column label="冲突描述" prop="conflict"> </el-table-column>
                    </el-table>
                </div>
                <div style=" text-align: right;padding-top: 10px;">
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" size="mini" @click="colsedatamsg">确 定</el-button>
                    </span>
                </div>
            </div>
            </div>


    </section>

</template>

<script>
    import util from '@/util'
    const TYPE = 'group-management';
    const REMARK = '进度表查看';
    export default {
        name: TYPE,
        data() {
            return {

                datamsgnone:true,
                datamsglist:[],//报错的数组

                newData1: '',
                newData2: '',
                newData3: '',
                newData4: '',
                array1: [],
                array2: [],
                array3: [],
                array4: [],
                newtableData2: [],
                breadcrumb: [
                    {
                        label: "教学管理"
                    },
                    {
                        label: "进度表管理",
                        path: '/teaching_management/schedule_management'
                    },
                    {
                        label: REMARK
                    },
                ],
                dialog: {
                    status: 'copy',
                    visible: false
                },
                associateDialog: {
                    visible: false,
                    schedule_id: '',
                    refreshCollapse: true, // 用于强制刷新已选学生的标志
                    selectedGrade: "",
                    selectedMajor: {},
                    selectedClass: {},
                    minStudentNum: "",
                    maxStudentNum: "",
                    majors: [],
                    classes: [],
                    candidates: [], // 候选学生
                    shownCandidates: [], // 过滤后需显示的候选人
                    candidateContents: [], // 候选内容
                    selectedContents: [], // 已选内容
                    selectedStudents: {}, // 已选学生
                    selectedCandidates: [], // 已选的候选学生
                    prepareRemoveStudents: {},
                    loadingCandidates: false, // 加载候选人
                    collapseActived: []
                },

                // activeNames:['2019'],
                addForm: {
                    date: "",
                    area: [],
                    type: {
                        id: "",
                        name: ""
                    },
                    group: "",
                    groups:[],
                    conten: "",
                    theach: "",
                    theachid: "",
                    section_nodeids: "" //课节
                },
                tableList: [{
                        label: '周次',
                        prop: 'week',
                        width: 50
                    },
                    {
                        label: '日期',
                        prop: 'schedule_item_date',
                        width: 130
                    },
                    {
                        label: '星期',
                        prop: 'week_name',
                        width: 60
                    },
                    {
                        label: '课节',
                        prop: 'section_nodenames',
                        width: 60
                    },
                    {
                        label: '节数',
                        prop: 'section_nodeids',
                        width: 60
                    },
                    {
                        label: '授课场地',
                        prop: 'area_name',
                        width: 180
                    },
                    {
                        label: '授课形式',
                        prop: 'teaching_formname',
                        width: 90
                    },
                    {
                        label: '授课内容',
                        prop: 'teaching_content'
                    },
                    // {label:'上课班', prop:'cls_name',width:200},
                    {
                        label: '老师',
                        prop: 'teacher_names',
                        width: 120
                    },
                    {
                        label: '分组',
                        prop: 'group_names',
                        width: 100
                    },
                    {
                        label: '学生数',
                        prop: 'stu_num',
                        width: 70
                    },
                    {
                        label: '状态',
                        prop: 'status',
                        width: 70
                    }
                ],
                tableData: [{
                        date: '2016-05-03',
                        name: '基础医学',
                        creator: '张三丰',
                        code: 2003
                    },
                    {
                        date: '2016-05-03',
                        name: '基础医学',
                        creator: '张三丰',
                        code: 2003
                    },
                    {
                        date: '2016-05-03',
                        name: '基础医学',
                        creator: '张三丰',
                        code: 2003
                    },
                    {
                        date: '2016-05-03',
                        name: '基础医学',
                        creator: '张三丰',
                        code: 2003
                    },
                    {
                        date: '2016-05-03',
                        name: '基础医学',
                        creator: '张三丰',
                        code: 2003
                    },
                ],
                row: "",
                submit: "0",
                real_theory: "", //理论
                real_novitiate: "", //实践
                exception_theory: "",
                exception_novitiate: "",
                teachList: [],
                groupList: [],
                classList: [],
                areaList: [],
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
                tableLoading: false,
                rules:{
                    date: [{ required: true, message: '请选择日期', trigger: 'blur'}],
                    area: [{ required: true, type:'array', message: '请选择授课场地', trigger: 'blur'}],
                    type: [{ required: true, message: '请选择授课形式', trigger: 'blur'}],
                    groups: [{ required: true, type:'array', message: '请设置分组', trigger: 'blur'}],
                    // conten: [{ required: true, message: '请选择授课内容', trigger: 'blur'}],
                    section_nodeids: [{ required: true, type:'array', message: '请选择课节', trigger: 'blur'}],
                }
            }
        },
        created() {
            this.row = JSON.parse(this.$route.query.row);
            this.getTableList();
            this.getTeachType();
            this.getAreaData();
            this.geLessonList();
            this.filterlist()
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
            };

        },
        filters: {
            getTime(time) {
                return util.getTime(time);
            }
        },
        methods: {
            colsedatamsg(){
                this.datamsgnone = true
                this.datamsglist = []
            },
            onSearch(){
                this.getTableList()
            },
            //返回
              handleBackFrom() {
                this.$router.go(-1)
                // this.$router.push({
                //   path: '/base_data/course_platform',
                // });
            },
            // 根据上课班和授课形式，获取分组信息
            fetchGroupsWithCondition(clsId, teachForm, callback) {
                // this.$http.get(`_ed:/coursecls/group/cls/${this.row.cls_id}/teachingform/${row.teaching_form}`)
                this.$http.get(`_ed:/coursecls/group/cls/${clsId}/teachingform/${teachForm}`)
                    .then(data => {
                        if (data.code == 0) {
                            this.groupList = data.data;
                            // 变更：像这种业务逻辑，和函数本没有多大关系的逻辑，最好提炼到另一个地方，使用回调是一种方式，可以有其他的方式，目的是让
                            // 当前的函数逻辑清晰，简单，并且和不相关的逻辑进行解耦
                            // for (let value of this.groupList) {
                            //     for (let val of row.group_ids) {
                            //         if (value.id == val) {
                            //             this.groups.push({
                            //                 id: value.id,
                            //                 group_number: value.group_number,
                            //                 group_name: value.name
                            //             })
                            //         }
                            //     }
                            // }
                            if(typeof(callback) === 'function') {
                                callback(this.groupList);
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
    
            // 对话框中的授课形式选择改变
            onTeachFormChanged(val) {
                // 当授课形式发生了变化，清空调已经选择的分组，因为保存的也没有意思了，
                // 并且重新获取该授课形式下的分组
                this.addForm.groups.splice(0);
                this.fetchGroupsWithCondition(this.row.cls_id, val.id);
            },
            onClosed() {
                this.$router.go(-1);
            },
            sizeChange() {

            },
            currentChange() {

            },
            onSectionChange(val) {
                this.sectionnodelist = [];
                for (let list of this.classList) {
                    for (let item of val) {
                        if (list.id == val) {
                            this.sectionnodelist.push({
                                section_nodeid: list.id,
                                section_nodename: list.name
                            })
                        }
                    }
                }

            },
         
            copySchedule(row) {
                this.dialog.status = 'copy';
                this.dialog.visible = true;
                this.setCommonData(row);
            },
            editSchedule(row) {
                this.setCommonData(row);
                this.dialog.status = 'edit';
                this.dialog.visible = true;
            },
            setCommonData(row) {
                const loading = this.$loading({
                    lock: true,
                    text: '加载中···',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.groups = [];
                this.rowId = row.id;
                this.sectionnodelist = [];

                // 变更：当场地获取完成后，依据当前编辑或拷贝数据的场地id过滤出场地对象
                // 将过滤出来的场地对象绑定到下拉框中
                var temp = new Array();
                row.area_ids.forEach(id => {
                    temp = temp.concat(this.areaList.filter(a => a.id == id));
                });
                this.addForm.area = [].concat(temp);
                // this.geLessonList();
                // this.getTeachType();
                this.fetchGroupsWithCondition(this.row.cls_id, row.teaching_form, (list) => {
                    // 通过这里的回调，当获取到分组信息时，根据当前的记录的分组信息，过滤出组对象，并绑定到控件上
                    console.info(list);
                    var temp = new Array();
                    row.group_ids.forEach(id => {
                        temp = temp.concat(list.filter(g => g.id == id));
                    });
                    console.info(temp);
                    this.addForm.groups = [].concat(temp);
                    loading.close();
                });

                this.addForm.theach = row.teacher_names;
                this.addForm.theachid = row.teacher_ids;
                let typeobj = {}
                typeobj.id = row.teaching_form
                typeobj.name = row.teaching_formname
                this.addForm.type = typeobj
                // this.addForm.type.id = row.teaching_form;
                // this.addForm.type.name = row.teaching_formname;
                this.addForm.conten = row.teaching_content;

                this.addForm.section_nodeids = row.section_nodeids.map(item => {
                    var section = {};
                    section.id = item;
                    return section;
                });
                this.addForm.date = util.getTime1(row.schedule_item_date);
                //课节id
                let classArr = row.section_nodenames.split(",");


                for (let j = 0, lens = classArr.length; j < lens; j++) {
                    this.sectionnodelist.push({
                        section_nodeid: row.section_nodeids[j],
                        section_nodename: classArr[j]
                    })
                }
            },
            copyConfirm() {
                this.$refs['addForm'].validate(valid => {
                    if (!valid) {
                        return false;
                    }else{
                        this.submitForm();
                    }
                })
            },
            submitForm(){
                let url;
                let sectionnodelist = []; //课节
                let myareaid = []; //场地
                this.addForm.section_nodeids.map((item, index) => {
                    if (!item.name) {
                        var t = this.classList.filter(x => x.id == item.id);
                        item.name = t[0].name;
                    }
                    // console.info(item.name);
                    sectionnodelist.push({
                        section_nodeid: item.id,
                        section_nodename: item.name
                    });
                });
                //   this.areaList.map((item, index) => {
                //     if(item==){

                //     }
                //     myareaid.push(item.id)
                //     myareaname.push(item.name)
                //     // console.info(item.name);
                // 变更：将选择的场地分成两个数组，一个id数组，一个名字数组
                
                var area_ids = this.addForm.area.map(x => x.id);
                var area_names = this.addForm.area.map(x => x.name);
                // 变更：将选择的分组对象数组，转换成待提交的对象结构
                var groups = this.addForm.groups.map(x => {
                    var o = {
                        id: x.id,
                        group_number: x.group_number,
                        group_name: x.name
                    };
                    return o;
                });
                console.info(groups);
                
                let option = {
                    id: this.rowId,
                    groups: groups,
                    area_id: area_ids[0],
                    area_ids: area_ids,
                    area_name: area_names.join(","),
                    schedule_item_date: this.addForm.date,
                    sectionnodelist: sectionnodelist,
                    teaching_form: this.addForm.type.id,
                    teaching_formname: this.addForm.type.name,
                    teacher_ids : this.addForm.theachid,
                    teacher_names: this.addForm.theach
                };
                
                if (this.dialog.status == "copy") {
                   
                    url = "_ed:/schedule/detail/copy"
                    delete option.teacher_ids ;
                    delete option.teacher_names
                } else {
                   
                    url = "_ed:/schedule/detail/edit"
                }
                this.$http({
                    method: "post",
                    url: url,
                    data: {
                        ...option
                    }
                }).then(data => {
                    let type = "success";
                    let message = `${this.dialog.status=="copy" ? "复制" : "编辑"}成功！`;
                    if (data.code == 0) {
                        this.dialog.visible = false;
                        this.$refs['addForm'].resetFields();
                        this.getTableList();
                    }else if(data.code == 1){
                        if(data.data.length>0){
                            this.datamsglist = data.data 
                            this.datamsgnone = false
                        }else{
                            this.$message({
                                type: 'error',
                                message: data.msg
                            })
                        }
                    }
                })
            },
            delTableRow(row) {
                this.$confirm(`此操作将永久删除“${this.row.cls_name}”所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("_ed:/schedule/detail/delete", {
                        id: row.id,
                        create_user: this.userId,
                        create_username: this.userName
                    }).then(data => {
                        let type = "success";
                        let message = "删除成功！"
                        if (data.code == 0) {
                            this.getTableList();
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
             filterlist(){ //四个列表的
          
            let self = this
            this.$http.get('_ed:/schedule/getComboxDate/'+this.row.id).then(res=>{
                if(res.data!=null){
                         self.array1 = res.data.teacherList
                        self.array2 = res.data.areaList
                        self.array3 = res.data.teacherFormList
                        self.array4 = res.data.groupList
                        console.log( self.array1,'3233')
                }
                
              
                // this.array2 = ''groupList
                // this.array3 = ''teacherFormList:
                // this.array4 = ''
                // areaList
            })
        },
            getTableList() {
                
                let query = {
                    schedule_id:this.row.id,
                    teacher_id: this.newData1,
                    area_id: this.newData2,
                    teaching_form: this.newData3,
                    group_id: this.newData4
                }
                this.tableLoading = true;
                this.$http.post("_ed:/schedule/detail/",query)
                    .then(data => {
                        if (data.code == 0) {
                            this.real_theory = data.data.real_theory_hours;
                            this.real_novitiate = data.data.real_novitiate_hours;
                            this.exception_theory = data.data.exception_theory_hours;
                            this.exception_novitiate = data.data.exception_novitiate_hours;
                            this.tableData = data.data.schedule_items;
                            this.newtableData2 = data.data.schedule_items

                            // this.array1 = this.unique(this.newtableData2, 'teacher_names')
                            // this.array2 = this.unique(this.newtableData2, 'area_name')
                            // this.array3 = this.unique(this.newtableData2, 'teaching_formname')
                            // this.array4 = this.unique(this.newtableData2, 'group_names')

                            if (this.tableData.length > 0) {
                                this.submit = this.tableData[0].status;
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                        this.tableLoading = false;
                    })
            },
            getTeachType() {
                this.$http.get("_op:/teaching/form/combox")
                    .then(data => {
                        if (data.code == 0) {
                            this.teachList = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            // 变更：这里不再传入查询关键字，因为要获取所有的场地（防止如果只获取部分数据，显示时会存在问题。），筛选由本地完成
            // 变更：这里传入一个回调，当场地获取完毕时，调用回调进行特定的业务处理
            getAreaData(callback) {
                // if (!query) {
                //     query = "";
                // }
                var url = encodeURI(`_op:/areas/combox/search`);
                this.$http.get(url)
                    .then(data => {
                        if (data.code == 0) {
                            this.areaList = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                        if (typeof(callback) === 'function') {
                            callback(this.areaList);
                        }
                    })
            },
            geLessonList() { //获取课节
                this.$http.get("_op:sections/find").then(data => {
                    if (data.code == 0) {
                        this.classList = data.data;
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            // 获取专业列表
            getMajorsAndClasses(grade) {
                if (!grade) grade = this.associateDialog.selectedGrade;
                if (!grade) grade = '';
                var url = encodeURI(`_op:/major/combox/${grade}`);
                this.$http.get(url).then(resp => {
                    this.associateDialog.majors = resp.data;
                    this.getClassList();
                }).catch(err => {

                })
            },
            getClassList() {
                var url = '';
                if (!this.associateDialog.selectedGrade) this.associateDialog.selectedGrade = '';
                if (!this.associateDialog.selectedMajor) this.associateDialog.selectedMajor = {
                    id: ''
                };

                if (this.associateDialog.selectedGrade) {
                    url = `_op:/students/class/list/${this.associateDialog.selectedGrade}`;
                    if (this.associateDialog.selectedMajor.id) {
                        url = encodeURI(`${url}/${this.associateDialog.selectedMajor.id}`);
                        this.$http.get(url).then(resp => {
                            var temp = [];
                            var otemp = {};
                            resp.data.forEach(x => {
                                if (!otemp[x.id]) {
                                    temp.push(x);
                                    otemp[x.id] = 1;
                                }
                            })
                            this.associateDialog.classes = [].concat(temp);

                        }).catch(err => {

                        })
                    }
                }
            },
            // 依据行政班获取学生
            getStudentWithClassId(cls) {
                var self = this;
                this.associateDialog.loadingCandidates = true;
                var url = encodeURI(`_op:/students/student/list/${cls.id}`);
                this.$http.get(url).then(resp => {
                    var temp = resp.data.filter(x => {
                        for (var k in self.associateDialog.selectedStudents) {
                            var t = self.associateDialog.selectedStudents[k].filter(y => y.id == x.id);
                            if (t.length > 0) return false;
                        }
                        return true;
                    });
                    console.info(temp);
                    this.associateDialog.candidates = [].concat(temp);
                    this.associateDialog.shownCandidates = [].concat(temp);
                    this.associateDialog.loadingCandidates = false;
                }).catch(err => {
                    this.associateDialog.loadingCandidates = false;
                })
            },
            // 打开关联学生对话框
            showAssociateDialog(val) {
                this.getMajorsAndClasses();

                this.associateDialog.visible = true;
                this.associateDialog.schedule_id = val.id;
                this.associateDialog.candidateContents = this.tableData.filter(x => (x.teaching_form == val
                    .teaching_form && x.group_names == val.group_names));
                this.$nextTick(() => {
                    this.$refs.scheduleItemSelectionTable.toggleRowSelection(val);
                })
            },
            // 关闭关联学生对话框
            closeAssociateDialog() {
                this.associateDialog.visible = false;
                this.$refs.scheduleItemSelectionTable.clearSelection();
                this.associateDialog.schedule_id = '';
                this.associateDialog.selectedClass = {};
                this.associateDialog.selectedStudents = {};
                this.associateDialog.candidates.splice(0);
                this.associateDialog.shownCandidates.splice(0);
                this.associateDialog.selectedCandidates.splice(0);
                this.associateDialog.refreshCollapse = false;
                this.associateDialog.selectedCandidates.splice(0);
                this.$nextTick(() => {
                    this.associateDialog.refreshCollapse = true;
                })
            },
            // 关联学生
            associateStudents() {
                const loading = this.$loading({
                    lock: true,
                    text: "保存中...",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                var _data = {
                    scheduleItemId: this.associateDialog.schedule_id,
                    list: []
                };
                this.associateDialog.selectedContents.forEach(c => {
                    for (var k in this.associateDialog.selectedStudents) {
                        this.associateDialog.selectedStudents[k].forEach(s => {
                            var d = {}
                            console.info("student: ", s);
                            d.studentId = s.id
                            d.areaId = c.area_id;
                            // d.scheduleItemId = c.id
                            _data.list.push(d);
                        })
                    }
                });
                this.$http.post(`_ed:/scheduleItemStudent/addBatch`, _data).then(resp => {
                    loading.close();
                    if(resp.code==0){
                        this.getTableList();
                    }else if(resp.code==1){
                        if(resp.data.length>0){
                            this.datamsglist = data.data
                            this.datamsgnone = false
                            
                        }
                    }
                }).catch(err => {
                    loading.close();
                })
                this.closeAssociateDialog();
            },
            // 关联学生内容选择变化
            scheduleItemSelectedChange(val) {
                this.associateDialog.selectedContents = [].concat(val);
                let selectedContentIds = this.associateDialog.selectedContents.map(x => x.id);
                if (selectedContentIds.length <= 0) return;
                this.$http.post(`_ed:/scheduleItemStudent/list/by/ids`, selectedContentIds).then(resp => {
                    if (resp.data.length > 0) {
                        let students = resp.data.map(s => {
                            var n = {};
                            // console.log('tag00000', s)
                            n.id = s.studentId;
                            n.studentNo = s.studentNo;
                            n.name = s.studentName;
                            n.grade = s.grade;
                             n.administrativeClassName = s.administrativeClassName;
                            return n;
                        })
                        var temp = this.associateDialog.selectedStudents;

                        students.forEach(s => {
                            if (!temp) {
                                temp = {};
                            }
                            if (!temp[s.grade]) {
                                temp[s.grade] = new Array();
                            }
                            console.info(s);
                            let exists = temp[s.grade].filter(x => x.id == s.id);
                            console.info(exists);
                            if (exists.length <= 0) {
                                temp[s.grade].push(JSON.parse(JSON.stringify(s)));
                            }
                        })

                        this.associateDialog.refreshCollapse = false;
                        this.associateDialog.selectedStudents = temp;
                        this.$nextTick(() => {
                            this.associateDialog.refreshCollapse = true;
                        })
                    }
                }).catch(err => {

                })
            },
            // 关联学生选择变化
            candidatesSelectedChange(val) {
                this.associateDialog.selectedCandidates = val;
            },
            // 将选择的候选学生添加到已选上课学生列表
            appendCandidatesToSelectedStudent() {

                if (!this.associateDialog.selectedStudents[this.associateDialog.selectedGrade]) {
                    this.associateDialog.selectedStudents[this.associateDialog.selectedGrade] = new Array();
                }

                this.associateDialog.refreshCollapse = false;
                this.associateDialog.selectedStudents[this.associateDialog.selectedGrade] =
                    this.associateDialog.selectedStudents[this.associateDialog.selectedGrade].concat(this
                        .associateDialog.selectedCandidates);


                this.associateDialog.collapseActived = this.associateDialog.selectedStudents
                this.$nextTick(() => {
                    this.associateDialog.refreshCollapse = true;
                })
                this.associateDialog.selectedCandidates.forEach(x => {
                    this.associateDialog.candidates.forEach((v, i) => {
                        if (v.id == x.id) {
                            this.associateDialog.candidates.splice(i, 1);
                        }
                    })

                })
                this.associateDialog.collapseActived = [this.associateDialog.selectedGrade]
                //把左边选过的 清掉
                this.associateDialog.selectedCandidates.forEach(x => {
                    this.associateDialog.shownCandidates.forEach((v, i) => {
                        if (v.id == x.id) {
                            this.associateDialog.shownCandidates.splice(i, 1);

                        }
                    })
                })



            },
            // 已选学生移除选择事件
            selectedStudentChange(val, k) {

                if (!this.associateDialog.prepareRemoveStudents[k]) {
                    this.associateDialog.prepareRemoveStudents[k] = new Array();
                }
                this.associateDialog.prepareRemoveStudents[k] = [].concat(val);


            },
            // 移除已经选择的学生
            removeSelectedStudents() {

                for (var k in this.associateDialog.prepareRemoveStudents) {

                    this.associateDialog.prepareRemoveStudents[k].forEach(x => {
                        this.associateDialog.selectedStudents[k].forEach((v, i) => {
                            if (v.id == x.id) {
                                this.associateDialog.selectedStudents[k].splice(i, 1);

                            }
                        })
                        this.associateDialog.refreshCollapse = false;
                        if (this.associateDialog.selectedStudents[k].length <= 0) {
                            delete this.associateDialog.selectedStudents[k];
                        }
                        this.$nextTick(() => {
                            this.associateDialog.refreshCollapse = true;
                        })
                    })
                }

            },
            filterStudents() {
                var temp = this.associateDialog.candidates.filter(c => {
                    var shown = false;

                    if (this.associateDialog.minStudentNum != '' && this.associateDialog.maxStudentNum != '') {
                        console.info("case 1");
                        shown = ((c.studentNo * 1) >= (this.associateDialog.minStudentNum * 1)) && ((c
                            .studentNo * 1) <= (this.associateDialog.maxStudentNum * 1));
                    } else if (this.associateDialog.minStudentNum != '') {
                        console.info("case 2");
                        shown = ((c.studentNo * 1) >= (this.associateDialog.minStudentNum * 1))
                    } else if (this.associateDialog.maxStudentNum != '') {
                        console.info("case 3");
                        shown = ((c.studentNo * 1) <= (this.associateDialog.maxStudentNum * 1));
                    } else {
                        shown = true;
                    }
                    return shown;
                })
                this.associateDialog.shownCandidates = [].concat(temp);
            },
            unique(arr, group_names) {
                if (group_names == 'teacher_names') {
                    let hash = {};
                    arr = arr.reduce(function (item, next) {
                        hash[next.teacher_names] ? '' : hash[next.teacher_names] = true && item.push(next);
                        return item
                    }, [])
                    // console.log(arr,'teaching_formname')
                    return arr
                }
                if (group_names == 'area_name') {
                    let hash = {};
                    arr = arr.reduce(function (item, next) {
                        hash[next.area_name] ? '' : hash[next.area_name] = true && item.push(next);
                        return item
                    }, [])
                    // console.log(arr,'area_name')
                    return arr
                }
                if (group_names == 'teaching_formname') {
                    let hash = {};
                    arr = arr.reduce(function (item, next) {
                        hash[next.teaching_formname] ? '' : hash[next.teaching_formname] = true && item.push(
                            next);
                        return item
                    }, [])
                    // console.log(arr,'teaching_formname')
                    return arr
                }

                if (group_names == 'group_names') {
                    let hash = {};
                    arr = arr.reduce(function (item, next) {
                        hash[next.group_names] ? '' : hash[next.group_names] = true && item.push(next);
                        return item
                    }, [])
                    // console.log(arr,'group_names')
                    return arr
                }

            },
        }
    }
</script>
<style scoped>

    .datamsg{
    position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    
    z-index: 100000;
    }
    .none{
    display: none;
    }
    .datamsg .datamhsbody{
    background:#f5f7fa;
    width: 30%;
        border: solid 1px #ddd;
        margin: 100px auto;
        padding: 20px 20px;
    }
        
    .datamhsbody /deep/.dialog-footer{
        /* padding: 10px 20px 20px; */
        text-align: right;
    }
    .flex-form{
        position: relative;
    }
  .redStyle{
    position: absolute;
    left: 16px;
    top: 96px;
  }
  .redStyle1{
     position: absolute;
    left: 30px;
    top: 160px;
  }
  .redStyle2{
     position: absolute;
    left: 40px;
    top: 220px;
  }
   .redStyle3{
     position: absolute;
    left: 40px;
    top: 285px;
  }
   .redStyle4{
     position: absolute;
    left: 20px;
    top: 345px;
  }
   .redStyle5{
     position: absolute;
    /* left: 12px; */
    top: 405px;
  }
    .redStyle6{
     position: absolute;
    /* left: 10px; */
    top: 470px;
  }
   .redStyle7{
     position: absolute;
    /* left: 16px; */
    top: 535px;
  }
   .redStyle8{
     position: absolute;
    /* left: 16px; */
    top: 595px;
  }
   /* .redStyle9{
     position: absolute;
    left: 16px;
    top: 480px;
  } */

  
  
    .cm-fold {
        padding-top: 10px;
        background-color: #f7f7f7;
    }

    .cm-btn-others {
        padding: 0 20px 10px;
    }

    .btn {
        margin-top: 3px;
    }

    .tips p {
        font-size: 13px;
        line-height: 20px;
    }

    .tips .tips-title {
        font-size: 14px;
        padding: 8px;
    }

    .cm-fold .fold /deep/ .el-form-item__content,
    .cm-fold .fold .el-date-editor.el-input {
        max-width: 186px;
    }

    .data-wrap {
        width: 100%;
        font-size: 14px;
        border: 1px solid #ebeef5;
        border-top: 0;
    }

    .data-list {
        padding: 10px 0;
        padding-left: 100px;
        border-bottom: 1px solid #ebeef5;
    }

    .data-list span {
        display: inline-block;
        width: 100px;
        color: #409EFF;
    }

    .borderNone {
        border-bottom: 0;
    }

    .szj {
        width: 100px !important;
        /* display: inline-block; */
    }

    .pkkcBOX {
        margin-right: 130px
    }

    .pkkc {
        width: 300px !important;

    }

    .skbbox {
        margin-right: 130px
    }

    .skb {
        width: 300px !important;
    }
    .backfrom{
        margin-left: 95%;
        /* margin-left: 20px;
        display: inline-block; */
    }
</style>