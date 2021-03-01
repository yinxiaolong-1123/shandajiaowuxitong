<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="medium" :model="formSearch" label-width="68px">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期">
                            <el-select 
                                v-model="formYear"
                                clearable
                                filterable
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="medium" @click="onSubmit">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="medium" type="primary" @click="addTask">新增</el-button>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column type="index" fixed label="序号" width="80px"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop=='status'">
                            {{ scope.row.status==1?"启用":"禁用"}}
                        </template>
                        <template v-else-if="item.prop=='create_time'">
                            {{ scope.row.create_time | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="onEnable(scope.row)" type="text" size="small">启用</el-button>
                        <el-button @click="onDisable(scope.row)" type="text" size="small">禁用</el-button>
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
        <!-- 新增配置 -->
        <el-dialog
          title="新增配置"
          :visible.sync="dialog.visible"
           :modal-append-to-body="false"
           custom-class="cm-dialog-small">
          	<div class="dv-wrap">
                <el-form ref="addForm" :model="addForm" size="medium" label-width="100px">
                	<el-form-item label="学期">
					    <el-select 
                            v-model="formYear"
                            clearable
                            filterable
                            placeholder="全部">
                            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
					</el-form-item>
					<el-form-item label="状态">
					    <el-radio v-model="radio" label="1">启用</el-radio>
  						<el-radio v-model="radio" label="0">禁用</el-radio>
					</el-form-item>
                </el-form>
          	</div>
	        <span slot="footer" class="dialog-footer">
	            <el-button @click="dialog.visible=false">取 消</el-button>
	            <el-button type="primary" @click="addConfirm">确 定</el-button>
	        </span>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/util'
    const TYPE='schedule_withdrawal';
    const REMARK='进度表自行撤回配置';
	export default {
        name:TYPE,
		data(){
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: REMARK},
                ],
                dialog:{
                	visible:false
                },
                formSearch:{

                },
                addForm: {
                    
                },
                tableList:[
		            {label:'学期', prop:'semester_name',width:180},
		            {label:'课程负责人自行撤回进度表开关', prop:'status',width:300},
		            {label:'创建人', prop:'create_username',},
		            {label:'创建日期', prop:'create_time',}
		        ],
                tableData:[],
                options1:[],
                formYear:"",
                radio:"0",
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
            this.getTermData();
            this.getTableList();
        },
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
	    },
	    filters:{
            getTime(time){
                return util.getTime(time);
            }
        },
		methods:{
			collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
	        sizeChange(size){
	        	this.pageNo = 1;
	        	this.pageSize = size;
	        	this.getTableList();
			},
			currentChange(current){
				this.pageNo = current;
				this.getTableList();
			},
			onSubmit(){
				this.getTableList();
			},
			addTask(){
				this.dialog.status='add';
				this.dialog.visible = true;
			},
			addConfirm(){
				this.$http.post("_ed:/scheduleconf/add",{
					status:this.radio,
					create_user:12,
					create_username:"mm",
					semester_year:this.fallYear,
					semester_year_number:this.semesterNum
				}).then(data=>{
					let type = "success";
					let message = "新增成功！"
					if(data.code==0){
						this.dialog.visible = false;
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
			onEnable(row){
				this.$confirm(`你确定开启“${row.semester_name}”的课程负责人自行撤回进度表功能？, 是否继续?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.$http.post("_ed:/scheduleconf/active/"+row.id)
		        	.then(data=>{
		        		let type = "success";
		        		let message = "启用成功！";
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
		            message: '已取消启用'
		          });          
		        });
			},
            onDisable(row){
                this.$confirm(`你确定关闭“${row.semester_name}”的课程负责人自行撤回进度表功能？, 是否继续?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.$http.post("_ed:/scheduleconf/disable/"+row.id)
		        	.then(data=>{
		        		let type = "success";
		        		let message = "禁用成功！";
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
		            message: '已取消禁用'
		          });          
		        });
            },
            getTableList(){
                this.$http.post("_ed:/scheduleconf/query",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum,
                    request_page:this.pageNo,
                    page_size:this.pageSize
                }).then(data=>{
                	if(data.code==0){
                		this.pageNo = data.data.total_pages;
                		this.totalCount = data.data.total_records;
                		this.tableData = data.data.dataList;
                	}else{
                		this.$message.error(data.msg);
                	}
                })
            },
			getTermData(){
                this.$http.get('_op:/terms/'+"学期")
                .then(data=>{
                    if(data.code==0){
                        this.options1 = data.data;
                        
                        let year = this.myDate.getFullYear();
                        let month = this.myDate.getMonth()+1;
                        for(let i=0,len=this.options1.length;i<len;i++){

                            let termYear = this.options1[i].name.substring(0,4);
                            let termMonth = this.options1[i].startTime.substring(6,7);
                            if(year==termYear&&(month>=2&&month<=8)){
                                if(this.options1[i].orderNum==2){
                                    this.formYear = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear = this.options1[i].year;
                                }
                            }else if((year==termYear)&&(month>8||month<2)){
                              if(this.options1[i].orderNum==1){
                                    this.formYear = this.options1[i].name;
                                    this.semesterNum = this.options1[i].orderNum;
                                    this.fallYear = this.options1[i].year;
                                }
                            }
                        }

                    }else{
                        this.$message.error(data.msg);
                    }


                }).catch(()=>{
                    this.options1 = [];
                })
            }

		}
	}
</script>
<style scoped>

</style>