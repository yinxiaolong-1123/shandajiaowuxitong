<template>
    <section class="cm-container" >
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form size="mini" :inline="true"  :model="formDetails" ref="formDetails"  :rules="rules" >
                         <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
                        <el-form-item label="学期" prop="semester">
                            <el-select 
                            clearable
                                v-model="formDetails.semester"
                                @change="getCourseList()"
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="所在级" prop="grade">
                            <intelligent-year-picker
                                style="width: 100px;"
                            	:clearable="false"
                                v-model="formDetails.grade"
                                type="year" 
                                 @change="getCourseList('grade')"
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        
                        <el-form-item label="专业" prop="majorId">
                            <el-select v-model="formDetails.majorId"
                             filterable
                             	:clearable="false"
                             @change="getCourseList()"
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="课程" prop="courseId">
                            <el-select :clearable="false"
                            :disabled="formDetails.majorId==''"
                            v-model="formDetails.courseId" 
                            filterable placeholder="选择课程">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.courseName" :value="list.courseId" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="btn">
                                <el-button type="primary" size="mini" @click="onSearchsub"   v-if="hasPermission('kechengchengjiluru', 'query')">查询</el-button>
                            </div>
                        </el-form-item>
                    </div>
            </el-form>
        </div>
        
        <div class="cm-btn-con"  style="margin-top:10px;">
        	<div class="conbox">
        		<div>
                    <template v-if="readyToPrint == false">
                        <el-button size="mini" type="primary" @click="submitScore()">提交</el-button>
                        <el-button size="mini" type="secondary" @click="backto()">退回修改</el-button>
                    </template>
                    <template v-else>
		                <!-- <el-button size="mini" type="secondary" @click="openPrintDalong()">打印</el-button> -->
                        <el-dropdown split-button type="secondary" trigger="click" size="mini" style="margin-left: 10px" @command="queryScoreRecordDetails">
                            打印
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="composeValue('stage', null)">阶段成绩</el-dropdown-item>
                                <el-dropdown-item :command="composeValue('course', null)">课程成绩</el-dropdown-item>
                                <el-dropdown-item v-for="item in courseScoreModel.scoreTypeMap" :key="item.id" :command="composeValue('normal', item)">
                                    {{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template>
                              <el-button size="mini" type="primary" @click="exportTable('formDetails')" >导出</el-button>
                                <a v-show="false" ref="exportExcel"></a>
                    </template>
        		</div>
        		<!-- <div>
        			共<i>{{courseScoreModel.total&&courseScoreModel.total!=null?courseScoreModel.total:'-'}}</i>阶段,当前第<i>{{courseScoreModel.stage&&courseScoreModel.stage!=null?courseScoreModel.stage:'-'}}</i>阶段,占总成绩权重：<i>{{courseScoreModel.stageWeight&&courseScoreModel.stageWeight!=null?courseScoreModel.stageWeight+'%':'-'}}</i>
        		</div> -->
                <div>
        			计分方式:
                    <template style="width:50px">
                        <el-select v-model="value" size="mini" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                    筛选条件:
                    <template style="width:50px">
                        <el-select v-model="Screenval" placeholder="请选择" size="mini" :disabled="Screen"  @change="filtrationSelection(Screenval)">
                            <el-option
                            v-for="item in Screening"
                            :key="item.value"
                           
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
        		</div>
                
        	</div>
        </div>

        <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="newArrtable"
                border
                :height="tableHeight"
                style="width: 100%"
                header-row-class-name="cm-dark"
                v-loading="tableLoading"
                element-loading-text="加载中..."
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="index" label="序号" fixed width="46"></el-table-column>
                <el-table-column prop="studentNo" label="学号" width="100"></el-table-column>
                <el-table-column prop="studentName" label="姓名" width="100"></el-table-column>
                <el-table-column prop="courseName" label="课程" width="150"></el-table-column>
                
                
                <el-table-column prop="stageGrade"  width="75" label="阶段成绩">
                    <template  slot-scope="scope">
                        {{scope.row.stageGrade==null?'-':scope.row.stageGrade}}
                    </template>
                </el-table-column>

                <el-table-column prop="stageGradeDetail"  width="400" label="阶段成绩明细" style="text-align:left;">
                    <template  slot-scope="scope">
                        <div style="text-align:left;" v-html="scope.row.stageGradeDetail==null?'-':scope.row.stageGradeDetail"></div>
                    </template>
                </el-table-column>

                <el-table-column prop="courseGrade" width="80" label="课程成绩">
                    <template  slot-scope="scope">
                        {{scope.row.courseGrade==null?'-':scope.row.courseGrade}}
                    </template>
                </el-table-column>

                <el-table-column prop="courseGradeDetail"  label="课程成绩明细" style="text-align:left;">
                    <template  slot-scope="scope">
                         <div :style="{'text-align':(scope.row.courseGradeDetail==null?'center':'left')}" v-html="scope.row.courseGradeDetail==null?'-':scope.row.courseGradeDetail"></div>
                    </template>
                </el-table-column> 
            </el-table>
        </div>
         <!-- 导入名单对话框 -->
        <el-dialog
            title="批量导入学生成绩"
            :visible.sync="importstudentDialog"
            width="450px"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            class="import-teachers-list">
          
            <el-upload
                class="upload-demo" 
                ref="upload"
                action=""
                :file-list="fileList"
                :on-success="onSuccess"
                :on-change="fileSelected"
                :before-upload="onBefore"
                :auto-upload="false">
                <el-button slot="trigger" size="small">选取文件</el-button>
            </el-upload>
            <el-button style="margin-left: 10px;" size="small" type="primary" :disabled="allow" @click="submitUpload">导入</el-button>
           
        </el-dialog>
              <!-- --------------------新增------------------------- -->
        <!-- <el-dialog
            width="420px"
            :close-on-click-modal="false"
            :title="dialog.status==='add'?'新增':'编辑'"
            :visible.sync="dialog.visible"
            :modal-append-to-body="false"
            @closed="addDialogClose">
                <el-form ref="addForm" :rules="rules2"  :model="formDetails"  style="padding:0px 30px" class="adddialog">
                
                    <el-form-item label="学期" class="flex-form" prop="semester">
                         <el-select 
                            v-model="formDetails.semester"
                            filterable
                            @change="getCourseList()"
                            placeholder="选择学期">
                            <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所在级" prop="grade" class="flex-form ">
                            <el-date-picker  
                            	:clearable="false"
                                v-model="formDetails.grade"
                                type="year" 
                                @change="getCourseList()"
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </el-date-picker>
                    </el-form-item>

                    <el-form-item label="专业" prop="majorId" class="flex-form ">
                            <el-select v-model="formDetails.majorId"
                             filterable
                             @change="getCourseList()"
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>


                    <el-form-item label="课程" class="flex-form" prop="courseId">
                        <el-select 
                            v-model="formDetails.courseId"
                           filterable
                            placeholder="选择课程">
                            <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select >
                    </el-form-item>

                    <el-form-item label="学号" class="flex-form" prop="studentNo">
                       <el-input v-model="formDetails.studentNo" style="width: 117px" placeholder="输入学号" @blur="getsduentinfo(formDetails.studentNo)">  
                       </el-input>
                       <span> &nbsp;&nbsp;{{studentname}}</span>
                    </el-form-item>

                    <el-form-item label="考试状态" class="flex-form" >
                          <el-select 
                            v-model="formDetails.examStatus"
                           filterable
                            placeholder="请选择考试状态">
                            <el-option 
                                v-for="item in examinationstutslist" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id" > 
                            </el-option>
                        </el-select >
                    </el-form-item>
                    
                    <el-form-item label="平时成绩" class="flex-form" >
                       <el-input  filterable v-model="formDetails.stageGrade" placeholder="请输入平时成绩">
                           
                       </el-input>
                     
                    </el-form-item>

                    <el-form-item label="期末成绩" class="flex-form" >
                       <el-input  filterable v-model="formDetails.finalExamGrade"  placeholder="请输入期末成绩">
                           
                       </el-input>
                      
                    </el-form-item>
                </el-form>
             
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="addDialogClose">取 消</el-button>
                <el-button size="mini" type="primary" @click="addsubmitForm('addForm')">确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- --------------------上传附件------------------------- -->
        <el-dialog
            title="上传附件"
            :visible.sync="AppendixuploadDialog"
            width="450px"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            class="import-teachers-list">
          
            
            <div class="flex">
                <span>上传附件&nbsp;:&nbsp;</span>
                <el-upload
                    class="upload-demo" 
                    ref="upload"
                    action=""
                    :file-list="fileList"
                    :on-success="onSuccess"
                    :on-change="fileSelected"
                    :before-upload="onBefore"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small">选取文件</el-button>
                </el-upload>
            </div>
            <div class="flex">
                <!-- <span>查看附件&nbsp;:&nbsp;</span> -->
                <p>支持说明&nbsp;:&nbsp;word/png/jpg格式的文件</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small"  @click="AppendixuploadDialog = false">取 消</el-button>
                <el-button type="primary" size="small"  @click="dialogVisible = false">上 传</el-button>
            </span>
            <!-- <el-button style="right" size="small" type="primary" :disabled="allow" @click="submitUpload">导入</el-button> -->
           
        </el-dialog>
          
         <el-dialog
           id="dalongs"
            :visible.sync="printDalong"
            append-to-body
            :fullscreen="true"
            :close-on-click-modal="false"
            :show-close="false"
            class="import-teachers-list printtable">
            <div  v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                <div>
                   请使用A4纸张打印 &#X3000;按所在级+专业生成，进行打印 
                </div>
                <div class="btnbox">
                    <el-button size="mini" @click="printDalong=false">关闭</el-button>
                    <el-button size="mini" type="primary" @click="Print()">打印</el-button>
                </div>
            </div>
            <div  class="printcontent" >
                <p class="title">
                   汕头大学医学院课程成绩登记表
                </p>
                 <p class="text">
                    <span class="subTime1">{{ScoreRecordDetails.grade}}级-{{ScoreRecordDetails.majorName}}专业 &#X3000;（{{ScoreRecordDetails.termName}}）</span>
                    <span class="subTime">提交日期:{{ScoreRecordDetails.submitDate}}</span>
                </p>
                <table border="1" width="100%" class="tab1">
                    <tr>
                        <td class="title1">课程名称</td>
                        <td class="curriculumName" colspan="2">{{ScoreRecordDetails.courseName}}</td>
                        
                        <td class="title1">课程英文名称</td>
                        <td class="curriculumName" colspan="2">{{ScoreRecordDetails.courseEnName}}</td>
                    </tr>

                    <tr>
                        <td class="title1">课程学分</td>
                        <td  colspan="2">
                            {{ScoreRecordDetails.courseCredit}}
                        </td>
                        <td class="title1"> 课程学时</td>
                        <td  colspan="2">{{ScoreRecordDetails.learningHour}}</td>
                       
                    </tr>

                    <tr>
                        <td class="title1">课程性质</td>
                        <td  colspan="2">
                            <template v-if="ScoreRecordDetails.sumeryScores.length > 0">
                                <el-checkbox :checked="ScoreRecordDetails.sumeryScores[0].courseNature=='XX'">选修</el-checkbox>
                                <el-checkbox :checked="ScoreRecordDetails.sumeryScores[0].courseNature=='BX'">必修</el-checkbox>
                            </template>
                            <template v-else>
                                <el-checkbox>选修</el-checkbox>
                                <el-checkbox>必修</el-checkbox>
                            </template>
                        </td>
                        <td>考试性质</td>
                        <td  colspan="2">
                             <template>
                                <el-checkbox checked>正常</el-checkbox>
                                <el-checkbox >补考</el-checkbox>
                            </template>
                        </td>
                    </tr>

                    <tr>
                        <td class="title1">成绩评定方式</td>
                        <td colspan="5">
                              当前阶段/课程阶段：{{ScoreRecordDetails.stageName}} &#X3000;&#X3000;&#X3000; 阶段成绩=平时成绩*比例{{courseScoreModel.scoreTypeProportionMap&&courseScoreModel.scoreTypeProportionMap['平时成绩']!='undfined'?courseScoreModel.scoreTypeProportionMap['平时成绩']:'-'}}%+期末成绩*比例{{courseScoreModel.scoreTypeProportionMap&&courseScoreModel.scoreTypeProportionMap['期末成绩']!='undfined'?courseScoreModel.scoreTypeProportionMap['期末成绩']:'-'}}%    课程成绩=Σ阶段成绩*权重
                        </td>
                    </tr>
                </table>
            </div>
            <p class="printtltle">
                考试情况报告单-分数分布
            </p>
            <table border="1" width="100%" class="tab2">
                <tr>
                    <td>项目</td>
                    <td>参考人数</td>
                    <td>优秀
                        <P>90分以上</p>
                    </td>
                    <td>及格
                         <P>60分以上</p>
                    </td>
                    <td>不及格
                        <P>60分以下</p>
                    </td>
                    <td>正常参考</td>
                    <td>缺考人数</td>
                    <td>缓考人数</td>
                    <td>违纪人数</td>
                    <td>作弊人数</td>
                </tr>
                <tr>
                    <template v-if="ScoreRecordDetails.sumeryScores.length > 0">
                        <td>人数</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].sumStudentQTY}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].youxiu}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].jige}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].bujige}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].zhengchang}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].quekao}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].huankao}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].weiji}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].zuobi}}</td>
                    </template>
                    <template v-else>
                        <td>人数</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </template>
                </tr>
                <tr>
                    <template v-if="ScoreRecordDetails.sumeryScores.length > 0">
                        <td>比例</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].sumStudentQTY | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].youxiu | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].jige | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].bujige | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].zhengchang | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].quekao | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].huankao | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].weiji | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                        <td>{{ScoreRecordDetails.sumeryScores[0].zuobi | calcRate(ScoreRecordDetails.sumeryScores[0].sumStudentQTY)}}</td>
                    </template>
                    <template v-else>
                        <td>比例</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </template>
                </tr>
            </table>
            <!-- </div> -->
           
            　<template>
                <!-- 手动切换轮播 -->
                <!-- <el-carousel indicator-position="none" :autoplay="false" :height="contentHeight">
                    <el-carousel-item  v-for="(ScoreRecordDetails,index) in scoresheet" :key="index"> -->
                            <template   v-for="list in ScoreRecordDetails.studentScores">
                                <p class="printtltle">
                                    {{list.administrativeClassName}} 学生总数：{{list.studentScores.length}} 成绩类型：{{ScoreRecordDetails.scoreTypeName}}
                                </p>
                                <div style="display:flex">
                                    <table border="1" class="tab2" style="width: 33.3%">
                                            <tr>
                                                <td>学号</td>
                                                <td>姓名</td>
                                                <td>成绩</td>
                                            </tr>
                                            <template v-if="list.mytabel1.length>0">
                                            <tr v-for="lis in list.mytabel1">
                                                <td >{{lis.studentNo}}</td>
                                                <td>{{lis.studentName}}</td>
                                                <td>{{lis.score}}</td>
                                            </tr>
                                            </template>
                                            <template v-else>
                                            <tr>
                                                <td >-</td>
                                            <td >-</td>
                                                <td >-</td>
                                            </tr>
                                            </template>
                                    </table>
                                    <table border="1" class="tab2" style="width: 33.3%">
                                        <tr>
                                            <td>学号</td>
                                            <td>姓名</td>
                                            <td>成绩</td>
                                        </tr>
                                        <template v-if="list.mytabel2.length>0">
                                            <tr v-for="lis in list.mytabel2">
                                                <td >{{lis.studentNo}}</td>
                                                <td>{{lis.studentName}}</td>
                                                <td>{{lis.score}}</td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td >-</td>
                                            <td >-</td>
                                                <td >-</td>
                                            </tr>
                                        </template>
                                    </table>
                                    <table border="1" class="tab2" style="width: 33.3%">
                                        <tr>
                                            <td>学号</td>
                                            <td>姓名</td>
                                            <td>成绩</td>
                                        </tr>
                                        <template v-if="list.mytabel3.length>0">
                                            <tr v-for="lis in list.mytabel3">
                                                <td >{{lis.studentNo}}</td>
                                                <td>{{lis.studentName}}</td>
                                                <td>{{lis.score}}</td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td >-</td>
                                            <td >-</td>
                                                <td >-</td>
                                            </tr>
                                        </template>
                                    </table>
                                  
                                </div>
                                <div class="xqStyle" v-if="scoreTypeName!='课程成绩'&&scoreTypeName!='阶段成绩'">
                                      <div  class="topStyle printtltle">考场情况</div>
                                         <table  class="topStyleBox">
                                            <tr  class=" talbeSyle" v-for="item in xiagnqing">
                                             <th>{{item.unusual_type}}</th>
                                                 <div  >
                                                      <div   class="box" v-for="item1 in item.unusual_detail">{{item1}}</div>
                                                 </div>
                                            </tr>
                                        </table>
                                </div>
                            </template>
                    <!-- </el-carousel-item>
                </el-carousel> -->
            </template>

            
             <div style="display:flex;margin-top: 50px;">
                 <div style="width:50%;padding-left:100px;">
                     <p>任课、监考考试签字:</p>
                    <p>日期:</p>
                 </div>
                 <div style="width:50%;padding-left:100px;">
                     <p>教研室主任、课程负责人签字:</p>
                    <p>日期:</p>
                 </div>
             </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'
    import {mapState} from 'vuex'
