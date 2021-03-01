<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.path">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold" style="height:68px">
            <el-form :inline="true" size="mini" :model="formInline">
                <el-form-item label="班级">
                    <!-- <el-select v-model="formInline.class" clearable ref="selectClass" @clear="clearClass">
                        <el-option :value="selectValue">
                            <el-tree :data="treeData" node-key="id" ref="tree" @node-click="handleCheckChange"></el-tree>
                        </el-option>
                    </el-select> -->
                    <selectTree :options="treeData" @getValue="getValue"></selectTree>
                </el-form-item>
                <el-form-item label="学期">
                    <el-select v-model="formInline.semester" placeholder="全部" :remote-method="getSemester" filterable clearable @change="onSelectChange">
                        <el-option v-for="(item,index) in semester" :key="index" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="formInline.scoreType">
                        <el-radio :label="1">所有成绩</el-radio>
                        <el-radio :label="2">课程成绩</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="searchTable">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="cm-table">
            <div class="table-container" @mousemove.prevent="move" @mouseup.prevent="end">
                <div class="course-table">
                    <el-table 
                        :data="table1Data" 
                        border 
                        style="width: 100%" 
                        size="mini"
                        :height="tableHeight"
                        @row-click="rowClick"
                        v-loading="table1Loading" 
                        :highlight-current-row="true"
                        element-loading-text="加载中..." 
                        header-row-class-name="cm-dark">
                        <el-table-column label="序号" type="index" fixed></el-table-column>
                        <el-table-column label="课程编号" prop="courseCode" fixed width="70"></el-table-column>
                        <el-table-column label="课程名称" prop="courseCnName" fixed width="145"></el-table-column>
                        <el-table-column label="英文名称" prop="courseEnName" width="315"></el-table-column>
                        <el-table-column label="类型" prop="natureName" width="60"></el-table-column>
                        <el-table-column label="学分" width="60">
                            <template slot-scope="scope">
                                <div>{{Number(scope.row.credit).toFixed(1)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="学时" prop="learnHour" width="50"></el-table-column>
                        <el-table-column label="学期" prop="termNum" width="50"></el-table-column>
                        <el-table-column label="任课老师" prop="teacherNames" min-width="320"></el-table-column>
                        <el-table-column label="课程负责人" prop="courseManagers" min-width="320"></el-table-column>
                    </el-table>
                </div>
                <div class="drageLine" @mousedown="start"></div>
                <div class="score-table" v-show="formInline.scoreType == 1">
                    <el-table 
                        :data="table2Data" 
                        border 
                        class="table-fixed"
                        style="width: 100%" 
                        size="mini"
                        :height="tableHeight"
                        v-loading="table2Loading" 
                        element-loading-text="加载中..." 
                        header-row-class-name="cm-dark">
                        <el-table-column label="学号" prop="studentNo" fixed width="100"></el-table-column>
                        <el-table-column label="学生姓名" prop="studentName" fixed width="100"></el-table-column>
                        <el-table-column label="学期" prop="termNum" fixed width="50"></el-table-column>
                        <el-table-column label="阶段成绩" prop="stageGrade" width="70"></el-table-column>
                        <el-table-column label="课程成绩" prop="courseGrade" width="70"></el-table-column>
                        <el-table-column label="补考1" prop="firstbk" width="55"></el-table-column>
                        <el-table-column label="补考2" prop="secondbk" width="55"></el-table-column>
                        <el-table-column label="补考3" prop="thirdbk" width="55"></el-table-column>
                        <el-table-column label="阶段成绩说明" prop="stageGradeDetail" width="800"></el-table-column>
                        <!-- <el-table-column label="成绩说明" v-if="formInline.scoreType == 2" prop="courseGradeDetail" width="800"></el-table-column> -->
                        <el-table-column label="补考1成绩说明" prop="firstbkDetail" width="600"></el-table-column>
                        <el-table-column label="补考2成绩说明" prop="secondbkDetail" width="600"></el-table-column>
                        <el-table-column label="补考3成绩说明" prop="thirdbkDetail" width="600"></el-table-column>
                    </el-table>
                </div>
                <div class="score-table" v-show="formInline.scoreType == 2">
                    <el-table 
                        :data="table2Data" 
                        border 
                        class="table-fixed"
                        style="width: 100%" 
                        size="mini"
                        :height="tableHeight"
                        v-loading="table2Loading" 
                        element-loading-text="加载中..." 
                        header-row-class-name="cm-dark">
                        <el-table-column label="学号" prop="studentNo" fixed width="100"></el-table-column>
                        <el-table-column label="学生姓名" prop="studentName" fixed width="100"></el-table-column>
                        <el-table-column label="学期" prop="termNum" fixed width="170"></el-table-column>
                        <!-- <el-table-column label="阶段成绩" v-if="formInline.scoreType == 1" prop="stageGrade" width="70"></el-table-column> -->
                        <el-table-column label="课程成绩" prop="courseGrade" width="70"></el-table-column>
                        <!-- <el-table-column label="补考1" v-if="formInline.scoreType == 1" prop="firstbk" width="55"></el-table-column> -->
                        <!-- <el-table-column label="补考2" v-if="formInline.scoreType == 1" prop="secondbk" width="55"></el-table-column> -->
                        <!-- <el-table-column label="补考3" v-if="formInline.scoreType == 1" prop="thirdbk" width="55"></el-table-column> -->
                        <!-- <el-table-column label="阶段成绩说明" v-if="formInline.scoreType == 1" prop="stageGradeDetail" width="800"></el-table-column> -->
                        <el-table-column label="成绩说明" prop="courseGradeDetail" width="800"></el-table-column>
                        <!-- <el-table-column label="补考1成绩说明" v-show="formInline.scoreType == 1" prop="firstbkDetail" width="600"></el-table-column> -->
                        <!-- <el-table-column label="补考2成绩说明" v-show="formInline.scoreType == 1" prop="secondbkDetail" width="600"></el-table-column> -->
                        <!-- <el-table-column label="补考3成绩说明" v-show="formInline.scoreType == 1" prop="thirdbkDetail" width="600"></el-table-column> -->
                    </el-table>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import selectTree from './el_tree_select'
export default {
    name:"course_result_enquiry",
    data(){
        return {
            breadcrumb:[
                {label:'成绩管理'},
                {label:'课程成绩查询'}
            ],
            formInline:{
                class:'',
                semester:'',
                scoreType: 1
            },
            selectValue:'',
            treeData:[],
            semester:[],
            semesterNum:'',
            semesterID:'',
            fallYear:'',
            table1Data:[],
            table2Data:[],
            table1Loading:false,
            table2Loading:false,
            tableHeight:window.innerHeight - 152,
            startFlag: false,
            startX: 0,
            tempX: 0,
            tableWidth: 0,
            leftWidth: 0,
            rightWidth: 0
        }
    },
    created(){
        this.getSemester()
        this.getClassList()
    },
    mounted(){
        this.tableWidth = document.querySelector('.table-container').clientWidth
        this.leftWidth = document.querySelector('.course-table').clientWidth
        this.rightWidth = document.querySelector('.score-table').clientWidth
    },
    components:{
        selectTree
    },
    methods:{
        start(e){
            this.startFlag = true
            this.startX = e.clientX
        },
        move(e){
            if(this.startFlag){
                let temp = this.tempX + (e.clientX - this.startX)
                document.querySelector('.drageLine').style.transform = `translateX(${temp}px)`
            }
        },
        end(e){
            if(this.startFlag){
                this.tempX = this.tempX + (e.clientX - this.startX)
                document.querySelector('.course-table').style.width = `${this.leftWidth + this.tempX}px`
                document.querySelector('.score-table').style.width = `${this.rightWidth - this.tempX}px`
                this.startFlag = false
            }
        },
        getHeight(){
            let DomH = document.querySelector('.cm-main').offsetHeight
            let crumbH = document.querySelector('.cm-breadcrumb').offsetHeight
            let foldH = document.querySelector('.cm-fold').offsetHeight
            this.tableHeight = DomH-crumbH-foldH
        },
        getValue(val){
            if(val == null){
                this.clearClass()
                return
            }
            this.selectValue = val
        },
        //获取学期
        getSemester(query) {
            if (!query) {
                query = "学期";
            }
            this.$http.get('_op:/terms/' + query).then(data => {
                if (data.code == 0) {
                    this.semester = data.data.reverse();
                    // for(let i=0;i<this.semester.length;i++){
                    //     if(this.semester[i].name.indexOf('当前学期')!=-1){
                    //         this.formInline.semester=this.semester[i].id
                    //         this.semesterNum = this.semester[i].orderNum;
                    //         this.semesterID = this.semester[i].id;
                    //         this.fallYear =this.semester[i].year;
                    //     }
                    // }
                } else {
                    this.$message.error(data.msg);
                }
            })
        },
        // 学期改变
        onSelectChange(_id){
            if (_id) {
                for (let item of this.semester) {
                    if (item.id == _id) {
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                        this.semesterID = _id;
                    }
                }
            }
        },
        // 获取班级
        getClassList(){
            this.$http.post('_ed:/scoreManege/queryAdministrativeClass').then(data => {
                if(data.code == 0){
                    // let temp = data.data.reverse()
                    let temp = data.data
                    this.treeData = []
                    temp.map((item,index) => {
                        let tempObj = {
                            label:item.grade,
                            children:[]
                        }
                        item.list && item.list.map(val => {
                            tempObj.children.push({
                                label:val.name,
                                id:val.id
                            })
                        })
                        this.treeData.push(tempObj)
                    })
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        clearClass(){
            this.selectValue = ''
            this.searchTable()
        },
        // 班级下拉切换
        handleCheckChange(data){
            if(data.id){
                this.selectValue = data.id
                this.formInline.class = data.label
                this.$refs.selectClass.blur()
            }
        },
        searchTable(){
            this.table2Data = []
            if(this.selectValue == ''){
                this.$message.warning('请选择班级')
                return
            }
            this.table1Loading = true
            this.$http.post("_sc:/scoreQueryManage/queryCourseDetail",{
                classsId:this.selectValue,
                termId:this.formInline.semester,
                scoreType: this.formInline.scoreType
            }).then(res => {
                this.table1Loading = false
                if(res.code == 0){
                    this.table1Data = res.data.dataList
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        // 课程点击
        rowClick(row, column, event){
            let rowId = row.courseId
            this.table2Loading = true
            this.$http.post("_sc:/scoreQueryManage/queryCourseScoreList",{
                courseId:rowId,
                classsId:this.selectValue,
                termId:this.formInline.semester,
                scoreType:this.formInline.scoreType
            }).then(res => {
                this.table2Loading = false
                if(res.code == 0){
                    this.table2Data = res.data
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        sizeChange(size){
            this.pageNo = 1;
            this.pageSize = size;
            this.searchTable();
        },
        // 分页跳转
        currentChange(current){
            this.pageNo = current;
            this.searchTable();
        },
    }
}
</script>
<style>
.cm-main{
    padding:0!important;
}
/* .table-fixed /deep/ .el-table__fixed-right{
    height: 100% !important;
}
.table-fixed /deep/ .el-table__fixed{
    height: 110px !important;
} */
.table-container .el-table--scrollable-x .el-table__body-wrapper {
    z-index : 1;
}
</style>
<style lang="less" scoped>
.cm-container{
    // display: flex;
    // flex-direction: column;
    // height: 100%;
    .cm-table{
        // flex:1;
        margin-bottom:0px;
    }
}
.el-scrollbar{
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
        background-color: #FFF;
    }
}
.table-container{
    display: flex;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    .course-table{
        width: 49%
    }
    .score-table{
        width:49%
    }
    .drageLine{
        width: 2px;
        height: 100%;
        position: absolute;
        left: 50%;
        cursor: col-resize;
        background-color: #ccc;
        transform: translateX(-1px);
        z-index: 9999;
    }
}
</style>