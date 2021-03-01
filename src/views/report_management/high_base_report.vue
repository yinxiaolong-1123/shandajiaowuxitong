<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
           <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                         <el-form-item label="年份">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="searchForm.year"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年份"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="报表类型">
                            <el-select  clearable v-model="searchForm.reportType" filterable placeholder="请选择报表类型">
                                <el-option v-for="list in options" :key="list.type" :label="list.type_name" :value="list.type"></el-option>
                            </el-select>
                        </el-form-item>
						<el-form-item >
							<el-button type="primary" @click="searchData()" v-if="btnPerObj.query">查询</el-button>
						</el-form-item> 
                        <el-form-item >
							<el-button type="primary" @click="setUp">创建</el-button>
						</el-form-item>
                    </div>
                </div>
                <div class="textStyle">
                    <h5>高基报表为自动化产生报表，频率：1年/次  ，十一期间自动产生，请及时完成相关基础工作</h5>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
					size="mini"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
                <el-table-column prop="typeName" label="报表类别"></el-table-column>
                <el-table-column prop="name" label="报表名称"></el-table-column>
                <el-table-column prop="createUserName" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="报表日期"></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="seeDialogTable(scope.row)"  v-if="btnPerObj.see">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
     

         <!-- _____________________  表格1  _________________ -->
        <el-dialog
            title="高基341在校生中其他情况"
            :visible.sync="dialogTable1"
            width="80%"
            height='50%'
           :modal-append-to-body='false'
            :before-close="handleClose1">
                <div class="boxStyle  styleSet">单位:人</div>
                <div  class="cm-table">
                <table class="stationtable" >
                    <tr>
                        <td></td>
                        <td>编号</td>
                        <td>共产党员</td>
                        <td>共青团员</td>
                        <td>民主党派</td>
                        <td>华侨</td>
                        <td>香港</td>
                        <td>澳门</td>
                        <td>台湾</td>
                        <td>少数民族</td>
                        <td>残疾人</td>
                    </tr>
                    <tr v-for="(item1,index1) in tableData1" :key="index1">
                        <td>{{item1.majorName}}</td>
                        <td>{{item1.number}}</td>
                        <td>{{item1.communist}}</td>
                        <td>{{item1.leagueMembers}}</td>
                        <td>{{item1.democraticParties}}</td>
                        <td>{{item1.overseasChinese}}</td>
                        <td>{{item1.xianggang}}</td>
                        <td>{{item1.aomen}}</td>
                        <td>{{item1.taiwan}}</td>
                        <td>{{item1.minorities}}</td>
                        <td>{{item1.disabled}}</td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                 <a v-show="false" ref="exportExcel"></a>
                 <el-button @click="importEXCEL341" type="primary">导出EXCEL</el-button>
                <el-button type="primary" @click="exportOtherCircumstances()">导出WORD</el-button>
                <el-button @click="dialogTable1 = false">关闭</el-button>
            </span>
        </el-dialog>
         <!--  ———————————— 高基附二表 表格2 —————————————————— -->
         <el-dialog
            title="高基附二表"
            :visible.sync="dialogTable2"
            width="80%"
            height='50%'
            :modal-append-to-body='false'
            :before-close="handleClose2">
            <div class="boxStyle  styleSet">单位:人</div>
            <div class="titleText7">
                <h1 class="titleStyleText">高等教育分地市招生生源情况表</h1>
            </div>
        
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td rowspan="2">1</td>
                        <td rowspan="2">序号</td>
                        <td colspan="2">研究生</td>
                        <td  colspan="2">普通本专科生</td>
                        <td  colspan="2">成人本专科</td>
                        <td  colspan="2">网络教育本专科</td>
                    </tr>
                    <tr>
                        <td>招生数</td>
                        <td>在校生数量</td>
                        <td>招生数</td>
                        <td>在校生数量</td>
                        <td>招生数</td>
                        <td>在校生数量</td>
                        <td>招生数</td>
                        <td>在校生数量</td>
                    </tr>
                    <tr v-for="(item2,index2) in tableData2" :key="index2" >
                        <td>{{item2.province}}</td>
                        <td>{{item2.number}}</td>
                        <td>{{item2.graduateStuSupply}}</td>
                        <td>{{item2.graduateStuAtSchool}}</td>
                        <td>{{item2.undergraduateSpecialtySupply}}</td>
                        <td>{{item2.undergraduateAtSchool}}</td>
                        <td>{{item2.adultUndergraduateSpecialtySupply}}</td>
                        <td>{{item2.adultUndergraduateSpecialtyAtSchool}}</td>
                        <td>{{item2.networkUndergraduateSpecialtySupply}}</td>
                        <td>{{item2.networkUndergraduateSpecialtyAtSchool}}</td>
                    </tr>
                </table>
                <p>注:招生数指本学年正式录取并已注册在校的学生数；分地市填报是指招生的生源，即在哪一个地级市录取的学生数，</p>
                <p>表中的招生数及在校学生总计行应分别与高基211.212.231.214表的相关数据相等</p>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="exportEnrolment()">导出Excel</el-button>
                     <a v-show="false" ref="exportExcel"></a>
                <el-button @click="dialogTable2 = false" style="margin-left:10px;">关闭</el-button>
            </span>
        </el-dialog>
         <!-- ——————————————  高基附一表 表格3 ————————————————-->
        <el-dialog
            title="高基附一表"
            :visible.sync="dialogTable3"
            width="80%"
            height='50%'
           :modal-append-to-body='false'
            :before-close="handleClose3">
            <div class="boxStyle  styleSet">单位:人</div>
            <div class="titleText">
                <h3 class="titleStyleText">高等学校校区分布情况</h3>
                <div class="rightStyle">
                    <p>制表机关:广东省教育厅</p>
                    <p>审批机关:广东省统计局</p>
                    <p>审批文号:粤统制表字[2003]10号</p>
                    <p>表号:高基附一表</p>
                </div>

            </div>
        
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td rowspan="4">校区(含二级院校)名称</td>
                        <td rowspan="4">校址</td>
                        <td rowspan="4">办学形式</td>
                        <td rowspan="4">编号</td>
                        <td colspan="8">招生(人)</td>
                        <td colspan="8">在校生(人)</td>
                        <td colspan="2">占地面积(平方米)</td>
                        <td colspan="2">校舍面积(平方米)</td>
                        <td colspan="2">教学与行政用房(平方米)</td>
                    </tr>
                    <tr>
                        <td  colspan="2">研究生</td>
                        <td  colspan="2">普通本专科</td>
                        <td  colspan="2">成人本专科</td>
                        <td  colspan="2">网络本专科</td>
                        <td  colspan="2">研究生</td>
                        <td  colspan="2">普通本专科</td>
                        <td colspan="2">成人本专科</td>
                        <td colspan="2">网络本专科</td>
                        <td rowspan="3">学校产权</td>
                        <td rowspan="3">非学校产权独立使用</td>
                        <td rowspan="3">学校产权</td>
                        <td rowspan="3">非学校产权独立使用</td>
                        <td rowspan="3">学校产权</td>
                        <td rowspan="3">非学校产权独立使用</td>
                    </tr>
                    <tr>
                    
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                        <td  rowspan="2">计</td>
                        <td>其中:</td>
                        <td rowspan="2">计</td>
                        <td></td>
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                        <td rowspan="2">计</td>
                        <td>其中:</td>
                    
                    </tr>
                    <tr>
                        <td>博士</td>
                        <td>本科</td>
                        <td>本科</td>
                        <td>本科</td>
                        <td>博士</td>
                        <td>本科</td>
                        <td>本科</td>
                        <td>本科</td>
                    </tr>
                    <tr v-for="(item3,index3) in tableData3" :key="index3">
                        <td>{{item3.schoolName}}</td>
                        <td>{{item3.address}}</td>
                        <td>{{item3.schoolingType}}</td>
                        <td>{{item3.number}}</td>
                        <td>{{item3.supplyGraduateTotal}}</td>
                        <td>{{item3.supplyDoctor}}</td>
                        <td>{{item3.supplyUndergraduateSpecialty}}</td>
                        <td>{{item3.supplyUndergraduate}}</td>
                        <td>{{item3.supplyAdultUndergraduateSpecialty}}</td> 
                        <td>{{item3.supplyAdultUndergraduate}}</td> 
                        <td>{{item3.supplyNetworkUndergraduateSpecialty}}</td> 
                        <td>{{item3.supplyNetworkUndergraduate}}</td>  
                        <td>{{item3.atSchoolGraduateTotal}}</td>
                        <td>{{item3.atSchoolDoctor}}</td>
                        <td>{{item3.atSchoolUndergraduateSpecialty}}</td>
                        <td>{{item3.atSchoolUndergraduate}}</td>
                        <td>{{item3.atSchoolAdultUndergraduateSpecialty}}</td> 
                        <td>{{item3.atSchoolAdultUndergraduate}}</td> 
                        <td>{{item3.atSchoolNetworkUndergraduateSpecialty}}</td> 
                        <td>{{item3.atShcoolNetworkUndergraduate}}</td> 
                        <td>{{item3.schoolProperty}}</td>
                        <td>{{item3.noSchoolProperty}}</td>
                        <td>{{item3.schoolBuildingProperty}}</td> 
                        <td>{{item3.noSchoolBuildingProperty}}</td>
                        <td>{{item3.academicBuildingProperty}}</td> 
                        <td>{{item3.noAcademicBuildingProperty}}</td>
                    </tr>
                </table>
                <p>注: 表中的招生数量及在校学生总计行分别与高级211.212.213.214表的有关数据相等 </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="exportCampusDistribution()">导出Excel</el-button>
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="dialogTable3 = false" style="margin-left:10px;">关闭</el-button>
            </span>
        </el-dialog>
         <!-- ———————————— 高基321 表格4 ——————————————————— -->
      <el-dialog
        title="高基321在校生分年龄情况 "
        :visible.sync="dialogTable4"
        width="80%"
        height='50%'
       :modal-append-to-body='false'
        :before-close="handleClose4">
            <div class="boxStyle  styleSet">单位:人</div>
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td>空白格</td>
                        <td>编号</td>
                        <td>合计</td>
                        <td>17岁及以下</td>
                        <td>18岁</td>
                        <td>19岁</td>
                        <td>20岁</td>
                        <td>21岁</td>
                        <td>22岁</td>
                        <td>23岁</td>
                        <td>24岁</td>
                        <td>25岁</td>
                        <td>26岁</td>
                        <td>27岁</td>
                        <td>28岁</td>
                        <td>29岁</td>
                        <td>30岁</td>
                        <td>31岁及以上</td>
                    </tr>
                    <tr  v-for="(item4,index4) in tableData4" :key="index4">
                        <td>{{item4.education}}</td>
                        <td>{{item4.number}}</td>
                        <td>{{item4.total}}</td>
                        <td>{{item4.seventeenAbove}}</td>
                        <td>{{item4.eighteen}}</td>
                        <td>{{item4.nineteen}}</td>
                        <td>{{item4.twenty}}</td>
                        <td>{{item4.twentyOne}}</td>
                        <td>{{item4.twentyTwo}}</td>
                        <td>{{item4.twentyThree}}</td>
                        <td>{{item4.twentyFour}}</td>
                        <td>{{item4.twentyFive}}</td>
                        <td>{{item4.twentySix}}</td>
                        <td>{{item4.twentySeven}}</td>
                        <td>{{item4.twentyEight}}</td>
                        <td>{{item4.twentyNine}}</td>
                        <td>{{item4.thirty}}</td>
                        <td>{{item4.thirtyOneFollow}}</td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importEXCEL321" type="primary">导出EXCEL</el-button>
                <el-button type="primary" @click="exportStudentAge()">导出WORD</el-button>
                <el-button @click="dialogTable4 = false">关闭</el-button>
            </span>
      </el-dialog>
         <!-- —————————————  331 表格5  ———————————————————— -->
        <el-dialog
            title="高基331学生变动情况"
            :visible.sync="dialogTable5"
            width="80%"
            height='50%'
           :modal-append-to-body='false'
            :before-close="handleClose5">
                <div class="boxStyle  styleSet">单位:人</div>
                <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td rowspan="2">1</td>
                        <td rowspan="2">编号</td>
                        <td rowspan="2">上学年初报表在校人数</td>
                        <td colspan="5">增加学生数</td>
                        <td colspan="9">减少学生数量</td>
                        <td rowspan="2">本学年初报表在校生数</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td>招生</td>
                        <td>复学</td>
                        <td>转入</td>
                        <td>其他</td>
                        <td>合计</td>
                        <td>毕业</td>
                        <td>结业</td>
                        <td>休学</td>
                        <td>退学</td>
                        <td>开除</td>
                        <td>死亡</td>
                        <td>转出</td>
                        <td>其他</td>
                    </tr>
                    <tr v-for="(item5,index5) in tableData5" :key="index5">
                        <td>{{item5.education}}</td>
                        <td>{{item5.number}}</td>
                        <td>{{item5.academicYearAtSchool}}</td>
                        <td>{{item5.increaseCount}}</td>
                        <td>{{item5.supply}}</td>
                        <td>{{item5.reinstat}}</td>
                        <td>{{item5.transfer}}</td>
                        <td>{{item5.increaseOther}}</td>
                        <td>{{item5.reduceCount}}</td>
                        <td>{{item5.graduation}}</td>
                        <td>{{item5.complete}}</td>
                        <td>{{item5.leaveSchool}}</td>
                        <td>{{item5.outSchool}}</td>
                        <td>{{item5.expel}}</td>
                        <td>{{item5.death}}</td>
                        <td>{{item5.rollOut}}</td>
                        <td>{{item5.reduceOther}}</td>
                        <td>{{item5.thisSemesterAtSchool}}</td>
                    </tr>
                
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL331" type="primary">导出EXCEL</el-button>
                <el-button type="primary" @click='exportStudentChange()'>导出WORD</el-button>
                <el-button @click="dialogTable5 = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- ——————————  322 表格6    ————————————————————— -->
        <el-dialog
            title="高基322招生在校生来源情况"
            :visible.sync="dialogTable6"
            width="80%"
            height='50%'
           :modal-append-to-body='false'
            :before-close="handleClose6">
            <div class="boxStyle  styleSet">单位:人</div>
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td rowspan="2">1</td>
                        <td rowspan="2">编号</td>
                        <td colspan="3">招生数</td>
                    
                        <td colspan="9">在校生数</td>
                    
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td>普通专科生</td>
                        <td>普通本科生</td>
                        <td>合计</td>
                        <td>普通专科生</td>
                        <td>普通本科生</td>
                        <td>成人专科生</td>
                        <td>成人本科生</td>
                        <td>网络专科生</td>
                        <td>网络本科生</td>
                        <td>硕士研究生</td>
                        <td>博士研究生</td>
                    </tr>
                    <tr v-for="(item6,index6) in tableData6" :key="index6">
                        <td>{{item6.province}}</td>
                        <td>{{item6.number}}</td>
                        <td>{{item6.supplyCount}}</td>
                        <td>{{item6.juniorCollegeOne}}</td>
                        <td>{{item6.undergraduateOne}}</td>
                        <td>{{item6.atSchoolCount}}</td>
                        <td>{{item6.juniorCollegeTow}}</td>
                        <td>{{item6.undergraduateTow}}</td>
                        <td>{{item6.adultJuniorCollege}}</td>
                        <td>{{item6.adultUndergraduate}}</td>
                        <td>{{item6.networkJuniorCollege}}</td>
                        <td>{{item6.networkUndergraduate}}</td>
                        <td>{{item6.masterDegreeCandidate}}</td>
                        <td>{{item6.doctoralStudent}}</td>
                    </tr>
                
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL322" type="primary">导出EXCEL</el-button>
                <el-button type="primary" @click="exportSource()">导出WORD</el-button>
                <el-button @click="dialogTable6 = false">关闭</el-button>
            </span>
        </el-dialog>
      <!-- _______________   312  表格7   ____________________ -->
        <el-dialog
            title="高基312普通本科分专业学生数"
            :visible.sync="dialogTable7"
            width="80%"
            height='50%'
            :modal-append-to-body='false'
            :before-close="handleClose7">
            <div  class="cm-table">
            <div class="boxStyle  styleSet">单位:人</div>
            <table class="stationtable">
                <tr>
                    <td rowspan="3">专业名称</td>
                    <td rowspan="3">自主专业名称</td>
                    <td rowspan="3">专业代码</td>
                    <td rowspan="3">年制</td>
                    <td rowspan="3">毕业生数量</td>
                    <td rowspan="3">授予学位数</td>
                    <td colspan="4">招生数</td>
                    <td colspan="6">在校生数</td>
                    <td rowspan="3">预计毕业生</td>
                </tr>
                <tr>
                    <td rowspan="2">计</td>
                    <td colspan="3">其中:</td>
                    <td rowspan="2">合计</td>
                    <td  rowspan="2">一年级</td>
                    <td  rowspan="2">二年级</td>
                    <td  rowspan="2">三年级</td>
                    <td  rowspan="2">四年级</td>
                    <td rowspan="2">五年级以上</td>
                </tr>
                <tr>
                    <td>应届毕业生</td>
                    <td>春季招生</td>
                    <td>预科生转入</td>
                </tr>
                <tr  v-for="(item7,index7) in tableData7" :key="index7">
                    <td>{{item7.majorName}}</td>
                    <td>{{item7.autonomyMajorName}}</td>
                    <td>{{item7.majorCode}}</td>
                    <td>{{item7.academicYear}}</td>
                    <td>{{item7.graduate}}</td>
                    <td>{{item7.grantDegree}}</td>
                    <td>{{item7.supplyCount}}</td>
                    <td>{{item7.freshGraduate}}</td>
                    <td>{{item7.springSupply}}</td>
                    <td>{{item7.prepTurn}}</td>
                    <td>{{item7.atSchoolCount}}</td>
                    <td>{{item7.oneGrade}}</td>
                    <td>{{item7.twoGrade}}</td>
                    <td>{{item7.threeGrade}}</td>
                    <td>{{item7.fourGrade}}</td>
                    <td>{{item7.exceedFiveGrade}}</td>
                    <td>{{item7.estimateGraduate}}</td>
                </tr>
            </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL312" type="primary">导出EXCEL</el-button>
                <el-button type="primary" @click="exportStudentReportForm">导出WORD</el-button>
                <el-button @click="dialogTable7 = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="高基811高等学校学生民族成份"
            :visible.sync="dialogTable8"
            width="80%"
            height='50%'
            :modal-append-to-body='false'
            :before-close="handleClose8">
            <div class="boxStyle  styleSet">单位:人</div>
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td rowspan="2"></td>
                        <td rowspan="2">编号</td>
                        <td rowspan="2">合计</td>
                        <td rowspan="2">汉族</td>
                        <td colspan="14">少数民族</td>
                    </tr>
                    <tr>
                        <td>小计</td>
                        <td>维吾尔</td>
                        <td>哈萨克</td>
                        <td>回</td>
                        <td>乌孜别克</td>
                        <td>柯尔克孜</td>
                        <td>锡伯</td>
                        <td>满</td>
                        <td>蒙古</td>
                        <td>达斡尔</td>
                        <td>塔塔尔</td>
                        <td>塔吉克</td>
                        <td>俄罗斯</td>
                        <td>其他</td>
                    </tr>
                    <tr v-for="(item8,index8) in tableData8" :key="index8">
                        <td><div style="width:100px; margin: 0 auto">{{item8.education}}</div></td>
                        <td>{{item8.number}}</td>
                        <td>{{item8.heji}}</td>
                        <td>{{item8.hanzhu}}</td>
                        <td>{{item8.xiaoji}}</td>
                        <td>{{item8.weiwuer}}</td>
                        <td>{{item8.hasake}}</td>
                        <td>{{item8.hui}}</td>
                        <td>{{item8.wuzibieke}}</td>
                        <td>{{item8.keerkezi}}</td>
                        <td>{{item8.xibo}}</td>
                        <td>{{item8.man}}</td>
                        <td>{{item8.menggu}}</td>
                        <td>{{item8.dahaner}}</td>
                        <td>{{item8.tataer}}</td>
                        <td>{{item8.tajike}}</td>
                        <td>{{item8.erluosi}}</td>
                        <td>{{item8.qita}}</td>
                    </tr>
                
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL811" type="primary">导出EXCEL</el-button>
                <!-- <el-button type="primary" @click="exportSource811">导出WORD</el-button> -->
                <el-button @click="dialogTable8 = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="高基332学生退学的主要原因"
            :visible.sync="dialogTable9"
            width="80%"
            height='50%'
            :modal-append-to-body='false'
            :before-close="handleClose9">
            <div class="boxStyle  styleSet">单位:人</div>
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td ></td>
                        <td >编号</td>
                        <td>合计</td>
                        <td>患病</td>
                        <td>停止实践(求职)</td>
                        <td>贫困</td>
                        <td>学习成绩不好</td>
                        <td>出国</td>
                        <td>其他</td>
                    </tr>
                    <tr v-for="(item9,index9) in tableData9" :key="index9">
                        <td>{{item9.education}}</td>
                        <td>{{item9.number}}</td>
                        <td>{{item9.heji}}</td>
                        <td>{{item9.huanbing}}</td>
                        <td>{{item9.tingxueshijian}}</td>
                        <td>{{item9.pinkun}}</td>
                        <td>{{item9.xuexichengjibuhao}}</td>
                        <td>{{item9.chuguo}}</td>
                        <td>{{item9.qita}}</td>
                    </tr>
                
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL332" type="primary">导出EXCEL</el-button>
                <!-- <el-button type="primary" @click="exportSource332">导出WORD</el-button> -->
                <el-button @click="dialogTable9 = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="高基63001在校学生中的少数民族分族人数"
            :visible.sync="dialogTable10"
            width="80%"
            height='50%'
            :modal-append-to-body='false'
            :before-close="handleClose10">
            <div class="boxStyle  styleSet">单位:人</div>
            <div  class="cm-table">
                <table class="stationtable">
                    <tr>
                        <td ></td>
                        <td >编号</td>
                        <td>合计</td>
                        <td>博士生</td>
                        <td>硕士生</td>
                        <td>普通本科生</td>
                        <td>普通专科生</td>
                        <td>成人本科生</td>
                        <td>成人专科生</td>
                        <td>网络本科生</td>
                        <td>网络专科生</td>
                    </tr>
                    <tr v-for="(item10,index10) in tableData10" :key="index10">
                        <td>{{item10.minzu}}</td>
                        <td>{{item10.number}}</td>
                        <td>{{item10.heji}}</td>
                        <td>{{item10.boshi}}</td>
                        <td>{{item10.shuoshi}}</td>
                        <td>{{item10.putongbenke}}</td>
                        <td>{{item10.putongzhuanke}}</td>
                        <td>{{item10.chengnianbenke}}</td>
                        <td>{{item10.chengnianzhuanke}}</td>
                        <td>{{item10.wangluobenke}}</td>
                        <td>{{item10.wangkezhuanke}}</td>
                    </tr>
                
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <a v-show="false" ref="exportExcel"></a>
                <el-button @click="importEXCEL53001" type="primary">导出EXCEL</el-button>
                <!-- <el-button type="primary" @click="exportSource53001">导出WORD</el-button> -->
                <el-button @click="dialogTable10 = false">关闭</el-button>
            </span>
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
    import util from '@/util'
    export default {
        name: "synchronous_data",
        data() {
            return {
				searchForm:{//搜索
                    year:"",
					reportType:"",
				},
                breadcrumb: [//面包屑
                    {label: "报表管理"},
                    {label: "高基报表"},
                ],
                options: [],
                EXCELid: '',
                dialogTable1:false,
                dialogTable2:false,
                dialogTable3:false,
                dialogTable4:false,
                dialogTable5:false,
                dialogTable6:false,
                dialogTable7:false,
                dialogTable8:false,
                dialogTable9:false,
                dialogTable10:false,
                tableData: [],
                tableData1: [],
                tableData2: [],
                tableData3: [],
                tableData4: [],
                tableData5: [],
                tableData6: [],
                tableData7: [],
                tableData8: [],
                tableData9: [],
                tableData10: [],
                tableData1Id: "",
                tableData2Id: "",
                tableData3Id: "",
                tableData4Id: "",
                tableData5Id: "",
                tableData6Id: "",
                tableData7Id: "",
                tableData8Id: "",
                tableData9Id: "",
                tableData10Id: "",
                dialogTable:false,
				 btnPerObj:{//按钮权限
                  query:false,
                  see:false
                },
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                
            }
        },
        components:{ },
        filters: {},
	    watch: { },
        mounted(){
		  
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            this.getgaojiReport()
			this.getDataList();//获取列表数据
        },
        methods: {
		 //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
             
                    data.data.map(item => {
                        if (item.code=="query_High_base_statement") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="see_High_base_statement") {
                            self.btnPerObj.see=true;
                        }
                       
                    });
                }).catch(()=>{
                })
            },
        seeDialogTable(row){
            this.EXCELid = row.id
            // ci
            this.$http.get("_op:/gaojiReport/"+row.type+"/"+row.id).then(res=>{
                 if(row.type=="political"){
                  
                    this.dialogTable1=true;
                    this.tableData1=res.data;
                    this.tableData1Id=row.id
                }else if(row.type=="regionSupply"){
                
                     this.dialogTable2=true;
                     this.tableData2=res.data;
                     this.tableData2Id=row.id
                }else if(row.type=="schoolConfiguration"){
                
                  
                     this.dialogTable3=true;
                     this.tableData3=res.data;
                     this.tableData3Id=row.id
                }else if(row.type=="singleAge"){
               
                     this.dialogTable4=true;
                     this.tableData4=res.data;
                     this.tableData4Id=row.id
                }else if(row.type=="stuChange"){
                
                     this.dialogTable5=true;
                     this.tableData5=res.data;
                     this.tableData5Id=row.id
                }else if(row.type=="supplyAtSchool"){
                  
                     this.dialogTable6=true;
                     this.tableData6=res.data;
                     this.tableData6Id=row.id
                }else if(row.type=="undergraduateMajor"){
                 
                     this.dialogTable7=true;
                     this.tableData7=res.data;
                     this.tableData7Id=row.id
                }else if(row.type=="queryGaojiNational") {
                    this.dialogTable8 = true
                    this.tableData8=res.data;
                    this.tableData8Id=row.id // 811
                }else if (row.type=="queryGaojiReson") {
                    this.dialogTable9 = true
                    this.tableData9=res.data;
                    this.tableData9Id=row.id // 332
                }else if (row.type=="queryGaojiNaNum") {
                    this.dialogTable10 = true
                    this.tableData10=res.data;
                    this.tableData10Id=row.id // 53001
                }
                

            })

        },



        // 弹窗关闭
        handleClose1(){
            this.dialogTable1=false;
        },
        handleClose2(){
            this.dialogTable2=false;
        },
        handleClose3(){
            this.dialogTable3=false;
        },
        handleClose4(){
            this.dialogTable4=false;
        },
        handleClose5(){
            this.dialogTable5=false;
        },
        handleClose6(){
            this.dialogTable6=false;
        },
        handleClose7(){
            this.dialogTable7=false;
        },
        handleClose8(){
            this.dialogTable8=false;
        },
        handleClose9() {
            this.dialogTable9 = false
        },
        handleClose10() {
            this.dialogTable10 = false
        },
        newTime(fmt){
             var o = {   
                "M+" : this.getMonth()+1,                 //月份   
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时   
                "m+" : this.getMinutes(),                 //分   
                "s+" : this.getSeconds(),                 //秒   
                "q+" : Math.floor((this.getMonth()+3)/3), //季度   
                "S"  : this.getMilliseconds()             //毫秒   
              };   
              if(/(y+)/.test(fmt))   
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
              for(var k in o)   
                if(new RegExp("("+ k +")").test(fmt))   
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
              return fmt;   
        },
        // 获取报表类型
        getgaojiReport() {
            this.$http.get('_op:/gaojiReport/queryReportType').then(data => {
                if(data.code == 0) {
                    this.options = data.data
                }
            })
        },
	   // 获取列表
        getDataList(){
         
            this.$http.post("_op:/gaojiReport/list",{
                pageNo: this.pageNo,
                pageSize:this.pageSize,
                param: {
                    type:this.searchForm.reportType ,
                    year: this.searchForm.year
                }
            })
            .then(data=>{
                for(let i=0;i<data.result.length;i++){
                    let times = data.result[i].createTime
                    data.result[i].createTime =  this.timestampToTime(times)
                }
                this.tableData=data.result
                this.totalCount=data.totalCount;
            })
        },
        // 导出excel 
        importEXCEL341() {
             this.$http({
                method:'get',
                url: '_op:/gaojiReport/exportPoliticalReportExcel/' + this.EXCELid,
                responseType: 'blob'
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "学高基341.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        importEXCEL321() {
            this.$http({
                method:'get',
                url: '_op:/gaojiReport/exportSingleAgeReportExcel/' + this.EXCELid,
                responseType: 'blob'
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "321.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        importEXCEL331() {
             this.$http({
                method:'get',
                url: '_op:/gaojiReport/exportStuChangeReportExcel/' + this.EXCELid,
                responseType: 'blob'
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "331.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        importEXCEL322() {
            this.$http({
                method:'get',
                url: '_op:/gaojiReport/exportSupplyAtSchoolExcel/' + this.EXCELid,
                responseType: 'blob'
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "322.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        importEXCEL312() {
             this.$http({
                method:'get',
                url: '_op:/gaojiReport/exportUndergraduateMajorExcel/' + this.EXCELid,
                responseType: 'blob'
            }).then(data => {
                    let blob = new Blob([data], {type: 'application/x-excel'});
                    let url = window.URL.createObjectURL(blob);
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "312.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
            }).catch(error => {
                this.$message.error('导出失败')
            })
        },
        importEXCEL811() {
            let param = {
                id: this.tableData8Id,
                type: 'queryGaojiNational',
                extendValue: '',
                userId: JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            }
            this.$http({
                method: 'post',
                url: '_op:gaojiReport/pReportComExcel',
                responseType: 'blob',
                data: param
            }).then(data => {
                let blob = new Blob([data], {type: 'application/x-excel'});
                let url = window.URL.createObjectURL(blob);
                let y = this.$refs.exportExcel;
                y.href = url
                y.setAttribute('download', "811.xls");
                y.click();
                window.URL.revokeObjectURL(url)
            })
        },
        importEXCEL332() {
            let param = {
                id: this.tableData9Id,
                type: 'queryGaojiReson',
                extendValue: '',
                userId: JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            }
            this.$http({
                method: 'post',
                url: '_op:gaojiReport/pReportComExcel',
                responseType: 'blob',
                data: param
            }).then(data => {
                let blob = new Blob([data], {type: 'application/x-excel'});
                let url = window.URL.createObjectURL(blob);
                let y = this.$refs.exportExcel;
                y.href = url
                y.setAttribute('download', "332.xls");
                y.click();
                window.URL.revokeObjectURL(url)
            })
        },
        importEXCEL53001() {
             let param = {
                id: this.tableData10Id,
                type: 'queryGaojiNaNum',
                extendValue: '',
                userId: JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            }
            this.$http({
                method: 'post',
                url: '_op:gaojiReport/pReportComExcel',
                responseType: 'blob',
                data: param
            }).then(data => {
                let blob = new Blob([data], {type: 'application/x-excel'});
                let url = window.URL.createObjectURL(blob);
                let y = this.$refs.exportExcel;
                y.href = url
                y.setAttribute('download', "53001.xls");
                y.click();
                window.URL.revokeObjectURL(url)
            })
        },
        // 创建按钮
        setUp() {
            let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            let param = {
                year:parseInt(this.searchForm.year),
                type: this.searchForm.reportType,
                remark: '',
                user_id: user_id
            }
            this.$http.post('_op:/gaojiReport/pGaojiReportGen', param).then(res => {
                if(res.code == 0) {
                    this.$message({
                        type: 'success',
                        message: '创建成功'
                    })
                    this.getDataList()
                }else{
                    this.$message.error('创建失败')
                }
            })
        },
        // 转换时间 年月日
         timestampToTime(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            return Y+M+D
        },
          // 显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.getDataList();//刷新列表
            },
            //分页
            currentChange(current){
                this.pageNo=current;
                this.getDataList();//刷新列表
            },
			// 查询
			searchData() {
                this.getDataList();//查询列表
			
            },
            // 导出 高等在校生其他情况  word  1
            exportOtherCircumstances(){
                 this.$http2.get("/operation/data/admin/gaojiReport/exportPoliticalReport/"+this.tableData1Id).then(data=>{
                    
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高基341在校生中其他情况表.doc");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },
             //导出   高等教育招生情况   Excel 2
            exportEnrolment(row){
                this.$http2.get("/operation/data/admin/gaojiReport/exportRegionSupply/"+this.tableData2Id).then(data=>{
                 
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高等教育分地市招生生源情况表.xlsx");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },

            //导出   高等学校校区分布情况  Excel 3
            exportCampusDistribution(){
                // /gaojiReport/exportSchoolConfiguration/{id}
                 this.$http2.get("/operation/data/admin/gaojiReport/exportSchoolConfiguration/"+this.tableData3Id).then(data=>{
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高等学校校区分布情况表.xlsx");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },
            //导出学生年龄321   word 4
            exportStudentAge(){
                // /gaojiReport/exportSingleAgeReport/{id}
                 this.$http2.get("/operation/data/admin/gaojiReport/exportSingleAgeReport/"+this.tableData4Id).then(data=>{
                  
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高基321在校生分年龄情况表.doc");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })

            },
            //导出331学生变动情况 word 5
            exportStudentChange(){
                 this.$http2.get("/operation/data/admin/gaojiReport/exportStuChangeReport/"+this.tableData5Id).then(data=>{
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高基331学生变动情况表.doc");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },
          
           // 导出322在校生来源情况  word 6
            exportSource(){
                  this.$http2.get("/operation/data/admin/gaojiReport/exportSupplyAtSchoolReport/"+this.tableData6Id).then(data=>{
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高基322招生在校生来源情况表.doc");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },
            // 导出312学生数报表  word  7
            exportStudentReportForm(){
                 this.$http2.get("/operation/data/admin/gaojiReport/exportUndergraduateMajorReport/"+this.tableData7Id).then(data=>{
                      let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "高基312普通本科分专业学生数表.doc");
                        y.click();
                        window.URL.revokeObjectURL(url);
                })
            },
            // 导出811word
          exportSource811() {
              console.log('811')
          },
          // 导出word332
          exportSource332() {
              console.log('332')
          },
          exportSource53001() {
              console.log('53001')
          },
		
			
				
        }
    }
</script>

<style scoped lang="less">
.textStyle{
    padding-bottom: 10px;

}
.dialog-page{
	text-align: right;
	margin-top: 20px;
}
.top-search{
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	.el-input{
		width: 300px;
	}
}
.manager-box{
	display: flex;
	padding-bottom: 20px;
	.left-content{
		width: 20%;
		min-width: 200px;
        max-height: 700px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		margin-right: 2%;
        overflow: auto;
	}
	.right-content{
		width: 100%;
	}
	.right-content-change{
		width: 78%;
	}
	.bottom-content{
		text-align: right;
		margin-top: 20px;
	}
}
.stationtable{
    font-size: 12px;
  	width: 100%;
  	text-align: center;
  	position: relative;
  	margin-bottom: 20px;
  	th {
	  	background-color: #eef1f6;
	  	line-height: 40px;
	  	border: 1px solid #dfe6ec;
	}
	td {
    	width: 3%;
	  	border: 1px solid #dfe6ec;
	  	line-height: 25px;
	  	.el-input{
	  		width: 90%;
        margin: 5px 0;
	  	}
	}
	.bluetext{cursor: pointer;color: #409EFF;font-size: 10px;}
}
.boxStyle{
 position: relative;
} 
.styleSet{
    position:absolute;
    right: 60px;
    top: 60px;
}
.titleText{
   
    width: 100%;
    height: 150px;
    // border: 1px  solid green;
    .titleStyleText{
        text-align: center;
        left: 45%;
    }
    .rightStyle{
        width: 220px;
        height: 100px;
        padding:10px;   
        // border: #409EFF solid 1px;  
        position: absolute;
        left: 58%; 
        p{
            padding:5px 0;
        } 
    }
}
.titleText7{
    width: 100%;
    height: 20px;
    // border: 1px  solid green;
    margin-bottom: 20px;
    .titleStyleText{
        text-align: center;
        left: 45%;
    }
}
</style>