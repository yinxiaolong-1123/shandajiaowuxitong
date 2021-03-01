<template>
    <el-dialog 
    title="场地预约"
    class="place"
    :before-close="handleClose"
    :visible.sync="orderDialog"
    width="40%"
    append-to-body 
    :close-on-click-modal="false">
        <el-form :model="orderForm"
            :disabled="disabled"
            :rules="rules" 
            ref="orderForm" 
            label-width="150px" label-position="left" size="small"
            @submit.native.prevent="refuseSubmit" class="order-form">
            <el-form-item label="场地" prop="place">
                <el-select v-model="orderForm.place" filterable>
                    <el-option v-for="item in areaList" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="role">
                <el-radio-group v-model="orderForm.role" @change="changeRole">
                    <el-radio label="s">学生</el-radio>
                    <el-radio label="t">老师</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="申请人" prop="proposer">
                <el-select clearable placeholder="请输入人名搜索"
                    v-model="orderForm.proposer" 
                    filterable remote :loading="loading"
                    :remote-method="queryProposer"
                    value-key="id">
                    <el-option v-for="item in proposerList" :value="item" :label="item.name">
                        {{ item.name + ' ' + (item.teacherNo || item.stuNum) }}
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="预约方式" prop="way">
                <el-radio-group v-model="orderForm.way">
                    <el-radio label="1">按课节预约</el-radio>
                    <el-radio label="2">按时间预约</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="日期" prop="date">
                <el-date-picker type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择日期" 
                    v-model="orderForm.date"
                    :picker-options="pickerOptions" 
                    style="width: 100%;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="课节" prop="node">
                <el-select v-model="orderForm.node" filterable multiple value-key="id">
                    <el-option v-for="item in nodeList" :value="item" :key="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用途" prop="purpose">
                <el-select v-model="orderForm.purpose" clearable placeholder="">
                    <el-option v-for="item in purposeList" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否需要多媒体设备" prop="media">
                <el-radio-group v-model="orderForm.media">
                    <el-radio label="1">需要</el-radio>
                    <el-radio label="0">不需要</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="使用人数" prop="usernum">
                <el-input v-model.number="orderForm.usernum"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model.number="orderForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" v-model.trim="orderForm.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <div style="text-align:right;" v-if="detailStatus == 'edit'">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button @click="submit('orderForm')" type="primary">确定</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div style="text-align:right;" v-if="detailStatus == 'scan'">
            <el-button @click="handleClose">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
import util from "@/util";

