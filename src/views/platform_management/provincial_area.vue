<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-flex">
            <div class="cm-tree cm-flex-item">
                <div>
                    <el-button type="primary" size="mini" @click="addItem" v-if="btnPerObj.add" >新增</el-button>
                    <el-button size="mini" @click="editItem">编辑</el-button>
                    <el-button size="mini" @click="deleteItem"  v-if="btnPerObj.delete">删除</el-button>
                </div>
                <el-tree 
                	:data="treeData" 
                	:props="defaultProps" 
                	@node-click="handleNodeClick"
                	@node-expand="handleNodeExpand" 
                	@node-collapse="handleNodeCollapse"
                	:expand-on-click-node="false" 
                	accordion
                	highlight-current 
                	node-key="id" 
                	ref="tree" >
                </el-tree>
            </div>
            <div class="cm-table cm-flex-item">
                <div style="margin-bottom:10px;">
                    <span class="el-radio__label" style="margin-right:20px;">层级显示：</span>
                    <el-radio-group v-model="tableRadio" @change="getTableData">
                        <el-radio  :label="1" >只显示下一级</el-radio>
                        <el-radio :label="0" >显示所有下级</el-radio>
                    </el-radio-group>

                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%;"
                    size="mini"
                    header-row-class-name="cm-dark"
                    v-loading="tableLoading"
                    element-loading-text="加载中……"
                    element-loading-background="rgba(255, 255, 255, 0.8)">
                    <el-table-column type="index" label="序号"></el-table-column>

                    <el-table-column v-for="(item,index) in tableList" :key='index'
                                     :prop="item.prop" :label="item.label">
                        <template slot-scope="scope">
                            <template v-if="item.prop==='status'">
                                {{Number(scope.row.status)===0?'启用':'禁用'}}
                            </template>
                            <template v-else>
                                {{scope.row[item.prop]}}
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column
                       v-if="btnPerObj.edit||btnPerObj.delete"
                        fixed="right"
                        label="操作"
                        width="90">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="tableEditItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
                            <el-button type="text" size="small" @click="tableDeleteItem(scope.row)" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <!--<div class="cm-pagination">-->
            <!--<el-pagination-->
                    <!--background-->
                    <!--:current-page="pageNo"-->
                    <!--:page-sizes="[10, 20, 50, 100]"-->
                    <!--:page-size="pageSize"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="totalCount"-->
                    <!--@size-change="sizeChange"-->
                    <!--@current-change="currentChange"-->
            <!--&gt;-->
            <!--</el-pagination>-->
        <!--</div>-->
        <el-dialog
            :title="(dialog.status==='add'?'新增':'编辑')+'省市区数据'"
            :visible.sync="dialog.visible"
            width="400px"
            append-to-body
            :close-on-click-modal="false"
            custom-class="cm-dialog-small"
            @closed="dialogClose"
        >
            <el-form :model="formDialog" ref="formDialog">
                <el-form-item 
                 v-for="(item,index) in editFormDetail"
                  :key="index" :label="item.label" 
                  :prop="item.prop"  
                  :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):{}" 
                  class="flex-form" ref='enValidateForm'>
                    <el-input 
                        @input="changeInput(item.label,formDialog[item.prop])"
                        validate-on-rule-change
                        v-model="formDialog[item.prop]"
                        :placeholder="item.prop == 'parentName' && parentId =='1' ? '' : `请输入${item.label}`" 
                        :disabled="(item.editDisabled && dialog.status!=='add') || (parentId !== 1 && item.prop === 'parentName')|| item.disabled" 
                    ></el-input>
                </el-form-item>
                <!--<p v-if="dialog.status!=='add'">-->
                    <!--<el-form-item label="状态" prop="status" class="flex-form">-->
                        <!--<el-radio-group v-model="formDialog.status">-->
                            <!--<el-radio :label="0">启用</el-radio>-->
                            <!--<el-radio :label="1">禁用</el-radio>-->
                    <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                <!--</p>-->
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
     import {mapState} from 'vuex'//111
    //每个模块的type 和remark是固定不允许改变的
    const TYPE='provincial-area';
    const REMARK='省市区管理';
    const treeID=1;//树结构起始id；

    export default {
        name: TYPE,
        data() {
//          let commonRules=msg=>{
//              return {required: true, message: msg, trigger: 'change' }
//          };
            return {
                 enValidateForm: {
                    enName: ''
                    },
                testShow:false,
                breadcrumb: [
                    {label: "基础数据"},
                    {label: "属性类"},
                    {label: "省市区"}
                ],
                tableList:[
                    {label:'代码', prop:'code'},
                    {label:'名称', prop:'cnName'},
                    {label:'英文名称', prop:'enName'},
                    {label:'上级', prop:'parentName'},
                ],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                totalCount:0,
                param:{
                    cnName:'',
                    universityCode:'',
                },
                pagePort:{
                    tree:'_op:province/city/tree/',
                    list:'_op:province/city/list/',
                    operation:'_op:province/city',
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
                    parentName:'',
                },
                dialog:{
                    status:'add',
                    visible:false,
                },

                tableLoading:false,
                defaultProps: {
                    children: 'children',
                    label: 'cnName'
                },
                editFormDetail:[
                    {label:'上级部门',prop:'parentName',editDisabled:true,disabled:true},
                    {label:'代码',prop:'code',editDisabled:true,rule:true},
                    {label:'名称',prop:'cnName',editDisabled:false,rule:true},
                    {label:'英文名称',prop:'enName',editDisabled:false,rule:false}

                ],
                tableRadio:1,
                targetId:'',
                parentId:treeID,
                tarNode:'',
                parentNode:'',
                treeData:[],
                defaultKeys:treeID,
                expandKeys:[],
                btnPerObj:{//按钮权限  222
					add:false,
					query:false,
					edit:false,
					delete:false
				}
            }
        },
        computed:{
                    ...mapState(['btnPermitList']),//333
                },
        methods: {
              //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_shengshiqu") {
                        self.btnPerObj.query=true;
                        }
                        if (item.code=="add_shengshiqu") {
                            self.btnPerObj.add=true;
                        }
                        if (item.code=="edit_shengshiqu") {
                            self.btnPerObj.edit=true;
                        }
                        if (item.code=="del_shengshiqu") {
                            self.btnPerObj.delete=true;
                        }
                    });
                }).catch(()=>{
                })
            },
            	
                      
            addItem(){
                if(this.mustGetId()){
                    for(let key of Object.keys(this.formDialog)){
                        this.formDialog[key]='';
                    }
                    this.formDialog.parentName=this.tarNode.cnName;
                    this.formDialog.parentId=this.tarNode.id;
                    this.dialog.status='add';
                    this.dialog.visible=true;
                }
            },
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            //新增提交
            commonValidate(ref,type){
                this.$refs[ref].validate((bool)=>{
                    if(bool){
                        this.commonRequire(type)
                    }
                })
            },
             //英文名称的验证 长度超过40开启验证
            changeInput(name,value){
                if(name == "英文名称" && value.length>40){
                    this.editFormDetail[3].rule = true
                }else{
                    this.editFormDetail[3].rule = false
                }
            }, 
            // 表单验证
            commonRules(msg,val,formDialog,item){
                let text_number = (rule, value, callback) =>{
                    value = value.replace(/\s*/g,"");
                    formDialog[item] = value;
                    if(msg.indexOf("代码")!= -1 && value.length>20 ){
                        return callback(new Error("请输入小于20位数的代码"));
                    }else if(msg.indexOf("简称")!= -1 && value.length>40){
                        return callback(new Error("简称字数不能超过20个字"));
                    }else if(msg.indexOf("名称")!= -1 && value.length>20){
                        return callback(new Error("名称不能超过20个字"));
                    }else if(msg.indexOf("英文名称")!= -1 && value.length>40){
                        return callback(new Error("英文名称不能大于40个字"));
                    }else{
                        return callback();
                    }
                }
                return [{required:true, message: '请输入(省/市/区(县)'+msg , trigger: ['blur','change'] },
                    { validator: text_number, trigger:  ['blur','change']}];
            },
            commonRequire(method){
                let option=util.cloneObj(this.formDialog);
                option.parentName && delete option.parentName;
                this.$http(
                    {
                        method:method,
                        url:this.pagePort.operation,
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
                    this.getTreeData();
                    this.getTableData();
                })
            },
            currentChange(current){
                this.pageNo=current;
                this.getTableData();
            },
            tableDeleteItem(row){
                this.$confirm(`此操作将删除 "${row.cnName}" 的数据, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete(this.pagePort.operation+'/'+row.id)
                        .then(data=>{
                            let message='删除成功!';
                            let type='success';
                            if(Number(data.code)===0){
                                this.getTableData();
                                this.getTreeData();
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
            deleteItem(){
                if(this.mustGetId()){
                    let row=this.tarNode;
                    this.$confirm(`此操作将删除 "${row.cnName}" , 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.delete(this.pagePort.operation+'/'+row.id)
                            .then(data=>{
                                let message='删除成功!';
                                let type='success';
                                if(Number(data.code)===0){
                                    this.defaultKeys=treeID;//删除该项后重制选中的那一项
                                    this.getTableData();
                                    this.getTreeData();
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
                }
            },
            dialogClose(){
                //关闭弹窗时重置数据
                this.$refs.formDialog.resetFields();
            },
            editItem(){
                if(this.mustGetId()){
                    // for(let key of Object.keys(this.formDialog)){
                    //     this.formDialog[key]=this.tarNode[key];
                    // }
                    this.formDialog=util.cloneObj(this.tarNode);
                    if (this.parentId == 1) {
                        this.$message.error('根目录不能编辑');
                        return ;
                    } else {
                        if(this.parentNode.data){
                            this.formDialog.parentName=this.parentNode.data.cnName;
                        }
                    }
                    this.dialog.status='edit';
                    this.dialog.visible=true;
                }
            },
            tableEditItem(row){
                this.targetId=row.id;
                this.formDialog=util.cloneObj(row);
                this.dialog.status='edit';
                this.dialog.visible=true;
            },
            getTableData(){
                this.tableLoading=true;
                this.$http.get(this.pagePort.list+`${this.tableRadio}/${this.parentId}`)
                    .then(data=>{
                    this.tableData=data.data;
                    // this.pageNo=data.pageNo;
                    // this.pageSize=data.pageSize;
                    // this.totalCount=data.totalCount;
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
            handleNodeClick(obj,nodeObj) {
                let tarObj=util.cloneObj(obj);
                this.tarNode=tarObj;
                this.parentNode=nodeObj.parent;
                this.targetId=tarObj.id;
                this.parentId=tarObj.id;
                this.defaultKeys=tarObj.id;
                this.getTableData();
            },
            getTreeData(id=1){
                this.$http.get(this.pagePort.tree+id).then(data=>{
                    this.treeData=[data.data];
                    let key=this.defaultKeys;//删除的时候有对这个key进行重新赋值
                    this.extendTree(key);//设定默认展开的
                    //编辑或者新增后
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(key);
                        let nodeObj=this.$refs.tree.getNode(key);
                        this.tarNode=nodeObj.data;
                        if(nodeObj.parent.level===0){
                            this.parentNode={};
                        }else{
                            this.parentNode=nodeObj.parent;
                        }
                        this.targetId=nodeObj.data.id;
                        this.parentId=nodeObj.data.id;
                    })
                })
            },
            mustGetId(key=this.targetId){
                // let key=this.$refs.tree.getCurrentKey();
                if(!key && key!==0){
                    this.$message({
                        showClose:true,
                        message:'请先选中区域节点！',
                        type:'warning'
                    });
                    key=false;
                }else{
                    key=true;
                }
                return key;
            },
            //保存默认展开的树列表
            handleNodeExpand(obj){
                this.extendTree(obj.id);
            },
            handleNodeCollapse(obj){
                this.collapseTree(obj.id);
            },
            extendTree(key){
                let val=new Set(this.expandKeys);
                if(!val.has(key)){
                    val.add(key);
                }
                this.expandKeys=Array.from(val);
            },
            collapseTree(key){
                let val=new Set(this.expandKeys);
                if(val.has(key)){
                    val.delete(key);
                }
                this.expandKeys=Array.from(val);
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
            this.getTreeData();
        }
    }
</script>

<style scoped lang="less">
.flex-form.el-form-item {
    display: flex;
    margin-top: 20px;
    padding-right: 20px;
}
.cm-flex > .cm-flex-item.cm-tree {
    width: 210px;
    flex: 1 0 auto;
    background-color: #f0f0f0;
    padding: 10px 10px 20px;
    margin-right: 20px;
    box-sizing: border-box;
}

</style>