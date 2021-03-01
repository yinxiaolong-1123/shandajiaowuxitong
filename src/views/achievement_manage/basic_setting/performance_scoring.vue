<template>
    <section class="cm-container">
        <!-- 成绩计分方式 -->
        <div class="cm-breadcrumb">  
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <div class="cm-table" >
            <el-table
                v-loading="tableLoading"
        		size="mini"
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
                <el-table-column prop="code" label="代码" width="200"></el-table-column>
                <el-table-column prop="cnName" label="名称" width="200"></el-table-column>
                <el-table-column prop="remark" label="描述"></el-table-column>
                <el-table-column prop="status" label="开关识别" width="200">
                   <template slot-scope="scope" v-if="btnPerObj.switch" >
                		<el-switch
                        
                			@change="changeData(scope.row)"
						  	v-model='scope.row.status'
						  	active-color="#409eff"
						  	inactive-color="#C0C4CC">
                             
						</el-switch>
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
            >
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import util from '@/util'
    const TYPE='teaching-management';
    const REMARK='成绩计分方式';
    import {mapState} from 'vuex'//1
    export default {
        name: TYPE,
        data() {
            return {
                type:REMARK,
                breadcrumb: [
                    {label: "成绩管理"},
                    {label: REMARK},
                ],
                tableData: [],//数据
                pageNo: 1,
                pageSize: 20,
                totalCount:0,
                param:{
                 type: "SCORE_METHOD"
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                btnPerObj:{//按钮权限
					switch:false,
				}
            }
        },
        watch: {
        },
        mounted(){
             
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限
        },
        created(){
            this.getScoringList();//请求列表
        },
        computed:{
            ...mapState(['btnPermitList']),
        },
        filters:{},
        methods: {
           //获取按钮权限  
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
						if (item.code=="switch_chengjijifenfangshi") {
	            		self.btnPerObj.switch=true;
	            	}
	            	
                    });
                }).catch(()=>{
                })
            },
            // 专业列表
             getScoringList(){
                  this.tableLoading=true;
        		this.$http.post("_sc:/scoreSetting/list",{
                    pageNo: 1,
                    pageSize: 10,
                    param: {
                        type: "SCORE_METHOD"
                    }
                }).then(data=>{
                   this.tableLoading=false;
                   if(data.data.result){
                    let num=data.data.result;//开关状态转换  
                    for(let i=0;i<num.length;i++){
                       if(num[i].status==1){
                            num[i].status=true;
                       }
                        if(num[i].status==0){
                            num[i].status=false;
                       }
                        this.tableData=num;
                        this.totalCount = num.length;
                    }
                   }
                }).catch((err)=>{
                    this.$message(`${err.msg}`)
                     this.tableLoading=true;
                })
            },
            // 开关控制  
                changeData(row){
                    this.$http.put('_sc:/scoreSetting',{
                        cnName:row.cnName,//名称？
                        code:row.code, 
                        id:row.id, 
                        status:row.status?1:0, 
                        type:row.type, 
                    }).then(data=>{
                        if(data.code===0){
                            this.$message({
                                message: '设置成功！',
                                type: 'success'
                            });
                            this.getScoringList()
                        }
                    }).catch((err)=>{
                        this.$message.error(err.msg)
                    })
            },
            sizeChange(size){
                this.pageNo=1;
                this.pageSize=size;
            }
        }
    }
</script>

<style scoped lang="less">
.cm-table{
    margin-top: 25px;
}
</style>
