<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <!-- 筛选条件 -->
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold visual-schedule">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-select v-model="formInline.formSemester" placeholder="全部" :remote-method="getSemester" filterable @change="onSelectChange" style="width:235px">
                                <el-option v-for="item in semester" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <intelligent-year-picker v-model="formInline.formGrade" type="year" value-format="yyyy" placeholder="选择年级" @change="getClassList">
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="行政班">
                            <el-select v-model="formInline.formClass" filterable clearable placeholder="全部" style="width: 250px;">
                                <el-option  v-for="(item,index) in queryClassList" :label="item.admin_cls_name" :value="item.admin_cls_id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.formLesson" filterable clearable placeholder="全部" style="width: 350px;">
                                <el-option v-for="item in lesson" :label="item.course_arrange+` (${item.majorNames} ${item.arranged_theory_hours}/${item.arranged_novitiate_hours})`" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getTableList('search')">查询</el-button>
                        </el-form-item>
                        <!-- 新增,异常按钮 -->
                        <el-form-item>
                            <el-button type="primary" @click="showLessonDialog">新增课程表</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="checkClash" :loading="clashLoading">{{clashText}}</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <!-- 表格 -->
        <div class="cm-table">
            <el-table :data="tableData" border style="width: 100%" size="mini" v-loading="tableLoading" :element-loading-text="textCont" header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" fixed></el-table-column>
                <el-table-column v-for="(item,index) in tableThList" :key="index" :label="item.label" :prop="item.prop" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='所在级'">
                            <span v-for="(val,i) in scope.row.grades" :key="i">{{val + '&nbsp;&nbsp;'}}</span>
                        </template>
                        <template v-else-if="item.label=='创建日期'">
                             {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="220">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="entering(scope.row)">录入</el-button>
                        <el-button type="text" size="mini" @click="delTableRow(scope.row)">删除</el-button>
                        <el-button type="text" size="mini" @click="updateRow(scope.row)">更新上课班学生</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增,编辑课程表dialog -->
        <el-dialog
            :title="title"
            width="60%"
            :visible.sync="dialogLessonVisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            @closed="cancelLessonVisible"
            >
            <el-form :model="addLessonForm" :rules="rules" label-width="100px" ref="addLessonForm">
                <el-form-item label="课程表名称" prop="name">
                    <el-input placeholder="请输入课程表名称" v-model="addLessonForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="note">
                    <el-input placeholder="请输入备注" v-model="addLessonForm.note"></el-input>
                </el-form-item>
                <el-form-item label="学期" prop="semester">
                    <el-select style="width:46%" v-model="addLessonForm.semester" filterable clearable :disabled="addOrEdit == 'edit'" @change="dialogSelectChange">
                        <el-option v-for="item in semester" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                    <!-- <el-input v-hidden="addOrEdit == 'edit'" v-model="editSemester" disabled></el-input> -->
                </el-form-item>
                <!-- 去除所在级11-25 -->
                <!-- <el-form-item label="所在级" prop="grade">
                    <el-select v-model="addLessonForm.grade" multiple filterable placeholder="请选择" @remove-tag="checkTag">
                        <el-option
                            v-for="item in gradeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="可选班级" prop='grade'>
                    <div class="add_wrapper">
                        <div class="add_left">
                            <!-- <el-select v-model="selectClass" @change="getAllClassList">
                                <el-option v-for="(item,index) in addLessonForm.grade" :key="index" :label="item" :value="item"></el-option>
                            </el-select> -->
                            <intelligent-year-picker style="width:100%" v-model="addLessonForm.grade" type="year" value-format="yyyy" placeholder="选择年级" @change="getAllClassList">
                            </intelligent-year-picker>
                            <div class="treeList">
                                <el-tree
                                    :data="classList"
                                    class="tree2"
                                    show-checkbox
                                    default-expand-all
                                    node-key="id"
                                    ref="tree2"
                                    :filter-node-method="filterNode"
                                    highlight-current
                                    :props="defaultProps"
                                    @check-change="handleCheckChange"
                                    >
                                </el-tree>
                            </div>
                        </div>
                        <div class="add_right">
                            <div class="right_title">
                                <span>已选班级</span>
                            </div>
                            <div class="right_list">
                                <ul class="choice_list">
                                    <li v-for="(item,index) in choiceClassList" :key="index" class="choice_item">
                                        <span class="choice-text">{{item.cls_name}}</span>
                                        <span class="choice-icon">
                                            <span class="toTop" @click="choiceTopOrDown(choiceClassList,index,'one')">置顶</span>
                                            <i class="el-icon-bottom" @click="choiceTopOrDown(choiceClassList,index,'down')"></i>
                                            <i class="el-icon-top" @click="choiceTopOrDown(choiceClassList,index,'top')"></i>
                                        </span>
                                        <i @click="deleteClass(item)" class="el-icon-circle-close icon-close"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div class="select-studnet-box">
                <el-button size="mini" @click="cancelLessonVisible">取消</el-button>
                <el-button type="primary" size="mini" v-if="addOrEdit == 'add'" @click="submitLessonVisible('add')">确定</el-button>
                <el-button type="primary" size="mini" v-if="addOrEdit == 'edit'" @click="submitLessonVisible('edit')">确定</el-button>
            </div>
        </el-dialog>
        <!-- 冲突异常检查dialog -->
        <el-dialog title="冲突明细" :visible.sync="dialogShow" width="85%" :modal-append-to-body="false">
            <div class="cm-table" v-loading="conflictLoading" style="position:relative">
                <el-tabs v-model="activeName" @tab-click="getconflictdelis">
                    <el-tab-pane name="teacherandstudents">
                        <span slot="label"> 场地、老师、小组、学生冲突 (<span style="color:red">{{conflictnum1}}</span>)</span>
                        <el-tabs v-model="activeName2"  @tab-click="handleTabChange2" type="border-card">
                            <el-tab-pane name="first">
                                <span slot="label"> 场地冲突 (<span style="color:red">{{conflictnum4}}</span>)</span>
                                <!-- <div class="areaSelect" style="float:right">
                                    <span style="margin-right:10px">场地</span>
                                    <el-select size="small" filterable clearable v-model="conflictSelect">
                                        <el-option v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </div> -->
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
                                <!-- <div class="areaSelect" style="float:right">
                                    <span style="margin-right:10px">老师</span>
                                    <el-select size="small" filterable clearable v-model="conflictSelect">
                                        <el-option v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </div> -->
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
                                <!-- <div class="areaSelect" style="float:right">
                                    <span style="margin-right:10px">小组</span>
                                    <el-select size="small" filterable clearable v-model="conflictSelect">
                                        <el-option v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </div> -->
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
                                <!-- <div class="areaSelect" style="float:right">
                                    <span style="margin-right:10px">学生</span>
                                    <el-select size="small" filterable clearable v-model="conflictSelect">
                                        <el-option v-for="(item,index) in dialogdelist" :key="index" :label="item.stu_name" :value="item.stu_name"></el-option>
                                    </el-select>
                                </div> -->
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
                        </el-tabs>
                        <el-row>
                            <el-col :span="12">
                                <div style="padding-top:14px; color: red">
                                    <p>每项最多列出500条详细冲突记录，如果现实的冲突总数>冲突明细记录数，则表示还有更多的冲突，请纠正后再次检查</p>
                                </div>
                            </el-col>
                             <el-col :span="12">
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
                            </el-col>
                        </el-row>
                        
                        
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
                <!-- <el-button type="primary" style="position:absolute;right:100px;top:0;">异常检查</el-button> -->
            </div>
            <div style=" text-align: right;padding-top: 10px;">
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button size="mini" @click="exportdatamsg">导出Excel</el-button> -->
                    <el-button type="primary" size="mini" @click="closedatamsg">确 定</el-button>
                </span>
            </div>
        </el-dialog>
        <!-- 异常说明dialog -->
        <el-dialog title="异常说明"
            :visible.sync="exceptionDetailShow"
            width="80%"
            :modal-append-to-body="false"
            v-loading="exceptionDetailLoading">
            <div v-if="exceptionDetailData1.length>0" class="exception-detail-item">
                <h5>{{exceptionDetailNote}}</h5>
                <el-table
                    :data="exceptionDetailData1"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                    <el-table-column label="授课形式" prop="teaching_form_name"> </el-table-column>
                    <el-table-column label="每次课时" prop="learning_hour"> </el-table-column>
                    <el-table-column label="内容总学时" prop="content_hours"> </el-table-column>
                    <el-table-column label="课表总学时" prop="schedule_hours"> </el-table-column>
                </el-table>
            </div>
            <div v-if="exceptionDetailData2.length>0" class="exception-detail-item">
                <h5>内容库更新后未提交</h5>
                <el-table
                    :data="exceptionDetailData2"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                    <el-table-column label="内容" prop="content"> </el-table-column>
                    <el-table-column label="授课形式" prop="teaching_form_name"> </el-table-column>
                    <el-table-column label="学时" prop="learning_hour"> </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
import moment from 'moment';
import {mapState} from 'vuex';

export default {
    name: "visualized_list",
    data(){
        return {
            breadcrumb: [
                {label: "教学管理"},
                {label: "可视化排课"}
            ],
            // 表单条件
            formInline:{
                formSemester:'',
                formGrade:'',
                formClass:'',
                formLesson:''
            },
            textCont: '加载中...',
            // 学期
            semester:[],
            // 年级
            grade:'',
            // 筛选班级
            queryClassList:[],
            // 班级
            classList:[],
            // 课程
            lesson:[],
            // 表格数据
            tableData:[],
            // 表格loading状态
            tableLoading:false,
            // 表格验证
            rules:{
                name:[{required:true,message:'请输入课表名称',trigger:'blur'}],
                // note:[],
                semester:[{required:true,message:'请选择学期',trigger:'change'}],
                grade:[{required:true,message:' ',trigger:'change'}]
            },
            // 表格表头
            tableThList:[
                {
                    label:'课程表名称',
                    prop:'curriculum_name',
                    width:500,
                },
                {
                    label:'学期',
                    prop:'term_name',
                    width:300,
                },
                {
                    label:'所在级',
                    prop:'grades',
                    width:150,
                },
                {
                    label:'备注说明',
                    prop:'note',
                },
                {
                    label:'创建人',
                    prop:'create_username',
                    width:150,
                },
                {
                    label:'创建日期',
                    prop:'create_time',
                    width:180,
                },
            ],
            // 当前页数
            pageNo:1,
            // 分页显示条目
            pageSize:10,
            // 分页总条目
            totalCount:0,
            // 是否显示新增课程表dialog
            dialogLessonVisible:false,
            // 新增课程表dialog表单
            addLessonForm:{
                name:'',
                note:'',
                semester:'',
                grade:'',
                class:[],
                year:'',
                num:''
            },
            semesterNum:'',
            semesterID: '',
            fallYear:'',
            // 超出隐藏
            fold: {
                state: true,
                text: '收起',
                showBtn: false,
            },
            // 新增or编辑
            title:'',
            // 新增课表所在级多选 去除11-25
            // gradeList:[],
            // 冲突按钮loading
            clashLoading:false,
            // 冲突按钮text
            clashText:'冲突及异常检查',
            // 冲突dialog
            dialogShow:false,

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
            conflictLoading:false,
            conflictpageSize:50,//每页显示50条
            conflicttotal:10,//总共10条
            currentPage1:1,
            currentPage2:10,
            currentPage3:10,
            currentPage4:10,
            conflictLoading:false,
            exceptionDetailShow:false,
            exceptionDetailData1:[],
            exceptionDetailData2:[],
            exceptionDetailLoading:false,
            contentandtimetableList:[],//课表与内容不一样的数组
            oneAreaManyGroupList:[],//同一场地安排了多个小组冲突列表
            // 异常说明dialog text
            exceptionDetailNote:'',
            // 冲突检查dialog中条件筛选
            conflictSelect:'',
            // dialogdelist缓存
            dialogdelistTemp:[],
            // 配置项、展示子节点，禁用节点等
            defaultProps: {
                label: 'cls_name',
                children: 'children'
            },
            // 新增or编辑
            addOrEdit:'',
            // 新增or编辑筛选关键词
            filterText:'',
            // 新增or编辑已选班级
            choiceClassList:[],
            // 登陆者
            userName: '',
            userId: '',
            // userName: util.getStorage('loginName'),
            // userId: util.getStorage('loginId'),
            // 点击编辑时ID
            tableRowId:'',
            // 编辑dialog条目是否禁用
            disabled:false,
            // 不可编辑学期
            // editSemester:'',
            // 新增or编辑已选年级
            // selectClass:null,
            // 可选班级切换保存id
            checkedKeys:{},
            // 冲突明细筛选数据
            // selectData:[]
            // 临时学期id
            tempSemesterId:'',
            tempSemester_year:'',
            tempSemester_year_number:''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
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
    created(){
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userId = storage.me.attributes.login_info.id || '';
            this.userName = storage.me.user.name || '';
        }
        this.getSemester()
        // this.createGradeList()
    },
    mounted(){
        util.resize(this);
        window.onresize = () => {
            util.resize(this);
        };
    },
    methods: {
        // 所在级多选 去除11-25
        // createGradeList(){
        //     let date = new Date()
        //     let year = date.getFullYear()
        //     // gradeList
        //     for (let i = 20; i >= 0; i--) {
        //         let prev = year - i
        //         this.gradeList.push({
        //             label:prev,
        //             value:prev
        //         })
        //     }
        //     for (let j = 1; j < 20; j++) {
        //         let next = year + j
        //         this.gradeList.push({
        //             label:next,
        //             value:next
        //         })
        //     }
        //     this.addLessonForm.grade.push(year)
        // },
        getLocalStorage(){
            util.getStorage('formSemester') && (this.formInline.formSemester = Number(util.getStorage('formSemester')))
            util.getStorage('grade') && (this.formInline.formGrade = util.getStorage('grade'))
            util.getStorage('formClass') && (this.formInline.formClass = Number(util.getStorage('formClass')))
            util.getStorage('formLesson') && (this.formInline.formLesson = Number(util.getStorage('formLesson')))
            util.getStorage('semesterNum') && (this.semesterNum = Number(util.getStorage('semesterNum')))
            util.getStorage('term') &&  (this.fallYear = Number(util.getStorage('term')))
        },
        //获取学期
        getSemester(query) {
            if (!query) {
                query = "学期";
            }
            this.$http.get('_op:/terms/' + query).then(data => {
                if (data.code == 0) {
                    this.semester = data.data.reverse();
                        for(let i=0;i<this.semester.length;i++){
                        if(this.semester[i].stage==1){
                            this.formInline.formSemester=this.semester[i].id
                            // this.addLessonForm.semester=this.semester[i].id
                            this.semesterNum = this.semester[i].orderNum;
                            this.semesterID = this.semester[i].id;
                            this.fallYear =this.semester[i].year;
                            // this.addLessonForm.year =this.semester[i].year;
                            // this.addLessonForm.num = this.semester[i].orderNum;
                            break
                        }else{
                            if(this.semester[i].name.indexOf('当前学期')!=-1){
                                this.formInline.formSemester=this.semester[i].id
                                // this.addLessonForm.semester=this.semester[i].id
                                this.semesterNum = this.semester[i].orderNum;
                                this.semesterID = this.semester[i].id;
                                this.fallYear =this.semester[i].year;
                                // this.addLessonForm.year =this.semester[i].year;
                                // this.addLessonForm.num = this.semester[i].orderNum;
                            }
                        }
                    }
                    this.getClassList();
                    this.getLessonList();
                    this.getLocalStorage()
                    this.getTableList();
                } else {
                    this.$message.error(data.msg);
                }
            })
        },
        // 获取所有行政班
        getAllClassList(){
            this.$http.post("_ed:/scheduleVisualizing/allAdministrativeClass",{
                // grade:this.selectClass
                grade:Number(this.addLessonForm.grade)
            }).then(data => {
                if(data.code == 0){
                    this.classList = data.data
                    this.choiceClassList.map((item,index) => {
                        this.classList.map((val,i)=>{
                            if(item.id == val.id){
                                this.$nextTick(()=>{
                                    this.$refs.tree2.setChecked(val.id,true)
                                })
                            }
                        })
                    })
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        // tag删除验证 去除11-25
        // checkTag(tag){
        //     for (const key in this.checkedKeys) {
        //         if (this.checkedKeys.hasOwnProperty(key)) {
        //             const ele = this.checkedKeys[key];
        //             if(key == tag){
        //                 ele.map(item => {
        //                     this.choiceClassList.map((val,i) => {
        //                         if(item == val.id){
        //                             this.choiceClassList.splice(i,1)
        //                         }
        //                     })
        //                 })
        //             }
        //         }
        //     }
        //     if(tag == this.selectClass){
        //         this.classList = []
        //         this.selectClass = null
        //     }
        // },
        // 获取表格数据
        getTableList(flag){
            this.tableLoading = true;
            if(flag == 'search'){
                util.setStorage('formSemester',this.formInline.formSemester)
                util.setStorage('grade',this.formInline.formGrade)
                util.setStorage('formClass',this.formInline.formClass)
                util.setStorage('formLesson',this.formInline.formLesson)
                util.setStorage('semesterNum',this.semesterNum)
                util.setStorage('term',this.fallYear)
            }
            this.tempSemesterId = this.formInline.formSemester
            this.tempSemester_year = this.fallYear,
            this.tempSemester_year_number = this.semesterNum,
            this.$http.post("_ed:/scheduleVisualizing/queryCurriculumList", {
                admin_cls_id: this.formInline.formClass,
                grade: this.formInline.formGrade,
                page_size: this.pageSize,
                semesterId:this.formInline.formSemester,
                semester_course_id: this.formInline.formLesson,
                semester_year: this.fallYear,
                semester_year_number: this.semesterNum,
                start_index: this.pageNo,
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
        // 获取行政班
        getClassList(){
            this.formInline.formClass = ''
            this.$http.post("_ed:/scheduleVisualizing/queryAdministrativeClass", {
                grade:Number(this.formInline.formGrade),
            }).then(data => {
                if (data.code == 0) {
                    this.queryClassList = data.data;
                } else {
                    this.$message.error(data.msg);
                }
            })
        },
        // 获取已选择行政班
        getSelectClass(id){
            this.$http.post("_ed:/scheduleVisualizing/queryAdministrativeClass", {
                    curriculum_visual_id:id,
                }).then(data => {
                    if (data.code == 0) {
                        data.data.forEach(item => {
                            this.choiceClassList.push({
                                cls_name:item.admin_cls_name,
                                id:item.admin_cls_id
                            })
                        });
                        this.getAllClassList()
                    } else {
                        this.$message.error(data.msg);
                    }
                })
        },
        // 获取课程
        getLessonList(){
            this.$http.post("_ed:/semestercourse/list/detail", {
                semester_year: this.fallYear,
                semester_year_number: this.semesterNum
            })
            .then(data => {
                if (data.code == 0) {
                    this.lesson = data.data;
                    for (let list of this.lesson) {
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
        // 学期改变
        onSelectChange(_id){
            if (_id) {
                for (let item of this.semester) {
                    if (item.id == _id) {
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                        this.semesterID = _id;
                    }
                }
                this.getClassList();
                this.getLessonList();
            } else {
                this.fallYear = "";
                this.semesterNum = "";
                this.semesterID = "";
                this.formInline.formLesson = '';
                this.formInline.formClass = ''
            }
        },
        // 显示冲突dialog
        checkClash(){
            this.clashLoading = true
            this.clashText = '正在检查,请稍候...'
            for (let item of this.semester) {
                if (item.id == this.formInline.formSemester) {
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
            }).then( res => {
                this.clashText = '冲突检查';
                this.clashLoading=false;//按钮
                let data = res.data
                if(res.code==0){
                        this.$message.success("无冲突");
                }else{
                    if(res.data.length>0){

                        let self =  this
                        self.dialogShow = true
                        self.getconflictdelis()
                        self.conflictnum1 = JSON.parse(res.data)[0].type_num
                        self.conflictnum2 = JSON.parse(res.data)[1].type_num
                        self.conflictnum3 = JSON.parse(res.data)[2].type_num
                        // self.conflictnum4 = self.datamsglist[3].conflict_type_num
                    }else{
                        this.$message.error(data.msg);
                    }
                    
                }
            })
        },
        getconflictdelis(){
            if( this.activeName == 'teacherandstudents'){
                this.$http.get('_ed:/schedule/conflictSchedule/0/'+this.fallYear+'/'+ this.semesterNum )
                .then(res=>{
                    let typeNum = JSON.parse(res.data);
                    this.conflictnum4 = typeNum[0].conflict_type_num
                    this.conflictnum5 = typeNum[1].conflict_type_num
                    this.conflictnum6 = typeNum[2].conflict_type_num
                    this.conflictnum7 = typeNum[3].conflict_type_num
                    this.conflictnum8 = typeNum[4].conflict_type_num
                })
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
                this.dialogdelist = res.data && res.data.result || []
                this.conflicttotal = res.data && res.data.totalCount || 0
                this.conflictLoading = false;
            })
        },
        handleSizeChange(val) {
            this.conflictpageSize = val;
            this.getconflictdelis2();
        },
        handleCurrentChange(val) {
            this.currentPage1=val;
            this.getconflictdelis2();
        },
        //关闭冲突弹框
        closedatamsg(){ 
            this.dialogShow = false;
            this.datamsglist = []
        },
        // 导出excel
        exportdatamsg(){

        },
        showExceptionDetail(row){
            this.exceptionDetailData1 = [];
            this.exceptionDetailData2 = [];
            this.exceptionDetailNote = row.note
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
        // 冲突dialog中冲突检查
        // 有分页,本地无法筛选
        // conflictCheck(){
        //     let _this = this
        //     let temp = this.conflictSelect
        //     let str = ''
        //     _this.dialogdelistTemp = JSON.parse(JSON.stringify(_this.dialogdelist))
        //     if(temp){
        //         if(_this.activeName2 == 'first'){
        //             str = 'area_name'
        //         }else if(_this.activeName2 == 'second'){
        //             str = 'teacher_name'
        //         }else if(_this.activeName2 == 'third'){
        //             str = 'group_names'
        //         }else{
        //             str = 'stu_name'
        //         }
        //         _this.dialogdelist.map((item,index) => {
        //             if(item[str] == temp){
        //                 return item
        //             }else{
        //                 _this.$delete(_this.dialogdelist,index)
        //             }
        //         })
        //     }else{
        //         _this.dialogdelist = _this.dialogdelistTemp
        //     }
        // },
        // 新增,编辑dialog班级筛选
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 新增,编辑dialog班级筛选
        handleCheckChange(data, checked, indeterminate) {
            if(checked && data.cls_name){
                if(this.choiceClassList.length == 0){
                    this.choiceClassList.push(data)
                }else{
                    let flag = true
                    this.choiceClassList.forEach(val => {
                        if(val.id == data.id){
                            flag = false
                        }
                    })
                    if(flag){
                        this.choiceClassList.push(data)
                    }
                }
                this.$nextTick(()=>{
                    this.checkedKeys[this.selectClass] = this.$refs.tree2.getCheckedKeys()
                })
            }else{
                this.deleteClass(data)
                // this.choiceClassList.map((item,index) => {
                //     if(item.id == data.id){
                //         this.choiceClassList.splice(index,1)
                //         this.$refs.tree2.setChecked(item,false)
                //     }
                // })
            }
        },
        // 编辑删除班级验证
        deleteClass(item){
            if(this.addOrEdit == 'edit'){
                this.$http.post("_ed:/scheduleVisualizing/checkDeleteClsOrNot",{
                    curriculum_visual_id:this.tableRowId,
                    admin_cls_id:item.id
                }).then(data => {
                    if(data.code == 0){
                        this.choiceClassList.map((val,index) => {
                            if(val.id == item.id){
                                this.choiceClassList.splice(index,1)
                                this.$refs.tree2.setChecked(item,false)
                            }
                        })
                    }else{
                        this.$message.error(data.msg);
                        this.$refs.tree2.setChecked(item,true)
                        return
                    }
                })
            }else{
                this.choiceClassList.map((val,index) => {
                    if(val.id == item.id){
                        this.choiceClassList.splice(index,1)
                        this.$refs.tree2.setChecked(item,false)
                    }
                })
            }
        },
        // 上移下移
        choiceTopOrDown(item,index,flag){
            if(flag == 'top'){
                if (item.length > 1 && index !== 0) {
                    let newArr = this.swapItems(item, index, index - 1)
                }
            }else if(flag == 'down'){
                if (item.length > 1 && index !== (item.length - 1)) {
                    let newArr = this.swapItems(item, index, index + 1)
                }
            }else{
                if (item.length > 1 && index !== 0) {
                    item.splice(0,0,item[index])
                    item.splice(index+1,1)
                }
            }
        },
        // 上移下移辅助函数
        swapItems: function(item, index1, index2) {
            item[index1] = item.splice(index2, 1, item[index1])[0]
            return item
        },
        // 隐藏新增编辑课程表dialog
        cancelLessonVisible(){
            this.dialogLessonVisible = false
            // this.$refs.addLessonForm.resetFields()
            this.addLessonForm = {
                name:'',
                note:'',
                semester:'',
                grade:'',
                class:[],
                year:'',
                num:''
            },
            this.choiceClassList = []
            this.classList = []
            // this.selectClass = null
        },
        // 新增编辑课程表dialog学期改变
        dialogSelectChange(_id){
            if (_id) {
                for (let item of this.semester) {
                    if (item.id == _id) {
                        this.addLessonForm.year = item.year;
                        this.addLessonForm.num = item.orderNum;
                    }
                }
            }
        },
        // 新增编辑课程表dialog提交
        submitLessonVisible(flag){
            // if (this.addLessonForm.name == null || this.addLessonForm.name.length == 0) {
            //     this.$message.error("请填写课程名称!")
            //     return false;
            // }
            // if (flag == 'add' && (this.addLessonForm.semester == null || this.addLessonForm.semester.length == 0)) {
            //     this.$message.error("请选择所在学期!")
            //     return false;
            // }
            // if (this.addLessonForm.grade == null || this.addLessonForm.grade.length == 0) {
            //     this.$message.error("请选择所在级!")
            //     return false;
            // }
            if (this.choiceClassList == null || this.choiceClassList.length == 0) {
                this.$message.error("请选择班级!")
                return false;
            }
            this.$refs.addLessonForm.validate((valid)=>{
                if(valid){
                    this.submitVisible(flag)
                }else{
                    return false
                }
            })
        },
        submitVisible(flag){
            let url;
            let option = {};
            let temp = []
            this.choiceClassList.map((item,index) => {
                temp.push(`${item.id}-${index+1}`)
            })
            if (flag == 'add') {
                url = "_ed:/scheduleVisualizing/addCurriculumVisual";
                option = {
                    admin_cls_ids:temp,
                    // curriculum_visual_id: '',
                    curriculum_visual_name: this.addLessonForm.name,
                    // grades: this.addLessonForm.grade,
                    note: this.addLessonForm.note,
                    semesterId: this.addLessonForm.semester,
                    semester_year: this.addLessonForm.year,
                    semester_year_number: this.addLessonForm.num,
                    user_id: this.userId
                }
            } else {
                url = "_ed:/scheduleVisualizing/updateCurriculumVisual";
                option = {
                    admin_cls_ids:temp,
                    curriculum_visual_id: this.tableRowId,
                    curriculum_visual_name: this.addLessonForm.name,
                    // grades: this.addLessonForm.grade,
                    note: this.addLessonForm.note,
                    semesterId: this.addLessonForm.semester,
                    semester_year: this.fallYear,
                    semester_year_number: this.semesterNum,
                    user_id: this.userId
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
                let message = `${this.addOrEdit=='add'?'新增':'编辑'}成功`;
                if (data.code == 0) {
                    this.dialogLessonVisible = false;
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
        // 删除课程表
        delTableRow(row){
            if (row.publish_status != 0) {
                this.$message(`${row.curriculum_name}已经生成进度表，请撤回进度表后再执行删除操作`);
                return;
            }
            this.$confirm(`此操作将永久删除“${row.create_username}”所维护的信息, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get("_ed:/scheduleVisualizing/delCurriculumVisual/" + row.id).then(data => {
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
        updateRow(row) {
            this.textCont = '正在更新，需要超过1分钟，请耐心等待'
            this.tableLoading = true
            let postData = {
                id:0,
                type: 1004,
                extend: JSON.stringify({curriculum_visual_id: row.id, //当前课表ID
                schedule_name:''   
                }),
                user_id:JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            }
            this.$http.post('_op:/approve/pTransCom', postData).then(res => {
                if(res.code == 0 ) {
                    this.textCont = '加载中...'
                    this.tableLoading = false
                }
            })
        },
        // 分页显示条目改变
        sizeChange(size){
            this.pageNo = 1;
            this.pageSize = size;
            this.getTableList();
        },
        // 分页跳转
        currentChange(current){
            this.pageNo = current;
            this.getTableList();
        },
        // 显示新增课程表dialog
        showLessonDialog(){
            this.title = '新增课程表'
            this.addOrEdit = 'add'
            this.disabled = false
            this.dialogLessonVisible = true
        },
        // 显示编辑课程表dialog
        showEditDialog(row){
            this.title = '编辑课程表'
            this.addOrEdit = 'edit'
            this.tableRowId = row.id
            // this.editSemester = row.term_name
            // this.selectClass = row.grades[0]
            this.disabled = true
            this.addLessonForm = {
                name:row.curriculum_name,
                note:row.note,
                grade:`${row.grades[0]}`,
                class:[],
                semester:this.tempSemesterId
            }
            this.getSelectClass(this.tableRowId)
            this.dialogLessonVisible = true
        },
        // 显示更多
        collapseShow() {
            this.fold.state = !this.fold.state;
            this.fold.text = this.fold.state ? '收起' : '展开';
        },
        // 录入
        entering(row){
            this.$router.push({
                path:'/teaching_management/visualized_course/write_down',
                query:{
                    cls_name:row.curriculum_name,
                    grade:JSON.stringify(row.grades),
                    curriculum_visual_id:row.id,
                    term_name:row.term_name,
                    year:this.tempSemester_year,
                    semesterNum:this.tempSemester_year_number,
                    semesterID:this.tempSemesterId
                }
            })
        }
    }
}
</script>
<style>
    .visual-schedule .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 110px;
    }
</style>

<style lang="less" scoped>
.select-studnet-box{
    display: flex;
    justify-content: flex-end;
}

.add_wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.add_left{
    width: 46%;
    height:360px;
    // overflow: auto;
    .treeList{
        height: 320px;
        overflow: auto;
    }
}
.add_right{
    width: 50%;
    height:360px;
    border:1px solid #d1dbe5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
}
.right_title{
    height: 36px;
    width: 100%;
    background-color: rgba(242, 242, 242, 1);
    display: flex;
    justify-content: center;
    align-items: center;
}
.right_list{
    width: 100%;
    flex:1;
    overflow: auto;
    box-sizing: border-box;
    padding:0 16px;
}
.choice_item{
    height: 36px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding:0 4px;
    .choice-text{
        display: inline-block;
        height: 100%;
        font-size: 14px;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }
    .choice-icon{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 60px;
        i{
            width: 16px;
        }
        .toTop{
            width:32px;
            font-size: 12px;
            color:#409EFF;
            cursor: pointer;
        }
    }
    .icon-close{
        i{
            width: 16px;
        }
    }
    i{
        cursor: pointer;
    }
}
</style>