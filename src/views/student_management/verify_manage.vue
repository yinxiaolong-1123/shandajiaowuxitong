<template>
    <section class="cm-container">
        <!-- 学生信息核对管理 -->
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="cm-fold">
            <el-form :inline="true" size="medium" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        
                        <el-form-item label="所在级">
                            <intelligent-year-picker v-model="enrollmentYear" type="year" value-format="yyyy" placeholder="请选择">  </intelligent-year-picker>
                        </el-form-item>
                     
                        <el-form-item label="专业">
							<el-select v-model="major" placeholder="请选择" clearable filterable>
							    <el-option 
							    	v-for="item in majorList" 
							    	:key="item.id" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        <el-form-item label="学生反馈">
						<el-select v-model="status" placeholder="请选择" clearable filterable>
						    <el-option label="全部" value="1"> </el-option>
						    <el-option label="有异议" value="2"> </el-option>
						    <el-option label="无异议" value="3"> </el-option>
						</el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="medium" @click="onSubmit">下发核对</el-button>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="medium" @click="getTableData">查询</el-button>
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
                    header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>

                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="spellName" label="拼音"></el-table-column>
                <el-table-column prop="enrollmentYear" label="所在级"></el-table-column>
                <el-table-column prop="major" label="专业"></el-table-column>
                <el-table-column prop="className" label="行政班"></el-table-column>
                <el-table-column prop="status" label="学生反馈结果"></el-table-column>

                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="verifyBtn(scope.row)" type="text" size="small">核对修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <div class="cm-pagination">
            <el-pagination
                    background
                    :current-page="tablePage.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="tablePage.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tablePage.total"
                    @size-change="sizeChange"
                    @current-change="currentChange">
            </el-pagination>
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
                    {label: "学生信息核对管理"},
                ],
                tableData: [
                    {
                      stuNum:20181002012,
                      name:"加菲猫",
                      spellName:"jiafeimao",
                      enrollmentYear:"2018",
                      major:"计算机",
                      className:"行政软件部",
                      status:1
                    },
                    {
                      stuNum:20181002012,
                      name:"加菲猫",
                      spellName:"jiafeimao",
                      enrollmentYear:"2018",
                      major:"计算机",
                      className:"行政软件部",
                      status:1
                    }
                ],
                enrollmentYear:'',
                major:'',
                status:'',
                majorList:[],//专业
                
                
                
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                formInline: {
                    user: '',
                    region: ''
                },
                tablePage: {
                    current: 1,
                    size: 10,
                    total:0,
                },
            }
        },
        methods: {
            collapseShow(){
                this.fold.state=!this.fold.state;
                this.fold.text=this.fold.state?'收起':'展开';
            },
            getTableData(){
				this.$http.post("_op:/students/verifyInfo",{
                	pageNo:this.tablePage.current,
                	pageSize:this.tablePage.size,
                	param:{
                		enrollmentYear:this.enrollmentYear,
                		major:this.major,
                		status:this.status
                	}
                }).then(data=>{
                    // this.tableData=data.data.records;
                    this.tablePage.total=data.data.total;
                }).catch(()=>{
                    // this.tableData=[];
                })
            },
            sizeChange(size){
                this.tablePage.current=1;
                this.tablePage.size=size;
                this.getTableData();
            },
            currentChange(current){
                this.tablePage.current=current;
                this.getTableData();
            },
            getMajorCategory(){//专业
            	this.$http.post('_op:/majorCategory/getMajorCategoryList',{
            	}).then(data=>{
            		this.majorList=data.data
                }).catch(()=>{
                })
            },
            onSubmit() {
                console.log('submit!');
            },
            verifyBtn(row){
            	this.$router.push({
		  			name:'verify_student',
		        	query:{
		        		stuid:row.id
		        	}
			  	})
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
        	this.getMajorCategory();
        }
    }
</script>

<style scoped lang="less">

</style>