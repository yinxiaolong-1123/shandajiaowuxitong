<template>
  <div class="tab-content">
    <div class="tab-flex" style="margin-bottom:15px;justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 20px;" type="text" size="small" placeholder="请输入姓名搜索人员（回车搜索）"
          class="cm-search normal" v-model="searchText" @keyup.enter.native="getDepartmentUserWithoutRole(searchText)"
          clearable @clear="searchUser">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="getDepartmentUserWithoutRole(searchText)"></i>
        </el-input>

        <!-- <span style="width: 300px;margin-right: 20px;"></span> -->
        <label>当前部门：{{currentDepartmentName}}</label>
      </div>
      <el-badge :value="selectedUsers.length" class="item" style="margin-right: 20px;">
        <el-button size="small" type="primary" @click="touchUsers(selectedUsers)">批量添加人员</el-button>
      </el-badge>
    </div>

    <div class="tab-flex">
      <div class="tree-box">
        <!-- <el-input type="text" size="small" placeholder="筛选部门" class="cm-search normal" style="margin-bottom:15px;" v-model="departmentSearchText" @keyup.enter.native="searchUser" clearable @clear="searchUser">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchUser"></i>
        </el-input> -->
        <el-autocomplete class="inline-input cm-search normal" style="width: 100%;margin-bottom:8px;" value-key='name'
          v-model="departmentSearchText" clearable :fetch-suggestions="querySearchAsync" placeholder="请筛选部门">
        </el-autocomplete>
        <el-tree style="height: 465px;overflow: auto;" :data="departments" :props="deparmentDefaultProps"
          :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="handleDepartmentClick"
          highlight-current ref="tree" node-key="id">
        </el-tree>
      </div>
      <div class="table-box">
        <el-table ref="staffList" :data="departmentUsers" @selection-change="handleUserSelectionChange" border
          header-row-class-name="cm-dark" element-loading-text="加载中……"
          element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-table-column type="selection" fixed></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="工号" prop="teacherNo"></el-table-column>
          <el-table-column label="职位" prop="positionName"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="touchUsers([scope.row])">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="cm-pagination">
          <el-pagination background :current-page="currentPageIndex" :page-sizes="[5]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" @size-change="handlePageSizeChange"
            @current-change="handlePageIndexChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '@/util'
  import {
    mapState,
    mapActions
  } from 'vuex' //1
  import Department from '@/api/department';

  export default {
    name: 'ungranted_role_table',
    data() {
      return {
        currentPageIndex: 1,
        pageSize: 5,
        param: { //列表参数
          name: '',
          departmentid: '',
          teacherNo: '',
          departmentName: '',
          status: '',
          positionId: ''
        },
        totalRecords: 0,
        mycourseId: '',
        mymanagerType: '',
        departmentList: [], // 部门列表（数组结构，方便自动筛选)
        departments: [], // 部门列表(树结构)
        currentDepartmentName: '', // 当前部门名称
        currentDepartmentId: '', // 当前部门id

        selectedUsers: [], // 已经选择的用户
        departmentUsers: [], // 部门用户

        searchText: '',
        departmentSearchText: '',

        deparmentDefaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },

    props: {
      classId: '',
      teacherType: '',
      dialogSelected: ''
    },

    computed: {
      ...mapState(['loginInfo', 'refresh']),

    },
    watch: {
      dialogSelected: function () {
        if (this.dialogSelected) {
          this.currentDepartmentId = ''
          this.currentDepartmentName = ''
          this.getDepartments();
          this.getDepartmentUserWithoutRole()
        }
      },

      departmentSearchText(val) {
        this.$refs.tree.filter(val);
      }
      // teacherType:function(){
      //    this.getDepartments();
      // },
      // classId:function(){
      //    this.getDepartments();
      // }
    },
    created() {
      // let token  = localStorage.getItem('token')
      //       this.$api.useToken(token);

      this.getDepartments();

    },

    methods: {
      ...mapActions(['listRefresh']),
      querySearchAsync(queryString, cb) {
        var depts = this.departmentList;
        var result = queryString ? depts.filter(d => d.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0) :
          depts;
        cb(result);
      },
      createFilter(queryString) {
        return (restaurants) => {
          return (restaurants.name.indexOf(queryString) === 0);
        };
      },

      handleSelect(item) {
        this.$refs.tree.filter(item);
        // if (item == undefined || item == '' || item == null) {
        //   this.getDepartments();
        // } else {
        //   this.departments = []
        //   this.departments.push(item)
        // }
      },
      getDepartments() { //
        // /      this.$http.get("_auths:/department/tree").then(resp=>{
        //  this.$api.departmentTree.createQuery().noPaging().fire().then(resp => {
        this.$http.get("_auths:/department/tree").then(resp => {
          this.departments = resp.result;
          this.departmentList = util.tree2Array(util.clone(this.departments), 'children');
          // this.currentDepartmentName = this.departments[0].name;
          // this.currentDepartmentId = this.departments[0].id;
          this.getDepartmentUserWithoutRole();
        }).catch(resp => {
        
          throw resp;
        });
      },
      getDepartmentUserWithoutRole(val) { //通过部门ID获取部门人员
        let self = this
        let id = this.currentDepartmentId
        let currentPageIndex = this.currentPageIndex;
        let pageSize = this.pageSize;
        this.param.departmentid = id
        this.param.name = val
        let query = {
          pageNo: this.currentPageIndex,
          pageSize: this.pageSize,
          param: { //列表参数
            name: val,
            departmentid: this.currentDepartmentId,
            teacherNo: '',
            departmentName: '',
            status: 1,
            positionId: ''
          },
        }

        // this.$api.teachetdes.fire({}, {pageNo:currentPageIndex, pageSize: pageSize,param:this.param}).then(resp => {
        this.$http.post("_op:/teachers/list", query).then(resp => {
          if (resp.data == null) {
            self.departmentUsers = []
            self.totalRecords = 0

          } else {
            self.departmentUsers = [];
            self.departmentUsers = resp.data.result
            self.totalRecords = resp.data.totalCount
          }

        }).catch(err => {

        })

      },


      searchUser() {

      },

      touchUsers(users) { //添加教职工
        let classId = this.classId

        let teacherIds = []
        let type = this.teacherType
        users.forEach(item => {
          teacherIds.push(item.id);
        });
        let query = {
          classId: classId,
          teacherList: teacherIds,
          type: type
        }
        // this.$api.unadministrative.fire({},{classId:classId,teacherList:teacherIds,type:type}).then(resp=>{
        this.$http.post("_op:/teacher/administrative/class", query).then(resp => {
          if (resp.code == '0') {
            this.$message({
              message: '添加成功!',
              type: 'success'
            });
            this.listRefresh(true)
          }
        }).catch(err => {

        })
      },

      handlePageSizeChange(size) {
        this.currentPageIndex = 1;
        this.pageSize = size;
     
        this.getDepartmentUserWithoutRole();
      },

      handlePageIndexChange(current) {
        this.currentPageIndex = current;
    
        this.getDepartmentUserWithoutRole();
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

      handleDepartmentClick(data) {
        this.currentDepartmentName = data.name;
        this.currentDepartmentId = data.id;
        this.getDepartmentUserWithoutRole();
      },

      handleUserSelectionChange(data) {
        this.selectedUsers = data;
      }
    },
  }
</script>

<style scoped lang="less">
  .tab-content {
    // height: 600px;
  }

  .tab-flex {
    display: flex;
    justify-content: space-around;

    .tree-box {
      width: 25%;
      background-color: #f0f0f0;
      padding: 20px 10px;
      margin-right: 20px;
    }

    .table-box {
      // display: flex;
      // flex-direction: column;
      width: 72%;
    }

    .el-table {
      // width: 97%;
    }

    .cm-pagination {
      padding: 20 20px;
      text-align: right;
    }
  }
</style>