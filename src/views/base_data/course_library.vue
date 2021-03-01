<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="param">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-if="btnPerObj.query">
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="课程代码">
              <el-input v-model="param.code" placeholder="请输入课程代码"></el-input>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-input v-model="param.name" placeholder="请输入课程名称"></el-input>
            </el-form-item>
            <el-form-item label="中文档案名">
              <el-input v-model="param.remark" placeholder="请输入课程中文档案名"></el-input>
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="param.categoryId" clearable filterable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in optionList.category" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程性质">
              <el-select v-model="param.natureId" clearable filterable>
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in optionList.nature" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="param.status">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in statusList" :key="item.name" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="老师">
              <el-select 
                v-model="param.teacherId" 
                placeholder="请选择" 
                clearable 
                filterable
                remote
                :remote-method="getTeacher">
                  <el-option label="全部" value=""></el-option>
                  <el-option 
                    v-for="(item,index) in teacherList" 
                    :key="item.id" 
                    :label="item.name" 
                    :value="item.id"> 
                  </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn" v-if="btnPerObj.add">
            <el-button size="mini" type="primary" @click="addItem">新增</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-table">
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" size="mini" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
        <!--<el-table-column type="selection"></el-table-column>-->
        <el-table-column type="index" label="序号"></el-table-column>

        <el-table-column v-for="(item,index) in tableList" :key='index' :width="item.width" :prop="item.prop" :label="item.label">
          <template slot-scope="scope">
            <template v-if="item.prop==='status'">
              {{Number(scope.row.status)===1?'启用':'禁用'}}
            </template>
            <template v-else-if="item.prop==='theoryHour'">
              {{scope.row.practiceHour+'/'+scope.row.theoryHour}}
            </template>
            <!--<template v-else-if="item.prop==='createTime'">-->
            <!--{{ scope.row.createTime | getTime}}-->
            <!--</template>-->
            <template v-else>
              {{scope.row[item.prop]}}
            </template>
          </template>
        </el-table-column>

        <el-table-column v-if="btnPerObj.edit||btnPerObj.settingManage||btnPerObj.settingSecretary||btnPerObj.delete" fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)" v-if="btnPerObj.edit">编辑</el-button>
            <el-button type="text" size="small" @click="setCharge(scope.row)" v-if="btnPerObj.settingManage">设置负责人</el-button>
            <el-button type="text" size="small" @click="setSecretary(scope.row)" v-if="btnPerObj.settingSecretary">设置秘书</el-button>
            <el-button type="text" size="small" @click="deleteItem(scope.row)" style="color: red;" v-if="btnPerObj.delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cm-pagination">
      <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </div>
    <el-dialog :title="(dialog.status==='add'?'新增':'编辑')+type" :visible.sync="dialog.visible" width="440px" append-to-body :close-on-click-modal="false" @closed="dialogClose" custom-class="cm-dialog-pad">
      <el-form :model="formDialog" ref="formDialog" label-width="120px">
        <el-form-item v-for="(item,index) in editFormDetail" :key="index" :label="item.label" :prop="item.prop" :rules="item.rule">
          <el-select v-if="item.type==='select'" v-model="formDialog[item.prop]" :placeholder="'请选'+item.label" style="width:100%;">
            <el-option v-for="item2 in getArrList(item.list,item.dataCome)" :key="item2.id" :label="item2.name" :value="item2.id"></el-option>
          </el-select>
          <el-input v-else v-model="formDialog[item.prop]" :maxlength="item.length" :placeholder="'请输入'+(item.placeholder || item.label)" :disabled="item.editDisabled && dialog.status!=='add'"></el-input>
        </el-form-item>
        <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status">
          <el-radio-group v-model="formDialog.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="commonValidate('formDialog',dialog.status==='add'?'post':'put')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="chargeTable.title" :visible.sync="fierder" width="89%" ref="detailDialog" data-options="onClose:function(){window.location.reload(true);}" append-to-body :close-on-click-modal="false" @close="reloadinfo" custom-class="cm-dialog-pad">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="已授权人员" name="first">
          <grantedRoleTable ref="grantedRoleTable" :managerType="managerType" :courseId="courseId" :fierder="fierder" @getTableData="getTableData"></grantedRoleTable>
        </el-tab-pane>
        <el-tab-pane label="新增授权" name="second">
          <ungrantedRoleTable ref="ungrantedRoleTable" :managerType="managerType" :courseId="courseId" :fierder="fierder" @getTableData="getTableData"></ungrantedRoleTable>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
  </section>
