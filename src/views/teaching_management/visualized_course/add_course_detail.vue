<template>
    <section>
        <el-dialog
            title="录入课程表明细" 
            :visible.sync="courseDetailDiolog"  
            :before-close="handleClose"
            width="800px" 
            append-to-body
            top="10vh"
            :close-on-click-modal="false"
            class="course-detail"
            @submit.prevent="refuseSubmit">
            <div v-loading="loading">
                <el-form :model="detailForm" ref="detailForm" :rules="rules" :inline="true" size="mini" label-width="100px"
                    :disabled="status=='show'">
                    <el-row v-if="status!='show'">
                        <el-col :span="24">
                            <el-form-item label="课表：" prop="courseName">
                                <span>{{ detailForm.courseName }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="星期：" prop="week">
                                <!-- <span>{{ weekStr[+detailForm.week] }}&emsp;&emsp;第{{ detailForm.nodeStr }}节</span> -->
                                <el-select v-model="detailForm.week">
                                    <el-option v-for="item in circuit" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="课节：" prop="nodeID">
                                <el-select v-model="detailForm.nodeID" multiple style="width:324px;">
                                    <el-option v-for="item in sectionList" 
                                    :label="item.sectionNode" :value="item.section_nodeid"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="排课课程：" prop="chooseCourse">
                        <el-select v-model="detailForm.chooseCourse" @change="queryReadyGroupName" filterable 
                        :disabled="disabled" class="content-width">
                            <el-option v-for="item in courseList" 
                            :label="item.course_arrange + '（' + item.majorNames + ' ' + item.arranged_theory_hours + '/' + item.arranged_novitiate_hours + ' ）'"
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="17">
                            <el-form-item label="周次：" prop="chooseWeek">
                                <div v-for="(item,index) in weekList" class="week-group">
                                    <div>
                                        <el-checkbox-group v-model="item.checkGroup" @change="chooseMore($event,index)">
                                            <el-checkbox v-for="week in item.week" :label="week" :key="week" :value="week"></el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <el-checkbox v-if="status!='show'" v-model="item.checkAll" @change="checkRow($event,item,index)">全选</el-checkbox>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <!-- <el-button @click="checkAll" type="primary" size="mini">全部选中</el-button> -->
                            <el-button v-show="course_week_start && course_week_end" 
                            @click="checkCourseWeek" type="primary" size="mini"
                            v-if="status!='show'">
                                {{ course_week_start }}-{{ course_week_end }} 周
                            </el-button>
                            <el-button @click="cancelAll" size="mini" v-if="status!='show'">全部取消</el-button>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="班级：" prop="classNameStr">
                        <p class="content-width">{{detailForm.classNameStr}}</p>
                    </el-form-item> -->
                    <el-form-item label="班级：" prop="classID">
                        <el-select v-model="detailForm.classID" multiple :disabled="disabled" style="width:640px;">
                            <el-option v-for="item in classList" 
                            :label="item.class" :value="item.admin_cls_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="授课形式：" prop="form">
                                <el-select v-model="detailForm.form" @change="queryReadyGroupName" :disabled="disabled">
                                    <el-option v-for="form in formList" :label="form.name" :key="form.id" :value="form.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <input-number v-model.trim="detailForm.group" :debounce="1000" :disabled="disabled" :min="1" size="mini" style="width:50px;margin-right:10px;"></input-number>组
                        </el-col>
                    </el-row>
                    <el-form-item label="组名：" prop="group">
                        <div class="content-width group">
                            <div>
                                <p v-for="(item,index) in groupList">
                                    {{ item.content }}
                                    <!-- <span v-if="item.group">&ensp;-&ensp;{{ item.group }}组</span> -->
                                </p>
                            </div>
                            <el-button @click="modifyGroup" style="margin-left:10px;" v-if="status!='show'">修改</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="场地：" prop="areas">
                        <div class="content-width place">
                            <el-table :data="detailForm.areas" border size="mini" :header-cell-style="{background:'#f5f7fa'}">
                                <el-table-column prop="area_name" label="场地名称"></el-table-column>
                                <el-table-column prop="group_num" label="安排组数" width="150">
                                    <template slot-scope="scope">
                                        <input-number v-model.trim="scope.row.group_num" :debounce="1000" :min="1" size="mini"></input-number>
                                    </template>
                                </el-table-column>
                        </el-table>
                        <el-button @click="showPlaceDialog" type="primary" style="margin-left:10px;" v-if="status!='show'">选择</el-button>
                        </div>
                        
                        <!-- <div class="content-width place">
                            <el-input v-model="detailForm.place" :disabled="true"></el-input>
                            <el-button @click="showPlaceDialog" type="primary" style="margin-left:10px;">选择</el-button>
                        </div> -->
                    </el-form-item>
                    <el-form-item label="备注说明：" prop="describe">
                        <el-input v-model.trim="detailForm.describe" :disabled="disabled" class="describe"></el-input>
                    </el-form-item>
                </el-form>
                <p style="text-align:right;padding:20px 0 50px;" v-if="status!='show'">
                    <el-button 
                    @click="submitRequest('detailForm')"
                    :disabled="notClick" type="primary" size="small">
                        {{notClick ? '正在保存' : '确 定'}}
                    </el-button>
                    <el-button @click="handleClose" size="small">取 消</el-button>
                </p>

                <!-- 冲突内容 -->
                <el-table v-if="clashList.length" :data="clashList.slice((currentPage - 1)*pagesize,currentPage*pagesize)" 
                border size="mini" :header-cell-style="{background:'#f5f7fa'}">
                    <el-table-column prop="type" label="冲突类型" width="100"></el-table-column>
                    <el-table-column prop="conflict" label="冲突说明"></el-table-column>
                </el-table>
                <p  v-if="clashList.length" style="text-align:right;padding:20px 0;">
                    <el-pagination small
                        layout="total, prev, pager, next"
                        @current-change="current_change"
                        :current-page.sync="currentPage"
                        :total="clashList.length">
                    </el-pagination>
                </p>
            </div>
        </el-dialog>

        <!-- 场地选择 -->
        <place-list v-if="showPlaceList"
        :showPlaceList.sync="showPlaceList"
        :checkedPlace="checkedPlaceList"
        :placeParams="placeParams"
        @placeMsg="checkedPlace">
        </place-list>

        <!-- 组名修改 -->
        <el-dialog 
        :visible.sync="showGroup" 
        title="组命名" 
        append-to-body 
        :close-on-click-modal="false"
        class="group-name" width="700px">
            <el-table :data="cloneGroupList" 
            size="mini" border 
            :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column label="组名" align="center">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.content" size="mini" width="100%"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <p style="text-align:right;padding:20px 0 50px;">
                <el-button @click="saveGroupName" type="primary" size="small">确 定</el-button>
                <el-button @click="showGroup=false" size="small">取 消</el-button>
            </p>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
import placeList from './place_list';
import inputNumber from '../children/input_number'

export default {
    components: {
        placeList,
        inputNumber
    },
    data(){
        return {
            loading: false,
            courseDetailDiolog: false,
            disabled: false,
            publish_status: '',
            circuit: [
                {label:'星期一', value: 1},
                {label:'星期二', value: 2},
                {label:'星期三', value: 3},
                {label:'星期四', value: 4},
                {label:'星期五', value: 5},
                {label:'星期六', value: 6},
                {label:'星期日', value: 7}
            ],
            weekStr: ['','一','二','三','四','五','六','日'],
            course_week_start: '',
            course_week_end: '',
            sectionList: [],
            notClick: false,
            status: 'add',
            pagesize: 10,//每页的数据条数
            currentPage:1,//默认开始页面
            // 表明细
            userid: '',
            year: '',
            semester: '',
            isShow: false,
            courseList: [],
            clashList: [],
            weekList: [],
            formList: [],
            //场地选择
            placeParams: {},
            showPlaceList: false,
            checkedPlaceList: [],
            // 组命名 
            showGroup: false,
            groupList: [],
            classList: [],
            className: [],
            cloneGroupList: [],
            _weekStr: [],
            detail_visual_id: '',
            paramsMSG: {},
            detailForm: {
                courseName: '',
                courseID: '',
                week: '',
                nodeStr: '',
                nodeID: [],
                chooseWeek: [],
                classNameStr: '',
                classID: [],
                chooseCourse: '',
                place: '',
                placeID: [],
                form: '',
                group: 1,
                describe: '',
                areas: []
            },
            rules: {
                courseName: [
                    { required: true, message: '请设置课表', trigger: 'change' }
                ],
                week: [
                    { required: true, message: '请选择星期', trigger: 'change' }
                ],
                nodeID: [
                    { required: true, message: '请选择课节', trigger: 'change' }
                ],
                chooseWeek: [
                    { required: true, message: '请选择周次', trigger: 'blur' }
                ],
                classID: [
                    { required: true, type: 'array', message: '请选择班级', trigger: 'change' }
                ],
                chooseCourse: [
                    { required: true, message: '请选择排课课程', trigger: 'change' }
                ],
                areas: [
                    { required: true, message: '请选择场地', trigger: 'blur' }
                ],
                form: [
                    { required: true, message: '请选择授课形式', trigger: 'change' }
                ],
                group: [
                    { required: true, message: '请设置分组', trigger: 'change' }
                ],
            }
        }
    },
    created(){
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userid = storage.me.attributes.login_info.id || '';
        }
    },
    watch: {
        'detailForm.group'(val){
            this.queryReadyGroupName()
        },
        'detailForm.classID'(val){
            this.queryReadyGroupName()
        },
    },
    mounted(){
        this.queryCurriculumSection();
    },
    methods: {
        refuseSubmit(){
            return false;
        },
        current_change(currentPage){
            this.currentPage = currentPage;
        },
        getParams(params){
            this.disabled = false;
            this.publish_status = '';
            this._weekStr = [];
            this.status = params.action;
            if(params.action == 'modify'){
                this.publish_status = params.publish_status;
                (this.publish_status == '2') && (this.disabled = true);
                this.queryDetail(params,'modify');
                this.detail_visual_id = params.detail_visual_id;
            }
            if(params.action == 'show'){
                this.queryDetail(params,'show');
                this.detail_visual_id = params.detail_visual_id;
            }
            if(params.action == 'copy'){
                this.paramsMSG = params;
                this.queryDetail(params,'copy');
                this.detail_visual_id = params.detail_visual_id;
            }
            if(params.action == 'add'){
                let paramsMsg = params;
                this.detailForm.classID = [];
                this.detailForm.courseName = paramsMsg.clsName;
                this.detailForm.courseID = paramsMsg.curriculumVisualId;
                this.detailForm.week = paramsMsg.selectedWeek;
                this.year = paramsMsg.year;
                this.semester = paramsMsg.semesterNum;

                let nodeName = [], nodeID = [];
                paramsMsg.selectedSections.map(item => {
                    nodeName.push(item.name);
                    nodeID.push(item.id);
                })
                this.detailForm.nodeStr = nodeName.toString();
                this.detailForm.nodeID = nodeID;

                let className = [];
                paramsMsg.selectedClasses.map(item => {
                    this.detailForm.classID.push(item.id);
                    className.push(item.name);
                })
                this.className = className;
                this.detailForm.classNameStr = className.toString();
                // this.queryCourseDetail('add');
                // this.queryWeekByTermId();
                // this.querTeachFrom('add')
                // this.queryReadyGroupName();
                Promise.all([
                    this.queryAdministrativeClass(),
                    this.queryCourseDetail('add', params.curriculumVisualId),
                    this.queryWeekByTermId(),
                    this.querTeachFrom('add')
                ]).then((req)=>{
                    this.queryReadyGroupName()
                }).catch((rej)=>{
                    this.queryReadyGroupName()
                })
            }

            this.courseDetailDiolog = true;
        }, 
        queryCurriculumSection(){
            this.$http.get('_ed:/scheduleVisualizing/queryCurriculumSection').then(res => {
                if(res.code === 0){
                    let list = [];
                    res.data.map(item => {
                        item.itemlist.map(item2 => {
                            list.push(item2)
                        })
                    })
                    this.sectionList = list.map((item,i) => {
                        return{
                            section_nodeid: item.section_nodeid,
                            sectionNode: item['sectionNode'+ (i + 1)]
                        }
                    })
                }
            })
        },
        queryDetail(params,type){
            this.$http.get('_ed:/scheduleVisualizing/query/detail/'+ params.detail_visual_id).then(res => {
                this.detailForm.courseName = params.clsName;
                this.detailForm.placeID = res.data.area_ids;
                this.detailForm.place = res.data.area_names;
                this.detailForm.courseID = res.data.curriculum_visual_id;
                this.groupList = res.data.group_names.map(item=>{
                    return {content: item}
                })
                this.detailForm.areas = res.data.areas;
                this.detailForm.group = res.data.group_num;
                this.detailForm.describe = res.data.note;
                this.year = res.data.semester_year;
                this.semester = res.data.semester_year_number;
                this.detailForm.form = res.data.teaching_form;
                this.detailForm.chooseCourse = res.data.semester_course_id;
                this._weekStr = res.data.week_numbers.map(item => {
                    return item.toString();
                })

                if(type == 'modify' || type=='show'){
                    this.detailForm.week = res.data.weekday;
                    this.detailForm.nodeStr = res.data.section_nodenames;
                    this.detailForm.nodeID = res.data.section_nodeids;
                    this.detailForm.classID = res.data.admin_cls_ids;
                    this.detailForm.classNameStr = res.data.admin_cls_names;
                    this.className = res.data.admin_cls_names.split(',');
                }

                if(type == 'copy'){
                    this.detailForm.week = this.paramsMSG.selectedWeek;
                    this.detailForm.areas = this.detailForm.areas.map(item => {
                        return {
                            area_id: item.area_id,
                            area_name: item.area_name,
                            group_num: item.group_num,
                        }
                    })
                    let nodeName = [], nodeID = [];
                    this.paramsMSG.selectedSections.map(item => {
                        nodeName.push(item.name);
                        nodeID.push(item.id);
                    })
                    this.detailForm.nodeStr = nodeName.toString();
                    this.detailForm.nodeID = nodeID;

                    let className = [];
                    this.detailForm.classID = [];
                    this.paramsMSG.selectedClasses.map(item => {
                        this.detailForm.classID.push(item.id);
                        className.push(item.name);
                    })
                    this.className = className;
                    this.detailForm.classNameStr = className.toString();
                }
                this.queryAdministrativeClass();
                this.queryWeekByTermId(params);
                this.queryCourseDetail('modify', params.curriculumVisualId);
                this.querTeachFrom('modify');
                this.queryAreaByIds(params.detail_visual_id);
                this.queryReadyGroupName();
            }).catch(err => {
                this.$message.error(err.error);
            })
        },
        queryAreaByIds(detail_visual_id){
            this.checkedPlaceList = [];
            this.$http.post('_ed:/scheduleVisualizing/queryAreaByIds',{
                // area_ids: this.detailForm.placeID
                id: detail_visual_id
            }).then(res => {
                if(res.code == 0){
                    this.checkedPlaceList = res.data.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            groupnum: item.group_num
                        }
                    })
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.$message.error(err.error)
            })
        },
        modifyGroup(){
            this.cloneGroupList = JSON.parse(JSON.stringify(this.groupList));
            this.showGroup = true;
        },
        changeClassName(){
            let _class = [];
            this.classList.map(item => {
                this.detailForm.classID.map(item2 => {
                    if(item2 == item.admin_cls_id){
                        _class.push(item.class)
                    }
                })
            })
            this.className = _class;
            this.$set(this.detailForm,'classNameStr',_class.toString());
        },
        saveGroupName(){
            this.isShow = false
            let mark = false;
            for(let i = 0; i < this.cloneGroupList.length;  i++){
                if(!this.cloneGroupList[i].content){
                    mark = true;
                    this.$message.warning('组名不能为空');
                    return;
                }
            }
            let groups = this.cloneGroupList.map(item => {
                return item.content;
            })
            let _groups = JSON.parse(JSON.stringify(groups));
            _groups = _groups.sort();
            for(let i = 0; i < _groups.length; i++){
                if(_groups[i] == _groups[i+1]){
                    this.$message.warning('组名不能重复');
                    return;
                }
            }
            if(!mark){
                this.groupList = JSON.parse(JSON.stringify(this.cloneGroupList));
                this.showGroup = false;
            }
        },
        queryReadyGroupName(){      //获取已有分组
            this.loading = true;
            this.$http.post('_ed:/scheduleVisualizing/queryReadyGroupName',{
                admin_cls_ids: this.detailForm.classID,
                group_num: this.detailForm.group,
                teaching_form: this.detailForm.form,
                semester_course_id: this.detailForm.chooseCourse,
                curriculum_visual_id: this.detailForm.courseID
            }).then(res => {
                if(res.code === 0){
                    this.changeClassName();
                    this.groupList = [];
                    if(res.data && res.data.group_names && res.data.group_names.length){   //查到分组，显示分组
                        res.data.group_names.map(item => {
                            this.groupList.push({
                                content: item
                            })
                        })
                    }else{  //未查到分组，自动分组
                        if(this.detailForm.group == 1){
                            this.groupList = [{content: this.detailForm.classNameStr.toString()}];
                        }else if(this.detailForm.group == this.className.length){
                            this.groupList = this.className.map(item=>{
                                return {content: item}
                            })
                        }else{
                            for(let i = 1; i <= this.detailForm.group; i++){
                                this.groupList.push({
                                    content: this.className.toString() + '-' + i + '组'
                                })
                            }
                        }
                    }
                }else{
                    this.$message.error(res.msg);
                }
                this.loading = false;
            })
        },
        showPlaceDialog(){
            this.weekCheck();
            if(!this.detailForm.chooseWeek.length){
                this.$message.warning('请先选择周次');
            }else{
                this.placeParams = {
                    semester_year: this.year,
                    semester_year_number: this.semester,
                    week_numbers: this.detailForm.chooseWeek,
                    section_nodeids: this.detailForm.nodeID,
                    weekday: this.detailForm.week,
                }
                this.showPlaceList = true;
            }
        },
        handleClose(){
            this.courseDetailDiolog = false;
            this.clashList = [];
            this.checkedPlaceList = [];
            this.cancelAll();
            this.$emit('closeDetail');
            this.$refs.detailForm.resetFields();
        },
        checkRow(val,week,index){
            // this.detailForm.place = "";
            // this.checkedPlaceList = [];
            this.weekList[index].checkGroup = val ? week.week : [];
        },
        chooseMore(val,index){
            // this.detailForm.place = "";
            // this.checkedPlaceList = [];
            let checkCount = val.length;
            this.weekList[index].checkAll = checkCount === this.weekList[index].week.length ? true : false;
        },
        checkAll(){
            // this.detailForm.place = "";
            // this.checkedPlaceList = [];
            this.weekList.map(item => {
                item.checkAll = true;
                item.checkGroup = item.week
            })
        },
        checkCourseWeek(){
            for(let i = 0; i < this.weekList.length-1; i++){
                this.weekList[i].checkAll = true;
                this.weekList[i].checkGroup = this.weekList[i].week;
            }
        },
        cancelAll(){
            // this.detailForm.place = "";
            // this.checkedPlaceList = [];
            this.weekList.map(item => {
                item.checkAll = false;
                item.checkGroup = [];
            })
        },
        // 查询班级列表
        queryAdministrativeClass(){
            this.classList = [];
            return this.$http.post('_ed:/scheduleVisualizing/queryAdministrativeClass',{
                curriculum_visual_id:this.detailForm.courseID,//课程表id
            }).then(res=>{
                if(res.data && res.data.length>0){
                    this.classList = res.data.map(item=>{
                        return {class:item.admin_cls_name,...item};
                    });
                }else if(res.code != 0){
                    this.$message.error(res.msg);
                }
			}).catch(()=>{
			})
        },
        queryCourseDetail(type, curriculumVisualId){
            let vuex = JSON.parse(localStorage.getItem('vuex'))
            let teacher_id = vuex.me.attributes.login_info.id
            let roles = vuex.me.roles.map(item=>item.id).join()
            let curriculum_visual_id = curriculumVisualId
            let userId = vuex.me.attributes.login_info.id
            return this.$http.post('_op:/gaojiReport/pQueryCom',{
                id :0,
                type:"semester_course_list",
                extend: JSON.stringify({teacher_id: teacher_id, roles: roles, semester_year: this.year, semester_year_number: this.semester, curriculum_visual_id: curriculum_visual_id}),
                userId: userId
            }).then(res => {
                (res.code == 0) && (this.courseList = JSON.parse(res.data));
                (res.code != 0) && (this.$message.error(res.msg));
                // (type == 'add') && (this.detailForm.chooseCourse = this.courseList[0].id);
            }).catch(err => {
                this.$message.error(err.error)
            })
        },
        querTeachFrom(type){
            return this.$http.get("_op:/teaching/form/combox").then(res => {
                if (res.code == 0) {
                    this.formList = res.data;
                    (type == 'add') && (this.detailForm.form = this.formList[0].id);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        checkedPlace(val){
            this.checkedPlaceList = val;
            let placeName = [];
            this.detailForm.placeID = [];
            this.detailForm.areas = [];
            val.map(item => {
                placeName.push(item.name);
                this.detailForm.placeID.push(item.id);
                this.detailForm.areas.push({
                    area_id: item.id,
                    area_name: item.name,
                    group_num: item.groupnum  ? +item.groupnum : 1,
                })
            })
            this.detailForm.place = placeName.toString();
        },
		//周次
        queryWeekByTermId(params){
            let semesterID = this.$route.query.semesterID;
            if(this.status=='show'){
                semesterID = params.semesterID;
            }
            return this.$http.get('_ed:/scheduleVisualizing/queryWeekByTermId/'+ semesterID).then(res => {
                if(res.code == 0){
                    let list = res.data;
                    let mark = 0,mark2 = 0,list2 = [], group_list = [], list3 = [], lastArr = [];
                    let nowlength = res.data.length - 2;
                    const radix = 5;
                    // res.data.map((item,index) => {
                    //     if(index !== 0 && index < nowlength){
                    //         list2.push(item);
                    //         mark++;
                    //         if(mark == radix){
                    //             group_list.push({
                    //                 group: mark2,
                    //                 checkAll: false,
                    //                 checkGroup: [],
                    //                 week: list2
                    //             })
                    //             mark = 0;
                    //             mark2++;
                    //             list2 = [];
                    //         }
                    //     }
                    // })
                    res.data.map((item,index) => {
                        if(item.week == 0) {
                            this.isShow = true
                        }
                        if(item.week > 0 && index < nowlength){
                            list2.push(item);
                            mark++;
                            if(mark == radix){
                                group_list.push({
                                    group: mark2,
                                    checkAll: false,
                                    checkGroup: [],
                                    week: list2
                                })
                                mark = 0;
                                mark2++;
                                list2 = [];
                            }
                     //       console.log('666', group_list)
                        }else{
                            list3.push(item)
                        }
                    })
					//                            console.log('777', group_list)
                    if(mark2*radix !== nowlength && mark >0){
                        group_list.push({
                            group: mark2,
                            checkAll: false,
                            checkGroup: [],
							week: list2
                           // week: this.isShow == true ? list.slice(mark2*radix + 2, nowlength) : list.slice(mark2*radix, nowlength)
                        })
                    }
					//console.log('888', group_list)
                    group_list.push({
                        group: ++mark2,
                        checkAll: false,
                        checkGroup: [],
                        week: list3
                    }) 
                    this.weekList = group_list.map(item => {
                        let _week = [];
                        item.week.map(item2 => {
                            _week.push(item2.week.toString());
                        })
                        item.week = _week;
                        return item;
                    })
                    if(this._weekStr.length){
                        this.weekList.map(item => {
                            this._weekStr.map(item2 => {
                                if(item.week.indexOf(item2) !== -1){
                                    item.checkGroup.push(item2)
                                }
                            })
                        })
                        this.weekList.map(item=>{
                            if(item.checkGroup.length === item.week.length){
                                item.checkAll = true;
                            }
                        })
                    }
                    this.course_week_start = this.weekList[0].week[0];
                    let week_end_length = this.weekList[this.weekList.length-2].week.length;
                    this.course_week_end = this.weekList[this.weekList.length-2].week[week_end_length-1];
                }else{
                    this.$message.error(res.msg)
                }
                
            }).catch(err => {
                this.$message.error(err.error)
            })
        },
        weekCheck(){
            let weeks = [];
            this.weekList.map(item => {
                if(item.checkGroup && item.checkGroup.length){
                    item.checkGroup.sort((a,b) => {return a-b});
                    weeks = weeks.concat(item.checkGroup);
                }
            })
            weeks.sort((a,b) => {return a-b});
            this.detailForm.chooseWeek = weeks;
        },
        submitRequest (formName) {
            this.currentPage = 1;
            this.weekCheck();

            let groups = this.groupList.map(item => {
                return item.content;
            })

            this.$refs[formName].validate(valid => {
                if(!valid) return;

                let sectionIndex = [];
                this.detailForm.nodeID = this.detailForm.nodeID.sort();
                this.sectionList.map((item,index) => {
                    this.detailForm.nodeID.map(item2 => {
                        if(item2 == item.section_nodeid){
                            sectionIndex.push(index)
                        }
                    })
                })
                for(let i = 0; i < sectionIndex.length; i++){
                    if((i > 0) && (sectionIndex[i] - sectionIndex[i-1] !== 1)){
                        this.$message.warning('选择的课节必须连续');
                        return;
                    }
                }
                
                let groupNum = 0;
                this.detailForm.areas.map(item => {
                    groupNum = groupNum + Number(item.group_num);
                })
                if(this.detailForm.group != 1 && this.detailForm.group != groupNum){
                    this.$message.error('分组数和场地安排组数之和不匹配，请重新设置！');
                    return;
                }
                
                this.notClick = true;
                let _url = '',_param = {};
                if(this.status == 'add' || this.status == 'copy'){
                    _url = '_ed:/scheduleVisualizing/addVisualDetail';
                    _param = {
                        create_user: this.userid, //登录人id
                        area_ids: this.detailForm.placeID,
                        area_names: this.detailForm.place,
                        group_num: this.detailForm.group, //组数num
                        note: this.detailForm.describe,//备注
                        semester_course_id: this.detailForm.chooseCourse,//排课课程
                        teaching_form: this.detailForm.form,//授课形式id
                        week_numbers: this.detailForm.chooseWeek,//周次数组
                        admin_cls_ids: this.detailForm.classID,//行政班id数组
                        admin_cls_names: this.detailForm.classNameStr,//行政班名称，拼接
                        curriculum_visual_id: this.detailForm.courseID,//课程表id
                        group_names: groups,//组名
                        section_nodeids: this.detailForm.nodeID,//课节id数组
                        semester_year: this.year,//学年
                        semester_year_number: this.semester,//学期
                        weekday: this.detailForm.week, //星期
                        areas: this.detailForm.areas
                    }
                }
                if(this.status == 'modify' && this.publish_status != '2'){  //未生成进度表时
                    this.detailForm.areas.map(item => {
                        item.detail_visual_id = this.detail_visual_id
                    })
                    _url = '_ed:/scheduleVisualizing/updateCurriculumDetail';
                    _param = {
                        area_ids: this.detailForm.placeID,
                        area_names: this.detailForm.place,
                        admin_cls_ids: this.detailForm.classID,
                        admin_cls_names: this.detailForm.classNameStr,//行政班名称，拼接
                        group_names: groups,
                        group_num: this.detailForm.group,
                        id: this.detail_visual_id,
                        last_update_user: this.userid,
                        note: this.detailForm.describe,
                        semester_course_id: this.detailForm.chooseCourse,
                        teaching_form: this.detailForm.form,
                        week_numbers: this.detailForm.chooseWeek,
                        section_nodeids: this.detailForm.nodeID,
                        semester_year: this.year,
                        semester_year_number: this.semester,
                        weekday: this.detailForm.week,
                        curriculum_visual_id: this.detailForm.courseID,
                        areas: this.detailForm.areas
                    }
                }
                if(this.status == 'modify' && this.publish_status == '2'){  //已生成进度表时
                    let areas = [];
                    this.detailForm.areas.map(item => {
                        areas.push(`${item.area_id}-${item.group_num}`)
                    })
                    let _weeks = this.detailForm.chooseWeek.map(week => +week);
                    _url = '_ed:/scheduleVisualizing/updateScheduleByCurriculumDetail';
                    _param = {
                        // area_ids: this.detailForm.placeID,
                        // area_names: this.detailForm.place,
                        // admin_cls_ids: this.detailForm.classID,
                        // admin_cls_names: this.detailForm.classNameStr,//行政班名称，拼接
                        group_names: groups,
                        // group_num: this.detailForm.group,
                        detail_visual_id: this.detail_visual_id,
                        // last_update_user: this.userid,
                        // note: this.detailForm.describe,
                        // semester_course_id: this.detailForm.chooseCourse,
                        teaching_form: this.detailForm.form,
                        week_numbers: _weeks,
                        section_nodeids: this.detailForm.nodeID,
                        // semester_year: this.year,
                        // semester_year_number: this.semester,
                        weekday: this.detailForm.week,
                        curriculum_visual_id: this.detailForm.courseID,
                        areaidgroup: areas
                    }
                }
                this.$http.post(_url,_param).then(res => {
                    this.notClick = false;
                    this.clashList = [];
                    if(res.code == 0 && (!res.data || !res.data.length)){
                        this.$message.success('保存成功！');
                        // 通知父组件刷新列表
                        this.$emit('renovate');
                        this.handleClose();
                    }else if(res.code == 1 || (res.data || res.data.length)){
                        if(res.data && typeof res.data !== 'string'){
                            this.$message.error('存在冲突，保存失败！');
                            this.clashList = res.data;
                        }else if(res.data && typeof res.data == 'string'){
                            this.$message.error('存在冲突，保存失败！');
                            this.clashList = JSON.parse(res.data);
                        }else if(res.msg && typeof res.msg !== 'string'){
                            this.$message.error('存在冲突，保存失败！');
                            this.clashList = res.msg;
                        }else if(res.msg && typeof res.msg == 'string'){
                            this.$message.error('存在冲突，保存失败！');
                            this.clashList = JSON.parse(res.msg);
                        }else{
                            this.$message.error(res.msg);
                        }
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch(err => {
                    this.notClick = false;
                    this.clashList = [];
                    this.$message.error(err.error)
                })
            })
            
        }
    }
}
</script>
<style scoped lang='less'>
    .content-width{
        width: 640px;
    }
    .week-group{
        width:380px;
        display:flex;
        justify-content:space-between;
    }
    .place, .group{
        display:flex;
        justify-content:space-between;
        align-items: start;
    }
    .describe{
        width: 640px !important;
    }
</style>
<style lang="less">
    .week-group{
        .el-checkbox__label{
            width: 16px;
        }
        .el-checkbox{
            margin-right: 16px;
        }
    }
    .course-detail{
        .el-dialog__body{
            padding: 10px 20px 30px;
        }
    }
    .group-name{
        .el-table .cell{
            width: 658px;
        }
    }
</style>

