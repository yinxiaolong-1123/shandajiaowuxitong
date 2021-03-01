<template>
    <section>
        <el-dialog
        :visible.sync="showPlaceList" 
        width="700px" 
        top="10vh"
        :close-on-click-modal="false"
        append-to-body
        :before-close="handleClose"
        class="places-box">
            <p slot="title">
                <span style="font-size:18px;">场地选择</span>
                <span style="font-size:14px;color:red;">（注：红色记录有可能会产生冲突）</span>
            </p>
            <div class="place-box">
                <div class="flex-item">
                    <span>场地名称</span>
                    <el-input v-model.trim="placeName" size="mini" clearable></el-input>
                </div>
                <div class="flex-item">
                    <span>人数(≥)</span>
                    <el-input-number 
                    v-model="peopleNum" 
                    :controls="false" 
                    :min="0" 
                    :precision="0"
                    size="mini">
                    </el-input-number>
                </div>
                <el-button @click="queryVisualAreaList" type="primary" size="mini">查询</el-button>
            </div>

            <!-- 查询列表 -->
            <el-table 
            :data="placeList.slice((currentPage - 1)*pagesize,currentPage*pagesize)" 
            border size="mini" :row-class-name="tableRowClass"
            @row-click="showNote"
            :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column prop="name" label="场地名称">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status == 1" type="text" class="red-mark" style="cursor:pointer">{{ scope.row.name }}</p>
                        <p v-else>{{ scope.row.name }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="capacity" label="容纳人数" width="100" style="cursor:pointer">
                    <template slot-scope="scope">
                        <p :class="{'pointer':scope.row.status == 1}">
                        {{ (scope.row.capacity || scope.row.capacity === 0) ? scope.row.capacity : '&nbsp;' }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" 
                        @click="addPlace(scope.row,scope.$index,1)"
                        :disabled="scope.row.choose == 1 || false" 
                        :class="{'red-mark':scope.row.status == 1}
                        "style="cursor:pointer">添加</el-button>
                        <el-button type="text" size="mini"
                        @click="addPlace(scope.row,scope.$index,2)"
                        :class="{'red-mark':scope.row.status == 1}
                        "style="cursor:pointer">替换</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p style="text-align:right;padding:20px 0;">
                <el-pagination small
                    layout="total, prev, pager, next"
                    @current-change="current_change"
                    :current-page.sync="currentPage"
                    :total="placeList.length">
                </el-pagination>
            </p>

            <!-- 已选列表 -->
            <h4>已选择列表</h4>
            <el-table :data="choosePlaceList" 
            border size="mini" 
            :header-cell-style="{background:'#f5f7fa'}"
            style="margin-top:10px;">
                <el-table-column prop="name" label="场地名称"></el-table-column>
                <el-table-column prop="capacity" label="容纳人数" width="100"></el-table-column>
                <el-table-column label="操作" width="50">
                    <template slot-scope="scope">
                        <el-button @click="removePlace(scope.row,scope.$index)" type="text" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <p style="text-align:right;padding:20px 0;">
                <el-button @click="savePlace" type="primary" size="small">确 定</el-button>
                <el-button @click="handleClose" size="small">取 消</el-button>
            </p>
        </el-dialog>

        <!-- 点击场地弹出冲突 -->
        <el-dialog 
            title="冲突明细"
            :visible.sync="showNotes"
            top="20vh"
            width="700px" 
            size="mini"
            append-to-body
            border>
            <el-table :data="nodeList" size="mini">
                <el-table-column prop="cls_name" label="班级、小组或预约人"></el-table-column>
                <el-table-column prop="course_name" label="冲突说明" width="150"></el-table-column>
            </el-table>
        </el-dialog>
    </section>
</template>
<script>
import util from '@/util';
export default {
    props: {
        showPlaceList: {
            type: Boolean,
            default: false
        },
        checkedPlace: {
            type: Array,
            default: []
        },
        placeParams: {
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            placeName: '',
            peopleNum: 0,
            placeList: [],
            choosePlaceList: [],//选择的场地列表
            pagesize: 10,//每页的数据条数
            currentPage:1,//默认开始页面
            semester_year: '',
            semester_year_number: '',
            week_numbers: [],
            section_nodeids:[],
            weekday: '',
            showNotes: false,
            nodeList: [],
        }
    },
    watch: {
        placeName(val){
            this.queryVisualAreaList()
        }
    },
    mounted () {
        this.semester_year = this.placeParams.semester_year,
        this.semester_year_number = this.placeParams.semester_year_number,
        this.week_numbers = this.placeParams.week_numbers;
        this.section_nodeids = this.placeParams.section_nodeids;
        this.weekday = this.placeParams.weekday;
        
        this.choosePlaceList = this.checkedPlace;
        this.queryVisualAreaList();
    },
    methods: {
        handleClose(){
            this.$emit('update:showPlaceList',false);
        },
        current_change(currentPage){
            this.currentPage = currentPage;
        },
        tableRowClass({row,rowIndex}){
            if(row.status == 1){
                return 'red-mark'
            }
        },
        showNote(row){
            if(row.status == 1){
                this.nodeList = JSON.parse(row.note);
                this.showNotes = true;
            }
        },
        addPlace(row,index,type){
            if(row.status == 1){
                this.showNote(row);
                return;
            };
            (type == 1) && (this.choosePlaceList.push(row));
            (type == 2) && (this.choosePlaceList = [row]);
            
            let i = (this.currentPage - 1) * this.pagesize  + index;
            this.$set(this.placeList[i],'choose',1);

            if(type == 2){  //替换
                this.placeList.map((item,i) => {
                    if(item.id != row.id){
                        this.$set(this.placeList[i],'choose',0);
                    }
                })
            }
        },
        removePlace(row,index){
            this.placeList.map((item,i) => {
                if(item.id == row.id){
                    this.$set(this.placeList[i],'choose',0);
                }
            })
            this.choosePlaceList.splice(index,1);
        },
        savePlace(){
            // console.log(this.choosePlaceList);
            this.$emit('placeMsg',this.choosePlaceList);
            this.handleClose();
        },
        queryVisualAreaList(){
            this.currentPage = 1;
            this.$http.post('_ed:/scheduleVisualizing/queryVisualAreaList',{
                semester_year: this.semester_year,//学年
                semester_year_number: this.semester_year_number,//学期
                week_numbers: this.week_numbers,// 周次数组  
                section_nodeids: this.section_nodeids,// 课节数组  
                weekday: this.weekday, //周几  
                detail_visual_id: 0,// 明细主键id (新增：0,修改：明细 id)
                area_name: this.placeName,// 场地名称（可选）
                capacity: this.peopleNum,// 人数（可选）
            }).then(res => {
                if(res.code == 0){
                    this.placeList = res.data;
                    this.placeList.map((item,i) => {
                        this.choosePlaceList.map(item2 => {
                            if(item.id == item2.id){
                                this.$set(this.placeList[i],'choose',1);
                            }
                        })
                    })
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.$message.error(err.error)
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .place-box{
        display:flex;
        align-items:center;
        padding-bottom: 20px;
        .flex-item{
            width: 45%;
            display: inline-flex;
            align-items: center;
            span{
                width: 80px;
                text-align: right;
                padding: 10px;
            }
        }
    }
</style>
<style lang="less">
.places-box{
    .el-table--mini td{
        padding: 2px 0 !important;
    }
    .el-dialog__body{
        padding: 10px 20px 30px;
    }
    .cell{
        display: block;
    }
    .red-mark{
        color: red;
    }
    .pointer{
        cursor: pointer;
    }
}
</style>

