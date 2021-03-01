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
                    <div ref="formDetail" class="detail-show-2">
                        <el-form-item label="CET类型">
                            <el-select v-model="param.course"  clearable>
                                <el-option v-for="(list,index) in gradeList" :key="list.name" :label="list.name" :value="index" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学号">
                            <el-input v-model="param.studentNo" placeholder="请输入学号" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="param.studentName" placeholder="请输入姓名" onkeyup="this.value=this.value.trim();" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="addAchievementType">导出查询数据</el-button>
                            <a v-show="false" ref="exportExcel"></a>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
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
                <el-table-column prop="studentName" label="姓名"  width="120"></el-table-column>
                <el-table-column prop="grade" label="所在级" width="70"></el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班" ></el-table-column>
                <el-table-column prop="majorName" label="专业"></el-table-column>
                <el-table-column prop="maxScore" label="历史最高分" width="100"></el-table-column>
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

    export default {
        name: TYPE,
        data() {
            // let commonRules=msg=>{
            //     return {required: true, message: '请输入'+REMARK + msg, trigger: 'blur' }
            // };
            return {
                remark:REMARK,
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "CET报名资格查询"},
                ],
                formLabelWidth: '100px',
                tableData: [],
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                param:{
                    course:0,
                    studentNo:"",
                    studentName:""
                },
                gradeList:[],
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                tableLoading:false,
                newIndex:""
            }
        },
        watch:{ },
          created(){
            //  this.getTableData();
             this.getCETData();//请求CET类型数据
        },
        methods: {
            // 请求CET类型
            getCETData(){
                let  aaa="CET"
                // /course/getCourseByRemark/{remark}
               
                this.$http.get("_op:/course/getCourseByRemark/"+aaa).then(data=>{
                    
                   this.gradeList=data.data
                  
                this.getTableData();
                }).catch(()=>{

                })

            },
             // 查询
            search(){
                this.pageNo=1;
                this.getTableData();
            },
            // 查询列表方法
            getTableData(){//查询列表
            // this.tableLoading=true;
            let self = this 
            let param = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                param:{
                    course:self.gradeList[self.param.course].id,
                    studentNo:self.param.studentNo,
                    studentName:self.param.studentName

                }
            }
            this.$http.post('_sc:/cetEnrollQualification/listStuCetQualification',param).then(data=>{
                this.tableLoading=false;
                if (data.code === 0) {
                   
                    this.tableData=data.data.result;
                    this.pageNo=data.data.pageNo;
                    this.pageSize=data.data.pageSize;
                    this.totalCount=data.data.totalCount;
                    this.tableLoading=false;
                    } else {
                        
                    }
                }).catch(()=>{
                    this.tableData=[];
                    this.tableLoading=true;
                }) 
            },
            //导出查询数据   responseType: "json",
             addAchievementType() {    
                    this.$http2.post("/score/management/cetEnrollQualification/exportResult",{
                        course:this.gradeList[this.param.course].id,
                        studentNo:this.param.studentNo,
                        studentName:this.param.studentName,
                    }).then(data => {
                        let url = window.URL.createObjectURL(new Blob([data]));
                        let y = this.$refs.exportExcel;
                        y.href = url;
                        y.setAttribute("download", "导出文件.xlsx");
                        y.click();
                        window.URL.revokeObjectURL(url);
                    });
                },
          // 显示条数
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
                this.getTableData();//获取数据列表
            },
            // 分页
            currentChange(current){
                    this.pageNo = current;
                    this.getTableData();//获取数据列表
             }
        },
        mounted(){},
      
        computed:{}
    }
</script>

<style scoped lang="less">
.cm-table /deep/ .el-table--mini td{
    padding: 4px 0;
}
</style>
