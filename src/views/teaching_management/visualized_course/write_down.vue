<template>
    <!-- <p>可视化排课-录入</p> -->
    <section class="cm-container schedule-setting">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-fold">
            <div class="btn-con1-outer">
                <div class="btn-con1">
                    <p>年级：{{grade&&grade.length>0?grade.join('，'):''}}</p>
                    <p>学期：{{term_name}}</p>
                    <p>课表名称：{{cls_name}}</p>
                </div>
                <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
            </div>
        </div>
        <span v-show="timer" style="position: absolute;right: 10px;top: 80px;color:blue;">{{ times }}秒内 双击想互换的课程</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="录入" name="writeDown">
                <div
                    class="my-table schedule-table18235"
                    @mousedown="handleDragStart"
                    @mousemove="handleDraging"
                    @mouseup="handleDragEnd"
                    @mouseleave="handleDragEnd"
                    v-loading="tableData1Loading"
                    element-loading-text="努力加载中···">
                    <el-table
                        :max-height="400"
                        ref="scheduleTable"
                        :data="tableData1"
                        border
                        style="width: 100%"
                        size="mini"
                        header-row-class-name="cm-dark">
                        <el-table-column
                            align="center"
                            prop="class"
                            label="班级"
                            fixed
                            width="150"
                            :show-overflow-tooltip="true">
                            <p slot-scope="scope" class="class-name">{{scope.row.class}}&nbsp;</p>
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
                                    width="20">
                                    <template slot-scope="scope">
                                        <div class="lesson-item"
                                            :class="{'lesson-item1':j==0,
                                            'lesson-item2':j==1,
                                            'lesson-item-selected':scope.row[i+'^'+j+'^'+k]}"
                                            @click="handleCellclick(scope,i,j,k)"
                                            :ref="scope.$index+'^'+i+'^'+j+'^'+k">
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </el-table-column>
                        
                    </el-table>
                </div>
                
                <div class="cm-fold">
                    <el-form :inline="true" size="mini">
                        <div class="btn-con2">
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="openAddCourseDetailDialog">
                                    添加课表明细
                                </el-button>
                                <el-button size="mini" @click="clearLessons">清除选中</el-button>
                                <el-button type="primary" size="mini" style="margin-left:40px;" @click="batchCopy">
                                    批量复制
                                </el-button>
                                <el-button type="primary" @click="makeSchedule" size="mini">生成进度表</el-button>
                            </el-form-item>
                            <el-form-item label="课程">
                                <el-select
                                    size="mini"
                                    v-model="selectedCourse"
                                    filterable
                                    clearable
                                    class="course-selection"
                                    placeholder="请选择排课课程"
                                    @change="queryScheduleDetailVisual">
                                    <el-option
                                        v-for="item in courseList" 
                                        :label="item.course_arrange"
                                        :value="item.id"
                                        clearable
                                        filterable>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>

                <div class="my-table"
                    v-loading="tableData2Loading"
                    element-loading-text="努力加载中···">
                    <el-table
                        :data="tableData2"
                        border
                        style="width: 100%"
                        size="mini"
                        header-row-class-name="cm-dark"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            fixed
                            width="45">
                        </el-table-column>
                        <el-table-column
                            type="index"
                            label="序号"
                            fixed
                            width="50">
                        </el-table-column>
                        <el-table-column
                            prop="course_arrange"
                            label="课程"
                            width="300">
                        </el-table-column>
                        <el-table-column
                            prop="admin_cls_names"
                            label="行政班级"
                            width="250">
                        </el-table-column>
                        <el-table-column
                            prop="week_names"
                            label="周次"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="weekday"
                            label="星期"
                            width="50">
                            <template slot-scope="scope">
                                {{scope.row.weekday | weekdayMap}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="section_nodenames"
                            label="课节"
                            width="60">
                        </el-table-column>
                        <el-table-column
                            prop="area_names"
                            label="授课场地"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="teaching_formname"
                            label="授课形式"
                            width="80">
                        </el-table-column>
                        <el-table-column
                            prop="group_names"
                            label="分组名称"
                            width="350">
                        </el-table-column>
                        <el-table-column
                            prop="note"
                            label="描述"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="130"
                            fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="singleCopy(scope.row)">
                                    复制
                                </el-button>
                                <el-button
                                    v-if="scope.row.publish_status!=1"
                                    type="text"
                                    size="small"
                                    @click="editDetail(scope.row)">
                                    编辑
                                </el-button>
                                <el-button
                                    v-if="scope.row.publish_status==0"
                                    type="text"
                                    size="small"
                                    @click="delDetailVisual(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                
            </el-tab-pane>
            <el-tab-pane label="按行政班预览" name="classes">
                <schedule-table ref="scanTable"
                v-if="activeName == 'classes'"
                :curriculumSection="curriculumSection"
                :curriculumVisualId="curriculum_visual_id" 
                :activeName="activeName"
                @timeTip="timeTip"></schedule-table>
            </el-tab-pane>
            <el-tab-pane label="按上课班预览" name="course">
                <schedule-table ref="scanTable"
                v-if="activeName == 'course'"
                :curriculumSection="curriculumSection"
                :curriculumVisualId="curriculum_visual_id" 
                :activeName="activeName"
                @timeTip="timeTip"></schedule-table>
            </el-tab-pane>
        </el-tabs>

        <clash :conflictDetails.sync="clashShow" :conflictData="conflictData">
        </clash>
        <add-course-detail ref="addCourseDetail" @renovate="queryScheduleDetailVisual" @closeDetail="clearLessons">
        </add-course-detail>
    </section>
</template>
<script>

import util from '@/util';
import clash from '../approval/clash';
import addCourseDetail from './add_course_detail';
import scheduleTable from './schedule_table';
export default {
    components: {
		clash,addCourseDetail,scheduleTable
	},
    data(){
        return {
            breadcrumb: [
                {label: "教学管理"},
                {label: "课程表管理",path:"/teaching_management/visualized_course/visualized_list"},
                {label: "录入明细"}
            ],
            activeName: 'writeDown',
            tableData2:[],
            tableData2Loading:false,
            selectedCourse:'',
            courseList:[],
            conflictData:[],
            clashShow:false,
            tableData1:[],
            tableData1Bak:[],
            tableData1Loading:false,
            weekList:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
            timePeriods:['上午','下午','晚上'],
            // lessons:[['1','2','3','4','5'],['6','7','8','9','10'],['A','B','C']],
            lessons:[[],[],[]],
            startX:0,
            startY:0,
            pause:false,
            isDraging:false,
            selectedLessonsEmpty:true,
            firstSelectedDay:'',
            scheduleTableProps:[],
            cls_name:this.$route.query.cls_name,//课程表名称
            grade:JSON.parse(this.$route.query.grade),//年级
            curriculum_visual_id:+this.$route.query.curriculum_visual_id,//课程表id
            term_name:this.$route.query.term_name,//学期名称
            multipleSelection:[],//存放明细列表被选中的项
            userid:'',
            username:'',
            semesterYear: this.$route.query.year,//学年
            semesterYearNumber: this.$route.query.semesterNum,//学期
            curriculumSection:[],
            times: 0,
            timer: null
        }
    },
    methods: {
        timeTip(){
            clearInterval(this.timer);
            this.times = 10;
            this.timer = setInterval(()=>{
                this.times = this.times - 1;
            },1000)

            setTimeout(()=>{
                this.quitTimer();
            },10900)
        },
        quitTimer(){
            this.times = 0;
            this.$refs.scanTable.clearTimer()
            clearInterval(this.timer);
            this.timer = null;
        },

        // 1.获取鼠标开始拖动时候的位置
        // 2.拖动中记录鼠标位置，遍历表格中所有格子元素获取他们的位置，长宽，和框选区域做碰撞检测
        // 3.鼠标弹起时结束,清空一些值。

        // 开始拖动
        handleDragStart(e){
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.isDraging = true;
            this.tableData1Bak = JSON.parse(JSON.stringify(this.tableData1));
        },
        // 拖动中
        handleDraging(e){
            if(!this.isDraging){
                return;
            }
            if(this.pause){
                // 避免频繁触发
                return;
            }
            this.pause = true;
            
            let endX = e.clientX;
            let endY = e.clientY;
            // obj1是鼠标拖拽出来的区域
            let obj1 = {
                posX:this.startX<endX?this.startX:endX,
                posY:this.startY<endY?this.startY:endY,
                width:Math.abs(this.startX-endX),
                height:Math.abs(this.startY-endY),
            };
            
            let bodyWrapper = this.$refs.scheduleTable.bodyWrapper;
            this.tableData1 = JSON.parse(JSON.stringify(this.tableData1Bak));
            let hasSelected = false;
            this.tableData1.forEach((tableDataItem,i)=>{
                this.scheduleTableProps.forEach(propItem=>{
                    if(!this.selectedLessonsEmpty && this.firstSelectedDay!=propItem.split('^')[0]){
                        // 如果此单元格不是第一个被选中的判断它所在的周和之前选的单元格的周是否一致，不一致则不选中
                        return;
                    }
                    let cell = this.$refs[i+'^'+propItem];
                    let clientRects = cell[0].getClientRects()[0];
                    // obj2是每个table单元格的区域
                    let obj2 = {
                        // posX:clientRects.x-bodyWrapper.scrollLeft,
                        posX:clientRects.x,
                        posY:clientRects.y,
                        width:clientRects.width,
                        height:clientRects.height,
                    };
                    // tableDataItem[propItem] = false;
                    if(this.crashCheck(obj1,obj2)){
                        if(!tableDataItem[propItem]){
                            tableDataItem[propItem] = true;
                            if(this.selectedLessonsEmpty){
                                // 如果此单元格是第一个被选中的，记录下它是周几
                                this.selectedLessonsEmpty = false;
                                this.firstSelectedDay = +propItem.split('^')[0];
                            }
                        }else{
                            tableDataItem[propItem] = false;
                        }
                    }
                    if(tableDataItem[propItem]){
                        hasSelected = true;
                    }
                })
            });
            if(!hasSelected){
                this.selectedLessonsEmpty = true;
            }
            this.$refs.scheduleTable.doLayout();
            setTimeout(()=>{
                this.pause = false;
            },100);
        },
        // 拖动结束
        handleDragEnd(e){
            this.isDraging = false;
        },
        // 碰撞检测方法
        crashCheck(obj1,obj2){
            // obj1:{posX,posY,width,height},obj2:{posX,posY,width,height}
            for(let key in obj1){
                if(typeof obj1[key] !='number'){
                    throw '碰撞检测方法物体1的'+key+'属性必须是数字';
                }
            }
            for(let key in obj2){
                if(typeof obj2[key] !='number'){
                    throw '碰撞检测方法物体2的'+key+'属性必须是数字';
                }
            }

            // 是否物体1在物体2的左边（不相交）
            let check1 = obj1.posX+obj1.width<obj2.posX;
            // 是否物体2在物体1的左边（不相交）
            let check2 = obj2.posX+obj2.width<obj1.posX;
            // 是否物体1在物体2的上边（不相交）
            let check3 = obj1.posY+obj1.height<obj2.posY;
            // 是否物体2在物体1的上边（不相交）
            let check4 = obj2.posY+obj2.height<obj1.posY;
            return !(check1||check2||check3||check4);// true为碰撞，false为没有碰撞
        },
        handleCellclick(scope,i,j,k){
            if(!this.selectedLessonsEmpty && this.firstSelectedDay!=i){
                return;
            }
            let cell = scope.row[i+'^'+j+'^'+k];
            scope.row[i+'^'+j+'^'+k] = !cell;
            this.$refs.scheduleTable.doLayout();
            if(!scope.row[i+'^'+j+'^'+k]){
                // 如果是取消选中操作，判断表格所有的单元格是不是都没有被选中，是的话selectedLessonsEmpty置为true
                let hasSelected = false;
                this.tableData1.forEach((tableDataItem,i)=>{
                    this.scheduleTableProps.forEach(propItem=>{
                        if(tableDataItem[propItem]){
                            hasSelected = true;
                        }
                    })
                });
                if(!hasSelected){
                    this.selectedLessonsEmpty = true;
                }
            }else{
                // 如果是选中操作，判断此单元格是否是第一个被选中的
                if(this.selectedLessonsEmpty){
                    this.selectedLessonsEmpty = false;
                    this.firstSelectedDay = i;
                }
            }
        },
        handleTableData1(){
            this.tableData1 = this.tableData1.map(tableDataItem=>{
                this.scheduleTableProps.forEach(propItem=>{
                    tableDataItem[propItem] = false;
                })
                return tableDataItem;
            });
        },
        // 清除选中的课节
        clearLessons(){
            this.tableData1.forEach((tableDataItem,i)=>{
                this.scheduleTableProps.forEach(propItem=>{
                    tableDataItem[propItem] = false;
                })
            });
            this.$refs.scheduleTable.doLayout();
            this.selectedLessonsEmpty = true;
        },
        // 生成进度表
        makeSchedule(){
            this.$router.push({
                path:'/teaching_management/visualized_course/schedule',
                query:{
                    semesterYear: this.semesterYear,
                    semesterYearNumber: this.semesterYearNumber,
                    curriculum_visual_id: this.curriculum_visual_id
                }
            })
        },
        // 查询课节
        queryCurriculumSection(){
            this.tableData1Loading = true;
            return this.$http.get('_ed:/scheduleVisualizing/queryCurriculumSection').then(res => {
                this.tableData1Loading = false;
				if(res.data&&res.data.length>0){
                    let tempNum = 0;
                    res.data.forEach((item1,i)=>{
                        let tempArr = item1.itemlist.map((item2,j)=>{
                            tempNum++;
                            return item2['sectionNode'+tempNum];
                        });
                        this.$set(this.lessons,i,tempArr);
                    });
                    tempNum = 0;
                    this.curriculumSection = res.data.map((item1,i)=>{
                        let itemlist = item1.itemlist.map((item2,j)=>{
                            tempNum++;
                            return {id:item2.section_nodeid,name:item2['sectionNode'+tempNum]};
                        });
                        return {section:item1.section,itemlist};
                    });
                }
                if(res.code!=0){
                    this.$message.error(res.msg);
                }
			}).catch(err => {
                this.tableData1Loading = false;
            })
        },
        computeScheduleTableProps(){
            let props = [];
            this.weekList.forEach((day,i)=>{
                this.lessons.forEach((item1,j)=>{
                    item1.forEach((item2,k)=>{
                        props.push(i+'^'+j+'^'+k);
                    })
                })
            });
            this.scheduleTableProps = props;
        },
        // 课表明细列表
        queryScheduleDetailVisual(){
            this.tableData2Loading = true;
            this.tableData2 = [];
            this.$http.post('_ed:/scheduleVisualizing/queryScheduleDetailVisual',{
                course_id: this.selectedCourse,
                // page_size: 0,
                // start_index: 0,
                visual_id: this.curriculum_visual_id,
            }).then(res=>{
                this.tableData2Loading = false;
            	if(res.data&&res.data.dataList&&res.data.dataList.length>0){
                    this.tableData2 = res.data.dataList;
                }
                if(res.code!=0){
                    this.$message.error(res.msg);
                }
			}).catch(()=>{
                this.tableData2Loading = false;
			})
        },
        // 查询班级列表
        queryAdministrativeClass(){
            this.tableData1 = [];
            return this.$http.post('_ed:/scheduleVisualizing/queryAdministrativeClass',{
                // cls_name:'',//行政班名称
                // grade:this.grade,//年级
                curriculum_visual_id:this.curriculum_visual_id,//课程表id
            }).then(res=>{
                if(res.data&&res.data.length>0){
                    this.tableData1 = res.data.map(item=>{
                        return {class:item.admin_cls_name,...item};
                    });
                }
                if(res.code!=0){
                    this.$message.error(res.msg);
                }
			}).catch(()=>{
			})
        },
        // 删除课表明细
        delDetailVisual({detail_visual_id}){
            this.$confirm('此操作将删除此课表明细, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get('_ed:/scheduleVisualizing/delDetailVisual/'+detail_visual_id).then(res => {
                    if(res.code==0){
                        this.$message.success('删除成功!');
                        this.queryScheduleDetailVisual();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 打开添加课表明细弹框
        openAddCourseDetailDialog(){
            let resultObj = this.checkSelectedSections();
            if(!resultObj){
                return false;
            }
            let params = {
                // 班级列表[{id,name}]
                selectedClasses:resultObj.selectedClasses,
                // 课节列表[{id,name}]
                selectedSections:resultObj.selectedSections,
                // 课程表id
                curriculumVisualId:this.curriculum_visual_id,
                // 课程表名称
                clsName:this.cls_name,
                // 学年
                year:this.semesterYear,
                // 学期
                semesterNum:this.semesterYearNumber,
                semesterID: this.$route.query.semesterID,
                // 周几
                selectedWeek:resultObj.selectedWeek,
                // 添加课表明细'add'
                action:'add',
            };
            this.$refs.addCourseDetail.getParams(params);
        },

        // 判断框选或者点选的是否正确，如果不正确返回false，否则返回班级列表[{id,name}]，课节列表[{id,name}]，周几1-7
        checkSelectedSections(){
            if(this.selectedLessonsEmpty){
                this.$message.warning('请先选择班级和课节！');
                return false;
            }
            let selectedClasses = [];
            this.tableData1.forEach(row=>{
                let hasSelected = false;
                let selectedClassItem;
                this.scheduleTableProps.forEach(prop=>{
                    if(row[prop]){
                        if(!hasSelected){
                            hasSelected = true;
                            selectedClassItem = {
                                name:row.admin_cls_name,
                                id:row.admin_cls_id,
                                selectedItems:[],
                            };
                        }
                        selectedClassItem.selectedItems.push(prop);
                    }
                });
                if(hasSelected){
                    selectedClasses.push(selectedClassItem);
                }
            });
            let selectedItems = selectedClasses[0].selectedItems;
            let isContinue = true;
            for(let i = 1; i < selectedItems.length; i++){
                let arr1 = selectedItems[i-1].split('^');
                let arr2 = selectedItems[i].split('^');
                let num1 = arr1[1]*5+(+arr1[2]);
                let num2 = arr2[1]*5+(+arr2[2]);
                if(num2-num1!=1){
                    isContinue = false;
                    break;
                }
            }
            if(!isContinue){
                this.$message.warning('选择的课节要连续！');
                return false;
            }
            if(selectedClasses.length>1){
                let tempFlag = true;
                for(let i = 1; i < selectedClasses.length; i++){
                    if(selectedClasses[0].selectedItems.join('^')!=selectedClasses[i].selectedItems.join('^')){
                        tempFlag = false;
                        break;
                    }
                }
                if(!tempFlag){
                    this.$message.warning('不同班级选择的课节要一致！');
                    return false;
                }
            }

            let returnObj = {
                // 班级列表[{id,name}]
                selectedClasses,
                // 课节列表[{id,name}]
                selectedSections:selectedItems.map(selectedItem=>{
                    let tempArr = selectedItem.split('^');
                    let tempObj = this.curriculumSection[tempArr[1]].itemlist[tempArr[2]];
                    return tempObj;
                }),
                // 周几
                selectedWeek:+selectedItems[0].split('^')[0]+1,
            };
            return returnObj;
        },

        // 批量复制
        batchCopy(){
            if(this.multipleSelection.length==0){
                this.$message.warning('请选择要复制的课表明细！');
                return false;
            }
            this.copyVisualDetail(this.multipleSelection.map(item=>item.detail_visual_id),'批量复制');
        },
        // 单独复制（不需要选择班级和课节）
        singleCopy2({detail_visual_id,section_nodenames,weekday,admin_cls_names}){
            let section_nodenamesArr = section_nodenames.split(',');
            let sectionNameIdMap = {};
            this.curriculumSection.forEach(curriculumSectionItem=>{
                curriculumSectionItem.itemlist.forEach(sectionNodeItem=>{
                    sectionNameIdMap[sectionNodeItem.name] = {id:sectionNodeItem.id,name:sectionNodeItem.name}
                });
            });
            let section_nodeids = section_nodenamesArr.map(nodename=>sectionNameIdMap[nodename]);

            let admin_cls_namesArr = admin_cls_names.split(',');
            let adminClsNameIdMap = {};
            this.tableData1.forEach(row=>{
                adminClsNameIdMap[row.admin_cls_name] = {id:row.admin_cls_id,name:row.admin_cls_name};
            });
            let admin_cls_ids = admin_cls_namesArr.map(item=>adminClsNameIdMap[item]);

            let params = {
                detail_visual_id,
                // 班级列表[{id,name}]
                selectedClasses:admin_cls_ids,
                // 周几
                selectedWeek:weekday,
                // 课节列表[{id,name}]
                selectedSections:section_nodeids,
                // 课程表名称
                clsName:this.cls_name,
                // 复制课表明细'copy'
                action:'copy',
            };

            this.$refs.addCourseDetail.getParams(params);
        },
        // 单独复制（需要选择班级和课节）
        singleCopy1({detail_visual_id}){
            // this.copyVisualDetail([detail_visual_id],'复制');
            let resultObj = this.checkSelectedSections();
            if(!resultObj){
                return false;
            }
            let params = {
                detail_visual_id,
                // 班级列表[{id,name}]
                selectedClasses:resultObj.selectedClasses,
                // 周几
                selectedWeek:resultObj.selectedWeek,
                // 课节列表[{id,name}]
                selectedSections:resultObj.selectedSections,
                // 课程表名称
                clsName:this.cls_name,
                // 复制课表明细'copy'
                action:'copy',
            };

            this.$refs.addCourseDetail.getParams(params);
        },

        // 单独复制
        singleCopy(params){
            if(this.selectedLessonsEmpty){
                this.singleCopy2(params);
            }else{
                this.singleCopy1(params);
            }
        },

        // 复制明细
        copyVisualDetail(detail_visual_ids,hintMsg){
            let resultObj = this.checkSelectedSections();
            if(!resultObj){
                return false;
            }
            this.$confirm('是否确认'+hintMsg+'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('_ed:/scheduleVisualizing/copyVisualDetail',{
                    //(Array[integer]): 行政班id数组
                    admin_cls_ids:resultObj.selectedClasses.map(item=>item.id),
                    //(integer): 用户id（老师id）
                    create_user:this.userid,
                    //(string): 用户名
                    create_username:this.username,
                    //(Array[integer]): 明细id数组
                    detail_visual_ids,
                    //(Array[integer]): 课节id数组
                    section_nodeids:resultObj.selectedSections.map(item=>item.id),
                    //(integer): 学年
                    semester_year:this.semesterYear,
                    //(integer): 学期
                    semester_year_number:this.semesterYearNumber,
                    //(integer): 星期
                    weekday:resultObj.selectedWeek,
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success(hintMsg+'成功！');
                        this.clearLessons();
                        this.queryScheduleDetailVisual();
                    }else{
                        if(res.data&&res.data.length>0){
                            this.conflictData = res.data;
                            this.clashShow = true;
                        }else{
                            this.$message.error(res.msg);
                        }
                    }
                }).catch(()=>{
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'+hintMsg
                });
            });
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑单条明细
        editDetail({detail_visual_id,publish_status}){
            this.$refs.addCourseDetail.getParams({
                detail_visual_id,
                publish_status,
                action:'modify',
                // 课程表名称
                clsName:this.cls_name,
            });
        },
        // 查询课程列表
        queryCourseDetail(){
            this.$http.get('_ed:/scheduleVisualizing/query/course/list/'+this.curriculum_visual_id).then(res => {
                (res.code == 0) && (this.courseList = res.data);
                (res.code != 0) && (this.$message.error(res.msg));
            }).catch(err => {
                this.$message.error(err.error)
            })
        },
        handleClick(tab, event){
            (tab.index == 1) && (this.activeName = 'classes');
            (tab.index == 2) && (this.activeName = 'course');
        },
    },
    created(){
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userid = storage.me.attributes.login_info.id || '';
            this.username = storage.me.user.name || '';
        }
        Promise.all([this.queryAdministrativeClass(),this.queryCurriculumSection()])
        .then(()=>{
            this.computeScheduleTableProps();
            this.handleTableData1();
        });
        this.queryScheduleDetailVisual();
        this.queryCourseDetail();
    },
    computed:{
        
    },
    watch:{
        'activeName'(val){
            (this.timer) && (this.quitTimer());
            if(val == 'writeDown'){
                this.queryScheduleDetailVisual()
            }
        }
    },
    filters:{
        weekdayMap(val){
            let tempObj = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',7:'日'};
            return tempObj[val];
        }
    },
}
</script>

