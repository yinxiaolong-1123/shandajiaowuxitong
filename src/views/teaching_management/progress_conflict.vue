<!-- 冲突明细 -->
<template>
    <el-dialog title="冲突及异常明细" :visible.sync="dialogShow" width="85%" :modal-append-to-body="false">
        <div class="cm-table" v-loading="conflictLoading">
            <el-tabs v-model="activeName"  @tab-click="handleTabChange">
                <el-tab-pane name="first">
                    <span slot="label"> 场地冲突 (<span style="color:red">{{conflictnums[0]}}</span>)</span>
                    <el-table
                        ref=""
                        :data="dialogdelist1"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">

                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="场地" prop="area_name" > </el-table-column>
                        <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                        <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                        <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                        <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                        <el-table-column label="上课班" prop="cls_name"  width="300"> </el-table-column>
                        <el-table-column label="小组" prop="group_names"  width="130"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane  name="second">
                    <span slot="label"> 老师冲突 (<span style="color:red">{{conflictnums[1]}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="dialogdelist1"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">
                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="老师" prop="teacher_name"  width="80"> </el-table-column>
                        <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                        <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                        <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                        <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                        <el-table-column label="小组" prop="group_names"  width="250"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="小组冲突" name="third">
                    <span slot="label"> 小组冲突 (<span style="color:red">{{conflictnums[2]}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="dialogdelist1"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">
                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                        <el-table-column label="上课班" prop="cls_name" > </el-table-column>
                        <el-table-column label="小组" prop="group_names"  width="180"> </el-table-column>
                        <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                        <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                        <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="学生冲突" name="fourth">
                    <span slot="label"> 学生冲突 (<span style="color:red">{{conflictnums[3]}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="dialogdelist1"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">

                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="姓名" prop="stu_name" width="80"> </el-table-column>
                        <el-table-column label="行政班" prop="admin_name" width="160"> </el-table-column>
                        <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                        <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"  width="60"> </el-table-column>
                        <el-table-column label="排课课程" prop="course_arrange"> </el-table-column>
                        <el-table-column label="年级" prop="grade" width="60"> </el-table-column>
                        <el-table-column label="上课班" prop="cls_name" width="300"> </el-table-column>
                        <el-table-column label="小组" prop="group_names"  width="170"> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="未填报内容或老师" name="fifth">
                    <span slot="label"> 未填报内容或老师 (<span style="color:red">{{conflictnums[4]}}</span>)</span>
                    <el-table    
                        ref=""
                        :data="dialogdelist1"
                        border
                        style="width: 100%"
                        height="400px"
                        header-row-class-name="cm-dark">

                        <el-table-column label="序号" type="index" width="50"> </el-table-column>
                        <el-table-column label="日期" prop="schedule_item_date" width="100"> </el-table-column>
                        <el-table-column label="周次" prop="week"  width="50"> </el-table-column>
                        <el-table-column label="星期" prop="weekday" width="50"> </el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"  width="75"> </el-table-column>
                        <el-table-column label="上课小组" prop="group_names"  width="170"> </el-table-column>
                        <el-table-column label="上课场地" prop="area_name" > </el-table-column>
                        <el-table-column label="上课内容" prop="teaching_content"></el-table-column>
                        <el-table-column label="上课老师" prop="teacher_names" width="100"> </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="cm-pagination" style="padding-top:10px;">
                <el-pagination
                    background
                    layout="total,prev, pager, next"
                    :total="totalCount2"
                    :current-page.sync="currentPage2"
                    :page-size.sync="pageSize2"
                    @current-change="getconflictdelis">
                </el-pagination>
            </div>
        </div>
        <div style=" text-align: right;">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="colsedatamsg">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            loading: {
                default:false,
                type: Boolean,
            },
        },
        data() {
            return {
                dialogShow:false,
                conflictLoading:false,
                activeName:'first',
                currentPage2:1,
                conflictnums:[0,0,0,0,0],
                dialogdelist1:[],
                totalCount2:0,
                pageSize2:50,
                schedule_id:'',
                fallYear:'',
                semesterNum:'',
            }
        },
        created(){
            
        },
        watch: {
            
        },
        computed:{
            
        },
        methods: {
            handleTabChange(){
                this.currentPage2 = 1;
                this.getconflictdelis();
            },
            getconflictdelis(currentPage=1){
                this.dialogdelist1 = [];
                let tempObj = {first:1,second:2,third:3,fourth:4,fifth:5};
                let query = {
                    pageNo:currentPage,
                    pageSize:this.pageSize2,
                    param:{
                        schedule_id:this.schedule_id,
                        checkType:tempObj[this.activeName],
                        semester_year:this.fallYear,
                        semester_year_number:this.semesterNum,
                    },  
                };
                this.conflictLoading = true;
                this.$http.post('_ed:/schedule/check/typeCheckSchedule',query).then(res=>{
                    this.dialogdelist1 = res.data && res.data.result || [];
                    this.totalCount2 = res.data && res.data.totalCount || 0;
                    this.conflictLoading = false;
                })
            },
            openDialog(row){
                this.schedule_id = row.id;
                this.fallYear = row.semester_year;
                this.semesterNum = row.semester_year_number;
                this.currentPage2 = 1;
                this.$emit('update:loading', true);
                this.totalconflict(row);
            },
            // 统计冲突总条数
            totalconflict(row){
                return this.$http.post("_ed:/schedule/totalconflict", {
                    id: row.id,
                    create_user: '',
                    create_username: ""
                }).then(data=>{
                    this.$emit('update:loading', false);
                    if(data.data&&data.data.length==0 || !data.data){
                        this.$message.error(data.msg);
                        return;
                    }
                    this.dialogShow = true;
                    let datamsglist = JSON.parse(data.data);
                    this.conflictnums = datamsglist.map(item=>item.conflict_type_num);
                    this.getconflictdelis();
                })
            },
            colsedatamsg(){ //关闭冲突弹框
                this.dialogShow = false;
            },
        }
    }
</script>

<style scoped>
    
</style>
