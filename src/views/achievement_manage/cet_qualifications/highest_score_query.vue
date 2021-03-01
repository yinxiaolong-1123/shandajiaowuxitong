<template>
    <section class="cm-container">
        <!-- 成绩类型 -->
        <div class="cm-breadcrumb cm-bt-1px">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold pd-6">
            <el-form :inline="true" size="mini" :model="param">
                <div class="fold fold-lt">
                    <div ref="formDetail" class="detail">
                         <el-form-item label="课程">
                            <el-select 
                            filterable
                                v-model="param.course"
                                clearable
                                
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学号">
                            <el-input v-model="param.studentNo" placeholder="请输入学号" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="param.studentName" placeholder="请输入中文名称" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"  v-if="btnPerObj.query" >查询</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        
            <div class="cm-table">
            <el-table
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                 v-loading="tableLoading"
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="studentNo" label="学号" width="120"></el-table-column>
                <el-table-column prop="studentName" label="姓名" width="120"></el-table-column>
                <el-table-column prop="grade" label="所在级" width="70"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班" ></el-table-column>
                <el-table-column prop="majorName" label="专业"></el-table-column>
                <el-table-column prop="courseName" label="课程"></el-table-column>
                <el-table-column prop="maxScore" label="历史最高分" width="100"></el-table-column>
                <el-table-column prop="termName" label="历史最高分学期" width="160"></el-table-column>
                <el-table-column prop="candidateNum" label="最高分准考证号" width="180"></el-table-column>
                <el-table-column prop="textNums" label="参考次数" width="100"></el-table-column>
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
    </section>
</template>

<script>
    //接口未调用
    import util from '@/util'
    import {mapState} from 'vuex'//1
    //每个模块的type 和remark是固定不允许改变的
    const TYPE='degree-category';
    const REMARK='成绩类型';
    const dictionaryCode = "GJKS"
    export default {
        name: TYPE,
        data() {
            
            return {
                scoreType:'',
                remark:REMARK,
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "国家考最高分成绩查询"},
                ],
                param:{
                    course:"",
                    studentNo:"",
                    studentName:""
                  
                },
                options1:[],//课程数据
                formLabelWidth: '100px',
                rules: {
                   codes: [ { required: true, message: '请输入代码', trigger: 'blur' } ],
                   name: [{ required: true, message: '请输入名称', trigger: 'change' }]},
                tableData: [],
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                tableLoading:false,
                 btnPerObj:{//按钮权限
                  query:false,
                 
                },
                newData:[]
            }
        },
        watch:{  },
        methods: {
          //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                 
                    data.data.map(item => {
                        if (item.code=="query_guojiakaoshizuigaofen") {
                            self.btnPerObj.query=true;
                        }
                    });
                }).catch(()=>{
                })
            },
            getCourseList(){
                let param ='EXAM_TYPE'
                this.$http.get("_sc:/scoreSetting/combox/"+param).then(data=>{
                  
                    data.data.map(item=>{
                     
                        if(item.name=='国家考试'){
                           this.scoreType=item.id;
            
                        //    this.getTermData(this.scoreType)
                           this.getHighestScoreData(this.scoreType);
                        }
                    })

                })

            },
              // 课程列表获取
            getTermData(){
               
                 let query = dictionaryCode
                    this.$http.get("_op:/course/getCourseByCategoryCode/"+query).then(res=>{
                        this.options1 = res.data;
                    
                    }).catch(err=>{

                    })
            },
             // 查询
            search(){
                this.pageNo=1;
                this.getHighestScoreData(this.scoreType);
            },
            // 查询列表方法
            getHighestScoreData(id){//查询列表
            this.tableLoading=true;
            this.$http.post('_sc:/cetEnrollQualification/listNationalTestMaxScore',{
                
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                param:{
                      examTypeCode:dictionaryCode,
               
                    course:this.param.course,
                    studentNo:this.param.studentNo,
                    studentName:this.param.studentName,
                }
            }).then(data=>{
                    this.tableData=data.data.result;
                    this.pageNo=data.data.pageNo;
                    this.pageSize=data.data.pageSize;
                    this.totalCount=data.data.totalCount;
                    this.tableLoading=false;
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=false;
                })
            },
          
            // 删除
               deleteDetailData(row){ 
                this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
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
          
            // 显示条数
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getHighestScoreData(this.scoreType);//获取数据列表
            },
            // 分页
            currentChange(current){
                    this.pageNo = current;
                    this.getHighestScoreData(this.scoreType);//获取数据列表
             }
            
          
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
             
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            //  this.getHighestScoreData();//获取数据列表
             this.getTermData();//调用课程数据
              this.getCourseList();//课程列表 获取ID请求课程
        },
        computed:{
            showExtend(){
                return JSON.stringify(this.extendList)==='{}';
            },
        }
    }
</script>

<style scoped lang="less">
.cm-table /deep/ .el-table--mini td{
    padding: 5px 0;
}
</style>