</template>

<script>
  import util from '@/util'
  import grantedRoleTable from '@/views/base_data/components/granted_role_table';
  import ungrantedRoleTable from '@/views/base_data/components/ungranted_role_table';
  import { mapState } from 'vuex'

  const TYPE = 'course-library';
  const REMARK = '课程';
  export default {
    name: TYPE,
    data() {
      return {
        type: REMARK,
        setForm: {
          desc: '',
          target: '',
          partment: ''
        },
        breadcrumb: [
          { label: "基础数据" },
          { label: "课程库" },
        ],
        roleId: '',
        roleName: '',
        tableList: [
          { label: '课程代码', prop: 'code', width: 70 },
          { label: '课程名称', prop: 'name' },
          { label: '中文档案名', prop: 'remark' },
          { label: '英文档案名', prop: 'enName' },
          { label: '旧课程码', prop: 'oldCode', width: 70 },
          { label: '课程类别', prop: 'courseCategory', width: 110 },
          { label: '性质', prop: 'courseNature', width: 60 },
          { label: '状态', prop: 'status', width: 60 }, //状态 0-正常 1-禁用
          // { label: '创建人', prop: 'createUser', width: 80 },
          { label: '课程负责人', prop: 'courseDirector' },
          { label: '教学秘书', prop: 'teachingSecretary' },
          // { label: '创建日期', prop: 'createTimeStr', width: 90 },
        ],
        tableData: [],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        param: {
          status: '',
          categoryId: '',
          code: '',
          name: '',
          natureId: '',
          remark: '',
          teacherId: ''
        },
        pagePort: {
          table: '_op:course/list',
          change: '_op:course',
          majorList: '_op:major/getMajorList',
          optionList: '_op:dicts/getDictsList'
        },
        fold: {
          state: true,
          text: '收起',
          showBtn: false,
        },
        formDialog: {
          code: '',
          name: '',
          remark: '',
          enName: '',
          oldCode: '',
          natureId: '',
          categoryId: '',
          status: 1, //1-启用，0-禁用
        },
        dialog: {
          status: 'add',
          visible: false,
          setVisible: false,
          // jurisdiction:false,
          setTitle: '负责人',
          loading: false,
        },
        tableLoading: false,
        editFormDetail: [
          { label: '课程代码', prop: 'code', length: 20,  rule: util.commonRules('课程代码', 'blur') },
          { label: '课程名称', prop: 'name', length: 40, rule: util.commonRules('课程名称', 'blur') },
          { label: '中文档案名', prop: 'remark', length: 100, },
          { label: '英文档案名', prop: 'enName', length: 40, },
          { label: '旧课代码', prop: 'oldCode', length: 20, },
          { label: '课程性质', prop: 'natureId', type: 'select', list: 'nature', dataCome: 'optionList', rule: util.commonRules('课程性质', 'blur') },
          { label: '课程类别', prop: 'categoryId', type: 'select', list: 'category', dataCome: 'optionList', rule: util.commonRules('课程类别', 'blur') },
        ],
        statusList: [],
        courseList: [],
        majorList: [],
        categoryList: [],
        natureList: [],
        teacherList: [],
        optionList: {
          category: [],
          nature: [],
        },
        activeName: 'first',
        chargeTable: {
          data: [],
          pageNo: 1,
          pageSize: 10,
          total: 0,
          title: '设置课程负责人'
        },
        secretaryTable: {

        },

        isAuth: 1, //0未授权，1授权人员，

        managerType: '', //0课程负责人，1课程秘书
        courseId: '', //课程ID
        fierder: false, //设置弹框的 同事传达给子组件

        managerName: '', //课程负责人名字搜索
        departmentId: '', //部门id
        isAuthNum: 0, //已授权人员
        departmentTree: [], //部门树
        defaultkeys: [], //默认展示二级
        departmentText: '', //部门名字
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        addnum: 0, //批量设置人数
        addList: [], //批量加入列表
        btnPerObj: { //按钮权限
          add: false,
          query: false,
          edit: false,
          delete: false,
          settingManage: false,
          settingSecretary: false
        }
      }
    },
    watch: {
      departmentText(val) {
        this.$refs.tree.filter(val);
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
    components: {
      grantedRoleTable,
      ungrantedRoleTable
    },

    created() {
      // this.setCharge();
      //  this.setSecretary();
      this.getTableData();
      //获取教师名单列表
      this.getTeacher('');
      this.getOptionItem('optionList', 'course-category', 'category');
      this.getOptionItem('optionList', 'course-nature', 'nature');

      this.statusList = util.status();
      // this.getDepartmentTree();
    },
    computed: {
      ...mapState(['btnPermitList']),
    },
    methods: {
      reloadinfo() {
        this.fierder = false
      },
      getTeacher(str){
        this.teacherList=[];
        return this.$http.post("_ed:/exchangecourse/query/teacher",{
          str:str
        }).then(data=>{
          if(data.code == 0){
            this.teacherList=data.data;
          }
        }).catch(()=>{
          
        })
      },
      //获取按钮权限
      getBtnPermit() {
        let self = this;
        let actionId = this.$route.query.actionId;
        this.$http.get('_auth:/privilege/getList/' + actionId + '/2').then(data => {
          data.data.map(item => {
            if (item.code == "query_kechengku") {
              self.btnPerObj.query = true;
            }
            if (item.code == "add_kechengku") {
              self.btnPerObj.add = true;
            }
            if (item.code == "edit_kechengku") {
              self.btnPerObj.edit = true;
            }
            if (item.code == "del_kechengku") {
              self.btnPerObj.delete = true;
            }
            if (item.code == "setting_manage_kechengku") {
              self.btnPerObj.settingManage = true;
            }
            if (item.code == "setting_secretary_kechengku") {
              self.btnPerObj.settingSecretary = true;
            }

          });
        }).catch(() => {})
      },
      addItem() {
        this.dialog.status = 'add';
        this.dialog.visible = true;
      },
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      commonValidate(ref, type) {
        this.$refs[ref].validate((bool) => {
          if (bool) {
       
            this.commonRequire(type)
          }
        })
      },
      commonRequire(method) {
        // let option = util.clone(this.formDialog);
        let option =this.formDialog
     
        if (method === 'post') {
          option.id && delete option.id;
          delete option.status;
        }
        this.$http(
        {
          method: method,
          url: this.pagePort.change,
          data: {
            ...option
          },
        }).then(data => {
          let message = (method === 'post' ? '新增' : '编辑') + '成功！';
          let type = 'success';
          if (Number(data.code) === 0) {
            this.dialog.visible = false;
          } else {
            message = data.msg;
            type = 'warning'
          }
          this.$message({
            type,
            message,
            showClose: true,
          });
          //更新数据列表
          this.getTableData();
        })
      },
      currentChange(current) {
        this.pageNo = current;
        this.getTableData();
      },
      deleteItem(row) {
        this.$confirm(`此操作将永久删除 "${row.name}" 的数据, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(this.pagePort.change + '/' + row.id)
            .then(data => {
              let message = '删除成功!';
              let type = 'success';
              if (Number(data.code) === 0) {
                this.getTableData();
              } else {
                type = 'error';
                message = data.msg;
              }
              this.$message({
                type,
                message,
              });
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      dialogClose() {
        //关闭弹窗时重置数据
        this.$refs.formDialog.resetFields();
      },
      editItem({ id }) {
        this.$http.get(this.pagePort.change + '/' + id).then(data => {
          data.data.categoryId = data.data.categoryId == 0 ? '' : data.data.categoryId;
          data.data.natureId = data.data.natureId == 0 ? '' : data.data.natureId;
          this.formDialog = data.data;
        });
        this.dialog.status = 'edit';
        this.dialog.visible = true;
      },
      getTableData() {
        this.tableLoading = true;
        let option = util.cloneObj(this.param);
        //过滤空值
        // for(let key of Object.keys(option)){
        //     option[key]==='' && delete option[key];
        // }

        this.$http.post(this.pagePort.table, {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: option
        }).then(data => {
          this.tableData = data.result;
          // this.pageNo=data.pageNo;
          // this.pageSize=data.pageSize;
          this.totalCount = data.totalCount;
           this.pageSize = data.pageSize;
          this.tableLoading = false;
        }).catch(() => {
          this.tableData = [];
          this.tableLoading = false;
        })
      },
      search() {
        this.pageNo = 1;
        this.getTableData();
      },
      sizeChange(size) {
        this.pageNo = 1;
        this.pageSize = size;
        this.getTableData();
      },
      getOptionItem(str, type, attr) {
        let data = {};
        let url = this.pagePort[str];
        if (type) {
          data.type = type;
        }
        this.$http.post(url, data).then(data => {
          if (type && attr) {
            this[str][attr] = data.data;
          } else {
            this[str] = data.data;
          }
        });

      },
      getArrList(str, come) {
        if (come) {
          return this[come][str];
        }
        return this[str];
      },
      setCharge(row) {
        this.roleId = row.code;
        this.roleId = row.name;
        this.chargeTable.title = "设置课程负责人"

        this.isAuth = 1; //已授权

        this.managerType = 0; //课程负责人
        this.getmanager();
        this.fierder = true;

        this.addnum = 0;
        this.courseId = row.id;
        this.managerType = 0



        // this.$refs.grantedRoleTable.getUsersWithGrantedRole(this.courseId,this.managerType);
        // this.$refs.ungrantedRoleTable.getDepartments(this.courseId,this.managerType);

        //  this.$refs.detailDialog.loadDialogData(this.Setprop.managerType);
      },
      setSecretary(row) {
        this.roleId = row.code;
        this.roleName = row.name;
        this.chargeTable.title = "设置课程秘书"

        this.isAuth = 1; //已授权

        this.managerType = 1; //课程负责人
        this.getmanager();
        this.fierder = true;
        this.addnum = 0;
        this.courseId = row.id;
        this.managerType = 1

        // this.$refs.grantedRoleTable.getUsersWithGrantedRole(this.courseId,this.managerType);
        // this.$refs.ungrantedRoleTable.getDepartments(this.courseId,this.managerType);




      },
      // loadDialogData(managerType){
      // this.Setprop.managerType = managerType
      // },
      handleTabClick(tab, event) {
        this.chargeTable.pageNo = 1;
        this.chargeTable.pageSize = 10;
        this.managerName = '';
        if (this.activeName == 0) {
          this.isAuth = 1; //已授权
          this.getmanager();
        } else {
          this.isAuth = 0; //未授权
          this.getmanager();
        }
      },

      getmanager() { //责任人列表
     
       
      },
     
    
      addManager() {
        this.setManager(this.addList, 1)
      },
      handleSelectionChange(val) {
        var self = this;
        self.addList = [];
        self.addnum = val ? val.length : 0;
        val.map(function (item) {
          self.addList.push(item.id)
        })
      },
    },
  }
</script>

<style scoped lang="less">
  .top-search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .el-input {
      width: 300px;
    }
  }

  .manager-box {
    display: flex;
    padding-bottom: 20px;

    .left-content {
      width: 35%;
      max-height: 700px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-right: 2%;
      overflow: auto;
    }

    .right-content {
      width: 100%;
    }

    .right-content-change {
      width: 65%;
    }

    .bottom-content {
      text-align: right;
      margin-top: 20px;
    }
  }
</style>