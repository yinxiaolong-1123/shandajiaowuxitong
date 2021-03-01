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
                        <el-form-item class="cm-collapse">
                            <el-button type="primary" @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" class="cm-collapse" @click="collapseShow" >{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="专业代码">
                            <el-input v-model="param.code" placeholder="请输入学校代码" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="专业名称">
                            <el-input v-model="param.cnName" placeholder="请输入中文名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="学位类别">
                            <el-input v-model="param.degreeCategoryName" placeholder="请输入中文名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="param.status"  placeholder="请选择学校名称" style="width:100%;">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="在招" :value="0"></el-option>
                                <el-option label="停招" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div> 
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="addItem">新增</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                 
                    size="mini"
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="index" label="序号"></el-table-column>

                <el-table-column v-for="(item,index) in tableList" :key='index'
                                 :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop==='status'">
                            {{Number(scope.row.status)===0?'在招':'停招'}}
                        </template>
                        <template v-else-if="item.prop==='isNormalMajor'">
                            {{Number(scope.row.isNormalMajor)===0?'否':'是'}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;">删除</el-button>
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
                :title="(dialog.status==='add'?'新增':'编辑')+type"
                :visible.sync="dialog.visible"
                width="800px"
                append-to-body
                :close-on-click-modal="false"
                @closed="dialogClose"
                >
            <el-form :rules="rules" :model="formDialog" ref="formDialog" label-position="right" label-width="120px"> 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="专业代码" prop="code">
                            <el-input v-model="formDialog.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开设年份" prop="createYear">
                            <el-input v-model="formDialog.createYear"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="专业名称" prop="cnName">
                            <el-input v-model="formDialog.cnName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="专业名称(打印)" prop="prnCname">
                            <el-input v-model="formDialog.prnCname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名称(打印)" prop="enName">
                            <el-input v-model="formDialog.enName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="院系" prop="teachDepartmentId">
                            <el-select v-model="formDialog.teachDepartmentId" class="selectWidth">
                                <el-option v-for="item of getArrList('teachList')" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学制" prop="schoolingLengthId">
                            <el-select v-model="formDialog.schoolingLengthId" class="selectWidth">
                                <el-option v-for="item2 in getArrList('schoolingList')" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="专业代码(国家)" prop="countryMajorId">
                            <el-select v-model="formDialog.countryMajorId" class="selectWidth">
                                <el-option v-for="item2 in getArrList('countryList')" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="修业年限" prop="schoolingYear">
                            <el-input v-model.number="formDialog.schoolingYear"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学位类别" prop="degreeCategoryId">
                            <el-select v-model="formDialog.degreeCategoryId" class="selectWidth">
                                <el-option v-for="item2 in getArrList('degreeList')" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="师范专业" prop="isNormalMajor">
                            <el-select v-model="formDialog.isNormalMajor" class="selectWidth">
                                <el-option  v-for="item in getArrList('statusList')" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-radio-group v-model="formDialog.status">
                                <el-radio :label="0">在招</el-radio>
                                <el-radio :label="1">停招</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <span style="float:right">
                                <el-button @click="dialog.visible = false">取消</el-button>
                                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-form-item v-for="(item,index) in editFormDetail" :key="index"
                              :label="item.label" :prop="item.prop" :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):[]" class="flex-form">
                    <el-select v-if="item.type==='select'" v-model="formDialog[item.prop]" :placeholder="'请选'+item.label" style="width:100%;">
                        <el-option v-for="item2 in getArrList(item.list)" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
                    </el-select>
                    <el-input  v-else v-model="formDialog[item.prop]" :placeholder="'请输入'+item.label"
                              :disabled="item.editDisabled && dialog.status!=='add'">
                    </el-input>
                </el-form-item>
            <span v-show="promptShow" style="position: absolute;bottom:127px;left:475px; z-index: 2; display:inline-block;width:100%;color:#f56c6c">修业年限应大于学制</span>
                <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" class="flex-form">
                    <el-radio-group v-model="formDialog.status">
                        <el-radio :label="0">在招</el-radio>
                        <el-radio :label="1">停招</el-radio>
                    </el-radio-group>
                </el-form-item> -->

            </el-form>
            <!--改start-->

            <!--改end-->
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取消</el-button>
                <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
            </span> -->
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='school-major',REMARK='校内专业';

    export default {
        name: TYPE,
        data() {
            return {
                type:REMARK,
                breadcrumb: [
                    {label: "基础管理"},
                    {label: REMARK+'维护'},
                ],
                tableList:[
                    {label:'专业代码', prop:'code',width:100},
                    {label:'专业名称',prop:'cnName',width:300 },
                    {label:'专业名称(打印)',prop:'prnCname',width:200 },
                    {label:'英文名称(打印)', prop:'enName',width:220},
                    {label:'开设年份', prop:'createYear',width:80},
                    {label:'所属院系', prop:'teachDepartmentName'},
                    {label:'学制', prop:'schoolingLengthName',width:70},
                    {label:'修业年限', prop:'schoolingYear' ,width:70},
                    {label:'国家代码', prop:'countryMajorName'},
                    {label:'学位类别', prop:'degreeCategoryName',width:120},
                    {label:'师范专业', prop:'isNormalMajor',width:70},
                    {label:'状态', prop:'status',width:50},
                ],
                rules:{
                    code: [
                        { required: true, message: '请输入名专业代码', trigger: 'change' },
                    ],
                    cnName: [
                        {required: true, message: '请输入名专业名称', trigger: 'change' },
                    ],
                    teachDepartmentId:[
                        {required: true, message: '请选择名专业代码院系', trigger: 'change' },
                    ],
                    schoolingLengthId:[
                        {required: true, message: '请选择名专业代码学制', trigger: 'change' },
                    ],
                    countryMajorId:[
                        {required: true, message: '请选择名专业代码(国家)', trigger: 'change' },
                    ],
                    degreeCategoryId:[
                        {required: true, message: '请选择学位类型', trigger: 'change' },
                    ],
                    schoolingYear: [
                        {type: 'number', message: '请输入合格的修业年限，输入的必须是数字', trigger: 'change' },
                    ]
                },
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    cnName:'',
                    code:'',
                    status:'',
                    isDelete:0,
                    degreeCategoryName:'',
                    prnCname: ''
                },
                pagePort:{
                    table:'_op:major/list',
                    change:'_op:major',
                    option:'_op:university/getUniversityList',
                    teachList:'_op:teachDepartment/getTeachDepartmentList',
                    schoolingList:'_op:dicts/getDictsList',//schooling-length
                    countryList:'_op:majorCode/getMajorCodeList',
                    degreeList:'_op:degreeCategory/getDegreeCategoryList',
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formDialog:{
                    code:'',
                    cnName:'',
                    enName:'',
                    createYear:'',
                    teachDepartmentId:'',
                    schoolingLengthId:'',
                    countryMajorId:'',
                    schoolingYear:'',
                    degreeCategoryId:'',
                    isNormalMajor:0, //0-否 1-是
                    status:0,   //0-在招/在招  1-停招/停招
                    prnCname: ''

                },
                dialog:{
                    status:'add',
                    visible:false,
                },
                tableLoading:false,
                editFormDetail:[
                    {label:'专业代码',prop:'code',editDisabled:true,rule:true},
                    {label:'开设年份',prop:'createYear'},
                    {label:'专业名称',prop:'cnName',rule:true},
                    {label:'专业名称(打印)',prop:''},
                    {label:'英文名称(打印)',prop:'enName'},
                    {label:'院系',prop:'teachDepartmentId',rule:true,type:'select',list:'teachList'},
                    {label:'学制',prop:'schoolingLengthId',rule:true,type:'select',list:'schoolingList'},
                    {label:'专业代码（国家）',prop:'countryMajorId',type:'select',list:'countryList'},
                    {label:'修业年限',prop:'schoolingYear'},
                    {label:'学位类别',prop:'degreeCategoryId',rule:true,type:'select',list:'degreeList'},
                    {label:'师范专业',prop:'isNormalMajor',type:'select',list:'statusList' },
                ],
                optionItem:[],
                statusList:[
                    {id:0,name:'否'},
                    {id:1,name:'是'},
                ],
                teachList:[],
                schoolingList:[],
                countryList:[],
                degreeList:[],
                promptShow: false
            }
        },
        watch: {
          ['formDialog.schoolingYear'](val) {
       
          this.schoolingList.map(item=>{
          	if(this.formDialog.schoolingLengthId==item.id){
          		let num = item.name.substring(0,item.name.substring.length-1);
          		if(val<num) {
          		  this.promptShow = true;
          		  this.formDialog.schoolingYear = '';
          		}else{
          		  this.promptShow = false;
          		}
          	}
            })
          },
//        ['formDialog.schoolingLengthId'](val){
//        	this.schoolingList.map(item=>{
//        	  if(val==item.id){
//        		let num = item.name.substring(0,item.name.substring.length-1);
//        		if(this.formDialog.schoolingYear<=num) {
//        		  this.promptShow = true;
//        		  this.formDialog.schoolingYear = '';
//        		}else{
//        		  this.promptShow = false;
//        		}
//        	  }
//          })
//        }
        },
        methods: {
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
                        this.commonRequire(type);
                    }
                });
                
            },
            commonRules(msg,val,formDialog,item){
            	let text_number = (rule, value, callback) =>{
                    if(msg=="专业代码"||msg=="专业名称" || msg=="英文"|| msg=="年份"){
                        value = value.replace(/\s*/g,"");
                    }
            		
	            	if(msg.indexOf("代码")!= -1 && value.length>20 ){
	            		return callback(new Error(msg+"长度不能超过20个字"));
	            	}else if(msg.indexOf("简称")!= -1 && value.length>20){
	            		return callback(new Error(msg+"简称字数不能超过20个字"));
	            	}else if(msg.indexOf("名称")!= -1 && value.length>40){
	            		return callback(new Error(msg+"字数不能超过40个字"));
	            	}else if(msg.indexOf("英文") > -1 && value.length>40) {
	            		return callback(new Error(msg+"年限数字不能超过40个字"));
	            	}else if(msg.indexOf("年份") > -1 && value.length>5) {
	            		return callback(new Error(msg+"年限数字不能超过5个字"));
	            	}else{
	            		return callback();
	            	}
            	}
            	return [
                    { required: true, message: '请输入'+msg , trigger: 'blur' },
                    { validator: text_number, trigger: 'change' }
                ];
            },
            commonRequire(method){
                let option=util.clone(this.formDialog);
                if(method==='post'){
                    option.id && delete option.id;
                    option.universityName && delete option.universityName;
                    // delete option.status;
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
                this.$confirm(`此操作将永久删除该${row.cnName}的学校信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.change+'/'+row.id)
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
           
                this.$http.get(this.pagePort.change+'/'+row.id)
                    .then(data=>{
                        let data1 = data.data
                        data1.schoolingYear = Number(data1.schoolingYear)
                        this.formDialog=data1;
                        if(this.formDialog.countryMajorId==0 || this.formDialog.countryMajorId=="") {
                            this.formDialog.countryMajorId='';
                        }
//                      let schoolingYear = this.formDialog.schoolingYear;
//                      this.schoolingList.forEach(item => {
//                        let list = item.name.substring(0,item.name.length-1);
//                        if(schoolingYear>list){
//                        	return bb = schoolingYear
//                        }
//                      })
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
                if(url.indexOf('dicts/getDictsList') > -1){
                    data.type='schooling-length'
                }
                if (url.indexOf('majorCode/getMajorCodeList') > -1 || url.indexOf('degreeCategory/getDegreeCategoryList') > -1 || url.indexOf('teachDepartment/getTeachDepartmentList') > -1) {
                    data.isDelete = 0;
                    data.status = 1;
                }

                this.$http.post(url,data).then(data=>{
                    this[str]=data.data;
                    console.log(this[str])
                })
               
            },
            getArrList(str){
                return this[str];
            }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
        created(){
            this.getTableData();
            this.getOptionItem('teachList');
            this.getOptionItem('schoolingList');
            this.getOptionItem('countryList'); // majorCode/getMajorCodeList
            this.getOptionItem('degreeList');
        }
    }
</script>

<style scoped>
.selectWidth{
    width: 260px;
}
</style>
