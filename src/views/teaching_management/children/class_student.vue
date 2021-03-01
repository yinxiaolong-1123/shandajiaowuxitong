<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path, query: item.sendParam }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>	
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
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
	                        <el-select v-model="checkGroup" 
	                        filterable 
	                        clearable 
	                        @change="onGroupChange"
	                        placeholder="请选择">
							    <el-option label="全部" value=""></el-option>
							    <el-option v-for="list in groupList" :key="list.id" :label="list.name" :value="list.id"></el-option>
							</el-select>
						</el-form-item>
                    </div>
		            <div class="btn">
			            <el-button size="mini" type="primary" @click="addTask">新增</el-button>
			            <el-button size="mini" @click="batchDelet">批量删除</el-button>
			            <el-button size="mini" @click="goBack">返回</el-button>
		            </div>
                </div>
            </el-form>
        </div>
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark"
                    @selection-change="onSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"></el-table-column>

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
        <!-- 新增 -->
        <el-dialog
		class="pm-margin "
          title="上课组关联学生"
          width="65%"
          :visible.sync="dialog.visible"
          :close-on-click-modal="false"
          :modal-append-to-body="false">
           	<div class="class-student">
				<p>
	           	当前维护数据信息1：学期：{{row.semester_name}}&emsp;
	           	上课班：{{row.name}}&emsp;
	           	授课形式：{{row.teaching_formname}}&emsp;
	           	组号：{{row.group_number}}
	           	</p>
	           	<!-- <span>路径：{{grade}}级</span> -->
           	</div>

			<el-form class="filtrate" :inline="true" size="mini">
			
				<el-form-item label="年级">
					<intelligent-year-picker v-model="grade" value-format="yyyy" type="year" style="width: 90px;" @change="queryclass($event, major.id)"></intelligent-year-picker>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="major" clearable filterable value-key="id" @change="queryclass(grade,$event.id)">
						<el-option v-for="m in majorlist" :value="m" :key="m.id" :label="m.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级">
					<el-select clearable filterable value-key="id" v-model="clazz">
						<el-option v-for="c in classlist" :value="c" :key="c.id" :label="c.name"></el-option>
					</el-select>
				</el-form-item>

				 <el-form-item label="学号" style=" ">
					<el-col :span="11">
						<el-input  clearable v-model="student.start" style="width: 132px;"></el-input>
					</el-col>
					<el-col class="line" :span="2" style="text-align: center;padding-left: 6px;">至</el-col>
					<el-col :span="11">
						<el-input  clearable v-model="student.end" style="margin-left: 6px; width: 132px;"></el-input>
					</el-col>
				</el-form-item>
				 <el-form-item style="margin-left:16px;">
					<el-button size="mini" @click="stndentsfift(student.start,student.end)" type="primary">查询</el-button>
				 </el-form-item>
			</el-form>
			<div  style="display: flex;flex-direction: row; justify-content: left; align-items: center;">
				<div style="display: inline-block; padding: 10px; border: 1px solid #dfe6ec; border-radius: 5px;height: 400px;width: 50%;overflow: auto;">
					<el-table :data="stdlist_two" border tooltip-effect="dark" ref="leftTable" style="width: 100%;border-radius: 4px;" @selection-change="checkstd_change">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column label="学号" property="studentNo"  width="220"></el-table-column>
						<el-table-column label="姓名" property="name"></el-table-column>
					</el-table>
				</div>

				
				<div  class="boxStyle">
					<el-button style="margin: 10px 10px;" @click="torightSelected" :disabled="checkstdlist.length==0">增加<i class="el-icon-d-arrow-right" style="margin-left: 5px;"></i></el-button>
					<el-button style="margin: 10px 10px;" @click="torightDelete" :disabled="checkstdlists.length==0"><i class="el-icon-d-arrow-left" style="margin-left: 5px;"></i>删除</el-button>
				</div>
				
				<div style="border: 1px solid #dfe6ec; padding: 10px; border-radius: 5px; height: 380px;width: 50%; overflow: auto;">
					<p style="margin-bottom: 10px;">已选学生</p>
				
							<el-table :show-header="false" :data="selectedList" border tooltip-effect="dark" style="width: 100%;border-radius: 4px;"   @selection-change="checkstd_changes">
								<el-table-column type="selection" width="55"></el-table-column>
								<el-table-column label="学号" property="studentNo"></el-table-column>
								<el-table-column label="姓名" property="name"></el-table-column>
							</el-table>
					
				</div>
       
          	</div>
	        <span slot="footer" class="dialog-footer">
				<!-- dialog.visible=false  -->
	            <el-button @click="colsesubHouer()">取 消</el-button>
	            <el-button type="primary" @click="confirmAdd">确 定</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
	const TYPE='class_student';
    const REMARK='关联学生';
	export default {
		name:TYPE,
		inject: ['reload'], // 新增引入方法
		data(){
			return {
				stdlist_two:[],
				student:{
					start:'',
					end:''
				},
				formInline:{
					grade:'',
				},
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "上课组关联学生",path:'/teaching_management/class_group'},
                    {label: REMARK},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                tableList:[
                	{label:'授课形式', prop:'teaching_formname',},
                	{label:'组号', prop:'group_number',},
                	{label:'组名', prop:'group_name',},
		            {label:'学号', prop:'code',},
		            {label:'姓名', prop:'name',},
		            {label:'行政班', prop:'clsname',},
		            {label:'所在级', prop:'grade',},
		            {label:'专业名称', prop:'major',}
		        ],
                tableData:[],
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
				classlabel:[],//班级
				selectstu_judge:true,//班级disabled
				sclassList:[],//班级列表
				
				stdlist:[],//学生列表
				stdlist_two:[],
				checkstdlist:[],//选中学生列表
				checkstdlists:[],//选中学生列表
				selectedList:[],//已选学生列表
				refreshCollapse:true,
				selectedStudentList:{},
					activeNames:[],

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
	          	pageSize: 10,
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
				major:{},
				classlist:[],
				clazz:{},
				
				classlabel:[],//班级
				selectstu_judge:true,//班级disabled
				sclassList:[],//班级列表
				
				stdlist:[],//学生列表
				checkstdlist:[],//选中学生列表
				selectedList:[],//已选学生列表
		        
			}
		},
		created(){
			this.row = JSON.parse(this.$route.query.row);
			
		
			this.getTableList();
			this.getGroupList();
			this.queryMajorList(this.grade);
		
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
			 colsesubHouer(){
				this.dialog.visible=false
			
			
		
				this.selectedList = []
				this.stdlist_two = []
				this.checkstdlist = []
				this.checkstdlists = []
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
					// self.stdlist_two = self.stdlist
					newArr = self.stdlist;
				}
				
				if (this.grade) {
					newArr = newArr.filter(n => n.grade == this.grade);
				}
				if (this.major.id) {
					newArr == newArr.filter(n => n.majorId == this.major.id);
				}
				if (this.clazz.id) {
					newArr = newArr.filter(n => n.administrativeClassId == this.clazz.id);
				}
				self.stdlist_two = [].concat(newArr);
				
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
				this.querystudents()
				this.dialog.status='add';
				this.dialog.visible = true;
				//delete_stu()
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
				this.selectedList.map(function(item){
					stuidlist.push(item.id);
				});
				this.$http.post("_ed:/coursecls/group/student/add",{
					group_id:this.row.id,
					stulist:stuidlist
				}).then(data=>{
					let type = "success";
					let message = "新增成功！数据再加载...";
                  
					if(data.code==0){
						this.dialog.visible = false;
						this.getTableList();
						this.colsesubHouer()
					}else{
						type = "error";
						message = data.msg;
					}
					this.$message({
						type:type,
						message:message
					})
				})
				if(this.selectedList.length>0){
					//this.$router.go(0);  //新增重新刷新页面
					this.reload() // 调用方法
				}
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
				this.$confirm(`此操作将删除学生信息, 是否继续?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {

		        	this.$http.delete("_ed:/coursecls/group/student/delete/"+row.id)
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
			getTableList(){
				this.$http.post("_ed:/coursecls/group/student/query",{
					cls_id:this.row.cls_id,
					group_id:this.row.id,
					teaching_form:this.row.teaching_form,
					request_page:this.pageNo,
					page_size:this.pageSize
				}).then(data=>{
					if(data.code==0){
						this.totalCount = data.data.total_records;
						this.tableData = data.data.dataList;
						for(let item of this.tableData){
							this.grade = item.grade;
						}
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			/*------------*/
	    	
	    	querystudents(){
	    		this.$http.get("_ed:/coursecls/student/cls/"+this.row.cls_id+'/'+this.row.teaching_form).then(data=>{
	    			
					this.stdlist=data.data;
					this.stdlist_two = data.data
                }).catch(()=>{
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
	    				this.selectedList.splice(i,1);
	    			}
	    		}
			},

			queryMajorList(grade) {
				this.majorlist = [];
				let courseClsId = this.row.cls_id;
	    		this.$http.get("_ed:/semestercourse/major/list/" + courseClsId).then(data=>{
        			this.majorlist=data.data;
                }).catch(()=>{
                })
			},
			
	    	queryclass(grade,major){
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
<style lang="less" scoped>
	.filtrate{
		margin-bottom: 10px;
		display: flex;
	
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
	.pm-margin /deep/.el-dialog__body{
        padding: 10px 40px;
	}
	.boxStyle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		align-items: center;
	}
</style>