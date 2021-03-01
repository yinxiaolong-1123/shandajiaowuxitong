<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <div class="choose-condition">
                <el-form label-width="80px" size="mini" style="display:inline-flex;padding-bottom:20px;">
                    <el-form-item label="周次">
                        <el-select v-model="weekIndex" placeholder="请选择周次" @change="chooseDate = ''">
                            <el-option v-for="week in weekListOptions" :label="week.label" :value="week.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授课日期">
                        <el-date-picker v-model="chooseDate" type="date" @change="weekIndex = ''" 
                        placeholder="选择日期" value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="mini" @click="queryscheduleitem">查询</el-button>
            </div>

            <table border class="schedule-table">
                <tr>
                    <th rowspan="2">周次</th>
                    <th colspan="7" style="font-weight:bold;">第 {{ nowWeek }} 周</th>
                </tr>
                <tr>
                    <th v-for="(item,i) in weekdays">
                        <b>周{{numMap[i]}}</b><br/>{{item.date||'&nbsp;'}}
                    </th>
                </tr>
                <tr v-if="tableData.length==0">
                    <td colspan="8"><br/>暂无数据<br/><br/></td>
                </tr>

                <template v-else>
                    <tr v-for="(item,i) in tableData">
                        <td style="line-height:14px;" class="td1">
                            <span class="lesson-index">第{{item.name}}节</span>
                            <br/>
                            <span style="font-size:14px;">
                                {{item.start_time.slice(0,5)}}-{{item.end_time.slice(0,5)}}
                            </span>
                        </td>
                        <td v-for="(item2,j) in item.rowData" class="td2"
                            v-if="item2.isShow"
                            :rowspan="item2.rowspan"
                            @click="queryscheduledetail(item2)">
                            <!-- {{item2.content}} -->
                            <template v-for="(item3,k) in item2.schedules">
                                {{item3.content}}
                                <template v-if="k<item2.schedules.length-1"><br/><br/></template>
                            </template>
                        </td>
                    </tr>
                </template>
                
            </table>
        </div>

        <!-- 课程详情 -->
        <!-- <course-detail
			:dialogDet.sync="showCourseDetail"
			:adjustObj="adjustObj">
		</course-detail> -->

        <el-dialog
			title="课程详情"
			:visible.sync="showCourseDetail"
			:append-to-body="true"
			width="40%">
			
			<div class="adjust-box" v-for="(adjustObj,index) in courseDetailList" :key="index">
				<div class="det-box">
					<p class="title">课程</p>
					<p class="adjust-line">排课课程： {{adjustObj.course}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">课程内容</p>
					<p class="adjust-line">授课形式： {{adjustObj.teaching_formname}}</p>
					<p class="adjust-line">授课内容： {{adjustObj.teaching_content}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">授课资源</p>
					<p class="adjust-line">授课老师： {{adjustObj.teacher_names}}</p>
					<p class="adjust-line">授课场地： {{adjustObj.area_name}}</p>
					<p class="adjust-line">课程时间： {{adjustObj.schedule_item_date}}</p>
					<p class="adjust-line">课 &nbsp; &nbsp; 节： {{adjustObj.section_nodenames}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">上课班信息</p>
					<p class="adjust-line">上课班： {{adjustObj.class_name}}</p>
					<p class="adjust-line">教学模式： {{adjustObj.teachingMode==0?'普通教学':'全英教学'}}</p>
					 <p class="adjust-line">分组名称： {{adjustObj.group_numbers==''?'不分组':adjustObj.group_numbers}}</p>
				</div>
                <el-divider v-if="courseDetailList.length-1 != index"></el-divider>
			</div>
		</el-dialog>
    </section>
</template>
<script>
import util from '@/util';

export default {
    data () {
        return {
            breadcrumb: [
                {label: "个人中心"},
                {label: "我的课表"}
            ],
            weekList: [],
            weekListOptions: [],
            chooseDate: '',
            weekIndex: '',
            nowWeek: '',
            weekdays:[{date:''},{date:''},{date:''},{date:''},{date:''},{date:''},{date:''}],
            numMap:['一','二','三','四','五','六','日'],
            tableData: [],
            showCourseDetail: false,
            courseDetailList: [],
            scrollLoading: {},
            startTime: '',
            endTime: '',
            pickerOptions:{}
        }
    },
    mounted () {
        this.queryStartAndEndTime();
        this.queryscheduleweek();
        this.pickerOptions.disabledDate = (time) => {
            if(this.startTime && this.endTime){
                let _start = new Date(this.startTime);
                let new_start = new Date(_start.setDate(_start.getDate() - 1)).getTime();//原来基础上减一天
                let _end = new Date(this.endTime).getTime();
                if (new_start < time.getTime() && time.getTime() <= _end) {
                    return false
                }
                return true
            }
        }
    },
    methods: {
        openFullScreen() {
			this.scrollLoading = this.$loading({
				lock: true,
				text: '努力加载中···',
			});
        },
        queryscheduleweek(){
            this.$http.get("_ed:/term/selectWeekList").then(res => {
                if(res.code == 0){
                    this.weekList = res.data;
                    this.weekListOptions = res.data.map(item=>{
                        return {label:'第'+item.week+'周',value:item.week}
                    });
                    res.data.forEach((item,i)=>{
                        if(item.current_week == 't'){
                            this.weekIndex = item.week;
                        }
                    });
                    this.queryscheduleitem();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        queryStartAndEndTime(){
            this.$http.get("_ed:/term/queryStartAndEndTime").then(res => {
                if(res.code == 0){
                    this.startTime = res.data.startTime;
                    this.endTime = res.data.endTime;
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                this.$message.error(err.msg);
            })
        },
        queryscheduleitem(){
            let postData = {
                userid:util.getStorage('loginId') || JSON.parse(util.getStorage('vuex')).me.user.id,
                week: this.weekIndex,
                weekdate: this.chooseDate,
                type:2, //1老师 2学生
            };
            this.$http.post("_ed:/schedule/query/student/week/schedule",postData).then(res => {
                if(res.code == 0){
                    this.nowWeek = res.data.week;
                    this.weekdays = [];
                    for(let i = 1; i < 8; i++){
                        let findResult = res.data.weekdays.find(item=>item.week_day==i);
                        if(findResult){
                            this.weekdays.push(findResult);
                        }else{
                            this.weekdays.push({date:''});
                        }
                    }

                    let tableData = [];
                    res.data.data.forEach( (item,i) => {
                        tableData.push(item);
                        let weekWordArr = [
                            'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
                        ];
                        let rowData = [];
                        weekWordArr.forEach(dayKey=>{
                            let days = item[dayKey]?JSON.parse(item[dayKey]):null;
                            function sliceWord(word){
                                if(word&&word.length>12){
                                    return word.slice(0,12)+'...';
                                }else{
                                    return word;
                                }
                            }
                            let rowItem = {
                                    isShow:true,
                                    rowspan:1,
                                    schedule_item_ids:'',
                                    schedules:[
                                        // {course_id:,content:,stage_group:,schedule_item_id:,schedule_item_date:},
                                    ],
                                };
                            if(days && days.length>0){
                                days.forEach(day=>{
                                    if(day){
                                        day.f2 = sliceWord(day.f2);
                                        day.f3 = sliceWord(day.f3)
                                    }
                                    let content = day?day.f2+'@'+day.f3:'';
                                    let course_id = day?day.f5:'';
                                    let stage_group = day?day.f6:[];

                                    rowItem.schedules.push({
                                        course_id,
                                        content,
                                        stage_group,
                                        schedule_item_id:day?day.f1:'',
                                        schedule_item_date:day?day.f7:'',
                                    });
                                })
                            }
                            if(rowItem.schedules.length>0){
                                rowItem.schedule_item_ids = rowItem.schedules.map(item=>item.schedule_item_id).sort().join('^');
                            }
                            rowData.push(rowItem);
                        });

                        tableData[i].rowData = rowData;
                    });
                    tableData.forEach((row,i) => {
                        row.rowData.forEach((item,j) => {
                            if(item.schedule_item_id){
                                // 如果当天这个时间段有课程就去判断上一个时间段有没有相同的课程，如果有就不显示。
                                if(i>0 && tableData[i-1].rowData[j].schedule_item_ids == item.schedule_item_ids){
                                    tableData[i].rowData[j].isShow = false;
                                }
                                // 还要判断之后的时间段有没有相同的课程如果有要计算跨多少行
                                for(let k = i + 1; k < tableData.length; k++){
                                    if(tableData[k].rowData[j].schedule_item_ids == item.schedule_item_ids){
                                        tableData[i].rowData[j].rowspan++;
                                    }else{
                                        break;
                                    }
                                }
                            }

                        });
                    });
                    this.tableData = tableData;
                }else{
                    this.$message.error(res.msg);
                    this.tableData = [];
                }
            })
        },
        queryscheduledetail(item){
            this.courseDetailList = [];
            if(item.schedules && item.schedules.length>0){
                let scheduleItemIds = item.schedules.map(item=>item.schedule_item_id).sort();
                this.openFullScreen();
                this.$http.post("_ed:/schedule/item/query/detail",{schduleItemIds:scheduleItemIds}).then(res => {
                    if(res.data){
                        this.courseDetailList = res.data;
                        this.showCourseDetail = true;
                    }else{
                        this.$message(res.msg);
                    }
                }).then(()=>{
                    this.scrollLoading.close();
                }).catch(() => {
                    this.scrollLoading.close();
                });
            }
        },
    }
}
</script>
<style scoped lang="less">
    .choose-condition{
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .schedule-table{
        width: 100%;
        border: 1px solid #d6d5d5;
    }
    .schedule-table th{
        background-color:#f7f7f7;
        font-size: 14px;
        height: 32px;
        font-weight: normal;
    }
    .schedule-table td{
        text-align: center;
        word-break: break-all;
    }
    .schedule-table .td1{
        font-size: 12px;
        padding: 5px 2px 5px;
    }
    .schedule-table .td2{
        font-size: 12px;
        padding: 2px;
        cursor: pointer;
    }
    .schedule-table th,.schedule-table td{
        width: 12.5%;
    }
    .lesson-index{
        color: #409EFF;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 3px;
    }
    .adjust-box{
        width: 90%;
        margin: auto;
        .det-box{
            margin-bottom: 30px;
            .title{
                font-weight: bold;
                margin-bottom: 10px;
            }
            .adjust-line{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                label{width: 15%;margin-right: 20px;text-align: right;}
                .el-input , .el-select{width: 60%;}
            }
        }
    }
</style>
