<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="" >
            <el-form :inline="true" size="mini" label-width="68px">
                <div class="fold" style="	margin-top: 20px">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="学期">
                            <el-input v-model="row.semester_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="上课班">
                            <el-input v-model="row.name" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="mybtn" style="    padding-left: 20px;">
					
					<el-button size="small" type="primary" @click="addTask">新增</el-button>
					<el-button size="small" type="primary"  @click="importTeacherList">导入学生名单</el-button>
					<el-button size="small" type="primary" @click="exportClassStudents">上课班学生导出</el-button>
					<el-button size="small" type="primary" @click="exportGroupStudents">上课组学生导出</el-button>
					<a v-show="false" ref="exportExcel"></a>
					<el-button size="small" @click="batchDelet" style="margin-left:10px;">批量删除</el-button>
					<el-button size="small" @click="goReturn()">返回</el-button>
					 
					<el-form-item label="行政班" style=" margin-left: auto;	height: 30px;">
						<el-select v-model="administrativeclass" @change="onSelectChange" placeholder="请选择行政班">
							<el-option
							v-for="item in administrativeclasslist"
							:key="item.id"
							:label="item.clsname"
							:value="item.clsname">
							</el-option>
						</el-select>
					</el-form-item>
					 

				</div>
            </el-form>
        </div>
		 <el-dialog title="批量导入学生名单" :visible.sync="importTeacherDialog" width="450px" append-to-body
            :close-on-click-modal="false" class="import-teachers-list">
            <p style="margin-bottom: 30px;">下载模版 <a href="template/classes-student-template.xls"
                    download='上课班学生名单导入模板'><span class="link-module-file"
                        style="color:#409eff; text-decoration: underline; cursor:pointer;">学生名单导入模板.xlsx</span></a>
            </p>
		
            <el-upload class="upload-demo" ref="upload" :action="getUploadUrl"
                :file-list="fileList" :on-success="onSuccess" :on-change="fileSelected" :before-upload="onBefore"
                :headers="headers" :auto-upload="false">
                <el-button slot="trigger" size="small">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">导入</el-button>
            </el-upload>
        </el-dialog>

        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
					:max-height="tableHeight"
                    style="width: 100%;"
					:row-style="{height:0+'px'}"
                    :cell-style="{padding:0+'px'}"
                    header-row-class-name="cm-dark"
                    @selection-change="onSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.w"></el-table-column>

                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="delTableRow(scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="groupSituation(scope.row)" type="text" size="small">分组情况</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
              
              
                layout="total"
                :total="totalCount"
              >
            </el-pagination>
        </div>
        <!-- 分组情况 -->
        <el-dialog
           width="500px"
           title="提示"
           :visible.sync="dialog.groups"
           :close-on-click-modal="false"
           :modal-append-to-body="false">
           <div class="groups-wrap">
	           <div class="groups">
	           	<p>学&emsp;号：{{groups.num}}</p>
	           	<p>姓&emsp;名：{{groups.name}}</p>
	           	<p>所在级：{{groups.grade}}</p>
	           	<p>专&emsp;业：{{groups.major}}</p>
	           	<p>行政班：{{groups.class}}</p>
	           </div>
	            <div class="cm-table">
		            <el-table
		                    ref="multipleTable"
		                    :data="groupData"
		                    border
		                    style="width: 100%"
		                    header-row-class-name="cm-dark">
		                <el-table-column v-for="(item,index) in groupList" 
		                	:key="index" :prop="item.prop"
		                 	:label="item.label">
		                </el-table-column>
		            </el-table>
		        </div>
	        </div>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="dialog.groups=false">关 闭</el-button>
	        </span>
        </el-dialog>
        
        
        <!--新增学生-->
        <el-dialog class="selectstubox pm-margin"
         title="上课班关联学生"
		 width="82%"
         :close-on-click-modal="false"
         :visible.sync="selectstushow" size="large" :append-to-body="true">
        	<div style="margin-bottom:20px;width:82%;">
				<div>当前维护数据信息：学期：{{row.semester_name}}&emsp;上课班：{{row.name}} 
					<span style="margin-left:20px">
						 <el-checkbox v-model="checked"  @change="handleCheckAllChange">关联其他班级学生</el-checkbox>
					</span>	
					
					 
					 </div> 
				 <el-form :inline="true" :model="formInline" size="mini">
					
				 </el-form>
	           	<!-- <span>路径：{{inputGrade}}级</span> -->
	        </div>
			<el-form class="filtrate" :inline="true" size="mini">
				<el-form-item label="年级:" filterable placeholder="全部">
					<intelligent-year-picker style="width: 120px;"
						v-model="formInline.grade"
						@change="changeGrade()"
						type="year" 
						value-format="yyyy" 
						> 
					</intelligent-year-picker>
				</el-form-item>
				 <el-form-item label="专业">
					<el-select v-model="majorid" placeholder="请选择专业" @change="majoridChange()" style="width: 150px;">
						<el-option
						v-for="item in majorlist"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 班级 -->
				 <el-form-item label="班级" >
					<el-select v-model="classid" :disabled="majorid=='' " placeholder="请选择行政班" @change="classidChange" style="width: 150px;">
						<el-option
						
						v-for="item in classlist"
						:key="item.id"
						:label="item.name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				 <el-form-item label="学号" style=" ">
					<el-col :span="11">
						<el-input  clearable v-model="student.start" style="width: 150px;"></el-input>
					</el-col>
					<el-col class="line" :span="2" style="text-align: center;    padding-left: 6px;padding-right: 10px;">至</el-col>
					<el-col :span="11">
						<el-input  clearable v-model="student.end" style="width: 150px;"></el-input>
					</el-col>
				</el-form-item>
				 <el-form-item style="margin-left:16px;">
					<el-button size="mini" @click="stndentsfift(student.start,student.end)" type="primary">查询</el-button>
				 </el-form-item>
			</el-form>
			<!--编辑考生-->
			<div  style="display: flex;flex-direction: row; justify-content: left; align-items: center;">
				<div style="display: inline-block; padding: 10px; border: 1px solid #dfe6ec; border-radius: 5px;height: 400px;width: 50%;overflow: auto;">
					<el-table :data="stdlist_two" border tooltip-effect="dark" ref="leftTable" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_change">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="学号" property="studentNo"></el-table-column>
						<el-table-column label="姓名" property="name"></el-table-column>
					</el-table>
				</div>

				
				<div  class="boxStyle">
					<el-button style="margin: 10px 10px;" @click="torightSelected" :disabled="checkstdlist.length==0">增加<i class="el-icon-d-arrow-right" style="margin-left: 5px;"></i></el-button>
					<el-button style="margin: 10px 10px;" @click="torightDelete" :disabled="checkstdlists.length==0"><i class="el-icon-d-arrow-left" style="margin-left: 5px;"></i>删除</el-button>
				</div>
				
				<div style="border: 1px solid #dfe6ec; padding: 10px; border-radius: 5px; height: 380px;width: 50%; overflow: auto;">
					<p style="margin-bottom: 10px;">已选学生</p>
					<el-collapse v-if="refreshCollapse" v-model="activeNames">
						<el-collapse-item :title="key"  v-for="(value,key,index) in selectedStudentList" :key="key" :name="key" >
							<el-table :show-header="false" :data="value" border tooltip-effect="dark" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_changes" >
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column label="学号" property="studentNo"></el-table-column>
								<el-table-column label="姓名" property="name"></el-table-column>
							</el-table>
						</el-collapse-item>
					</el-collapse>
					
				</div>
			</div>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="selectstushow = false">取 消</el-button>
				<el-button type="primary" @click="confirmAdd">确 定</el-button>
			</span>
		</el-dialog>	
        
	</section>
