<!--学时统计-->
<template>
	<section class="cm-container" v-loading="tableLoading" element-loading-text="加载中...">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-fold">
            <div class="period-head">
                <div class="fold-head-left">
                    <el-form :inline="true" size="mini">
                        <el-form-item label="学期" style="display:block;">
                            <el-checkbox-group v-model="terms" class="checkbox-group" @change="onTermsChange">
                                <el-checkbox v-for="(item,i) in semesterList" :label="item.id">
                                    {{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="课程">
                            <el-select 
								v-model="semesterCourseId" 
								placeholder="请选择" 
								clearable 
								filterable
                                @change="onCourseChange">
							    <el-option 
							    	v-for="(item,index) in semesterCourseList" 
							    	:key="item.id" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                        <el-form-item label="单位" v-show="showTab == 3 || showTab == 2">
                            <span v-show="this.showTab == 2" style="position: absolute;left: -48px;top: 2px;color: red;">*</span>
                            <el-select v-model="departid" filterable placeholder="请选择"
							    clearable
                                @change="onDepartChange">
								<el-option
									v-for="(item,i) in branchList"
									:key="i"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>

                        </el-form-item>
                        <el-form-item label="课室单位" v-show="showTab == 3">
                            <el-select v-model="sectionid" filterable placeholder="请选择"
							    clearable
                                @change="onSectionChange">
								<el-option
									v-for="(item,i) in departmentList"
									:key="i"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
                        </el-form-item>
                        <el-form-item label="老师">
                            <el-select 
								v-model="teacherMsg" 
								placeholder="请选择" 
                                value-key="id"
								clearable 
								filterable
								remote
								:remote-method="getTeachers"
								:loading="teacherListLoading"
                                @change="onTeacherChange">
							    <el-option 
							    	v-for="item in teacherList" 
							    	:key="item.id" 
							    	:label="item.name" 
							    	:value="item"> 
							    </el-option>
							</el-select>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="fold-head-right">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="queryScheduleAssignHours">
                        查询
                    </el-button>
                    <el-button
                        size="mini"
                        @click="exportScheduleAssignHours">
                        导出
                    </el-button>
                    <a v-show="false" ref="exportExcel"></a>
                </div>
            </div>

        </div>
        <div class="cm-table">
            <el-table
                v-show="tableShow"
                :max-height="innerHeight-200"
                :data="tableData"
                border
                size="mini"
                show-summary
                sum-text="总合计"
                header-row-class-name="cm-dark">
                
                <el-table-column prop="teacher_no" label="工号" fixed="left">
                </el-table-column>
                <el-table-column prop="teachername" label="教师" fixed="left">
                </el-table-column>
                <el-table-column v-for="(item,i) in formList" :prop="item.id.toString()" :label="item.name">
                    <template slot-scope="scope">
                        <div @click="showDetail(scope.row,item.name,item.id)">
                            <span :style="scope.row[item.id.toString()]?'color:#409EFF;':''">
                                {{scope.row[item.id.toString()]}}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="assign_hours" label="总学时" fixed="right">
                    <template slot-scope="scope">
                        <div @click="showDetail(scope.row,'所有')">
                            <span :style="scope.row.assign_hours?'color:#409EFF;':''">
                                {{scope.row.assign_hours}}
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

        </div>
	</section>

</template>

<script>
	export default {
		data(){
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "学时统计"}
                    
                ],
                departid:'',
                branchList: [],
                sectionid:'',
                terms:[],
                termsBak:[],

                // 数据格式 [{teacher_no:23,teachername:'',assign_hours:'',90:5}]
                tableData:[],
                tableLoading:false,
                formList:[],
                innerHeight:window.screen.availHeight,
                semesterList:[],
                
                teacherMsg:{
                    id: 0,
                    name: ''
                },
                teacherList:[],
                teacherListLoading:false,

                semesterCourseId:'',
                semesterCourseList:[],

                departmentList:[],
                tableShow:false,
                showTab: 0
			}
		},
		mounted(){
            this.getQueryData();
            this.getSemester();
            this.queryFormList();
            this.getTeachers().then(()=>{
                let teacher = this.$route.query.teacher || '';
                if(teacher){
                    if(!this.teacherList.find(item=>item.id==JSON.parse(teacher).id)){
                        this.teacherList = [...this.teacherList,{id:JSON.parse(teacher).id,name:JSON.parse(teacher).name}];
                    }
                }
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                let teacherId = vuex&&vuex.me&&vuex.me.attributes&&vuex.me.attributes.login_info&&vuex.me.attributes.login_info.id;
                let teacherName = vuex&&vuex.me&&vuex.me.user&&vuex.me.user.name || '';
                let roles = vuex&&vuex.me&&vuex.me.roles;
                let rolesId = roles.map(role=>{
                    return role.id
                })
                if(rolesId.indexOf('jiaoxue') == -1 && rolesId.indexOf('cg') == -1){
                    if(rolesId.indexOf('kjk') == -1){   //均未找到
                        this.showTab = 1;
                    }
                    if(rolesId.indexOf('kjk') != -1){   //找到kjk
                        this.showTab = 2;
                    }
                }else{
                    this.showTab = 3;
                }
                if(teacherId && teacherName && teacher !== '""'){
                    if(!teacher){
                        this.teacherMsg = {
                            id:teacherId*1,
                            name:teacherName,
                        }
                    }
                    
                    if(!this.teacherList.find(item=>item.id==teacherId)){
                        this.teacherList = [...this.teacherList,{id:teacherId,name:teacherName}];
                    }
                }
            });
            this.queryTeacherUnitById();
            this.getSemesterCourse();
            this.getdepartmentList();
	    },
		methods:{
            // 查询授课形式列表
			queryFormList(){
                return this.$http.post('_op:teaching/form/list',{
                    pageNo:1,
                    pageSize:100,
                }).then(data => {
                    this.formList = data.result;
                })
            },
            //导出课时统计表
            exportScheduleAssignHours(){
                if(this.showTab == 2 && !this.departid){
                    this.$message.warning('请选择单位');
                    return;
                }
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                
                let postData = {
                    start_index: 1,
                    page_size: 10000,
                    courseId:this.semesterCourseId,
                    t_department_id:this.departid,
                    a_department_id:this.sectionid,
                    teacherid:this.teacherMsg.id,
                    l_teacherid:vuex.me.attributes.login_info.id,
                    roles:vuex.me.roles.map(item=>item.id),
                };
                if(this.terms&&this.terms.length>0){
                    postData.semesterIds = this.terms;
                }
                if(!this.semesterCourseId && !this.departid && !this.sectionid && !this.teacherMsg){
                    this.$message.warning("请先设置查询条件");
                    return;
                }

                this.$http2.post('_ed:/export/schedule/assign/hours',postData).then(res => {
                    let url = window.URL.createObjectURL(new Blob([res]));
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", "课时统计.xls");
                    y.click();
                    window.URL.revokeObjectURL(url);
                })
            },
            // 查询学时统计列表
            queryScheduleAssignHours(){
                if(this.showTab == 2 && !this.departid){
                    this.$message.warning('请选择单位');
                    return;
                }
                this.tableShow = true;
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                
                let postData = {
                    start_index: 1,
                    page_size: 10000,
                    courseId:this.semesterCourseId,
                    t_department_id:this.departid,
                    a_department_id:this.sectionid,
                    teacherid:this.teacherMsg.id,
                    l_teacherid:vuex.me.attributes.login_info.id,
                    roles:vuex.me.roles.map(item=>item.id),
                };
                if(this.terms&&this.terms.length>0){
                    postData.semesterIds = this.terms;
                }
                if(!this.semesterCourseId && !this.departid && !this.sectionid && !this.teacherMsg){
                    this.$message.warning("请先设置查询条件");
                    return;
                }
                this.tableLoading = true;
                this.$http.post('_ed:term/queryScheduleAssignHours',postData).then(res => {
                    this.tableLoading = false;
                    this.tableData = [];
                    if (res.code == 0) {
						if(!res.data || !res.data.dataList || res.data.dataList.length==0){
                            return;
                        }
                        let dataList = res.data.dataList;
                        let tableData = [];
                        dataList.forEach(item => {
                            let rowItem = {
                                teacher_no:item.teacher_no,
                                teacherid:item.teacherid,
                                teachername:item.teachername,
                                assign_hours:item.a_assign_hours
                            }
                            item.teaching_forms.forEach(item2=>{
                                rowItem[item2.teaching_form.toString()] = item2.t_assign_hours;
                            });
                            tableData.push(rowItem);
                        });
                        this.tableData = tableData;
                        this.termsBak = JSON.parse(JSON.stringify(this.terms));
					} else {
                        this.tableData = [];
						this.$message.error(res.msg);
					}
                })
            },

            getSemester() {
                return this.$http.get("_op:/terms/new/学期").then(data => {
                    this.semesterList = data.data.reverse();
                    if(this.$route.query.terms){
                        return;
                    }
                    let nowTerm = this.semesterList.find(item=>item.stage==2||item.name.indexOf('当前学期')>-1);
                    nowTerm && nowTerm.id && (this.terms = [nowTerm.id]);
                }).catch(() => {});
            },

            showDetail(row,teachmode,teaching_form){
                let queryObj = {
                    teacherid:row.teacherid,
                    teachername:row.teachername,
                    teachmode:teachmode,
                    semesterIds:this.termsBak,
                    courseId:this.semesterCourseId,
                    t_department_id:this.departid,
                    a_department_id:this.sectionid,
                };
                if(teaching_form){
                    queryObj.teaching_form = teaching_form;
                }
                this.$router.push({
                    name: 'period_statistic_detail',
                    query: queryObj
                })
            },

            //获取教师名单列表
        	getTeachers(str){
                this.teacherListLoading = true;
                let vuex = JSON.parse(localStorage.getItem('vuex'));

        		return this.$http.post("_ed:/term/queryHoursTeacherList",{
                    teachername:str,
                    l_teacherid:vuex.me.attributes.login_info.id,
                    roles:vuex.me.roles.map(item=>item.id),
        		}).then(data=>{
					this.teacherList=data.data;
        			this.teacherListLoading = false;
                }).catch(()=>{
                })
        	},

            getSemesterCourse(){
                this.loading = true;
                let vuex = JSON.parse(localStorage.getItem('vuex'));

        		this.$http.post("_ed:/term/queryCourseList",{
                    user_id: vuex.me.attributes.login_info.id,
                    roles: (vuex.me.roles.map(item=>item.id)).toString(),
                    type: 1,
                    semester_year:0,
                    semester_year_number: 0
                }).then(data=>{
        			this.semesterCourseList=JSON.parse(data.data);
        			this.loading = false;
                }).catch(()=>{
                })
			},

            getdepartmentList(){
                this.$http.get(`_ed:/department/queryAreaDepartmentList`).then(resp => {
                    var temp = JSON.parse(JSON.stringify(resp.data));
                    this.departmentList = temp.map(next => {
                        return {
                            id: next.departmentid,
                            name: next.name
                        };
                    });
                }).catch(err => console.error(err));
            },
            queryTeacherUnitById(){
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                this.$http.post(`_ed:/term/queryTeacherUnitById`,{
                    // teacherId: this.teacherMsg.id,
                    teacherId: vuex.me.attributes.login_info.id,
                    roles: (vuex.me.roles.map(item=>item.id)).toString()
                }).then(resp => {
                    this.branchList = JSON.parse(resp.data);
                }).catch(err => console.error(err));
            },
            onTermsChange(val){
                this.$router.replace({ query: { ...this.$route.query, terms: JSON.stringify(val) } });
            },
            onCourseChange(val){
                this.$router.replace({ query: { ...this.$route.query, course: JSON.stringify(val) } });
            },
            onDepartChange(val){
                this.$router.replace({ query: { ...this.$route.query, depart: JSON.stringify(val) } });
            },
            onSectionChange(val){
                this.$router.replace({ query: { ...this.$route.query, section: JSON.stringify(val) } });
            },
            onTeacherChange(val){
                this.$router.replace({ query: { ...this.$route.query, teacher: JSON.stringify(val) } });
            },
            getQueryData() {
                let query = this.$route.query;
                query.terms && (this.terms = JSON.parse(query.terms));
                query.course && (this.semesterCourseId = JSON.parse(query.course));
                query.depart && (this.departid = JSON.parse(query.depart));
                query.section && (this.sectionid = JSON.parse(query.section));
                query.teacher && (this.teacherMsg = JSON.parse(query.teacher));
            },
		}
	}
</script>
<style scoped>
	.period-head{
        display: flex;
        justify-content: space-between;
    }
    .fold-head-left{
        width: calc(100% - 80px);
    }
    .fold-head-right{
        width: 130px;
        padding-top: 20px;
    }
    .checkbox-group{
        max-width: calc(100vw - 420px);
        max-height: 90px;
        overflow-y: auto;
    }
    .cm-table{
        margin-top: 20px;
    }

</style>