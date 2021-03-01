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
                        <el-form-item class="cm-collapse" v-if="btnPerObj.query">
                        	<el-button type="primary" @click="getTableList">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        
                        <el-form-item label="学期" prop="year">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                :remote-method="getTermData" 
                                placeholder="全部"
                                @change="onSelectChange">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select :disabled="formYear=='' " v-model="formInline.courseId" filterable placeholder="请选择排课课程">
                                                        
                             <el-option v-for="(list, index) in courseList" :key="index" :label="list.course_arrange+` (${list.majorNames} ${list.arranged_theory_hours}/${list.arranged_novitiate_hours})`" :value="list.id"></el-option>
                            </el-select>
                            </el-form-item>
                        <el-form-item label="上课班">
                            <el-select :disabled="formYear=='' " v-model="formInline.classId" filterable placeholder="请选择上课班">
                                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <intelligent-year-picker v-model="formInline.grade" type="year" value-format="yyyy" placeholder="选择年级">
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item>
                        </el-form-item>
                </div>
                <div class="btn" v-if="btnPerObj.add">
                    <el-button size="mini" type="primary" @click="addTask">新增课程表</el-button>
                </div>

                <div class="btn" style="margin-left:20px">
                    <el-button type="primary" size="mini"  @click="conflictChecking" :loading="equallybutton">{{equallytext}}</el-button>
                </div>
                </div>
                </el-form>
                </div>
<div class="cm-table">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%" size="mini" v-loading="tableLoading" element-loading-text="加载中..." header-row-class-name="cm-dark">
        <el-table-column label="序号" type="index" fixed></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
            <template slot-scope="scope">
                        <template v-if="item.label=='创建日期'">
                             {{ scope.row.create_time | getTime}}
                        </template>
            <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
            </template>
        </el-table-column>

        <!-- <el-table-column v-if="btnPerObj.edit||btnPerObj.entry||btnPerObj.delete" fixed="right" label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="editTimetable(scope.row)" type="text" size="mini" 
                v-if="btnPerObj.edit && (scope.row.publish_status == 0 || scope.row.publish_status == 1)">编辑</el-button>
                <el-button @click="onEntry(scope.row)" type="text" size="mini" 
                v-if="btnPerObj.entry && (scope.row.publish_status == 0 || scope.row.publish_status == 1)">录入</el-button>
                <el-button @click="onEntry(scope.row)" type="text" size="mini" v-if="scope.row.publish_status == 2">查看</el-button>
                <el-button @click="delTableRow(scope.row)" type="text" size="mini" style="color: red;" 
                v-if="btnPerObj.delete && scope.row.publish_status == 0">删除</el-button>
            </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="editTimetable(scope.row)" type="text" size="mini" 
                v-if="scope.row.publish_status == 0 || scope.row.publish_status == 1">编辑</el-button>
                <el-button @click="onEntry(scope.row)" type="text" size="mini" 
                v-if="scope.row.publish_status == 0 || scope.row.publish_status == 1">录入</el-button>
                <el-button @click="onEntry(scope.row)" type="text" size="mini" v-if="scope.row.publish_status == 2">查看</el-button>
                <el-button @click="delTableRow(scope.row)" type="text" size="mini" style="color: red;" 
                v-if="scope.row.publish_status == 0">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</div>
<div class="cm-pagination">
    <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
    </el-pagination>
