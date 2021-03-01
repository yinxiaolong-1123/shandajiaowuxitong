<template>
    <div class="cm-container">
        <div class="cm-breadcrumb">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
				</el-breadcrumb-item>
			</el-breadcrumb>
        </div>
        <div class="record-box">
            <el-form :inline="true" size="mini" class="order">
                <div style="display:flex;justify-content:space-between;">
                    <div>
                        <el-form-item label="使用日期">
                            <el-date-picker
                                @change = "chooseDateRange"
                                v-model="dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd" 
                                style="width:220px;">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="场地">
                            <el-select v-model="areaId"
                                filterable clearable placeholder="请选择"
                                style="width:180px;">
                                <el-option
                                    v-for="(item,i) in areaList"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人">
                            <el-select v-model="proposer" value-key="applyer_id"
                                filterable clearable placeholder="请选择"
                                style="width:120px;">
                                <el-option
                                    v-for="(item,i) in proposerList"
                                    :label="item.applyer_name"
                                    :key="item.applyer_id"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="status"
                                filterable clearable placeholder="请选择"
                                style="width:100px;">
                                <el-option
                                    v-for="(item,i) in statusList"
                                    :label="item.name"
                                    :value="item.type">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div style="margin-top:10px;">
                        <el-button @click="queryPlaceList" size="mini" type="primary">查询</el-button>
                    </div>
                </div>
            </el-form>

            <el-table :data="recordList" size="mini"
                header-row-class-name="cm-dark" border 
                style="width:100%;margin-top:10px;">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="starttime" label="开始时间" width="140">
                    <template slot-scope="scope">{{ scope.row.start_dt | timestampToTime }}</template>
                </el-table-column>
                <el-table-column prop="endtime" label="结束时间" width="140">
                    <template slot-scope="scope">{{ scope.row.end_dt | timestampToTime }}</template>
                </el-table-column>
                <el-table-column prop="area_name" label="场地"></el-table-column>
                <el-table-column prop="use_name" label="用途" width="100"></el-table-column>
                <el-table-column prop="create_username" label="创建人"width="120"></el-table-column>
                <el-table-column prop="applyer_name" label="申请人"width="120"></el-table-column>
                <el-table-column prop="status" label="状态" width="70">
                    <template slot-scope="scope">
                        {{ scope.row.status | filterStatus }}
                    </template>
                </el-table-column>
                <el-table-column prop="multimedia" label="多媒体设备" width="90">
                    <template slot-scope="scope">
                        {{ scope.row.multimedia === '1' ? '需要' : (scope.row.multimedia === null ? '' : '不需要') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="160">
                    <template slot-scope="scope">
                        <el-button @click="editDetail(scope.row)" type="text">编辑</el-button>
                        <el-button @click="scanDetail(scope.row)" type="text">查看详情</el-button>
                        <el-button @click="deleteRecord(scope.row)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="cm-pagination" style="padding-top:10px;">
                <el-pagination
                    background
                    :current-page.sync="pageNo"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="sizeChange"
                    @current-change="currentChange">
                </el-pagination>
            </div>
        </div>
        <!-- 场地预约 -->
		<order-dialog v-if="orderDialog"
			:orderDialog.sync="orderDialog"
			:areaList="areaList"
            :nodeList="nodeList"
			:semesterId="0"
			:startTime="0"
			:endTime="0"
			:chooseAreaid="0"
			:chooseDate="0"
			:chooseNode="0"
            :detailStatus="recordStatus"
            :usedEdit="usedEdit"
            :applyId="applyid">
		</order-dialog>
    </div>
</template>
<script>
import util from '@/util';
import orderDialog from './place_manage/order_dialog';

export default {
    name: 'order_records',
    provide(){
		return {
			queryPlaceList: this.queryPlaceList
		}
	},
    data () {
        return {
            breadcrumb: [
				{label: "教学管理"},
				{label: "预约记录查询"}
            ],
            dateRange: '',
            areaList: [
                {id:'',name:'全部'}
            ],
            areaId: '',
            proposerList: [],
            proposer: {},
            statusList: [
                {type: '', name: '全部'},
                {type: '0', name: '待审批'},
                {type: '1', name: '审批中'},
                {type: '2', name: '已审批'}
            ],
            status: '',
            startTime: '',
            endTime: '',
            orderDialog: false,
            recordList: [],
            pageNo: 1,
            pageSize: 10,
            totalCount: 0,
            recordStatus: 'scan',
            userid: '',
            applyid: '',
            usedEdit: false,
            nodeList: []
        }
    },
    components: {
        orderDialog
    },
    created () {
        this.getAreas('');
        this.getApplyer();
        this.queryPlaceList();
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userid = storage.me.user.id || '';
        }
    },
    mounted () {
        this.querySectionList();
    },
    filters: {
        filterStatus(status){
            let st = '';
            switch (+status) {
                case 0: st = '待审批'; break;
                case 1: st = '审批中'; break;
                case 2: st = '已审批'; break;
            }
            return st;
        },
        timestampToTime(timestamp) {
            let date = new Date(timestamp);  // times 时间戳（通常为13位）
            let  Y = date.getFullYear();
            let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let  D = (date.getDate() < 10 ?'0'+ date.getDate() : date.getDate());
            let  H = date.getHours() < 10 ?'0'+ date.getHours() : date.getHours();
            let  Min = date.getMinutes() < 10 ?'0'+ date.getMinutes() : date.getMinutes();
            let  S = date.getSeconds() < 10 ?'0'+ date.getSeconds() : date.getSeconds();
            let times =  Y + '-'+ M+ '-' + D+' ' + H + ':'+ Min+ ':' + S;
            return times;  //  eg:  2018-08-02 09:30:12
        }
    },
    methods: {
        chooseDateRange(){
            if(this.dateRange){
                let _endTime = this.dateRange[1];
                this.startTime = this.dateRange[0];
                this.endTime = this.addDate(_endTime,1);
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        },
        sizeChange(){
            this.pageNo = 1;
            this.queryPlaceList();
        },
        currentChange(){
            this.queryPlaceList();
        },
        editDetail(row){
            this.applyid = row.id;
            this.recordStatus = 'edit';
            this.usedEdit = true;
            this.orderDialog = true;
        },
        scanDetail(row){
            this.applyid = row.id;
            this.recordStatus = 'scan';
            this.usedEdit = false;
			this.orderDialog = true;
        },
        deleteRecord(row){
            this.$http.post("_ed:/apply/area/delApplyArea",{
                apply_id: row.id,
                user_id: this.userid,
            }).then(res => {
                if(res.code == 0){
                    this.$message.success('删除成功');
                    this.queryPlaceList();
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err => {
                this.$message.error('后台错误，删除失败！');
            });
        },
        queryPlaceList(){
            this.$http.post("_ed:/apply/area/queryApplyAreaWithPage",{
                applyer_id: this.proposer.applyer_id || '',
                area_id: this.areaId,
                page_size: this.pageSize,
                request_page: this.pageNo,
                start_time: this.startTime || '',
                end_time: this.endTime || '',
                status: this.status,
                type: 0,
            }).then(res => {
                if(res.code == 0){
                    this.totalCount = res.data.total_records;
                    this.recordList = res.data.dataList;
                }else{
                    this.$message.error(res.msg);
                    this.totalCount = 0;
                    this.recordList = [];
                }
            }).catch(err => {
                this.$message.error('查询失败！');
            })
        },
        getApplyer(){
            this.proposerList = [];
            this.$http.get("_ed:/apply/area/query/applyer/list").then(res => {
                if(res.code == 0){
                    this.proposerList = [{applyer_id: '',applyer_name: '全部'},...res.data];
                    this.proposer = this.proposerList[0];
                }else{
                    this.$message.error(res.msg)
                }
            }).catch(err => {
                this.$message.error("后台错误")
            })
        },
        getAreas(str) {
            this.areaList = [];
			this.$http.get("_op:/areas/combox/search/" + str).then(data => {
                this.areaList = [{id:'',name:'全部'},...data.data];
			}).catch(() => {});
		},
        querySectionList(){
            this.$http.get("_ed:/apply/area/sectionnode/list").then(res => {
                if(res.data && res.data.length){
                    res.data.sort((a, b) => {
                        return a.id - b.id;
                    });
                }
                this.nodeList = res.data;
			}).catch(() => {});
        },
        addDate(date, days) {
            if (days == undefined || days == '') {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
        },
        getFormatDate(arg) {// 日期月份/天的显示，如果是1位数，则在前面加上'0'
            if (arg == undefined || arg == '') {
                return '';
            }
            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }
            return re;
        }
    },
}
</script>
<style lang="less">
    .order{
        .el-form-item{
            margin: 10px 0  0;
        }
        .el-form-item__content{
            margin: 0 20px 0 0;
        }
    }
    .record-box{
        .cm-dark th{
            background-color: #f7f7f7;
        }
    }
</style>
<style scoped lang="less">
    .record-box{
        padding: 0 20px;
    }
</style>

