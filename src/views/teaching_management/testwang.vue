<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <!-- <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                remote
                                @change="onSelectChange" 
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>


                      
                         <el-form-item label="分班序号"  filterable placeholder="全部">
                        
                            <el-input style="width: 100%;" :maxlength="40" v-model="formInline.classNum" clearable placeholder="请输入分班序号"></el-input>
                         </el-form-item>

                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.courseId" filterable placeholder="全部">
                                <el-option label="全部" value="-1"></el-option>
                                <el-option v-for="(list, index) in courseArrangeList" :key="index" :label="list.course_arrange+` (${list.majorNames} ${list.arranged_theory_hours}/${list.arranged_novitiate_hours})`" :value="list.id"></el-option>
                            </el-select> 
                        </el-form-item>
                        <el-form-item label="教学模式">
                            <el-select v-model="formInline.teach" filterable placeholder="全部">
                                <el-option label="全部" value="-1"></el-option>
                                <el-option label="普通教学" :value="0"></el-option>
                                <el-option label="全英教学" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn" v-if="btnPerObj.query">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form> -->
        </div>
        <!-- <div class="cm-btn-con cm-btn-others">
            
            <el-button size="mini" type="primary" @click="addTask" v-if="btnPerObj.add">新增</el-button>
            
            <el-button size="mini" v-if="btnPerObj.download">
                <a style="color: #606266;" href="../../../template/class-template.xls" download='上课班模板'>下载模版</a>
                
            </el-button>
            <el-upload
              size="mini"
              style="display: inline-block;margin-left: 10px;"
              class="upload-demo"
              action="/edu/admin/import/importCourseClass"
              :headers="headers"
              :data="_upload_data"
              :before-upload="onBefore"
              :show-file-list="false"
              :on-success="onSuccess"
              v-if="btnPerObj.import">
              <el-button size="mini" type="primary">模板导入</el-button>
            </el-upload>
        </div> -->
        <div class="cm-table">
        <el-table
                ref="multipleTable"
                :data="tableData"
                border
                height="600"
                style="width: 100%"
                size="mini"
                v-loading="tableLoading"
                element-loading-text="加载中..."
                header-row-class-name="cm-dark">
            <el-table-column label="序号" fixed type="index"></el-table-column>
            <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                <template slot-scope="scope">
                    <template v-if="item.label=='教学模式'">
                        {{scope.row.teaching_mode==0?'普通教学':'全英教学'}}
                    </template>
                    <template v-else-if="item.label=='状态'">
                        {{scope.row.status==0?'正常':'结课'}}
                    </template>
                    <template v-else-if="item.prop=='create_time'">
                        {{ scope.row.create_time | getTime}}
                    </template>
                    <template v-else>
                        {{scope.row[item.prop]}}
                    </template>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="240">
                <template slot-scope="scope">
                    <el-button @click="editTask(scope.row)" type="text" size="small" v-if="btnPerObj.edit">编辑</el-button>
                    <el-button @click="associateStudents(scope.row)" type="text" size="small" v-if="btnPerObj.relation">关联学生</el-button>
                    <el-button @click="setGroup(scope.row)" type="text" size="small" v-if="btnPerObj.group">分组设置</el-button>
                    <el-button @click="result(scope.row)" type="text" size="small" v-if="btnPerObj.endCourse">结课</el-button>
                    <el-button @click="delTableRow(scope.row)" type="text" size="small" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
</div>
<div class="cm-pagination">
    <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
    </el-pagination>