</div>
<!-- 新增、编辑 -->
<el-dialog class="pm-margin" :title="dialog.status==='add'?'新增课程表':'编辑课程表'" :visible.sync="dialog.visible" :close-on-click-modal="false" :modal-append-to-body="false" @closed="dialogClose" custom-class="cm-dialog-small">
    <el-form ref="addForm" :model="addForm">
        <el-form-item label="课程表名称" prop="name" class="flex-form">
            <el-input v-model="addForm.name" :maxlength="50" placeholder="请输入课程表名称"></el-input>
        </el-form-item>
        <el-form-item label="学期" prop="year" class="flex-form">
            <el-select style="width: 100%;" v-model="addForm.year" clearable filterable remote @change="onAddYear" :remote-method="getTermData" :disabled="dialog.status=='edit'?true:false" placeholder="全部">
                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.year+'-'+item.orderNum"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在级" prop="grade" class="flex-form">
            <intelligent-year-picker style="width: 100%;" v-model="addForm.grade" type="year" value-format="yyyy" placeholder="选择年级">
            </intelligent-year-picker>
        </el-form-item>
        <el-form-item label="备注信息" prop="note" class="flex-form">
            <el-input type="textarea" v-model="addForm.note" :maxlength="200" placeholder="请输入备注"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
	            <el-button @click="dialogClose">取 消</el-button>
	            <el-button type="primary" @click="confirmAdd">确 定</el-button>
	        </span>
