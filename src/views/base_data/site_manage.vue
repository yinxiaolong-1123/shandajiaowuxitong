<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail-show-2">
                        <el-form-item label="场地名">
                            <el-input v-model="searchAreaName" placeholder="请输入场地名称" clearable></el-input>
                        </el-form-item>
                         <!-- <el-form-item label="部门">
                            <el-autocomplete value-key='name' clearable v-model="departmentName"
                                :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
                            </el-autocomplete>
                        </el-form-item> -->
                           <el-form-item label="课室单位">
                                <el-select placeholder="请选择" v-model="searchDepartmentName" clearable filterable>
                                <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                              </el-select>
                           </el-form-item>
                        
                         <el-form-item label="楼栋名称">
                            <el-select v-model="searchBuildId" placeholder="请选择" clearable filterable>
                                <el-option v-for="item in buildData" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="管理员">
                              <el-select v-model="searchManagerId" placeholder="请输入管理员" clearable filterable remote
                                :remote-method="getTeachers" style="width:120px">
                                <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.query">
                            <el-button type="primary" size="mini" @click="search">查询</el-button>
                        </el-form-item>
                        <el-form-item v-if="btnPerObj.add">
                            <el-button type="primary" size="mini" @click="addSite">新增</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>

        <div class="cm-table">
            <el-table :data="tableData" border style="width: 100%" size="mini" header-row-class-name="cm-dark"
                v-loading="tableLoading" element-loading-text="加载中……"
                element-loading-background="rgba(255, 255, 255, 0.8)">

                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="buildName" label="楼栋" width="200"> </el-table-column>
                <el-table-column prop="floor" label="楼层" width="60"> </el-table-column>
                <el-table-column prop="num" label="房号"> </el-table-column>
                <el-table-column prop="name" label="场地名称" width="250"> </el-table-column>
                <el-table-column prop="departmentName" label="课室单位" > </el-table-column>
                <el-table-column prop="size" label="面积">
                    <template slot-scope="scope">{{ scope.row.size == 0 ? "" : scope.row.size }}</template>
                </el-table-column>
                <el-table-column prop="code" label="场地编码"> </el-table-column>
                <el-table-column prop="capacity" label="容纳人数">
                    <template slot-scope="scope">{{ scope.row.capacity == 0 ? "" : scope.row.capacity }}</template>
                </el-table-column>
                <el-table-column prop="testCapacity" label="容纳考试人数">
                    <template
                        slot-scope="scope">{{ scope.row.testCapacity == 0 ? "" : scope.row.testCapacity }}</template>
                </el-table-column>
                <el-table-column prop="managerName" label="管理员"> </el-table-column>
                <el-table-column prop="typeName" label="类别"> </el-table-column>
                <!--<el-table-column prop="storeNum" label="物品存储数量"> </el-table-column>-->
                <el-table-column prop="updateTime" label="修改时间"  width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.updateTime !== null">
                            {{ scope.row.updateTime }}
                        </template>
                        <template v-else>
                            {{ scope.row.createTime }}
                        </template>
                    </template>
                </el-table-column>

                <el-table-column v-if="btnPerObj.edit||btnPerObj.delete" fixed="right" label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editSite(scope.row)" v-if="btnPerObj.edit">编辑
                        </el-button>
                        <el-button type="text" size="small" @click="deleteSite(scope.row)" style="color: red;"
                            v-if="btnPerObj.delete">删除</el-button>
                        <!--<el-button type="text" size="small" @click="deleteManager(scope.row)">删除管理员</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="cm-pagination">
            <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange"
                @current-change="currentChange">
            </el-pagination>
        </div>

        <!--新增或编辑场地-->
        <el-dialog :title="dialog.status==='add'?'新增场地':'编辑场地'" :visible.sync="dialog.visible" width="900px"
            append-to-body :close-on-click-modal="false">
            <div class="clearfix site-form-box">
                <div class="sitepopcell">
                    <label><span>*</span>楼栋</label>
                    <el-select v-model="buildId" placeholder="请选择" clearable filterable>
                        <el-option v-for="item in buildList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="sitepopcell">
                    <label><span>*</span>楼层</label>
                    <input
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        class="content" :maxlength="3" v-model="floor">
                </div>
                 
             
                  <!-- <el-form-item label="部门">
            <el-autocomplete value-key='name' clearable v-model="buildingForm.departmentName"
                :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
            </el-autocomplete>
        </el-form-item> -->

             
                <div class="sitepopcell">
                    <label><span>*</span>房号</label>
                    <input class="content" v-model="roomNum">
                </div>
                <div class="sitepopcell">
                    <label><span>*</span>类别</label>
                    <el-select placeholder="请选择" v-model="cateId" clearable filterable>
                        <el-option v-for="item in roomCateList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="sitepopcell">
                    <label><span>*</span>场地名称</label>
                    <input class="content" :maxlength="40" v-model="siteName" @keyup="commonRules(siteName)">
                </div>
                 <!-- {{departmentName}} -->
                 <div class="sitepopcell  ">
                            <label> <span></span>课室单位</label>
                             <el-select placeholder="请选择"  @change="handleSelect" v-model="department" clearable filterable value-key="id">
                                <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item">
                                </el-option>
                            </el-select>
                    </div>
                <div class="sitepopcell">
                    <label>管理员</label>
                    <el-select v-model="managerId" placeholder="请输入管理员" clearable filterable remote
                        :remote-method="getTeachers">
                        <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="sitepopcell">
                    <label>面积</label>
                    <input class="content" :maxlength="20" v-model="siteArea">
                </div>
                  
                <div class="sitepopcell">
                    <label>场地编码</label>
                    <input class="content" v-model="siteCode" :maxlength="20" style="width:100px;margin-right: 10px;">
                    <!--<el-button type="primary" @click="runcode" size="mini" >生成</el-button>-->
                </div>

                <div class="sitepopcell">
                    <label>容纳人数</label>
                    <input
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        class="content" :maxlength="20" v-model="capacity">
                </div>
                <div  class="sitepopcell">
                    <label>容纳考试人数</label>
                    <input
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        class="content" :maxlength="20" v-model="testCapacity">
                </div>
                <div class="sitepopcell" style="height:120px;">
                    <label>场地介绍:</label>
                    <textarea style="height: 120px;font-size: 14px;" :maxlength="100" class="content" type="text"
                        v-model="description"></textarea>

                </div>
                <div class="sitepopcell" style="height:120px;">
                    <label>可用功能:</label>
                    <textarea style="height: 120px;font-size: 14px;" :maxlength="100" class="content" type="text"
                        v-model="placeFun"></textarea>
                </div>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()">保 存</el-button>
                <el-button @click="cancelDialog">取 消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '@/util'
    import {
        mapState
    } from 'vuex'
     import { encodeQueryParam } from '@/api/utils'
 import Department from '@/api/department'



    // const regSit=/^.{32}$/;
    const regCode = /[@#\$%\^&\*]+/g; //特殊字符
    export default {
        data() {
            return {
                breadcrumb: [{
                        label: "基础数据"
                    },
                    {
                        label: "场地维护"
                    },
                ],
                searchAreaName:"",//搜场地名
                searchDepartmentName:"",//搜索部门
                searchBuildId:"",//搜索楼栋名称
                searchManagerId:"",//搜素管理员
               
                departmentId:"",//部门ID
                tableData: [], //场地列表
                areaName: '', //场地名
                searchAreaName:"",//搜索场地名
                department:"",//部门
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                buildList: [], //楼栋列表
                buildData:[], //搜索楼栋列表
                buildId: '', //楼栋id
               
                floor: '', //楼层
                roomNum: '', //房间号
                cateId: '', //房间类型
                roomCateList: [], //房间类型列表
                departments:[],//部门
                siteName: '', //场地名称
                siteArea: '', //场地面积
                siteCode: '', //场地编码
                description: '', //场地详情
                placeFun: '', //场地功能
                managerId: '', //管理员id
                capacity: '', //容纳人数
                testCapacity: '', //容纳考试人数
                teacherList: [], //管理员列表
                siteId: '', //场地id
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },
                dialog: {
                    status: 'add',
                    visible: false,
                },
                tableLoading: false,
                btnPerObj: { //按钮权限
                    add: false,
                    query: false,
                    edit: false,
                    delete: false
                },
                selectNameOjb: {}

            }
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
            };

            util.openBtnPermit(this.btnPerObj);
            //          this.getBtnPermit();
        },
        created() {
            this.getTableData(1, 10);
            // this.getTeachers(' ');
            this.getDepartments()
            this.getbuildList();
             this.getbuildList1();
            this.getDictsList();
        },
        computed: {
            ...mapState(['btnPermitList']),
        },
        watch: {
            roomNum(val) {
                if (val.length > 32) {
                    this.$message({
                        message: "房号长度不能超过32位",
                        type: 'warning'
                    });
                }
            }

        },
        methods: {
            getDepartments(){
                this.$http.get(`_ed:/department/queryAreaDepartmentList`).then(resp => {
                    var temp = JSON.parse(JSON.stringify(resp.data));
                    this.departments = temp.map(next => {
                        return {
                            id: next.departmentid,
                            name: next.name
                        };
                    });
                    // this.departments = JSON.parse(JSON.stringify(resp.data));
                }).catch(err => console.error(err));
            },
                // 部门
            querySearchAsync(queryString, cb) {
                
                if (queryString.length > 1) {
                    let self = this;
                    let params = encodeQueryParam({
                        name$LIKE: queryString,
                        code$LIKE: queryString
                    });
                    
                    Department.list(params).then(res => {
                        
                        self.restaurants = res.data;
                        clearTimeout(self.timeout);
                        self.timeout = setTimeout(() => {
                            cb(self.restaurants);
                        }, 3000 * Math.random());

                    });
                }

            },
           handleSelect(item) {
               console.log('555555', item)
                this.departmentId = item.id
             
            },
            //获取按钮权限
            getBtnPermit() {
                let self = this;
                let actionId = this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
                    data.data.map(item => {
                        if (item.code == "query_changdiweihu") {
                            self.btnPerObj.query = true;
                        }
                        if (item.code == "add_changdiweihu") {
                            self.btnPerObj.add = true;
                        }
                        if (item.code == "edit_changdiweihu") {
                            self.btnPerObj.edit = true;
                        }
                        if (item.code == "del_changdiweihu") {
                            self.btnPerObj.delete = true;
                        }
                    });
                }).catch(() => {})
            },

            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            },
            // this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId);
            getTableData(pageNo, pageSize, field, department,floor,Administrators) {
                this.tableLoading = true;
                this.$http.post('_op:areas/list', {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    param: {
                    //   buildId  楼栋    departmentId 部门   magagerId  管理
                        name:field,
                        departmentId:department,
                        buildId:floor,
                        managerId:Administrators,
                    }
                }).then(data => {
                    this.tableData = data.data.records;
                    this.totalCount = data.data.total;
                    this.tableLoading = false;
                }).catch(() => {
                    this.tableData = [];
                    this.tableLoading = false;
                })
            },
            search() {
                this.pageNo = 1;
                // searchAreaName//场地
                // searchDepartmentName//部门
                // searchBuildId//楼栋
                // searchManagerId//管理员
                this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
            },
            sizeChange(size) {
                this.pageNo = 1;
                this.pageSize = size;
                this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
            },
            currentChange(current) {
                this.pageNo = current;
                this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
            },
            addSite() {
                this.initSiteParam();
                this.dialog = {
                    status: 'add',
                    visible: true,
                }
            },
            commonRules(name) {
                this.siteName = name.replace(/\s*/g, "");

            },
            editSite(row) {
                this.buildId = parseInt(row.buildId);
                this.floor = row.floor;
                this.roomNum = row.num;
                this.cateId = parseInt(row.typeId) === 0 ? '' : parseInt(row.typeId);
                this.siteName = row.name;
                this.managerId = (row.managerId * 1) === 0 ? '' : (row.managerId * 1);
                this.siteArea = row.size === 0 ? '' : row.size;
                this.siteCode = row.code;
                //this.siteArea=row.size;
                this.capacity = row.capacity === 0 ? '' : row.capacity;
                this.testCapacity = row.testCapacity === 0 ? '' : row.testCapacity;
                this.description = row.description;
                this.placeFun = row.action;
                // this.departmentName=row.department.name;
                // this.departmentId=row.department.id
                if(row.department){
                    this.department = row.department;
                }else{
                    this.department = {
                        id: row.departmentId,
                        name: row.departmentName
                    }
                }
                
                this.siteId = row.id;

                this.dialog = {
                    status: 'edit',
                    visible: true,
                }
            },
            deleteSite(row) {
                this.$confirm(`此操作将永久删除“${row.buildName}”所维护的信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('_op:areas/' + row.id).then(data => {
                        let type = "success";
                        let message = "删除成功！";
                        if (data.code == 0) {
                           this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
                        } else {
                            type = "error";
                            message = data.msg;
                        }
                        this.$message({
                            type: type,
                            message: message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteManager(row) {

            },
            getbuildList() {
                this.$http.post('_op:building/allBuilding', {}).then(data => {
                    this.buildList = data.data;
                }).catch(() => {
                    this.buildList = [];
                })
            },
             getbuildList1() {
                this.$http.post('_op:building/allBuilding', {}).then(data => {
                    this.buildData = data.data;
                }).catch(() => {
                    this.buildData = [];
                })
            },
            onTeacher(val) {
                let selectNameOjb;
                if (!val) {
                    this.getTeachers(" ");
                }
                this.selectNameOjb = this.teacherList.find(item => {
                    return val = item.id;
                })

               
            },
            onBlurChange() {
                this.getTeachers(" ");
            },
            getTeachers(str) { //管理员
                this.$http.get('_op:/teachers/combox/' + str, {}).then(data => {
                    this.teacherList = data.data;
                }).catch(() => {})
            },
            getDictsList() {
                this.$http.post('_op:dicts/getDictsList', {
                    type: "place-category"
                }).then(data => {
                    this.roomCateList = data.data;
                }).catch(() => {
                    this.roomCateList = [];
                })
            },
            initSiteParam() {
                this.buildId = '';
                this.description = '';
                this.siteCode = '';
                this.floor = '';
                this.managerId = '';
                this.siteName = '';
                this.roomNum = '';
                this.siteArea = '';
                this.placeFun = '';
                this.cateId = '';
                this.managerId = '';
                this.capacity = '';
                this.testCapacity = '';
                this.department = {};
            },
            cancelDialog() {
                this.dialog.visible = false;
            },
            verifyParameters() {
                var self = this;
                if (this.buildId == '') {
                    this.$message({
                        message: '请选择楼栋',
                        type: 'warning'
                    });
                    return false;
                } else if (this.floor == '') {
                    this.$message({
                        message: '请填写楼层',
                        type: 'warning'
                    });
                    return false;
                } else if (this.roomNum == '') {
                    this.$message({
                        message: '请填写房号',
                        type: 'warning'
                    });
                    return false;
                } else if (this.siteName == '') {
                    this.$message({
                        message: '请填写场地名称',
                        type: 'warning'
                    });
                    return false;
                } else if (this.cateId == '') {
                    this.$message({
                        message: '请选择类别',
                        type: 'warning'
                    });
                    return false;
                }
            },
            save() {
                if (this.verifyParameters() == false) {
                    return false
                }
                // if(this.roomNum.length>10){
                //     this.$message.warning("房号长度不能超过32位");
                //     return ;
                // }
                if (regCode.test(this.siteName)) {
                    this.$message.error("场地名称填写有误！");
                    return;
                }
//    debugger   
                 console.log('departmentName',this.department);
                 console.log('departmentId', this.department.id);
                let data = {
                   
                    // departmentId:this.departmentId,//部门名称
                    // departmentName:this.departmentName,//部门名称
                    departmentId:this.department.id,//部门名称
                    departmentName:this.department.name,//部门名称
                    buildId: this.buildId,
                    floor: this.floor,
                    num: this.roomNum,
                    typeId: this.cateId,
                    name: this.siteName,
                    managerId: this.managerId,
                    size: this.siteArea,
                    code: this.siteCode,
                    capacity: this.capacity,
                    testCapacity: this.testCapacity,
                    description: this.description,
                    action: this.placeFun
                }
                if (this.dialog.status == 'add') {
              
                    this.$http.post('_op:areas', data).then(data => {
                        if (data.code == 0) {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                        }else{
                            this.$message.error(data.msg);
                        }
                         this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
                        this.dialog.visible = false;
                    }).catch(() => {})
                } else {
                 
                    data.id = this.siteId;
                    this.$http.put('_op:areas', data).then(data => {
                        if (data.code == 0) {
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });

                        }
                       this.getTableData(this.pageNo, this.pageSize, this.searchAreaName,this.searchDepartmentName,this.searchBuildId,this.searchManagerId,);
                        this.dialog.visible = false;
                    }).catch(() => {})
                }


            }
        },

    }
</script>

<style scoped lang="less">
    .sitepoptitle {
        background-color: #e5e6e8;
        font-size: 20px;
        padding: 10px;
        padding-left: 20px;
        margin-bottom: 20px;
    }

    .clearfix {
        // display: flex;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .sitepopcell {
        display: inline-flex;
        width: 50%;
        margin-bottom: 10px;
        align-items: center;
    }
      .sitepopcells {
        width: 351px;
      margin-left: 14px;
    }
    .el-input--suffix .el-input__inner {
    padding-right: 90px;
}

    .sitepopdetcell {
        width: 80%;
        margin: 0 0 20px 4%;
    }

    .sitepopdetcell label {
        width: 20%;
        text-align: left;
        display: inline-block;
    }

    .sitepopcell label {
        width: 20%;
        text-align: left;
        display: inline-block;

        span {
            color: #F56C6C;
            font-size: 20px;
        }
    }

    .sitepopcell .el-select {
        width: 65%;
    }

    .site-form-box .sitepopdetcell .content {
        width: 50%;
        height: 40px;
        box-sizing: border-box;
        padding: 0 15px;
        position: relative;
        border-radius: 3px;
        border: 1px solid #bfcbd9;
        vertical-align: top;
        margin-bottom: 20px;
    }

    .sitepopcell .content {
        width: 64%;
        height: 40px;
        box-sizing: border-box;
        padding: 0 15px;
        position: relative;
        border-radius: 3px;
        border: 1px solid #bfcbd9;
    }

    .imgbox {
        display: inline-block;
        position: relative;
        margin-right: 20px;
    }

    .sitepopdetcell .detailBtn {
        border: none;
        position: relative;
        background-color: transparent;
        font-size: 60px;
        line-height: 40px;
        cursor: pointer;
    }
</style>