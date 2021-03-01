<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form size="mini" :inline="true" :model="param">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="授课形式">
                            <el-input v-model="param.name" placeholder="请输入授课形式" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="学时分类">
                            <el-select v-model="param.classHourCategory">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in categoryList" :key="item.name" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item class="cm-collapse" v-if="btnPerObj.add">
            				<el-button size="mini" type="primary" @click="addItem">新增</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-if="btnPerObj.query">
                        	<el-button type="primary" @click="search">查询</el-button> 
                             <!-- //66666 -->
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
                size='mini'
                header-row-class-name="cm-dark"
                v-loading="tableLoading"
                element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)"
            >
                <!--<el-table-column type="selection"></el-table-column>-->
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>

                <el-table-column v-for="(item,index) in tableList" :key='index'
                                 :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <template v-if="item.prop==='status'">
                            {{Number(scope.row.status)===1?'启用':'禁用'}}
                        </template>
                        <template v-else-if="item.prop==='classHourCategory'">
                            {{Number(scope.row.classHourCategory)===0?'理论':Number(scope.row.classHourCategory)===1?'实践':'未设置'}}
                        </template>
                        <template v-else-if="item.prop==='createTime'">
                            {{ scope.row.createTime | getTime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>
<!-- //777777777 -->
                <el-table-column
                	v-if="btnPerObj.edit||btnPerObj.delete"
                    fixed="right"
                    label="操作"
                    width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                        <el-button type="text" size="small" style="color: red;" @click="deleteItem(scope.row)" v-if="btnPerObj.delete">删除</el-button>
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
            width="400px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-small"
            @closed="dialogClose"
        >
            <el-form :model="formDialog" class="boxStyle" ref="formDialog">
                <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):[]" class="flex-form">
                    <el-select v-if="item.type==='select'" v-model="formDialog[item.prop]"  :placeholder="'请选'+item.label" style="width:100%;">
                        <!--<el-option label="全部" value=""></el-option>-->
                        <el-option v-for="item2 in getArrList(item.list)" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                    </el-select>
                    <el-input v-else v-model="formDialog[item.prop]" :placeholder="'请输入'+(item.placeholder || item.label)"
                              :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
                </el-form-item>
                <!--新增--><span style="position: absolute; top: 229px; left: 118px; color:#f56c6c" v-show="verificationPrompt">课节字符长度不能超过16个</span>
                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" class="flex-form">
                    <el-radio-group v-model="formDialog.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='teaching-management';
    const REMARK='授课形式维护';
    
    import {mapState} from 'vuex'//1

    export default {
        name: TYPE,
        data() {
            return {
                type:REMARK,
                breadcrumb: [
                    {label: "基础管理"},
                    {label: REMARK},
                ],
                tableList:[
                    {label:'代码', prop:'code'},
                    {label:'授课形式', prop:'name'},
                    {label:'课节标准', prop:'sectionsStandard'},
                    {label:'状态', prop:'status'},
                    {label:'创建人', prop:'createUserName'},
                    {label:'创建日期', prop:'createTime'},
                    {label:'学时分类', prop:'classHourCategory'},
                    // {label:'排课形式', prop:'schoolingYear'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    name:'',
                    classHourCategory:'',
                },
                pagePort:{
                    table:'_op:teaching/form/list',
                    change:'_op:teaching/form',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    code:'',
                    name:'',
                    sectionsStandard:'',
                    classHourCategory:'',
                    status:1,   //1-启用，0-禁用
                },
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'代码',prop:'code',editDisabled:true,rule:true},
                    {label:'名称',prop:'name',rule:true},
                    {label:'课节标准',prop:'sectionsStandard',placeholder:'数字（目前业务2,3,4,7,8）'},
                    {label:'学时分类',prop:'classHourCategory',type:'select',list:'categoryList',rule:true},
                ],
                optionItem:[],
                statusList:[
                    {id:0,name:'否'},
                    {id:1,name:'是'},
                ],
                categoryList:[
                    {id:0,name:'理论'},
                    {id:1,name:'实践'},
                ],
                teachList:[],
                schoolingList:[],
                countryList:[],
                degreeList:[],
                verificationPrompt: false,
				btnPerObj:{//按钮权限
					add:false,
					query:false,
					edit:false,
					delete:false
				}
            }
        },
        watch: {
          ['formDialog.sectionsStandard'](val) {
            if(val && val.length>16) {
              this.verificationPrompt = true
            }else {
              this.verificationPrompt = false
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
        computed:{
        	
        },
        filters:{
            getTime(time){
            return util.getTime(time);
            }
        },
        methods: {
             getBtnPermit() {
      //获取按钮权限
      	let self = this;
      	let actionId=this.$route.query.actionId;
      	this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
	      	data.data.map(item => {
                  
		        if (item.code == "add_shoukexingshiweihu") {
		          //新增
		          self.btnPerObj.add = true;
		        }
		        if (item.code == "edit_shoukexingshiweihu") {
		          //编辑
		          self.btnPerObj.edit = true;
		        }
		        if (item.code == "query_shoukexingshiweihu") {
		          //查询
		          self.btnPerObj.query = true;
		        }
		        if (item.code == "del_shoukexingshiweihu") {
		          //复制方案
		          self.btnPerObj.delete = true;
		        }
		      
		    });
	    }).catch(()=>{
	    })

    },
        
            addItem(){
                this.dialog.status='add';
                this.dialog.visible=true;
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            commonValidate(ref,type){
                this.$refs[ref].validate((bool)=>{
                    if(bool){
                        this.commonRequire(type)
                    }
                })
            },
            commonRules(msg,val,formDialog,item){
				
            	let text_number = (rule, value, callback) =>{
            		// value = value.replace(/\s*/g,"");
            		// formDialog[item] = value;
	            	if(msg.indexOf("代码")!= -1 && value.length>20 ){
	            		
	            		return callback(new Error(msg+"长度不能超过20个字"));
	            	}else if(msg.indexOf("简称")!= -1 && value.length>20){
	            		return callback(new Error(msg+"简称字数不能超过20个字"));
	            	}else if(msg.indexOf("名称")!= -1 && value.length>40){
	            		return callback(new Error(msg+"字数不能超过40个字"));
	            	}else{
	            		return callback();
	            	}
            	}
            	if(msg == "学时分类"){
            		return [{required: true, message: '选择'+msg , trigger: 'blur' }] 
            	}else{
            		return [{required: true, message: '请输入'+msg , trigger: 'blur' },
                    { validator: text_number, trigger: 'change' }];
            	}

            	
            },
            commonRequire(method){
                let option=util.clone(this.formDialog);
                if(method==='post'){
                    option.id && delete option.id;
                    delete option.status;
                }
                this.$http(
                    {
                        method:method,
                        url:this.pagePort.change,
                        data:{
                            ...option
                        },
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
                this.$confirm(`此操作将永久删除授课形式：｛ ${row.name}｝ , 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.change+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.pageNo = 1;
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
                this.$http.get(this.pagePort.change+'/'+row.id)
                    .then(data=>{
                        this.formDialog=data.data;
                    });
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            getTableData(){
                this.tableLoading=true;
                this.$http.post(this.pagePort.table,{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    param:this.param
                }).then(data=>{
                    this.tableData=data.result;
                    this.pageNo=data.pageNo;
                    this.pageSize=data.pageSize;
                    this.totalCount=data.totalCount;
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
                    data.type='schooling-length'
                }
                this.$http.post(url,data).then(data=>{
                    this[str]=data.data;
                })
            },
            getArrList(str){
                return this[str];
            }
        }
    }
</script>

<style scoped lang="less">
.boxStyle{
      padding-right: 10px;  
}

</style>
