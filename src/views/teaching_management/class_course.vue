<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path:item.path }"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="searchForm">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
                  <el-form-item label="学期">
                        <el-select 
                        v-model="searchForm.formYear"
                        filterable
                        remote
                        @change="onYearChange" 
                        :remote-method="getTermData" 
                        placeholder="全部"
                        value-key="id">
                        <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            <el-form-item label="所在级">
              <intelligent-year-picker
                style="width: 100%;"
                v-model="searchForm.grade"
                type="year"
                clearable
                value-format="yyyy"
                placeholder="选择年级"
              ></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="课程">
                <el-select  clearable v-model="searchForm.courseId" filterable placeholder="全部">
                    <el-option label="全部" value></el-option>
                    <!-- <template v-for="item in arrangCourseList">
                                        <el-option v-for="list in item.teachTaskCourseList" :key="list.id" :label="list.name" :value="list.courseId"></el-option>
                    </template>-->
                    <el-option v-for="(list, index) in arrangCourseList" :key="index" :label="list.name" :value="list.id"></el-option>
                </el-select>
            </el-form-item>
                <el-form-item  label="专业">
                    <el-select   clearable v-model="searchForm.majorId" filterable @change="onMajorChange" placeholder="全部">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                </el-select>
            </el-form-item>
        <!-- 暂时不做 -->
        <!-- <el-form-item label="课程" filterable>
            <el-select v-model="searchForm.courseId" filterable :disabled="searchForm.majorId==''" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
            </el-select>
        </el-form-item> -->
        </div>
        <div class="btn" v-if="btnPerObj.query">
            <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        </div>
    </div>
</el-form>
</div>
<div style="display:flex;padding:0px 20px 10px 20px;">
    <!-- <el-button size="mini" type="primary" @click="addTask" v-if="btnPerObj.add">新增课程库</el-button> -->
    <div style="width:50%;">
        <el-button size="mini" type="primary" @click="oneTouch" v-if="btnPerObj.onestep">一键生成</el-button>
        <el-button size="mini" type="primary" @click="comBined">手工合并学期课程库</el-button>
        <el-button size="mini" type="primary" @click="autoCombine">自动合并学期课程库</el-button>
        <el-button size="mini" @click="batchDeleRow" v-if="btnPerObj.delBatch">批量删除</el-button>
    </div>
    <div style="width:50%;text-align:right;padding-right: 20px;">
        <el-button size="mini" type="primary" @click="addTask" >新增学期库</el-button>
        <!-- <el-button size="mini"   >复制学期库</el-button> -->
    </div>
</div>
<div class="cm-table">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%" size="mini" v-loading="tableLoading" element-loading-text="加载中..." header-row-class-name="cm-dark" @selection-change="onSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
            <template slot-scope="scope">
            <template v-if="item.label=='教学任务'">
              <el-button @click="seeTableDetail(scope.row)" type="text" size="small">详情</el-button>
            </template>
            <template v-else-if="item.prop=='create_time'">{{ scope.row.create_time | getTime}}</template>
            <template v-else-if="item.prop=='total_class'">
              <el-button
                @click="onClass(scope.row)"
                type="text"
                size="small"
              >{{ scope.row.total_class}}</el-button>
            </template>
            <template v-else>{{scope.row[item.prop]}}</template>
            </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
            <!-- <el-button @click="editGrade(scope.row)" type="text" size="small">编辑</el-button> -->
            <el-button
              @click="delTableRow(scope.$index,scope.row)"
              type="text"
              size="small"
              style="color: red;"
            >删除</el-button>

            <el-button
              @click="courseContent(scope.row)"
              type="text"
              size="small" 
            >内容库</el-button>

          </template>
        </el-table-column>
    </el-table>
</div>
<div class="cm-pagination">
    <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange"></el-pagination>