</div>
<!-- 新增及编辑 -->
<!-- <el-dialog width="600px" class="pm-margin" :title="dialog.status==='add'?'新增上课班':'编辑上课班'" :visible.sync="dialog.visible" :modal-append-to-body="false" :close-on-click-modal='false' @closed="addDialogClose">
    <el-form ref="addForm" :rules="rules" :model="addForm">
        <el-form-item label="上课班名称" prop="name" class="flex-form">
            <el-input style="width: 100%;" :maxlength="40" v-model="addForm.name" clearable placeholder="请输入上课班名称"></el-input>
        </el-form-item>
        <el-form-item label="学期" class="flex-form" prop="year">
            <el-select style="width: 100%;" v-model="addForm.year" clearable filterable remote :remote-method="getTermData" @change="onAddSelectChange" placeholder="全部" value-key="id">
                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="所在级" class="flex-form" prop="grade">
            <el-date-picker style="width: 100%;" v-model="addForm.grade" type="year" value-format="yyyy" @change="onAddSelectChange" placeholder="选择年级">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="分班序号" prop="classNum" class="flex-form">
            <el-input style="width: 100%;" :maxlength="40" v-model="addForm.classNum" clearable placeholder="请输入分班序号"></el-input>
        </el-form-item>

        <el-form-item label="教学模式" prop="type" class="flex-form">
            <el-select v-model="addForm.type" placeholder="请选择教学模式" style="width: 100%;">
                <el-option v-for="list in teachTypeList" :key="list.id" :label="list.name" :value="list.id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <div class="addClass">
        <div>
            <label>
                            <span style="color:red;">*</span>
                            排课课程
                        </label>

            <table class="table">
                <thead>
                    <tr>
                        <th>排课课程（专业，学时）</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="index" v-for="(item,index) in addColumn">
                        <td>
                            <el-select size="small" ref="selectArrays" v-model.number="item.id" filterable placeholder="请选择">
                                <el-option v-for="(list, index) in courseArrangeList" :key="index" :label="list.course_arrange+` (${list.majorNames} ${list.arranged_theory_hours}/${list.arranged_novitiate_hours})`" :value="list.id"></el-option>
                            </el-select>
                        </td>
                        <td style="text-align: center;">
                            <el-button type="text" @click="deleteCourse(index)" style="color: red;font-size: 12px;">删除</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-button type="primary" size="small" @click="onAddColumn">
                                <i class="el-icon-plus"></i>
                            </el-button>
                        </td>
                        <td></td>
                    </tr>
                </tbody>

            </table>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
            </span>
</el-dialog> -->
</section>
</template>

