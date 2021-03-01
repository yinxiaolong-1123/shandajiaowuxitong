<template>
	<div class="arrange-course">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-btn-con cm-fold">
            <el-form :inline="true"  size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <!-- <el-form-item v-for="(list,index) in formList" :key="index" :label="list.label">
                            <el-input v-model="formInline[list.model]"></el-input>
                        </el-form-item> -->
                        <el-form-item label="学期">
							<el-select v-model="formInline.semesterId" size="mini" placeholder="请选择学期"  style="width:100%;">
	                            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id"></el-option>
	                        </el-select>
                        </el-form-item>
                        <el-form-item label="专业名称">
							<el-select v-model="formInline.majorId" size="mini" clearable filterable>
		                        <el-option label="全部" value=""></el-option>
		                        <el-option v-for="item in majorList"  :key="item.index" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
                        </el-form-item>
	                    <el-form-item label="课程">
                            <el-select v-model="formInline.courseId" size="mini" clearable filterable>
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in courseList" :key="item.index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="search">查询</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark">
                <el-table-column label="序号" type="index" width="80"></el-table-column>
                <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label"></el-table-column>
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button @click="setTeacherPrority(scope.row)" type="text" size="small">老师优先级</el-button>
                        <el-button @click="placePrority(scope.row)" type="text" size="small">场地优先级</el-button>
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
                @current-change="currentChange">
            </el-pagination>
        </div>
	</div>
</template>

<script>
	import util from '@/util'
    const TYPE='place-priority';
    const REMARK='优先级设置';
	export default {
	    name: 'setting_priority',
	    data() {
	        return {
	        	pagePort: {
	        		majorList:'_op:major/combox',
                    courseList:'_op:course/combox',
	        	},
	        	breadcrumb: [
                    {label: "排课管理"},
                    {label: '排课设置',path:`/educational_admin/course_content?actionId=${this.$route.query.actionId}`},
                    {label: REMARK},
                ],
                fold:{
		            state:false,
		            text:'展开',
		            showBtn:false,
		        },
		        formInline: {
                    semesterId: '',
                    majorId: '',
                    courseId: ''
                },
                formList:[
		        	{label:'学期',model:'semesterId',disabled:false},
		        	{label:'专业名称',model:'majorId',disabled:false},
		        	{label:'课程',model:'courseId',disabled:false}
		        ],
		        majorList: [],
		        courseList: [],
		        termList:[{name:'学期一',id:1},{name:'学期二',id:2},{name:'学期三',id:3},{name:'学期四',id:4},{name:'学期五',id:5},{name:'学期六',id:6},{name:'学期七',id:7},{name:'学期八',id:8},{name:'学期九',id:9},{name:'学期十',id:10}],
		        // tableList: [
		        // 	{label:'课程名称', prop:'courseName'},
		        //     {label:'课程内容', prop:'courseContent'},
		        //     {label:'授课形式', prop:'teachingForm'},
		        //     {label:'学时', prop:'studyTimes'},
		        //     {label: '科室', prop:'department'},
		        //     {label:'创建人', prop:'creator'},
		        //     {label:'创建日期', prop:'createdTime'}
		        // ],
		        tableList:[
                    {label:'课程名称', prop:'courseName'},
                    {label:'课程内容', prop:'content'},
                    {label:'授课形式', prop:'teachingFormName',},
                    {label:'学期', prop:'termName',width:160},
                    {label:'学时', prop:'learningHour',},
                    {label:'科室', prop:'adminDepartmentName'},
                    {label:'创建人', prop:'createUser',},
                    {label:'创建日期', prop:'createTime',width:110}
                ],
				tableData:[
                	{teacherNo: '1', courseName: '临床医学', content: '基础理论', teachingFormName: '理论', termName:'学期一', learningHour:'30', adminDepartmentName:'教务处', createUser: '主授课老师', createTime: '2018/07/01'}
                ],
                pageNo: 1,
                pageSize: 10,
                totalCount: 0
	        };
	    },
	    created (){
	    	this.getOptionItem('majorList');
	    	this.getOptionItem('courseList');
	    },
		mounted(){
	      	util.resize(this);
	      	window.onresize=()=>{
	          	util.resize(this);
	      	};
	    },
	    methods: {
	    	collapseShow(){
	          this.fold.state=!this.fold.state;
	          this.fold.text=this.fold.state?'收起':'展开';
	        },
	        search (){

	        },
	        getTableData (){

	        },
	        currentChange (){

	        },
	        sizeChange (){

	        },
			setTeacherPrority (row){
                this.$router.push({
                    path: '/educational_admin/teacher_priority',
                    query: {
                        courseId: row.id,
                        courseName: row.courseName,
                        content: row.content,
                        teachingFormName: row.teachingFormName,
                        actionId: this.$route.query.actionId
                    }
                })
            },
            placePrority (row){
                this.$router.push({
                    'path': '/educational_admin/place_priority',
                    query: {
                        courseId: row.id,
                        courseName: row.courseName,
                        content: row.content,
                        teachingFormName: row.teachingFormName,
                        actionId: this.$route.query.actionId
                    }
                })
            },
	        getOptionItem(str,list,type){
                let data={};
                let url=this.pagePort[str];
                if(type && list){
                    data.type=type;
                }else{
                    list=str;
                }
                
                if (url.indexOf('course/combox') > -1 || url.indexOf('major/combox') > -1) {
                    this.$http.get(url,data).then(data=>{
                        this[list]=data.data;
                    });
                } else {
                    this.$http.post(url,data).then(data=>{
                        this[list]=data.data;
                    });
                }
            },
	    }
	};
</script>

<style lang="less" scoped>
	.arrange-course{

	}
</style>