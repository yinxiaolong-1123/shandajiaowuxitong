<!--我的课表-->
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
                        <el-form-item label="排课课程">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授课老师">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授课场地">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="">
                            <div class="deploy-site">
                            	<el-button type="text">展开 更多条件</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="课程名称">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="上课班">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授课日期">
                            <el-date-picker
                            		
						      v-model="startDateTeaching"
						      type="datetime"
						      placeholder="开始日期">
						    </el-date-picker>
						   
                        </el-form-item>
                         <el-form-item label="">
                            
						    <el-date-picker
						    	
						      v-model="endDateTeaching"
						      type="datetime"
						      placeholder="结束日期">
						    </el-date-picker>
                        </el-form-item>
                        <el-form-item label="可节">
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
        
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column type="index"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"></el-table-column>

                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="courseDetail(scope.row)" type="text" size="small">详情</el-button>

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
        <el-dialog
          :title="dialog.status==='add'?'新增课程(计划外）':'欠课标识/调整课程学期'"
          :visible.sync="dialog.visible"
           :modal-append-to-body="false"
           custom-class="cm-dialog-small">
          	<div class="dv-wrap">
                <el-form ref="courseForm" :model="courseForm" size="medium" label-width="100px">
                	<el-form-item label="学期">
					    <el-select v-model="courseForm.name" placeholder="请选择活动区域">
					      <el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="所在级">
					    <el-select v-model="courseForm.name" placeholder="请选择活动区域">
					      <el-option v-for="item in dateOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="专业">
					    <el-select v-model="courseForm.name" placeholder="请选择活动区域">
					      <el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="课程">
					    <el-select v-model="courseForm.name" placeholder="请选择活动区域">
					      <el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item v-if="dialog.status==='edit'" label="任务状态">
					    <el-select v-model="courseForm.name" placeholder="请选择活动区域">
					      <el-option label="区域一" value="shanghai"></el-option>
					      <el-option label="区域二" value="beijing"></el-option>
					    </el-select>
					</el-form-item>
                    <el-form-item v-if="dialog.status==='add'" label="学时">
                      <el-input v-model="courseForm.name" placeholder="格式：理论学时/实践学时"></el-input>
                    </el-form-item>
                </el-form>
          	</div>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialog.visible=false">取 消</el-button>
	            <el-button type="primary" @click="courseClose('courseForm',dialog.status==='add'?'post':'put')">确 定</el-button>
	        </span>
        </el-dialog>
        <!-- 教学备注 -->
        <el-dialog 
        	title="教学备注" 
        	:visible.sync="dialog.remark" 
        	:modal-append-to-body="false"
           	width="50%">
	        <el-table :data="gridData">
	          	<el-table-column type="index" label="序号" fixed width="80"></el-table-column>
	            <el-table-column v-for="(item,index) in gridList":key="index" :property="item.prop" :label="item.label" :width="item.width">
	            	
	            </el-table-column>
	        </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="courseClose('courseForm',dialog.status==='add'?'post':'put')">关 闭</el-button>
	        </span>
        </el-dialog>
        <!-- 课程详情 -->
        <el-dialog 
        	title="课程详情" 
        	:visible.sync="detailMark" 
        	:modal-append-to-body="false"
           	width="50%">
	        <div class="item-wraper">
	        	<h3>课程</h3>
	        	<p>排课课程：内学科</p>
	        </div>
	        <div class="item-wraper">
	        	<h3>课程内容</h3>
	        	<p>授课形式：理论课</p>
	        	<p>授课内容：XXXXXXXX</p>
	        </div>
	        <div class="item-wraper">
	        	<h3>授课资源</h3>
	        	<p>授课老师： 张老师</p>
	        	<p>授课地点：1号楼303</p>
	        	<p>课程时间：2017/07/01,节次：5.6,7,8</p>
	        </div>
	        



	        <div class="item-wraper">
	        	<h3>上课班信息</h3>
	        	<p>上课班：XXXXXX</p>
	        	<p>教学模式：全英教学</p>
	        	<p>分组号：理论1组（XX人）</p>
	        </div>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="default" @click="courseClose(detailMark=false)">关 闭</el-button>
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
				detailMark:false,//课程详情
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
                    {label: "课程表查询"},
                    {label: "我的课表"},
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
                	{label:'序号', prop:'name',},
		            //{label:'排课课程', prop:'name',},
		            //{label:'授课场地', prop:'creator',},
		            {label:'课程名称', prop:'date',},
		            {label:'授课日期', prop:'date',},
		            {label:'授课课节', prop:'date',},
		            {label:'授课老师', prop:'date',},
		            {label:'授课场地', prop:'creator',},
//		            {label:'状态', prop:'date',},
//		            {label:'操作', prop:'date',},
		            //{label:'模块负责人', prop:'date',width:100}
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
			courseDetail(){//课程详情
				this.detailMark = true;
			}

		}
	}
</script>
<style scoped="scoped">
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
</style>