</el-dialog>

    <el-dialog title="冲突明细" :visible.sync="dialogShow" width="85%" :modal-append-to-body="false">
        <div class="cm-table" v-loading="conflictLoading">
            <el-tabs v-model="activeName" @tab-click="getconflictdelis">
                <el-tab-pane name="teacherandstudents">
                    <span slot="label"> 场地、老师、小组、学生冲突 (<span style="color:red">{{conflictnum1}}</span>)</span>
                    
                    <el-tabs v-model="activeName2"  @tab-click="handleTabChange2" type="border-card">
                        <el-tab-pane name="first">
                            <span slot="label"> 场地冲突 (<span style="color:red">{{conflictnum4}}</span>)</span>
                            <el-table    
                                ref=""
                                :data="dialogdelist"
                                border
                                style="width: 100%"
                                height="400px"
                                header-row-class-name="cm-dark">

                                <el-table-column label="序号" type="index" width="50"> </el-table-column>
                                <el-table-column label="场地" prop="area_name" > </el-table-column>
                                <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                                <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                                <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                                <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                                <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                                <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                                <el-table-column label="上课班" prop="cls_name"  width="300"> </el-table-column>
                                <el-table-column label="小组" prop="group_names"  width="130"> </el-table-column>
                            </el-table>
                        </el-tab-pane>

                        <el-tab-pane  name="second">
                            <span slot="label"> 老师冲突 (<span style="color:red">{{conflictnum5}}</span>)</span>
                            <el-table    
                                ref=""
                                :data="dialogdelist"
                                border
                                style="width: 100%"
                                height="400px"
                                header-row-class-name="cm-dark">
                                <el-table-column label="序号" type="index" width="50"> </el-table-column>
                                <el-table-column label="老师" prop="teacher_name"  width="80"> </el-table-column>
                                <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                                <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                                <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                                <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                                <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                                <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                                <el-table-column label="小组" prop="group_names"  width="250"> </el-table-column>
                            </el-table>

                        </el-tab-pane>
                        
                        <el-tab-pane name="third">
                            <span slot="label"> 小组冲突 (<span style="color:red">{{conflictnum6}}</span>)</span>
                            <el-table    
                                ref=""
                                :data="dialogdelist"
                                border
                                style="width: 100%"
                                height="400px"
                                header-row-class-name="cm-dark">
                                <el-table-column label="序号" type="index" width="50"> </el-table-column>
                                <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                                <el-table-column label="上课班" prop="cls_name" > </el-table-column>
                                <el-table-column label="小组" prop="group_names"  width="180"> </el-table-column>
                                <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                                <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                                <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                                <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                                <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                            </el-table>
                        </el-tab-pane>

                        <el-tab-pane  name="fourth">
                            <span slot="label"> 学生冲突 (<span style="color:red">{{conflictnum7}}</span>)</span>
                            <el-table    
                                ref=""
                                :data="dialogdelist"
                                border
                                style="width: 100%"
                                height="400px"
                                header-row-class-name="cm-dark">

                                <el-table-column label="序号" type="index" width="50"> </el-table-column>
                                <el-table-column label="姓名" prop="stu_name" width="80"> </el-table-column>
                                <el-table-column label="行政班" prop="admin_name" width="160"> </el-table-column>
                                <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                                <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                                <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                                <el-table-column label="课节" prop="section_nodenames"  width="60"> </el-table-column>
                                <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                                <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                                <el-table-column label="上课班" prop="cls_name"  width="300"> </el-table-column>
                                <el-table-column label="小组" prop="group_names"  width="170"> </el-table-column>
                            </el-table>
                        </el-tab-pane>

                        <!-- <el-tab-pane label="其他冲突" name="fifth">
                            <span slot="label">其他冲突 (<span style="color:red">{{conflictnum8}}</span>)</span>
                            <el-table    
                                ref=""
                                :data="dialogdelist"
                                border
                                style="width: 100%"
                                height="400px"
                                header-row-class-name="cm-dark">

                                <el-table-column label="序号" type="index" width="50"> </el-table-column>
                                <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                                <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                                <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                                <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                                <el-table-column label="上课小组" prop="group_names"  width="170"> </el-table-column>
                                <el-table-column label="上课场地" prop="area_name" > </el-table-column>
                                <el-table-column label="上课内容" prop="teaching_content"></el-table-column>
                                <el-table-column label="上课老师" prop="teacher_names" width="100"> </el-table-column>
                            </el-table>
                        </el-tab-pane> -->

                    </el-tabs>

                    <div class="cm-pagination" style="padding-top:10px;">
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage1"
                            :page-sizes="[10, 20, 30, 40, 50]"
                            :page-size="conflictpageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="conflicttotal">
                        </el-pagination>
                    </div>

                </el-tab-pane>

                <el-tab-pane name="contentandtimetable">
                    <span slot="label">课表与内容不一致 (<span style="color:red">{{conflictnum2}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="contentandtimetableList"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">
                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                        <el-table-column label="课程名称" prop="course_name"> </el-table-column>
                        <el-table-column label="班级名称" prop="cls_name"  width="300"> </el-table-column>
                        <el-table-column label="异常说明" prop="note" width="300">
                            <template slot-scope="scope">
                                <el-button type="text" @click="showExceptionDetail(scope.row)">
                                    {{scope.row.note}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane  name="fieldandfield">
                    <span slot="label"> 同一场地安排了多个小组 (<span style="color:red">{{conflictnum3}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="oneAreaManyGroupList"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">
                        <el-table-column label="年级" width="60" prop="grade"> </el-table-column>
                        <el-table-column label="课程" prop="course_arrange"> </el-table-column>
                        <el-table-column label="班级" prop="cls_name"> </el-table-column>
                        <el-table-column label="周次" prop="week_names" width="100"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames" width="60"> </el-table-column>
                        <el-table-column label="授课形式" prop="teaching_formname" width="80"> </el-table-column>
                        <el-table-column label="场地" prop="area_name">
                            <template slot-scope="scope">
                                {{scope.row.area_name | joinArr}}
                            </template>
                        </el-table-column>
                        <el-table-column label="分组" prop="group_name">
                            <template slot-scope="scope">
                                {{scope.row.group_name | joinArr}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div style=" text-align: right;padding-top: 10px;">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="colsedatamsg">确 定</el-button>
            </span>
        </div>
    </el-dialog>

    <el-dialog title="异常说明"
        :visible.sync="exceptionDetailShow"
        width="80%"
        :modal-append-to-body="false"
        v-loading="exceptionDetailLoading">
        <div v-if="exceptionDetailData1.length>0" class="exception-detail-item">
            <h5>授课形式学时不匹配</h5>
            <el-table
                :data="exceptionDetailData1"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column label="授课形式" prop="teaching_form_name"> </el-table-column>
                <!-- <el-table-column label="每次课时" prop="learning_hour"> </el-table-column> -->
                <el-table-column label="内容总学时" prop="content_hours"> </el-table-column>
                <el-table-column label="课表总学时" prop="schedule_hours"> </el-table-column>
                <el-table-column label="内容条数" prop="content_row_num"> </el-table-column>
                <el-table-column label="进度表条数" prop="row_num"> </el-table-column>
            </el-table>
        </div>

        <div v-if="exceptionDetailData2.length>0" class="exception-detail-item">
            <h5>内容异常</h5>
            <el-table
                :data="exceptionDetailData2"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column label="内容" prop="content"> </el-table-column>
                <el-table-column label="授课形式" prop="teaching_form_name"> </el-table-column>
                <el-table-column label="学时" prop="learning_hour"> </el-table-column>
                <el-table-column label="异常类型" prop="abnormal_type"> </el-table-column>
            </el-table>
        </div>

    </el-dialog>
        
</section>

</template>

<script>
    import util from '@/util'
    const TYPE = 'curriculum-management';
    const REMARK = '手工排课';

    import {
        mapState
    } from 'vuex';

    export default {
        name: TYPE,
        data() {
            return {
                // conflictpageNo:1,//当前页
                conflictpageSize:50,//每页显示50条
                conflicttotal:10,//总共10条

                currentPage1:1,
                currentPage2:10,
                currentPage3:10,
                currentPage4:10,
                contentandtimetableList:[],//课表与内容不一样的数组
                oneAreaManyGroupList:[],//同一场地安排了多个小组冲突列表
                equallytext:'冲突检查',
                equallybutton:false,//按钮
                activeName:'teacherandstudents',
                activeName2:'first',
                conflictnum1:0,
                conflictnum2:0,
                conflictnum3:0,
                conflictnum4:0,
                conflictnum5:0,
                conflictnum6:0,
                conflictnum7:0,
                conflictnum8:0,

                dialogdelist:[],
             
                schedule_id:'',
                dialogShow:false,
                breadcrumb: [{
                    label: "教学管理"
                }, {
                    label: "手工排课"
                }, ],
                dialog: {
                    status: 'add',
                    remark: false,
                    visible: false
                },
                formInline: {
                    courseId: "",
                    classId: "",
                    grade: ""
                },
                addForm: {
                    name: "",
                    note: "",
                    grade: "",
                    year: ""
                },
                tableList: [{
                    label: '课程表名称',
                    prop: 'name',
                    width: 500
                }, {
                    label: '学期',
                    prop: 'semester_name',
                    width: 300
                }, {
                    label: '所在级',
                    prop: 'grade',
                    width: 150
                }, {
                    label: '备注说明',
                    prop: 'note',
                    
                }, {
                    label: '创建人',
                    prop: 'create_username',
                    width: 150
                }, {
                    label: '创建日期',
                    prop: 'create_time',
                    width: 180
                }],
                tableData: [],
                fallYear: '',
                formYear: "",
                options1: [],
                classList: [],
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
                    add: false,
                    edit: false,
                    entry: false,
                    delete: false
                },
                conflictLoading:false,
                exceptionDetailShow:false,
                exceptionDetailData1:[],
                exceptionDetailData2:[],
                exceptionDetailLoading:false,
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
            },
            joinArr(arr){
                if(arr && arr.length>0){
                    return arr.join('，');
                }else{
                    return '';
                }
            },
        },
        methods: {
            handleSizeChange(val) {
                this.conflictpageSize = val;
                this.getconflictdelis2();
            },
            handleCurrentChange(val) {
                this.currentPage1=val;
                this.getconflictdelis2();
            },
            //冲突检查
            conflictChecking(){
                    this.equallytext = '正在检查，请稍后。。。'
                    this.equallybutton = true
                  for (let item of this.options1) {
                    if (item.id == this.formYear) {
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                        }    
                    }
                    
                    let query = {
                        semester_year:this.fallYear,
                        semester_year_number: this.semesterNum
                    }
                    this.$http.post("_ed:/semestercourse/check_conflict_abnormal_qty",{
                        semester_year: this.fallYear,
                        semester_year_number: this.semesterNum
                        }).then(res=>{
                            this.equallytext = '冲突检查';
                            this.equallybutton=false;//按钮
                            let data = res.data
                            if(res.code==0){
                                 this.$message.success("无冲突");
                            }else{
                                if(res.data.length>0){

                                    let self =  this
                                    self.dialogShow = true
                                    self.getconflictdelis();
                                    let resdata = JSON.parse(res.data);
                                    self.conflictnum1 = resdata[0].type_num
                                    self.conflictnum2 = resdata[1].type_num
                                    self.conflictnum3 = resdata[2].type_num
                                    // self.conflictnum4 = self.datamsglist[3].conflict_type_num

                                    let tempArr1 = resdata[4].type_num;
                                    this.conflictnum4 = tempArr1[0].conflict_type_num;
                                    this.conflictnum5 = tempArr1[1].conflict_type_num;
                                    this.conflictnum6 = tempArr1[2].conflict_type_num;
                                    this.conflictnum7 = tempArr1[3].conflict_type_num;
                                    this.conflictnum8 = tempArr1[4].conflict_type_num;

                                }else{
                                    this.$message.error(data.msg);
                                }
                             
                            }
                                        
                        })
            },
            getconflictdelis(){
                if( this.activeName == 'teacherandstudents'){
                    // this.$http.get('_ed:/schedule/conflictSchedule/0/'+this.fallYear+'/'+ this.semesterNum )
                    // .then(res=>{
                    //     let typeNum = JSON.parse(res.data);
                    //     this.conflictnum4 = typeNum[0].conflict_type_num
                    //     this.conflictnum5 = typeNum[1].conflict_type_num
                    //     this.conflictnum6 = typeNum[2].conflict_type_num
                    //     this.conflictnum7 = typeNum[3].conflict_type_num
                    //     this.conflictnum8 = typeNum[4].conflict_type_num
                    // })
                    this.getconflictdelis2()
                }else if(this.activeName == 'contentandtimetable'){
                    let query = {
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum ,
                        checkType:4
                    }
                    this.$http.post("_ed:/schedule/check_schedule_item_content",query).then(res=>{
                        this.contentandtimetableList = JSON.parse(res.data).data;
                    })
                }else if(this.activeName == 'fieldandfield'){
                    let query = {
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum,
                    }
                    this.$http.post("_ed:/schedule/check_schedule_item_area",query).then(res=>{
                        this.oneAreaManyGroupList = res.data;
                    })
                }
            },
            handleTabChange2(){
                this.currentPage1 = 1;
                this.getconflictdelis2();
            },
            getconflictdelis2(){
                this.dialogdelist = [];
                let tempObj = {first:1,second:2,third:3,fourth:4,fifth:5};
                let query= {
                    pageNo: this.currentPage1,
                    pageSize: this.conflictpageSize,
                    param: {
                        schedule_id:0,
                        checkType:tempObj[this.activeName2],
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum ,
                    }
                }
                this.conflictLoading = true;
                this.$http.post('_ed:/schedule/check/typeCheckSchedule',query).then(res=>{
                    this.dialogdelist = res.data && res.data.result || [];
                    this.conflicttotal = res.data && res.data.totalCount || 0;
                    this.conflictLoading = false;
                })
            },
            colsedatamsg(){ //关闭冲突弹框
                this.dialogShow = false;
                this.datamsglist = []
            },
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                    data.data.map(item => {
                        if (item.code == "query_kechengbiaoguanli") { //查询
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "add_kechengbiaoguanli") { //新增课程
                            self.btnPerObj.add = true;
                        }
                        if (item.code == "edit_kechengbiaoguanli") { //编辑
                            self.btnPerObj.edit = true;
                        }
                        if (item.code == "entry_kechengbiaoguanli") { //录入
                            self.btnPerObj.entry = true;
                        }
                        if (item.code == "del_kechengbiaoguanli") { //删除
                            self.btnPerObj.delete = true;
                        }
                    });
                }).catch(() => {})
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
            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            },
            dialogClose() {
                this.addForm.year = "";
                this.dialog.visible = false;
                this.$refs.addForm.resetFields();
            },
            onSelectChange(_id) {
                if (_id) {
                    for (let item of this.options1) {
                        if (item.id == _id) {
                            this.fallYear = item.year;
                            this.semesterNum = item.orderNum;
                        }
                    }
                    this.getClassList();
                    this.getCourseList();
                } else {
                    this.fallYear = "";
                    this.semesterNum = "";
                    this.formInline.courseId = '';
                    this.formInline.classId = ''
                }

            },
            onAddYear(val) {
                if (val) {
                    let list = val.split("-");
                    this.addfallYear = list[0];
                    this.addsemesterNum = list[1];
                }
            },
            editTimetable(row) {
                this.rowId = row.id;
                this.dialog.status = 'edit';
                this.dialog.visible = true;
               
                this.addForm.name = row.name;
                this.addForm.year = row.semester_name;
                this.addForm.note = row.note;
                this.addForm.grade = row.grade + "-01-01";
            },
            addTask() {
                this.dialog.status = 'add';
                this.dialog.visible = true;
            },
            confirmAdd() {

                //校验数据 

                if (this.addForm.name == null || this.addForm.name.length == 0) {
                    this.$message.error("请填写课程名称!")
                    return false;
                }

                if (this.addForm.year == null || this.addForm.year.length == 0) {
                    this.$message.error("请选择所在学期!")
                    return false;
                }

                if (this.addForm.grade == null || this.addForm.grade.length == 0) {
                    this.$message.error("请选择所在级!")
                    return false;
                }

                let url;
                let option = {};
                if (this.dialog.status == 'add') {
                    url = "_ed:/curriculum/add";
                    option = {
                        name: this.addForm.name,
                        grade: this.addForm.grade,
                        create_username: this.userName,
                        note: this.addForm.note,
                        semester_year: this.addfallYear,
                        semester_year_number: this.addsemesterNum
                    }
                } else {
                    url = "_ed:/curriculum/edit";
                    let type;
                    if (this.addForm.type == '普通教学') {
                        type = 0;
                    } else {
                        type = 1;
                    }
                    option = {
                        id: this.rowId,
                        name: this.addForm.name,
                        note: this.addForm.note
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
                    let message = `${this.dialog.status=='add'?'新增':'编辑'}成功`;
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
            onEntry(row) {
                this.$router.push({
                    path: "/teaching_management/enter_curriculum",
                    query: {
                        row: JSON.stringify(row)
                    }
                });
            },
            delTableRow(row) {
                if (row.publish_status != 0) {
                    this.$message(`${row.name}已经生成进度表，请撤回进度表后再执行删除操作`);
                    return;
                }
                this.$confirm(`此操作将永久删除“${row.name}”所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("_ed:/curriculum/delete/" + row.id)
                        .then(data => {
                            let type = "success";
                            let message = "删除成功！"
                            if (data.code == 0) {
                                if (this.tableData.length == 1) {
                                    this.pageNo = 1;
                                }
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
            getTableList() {
                this.tableLoading = true;
                this.$http.post("_ed:/curriculum/query", {
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum,
                    semester_course_id: this.formInline.courseId,
                    request_page: this.pageNo,
                    page_size: this.pageSize,
                    grade: this.formInline.grade,
                    cls_id: this.formInline.classId
                }).then(data => {
                    if (data.code == 0) {
                        this.tableLoading = false;
                        this.totalCount = data.data.total_records;
                        this.tableData = data.data.dataList;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((error) => {
                    this.tableLoading = false;
                })
            },
            getCourseList() {
                this.$http.post("_ed:/semestercourse/list/detail", {
                        semester_year: this.fallYear,
                        semester_year_number: this.semesterNum
                    })
                    .then(data => {
                        if (data.code == 0) {
                            this.courseList = data.data;
                            for (let list of this.courseList) {
                                let majorName = '';
                                if (list.teachTaskCourseList) {
                                    for (let item of list.teachTaskCourseList) {
                                        let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
                                        this.$set(item, "name", `${item.course_name}（${item.major}，${house}）`);
                                        this.$set(item, "courseId", list.id);
                                        majorName += '+' + item.major;
                                        this.$set(list, 'major', majorName.substring(1));
                                    }
                                }
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            getClassList() {
                this.$http.post("_ed:/coursecls/list", {
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
                this.$http.get('_op:/terms/' + query).then(data => {
                    if (data.code == 0) {
                        this.options1 = data.data.reverse();
                              for(let i=0;i<this.options1.length;i++){
                                if(this.options1[i].stage==1){
                                    this.formYear=this.options1[i].id
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear =this.options1[i].year;
                                    break
                                }else{
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                }
                            }
                      
                        // let defaultTerm = this.options1.find(item=>item.stage==1);
                        // if(defaultTerm){
                        //     this.formYear = defaultTerm.id;
                        //     this.semesterNum = defaultTerm.orderNum;
                        // }

                        // let year = this.myDate.getFullYear();
                        // let month = this.myDate.getMonth() + 1;
                        // for (let i = 0, len = this.options1.length; i < len; i++) {

                        //     let termYear = this.options1[i].name.substring(0, 4);
                        //     let termMonth = this.options1[i].startTime.substring(6, 7);
                        //     if (year == termYear && (month >= 2 && month <= 8)) {
                        //         if (this.options1[i].orderNum == 1) {
                        //             // this.formYear = this.options1[i].name;
                        //             this.addForm.year = this.options1[i].name;
                        //             this.fallYear = this.options1[i].year;
                        //             this.addfallYear = this.options1[i].year;
                        //             this.addsemesterNum = this.options1[i].orderNum;
                        //             // this.semesterNum = this.options1[i].orderNum;

                        //         }
                        //     } else if ((year == termYear) && (month > 8 || month < 2)) {
                        //         if (this.options1[i].orderNum == 2) {
                        //             // this.formYear = this.options1[i].name;
                        //             this.addForm.year = this.options1[i].name;
                        //             this.addfallYear = this.options1[i].year;
                        //             this.addsemesterNum = this.options1[i].orderNum;
                        //             this.fallYear = this.options1[i].year;
                        //             // this.semesterNum = this.options1[i].orderNum;
                        //         }
                        //     }
                        // }
                        this.getTableList();
                        this.getCourseList();
                        this.getClassList();
                    } else {
                        this.$message.error(data.msg);
                    }


                })
            },
            showExceptionDetail(row){
                this.exceptionDetailData1 = [];
                this.exceptionDetailData2 = [];
                this.exceptionDetailShow = true;
                this.exceptionDetailLoading = true;
                this.$http.post("_ed:/schedule/check/course/detail", {
                    semester_course_id:row.semester_course_id,
                    schedule_id:row.schedule_id,
                    grade:row.grade,
                    term_id:row.term_id,
                    course_platform_id:row.course_platform_id,
                }).then(data => {
                    this.exceptionDetailLoading = false;
                    if (data.code == 0) {
                        if(data.data){
                            let hourDataList = data.data.hourDataList;
                            if(hourDataList && hourDataList.length>0){
                                this.exceptionDetailData1 = hourDataList;
                            }
                            let contentDataList = data.data.contentDataList;
                            if(contentDataList && contentDataList.length>0){
                                this.exceptionDetailData2 = contentDataList;
                            }
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .pm-margin /deep/.el-dialog__body {
        padding: 10px 40px;
    }
    .datamsg{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  z-index: 100000;
}
.datamsgdelis{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100001;
}
.none{
  display: none;
}
.datamsg .datamhsbody,.datamsgdelis .datamhsbody{
    background:#f5f7fa;
   width:85%;
    border: solid 1px #ddd;
    margin: 100px auto;
    padding: 20px 20px;
  }
  .datamsg .datamhsbody{
  background:#f5f7fa;
   width:72%;
   
  }
.datamhsbody /deep/.dialog-footer{
    /* padding: 10px 20px 20px; */
    text-align: right;
}
.exception-detail-item{
    margin-bottom: 20px;
}
.exception-detail-item h5{
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 10px;
}
</style>