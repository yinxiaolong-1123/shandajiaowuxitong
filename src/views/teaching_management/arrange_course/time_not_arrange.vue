<template>
	<div class="time-not-arrange">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="searchForm">
                <div class="fold">
                    <div ref="formDetail" class="detail select-condition" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-date-picker
                                v-model="date"
                                clearable
                                @clear="handleClear"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleSplitDate">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="星期">
		                    <el-select 
		                        v-model="searchForm.week"
		                        clearable
		                        filterable 
		                        placeholder="请选择星期" style="width:140px;">
		                        <el-option v-for="item in weeksList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
		                <el-form-item label="课节">
		                    <el-select 
		                        v-model="searchForm.lesson"
		                        clearable
		                        filterable 
		                        placeholder="请输入课节名称" style="width:140px;">
		                        <el-option v-for="item in lessonList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		                    </el-select>
		                </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="addTask">新增</el-button>
        </div>
        <div class="cm-table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                border
                style="width: 100%"
                size="mini"
                v-loading="tableLoading"
                element-loading-text="加载中..."
                header-row-class-name="cm-dark">
                <el-table-column type="index" label="序号"></el-table-column>
                <!-- <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <template v-if="item.prop=='beginTime' || item.prop =='endTime'">
                            {{scope.row[item.prop] | formatime}}
                        </template>
                        <template v-else>
                            {{scope.row[item.prop]}}
                        </template>
                    </template>
                </el-table-column> -->
                <el-table-column label="开始时间" prop="beginTime">
                    <template slot-scope="scope">
                        {{scope.row['beginTime'] | formatime}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" prop="endTime">
                    <template slot-scope="scope">
                        {{scope.row['endTime'] | formatime}}
                    </template>
                </el-table-column>
                <el-table-column label="星期" prop="extend.weekName"></el-table-column>
                <el-table-column label="课节" prop="extend.lessonsName"></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editNotArrange(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="delTableRow(scope.$index,scope.row)" type="text" size="small" style="color: red;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination
                background
                :current-page="pageNo + 1"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <!-- 新增不可排课时间 -->
        <el-dialog
            width="400px"
            :title="dialog.status === 'add' ? '新增':'编辑'"
            :visible.sync="dialog.visible"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            custom-class="add-not-arrange-place"
            @closed="dialogClose">
            <el-form :inline="true" ref="addForm" :model="addForm" :rules="rules" :label-width="labelWidth">
                <el-form-item label="起止日期" class="date-box" prop="date">
                    <el-date-picker
                        v-model="addForm.date"
                        clearable
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="handleSplitDate2">
                    </el-date-picker>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="星期">
                    <el-select 
                        v-model="addForm.extend.weekIds"
                        multiple
                        clearable
                        filterable 
                        @change="findName($event, 'weekIds', 'weeksList', 'weekName')"
                        placeholder="请选择星期">
                        <el-option v-for="item in weeksList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课节">
                    <el-select 
                        v-model="addForm.extend.lessonsId"
                        multiple
                        clearable
                        filterable 
                        @change="findName($event, 'lessonsId', 'lessonList', 'lessonsName')"
                        placeholder="请输入课节名称">
                        <el-option v-for="item in lessonList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="addRequire('addForm', dialog.status == 'add' ? 'post' : 'patch')">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
import util from '@/util';

export default {
    name: 'time_not_arrange',
    data() {
        return {
            breadcrumb: [
                {label: "自动排课"},
                {label: "排课时间约束设置"},
            ],
            fold:{
                state:false,
                text:'展开',
                showBtn:false,
            },
            weeksList: [
                {id:1, name:'星期一'},
                {id:2, name:'星期二'},
                {id:3, name:'星期三'},
                {id:4, name:'星期四'},
                {id:5, name:'星期五'},
                {id:6, name:'星期六'},
                {id:7, name:'星期日'}
            ], // 星期列表
            date: [],
            lessonList: [], // 课节
            searchForm:{ // 查询列表条件表单字段
            	beginTime:'',
            	endTime: '',
                week:'',
            	lesson: ''
            },
            addForm:{
                date:[],
                // weeks:"",
                // lessons:"",
                // createUserId: util.getStorage('loginId')

                beginTime: '',
                createTime: '',
                // createUserId: util.getStorage('loginId'),
                // endTime: '',
                extend: {
                    weekIds: [],
                    weekName: '',
                    lessonsId: [],
                    lessonsName: ''
                },
                // id: '',
                // lastUpdateTime: util.getTime1(new Date()),
                // lastUpdateUserId: util.getStorage('loginId'),
                properties: {},
                universityId: 0,
                wasDeleted: 0,
                editId:""
            },
            rules: {
                date: [
                    {required: true, message: '请选择起止日期', trigger: 'blur'}
                ]
            },
            labelWidth: '100px',
            tableLoading: false,
			tableList:[
                {label:'开始时间', prop:'beginTime',width:160},
                {label:'结束时间', prop:'endTime'},
                {label:'星期', prop:'extend.weekName'},
                {label:'课节', prop:'extend.lessonsName',width:200}
            ],
            tableData:[
                // {campus:'新校区', building:'新教学楼', floor:'3', placeName:'3', beginTime:'20180901', endTime:'20180908', week:'一', lessons:'1、2'}
            ],
            pageNo: 0,
            pageSize: 10,
            totalCount: 0,
            dialog:{
                status:'add',
                visible:false
            },
        };
    },
    created (){
    	this.getLessonList();
        this.getTableData();
    },
    methods: {
        handleSplitDate (){
            if (this.date && this.date.length > 0) {
                this.searchForm.beginTime = this.date[0];
                this.searchForm.endTime = this.date[1];
            }else {
                this.searchForm.beginTime = '';
                this.searchForm.endTime = '';
            }
        },
        handleClear (){
         
        },
        handleSplitDate2 (){
            if (this.addForm.date && this.addForm.date.length > 0) {
                this.addForm.beginTime = this.addForm.date[0];
                this.addForm.endTime = this.addForm.date[1];
            }else {
                this.addForm.beginTime = '';
                this.addForm.endTime = '';
            }
        },
    	onSearch (){
            this.getTableData();
    	},
    	getTableData (){
            let params = this.searchForm;
         

            // this.$http.post('http://192.168.5.175:8060/time/restraint/search', {
            this.$http.post('_as:/time/restraint/search', {
                pageIndex: this.pageNo,
                pageSize: this.pageSize,
                param: this.searchForm
            }).then(res => {
                this.tableData = res.result.data;
                this.totalCount = res.result.total;
            })
    	},
    	sizeChange (val){
            this.pageNo = 0;
            this.pageSize = val;
            this.getTableData();
    	},
    	currentChange (val){
            this.pageNo = val-1;
            this.getTableData();
    	},
    	addTask(){
            this.dialog.status = 'add';
            this.dialog.visible = true;
        },
		editNotArrange(row){
            console.log('11111', row)
            this.editId=row.id;
            let rowDate = [];
            this.dialog.status='edit';
            this.dialog.visible=true;
            row.beginTime = util.getTime1(row.beginTime);
            row.endTime = util.getTime1(row.endTime);
          
            this.addForm.extend = {...row.extend};
            this.addForm.id = row.id;
            this.addForm.beginTime = row.beginTime;
            this.addForm.endTime = row.endTime;
            rowDate.push(row.beginTime);
            rowDate.push(row.endTime);
            this.addForm.date = rowDate;
        },
        dialogClose(){
            this.dialog.visible = false;
            
            this.addForm.beginTime = '';
            this.addForm.endTime = '';
            this.addForm.extend.lessonsName = '';
            this.addForm.extend.weekIds = [];
            this.addForm.extend.weekName = '';
            this.addForm.extend.lessonsId = [];
            this.addForm.date = [];
            // this.$refs.addForm.resetFields();
        },
        findName (val, idArr, listName, names){
            let weekNameArr = [];

            for (var i = 0; i < this.addForm.extend[idArr].length; i++) {
                for (var j = 0; j < this[listName].length; j++) {
                    if (this.addForm.extend[idArr][i] == this[listName][j].id) {
                        weekNameArr.push(this[listName][j].name);
                    }
                }
            }
            this.addForm.extend[names] = weekNameArr.join('、');
        },
        addRequire (formName, method){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // let params = {...this.addForm};
                    let params = {};

                    params.beginTime = this.addForm.date[0];
                    params.endTime = this.addForm.date[1];
                    if (this.dialog.status == 'add') {
                        delete params.id;
                    }
                      if (this.dialog.status == 'edit') {
                        
                        params.id=this.editId
                          console.log('edit', params.id)
                    }

                    params.extend = this.addForm.extend;

                    this.$http({
                        // url:'http://192.168.5.175:8060/time/restraint',
                        url:'_as:/time/restraint',
                        method: method,
                        data: params
                    }).then(res => {
                        this.dialog.visible = false;
                        this.getTableData();    
                        // if (res.result == 200) {
                        //     this.dialog.visible = false;
                        //     this.getTableData();
                        //     // this.$message.success('添加成功');
                        // } else {
                        //     this.$message.error('添加失败');
                        // }
                    })
                }
            })
        },
        // 删除
        delTableRow (index, row){
            this.$confirm(`您确定删除该条信息`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$http.delete(`http://192.168.5.175:8060/time/restraint/${row.id}`).then(res => {
                this.$http.delete(`_as:/time/restraint/${row.id}`).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getTableData();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
    	collapseShow(){
          	this.fold.state=!this.fold.state;
          	this.fold.text=this.fold.state?'收起':'展开';
        },
		getLessonList(){//获取课节
            this.$http.get("_op:/sections/find").then(data=>{
                if(data.code==0){
                    if(data.data){
                        this.lessonList = data.data;
                    }
                }else{
                    this.$message.error(data.msg);
                }
            })
        }
    },
    filters: {
        formatime: util.getTime1
    }
};
</script>
<style lang='less'>
.select-condition{
    .el-date-editor--daterange.el-input__inner{
        width: 220px!important;
    }
}
</style>

<style lang="less" scoped>
	.add-not-arrange-place{
        .date-box{
            .el-date-editor.el-range-editor{
                width:225px;
            }
        }
    }
</style>