<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                    <div ref="formDetail" class="detail">
                         <el-form-item label="所在级">
                            
                            <intelligent-year-picker style="width: 100%;" 
                            	:clearable='false'
                                v-model="grade"
                                type="year" 
                                @change="getclassList"
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                          <el-form-item label="行政班">
                            <el-select v-model="classId"
                            clearable
                             filterable
                             placeholder="全部">
                                <el-option value="">全部</el-option>
                                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="学生">
                            <el-input v-model="studentname" clearable placeholder="学号/姓名"></el-input>
                        </el-form-item>

						<el-form-item >
							<el-button type="primary" @click="searchData()"  v-if="btnPerObj.query" >查询</el-button>
						</el-form-item> 
                    </div>
            </el-form>
        </div>
        <div class="cm-table" style="margin-top:10px;">
            <el-table
                    ref="multipleTable"
                    :data="tableData1"
                    border
                    style="width: 100%"
					size="mini" 
                    header-row-class-name="cm-dark">
                <el-table-column label="序号"  width="80"   type="index"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="enrollmentYear" label="年级"></el-table-column>
                <el-table-column prop="majorName" label="专业"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班"></el-table-column>
                <el-table-column
                    label="操作"
                  >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openarchivesDalong(scope.row)"   v-if="btnPerObj.archives_query" >档案查询</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
           id="dalongs"
            :visible.sync="archivesDalong"
            width="80%"
            append-to-body
            :close-on-click-modal="false"
            :show-close="true"
            @close="closearchivesDalong()"
            class="import-teachers-list classification">
          
            <div slot="title">
                <el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
                    <el-tab-pane label="基础档案" name="first">
                        <div class="Basics">    
                            <table border="1" class="tab1">
                                <tr class="trthird">
                                    <td rowspan="7" class="row1">基本信息</td>
                                    <td>姓名</td>
                                    <td>{{Basicarchives.name}}</td>
                                    <td>曾用名</td>
                                    <td>{{Basicarchives.formerName}}</td>
                                    <td>性别</td>
                                    <td>{{Basicarchives.sex}}</td>
                                    
                                    <td rowspan="7" colspan="2" class="row2">
                                        <div class="studentphoto">
                                            <div class="pic1">
                                                <img :src="Basicarchives.headUrl" alt="" style="width: 100%;height: 100%;">
                                            </div>
                                            <span>入学照片</span>
                                        </div>
                                        <div  class="studentphoto">
                                            <div class="pic1">
                                                 <img :src="Basicarchives.graduationUrl" alt="" style="width: 100%;height: 100%;">
                                                
                                            </div>
                                            <span>毕业照片</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                  
                                    <td>出生日期</td>
                                    <td>{{Basicarchives.birthday}}</td>
                                    <td>出生地</td>
                                    <td>{{Basicarchives.birthProvinceCity}}</td>
                                    <td>民族</td>
                                    <td>{{Basicarchives.nation}}</td>
                                   
                                    
                                </tr>
                                <tr>
                                    
                                    <td>证件类型</td>
                                    <td>{{Basicarchives.cardType}}</td>
                                    <td>证件号码</td>
                                    <td>{{Basicarchives.cardNum}}</td>
                                    <td>籍贯</td>
                                    <td>{{Basicarchives.nativeProvinceCity}}</td>
                                   
                                </tr>
                                <tr>
                                    
                                   
                                    <td>户口性质</td>
                                    <td>{{Basicarchives.registerType}}</td>
                                    <td>户口所在地</td>
                                    <td>{{Basicarchives.registerProvinceCity}}</td>
                                    <td>政治面貌</td>
                                    <td>{{Basicarchives.politicsStatus}}</td>
                                   
                                </tr>
                                <tr>
                                   
                                    <td>手机号</td>
                                    <td>{{Basicarchives.mobile}}</td>
                                    <td>e-Mail</td>
                                    <td>{{Basicarchives.email}}</td>
                                    <td>固定电话</td>
                                    <td>{{Basicarchives.contactTel}}</td>
                                   
                                </tr>
                                 <tr>
                                    <td>家庭地址</td>
                                    <td colspan="5">{{Basicarchives.address}}</td>
                                  
                                </tr>
                                <tr>
                                    <td>邮政编码</td>
                                    <td>{{Basicarchives.postalCode}}</td>
                                    <td>生源地</td>
                                    <td>{{Basicarchives.sourceProvinceCity}}</td>
                                    <td>健康状况</td>
                                    <td>{{Basicarchives.healthStatus}}</td>
                                    
                                 
                                </tr>
                               
                                 <tr class="trfirst">
                                    <td rowspan="2" class="row1">学籍信息</td>
                                    <td>年级</td>
                                    <td>{{Basicarchives.enrollmentYear}}</td>
                                    <td>专业</td>
                                    <td>{{Basicarchives.majorName}}</td>
                                    <td>行政班</td>
                                    <td>{{Basicarchives.administrativeClassName}}</td>
                                    <td>学号</td>
                                    <td>{{Basicarchives.stuNum}}</td>
                                   
                                </tr>
                                <tr>
                                    <td>入学日期</td>
                                    <td>{{Basicarchives.enrollmentDate}}</td>
                                    <td>学制</td>
                                    <td>{{Basicarchives.eduNum}}</td>
                                    <td>学习形式</td>
                                    <td>{{Basicarchives.studyModel}}</td>
                                    <td>学历类别</td>
                                    <td>{{Basicarchives.stageCategory}}</td>
                                   
                                </tr>
                                <tr class="trscend">
                                    <td rowspan="2" class="row1">学历信息</td>
                                    <td>学历层次</td>
                                    <td>{{Basicarchives.stage}}</td>
                                    <td>培养方式</td>
                                    <td>{{Basicarchives.eduType}}</td>
                                    <td>招生季节</td>
                                    <td>{{Basicarchives.season}}</td>
                                    <td>录取批次</td>
                                    <td>{{Basicarchives.adoptType}}</td>
                                   
                                </tr>
                                <tr>
                                    <td>原学历层次</td>
                                    <td>{{Basicarchives.provStage}}</td>
                                    <td>应届生</td>
                                    <td>{{Basicarchives.stuModel}}</td>
                                    <td>学籍状态</td>
                                    <td>{{Basicarchives.status}}</td>
                                    <td>毕（结）业</td>
                                    <td>{{Basicarchives.graduationStatus}}</td>
                                  
                                </tr>


                            </table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="学籍档案" name="second">
                         <div class="Basics">
                            <table border="1" class="tab2">
                                <tr>
                                    <td>姓名</td>
                                    <td>{{Basicarchives.name}}</td>
                                    <td>性别</td>
                                    <td>{{Basicarchives.sex}}</td>
                                    <td>出生日期</td>
                                    <td>{{Basicarchives.birthday}}</td>
                                    <td rowspan="5" class="lasttd">
                                        <div class="pic1">
                                            <img :src="Basicarchives.headUrl" alt="" style="width: 100%;height: 100%;">
                                            <!-- <img src="http://192.168.0.200/group1/M00/00/BA/wKgAyFwQbw2AUYDSAAERcTPy2Kc757.jpg" alt="" style="width: 100%;height: 100%;">  -->
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>证件号码</td>
                                    <td>{{Basicarchives.cardNum}}</td>
                                    <td>学校</td>
                                    <td>{{Basicarchives.university}}</td>
                                    <td>专业</td>
                                    <td>{{Basicarchives.majorName}}</td>
                                   
                                </tr>
                                <tr>
                                    <td>学历层次</td>
                                    <td>{{Basicarchives.stage}}</td>
                                    <td>学制</td>
                                    <td>{{Basicarchives.eduNum}}</td>
                                    <td>学历类别</td>
                                    <td>{{Basicarchives.stageCategory}}</td>
                                   
                                </tr>
                                <tr>
                                    <td>学习形式</td>
                                    <td>{{Basicarchives.studyModel}}</td>
                                    <td>班级</td>
                                    <td>{{Basicarchives.administrativeClassName}}</td>
                                    <td>学号</td>
                                    <td>{{Basicarchives.stuNum}}</td>
                                    
                                </tr>
                                <tr>
                                    <td>入学日期</td>
                                    <td>{{Basicarchives.enrollmentDate}}</td>
                                    <td>预计离校日期</td>
                                    <td>{{Basicarchives.expectDate}}</td>
                                    <td>学籍状态</td>
                                    <td>{{Basicarchives.status}}</td>
                                </tr>

                            </table>
                            <h5 class="titleStyle">学籍异动</h5>
                        
                            <div class="cm-table">
                                 <el-table
                                    ref="multipleTable"
                                    :data="tableData"
                                    border
                                    size="mini"
                                    style="width: 100%"
                                    header-row-class-name="cm-dark">
                                    <el-table-column type="index" label="序号"></el-table-column>
                                    <el-table-column prop="type" label="异动类型" width="85">
                                    <template slot-scope="scope">
                                        <template v-if="scope.row.type == 10">院内转专业</template>
                                        <template v-else-if="scope.row.type == 2">院内转出</template>
                                        <template v-else-if="scope.row.type == 3">院外转入</template>
                                        <template v-else-if="scope.row.type == 4">休学</template>
                                        <template v-else-if="scope.row.type == 5">退学</template>
                                        <template v-else-if="scope.row.type == 6">降级</template>
                                        <template v-else-if="scope.row.type == 11">转班</template>
                                        <template v-else-if="scope.row.type == 9">复学</template>
                                        <template v-else-if="scope.row.type == 12">保留学籍</template>
                                    </template>
                                    </el-table-column>
                                    <el-table-column prop="former_classname" label="原班级" width="175"></el-table-column>
                                    <el-table-column prop="modifiedDate" label="异动日期" width="85">
                                    <template slot-scope="scope">{{scope.row.modifiedDate | formatTime}}</template>
                                    </el-table-column>
                                    <el-table-column prop="present_grade" label="转入年级" width="75"></el-table-column>
                                    <el-table-column prop="present_majorname" label="转入专业" width="200"></el-table-column>
                                    <el-table-column prop="present_classname" label="转入班级" width="200"></el-table-column>
                                    <el-table-column prop="remarks" label="备注" width></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="成绩档案" name="third">
                        <div class="Basics2">
                            <div class="left">
                                <div>
                                   <p class="titles">国家考试成绩</p>
                                    <el-table
                                    :data="tableData3"
                                    border
                                    height="160"
                                    size="small "
                                    style="width: 100%">
                                         <el-table-column
                                            prop="index"
                                            label="序号"
                                            type="index"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                        prop="courseName"
                                        label="国家考试科目"
                                       >
                                        </el-table-column>
                                        <el-table-column
                                        prop="maxScore"
                                        label="成绩">
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div>
                                    <p class="titles">校内课程平均成绩</p>
                                    <el-table
                                    :data="tableData4"
                                    border
                                    height="400"
                                    size="mini"
                                    style="width: 100%">
                                         <el-table-column
                                            prop="index"
                                            label="序号"
                                            type="index"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                          width='155'
                                        prop="concat"
                                        label="学期学年"
                                       >
                                        </el-table-column>
                                        <el-table-column
                                        prop="avg_grade"
                                        label="平均成绩">
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <div class="right">
                                <p class="titles">校内课程成绩</p>
                                <el-table
                                    :data="tableData5"
                                    border
                                    height="600"
                                    size="mini"
                                    style="width: 100%">
                                   <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
                                    <el-table-column prop="studentNo" label="学号" sortable fixed="left" width="100"></el-table-column>
                                    <el-table-column prop="studentName" label="姓名" fixed="left" width="100"></el-table-column>
                                    <el-table-column prop="termName" label="学年" width="100"></el-table-column>
                                    <el-table-column prop="administrativeClassName" sortable width="230" label="行政班"></el-table-column>
                                    <el-table-column prop="termNum" label="学期" sortable width="70"></el-table-column>
                                    <el-table-column prop="courseName" label="课程名称" sortable width="240"></el-table-column>
                                    <el-table-column prop="natureName" label="属性" sortable width="70"></el-table-column>
                                
                                    <el-table-column prop="courseGrade" label="成绩" width="58"></el-table-column>
                                    <el-table-column prop="hours" label="学时" width="58"></el-table-column>
                                    <el-table-column prop="credit" label="学分" width="58">
                                    <template slot-scope="scope">
                                        {{Number(scope.row.credit).toFixed(2)}}
                                    </template>
                                    </el-table-column>
                                    <el-table-column prop="gpa" label="GPA" width="60"></el-table-column>
                                
                                    <el-table-column label="课程成绩明细" prop="courseGradeDetail" width="500" style="text-align:left;">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.courseGradeDetail"></span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column prop="courseGradeOriginal" label="原成绩" width="70"></el-table-column>
                                    <el-table-column label="课程原成绩明细" prop="courseGradeOriginalDetail" width="500" style="text-align:left;">
                                    <template slot-scope="scope">
                                        <span v-html="scope.row.courseGradeOriginalDetail"></span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column prop="courseBkDetail" label="补考详情" width="300"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>

        <div class="block_page">
     
      <el-pagination
       class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
        background
      :page-size="pageSize"
       :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
    </section>
