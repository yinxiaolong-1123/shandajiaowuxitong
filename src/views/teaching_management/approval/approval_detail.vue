<template>
    <section>
        <el-dialog 
            :before-close="handleClose"
            :title="dialogTitle.name" 
            :visible.sync="dialogVisible"  
            width="75%" 
            append-to-body 
            :close-on-click-modal="false">
            <table class="stationtable">
                <tr>
                    <td class="title" style="width:12%;">排课课程</td>
                    <td :colspan="colWidth2" class="textleft">{{excourseObj.courseArrange}}</td>
                </tr>
                <tr>
                    <td class="title">上  课  班</td>
                    <td :colspan="colWidth2" class="textleft">{{excourseObj.clsName}}</td>
                </tr>
                <tr>
                    <td class="title">调课理由</td>
                    <td :colspan="colWidth2" class="textleft">{{excourseObj.exchangeExcuse}}</td>
                </tr>
                <tr>
                    <td class="title">调课类型</td>
                    <td :colspan="colWidth2" class="textleft  backgroundstyle">{{excourseObj.exchangeType | exchangeTypeFn}}</td>
                </tr>
                <tr>
                    <td class="title">辅助说明</td>
                    <td :colspan="colWidth2" class="textleft">{{excourseObj.instruction}}</td>
                </tr>
                <tr>
                    <td class="title">状 态</td>
                    <td :colspan="colWidth2" class="textleft">{{excourseObj.status | statusFn}}</td>
                </tr>
            
                <tr v-if="excourseObj.exchangeType==4">
                    <td class="title"> </td><td :colspan="colWidth3">申请调课课程</td>
                    <td :colspan="colWidth3">更换课程</td></tr>
                <tr v-else>
                    <td class="title"></td>
                    <td :colspan="colWidth3">调课前</td>
                    <td :colspan="colWidth3">调课后</td>
                </tr>
                <!-- <tr><td class="title" v-if="excourseObj.exchangeType==4" >测试</td><td :colspan="colWidth4" class="textleft">{{excourseObj.instruction}}</td></tr> -->
                <tr v-if="excourseObj.exchangeType==4" >
                    <td v-if="excourseObj.exchangeType==4" class="title"></td>
                    <td v-if="excourseObj.exchangeType==4" :colspan="colWidth1" style="width:22px;">原安排</td>
                    <td v-if="excourseObj.exchangeType==4" :colspan="colWidth1" style="width:22px;">新安排</td>
                    <td :colspan="colWidth1" style="width:22px;">原安排</td>
                    <td :colspan="colWidth1" style="width:22px;">新安排</td>
                </tr>
                <tr>
                    <td class="title">授课课程</td>
                    <td :style="{width:excourseObj.exchangeType==4?'22%':'44%'}" :colspan="colWidth5">{{excourseObj.courseArrange}}</td>
                    <td :style="{width:excourseObj.exchangeType==4?'22%':'44%'}" :colspan="colWidth5">
                        <template v-if="excourseObj.exchangeType==4">
                            {{excourseObj.courseArrange}}
                        </template>
                        <template v-else>
                            {{excourseObj.replacedCourseArrange}}
                        </template>
                    </td>
                    <td style="width:22%;" v-if="excourseObj.exchangeType==4" :colspan="colWidth5">{{excourseObj.replacedCourseArrange}}</td>
                    <td style="width:22%;" v-if="excourseObj.exchangeType==4" :colspan="colWidth5">{{excourseObj.replacedCourseArrange}}</td>
                </tr>
                <tr>
                    <td class="title">授课内容</td>
                    <td :colspan="colWidth5">{{excourseObj.teachingContent}}</td>
                    <td :colspan="colWidth5">
                        <template v-if="excourseObj.exchangeType==4">
                            {{excourseObj.teachingContent}}
                        </template>
                        <template v-else>
                            {{excourseObj.ndTeachingContent}}
                        </template>
                    </td>
                    <td v-if="excourseObj.exchangeType==4" :colspan="colWidth5">{{excourseObj.ndTeachingContent}}</td>
                    <td v-if="excourseObj.exchangeType==4" :colspan="colWidth5">{{excourseObj.ndTeachingContent}}</td>
                </tr>
                <tr>
                    <td class="title">授课老师</td>
                    <td>
                        <span>{{excourseObj.teacherNames}}</span>
                    </td>
                    <td v-if="excourseObj.exchangeType==4">
                        <div>
                            <span>
                                {{excourseObj.teacherNames}}
                            </span>
                        </div>
                    </td>
                    <template v-else>
                        <td :class="{backgroundstyle:excourseObj.singleType==1}"
                            v-if="dialogTitle.type==1">
                            {{excourseObj.ndTeacherNames}}
                        </td>
                        <template v-else>
                            <template v-if="!excourseObj.editPower||excourseObj.singleType==1">
                                <td class="backgroundstyle" v-if="excourseObj.singleType==1">
                                    <span>
                                        {{excourseObj.ndTeacherNames}}
                                    </span>
                                </td>
                                <td v-else>
                                    <span>
                                        {{excourseObj.ndTeacherNames}}
                                    </span>
                                </td>
                            </template>
                            <template v-else>
                                <td v-if="excourseObj.singleType!=1">
                                    <span> 
                                        {{excourseObj.ndTeacherNames}}
                                    </span>
                                </td>
                                <td class="backgroundstyle" v-else>
                                    <el-select 
                                        v-model="excourseObj.ndTeacherId"
                                        placeholder="请选择老师" 
                                        size="mini"
                                        clearable 
                                        filterable>
                                        <el-option 
                                            v-for="item in teacherList" 
                                            :key="item.id" 
                                            :label="item.name" 
                                            :value="item.id"> 
                                        </el-option>
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    <template v-if="excourseObj.exchangeType==4">
                        <td v-if="dialogTitle.type==1">
                            {{excourseObj.ndTeacherNames}}
                        </td>
                        <template v-else>
                            <td v-if="!excourseObj.editPower">
                                {{excourseObj.ndTeacherNames}}
                            </td>
                            <template v-else>
                                <td class="backgroundstyle">
                                    <div v-if="excourseObj.singleType!=1">
                                        {{excourseObj.ndTeacherNames}}
                                    </div>
                                    <el-select
                                        v-else
                                        v-model="excourseObj.ndTeacherId"
                                        placeholder="请选择老师" 
                                        size="mini"
                                        clearable 
                                        filterable>
                                        <el-option 
                                            v-for="item in teacherList" 
                                            :key="item.id" 
                                            :label="item.name" 
                                            :value="item.id"> 
                                        </el-option>
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    <td v-if="excourseObj.exchangeType==4">
                        <!-- <template>
                            <div></div>
                        </template> -->
                        <span>
                            {{excourseObj.ndTeacherNames}}
                        </span>				
                    </td>
                </tr>
                <tr>
                    <td class="title">授课日期</td>
                    <td>
                        <div>
                            {{excourseObj.scheduleitemDate}}
                        </div>
                    </td>
                    <template>
                        <template v-if="dialogTitle.type==1"> 
                            <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                <span>{{excourseObj.ndscheduleitemDate}}</span>
                            </td>
                            <td v-else>
                                {{excourseObj.ndscheduleitemDate}}
                            </td>
                        </template>
                        <template v-else>
                            <template v-if="!excourseObj.editPower">
                                <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                    <span>{{excourseObj.ndscheduleitemDate}}</span>
                                </td>
                                <td v-else>
                                    <span>{{excourseObj.ndscheduleitemDate}}</span>
                                </td>  
                            </template>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                            <!-- <div class="backgroundstyle" v-if="excourseObj.singleType==2" >
                                    <span>	{{excourseObj.ndscheduleitemDate}}</span>
                                </div> -->
                                    {{excourseObj.ndscheduleitemDate}}
                                </td>
                                <td v-else class="backgroundstyle">
                                    <el-date-picker
                                        v-model="excourseObj.ndscheduleitemDate"
                                        value-format="yyyy-MM-dd" placeholder="请选择日期"
                                        size="small" style="width:90%">
                                    </el-date-picker>
                                </td>
                            </template>
                        </template>
                    </template>

                    <template v-if="excourseObj.exchangeType==4">
                        <td v-if="dialogTitle.type==1">
                            {{excourseObj.ndscheduleitemDate}}
                        </td>
                        <template v-else>
                            <td v-if="!excourseObj.editPower">
                                {{excourseObj.ndscheduleitemDate}}
                            </td>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                    {{excourseObj.ndscheduleitemDate}}
                                </td>
                                <td class="backgroundstyle" v-else>
                                    <el-date-picker v-model="excourseObj.ndscheduleitemDate"
                                        value-format="yyyy-MM-dd" placeholder="请选择日期"
                                        size="small" style="width:90%">
                                    </el-date-picker>
                                </td>
                            </template>
                        </template>
                    </template>
                    <td v-if="excourseObj.exchangeType==4"
                        :class="{backgroundstyle:excourseObj.singleType==2}">
                        <div v-if="excourseObj.singleType==2">
                            {{excourseObj.scheduleitemDate}}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="title">授课课节</td>
                    <td>
                        <template v-if="excourseObj.scheduleitemWeek !== null">
                            第{{excourseObj.scheduleitemWeek}}周&nbsp;
                        </template>
                        <template v-if="excourseObj.scheduleitemWeekDay !== null">
                            星期{{numlist[+excourseObj.scheduleitemWeekDay]}}&nbsp;
                        </template>
                        <template v-if="excourseObj.sectionNodenames">第{{excourseObj.sectionNodenames}}节</template>
                    </td>
                    <template>
                        <template v-if="dialogTitle.type==1">
                            <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                <span>
                                    <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                    <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                        星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                    </template>
                                    <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                                </span>
                            </td>
                            <td v-else>
                                <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                    星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                </template>
                                <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                            </td>
                        </template>
                        <template v-else>
                            <template v-if="!excourseObj.editPower">
                                <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                    <span>
                                        <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                        <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                            星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                        </template>
                                        <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                                    </span>
                                </td>
                                <td v-else>
                                    <span>
                                        <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                        <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                            星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                        </template>
                                        <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                                    </span>
                                </td>
                            </template>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                    <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                    <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                        星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                    </template>
                                    <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                                </td>
                                <td class="backgroundstyle" v-else>
                                    <el-select
                                        v-model="mysectionNodeids" 
                                        placeholder="请选择课节" 
                                        @change="getndsectionNodeidname"
                                        size="small"
                                        style="width:90%"
                                        multiple
                                        clearable 
                                        filterable>
                                        <el-option 
                                            v-for="(item,index) in lessonList" 
                                            :key="index" 
                                            :label="item.name" 
                                            :value="index"> 
                                        </el-option>
                                        <!-- <el-option label="X" value="9999"></el-option> -->
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    
                    <template v-if="excourseObj.exchangeType==4">
                        <td v-if="dialogTitle.type==1">
                            <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                            <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                            </template>
                            <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                        </td>
                        <template v-else>
                            <td v-if="!excourseObj.editPower">
                                <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                    星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                </template>
                                <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                            </td>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                    <template v-if="excourseObj.ndscheduleitemWeek !== null">第{{excourseObj.ndscheduleitemWeek}}周&nbsp;</template>
                                    <template v-if="excourseObj.ndscheduleitemWeekDay !== null">
                                        星期{{numlist[+excourseObj.ndscheduleitemWeekDay]}}&nbsp;
                                    </template>
                                    <template v-if="excourseObj.ndsectionNodenames">第{{excourseObj.ndsectionNodenames}}节</template>
                                </td>
                                <td class="backgroundstyle" v-else>
                                    <el-select
                                        v-model="mysectionNodeids"  
                                        @change="getndsectionNodeidname"
                                        placeholder="请选择课节" 
                                        size="small"
                                        style="width:90%"
                                        multiple 
                                        clearable 
                                        filterable>
                                        <el-option 
                                            v-for="(item,index) in lessonList" 
                                            :key="item.id" 
                                            :label="item.name" 
                                            :value="index"> 
                                        </el-option>
                                        <!-- <el-option label="X" value="9999"></el-option> -->
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    <td v-if="excourseObj.exchangeType==4"
                        :class="{backgroundstyle:excourseObj.singleType==2}">
                        <div v-if="excourseObj.singleType==2">
                            <span>
                                <template v-if="excourseObj.scheduleitemWeek !== null">第{{excourseObj.scheduleitemWeek}}周&nbsp;</template>
                                <template v-if="excourseObj.scheduleitemWeekDay !== null">
                                    星期{{numlist[+excourseObj.scheduleitemWeekDay]}}&nbsp;
                                </template>
                                <template v-if="excourseObj.sectionNodenames">第{{excourseObj.sectionNodenames}}节</template>
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="title">授课场地</td>
                    <td>
                        <div>
                            <span>{{excourseObj.areaName}}</span>
                        </div>
                    </td>
                    <template>
                        <template v-if="dialogTitle.type==1">
                            <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                <span>{{excourseObj.ndareaName}}</span>
                            </td>
                            <td v-else>
                                <div>
                                    <span>{{excourseObj.ndareaName}}</span>
                                </div>
                            </td>
                        </template>
                        <template v-else>
                            <template v-if="!excourseObj.editPower">
                                <td class="backgroundstyle" v-if="excourseObj.singleType==2">
                                    <span>{{excourseObj.ndareaName}}</span>
                                </td>
                                <td v-else>
                                    <span>{{excourseObj.ndareaName}}</span>
                                </td>
                                <!-- {{excourseObj.ndareaName}} -->
                            </template>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                    <div>
                                        <span>{{excourseObj.ndareaName}}</span>
                                    </div>
                                </td>
                                <td v-else class="backgroundstyle">
                                    <el-select
                                        v-model="excourseObj.ndareaId" 
                                        @change="ndareaIdChange"
                                        placeholder="请选择场地" 
                                        size="small"
                                        style="width:90%"
                                        clearable 
                                        filterable
                                        multiple
                                        remote
                                        :loading="loading">
                                        <el-option 
                                            v-for="(item,index) in areaList" 
                                            :key="index" 
                                            :label="item.name" 
                                            :value="item.id"> 
                                        </el-option>
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    <template v-if="excourseObj.exchangeType==4">
                        <td v-if="dialogTitle.type==1">
                            <span>{{excourseObj.ndareaName}}</span>
                        </td>
                        <template v-else>
                            <td v-if="!excourseObj.editPower">
                                <div>
                                    <span>{{excourseObj.ndareaName}}</span>
                                </div>
                            </td>
                            <template v-else>
                                <td v-if="excourseObj.singleType==1">
                                    <div>
                                        <span>{{excourseObj.ndareaName}}</span>
                                    </div>
                                </td>
                                <td class="backgroundstyle" v-else>
                                    <el-select 
                                        v-model="excourseObj.ndareaId" 
                                        @change="ndareaIdChange"
                                        placeholder="请选择场地" 
                                        size="small"
                                        style="width:90%"
                                        clearable 
                                        filterable
                                        multiple
                                        remote
                                        :loading="loading">
                                        <el-option 
                                            v-for="(item,index) in areaList" 
                                            :key="index" 
                                            :label="item.name" 
                                            :value="item.id"> 
                                        </el-option>
                                    </el-select>
                                </td>
                            </template>
                        </template>
                    </template>
                    <td v-if="excourseObj.exchangeType==4"
                        :class="{backgroundstyle:excourseObj.singleType==2}">
                        <div v-if="excourseObj.singleType==2">
                            <span> {{excourseObj.areaName}}</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="title">审核记录</td>
                    <td :colspan="colWidth2" class="textleft">
                        <el-button type="text" @click="showRecord">查看审核记录</el-button>
                    </td>
                </tr>
            </table>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDetail">关闭</el-button>
                <el-button type="primary" @click="audit(1)" v-if="dialogTitle.type==0">不同意</el-button>
                <el-button type="primary" @click="audit(0)" v-if="dialogTitle.type==0">同意</el-button>
            </span>
        </el-dialog>

        <records v-if="dialogAudit"
        :dialogAudit.sync="dialogAudit"
        :semestercourseid="semestercourseid"
        ></records>

        <opinions v-if="opinionDiolog"
        :opinionDiolog.sync="opinionDiolog"
        :excourseObj="excourseObj"
        :type="type"
        ></opinions>
    </section>
