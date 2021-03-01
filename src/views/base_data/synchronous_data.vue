<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail">
						<!-- 数据类别 -->
						<el-form-item label="数据类别" prop="region" size="mini" clearable>
								<el-select v-model="numberData.dataType" placeholder="请选择活动区域"  clearable >
							<el-option v-for="item in dataType" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						</el-form-item> 
                         <!-- 状态 -->
						<el-form-item label="状态" prop="region">
							<!-- {{numberData.dataStatus}} -->
							<el-select v-model="numberData.dataStatus" placeholder="状态"  clearable >
							<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						</el-form-item> 

                        <!-- 授课日期 -->
						<el-form-item label="授课日期">
						    <el-date-picker
						      v-model="numberData.date"
						      type="daterange"
						      value-format="yyyy-MM-dd"
						      align="right"
						      unlink-panelss
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期"
						      :picker-options="pickerOptions">
						    </el-date-picker>
                        </el-form-item>
						<el-form-item >
							<el-button type="primary" @click="searchData()">查询</el-button>
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
                <el-table-column label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="showName" label="数据类别"></el-table-column>
                <el-table-column prop="resultMsg" label="失败原因"></el-table-column>
				 <el-table-column prop="syncStatus" label="状态" align='center'>
          <template slot-scope="scope" :model="aaa" >
            <span v-if="scope.row.syncStatus=='1'">成功</span>
            <span v-if="scope.row.syncStatus=='5'">成功</span>
            <span v-if="scope.row.syncStatus=='0'">失败</span>
            <span v-if="scope.row.syncStatus=='4'">失败</span>
          </template>
        </el-table-column>
	

                <el-table-column prop="retryCount" label="重试次数"></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope"
					v-if="aaa == 1||aaa == 1"
					>
                        <el-button type="text" size="small" @click="setTeacher(scope.row.id)">重试</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </section>
</template>

<script>
    import util from '@/util'
    export default {
        name: "synchronous_data",
        data() {
            return {
				aaa:"",
				// 状态
				dataType: [
					{
					value: "area",
					label: "场地维护"
					},
					{
					value: "administrative_class",
					label: "行政班管理"
					},
					{
					value: "student",
					label: "学生管理"
					},
					{
					value: "semester_course",
					label: "排课学期课程库"
					},
					{
					value: "course_class",
					label: "上课班管理"
					},
					{
					value: "section",
					label: "课节管理"
					},
					{
					value: "building",
					label: "楼宇维护"
					},
					{
					value: "term",
					label: "学期管理"
					},
					{
					value: "teachers",
					label: "教职工管理"
					},
					{
					value: "vm_course_name",
					label: "课程安排(课表)"
					},
				],
				// statusOptions
				// 数据类别
				statusOptions: [
					{
					value: 1,
					label: "成功"
					},
					{
					value: 2,
					label: "失败"
					},
					{
					value: 3,
					label: "全部"
					}
					
				],
				syncstatus:2,
				numberData:{
					dataType:"",
					dataStatus:null,
					date:[]
				},
				courseDate:[],//起止时间
                breadcrumb: [//面包屑
                    {label: "同步管理"},
                    {label: "数据同步"},
                ],
                tableData: [],
				  pickerOptions: {
			        shortcuts: [{
			            text: '最近一周',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
			              picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', [start, end]);
			            }
		        	}]
				},
				 btnPerObj:{//按钮权限
                  query:false
                }
		        
            }
        },
        components:{
        },
        filters: {
        },
	    watch: {
	    },
        mounted(){
			
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
			this.getDataList();
        },
        methods: {
				  //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						 if (item.code=="query_kechengbiaochaxun") {  //查询
						self.btnPerObj.query=true;
						}
                    });
                }).catch(()=>{
                })
            },
        	
		    // 获取列表，默认失败数据  2状态
			getDataList(){
				//   let  syncstatus = {};
				this.numberData.dataStatus=2; //默认失败列表
			
				this.$http.post("_sy:/SyncStatus",{syncstatus:2})
				.then(data=>{
					
					if(data.code==0){
						this.tableData=data.data
					}
				})
			},
			// 记录搜索值
			searchData() {
			if (
				this.numberData.dataStatus ||
				this.numberData.dataType ||
				this.numberData.date
			) {
				this.recordSearch(
				this.numberData.dataStatus,
				this.numberData.dataType,
				this.numberData.date
				);
			}
			},
			recordSearch(dataStatus, dataType,date) {
			
				this.$http.post("_sy:/SyncStatus",{ courseName:dataType, syncstatus:dataStatus, startTime:date[0],endTime:date[1]})
						.then(data=>{
							if(data.code==0){
								this.tableData=data.data
							}
						})
				},
				// 重试
				setTeacher(){

				}
				
        }
    }
</script>

<style scoped lang="less">
.dialog-page{
	text-align: right;
	margin-top: 20px;
}
.top-search{
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	.el-input{
		width: 300px;
	}
}
.manager-box{
	display: flex;
	padding-bottom: 20px;
	.left-content{
		width: 20%;
		min-width: 200px;
        max-height: 700px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		margin-right: 2%;
        overflow: auto;
	}
	.right-content{
		width: 100%;
	}
	.right-content-change{
		width: 78%;
	}
	.bottom-content{
		text-align: right;
		margin-top: 20px;
	}
}
</style>