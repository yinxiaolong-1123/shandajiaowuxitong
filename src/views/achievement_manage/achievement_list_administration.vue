<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="queryList">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
                        <el-form-item label="学期" prop="year">
                            <el-select 
                                v-model="queryList.termId"
                                clearable
                                filterable
                                remote
                                @change="getCourseList()"
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100px;" 
                                clearable
                                v-model="queryList.grade"
                                type="year" 
                                value-format="yyyy" 
                                @change="getCourseList('grade')"
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                        <el-form-item label="专业">
                            <el-select 
                                v-model="queryList.majorId"
                                @change="getCourseList()"
                                filterable
                                clearable
                                placeholder="请选择">
                                <el-option v-for="(list, majorIndex) in majorList"    :key="majorIndex" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                         <el-form-item label="课程" prop="major" >
                            <el-select
                             v-model="queryList.courseId"
                             filterable
                             clearable
                             placeholder="请选择课程">
                              <el-option v-for="(item, coursIndex) in majorArr" :key="coursIndex" :label="item.name" :value="item.courseId" :label-width="formLabelWidth"></el-option>
                            </el-select>
                        </el-form-item>

                         <el-form-item label="状态">
                            <el-select v-model="queryList.status" style="width: 90px"  clearable placeholder="全部">
                                <!-- <el-option label="全部" value=""></el-option> -->
                                <el-option v-for="list in statusOption" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item>
                        
                         <el-form-item label="考试类型">
                            <el-select
                                style="width: 130px;" 
                                v-model="queryList.scoreType"
                                clearable
                                filterable
                                remote
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in typeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                             <div class="btn">
                                <el-button type="primary" size="mini" @click="onSearch()">查询</el-button>
                                <el-form-item label="">
                                        <el-checkbox  @change="queryData()" v-model="queryList.resit" style=" margin-left:80px" label="补考成绩记载表" name="type"></el-checkbox>
                                </el-form-item>
                            </div>
                        </el-form-item>
                 
                    </div>
                   
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="batchRelease()">批量发布</el-button>
            <el-button size="mini" type="primary" @click="batchReturn()" >批量退回</el-button>
        </div>
        <div class="cm-table">
              <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                 v-loading="tableLoading"
                  @selection-change="handleSelectionChange"
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="selection" label="全选"   :selectable='selectable' fixed width="40"></el-table-column>
                <el-table-column prop="examTypeCode" label="考试类型" width="85">
                      <template slot-scope="scope">
                         <span v-if="scope.row.examTypeCode=='DYKS'">德育考试</span>
                         <span v-if="scope.row.examTypeCode=='JXK'">教学科考试</span>
                         <span v-if="scope.row.examTypeCode=='GJKS'">国家考试</span>
                         <span v-if="scope.row.examTypeCode=='XN'">校内考试</span>
                    </template>
                </el-table-column>
                <el-table-column prop="termName" label="学期" width="165"></el-table-column>
                <el-table-column prop="grade" label="年级" width="50"></el-table-column>
                <el-table-column prop="majorName" label="专业" width="190">
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" min-width="270"></el-table-column>
                <el-table-column prop="resit" label="补缓考" >
                    <template slot-scope="scope">
                         <span v-if="scope.row.resit==1">是</span>                         
                    </template>
                </el-table-column>

                <el-table-column prop="studentNum" label="学生数" width="60"></el-table-column>
                <el-table-column prop="createUserName" label="提交人" ></el-table-column>
                <el-table-column prop="createTime" label="提交日期" width="85"></el-table-column>
                <el-table-column prop="status" label="状态" width="60">
                    <template slot-scope="scope">
                         <span v-if="scope.row.status==0">已保存</span>
                         <span v-if="scope.row.status==1">已提交</span>
                         <span v-if="scope.row.status==2">已发布</span>
                         <span v-if="scope.row.status==-1">已撤回</span>
                    </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注">

                </el-table-column>
                
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="170"
                    >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="onIssue(scope.row)" v-if="scope.row.status==1" >发 布</el-button>
                        <el-button type="text" size="small" @click="onSendBack(scope.row)" v-if="scope.row.status==1" >退 回</el-button>
                        <el-button type="text" size="small" @click="onRecall(scope.row)" v-if="scope.row.status==2" >撤 回</el-button>
                        <el-button type="text" size="small" @click="onlogSheetExt({type:scope.row.examTypeCode, scoreType: null, row:scope.row})" v-if="(scope.row.status==1 || scope.row.status==2|| scope.row.status==0|| scope.row.status==-1)&&(scope.row.examTypeCode!=='XN' || scope.row.resit==1)">记载表</el-button>
                        <el-dropdown v-else trigger="click" size="small" @command="onlogSheetExt" style="margin-left: 10px">
                            <span class="el-dropdown-link">
                                记载表<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="composeValue('stage', null, scope.row)">阶段成绩</el-dropdown-item>
                                <el-dropdown-item :command="composeValue('course', null, scope.row)">课程成绩</el-dropdown-item>
                                <el-dropdown-item v-for="item in scope.row.scoreTypes" :key="item.id" :command="composeValue('normal', item, scope.row)">
                                    {{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-button type="text" size="small" @click="onRecallIssue(scope.row)"  v-if="scope.row.status==2">撤回发布</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="" :visible.sync="printDialog" :fullscreen="true" append-to-body :close-on-click-modal="false" :show-close="false" class="import-teachers-list printtable">
            <div v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                <div style="position: absolute;right: 0px;">
                <el-button size="mini" @click="closeprint()">关闭</el-button>
                <el-button size="mini" type="primary" @click="printcontent()">打印</el-button>
                </div>
            </div>
            <div id="printkkkk">
            <div v-for="(item, index) of printTable" :key="index" style="page-break-after:always" class="page">
                <div>
                    <p style="font-size: 20px;font-weight: bold;text-align: center">{{coursename1}} {{stageName1}}补缓考成绩记载表</p>
                </div>
                <!-- <div class="page w3cbbs" style="font-size: 10px !important;width: 100%;margin: 0 auto;margin-top: 5px;min-height: 500px;"> -->
                <div style="font-size: 10px !important;width: 100%;margin: 0 auto;margin-top: 5px;min-height: 500px;">
                <div>
                    <span style="font-size: 14px;font-weight: bold;line-height: 31px;">年级专业：{{grade}}{{majorName}}</span>
                    <span style="float: right;font-size: 14px; margin-top: 10px;">{{index + 1}}/{{printTable.length}}</span>
                </div>
                
                <table border="1" width="100%" style="font-size: 12px; border-width: 2px 2px 2px 2px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                    <tr>
                    <td style="width:90px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 20px;">学号</td>
                    <td style="width:80px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">姓名</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">阶段</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">阶段成绩</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">课程成绩</td>
                    <td style="width:260px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">成绩构成说明</td>
                    <td style="width:210px; text-align:center;border-width: 0px 0px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">补考详情</td>
                    </tr>
                    <tr v-for="(list, printcontIdex1) in item" :key="printcontIdex1">
                    <td style="width:90px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.studentNo}}</td>
                    <td style="width:80px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.studentName}}</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.stageName}}</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.stageBkgrade}}</td>
                    <td style="width:60px; text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;">{{list.courseGrade}}</td>
                    <td style="width:260px; height: 41px;text-align:left;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;" >{{list.courseGradeDetail}}</td>
                    <td style="width:210px; ;text-align:left;border-width: 0px 0px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height: 41px;" >{{list.stageBkDetail}}</td>
                    </tr>
                </table>
                </div>
                <div>
                <div style="width: 100%;margin: 0 auto;margin-top: 5px;">
                    <div style="display: flex;flex-wrap: wrap;">
                    <div style="width: 50%;line-height: 50px;">任课、监考考试签字:</div>
                    <div style="width: 50%;line-height: 50px;">教研室主任、课程负责人签字:</div>
                    <div style="width: 50%;line-height: 50px;">日期:</div>
                    <div style="width: 50%;line-height: 50px;">日期:</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <!-- <div v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                <div class="btnbox">
                <el-button size="mini" @click="closeprint()">关闭</el-button>
                <el-button size="mini" type="primary" @click="printcontent()">打印</el-button>
                </div>
            </div>
             <div>
                <p class="printtitle">{{coursename1}} {{stageName1}}补缓考成绩记载表</p>
            </div>
            <div>
                <div class="printcont">
                <P class="printtitle2">年级专业：{{grade}}{{majorName}}</P>
                <table border="1" width="100%" class="tab2">
                    <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>阶段</td>
                    <td>阶段成绩</td>
                    <td>课程成绩</td>
                    <td>成绩构成说明</td>
                    <td>补考详情</td>
                    </tr>
                    <tr v-for="(list, printcontIdex1) in tableData1" :key="printcontIdex1">
                    <td style="width:90px;">{{list.studentNo}}</td>
                    <td style="width:80px;">{{list.studentName}}</td>
                    <td style="width:40px;">{{list.stageName}}</td>
                    <td style="width:35px;">{{list.stageBkgrade}}</td>
                    <td style="width:35px;">{{list.courseGrade}}</td>
                    <td>{{list.courseGradeDetail}}</td>
                    <td style="width:240px;">{{list.stageBkDetail}}</td>
                    </tr>
                </table>
                </div>
                <div class="printfont">
                <div class="autograph">
                    <div class="autograph1">任课、监考考试签字:</div>
                    <div class="autograph1">教研室主任、课程负责人签字:</div>
                    <div class="autograph1">日期:</div>
                    <div class="autograph1">日期:</div>
                </div>
                </div>
            </div> -->
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
                <!-- <div>
                   请使用A4纸张打印 &#X3000;按所在级+专业生成，进行打印 
                </div> -->
                <div class="btnbox">
                    <el-button size="mini" @click="printDalong=false">关闭</el-button>
                    <el-button size="mini" type="primary" @click="Print()">打印</el-button>
                </div>
            </div>
            <div  class="printcontent" >
                <p class="title">
                   汕头大学医学院课程成绩登记表
                </p>
            </div>
        
           
            　<template>
                <!-- 手动切换轮播 -->
                <!-- <el-carousel indicator-position="none" :autoplay="false" :height="contentHeight"> -->
                    <div  v-for="(ScoreRecordDetails,index) in scoresheet" :key="index">
                            <div class="printcontent" > 
                                <p class="text" style="text-align: center;">
                                    <span  class="subTime1">{{ScoreRecordDetails.grade}}级-{{ScoreRecordDetails.majorName}}专业 &#X3000;（{{ScoreRecordDetails.termName}}）</span>
                                    <span class="subTime">提交日期:{{ScoreRecordDetails.submitDate}}</span>
                                </p>
                                <table border="1" width="100%" class="tab1">
                                    <tr>
                                        <td class="title1">课程名称</td>
                                        <td class="curriculumName" colspan="2">{{ScoreRecordDetails.courseName}}</td>
                                        <td v-if="ScoreRecordDetails.examTypeCode=='DYKS'" >考试性质</td>
                                        <td class="title1" v-else>课程英文名称</td>
                                        <td  class="curriculumName" colspan="2" v-if="ScoreRecordDetails.examTypeCode=='DYKS'||ScoreRecordDetails.examTypeCode=='GJKS'">
                                            <template>
                                                <el-checkbox>正常</el-checkbox>
                                                <el-checkbox>补考</el-checkbox>
                                            </template>
                                        </td>
                                        <td  class="curriculumName" colspan="2" v-else>{{ScoreRecordDetails.courseEnName}}</td>
                                    </tr>
                                     <tr v-if="ScoreRecordDetails.examTypeCode!='DYKS'||ScoreRecordDetails.examTypeCode!='JXK'"  >
                                        <td class="title1">课程学分</td>
                                        <td  colspan="2">
                                            {{ScoreRecordDetails.courseCredit}}
                                        </td>
                                        <td class="title1"> 课程学时</td>
                                        <td  colspan="2">{{ScoreRecordDetails.learningHour}}</td>
                                    
                                    </tr>

                                    <tr   v-if="ScoreRecordDetails.examTypeCode!='DYKS'||ScoreRecordDetails.examTypeCode!='JXK'">
                                        <td class="title1">课程性质</td>
                                        <td  colspan="2">
                                            <template>
                                                <el-checkbox :checked="ScoreRecordDetails.sumeryScores[0].courseNature=='XX'">选修</el-checkbox>
                                                <el-checkbox :checked="ScoreRecordDetails.sumeryScores[0].courseNature=='BX'">必修</el-checkbox>
                                            </template>
                                        </td>
                                        <td>考试性质</td>
                                        <td  colspan="2">
                                            <template>
                                                <el-checkbox disabled checked>正常</el-checkbox>
                                                <el-checkbox disabled >补考</el-checkbox>
                                            </template>
                                        </td>
                                    </tr>

                                    <tr  v-if="ScoreRecordDetails.examTypeCode!='DYKS'||ScoreRecordDetails.examTypeCode!='JXK'||ScoreRecordDetails.examTypeCode!='GJKS'">
                                        <td class="title1">成绩评定方式</td>
                                        <td colspan="5">
                                            当前阶段/课程阶段：{{ScoreRecordDetails.stageName}}
                                            <!-- {{ScoreRecordDetails.stageName}} &#X3000;&#X3000;&#X3000; 阶段成绩=平时成绩*比例{{courseScoreModel.scoreTypeProportionMap&&courseScoreModel.scoreTypeProportionMap['平时成绩']!='undfined'?courseScoreModel.scoreTypeProportionMap['平时成绩']:'-'}}%+期末成绩*比例{{courseScoreModel.scoreTypeProportionMap&&courseScoreModel.scoreTypeProportionMap['期末成绩']!='undfined'?courseScoreModel.scoreTypeProportionMap['期末成绩']:'-'}}%    课程成绩=Σ阶段成绩*权重 -->
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <p class="printtltle" v-if="ScoreRecordDetails.examTypeCode=='DYKS'||ScoreRecordDetails.examTypeCode=='JXK'">
                                考试情况报告单-分数分布
                         
                            </p>
                            <table border="1" width="100%" class="tab2" v-if="ScoreRecordDetails.examTypeCode=='DYKS'||ScoreRecordDetails.examTypeCode=='JXK'">
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
                                    <td>&lt;40</td>
                                    <td>40~</td>
                                    <td>50~</td>
                                    <td>60~</td>
                                    <td>70~</td>
                                    <td>80~</td>
                                    <td>90~</td>
                                    <!-- <td>优秀
                                        <P>90分以上</p>
                                    </td> -->
                                </tr>
                                <tr>
                                    <template v-if="ScoreRecordDetails.noxnStructs.length > 0">
                                        <td>人数</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].sumStudentQTY}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].youxiu}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].jige}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].bujige}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s0}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s40}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s50}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s60}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s70}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s80}}</td>
                                        <td>{{ScoreRecordDetails.noxnStructs[0].s90}}</td>
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
                                        <td>0</td>
                                        <td>0</td>
                                    </template>
                                </tr>
                                <tr>
                                    <td>比例</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].sumStudentQTY | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].youxiu | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].jige | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].bujige | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s0 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s40 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s50 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s60 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s70 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s80 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                    <td>{{ScoreRecordDetails.noxnStructs[0].s90 | calcRate(ScoreRecordDetails.noxnStructs[0].sumStudentQTY)}}</td>
                                </tr>
                            </table>
                            <p class="printtltle">
                                <!-- 考试情况报告单-分数分布 -->
                                考试情况报告单-考场记录
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
                            
                            <template   v-for="list in ScoreRecordDetails.studentScores">
                              
                                <p class="printtltle">
                                    {{list.administrativeClassName}} 学生总数：{{list.studentScores.length}} 成绩类型：{{ScoreRecordDetails.scoreTypeName}}
                                </p>
                                <div  ref="carouselheight" style="page-break-after:always;display:flex" >
                                    
                                    <table border="1" class="tab2" style="width: 25%">
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
                                    <table border="1" class="tab2" style="width: 25%">
                                        <tr>
                                            <td>学号</td>
                                            <td>姓名</td>
                                            <td>成绩</td>
                                            <!-- <td>{{ScoreRecordDetails.scoreTypeName}}</td> -->
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
                                    <table border="1" class="tab2" style="width: 25%">
                                        <tr>
                                            <td>学号</td>
                                            <td>姓名</td>
                                            <td>成绩</td>
                                            <!-- <td>{{ScoreRecordDetails.scoreTypeName}}</td> -->
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
                                    <table border="1" class="tab2" style="width: 25%">
                                        <tr>
                                            <td>学号</td>
                                            <td>姓名</td>
                                            <td>成绩</td>
                                            <!-- <td>{{ScoreRecordDetails.scoreTypeName}}</td> -->
                                        </tr>
                                        <template v-if="list.mytabel4.length>0">
                                            <tr v-for="lis in list.mytabel4">
                                                <td >{{lis.studentNo}}</td>
                                                <td>{{lis.studentName}}</td>
                                                <td>{{lis.score}}</td>
                                            </tr>
                                            <tr v-for="item in gezi">
                                                <td></td>
                                                 <td></td>
                                                  <td></td>
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
                    </div>
               
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
        <el-dialog
            title=""
            :visible.sync="printDialog2"
             :fullscreen="true"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            :show-close="true"
            class="import-teachers-list printtable">
            <!--startprint-->
            <div  v-if="ifnone" slot="title" :class="{dialogheader:true,clear:true}">
                <!-- <div>
                   请使用A4纸张打印进行打印 
                </div> -->
                <div class="btnbox">
                    <el-button size="mini" @click="closeprint()">关闭</el-button>
                    <el-button size="mini" type="primary" @click="printcontent()">打印</el-button>
                </div>
        </div>
        <div>
          <p class="printtitle">{{courseName}} {{examstageName}}阶段补考名单</p> 
          <!-- TODO -->
        </div>
        <div>
          
          <div class="printcont">
            <!-- <P class="printtitle2">年级专业：{{grade}}{{majorName}}</P> -->
            <!-- TODO -->
             <table border="1" width="100%" class="tab2">
                <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>阶段</td>
                    <td>成绩</td>
                    <td>学生签字</td>
                </tr>
                <tr v-for="list in tableData2">
                    <td>{{list.studentNo}}</td>
                    <td>{{list.studentName}}</td>
                    <td>{{list.stageName}}</td>
                    <td>{{list.finalGrade}}</td>
                    <td></td>
                </tr>
            </table>
          </div>

          <div class="printfont">
            <div>
              备注：1、以上成绩务必按照年级、专业分页填报、以便存档
            </div>
            <div>
               &#X3000;&#X3000;&#X3000;2、补考后阶段成绩：最高按照60分 （包括补考卷面+平时成绩）
            </div>
            <div class="autograph">
              <div class="autograph1">监考老师签名:</div>
              <div class="autograph1">补考时间:</div>
              <div class="autograph1">教研室主任签名:</div>
            </div>
          </div>
        </div>
        <!--endprint-->
    </el-dialog>
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
 
    </section>
