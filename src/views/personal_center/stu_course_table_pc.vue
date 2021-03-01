-<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
			<!-- 课程表查询 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
                
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':true}">
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
						<el-form-item label="学期">
                            <el-select v-model="formYear" style="width:240px">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchGetCourseList">查询</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
            :data="tableData" 
            border 
            size="mini"
            v-loading="table1Loading" 
            element-loading-text="加载中..." 
            header-row-class-name="cm-dark">
            <el-table-column label="序号" type="index" width="60px;"></el-table-column>
            <el-table-column label="学期" prop="stu_term_name" width="160px;"></el-table-column>
            <el-table-column label="课程名称" prop="course_cname"></el-table-column>
            <el-table-column label="阶段" prop="stage_note" width="60px;"></el-table-column>
            <el-table-column label="课程性质" prop="course_nature" width="80px;"></el-table-column>
            <el-table-column label="学时" prop="hours" width="50px;"></el-table-column>
            <el-table-column label="学分" prop="credit" width="50px;"></el-table-column>
            <el-table-column label="阶段成绩" prop="stage_grade" width="80px;"></el-table-column>
            <el-table-column label="课程成绩" prop="course_grade" width="90px;"></el-table-column>
            <el-table-column label="操作" prop="" width="60">
                <template slot-scope="scope">
                    <el-button type="text" slot="reference" @click="courseDetail(scope.row, scope.$index)">详情</el-button>
                    <!-- <el-popover
                        placement="bottom"
                        v-show="isShow"
                        width="80"
                        trigger="manual"
                        v-model="scope.row.visible">
                        <div class="detailBtn">
                            <el-button v-if="scope.row.stage_note > 1" @click="multipleTerm(scope.row, scope.$index)">多个学期</el-button>
                            <el-button v-else @click="singleTerm(scope.row, scope.$index)" class="btn">单个学期</el-button>
                        </div>
                    </el-popover> -->
                    <el-dialog
                    :title="titleName + '成绩明细'"
                    :visible.sync="centerDialogVisible1"
                    
                    :append-to-body="true"
                    center>
                    <div v-loading="dialogLoading">
                        <p :class="[singleItem.type == 1 ? 'singleTermStyle' : 'singleTermLess']" v-for="(singleItem, singleIndex) in  singleTermConut" :key="singleIndex">{{singleItem.type_name}}</p>
                    </div>
                    </el-dialog>
                    <el-dialog
                    title="口腔临床药物学成绩明细"
                    :visible.sync="centerDialogVisible"
                    :append-to-body="true"
                    center>
                    <div v-loading="dialog1Loading">
                        <p :class="[singleItem.type == 1 ? 'singleTermStyle' : 'singleTermLess']" v-for="(singleItem, singleIndex) in  singleTermConut" :key="singleIndex">{{singleItem.type_name}}</p>
                    </div>
                    </el-dialog>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <!-- <div style="float:right; margin-right:10px;">
            <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCout">
            </el-pagination>
        </div> -->
    </section>
</template>

<script>
    import util from '@/util';
    import moment from 'moment';

    import {mapState} from 'vuex';

    export default {
        name: "course_table_pc",
        data() {
            return {
                breadcrumb: [
                    {label: "个人中心"},
                    {label: "成绩查询"}
                ],
                tableData: [
                    // {term: '0000', name: '化学', courseType: '11', xueshi: '2', xuefeng: '3', jieduan: '23', keChengCourse: '56'}
                ],
                titleName: '',
                table1Loading: false,
                pageNo: 1,
                pageSize: 10,
                totalCout: 100,
                formYear: '',
                options1: [],
                visible2: false,
                centerDialogVisible: false,
                centerDialogVisible1: false,
                isShow: true,
                dialogLoading: false,
                dialog1Loading: false,
                stu_term: '',
                singleTermConut: [],
            }
        },
        computed:{
			
        },
 
		watch:{
            formYear() {
                const search = this.formYear
                if (search) {
                    this.options1.forEach(item => {
                        if (search == item.id) {
                            return this.stu_term = item.name.slice(0,15)
                        }
                    })
                }
            }
        },
        created() {
            this.getTermData()
        },
        mounted() {
        },
        methods: {
            // 获取当前学期
            getTermData(query) {
				if (!query) {
					query = "学期";
				}
				this.$http.get("_op:/terms/" + query).then(data => {
					if (data.code == 0) {
                        let sortData = data.data
                        sortData.sort((a, b) => {
                            return b.year - a.year
                        })
                        this.options1 = sortData
                        this.options1.forEach(item => {
                            if(item.name.indexOf('当前学期') != -1) {
                                this.formYear = item.id
                                this.stu_term = item.name.slice(0,15)
                            }
                            
                        })
                        this.searchGetCourseList()
					} else {
						this.$message.error(data.msg);
					}
				});
            },
            // 查询成绩
            searchGetCourseList() {
                this.tableData = []
                let stuNum = JSON.parse(util.getStorage('vuex')).me.user.username
                let termId = this.formYear
                let param = {
                    studentNo : stuNum,
                    termId: termId
                }
                this.$http.post('_sc:/scoreQueryManage/queryStdWxScore',param).then(res => {
                    if(res.data == '{}') {
                        return this.$message.error('该学期没有成绩')
                    }else{
                        let tableDataPopver = JSON.parse(res.data)
                        tableDataPopver.forEach(element => {
                            element['stu_term_name'] = this.stu_term
                        });
                        this.tableData = tableDataPopver
                    }  
                })
            },
            // 详情
            courseDetail(row, index) {
                let rowData = row
                let indexData = index
                if(row.stage_note > 1) {
                    this.titleName = row.course_cname
                    this.multipleTerm(rowData, indexData)
                }else{
                    this.titleName = row.course_cname
                    this.singleTerm(rowData, indexData)
                }
            },
            // // 分页
            // sizeChange() {
            //     alert('00')
            // },
            // currentChange() {
            //     alert('11')
            // },
            // 单个学期
            singleTerm(row,index) {
                this.dialogLoading = true
                let stuNum = JSON.parse(util.getStorage('vuex')).me.user.username
                this.centerDialogVisible1 = true
                let param = {
                    stuScoreId: row.stu_score_id
                }
                this.$http.post('_sc:/scoreQueryManage/queryStudnetScoreDetail',param).then(res => {
                    let singleData = JSON.parse(res.data)
                    this.singleTermConut = singleData
                    this.dialogLoading = false
                })
            },
            // 多个学期 
            multipleTerm(row,index) { 
                this.dialog1Loading = true
                this.centerDialogVisible = true
                let stuNum = JSON.parse(util.getStorage('vuex')).me.user.username
                let param = {
                    stuScoreId: row.stu_score_id
                }
                this.$http.post('_sc:/scoreQueryManage/queryStudnetScoreDetail',param).then(res => {
                    let singleData = JSON.parse(res.data)
                    this.singleTermConut = singleData
                    this.dialog1Loading = false
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .singleTermStyle{
        font-size: 18px;
        font-weight:bold
    }
    .singleTermLess{
        font-size: 14px;
        margin-left: 20px;
    }
    .cm-table{
        position: relative;
    }
    .detailBtn{
        text-align: center;
    }
    .btn{
        margin-bottom: 10px;
        margin-left: 8px;
    }
</style>