</template>
<script>
import util from '@/util';
import moment from 'moment';
import {mapState} from 'vuex';
import records from './records';
import opinions from './opinions';

export default {
    name: 'approval_detail',
    provide(){
        return {
            closeDetail: this.closeDetail
        }
    },
    props: {
        showType:{
            type: Number,
            default: 1,
        },
        recoreid:{
            type: String,
            default: '',
        },
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        dialogTitle: {
            type: Object,
            default: {}
        },
    },
    data () {
        return {
            loading: false,
            dialogAudit: false,
            opinionDiolog: false,
            colWidth1:1,
            colWidth4:4,
            colWidth2:4,
            colWidth3:2,
            colWidth5:0.7,
            teacherList:[],//教师列表
            lessonList:[],//课节
            areaList:[],//授课场地
            mysectionNodeids: '',
            type: 0,
            scrollLoading: {},
            semestercourseid: 0,
            excourseObj: {},
            numlist: ['','一','二','三','四','五','六','日'],
        }
    },
    components: {
        records,
        opinions,
    },
    mounted(){
        this.openFullScreen();
        this.$http.post("_ed:/exchangecourse/query/courseexdetail",{
            courseTaskId: this.recoreid
        }).then(res=>{
            this.scrollLoading.close();
            if(res.code == 0){
                this.openDialogs(this.showType, res.data, res.data.id);
            }else{
                this.$message(res.msg);
            }
        }).catch(()=>{
            this.scrollLoading.close();
            this.$message('后台错误');
        })
    },
    methods: {
        handleClose () {
            this.closeDetail();
        },
        closeDetail () {
            this.$emit('update:dialogVisible',false);
        },
        showRecord () {
            this.dialogAudit = true;
        },
        audit (type) {
            this.type = type;
            this.opinionDiolog = true;
        },
        openFullScreen() {
			this.scrollLoading = this.$loading({
				lock: true,
				text: '努力加载中···',
			});
		},
        openDialogs(type,row,id){
            if(type == 0){
                if(row.exchangeType==3||row.singleType){
                    // this.excourseObj.scheduleitemDate= moment(row.scheduleitemDate).format('YYYY-MM-DD');
                    this.excourseObj.ndsectionNodenames=row.ndsectionNodenames
                    //   this.ndscheduleitemDate = moment(row.ndscheduleitemDate).format('YYYY-MM-DD');
                }
            }
        
            this.semestercourseid = +row.id;
            row.scheduleitemDate= row.scheduleitemDate || '';
            if (row.scheduleitemDate * 1 > 0) {
                row.scheduleitemDate = moment(row.scheduleitemDate).format('YYYY-MM-DD');
            }

            row.ndscheduleitemDate = row.ndscheduleitemDate || '';
            if (row.ndscheduleitemDate * 1 > 0) {
                row.ndscheduleitemDate = moment(row.ndscheduleitemDate).format('YYYY-MM-DD');
            }
        
            row.ndareaId = row.ndareaIds.length == 0 ? [] : row.ndareaIds;
            row.ndTeacherId = row.ndTeacherIds || '';
            this.excourseObj = JSON.parse(JSON.stringify(row));
            
            this.scrollLoading.close();
        },
        getTeacher(key){//获取教师
            this.$http.get("_op:/teachers/combox/"+key).then(data=>{
                if(data.code==0){
                    if(data.data){
                        this.teacherList = data.data;
                    }
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        geLessonList(obj){//获取课节
            this.$http.get("_op:/sections/find").then(data=>{
                let arr= []
                if(data.code==0){
                    if(data.data){
                        this.lessonList = data.data; 
                        // console.log('lessonList',this.lessonList);
                        //遍历 对应课节在数组的位置
                        for(let i=0;i<obj.ndsectionNodeids.length;i++){
                            for(let k=0;k<data.data.length;k++){
                                if(obj.ndsectionNodeids[i]==data.data[k].id){
                                    arr.push(k)
                                }
                            }
                        }
                    }
                }else{
                    this.$message.error(data.msg);
                }
                this.mysectionNodeids = arr 
            })
        },
        getndsectionNodeidname(val){
            let arr = [],arr2 = [];

            for(let i = 0; i < val.length; i++){
                arr.push(this.lessonList[val[i]].id)
                arr2.push(this.lessonList[val[i]].name)
            }

            this.excourseObj.ndsectionNodeids = arr;
            this.excourseObj.ndsectionNodenames = arr2;
        },
        ndareaIdChange(){
            let areaNameArr = [];
            this.areaList.map(item=>{
                this.excourseObj.ndareaId.map(item2 => {
                    if(item.id == item2){
                        areaNameArr.push(item.name)
                    }
                })
            })
            this.excourseObj.ndareaName = Array.from(new Set(areaNameArr)).toString();
        },
        getArea(str){
            let self=this;
            this.loading = true;
            this.$http.post("_ed:/exchangecourse/query/area",{
                str:str
            }).then(data=>{
                let areaArr = [];
                data.data.map(item=>{
                    if(self.excourseObj.ndareaId.indexOf(item.id) == -1){
                        areaArr.push({
                            id: item.id,
                            name: item.name
                        })
                    }
                })
                if(areaArr.length){
                    data.data = data.data.concat(areaArr)
                }
                this.areaList = data.data;
                this.loading = false;
            }).catch(()=>{
            })
        },
    },
    watch:{
        ['excourseObj.id'] () {
            if(this.excourseObj.exchangeType==4){
                this.colWidth3 = 2;
            }else{
                this.colWidth3 = 1;
            }
            
            if(this.excourseObj.editPower){//是否能编辑
                if(this.excourseObj.singleType == 1){
                    this.getTeacher('');
                }else{
                    this.geLessonList(this.excourseObj);
                    this.getArea();
                }
            }
        }
    },
    filters: {
        formatTime: util.getTime1,
        statusFn(val){
            let statutext='';
            switch (val){
                case 0: statutext='处理中'
                    break;
                case 1: statutext='调课成功'
                    break;
                case 2: statutext='调课失败'
                    break;
                case 3: statutext='撤销调课'
                    break;
                default:
                    break;
            }
            return statutext;
        },
        exchangeTypeFn(val){
            // console.log('调课类型', val)
            let typetext='';
            switch (val){
                case 1: typetext='统一调课'
                    break;
                case 2: typetext='取消调课'
                    break;
                case 3: typetext='单独调课'
                    break;
                case 4: typetext='互换调课'
                    break;
                default:
                    break;
            }
            return typetext;
        },
        singleTypeFn(val){
            // console.log('调课类型', val)
            let typetext='';
            switch (val){
                case 1: typetext='更换老师'
                    break;
                case 2: typetext='更换时间场地'
                    break;
                
                default:
                    break;
            }
            return typetext;

        },
        dateFn(val){
            if (val!=null&&val!='') {
                return moment(val).format('YYYY-MM-DD ')
            }
        }
    },
}
</script>
<style scoped lang="less">
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
  	td {
	  border: 1px solid #dfe6ec;
      line-height: 20px;
      padding: 10px;
	}
	.title{
		background-color: #DCDFE6;
		width: 10%;
	}
	.textleft{
		text-align: left;
		padding-left: 20px;
	}
	.backgroundstyle{
		background: rgb(245, 245, 198);
	}
	.backgroundstyles{
		background: rgb(245, 245, 198);
		width: 110%
	}
}
</style>