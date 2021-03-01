<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="searchForm">
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
                                :remote-method="getTermData"
                                @change="onYearChange" 
                                placeholder="请输入学期">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <!-- options1 -->
                        </el-form-item>
                        <el-form-item class="date-item" label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="searchForm.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select v-model="searchForm.plan" filterable placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <!-- <template v-for="item in arrangCourseList">
                                    <el-option v-for="list in item.teachTaskCourseList" :key="list.id" :label="list.name" :value="list.courseId"></el-option>
                                  </template> -->
                                <el-option v-for="(list, index) in arrangCourseList" :key="index" :label="list.course_arrange+` (${list.major} ${list.arranged_theory_hours}/${list.arranged_novitiate_hours})`" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="专业">
                            <el-select v-model="searchForm.majorId" filterable  @change="onMajorChange" placeholder="全部">
                                <el-option label="全部" :value="0"></el-option>
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 暂时不做 -->
                        <!-- <el-form-item label="课程" filterable>
                            <el-select v-model="searchForm.courseId" filterable 
                             :disabled="searchForm.majorId==''" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item> -->
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <!-- <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask">新增</el-button>
            <el-button size="mini" @click="batchDeleRow" v-if="btnPerObj.delBatch">批量删除</el-button>
            <el-button size="mini" type="primary" @click="oneTouch" v-if="btnPerObj.onestep">一键生成</el-button>
        </div> -->
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                v-loading="tableLoading"
                element-loading-text="加载中..."
                header-row-class-name="cm-dark"
                @selection-change="onSelectionChange">
                <el-table-column type="index"  label="序号" ></el-table-column>
                <!-- <el-table-column type="selection"></el-table-column> -->
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.label=='教学任务'">
                            <el-button @click="seeTableDetail(scope.row)" type="text" size="small">详情</el-button>
                        </template>
                        <template v-if="item.prop=='autoSchedule'">
                             <span v-if="scope.row.autoSchedule==true">自动排课</span>
                             <span v-if="scope.row.autoSchedule==false">手动排课</span>
                        </template>
                        <template v-else-if="item.prop=='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else-if="item.prop=='total_class'">
                            <el-button @click="onClass(scope.row)" type="text" size="small">
                                {{ scope.row.total_class}}
                            </el-button>
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <!--<el-button @click="editGrade(scope.row)" type="text" size="small">编辑</el-button>-->
                        <!-- <el-button @click="delTableRow(scope.$index,scope.row)" type="text" size="small" style="color: red;">删除</el-button> -->
                        <el-button @click="handleOpenDialog(scope.$index,scope.row)" type="text" size="small">自动排课设置</el-button>
                    </template>
                </el-table-column>
            </el-table>
                  <!-- 详情 -->
        <el-dialog
            width="900px"
            title="详情"
            :visible.sync="detailsDialog"
            :close-on-click-modal="false"
            :modal-append-to-body="false">
            
            <div class="cm-addGrade">
                <div class="cm-table">
                    <el-table
                        ref="multipleTable"
                        :data="taskDetails"
                        border
                        style="width: 100%"
                        header-row-class-name="cm-dark">
                        <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                        <el-table-column prop="semester_name" label="学期"></el-table-column>
                        <el-table-column prop="grade" label="所在级别"></el-table-column>
                        <el-table-column prop="major" label="专业"></el-table-column>
                        <el-table-column prop="course_name" label="课程"></el-table-column>
                        <el-table-column prop="semester_theory_hours" label="学期学时理论/实践"></el-table-column>
                        <el-table-column prop="semester_novitiate_hours" label="剩余学时理论/实践"></el-table-column>

                        <!-- <el-table-column v-for="(item,index) in editTableList" :key='index' :prop="item.prop" :label="item.label">
                        </el-table-column> -->
                </el-table>
            </div>
        </div>
            <span slot="footer" class="dialog-footer">
                <template v-if="dialog.status=='edit'?true:false">
                    <el-button @click="detailsDialog=false">取 消</el-button>
                    <el-button type="primary" @click="confirmEditGrade">确 定</el-button>
                </template>
                <el-button v-else size="medium" type="primary" @click="detailsDialog=false">关 闭</el-button>
            </span>
        </el-dialog>
        </div>
        <div class="cm-pagination">
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
        <!-- 详情及编辑 -->
        <el-dialog
            width="900px"
            title="排课课程限制"
            :visible.sync="dialog.editvisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            @close="getNewData"
            custom-class="arrange-setting-dialog">
            <el-form :inline="true" ref="editForm" :model="editForm" label-width="100px">
                <div class="">
                    <el-form-item label="是否自动排课">
                        <el-select v-model="editForm.isAuto" placeholder="请选择">
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="课程优先级" v-if="editForm.isAuto==1">
                    <el-select v-model="editForm.priority" placeholder="请选择">
                        <el-option label="高" :value="1"></el-option>
                        <el-option label="中" :value="2"></el-option>
                        <el-option label="低" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <div class="inline" style="display: inline-block;"  v-if="editForm.isAuto==1">
                    <span>排课周次从第</span>
                    <el-form-item label="">
                        <el-input class="week-input" v-model.numbere="editForm.startWeek" placeholder=""></el-input>
                    </el-form-item>
                    <span>~</span>
                    <el-form-item label="">
                        <el-input class="week-input" v-model.numbere="editForm.endWeek" placeholder=""></el-input>
                    </el-form-item>
                    <span>周</span>
                </div>
            </el-form>
            <div class="table-box cm-table"  v-if="editForm.isAuto==1">
                <div class="table-item">
                    <p class="clear">不排课时间及课节设置 <el-button size="mini" class="right" :disabled="ctrl.button1" @click="addItem('notArrangeTableList', 'notArrangeTableData', 'button1')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="notArrangeTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in notArrangeTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>

                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="" @change="changeName($event, 'notArrangeTableList', 'notArrangeTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}
                                </template>                          
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('notArrangeTableList', 'notArrangeTableData', scope.row, scope.$index, 'button1')">保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('notArrangeTableList', 'notArrangeTableData', scope.row, scope.$index, 'button1')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('notArrangeTableList', 'notArrangeTableData', scope.row, scope.$index, 'button1')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('notArrangeTableList', 'notArrangeTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="table-box cm-table "  v-if="editForm.isAuto==1">
                <div class="table-item">
                    <p class="clear">优先安排时间及课节设置 <el-button size="mini" class="right" :disabled="ctrl.button2" @click="addItem('priorityTableList', 'priorityTableData', 'button2')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="priorityTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in priorityTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>
                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="" @change="changeName($event, 'priorityTableList', 'priorityTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select> 
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}                             
                                </template>                          
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('priorityTableList', 'priorityTableData', scope.row, scope.$index,'button2')">保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('priorityTableList', 'priorityTableData', scope.row, scope.$index, 'button2')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('priorityTableList', 'priorityTableData', scope.row, scope.$index, 'button2')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('priorityTableList', 'priorityTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="table-box cm-table"  v-if="editForm.isAuto==1">
                <div class="table-item">
                    <p class="clear">优先安排场地设置 <el-button size="mini" class="right" :disabled="ctrl.button3" @click="addItem('priorityPlaceTableList', 'priorityPlaceTableData', 'button3')">新增</el-button></p>
                    <el-table
                        border
                        size="mini"
                        :data="priorityPlaceTableData"
                        header-row-class-name="cm-dark">
                        <el-table-column v-for="col in priorityPlaceTableList"
                            :prop="col.prop"
                            :key="col.id"
                            :label="col.label">
                            <template slot-scope="scope">
                                <!-- :disabled="col.prop == 'building' || col.prop == 'placeName'" -->
                                <template v-if="scope.row.editing">
                                    <el-input size="mini" v-model="scope.row[col.prop]" v-if="col.inputType === 'input'" placeholder=""></el-input>
                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="请选择" @change="changeName($event, 'priorityPlaceTableList', 'priorityPlaceTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name ? item.name : item.cnName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                                <template v-else>
                                    {{scope.row[col.prop]}}
                                </template>                          
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="teachingForm" label="授课形式">  
                        </el-table-column>
                        <el-table-column prop="campus" label="校区"></el-table-column>
                        <el-table-column prop="placeType" label="场地类型"></el-table-column>
                        <el-table-column prop="building" label="楼栋">
                            <template v-if="scope.row.editing">
                                <template v-if="scope.row.editing">
                                    <el-select size="mini" v-model="scope.row[col.selectIdProp]" :multiple="col.multiple" v-if="col.inputType === 'select'" placeholder="请选择" @change="changeName($event, 'priorityPlaceTableList', 'priorityPlaceTableData', scope.$index, col.selectListProp, col.prop)">
                                        <el-option v-for="item in col.selectListProp"
                                            :key="item.id"
                                            :label="item.name ? item.name : item.cnName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="placeName" label="场地名称"></el-table-column> -->
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <template v-if="scope.row.editing">
                                    <el-button size="mini" type="text" @click="handleSaveItem('priorityPlaceTableList', 'priorityPlaceTableData', scope.row, scope.$index, 'button3')">保存</el-button>
                                    <el-button size="mini" type="text" @click="handleCancel('priorityPlaceTableList', 'priorityPlaceTableData', scope.row, scope.$index, 'button3')">取消</el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="text" @click="handleEdit('priorityPlaceTableList', 'priorityPlaceTableData', scope.row, scope.$index, 'button3')">编辑</el-button>
                                    <el-button size="mini" type="text" @click="handleDelete('priorityPlaceTableList', 'priorityPlaceTableData', scope.row, scope.$index)">删除</el-button>
                                </template>
                            </template>
                        </el-table-column>
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
        <!-- 上课班详情 -->
        <el-dialog
            width="900px"
            title="上课班信息"
            :visible.sync="dialog.classVisible"
            :close-on-click-modal="false"
            :modal-append-to-body="false">
            <div class="cm-table">
                <el-table
                    ref="classTable"
                    :data="classData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                    <el-table-column type="index" label="序号" width="60px"></el-table-column>
                    <el-table-column v-for="(item,index) in classList" :key='index' :prop="item.prop" :label="item.label">
                        <template slot-scope="scope">
                            <template v-if="item.prop=='teaching_mode'">
                                {{scope.row.teaching_mode==0 ? "普通教学" : "全英教学"}}
                            </template>
                            <template v-else>
                                {{scope.row[item.prop]}}
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.classVisible=false">取 消</el-button>
                <el-button type="primary" @click="dialog.classVisible=false">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util';
    const regNum = /^[\d\/]+$/;//匹配数字跟斜杠

    import {mapState} from 'vuex';

    export default {
        data(){
            var weekDay = [
                {id:1, name: '星期一'},
                {id:2, name: '星期二'},
                {id:3, name: '星期三'},
                {id:4, name: '星期四'},
                {id:5, name: '星期五'},
                {id:6, name: '星期六'},
                {id:7, name: '星期日'}
            ]
            var validateTime = (rule, value, callback) => {
                if(!value){
                    callback(new Error("输入不能为空"));
                    return;
                }
                if(!regNum.test(value)){
                    callback(new Error("请输入9位以内整数"));
                    return;
                }
            };
            return {
                   param:{
                    cnName:'',
                    universityCode:'',
                },
                schooeID:"",
                breadcrumb: [
                    {label: "自动排课"},
                    {label: "课程约束设置"},
                ],
                 detailsDialog:false,//详情弹窗
                  taskDetails:[],//详情列表
                dialog:{
                    status:'edit',
                    editvisible:false,
                    visible:false,
                    detailvisible:false,
                    gradeVisible:false,
                    classVisible:false
                },
                searchForm: {
                    grade:"",
                    majorId:0,
                    plan:"",
                    courseId:""
                },
                addForm:{
                    addYear:"",
                    grade:"",
                    courseId:"",
                    name:"",
                    hours:""
                },
                editForm:{
                    // plan:"",
                    // hours:""
                    isAuto: 1,
                    priority: '',
                    startWeek: '',
                    endWeek: ''
                },
                gradeForm:{
                    grade:"",
                    courseId:""
                },
                rules:{
                    name:[{required: true, message: '请输入排课课程', trigger: 'blur'}],
                    hours:[{required: true, message: '请输入学时', trigger: 'blur'},
                    { validator: validateTime, trigger:  "change"}]
                },
                tableList:[
                    {label:'学期', prop:'semester_name',width:160},
                    {label:'所在级', prop:'grade',},
                    {label:'排课课程', prop:'course_arrange',width:200},
                    {label:'学期学时理论/实践', prop:'arranged_hours',width:200},
                    {label:'教学任务', prop:'date',},
                    {label:'排课标识', prop:'autoSchedule',},
                ],
                addtableList:[
                    {label:'专业', prop:'major',},
                    {label:'课程名称', prop:'course_name',},
                    {label:'本学期学时理论/实践', prop:'semester_hours',},
                    {label:'剩余学时理论/实践', prop:'surplus_hours',},
                ],
                editTableList:[
                    {label:'学期', prop:'semester_name'},
                    {label:'所在级', prop:'grade'},
                    {label:'专业', prop:'major'},
                    {label:'课程', prop:'course_name'},
                    {label:'学期学时理论/实践', prop:'semester_hours'},
                    {label:'剩余学时理论/实践', prop:'surplus_hours'}
                ],
                onTouchList:[
                    {label:'所在级', prop:'grade'},
                    {label:'专业', prop:'major'},
                    {label:'课程名称', prop:'course_name'},
                    {label:'本学期学时理论/实践', prop:'semester_hours'},
                    {label:'剩余学时理论/实践', prop:'surplus_hours'}
                ],
                classList:[
                    {label:'排课课程', prop:'course_arrange'},
                    {label:'上课班', prop:'name'},
                    {label:'教学模式', prop:'teaching_mode'},
                    // {label:'上课组', prop:'surplus_hours'}
                ],
                lessonList:[],
                classData:[],
                tableData:[],
                addtableData:[],
                gradetableData:[],
                taskDetails:[],
                onTouchData:[],
                formYear:"",
                onKeyYear:"",
                options1:[],
                majorList:[],
                taskList:[],
                courseList:[],
                arrangCourseList:[],
                onSelectionChangeVal:[],
                myDate:new Date(),
                tableLoading:false,
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                tableediting_one:null,
                tableediting_two:null,
                tableediting_three:null,
                // tableediting_one==true||tableediting_two==true||tableediting_three==true
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                
                userId:util.getStorage('loginId'),
                userName:util.getStorage('loginName'),
                btnPerObj:{//按钮权限
                  query:false,
                  add:false,
                  delBatch:false,
                  onestep:false
                },
                notArrangeTableList:[
                    {label: '开始周', prop: "startWeek", inputType: 'input'},
                    {label: '结束周', prop: "endWeek", inputType: 'input'},
                    {label: '星期', prop: "weekDay", inputType: 'select', selectIdProp: 'weekDayIds', selectListProp: weekDay, selectLabelName:'name', multiple: true},
                    {label: '课节', prop: "lessons", inputType: 'select', selectIdProp: 'lessonsId', selectListProp: [], selectLabelName:'name', multiple: true}
                ],
                notArrangeTableData: [
                    // {startWeek: '3', endWeek:'5', weekDayIds:[1,2], weekDay:'星期一、星期二', lessonsId:[77, 78], lessons:'5、6'}
                ],
                priorityTableList: [
                    {label: '开始周', prop: "startWeek", inputType: 'input'},
                    {label: '结束周', prop: "endWeek", inputType: 'input'},
                    {label: '星期', prop: "weekDay", inputType: 'select', selectIdProp: 'weekDayIds', selectListProp: weekDay, selectLabelName:'name', multiple: true},
                    {label: '课节', prop: "lessons", inputType: 'select', selectIdProp: 'lessonsId', selectListProp: [], multiple: true}
                ],
                priorityTableData: [],
                priorityPlaceTableList: [
                    {label: '授课形式', prop: "teachingForm", inputType: 'select', selectIdProp: 'teachingFormId', selectListProp: []},
                    {label: '校区', prop: "campus", inputType: 'select', selectIdProp: 'campusId', selectListProp: []},
                    {label: '场地类型', prop: "placeType", inputType: 'select', selectIdProp: 'placeTypeId', selectListProp: []},
                    {label: '楼栋', prop: "building", inputType: 'select', selectIdProp: 'buildingId', selectListProp: []},
                    {label: '场地名称', prop: "placeName", inputType: 'select', selectIdProp: 'placeId', selectListProp: [], selectLabelName:'name'}
                ],
                priorityPlaceTableData: [
                    // {teachingForm: '', teachingFormId:"" , campus:'', campusId:"", placeType:'', building:'', placeId: "", placeName: ""},
                ],
                editArr: {},
                teachingFormList: [],
                selectCampusId: '',
                selectBuildingId: '',
                ctrl:{
                    button1: false,
                    button2: false,
                    button3: false
                },
                tableId:"",//表格id
            }
        },
        created(){
            this.getTermData();
            this.getMajorList();
            this.getArrangeCourse();
            this.getTeachType();
            this.getLessonList();
            // this.getCampus();
            this.getSiteType();
            this.getSchoolId();
            // this.getArea();
        },
        computed:{
            ...mapState(['btnPermitList']),
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            // 
            util.openBtnPermit(this.btnPerObj);
        //  this.getBtnPermit();//按钮权限
        },
        filters:{
            getTime(time){
                return util.getTime(time);
            }
        },
        methods:{
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                       if (item.code=="query_paikexueqikechengku") {  //查询
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="add_paikexueqikechengku") {  //新增任务
                        self.btnPerObj.add=true;
                        }
                        if (item.code=="del_batch_paikexueqikechengku") {  //批量删除
                        self.btnPerObj.delBatch=true;
                        }
                        if (item.code=="onestep_build_paikexueqikechengku") {  //一键生成
                        self.btnPerObj.onestep=true;
                        }
                
                    });
                }).catch(()=>{
                })
            },
            // 清空数据 关闭窗口，清空数据
            getNewData(){
                this.editForm.isAuto=1,
                this.editForm.priority="",
                this.editForm.startWeek="",
                this.editForm.endWeek="",
                this.notArrangeTableData=[],
                this.priorityTableData=[],
                this.priorityPlaceTableData=[];
                for (let key in this.ctrl) {
                    this.ctrl[key] = false;
                }
            },
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableList();
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableList();
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            onYearChange(val){
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum;
                        }
                    } 
                }else{
                    this.fallYear = "";
                    this.semesterNum = "";
                }
              this.searchForm.plan = "";
              this.getArrangeCourse(); 
            },
            onMajorChange(val){
                if(val){
                    this.searchForm.courseId = "";
                    this.getCourseList();
                }
            },
            onAddYear(val){
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
                            this.addfallYear = list.year;
                            this.addsemesterNum = list.orderNum;
                        }
                    }
                }else{
                    this.addfallYear = "";
                    this.addsemesterNum = "";
                }
                this.getTaskData();
            },
            onSearch(){
                this.getTableList(); 
            },
            onClass(row){
                this.dialog.classVisible = true;
                this.$http.get("_ed:/coursecls/list/semcourseid/"+row.id)
                .then(data=>{
                    if(data.code==0){
                        this.classData = data.data;
                        for(let list of this.classData){
                            this.$set(list,"course_arrange",row.course_arrange);
                        }

                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            addTask(){
                this.getTaskData();
                this.dialog.visible = true;
            },
            dialogClose(){
                this.addtableData = [];
                this.dialog.visible = false;
                this.$refs.addForm.resetFields();
            },
            editGrade(row){
                this.dialog.status='edit';
                this.dialog.editvisible=true;
                this.editForm.plan = row.course_arrange;
                this.editForm.hours = row.arranged_hours;
                this.semester = row.semester_name;
                this.getTableDetail(row.id);
            },
            // 排课课程限制弹窗新增表格行按钮 ----- edit in table
            addItem (tableList, tableData, ctrlButton){
                this.ctrl[ctrlButton] = true; // 控制新增按钮
                let editItem = {
                    editing: true,
                    id: ''
                }
                for (let key of this[tableList]) {
                   
                    editItem[key.prop] = '';
                    editItem[key.selectIdProp] = ''; // new 循环
                }
                if (editItem.undefined) {
                    delete editItem.undefined;    
                }
                
                this[tableData].unshift(editItem);
            },
            /**
             * [changeName 根据选中的值更改表格中当前行的对应的名称显示]
             * @param  {[type]} data      [当前选中的id值]
             * @param  {[Array]} tableList [各个表格的列属性数组]
             * @param  {[Array]} tableData [当前表格]
             * @param  {[number]} index     [当前表格行]
             * @param  {[type]} arr       [选中的下拉菜单数组]
             * @param  {[type]} prop      [名称属性]
             */
            changeName (data, tableList, tableData, index, arr, prop){
                let name;

                if (Array.isArray(data)) { // 多选下拉
                    let tempArr = [];
                    data.map(item => {
                        for (var i = 0; i < arr.length; i++) {
                            if (item == arr[i].id) {
                                tempArr.push(arr[i].name || arr[i].cnName);
                            }
                        }
                    })
                    name = tempArr.join('、');
                } else { // 单选下拉
                    arr.map(item => {
                        if (item.id === data) {
                            name = item.name || item.cnName;
                        }
                    })
                }
              
                if (prop === 'campus') {
                    this.selectCampusId = data;
                    // this.priorityPlaceTableList[3].selectListProp = [];
                    this.priorityPlaceTableList[4].selectListProp = [];
                    this.getbuilding(data,index);
                }
                if (prop === 'building') {
                    this.selectBuildingId = data;
                }

                if (this.selectCampusId && this.selectBuildingId) {
                    this.getfield();
                }
                this.$set(this[tableData][index], prop, name);
            },
            // (弹窗)保存编辑
            handleSaveItem (tableList, tableData, row, index, ctrlButton){
                if (row.teachingFormName === '' || row.groupNum === '') {
                    this.$message.error('新增保存不能为空');
                    return false;
                }
                if (tableData === 'notArrangeTableData') {
                    if (!this.validate('priorityTableData', tableData, 'startWeek', 'endWeek', index)) {
                        return false;
                    }
                    
                } else if(tableData === 'priorityTableData'){
                    if (!this.validate('notArrangeTableData', tableData, 'startWeek', 'endWeek', index)) {
                        return false;    
                    }
                }
                // if (tableList === 'notArrangeTableList' || tableList === 'priorityTableList') {
                //     if (row.startWeek === '' || row.endWeek === '' || row.lessonsId.length < 1 || row.weekDayIds.length < 1) {
                //         this.$message.error('新增或者编辑保存不能为空');
                //         return false;
                //     }
                  
                // } else if (tableList === 'priorityPlaceTableList') {
                //     if (row.teachingForm === '' || row.campus === '' || row.building === '' || row.placeType === '' || row.placeName === '') {
                //         this.$message.error('新增或者编辑保存不能为空');
                //         return false;
                //     }
                // }

                // this.editObj = null;
                this.editArr[`${tableList}Row`] = null;
                row.editing = false;
                this.$set(this[tableData], index, row);
                if (this.ctrl[ctrlButton] && index === 0) { // 控制新增按钮
                    this.ctrl[ctrlButton] = false;
                }
            },
            /**
             * [handleCancel 弹窗内编辑表格]
             * 取消有二种情况 ：
             * 1、如果是新增的 则直接删除；
             * 2、如果是原有的 则要取消编辑并保存原来的数据
             */
            handleCancel (tableList, tableData, row, index, ctrlButton){
                // this.editObj
                this.ctrl[ctrlButton] = false; // 2222222222
                if (this.editArr[`${tableList}Row`]) {
                    this.$set(this[tableData], index, this.editArr[`${tableList}Row`]);
                    this[tableData][index].editing = false;
                    // this.editObj = null;
                    this.editArr[`${tableList}Row`] = null;
                } else {
                    this.ctrl[ctrlButton] = false;
                    this[tableData].shift();
                }
            },
            // 新增/编辑弹窗编辑表格行 
            handleEdit (tableList, tableData, row, index, ctrlButton){
                if (this.ctrl[ctrlButton]) { // 2222222222
                    this.$message.warning('每条约束设置只能新增或编辑一条哦');
                    return ;
                }
                row.editing = true;
                this.ctrl[ctrlButton] = true; // 2222222222

                if (tableList === 'priorityPlaceTableList') {
                    this.selectCampusId = Number(this[tableData][index].campusId);
                    this.selectBuildingId = Number(this[tableData][index].buildingId);
                    // this.editObj = {...row};
                    this.getbuilding(this.selectCampusId,index);
                    this.getfield();
                }
                this.editArr[`${tableList}Row`] = {...row};
                this.$set(this[tableData], index, row);
            },
            // （弹窗）删除 ----- edit in table
            handleDelete (tableList, tableData, row, index){
                this[tableData].splice(index, 1);
            },
            confirmEditGrade(){
                //未保存不能提交，提示
                  let table1=this.notArrangeTableData;
                    for( var i=0; i<table1.length; i++){
                    if(table1[i].editing){  
                         this.$message({
                                message: '"请先保存[ 不排课时间及课节设置 ]再提交"',
                                type: 'warning'
                            });
                        return ;
                    }
                    }
                  let table2=this.priorityTableData;
                   for( var i=0; i<table2.length; i++){
                    if(table2[i].editing){  
                         this.$message({
                                message: '"请先保存[ 优先安排时间及课节设置 ]再提交"',
                                type: 'warning'
                            });
                        return ;
                    }
                    }
                  let table3=this.priorityPlaceTableData;
                  for( var i=0; i<table3.length; i++){
                    if(table3[i].editing){  
                         this.$message({
                                message: '"请先保存[ 优先安排场地设置 ]再提交"',
                                type: 'warning'
                            });
                        return ;
                    }
                  }
              
              
                  let AutoScheduleSetting ={
                      extend:{
                          automatic:this.editForm.isAuto,//是否自动排课
                          priority:this.editForm.priority, //课程优先级别
                          startWeek:this.editForm.startWeek,//开始周
                          endWeek:this.editForm.endWeek, //接受周
                          notArrangeTableData: this.notArrangeTableData, //table1,
                          priorityTableData:this.priorityTableData, //table2,
                          priorityPlaceTableData:this.priorityPlaceTableData,//table3,
                      },

                      semesterCourseId:this.tableId
                  }

                  this.$http.post("_ed:/semestercourse/auto/schedule/setting",AutoScheduleSetting).then(data=>{
                      if(data.code==0){
                        this.$message({
                        message: '自动排课设置成功',
                        type: 'success'
                        });
                         this.dialog.editvisible = false;
                        this.getTableList();
                      }else{
                           this.$message.error(data.msg);
                      }
                  })
            },
            onSelectionChange(val){
                this.onSelectionChangeVal = val;
            },
            oneTouch(){
                this.getKeyTableData();
                this.dialog.gradeVisible = true;
            },
            onKeyYearChange(val){
                if(val){
                    for(let list of this.options1){
                        if(list.id==val){
                            this.keyfallYear = list.year;
                            this.keysemesterNum = list.orderNum;
                        }
                    }
                }else{
                    this.keyfallYear = "";
                    this.keysemesterNum = "";
                }
                this.getKeyTableData();
            },
            getKeyTableData(){
                this.$http.post("_ed:/teachtask/toarrangecourses",{
                    semester_year:this.keyfallYear,
                    semester_year_number:this.keysemesterNum           
                }).then(data=>{
                    if(data.code==0){
                        this.onTouchData = data.data;
                        for(let item of this.onTouchData){
                            let surplus_theory_hours = item.semester_theory_hours - item.arranged_theory_hours;
                            let surplus_novitiate_hours = item.semester_novitiate_hours - item.arranged_novitiate_hours;

                            this.$set(item,'surplus_hours',`${surplus_theory_hours}/${surplus_novitiate_hours}`); 
                            this.$set(item,'semester_hours',`${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            seeTableDetail(row){
                this.getTableDetail(row.id);//请求详情列表数据
                // this.semester = row.semester_name;
                // this.dialog.status='detail';
                // this.dialog.editvisible = true;
                // this.getTableDetail(row.id);
                 this.dialog.status='detail';
                this.detailsDialog = true;
            },
            handleOpenDialog (index, row){
                if (row.extend) {
                    let extend = JSON.parse(row.extend);
              
                    this.priorityTableData = extend.priorityTableData;
                    this.notArrangeTableData = extend.notArrangeTableData;
                    this.priorityPlaceTableData = extend.priorityPlaceTableData;
                  
                    this.editForm.isAuto=extend.automatic;
                    this.editForm.priority=extend.priority;
                    this.editForm.endWeek=extend.endWeek;
                    this.editForm.startWeek=extend.startWeek;
                    
                }
                this.tableId=row.id
                // this.dialog.editvisible = true;
                this.tableDataDialog=row;
                this.dialogID=row.id;
                this.dialog.editvisible = true;
                //   this.getDialogData();//弹窗
            },
            getTableDetail(_id){
                this.$http.get("_ed:/semestercourse/detail/"+_id)
                .then(data=>{
                    if(data.code==0){
                       this.taskDetails =  data.data;
                    
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            closeDetail(){
                this.dialog.detailvisible = false;
            },
            teachingRemark(){
                this.dialog.remark = true;
            },
            delTableRow(index,row){
                this.$confirm(`此操作将永久删除“${row.course_arrange}”所维护的信息, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$http.delete("_ed:/semestercourse/delete/"+row.id)
                    .then(data=>{
                        let type = 'success';
                        let message = '删除成功!'
                        if(data.code==0){
                            if(this.tableData.length==1){
                                this.pageNo = 1;
                            }
                            this.getTableList();
                        }else{
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
            getMajorList(){
                this.$http.get("_op:/major/combox")
                .then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getArrangeCourse(){
                this.$http.post("_ed:/semestercourse/list/detail",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.arrangCourseList = data.data;
                        for(let list of this.arrangCourseList){
                            let majorName = '';
                            if(list.teachTaskCourseList){
                               for(let item of list.teachTaskCourseList){
                                    let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
                                    this.$set(item,"name",`${item.course_name}（${item.major}，${house}）`);
                                    this.$set(item,"courseId",list.id); 
                                    majorName += '+' + item.major;
                                    this.$set(list, 'major', majorName.substring(1));
                                } 
                            }   
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getTaskData(){
               this.$http.post("_ed:/teachtask/courselist",{
                    semester_year:this.addfallYear,
                    semester_year_number:this.addsemesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.taskList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getCourseList(){
                this.$http.get("_op:/coursePlatform/combox/"+this.searchForm.majorId)
                .then(data=>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getTableList(){
                this.tableLoading = true;
                this.$http.post("_ed:/semestercourse/query",{
                    id:this.searchForm.plan,
                    grade:this.searchForm.grade,
                    major_id:this.searchForm.majorId,
                    // course_platform_id:this.searchForm.courseId,
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum,
                    request_page:this.pageNo,
                    page_size:this.pageSize
                }).then(data=>{
                    if(data.code==0){
                        this.tableLoading = false;
                        this.totalCount=data.data.total_records;
                        this.tableData = data.data.dataList;
                        for(let item of this.tableData){
                            this.$set(item,'arranged_hours',`${item.arranged_theory_hours}/${item.arranged_novitiate_hours}`);
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                }).catch((error)=>{
                    this.tableLoading = false;
                })
            },
            getTermData(query){
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                    
                          
                            for(let i=0;i<this.options1.length;i++){
                                    if(this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                            }

                        this.getTableList();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            // 授课形式
            getTeachType(){
                this.$http.get("_op:/teaching/form/combox")
                .then(data=>{
                    if(data.code==0){
                        this.teachingFormList = data.data;
                        this.priorityPlaceTableList[0].selectListProp = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            //获取课节
            getLessonList(){
                this.$http.get("_op:/sections/find").then(data=>{
                    if(data.code==0){
                        if(data.data){
                            // this.lessonList = data.data;
                            this.notArrangeTableList[3].selectListProp = data.data;
                            this.priorityTableList[3].selectListProp = data.data;
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },


            getSchoolId(){
                let params ={
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    param:this.param
                }
                this.$http.post("_op:university/list",params).then(data=>{
                    // console.log('获取学校iD', data.result[0].id)
                    this.schooeID=data.result[0].id;
                    this.getCampus(this.schooeID)

                })

            },
             // 获取校区11111
            getCampus(schooeID){
                let self = this
                // // let universityId=this.schooeID;
                // console.log('tag',schooeID)

                this.$http.get("_op:/campus/"+schooeID).then(data=>{
                    self.campusList= data.data;
                    this.priorityPlaceTableList[1].selectListProp = data.data || [];
               
                })
            },


            //获取楼栋222
            getbuilding(val,index){
                let campusId=val;
                this.$http.get("_op:/building/getByCampusId/"+campusId).then(data=>{
                    if(data.data&&data.data.length>0){
                        this.priorityPlaceTableData[index].disabled = false; 
                        this.buildingList = data.data;
                        this.priorityPlaceTableList[3].selectListProp = data.data;
                         // this.getSiteType();
                    }
                })
            },
            //获取场地类型333
            getSiteType(){
                let params ={
                    pageNo:1,
                    pageSize:100,
                    param:{
                        type: "place-category"
                    }
                }
               this.$http.post("_op:/dicts/list",params).then(data =>{
           
                   this.siteTypeList=data.result;
                   this.priorityPlaceTableList[2].selectListProp = data.result;
                   // this.getfield();
               })
            },
            //获取场地 名称
            getfield(){
                let params={
                    pageNo:1,
                    pageSize:100,
                      param: {
                        campusId: this.selectCampusId,
                        buildId: this.selectBuildingId//102,
                    }
                }
                this.$http.post("_op:/areas/list",params).then(data =>{
                  
                    this.priorityPlaceTableList[4].selectListProp = data.data.records;
                })
            },
            
             /**
             * [validate 根据属性校验一个数组设置的数字间隔不在另外一个数组的数字区间内]
             * @param  {[type]} arrA      [被校验的数组]
             * @param  {[type]} targetArr [需要校验的数组]
             * @param  {[type]} beginKey  [数组属性]
             * @param  {[type]} endKey    [数组属性]
             * @return {[type]}           [boolen]
             */
            validate (arrA, targetArr, beginKey, endKey, index) {
                let _this = this;

                if ((this[targetArr][index][beginKey] - this[targetArr][index][endKey]) > 0) {
                    this.$message.error('设置的初始值不能大于结束值');
                    return false;
                } else {
                    for (var i = 0; i < this[arrA].length; i++) {
                        if (this[arrA].length > 1 && i < (this[arrA].length - 1)) {
                            if (!this.coreCompare(this[arrA][i], this[arrA][i+1], 'startWeek', 'endWeek')) return false;
                        }
                        for (var j = 0; j < this[targetArr].length; j++) {
                            if (this[targetArr].length > 1 && j < (this[targetArr].length - 1)) {
                                if (!this.coreCompare(this[targetArr][j], this[targetArr][j+1], 'startWeek', 'endWeek')) return false;
                            }
                            if (!this.coreCompare(this[arrA][i], this[targetArr][j], 'startWeek', 'endWeek')) return false;
                           
                        }
                    }
                    if (this[arrA].length < 1) {
                        for (var j = 0; j < this[targetArr].length; j++) {
                            if (this[targetArr].length > 1 && j < (this[targetArr].length - 1)) {
                                if (!this.coreCompare(this[targetArr][j], this[targetArr][j+1], 'startWeek', 'endWeek')) return false;
                            }
                        }
                    }
                    return true;
                }
            },
            coreCompare (arr1, arr2, startProp, endProp){
                let com1A = arr2[startProp] - arr1[startProp];
                let com1B = arr2[endProp] - arr1[startProp];
                let com2A = arr2[startProp] - arr1[endProp];
                let com2B = arr2[endProp] - arr1[endProp];
              
                // if (!((com1A < 0 || com1B > 0) && (com2A < 0 || com2B > 0))) {
                if (!((com1A < 0 && com1B < 0) || (com2A > 0 && com2B > 0))) {
                    // 设置的区间已在已设置的区间值内  不成立
                    this.$message.error('【不排课时间及课节】、【优先安排时间及课节】设置的区间不能在已设置的区间值内')
                    return false;
                }

                return true;
            }
        }
    }
</script>
<style scoped lang="less">
    .cm-fold{
        .date-item{
            /deep/ .el-input__inner{
                width:150px;
            }
        }
    }
    .cm-addGrade p{
        margin-bottom: 12px;
    }
    .arrange-setting-dialog{
        .inline{
            margin-left: 50px;
            line-height: 40px;
        }
        .week-input{
            /deep/ .el-input__inner{
                margin:0 5px;
                width:50px;
                padding-left: 5px;
                padding-right: 5px;
            }
        }
        .table-item{
            p{
                margin: 20px 0 10px;
            }
        }
    }
</style>