</div>
<!-- 新增学期课程库 -->
<el-dialog width="900px" class="pm-margin" title="新增学期课程库" :visible.sync="dialog.visible" :close-on-click-modal="false" :modal-append-to-body="false" @closed="dialogClose">
    <div class="cm-addGrade">
        <!-- <p>①请选择学期、所在级对教学任务进行合并课程/拆分课程</p> -->
        <el-form ref="addForm" size="small" :model="addForm" label-position="right"  label-width="110px">
            <el-form-item label="学期" prop="addYear">
                <el-select style="width: 100%;" v-model="addForm.addYear" clearable filterable remote @change="onAddYear" :remote-method="getTermData" placeholder="请输入学期">
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="所在级" prop="grade">
                        <el-select v-model="addForm.grade" placeholder="请选择所在级">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
          </el-form-item>-->
            <el-form-item label="排课课程名称" prop="name">
                <el-input v-model="addForm.name" maxlength="40" placeholder="请输入学期课程名称"></el-input>
            </el-form-item>
            <el-form-item label="排课课程学时" prop="hours">
                <el-input v-model="addForm.hours" maxlength="9" @blur="onBlurEvent" placeholder="请输入学时（格式：理论/实践）"></el-input>
            </el-form-item>
            <el-form-item label="适用专业" prop="majors">
                <el-select style="width: 100%;" v-model="addForm.majors" value-key="id" multiple filterable placeholder="请选择专业">
                    <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所在级">
                <intelligent-year-picker v-model="addForm.grade" type="year" value-format="yyyy" placeholder="选择年级"></intelligent-year-picker>
            </el-form-item>
            <el-form-item label="课程" prop="courseId">
                <el-select style="width: 100%;" v-model="addForm.course" value-key="id" filterable placeholder="请选择课程">
                    <el-option v-for="list in baseCourseList" :key="list.id" :label="list.name" :value="list"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-button type="primary" size="small" @click="onGradeSearch">查询</el-button> -->
        </el-form>
        <!-- <div class="cm-table">
            <el-table ref="multipleTable" :data="addtableData" border style="width: 100%" header-row-class-name="cm-dark" @selection-change="onAddSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column v-for="(item,index) in addtableList" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
            </el-table>
        </div> -->
        <!-- <p>②定义排课课程（合并/拆分后）的数据信息</p>
        <el-form ref="addFormNext" :rules="rules" :model="addFormNext" label-width="110px">

        </el-form> -->
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmAdd('addFormNext')">确 定</el-button>
      </span>
</el-dialog>
<!-- 详情及编辑 -->
<el-dialog width="900px" :title="dialog.status=='edit'?'编辑学期课程库':'教学任务关系'" :visible.sync="dialog.editvisible" :close-on-click-modal="false" :modal-append-to-body="false">
    <el-form v-if="dialog.status=='edit'?true:false" ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="排课课程">
            <el-input v-model="editForm.plan" placeholder="请输入排课课程课程名称"></el-input>
        </el-form-item>
        <el-form-item label="排课课程学时">
            <el-input v-model="editForm.hours" placeholder="请输入内容(排课课程理论学时/排课课程实践学时)"></el-input>
        </el-form-item>
    </el-form>
    <div class="cm-addGrade">
        <div class="cm-table">
            <el-table :span-method="arraySpanMethod" ref="multipleTable" :data="editTableData" border style="width: 100%" header-row-class-name="cm-dark">
                <el-table-column v-for="(item,index) in editTableList" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
            </el-table>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <template v-if="dialog.status=='edit'?true:false">
          <el-button @click="dialog.editvisible=false">取 消</el-button>
          <el-button type="primary" @click="confirmEditGrade">确 定</el-button>
        </template>
        <el-button v-else size="medium" type="primary" @click="dialog.editvisible=false">关 闭</el-button>
      </span>
</el-dialog>
<!-- 一键生成 -->
<el-dialog class="pm-margin" width="900px" title="一键生成学期课程库" :visible.sync="dialog.gradeVisible" :close-on-click-modal="false" :modal-append-to-body="false">
    <div class="cm-addGrade">
        <el-form :inline="true" ref="gradeForm" :model="gradeForm">
            <el-form-item label="学期" prop="year">
                <el-select v-model="onKeyYear" style="width:300px;" clearable filterable @change="onKeyYearChange" placeholder="请输入学期">
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="">
                <strong>相同专业课程内容的不同教学任务将合并生成一个学期课程库</strong>
            </el-form-item>

        </el-form>

        <P>
            <template v-if="onTouchData.length<=0">
                如下教学任务尚未建立课程内容库,
            </template>
            <template v-else>
                如下教学任务尚未建立课程内容库,是否建立学期课程库
                <el-radio-group v-model="enabledEmptyContent">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </template>
        </P>
        <div class="cm-table">
            <el-table ref="multipleTable" :data="onTouchData" border style="width: 100%" header-row-class-name="cm-dark">
                <el-table-column label="年级" prop="grade"></el-table-column>
                <el-table-column label="专业" prop="majorName"></el-table-column>
                <el-table-column label="课程" prop="courseName"></el-table-column>
            </el-table>
            <!-- <el-checkbox-group v-model="checkList">
                <el-checkbox label="没有课程内容库的教学任务,直接按课程专业生成学期课程库" ></el-checkbox>
            </el-checkbox-group> -->
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.gradeVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmOneTouch">确 定</el-button>
      </span>
