<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
     <div class="cm-fold">
            <el-form size="mini" :inline="true" :label-position="labelPosition">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <!-- <el-form-item label="学期">
                            <el-select 
                                v-model="semesters"
                                filterable
                                clearable
                                value-key="id"
                                placeholder="选择学期">
                                <el-option v-for="(item,index) in semesterList" :key="item.id" :label="item.name" :value="item"></el-option>
                            </el-select>
                        </el-form-item> -->
                            <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                filterable
                                remote
                                @change="onSelectChange" 
                                :remote-method="getTermData" 
                                placeholder="全部">
                                <el-option v-for="item in semesterList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程">
                      
                            <el-select 
                                clearable
                            	v-model="courseId"
                            	filterable placeholder="选择课程">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.courseName" :value="list.courseId" ></el-option>
                            </el-select> {{stageName}}
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input placeholder="请输入姓名" v-model="studentName" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="学号">
                            <el-input placeholder="请输入学号" v-model="studentNo" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="filestate"  clearable placeholder="全部">
                                <el-option v-for="list in statusOption" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                      <div class="btn">
                            <el-button type="primary" size="mini" @click="onSearch()">查询</el-button>
                        </div>
                        <div class="btn" style="margin-left:20px;}">
                            <el-button size="mini" type="primary" @click="openmodifyDialog()">新增</el-button>
                        </div>
                    
                </div> 
            </el-form>
    </div>

	<!-- <div class="cm-btn-con">
		<div class="conbox">
			<div class="btnbox" >
				<el-button size="mini" type="primary" @click="openmodifyDialog()">修改申请</el-button>
			</div>
		</div>
	</div> -->

    <div class="cm-table">
      <el-table 
        :data="tableData" 
        type="index"
        border 

        style="width: 100%;" size="mini" 
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column v-for="(item,index) in tableProp" :formatter="item.formatStatus?formatStatus:null" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button type="text" style="cursor:pointer;" size="small" @click="edit(scope.row,false)" v-if="scope.row.status==2||scope.row.status==0">编辑</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="submitUpload2(scope.row)" v-if="scope.row.status==2||scope.row.status==0">提交</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="deletel(scope.row)"  v-if="scope.row.status == 0 || scope.row.status == 2" >删除</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="withdraw(scope.row)" v-if="scope.row.status==1">撤回</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="edit(scope.row,true)" >查看</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="enclosure(scope.row)">附件</el-button>
            <el-button type="text" style="cursor:pointer;" size="small" @click="print(scope.row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- <div class="block_page">
      <el-pagination
      background
      class="pull-right"
	    @size-change="sizeChange"
	    @current-change="currentChange"
	    :current-page="pageNo"
	    :page-sizes="[10, 20, 50, 100]"
	    :page-size="pageSize"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="totalCount">
      </el-pagination>
    </div> -->
        <el-dialog
        :visible.sync="printDialog"
        width="100%"
        :fullscreen="true" 
        append-to-body 
        :close-on-click-modal="false"
        class="import-teachers-list"
        center>
        <template slot="title">
            <div>
                <h2>成绩修改申请</h2>
            </div>
        </template>
        <div style="float:right; margin-top:-60px;" v-if="ifnone">
            <el-button  type="primary" size="mini" @click="printDialog = false">返回</el-button>
            <el-button  type="primary" size="mini" @click="printAchievement">打印</el-button>
        </div>
        
            <h4>学生基本信息</h4>
            <div style="margin-left:20px; margin-top:20px;">
                <table border style="width:90%">
                    <tr>
                        <td>学号</td>
                        <td>姓名</td>
                        <td>所在级</td>
                        <td>专业</td>
                        <td>行政班</td>
                    </tr>
                    <tr>
                        <td>{{printList.studentNo}}</td>
                        <td>{{printList.studentName}}</td>
                        <td>{{printList.semesterYear}}</td>
                        <td>{{printList.majorName}}</td>
                        <td>{{printList.administrativeClassName}}</td>
                    </tr>
                </table>
            </div>
            <div style="margin-top:20px;">
                <h4>修改项目</h4>
                <div style="margin-left:20px; margin-top:20px;">
                    <span>
                        <span>学期：</span><span>{{printList.termName}}，</span><span>课程：</span><span>{{printList.courseName}}，</span><span>成绩类型：</span><span>{{printList.scoreTypeName}}，</span><span>原成绩：</span><span>{{printList.oldGrade}}，</span><span>修改后成绩：</span><span>{{printList.newGrade}}</span>
                    </span>
                </div> 
            </div>
            <div style="margin-top:20px;">
                <h4>阶段及课程成绩</h4>
                <div style="margin-left:20px; margin-top:20px;">
                    <span>
                        <span>原阶段成绩：</span><span>{{printList.oldStageGrade}}，</span><span>修改后阶段成绩：</span><span>{{printList.newStageGrade}}，</span><span>原课程成绩：</span><span>{{printList.oldCourseGrade}}，</span><span>修改后课程成绩：</span><span>{{printList.newStageGrade}}</span>
                    </span>
                </div> 
            </div>
            <div style="margin-top:20px;">
                <h4>修改说明：</h4>
                <span style="margin-left:20px; margin-top:20px;">{{printList.instruction}}</span>
                
            </div>
            <div style="margin-top:20px;">
                <h4>审批说明：</h4>
                <span style="margin-left:20px; margin-top:20px;">{{printList.approveRemark}}</span>
            </div>
            <div slot="footer" class="dialog-footer" style="margin-top:50px;">
                <h4>签字：</h4>
                <h4 style="margin-top:20px;">日期：</h4>
            </div>
        </el-dialog>
	   <el-dialog
            id="el-body"
            title="成绩修改申请"
            :visible.sync="modifyDialog" 
            append-to-body
            :close-on-click-modal="false" 
            width="700px"
            top="3vh"
            custom-class="custom-class"
            :show-close="true" >
			<div ref="formDetail">
                <el-form :inline="true" :rules="handleRules" ref="submitModel" style="text-align:center;" :model="submitModel" :label-position="'right'" label-width="100px">
                        <el-form-item label="学号" class="cm-collapse" prop="studentsNo">
                                <el-input :disabled="viewDetail" placeholder="请输入学号" v-model="submitModel.studentsNo"   @change="getoldGrade('学号')"  clearable @blur="queryStudentInfo()" :readonly="viewDetail" ></el-input>
                        </el-form-item>

                        <el-form-item label="姓名" class="cm-collapse" >
                                <el-input :disabled="viewDetail"  v-model="submitModel.studentName" readonly></el-input>
                        </el-form-item>

                        <el-form-item label="年级" class="cm-collapse" >
                                <el-input :disabled="viewDetail"  v-model="submitModel.grade" readonly></el-input>
                        </el-form-item>

                        <el-form-item label="专业" class="cm-collapse" >
                                <el-input :disabled="viewDetail"  v-model="submitModel.major" readonly></el-input>
                        </el-form-item>

                            <el-form-item label="行政班" class="cm-collapse" >
                                <el-input :disabled="viewDetail"  v-model="submitModel.administrativeName" readonly></el-input>
                        </el-form-item>

                        <el-form-item label="学期" prop="semesters">
                            <el-select 
                                @change="getoldGrade('学期')"
                                :disabled="viewDetail"
                                v-model="submitModel.semesters"
                                filterable
                                value-key="id"
                                placeholder="选择学期" :readonly="viewDetail">
                                <el-option v-for="(item,termIndex) in semesterList" :key="termIndex" :label="item.name" :value="item.id" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程" prop="courseId">
                              <!-- {{submitModel.courseId}} -->
                            <el-select 
                                @change="getoldGrade('课程')"
                                v-model="submitModel.courseId" 
                                value-key="courseId"
                                :disabled="viewDetail"
                                filterable placeholder="选择课程">
                                <el-option v-for="item in courseList" :key="item.id" :label="item.courseName" :value="item.courseId" ></el-option>
                            </el-select> 
                        </el-form-item>

                        <el-form-item label="成绩类型" prop="scoreType"  v-show="showXiaonei">
                            <el-select 
                               
                                @change="getoldGrade('成绩类型')"
                                :disabled="viewDetail"
                                v-model="submitModel.scoreType" 
                                value-key="id"
                                filterable placeholder="请选择成绩类型">
                                <el-option v-for="(item, typeIndex) in scoreTypeList" :key="typeIndex" :label="item.name" :value="item.id" ></el-option>
                            </el-select> 
                        </el-form-item>

                            <el-form-item label="考试时间" class="cm-collapse" prop="examTime"  v-show="showXiaonei">
                            <!-- <el-date-picker
                                   :disabled="viewDetail"
                                    :readonly="viewDetail"
                                   @change="getoldGrade('考试时间')"
                                    v-model="submitModel.examTime"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                            </el-date-picker> -->
                            <el-select 
                                @change="getoldGrade('考试时间')"
                                :disabled="viewDetail"
                                v-model="submitModel.examTime" 
                                filterable placeholder="请选择考试时间">
                                <el-option v-for="(item, typeIndex) in examTimeList" :key="typeIndex" :label="item.exam_time" :value="item.exam_time" ></el-option>
                            </el-select> 
                        </el-form-item> 

                        <el-form-item label="原成绩" class="cm-collapse" >
                                <el-input :disabled="viewDetail" placeholder="" v-model="submitModel.oldGrade" readonly ></el-input>
                        </el-form-item>

                        <el-form-item label="修改后成绩" class="cm-collapse" prop="newGrade" >
                            <el-input-number v-model="submitModel.newGrade" placeholder="请输入成绩" :disabled="viewDetail"  :min="0" :max="100" label="请输入成绩"></el-input-number>
                        </el-form-item>

                        <el-form-item label="" style="width:320px;" >
                            
                        </el-form-item>


                        <el-form-item label="修改说明"   class="cm-collapse" >
                            <el-input :disabled="viewDetail" type="textarea" v-model="submitModel.instruction" :readonly="viewDetail" placeholder="请输入文字" style="width:513px;" ></el-input>
                        </el-form-item> 
                        
                        <el-form-item label="上传图像"    style="width:600px;" prop="fileUrl">
                            
                            <el-upload
                                action="operation/data/admin/uploadFile"
                                list-type="picture-card" 
                                :file-list="fileList"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleAvatarSuccess"
                                :on-remove="onRemoveFile"
                                style="width:500px;text-align:left;"
                                :readonly="viewDetail"
                            >
                                <i class="el-icon-plus"></i>
                            </el-upload> 
                            <div style='text-align:left;line-height:20px;'>支持上传照片格式为 png/jpg ，且不超过2M</div>
                        </el-form-item>

                </el-form>
			</div>
           
           <span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="closediaong()">取 消</el-button>
				<el-button size="mini" v-if="!viewDetail" type="primary" :disabled="ifdisabled" @click="preservation(0)">暂 存</el-button>
				<el-button size="mini" v-if="!viewDetail" type="primary" @click="preservation(1)">提 交</el-button>
			</span>
					
        </el-dialog>
         <!-- <el-dialog
            title="在线查看"
            :visible.sync="picDialog"
            width="80%"
            append-to-body
            :close-on-click-modal="false"
            @closed=""
            :show-close="true"
            class="import-teachers-list">
            <div :class="{'zoomClass': zoomClass == true }">
                <img :src='picurl' alt="" @click="zoomPic" ref="pic" style= "width: 100%;">

            </div>
         </el-dialog> -->
        <div class="zoomClass" v-if="picDialog">
           <template style= "width: 60%;">
               <img :src='picurl' alt="" @click="zoomPic" ref="pic" title="点击关闭" style= "width: 60%;">
             <el-button size="mini" @click="zoomPic()" style="position: absolute;
    top: 0;
    right: 20%;">关 闭</el-button>
           </template>
            
        </div>
  </section>