import { constants } from 'crypto';
    export default {
        name: "entering-course",
        data() {
            return {
                majorFlag: true,
                courseFlag: true,
                scoreTypeName: "",
                xiagnqing:[],
                tableLoading: false,
                studentname:'',//学号带出的名字
                  dialog:{
                    status:'add',
                    remark:false,
                    visible:false
                },
                addForm:{       
                },
                AppendixuploadDialog:false,//上传附件的弹框
                 contentHeight:'300px',//默认轮播容器高度
                allow:false,//按钮状态
                Screen:true,
                scoresheet:[],
                typs:"",//默认这个 在传参的时候 不用的时候删除
                ifnone:true,//印的时候变为false
                ScoreRecordDetails:{
                    sumeryScores: [],
                },//成绩详情
                courseScoreModel:{},
                value:"选项1",
                options:[
                    {value: '选项1',
                    label: '百分制'
                    }
                ],
                 rules: {
                    semester: [
                    { required: true, message: '请选择学期', trigger: 'change' }
                   
                    ],
                    grade: [
                    { required: true, message: '请选择所在级', trigger: 'change' }
                    ],
                    majorId: [
                    { required: true, message: '请选择专业', trigger: 'change' }
                    ],
                    courseId: [
                    { required: true, message: '请选择课程', trigger: 'change' }
                    ],
                    
                },
                rules2: {
                    semester: [
                    { required: true, message: '请选择学期', trigger: 'change' }
                   
                    ],
                    grade: [
                    { required: true, message: '请选年级', trigger: 'change' }
                   
                    ],
                    majorId: [
                    { required: true, message: '请选择专业', trigger: 'change' }
                    ],

                    studentNo: [
                    { required: true, message: '输入学号', trigger: 'blur' }
                    ],
                  
                    courseId: [
                    { required: true, message: '请选择课程', trigger: 'change' }
                    ],
                },
                mytabel1:[],
                mytabel2:[],
                mytabel3:[],
                mytabel4:[],
                tableData1:[
                    
               ],
               Screenval:'1',
               Screening:[
                    {value:'1',label:'全部'},
                    {value:'2',label:'阶段成绩不及格'},
                    {value:'3',label:'课程成绩不及格 '},
               ],
                radio1:'1',
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "校内课程阶段成绩"},
                ],
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                recordId:null,//保存信息用的id
                printDalong:false,//为true就是打开打印的弹框
                readyToPrint:false,
                examinationstutslist:"",//考试的状态列表
                importstudentDialog:false,//导入学生表的对话框
                fileList:[],//文件列表
                formDetails:{
                    semester:+this.$route.query.semester || '',//学期
                    grade: this.$route.query.grade || '',//所在级
                    majorId: '',//专业
                    courseId: this.$route.query.courseId ? +this.$route.query.courseId : '',//课程
                    studentNo:'',//学号
                    examStatus:'',//考试状态
                    stageGrade:'',//阶段成绩
                    finalExamGrade:''//期末成绩

                },
               formDetail:{},
                semesterList:[],//学期列表
                
                majorList:[],//专业列表
              
                coursename:"",//课程名字
                courseList:[],//课程列表
                scoreType:"",//成绩类型
                tableData:[],
                newArrtable:[],
                btnPerObj:{
                    query:false,
                    submit:false,
                    batchimport:false,
                    // printing:false

                },
                otherCellList:[],
                tableHeight:window.innerHeight - 180
            }
        },
        mounted(){
             util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            window.onmouseout=()=>{
                this.ifnoneshow();
            };
       
             
            // util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            this.$authorize.me();
        	this.getTermData();
            // this.getMajorList();
            // this.getCourseList()
            // this.formDetails.grade = String(new Date().getFullYear());
            this.getexaminationstuts()
            
        },
        destroyed(){
            clearTimeout(this.setTimeout)
        },
        filters: {
            calcRate(a, b) {
                var c = a / b;
                return (Math.round(c * 10000)/100).toFixed(2) + '%';
            }
        },
        computed:{
         
        },
        methods: {
            filtrationSelection(val){
              
                let newArr = []
                
                if(val==1){
                    this.newArrtable = this.tableData
                }
                if(val==2){
                    
                     newArr = this.tableData.filter(item => item.stageGrade<60) 
                     this.newArrtable = newArr
                     return
                }
                if(val==3){
                     
                     newArr = this.tableData.filter(item => item.courseGrade<60) 
                     this.newArrtable = newArr
                     return
                }
                
            },
            getDetails(recordId,scoreTypeId){
              
                this.$http.get("_sc:/scoreRecord/getScoreRecordArea/"+recordId+"/"+scoreTypeId).then(data =>{
                  
                    this.xiagnqing=data.data;
                })
                // http://localhost:8070/score/management/scoreRecord/getScoreRecordArea/2546/60
            },
            fnScoreRecord(arr){
                let totalrow=0
                let totclass = arr.length;
                let arr2 = []
                for(let i=0;i<arr.length;i++){
                    let leth = Math.ceil(arr[i].studentScores.length/4)
                    let qmoth = Math.floor(arr[i].studentScores.length%4)
                    
                    if(arr[i].studentScores.length>0){
                        arr[i].mytabel1 = arr[i].studentScores.slice(0,leth)
                     
                        totalrow += arr[i].mytabel1.length
                        totalrow = totalrow*totclass+1
                    }else{
                         arr[i].mytabel1= []
                    } 
                  
                    
                    if(arr[i].studentScores.length>1){
                        arr[i].mytabel2 = arr[i].studentScores.slice(leth,2*leth)
                    }else{
                         arr[i].mytabel2= []
                    }
                    if(arr[i].studentScores.length>2){
                        arr[i].mytabel3 = arr[i].studentScores.slice(2*leth,3*leth)
                    }else{
                         arr[i].mytabel3= []
                    }
                    if(arr[i].studentScores.length>3){
                        arr[i].mytabel4 = arr[i].studentScores.slice(3*leth,4*leth)
                        // 第四个空出来的格子数
                        this.gezi = arr[i].mytabel3.length-arr[i].mytabel4.length
                     
                    }else{
                         arr[i].mytabel4= []
                    }
                    // arr2.push(arr)
                }
                 this.contentHeight = (totalrow+13)*40+10+'px'
                  
                return arr
            },
            composeValue(type, it, row) {
                return {
                    'type': type,
                    'scoreType': it,
                    'recordId': this.recordId
                }
            },
            backto() {
                let params = {
                    course: this.formDetails.courseId,
                    grade:this.formDetails.grade,
                    major:this.formDetails.majorId,
                    termId:this.formDetails.semester
                }
                this.$http.post(`_sc:/stuScore/backto`, params).then(res => {
                    if(res.code == 0) {
                        this.$message.success("退回成功");
                    }else {
                        this.$message.error(res.data)
                    }
                }).catch(err => {
                    this.$message.error("退回失败");
                })
            },
            hasPermission(key, val) {
                
                return this.$authorize.hasPermission(key,val);
            },
            getsduentinfo(a){  //根据学号查询学生信息
                if(a!=undefined){
                    this.studentNo = a
                }
                
                if(this.studentNo!=''&&this.studentNo!=undefined){
                
                    let query = {
                        pageNo:1,
                        pageSize:10,
                        param:{
                            stuNum:this.studentNo,
                                status:1
                        }
                    }
                    
                    this.$http.post('_op:/students/list',query).then(data=>{
                        
                        let self =this
                        if(data.data.records.length<1){
                            self.showstudentsinfo = false
                            self.$message.error('学号不存在')
                        }else{
                            self.studentname = data.data.records[0].name
                         
                            self.showstudentsinfo = true
                        
                        }
                    }).catch(err=>{
                       
                    })
                }
            },
             onAddSelectChange(_id){
                this.selectChangeFun(_id); 
            },
            newlyadded(){
                this.dialog.visible = true
            },
            //关闭新增弹框
            addDialogClose(){
                this.dialog.visible=false;
                this.addForm.semester = "";
              
                // this.addColumn = [{id:""}];
            },
            openAppendixuploadloding(){ //上传附件的弹窗
                this.AppendixuploadDialog = true
            },
             handleDelete(row) {
                this.$confirm(`此操作将永久删除 ${row.studentName} 的 ${row.courseName} 成绩信息 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {  
                    this.$http.delete("_sc:/stuScore/"+row.id)
                    .then(data=>{
                        let type = "success";
                        let message = "删除成功！";
                        if(data.code===0){
                        let self = this
                        self.onSearch();
                        }else{
                            type = "error";
                            message = data.data;
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
            submitForm(){
                this.onSearch();
                  this.$refs.formDetails.validate((valid) => {
                    if (valid) {
                        
                    } else {
             
                    return false;
                    }
                });
            },
            addsubmitForm(){
                 this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addstuScore()
                    } else {
                  
                    return false;
                    }
                });
            },
        exportTable(formName){
            this.$refs[formName].validate(valid => {
            if (valid) {
                this.exportResult()
            } else {
             
                return false;
            }
            });
        },
        exportResult(){
            let params = {
                grade:this.formDetails.grade,
                major:this.formDetails.majorId,
                course: this.formDetails.courseId,
                termId: this.formDetails.semester
            }
            let semesterName = ''
            let majorName = ''
            let courseName = ''
            this.semesterList.forEach( item => {
                if(item.id == this.formDetails.semester) {
                    semesterName = item.name
                }
            })
            this.majorList.forEach( item => {
                if(item.id == this.formDetails.majorId) {
                    majorName = item.name
                }
            })
            this.courseList.forEach( item => {
                if(item.courseId == this.formDetails.courseId) {
                    courseName = item.courseName
                }
            })
            this.$http2.post('_sc:/stuScore/exportCourseResult',params).then(data=>{
                let url = window.URL.createObjectURL(new Blob([data]));
                let y = this.$refs.exportExcel;
                y.href = url;
                y.setAttribute("download", `${semesterName}-${courseName}-${this.formDetails.grade}-${majorName}.xls`);
                y.click();
                window.URL.revokeObjectURL(url);
            })
        
        },
            addstuScore(){
                let params = {
                    course:this.formDetails.courseId,
                    grade:this.formDetails.grade,
                    major:this.formDetails.majorId,
                    termId:this.formDetails.semester,
                    studentNo:this.formDetails.studentNo,
                    examStatus:this.formDetails.examStatus,
                    stageGrade:this.formDetails.stageGrade,
                    finalExamGrade:this.formDetails.finalExamGrade,
                    studentName:this.studentname,
                    // scoreType:this.scoreType
                }
                    

                this.$http.post('_sc:stuScore/add',params).then(data=>{
                    
                    if(data.code==0){
                        this.$message({
                        type: 'success',
                        message: '新增成功'
                        }); 
                        this.dialog.visible = false
                    }else{
                         this.$message({
                        type: 'error',
                        message: '添加失败，请重新添加'
                        }); 
                    }
                   
                }).catch(err=>{
                    console.log(err)
                })
            },
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                 
                    data.data.map(item => {
                        if (item.code=="query_xiaoneichengjiluru") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="submit_xiaoneichengjiluru") {
                            self.btnPerObj.submit=true;
                        }
                        if (item.code=="batch_import_xiaoneichengjiluru") {
                            self.btnPerObj.batchimport=true;
                        }
                      
                    });
                }).catch(()=>{
                })
            },
            closebox(){//关闭弹窗盒子
                this.printDalong = false
            },
            Print(){
                let self = this
                self.ifnone = false
                setTimeout(()=>{
                    window.print();
                },100)
            },
            ifnoneshow(){
                let self = this
                self.ifnone = true;
            },
            
            queryScoreRecordDetails(cmd){
                let param = {
                    scoreType: cmd.scoreType,
                    type: cmd.type,
                    recordId: cmd.recordId,
                    resit: 0
                }
                let prefix = '';
                if (process.env.NODE_ENV === 'production') {
                    prefix = '/edm';
                }
                let amdd = JSON.stringify(param)
                let token = localStorage.getItem("token");
                this.$router.replace({
                    query:{
                        ...this.$route.query,
                        semester: this.formDetails.semester,
                        grade: this.formDetails.grade,
                        majorId: this.formDetails.majorId,
                        courseId: this.formDetails.courseId,
                    }
                })
                // window.location.href = 'file:///D:/minxing/汕头大学教务系统/intelligent-tutoring-web/intelligent-tutoring-web/public/pages/page/myprint.html'
                window.location.href = prefix + '/pages/page/myprint.html?cmd='+amdd+'&token='+token;
               
            },
            getweight(){
                let params = {
                    courseId:this.formDetails.courseId,
                    grade:this.formDetails.grade,
                    majorId:this.formDetails.majorId,
                    termId:this.formDetails.semester
                }
                
                this.$http.post('_sc:/courseScoreModel/detail',params).then(data=>{
                    if(data.data!=null){
                        this.courseScoreModel = data.data
                      
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
      

            submitScore(){//把表单提交到记载
                if(this.tableData.length == 0){
                    this.$message({
                        message: '没有数据提交！',
                        type: 'warning'
                    });
                }else{
                    let params = {
                        course:this.formDetails.courseId,
                        grade:this.formDetails.grade,
                        major:this.formDetails.majorId,
                        termId:this.formDetails.semester,
                        examTypeCode:'XN'
                    }
                    // this.printDalong = true
                    let ids = [];
                    ids.push(this.recordId);
                    this.$http.post('_sc:/scoreRecord',params).then(data=>{
                        if(data.code==0){
                            this.$message({
                                message: '提交成功！',
                                type: 'success'
                            });
                            this.onSearch()
                            this.readyToPrint = true
                            this.importstudentDialog = false
                            this.onSearch();
                               
                        }else{
                            this.$message.error(data.msg)
                        }
                    }).catch(err=>{
                        this.$message.error(err.msg)
                    })
                }   
                
            },
            OnBlurEvent(row){ //光标离开时的事件
                let query = {}
               
                if(row.otherGrades&&row.otherGrades.length>0){
                    query = {
                        examStatus:row.examStatus,
                        finalExamGrade:row.finalExamGrade,
                        id:row.id,
                        regularGrade:row.regularGrade,
                        otherGradeList:row.otherGrades,
                        otherGradeCellList:this.otherCellList
                    }
                   
                }else{
                     query = {
                     examStatus:row.examStatus,
                     finalExamGrade:row.finalExamGrade,
                     id:row.id,
                     regularGrade:row.regularGrade,
                    }
                }
                this.$http.put('_sc:/stuScore',query).then(data=>{
                     if(data.code===0){
                          this.$message({
                                message: '设置成功！',
                                type: 'success'
                            });
                        this.onSearch()
                     }else{
                          this.$message.error(data.data)
                     }
                 }).catch(err=>{
                     this.$message.error(err.msg)
                 })
            },
            OnBlurEvents(id,regularGrade,finalExamGrade,examStatus){//光标离开时的事件
                 this.$http.put('_sc:/stuScore',{
                     examStatus:examStatus,
                     finalExamGrade:finalExamGrade,
                     id:id,
                     regularGrade:regularGrade
                 }).then(data=>{
                     if(data.code===0){
                          this.$message({
                                message: '设置成功！',
                                type: 'success'
                            });
                     }else{
                          this.$message.error(data.data)
                     }
                 }).catch(err=>{
                     this.$message.error(err.msg)
                 })
            },
          
            handleCommand(id) {
                this.$message('您选中了' + name);
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            //获取考试类型
            getscoreType(){
                let query = "EXAM_TYPE"
                let url = "_sc:/scoreSetting/combox/"
                this.$http.get(url+query).then(data=>{
                    
                    if(data.code==0){
                        
                        for(let i=0;i<data.data.length;i++){
                            
                            if(data.data[i].name.indexOf('校内')>-1){
                                let self = this
                                self.scoreType = data.data[i].id
                                

                            }
                        }
                       
                    }
                })
            },
            
            // 获取考试状态
            getexaminationstuts(){
                let query = "STUDENT_EXAM_STATUS"
                let url = "_sc:/scoreSetting/combox/"
                this.$http.get(url+query).then(data=>{
                    if(data.code==0){
                        let self = this
                        self.examinationstutslist = data.data
                    }
                })
            },
            getTermData(){//查询学期列表
            	let query="学期"
                this.$http.get('_op:/terms/'+query).then(data=>{
                    if(data.code==0){
                    	for (let i=0;i<data.data.length;i++) {
                    		if (data.data[i].name.indexOf('当前学期')!=-1) {
                                this.formDetails.semester= this.formDetails.semester ? this.formDetails.semester : data.data[i].id;
                                this.formDetails.grade=this.formDetails.grade ? this.formDetails.grade : data.data[i].year.toString();
                                this.getMajor()
                    			break;
                    		}
                    	}
                        this.semesterList = data.data.reverse();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getMajorList(){//查询专业列表
                this.$http.get("_op:/major/combox").then(res=>{
                    if(res.code==0){
                        this.majorList = res.data;
                        // if(res.data && res.data.length > 0){
                            // this.formDetails.majorId = res.data[0].id;
                            this.getCourseList()
                        // }
                        this.getCourseList()
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
      
            getMajor() {
                let grade
                if(this.formDetails.grade == '' || this.formDetails.grade == null) {
                    grade = 0
                }else {
                    grade = this.formDetails.grade
                }
                if(this.$route.query.majorId && this.courseFlag && this.majorFlag) {
                    this.formDetails.majorId = +this.$route.query.majorId
                    this.getCourseList()
                }else {
                    this.formDetails.majorId = ''
                }
                this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
                    this.majorList = res.data
                    this.majorFlag = false
                })
            },
            getCourseList(flag){// 根据查询课程
                this.formDetails.courseId = ''
                this.courseList = []
                if(flag === 'grade') {
                    this.getMajor()
                }
                if(this.$route.query.courseId && this.courseFlag && this.majorFlag) {
                    this.formDetails.courseId = +this.$route.query.courseId
                    // this.$route.query.replace({})
                }
                if(this.formDetails.grade!=''&&this.formDetails.majorId!=''&&this.formDetails.semester!=''){
                     let param = {
                        "grade":this.formDetails.grade,
                        "majorId":this.formDetails.majorId,
                        "termId":this.formDetails.semester
                    }
                    this.$http.post("_sc:/courseScoreModel/getCourseByParam",param).then(data=>{
                        if(data.code==0){
                            
                            // if (data.data.length>0) {
                            //     this.formDetails.courseId = data.data[0].id 
                            // }
                            this.courseFlag = false
                            this.courseList = data.data;
                            if(this.formDetails.courseId && this.courseList && this.courseList.length){
                                let have = this.courseList.find(item => item.courseId == this.formDetails.courseId);
                                (have == undefined) && (this.formDetails.courseId = '');
                            }
                        }else{
                            this.$message.error(data.msg);
                        }
                    })
                }
                // let examTypeId = this.scoreType
               
            },
            onSearchsub(){
                //  this.onSearch()
                 this.$refs.formDetails.validate((valid) => {
                    if (valid) {
                        this.Screen = false
                        this.Screenval = '1'
                        this.onSearch()
                    } else {
               
                    return false;
                    }
                });
            },
            onSearch(){//根据参数查询成绩
                this.readyToPrint = false
                let params = {
                    course: this.formDetails.courseId,
                    grade:this.formDetails.grade,
                    major:this.formDetails.majorId,
                    // scoreType:this.scoreType,
                    termId:this.formDetails.semester
                }
                this.tableLoading = true;
                this.$http.post('_sc:/stuScore/queryXNList',params).then(data=>{
                    this.tableData = []
                    if(data.code==0){ 
                        if(data.data.scoreRecordStatus>0){
                            this.readyToPrint = true
                        }

                        if(data.data.stuScoreResult){
                            let contents = data.data.stuScoreResult
                            for(let i=0;i<contents.length;i++){
                                let self = this;
                                contents[i].createTime = self.getdata(contents[i].createTime)
                            }
                            
                            if(contents.length > 0){
                                this.recordId = contents[0].recordId;
                            }
                            this.tableData = contents;
                            this.newArrtable = this.tableData
                            this.getweight()
                        }
                        
                    }else{
                        this.$message.error(data.msg);
                    }
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                })
            },
            importStuScore(){//批量导入
         
                
                this.$refs.formDetails.validate((valid) => {
                    if (valid) {
                    this.importstudentDialog=true
                    } else {
                   
                    return false;
                    }
                });
               
            },
             // 导入文件选择文件
            fileSelected (file, fileList){
                this.fileList = fileList.slice(-1);
            },
            onSuccess(res,file, fileList){
            
              let type = "success";
              let message = "导入成功！";
              if(res.code!=0){
                 type = "error";
                 message = res.msg;
              }
              this.$message({
                 type:type,
                 message:message
              })
            },
            onBefore(file) {
              let extension = file.name.split('.')[1]==='xls';
              let size = file.size / 1204 / 1204 < 20;
              if(!extension){
                this.$message.warning("上传的文件格式是 xls！")
              }
              if(!size){
                this.$message.warning("上传的文件大小不能超过20M！")
              }
              return extension && size;
            },
            submitUpload(){
                let self = this
                self.allow = true
               
                self.startImport()
                 setTimeout(function(){ 
                     self.allow = false
                 }, 1000);
            },
            startImport() {
                let self = this
                
                if (self.fileList.length < 1) {
                    self.$message.warning('请选择导入文件！');
                    return ;
                } else{
                    let formData = new FormData();
                        formData.append('file', self.fileList[0].raw);
                        formData.append('course', self.formDetails.courseId);
                        formData.append('grade', self.formDetails.grade);
                        formData.append('major', self.formDetails.majorId);
                   
                        formData.append('termId', self.formDetails.semester);
                         
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                    }
                   
                    this.$http.post('_sc:/stuScore/importStuScore', formData,config).then(data => {
                       
                        if(data.code === 0) {
                             self.$message({
                                message: '导入成功！',
                                type: 'success'
                            });
                             self.fileList = []
                            self.onSearch()
                            self.importstudentDialog=false
                        } else {
                            self.$message.error(data.msg);
                        }
                    }).catch(error => {
                        
                        self.$message.error(data.msg)
                    })
                }
            },
            getdata(val){
                let date = new Date(val)
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                let D = date.getDate() + ' ';
                return Y+M+D
            }
        }
    }
</script>
<style>
.cm-main{
    padding:0!important;
}
</style>
<style scoped lang="less">
.cm-table /deep/ .el-table--mini td{
    padding: 5px 0;
}
.cm-container{
    .cm-table{
        margin-bottom:0px;
    }
}
.none{
    display: none;
}
.talbeSyle{
    border:1px solid #dfdfdf;
}
.topStyleBox{
    width:100%;
}
.topStyleBox th{
    border:1px solid #dfdfdf;
    height:30px;
}
.topStyle{
    // margin-bottom:20px;
    width:100%;
}
.box{
    display:inline-block;
    line-height:30px;
}
.conbox{  
	display: flex;
    justify-content: space-between;
    padding-right: 20px;
	.el-input{
		width: 35px;
    }
   
    
}
.detail{
    .el-date-editor.el-input{
        width: 180px
    }
}
.dialogheader{
    display: flex;
    position: relative;
    border-bottom: solid 1px #66666636;
    height: 33px;
    .btnbox{
        position: absolute;
        right: 0px;
    }
}
.printcontent{
      font-size: 12px;
    border: solid 1px #66666636;
    .title{
        font-size: 18px;
        text-align: center;
        line-height: 30px;
    }
 @media screen and (max-width: 1000px) {
            .text {
                font-size: 12px;
                background: red;
                
            }
        }
    .text{
     
        // display: flex;
        position: relative;
        font-size: 14px;
        text-align: center;
        .subTime{
            position: absolute;
            right: 10px;
        }
    }
    .tab1{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 25px;
            line-height: 25px
        }
        .title1{
            width: 180px;
        }
        .curriculumName{
            width: 400px
        }
    }
        
}
.printtltle{
    line-height: 30px;
    height: 30px;
    padding-top:10px;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;

}
.tab2{
        border: solid 1px #66666636;
        td{
            font-size: 12px;
            text-align: center;
            height: 25px;
            line-height: 25px;
        }
       
    }
    .printtable{
        /deep/.el-dialog__body{
            padding-top: 0px
        }
         /deep/.el-dialog__header {
            padding: 4px 19px 0px;
        }
    }
    .flex{
            display: flex;
    }
    .adddialog{
        .el-select .el-date-editor.el-input{
            // width: 194px
        }
       
    }
    .cm-fold .el-form-item {
    margin: 10px 10px 0 0;
}

    
</style>