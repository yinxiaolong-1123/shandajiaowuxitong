<template>
    <div class="cm-container">
        <div class="cm-breadcrumb">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}
				</el-breadcrumb-item>
			</el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="process">
                    <div slot="label" class="tab-width">流程（<span style="color:red;">{{ totalcount_process }}</span>）</div>
                </el-tab-pane>
                <el-tab-pane name="message">
                    <div slot="label" class="tab-width">消息（<span style="color:red;">{{ totalcount_message }}</span>）</div>
                </el-tab-pane>
            </el-tabs>
            <div v-show="activeName == 'process'">
                <el-radio-group v-model="statusTab" @change="changeStatus" size="small">
                    <el-radio-button v-for="item in statusList"
                        :key="item.label" 
                        :label="item.content"
                        :name="item.label">
                        {{ item.content }}&nbsp;(<span style="color:red;">{{ item.count }}</span>)
                    </el-radio-button>
                </el-radio-group>
            </div>
            <el-table v-show="activeName == 'process'" :data="processList" class="message-table">
                <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="title" label="标题" header-align="center">
                    <template slot-scope="scope">
                        <p @click="approve(scope.row,scope.$index)" class="title-content">
                            <span v-if="scope.row.messageStatus !== 'readed'" class="red-mark"></span>
                            <span :class="{'bold':scope.row.messageStatus !== 'readed'}" style="width:97%">{{ scope.row.title }}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="typeName" label="流程类型" width="80"></el-table-column>
                <el-table-column align="center" prop="reciveTime" label="接收时间" width="95">
                    <template slot-scope="scope">
                        <p>{{ scope.row.reciveTime ? scope.row.reciveTime.substring(0,10) : ''}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="creator" label="申请人" width="120"></el-table-column>
                <el-table-column align="center" prop="createTime" label="申请时间" width="95">
                    <template slot-scope="scope">
                        <p>{{ scope.row.createTime ? scope.row.createTime.substring(0,10) : '' }}</p>
                    </template>
                </el-table-column>
            </el-table>

            <el-table v-show="activeName == 'message'" :data="messageList" class="message-table">
                <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="title" label="消息" header-align="center">
                    <template slot-scope="scope">
                        <p @click="approve(scope.row,scope.$index)" class="title-content">
                            <span v-if="scope.row.messageStatus !== 'readed'" class="red-mark"></span>
                            <span :class="{'bold':scope.row.messageStatus !== 'readed'}" style="width:97%">{{ scope.row.title }}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="typeName" label="消息类型" width="80"></el-table-column>
                <el-table-column align="center" prop="creator" label="发送人" width="120"></el-table-column>
                <el-table-column align="center" prop="createTime" label="发送时间" width="95">
                    <template slot-scope="scope">
                        <p>{{ scope.row.createTime ? scope.row.createTime.substring(0,10) : '' }}</p>
                    </template>
                </el-table-column>
            </el-table>

            <div style="display:flex;justify-content:flex-end;padding-top:10px;">
                <el-pagination @size-change="sizeChange" @current-change="currentChange" background
                    :current-page.sync='currentpage' :page-size.sync='pagesize' :total='totalcount'
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>

        <!-- 课程详情 -->
        <el-dialog title="课程详情" :visible.sync="dialogDet" :append-to-body="true" width="40%">
			<div class="course-detail" v-for="(item,index) in detailList">
                <h4 :class="{'title': index !== 0}">课程</h4>
                <div class="content">
                    <p>排课课程：</p><p>{{ item.course }}</p>
                </div>

                <h4 class="title">课程内容</h4>
                <div class="content">
                    <p>授课形式：</p><p>{{ item.teaching_formname }}</p>
                </div>
                <div class="content">
                    <p>授课内容：</p><p>{{ item.teaching_content }}</p>
                </div>

                <h4 class="title">授课资源</h4>
                <div class="content">
                    <p>授课老师：</p><p>{{ item.teacher_names }}</p>
                </div>
                <div class="content">
                    <p>授课场地：</p><p>{{ item.area_name }}</p>
                </div>
                <div class="content">
                    <p>课程时间：</p><p>{{ item.schedule_item_date }}</p>
                </div>
                <div class="content">
                    <p>课&emsp;&emsp;节：</p><p>{{ item.section_nodenames }}</p>
                </div>
                
                <h4 class="title">上课班信息</h4>
                <div class="content">
                    <p>上&ensp;课&ensp;班：</p><p>{{ item.class_name }}</p>
                </div>
                <div class="content">
                    <p>教学模式：</p><p>{{ item.teaching_formname }}</p>
                </div>
                <div class="content">
                    <p>分&ensp;组&ensp;号：</p><p>{{ item.group_numbers }}</p>
                </div>
            </div>
		</el-dialog>

        <approval-detail v-if="dialogVisible"
			:dialogVisible.sync="dialogVisible" 
			:dialogTitle="dialogTitle"
            :showType="showType"
            :recoreid="recoreid">
		</approval-detail>

    </div>
</template>
<script>
import util from "@/util";
import moment from 'moment';
import approvalDetail from '../teaching_management/approval/approval_detail';
export default {
    provide(){
        return {
            getTableData: this.queryMessageList
        }
    },
    data () {
        return {
            userid: '',
			roles: [],
            breadcrumb: [
                {label: "消息中心"}
            ],
            tabList: [
                {label: 'process', content: '流程'},
                {label: 'message', content: '消息'}
            ],
            statusList: [
                {label: 'will', content: '待办', count: 0},
                {label: 'deal', content: '已办', count: 0},
                {label: 'done', content: '办结', count: 0}
            ],
            activeName: 'process',
            statusTab: '待办',
            pagesize: 10,
            currentpage: 1,
            totalcount: 0,
            chooseStatus: 1,
            processList: [],
            dialogVisible: false,
            dialogTitle:{},
            messageList: [],
            dialogDet: false,
            scrollLoading: {},
            detailList: [],
            showType: 1,
            recoreid: '',
            totalcount_process: 0,
            totalcount_message: 0,
        }
    },
    components: {
        approvalDetail
    },
    created() {
        if(util.getStorage("vuex")){
            let storage = JSON.parse(util.getStorage("vuex"));
            this.userid = storage.me.user.id || '';
            if(storage.me.roles && storage.me.roles.length){
                let all_roles = storage.me.roles;
                let role_id = [];
                all_roles.map(item => {
                    role_id.push(item.id)
                })
                this.roles = role_id;
            }
        }

        this.queryMessageList(this.pagesize,this.currentpage,'process',1);
        this.queryAllUserAdjustCount(this.pagesize,this.currentpage,'process',2);
        this.queryAllUserAdjustCount(this.pagesize,this.currentpage,'process',0);
        this.queryAllUserAdjustCount(this.pagesize,this.currentpage,'message','');
    },
    watch: {
        statusTab (val) {
            this.pagesize = 10;
            this.currentpage = 1;
            this.totalcount = 0;
            this.chooseStatus = null;
            (val == '待办') ? this.chooseStatus = 1 : (val == '已办' ? this.chooseStatus = 2 : this.chooseStatus = 0);
        }
    },
    methods: {
        openFullScreen() {
			this.scrollLoading = this.$loading({
				lock: true,
				text: '努力加载中···',
			});
		},
        approve (row,index) { //调取审批组件
            if(row.messageStatus !== 'readed'){ //未读消息点击后，标记状态为已读
                this.updateMsgStatus(row,index,1);
            }

            this.recoreid = row.id.toString();
            this.showType = 1;
            if(this.activeName == 'process'){
                this.chooseStatus == 1 ? this.showType = 0 : this.showType = 1;
            }
            this.dialogTitle = this.showType === 0 ? {name:'调课审核',type:0} : {name:'调课详情',type:1};
            this.dialogVisible = true;
        },
        updateMsgStatus(row,index,change){
            this.$http.post("_ed:/messageCenter/updateMessageStatus",{
                userId: this.userid, 
                messageId: row.id,
                updateType: change   //已读1  删除2
            }).then(res => {
                if(res.code == 0){
                    this.queryMessageList(this.pagesize,this.currentpage,this.activeName,this.chooseStatus);
                }
            }).catch(()=>{})
        },
        handleClick (tab) {
            this.queryMessageList(this.pagesize,this.currentpage,this.activeName,this.chooseStatus);
        },
        sizeChange () {
            this.queryMessageList(this.pagesize,this.currentpage,this.activeName,this.chooseStatus);
        },
        currentChange () {
            this.queryMessageList(this.pagesize,this.currentpage,this.activeName,this.chooseStatus);
        },
        changeStatus () {
            this.queryMessageList(this.pagesize,this.currentpage,this.activeName,this.chooseStatus);
        },
        queryMessageList (pagesize, currentpage, activeName, chooseStatus) {
            this.processList = [];
            this.$http.post("_ed:/messageCenter/queryMessageList",{
                userId: this.userid,
                roles: this.roles,
                processStatus: activeName == 'message' ? '' : chooseStatus,
                pageSize: pagesize,
                pageNo: currentpage,
                category: activeName
            }).then(res=>{
                if(res.code == 0){
                    if(res.data){
                        (activeName == 'process') && (this.processList = res.data.list || []);
                        (activeName == 'message') && (this.messageList = res.data.list || []);
                        this.totalcount = res.data.total_records || 0;
                    }
                }else{
                    this.$message(res.msg);
                }
			}).catch(()=>{
                this.$message.error('后台错误');
			})
            this.queryAllUserAdjustCount(pagesize, currentpage, activeName, chooseStatus);
        },
        queryAllUserAdjustCount (pagesize, currentpage, activeName, chooseStatus) {
            this.$http.post("_ed:/messageCenter/queryAllUserAdjustCount",{
                userId: this.userid,
                roles: this.roles,
                processStatus: activeName == 'message' ? '' : chooseStatus,
                pageSize: pagesize,
                pageNo: currentpage,
                category: activeName
            }).then(res=>{
                if(res.code == 0){
                    if(activeName == 'process'){
                        switch(+chooseStatus){
                            case 0: this.$set(this.statusList[2],'count',res.data.itemcount); break;
                            case 1: this.$set(this.statusList[0],'count',res.data.itemcount); break;
                            case 2: this.$set(this.statusList[1],'count',res.data.itemcount); break;
                        }
                    }
                    (activeName == 'process') && (this.totalcount_process = res.data.totalcount);
                    (activeName == 'message') && (this.totalcount_message = res.data.totalcount);
                }else{
                    this.$message(res.msg);
                }
			}).catch(()=>{
                this.$message.error('后台错误');
			})
        },
        showDetail (row) {
            this.openFullScreen();
            let scheduleItemId = this.GetQueryString(row.url,'scheduleItemId');
            this.$http.post("_ed:/schedule/item/query/detail",{
                schduleItemIds: [scheduleItemId]
            }).then(res=>{
                this.scrollLoading.close();
                if(res.code == 0){
                    if(res.data){
                        this.detailList = res.data || [];
                        this.dialogDet = true;
                    }else{
                        this.$message('未查询到消息详情');
                    }
                }else{
                    this.$message.error(res.msg);
                }
			}).catch(()=>{
                this.scrollLoading.close();
                this.$message.error('后台错误');
			})
        },
        GetQueryString(url,name) {
            let new_array = url.split('?');
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = new_array[1].match(reg); //获取url中"?"符后的字符串并正则匹配
            var context = ""; 
            if (r != null) 
                context = r[2]; 
                reg = null; 
                r = null; 
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
    }
}
</script>
<style lang="less">
    .message-table{
        width: 100%;
        .cell{
            display: block !important;
        }
    }
</style>

<style lang="less" scoped>
    .tab-width{
        display:inline-block;
        padding-left:30px;
        padding-right:30px;
    }
    .bold{
        font-weight: bold;
    }
    .red-mark{
        width: 7px;
        height: 7px;
        background-color: #f56c6c;
        border-radius: 50%;
        margin-right:5px;
    }
    .title-content{
        cursor:pointer;
        display: flex;
        align-items: center;
    }
    .course-detail {
        border-bottom: 1px solid #dcdfe6;
        padding: 0 15px 15px;
        box-sizing: border-box;
        .title{
            margin-top: 30px;
        }
        .content{
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
        }
        .content p:nth-child(1){
            flex-shrink:0;
        }
    }
    .course-detail:last-child{
        border-bottom: 1px solid transparent;
    }
</style>
