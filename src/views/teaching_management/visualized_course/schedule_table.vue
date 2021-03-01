<template>
    <div class="course-box" oncontextmenu="return false;" onselectstart="return false">
        <el-table
        v-loading="loading"
        :data="tableData"
        :span-method="spanMethods"
        border
        style="width: 100%"
        size="mini"
        :highlight-current-row="false"
        :max-height="windowHeight - 140 - 38 - 40"
        header-row-class-name="cm-dark">
            <el-table-column
                align="center"
                label="班级"
                fixed
                width="150">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.class_name" placement="bottom-start">
                        <div class="class-name">{{scope.row.class_name}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                v-for="(item1,i) in weekList"
                :label="item1"
                align="center">
                <el-table-column
                    v-for="(item2,j) in timePeriods"
                    :label="item2"
                    align="center">
                    <el-table-column
                        v-for="(item3,k) in lessons[j]"
                        :label="item3"
                        align="center"
                        min-width="30">
                        <template slot-scope="scope">
                            <el-popover 
                            :ref="`popover-${i}-${j}-${k}-${scope.$index}`"
                            v-if="JSON.stringify(scope.row[i+'^'+j+'^'+item3]) !== '{}'"
                            placement="right"
                            width="450"
                            trigger="click">
                            <i @click="closePopover(`popover-${i}-${j}-${k}-${scope.$index}`)" class="el-icon-close" 
                            style="position: absolute;right: 12px;font-size: 20px;"></i>
                                <div class="course-detail">
                                    <div class="course-detail-item" v-for="(detail,detIndex) in scope.row[i+'^'+j+'^'+item3].content_detail">
                                        <p>课程：{{ detail.course_arrange }}</p>
                                        <p>周次：{{ detail.week_names }}</p>
                                        <p>星期：{{ scope.row[i+'^'+j+'^'+item3].weekday | weekdayFilter}}</p>
                                        <p>课节：{{ detail.section_nodenames }}</p>
                                        <p>班级：{{ detail.admin_cls_names }}</p>
                                        <p>授课场地：{{ detail.area_names }}</p>
                                        <p>授课形式：{{ detail.teaching_formname }}</p>
                                        <p>分组数：{{ detail.group_num }}</p>
                                        <p>组名：{{ detail.group_names }}</p>
                                        <div class="exchange">
                                            <el-button @click="editDetail(detail)" size="medium" style="margin-top:5px;">修改</el-button>
                                            <!-- <div> -->
                                                <el-button type="primary"  size="medium"
                                                @click="autoExchange(scope.row[i+'^'+j+'^'+item3],`popover-${i}-${j}-${k}-${scope.$index}`,detIndex)">可视化选择课表互换</el-button>
                                                <el-button @click="showCourseExchange(scope.row[i+'^'+j+'^'+item3],detIndex)" type="primary" size="medium">手工选择课表互换</el-button>
                                                <!-- <span style="padding-left:20px;">点击【互换】后，双击选择想互换的课表</span> -->
                                            <!-- </div> -->
                                        </div>
                                    </div>
                                </div>
                                <span slot="reference" @dblclick="dblChoose(scope.row[i+'^'+j+'^'+item3])" class="lesson-item" 
                                v-html="scope.row[i+'^'+j+'^'+item3].content">{{ scope.row[i+'^'+j+'^'+item3].content }}</span>
                            </el-popover>
                            <div class="lesson-item" v-else></div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-dialog title="课表互换" 
        :visible.sync="showExchangeDialog" 
        :before-close="handleClose" 
        width="600px" 
        append-to-body 
        :close-on-click-modal="false" 
        @submit.prevent="refuseSubmit">
            <el-form :model="changeForm" :rules="rules" ref="changeForm" size="small" label-width="80px">
                <el-form-item label="原排课：" prop="courseID">
                    <el-select v-model="changeForm.courseID" @change="changeOldCourse" style="width:480px;">
                        <el-option 
                        v-for="item in historyCourseList" 
                        :label="item.curriculum_detail_visual_name" 
                        :value="item.curriculum_detail_visual_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <p style="line-height: 45px;padding-left: 12px;font-size: 16px;">选择互换的排课</p>
                <el-form-item label="班级：" prop="cls">
                    <el-select v-model="changeForm.cls" @change="queryCourseOrTime('course')" 
                    :disabled="!changeForm.courseID"
                    style="width:480px;">
                        <el-option 
                        v-for="item in classLists" 
                        :label="item.cls_name" 
                        :value="item.cls_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程：" prop="course">
                    <el-select v-model="changeForm.course" @change="queryCourseOrTime('time')" 
                    :disabled="!changeForm.courseID"
                    style="width:480px;">
                        <el-option 
                        v-for="item in courseLists" 
                        :label="item.name" 
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间：" prop="time">
                    <el-select v-model="changeForm.time" 
                    :disabled="!changeForm.courseID"
                    style="width:480px;">
                        <el-option 
                        v-for="item in timeLists" 
                        :label="item.name" 
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button @click="handleClose" size="medium">取消</el-button>
                <el-button @click="submit" size="medium" type="primary">确定</el-button>
            </div>
        </el-dialog>
        <add-course-detail ref="addCourseDetail" @renovate="queryTable">
        </add-course-detail>
        <clash :conflictDetails.sync="clashShow" :conflictData="conflictData">
        </clash>
    </div>
    
</template>
<script>
import util from '@/util';
import addCourseDetail from './add_course_detail';
import clash from '../approval/clash';
export default {
    props: {
        curriculumSection: {
            type: Array,
            default: []
        },
        curriculumVisualId: '',
        activeName: '',
    },
    components: {
		addCourseDetail,clash
	},
    data(){
        return{
            cls_name: this.$route.query.cls_name,
            loading: true,
            weekList:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
            timePeriods:['上午','下午','晚上'],
            lessons:[[],[],[]],
            tableData: [],
            newLists2:[],
            windowHeight: window.top.innerHeight,
            //互调
            showExchangeDialog: false,
            historyCourseList: [],
            changeForm: {
                courseID:'',
                cls: '',
                course: '',
                time: ''
            },
            classLists: [],
            courseLists: [],
            timeLists: [],
            rules:{
                courseID:[
                    { required: true, message: '请选择原排课' }
                ],
                cls:[
                    { required: true, message: '请选择班级' }
                ],
                course:[
                    { required: true, message: '请选择课程' }
                ],
                time:[
                    { required: true, message: '请选择时间' }
                ]
            },
            //冲突
            clashShow: false,
            conflictData: [],
            //可视化互换课程
            clickIndex: 0,
            baseMsg: {},
            dblCurrentItem: {},
        }
    },
    watch: {
        'showExchangeDialog'(val){
            if(val){
                this.courseLists = [];
                this.timeLists = [];
            }
        }
    },
    filters: {
        weekdayFilter(week){
            let weekname = '';
            switch (+week){
                case 1: weekname = '一' ;
                break;
                case 2: weekname = '二' ;
                break;
                case 3: weekname = '三' ;
                break;
                case 4: weekname = '四' ;
                break;
                case 5: weekname = '五' ;
                break;
                case 6: weekname = '六' ;
                break;
                case 7: weekname = '日' ;
                break;
            }
            return weekname;
        }
    },
    mounted(){
        this.loading = true;

        this.activeName == 'classes' ? this.type = 1 : this.type = 2;

        this.curriculumSection.map((item,index) => {
            item.itemlist.map(p => {
                this.lessons[index].push(p.name.toString())
            })
        })

        this.queryTable();
    },
    methods: {
        refuseSubmit(){
            return false;
        },
        closePopover(po){
            this.$refs[po][0].doClose();
        },
        submit(){
            this.conflictData = [];
            this.$refs['changeForm'].validate(valid => {
                if(valid){
                    let user_info = util.getStorage('vuex') ? JSON.parse(util.getStorage('vuex')) : '';

                    this.$http.post('_ed:/scheduleVisualizing/exChangeCourse',{
                        detail_visual_id: this.changeForm.courseID,
                        detail_visual_new_id: this.changeForm.course,
                        userId: user_info ? user_info.me.attributes.login_info.id : '',
                        userName: user_info ? user_info.me.user.name : ''
                    }).then(res => {
                        if(res.code == 0){
                            this.$message.success('操作成功！');
                            this.queryTable();  //更新课表
                            this.handleClose();
                        }else if(res.code == 1){
                            this.$message.warning('存在冲突，互调失败！');
                            let list = JSON.parse(res.msg);
                            if(list.length == 0 || (list.length == 1 && JSON.stringify(list[0]) == '{}')){
                                list = []
                            }
                            this.conflictData = list;
                            this.clashShow = true;
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }
            })
        },
        showCourseExchange(item,i){
            this.clickIndex = i;
            this.changeForm = {
                courseID:'',
                cls: '',
                course: '',
                time: ''
            };
            this.historyCourseList = item.content_detail;
            this.changeForm.courseID = this.historyCourseList[this.clickIndex].curriculum_detail_visual_id;
            this.showExchangeDialog = true;
        },
        dblChoose(item){
            // console.log(item)
            this.dblCurrentItem = item;
            if(JSON.stringify(this.baseMsg) !== '{}'){  //在倒计时时间内
                this.historyCourseList = this.baseMsg.content_detail;
                this.changeForm.courseID = this.historyCourseList[this.clickIndex].curriculum_detail_visual_id;
                let now_class = this.classLists.find(c => item.cls_name == c.cls_name);
                this.changeForm.cls = now_class.cls_id;
                this.queryCourseOrTime('course','autotime')
                this.showExchangeDialog = true;
            }
        },
        autoExchange(item,po,i){
            this.clickIndex = i;
            this.closePopover(po);
            this.baseMsg = item;
            this.$emit('timeTip');
        },
        clearTimer(){
            this.baseMsg = {}
        },
        handleClose(){
            this.showExchangeDialog = false;
            //清除信息
            this.$refs['changeForm'].resetFields();
        },
        changeOldCourse(){
            this.changeForm.cls = '';
            this.changeForm.course = '';
            this.changeForm.time = '';
            this.courseLists = [];
            this.timeLists = [];
        },
        //取可互换的课程或时间
        queryCourseOrTime(search,auto){
            let _type = '';
            if(search == 'course'){
                (this.type == 1) && (_type = 1);
                (this.type == 2) && (_type = 2);
                
                this.changeForm.course = '';
                this.changeForm.time = '';
                this.courseLists = [];
                this.timeLists = [];
            }
            if(search == 'time' && this.changeForm.course){
                (this.type == 1) && (_type = 3);
                (this.type == 2) && (_type = 4);

                this.changeForm.time = '';
                this.timeLists = [];
            }
            let course_id = 0;
            if(_type === 3 || _type === 4){
                course_id = this.changeForm.course
            }

            this.$http.post('_ed:/scheduleVisualizing/queryChangeCourse',{
                detail_visual_id: this.changeForm.courseID,
                cls_id: this.changeForm.cls,
                type: _type,
                courseId: course_id
            }).then(res=>{
                if(res.code == 1 && res.msg != '[{}]'){
                    let list = JSON.parse(res.msg);
                    if(list.length == 0 || (list.length == 1 && JSON.stringify(list[0]) == '{}')){
                        list = []
                    }
                    if(search == 'course'){
                        this.courseLists = list;
                    }else{
                        this.timeLists = list;
                    }

                    if(auto == 'autotime'){
                        let course_name = this.dblCurrentItem.content_detail[0].course_arrange;
                        let now_course = this.courseLists.find(c => c.name == course_name);
                        (now_course) && (this.changeForm.course = now_course.id);
                        
                        this.queryCourseOrTime('time')
                    }
                    // else if(auto == 'fill'){
                    //     this.changeForm.time = this.timeLists[0].id;
                    // }
                }
            })
        },
        editDetail({curriculum_detail_visual_id,publish_status}){
            this.$refs.addCourseDetail.getParams({
                detail_visual_id:curriculum_detail_visual_id,
                publish_status,
                action:'modify',
                // 课程表名称
                clsName:this.cls_name,
            });
        },
        spanMethods({ row, column, rowIndex, columnIndex }){
            let cellObj = this.newLists2[rowIndex][columnIndex].value;
            if(columnIndex>0 && JSON.stringify(cellObj)!='{}'){
                return cellObj;
            }else{
                return {rowspan:1,colspan:1};
            }
        },
        queryTable(){
            this.$http.post('_ed:/scheduleVisualizing/queryScheduleVisualView',{
                curriculum_visual_id: this.curriculumVisualId,
                type: this.type  //1行政班，2上课班
            }).then(res => {
                let list = JSON.parse(res.data);
                let classNameList = [];
                let itemList = [];  //拆开所有班级
                let _classLists = [];
                if(list.length){
                    //获取所有班级
                    list.map(item => {
                        item.sort_cls_name.map(item2 => {
                            // classNameList.push(item2.cls_name);
                            _classLists.push({
                                cls_id: item2.cls_id,
                                cls_name: item2.cls_name,
                                row_num: item2.row_num,
                            })
                            itemList.push({
                                weekday:item.weekday,
                                section_nodeids:item.section_nodeids,
                                section_nodenames:item.section_nodenames,
                                content:item.content,
                                cls_name:item2.cls_name,
                                curriculum_detail_visual_ids: item2.curriculum_detail_visual_ids,
                                content_detail: item2.content_detail,
                                publish_status: item2.publish_status
                            })
                        })
                    })
                    // console.log('itemList',itemList)
                    
                    //排序
                    _classLists.sort((a,b) => {return a.row_num-b.row_num});
                    _classLists.map(c => {
                        classNameList.push(c.cls_name);
                    })
                    //班级去重
                    classNameList = Array.from(new Set(classNameList));

                    let mark = [];
                    this.classLists = [];
                    _classLists.map(c => {
                        if(mark.indexOf(c.cls_id) == -1){
                            this.classLists.push(c);
                            mark.push(c.cls_id)
                        }
                    })
                    
                    let newLists = [];
                    classNameList.map(item => {
                        newLists.push({
                            class_name: item
                        })
                    })
                    //组合每个班级课节
                    let m = [];
                    for(let i = 0; i < 7; i++){
                        this.lessons.map((lesson,j)=>{
                            lesson.map((less,k)=>{
                                m.push(i+'^'+j+'^'+less)
                            })
                        })
                    }
                    
                    //预处理
                    newLists.map(item =>{
                        m.map(p => {
                            item[p] = {}
                        })
                    })
                    // console.log('newLists',newLists);
                    newLists.map((item1,index1)=>{
                        for(let key in item1){
                            if(key !== 'class_name'){
                                let node = key.split('^');
                                itemList.map((item2,index2) => {
                                    item2.section_nodenames.map(n => {
                                        let week = Number(item2.weekday) -1;
                                        if(item1.class_name == item2.cls_name && week.toString() == node[0] && n == node[2]){
                                            item1[key] = { ...item2, rowspan:1, colspan:1 };
                                        }
                                    })
                                })
                            }
                        }
                    })
                    this.tableData = JSON.parse(JSON.stringify(newLists));
                    let newLists2 = [];
                    for(let i = 0; i < newLists.length; i++){
                        let row = newLists[i];
                        let rowtemp = [];
                        for(let key in row){
                            rowtemp.push({key,value:row[key]});                        
                        }
                        rowtemp.sort();
                        newLists2.push(rowtemp);
                    }
                    for(let i = 0; i < newLists2.length; i++){
                        let row = newLists2[i];
                        for(let j = 0; j < row.length; j++){
                            let cell = row[j];
                            // 判断列合并
                            // 先判断当前单元格前面相邻的单元格内容是否相同，相同的话当前单元格colspan=0
                            // 再判断当前单元格后面是否有连续的单元格内容和当前单元格相同,获取相同单元格的个数作为colspan
                            if(j>1){
                                let nowContent = cell.value.content;
                                let preContent = row[j-1].value.content;
                                if(nowContent && preContent && nowContent==preContent){
                                    cell.value.colspan = 0;
                                    cell.value.rowspan = 0;
                                    continue;
                                }
                            }
                            if(j>0 && j<row.length-1){
                                let nowContent = cell.value.content;
                                let countTemp = 0;
                                for(let k = j+1; k < row.length; k++){
                                    let nextContent = row[k].value.content;
                                    if(nowContent && nextContent && nowContent==nextContent){
                                        countTemp++;
                                    }else{
                                        break;
                                    }
                                }
                                if(countTemp>0){
                                    cell.value.colspan = countTemp+1;
                                }
                            }

                            // 判断行合并
                            // 先判断当前单元格上面相邻的单元格内容是否相同，相同的话当前单元格rowspan=0
                            // 再判断当前单元格下面是否有连续的单元格内容和当前单元格相同,获取相同单元格的个数作为rowspan
                            if(this.type === 1){    //行政班预览
                                if(i>0){
                                    let nowContent = cell.value.content;
                                    let preContent = newLists2[i-1][j].value.content;
                                    if(nowContent && preContent && nowContent==preContent){
                                        cell.value.colspan = 0;
                                        cell.value.rowspan = 0;
                                        continue;
                                    }
                                }
                                if(i<newLists2.length-1){
                                    let nowContent = cell.value.content;
                                    let countTemp = 0;
                                    for(let k = i+1; k < newLists2.length; k++){
                                        let nextContent = newLists2[k][j].value.content;
                                        if(nowContent && nextContent && nowContent==nextContent){
                                            countTemp++;
                                        }else{
                                            break;
                                        }
                                    }
                                    if(countTemp>0){
                                        cell.value.rowspan = countTemp+1;
                                    }
                                }
                            }
                        }
                    }
                    this.newLists2 = newLists2;
                }
                this.loading = false;
            })
        }
    },
}
</script>
<style>
    .course-box .el-table tbody tr:hover>td { 
        background-color:#ffffff!important
    }
    .course-box .el-table .cell, .el-table th div{
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    .course-box .el-table--mini th, .course-box .el-table--mini td{
        padding: 0 !important;
    }
    .course-box .cell{
        display: block !important;
    }
    .course-box td{
        cursor: pointer;
    }
</style>

<style lang="less" scoped>
    .class-name{
        width:150px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        cursor: pointer;
    }
    .lesson-item{
        padding: 5px;
    }
    .course-detail{
        max-height: 80vh;
        overflow: auto;
        width: 460px;
    }
    .course-detail-item{
        border-bottom: 1px dotted #ddd;
        padding: 10px;
        p{
            padding: 5px 0;
        }
    }
    .course-detail>.course-detail-item:last-child{
        border-bottom: 1px dotted transparent;
    }
    .course-detail .exchange{
        // display:flex;
        // justify-content:space-between;
        // align-items:center;
    }
</style>