export default {
    inject: ['queryPlaceList'],
    props: {
        applyId: '',
        detailStatus: {
            type: String,
            default: ''
        },
        usedEdit: {
           type: Boolean,
            default: false 
        },
        startTime: {},
        endTime: {},
        orderDialog: {
            type: Boolean,
            default: false
        },
        areaList: {
            type: Array,
            default: []
        },
        nodeList: {
            type: Array,
            default: []
        },
        semesterId: '',
        chooseAreaid: {},
        chooseDate: {},
        chooseNode: {}
    },
    data () {
        var validNumber = (rule, value, callback) => {
            if(value && !Number.isInteger(value)){
                callback(new Error('请输入数字'));
            }else{
                callback();
            }
        };
        var validProposer = (rule, value, callback) => {
            if(!value.id && this.detailStatus == 'edit'){
                callback(new Error('请选择申请人'));
            }else{
                callback();
            }
        };
        return {
            disabled: this.detailStatus == 'edit' ? false : true,
            pickerOptions: {},
            loading: false,
            proposerList: [],
            purposeList: [],
            orderForm: {
                place: '',
                role: 't',
                proposer: {},
                way: 0,
                purpose: '',
                date: '',
                node: [],
                media: '0',
                usernum: null,
                mobile: null,
                remark: '',
            },
            rules: {
                place:[
                    { required: true, message: '请选择场地', trigger: 'change' }
                ],
                proposer:[
                    { required: true, validator: validProposer, trigger: 'change' }
                ],
                date:[
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                node:[
                    { required: true, message: '请选择课节', trigger: 'change' }
                ],
                mobile:[
                    { trigger: 'blur', validator: validNumber }
                ],
                usernum:[
                    { trigger: 'blur', validator: validNumber }
                ]
            }
        }
    },
    created () {
        // this.querySectionList();
        this.queryPurposeList();
    },
    mounted () {
        if(this.detailStatus == 'scan' || this.usedEdit){
            this.queryPlaceDetail();
        }
        if(this.detailStatus == 'edit'){
            this.orderForm.place = this.chooseAreaid;
            this.orderForm.date = this.chooseDate;
            if(this.startTime && this.endTime){
                let _start = new Date(this.startTime).getTime();
                var currentRange = null;
                let _end = new Date(this.endTime);
                let new_end = new Date(_end.setDate(_end.getDate() + 1)).getTime();//原来基础上加一天

                this.pickerOptions.disabledDate = (time) => {
                    if (_start < time.getTime() && time.getTime() < new_end) {
                        return false
                    }
                    return true
                }
            }
        }
        if(this.chooseNode != '' && this.detailStatus == 'edit'){
            let _node = []
            this.nodeList.map(node => {
                if(this.chooseNode == node.name){
                    _node.push(node);
                }
            })
            this.$nextTick(()=>{
                this.$set(this.orderForm,'node',_node)
            })
        }
    },
    methods: {
        refuseSubmit(){
            return false;
        },
        handleClose(){
            this.$emit('update:orderDialog',false);
        },
        queryPlaceDetail(){
            const loading = this.$loading({
                lock: true,
                text: '加载中···',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$http.get("_ed:/apply/area/queryApplyAreaDetail/" + this.applyId).then(res => {
				if(res.code == 0){
                    this.orderForm.place = res.data.area_id || '';
					this.orderForm.role = res.data.applyer_type || '';
                    if(res.data.applyer_name){
                        this.queryProposer(res.data.applyer_name,'mate')
                    }else{
                        this.orderForm.proposer = '';
                    }
                    // this.orderForm.proposer.name;
                    // this.orderForm.proposer.unionId;
                    this.orderForm.date = res.data.use_date || '';
                    this.orderForm.purpose = res.data.use_type || '';
                    this.orderForm.media = res.data.multimedia || '';
                    this.orderForm.usernum = res.data.use_qty || '';
                    this.orderForm.mobile = +res.data.mobile || null;
                    this.orderForm.remark = res.data.remark || '';
                    let current_node = res.data.section_nodename && res.data.section_nodename.split(",") || [];
                    let nodes = [];
                    this.nodeList.map(item => {
                        current_node.map(node => {
                            if(node == item.name){
                                nodes.push(item);
                            }
                        })
                    })
                    this.$nextTick(()=>{
                        this.$set(this.orderForm,'node',nodes);
                    })
                    console.log(this.orderForm)
				}else{
					this.$message("查询失败")
				}
			}).then(()=>{
                loading.close();
            }).catch(() => {
                loading.close();
				this.$message.error("后台错误");
			});
        },
        submit(formName){
            this.$refs[formName].validate(valid => {
                if(!valid) return;
                let node_id = [],node_name = [];
                this.orderForm.node.map(item => {
                    node_id.push(item.id);
                    node_name.push(item.name);
                })
                let storage = JSON.parse(util.getStorage("vuex"));

                let data = {
                    semester_id: this.semesterId,
                    applyer_id: this.orderForm.proposer.unionId,
                    applyer_name: this.orderForm.proposer.name,
                    applyer_type: this.orderForm.role,     //s:学生 t:教师
                    area_id: this.orderForm.place,
                    create_user: storage.me.user.id,
                    create_username: storage.me.user.name,
                    mobile: this.orderForm.mobile,
                    multimedia: this.orderForm.media,   //需要：1 不需要0
                    remark: this.orderForm.remark,
                    section_nodeid: node_id,
                    section_nodename: node_name.toString(),  // 2,3,4,6
                    type: this.orderForm.way, //按课节0   按时间1
                    use_date: this.orderForm.date,   //使用日期
                    use_qty: this.orderForm.usernum, //使用人数
                    use_type: this.orderForm.purpose,    //用途
                }
                let _url = '';
                if(this.usedEdit){
                    _url = "_ed:/apply/area/update";
                    data.apply_area_id = this.applyId;
                }else{
                    _url = "_ed:/apply/area/add"
                }
                this.$http.post(_url,data).then(res => {
                    if(res.code === 0){
                        if(this.usedEdit){
                            this.$message.success("修改成功");
                        }else{
                            this.$message.success("预约成功");
                        }
                        setTimeout(_ => {
                            this.queryPlaceList();
                            this.$emit('update:orderDialog',false);
                        },1000)
                    }else{
                        this.$message(res.msg)
                    }
                }).catch(() => {
                    this.$message.error("后台错误，预约失败！");
                });
            })
        },
        changeRole(){
            this.proposerList = [];
            this.orderForm.proposer = {};
        },
        queryProposer(query,type){
            let stu = '/students/list', teach = '/teachers/list', queryPort = '';

            if(query === '') return;
            let queryMsg = {};
            if(this.orderForm.role == 's'){
                queryPort = stu;
                queryMsg = {param:{name: query}};
            };
            if(this.orderForm.role == 't'){
                queryPort = teach;
                queryMsg = {pageNo:1,pageSize:1000,param:{name: query}};
            };
            
            this.loading = true;
            this.$http.post("_op:" + queryPort,queryMsg).then(res => {
                this.loading = false;
                if(res.code == 0 && this.orderForm.role == 's') this.proposerList = res.data.records;
                if(res.code == 0 && this.orderForm.role == 't') this.proposerList = res.data.result;
                if(this.proposerList && this.proposerList.length && type == 'mate'){
                    this.$set(this.orderForm,'proposer',this.proposerList[0])
                }
			}).catch(()=>{})
        },
        querySectionList(){
            this.$http.get("_ed:/apply/area/sectionnode/list").then(res => {
                if(res.data && res.data.length){
                    res.data.sort((a, b) => {
                        return a.id - b.id;
                    });
                }
                this.nodeList = res.data;
                if(this.chooseNode != '' && this.detailStatus == 'edit'){
                    let _node = []
                    this.nodeList.map(node => {
                        if(this.chooseNode == node.name){
                            _node.push(node);
                        }
                    })
                    this.$nextTick(()=>{
                        this.$set(this.orderForm,'node',_node)
                    })
                }
			}).catch(() => {});
        },
        queryPurposeList(){
            this.$http.get("_ed:/apply/area/applyuse/list").then(res => {
				this.purposeList = res.data;
			}).catch(() => {});
        },
    },
}
</script>
<style lang="less">
    .place .order-form .el-select{
        width: 100%;
    }
    .place .el-radio-group{
        width: 100%;
        .el-radio{
            width:42%;
        }
    }
</style>