<style>
    .schedule-table18235 .cell{
		cursor: pointer;
		display: block;
		height: 30px !important;
		line-height: 30px !important;
		padding-left: 0px !important;
		padding-right: 0px !important;
	}
	.schedule-table18235 table thead th>.cell{
		height: 28px !important;
		line-height: 28px !important;
	}
    .schedule-table18235 td{
		padding: 0 !important;
	}
	.schedule-table18235 th{
		padding: 0 !important;
	}
    .schedule-setting .el-tabs__header{
        margin: 0 10px 10px;
    }
    .schedule-setting .el-tabs__item{
        width: 28vw;
        text-align: center
    }
</style>


<style scoped>
    .btn-con1-outer{
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }
    .btn-con1{
        display: flex;
    }
    .btn-con1 p{
        margin-right: 60px;
        display: flex;
        align-items: center;
    }

    .course-selection {
        width: 300px;
    }

    .btn-con2{
        display: flex;
        padding: 20px 0;
        justify-content: space-between;
    }
    .my-table{
        padding-left: 10px;
        padding-right: 10px;
    }
    .lesson-item{
        width: 100%;
        height: 100%;
    }
    .lesson-item1{
        background-color: rgba(17,223,134,.1);
    }
    .lesson-item2{
        background-color: rgba(67,158,255,.1);
    }
    .lesson-item-selected{
        background-color: rgba(64,158,255,.5);
    }
    .schedule-table18235{
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .class-name{
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
        padding: 0 10px;
    }
</style>