<script>
    import util from '@/util'
    const TYPE = 'class-management';
    const REMARK = '上课班管理';

    import {
        mapState
    } from 'vuex'

    export default {
        data() {
            return {
                newSize: [],
                breadcrumb: [{
                    label: "教学管理"
                }, {
                    label: "上课班管理"
                }, ],
                dialog: {
                    status: 'add',
                    remark: false,
                    visible: false
                },
                options1: [],
                formInline: {
                    courseId: '-1',
                    teach: '-1',
                    grade: '',
                    classNum: "", //分班序列
                },
                addForm: {
                    name: '',
                    type: '',
                    grade: "",
                    classNum: "", //分班序号
                },
                tableList: [{
                        label: '上课班名称',
                        prop: 'name',
                      
                    }, {
                        label: '学期',
                        prop: 'semester_name',
                        
                    },
                    // {label:'所在级', prop:'grade',width:180},
                    {
                        label: '分班序号',
                        prop: 'classNum',
                       
                    }, {
                        label: '排课课程',
                        prop: 'course_namelist',
                        
                    }, {
                        label: '教学模式',
                        prop: 'teaching_mode',
                    }, {
                        label: '学生数',
                        prop: 'student_num',
                       
                    }, {
                        label: '状态',
                        prop: 'status',
                      
                    }, {
                        label: '创建人',
                        prop: 'create_username',
                    }, {
                        label: '创建日期',
                        prop: 'create_time',
                      
                    }
                ],
                rules: {
                    name: [{
                        required: true,
                        message: '请输入上课班名称',
                        trigger: 'blur'
                    }],
                    year: [{
                        required: true,
                        message: '请选择学期',
                        trigger: 'change'
                    }],
                    grade: [{
                        required: true,
                        message: '请选择所在级',
                        trigger: 'change'
                    }],
                    type: [{
                        required: true,
                        message: '请选择教学模式',
                        trigger: 'change'
                    }]
                },
                tableData: [],
                teachTypeList: [{
                    name: '普通教学',
                    id: 0
                }, {
                    name: '全英教学',
                    id: 1
                }],
                addColumn: [{
                    id: ''
                }],
                tableLoading: false,
                myDate: new Date(),
                courseArrangeList: [],
                formYear: "",
                fallYear: "",
                semesterNum: "",
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                tableHandle: {
                    status: "",
                    dest: "",
                    url: ""
                },
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                CourseClass: '',
                userId: util.getStorage('loginId'),
                userName: util.getStorage('loginName'),
                btnPerObj: { //按钮权限
                    query: false,
                    add: false,
                    download: false,
                    import: false,
                    edit: false,
                    relation: false,
                    group: false,
                    endCourse: false,
                    delete: false
                }
            }
        },
        created() {
            let arr =[
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                 {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                 {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                 {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                 {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                 {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0},
                {classNum: null,course_list: [1566],course_namelist: "人体结构与功能",create_time: 1558119882281,create_username: "",grade: 0,id: 2444,name: "人体结构与功能258",semester_name: "2018-2019学年第二学期",semester_year: 2018,semester_year_number: 2,status: 0,student_num: 10,teaching_mode: 0}
            ]
            this.tableData = arr
            // this.getTableList();
            // this.getTermData();
            // this.getCourseArrange();
        },
        mounted() {
            // util.resize(this);
            // window.onresize = () => {
            //     util.resize(this);
            // };

            // util.openBtnPermit(this.btnPerObj);
            //          this.getBtnPermit();
        },
        filters: {
            // getTime(time) {
            //     return util.getTime(time);
            // }
        },
        methods: {
            // //获取按钮权限
            // getBtnPermit() {
            //     let self = this;
            //     let actionId = this.$route.query.actionId;
            //     this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
            //         data.data.map(item => {
            //             if (item.code == "query_shangkebanguanli") { //查询
            //                 self.btnPerObj.query = true;
            //             }
            //             if (item.code == "add_shangkebanguanli") { //新增
            //                 self.btnPerObj.add = true;
            //             }
            //             if (item.code == "download_template_shangkebanguanli") { //下载模板
            //                 self.btnPerObj.download = true;
            //             }
            //             if (item.code == "import_template_shangkebanguanli") { //导入模板
            //                 self.btnPerObj.import = true;
            //             }
            //             if (item.code == "edit_shangkebanguanli") { //编辑
            //                 self.btnPerObj.edit = true;
            //             }
            //             if (item.code == "relation_stu_shangkebanguanli") { //关联学生
            //                 self.btnPerObj.relation = true;
            //             }
            //             if (item.code == "group_setting_shangkebanguanli") { //分组设置
            //                 self.btnPerObj.group = true;
            //             }
            //             if (item.code == "end_course_shangkebanguanli") { //结课
            //                 self.btnPerObj.endCourse = true;
            //             }
            //             if (item.code == "del_shangkebanguanli") { //删除
            //                 self.btnPerObj.delete = true;
            //             }
            //         });
            //     }).catch(() => {})
            // },

            // collapseShow() {
            //     this.fold.state = !this.fold.state;
            //     this.fold.text = this.fold.state ? '收起' : '展开';
            // },
            // sizeChange(size) {
            //     this.pageNo = 1;
            //     this.pageSize = size;
            //     this.getTableList();
            // },
            // currentChange(current) {
            //     this.pageNo = current;
            //     this.getTableList();
            // },
            // selectChangeFun(_id) {

            //     let self = this;
            //     let id = self.formYear;
            //     // let grade = self.addForm.grade;
            //     let classNum = self.addForm.classNum; //所在级更改为分班序号

            //     for (let item of this.options1) {
            //         if (item.id == _id) {
            //             self.fallYear = item.year;
            //             self.semesterNum = item.orderNum;
            //         }
            //     }
            //     this.addColumn = [{
            //         id: ''
            //     }]
            //     this.courseArrangeList = [];
            //     this.getCourseArrange();

            // },
            // getCourseArrange() {
            //     let self = this;
            //     this.$http.post("_ed:/semestercourse/list/detail", {
            //         semester_year: self.fallYear,
            //         semester_year_number: self.semesterNum,
            //         grade: self.addForm.grade,
            //         classNum: self.addForm.classNum //所在级更改分班序号
            //     }).then(res => {
            //         if (res.code == 0) {
            //             this.courseArrangeList = res.data;
            //             // for(let list of this.courseArrangeList){
            //             //     // this.newData=list.teachTaskCourseList;
            //             //     let majorName = '';
            //             //     if(list.teachTaskCourseList){

            //             //         for(let item of list.teachTaskCourseList){
            //             //             let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;

            //             //             this.$set(item,"name",`${item.course_name}（${item.majorNames}，${house}）`);
            //             //             this.$set(item,"courseId",list.id);
            //             //             majorName += '+' + item.major;
            //             //             this.$set(list, 'major', majorName.substring(1));  
            //             //         } 
            //             //     }
            //             // }
            //         } else {
            //             this.$message.error(data.msg);
            //         }
            //     })
            // },
            // onSelectChange(_id) {
            //     this.selectChangeFun(_id)
            // },
            // onAddSelectChange(_id) {
            //     this.selectChangeFun(_id);
            // },
            // onSearch() { //查询
            //     this.request_page = 1;
            //     this.getTableList("search");
            // },
            // addTask(addForm) { // 新增弹窗
            //     this.dialog.status = 'add';
            //     this.dialog.visible = true;
            //     //   this.$refs[addForm].resetFields(); //清除数据记录
            // },
            // onBefore(file) { // 导入限制提示
            //     let extension = file.name.split('.')[1] === 'xls';
            //     let size = file.size / 1204 / 1204 < 20;
            //     if (!extension) {
            //         this.$message.warning("上传的文件格式是 xls！")
            //     }
            //     if (!size) {
            //         this.$message.warning("上传的文件大小不能超过20M！")
            //     }
            //     return size;
            // },
            // onSuccess(res, file) { // 模板导入
            //     let type = "success";
            //     let message = "导入成功！";
            //     if (res.code != 0) {
            //         type = "error";
            //         message = res.msg;
            //     }
            //     this.$message({
            //         type: type,
            //         message: message
            //     })
            // },
            // deleteCourse(idx) { // 删除
            //     this.addColumn.splice(idx, 1);
            // },
            // onAddColumn() { // 添加课程触发
            //     this.addColumn.push({
            //         id: '',
            //     });
            // },
            // associateStudents(row) { // 关联学生
            //     let data = {
            //         id: row.id,
            //         name: row.name,
            //         grade: row.grade,
            //         semester_name: row.semester_name,
            //         course_namelist: row.course_namelist,
            //     }
            //     this.$router.push({
            //         path: '/teaching_management/associate_students',
            //         query: {
            //             row: JSON.stringify(data),
            //             actionId: this.$route.query.actionId
            //         }
            //     });
            // },
            // // 编辑弹窗
            // editTask(row) {

            //     this.addColumn = [{
            //         id: ''
            //     }];

            //     this.dialog.visible = true;
            //     this.rowId = row.id;
            //     this.addForm.name = row.name; //上课名称
            //     this.formYear = row.semester_name; //学期
            //     // this.addForm.grade = `${row.grade}`
            //     // this.addForm.classNum = `${row.classNum}`
            //     this.addForm.classNum = row.classNum || '';

            //     //     this.addForm.grade = `${row.semester_year}/0/0`;//所在级
            //     this.addForm.year = row.semester_name; //学期
            //     this.fallYear = row.semester_year;
            //     this.semesterNum = row.semester_year_number;
            //     if (row.teaching_mode == 0) { //教学模式
            //         this.addForm.type = "普通教学"
            //     } else {
            //         this.addForm.type = "全英教学"
            //     }
            //     this.dialog.status = 'edit';
            //     //默认排课课程
            //     this.courseArrangeList.map((list, i) => {
            //         row.course_list.map((item, index) => {

            //             if (list.id == item) {

            //                 this.addColumn.push({
            //                     id: list.id
            //                 });
            //             }
            //         })

            //     })
            //     this.addColumn.splice(0, 1)
            //     this.getCourseArrange();
            // },

            // //编辑提交确定
            // submitForm(formName) {
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             this.confirmAdd();

            //         } else {
            //             return false;
            //         }
            //     });
            // },
            // confirmAdd() {
            //     let that = this;
            //     let url;
            //     let option = {};
            //     this.courseIdList = [];

            //     for (let list of this.addColumn) {
            //         if (list.id) {
            //             this.courseIdList.push(list.id);
            //         } else {
            //             this.$message.warning("请选择排课课程！");
            //         }
            //     }
            //     //检查排课课程是否重复
            //     for (let x = 0, ls = this.courseIdList.length; x < ls; x++) {
            //         for (var z = x; z < this.courseIdList.length - 1; z++) {
            //             if (this.courseIdList[x] == this.courseIdList[z + 1]) {
            //                 this.$message.warning("排课课程重复，请重新选择！")
            //                 return;
            //             }
            //         }
            //     }

            //     if (this.dialog.status == 'add') {
            //         url = "_ed:/coursecls/add";
            //         option = {
            //             name: this.addForm.name,
            //             teaching_mode: this.addForm.type,
            //             grade: parseInt(this.addForm.grade),
            //             // classNum:parseInt(this.addForm.classNum),
            //             classNum: this.addForm.classNum,
            //             // create_user:this.userId,
            //             // create_username:this.userName,
            //             course_list: this.courseIdList,
            //             semester_year: this.fallYear,
            //             semester_year_number: this.semesterNum
            //         }
            //     } else {
            //         url = "_ed:/coursecls/edit";
            //         let type;
            //         if (this.addForm.type == '普通教学') {
            //             type = 0;
            //         } else {
            //             type = 1;
            //         }
            //         option = {
            //             id: this.rowId,
            //             name: this.addForm.name,
            //             grade: parseInt(this.addForm.grade),
            //             // classNum:parseInt(this.addForm.classNum),
            //             classNum: this.addForm.classNum,
            //             teaching_mode: type,
            //             course_list: this.courseIdList,
            //             semester_year: this.fallYear,
            //             semester_year_number: this.semesterNum
            //         }
            //     }

            //     this.$http({
            //         method: "post",
            //         url: url,
            //         data: {
            //             ...option
            //         },
            //     }).then(data => {
            //         let type = "success";
            //         let message = `${this.dialog.status == 'add' ? '新增' : '编辑'}成功！`
            //         if (data.code == 0) {
            //             this.getTableList();
            //             this.dialog.visible = false;

            //             this.addColumn = [{
            //                 id: ""
            //             }];
            //         } else {
            //             type = "error";
            //             message = data.msg;
            //         }
            //         this.$message({
            //             type: type,
            //             message: message
            //         });
            //     })

            // },
            // setGroup(row) {
            //     this.$router.push({
            //         path: '/teaching_management/group_management',
            //         query: {
            //             row: JSON.stringify(row)
            //         }
            //     });
            // },
            // result(row) {
            //     this.tableHandle.status = "结课";
            //     this.tableHandle.dest = "上课班进行结课";
            //     this.tableHandle.url = `_ed:/coursecls/complete/${row.id}`;
            //     this.tableHandleRequire();
            // },
            // // 删除列表信息
            // delTableRow(row) {
            //     this.tableHandle.status = "删除";
            //     this.tableHandle.dest = `永远删除${row.name}所维护的信息`;
            //     this.tableHandle.url = `_ed:/coursecls/delete/${row.id}`;
            //     this.tableHandleRequire("del");

            // },
            // tableHandleRequire(val) {
            //     let method = "post";
            //     if (val == "del") {
            //         method = "delete";
            //     }
            //     this.$confirm(`此操作将删除学生信息, 是否继续?`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.$http({
            //             method: method,
            //             url: this.tableHandle.url
            //         }).then(data => {
            //             let type = "success";
            //             let message = `${this.tableHandle.status=='结课'?'结课':'删除'}成功！`
            //             if (data.code == 0) {
            //                 // 判断是否是当页最后一条，如果是，更新请求列表
            //                 if (this.tableData.length == 1) {
            //                     this.pageNo = 1;
            //                 }
            //                 this.getTableList();
            //             } else {
            //                 type = "error";
            //                 message = data.msg;
            //             }
            //             this.$message({
            //                 type: type,
            //                 message: message
            //             });
            //         })
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: `已取消${this.tableHandle.status=='结课'?'结课':'删除'}`
            //         });
            //     });
            // },
            // addDialogClose() {
            //     this.dialog.visible = false;
            //     this.addForm.name = "";
            //     this.addForm.type = "";
            //     // this.addForm.grade = "";
            //     this.addForm.classNum = "";

            //     this.addColumn = [{
            //         id: ""
            //     }];
            // },
            // teachingRemark() {
            //     this.dialog.remark = true;
            // },
            // getTableList(val) {
            //     this.tableLoading = true;
            //     let option = {
            //         request_page: this.pageNo,
            //         page_size: this.pageSize
            //     }
            //     if (val == "search") {
            //         option = {
            //             teaching_mode: this.formInline.teach,
            //             semester_course_id: this.formInline.courseId,
            //             // grade:parseInt(this.formInline.grade),
            //             classNum: parseInt(this.formInline.classNum),
            //             request_page: this.pageNo,
            //             page_size: this.pageSize,
            //             semester_year: this.fallYear,
            //             semester_year_number: this.semesterNum,
            //         }
            //     }
            //     this.$http({
            //         method: "post",
            //         url: "_ed:/coursecls/query",
            //         data: {
            //             ...option
            //         }
            //     }).then(data => {
            //         if (data.code == 0) {
            //             this.tableLoading = false;
            //             this.newSize = data.data.dataList.length,
            //                 this.totalCount = data.data.total_records;
            //             this.tableData = data.data.dataList;
            //         } else {
            //             this.$message.error(data.msg);
            //         }
            //     }).catch((error) => {
            //         this.tableLoading = false;
            //     })
            // },
            // getTermData(query) {
            //     if (!query) {
            //         query = "学期";
            //     }
            //     this.$http.get('_op:/terms/' + query)
            //         .then(data => {
            //             if (data.code == 0) {
            //                 this.options1 = data.data.reverse();

            //                 let year = this.myDate.getFullYear();
            //                 let month = this.myDate.getMonth() + 1;
            //                 for (let i = 0, len = this.options1.length; i < len; i++) {

            //                     let termYear = this.options1[i].year;
            //                     let termMonth = this.options1[i].startTime.substring(6, 7);
            //                     if ((year == termYear) && (month >= 2 && month <= 8)) {
            //                         if (this.options1[i].orderNum == 1) {
            //                             this.formYear = this.options1[i].name;
            //                             this.addForm.year = this.options1[i].name;
            //                             this.semesterNum = this.options1[i].orderNum;
            //                             this.fallYear = this.options1[i].year;
            //                         }
            //                     } else if ((year == termYear) && (month >= 9 || month < 2)) {
            //                         if (this.options1[i].orderNum == 2) {
            //                             this.formYear = this.options1[i].name;
            //                             this.addForm.year = this.options1[i].name;
            //                             this.semesterNum = this.options1[i].orderNum;
            //                             this.fallYear = this.options1[i].year;
            //                         }

            //                     }
            //                 }

            //             } else {
            //                 this.$message.error(data.msg);
            //             }


            //         })
            // }
        },
        computed: {
            // ...mapState(['btnPermitList']),
            // headers() {
            //     return {
            //         'Access_Token': util.getStorage('token'),
            //         'Authorization': util.getStorage('token')
            //     }
            // },
            // _upload_data() {
            //     return {
            //         _upload_data: JSON.stringify({
            //             create_user: this.userId,
            //             create_username: this.userName
            //         })
            //     }
            // }
        },
    }
</script>
<style scoped>
    /* .table {
        width: calc(100% - 86px)!important;
        border: solid 1px lightgray;
    }
    
    .addClass>div {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }
    
    .addClass div label {
        width: 88px;
        margin-left: 14px;
    }
    
    .table>thead>tr>th {
        padding: 8px;
        vertical-align: bottom;
        border: 1px solid #ddd;
        border-bottom: 2px solid #ddd;
        background-color: #f7f7f7;
    }
    
    .table>tbody>tr>td {
        padding: 8px;
        border: 1px solid #ddd;
    }
    
    .addClass /deep/ .el-select {
        width: 100%;
    }
    
    .addClass /deep/ .el-input--small .el-input__inner {
        height: 40px;
    }
    
    .el-form /deep/ .flex-form.el-form-item .el-form-item__label {
        min-width: 100px;
    }
    
    .pm-margin /deep/.el-dialog__body {
        padding: 10px 40px;
    } */
</style>