</el-dialog>
<!-- 上课班详情 -->
<el-dialog width="900px" class="pm-margin" title="上课班信息" :visible.sync="dialog.classVisible" :close-on-click-modal="false" :modal-append-to-body="false">
    <div class="cm-table">
        <el-table ref="classTable" :data="classData" border style="width: 100%" header-row-class-name="cm-dark">
            <el-table-column type="index" label="序号" width="60px"></el-table-column>
            <el-table-column v-for="(item,index) in classList" :key="index" :prop="item.prop" :label="item.label">
                <template slot-scope="scope">
              <template
                v-if="item.prop=='teaching_mode'"
              >{{scope.row.teaching_mode==0 ? "普通教学" : "全英教学"}}</template>
                <template v-else>{{scope.row[item.prop]}}</template>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.classVisible=false">取 消</el-button>
        <el-button type="primary" @click="dialog.classVisible=false">确 定</el-button>
      </span>
</el-dialog>
<!-- -----------------------合并课程库-------------------------- -->
<el-dialog width="1200px" class="pm-margin" title="合并课程库" :visible.sync="dialog.combined " :close-on-click-modal="false" :modal-append-to-body="false">
    <div class="cm-fold">
        <el-form :inline="true" ref="searchForm" size="mini" :model="searchForm" :rules="rules">
            <el-form-item label="学期" prop="formYear">
                <el-select v-model="searchForm.formYear" clearable filterable remote :remote-method="getTermData" @change="onYearChange" placeholder="请选择学期" value-key="id">
                    <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所在级" prop="grade">
                <intelligent-year-picker v-model="searchForm.grade" clearable filterable @change="onYearChange" type="year" value-format="yyyy" placeholder="选择年级"></intelligent-year-picker>
            </el-form-item>

            <el-form-item label="课程" prop="courseId">
                <el-select v-model="searchForm.courseId" filterable clearable placeholder="请选择课程">
                    <el-option v-for="item in courseList" :key="item.course_id" :label="item.course_arrange" :value="item.course_id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" size="mini" v-if="btnPerObj.query" @click="searchMergeSemeterCourse">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="cm-table">
        <el-table ref="classTable" :data="mergeSemeterCourse" border style="width: 100%;margin-top:20px;" header-row-class-name="cm-dark" @selection-change="selectMergeSemeterCourseOnchange">
            <el-table-column type="selection" label="序号" width="60px"></el-table-column>
            <el-table-column label="专业" prop="majorNames"></el-table-column>
            <el-table-column label="课程名称" prop="course_arrange"></el-table-column>
            <el-table-column label="本学期学时(理论/实践)">
                <template slot-scope="scope">
              {{scope.row | formatterRow(scope.row)}}
            </template>
            </el-table-column>
            <el-table-column label="剩余学时理论/实践"></el-table-column>
        </el-table>
    </div>

    <el-form :inline="true" ref="saveMergeCourseForm" size="mini" :model="searchForm" :rules="rules">
        <el-form-item label="排课课程名称" prop="course_arrange">
            <el-input v-model="searchForm.course_arrange" style="width:440px;" placeholder="请输入排课课程名称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button size="mini" type="primary" @click="advancedset()">高级设置</el-button>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.combined=false">取 消</el-button>
        <el-button type="primary" @click="saveMergeCourseContent()">确 定</el-button>
      </span>
</el-dialog>

<!-- -----------------------高级设置-------------------------- -->
<el-dialog width="1200px" class="pm-margin" title="选择合并上课的课程内容" :visible.sync="dialog.advancedset " :close-on-click-modal="false" :modal-append-to-body="false">

    <div class="cm-table">
        <el-table ref="classTable" :data="mergeContent.allCourseContent" @selection-change="selectSemesterCourseContentOnchange" border style="width: 100%" header-row-class-name="cm-dark">

            <el-table-column label="课程内容" prop="content"></el-table-column>
            <el-table-column label="授课形式" prop="teachingFormName"></el-table-column>
            <!-- <el-table-column label="学期" prop=""></el-table-column> -->
            <el-table-column label="学时" prop="learningHour"></el-table-column>
            <el-table-column label="老师优先级" prop="teacherPriority">
                <template slot-scope="scope">
              {{scope.row.teacherPriority | formaterPriority('teacherName')}}
            </template>
            </el-table-column>
            <el-table-column label="场地优先级" prop="areaPriority">
                <template slot-scope="scope">
                {{scope.row.areaPriority  | formaterPriority('areaName')}}  
              </template>>
            </el-table-column>
            <el-table-column v-for="(record,index) in mergeContent.majorNameAndCourseContentIds" :key="index" :label="record.majorName" :width="record.majorName.split(',').length * 80">
                <template slot-scope="scope">
                <div v-html="formatterColumn(scope.row,record.contentIds)" ></div>
            </template>
            </el-table-column>
            <el-table-column type="selection" label="合并上课" :selectable="selectable"></el-table-column>
            <!-- <el-table-column label="老师优先级" prop=""></el-table-column> -->
        </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.advancedset=false">取 消</el-button>
        <el-button type="primary" @click="dialog.advancedset=false">确 定</el-button>
      </span>
