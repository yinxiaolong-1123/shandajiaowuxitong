<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{path:item.path}">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <!-- 筛选条件 -->
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="班级">
                            <!-- <el-select v-model="formInline.class" clearable ref="selectClass" @clear="clearClass">
                                <el-option :value="selectValue" style="height: auto">
                                    <el-tree :data="treeData" node-key="id" ref="tree" @node-click="handleCheckChange"></el-tree>
                                </el-option>
                            </el-select> -->
                            <selectTree :options="treeData" @getValue="getValue"></selectTree>
                        </el-form-item>
                        <el-form-item label="学号/姓名">
                            <el-input v-model="formInline.codeOrName" placeholder="请输入学号/姓名模糊查询"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchTable">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="printCnOrEn('Cn')" :loading="cnLoading">{{cnText}}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="printCnOrEn('En')" :loading="enLoading">{{enText}}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="exportCnOrEn('Cn')" :loading="cnExportLoading">{{cnExportText}}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="exportCnOrEn('En')" :loading="enExportLoading">{{enExportText}}</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table 
                :data="tableData" 
                border 
                style="width: 100%" 
                size="mini"
                @selection-change="handleSelectionChange"
                v-loading="tableLoading" 
                element-loading-text="加载中..." 
                header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" fixed></el-table-column>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="学号" prop="studentNo"></el-table-column>
                <el-table-column label="姓名" prop="studentName"></el-table-column>
                <el-table-column label="年级" prop="grade"></el-table-column>
                <el-table-column label="专业" prop="majorName"></el-table-column>
                <el-table-column label="行政班级" prop="className"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="printRow(scope.row,'Cn')">打印中文版</el-button>
                        <el-button type="text" size="small" @click="printRow(scope.row,'En')">打印英文版</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 成绩的弹框 -->
        <el-dialog 
            id='printContent'  ref="printContent"
            :show-close="false"
            :fullscreen="true"
            :visible.sync="score_dialog"
            :modal-append-to-body="false"
            width="50%"
            :center="true" >
            <div style="padding: 30px 18px 25px 30px;color:#000;"> 
                <div>
                    <img  style="position: absolute; right:43px;" :src="logoUrl" width="60.75" height="65.85" />
                    <div size="mini"   style="width:100%;text-align:center;font-size:22px; height:65.85px;display:flex;justify-content:center;align-items:center">
                        <span class="center" :class="{lh: printLanguage == 'En'}" style="font-weight:600" v-html="printTitleName[printLanguage][0]"> </span>   
                    </div> 
                    <div style="display:flex;justify-content:space-between;align-items:left;height:26px;line-height:26px;font-size:14px">
                        <!-- <div :style=" printLanguage == 'En' ? 'flex:0.8' : 'flex:1'"> -->
                        <span>{{printTitleName[printLanguage][1]}}：{{allData.studentNo}}</span>  
                        <span style="margin-left:10px;">{{printTitleName[printLanguage][2]}}：{{allData['student'+ printLanguage +'Name']}}</span>
                        <!-- </div>  -->
                        <!-- <div  style="flex:1;"> -->
                        <span>{{printTitleName[printLanguage][3]}}：{{allData['major'+ printLanguage +'Name']}}</span>  
                        <span  style="margin-left:10px;">{{printTitleName[printLanguage][4]}}：{{allData['lengthOfSchooling'+ printLanguage +'Name']}}</span>
                        <span style="background:url('')"></span>
                        <!-- </div>  -->
                    </div>
                </div>
                <div  style="display: flex;">
                    <table width="50%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 0px 2px 2px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:18px;line-height:18px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in leftTableData"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:18px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table> 
                    <table width="50%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 1px 2px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:18px;line-height:18px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in rightTableData"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:18px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table>  
                </div> 
                <div  :style="printLanguage == 'Cn' ? 'line-height:20px;margin-top:10px;font-size:12px;' : 'line-height:14px;margin-top:2px;font-size:12px;'"  >
                    <div style=" display: flex;  flex-wrap: wrap; justify-content: space-between;"><span v-html="printTitleName[printLanguage][11]"></span>　<span  v-html="printTitleName[printLanguage][5] +'　'+ nowTime(printLanguage)"></span></div>
                </div>
            </div>
            <span size="mini" slot="footer" class="dialog-footer no-print" >
                <el-button  size="mini"  @click="score_dialog=false">取 消</el-button>
                <el-button  size="mini" type="primary"  @click="printHtml" >打 印</el-button>
            </span>
        </el-dialog>
        <temp v-show="true" id="temp" ref="temp" :printData="printData" :printLanguage="printLanguage"></temp>
        <el-dialog
            id="exportContent"
            :show-close="false"
            :fullscreen="true"
            :visible.sync="export_dialog"
            :modal-append-to-body="false"
            width="50%"
            :center="true">
            <temps v-show="true" :printData="exportData" :printLanguage="printLanguage" @cancelExport="cancelExport"></temps>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import temp from './print_template'
