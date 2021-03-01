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
                         <el-form-item label="课程">
                            <el-select 
                                v-model="param.course"
                                clearable
                                filterable
                               
                                placeholder="全部">
                                <el-option v-for="item in options1"  :key="item.id" :label="item.name" :value="item.id" ></el-option>
                            </el-select>
                        </el-form-item>
                       <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="param.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="专业" prop="major">
                            <el-select
                            clearable
                            filterable
                             v-model="param.major"
                             filterable
                             placeholder="请选择专业">
                              <el-option v-for="item in majorArr" :key="item.id" :label="item.name" :value="item.id" :label-width="formLabelWidth"></el-option>
                            </el-select>
                          </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"   v-if="btnPerObj.query"  >查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="addAchievementType"  v-if="btnPerObj.printing" >打印</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        
            <div class="cm-table">
           
            <div  id="tableData">
                   <table class="stationtable" >
                <tr>
                    <th style="width=50px;">序号</th>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>行政班</th>
                    <th>所在级</th>
                    <th>专业</th>
                    <th>课程</th>
                    <th>历史最高分</th>
                    <th>历史最高分学期</th>
                    <th>最高分准考证号</th>
                    <th style="width=100px;">参考次数</th>
                </tr>
                <template v-for="(item1,index1) in tableData">
                    <tr>
                        <td>{{index1+1}}</td>
                        <td>{{item1.studentNo}}</td>
                        <td>{{item1.studentName}}</td>
                        <td>{{item1.administrativeClassName}}</td>
                        <td>{{item1.grade}}</td>
                        <td>{{item1.majorName}}</td>
                        <td>{{item1.courseName}}</td>
                        <td>{{item1.maxScore}}</td>
                        <td>{{item1.termName}}</td>
                        <td>{{item1.candidateNum}}</td>
                        <td>{{item1.textNums}}</td>
                    </tr>
                </template>
            </table>
                
            </div>
         
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
                remark:REMARK,
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: "国家考毕业归档"},
                ],
                majorArr:"",//专业
                options1:[],//课程
                formLabelWidth: '100px',
                tableData: [ ],//表格数据
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                param:{//搜索
                    course:'',
                    grade:'',
                    major:""
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                tableLoading:false,
                 btnPerObj:{//按钮权限
                  query:false,
                  printing:false
                 
                }
            }
        },
        watch:{},
        methods: {
             //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                   
                    data.data.map(item => {
                        if (item.code=="query_guojiakaoshibiyeguidang") {
                            self.btnPerObj.query=true;
                        }
                        if (item.code=="printing_guojiakaoshibiyeguidang") {
                            self.btnPerObj.printing=true;
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
                           let scoreType=item.id;
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
            // 专业数据获取
            getMajorList(){
            this.$http.get('_op:/major/combox').then(data=>{
                if(data.code==0){
                    this.majorArr = data.data;
                }else{
                this.$message.error(data.msg);
                }
              })
            },
            // 搜索列表
            search(){
                this.pageNo=1;
                this.getTableData();
            },
            // 查询列表方法
            getTableData(){//查询列表
            this.tableLoading=true;
            this.$http.post('_sc:/cetEnrollQualification/listNationalTestGradArch',{
               pageNo: this.pageNo,
                pageSize: this.pageSize,
                param: {
                    examTypeCode:dictionaryCode,
                    course:this.param.course,
                    grade:this.param.grade,
                    major:this.param.major
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
          //打印
          addAchievementType(){
              var newstr = document.getElementById("tableData").innerHTML;//得到需要打印的元素HTML
            var oldstr = document.body.innerHTML;//保存当前页面的HTML
            document.body.innerHTML = newstr;
            window.print();
            document.body.innerHTML = oldstr;
            return false; 


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
        mounted(){ 
             
            util.openBtnPermit(this.btnPerObj);
      
        },
        created(){
             this.getTableData();//请求列表
             this.getTermData();//请求课程
             this.getMajorList();//专业列表获取
               this.getCourseList();//课程列表 获取ID请求课程
        },
        computed:{}
    }
</script>

<style scoped lang="less">

@media print {
   body {
      color: #000;
      background: #fff;
   }
   td{
       border: 1px  solid red;

   }
   th{
      border: 1px  solid red;  
   }

}
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
  	margin-bottom: 20px;
  	th {
	  	background-color: #eef1f6;
	    height: 40px;
          border: 1px solid #dfe6ec;
          font-size: 13px;
	}
	td {
        height: 18px;
        padding: 6px 0;
          border: 1px solid #dfe6ec;
          font-size: 13px;
	}
	.bluetext{cursor: pointer;color: #409EFF;font-size: 10px;}
}
</style>