</el-dialog>
</section>
</template>

<script>
    import util from '@/util';
    var regNum = /^\d+(\/\d+)+$/; //匹配数字跟斜杠
    // var regNum11 =/[][`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;

    import {
        mapState
    } from 'vuex';
import { constants } from 'crypto';

    export default {
        data() {
            const validateTime = (rule, value, callback) => {
                if (!regNum.test(value)) {
                    callback(new Error("请输入9位以内整数"));
                    return;
                } else {
                    callback();
                }
            };
            return {
                breadcrumb: [{
                    label: "教学管理"
                }, {
                    label: "排课学期课程库管理"
                }, ],
                baseCourseList: [],
                dialog: {
                    status: 'edit',
                    editvisible: false,
                    visible: false,
                    detailvisible: false,
                    gradeVisible: false,
                    classVisible: false,
                    combined: false,
                    advancedset: false
                },
                searchForm: {
                    formYear: {},
                    grade: null,
                    majorId: 0,
                    plan: "",
                    courseId: null,
                    course_arrange: null
                },
                addForm: {
                    addYear: "",
                    grade: "",
                    course: {},
                    name: "",
                    hours: ""
                },
                addFormNext: {
                    addYear: "",
                    grade: "",
                    courseId: "",
                    name: "",
                    hours: ""
                },
                editForm: {
                    plan: "",
                    hours: "",
                    id: 0
                },
                gradeForm: {
                    grade: "",
                    courseId: ""
                },
                rules: {
                    formYear: [{
                        required: true,
                        message: '请选择学期'
                    }],
                    // grade: [{
                    //     required: true,
                    //     message: '请选择年级'
                    // }],
                    courseId: [{
                        required: true,
                        message: '请选择课程'
                    }],
                    course_arrange: [{
                        required: true,
                        message: '请输入排课课程名称'
                    }],

                    // name:[{required: true, message: '请输入排课课程', trigger: ['change','change']}],
                    // hours:[{required: true, message: '请输入学时', trigger: ['change','change']},
                    // { required: true, validator: validateTime, trigger: 'blur'}]
                },
                tableList: [{
                        label: '学期',
                        prop: 'semester_name',
                        width: 200
                        
                    }, {
                        label: '所在级',
                        prop: 'grade',
                        width: 100
                    },
                     {
                        label: '排课课程',
                        prop: 'course_arrange',
                         width:300
                    }, {
                        label: '适用专业',
                        prop: 'majorNames',
                         width: 400
                    }, {
                        label: '学期学时理论/实践',
                        prop: 'arranged_hours'
                    }, {
                        label: '教学任务',
                        prop: 'date'
                    }, {
                        label: '上课班',
                        prop: 'total_class'
                    },
                    // {label:'创建人', prop:'create_username'},
                    {
                        label: '创建日期',
                        prop: 'create_time',
                        width:120
                    }
                ],
                addtableList: [{
                    label: '专业',
                    prop: 'major',
                }, {
                    label: '课程名称',
                    prop: 'course_name',
                }, {
                    label: '本学期学时理论/实践',
                    prop: 'semester_hours',
                }, {
                    label: '剩余学时理论/实践',
                    prop: 'surplus_hours',
                }, ],
                editTableList: [{
                        label: '学期',
                        prop: 'semester_name'
                    }, {
                        label: '所在级',
                        prop: 'grade'
                    }, {
                        label: '专业',
                        prop: 'major_name'
                    }, {
                        label: '课程',
                        prop: 'course_name'
                    }, {
                        label: '学期学时理论/实践',
                        prop: 'semester_hours'
                    },
                    // {label:'剩余学时理论/实践', prop:'surplus_hours'}
                ],
                onTouchList: [{
                    label: '所在级',
                    prop: 'grade'
                }, {
                    label: '专业',
                    prop: 'major'
                }, {
                    label: '课程名称',
                    prop: 'course_name'
                }, {
                    label: '本学期学时理论/实践',
                    prop: 'semester_hours'
                }, {
                    label: '剩余学时理论/实践',
                    prop: 'surplus_hours'
                }],
                classList: [{
                        label: '排课课程',
                        prop: 'course_arrange'
                    }, {
                        label: '上课班',
                        prop: 'name'
                    }, {
                        label: '教学模式',
                        prop: 'teaching_mode'
                    },
                    // {label:'上课组', prop:'surplus_hours'}
                ],
                classData: [],
                tableData: [],
                addtableData: [],
                gradetableData: [],
                editTableData: [],
                onTouchData: [],
                gridData: [],
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
                formYear: "",
                onKeyYear: "",
                options1: [],
                majorList: [],
                taskList: [],
                courseList: [],
                arrangCourseList: [],
                onSelectionChangeVal: [],
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
                    delBatch: false,
                    onestep: false
                },
                mergeContent: {

                },
                mergeSemeterCourse: [],
                checkList:[],
                enabledEmptyContent: 1,
            }
        },
        created() {
            this.getTermData();
            this.getMajorList();
            this.getArrangeCourse();

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
            formatterRow(row) {
                return row.arranged_theory_hours + '/' + row.arranged_novitiate_hours;
            },
            formaterPriority(value, type) {
                if (value) {
                    let priority = JSON.parse(value);
                    if (typeof priority == 'object') {
                        if (typeof priority.length == 'number') {
                            let names = priority.map(item => item[type]);
                            return names.join('/');
                        }
                    }

                }

            }
        },
        methods: {
            autoCombine() {
                var idList = [];
                var url = `_ed:/semestercourse/autocombine_v2`;
                this.onSelectionChangeVal.forEach(x => idList.push(x.id));
                let param = {id_list: idList.join(',')}
              
                this.$http.post(url, param).then(resp=> {
                    if(resp.data == null || resp.data == "") {
                        this.$message.success("合并成功");
                        this.getTableList()
                    } else {
                        this.$message.error(resp.data);
                    }
                }).catch(err => {
                    this.$message.error(JSON.stringify(err));
                })
            },
            arraySpanMethod(row) {

                if (row.rowIndex == 0) {
                    if (row.columnIndex === 4) {
                        return [this.editTableData.length, 1];
                    }
                }
            },
            selectable(row, index) {
                return row.isSelected;
            },
            searchMergeSemeterCourse() {
                let self = this;
                self.$refs.searchForm.validate((valid) => {
                    if (valid) {
                        //请求学期课程库数据 
                        self.$http.post("_ed:/semestercourse/query", {
                            grade: self.searchForm.grade,
                            course_id: self.searchForm.courseId,
                            semester_year: self.searchForm.formYear.year,
                            semester_year_number: self.searchForm.formYear.orderNum
                        }).then(res => {
                            if (res.code == 0) {
                                self.mergeSemeterCourse = res.data.dataList;
                            }
                        }).catch((error) => {
                            this.tableLoading = false;
                        })

                    } else {
                   
                        return false;
                    }
                });
            },
            saveMergeCourseContent() {
                let self = this;

                self.$refs.saveMergeCourseForm.validate((valid) => {
                    if (valid) {
                        if (self.selectSemesterCourseContent == null ||
                            self.selectSemesterCourseContent.length == 0) {
                            self.$message.warning('请选择需要合并的课程内容');
                            return;
                        }

                        let courseContentIds = self.selectSemesterCourseContent.map(item => item.id);
                        let oldContentIds = self.selectSemesterCourseContent.map(item => item.oldContentId);
                        let semesterCourseIds = self.selectMergeSemeterCourse.map(item => item.id);
                        self.$http.post('_ed:/semestercourse/mergeSemesterCourse', {
                            "oldContentIds": oldContentIds.join(','),
                            "courseContentIds": courseContentIds.join(','),
                            "semesterCourseIds": semesterCourseIds.join(','),
                            "course_arrange": self.searchForm.course_arrange
                        }).then(res => {
                            if (res.code == 0) {
                                self.$message.success("合并成功");
                                self.onSearch();
                                self.dialog.combined = false;
                                self.getTableList()
                            }
                        }).catch(err => {
                            console.error(err);
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            selectMergeSemeterCourseOnchange(val) {
                let self = this;
                self.selectMergeSemeterCourse = val;
            },
            formatterColumn(row, contentIds) {
                if (contentIds) {
                    let d = contentIds.filter(item => item === row.oldContentId);
                    if (d.length > 0) { //包含
                        row.isSelected = true;
                        return "&radic;";
                    } else {
                        //不包含时，创建虚拟变量让其不能被选中
                        if (row.isSelected) {
                            row.isSelected = false;
                        }
                        return "";
                    }
                }
            },
            selectSemesterCourseContentOnchange(val) {
                let self = this;
                self.selectSemesterCourseContent = val;
            },
            advancedset() {
                let self = this;
                if(!self.selectSemesterCourseContent || self.selectSemesterCourseContent.length <= 0 ){
                    if (self.selectMergeSemeterCourse && self.selectMergeSemeterCourse.length > 0) {
                        let semesterCourseIds = self.selectMergeSemeterCourse.map(item => item.id);
                        self.$http.post('_ed:/semestercourse/queryNeedMergeSemesterCourseContent', {
                            "semesterCourseIds": semesterCourseIds.join(',')
                        }).then(res => {
                            if (res.code == 0) {
                                self.mergeContent.majorNameAndCourseContentIds = res.data.majorNameAndCourseContentIds;
                                self.mergeContent.allCourseContent = res.data.allCourseContent;
                                self.dialog.advancedset = true;
                            }
                        }).catch(err => {
                            console.error(err);
                        });
                    } else {
                        self.$message.warning('请选择排课学期课程库');
                    }
                }else{
					self.dialog.advancedset = true;
				}

            },
            comBined() {
                this.onYearChange();
                this.dialog.combined = true
            },
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                    data.data.map(item => {
                        if (item.code == "query_paikexueqikechengku") { //查询
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "add_paikexueqikechengku") { //新增任务
                            self.btnPerObj.add = true;
                        }
                        if (item.code == "del_batch_paikexueqikechengku") { //批量删除
                            self.btnPerObj.delBatch = true;
                        }
                        if (item.code == "onestep_build_paikexueqikechengku") { //一键生成
                            self.btnPerObj.onestep = true;
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
            onYearChange(val) {
                let self = this;
                self.courseList = [];
                //获取课程列表
                self.$http.post("_ed:/semestercourse/queryCombox", {
                    semester_year: self.searchForm.formYear.year,
                    semester_year_number: self.searchForm.formYear.orderNum
                }).then(res => {
                    if (res.code == 0) {
                        self.courseList = res.data;
                    }
                });
                this.getArrangeCourse();
            },
            onMajorChange(val) {
                if (val) {
                    this.searchForm.courseId = "";
                    this.getCourseList();
                }
            },
            onAddYear(val) {
                if (val) {
                    for (let list of this.options1) {
                        if (list.id == val) {
                            this.addfallYear = list.year;
                            this.addsemesterNum = list.orderNum;
                        }
                    }
                } else {
                    this.addfallYear = "";
                    this.addsemesterNum = "";
                }
                this.getTaskData();
            },
            onSearch() {
                this.pageNo = 1;
                this.getTableList();
            },
            onClass(row) {
              
                this.dialog.classVisible = true;
                this.$http.get("_ed:/coursecls/list/semcourseid/" + row.id)
                    .then(data => {
                        if (data.code == 0) {
                            this.classData = data.data;
                            for (let list of this.classData) {
                                this.$set(list, "course_arrange", row.course_arrange);
                            }

                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            addTask() {
                // this.getTaskData();
                this.getCourseCombox();
                this.dialog.visible = true;
            },
            dialogClose() {
                this.addtableData = [];
                this.dialog.visible = false;
                this.$refs.addForm.resetFields();
            },
            editGrade(row) {
                this.dialog.status = 'edit';
                this.dialog.editvisible = true;
                this.editForm.plan = row.course_arrange;
                this.editForm.hours = row.arranged_hours;
                this.semester = row.semester_name;
                this.editForm.id = row.id;
                this.getTableDetail(row.id);
            },
            onBlurEvent() {
                let arrangedHours = this.addForm.hours.split('/');
                //补0
                if (arrangedHours.length == 1) {
                    this.addForm.hours = `${this.addForm.hours}/0`;
                }
            },
            confirmEditGrade() {
                let self = this;
                if (!self.editForm.plan || self.editForm.plan.length == 0) {
                    this.$message.warning('请输入排课课程名称!');
                    return;
                }

                if (!self.editForm.hours || self.editForm.hours == 0) {
                    this.$message.warning('请按格式输入排课课程学时!');
                    return;
                }

                let arrangedHours = self.editForm.hours.split('/');;

                if (arrangedHours.length == 1) {
                    self.arranged_theory_hours = arrangedHours[0];
                    self.arranged_novitiate_hours = 0;
                } else {
                    self.arranged_theory_hours = arrangedHours[0];
                    self.arranged_novitiate_hours = arrangedHours[1];
                }

                //验证是否为数字 

                if (
                    /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(self.arranged_theory_hours) == false
                ) {
                    self.$message.error("请输入有效排课课程理论学时");
                    return;
                }

                if (
                    /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(self.arranged_novitiate_hours) == false
                ) {
                    self.$message.error("请输入有效排课课程实践学时");
                    return;
                }

                //更新排课学期库
                this.$http.put("_ed:/semestercourse/updateSemesterCourse", {
                    id: this.editForm.id,
                    arranged_theory_hours: self.arranged_theory_hours,
                    arranged_novitiate_hours: self.arranged_novitiate_hours,
                    course_arrange: self.editForm.plan //安排的排课课程
                }).then(data => {

                    let type = "success";
                    let message = "修改成功";
                    if (data.code == 0) {
                        this.dialog.editvisible = false;
                        this.$message({
                            message: message,
                            type: type
                        })
                        this.getTableList();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'error'
                        })
                    }
                }).catch(err => {
                    this.$message({
                        message: '修改失败',
                        type: 'error'
                    })
                })
            },
            onSelectionChange(val) {
                this.onSelectionChangeVal = val;
            },
            confirmAdd(addForm) {
                this.addRequire();
               
            },
            //新增提交
            addRequire() {
                let idList = [];
               

                let arranged_theory_hours;
                let arranged_novitiate_hours;
                let arrangedHours = this.addForm.hours.split('/');


                for (let i = 0, len = arrangedHours.length; i < len; i++) {
                    arranged_theory_hours = arrangedHours[0];
                    arranged_novitiate_hours = arrangedHours[1];
                }
                let addParams = {
                    arranged_theory_hours: arranged_theory_hours*1,
                    arranged_novitiate_hours: arranged_novitiate_hours*1,
                    course_arrange: this.addForm.name,
                    course_arrange_code: this.addForm.course.code,
                    term_id: this.addForm.addYear,
                    grade: this.addForm.grade,
                    majors: this.addForm.majors.map(x => x.id),
                    majorNames: this.addForm.majors.map(x => x.name),
                    course_id: this.addForm.course.id

                }
               
                this.$http.post("_ed:/semestercourse/newAdd", addParams).then(data => {
                    let type = "success";
                    let message = "添加成功";
                    if (data.code == 0) {
                        this.dialog.visible = false;
                        this.getTableList();
                    } else {
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        message: message,
                        type: type
                    })
                })
            },
            batchDeleRow() {
                let course = [];
                let idList = [];
                for (let item of this.onSelectionChangeVal) {
                    course.push(item.course_arrange);
                    idList.push(item.id);
                }
                this.$confirm(`此操作将永久删除${course}所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("_ed:/semestercourse/deletebatch", {
                        idlist: idList
                    }).then(data => {
                        let type = 'success';
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
                            showClose: true,
                            message: message,
                            type: type
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            oneTouch() {
                this.onKeyYear = this.searchForm.formYear.id;
                this.onKeyYearChange(this.onKeyYear);
                this.dialog.gradeVisible = true;
            },
            onKeyYearChange(val) {
                if (val) {
                    for (let list of this.options1) {
                        if (list.id == val) {
                            this.keyfallYear = list.year;
                            this.keysemesterNum = list.orderNum;
                        }
                    }
                } else {
                    this.keyfallYear = "";
                    this.keysemesterNum = "";
                }
                this.getKeyTableData();
            },
            getKeyTableData() {
                //获取未安排课程内容的专业课程
                this.onTouchData = []
                let self = this;
                this.$http.post("_ed:/semestercourse/queryNotArrangeCourseContent", {
                    semester_year: this.keyfallYear,
                    semester_year_number: this.keysemesterNum
                }).then(res => {
                    if (res.code == 0) {
                        self.onTouchData = res.data;
                    } else {
                        self.$message.warning(res.msg);
                    }
                });


                // this.$http.post("_ed:/teachtask/toarrangecourses", {
                //     semester_year: this.keyfallYear,
                //     semester_year_number: this.keysemesterNum
                // }).then(data => {
                //     if (data.code == 0) {
                //         this.onTouchData = data.data;
                //         for (let item of this.onTouchData) {
                //             let surplus_theory_hours = item.semester_theory_hours - item.arranged_theory_hours;
                //             let surplus_novitiate_hours = item.semester_novitiate_hours - item.arranged_novitiate_hours;

                //             this.$set(item, 'surplus_hours', `${surplus_theory_hours}/${surplus_novitiate_hours}`);
                //             this.$set(item, 'semester_hours', `${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
                //         }
                //     } else {
                //         this.$message.error(data.msg);
                //     }
                // })
            },
            confirmOneTouch() {
				let self = this;
                
                this.$http.post("_ed:/semestercourse/autogenerate", {
                    semester_year: this.keyfallYear,
                    semester_year_number: this.keysemesterNum,
                    is_ger_not_has_content_teach_task:self.checkList.length > 0 ? true:false,
                    // create_user:this.userId,
                    create_username: this.userName,
                    generatedEmptyContent: this.enabledEmptyContent
                }).then(data => {
                    let type = 'success';
                    let message = "一键生成成功！";
                    if (data.code == 0) {
                        this.dialog.gradeVisible = false;
                        this.getTableList();
                    } else {
                        type = "error";
                        message = data.msg;
                    };
                    this.$message({
                        showClose: true,
                        message: message,
                        type: type
                    });
                });
            },
            onGradeSearch() {
                this.$http.post("_ed:/teachtask/canarrangecourses", {
                    grade: this.addForm.grade,
                    id: this.addForm.courseId,
                    semester_year: this.addfallYear,
                    semester_year_number: this.addsemesterNum
                }).then(data => {
                    if (data.code == 0) {
                        this.addtableData = data.data;
                        for (let item of this.addtableData) {
                            let surplus_theory_hours = item.semester_theory_hours - item.arranged_theory_hours;
                            let surplus_novitiate_hours = item.semester_novitiate_hours - item.arranged_novitiate_hours;
                            this.$set(item, 'semester_hours', `${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
                            this.$set(item, 'surplus_hours', `${surplus_theory_hours}/${surplus_novitiate_hours}`);
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            onAddSelectionChange(val) {
              
                this.onAddSelectionChangeVal = val;
            },
            seeTableDetail(row) {
                this.semester = row.semester_name;
                this.dialog.status = 'detail';
                this.dialog.editvisible = true;
                this.getTableDetail(row.id);
            },
            getTableDetail(_id) {
                this.$http.get("_ed:/semestercourse/detail/" + _id)
                    .then(data => {
                        if (data.code == 0) {
                            this.editTableData = data.data;
                            for (let item of this.editTableData) {
                                let surplus_theory_hours = item.total_theory_hours - item.arranged_theory_hours;
                                let surplus_novitiate_hours = item.total_novitiate_hours - item.arranged_novitiate_hours;
                                this.$set(item, 'semester_name', this.semester);
                                this.$set(item, 'surplus_hours', `${surplus_theory_hours}/${surplus_novitiate_hours}`);
                                this.$set(item, 'semester_hours', `${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            closeDetail() {
                this.dialog.detailvisible = false;
            },
            teachingRemark() {
                this.dialog.remark = true;
            },
            delTableRow(index, row) {
                this.$confirm(`此操作将永久删除“${row.course_arrange}”所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("_ed:/semestercourse/delete/" + row.id)
                        .then(data => {
                            let type = 'success';
                            let message = '删除成功!'
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
            getArrangeCourse() {
                let self = this;
                this.$http.post("_op:course/list", {
                    "pageNo": 1,
                    "pageSize": 1000,
                    "param": {
                        semesterId: self.searchForm.formYear.id
                        // "status": "",
                        // "categoryId": "",
                        // "code": "",
                        // "name": "",
                        // "natureId": "",
                        // "remark": ""
                    }
                }).then(res => {
                    if (res.result) {
                        self.arrangCourseList = res.result;
                    }
                })
            },
            getTaskData() {
                this.$http.post("_ed:/teachtask/courselist", {
                    semester_year: this.addfallYear,
                    semester_year_number: this.addsemesterNum
                }).then(data => {
                    if (data.code == 0) {
                        this.taskList = data.data;
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            getCourseList() {
                this.$http.get("_op:/coursePlatform/combox/" + this.searchForm.majorId)
                    .then(data => {
                        if (data.code == 0) {
                            this.courseList = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            getCourseCombox() {
                this.$http.get("_op:/course/combox").then(data => {
                    this.baseCourseList = data.data;
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            getTableList() {
                this.tableLoading = true;
                this.$http.post("_ed:/semestercourse/query", {
                    // id:this.searchForm.plan,
                    grade: this.searchForm.grade,
                    major_id: this.searchForm.majorId,
                    // course_platform_id:this.searchForm.courseId,
                    course_id: this.searchForm.courseId,
                    semester_year: this.searchForm.formYear ? this.searchForm.formYear.year : null,
                    semester_year_number: this.searchForm.formYear ? this.searchForm.formYear.orderNum : null,
                    request_page: this.pageNo,
                    page_size: this.pageSize
                }).then(data => {
                    if (data.code == 0) {
                        this.tableLoading = false;
                        this.totalCount = data.data.total_records;
                        this.tableData = data.data.dataList;
                        for (let item of this.tableData) {

                            this.$set(item, 'arranged_hours', `${item.arranged_theory_hours}/${item.arranged_novitiate_hours}`);
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch((error) => {
                    this.tableLoading = false;
                })
            },
            getTermData(query) {
                if (!query) {
                    query = "学期";
                }
                this.$http.get('_op:/terms/' + query)
                    .then(data => {
                        if (data.code == 0) {
                            this.options1 = data.data.reverse();
                               
                            for(let i=0;i<this.options1.length;i++){
                                if(this.options1[i].stage==1){
                                    this.searchForm.formYear=this.options1[i];
                                    // this.addForm = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear =this.options1[i].year;
                                    break
                                }else{
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.searchForm.formYear=this.options1[i];
                                        // this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                }
                            }
                            // this.options1.forEach(item =>{
                            //     if (item.stage==1){
                            //        this.searchForm.formYear=item.name
                            //     }else{
                            //          if(this.options1[i].name.indexOf('当前学期')!=-1){
                            //             this.formDetails.semester=this.options1[i].id
                            //         }
                            //     }
                            // })

                            
                            this.getTableList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            courseContent(row) {
                this.$router.push({
                    path: '/teaching_management/course_content',
                    query: row
                });
            }

        }
    }
</script>
<style scoped>
    .cm-addGrade p {
        margin-bottom: 12px;
    }
</style>
<style>
    .pm-margin /deep/.el-dialog__body {
        padding: 10px 40px;
    }
</style>