import temps from './export_template'
import selectTree from './el_tree_select'

export default {
    name:"student_score_print",
    data(){
        return {
            breadcrumb:[
                {label:'成绩管理'},
                {label:'学生成绩打印'}
            ],
            tableLoading:false,
            pageNo:1,
            pageSize:20,
            totalCount:0,
            // 超出隐藏
            fold: {
                state: false,
                text: '展开',
                showBtn: false,
            },
            // 查询条件
            formInline:{
                class:'',
                codeOrName:''
            },
            // 选择班级
            selectValue:'',
            // 班级临时存储
            selectValueTemp:'',
            // 班级树形下拉数据
            treeData:[],
            // 班级列表
            classList:[],
            // 表格数据
            tableData:[],
            // 打印表格dialog
            score_dialog:false,
            // 表格多选数据
            multipleSelection:[],
            // 打印表格数据
            allData:{},
            leftTableData:[],
            rightTableData:[],
            logoUrl:'img/stdx_log.png',
            printTitleName:{
                Cn:['汕头大学医学院学生成绩单','学号','姓名','专业','学制','汕头大学医学院教务处  学籍科  日期:','课程内容','学时','学分','成绩','序号','注:标有\'*\'为选修课'],
                En:['STUDENTS\' ACADEMIC RECORDS <br/> OF SHANTOU UNIVERSITY MEDICAL COLLEGE','No','Name','Speciality','Years of Study','The Student Status Section Of Dean\'s Office Of Shantou University Medical College  Date:','Courses','HRS','CRT','GRD','No','Note: Marked \'*\' as an Optional Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HRS is Hours &nbsp;&nbsp;&nbsp; CRT is Credits &nbsp;&nbsp;&nbsp; GRD is Grades']
            },
            lineHeight:18,
            printLanguage:'Cn',
            printData:[],
            cnText:'打印中文成绩',
            cnLoading:false,
            enText:'打印英文成绩', 
            enLoading:false,
            cnExportText:'导出中文成绩单',
            cnExportLoading:false,
            enExportText:'导出英文成绩单',
            enExportLoading:false,
            exportData:[],
            export_dialog:false,
        }
    },
    components:{
        temp,
        temps,
        selectTree
    },
    filters: { 
        showCredit(val) {
            if (val <= 0) return null;
            return val;
        }
    },
    created(){
        this.getClassList()
    },
    mounted(){
        util.resize(this);
        window.onresize = () => {
            util.resize(this);
        };
    },
    // watch:{
    //     selectValue(){
    //         this.searchTable()
    //     }
    // },
    methods:{
        getValue(val){
            if(val == null){
                this.clearClass()
                return
            }
            this.selectValue = val
        },
        // 查询
        searchTable(){
            this.tableLoading = true,
            this.selectValueTemp = this.selectValue
            this.$http.post("_sc:/scoreQueryManage/queryStudentDetail",{
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                classsId:this.selectValueTemp,
                serchInfo:this.formInline.codeOrName,
            }).then(data => {
                this.tableLoading = false
                if(data.code == 0){
                    let res = data.data
                    this.totalCount = res.total_records
                    this.tableData = res.dataList
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        clearClass(){
            this.selectValue = ''
            this.selectValueTemp = ''
            // this.searchTable()
        },
        printCnOrEn(lang){
            if(this.selectValue == '' && this.formInline.codeOrName == '' && this.multipleSelection.length == 0){
                this.$message.error('请选择班级或学生')
                return
            }
            this.printLanguage = lang
            if(lang == 'Cn'){
                this.cnLoading = true
                this.cnText = '正在加载数据,请稍候'
            }else{
                this.enLoading = true
                this.enText = '正在加载数据,请稍候'
            }
            let stdList = []
            let val = ''
            if(this.multipleSelection.length != 0){
                this.multipleSelection.map(item => {
                    stdList.push(item.studentNo)
                })
                val = this.selectValueTemp
            }else{
                val = this.selectValue
            }
            this.$http.post("_sc:/scoreQueryManage/queryBatchStudentScore",{
                classsId:val,
                serchInfo:this.formInline.codeOrName,
                stdNoList:stdList,
                maxRow:51,
                printLanguage:lang
            }).then(res => {
                if(lang == 'Cn'){
                    this.cnLoading = false
                    this.cnText = '打印中文成绩'
                }else{
                    this.enLoading = false
                    this.enText = '打印英文成绩'
                }
                if(res.code == 0){
                    this.printData = res.data
                    this.$nextTick(()=>{
                        this.$print('#print-container')
                    })
                }else{
                    this.$message.error(res.msg);
                }
            }).catch( error => {
                if(lang == 'Cn'){
                    this.cnLoading = false
                    this.cnText = '打印中文成绩'
                }else{
                    this.enLoading = false
                    this.enText = '打印英文成绩'
                }
                this.$message.error('打印失败');
            })
        },
        exportCnOrEn(lang){
            if(this.selectValue == '' && this.formInline.codeOrName == '' && this.multipleSelection.length == 0){
                this.$message.error('请选择班级或学生')
                return
            }
            this.printLanguage = lang
            if(lang == 'Cn'){
                this.cnExportLoading = true
                this.cnExportText = '正在加载数据,请稍候'
            }else{
                this.enExportLoading = true
                this.enExportText = '正在加载数据,请稍候'
            }
            let stdList = []
            let val = ''
            if(this.multipleSelection.length != 0){
                this.multipleSelection.map(item => {
                    stdList.push(item.studentNo)
                })
                val = this.selectValueTemp
            }else{
                val = this.selectValue
            }
            this.$http.post("_sc:/scoreQueryManage/queryBatchStudentScore",{
                classsId:val,
                serchInfo:this.formInline.codeOrName,
                stdNoList:stdList,
                maxRow:51,
                printLanguage:lang
            }).then(res => {
                if(lang == 'Cn'){
                    this.cnExportLoading = false
                    this.cnExportText = '导出中文成绩单'
                }else{
                    this.enExportLoading = false
                    this.enExportText = '导出英文成绩单'
                }
                if(res.code == 0){
                    this.exportData = res.data
                    this.export_dialog = true
                }else{
                    this.$message.error(res.msg);
                }
            }).catch( error => {
                if(lang == 'Cn'){
                    this.cnExportLoading = false
                    this.cnExportText = '导出中文成绩单'
                }else{
                    this.enExportLoading = false
                    this.enExportText = '导出英文成绩单'
                }
                this.$message.error('导出失败');
            })
        },
        cancelExport(){
            this.export_dialog = false
        },
        printHtml(){
            this.$print(this.$refs.printContent)
        },
        printRow(row,printLanguage){
            this.score_dialog = true ;
            this.printLanguage = printLanguage; 
            let self = this;
            self.leftTableData = [];
            self.rightTableData = [];  
            this.$http.get("_sc:/stuScore/transcript/"+row.studentNo+"/"+printLanguage+"/51").then(data => {
                if(data.code == 0){ 
                    self.allData = data.data;
                    self.leftTableData = data.data.leftTranscriptOfCourse;
                    self.rightTableData = data.data.rightTranscriptOfCourse;
                }else{
                    this.$message.error(data.msg)
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        nowTime(lan){
            if("Cn" === lan){
                return util.cnTime();
            }else{
                return util.enTime();
            }
        },
        // 表格多选选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 获取班级
        getClassList(){
            this.$http.post('_ed:/scoreManege/queryAdministrativeClass').then(data => {
                if(data.code == 0){
                    let temp = data.data
                    this.treeData = []
                    temp.map((item,index) => {
                        let tempObj = {
                            label:item.grade,
                            children:[]
                        }
                        item.list && item.list.map(val => {
                            tempObj.children.push({
                                label:val.name,
                                id:val.id
                            })
                        })
                        this.treeData.push(tempObj)
                    })
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        // 班级下拉切换
        handleCheckChange(data){
            if(data.id){
                this.selectValue = data.id
                this.formInline.class = data.label
                this.$refs.selectClass.blur()
            }
        },
        sizeChange(size){
            this.pageNo = 1;
            this.pageSize = size;
            this.searchTable();
        },
        // 分页跳转
        currentChange(current){
            this.pageNo = current;
            this.searchTable();
        },
        // 显示更多
        collapseShow() {
            this.fold.state = !this.fold.state;
            this.fold.text = this.fold.state ? '收起' : '展开';
        },
    }
}
</script>
<style>
:root{
    overflow: visible;
}
</style>
<style lang="less" scoped>
@media print {
    #printContent {
        color: #000;
        tr,td,div{
            color: #000
        }
    }
}
.lh{
    line-height: 20px;
}
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.cm-container{
    overflow: hidden;
}
.el-scrollbar{
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
        background-color: #FFF;
    }
}
#printContent /deep/ .el-dialog__header{
    text-align: center;
    padding: 0px;
}
#printContent /deep/ .el-dialog__header .el-dialog__title{
    display: none
}
#printContent /deep/ .el-dialog__body{
    padding: 0px 0px;
}

#printContent /deep/ .full-size-scroll{
    overflow:hidden;
}
#exportContent /deep/ .el-dialog__header{
    text-align: center;
    padding: 0px;
}
#exportContent /deep/ .el-dialog__header .el-dialog__title{
    display: none
}
#exportContent /deep/ .el-dialog__body{
    padding: 0px 0px;
}

#exportContent /deep/ .full-size-scroll{
    overflow:hidden;
}
</style>