<!--冲突检查-->
<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item label="学期">
                            <el-select 
	                            v-model="formInline.semester_year"
	                            value-key="item.name"
	                            clearable
	                            filterable
	                            @change="onSelectChange" 
	                            placeholder="全部">
	                            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                        </el-select>
                        </el-form-item>
                        <el-form-item label="可能冲突">
                            <el-select v-model="formInline.region" placeholder="全部">
                                <el-option label="显示" value="shanghai"></el-option>
                                <el-option label="不显示" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
                        </el-form-item>
                      
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
					size="mini"
                    header-row-class-name="cm-dark">
                
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"></el-table-column>

                <el-table-column
                        label="冲突明细"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="detail(scope.row)" type="text" size="small">详情</el-button>
                        
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
       
        <!-- 冲突详情 -->
        <el-dialog 
        	title="冲突详情" 
        	:visible.sync="dialog.remark" 
        	:modal-append-to-body="false"
           	width="50%">
	        <el-table :data="row_item">
				<el-table-column :label="confi_title" align="center">
		            <el-table-column  prop="name"  label="进度表" ></el-table-column>
		            <el-table-column  prop="schedule_item_date" label="日期" >
		            	<template slot-scope="scope">
		            		{{scope.row.schedule_item_date | filterDate}}
		            	</template>
		            </el-table-column>
		            
		            <el-table-column  prop="week" label="星期" style="color:#f00"></el-table-column>
		            <el-table-column  prop="section_nodenames" label="课节" >
		            	<template slot-scope="scope">
		            		<span :class="confi_type == 3 ? 'colorread' :''">{{scope.row.section_nodenames}}</span>
		            	</template>
		            </el-table-column>
	
		            <el-table-column  prop="course_name" label="排课课程" ></el-table-column>
		            <el-table-column  prop="cls_name" label="上课班"  ></el-table-column>
		            <el-table-column   label="场地" >
		            	<template slot-scope="scope">
		            		<span :class="confi_type == 1 ? 'colorread' :''">{{scope.row.area_name}}</span>
		            	</template>
		            </el-table-column>
		            <el-table-column  label="上课组"  >
		            	<template slot-scope="scope">
		            		<span :class="confi_type == 2 ? 'colorread' :''">{{scope.row.group_names}}</span>
		            	</template>
		            </el-table-column>
		            <el-table-column   label="老师" prop="teacher_names">
		            	
		            </el-table-column>
		        </el-table-column>
	        </el-table>
	        <span slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="dialog.remark = false">关 闭</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
	import moment from 'moment'
	export default {
		data(){
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "冲突检查"},
                ],
                dialog:{
                	status:'add',
                	remark:false,
                	visible:false
                },
                termList:[],//学期列表
				recallid:"",//撤回的id
				fallYear:"",
                semesterNum:"",
                confi_title:"",//冲突详情标题
				confi_type:"",
                row_item:[],
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
		        myDate:new Date(),
                tableList:[

		            {label:'冲突范围', prop:'rangee',},
		            {label:'冲突类型', prop:'type',},
		            {label:'冲突描述', prop:'desc',},
		            {label:'冲突数量', prop:'items.length',},
		            
		        ],
                tableData:[
                	
		           
                ],
                gridData:[
                	
                ],
                gridList:[
                	{label:'进度表', prop:'name',width:100},
                	{label:'日期', prop:'schedule_item_date',width:120},
                	{label:'星期', prop:'week',},
                	{label:'课节', prop:'section_nodenames',},
                	{label:'排课课程', prop:'course_name',},
                	{label:'上课班', prop:'cls_name',},
                	{label:'地点', prop:'area_name',},
                	{label:'老师', prop:'teacher_names',},
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
	      	this.getTermData();
	      	
	      
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
			detail(row){
				this.dialog.remark = true;
				this.row_item = row.items;
				this.confi_type = row.type;
				this.confi_title = row.desc;
			},
			handleClick(){

			},
			getconflictcheck(){
			
				this.$http.get(`_ed:/schedule/conflictcheck/${this.fallYear}/${this.semesterNum}`).then(data=>{
                	if(data.code == 0){
                		this.tableData = data.data;
	                	this.tableData.map((item) =>{
	                		item.rangee = "全部";
	                	});
                	}else{
                		this.$message.error(data.msg);
                	}
                	
                	
                })
			},
			onSelectChange(_id){
				for(let item of this.termList){
                    if(item.id==_id){
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                    }
                }
				this.getconflictcheck();
             	
            },
			getTermData(){
                this.$http.get('_op:/terms/'+"学期")
                .then(data=>{
                	
                    if(data.code==0){
                    	
                        this.termList = data.data;
                        
                        
                       
                        let year = this.myDate.getFullYear();
                     
                        let month = this.myDate.getMonth()+1;
                       
                        for(let i=0,len=this.termList.length;i<len;i++){

                            let termYear = this.termList[i].name.substring(0,4);
                            let termMonth = this.termList[i].startTime.substring(6,7);
                            if(year==termYear&&(month>=2&&month<=8)){
                                if(this.termList[i].orderNum==2){
                                    this.formYear = this.termList[i].name;
                                    this.semesterNum = this.termList[i].orderNum;
                                    this.fallYear = this.termList[i].year;
                                }
                            }else if((year==termYear)&&(month>8||month<2)){
                              if(this.termList[i].orderNum==1){
                                    this.formYear = this.termList[i].name;
                                    this.semesterNum = this.termList[i].orderNum;
                                    this.fallYear = this.termList[i].year;
                                }
                            }
                        }
                        this.getconflictcheck();
                    }else{
                        this.$message.error(data.msg);
                    }
                   
					

                }).catch(()=>{
                    //this.termList = [];
                })
            }
            

		},
		filters:{
            	filterDate(date){
					return moment(date).format('YYYY-MM-DD')
				}
            }

	}
</script>
<style>
	.dv-wrap{
		display: flex;
	}
	.colorread{
		color:#f00;
	}
</style>