</template>

<script>
    import util from '@/util'
    export default {
        name: "student_report",
        data() {
            return {
                archivesDalong:false,
                total:1,
                studentname:'',//学生姓名或者学号
                pageSize:10,//每页的数量
                currentPage1:1,//当前页
                schemename:'',
                activeName1:'first',
                processtableDalong:false,
                classificationDalong:false,
                Basicarchives:'',//基础档案     
                studentfiles:'',//学籍档案
                BasicarchivesFIles:[],
                tableDataList: [{
                    date: '2016-05-02',
                    type: '降级',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-03',
                    type: '休学',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                modifiedData: {},
                tableData5:[],
                tableData4:[],
                tableData3:[],
                tableData1:[],
                tableData2:[],
                 tableData: [
                        {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                       {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                     {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                       {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    }
                ],
                tableData2: [
                        {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                       {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                   
                       {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                     {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    },
                       {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                    }
                ],
                    gradeName:'',//单行的年级
                    classId:'',//单行的专业
                    majorId:"", 
                    majorName:'',
                    grade:"",
                    trainPlanName:"",
                
                classList:[],//班级列表
                breadcrumb: [//面包屑
                    {label: "报表管理"},
                    {label: "学生学籍报表"},
                ],
                dialogTable:false,
				 btnPerObj:{//按钮权限
                  query:false,
                  archives_query:false,//档案查询
                 
                }
            }
        },
       
        mounted(){
            
			if(this.grade!=''){//有年级的 时候就会有班级
                this.getclassList(this.grade)
            }
            
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
        //  this.getAdministrativeClassId()
         this.searchData()
        },
        filters: {
            formatTime: util.getTime1,

            showTermName: function(val, terms) {
            for (var i = 0; i < terms.length; i++) {
                if (val == terms[i].id) {
                return terms[i].name;
                }
            }
            },

            showAffirmCourseName(val, courses) {
            for (var i = 0; i < courses.length; i++) {
                if (val == courses[i].courseId) {
                return courses[i].courseName;
                }
            }
            }
        },
        methods: {
            closearchivesDalong() {
                this.activeName1 = 'first'
            },
            //转换时间
             formatDate(now)   {     
                var   year=now.getFullYear();     
                var   month=now.getMonth()+1;     
                var   date=now.getDate();
                return   year+"-"+month+"-"+date   
            },   
            getnewdate(timers){
                return this.formatDate(new Date(timers))
            },
               //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    console.log('返回值？？？', JSON.stringify(data.data))
                    data.data.map(item => {
                      
                        if (item.code=="archives_query_student_status_report") {//成绩档案
                            self.btnPerObj.archives_query=true;
                        }
                        if (item.code=="query_student_status_report") {//查询
                            self.btnPerObj.query=true;
                        }
                       
                    });
                }).catch(()=>{
                })
            },
         searchData(){
                let query = {
                    pageNo:  this.currentPage1,
                    pageSize: this.pageSize,
                    param: {
                        administrativeClassId: this.classId,
                        grade: this.grade,
                        studentNoOrName: this.studentname
                    }
                }
                let self = this
                this.$http.post('_op:/studentStatus/list',query).then(data=>{
                    self.tableData1 = data.data.result
                    
                     self.total = data.data.totalCount
                }).catch(err=>{
                    console.log(err)
                })
            },
          
            handleSizeChange(val) {
              this.pageSize = val
              console.log(  this.pageSize,'233')
              this.searchData()
              
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage1 = val
                  console.log(  this.currentPage1,'22233')
                  
                this.searchData()
                console.log(`当前页: ${val}`);
            },
            handleClick(tab, event) {
                if(this.activeName1 == 'second') {
                    this.$http.post('_op:/modified/getList', {
                        pageNo: 1,
                        pageSize: 20,
                        stuName: this.modifiedData.name,
                        stuNum: this.modifiedData.stuNum,
                        term: "",
                        type: "",
                    }).then(res => {
                        this.tableData = res.data.list
                    })
                }else if(this.activeName1 == 'third') {
                    this.$http.post('_sc:/cetEnrollQualification/listNationalTestMaxScore',{
                        pageNo: 1,
                        pageSize: 20,
                        param: {examTypeCode: "GJKS", course: "", studentNo: this.modifiedData.stuNum, studentName: this.modifiedData.name}
                    }).then(res => {
                        this.tableData3 = res.data.result
                    })
                    this.$http.get('_sc:/stuScore/query/stu/record/' + this.modifiedData.stuNum).then(res => {
                        this.tableData4 = res.data
                    })
                    this.$http.post('_sc:/stuScore/queryStudentCourseGrade',{
                        pageNo: 1,
                        pageSize: 200,
                        studentNo:  this.modifiedData.stuNum
                    }).then(res => {
                        this.tableData5 = res.data.result
                    })
                }
            },
            openarchivesDalong(row){//打开进程表的弹窗
                this.modifiedData = row
                let id= row.id
                let administrativeClassId = row.administrativeClassId
                let grade = row.enrollmentYear
                let majorId = row.majorId
                let studentNo = row.stuNum
                
                this.archivesDalong = true
                this.getbasicarchives(id) //根据id 查学籍
                // this.getachievement(administrativeClassId,grade,majorId,studentNo) //根据id 查成绩
                
            },
            getachievement(administrativeClassId,grade,majorId,studentNo){
                let param = {
                    administrativeClassId : administrativeClassId,
                    grade: grade,
                    majorId : majorId,
                    studentNo:studentNo
                }
                this.$http.post('_op:/studentStatus/scoreInfo',param).then(data=>{
                    this.tableData3 = data.data.guokao
                    this.tableData4 = data.data.xiaoNeiPingJun
                    this.tableData5 = data.data.xiaoNeiKeCheng
                    //  console.log('66666',data.data)
                }).catch(err=>[
                    console.log(err)
                ])
            },
            getAdministrativeClassId() { //获取行政班ID
            this.$http.get('_op:/administrative/class/list')
                .then(datas=>{
                if(datas.code === 0) {
                    let data = datas.data;
                    this.classList = data
                }
                }).catch(()=>{
                this.classList = [];
                })
            },
            getbasicarchives(id){
                let query = id
                this.$http.get('_op:/studentStatus/detail/'+query).then(data=>{
                    this.Basicarchives = data.data;
                    this.BasicarchivesFIles=data.data.statusModifies;
                }).catch(err=>{
                    console.log(err)
                })
            },
            getclassList(grade){
                this.$http.get('_op:/administrative/class/list/'+grade).then(data=>{
                    this.classList = data.data
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped lang="less">
.classification{
    .title{
        text-align: center;
    }
    
}
.Basics{
    .tab1{
        width: 100%;
        td{
            text-align: center;
            line-height: 30px;
            width: 10%;
        }
        
        td:nth-child(2n){
            background: white;
            text-align: left;
            padding-left: 5px;
        }
        td:nth-child(2n+1){
            background:#ebeef5;
            text-align: right;
            padding-right: 10px
        }

        tr:first-child{
        
            td:nth-child(2n+1){
                background: white;
                text-align: left;
                padding-left: 10px
            }
           
            td:nth-child(2n+2){
                background: #ebeef5;
                text-align: right;
                padding-right: 10px;
            }
        }
            tr.trthird td.row1{
                width: 7%;
                text-align: center;
                background: #c0c4cc;
            }
            tr.trthird td.row2{
                text-align: center;
                background: white;
                width: 20%;
              
            }


        .trfirst,.trscend{
             td:nth-child(2n+1){
                background: white;
                text-align: left;
                padding-left: 10px;
            }
            td.row1{
                text-align: center;
                 background: #c0c4cc;
            }
           
            td:nth-child(2n+2){
                background: #ebeef5;
                text-align: right;
                padding-right: 10px;
            }
        }
        
    }   
    .row2 .studentphoto{
        padding-top: 10px;
        .pic1{
            height: 100px;
            width: 100px;
            margin: 0 auto;
            border:  solid 1px red;
            
        }
    }
    .tab2{
        width: 100%;
        border: solid 1px #0001;
         td{
             line-height: 35px
         }
        td:nth-child(odd){
            background: #ebeef5;
            text-align: right;
            // padding-left: 5px;
            padding-right: 10px;
            width: 10%;
        }
        td:nth-child(even){
            background: white;
            text-align: left;
            padding-left: 10px;
        }
        td.lasttd{
            background: white;
            width: 15%;
        }
        .pic1{
            height: 155px;
            width: 120px;
            margin: 0 auto;
            border:  solid 1px red;
            
        }
    }
}
.Basics2{
    display: flex;
    justify-content: space-around;
    .left{
        // margin-right: 20px;
        width: 20%;
        font-weight: bold;
        font-size: 15px;
    }
    .right{
        width: 75%;
    }
    .titles{
        line-height: 40px;
        font-weight: bold;
         font-size: 15px;
    }
    
}
.pull-right{
  text-align: right;
  margin-right: 10px;
}
.titleStyle{
    padding: 20px   0  20px  0;

}
.cm-table {
    margin-bottom: 20px;
    padding: 0 ;
}
</style>