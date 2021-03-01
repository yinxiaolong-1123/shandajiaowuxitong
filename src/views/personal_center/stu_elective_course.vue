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
						<el-form-item label="学期">
                            <el-select v-model="formYear">
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
            <el-table-column label="课程名称" prop="schedule_names"></el-table-column>
            <el-table-column label="上课时间" prop="schedule_section"></el-table-column>
            <el-table-column label="上课地点" prop="area_name"></el-table-column>
            <el-table-column label="人数上限" prop="max_stu_num" width="70"></el-table-column>
            <el-table-column label="剩余名额" prop="surplusNum" width="70"></el-table-column>
            <el-table-column label="开始报名时间" prop="start_date" width="140"></el-table-column>
            <el-table-column label="截止报名时间" prop="deadline_date" width="140"></el-table-column>
            <el-table-column label="选修说明" prop="option_remark"></el-table-column>
            <el-table-column label="操作" prop="conflict" width="80">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.type == -1" @click="getConflict(scope.row, scope.$index)" type="text">有冲突</el-button>
                    <el-checkbox v-else :disabled="scope.row.disabled" v-model="scope.row.checked" @change="chooseCourse(scope.row, scope.$index)">选修</el-checkbox>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <el-dialog
        :visible.sync="dialogVisible"
        :append-to-body="true"
        >
            <h4>{{conflictTitle}}</h4>
            <el-table :data="gridData">
                <el-table-column property="remark"></el-table-column>
            </el-table>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util';
    import moment from 'moment';

    import {mapState} from 'vuex';

    export default {
        name: "stu_elective_course",
        data() {
            return {
                breadcrumb: [
                    {label: "个人中心"},
                    {label: "选修"}
                ],
                conflictTitle: '',
                tableData: [],
                gridData: [],
                table1Loading: false,
                pageNo: 1,
                pageSize: 10,
                totalCout: 100,
                formYear: '',
                year: '',
                order_num: '',
                options1: [],
                visible2: false,
                checked: false,
                dialogVisible: false,
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
                            this.year = item.year
                            this.order_num = item.orderNum
                        }
                    })
                }
            }
        },
        created() {
            this.getTermData('学期')
        },
        methods: {
            // 获取当前学期
            getTermData(query) {
				if (!query) {
					query = "学期";
				}
				this.$http.get("_op:/terms/" + query).then(data => {
					if (data.code == 0) {
                        this.options1 = data.data
                        this.options1.forEach(item => {
                            if(item.name.indexOf('当前学期') != -1) {
                                this.formYear = item.id
                                this.year = item.year
                                this.order_num = item.orderNum
                            }
                        })
                        this.searchGetCourseList()
					} else {
						this.$message.error(data.msg);
					}
				});
            },
            // 查询选修课
            searchGetCourseList() {
                let nowDate = new Date()
                let user_id = JSON.parse(util.getStorage('vuex')).me.user.id
                let param = {
                    year:this.year.toString(),
                    order_num:this.order_num,
                    type:2,
                    user_id: user_id
                }
                this.$http.post('_ed:/scheduleVisualizing/queryOptionCourseList ',param).then(res => {
                    if(res.data.selectCourses == null) {
                        return this.tableData = []
                    }
                    if (res.data == null) {
                        return this.$message.error(res.msg)
                    } else{
                        
                        let queryData = JSON.parse(res.data.selectCourses)
                        queryData.forEach(item => {
                            if (item.type == 0) {
                                item["checked"] = false
                            }else{
                                item["checked"] = true
                            }
                            if (item.max_stu_num == 0) {
                                item['surplusNum'] = '不限'
                                item['max_stu_num'] = '不限'
                            }else{
                                item['surplusNum'] = item.max_stu_num - item.stu_num
                                item['max_stu_num'] = item.max_stu_num
                            }
                            if((nowDate > new Date(item.start_date) && nowDate < new Date(item.deadline_date)) && (item.surplusNum > 0 || item.max_stu_num == 0 || item.type == 1)) {
                                item.disabled = false
                            }else if ((nowDate < Date(item.start_date)) || nowDate > new Date(item.deadline_date) || (item.surplusNum < 1 && item.max_stu_num > 0  && item.type == 0)) {
                                item.disabled = true
                            }
                        })
                        this.tableData = queryData
                    }
                })
            },
            getConflict(row, index) {
                this.conflictTitle = row.conflict
                this.dialogVisible = true
                this.gridData = row.conflict_remark
            },
            isCheckedDisabled(row, index) {
                let user_id = JSON.parse(util.getStorage('vuex')).me.user.id
                if(row.type == 1) {
                    let param = {
                        schedule_id: row.schedule_id,
                        type:0,
                        user_id: user_id
                    }
                    this.$http.post('_ed:/scheduleVisualizing/queryOptionCourseClass', param).then(res => {
                        if(res.data == "") {
                            this.$message({
                                type: 'success',
                                message: '取消成功'
                            })
                            this.searchGetCourseList()
                        }else{
                            row.disabled = true
                            row.checked = false
                            return this.$message.error(JSON.parse(res.data).conflict)
                        }
                    })
                }else{
                    let param = {
                        schedule_id: row.schedule_id,
                        type:1,
                        user_id: user_id
                    }
                    this.$http.post('_ed:/scheduleVisualizing/queryOptionCourseClass', param).then(res => {
                        if (res.data == "") {
                            this.$message.success('报名成功')
                            this.searchGetCourseList()
                        }else{
                            row.disabled = true
                            row.checked = false
                            let response = res.data
                            return this.$message.error(JSON.parse(response).conflict)
                        }
                    })
                }
            },
             chooseCourse(row, index) {   
                this.isCheckedDisabled(row, index)   
            },
        }
    }
</script>

<style scoped lang="less">
    .detailBtn{
        text-align: center;
    }
    .btn{
        margin-bottom: 10px;
        margin-left: 8px;
    }
</style>