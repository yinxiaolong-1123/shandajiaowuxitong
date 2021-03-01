<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="param">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="学期名称">
                            <el-input v-model="param.name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="年份">
                            <!--<el-input v-model="param.year" placeholder="请输入年份" clearable></el-input>-->
                            <intelligent-year-picker
		                        v-model="param.year"
		                        type="year"
		                        value-format="yyyy"
		                        placeholder="选择年份">
		                    </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.query">
                        	<el-button type="primary" size="mini" @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.add">
                        	<el-button size="mini" type="primary" @click="addItem()">新增</el-button>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.delBatch">
                        	<el-button size="mini"  @click="allDeleteItem">批量删除</el-button>
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
                header-row-class-name="cm-dark"
                v-loading="tableLoading"
                element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)"
                @selection-change="handleSelect">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                
				
				<el-table-column prop="name" label="学期名" width="160"></el-table-column>
				<el-table-column prop="year" label="年份"></el-table-column>
				<el-table-column label="排序">
                    <template slot-scope="scope">
                    	{{scope.row.orderNum | orderNumFn}}
                    </template>
                </el-table-column>
				<!--<el-table-column prop="stage" label="学年"></el-table-column>-->
				<el-table-column prop="startTime" label="开始日期" width="120"></el-table-column>
				<el-table-column prop="endTime" label="结束日期" width="120"></el-table-column>
				<el-table-column prop="createUser" label="创建人"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
				
                <el-table-column
                	 v-if="btnPerObj.setting||btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                        <el-button type="text" size="small" @click="lookWeek(scope.row)" v-if="btnPerObj.setting">设置节假日</el-button>
                        <!--<el-button type="text" size="small" 
                        	@click="getWeek(scope.row)" 
                        	:disabled=scope.row.createWeek>
                        	产生周次
                        </el-button>-->
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
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
                @current-change="currentChange"
            >
            </el-pagination>
        </div>
        <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑')+type"
            :visible.sync="dialog.visible"
            width="700px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-pad"
            @closed="dialogClose">
            <el-form :model="formDialog" ref="formDialog">
                <el-form-item label="学年" class="flex-form" prop="year" :rules="{required: true, message: '请选择年份', trigger: 'blur'}">
                    <intelligent-year-picker
                        style="width:50%;"
                        v-model="formDialog.year"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择年份"
                        @change="handleDefaultTerm">
                    </intelligent-year-picker>
                </el-form-item>
                
                <el-form-item label="学期" class="flex-form" prop="startTime" :rules="{required: true, message: '请选择学期', trigger: 'blur'}">
                	<el-select v-model="formDialog.orderNum" placeholder="请选择学期" @change="handleDefaultTerm" style="width:50%;">
                            <el-option v-for="item2 in sortList" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                        </el-select>
                </el-form-item>
                
                <el-form-item label="开始日期" class="flex-form" prop="startTime" :rules="{required: true, message: '请选择开始日期', trigger: 'blur'}">
                    <el-date-picker
                        style="width:50%;"
                        v-model="formDialog.startTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                    <!-- <div class="box" style="color:#e4393c;display: inline-block;max-width:50%;padding-left:20px;">（注：开始日期，周次从0周计算）</div> -->
                </el-form-item>
                
                <el-form-item label="结束日期" class="flex-form" prop="endTime" :rules="{required: true, message: '请选择结束日期', trigger: 'blur' }">
                    <el-date-picker
                        style="width:50%;"
                        v-model="formDialog.endTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始周次" class="flex-form" prop="status">
                    <el-input type="text" style="width:50%;" v-model="week"></el-input>
                </el-form-item>
                <el-form-item label="状态" class="flex-form" prop="status">
                    <el-select v-model="formDialog.status" placeholder="请选择状态" style="width:50%;">
                        <el-option v-for="item2 in statusList" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('formDialog')">取 消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'post')">确 定</el-button>
            </span>
        </el-dialog>
        
        
        
        <el-dialog
            title="学期设置节假日"
            :visible.sync="dialogWeek"
            width="80%"
            top="5vh"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-pad">
            
            <p>{{semesterName}}</p>
        	<table class="stationtable" v-if="weekData.length>0">
	        	<tr>
	        		<th></th>
	        		<th v-for="item in weekData[0].weekList">
	        			{{item.weekname}}
	        		</th>
	        	</tr>
        		<tr v-for="(item1,index1) in weekData">
        			<td>第{{item1.week}}周</td>
        			<td v-for="(item2,index2) in item1.weekList" 
        				@click="setHoliday(item2,index1,index2)"
        				:class="{'td-bgcolor' : item2.isHoliday==true,'td-cursor':item2.isHoliday==true,'td-size':!reg.test(item2.weekday)==true}">
        				{{item2.weekday}}
        			</td>
        		</tr>
        	</table>
            
            
        </el-dialog>
        
        
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='semester-management';
    const REMARK='学期管理';
    import {mapState} from 'vuex'

    export default {
        name: TYPE,
        data() {
            return {
                type:REMARK,
                breadcrumb: [
                    {label: "基础数据"},
                    {label: REMARK},
                ],
                tableList:[
                    {label:'学期名', prop:'name',width:120},
                    {label:'年份', prop:'year'},
                    {label:'排序', prop:'orderNum'},
                    // {label:'学年', prop:'stage',width:120},
                    {label:'开始日期', prop:'startTime',width:120},
                    {label:'结束日期', prop:'endTime',width:120},
                    {label:'创建人', prop:'createUser'},
                    {label:'创建时间', prop:'createTime',width:120},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:10,
                param:{
                    name:'',
                    year:'',
                    stage:'',
                    // start:'',
                    // end:'',
                },
                week: '0',
                pagePort:{
                    table:'_op:terms/list',
                    // change:'_op:terms',
                    // change:'_op:/approve/pTransCom',
                    change:'_op:/terms/batch/delete',
                    detail:'_op:terms/find',
                    deleteAll:'_op:terms/batch/delete',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    name:'',
                    year:'',
                    endTime:'',
                    startTime:'',
                    orderNum:'',
                    status: ''   //0-未排课 1-排课中 2-排课结束 3-学期结束 -1-历史学期
                },
                statusList: [
                    {
                        id: 0,
                        name: '未排课'
                    },
                    {
                        id: 1,
                        name: '排课中'
                    },
                    {
                        id: 2,
                        name: '排课结束'
                    },
                    {
                        id: 3,
                        name: '学期结束'
                    },
                    {
                        id: -1,
                        name: '历史学期'
                    }
                ],
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'学期名称',prop:'name',editDisabled:true,rule:util.commonRules('代码')},
                    {label:'学期',prop:'orderNum',type:'select',list:'sortList',},
//                  {label:'年份',prop:'year'},
                ],
                optionItem:[],
                categoryList:[
                    {id:0,name:'理论'},
                    {id:1,name:'实践'},
                ],
                sortList:[
                    {id:1,name:'第一学期'},
                    {id:2,name:'第二学期'},
                ],
                checkedList:[],
                
                dialogWeek:false,//查看周次dialog
                weekData:[],//周次列表
                semesterName:'',//学期名称
                reg:/^[1-9]\d*$/,
				btnPerObj:{//按钮权限
					add:false,
					query:false,
					delBatch:false,
					edit:false,
					setting:false,
					delete:false
				}
            }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
            
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
            this.getTableData();
        },
        filters:{
            getTime(time){
                return util.getTime(time);
            },
            orderNumFn(val){
            	if (val==1) {
            		return '上学期'
            	} else{
            		return '下学期'
            	}
            }
        },
        computed:{
        	...mapState(['btnPermitList']),
        },
        methods: {
            	  //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_xueqiguanli") {
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="add_xueqiguanli") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="del_batch_xueqiguanli") {
                            self.btnPerObj.delBatch=true;
                        }
                        if (item.code=="edit_xueqiguanli") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="product_weeks_xueqiguanli") {
                            self.btnPerObj.setting=true;
                        }
                        if (item.code=="del_xueqiguanli") {
                            self.btnPerObj.delete=true;
                        }
                    });
                }).catch(()=>{
                })
            },
        
            addItem(){
                this.dialog.status='add';
                this.dialog.visible=true;
                this.week = ""
                this.formDialog = {}
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            // 根据所选的年份和学期默认选定开始日期和结束日期
            handleDefaultTerm (){
            	this.formDialog.year=this.formDialog.year.substring(0,4)
            	let nextyear=(parseInt(this.formDialog.year) +1);
                if (this.formDialog.year && this.formDialog.orderNum == 1) {
                    this.formDialog.startTime =this.formDialog.year+'-09-01';
                    this.formDialog.endTime = nextyear+'-01-31';
                    this.formDialog.name = this.formDialog.year+'-'+nextyear+'学年第一学期'
                } else if(this.formDialog.year && this.formDialog.orderNum == 2) {
                    this.formDialog.startTime =nextyear+'-02-01';
                    this.formDialog.endTime = nextyear+'-08-31';
                    this.formDialog.name = this.formDialog.year+'-'+nextyear+'学年第二学期'
                }
            },
            // 取消
            closeDialog(formDialog) {
                this.dialog.visible = false
            },
            commonValidate(ref,type){
                this.$refs[ref].validate((bool)=>{
                    if(bool){
                        this.commonRequire(type)
                    }
                })
            },
            commonRequire(method){
                this.formDialog.year=this.formDialog.year.substring(0,4)
                let userId = JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
                // let option=util.clone(this.formDialog);
                let changeId
                if(this.dialog.status == 'add') {
                    changeId = 0
                }else{
                    changeId = this.formDialog.orderNum
                }
                let data = {
                    extend: JSON.stringify({year:this.formDialog.year,order_num:this.formDialog.orderNum,start_time:this.formDialog.startTime, end_time: this.formDialog.endTime, week_start: this.week, status: this.formDialog.status}),
                    type:10002,
                    term_id :changeId,
                    user_id:userId
                }
               
                // if(method==='post'){
                //     option.id && delete option.id;
                //     delete option.status;
                // }
                this.$http(
                    {
                        method:method,
                        url:'_op:/approve/pTransCom',
                        data: data
                        // data:{
                        //     ...option
                        // },
                    }
                ).then(data=>{
                    let message=(method==='post'?'新增':'编辑')+'成功！';
                    let type='success';
                    if(Number(data.code)===0){
                        this.dialog.visible=false;
                    }else{
                        message=data.msg;
                        type='warning'
                    }
                    this.$message({
                        type,
                        message,
                        showClose:true,
                    });
                    //更新数据列表
                    this.getTableData();
                })
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableData();
            },
            deleteItem(row){
                this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(this.pagePort.change, {ids: [row.id]})
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getTableData();
                            }else{
                                type='error';
                                message=data.msg;
                            }
                            this.$message({
                                type,
                                message,
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            allDeleteItem(){
                if(this.checkedList.length===0){
                    return  this.$message({
                        type:'warning',
                        message:'尚未选中任何数据',
                        showClose:true
                    });
                }
                this.$confirm(`此操作将永久删除已选中的数据,是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                            method:'post',
                            url:this.pagePort.deleteAll,
                            // url:this.pagePort.change,
                            data:{
                                ids:[...this.checkedList]
                            }
                        })
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getTableData();
                            }else{
                                type='error';
                                message=data.msg;
                            }
                            this.$message({
                                type,
                                message,
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            dialogClose(){
                //关闭弹窗时重置数据
                this.$refs.formDialog.resetFields();
            },
            editItem(row){
                this.$http.get(this.pagePort.detail+'/'+row.id).then(data=>{
                	data.data.year=data.data.year+'-01-01'
                    this.formDialog=data.data;
	                this.dialog.status='edit';
                    this.dialog.visible=true;
                    this.week = data.data.weekStart
                });
            },
            lookWeek(row){
            	this.$http.get("_op:/terms/query/weekterm/"+row.id).then(data=>{
            		this.semesterName=row.name;
            		this.weekData=data.data;
            		this.dialogWeek=true;
                });
            },
            setHoliday(item,index1,index2){//设置节假日
            	if(item.weekday!=null){
            		this.weekData[index1].weekList[index2].isHoliday=!item.isHoliday;
            		this.$http.post("_op:/week/term/set/holiday",{
            			holiday:item.isHoliday,
            			id:item.id
            		}).then(data=>{
	            		if(item.isHoliday){
	            			this.$message.success('第'+this.weekData[index1].week+'周'+item.weekname+'设置节假日成功')
	            		}else{
	            			this.$message.success('第'+this.weekData[index1].week+'周'+item.weekname+'设置工作日成功')
	            		}
	                });
            	}
            	
            },
            getTableData(){
                this.tableLoading=true;
       
                this.$http({
                    method:'post',
                    url:this.pagePort.table,
                    data:{
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        param:this.param
                    }
                }).then(data=>{
                    data=data.data;
                    this.tableData=data.records;
                    this.totalCount=data.total;
                    this.tableLoading=false;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
            search(){
                this.pageNo=1;
                this.getTableData();
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData();
            },
            getOptionItem(str){
                let data={};
                let url=this.pagePort[str];
                if(url.indexOf('/dicts/')!==-1){
                    data.type=''
                }
                this.$http.post(url,data).then(data=>{
                    this[str]=data.data;
                })
            },
            getArrList(str){
                return this[str];
            },
            handleChange(val){
            
            },
            handleSelect(selection){
                this.checkedList=[...selection].map(val=>val.id);
            },
        }
    }
</script>

<style scoped lang="less">
.textcolor{color: #DCDFE6;}
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
 	margin: 20px 0;
  	th {
	  background-color: #eef1f6;
	  line-height: 40px;
	  border: 1px solid #dfe6ec;
	}
	td {
	  border: 1px solid #dfe6ec;
	  line-height: 30px;
	}
	.td-bgcolor{
		background-color:#6DCFD9;
		color: #fff;
	}
	.td-cursor{cursor: pointer;}
	.td-size{font-size: 20px;font-weight: bold;}
}

</style>
