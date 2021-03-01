<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-button type="primary" size="mini" @click="addBtn" style="margin: 10px 0;">新建节假日</el-button>
        </div>
        
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                header-row-class-name="cm-dark"
                v-loading="tableLoading"
                element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="index" label="序号"></el-table-column>

                <el-table-column prop="year" label="年度"> </el-table-column>
                <el-table-column prop="holidays" label="节假日"> </el-table-column>
                <el-table-column prop="exceptions" label="例外工作日"> </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editBtn(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteBtn(scope.row)" style="color: red;">删除</el-button>
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
                :title="dialog.statu==='add'?'新增节假日':'编辑节假日'"
                :visible.sync="dialog.visible"
                width="900px"
                append-to-body
                :close-on-click-modal="false"
                @closed="cancelDialog">
                
                <div>
                	<p class="linecell">
						<label><em class="required-symbol">*</em> 年度：</label>
						<intelligent-year-picker
					      	v-model="hmYear"
					      	type="year"
					      	value-format="yyyy"
					      	placeholder="选择年">
					    </intelligent-year-picker>
					</p>
                	<p class="linecell">
						<label><em class="required-symbol">*</em> 选择节假日：</label>
						<el-date-picker
					      	type="dates"
					      	v-model="dates"
					      	format="MM-dd"
					      	value-format="MM-dd"
                            @change="onDataChange"
					      	placeholder="选择一个或多个日期">
					    </el-date-picker>
					</p>
					
                	<p class="linecell">
						<el-button type="primary" @click="addExcDate">增加例外工作日</el-button>
					</p>
                	<p class="linecell" v-for="(item,index) in exceptionDates">
						<label>例外工作日:</label>
						<el-date-picker type="date" v-model="item.etDate" value-format="yyyy-MM-dd" style="width: 200px;" placeholder="选择一个日期">  </el-date-picker>
						<label style="margin-left: 100px;">替换日期:</label>
						<el-date-picker type="date" v-model="item.reDate" value-format="yyyy-MM-dd" style="width: 200px;" placeholder="选择一个日期">  </el-date-picker>
						<el-button style="margin-left: 20px;" @click="deleteExcDate(index)">移除</el-button>
					</p>
					
                </div>
               
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="save">保 存</el-button>
					<el-button @click="cancelDialog">取 消</el-button>
				</div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'

    export default {
        name: "school-maintenance",
        data() {
            return {
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "节假日设置"},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                
                dialog:{
                    statu:'add',//add新增，edit编辑，look查看
                    visible:false,
                },
                hmYear:'',//年度
                dates:[],//选择节假日
                exceptionDates:[],//例外工作日
                holidayId:'',//节假日id
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                tableLoading:false,
            }
        },
        methods: {
            onDataChange(value){
               this.dates = [value[0]];
                if(value){
              　　  for(let i=1;i<value.length;i++){
                　　　　 if(this.dates.indexOf(value[i]) == -1){
                          　　 this.dates.push(value[i]);
                    　　}
                    }
                }
            },
            getTableData(pageNo,pageSize){
                this.tableLoading=true;
                this.$http.post("_op:/holidays",{
                    pageNo:pageNo,
                    pageSize:pageSize,
                }).then(data=>{
                    this.tableData=data.result;
                    this.totalCount=data.totalCount;
                    this.tableLoading=false;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
            addBtn() {
            	this.dialog={
            		statu:"add",
            		visible:true
            	}
            },
            editBtn(row) {
            	var self=this;
            	self.hmYear=row.year+"-01-01";
            	self.dates=row.holidays.split(",");
            	if (row.exceptions&&row.replaces) {
	            	row.exceptions.split(",").map(function(item){
	            		self.exceptionDates.push({
	            			etDate:item,
	            			reDate:''
	            		})
	            	})
	            	if (self.exceptionDates.length>0) {
	            		row.replaces.split(",").map(function(item1){
	            			self.exceptionDates.map(function(item2){
	            				item2.reDate=item1
	            			})
		            	})
	            		
	            	}
            	}
            	self.holidayId=row.id;
            	self.dialog={
            		statu:"edit",
            		visible:true
            	}
            },
            deleteBtn(row){
            	this.$http.delete('_op:holidays/'+row.id).then(data=>{
               	 	this.getTableData(this.pageNo,this.pageSize);
               	 	this.$message({
			          message: '该节假日删除成功',
			          type: 'success'
			        });
               	}).catch(()=>{
                })
            },
            cancelDialog(){
            	this.hmYear='';
            	this.dates=[];
            	this.exceptionDates=[];
            	this.dialog.visible=false
            },
            addExcDate(){
            	this.exceptionDates.push({etDate:'',reDate:''})
            },
            deleteExcDate(index){
            	this.exceptionDates.splice(index,1)
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData(this.pageNo,this.pageSize);
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableData(this.pageNo,this.pageSize);
            },
            verify(){
            	if (this.hmYear==='') {
            		this.$message({
			          message: '请选择年度',
			          type: 'warning'
			        });
			        return false;
            	}else if (this.dates.length==0) {
            		this.$message({
			          message: '请选择节假日',
			          type: 'warning'
			        });
			        return false;
            	}
            },
            save(){
            	if (this.verify()==false) {
            		return false;
            	}
            	
            	let holidays=this.dates.join();
            	let exceList=[];
            	let repList=[];
            	this.exceptionDates.map(function(item){
            		exceList.push(item.etDate);
            		repList.push(item.reDate)
            	})
            	
            	let exceptions=exceList.join();
            	let replaces=repList.join();
            	
            	if (!this.holidayId) {
	            	this.$http.post("_op:holidays/list",{
	                    exceptions:exceptions,
	                    replaces:replaces,
	                    holidays:holidays,
	                    year:this.hmYear
	                }).then(data=>{
				        this.getTableData(this.pageNo,this.pageSize);
		            	this.hmYear='';
		            	this.dates=[];
		            	this.exceptionDates=[];
				        this.dialog.visible=false;
	                }).catch(()=>{
	                })
            	} else{
            		this.$http.put("_op:holidays",{
            			id:this.holidayId,
	                    exceptions:exceptions,
	                    replaces:replaces,
	                    holidays:holidays,
	                    year:this.hmYear.substring(0,4)
	                }).then(data=>{
				        this.getTableData(this.pageNo,this.pageSize);
				        this.holidayId='';
		            	this.hmYear='';
		            	this.dates=[];
		            	this.exceptionDates=[];
				        this.dialog.visible=false;
	                }).catch(()=>{
	                })
            	}
            }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
        created(){
            this.getTableData(this.pageNo,this.pageSize);
            let timestr1='10:20:00'
            let timestr2='11:20:00'
        }
    }
</script>

<style scoped lang="less">

.linecell{display: flex; margin-bottom: 10px; height: 40px; line-height: 40px;
	label{width: 100px;text-align: left;}
	.el-input, .el-date-picker{width: 50%;}
	em.required-symbol{color:#f00;}
	.el-icon-d-arrow-left{display: none;}
}

</style>