</template>

<script>
    import util from '@/util'
    import {mapState} from 'vuex'//111
        
    const TYPE='modify_application';
    const REMARK='成绩修改申请';

    export default {
      name: TYPE,
      data() {
        return {
            examTimeList: [],
            showXiaonei:true,
            labelPosition: 'right',
            modifystuts:'add',
            storagestate:'',//用来判断是提交还是暂存
            picDialog:false,//图片的弹窗
            infoid:'',
            ifdisabled:false,
            instruction:'',//说明
            oldGrade:null,//老的成绩
            newGrade:'',//新的成绩
            fileList:[],//文件列表
            showstudentsinfo:false,
            studentinfo:{},//学号查出来的信息
            studentsNo:'',//学号
			modifyDialog:false,//修改申请的弹框
          	courseId:'',//课程
              coursename:"",//课程名字 
              courseTypeCode:'',//课程类别
            stageName:'',//阶段
            semesters:'',//学期ID
            studentyear:'',//学年
            studentyearnum:'',//学年号 
			studentName:'',//姓名
			studentNo:'',//学号
			grade:'',//学年
            filestate:'',//文件状态
            picurl:"",//图片的地址
            printList: {}, // 打印列表
            printDialog: false,
            ifnone: false,
          	statusOption: [//装填
				{ label: "已保存", value: 0 },
				{ label: "已提交", value: 1 },
				{ label: "已撤回", value: 2 },
                { label: "处理成功", value: 3 },
                { label: "处理失败", value: 4 },
         	 ],
			fold:{
				state:false,
				text:'展开',
				showBtn:false,
			},
			type:REMARK,
			breadcrumb: [
				{label: "成绩管理"},
				{label: REMARK},
			],
			checked: true,
			formLabelWidth: '60px',
			// evaluate: {
			// 	administrativeClassId: [],
			// 	evaluationType: 0,
			// 	grade: 32,
			// 	majorId: '',
			// 	requiredFailedFlag: false,  //必修课不及格者复选框：0-勾选，1-未勾选
			// 	schemeId: '',
			// 	semesterYear: ''
			// },
			gradeOptions: [], //所在级
			majorIdOptions: [], //专业ID
			schemeIdOptions: [], //测评方案ID
			semesterYearOptions: [], //学年
			administrativeClassIdOptions: [], //行政班ID
			options: [
				{value: '选项1', label: '黄金糕'}, 
				{value: '选项2', label: '双皮奶'}
			],
			tableLoading:false,
			tableData: [],
			tableProp: [
				{label:'学号', prop:'studentNo', width:90},
                {label:'姓名', prop:'studentName', width:100},
                {label:'专业', prop:'majorName', width:100},
                {label:'年级', prop:'grade', width:50}, 
				// {label:'学期', prop:'termName', width:160},
				{label:'课程', prop:'courseName', width:120},
				{label:'成绩类型', prop:'scoreTypeName', width:70},
				{label:'考试日期', prop:'examTime', width:110},
				// {label:'阶段', prop:'stageName'},
				{label:'原成绩', prop:'oldGrade', width:60},
                {label:'新成绩', prop:'newGrade', width:60},
                {label:'修改说明', prop:'instruction'},
                {label:'审批说明', prop:'approveRemark'},
				{label:'状态', prop:'status',formatStatus:true, width:70},
				// {label:'提交人', prop:'createUser', width:120},
				{label:'提交日期', prop:'createTime', width:90}
            ],
            submitModel:{ //定义提交模型
                studentsNo:'',
                studentName:'',
                grade:'',
                year: '',
                major:'',
                administrativeName:'',
                semesters:'',
                semesterNum: '',
                courseId:'',
                courseName: '',
                oldGrade:'',
                orderNum: '',
                newGrade:'',
                scoreType:'',
                examTime:'',
                instruction:'',
                fileUrl:[]
            }, 
            year: '',
            rules:{
                 studentsNo:[{ required: true, message: '请输入学号', trigger: 'blur'}],
                 semesters:[{ required: true, message: '请选择学期', trigger: 'change'}],
                 courseId:[{ required: true, message: '请选择课程', trigger: 'change'}],
                 scoreType:[{ required: true, message: '请选择成绩类型', trigger: 'change'}],
                 examTime:[{ required: true, message: '请选择考试时间', trigger: 'blur'}],
                 newGrade:[{ required: true, message: '请输入修改后的成绩', trigger: 'blur'}],
                //  fileUrl:[{ required: true, message: '请上传附件'}],
            },
            rulesMin:{
                 studentsNo:[{ required: true, message: '请输入学号', trigger: 'blur'}],
                 semesters:[{ required: true, message: '请选择学期', trigger: 'change'}],
                 courseId:[{ required: true, message: '请选择课程', trigger: 'change'}],
                 newGrade:[{ required: true, message: '请输入修改后的成绩', trigger: 'blur'}],
                //  fileUrl:[{ required: true, message: '请上传附件'}],
            },
            courseList:[],//课程列表 
            semesterList:[],//学期列表
            scoreTypeList:[],  
			pageNo: 1,
			pageSize: 20,
            totalCount:0,
            zoomClass: false,
            viewDetail: false,
            formYear: '',
            semesterNum: '',
            fallYear: '',
        }
      },
      mounted(){
        window.onmouseout = () => {
            this.ifnoneshow();
        };
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
      },
      watch:{
         [ 'submitModel.semesters'](){

         },
         'submitModel.studentsNo'() {
             if(this.submitModel.studentsNo.length > 8) {
                this.getCourseList()
                // this.queryScoreType()
            }else{
                return
            }
         }
        // studentsNoChange(val){
        //     //   self.submitModel={}
        //     this.queryStudentInfo(val);
          
        //             // self.submitModel={}
        //             // self.submitModel.grade = '';
        //             // self.submitModel.major = '';
        //             // self.submitModel.majorId ='';
        //             // self.submitModel.administrativeName = '';

        //  }

      },
      created(){
          let self = this;
          self.getTermData();
          self.queryScoreType();
          self.getCourseList(0, 0, 0);
      },
      computed:{
        ...mapState(['btnPermitList']),//333
        headers (){
            return {
                'Access_Token': util.getStorage('token'),
                'Authorization': util.getStorage('token')
            }
        },
        handleRules() {
            if (this.showXiaonei == true) {
                return this.rules;
            }
            return this.rulesMin;
        }
      },
      methods: {
        ifnoneshow() {
            let self = this;
            self.ifnone = true;
        },
        onSelectChange(_id) {
            this.getCourseList(0, 0, this.formYear)
            this.selectChangeFun(_id)
        },
        selectChangeFun(_id) {

            let self = this;
            let id = self.formYear;
            // let grade = self.addForm.grade;
            let classNum = self.addForm.classNum; //所在级更改为分班序号

            for (let item of this.semesterList) {
                if (item.id == _id) {
                    self.fallYear = item.year;
                    self.semesterNum = item.orderNum;
                }
            }
            this.addColumn = [{
                id: ''
            }]
            this.courseArrangeList = [];
            // this.getCourseArrange();

        },
        formatStatus(row, column, cellValue){
            if(row && row.status == 0){
                return  '暂存';
            }else if(row && row.status == 1){
                return  '已提交';
            }else if(row && row.status == 3) {
                return  '等待复核';
            } else if(row && row.status == 2){
                return  '已撤回';
            }else if(row && row.status == 5){
                return  '处理成功';
            }else if(row && row.status == 4){
                return  '处理失败';
            } 

        },
            //查询成绩类型
        queryScoreType(){
           
            let self = this; 
            let query = {
                termId: self.submitModel.semesters,
                grade: self.submitModel.grade,
                major: self.submitModel.majorId,
                course: self.submitModel.courseId
            }
            self.$http.post("_sc:/scoreSetting/queryImportScoreType", query).then(res =>{
                if(res.code == 0){
                    var uniques = [];
                    var stringify = {};
                    var arr = res.data
                    for (var i = 0; i < arr.length; i++) {
                        var keys = Object.keys(arr[i]);
                        keys.sort(function(a, b) {
                            return (Number(a) - Number(b));
                        });
                        var str = '';
                        for (var j = 0; j < keys.length; j++) {
                            str += JSON.stringify(keys[j]);
                            str += JSON.stringify(arr[i][keys[j]]);
                        }
                        if (!stringify.hasOwnProperty(str)) {
                            uniques.push(arr[i]);
                            stringify[str] = true;
                        }
                    }
                    uniques = uniques;
                    self.scoreTypeList = uniques;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        handleAvatarSuccess(response, file, fileList){
            let self = this;
            if(response.code == 0){
                 self.submitModel.fileUrl.push(response.data.url);
            } 
        }, 
        onRemoveFile(file, fileList){
            let fileUrls = self.submitModel.fileUrl;
            fileUrls.remove(file.response.data.url);
         
        },
        beforeAvatarUpload(file) {
            let self = this;
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/png';
            
            const isLt2M = file.size / 1024 / 1024 < 2;
            //判断图片类型
            if (!isJPG) {
              this.$message.error('上传附件图片只能是jpg,png,bmp文件格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }

            return isJPG && isLt2M;// && isName;
        },
        zoomPic (){
            this.zoomClass = !this.zoomClass;
            this.picDialog = !this.picDialog;
        },
        deletel(row){
            this.$confirm(`此操作将永久删除 “${row.studentName}的成绩修改申请” , 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.$http.delete("_sc:/scoreModifyApply/"+row.id)
                .then(data=>{
                        let type = "success";
                        let message = "删除成功！";
                    if(data.code===0){
                            
                        this.onSearch()
                    }else{
                        type = "error";
                        message = data.msg;
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
        // 打印
        print(row) {
            this.printDialog = true
            this.printList = {}
            this.printList = row
        },
        printAchievement() {
            let self = this;
            self.ifnone = false;
            setTimeout(() => {
                window.print();
            }, 100);
        },
        edit(row,viewDetail){//编辑的入口
            this.getCourseCategory(row.courseId,this.submitModel);
           
            let slef=this;
            if ( slef.courseTypeCode=="GJKS"||slef.courseTypeCode=="DYKS"||slef.courseTypeCode=="JXK"){
            this.showXiaonei=false;
            }
             
           this.showXiaonei=true;
            let self = this;
            this.viewDetail = viewDetail;
            self.submitModel.studentsNo = row.studentNo;
         
            self.modifystuts= 'edit'
            this.infoid = row.id;
            self.submitModel.oldGrade = row.oldGrade;
            self.submitModel.newGrade = row.newGrade;
            self.submitModel.semesters = row.termId;
            self.year = row.semesterYear
            self.submitModel.semesterNum = row.semesterYearNumber
            self.submitModel.courseId =  row.courseId;
            self.submitModel.scoreType = row.scoreTypeId;
            self.submitModel.examTime = row.examTime;
            self.submitModel.instruction = row.instruction;
            self.fileUrl = row.fileUrl;
            self.queryStudentInfo();
            self.modifyDialog = true;

            
        },
        closediaong(){ //关闭弹框
            this.stageName = ''
            this.infoid = ""
            this.ifdisabled = false
            this.modifyDialog=false
            this.studentsNo = ''
            this.oldGrade = ''
            this.newGrade = ''
            this.showstudentsinfo =false
        },
        preservation(val){
            //记录状态
            this.storagestate = val;
            //保存数据
            this.preservation1();

            // if(this.modifystuts=='edit'){
            //     this.editscore()  //编辑
            // }
            // else
            // {
            //     //新增
                   
            // }
                     


                     
        },
        enclosure(row){ //附件
            if(row.fileUrl.length > 0){
                this.picDialog = true
                this.picurl = `${row.fileUrl[0]}`
            }
        },
        withdraw(row){//撤回
        let arr = [row.id];
        //  arr.push(row.id)
        let param = {
            ids : arr,
            status : 2
        }
            
            this.$http.put('_sc:/scoreModifyApply/updateStatus',param).then(data=>{
                if(data.code==0){
                    this.$message({
                            message: '撤回成功',
                            type: 'success'
                        });
                this.onSearch()        
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        editscore(){//编辑
        if(this.fileList.length<1){
            this.$message.warning('请选择文件！');
        }else{
            let formData = new FormData();
            formData.append('file', this.fileList[0].raw);
            formData.append('id',this.infoid);
            formData.append('studentNo ',this.studentsNo);
            formData.append('semesterYear ',this.semesters.year);
            formData.append('semesterYearNumber',this.semesters.orderNum);
            formData.append('courseName',this.coursename );
            formData.append('courseId ', this.courseId);
            formData.append('stageName  ',this.stageName);
            formData.append('oldGrade  ',this.oldGrade);
            formData.append('newGrade  ',this.newGrade*1);
            formData.append('instruction', this.instruction);
            formData.append('status',  this.storagestate);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            }
            
            this.$http.post('_sc:/scoreModifyApply/update', formData,config).then(data => {
                    let self =this
                    if(data.code === 0) {
                            self.$message({  
                            message: '修改成功',
                            type: 'success'
                        });
                        self.modifyDialog = false
                        this.onSearch()
                    } else {
                        self.$message.error(data.msg);
                    }
                }).catch(error => {
                    this.$message.error('上传出错！')
                }) 
            
            }
        },
        submitUpload2(row){
            
            this.$confirm(`你确定提交 “${row.studentName}${row.termName}${row.courseName}的成绩修改申请吗？” , 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arr=[]
                arr.push(row.id)
                let param = {
                    ids:arr,
                    status:1
                }
                this.$http.put('_sc:/scoreModifyApply/updateStatus',param).then(data=>{
                    if(data.code==0){
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.onSearch()        
                    }
                }).catch(err=>{
                    console.log(err)
                })
                
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消操作'
                });          
            });
        
        },
        submitUpload(){//提交
        if(this.fileList.length<1){
            this.$message.warning('请选择文件！');
        }else{
            let formData = new FormData();
            formData.append('file', this.fileList[0].raw);
            formData.append('id',this.infoid);
            formData.append('studentNo ',this.studentsNo);
            formData.append('semesterYear ',this.semesters.year,);
            formData.append('semesterYearNumber',this.semesters.orderNum);
            formData.append('courseName',this.coursename );
            formData.append('courseId ', this.courseId);
            formData.append('stageName  ',this.stageName);
            formData.append('oldGrade  ',this.oldGrade);
            formData.append('newGrade  ',this.newGrade*1);
            formData.append('instruction', this.instruction);
            formData.append('status', this.storagestate);
            
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                  }
            }
            this.$http.post('_sc:/scoreModifyApply/update', formData,config).then(data => {
                    let self =this
                    if(data.code === 0) {
                            self.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        self.modifyDialog = false
                        this.onSearch()
                    } else {
                        self.$message.error(data.msg);
                    }
                }).catch(error => {
                    this.$message.error('上传出错！')
                }) 
            
            }
        },
        preservation1(){ //新增
        
            let self = this;
            // self.submitModel.fileUrl = self.fileList;
            
            self.$refs['submitModel'].validate((valid) => {
                if (valid) {
                    //提交数据到服务器
                    let data = {};
                    let url = '_sc:/scoreModifyApply/add';
                    data.studentName = self.submitModel.studentName,
                    data.studentNo = self.submitModel.studentsNo,
                    data.semesterYear = self.year
                    data.semesterYearNumber = self.submitModel.semesterNum,
                    data.courseName = self.submitModel.courseName,
                    data.courseId =  self.submitModel.courseId,
                    data.stageName = 0,
                    data.oldGrade = self.submitModel.oldGrade,
                    data.newGrade = self.submitModel.newGrade*1,
                    data.instruction = self.submitModel.instruction,
                    data.status = self.storagestate,
                    data.examTime = new Date(self.submitModel.examTime).getTime(),
                    data.scoreTypeId = self.submitModel.scoreType,
                    data.fileUrl =  self.submitModel.fileUrl;
                    if(self.modifystuts=='edit'){
                        data.id = self.infoid;
                        url = '_sc:/scoreModifyApply/update';
                    }else{
                        data.id = 0;
                    }
                    
                   if(data.oldGrade!==null){
                        self.$http.post(url, data).then( res => {
                            if(res.code === 0) {
                                self.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                self.changePreservation()
                                self.modifyDialog = false;
                                } else {
                          self.$message.error(res.msg);
                        }
                    }).catch(error => {
                        self.$message.error(error)
                    })
                   }
                    if(data.oldGrade==null){
                        this.$message.error('你输入的条件找不到要修改的成绩，请纠正后再保存');
                   }
               
    
                } else {
                
                    return false;
                }
            });

        // if(this.studentsNo==""||this.newGrade==""){
        //     this.$message({
        //         message: '请填写信息',
        //         type: 'success'
        //     });

        // }
        //   if (this.fileList.length < 1) {
        //         this.$message.warning('请选择文件！');
        //         return ;
        //     } else{
        //         
        //     }
        },
        changePreservation() {
            let self = this;
            let vuex = JSON.parse(localStorage.getItem('vuex'));
            let userId = vuex.me.attributes.login_info.id;
            let id = 0;
            let type = 1002
            let extend = JSON.stringify({
                student_no: self.submitModel.studentsNo,  //--学号
                course: self.submitModel.courseId,  //--课程ID
                semester_year: self.year,   //--学年
                semester_year_number: self.submitModel.semesterNum,     // --学期序号
                score_type_id: self.submitModel.scoreType,  // --成绩类型ID
                exam_time: this.timestampToTime(self.submitModel.examTime), //  --考试日期
                old_grade: self.submitModel.oldGrade, // --原成绩
                new_grade: self.submitModel.newGrade*1, // --新成绩
                instruction: self.submitModel.instruction // --修改说明
            })
            let postData = {
                id: id,
                type: type,
                extend: extend,
                user_id: userId,
            }
            this.$http.post('_sc:/scoreRecord/pTransCom', postData).then(res => {
                if(res.code == 0) {
                    self.onSearch()
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        getoldGrade(record){//获取原成绩  获取校内成绩
            let self = this; 
            self.submitModel.oldGrade = null;
            // courseId
            let studentNo = self.submitModel.studentsNo;
            let course = self.submitModel.courseId;
            let term = self.submitModel.semesters;
            let grade = self.submitModel.grade;
            let examTime = self.submitModel.examTime;
            let scoreType = self.submitModel.scoreType;
            let studentsNo =self.submitModel.studentsNo;
            let majorId =self.submitModel.majord;
        if(record=="学期") {
            self.submitModel.courseId="";//；类型
            self.submitModel.scoreType="";//；类型
            self.submitModel.examTime="";//时间
            self.submitModel.oldGrade="";//原成绩
            self.queryScoreType()
            self.semesterList.forEach(item => {
                if(self.submitModel.semesters == item.id) {
                    self.year = item.year
                    self.submitModel.semesterNum = item.orderNum
                }
            })
        }
        if(record=="考试时间") {
            
            self.getYuanchegnji(self.submitModel.courseId, self.submitModel.semesters, studentNo, self.courseTypeCode, self.submitModel.examTime, self.submitModel.scoreType)
        }
        if(record == "成绩类型") {
            self.submitModel.examTime="";//时间
            self.submitModel.oldGrade="";//原成绩
        }
        if(record=="课程"){
            this.courseList.forEach(element => {
                if(this.submitModel.courseId == element.courseId) {
                    this.submitModel.courseName = element.courseName
                }
            });
            self.submitModel.scoreType="";//；类型
            self.submitModel.examTime="";//时间
            self.submitModel.oldGrade="";//原成绩
            self.submitModel.newGrade="";//修改后成绩
            self.getCourseCategory(course,self.submitModel);
            self.queryScoreType()
        }
        if( self.showXiaonei==false){
            if(course.courseId!==undefined &&term.id!==undefined &&studentNo!==undefined &&self.courseTypeCode!==null ){

                        self.getYuanchegnji(course.courseId, term.id,studentNo,self.courseTypeCode)
                }
        }else{
            
             if(course.courseId!==undefined &&term.id!==undefined
            &&studentNo!==undefined &&this.courseTypeCode!==undefined 
            &&examTime!==""&&       scoreType.id!==undefined ){
                    self.getYuanchegnji(course.courseId, term.id,studentNo,self.courseTypeCode,examTime,scoreType.id)
                  
            }
        }
        if (this.submitModel.studentsNo && this.submitModel.semesters && this.submitModel.courseId && this.submitModel.scoreType && record !="考试时间") {
            this.getExamTime()
        }
        }, 
        getExamTime() {
            let user_id = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
            let roles = JSON.parse(localStorage.getItem('vuex')).me.roles.map(item=>item.id).join()
            let params = {
                id:0,
                type:"exam_time",
                extend:JSON.stringify({
                    course: this.submitModel.courseId,
                    student_no: this.submitModel.studentsNo,
                    score_type_id: this.submitModel.scoreType,
                    term_id: this.submitModel.semesters
                }),
                userId: user_id
            }
            this.$http.post("_sc:/modified/courseaffirm/pQueryCom", params).then(res => {
                if (res.code == 0) {
                    if (res.data != '') {
                        this.examTimeList = JSON.parse(res.data)
                    }
                }
            })
        },
        getCourseCategory(courseId,submitModel){
            let studentNo = submitModel.studentsNo;
            let course = submitModel.courseId;
            let term = submitModel.semesters;
            let grade = submitModel.grade;
            let examTime = submitModel.examTime;
            let scoreType = submitModel.scoreType;
            let studentsNo = submitModel.studentsNo;
            let majorId = submitModel.majord;
            let slef = this
            this.$http.get("_op:/course/"+courseId).then(data =>{
            
                slef.courseTypeCode = data.data.dictionaryCode
                
            if (data.data.dictionaryCode=="GJKS"||data.data.dictionaryCode=="DYKS"||data.data.dictionaryCode=="JXK"){
                
                slef.showXiaonei=false;
                if(course.courseId!==undefined &&term.id!==undefined &&studentNo!==undefined &&slef.courseTypeCode!==null ){
                     
                        // slef.getYuanchegnji(course.courseId, term.id,studentNo,slef.courseTypeCode)
                }
            }else{
                 slef.courseTypeCode="XN"
                
                slef.showXiaonei=true;
                if(course.courseId!==undefined &&term.id!==undefined
                &&studentNo!==undefined &&slef.courseTypeCode!==undefined 
                &&examTime!==""&&       scoreType.id!==undefined ){
                    this.getYuanchegnji(course.courseId, term.id,studentNo,slef.courseTypeCode,examTime,scoreType.id)
                   
            }
            }
            })
        },
        // 课程下拉列表
    // getCourseList2() {
    //   let param = {
    //       grade: this.submitModel.grade,
    //       majorId: "",
    //       termId: this.formYear
    //     };
    //     this.$http
    //         .post("_sc:/courseScoreModel/getCourseByParam", param)
    //         .then(data => {
    //             if (data.code == 0) {
    //                 if (data.data && data.data.length) {
    //                 let course = data.data
    //                 this.courseList1 = this.cancelDuplicate(course);
    //                 }
    //             } else {
    //                 this.$message.error(data.msg);
    //             }
    //         });
    //     },
        //  校外成绩获取
        getYuanchegnji(courseId,id,studentNo,courseTypeCode,examTime,scoreTypeId){
            // debugger
            let param={
                course:courseId,
                termId:id,
                studentNo:studentNo,
                courseTypeCode:courseTypeCode,
                examTime: new Date(examTime).getTime(),
                scoreTypeId: parseInt(scoreTypeId),
            }
            if(this.showXiaonei==false){
                delete  param.examTime;
                delete  param.scoreTypeId;
            }
                this.$http.post("_sc:/stuScore/getOldScore",param).then(data =>{
                
                    this.submitModel.oldGrade = data.data;
                 
                }) 
        },
        queryStudentInfo(){  //根据学号查询学生信息
            let self = this;
            self.$http.get('_op:/students/getByStuNum/'+ self.submitModel.studentsNo).then(res=>{
                if(res.code == 0){
                    if(res.data==null){
                        self.submitModel.studentName = '';
                        self.submitModel.grade = '';
                        self.submitModel.major =  '';
                        self.submitModel.majorId = '';
                        self.submitModel.administrativeName =  '';
                    }else{
                        self.submitModel.studentName = res.data.name;
                        self.submitModel.grade = res.data.grade;
                        self.submitModel.major = res.data.majorName;
                        self.submitModel.majorId =res.data.majorId;
                        self.submitModel.administrativeName = res.data.administrativeClassName;
                    }
                   
                }
                
            }).catch(err=>{
              
            }) 
        },
		openmodifyDialog(){
            this.viewDetail = false;
            //清空数据
            for(let key in this.submitModel){
                if(key === 'fileUrl'){
                    this.submitModel[key] = [];
                }else{
                    this.submitModel[key] = '';
                }
            }
            this.modifystuts = 'add'
			this.modifyDialog = true
		},
        getTermData(){//查询学期列表
            let query="学期"
            this.$http.get('_op:/terms/'+query).then(data=>{
                if(data.code==0){
                    this.semesterList = data.data.reverse();
                    //   this.semesterList.forEach(item =>{
                    //             if(item.name.indexOf("当前学期")!=-1){
                    //                this.semesters =item.name
                    //             }
                    //             })
                        for(let i=0;i<this.semesterList.length;i++){
                                    if(this.semesterList[i].name.indexOf('当前学期')!=-1){
                                        this.formYear=this.semesterList[i].id
                                        this.addForm = this.semesterList[i].name;
                                        this.semesterNum = this.semesterList[i].orderNum;
                                        this.fallYear =this.semesterList[i].year;
                                    }
                            }
                    this.onSearch()
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        getCourseList(grade, major_id, term_id){//查询课程
        if(grade == "" || grade == null) {
          grade = 0
        }else{
          grade = grade
        }
        if(major_id == "" || major_id == null) {
          major_id = 0
        }else{
          major_id = major_id
        }
        if(term_id == "" || term_id == null) {
          term_id = 0
        }else{
          term_id = term_id
        }
        let vuex = JSON.parse(localStorage.getItem('vuex'));
        this.$http.post("_sc:/modified/courseaffirm/pQueryCom",{
          id: 0,
          type:"couse_from_score_model",
          extend:JSON.stringify({teacher_id:vuex.me.attributes.login_info.id,roles:vuex.me.roles.map(item=>item.id).join(),term_id:term_id,grade:grade,major_id:major_id}),
          userId: vuex.me.attributes.login_info.id,
        }).then(data => {
            if (data.code == 0) {
                if (data.data && data.data.length) {
                    this.courseList = JSON.parse(data.data);
                    
                }
            } else {
                this.$message.error(data.msg);
            }
          });
        },
        onSearch(){
            this.tableData = []
            let vuex = JSON.parse(localStorage.getItem('vuex'));
            let roles = vuex.me.roles.map(item=>item.id).join();
                let query = {
                        id: 0,
                        type:"score_modify_apply_list",
                        extend: JSON.stringify({
                            approval: 0,      // --申请传0，审批传1
                            courseId: this.courseId,     // --课程编码，如选择         
                            semesterYear: this.fallYear ? this.fallYear: '', // -- 学年
                            semesterYearNumber: this.semesterNum ? this.semesterNum: '',   //--学期
                            status: this.filestate,             // --状态
                            studentName: this.studentName,        // --学生姓名
                            studentNo: this.studentNo,       // --学号
                            role: roles  //jxk,xuejike,cg""      --当前用户角色   /api/platform/authorize/me?_t=26687615  接口返回的roles
                    }),
                    userId: vuex.me.attributes.login_info.id    //当前用户ID"
                }
			this.$http.post('_sc:/modified/courseaffirm/pQueryCom',query).then(data=>{
                this.tableData = JSON.parse(data.data)
                this.tableData.forEach(item => {
                    item.examTime = item.examTime
                })
                this.totalCount=data.data.totalCount;
              
			}).catch(err=>{
				console.log(err)
			})
            },
        timestampToTime(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            return Y+M+D
        },
      collapseShow(){
          this.fold.state=!this.fold.state;
          this.fold.text=this.fold.state?'收起':'展开';
        },
            // 显示条数
            sizeChange(size){
                this.pageNo = 1;
                this.pageSize = size;
                this.onSearch();//刷新列表
            },
            currentChange(current){
                this.pageNo=current;
                this.onSearch();//刷新列表
            },
     
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
        onEvaluation () {
      
        
      }
        },
    }	
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.el-dialog {
    position: relative;
    margin: 1 auto 50px;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    width: 70%;
}

.pull-right{
  text-align: right;
  margin-right: 10px;
}
.fromBox{
    position: relative;
}
.detail{
	.fromleft{
        width:52%;
	}
}
.fromBox{
     display: flex;
    flex-wrap: wrap;
}
.tab2{
        
        td{
			width: 200px;
            text-align: center;
            height: 40px;
          
             border: solid 1px rgb(220, 223, 230);
        }
        .category{
            width: 100px;
            height: 40px;
            line-height: 40px;
            padding-right: 15px;
             text-align: right;
              border: none;
           
            
        }
       
    }
.content1,.content2{
    margin-left: 20px
}
.zoomClass{
    position:fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 201812;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s;
    background-color: rgba(0, 0, 0, .5);
    
    img{
        max-width: 100%;
        max-height: 100%;
        transition: all .3s;
        cursor: pointer;
    }
}
.bor_left{
    height: 35px;
    line-height: 35px
}

.el-input--suffix {
    padding-right: 0px;
    width:200px;
}

.el-select{
    width:200px;
}

.el-input{
    width:200px;
}

.el-date-editor.el-input{
    width:200px;
}

.el-form-item__content{
    width:500px;
}

.el-form-item {
    margin-bottom: 10px;
}

#el-body /deep/ .el-dialog__body {
    padding: 0px 10px;
    color: #606266;
    font-size: 14px;
} 


#el-body /deep/ .el-dialog__footer {
    padding: 0px 20px 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.customerStyle{
    padding:0px 10px;
}

// .avatar-uploader {
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     width: 170px;
//     height: 170px;
// }

// .avatar-uploader:hover {
//     border-color: #409EFF;
// }

// .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 170px;
//     height: 190px;
//     line-height: 190px;
//     text-align: center;
// }

// .avatar {
//     width: 170px;
//     height: 190px;
//     display: block;
// }
 
</style>