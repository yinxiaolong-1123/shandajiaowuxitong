<!--表报明细-已提交-->
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
                        <el-form-item label="学期">
	                        <el-input v-model="pramsItem.semester_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所在年级" >
                            <el-select v-model="pramsItem.grade" placeholder="全部" :disabled="true">
                                <el-option label="全部" value="-1" ></el-option>
                                <el-option :label="item.label" :key="item.value" :value="item.value" v-for="item in gradeOption"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排课课程">
                            <el-input v-model="pramsItem.course_name" :disabled="true"></el-input>
                        </el-form-item>
                         <el-form-item label="上课班">
                            <el-input v-model="pramsItem.cls_name" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>

        <div class="cm-table" >
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"></el-table-column>
            </el-table>
            <el-table
                   :data="tableBottom"
                    border
                    style="width: 100%"
                    align="left"
                   >
                <el-table-column prop="name" width="300" ></el-table-column>
                <el-table-column  >
                	<template slot-scope="scope">
						{{scope.row.nane_title1}}&nbsp;&nbsp;{{scope.row.Proportion}}&nbsp;&nbsp;{{scope.row.nane_title2}}&nbsp;&nbsp;{{scope.row.nane_title2_score}}&nbsp;&nbsp;{{scope.row.nane_title3}}&nbsp;&nbsp;{{scope.row.nane_title3_score}}
                    </template>
                </el-table-column>                			
            </el-table>

        </div>
        
                <!-- 冲突提醒 -->
        <el-dialog
        	title="冲突检查提醒"
        	:visible.sync="conflictCheckMark"
        	:modal-append-to-body="false"
           	width="50%" >
           	<el-table :data="gridData" border class="grid-table">
	            <el-table-column v-for="(item,index) in gridList" :key="index" :property="item.prop" :label="item.label" ></el-table-column>
	        </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="courseClose('courseForm',dialog.status==='add'?'post':'put')">关 闭</el-button>
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
				lecture:false,//排课
				classInfor:false,//上课班
				conflictCheckMark:false,//冲突检查
				addExceptionItemsMark:false,//添加例外条目
				subPrams:"",
                tableData:[],
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
                    {label: "进度表填报",path:"/teaching_management/progress_statement"},
                    {label: "表报明细-已提交"},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                 formInline: {},
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
                	
		            {label:'周次', prop:'week',},
		            {label:'日期', prop:'schedule_item_date',},
		            {label:'星期', prop:'week_name',},
		            {label:'节次', prop:'section_nodenames',},
		            {label:'节数', prop:'section_nodenames',},
		            {label:'授课场地', prop:'area_name',},
		            {label:'授课形式', prop:'teaching_formname',},
		            {label:'授课内容', prop:'teaching_content',},
		            {label:'老师', prop:'teacher_names',},
		            {label:'分组', prop:'group_names',},
		            {label:'学生数', prop:'stu_num',},
		            {label:'状态', prop:'status',},
		            		            //{label:'模块负责人', prop:'date',width:100}
		        ],
                
                tableBottom:[
                	{name:"实际课时统计",nane_title1:" 实际理论/实践:",Proportion:"6/10",nane_title2:"理论",nane_title2_score:6,"nane_title3":"实验",nane_title3_score:"10"},
                	{name:"指导课时信息",nane_title1:" 指导理论/实践:",Proportion:"6/10",nane_title2:"例外学时",nane_title2_score:6,"nane_title3":"实验",nane_title3_score:"10"}

                ],
                gridData:[
                	{date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
		            {date: '2016-05-03', name: '基础医学', creator: '张三丰', code: 2003},
                ],
                gridList:[
                	{label:'冲入范围', prop:'name',width:100},
                	{label:'冲突类型', prop:'date',width:120},
                	{label:'冲突描述', prop:'date',width:120},
                	{label:'冲突数量', prop:'date',width:120},
                	{label:'冲突明细', prop:'date',width:120},

                ],
                gradeOption:[//所在级
                    {label:2014,value:2014},
                    {label:2015,value:2015},
                    {label:2016,value:2016},
                    {label:2017,value:2017},
                    {label:2018,value:2018},
                    {label:2019,value:2019},
                    {label:2020,value:2020},
                    {label:2021,value:2021},
                    {label:2022,value:2022},
                    {label:2023,value:2023}
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
        created(){
            this.subPrams = this.$route.query.id;
            this.getTableList();
            this.pramsItem = this.$route.query;
            
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
			lectureDetails(){//排课弹窗
				this.lecture=true;//排课
			},
			classInformation(){//上课班弹窗
				this.classInfor=true;//上课班
			},
			planAdjustment(row){
				this.dialog.status='edit';
				this.dialog.visible = true;
			},
			teachingRemark(){
				this.dialog.remark = true;
			},
			conflictCheck(){//冲突检查
				this.conflictCheckMark = true;
			},
			addExceptionItems(){//添加例外条目
				this.addExceptionItemsMark = true;
			},
			getTableList(){
				this.$http.get("_ed:/schedule/detail/"+this.subPrams
				
				).then(data=>{
					if(data.code == 0){
						this.tableData = data.data.schedule_items;
						this.tableBottom[0].Proportion = data.data.real_theory_hours+"/"+data.data.real_novitiate_hours;
						this.tableBottom[0].nane_title2_score = data.data.real_theory_hours;
						this.tableBottom[0].nane_title3_score = data.data.real_novitiate_hours;
						this.tableBottom[1].Proportion = data.data.exception_theory_hours+"/"+data.data.exception_novitiate_hours;
						this.tableBottom[1].nane_title2_score = data.data.exception_theory_hours;
						this.tableBottom[1].nane_title3_score = data.data.exception_novitiate_hours;
					}
                })
			}
		}
	}
</script>
<style scoped>
	.dv-wrap{
		display: flex;
	}
	.cm-fold .fold .detail{
		height:100px;
	}
	.cm-fold .fold .el-input__inner{
		width:100px;
	}
	.cm-fold .fold .el-input__inner{
		width:100px;
	}
	.grid-table{
		margin-top:10px;
	}
	.el-dropdown-link {
    	font-size:12px;
  	}
  	.table-footer{
  		border:1px solid #ddd;
  		overflow: hidden;

  	}
  	.table-footer .item{
  		overflow: hidden;
  	}
  	.table-footer .item div{
  		line-height:30px;
  		border-left:1px solid #ddd;
  	}

  	.table-footer .item div{
  		float:left;
  	}
</style>
