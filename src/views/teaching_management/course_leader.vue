<!--调课管理课程负责人 -->
<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="medium" :model="formInline" label-width="68px">
                <div class="fold">
                    
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <!--<el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>-->
                        <el-form-item label="学期">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="授课日期">
                            <el-date-picker
                            		style="width:300px;"
						      v-model="startDateTeaching"
						      type="datetime"
						      placeholder="开始日期">
						    </el-date-picker>
						   
                        </el-form-item>
                        
                        
                         <el-form-item label="">
                            
						    <el-date-picker
						    	style="width:300px;"
						      v-model="endDateTeaching"
						      type="datetime"
						      placeholder="结束日期">
						    </el-date-picker>
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox v-model="checked">跟我调课的数据需要同意</el-checkbox>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="deploy-site">
                            	<el-button type="text">展开 更多条件</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="课程名称">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="调课类型">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        
                         
                        
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <!--<div class="cm-btn-con">
            <el-button size="mini" type="primary" @click="batchAdjustment">申请调课</el-button>
        </div>-->
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" prop="序号"></el-table-column>
                
                <el-table-column v-for="(item,index) in tableList" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="detail(scope.row)" type="text" size="small">查看详情</el-button>
                         <el-dropdown trigger="click" size="small" style="margin-left:10px;">
					      <span class="el-dropdown-link">
					       	 撤回
					      </span>
					      <el-dropdown-menu slot="dropdown">
					        <el-dropdown-item> 自己发起，且在处理中的显示，撤回</el-dropdown-item>
					        <el-dropdown-item>撤回！通过调整状态为调课失败</el-dropdown-item>
					      </el-dropdown-menu>
					    </el-dropdown>
                        <el-button @click="detail(scope.row)" type="text" size="small"></el-button>
                        <el-button @click="handleFn(scope.row)" type="text" size="small">处理</el-button>
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
         <!-- 批量调整时间 -->
        
        
        
        <!-- 课程详情 -->
        <el-dialog 
        	title="查看详情" 
        	:visible.sync="detailMark" 
        	:modal-append-to-body="false"

        
           	width="50%">
	        <el-table
        	:span-method="arraySpanMethod"
	        		:show-header="false"
                    ref="multipleTable"
                    :data="courseTableDetail"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column  prop="nanetitle" lable=""></el-table-column>
                <el-table-column prop="value1" label="">
                	<template slot-scope="scope" >
                		<el-button type="text" v-if="scope.$index==13" @click="viewRecord">{{scope.row.value1}}</el-button>
                		<span v-else>{{scope.row.value1}}</span>
                	</template>
                </el-table-column>
                <el-table-column  prop="value2"  label="">
                	
                </el-table-column>

                
            </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="detailMark=false">关  闭</el-button>
	            <el-button  @click="isAgree" type="primary" v-if="handleMark">不同意</el-button>
	            <el-button  @click="isAgree" type="primary" v-if="handleMark">同意</el-button>
	        </span>
        </el-dialog>
        
        <!--查看审查记录-->
        <el-dialog 
        	title="审查记录" 
        	:visible.sync="viewRecordMark" 
        	:modal-append-to-body="false"

        
           	width="50%">
	        <el-table
        	
	        		:show-header="false"
                    ref="multipleTable"
                    :data="gridData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
               
                <el-table-column type="index" label=""  ></el-table-column>
                <el-table-column :prop="item.prop" :label="item.label" :key="index" v-for="(item,index) in gridList"></el-table-column>

            </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="viewRecordMark=false">关  闭</el-button>
	        </span>
        </el-dialog>
        
        
	</section>
</template>

