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
                        <el-form-item label="校区">
                            <el-select 
                                v-model="searchForm.campusId"
                                clearable
                                filterable
                                @change="getBilidingListByArea($event, 'search')"
                                placeholder="请输入校区">
                                <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="楼栋">
                            <el-select
                                v-model="searchForm.buildingId"
                                clearable
                                filterable
                                @change="getAreaByBuildingFloor($event, ' ', 'search')"
                                placeholder="请输入楼栋">
                                <el-option v-for="item in buildingList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="场地">
                            <el-select 
                                v-model="searchForm.areaId"
                                filterable  
                                placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <!-- <template v-for="item in arrangCourseList">
                                    <el-option v-for="list in item.teachTaskCourseList" :key="list.id" :label="list.name" :value="list.courseId"></el-option>
                                </template> -->
                                <el-option v-for="list in areaList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="楼层">
                            <el-select 
                                v-model="searchForm.areaId"
                                filterable  
                                placeholder="全部">
                         
                                <el-option v-for="list in areaList" :key="list.id" :label="list.floor+`层`" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="日期">
                            <el-date-picker
                                v-model="date"
                                clearable
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="splitDate">
                            </el-date-picker>
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask">新增</el-button>
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
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="campusName" label="校区" width="160"></el-table-column>
                <el-table-column prop="buildingName" label="楼栋" width=""></el-table-column>
                <el-table-column prop="floor" label="楼层" width=""></el-table-column>
                <el-table-column prop="areaName" label="场地名称" width="160"></el-table-column>
                <el-table-column prop="extend.beginDate" label="开始时间" width=""></el-table-column>
                <el-table-column prop="extend.endDate" label="结束时间" width=""></el-table-column>
                <el-table-column prop="extend.weeks" label="星期" :formatter="arrToStr" width=""></el-table-column>
                <el-table-column prop="extend.session" label="课节" :formatter="arrToStr2" width=""></el-table-column>
                
                <!-- <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop==='startTime'">
                            {{scope.row.durationDate[0]}}
                        </template>
                        <template v-else-if="item.prop==='endTime'">
                            {{scope.row.durationDate[1]}}
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editNotArrange(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="delTableRow(scope.$index,scope.row)" type="text" size="small" style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo+1"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增不可排课场地 -->
        <el-dialog
            width="400px"
            :title="dialog.status === 'add' ? '新增':'编辑'"
            :visible.sync="dialog.visible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            custom-class="add-not-arrange-place"
            @closed="dialogClose">
            {{addForm.campusId}}
            <el-form :inline="true" :model="addForm" :rules="rules" ref="addForm" :label-width="labelWidth">
                <el-form-item label="校区" prop="campusId">
                    <el-select 
                        v-model="addForm.campusId"
                        clearable 
                        filterable 
                        placeholder="请输入校区"
                        @change="handleDialogSelect($event, 1, 'created')">
                        <el-option v-for="item in campusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
          {{addForm.buildingId}}
                <el-form-item label="楼栋" prop="buildingId">
                     <!-- :disabled="disabledObj.buildiingDisabled" -->
                    <el-select 
                        v-model="addForm.buildingId"
                        clearable
                        filterable
                        :disabled="disabledObj.buildiingDisabled"
                        placeholder="请输入楼栋"
                        @change="handleDialogSelect($event, 2, 'created')">
                        <el-option v-for="item in dialogBuildingList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="floor-input" label="楼层" prop="floor">
                    
                    <!-- :disabled="disabledObj.floorDisabled" -->
                    <el-input v-model="addForm.floor" :disabled="disabledObj.buildiingDisabled" @change="handlePlaceChange($event, 3, 'created')" placeholder="请输入楼层"></el-input>
                </el-form-item>
                {{addForm.areaId}}
                <el-form-item label="场地名称" prop="placeName">
                    <!-- :disabled="disabledObj.placeNameDisabled" -->
                    <el-select 
                        v-model="addForm.areaId"
                        clearable
                        filterable 
                        @change="handleDialogSelect($event, 4, 'created')"
                        placeholder="请输入场地名称">
                        <el-option v-for="item in dialogAreaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起止日期" class="date-box" prop="durationDate">
                    <el-date-picker
                        v-model="addForm.durationDate"
                        clearable
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="星期" prop="extend.weeks">
                    <el-select 
                        v-model="addForm.extend.weeks"
                        multiple
                        clearable
                        filterable 
                        placeholder="请选择星期">
                        <el-option v-for="item in weeksList" :key="item.id" :label="item.day" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课节" prop="extend.session">
                    <el-select 
                        v-model="addForm.extend.session"
                        multiple
                        clearable
                        filterable 
                        placeholder="请输入课节名称">
                        <el-option v-for="item in lessonList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd('addForm', dialog.status === 'add' ? 'add':'patch')">确 定</el-button>
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
                breadcrumb: [
                    {label: "自动排课"},
                    {label: "场地不可排设置"},
                ],
                autoapi60: process.env.NODE_ENV === 'development' ? 'http://192.168.5.175:8060' : '',
                dialog:{
                    status:'add',
                    visible:false
                },
                date: [],
                searchForm: {
                    campusId:'',
                    buildingId:'',
                    areaId:'',
                    floor:'',
                    // date:'',
                    beginDate: '',
                    endDate: ''
                    
                },
                campusList: [], // 校区下拉列表
                buildingList: [],
                dialogBuildingList: [],
                areaList: [],
                dialogAreaList: [],
                addForm:{
                    campusId: '',
                    areaId: '',
                    areaName: '',
                    buildingId: '',
                    buildingName: '',
                    floor: '',
                    durationDate:[],
                    extend:{
                        weeks:[],
                        session: [],
                        beginDate: '',
                        endDate: '',
                        weeksCn:'',
                        sessionName: ''
                    },
                    // properties: {},
                    universityId: 0,
                    // wasDeleted: 0
                },
                rules:{
                    // name:[{required: true, message: '请输入排课课程', trigger: 'blur'}],
                    // hours:[{required: true, message: '请输入学时', trigger: 'blur'},
                    // { validator: validateTime, trigger:  "change"}]
                    campusId: [
                        {required: true, message: '请输入排课课程', trigger: 'blur'}
                    ],
                    buildingId: [
                        {required: false, message: '请选择楼栋', trigger: 'blur'}
                    ],
                    placeName: [
                        {required: false, message: '请选择场地', trigger: 'blur'}
                    ],
                    floor: [
                        {required: false, message: '请选择楼层', trigger: 'blur'}
                    ],
                    durationDate: [
                        {required: false, message: '请选择起止日期', trigger: 'blur'}
                    ],
                    weeks: [
                        {required: false, message: '请输入星期', trigger: 'blur'}
                    ],
                    lessonsId:  [
                        {required: false, message: '请选择课节', trigger: 'blur'}
                    ]
                },
                disabledObj: {
                    buildiingDisabled: true,
                    floorDisabled: true,
                    placeNameDisabled: true,
                },
                labelWidth: '100px',
                weeksList: [
                    {id:1, day:'星期一'},
                    {id:2, day:'星期二'},
                    {id:3, day:'星期三'},
                    {id:4, day:'星期四'},
                    {id:5, day:'星期五'},
                    {id:6, day:'星期六'},
                    {id:7, day:'星期日'}
                ], // 星期列表
                lessonList: [], // 课节
                tableList:[
                    {label:'校区', prop:'campusName',width:160},
                    {label:'楼栋', prop:'buildingName'},
                    {label:'楼层', prop:'floor'},
                    {label:'场地名称', prop:'areaName',width:200},
                    {label:'开始时间', prop:'extend.beginDate'},
                    {label:'结束时间', prop:'extend.endDate'},
                    {label:'星期', prop:'extend.weeks'},
                    {label:'课节', prop:'extend.session'}
                ],
                classData:[],
                tableData:[
                // startTime:'2018-09-01', endTime:'2018-09-08',
                    // {campusName:'新校区', campusId:1, buildingName:'新教学楼', buildingId:1, floor:'3', floor:1, areaName:'3', areaId:1, durationDate:['2018-09-01','2018-09-08'], week:'三、五', weeksId:[3,5], extend.session:'1、2', lessonsId:[1,2]}
                ],
                editTableData:[],
                gradeList:[
                    {label:"2014",value:"2014"},
                    {label:"2015",value:"2015"},
                    {label:"2016",value:"2016"},
                    {label:"2017",value:"2017"},
                    {label:"2018",value:"2018"},
                    {label:"2019",value:"2019"},
                    {label:"2020",value:"2020"},
                    {label:"2021",value:"2021"},
                    {label:"2022",value:"2022"},
                    {label:"2023",value:"2023"}
                ],
                options1:[],
                majorList:[],
                taskList:[],
                courseList:[],
                arrangCourseList:[],
                myDate:new Date(),
                tableLoading:false,
                pageNo: 0,
                pageSize: 10,
                totalCount:0,
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
                }
            }
        },
        created(){
            this.getArrangeCourse();
            this.getLessonList();
            // this.getArea();
            this.getTableList();
          
            this.getSchoolId();
        
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
//          this.getBtnPermit();
        },
        filters:{
            getTime(time){
                return util.getTime(time);
            }
        },
        methods:{
            splitDate (){
                if (this.data && this.date.length > 0) {
                    this.searchForm.beginDate = date[0];
                    this.searchForm.endDate = date[1];
                } else {
                    this.searchForm.beginDate = '';
                    this.searchForm.endDate = '';
                }
            },
            handleDialogSelect (val, cur, type){
                console.log('3444', val, cur, type)
                
                if (cur === 1) {
                    let obj = this.campusList.find(item => {
                        return item.id == val
                    })
                    this.addForm.campusName = obj.name;
                    this.handlePlaceChange(val, cur, type)
                } else if (cur === 2){
                    let obj = this.dialogBuildingList.find(item => {
                        return item.id == val
                    })
                    this.addForm.buildingName = obj.name;
                    this.handlePlaceChange(val, cur, type)
                } else if (cur === 4) {
                    console.log('777777', this.dialogAreaList)
                    let obj = this.dialogAreaList.find(item => {
                        return item.id == val
                        
                    })
                   console.log('33333', obj)
                    // console.log('ta22g',  item.id)
                    // this.handlePlaceChange(val, cur, type)
                   console.log('1111111111111111111111111111111', obj)
                    this.addForm.areaName = obj.name;
                    this.getareainfo(obj.name)

                }
            },
            getTableList (){
                let params = {
                    pageIndex: this.pageNo,
                    pageSize: this.pageSize,
                    param: this.searchForm //{}
                }

                this.$http.post(`_as:/area/restraint/search`, params).then(res => {
                    this.tableData = res.result.data;
                    this.totalCount = res.result.total;
                    // this.tableData = res.result.data;
                })
            },
            sizeChange(size){
                this.pageNo = 0;
                this.pageSize = size;
                this.getTableList();
            },
            currentChange(current){
                this.pageNo=current-1;
                this.getTableList();
            },
            collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            },
            onSearch(){
                this.getTableList(); 
            },
            addTask(){
                this.getTaskData();
                // this.getArea();
                this.getCampusList(25);
                this.dialog.visible = true;
            },
            dialogClose(){
                for (let key in this.disabledObj) {
                    if (this.disabledObj.hasOwnProperty(key)) {
                        this.disabledObj[key] = true;
                    }
                }
                // 重置表单  
                for (let formKey in this.addForm) {
                    if (typeof this.addForm[formKey] === 'string' || typeof this.addForm[formKey] === 'number') {
                        this.addForm[formKey] = '';
                    } else if(Array.isArray(this.addForm[formKey])) {
                        this.addForm[formKey] = [];
                    } else {
                        for (let innerKey in this.addForm[formKey]) {
                            if (typeof this.addForm[formKey][innerKey] === 'string' || typeof this.addForm[formKey][innerKey] === 'number') {
                                this.addForm[formKey][innerKey] = '';
                            } else if(Array.isArray(this.addForm[formKey][innerKey])) {
                                this.addForm[formKey][innerKey] = [];
                            }
                        }
                    }
                }
            },
            handlePlaceChange (val, cur, type){
                // 选择校区
                if (this.addForm['campusId'] && cur == 1) {
                    this.$nextTick(() => {
                        this.disabledObj.buildiingDisabled = false;
                    })
                    // 需要往下一步下拉填数据
                    // this.addForm.buildingId = '';
                    this.addForm.floor = '';
                    this.addForm.areaId = '';
                    this.getBilidingListByArea(this.addForm.campusId, type);
                } else if (this.addForm['campusId'] == '' ) {
                    // this.addForm.campusId = '';
                    // this.addForm.buildingId = '';
                    // this.addForm.floor = '';
                    // this.addForm.areaId = '';

                    // if (this.dialog.status == 'add') {
                    //     for (let key in this.disabledObj) {
                    //         this.disabledObj[key] = true;
                    //     }
                    // }
                    for (let key in this.disabledObj) {
                        this.disabledObj[key] = true;
                    }
                }

                // 选择楼栋
                if (this.addForm['buildingId'] && cur == 2) {
                    this.$nextTick(() => {
                        this.disabledObj.floorDisabled = false;
                    })
                    this.addForm.floor = '';
                    this.addForm.areaId = '';
                    // 需要往下一步下拉填数据
                } else if (this.addForm['buildingId'] == '') {
                    // this.addForm.floor = '';
                    // this.addForm.areaId = '';

                    // for (let key in this.disabledObj) {
                    //     this.disabledObj[key] = true;
                    // }
                    this.disabledObj.floorDisabled = true;
                    this.disabledObj.placeNameDisabled = true;
                }

                if (this.addForm['floor'] && cur == 3) {
                    this.$nextTick(() => {
                        this.disabledObj.placeNameDisabled = false;
                    })
                    this.addForm.areaId = '';
                    this.getAreaByBuildingFloor(this.addForm['buildingId'], this.addForm['floor'], type)
                    // 需要往下一步下拉填数据
                } else if (this.addForm['floor'] == '') {
                    this.disabledObj.placeNameDisabled = true;
                }
            },
              // 新增或编辑操作按钮
            confirmAdd(formName, method){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addRequire(formName, method);
                    } else {
                        return false;
                    }
                });
            },
            // 新增或编辑提交
            addRequire(formName, method){
                console.log('1111111', this.addForm)
                let self=this
                this.addForm.buildingId=self.addForm.buildingId;
                let params = {...this.addForm};
                
                this.addForm.extend.beginDate = params.durationDate[0];
                this.addForm.extend.endDate = params.durationDate[1];
                // this.addForm.extend.session = this.addForm.lessonsId;
                // this.addForm.extend.weeks = this.addForm.weeksId;
                delete params.durationDate;
                if (this.dialog.status === 'add') {
                    delete params.id
                }
                // delete params.lessonsId;
                // delete params.weeksId;

                this.$http({
                    url: `_as:/area/restraint`,
                    method: 'PATCH',// method,
                    data: params 
                }).then(data=>{
                    let type = "success";
                    let message = this.dialog.status == 'add' ? '添加成功' : '编辑成功';
                    if(data.status==200){
                        this.dialog.visible = false;
                        this.addForm.campusId = '';
                        this.addForm.areaId = '';
                        this.addForm.areaName = '';
                        this.addForm.buildingId = '';
                        this.addForm.buildingName = '';
                        this.addForm.createTime = '';
                        this.addForm.createUserId = '';
                        this.addForm.floor = '';
                        this.addForm.lastUpdateUserId = '';
                        this.addForm.durationDate = [];
                        this.addForm.extend.weeks = [];
                        this.addForm.extend.session = [];
                        this.addForm.extend.beginDate = '';
                        this.addForm.extend.endDate = '';
                        this.addForm.extend.weeksCn = '';
                        this.addForm.extend.sessionName = '';
                        this.getTableList();
                    }else{
                        type = "error";
                        message = data.msg;
                    }
                    this.$message({
                        message:message,
                        type:type
                    })
                })
            },
            editNotArrange(row){
                console.log('8888888', row)
                // this.getArea();
                let dateArr = [];
                this.dialog.status='edit';
                this.dialog.visible=true;

                if (!row.extend.beginDate) {
                    dateArr[0] = ''
                } else if(!row.extend.endDate) {
                    dateArr[1] = ''
                } else {
                    dateArr.push(row.extend.beginDate);
                    dateArr.push(row.extend.endDate);
                }
                
                let newRow = {...row};
                this.addForm.durationDate = dateArr;
                this.addForm.extend = {...newRow.extend};
                this.addForm.campusId = newRow.campusId;
                this.addForm.campusName = newRow.campusName;
                this.addForm.buildingId = newRow.buildingId;
                this.addForm.buildingName = newRow.buildingName;
                this.addForm.floor = newRow.floor;
                this.addForm.areaId = newRow.areaId;
                this.addForm.areaName = newRow.areaName;
                this.addForm.id = newRow.id;
                this.getBilidingListByArea(row.campusId, 'created');
                this.getAreaByBuildingFloor(row.buildingId, row.floor, 'created');
                for (let key in this.disabledObj) {
                    this.disabledObj[key] = false;
                }
            },
          
            confirmOneTouch(){
                this.$http.post("_ed:/semestercourse/autogenerate",{
                    semester_year:this.keyfallYear,
                    semester_year_number:this.keysemesterNum,
                    create_user:this.userId,
                    create_username:this.userName             
                }).then(data=>{
                    let type = 'success';
                    let message = "一键生成成功！";
                    if(data.code==0){
                        this.dialog.gradeVisible = false;
                        this.getTableList();
                    }else{
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
            onAddSelectionChange(val){
                this.onAddSelectionChangeVal = val;
            },
            // getTableDetail(_id){
            //     this.$http.get("_ed:/semestercourse/detail/"+_id)
            //     .then(data=>{
            //         if(data.code==0){
            //            this.editTableData =  data.data;
            //            for(let item of this.editTableData){
            //                 let surplus_theory_hours = item.semester_theory_hours - item.arranged_theory_hours;
            //                 let surplus_novitiate_hours = item.semester_novitiate_hours - item.arranged_novitiate_hours;
            //                 this.$set(item,'semester_name',this.semester);
            //                 this.$set(item,'surplus_hours',`${surplus_theory_hours}/${surplus_novitiate_hours}`);
            //                 this.$set(item,'semester_hours',`${item.semester_theory_hours}/${item.semester_novitiate_hours}`);
            //            }
            //         }else{
            //             this.$message.error(data.msg);
            //         }
            //     })
            // },
            delTableRow(index,row){
                this.$confirm(`此操作将永久删除“${row.areaname}”所该场地信息, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    // this.$http.delete(`${this.autoapi60}/area/restraint/${row.id}`)
                    this.$http.delete(`_as:/area/restraint/${row.id}`)
                    .then(data=>{
                        let type = 'success';
                        let message = '删除成功!'
                        if(data.status==200){
                            if(this.tableData.length==1){
                                this.pageNo = 0;
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
            getArrangeCourse(){
                this.$http.post("_ed:/semestercourse/list/detail",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                }).then(data=>{
                    if(data.code==0){
                        this.arrangCourseList = data.data;
                        for(let list of this.arrangCourseList){
                            if(list.teachTaskCourseList){
                               for(let item of list.teachTaskCourseList){
                                    let house = `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;
                                    this.$set(item,"name",`${item.course_name}（${item.major}，${house}）`);
                                    this.$set(item,"courseId",list.id); 
                                } 
                            }   
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
                    // console.log('学校id', this.schooeID)
                    this.getCampusList(this.schooeID)

                })

            },
            // 根据学校id查校区
            getCampusList (schooeID){
                // let universityId = 20;
                // this.$http.get(`/autoapi/operation/data/admin/campus/${universityId}`).then(res => {
                this.$http.get(`_op:/campus/`+schooeID).then(res => {
                    // console.log('666', res.data)
                    this.campusList = res.data;
                })
            },
            // 根据校区ID获取楼栋列表
            getBilidingListByArea (campusId, type){
                this.$http.get(`_op:/building/getByCampusId/${campusId}`).then(res => {
                    if (type == 'search') {
                        if(res.data && res.data.length>0){
                            this.buildingList = res.data;
                        }
                    } else if (type == 'created'){
                        if(res.data && res.data.length>0){
                            this.dialogBuildingList = res.data;
                        }
                    }
                    
                })
            },
            // 根据校区和楼栋、楼层查场地
            getAreaByBuildingFloor (buildId, floor, type){
                // this.$http.post(`/autoapi/operation/data/admin/areas/list`, {
                this.$http.post(`_op:/areas/list`, {
                    pageNo: 1, 
                    pageSize: 100,
                    param: {
                        buildId: buildId,
                        floor: floor || ''  
                    }
                }).then(res => {
                    
                    if (type == 'search') {
                        this.areaList = res.data.records;
                    } else if (type == 'created'){
                        this.dialogAreaList = res.data.records;
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
            getLessonList(){//获取课节
                this.$http.get("_op:/sections/find").then(data=>{
                    if(data.code==0){
                        if(data.data){
                            this.lessonList = data.data;
                        }
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            transferName(row){
                let str = row.campusId;
            },
            arrToStr (row){
                let arr = row.extend.weeks;
                let nameArr = [];

                for (var j=0; j <arr.length; j++) {
                    for(var i=0; i<this.weeksList.length; i++) {
                        if (arr[j] == this.weeksList[i].id) {
                            nameArr.push(this.weeksList[i].day)
                        }
                    }
                }
                return nameArr.join(',')
            },
            arrToStr2 (row){
                let arr = row.extend.session; 
                let nameArr = [];
                for (var j=0; j <arr.length; j++) {
                    for(var i=0; i<this.lessonList.length; i++) {
                        if (arr[j] == this.lessonList[i].id) {
                            nameArr.push(this.lessonList[i].name)
                        }
                    }
                }  
                return nameArr.join(',')
            },
            //获取授课场地
            // getArea(str){
            //     // this.loading = true;
            //     // this.$http.post("_ed:/exchangecourse/query/area",{
            //     //         str:str
            //     // }).then(data=>{
            //     //         this.areaList=data.data;
            //     // }).catch(()=>{
            //     // })
            //     let self = this
            //     self.$http.get("_op:/areas/all").then(data=>{
            //         self.dialogAreaList = data.data
            //     }).catch(err=>{

            //     })
            // },
            //获取场地详情
            getareainfo(areaName){
                console.log('ta4444g', areaName)
                let self = this
                self.$http.get("_op:/areas/areaDetailsByName/"+areaName).then(data=>{
                    let obj = data.data[0];
                    console.log('tag', obj)
                    // self.addForm.campusId = obj.id;//楼栋
                    // self.addForm.buildingId =this.searchForm.buildingId
                    self.addForm.floor = obj.floor;
                    self.disabledObj.buildiingDisabled = false;
                    self.disabledObj.buildiingDisabled = false;
                }).catch(err=>{

                })
            }
        }
    }
</script>
<style scoped lang="less">
    .cm-addGrade p{
        margin-bottom: 12px;
    }
    .add-not-arrange-place{
        .date-box{
            .el-date-editor.el-range-editor{
                width:225px;
            }
        }
        .floor-input /deep/ .el-input .el-input__inner{
            width: 217px;
        }
    }
</style>