</template>

<script>
    import util from '@/util';
    import printJS from "print-js";
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
                printTable: [],
                scoreTypeName:'',
                xiagnqing:[],
                gezi:'',
                majorList:[],//专业列表
                grade: '',
                examstageName:'',//补考的阶段
                courseName:"",//补考的课程名称
                coursename1: '',
                stageName1: '',
                tableData2:'',//补考的记载表
                printDialog: false,  // 记载表打印
                tableData1: [],      // 记载表数据
                majorName: '',
                printDialog2:false,//补考的弹框
                contentHeight:'500px',//默认轮播容器高度
                scoresheet:[],
                  ifnone:true,//印的时候变为false
                 ScoreRecordDetails:"",//成绩详情
                 printDalong:false,
                 tableData1: [{}],
                openTable:false,//记载表
                radio:'1',
                 radio1:'1',
                formLabelWidth: '300px',
                breadcrumb: [//面包屑
                    {label: "成绩管理"},
                    {label: "成绩记载表管理"},
                ],
                statusOption: [//装填
                    // { label: "保存", value: 0 },
                    { label: "待发布", value: 1 },
                    { label: "已发布", value: 2 },
                    // { label: "已退回", value: -1 },
                ],
                queryList:{//查询数据
                    termId: this.$route.query.termId ? +this.$route.query.termId : "",//学期
                    status: this.$route.query.status ? +this.$route.query.status : "",
                    majorId: this.$route.query.majorId ? +this.$route.query.majorId : "",
                    grade: this.$route.query.grade ? this.$route.query.grade : "",
                    courseId: this.$route.query.courseId ? +this.$route.query.courseId : "",
                    scoreType: this.$route.query.scoreType || "",//考试类型
                    resit:0//补考记载表
                },
                majorArr:[],//课程下拉列表
                 param:{//列表参数
                    name:'',
                    teacherNo:'',
                    departmentName: '',
                    status:'',
                    positionId:''
                },
                totalCount:0,
                tableData:[],//列表数据
                options1:[],//学期下拉数据
                onSelectionChangeVal:[],//选中数据
                dataIdList:[],//选中ID处理
                myDate:new Date(),
                tableLoading:false,
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                //  <span v-if="scope.row.examTypeCode=='DYKS'">德育考试</span>
                //          <span v-if="scope.row.examTypeCode=='JXK'">教学科考试</span>
                //          <span v-if="scope.row.examTypeCode=='GJKS'">国家考试</span>
                //          <span v-if="scope.row.examTypeCode=='XN'">校内考试</span>
                typeData:[
                    {  code:'DYKS',name:"德育考试"},
                    {  code:'JXK',name:"教学科考试"},
                    {  code:'GJKS',name:"国家考试"},
                    {  code:'XN',name:"校内考试"},
                  
                ],//考试类型
            }
        },
        created(){
            this.getCourseList1(0, 0, 0)
            this.getTermData();//学期下拉数据获取
            this.getMajor()
            // this.getMajorList();//专业下拉数据获取
            // this.getProfessionalList();//获取专业
            // this.getTypeData();//考试类型下拉类别获取
            // this.getExaminationtType();//获取列表数据
            //  this.queryScoreRecordDetails()
        },
        computed:{},
        mounted(){ 
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            window.onmouseout = () => {
                this.ifnoneshow();
            }
        },
        filters:{
            calcRate(a, b) {
                var c = a / b;
                return (Math.round(c * 10000)/100).toFixed(2) + '%';
            }
        },
        methods:{
            getMajor() {
                let grade
                if(this.queryList.grade == '' || this.queryList.grade == null) {
                    grade = 0
                }else {
                    grade = this.queryList.grade
                }
                this.majorList = []
                this.$http.get('_op:/major/getMajorByGrade/' + grade).then( res => {
                    this.majorList = res.data
                })
            },
            getCourseList1(grade, major, term) {
                if(this.queryList.grade == "") {
                    grade = 0
                }else{
                    grade = grade
                }
                if(this.queryList.majorId == "") {
                    major = 0
                }else{
                    major = major
                }
                if(this.queryList.termId == "") {
                    term = 0
                }else{
                    term = term
                }
            this.$http.get("_sc:/stuScore/getcombox/" + term + '/' + grade + '/' + major).then(data => {
                if (data.code == 0) {
                    this.majorArr = data.data;
                } else {
                    this.$message.error(data.msg);
                }
                });
            },
            getCourseList(flag) {
            // 根据查询课程
            if(flag === 'grade') {
                this.getMajor()
            }
            this.queryList.courseId = ''
            this.majorArr = [];
            let termId = ''
            let grade = ''
            let majorId = ''
            if(this.queryList.termId=="" || this.queryList.termId == null){
                termId=0;
            }else{
                termId= this.queryList.termId;
            }
            if(this.queryList.grade=="" || this.queryList.grade == null){
                grade=0;
            }else{
                grade= this.queryList.grade;
            }
            if(this.queryList.majorId=="" || this.queryList.majorId == null){
                majorId=0;
            }else{
                majorId=this.queryList.majorId;
            }
            this.$http.get("_sc:/stuScore/getcombox"+"/"+ termId +"/"+grade+"/"+majorId).then(data =>{
                if(data.code==0){
                    this.majorArr = data.data;
                }else{
                    this.$message.error(data.msg);
                }
            })
            // let param = {
            //     grade: this.queryList.grade,
            //     majorId: this.queryList.majorId,
            //     termId: this.queryList.termId
            // };
            // this.$http
            //     .post("_sc:/courseScoreModel/getCourseByParam", param)
            //     .then(data => {
            //     if (data.code == 0) {
            //         if (data.data && data.data.length) {
            //         this.majorArr = data.data;
            //         }
            //     } else {
            //         this.$message.error(data.msg);
            //     }
            //     });
            },
            onRecall(row){
                this.$confirm(`此操作将撤回 ${row.termName} 的 ${row.courseName} 成绩信息 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('_sc:/scoreRecord/syncScoreModel',{
                        id: row.id,
                        status: row.resit
                    }).then(res => {
                        let type = "success";
                        let message = "撤回成功！";
                        if (res.code === 0) {
                            let self = this
                            self.onSearch();
                        } else {
                            type = "error";
                            message = res.data;
                        }
                        this.$message({
                            type: type,
                            message: message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消撤回'
                    });
                });
            },
            getProfessionalList(){
                this.$http.get("_op:/major/combox").then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
           },
            // 控制是否勾选，状态为1才能勾选
            selectable(row,index){
                if(row.status==1){
                    return true;
                }else{
                    return false;
                }
            },
            closebox(){//关闭弹窗盒子
                this.printDalong = false
            },
            Print(){
                let self = this
                self.ifnone = false
                setTimeout(()=>{
           
                    // document.body.style.visibility = "hidden";
                    // this.tenementBillTable.style.visibility = "visible";
                    window.print();
                    // document.body.style.visibility = "visible";
                //     // preview() 
                //     // { 
                //    var   bdhtml=window.document.body.innerHTML; 
                //    var sprnstr="<!--startprint-->"; 
                //      var eprnstr="<!--endprint-->"; 
                //     prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+17); 
                //     prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr)); 
                //     window.document.body.innerHTML=prnhtml; 
                //     window.print(); 
                //     // } 

                },100)
                window.onafterprint = function() {
                    self.ifnone = true;
                };
            },
             
            closeprint(){//关闭打印的弹框
                this.printDialog2 =  false
            },
            ifnoneshow(){
                let self = this
                self.ifnone = true;
            },
            composeValue(type, it, row) {
                return {
                    'type': type,
                    'row': row,
                    'scoreType': it
                }
            },
            onlogSheetExt(cmd) {
                console.log(cmd)
                if(cmd.row.resit == 1) {
                    this.majorName = cmd.row.majorName
                    this.coursename1 = cmd.row.courseName
                    this.stageName1 = cmd.row.remark
                    this.grade = cmd.row.grade
                    this.printDialog = true
                    let record_id = cmd.row.id
                    this.printTable = []
                    let array = []
                    this.$http.get('_sc:/resitList/recordId/' + record_id).then(data => {
                        this.tableData1 = data.data
                        let index = 0
                        while(index < data.data.length) {
                            // array.push(data.data.slice(index, data.data[index].courseBkgradeGetail.length > 100 ?  index += 4 : index += 13));
                            array.push(data.data.slice(index, data.data[index].courseGradeDetail != "" && data.data[index].courseGradeDetail.length > 100 ? index += 5 : index += 13));
                        }
                        this.printTable = array
                    }).catch(err => {
                        console.log(err)
                    })
                }else{
                    let param = {
                    scoreType: cmd.scoreType,
                    type: cmd.type,
                    recordId: cmd.row.id,
                    resit: cmd.row.resit
                }
                    let prefix = '';
                    if (process.env.NODE_ENV === 'production') {
                        prefix = '/edm';
                    }
                    if (param.resit == 1) {
                        param.resitListId = cmd.row.resitListId;
                    }
                    let amdd = JSON.stringify(param)
                    let token = localStorage.getItem("token");
                    this.$router.replace({
                        query:{
                            ...this.$route.query,
                            termId: this.queryList.termId,
                            status: this.queryList.status,
                            courseId: this.queryList.courseId,
                            scoreType: this.queryList.scoreType,
                            majorId:this.queryList.majorId,
                            grade: this.queryList.grade,
                            resit: 0
                        }
                    })
                     // window.location.href = 'file:///D:/minxing/汕头大学教务系统/intelligent-tutoring-web/intelligent-tutoring-web/public/pages/page/myprint.html'
                      window.location.href = prefix + '/pages/page/myprint.html?cmd='+amdd+'&token='+token;
                }
            },
            closeprint() { //关闭打印的弹框
                this.printDialog = false
            },
            printcontent() {
                let self = this
                self.ifnone = false
                setTimeout(() => {
                printJS({
                    printable: "printkkkk",
                    type: "html",
                    targetStyles: ['*'],
                    ignoreElements:['no-print','bc','gb'],
                    // css: [
                    //   "../../../../static/css/processinfo.css",
                    //   "../../../../static/css/element-ui/index.css"
                    // ], //引入css文件
                    scanStyles: false
                });
                // window.print();
                }, 100)
            },
            getDetails(recordId,scoreTypeId){
              
                this.$http.get("_sc:/scoreRecord/getScoreRecordArea/"+recordId+"/"+scoreTypeId).then(data =>{
                   
                    this.xiagnqing=data.data;
                })
                // http://localhost:8070/score/management/scoreRecord/getScoreRecordArea/2546/60
            },
            //记载表 record_table
            onlogSheet(row){
                if(row.resit==1){
                    //TODO
                    this.courseName = row.courseName
                    if(row.resitListId){
                        this.getresitList(row.resitListId)
                    }
                }else if(row.resit==0){
                    this.printDalong=true;
                    let id =row.id
                    let url = '_sc:/scoreRecord/queryScoreRecordDetails/'+id
                    this.$http.get(url).then(data=>{
                        
                        let self= this
                           
                            self.scoresheet = []
                            for(let k=0;k<data.data.length;k++){
                              
                                 if(data.data[k].examTypeCode=='DYKS'){
                                    data.data[k].classStuScoreResultList =  self.fnScoreRecord(data.data[k].classStuScoreResultList)
                                    self.ScoreRecordDetails = data.data[k]
                                    self.scoresheet.push(self.ScoreRecordDetails)
                                }else if(data.data[k].examTypeCode=='GJKS'){
                                    data.data[k].classStuScoreResultList =  self.fnScoreRecord(data.data[k].classStuScoreResultList)
                                    self.ScoreRecordDetails = data.data[k]
                                    self.scoresheet.push(self.ScoreRecordDetails)
                                }else if(data.data[k].examTypeCode=='JXK'){
                                    data.data[k].classStuScoreResultList =  self.fnScoreRecord(data.data[k].classStuScoreResultList)
                                    self.ScoreRecordDetails = data.data[k]
                                    self.scoresheet.push(self.ScoreRecordDetails)
                                }else{
                                   data.data[k].classStuScoreResultList =  self.fnScoreRecord(data.data[k].classStuScoreResultList)
                                    self.ScoreRecordDetails = data.data[k]
                                    self.scoresheet.push(self.ScoreRecordDetails)
                                }
                            }
                    
                    }).catch(err=>{

                    })
                }
                
            },
            getresitList(id){ //补考的记载表
                let self =this;
                let resitListId = id;
                self.$http.get('_sc:/resitList/'+resitListId).then(data=>{
                    self.tableData2 = data.data;
                   
                    self.examstageName = data.data.stageName;
                    self.printDialog2 = true;
                }).catch(err=>{
                    console.log(err)
                })
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
            // 勾选
            queryData(){
            
                if (this.queryList.resit==true){
                    this.tableLoading=true;
                    this.$http.post("_sc:/scoreRecord/queryPageList",{
                    param:{
                         resit:1//补考记载表
                    }
                    }).then(data=>{
                        this.tableLoading=false;
                        this.tableData=data.result;
                     
                        this.totalCount=data.totalCount;
                        
                    }).catch(()=>{
                        this.tableLoading=true;
                    })
                }
                if(this.queryList.resit==false){
                    this.getExaminationtType();
                }
            },
           
             // 考试类型下拉列表获取
            getTypeData(){
                let query="EXAM_TYPE";
                this.$http.get('_sc:/scoreSetting/combox/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.typeData = data.data;
                    }else{
                    this.$message.error(data.msg);
                    }
                })
            },
           
             // 课程下拉列表
            getMajorList(){
                this.$http.get('_op:/course/combox')
                .then(data=>{
                    if(data.code==0){
                        this.majorArr = data.data;
                    }else{
                    this.$message.error(data.msg);
                    }
                })
            },
            //选中事件
            handleSelectionChange(val){
                this.dataIdList=[]
                this.onSelectionChangeVal=val;
                this.onSelectionChangeVal.forEach(item => {
                this.dataIdList.push(item.id);
                });
            },
            //批量发布
            batchRelease(){
            
                let a =this.dataIdList;
                let s = new Set(a);
                let result = Array.from(s);
                
                this.$http.put('_sc:/scoreRecord',{
                    ids:result,
                    status:2
                }).then(data=>{
                    if (data.code==0){
                        this.$message({
                            message: '批量发布成功',
                            type: 'success'
                        });
                         this.getExaminationtType(); //刷新列表
                    }
                    
                }).catch(()=>{
                    this.tableLoading=true;
                    this.$message.error('批量发布失败');  
                })
            },
            //批量退回
            batchReturn(){
            
                let a =this.dataIdList;
                let s = new Set(a);
                let result = Array.from(s);
                this.$http.delete('_sc:/scoreRecord/'+result).then(data=>{
                     if (data.code==0){
                         this.$message({
                            message: '批量退回成功',
                            type: 'success'
                        });
                         this.getExaminationtType(); //刷新列表
                     }
                }).catch(()=>{
                     this.tableLoading=true;
                    this.$message.error('批量退回失败');  
                })
             
            },
          
             //发布
            onIssue(row){
          
                let a =this.dataIdList;
                let s = new Set(a);
                let result = Array.from(s);
                this.$http.put('_sc:/scoreRecord',{
                    ids:[row.id],
                    status:2
                }).then(data=>{
                    if (data.code==0){
                        this.$message({
                            message: '发布成功',
                            type: 'success'
                        });
                         this.getExaminationtType(); //刷新列表
                    }
                }).catch(()=>{
                    this.tableLoading=true;
                    this.$message.error('发布失败');  
                })
            },
        
            onSendBack(row) {
                    this.$confirm(`此操作将永久退回 ${row.termName} 的 ${row.courseName} 成绩信息 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.$http.delete("_sc:/scoreRecord/" +[row.id] )
                        .then(data => {
                        let type = "success";
                        let message = "退回成功！";
                        if (data.code === 0) {
                            let self = this
                            self.onSearch();
                        } else {
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
                        message: '已取消退回'
                    });
                    });

        },
             //撤回发布
            onRecallIssue(row){
              
                let a =this.dataIdList;
                let s = new Set(a);
                let result = Array.from(s);
                this.$http.put('_sc:/scoreRecord',{
                    ids:[row.id],
                    status:1
                }).then(data=>{
                    if (data.code==0){
                        this.$message({
                            message: '撤回发布成功',
                            type: 'success'
                        });
                       this.getExaminationtType(); //刷新列表
                    }
                }).catch(()=>{
                    this.tableLoading=true;
                    this.$message.error('撤回发布失败');  
                })
            },
            //  显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getExaminationtType();
            },
            // 翻页
            currentChange(current){
                this.pageNo=current;
                this.getExaminationtType();
            },
            // 展开收起
            collapseShow(){
              this.fold.state=!this.fold.state;
              this.fold.text=this.fold.state?'收起':'展开';
            },
            // 查询搜索
            onSearch(){
                this.pageNo=1;
                this.getExaminationtType(); 
            },
            //   获取列表
            getExaminationtType(){
               
               this.tableLoading=true;
               this.$http.post("_sc:/scoreRecord/queryPageList",{
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    param:{
                         termId:this.queryList.termId,//学期
                         status:this.queryList.status,//状态
                         courseId:this.queryList.courseId,//课程ID
                         examTypeCode:this.queryList.scoreType,//考试类型
                         majorId:this.queryList.majorId,
                         grade:this.queryList.grade
                        //  resit:this.queryList.resit//补考记载表
                    }
                    }).then(data=>{
                        this.tableLoading=false;
                        this.tableData=data.result;
                        this.totalCount=data.totalCount;
                        
                    }).catch(()=>{
                        this.tableLoading=true;
                    })  
            },
            // 学期下拉数据获取
            getTermData(query){
                if(!query){
                    query = "学期";
                }
                this.$http.get('_op:/terms/'+query)
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data.reverse();
                        
                            for(let i=0;i<this.options1.length;i++){
                              
                                    if(!this.queryList.termId && this.options1[i].name.indexOf('当前学期')!=-1){
                                        this.queryList.termId=this.options1[i].id
                                        this.addForm = this.options1[i].name;
                                        this.semesterNum = this.options1[i].orderNum;
                                        this.fallYear =this.options1[i].year;
                                    }
                                
                            }
                            this.onSearch();
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            }

        }
    }
