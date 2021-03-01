<template>
    <section class="cm-container">
        <!-- 学籍核定信息设置 -->
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <p class="topinfo">排序说明：学生与学籍科修改均按照排序进行显示  &nbsp;&nbsp;&nbsp;&nbsp;
        	1-99 标示基本信息&nbsp;&nbsp;  
        	101-199 标示家庭信息&nbsp;&nbsp;   
        	201-299 学历信息&nbsp;&nbsp;  
        	300-399 上一层次信息
        </p>
        <div class="cm-table">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    style="width: 100%"
                    header-row-class-name="cm-dark">
                <el-table-column prop="orderNum" label="排序" width="80"></el-table-column>
                <el-table-column prop="fieldInfo" label="字段信息"></el-table-column>
                <el-table-column label="学生可见字段开关">
                	<template slot-scope="scope">
                		<el-switch
                			@change="changeData(scope.row)"
						  	v-model="scope.row.visible"
						  	active-color="#13ce66"
						  	inactive-color="#C0C4CC">
						</el-switch>
                	</template>
                </el-table-column>
                <el-table-column label="学生必填开关（可修改）">
                	<template slot-scope="scope">
                		<el-switch
                			@change="changeData(scope.row)"
						  	v-model="scope.row.modify"
						  	active-color="#13ce66"
						  	inactive-color="#C0C4CC">
						</el-switch>
                	</template>
                </el-table-column>
                
                
            </el-table>
        </div>
    </section>
</template>

<script>
    import util from '@/util'
    export default {
        name: "student_verify",
        data() {
            return {
                breadcrumb: [
                    {label: "学生管理"},
                    {label: "学籍核定信息设置"},
                ],
                tableData: [],
                
                tableList:[
                    {label:'国家专业代码', prop:'code'    ,},
                    {label:'国家专业名称', prop:'name'    ,},
                    {label:'国家专业代码', prop:'creator' ,},
                    {label:'创建日期', prop:'date'       ,},
                ],
                
            }
        },
        components:{
        	
        },
        methods: {
            getTableData(){
                this.$http.get('_op:/stuconfigs',{ 
                }).then(data=>{
                    this.tableData=data.data;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
            changeData(row){
   
                this.$http.put('_op:/stuconfigs',{
                	fieldInfo: row.fieldInfo,
					fieldName: row.fieldName,
					id: row.id,
					modify: row.modify,
					orderNum: row.orderNum,
					visible: row.visible
                }).then(data=>{
                	if(data.code===0){
                		this.$message({
				          	message: '设置成功！',
				          	type: 'success'
				        });
                	}
                }).catch(()=>{
                })
            }
        },
        created(){
        	this.getTableData()
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        }
    }
</script>

<style scoped lang="less">
.topinfo{font-weight: bold;margin-bottom: 20px;}
</style>