<script>
	import util from '@/util'
	export default {
		data(){
			return {
				startDateTeaching:"",//授课日期
				endDateTeaching:"",
				courseMark:false,//排课课程
				lectureMark:false,//调课
				cannelMark:false,//取消
				detailMark:false,//详情
				classInfor:false,//上课班
				checked:false,
				viewRecordMark:false,//查看审查记录
				batchAdjustmentMark:false,//批量调整时间
				handleMark:false,//详情dialog判断是处理还是查看
				pickerOptions1: {
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }, {
		            text: '昨天',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24);
		              picker.$emit('pick', date);
		            }
		          }, {
		            text: '一周前',
		            onClick(picker) {
		              const date = new Date();
		              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', date);
		            }
		          }]
		        },
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "调课管理"},
                    
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                formInline: {
                    user: '',
                    region: ''
                },
                courseForm:{
		            courseCode:'',
		            name:'',
		            remark:'',
		            enName:'',
		            oldCode:'',
		            nature:'',
		            category:'',
		            id:'',
		            status:0
		        },
                tableList:[
                	//{label:'序号', prop:'name',},
		            {label:'排课课程', prop:'name',},
		            {label:'授课场地', prop:'creator',},
		            {label:'授课时间', prop:'date',},
		            {label:'课节', prop:'date',},
		            {label:'授课老师', prop:'date',},
		            {label:'状态', prop:'date',},
		            {label:'操作', prop:'date',},
		            //{label:'模块负责人', prop:'date',width:100}
		        ],
		        courseTableDetail:[
		        	{nanetitle:"排课课程",value1:"英语",value2:""},
		        	{nanetitle:"上课班",value1:" 2017级大学英语全英上课班",value2:""},
		        	{nanetitle:"课程理由",value1:"因教学需要",value2:""},
		        	{nanetitle:"调课类型",value1:"单独调课；更改时间更改地点",value2:""},
		        	{nanetitle:"辅助说明",value1:"  请调整到周一早上1-2节(5/28)，707N",value2:""},
		        	{nanetitle:"状态",value1:"调课成功",value2:""},
		        	{nanetitle:"sdfs",value1:"调课前",value2:"调课后"},
		        	{nanetitle:"授课课程",value1:"英语",value2:"英语"},
		        	{nanetitle:"授课内容",value1:"Lecture 6",value2:"Lecture 6"},
		        	{nanetitle:"授课老师",value1:"张三",value2:"张三"},
		        	{nanetitle:"授课日期",value1:"2018/05/30",value2:"2018/05/28"},
		        	{nanetitle:"授课课节",value1:"第13周 星期3 第3,4节",value2:"1,2"},
		        	{nanetitle:"授课地点",value1:"703N",value2:"707"},
		        	{nanetitle:"审核记录",value1:"查看审核记录",value2:""}
		        	
		        ],
                tableData:[
                	{date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
                ],
                gridData:[
                	{date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
                ],
                gridList:[
                	{label:'创建人', prop:'name',width:100},
                	{label:'创建日期', prop:'date',width:120},
                	{label:'备注内容', prop:'code',},
                ],
                gridList2:[
                	{label:'授课形式', prop:'name',width:100},
                	{label:'分组', prop:'date',width:120},
                	{label:'学生信息', prop:'date',width:220},
                	
                ],
                dateOption:[
                	{label:"全部",value:"全部"},
                	{label:"2014",value:"2014"},
                	{label:"2015",value:"2015"},
                	{label:"2016",value:"2016"},
                	{label:"2017",value:"2017"},
                	{label:"2018",value:"2018"},
                	{label:"2020",value:"2020"},
                	{label:"2021",value:"2021"},
                	{label:"2022",value:"2022"},
                	{label:"2023",value:"2023"}
                ],
                pageNo: 1,
	          	pageSize: 10,
	          	totalCount:0,
	          	fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
			}
		},
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
	    },
		methods:{
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
			onSubmit(){

			},
			addTask(){
				this.dialog.status='add';
				this.dialog.visible = true;
			},
			sizeChange(){

			},
			currentChange(){

			},
			planAdjustment(row){
				this.dialog.status='edit';
				this.dialog.visible = true;
			},
			teachingRemark(){
				this.dialog.remark = true;
			},
			handleClick(){

			},
			batchAdjustment(){//批量调整时间
				this.batchAdjustmentMark = true;
			},
			viewRecord(){
				this.viewRecordMark = true;
			},
			batchAdjustmentFn(){//确定批量调整
				this.batchAdjustmentMark = false;
			},
			lectureDetails(){//排课弹窗
				this.courseMark=true;//排课
			},
			classInformation(){//上课班弹窗
				this.classInfor=true;//上课班
			},
			lecture(){//调课
				this.lectureMark = true;
			},
			cancelLe(){//取消
				this.cannelMark = true;
			}, 
			detail(){//详情
				this.detailMark = true;
				this.handleMark = false;
			},
			decideCancel(){//取消的确认
				this.cannelMark = false;
			},
			handleFn(){//处理按钮
				this.detailMark = true;
				this.handleMark = true;
			},
			isAgree(){//是否同意
				this.detailMark = false;
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {//查看详情的合并单元格
		      
		        if (row.value2 == "") {
		        	
		          	if (columnIndex === 1) {
		            	return [1, 2];
		          	}else if(columnIndex === 2){
		          		return [0,0]
		          	}
		          	
		          	
		        }
		    },
		   

		}
	}
</script>
<style scoped>
	.dv-wrap{
		display: flex;
	}
	.cm-fold .fold .detail{
		height:170px;
	}
	.cm-fold .fold .el-input__inner{
		width:100px;
	}
	.cm-fold .fold .el-input__inner{
		width:100px;
	}
	.item-wraper{
		margin-bottom:20px;
	}
	.item-wraper p{
		line-height:30px;
	}
	 .fold .el-input__inner{
		width:100px;
	}
	.el-dropdown-link {
	    cursor: pointer;
	    color: #409EFF;
	    font-size:12px;
	}
</style>