</script>

<style scoped lang='less'>
.cm-table /deep/ .el-button--small{
    padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
    padding: 3px 0;
}
.cm-table{
    margin-bottom: 10px
}
.cm-btn-con{
    padding: 0 20px 6px 20px;
}
@media print {
  #dalongs {page-break-before: always;}
  h1 {page-break-after: always;}
  p {page-break-inside: avoid;}
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
.butStyle{
  margin-top:20px;
}

@page { margin: 0; }
#dalongs{
    font-size: 6px;
}

    .cm-addGrade p{
        margin-bottom: 12px;
    }
    .dialogheader{
    display: flex;
    position: relative;
    border-bottom: solid 1px #66666636;
    height: 50px;
    .btnbox{
        position: absolute;
        right: 0px;
    }
}
.printcontent{
    font-size: 10px;
    border: solid 1px #66666636;
    .title{
        font-size: 20px;
        text-align: center;
        line-height: 50px;
    }
    .text{
        position: relative;
        font-size: 16px;
        text-align: center;
        .subTime{
            position: absolute;
            right: 20px;
            font-size: 10px;
            margin-top: 5px;
          
        };
         .subTime1{
           
            font-size: 10px;
           
        }
    }
    .tab1{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 40px;
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
    font-size: 10px;
    font-weight: bold;
    color: #333;

}
.tab2{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 40px;
            font-size: 10px;
        }
       
    }
    .printtable{
  /deep/.el-dialog__body{
      padding-top: 0px
  }
  .printtitle{
    font-size: 20px;
    font-weight: bold;
    text-align: center
  }
  .printtitle2{
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
  }
  .printcont{
    width: 100%;
    margin: 0 auto;
    margin-top: 5px;
    min-height: 500px;
    
  }
    .printfont{
     width: 100%;
    margin: 0 auto;
    margin-top: 5px;
  }
  .autograph1{
    width: 50%;
  }
}
.printtitle{
    font-size: 18px;
    font-weight: bold;
    text-align: center
  }
    .printtable{
        /deep/.el-dialog__body{
            padding-top: 0px
        }
    }    
      .printfont{
     width: 100%;
    margin: 0 auto;
    margin-top: 5px;
  }
  .autograph1{
    width: 50%;
  }
  .autograph{
  display: flex;
  flex-wrap: wrap;
   .autograph1{
    width: 50%;
    line-height: 50px;
  }
}
</style>