<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-btn-con cm-fold">
      <el-form :inline="true" size="mini" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="校区">
              <el-select v-model="formInline.campusId" @change="handleCampusSelect">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in campusList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="楼栋名称">
              
              <el-select v-model="formInline.buildingId">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in buildingList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
              <!-- <el-form-item label="部门">  //暂时不做，
                    <el-autocomplete value-key='name' clearable v-model="formInline.departmentName"
                        :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
                    </el-autocomplete>
               </el-form-item> -->
            <el-form-item label="电梯">
              <el-select v-model="formInline.hasElevator">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="getTableData">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-btn-con cm-fold" v-if="btnPerObj.add">
      <el-button type="primary" size="mini" @click="addbuilding" style="margin-bottom: 10px;">新增楼栋</el-button>
    </div>
    <div class="cm-table">
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" size="mini" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="楼栋名称" prop="name"></el-table-column>
         <el-table-column label="部门" prop="departmentName"></el-table-column>
        <el-table-column label="所属校区" prop="campusName"> </el-table-column>
        <el-table-column label="所属院系" prop="universityName"> </el-table-column>
        <el-table-column label="电梯" prop="hasElevator">
          <template slot-scope="scope">
            <template v-if="scope.row.hasElevator == true">是</template>
            <template v-else-if="scope.row.hasElevator == false">否</template>
          </template>
        </el-table-column>
        <el-table-column label="经纬度" prop="longLatItude"> </el-table-column>
        <el-table-column v-if="btnPerObj.edit||btnPerObj.del" label="操作" width="90">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="updatebuilding(scope.row)" v-if="btnPerObj.edit"> 修改</el-button>
            <el-button size="small" type="text" @click="deletebuilding(scope.row)" style="color: red;" v-if="btnPerObj.delete"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="cm-pagination">
      <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </div>

    <!-------------------------------新增------------------------------------>

    <el-dialog :title="dialog_title" :visible.sync="dialog_build" width="400px" append-to-body :close-on-click-modal="false" custom-class="cm-dialog-small building-manage-dialog" autofocus=true @close="dialogClose">
      <el-form :inline="true" :model="buildingForm" ref="buildingForm" :rules="rules" label-width="100px">
        <el-form-item class="add-input-item" label="代码" prop="code">
          <el-input v-model="buildingForm.code" placeholder="请输入楼栋代码"></el-input>
        </el-form-item>
        <el-form-item class="add-input-item" label="楼栋名称" prop="name">
          <el-input v-model="buildingForm.name"></el-input>
          <!-- <el-select v-model="buildingForm.buildingId" @change="findName">
                        <el-option v-for="item in buildingList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select> -->
        </el-form-item>
         <el-form-item label="部门" prop="departmentId">
            <!-- <el-autocomplete value-key='name' clearable v-model="buildingForm.departmentName"
                :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
            </el-autocomplete> -->
            <el-select v-model="buildingForm.departmentId" clearable filterable
              placeholder="请输入部门名称">
              <el-option v-for="item in allDepartments" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>

        <el-form-item class="add-select-item" label="所属校区">
          <el-select v-model="buildingForm.campusId">
            <el-option v-for="item in campusList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="add-select-item" label="所属院系">
          <el-select v-model="buildingForm.buildingId" @change="findName($event, 'universityName', 'teachDepartmentList')">
            <el-option v-for="item in teachDepartmentList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="add-select-item" label="是否有电梯">
          <el-select v-model="buildingForm.hasElevator">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="position" label="经纬度">
          <el-input v-model="longitude" :maxlength="40" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item class="position">
          <el-input v-model="latitude" :maxlength="40" placeholder="纬度"></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-input v-model="buildname" :maxlength="40" placeholder="请输入楼宇名称"></el-input> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savefn">保 存</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
  import util from '@/util'

  import { mapState } from 'vuex'
  import { encodeQueryParam } from '@/api/utils'
 import Department from '@/api/department'

  export default {
    data() {
      return {
        breadcrumb: [
          { label: "基础数据" },
          { label: "楼栋维护" },
        ],
        campusList: [],
        buildingList: [],
        teachDepartmentList: [],
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        formInline: {
          campusId: '',
          buildingId: '',
          hasElevator: '',
          departmentName:"",
        },
        buildingForm: {
          departmentName:"",//楼栋部门
          departmentId:'',
          code: '',
          name: '',
          // buildingId: '',
          campusId: '',
          hasElevator: '',
          // latitude: '',
          universityName: '', // 所属院系
          longLatItude: '',
          code: '',
          id: ''
        },
        // buildingId: '',
        longitude: '',
        latitude: '',
        rules: {
          code: [
            { required: true, message: '请输入楼栋代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入楼栋名称', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请输入部门名称', trigger: 'change' }
          ]
        },
        pagePort: {
          table: '_op:/building/list',
          build: '_op:/building',
          addBuild: '_op:/building/add'
        },
        tableData: [],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        param: {},

        dialog_build: false,
        dialog_title: '',
        departmentName:"",//楼栋 部门名称
        departmentId:"",//漏洞部门ID
        buildname: '',
        buildid: '',
        buildcode: '',
        btnPerObj: { //按钮权限
          add: false,
          edit: false,
          delete: false
        },
        allDepartments:[],
      }
    },
    created() {
      this.getCampusList();
      this.getTableData();
      this.getTeachDeepartmentList();
      this.getDepList();
    },
    mounted() {
      util.resize(this);
      window.onresize = () => {
        util.resize(this);
      };

      util.openBtnPermit(this.btnPerObj);
      //          this.getBtnPermit();
    },
    computed: {
      ...mapState(['btnPermitList']),
    },
    methods: {
          //获取 新增部门数据
            getDepList() {
              this.$http.get(`_op:/admin/department/byname`).then(resp => {
                this.allDepartments = [].concat(resp.data);
              }).catch(err => console.error(err));
            },

          // 部门
            querySearchAsync(queryString, cb) {
              if(queryString){
                cb(this.allDepartments.filter(item=>item.name.indexOf(queryString)!=-1));
              }else{
                cb(this.allDepartments);
              }
            },
           handleSelect(item) {
                // if(this.param.departmentName==''){
                //      this.param.departmentid = ''
                // }else{
                //     this.param.departmentid = item.id
                // }
                //  this.param.departmentid  = 'e8b76c10393d703fd375518d4baa51f6'
                this.param.departmentid = item.id

             
            },
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      //获取按钮权限
      getBtnPermit() {
        let self = this;
        let actionId = this.$route.query.actionId;
        this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
          data.data.map(item => {
            if (item.code == "add_louyuweihu") {
              self.btnPerObj.add = true;
            }
            if (item.code == "edit_louyuweihu") {
              self.btnPerObj.edit = true;
            }
            if (item.code == "del_louyuweihu") {
              self.btnPerObj.delete = true;
            }
          });
        }).catch(() => {})
      },
      addbuilding() {
        this.dialog_title = "新增楼栋"
        this.dialog_build = true;
      },
      findName(val, prop, arr) {
        for (var i = 0; i < this[arr].length; i++) {
          if (val == this[arr][i].id) {
            this.buildingForm[prop] = this[arr][i].name;
          }
        }
      },
      savefn() {
        // if(!this.buildname){
        //     this.$message.warning("请填写楼栋名称！");
        //     return ;
        // }
        let longLatArr = [];

        this.$refs['buildingForm'].validate((valid) => {
          if (valid) {
            longLatArr.push(this.longitude);
            longLatArr.push(this.latitude);
          

            this.buildingForm.longLatItude = longLatArr.join(',');
            this.buildingForm.departmentName = this.allDepartments.find(item=>item.id==this.buildingForm.departmentId).name;
            // {
            //         name:this.buildname,
            //         id:this.buildid,
            //         code:this.buildcode,
            //     }
            if (this.buildid && this.buildcode) {
              this.$http.put(this.pagePort.build, this.buildingForm).then(data => {
                   this.$message({
                    message: '修改楼栋成功',
                    type: 'success'
                  });
             
                this.getTableData();
                this.buildname = '';
                this.buildid = '';
                this.buildcode = '';
                this.dialog_build = false;
              }).catch(() => {

              })
            } else {
              delete this.buildingForm.id;
              this.$http.post(this.pagePort.addBuild, this.buildingForm).then(data => {
                  this.$message({
                    message: '新增楼栋成功',
                    type: 'success'
                  });
                this.getTableData();
                this.buildname = '';
                this.buildid = '';
                this.buildcode = '';
                this.dialog_build = false;
              }).catch(() => {

              })
            }
          }
        })
      },
      deletebuilding(item) {
        this.$confirm(`此操作将永久删除“${item.name}”所维护的信息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.pagePort.build + '/' + item.id).then(data => {
            let type = "success";
            let message = "删除成功！";
            if (data.code == 0) {
              this.getTableData();
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
      updatebuilding(row) {
        ('返回值+++++++', row)
        this.buildname = row.name;
        this.buildingForm.name = row.name;
        this.buildingForm.departmentId=+row.departmentId||'';

        this.buildid = row.id;
        this.buildcode = row.code;
        // this.
        this.dialog_title = "修改楼栋";
        this.dialog_build = true;
        this.buildingForm.id = row.id;
        this.buildingForm.code = row.code;
        this.buildingForm.campusId = row.campusId || '';
        if (row.hasElevator == 't') {
          this.buildingForm.hasElevator = true;
        } else if (row.hasElevator == 'f') {
          this.buildingForm.hasElevator = false;
        }
        if (row.longLatItude) {
          this.longitude = row.longLatItude.split(',')[0];
          this.latitude = row.longLatItude.split(',')[1];
        }
      },
      getTableData() {
        this.tableLoading = true;
        this.$http.post(this.pagePort.table, {
          // param:this.param
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            buildName: this.formInline.buildingId,
            hasElevator: this.formInline.hasElevator,
            universityId: this.formInline.campusId,
            departmentName:this.formInline.departmentName,
          }
        }).then(data => {
          this.tableData = data.result;
          this.totalCount = data.totalCount;
          this.tableLoading = false;
        }).catch(() => {
          this.tableData = [];
          this.tableLoading = false;
        })
      },
      sizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getTableData();
      },
      currentChange(val) {
        this.pageNo = val;
        this.getTableData();
      },
      handleCampusSelect(val) {
        this.getBilidingListByArea(val);

      },
      dialogClose() {
        this.dialog_build = false;
        for (let key in this.buildingForm) {
          this.buildingForm[key] = '';
        }
      },
      // 根据学校id查校区
      getCampusList() {
        let universityId = 20;
        // this.$http.get(`/autoapi/operation/data/admin/campus/${universityId}`).then(res => {
        this.$http.get(`_op:/campus/${universityId}`).then(res => {
          this.campusList = res.data;
        })
      },
       // 部门
      getCampusList() {
        let universityId = 20;
        this.$http.get(`_op:/campus/${universityId}`).then(res => {
          this.campusList = res.data;
        })
      },

      // 根据校区ID获取楼栋列表
      getBilidingListByArea(campusId, type) {
        this.$http.get(`_op:/building/getByCampusId/${campusId}`).then(res => {
          this.buildingList = res.data || [];
          if (this.buildingList.length < 1) {
            this.buildingForm.buildingId = '';
          }
        })
      },
      // 获取院系下拉列表
      getTeachDeepartmentList() {
        this.$http.post(`_op:/teachDepartment/getTeachDepartmentList`, { status: 1 }).then(res => {
          this.teachDepartmentList = res.data;
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .topbar {
    background-color: #E5E6E8;
    line-height: 40px;
    padding: 0 20px;
  }

  .stationtable {
    width: 50%;
    text-align: center;
    margin-left: 10px;
  }

  .stationtable th {
    background-color: #eef1f6;
    line-height: 40px;
    height: 40px;
    border: 1px solid #dfe6ec;
  }

  .stationtable td {
    border: 1px solid #dfe6ec;
    line-height: 40px;
    height: 40px;
    vertical-align: middle;
  }

  .stationtable .el-input {
    width: 90%;
    margin: auto;
    display: block;
  }

  .stationtable .hovertr:hover {
    background-color: #EFF2F7;
  }

  .building-manage-dialog {
    .add-input-item {
      /deep/ .el-form-item__content {
        width: 217px;
      }
    }

    .add-select-item {
      /deep/ .el-select {
        width: 217px;
      }
    }

    .position {
      /deep/ .el-form-item__content {
        width: 104px;
      }
    }
  }
</style>