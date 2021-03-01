<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        
        <div class="cm-fold">
            <el-form size="mini" :inline="true">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-select 
                                v-model="semester"
                                filterable
                                placeholder="选择学期">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;" 
                            	:clearable="false"
                                v-model="grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        
                        <el-form-item label="专业">
                            <el-select v-model="majorId"
                             filterable
                             placeholder="请选择">
                                <el-option v-for="list in majorList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程">
                            <el-select 
                            	v-model="courseId" 
                            	:disabled="majorId==0" 
                            	filterable placeholder="选择课程">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id" ></el-option>
                            </el-select>
                        </el-form-item>
                        
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch()">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
        <div class="cm-btn-con">
        	<div class="conbox">
        		<div class="btnbox" v-if="readyToPrint">
		            <el-button size="mini" type="primary" @click="submitScore()">提交</el-button>
		            <el-button size="mini" type="primary" @click="importStuScore()">批量导入</el-button>
        		</div>
                <div class="btnbox" v-else>
		            <el-button size="mini" type="primary" @click="openPrintDalong()">打印</el-button>
		           
        		</div>
        		<div>
        			共<i>{{courseScoreModel.total==null?'-':courseScoreModel.total}}</i>阶段，当前第<i>{{courseScoreModel.stage==null?'-':courseScoreModel.stage}}</i>阶段；权重：<i>{{courseScoreModel.stageWeight==null?'-':courseScoreModel.stageWeight*100+'%'}}</i>；比例：
        			<i>{{courseScoreModel.scoreTypeProportion==null?'-':courseScoreModel.scoreTypeProportion}}</i>
        			计分方式:
                    <template style="width:50px">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
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
                :data="tableData"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="studentNo" label="学号"></el-table-column>
                <el-table-column prop="studentName" label="姓名"></el-table-column>
                <el-table-column prop="courseName" label="课程"></el-table-column>
                <el-table-column prop="regularGrade" label="平时成绩">
                    <template  slot-scope="scope">
                         <el-input v-model="scope.row.regularGrade" :disabled="!readyToPrint" @change="OnBlurEvent(scope.row.id,scope.row.regularGrade,scope.row.finalExamGrade,scope.row.examStatus)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="finalExamGrade" label="期末成绩">
                    <template  slot-scope="scope">
                        <el-input  v-model="scope.row.finalExamGrade" :disabled="!readyToPrint" @change="OnBlurEvent(scope.row.id,scope.row.regularGrade,scope.row.finalExamGrade,scope.row.examStatus)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="stageGrade" label="阶段成绩">
                    <template  slot-scope="scope">
                        {{scope.row.stageGrade==null?'-':scope.row.stageGrade}}
                    </template>
                </el-table-column>
                <el-table-column prop="courseGrade" label="课程成绩">
                    <template  slot-scope="scope">
                        {{scope.row.courseGrade==null?'-':scope.row.courseGrade}}
                    </template>
                </el-table-column>
                <el-table-column prop="examStatus" label="考试状态"  width="99">
                    <template  slot-scope="scope">
							<el-select v-model="scope.row.examStatus" placeholder="请选择" :disabled="!readyToPrint" filterable @change="OnBlurEvent(scope.row.id,scope.row.regularGrade,scope.row.finalExamGrade,scope.row.examStatus)">
							    <el-option 
							    	v-for="item in examinationstutslist" 
							    	:key="item.id" 
							    	:label="item.name" 
							    	:value="item.id" > 
							    </el-option>
							</el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注说明"></el-table-column>
                <el-table-column prop="createUser" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建日期">
                   
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
            <div style="margin-bottom: 30px;"><el-button size="mini" @click=""> <a href="../../../template/studentscore.xls" download='studentscore.xls'>下载模板</a></el-button></div>
            
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
            <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">导入</el-button>
           
        </el-dialog>
        <el-dialog
            title="打印的弹框"
            :visible.sync="printDalong"
            width="80%"
            append-to-body
            :close-on-click-modal="false"
            :show-close="false"
            class="import-teachers-list">
            <div slot="title" class="dialogheader clear">
                <div>
                   请使用A4纸张打印 &#X3000;按所在级+专业生成，进行打印 page 1 / 6
                </div>
                <div class="btnbox">
                    <el-button size="mini" @click="printDalong=false">关闭</el-button>
                    <el-button size="mini" type="primary" @click="">打印</el-button>
                </div>
            </div>
            <div class="printcontent">
                <p class="title">
                   汕头大学医学院课程成绩登记表
                </p>
                <p class="text">
                    2017级-临床口腔专业 &#X3000;（2016-2017学年度第二学期）
                    <span class="subTime">提交日期:2017/6/23</span>
                </p>
                <table border="1" width="100%" class="tab1">
                    <tr>
                        <td class="title1">课程名称</td>
                        <td class="curriculumName" colspan="2">大学德育1</td>
                        
                        <td class="title1">课程英文名称</td>
                        <td  class="curriculumName" colspan="2">3</td>
                    </tr>

                    <tr>
                        <td class="title1">课程学分</td>
                        <td  colspan="2">
                            89
                        </td>
                        <td class="title1"> 课程学时</td>
                        <td  colspan="2">5</td>
                       
                    </tr>

                    <tr>
                        <td class="title1">课程性质</td>
                        <td  colspan="2">
                            <template>
                                <el-radio v-model="radio" label="1">选修</el-radio>
                                <el-radio v-model="radio" label="2">必修</el-radio>
                            </template>
                        </td>
                        <td>考试性质</td>
                        <td  colspan="2">
                            <template>
                                <el-radio v-model="radio1" label="1">正常</el-radio>
                                <el-radio v-model="radio1" label="2">补考</el-radio>
                            </template>
                        </td>
                    </tr>

                    <tr>
                        <td class="title1">成绩评定方式</td>
                        <td colspan="5"></td>
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
                    <td>作弊人数</td>
                </tr>
                <tr>
                    <td>人数</td>
                    <td>103</td>
                    <td>60</td>
                    <td>80</td>
                    <td>20</td>
                    <td>100</td>
                    <td>1</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>比例</td>
                    <td>99%</td>
                    <td>60%</td>
                    <td>80%</td>
                    <td>20%</td>
                    <td>99%</td>
                    <td>1%</td>
                    <td>2%</td>
                    <td>1%</td>
                </tr>
            </table>
            <template>
                <p class="printtltle">
                    行政班 学生总数：100
                </p>
                <div style="display: flex;">
                    <el-table
                        :data="tableData1"
                        border
                        style="width: 25%">
                        <el-table-column
                        prop="date"
                        label="学号"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="姓名"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="阶段成绩">
                        </el-table-column>
                    </el-table>
                    <el-table
                        :data="tableData1"
                        border
                        style="width: 25%">
                        <el-table-column
                        prop="date"
                        label="学号"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="姓名"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="阶段成绩">
                        </el-table-column>
                    </el-table>
                     <el-table
                        :data="tableData1"
                        border
                        style="width: 25%">
                        <el-table-column
                        prop="date"
                        label="学号"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="姓名"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="阶段成绩">
                        </el-table-column>
                    </el-table>
                     <el-table
                        :data="tableData1"
                        border
                        style="width: 25%">
                        <el-table-column
                        prop="date"
                        label="学号"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="姓名"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="address"
                        label="阶段成绩">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'

    export default {
        name: "entering-course",
        data() {
            return {
                courseScoreModel:'',
                value:"选项1",
                options:[
                    {value: '选项1',
                    label: '百分制'
                    }
                ],
                tableData1: [{
                    date: '2017510001',
                    name: '王小虎',
                    address: '67'
                    }, {
                    date: '2017510001',
                    name: '王小虎',
                    address: '76'
                    }, {
                    date: '2017510001',
                    name: '王小虎',
                    address: '67'
                    }, {
                    date: '2017510001',
                    name: '王小虎',
                    address: '76'
                }],
                radio1:'1',
                radio:'1',
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "校内课程成绩录入"},
                ],
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                recordId:null,//保存信息用的id
                printDalong:true,//为true就是打开打印的弹框
                readyToPrint:true,//为flase因此打印按钮
                examinationstutslist:"",//考试的状态列表
                importstudentDialog:false,//导入学生表的对话框
                fileList:[],//文件列表
                semester:'',//学期
                semesterList:[],//学期列表
                grade:'',//所在级
                majorId:'',//专业
                majorList:[],//专业列表
                courseId:'',//课程
                coursename:"",//课程名字
                courseList:[],//课程列表
                scoreType:"",//成绩类型
                tableData:[
                	// {number:'201751001',name:'张一',course:'大学英语1',grade1:'100',grade2:'98',grade3:'98.3',coursegrade:'50',teststatu:'正常',mark:'无说明',creater:'张老师',createtime:'2018/07/19'},
                	// {number:'201751001',name:'张一',course:'大学英语1',grade1:'100',grade2:'98',grade3:'98.3',coursegrade:'50',teststatu:'正常',mark:'无说明',creater:'张老师',createtime:'2018/07/19'},
                	// {number:'201751001',name:'张一',course:'大学英语1',grade1:'100',grade2:'98',grade3:'98.3',coursegrade:'50',teststatu:'正常',mark:'无说明',creater:'张老师',createtime:'2018/07/19'},
                	// {number:'201751001',name:'张一',course:'大学英语1',grade1:'100',grade2:'98',grade3:'98.3',coursegrade:'50',teststatu:'正常',mark:'无说明',creater:'张老师',createtime:'2018/07/19'},
                	// {number:'201751001',name:'张一',course:'大学英语1',grade1:'10',grade2:'98',grade3:'98.3',coursegrade:'50',teststatu:'正常',mark:'无说明',creater:'张老师',createtime:'2018/07/19'}
                ]
            }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
        created(){
        	this.getTermData();
        	this.getMajorList();
            this.getscoreType();
            this.getexaminationstuts()
        },
        methods: {
            getweight(){
                 let params = {
                    courseId:this.courseId,
                    grade:this.grade,
                    majorId:this.majorId,
                    termId:this.semester
                }
                
                this.$http.post('http://192.168.5.197:8070/score/management/courseScoreModel/detail',params).then(data=>{
                    this.courseScoreModel = data.data
                      
                }).catch(err=>{
                    console.log(err)
                })
            },
            submitScore(){//把表单提交到记载
                this.$http.put('_sc:/scoreRecord',{
                    id:this.recordId,
                    status:1
                }).then(data=>{
                    if(data.code===0){
                          this.$message({
                                message: '提交成功！',
                                type: 'success'
                            });
                            this.readyToPrint = false
                            this.importstudentDialog = false
                     }else{
                          this.$message.error(data.data)
                     }
                }).catch(err=>{
                     this.$message.error(err.msg)
                })
            },
            OnBlurEvent(id,regularGrade,finalExamGrade,examStatus){//光标离开时的事件
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
            openPrintDalong(){//打开打印的弹框
                this.printDalong = true
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
                    			this.semester=data.data[i].id;
                                this.grade=data.data[i].year.toString();
                    			break;
                    		}
                    	}
                        this.semesterList = data.data.reverse();;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            getMajorList(){//查询专业列表
                this.$http.get("_op:/major/combox").then(data=>{
                    if(data.code==0){
                        this.majorList = data.data;
                        this.majorId=data.data[0].id;
                        this.getCourseList(data.data[0].id)
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
      
    
            getCourseList(){//查询课程
                this.$http.get("_op:/course/combox/").then(data=>{
                    if(data.code==0){
                        if (data.data.length>0) {
                            this.courseId = data.data[0].id
                        }
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            onSearch(){//根据参数查询成绩
                let params = {
                    course:46,
                    grade:this.grade,
                    major:this.majorId,
                    scoreType:this.scoreType,
                    termId:this.semester
                }
                
                this.$http.post('_sc:/stuScore/queryList',params).then(data=>{
                     this.tableData = []
                    if(data.code==0){
                        let contents = data.data.stuScoreResult
                        if(data.data.scoreRecordStatus == 1){
                             this.readyToPrint = false
                         }
                        for( let i=0;i<contents.length;i++){
                            let self = this
                            contents[i].createTime = self.getdata(contents[i].createTime)
                        }
                        if(contents.length>0){
                            this.recordId = contents[0].recordId
                        }
                        this.tableData = contents
                        this.getweight()
                      
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
            importStuScore(){//批量导入
            
                this.importstudentDialog = true
               
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
            submitUpload() {
                if (this.fileList.length < 1) {
                    this.$message.warning('请选择导入文件！');
                    return ;
                } else{
                    let formData = new FormData();
                        formData.append('file', this.fileList[0].raw);
                        formData.append('course', this.courseId);
                        formData.append('grade', this.grade);
                        formData.append('major', this.majorId);
                        formData.append('scoreType', this.scoreType);
                        formData.append('termId', this.semester);
                         
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                          }
                    }
                    
                    this.$http.post('_sc:/stuScore/importStuScore', formData,config).then(data => {
                        let self =this
                        if(data.code === 0) {
                             self.$message({
                                message: '导入成功！',
                                type: 'success'
                            });
                            self.onSearch()
                            self.importstudentDialog = false
                        } else {
                            self.$message.error(data.msg);
                        }
                    }).catch(error => {
                        this.$message.error('上传出错！')
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

<style scoped lang="less">
.conbox{
	display: flex;
	justify-content: space-between;
	.el-input{
		width: 35px;
    }
    // .btnbox{
    //     display: flex;
    // }
    // .importStuScores{
    //     margin-left: 10px;
    //     margin-right: 10px;
    // }
    
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
    font-size: 16px;
    font-weight: bold;
    color: #333;

}
.tab2{
        border: solid 1px #66666636;
        td{
            text-align: center;
            height: 40px;
        }
       
    }
</style>