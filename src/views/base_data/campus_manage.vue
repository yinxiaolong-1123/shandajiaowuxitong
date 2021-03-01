<template>
  <div class="campus">
    <section class="cm-container">
      <div class="cm-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- <div class="cm-fold" v-if="btnPerObj.add"> -->
      <el-button type="primary" size="mini" @click="addCampus" style="margin: 10px;">新增校区</el-button>
      <!-- </div> -->

      <div class="cm-table">
        <el-table ref="multipleTable" :data="tableData" border style="width: 50%" size="mini" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="校区名称" prop="name"></el-table-column>
          <!-- v-if="btnPerObj.edit||btnPerObj.del" -->
          <!-- v-if="btnPerObj.edit" -->
          <!-- v-if="btnPerObj.delete" -->
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="editOpen(scope.row)"> 编辑</el-button>
              <el-button size="small" type="text" @click="deletebuilding(scope.row)" style="color: red;"> 删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </section>

    <el-dialog title="新增" :visible.sync="dialogVisiable" width="400px" append-to-body :close-on-click-modal="false" custom-class="cm-dialog-small" autofocus=true>
      <el-input v-model="campusName" :maxlength="40" placeholder="请输入校区名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave(dialog.status === 'add'? 'post': 'put')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {

    name: 'campus_manage',

    data() {
      return {
        breadcrumb: [
          { label: "基础数据" },
          { label: "校区维护" },
        ],
        dialog: {
          status: 'add',
        },
        dialogVisiable: false,
        campusName: '',
        tableLoading: false,
        tableData: [],
        universityId: 20, // 暂时固定
        campusId: 0,
        campusName: '',
      };
    },
    created() {
      this.getCampusList();
    },
    methods: {
      addCampus() {
        this.dialog.status = 'add';
        this.dialogVisiable = true;
      },
      editOpen(row) {
        this.dialog.status = 'edit';
        this.dialogVisiable = true;
        this.campusName = row.name;
        this.campusId = row.id;
      },
      handleSave(method) {
        let data = {};
        // let method;
        if (this.campusName == '') {
          this.$message.warning('校区不能为空');
          return;
        } else {
          if (this.dialog.status === 'add') {
            data = { name: this.campusName, code: 'xq', status: 1, universityId: this.universityId };
            // method = 'post';
          } else if (this.dialog.status === 'edit') {
            data = { campusId: this.campusId, campusName: this.campusName, code: 'xq', status: 1, universityId: this.universityId };
            // method = 'put';
          }

          this.$http({
            // url:`http://192.168.5.175:8080/operation/data/admin/campus`, //`_op:/campus`,
            url: `_op:/campus`,
            method: method,
            data: data
          }).then(res => {
            this.$message.success('添加成功');
            this.dialogVisiable = false;
            this.getCampusList();
          })
        }
      },
      // handleSave (method, row){
      // 	this.dialogVisiable = true;
      // 	if (this.campusName == '') {
      // 		this.$message.warning('校区不能为空');
      // 	} else {
      // 		this.$http({
      // 			// url:`http://192.168.5.175:8080/operation/data/admin/campus`, //`_op:/campus`,
      // 			url: `_op:/campus`,
      // 			method: method,
      // 			data: row
      // 		}).then(res => {
      // 			this.$message.success('添加成功');
      // 			this.dialogVisiable = false;
      // 			this.getCampusList();
      // 		})
      // 	}
      // },
      deletebuilding(row) {
        this.$confirm(`确定删除该校区吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`_op:/campus/${row.id}`).then(res => {
            this.getCampusList();
          })
        })
      },
      getCampusList() {
        let universityId = 20;
        this.$http.get(`_op:/campus/${this.universityId}`).then(res => {
      
          this.tableData = res.data;
        })
      }
    }
  };
</script>
<style lang="css" scoped>
</style>