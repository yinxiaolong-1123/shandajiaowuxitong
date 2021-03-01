<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path, query: item.sendParam }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>	
        </div>
        <div class="" style=" padding-left: 20px;">
            <el-form :inline="true" size="mini">
                <div class="fold" style="    margin-top: 20px;">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="学期">
                            <el-input v-model="row.semester_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="上课班">
                            <el-input v-model="row.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="授课形式">
                            <el-input v-model="row.teaching_formname" :disabled="true"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="组号">
							<el-input v-model="row.group_name" :disabled="true"></el-input>
						</el-form-item>
                    </div>
                </div>
				 <div class="mybtn">
	            <el-button size="small" type="primary" @click="addTask">新增</el-button>
	            <el-button size="small" @click="batchDelet">批量删除</el-button>
	            <el-button size="small" @click="goBack">返回</el-button>
			
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
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
					:row-style="{height:0+'px'}"
                    :cell-style="{padding:0+'px'}"
					:max-height="tableHeight"
                    style="width: 100%"
                    header-row-class-name="cm-dark"
                    @selection-change="onSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column  class=" boxStyle"  v-for="(item,index) in tableList" :key='index' :prop="item.prop"  :width="item.width" :label="item.label"></el-table-column>

                <el-table-column
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="delTableRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
				 
            </el-table>
        </div>
        <div class="cm-pagination">
           
				<el-pagination
						layout="total"
						:total="totalCount">
					</el-pagination>
        </div>
        <!-- 新增 -->
        <el-dialog
          title="新增关联学生"
          width="1080px"
          :visible.sync="dialog.visible"
          :close-on-click-modal="false"
          :modal-append-to-body="false">
           	<div class="class-student">
	           	<div style="padding-bottom:20px">
					当前维护数据信息：学期：{{row.semester_name}}&emsp;
					上课班：{{row.name}}&emsp;
					授课形式：{{row.teaching_formname}}&emsp;
					组号：{{row.group_number}} &nbsp;&nbsp;
					<span style="margin-left:20px">
							<el-checkbox v-model="checked"  @change="handleCheckAllChange">关联其他班级学生</el-checkbox>
					</span>	
	           	</div>
	           	<!-- <span>路径：{{grade}}级</span> -->
           	</div>	
          	
			<el-form class="filtrate" :inline="true" size="mini" v-if='checked'>
		
				<el-form-item label="年级">
					<intelligent-year-picker v-model="grade"  value-format="yyyy" type="year" style="width: 90px;" @change="queryclass($event, major.id)"></intelligent-year-picker>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="major" clearable filterable value-key="id" @change="queryclass(grade,$event.id)" style="width:180px;">
						<el-option v-for="m in majorlist" :value="m" :key="m.id" :label="m.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级">
					<el-select clearable filterable value-key="id" v-model="clazz" style="width:180px;">
						<el-option v-for="c in classlist" :value="c" :key="c.id" :label="c.name"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="学号" style=" ">
					<el-col :span="11">
						<el-input  clearable v-model="student.start" style="width: 132px;"></el-input>
					</el-col>
					<el-col class="line" :span="2" style="text-align: center; padding-left: 6px;">至</el-col>
					<el-col :span="11">
						<el-input  clearable v-model="student.end" style="margin-left: 6px; width: 132px;"></el-input>
					</el-col>
				</el-form-item>
				 <el-form-item style="margin-left:16px;">
					<el-button size="mini" @click="stndentsfift1" type="primary">查询</el-button>
				 </el-form-item>
			</el-form>

			<el-form class="filtrate" :inline="true" size="mini" v-else>
		
				<el-form-item label="年级">
					<intelligent-year-picker v-model="grade"  value-format="yyyy" type="year" style="width: 90px;" >
					</intelligent-year-picker>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="major" clearable filterable value-key="id" style="width:180px;">
						<el-option v-for="m in majorlist" :value="m" :key="m.id" :label="m.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级">
					<el-select clearable filterable value-key="id" v-model="clazz" style="width:180px;">
						<el-option v-for="c in classlist" :value="c" :key="c.id" :label="c.name"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="学号" style=" ">
					<el-col :span="11">
						<el-input  clearable v-model="student.start" style="width: 132px;"></el-input>
					</el-col>
					<el-col class="line" :span="2" style="text-align: center; padding-left: 6px;">至</el-col>
					<el-col :span="11">
						<el-input  clearable v-model="student.end" style="margin-left: 6px; width: 132px;"></el-input>
					</el-col>
				</el-form-item>
				 <el-form-item style="margin-left:16px;">
					<el-button size="mini" @click="stndentsfift" type="primary">查询</el-button>
				 </el-form-item>
			</el-form>




			<div  style="display: flex;flex-direction: row; justify-content: left; align-items: center;">
				<div style="display: inline-block; padding: 10px; border: 1px solid #dfe6ec; border-radius: 5px;height: 400px;width: 50%;overflow: auto;">
					<el-badge :value="stdlist.length" class="item">
						<p style="margin-bottom: 10px;">学生数&nbsp;&nbsp;&nbsp;</p>
					</el-badge>
					<el-table :data="stdlist_two" border tooltip-effect="dark"
						ref="leftTable" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_change"
						height="350">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="学号" property="studentNo"></el-table-column>
						<el-table-column label="姓名" property="name"></el-table-column>
					</el-table>
				</div>

				
				<div class="boxStyle">
					<el-button style="margin: 10px 10px;" @click="torightSelected" :disabled="checkstdlist.length==0">增加<i class="el-icon-d-arrow-right" style="margin-left: 5px;"></i></el-button>
					<el-button style="margin: 10px 10px;" @click="torightDelete" :disabled="checkstdlists.length==0"><i class="el-icon-d-arrow-left" style="margin-left: 5px;"></i>删除</el-button>
				</div>
				
				<div style="border: 1px solid #dfe6ec; padding: 10px; border-radius: 5px; height: 380px;width: 50%; overflow: auto;">
					<el-badge :value="selectedList.length" class="item">
						<p style="margin-bottom: 10px;">已选学生数&nbsp;&nbsp;&nbsp;</p>
					</el-badge>
				
					<el-table :show-header="false" :data="selectedList" border tooltip-effect="dark"
						height="350"
						style="width: 100%;border-radius: 4px;"   @selection-change="checkstd_changes">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="学号" property="studentNo"></el-table-column>
						<el-table-column label="姓名" property="name"></el-table-column>
					</el-table>
					
				</div>
          	</div>
	        <span slot="footer" class="dialog-footer">
	               <el-button @click="colsesubHouer()">取 消</el-button>
	            <el-button type="primary" @click="confirmAdd">确 定</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
	const TYPE='associate_students';
    const REMARK='关联学生';
	export default {
		name:TYPE,
		data(){
			return {
				checked:false,
				administrativeclass:'',
				administrativeclasslist:[],
				student:{
					start:'',
					end:''
				},
				tableHeight: window.innerHeight * 0.7,
				stdlist:[],//学生列表
				stdlist_two:[],
				checkstdlist:[],//选中学生列表
				checkstdlists:[],//选中学生列表
				selectedList:[],//已选学生列表
				refreshCollapse:true,
				selectedStudentList:{},
				activeNames:[],
				stdlist:[],//学生列表
				checkstdlist:[],//选中学生列表
				selectedList:[],//已选学生列表
		        
				formInline:{
					grade:'',
				},
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "上课班管理",path:'/teaching_management/class_management'},
                    {label: "分组管理",path:'/teaching_management/group_management', sendParam:{row:JSON.stringify(this.$route.query.row)}},
                    {label: REMARK},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                tableList:[
                	{label:'授课形式', prop:'teaching_formname', width: 120},
                	{label:'组号', prop:'group_number',width:60},
                	{label:'组名', prop:'group_name',},
		            {label:'学号', prop:'code', width: 120},
		            {label:'姓名', prop:'name', width: 240},
		            {label:'行政班', prop:'clsname',},
		            {label:'所在级', prop:'grade',width:70},
		            {label:'专业名称', prop:'major', width:150}
		        ],
				tableData:[],
				tableData1:[],
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
                groupList:[],
                choiceList:[],
                deleteList:[],
                onSelectChoseVal:[],
                checkAll:false,
                isIndeterminate:true,
                row:"",
                grade:"",
                checkGroup:"",
                inputGrade:"",
                pageNo: 1,
	          	pageSize: 100000,
	          	totalCount:0,
	          	treeProps:{
                	children: 'children',
          			label: 'label'
                },
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
		        
		        
		        selectstushow:false,//选择考生
				majorlist:[],//专业列表
				gradevalue:'',//年级
				major: {},
				classlist:[],
				clazz: {},
				
				classlabel:[],//班级
				selectstu_judge:true,//班级disabled
				sclassList:[],//班级列表
			}
		},
		created(){
			this.row = JSON.parse(this.$route.query.row);
			
			this.grade = "" + this.row.grade;
			this.setRouter();
			this.getTableList();
			this.getGroupList();
			// this.queryMajorList(this.grade);
		},
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};

	    },
	    beforeRouteEnter (to, from, next) {
	    	let that = this;
			if(from.path=="/class_group"){
			}
			next();
		},
		methods:{
			handleCheckAllChange(val){
				this.stdlist = [];
				this.major = ''
				this.clazz = ''
				this.stdlist_two = [];
				if(this.checked){
					this.majorlist = [];
					this.$http.get('_op:/major/combox/').then(data=>{
						this.majorlist=data.data;
				})
				
				}else{
					this.getallstudentsList()
				}
			},
			getstudentsList(classid){
				
				let slef = this
				slef.stdlist = [];
				slef.activeNames=[]
	    		this.$http.get("_op:/students/student/list/"+classid.id+"/"+slef.clazz.id).then(data=>{
						slef.stdlist_two= data.data
						slef.stdlist=data.data;
	    
                }).catch(()=>{
                })
			},
			onSelectChange(val){ //过滤出
				console.log(val)
				var newarr = this.tableData1.filter(item=>
					val==item.clsname
				)
				console.log(newarr)
				this.tableData = newarr
			},
			colsesubHouer(){
				this.dialog.visible=false
				this.selectedList = []
				this.stdlist_two = []
				this.checkstdlist = []
				this.checkstdlists = []
			},
     
			// 关联其他班级学生时点击查询
			stndentsfift1(){
				this.getotherstudentsList()
				.then(()=>{
					let start = this.student.start;
					let end = this.student.end;
					let newArr = JSON.parse(JSON.stringify(this.stdlist));

					// 过滤学号
					if(start!=''&&end!=''){
						newArr = newArr.filter(item => item.studentNo>=start&&item.studentNo<=end);
						
					}else if(start!=''&&end==''){
						newArr = newArr.filter(item => item.studentNo>=start);
					
					}else if(start==''&&end!=''){
						newArr = newArr.filter(item => item.studentNo<=end)
						
					}

					this.stdlist_two = newArr;
				});
			},

	 		// 点查询按钮
			stndentsfift(){
				let start = this.student.start;
				let end = this.student.end;
				let newArr = JSON.parse(JSON.stringify(this.stdlist));

				// 过滤年级
				if(this.grade){
					newArr = newArr.filter(item => item.grade==this.grade)
				}

				// 过滤专业
				if(this.major && this.major.id){
					newArr = newArr.filter(item => item.majorId==this.major.id)
				}

				// 过滤班级
				if(this.clazz && this.clazz.id){
					newArr = newArr.filter(item => item.administrativeClassId==this.clazz.id)
				}

				// 过滤学号
				if(start!=''&&end!=''){
					newArr = newArr.filter(item => item.studentNo>=start&&item.studentNo<=end);
					
				}else if(start!=''&&end==''){
					newArr = newArr.filter(item => item.studentNo>=start);
				
				}else if(start==''&&end!=''){
					newArr = newArr.filter(item => item.studentNo<=end)
					
				}

				this.stdlist_two = newArr;
		
				// if (self.grade) {
				// 	var r = self.stdlist.filter(n => n.grade == this.grade);
				// 	self.stdlist_two = newArr
				// }
				// if (self.major.id) {
				// 	debugger
				// 	var r  =  self.stdlist.filter(n => n.majorId == this.major.id);
				// 	self.stdlist_two = newArr
				// }
				// if (self.clazz.id) {
				// 	newArr = newArr.filter(n => n.administrativeClassId == this.clazz.id);
				// 	self.stdlist_two = newArr
				// }
				// self.stdlist_two = [].concat(newArr);
				
			},
			setRouter(){
				
			},
	        sizeChange(size){
	        	this.pageNo = 1;
	        	this.pageSize = size;
	        	this.getTableList();
			},
			currentChange(current){
				this.pageNo=current;
                this.getTableList();
			},
			goBack(){
                this.$router.go(-1);
            },
			addTask(){
				// this.querystudents()
				this.dialog.status='add';
				this.dialog.visible = true;
				this.getstudentsList()
			},
			onGroupChange(val){
				this.pageNo = 1;
				this.row.group_id = val;
				for(let item of this.groupList){
					if(item.id == val){
						this.row.teaching_form = item.teaching_form;
					}
				}
				this.getTableList();
			},
			confirmAdd(){
				let stuidlist=[];
				if(this.selectedList.length==0){
					this.$message.warning("请选择学生！");
					return ;
				}
				this.selectedList.map(function(item){
					stuidlist.push(item.id)
				})
				this.$http.post("_ed:/coursecls/group/student/add",{
					isAdd:1,
					group_id:this.row.group_id,
					stulist:stuidlist
				}).then(data=>{
					if(data.code==0){
						
						this.dialog.visible = false;
						this.getTableList();
						this.$message({
							type:'success',
							message:'新增成功'
						})
					}else{
						if(data.data.length>0){
							this.$confirm('学生已存在于相同授课形式的分组中，是否确定新增?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
								}).then(() => {
							this.$http.post("_ed:/coursecls/group/student/add",{isAdd:0,
							group_id:this.row.group_id,
							stulist:stuidlist}).then(res=>{
								this.dialog.visible = false;
								this.getTableList();
								this.$message({
									type:'success',
									message:'新增成功'
								})
							})
								}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消'
								});          
								});
						}else{
							this.$message({
								type:"error",
								message:data.msg
							})
						}
					}

				})
			},
			onSelectionChange(val){
				this.onSelectChoseVal = val;
			},
			batchDelet(){
				let idList = [];
				let clsname = [];
				for(let item of this.onSelectChoseVal){
					idList.push(item.id);
					clsname.push(item.clsname);
				}
				if(this.onSelectChoseVal.length>0){
					this.$confirm(`是否确定删除学生信息？`, '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	this.$http.post("_ed:/coursecls/group/student/deletebatch",{
							idlist:idList
						}).then(data=>{

							let type = "success";
							let message = "批量删除成功！";
							if(data.code==0){
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
				}else{
					this.$message.warning("请选择要删除的数据！");
				}
			},
			groupSituation(){

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

		        	this.$http.delete("_ed:/coursecls/group/student/delete/"+row.id)
		        	.then(data=>{
		        		let type = "success";
		        		let message = "删除成功！";
		        		if(data.code==0){
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
			getGroupList(){
				this.$http.get(`_ed:/coursecls/group/cls/${this.row.id}/teachingform/${this.row.teaching_form}`)
				.then(data=>{
					if(data.code==0){
						this.groupList = data.data;
					}else{
						this.$message.error(data.msg);
					}
				})

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
				this.$http.post("_ed:/coursecls/group/student/query",{
					cls_id:this.row.id,
					group_id:this.row.group_id,
					teaching_form:this.row.teaching_form,
					request_page:this.pageNo,
					page_size:this.pageSize
				}).then(data=>{
					if(data.code==0){
						this.totalCount = data.data.total_records;
						this.tableData = data.data.dataList;
						this.tableData1 = data.data.dataList;
						this.administrativeclasslist = this.unique(data.data.dataList)
						for(let item of this.tableData){
							this.grade = "" + item.grade;
						}
					}else{
						this.$message.error(data.msg);
					}
				})
			},

			getotherstudentsList(){
				let clazzid = 0;
				if(this.clazz && this.clazz.id){
					clazzid = this.clazz.id;
				}
				let majorid = 0;
				if(this.major&&this.major.id){
					majorid = this.major.id;
				}
				return this.$http.get("_op:/students/student/list/"+clazzid+'/'+ majorid).then(data=>{
					// this.stdlist_two= data.data
					this.stdlist=data.data;
				})
			},

			/*------------*/
	    	getstudentsList(classid){
				
					this.majorid = undefined;
					this.major = {};
					this.clazz = {};
					this.stdlist = [];
					this.stdlist_two = []
					this.selectedList = []
					let slef = this
				
				if(this.checked){
					let query = {
						majorId:slef.major.id,
						enrollmentYear :self.grade,
						administrativeClassId:classid.id
					}
					
					this.$http.post("_op:/students/list",query).then(data=>{
						slef.stdlist_two= data.data.records
						slef.stdlist=data.data.records;
					})
				}else{
					slef.getallstudentsList()
				}
				
			},
			getallstudentsList(){
				let slef = this
				this.$http.get("_ed:/coursecls/student/cls/"+slef.row.id+'/'+slef.row.teaching_form).then(data=>{
						if(data.code==0){
							if(data.data){
								
								slef.stdlist=data.data.studentsList;
								slef.stdlist_two=data.data.studentsList;
								slef.majorlist = data.data.majorList;
								slef.classlist = data.data.classList;
							}
						}
					})
			},
			checkstd_change(value){//选中学生列表
	    		this.checkstdlist=value;
	    	},
			torightSelected(){//选中学生右移按钮
				let self=this;
				
	    		if(self.checkstdlist.length > 0){ 	   
           
					self.selectedList = self.selectedList.concat(self.checkstdlist);//已选学生的列表
							// self.selectedList = self.checkstdlist;//已选学生的列表
				}
				for(let i=0;i<self.stdlist_two.length;i++){
					for(let k=0;k<self.checkstdlist.length;k++){
						if(self.stdlist_two[i].id==self.checkstdlist[k].id){
						self.stdlist_two.splice(i,1)
						}
					}
				}
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
			
				  for(let i=0;i<self.selectedList.length;i++){
						for(let k=0;k<self.checkstdlists.length;k++){
							if(self.selectedList[i].id==self.checkstdlists[k].id){
							self.selectedList.splice(i,1)
							}
						}
					}
					if(self.checkstdlists.length > 0){ 	
						self.transferdata = self.transferdata.concat(self.checkstdlists);//已选学生的列表
						
					}
	    	},
			delete_stu(id){//删除已选学生
	    		for (var i=0;i<this.selectedList.length;i++) {
	    			if (this.selectedList[i].id==id) {
	    				this.selectedList.splice(i,1)
	    			}
	    		}
			},
			
			queryMajorList(grade) {
				
				let courseClsId = this.row.id; 
				if(this.checked){
					this.majorlist = [];
					this.$http.get("_op:/major/combox/"+grade).then(res=>{
						this.majorlist = res.data
					})
				}else{
					
					if(this.grade!=null&&this.major.id == undefined &&this.clazz.id==undefined){
						//年级
						let r = this.stdlist.filter(n=>n.grade == this.grade )
						this.stdlist_two = r
						
					
					}	
					if(this.grade!=null&&this.major.id !=undefined&&this.clazz.id==undefined){
						//年级+专业
						let r = this.stdlist.filter(n=>n.grade == this.grade&&n.majorId == this.major.id )
						this.stdlist_two = r
					
						
					}	
					if(this.grade!=null&&this.major.id !=undefined&&this.clazz.id!=undefined){
						//年级+班级+专业
						let r = this.stdlist.filter(n=>n.grade == this.grade&&n.majorId == this.major.id&&n.administrativeClassId == this.clazz.id )
						this.stdlist_two = r
					
					}	
					if(this.grade!=null&&this.major.id ==undefined&&this.clazz.id!=undefined){
								//年级+班级
						let r = this.stdlist.filter(n=>n.grade == this.grade&&n.administrativeClassId == this.clazz.id )
						this.stdlist_two = r
						
					}		
					if(this.grade==null&&this.major.id !=undefined&&this.clazz.id!=undefined){
							//专业+班级
						let r = this.stdlist.filter(n=>n.majorId == this.major.id&&n.administrativeClassId == this.clazz.id )
						this.stdlist_two = r
						
					}	

					if(this.grade==null&&this.major.id ==undefined&&this.clazz.id!=undefined){
							//班级
						let r = this.stdlist.filter(n=>n.administrativeClassId == this.clazz.id )
						this.stdlist_two = r
						
					}	
					if(this.grade==null&&this.major.id !=undefined&&this.clazz.id==undefined){
							//班级
						let r = this.stdlist.filter(n=>n.majorId == this.major.id )
						this.stdlist_two = r
				
					}	


					if(this.grade==null&&this.majorid ==''&&this.clazz.id==''){
					
						this.stdlist_two = this.stdlist
					
					}
				}	

	    		
			
			},
			
	    	queryclass(){
				
				var grade = this.grade
				var major = this.major.id
				
				this.clazz = ''
				this.stdlist_two = []
				if (!grade || !major) return;
				this.classlist = [];
				
				if(grade!=null){
					this.$http.get("_op:/students/class/list/"+grade+'/'+major).then(data=>{
	    			if(data.data){

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
	    			}
                }).catch(()=>{
                })

				}
	    	},
		}
	}
</script>
<style scoped>
	.mybtn{
		display: flex;
		height: 30px;
		padding-bottom: 20px
	}
	.cm-fold{
	    padding: 10px;
	    margin-bottom: 10px;
	    border-radius: 5px;
	    background-color: #f7f7f7;
	}
	.cm-fold-bg {
		background-color: #f7f7f7;
	}
	.cm-btn-others {
		padding: 0 20px 10px;
	}
	.class-student p {
		padding-bottom: 20px;
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
	.btnB{
        display: inline-block;
        align-self: center;
        margin: 0 10px;
    }
    .btnB .el-button{
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
    	overflow-y: scroll;
    }
    .class-right {
    	height: 286px;
	    padding-left: 10px;
	    padding-top: 10px;
	}
	.boxStyle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		align-items: center;
	}
	/* .boxStyle{
		height: 700px;
	} */
</style>