</template>

<script>
	import util from '@/util'
	const TYPE='associate_students';
    const REMARK='上课班关联学生';
	export default {
		name:TYPE,
		data(){
			return {
				checked:false,
				administrativeclass:'',
				administrativeclasslist:[],
				importStudentStatus: {},
				 fileList: [], // 上传文件列表
				  importTeacherDialog: false, // 导入名单对话框
				    headers: {
                    Access_Token: localStorage.getItem('token'),
                    Authorization: localStorage.getItem('token')

                },
				tableHeight: window.innerHeight * 0.7,
				student:{
					start:'',
					end:''
				},
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "上课班管理",path:'/teaching_management/class_management'},
                    {label: REMARK},
				],
				formInline:{
					grade:new Date().getFullYear(),
				},
				datesTime:"2019",
                dialog:{
                	status:'add',
                	groups:false,
                	remark:false,
                	visible:false
                },
                tableList:[
		            {label:'学号', prop:'code', w: '120'},
		            {label:'姓名', prop:'name', w: '160'},
		            {label:'行政班', prop:'clsname',},
		            {label:'所在级', prop:'grade', w: '90'},
		            {label:'专业名称', prop:'major',}
		        ],
		        groupList:[
		            {label:'授课形式', prop:'teaching_formname',},
		            {label:'组号', prop:'group_number',},
		            {label:'组名', prop:'group_name',}
		        ],
		        groups:{
		        	num:"",
		        	name:"",
		        	grade:"",
		        	major:"",
		        	class:""
		        },
		        groupData:[],
				tableData:[],
				tableData1:[],
                deleteList:[],
                choiceList:[],
                stuIdList:[],
                gradeList:[
                	{label:"2014",value:"2014"},
                	{label:"2015",value:"2015"},
                	{label:"2016",value:"2016"},
                	{label:"2017",value:"2017"},
                	{label:"2018",value:"2018"},
                    {label:"2019",value:"2019"},
                	{label:"2020",value:"2020"},
                	{label:"2021",value:"2021"},
                	{label:"2022",value:"2022"},
                	{label:"2023",value:"2023"}
                ],
				treeData:[],
				titleList:[],
				leftlist:[],
				rightlist:[],
                treeProps:{
                	children: 'children',
          			label: 'label'
                },
                onSelectChoseVal:[],
                row:"",
                grade:"",
                inputGrade:"",
                pageNo: 1,
	          	pageSize: 10000,
	          	totalCount:0,
	          	checkAll:false,
	          	isIndeterminate:true,
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
		        
		        selectstushow:false,//选择考生
				majorlist:[],//专业列表
				gradevalue:'',//年级
				majorid:'',
				classlist:[],
				classid:'',
				
				classlabel:[],//班级
				selectstu_judge:true,//班级disabled
				sclassList:[],//班级列表
				
				stdlist:[],//学生列表
				stdlist_two:[],
				checkstdlist:[],//选中学生列表
				checkstdlists:[],//选中学生列表
				selectedList:[],//已选学生列表
				userId:util.getStorage('loginId'),
				userName:util.getStorage('loginName'),
				selectedStudentList:{},
				refreshCollapse:true,
				activeNames:[]
		        
			}
		},
		created(){
			
			this.row = JSON.parse(this.$route.query.row);
		
			this.inputGrade = this.row.grade;
		
			this.formInline.grade= String(this.row.grade);
			this.selectedStudentList = {};
			
			this.getTableList();
			this.querymajorbygrade();
		},
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
			  };
			    //   
			util.openBtnPermit(this.btnPerObj);
			
		},
		computed: {
			getUploadUrl() {
				var clsId = this.row.id;
				return `/edu/admin/coursecls/importStudent/${clsId}`;
			},
		},
		methods:{
			handleCheckAllChange(val){
				
				
				if(this.checked){
					this.majorlist = [];
					this.$http.get('_op:/major/combox/').then(data=>{
						this.majorlist=data.data;
				})
				
				}else{
					// this.querymajorbygrade(value);
				}
			},
			onSelectChange(val){ //过滤出
				console.log(val)
				var newarr = this.tableData1.filter(item=>
					val==item.clsname
				)
				console.log(newarr)
				this.tableData = newarr
			},
			stndentsfift(start,end){
				let self = this
				var newArr = []
				if(start!=''&&end!=''){
					 newArr = self.stdlist.filter(item => item.studentNo>=start&&item.studentNo<=end)
					self.stdlist_two = newArr
					
				}else if(start!=''&&end==''){
					newArr = self.stdlist.filter(item => item.studentNo>=start)
					self.stdlist_two = newArr
				
				}else if(start==''&&end!=''){
					newArr = self.stdlist.filter(item => item.studentNo<=end)
					self.stdlist_two = newArr
					
				}else{
					self.stdlist_two = self.stdlist
				}
				
			
			},
			  importTeacherList() {
                this.importTeacherDialog = true;
            },
			exportClassStudents(){
				this.$http2.post('_ed:/export/student/query/class',{
					cls_id:this.row.id,
					request_page:this.pageNo,
					page_size:this.pageSize
				}).then(datas => {
					let url = window.URL.createObjectURL(new Blob([datas]));
					let y = this.$refs.exportExcel;
					y.href = url;
					y.setAttribute("download", "上课班学生.xls");
					y.click();
					window.URL.revokeObjectURL(url);
				})
			},
			exportGroupStudents(){
				this.$http2.get(`_ed:/export/student/group/${this.row.id}`).then(datas => {
					let url = window.URL.createObjectURL(new Blob([datas]));
					let y = this.$refs.exportExcel;
					y.href = url;
					y.setAttribute("download", "上课组学生.xls");
					y.click();
					window.URL.revokeObjectURL(url);
				})
			},
			     // 导入文件选择文件
            fileSelected(file, fileList) {
                this.fileList = fileList.slice(-1);
                this.importExcel();
			},
			     // 导入excel表格数据
            importExcel(obj) {
                let _this = this;
                // let nowDate = '' , years = '', month = '', day = '';
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                // this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function (f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if (rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
                        this.da = [...outdata];
                        let arr = [];
                        for (let i = 0; i < outdata.length; i++) {
                            let tempOjb = {};
                            tempOjb.departmentIds = [];
                            for (let key in outdata[i]) {
                                if (key == '*姓名') {
                                    tempOjb.name = outdata[i][key];
                                }
                                if (key == '*工号') {
                                    tempOjb.teacherNo = outdata[i][key];
                                }
                                if (key == '职称') { // 职称id
                                    let posList = _this.positionList;

                                    // tempOjb.positionalTitleId = outdata[i][key];
                                    for (let j = 0; j < posList.length; j++) {
                                        if (posList[j].cnName == outdata[i][key]) {
                                            tempOjb.positionalTitleId = (posList[j].id);
                                        }
                                    }
                                }
                                if (key == '一卡通') {
                                    tempOjb.cardInfo = outdata[i][key];
                                }
                                if (key == '*性别') {
                                    if (outdata[i][key] == '男') {
                                        tempOjb.sex = 1;
                                    } else {
                                        tempOjb.sex = 2;
                                    }
                                }
                                if (key == '邮箱') {
                                    tempOjb.email = outdata[i][key];
                                }
                                if (key == "手机号") {
                                    tempOjb.mobile = outdata[i][key];
                                }
                                if (key == "证件号") {
                                    tempOjb.cardNo = outdata[i][key];
                                }
                                if (key == "证件类型") {
                                    let cardCategory = _this.optionList.cardCategory;

                                    for (let j = 0; j < cardCategory.length; j++) {
                                        if (outdata[i][key].indexOf('身份证') > -1 && outdata[i][key].indexOf(
                                                '中国') > -1) {
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        } else if (outdata[i][key].indexOf('身份证') > -1) { // 港澳台身份证
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        } else if (cardCategory[j].name == outdata[i][key]) { // 其他证件
                                            tempOjb.cardCategoryId = cardCategory[j].id;
                                        }
                                    }
                                }
                                if (key == "地址") {
                                    tempOjb.address = outdata[i][key];
                                }
                                // if (key == "部门") {
                                //     let  _this=this
                                //     let depList = _this.departmentData;
                                //     for (let j = 0; j < depList.length; j++) {
                                //         if(depList[j].name == outdata[i][key]) {
                                //             tempOjb.departmentList.push(depList[j].id);
                                //         }
                                //     }
                                // }
                                let years = new Date().getFullYear();
                                let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() +
                                    1) : (new Date().getMonth() + 1);
                                let day = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date()
                                    .getDate();
                                // nowDate = `${year-month-day}` // '2018-08-03'; // 创建时间
                                tempOjb.createTime = `${years}-${month}-${day}`;
                                tempOjb.status = 1;
                                tempOjb.createUserId = 1; // 动态读取
                            }
                            arr.push(tempOjb);
                        }
                        _this.importExcelData = arr;

                    }
                    // reader.readAsArrayBuffer(f);
                }
                if (rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            onSuccess(res, file, fileList) {
                let type = "success";
                let message = "导入成功！";
                if (res.code != 0) {
                    type = "error";
                    message = res.data.errors[1][0]
                }
                this.$message({
                    type: type,
                    message: message
				})
				this.importTeacherDialog = false;
				this.getTableList();
				this.importStudentStatus.close();
			},
			submitUpload() {
                this.$refs.upload.submit();
                return;
			},
			 onBefore(file) {
                let extension = file.name.split('.')[1] === 'xls';
                let size = file.size / 1204 / 1204 < 20;
                if (!extension) {
                    this.$message.warning("上传的文件格式是 xls！")
                }
                if (!size) {
                    this.$message.warning("上传的文件大小不能超过20M！")
				}
				this.importStudentStatus = this.$loading({
					lock: true,
					text: "导入中...",
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
                return extension && size;
            },
			filterStudentNo(value, row) {
				return row.studentNo == value;
			},
			dates(){
				this.formInline.grade=this.inputGrade
			},
			          //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
				
                    data.data.map(item => {
                       if (item.code=="query_shangkebanguanli") {  //查询
                        self.btnPerObj.query=true;
                        }
                       
                        if (item.code=="del_shangkebanguanli") {  //删除
                        self.btnPerObj.delete=true;
                        }
                    });
                }).catch(()=>{
                })
            },
        //    返回按钮
			goReturn(){
				this.$router.push({
					path: "/teaching_management/class_management",
					query:{
						actionId: this.$route.query.actionId
					}
				});
			},
	        // sizeChange(size){
	        // 	this.pageNo = 1;
            //     this.pageSize = size;
            //     this.getTableList();
			// },
			// currentChange(current){
			// 	this.pageNo=current;
            //     this.getTableList();
			// },
			addTask(){
		
//				this.dialog.status='add';
				this.selectstushow = true;
				this.selectedStudentList = {};
			},
			dialogClose(){
				this.treeData = [];
				this.choiceList = [];
				this.dialog.visible = false;
			},
			confirmAdd(){
				let stuIdList = [];
				for(var grade in this.selectedStudentList) {
					if (Array.isArray(this.selectedStudentList[grade])) {
						this.selectedStudentList[grade].forEach(s => stuIdList.push(s.id));
					}
				}
				if(stuIdList.length==0){
					this.$message.warning("请选择学生！");
					return ;
				}
				// for(let list of this.checkstdlists){
				// 	stuIdList.push(list.id)
				// }
				this.$http.post("_ed:/coursecls/student/add",{
					cls_id:this.row.id,
					stulist:stuIdList,
					// create_user:this.userId,
					create_username:this.userName
				}).then(data=>{
					let type = "success";
					let message = "新增成功！"
					if(data.code==0){
						this.selectstushow=false;
						this.stdlist = [];
						this.selectedList = [];
						this.gradevalue = "";
						this.majorid = "";
						this.classid = "";
						this.getTableList();
					}else{
						type = "error";
						message = data.msg;
					}
					this.$message({
						type:type,
						message:message
					})
				})
			},
			onSelectionChange(val){
				this.onSelectChoseVal = val;
			},
			batchDelet(){
				let idList = [];
				for(let item of this.onSelectChoseVal){
					idList.push(item.id);
				}
				if(this.onSelectChoseVal.length>0){
					this.$http.post("_ed:/coursecls/student/deletebatch",{
						idlist:idList
					}).then(data=>{
						let type = "success";
						let message = "批量删除成功！"
						if(data.code==0){
							if(this.tableData.length==1){
								this.pageNo = 1;
							}
							this.getTableList();
						}else{
							type = "error";
							message = data.msg;
						}
						this.$message({
							type:type,
							message:message
						})
					})
				}else{
					this.$message.error("请选择要删除的数据！");
				}
			},
			groupSituation(row){
				this.dialog.groups=true;
				this.groups.num = row.code;
				this.groups.name = row.name;
				this.groups.grade = row.grade;
				this.groups.major = row.major;
				this.groups.class = row.clsname;
				this.$http.get("_ed:/coursecls/group/cls/"+row.cls_id+"/student/"+row.stu_id)
				.then(data=>{
					if(data.code==0){
						this.groupData = data.data;
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			planAdjustment(row){
				this.dialog.status='edit';
				this.dialog.visible = true;
			},
			delTableRow(row){
				this.$confirm(`此操作将永久删除“${row.clsname}”所维护的信息, 是否继续?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.$http.delete("_ed:/coursecls/student/delete/"+row.id)
		        	.then(data=>{
		        		let type = "success";
		        		let message = "删除成功！";
		        		if(data.code==0){
		        			if(this.tableData.length==1){
		        				this.pageNo = 1;
		        			}
		        			this.getTableList();
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
			 unique(arr){
				    let hash = {};
                    arr = arr.reduce(function(item, next) {
                    hash[next.clsname] ? '' : hash[next.clsname] = true && item.push(next);
                    return item
                }, [])
                return arr
			 },
			getTableList(){
				this.$http.post("_ed:/coursecls/student/query",{
					cls_id:this.row.id,
					request_page:this.pageNo,
					page_size:this.pageSize
				}).then(data=>{
					if(data.code==0){
	          			this.totalCount = data.data.total_records;
						this.tableData = data.data.dataList;
						this.tableData1 = data.data.dataList;
				
						this.administrativeclasslist = this.unique(data.data.dataList)
					
						for(let item of this.tableData){
							this.grade = item.grade;
						}
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			/*------------*/
			gradevalueChange(value){//选择年级
				if(this.checked){
					querymajorbygrade2(value)
				}else{
					this.querymajorbygrade(value);
				}
	    		
	    	},
	    	querymajorbygrade(grade){
				this.majorlist = [];
				let courseClsId = this.row.id;
	    		this.$http.get("_ed:/semestercourse/major/list/" + courseClsId).then(data=>{
        			this.majorlist=data.data;
                }).catch(()=>{
                })
			},
			querymajorbygrade2(){
				this.majorlist = [];
				this.$http.get('_op:/major/combox/'+grade).then(data=>{
					this.majorlist=data.data;
				})
					

			},	
			majoridChange(){//选择专业
			this.classid=''
			this.queryclass(this.formInline.grade,this.majorid);
			},
			changeGrade(){
				this.queryclass(this.formInline.grade,this.majorid);
				this.classid=""
				this.stdlist = [];
				this.$refs.leftTable.clearSelection();
			},
	    	queryclass(grade,major){
				this.stdlist_two =[]
				this.classlist = [];
				if(grade!=null){
					this.$http.get("_op:/students/class/list/"+grade+'/'+major).then(data=>{
	    			if(data.data){
						
	    				
	    					for(let list of data.data){
	    						//过滤当前空值
	    						if(list){
									var temp = this.classlist.filter(x => x.id == list.id);
									if (temp.length <= 0) {
										this.classlist.push(list)
									}
	    							
	    						}
		    				
	    				}
	    			}
                }).catch(()=>{
                })

				}
	    	},
			classidChange(value){//选择行政班
				this.querystudents(value)
				this.checkstdlist = [];
	    	},
	    	querystudents(classid){
				let slef = this
				slef.stdlist = [];
				slef.activeNames=[]
	    		this.$http.get("_op:/students/student/list/"+classid+"/"+this.row.id).then(data=>{
					slef.stdlist = data.data
					slef.stdlist_two = slef.stdlist
					
					//暂时注释  不知道 selected 的原因 后台关胜也不知道
	    			// let _data = data.data;

	    			// for(let i=0;i<_data.length;i++){
	    			// 	if(!_data[i].selected){
					// 		slef.stdlist.push(_data[i])
					// 		slef.stdlist_two = slef.stdlist
	    			// 	}
					// }
					
                }).catch(()=>{
                })
	    	},
			checkstd_change(value){//添加勾选事件
				this.checkstdlist = value;  
			},
			
			torightSelected(){//添加
				let self=this;
	    		if(self.checkstdlist.length > 0){ 	    			 
	    			self.selectedList = self.checkstdlist;//已选学生的列表
				}
				let value = self.checkstdlist;
				
				let grade = String(self.formInline.grade)+"级";//所选不同所在级
				//1.构造数据结构
				if(self.selectedStudentList[grade] && self.selectedStudentList[grade].length > 0){
					let currentArray = self.selectedStudentList[grade]; 
					let length1 =  value.length;
					let length2 =  currentArray.length; 
					for (let i = 0; i < length1; i++) {
						let record = currentArray.filter(item => item.id == value[i].id);//数组去重
						if(record.length == 0 ){
							currentArray.push(value[i]);	
						}
					}   
					self.selectedStudentList[grade] = currentArray;
				}else{
					self.selectedStudentList[grade] = value;//如果没有重复选择，赋值给已选
				} 

				self.activeNames = [];
				for(let activeName in self.selectedStudentList){
					self.activeNames.push(activeName);
				}
			

				// 移除组件
				this.refreshCollapse = false;
				// 在组件移除后，重新渲染组件
				// this.$nextTick可实现在DOM 状态更新后，执行传入的方法。 强制刷新组件
				this.$nextTick(() => {
					this.refreshCollapse = true;
				})

			
			},
			checkstd_changes(value){//删除勾选事件
				let self =this;
				//去除重复 
				for(let i=0;i < value.length;i++){
					let record = self.checkstdlists.filter(item => item.id == value[i].id);
					if(record.length == 0 ){
						self.checkstdlists.push(value[i]);	
					}
				} 
			},
			torightDelete(){//批量删除
				let self = this; 
				
				for(let i=0;i<self.checkstdlists.length;i++){
					for(let key in self.selectedStudentList){
						let current = self.selectedStudentList[key];
						if(current){
							for(let j=0;j<current.length;j++){
								if(self.checkstdlists[i].id === current[j].id){
									current.splice(j,1);
								}
							}
						}
						 
					}
				}

				for(let key in self.selectedStudentList){
					let current = self.selectedStudentList[key];
					if(current == null || current.length == 0){
						delete self.selectedStudentList[key];
					}
				}

					 // 移除组件
				this.refreshCollapse = false;
				// 在组件移除后，重新渲染组件
				// this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
				this.$nextTick(() => {
					this.refreshCollapse = true;
				})
				 
	    	},
		}
	}
</script>
<style scoped lang="less">
	.mybtn{
		display: flex;
		height: 30px;
		padding-bottom: 20px
	}
	.cm-fold {
		padding: 10px;
	    margin-bottom: 10px;
	    border-radius: 5px;
	    background-color: #f7f7f7;
	}
	.class-wrap {
		display: flex;
		justify-content: space-around;
		overflow: hidden;
	}
	.class-inner {
		width: 240px;
	}
	.class-wrap-title {
		width: 100%;
		text-align: center;
	    padding: 8px 0;
	    border: 1px solid #ddd;
	}
	.class-main {
		width: 100%;
		border: 1px solid #ddd;
	}
	.btnB {
        display: inline-block;
        align-self: center;
        margin: 0 10px;
    }
    .btnB .el-button {
        padding: 8px 16px;
        margin-bottom: 20px;
    }
    .groups-wrap {
    	display: flex;
    }
    .groups {
    	width: 160px;
    }
    .class-tree {
    	height: 260px;
    	padding-left: 10px;
    	overflow-y: scroll;
    }
    .class-right {
    	height: 286px;
	    padding-left: 10px;
	    padding-top: 10px;
    }
    /*---------------------------------*/
    .contentline{
    	position: relative;
    }
    .spread{
	    position: absolute;
	    right: 0;
	    top: 2px;
    }
    
    
    .filtrate{
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
    }
    .boxStyle{
		// display:inline;
		display: flex;
		flex-direction: column;
	}
	 .pm-margin /deep/.el-dialog__body{
        padding: 10px 40px;
    }  
</style>