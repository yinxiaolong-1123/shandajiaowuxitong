<template>
  <div>
    <!-- <el-input type="text" size="small" placeholder="请输入姓名搜索已授权人员（回车搜索）" class="cm-search normal" style="margin-bottom:15px; width: 300px;" v-model="searchText" @keyup.enter.native="searchUser" clearable @clear="searchUser">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="searchUser"></i>
    </el-input> -->
    <el-table :data="tableData" border height="550px" style="width: 100%" header-row-class-name="cm-dark" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="工号" prop="teacherNo"></el-table-column>
      <el-table-column label="职务" prop="teacherNo"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteUser(scope.row)">删除人员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="cm-pagination">
      <el-pagination background :current-page="currentPageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" @size-change="handlePageSizeChange" @current-change="handlePageIndexChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'granted_role_table',
    data() {
      return {
        currentPageIndex: 1,
        pageSize: 10,
        totalRecords: 0,
        tableData: [],
        isAuth: 1,
        departmentId: '',
        searchText: '', //搜索关键字
      }
    },

    props: {
      courseId: '',
      managerType: '',
      fierder: ''
    },

    computed: {
      ...mapState(['loginInfo', "refresh"])
    },

    watch: {
      refresh() {
        this.getUsersWithGrantedRole(this.courseId, this.managerType)
      },

      courseId: {
        immediate: true,
        handler: function () {
          this.getUsersWithGrantedRole(this.courseId, this.managerType)
        }
      },

      managerType: {
        immediate: true,
        handler: function() {
          this.getUsersWithGrantedRole(this.courseId, this.managerType)
        }
      }
      //  fierder:function(){
      //   if(this.fierder){
      //      this.getUsersWithGrantedRole(this.courseId,this.managerType)
      //   }
      // },

    },
    mounted() {
    
    },
    created() {
      let token = localStorage.getItem('token')
      // this.$api.useToken(token);
      this.getUsersWithGrantedRole(this.courseId, this.managerType)

    },

    methods: {
      ...mapActions(['listRefresh']),
      getUsersWithGrantedRole(courseId, managerType) { //默认加载列表

        this.$http.post("_op:/course/manager/list", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            courseId: courseId,
            isAuth: this.isAuth,
            managerType: managerType,
            name: this.searchText,
            departmentId: this.departmentId
          }
        }).then(data => {

          this.tableData = data.result;
          this.totalRecords = data.totalCount;
          if (this.isAuth == 1) {
            this.isAuthNum = data.totalCount;
          }
          this.listRefresh(false)
        }).catch(() => {})
      },

      searchUser() {

      },

      deleteUser(user) {
        let courseId = this.courseId
        let option = 0
        let teacherIds = []
        let type = this.managerType

        teacherIds.push(user.id);
        let query = {
          courseId: courseId,
          option: option,
          teacherIds: teacherIds,
          type: type
        }
        this.$http.put("_op:/course/manager", query).then(resp => {
          // this.$api.addteachers.fire({},{courseId:courseId,option:option,teacherIds:teacherIds,type:type}).then(resp=>{
          if (resp.code == '0') {
            this.$message({
              message: '删除成功!',
              type: 'success'
            });
            this.$emit('getTableData')
          }
          this.getUsersWithGrantedRole(this.courseId, this.managerType)
        }).catch(err => {

        })
      },

      handlePageSizeChange(size) {
        this.pageSize = size;
        this.currentPageIndex = 1;
        this.getUsersWithGrantedRole();
      },

      handlePageIndexChange(current) {
        this.currentPageIndex = current;
        this.getUsersWithGrantedRole();
      }
    }
  }
</script>