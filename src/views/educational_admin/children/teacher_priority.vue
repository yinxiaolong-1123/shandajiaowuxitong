<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="item.router"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-btn-con cm-fold">
      <el-form :inline="true" size="mini" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item v-for="(list,index) in formList" :key="index" :label="list.label">
              <el-input v-model="formDetail[list.model]" :disabled="list.disabled"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-btn-con">
      <el-button size="medium" type="primary" @click="addTask">新增</el-button>
      <el-button size="medium" @click="onClose">关 闭</el-button>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        size="mini"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <template
              v-if="item.prop == 'teachingType'"
            >{{scope.row[item.prop] == 0 ? '主授课老师' : '辅授课老师'}}</template>
            <template v-else>{{scope.row[item.prop]}}</template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="planAdjustment(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              @click="deleteTeacher(scope.row)"
              type="text"
              size="small"
              style="color:red;"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cm-pagination">
      <el-pagination
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <!-- 新增或编辑对话框 -->
    <el-dialog
      :title="dialog.status==='add'?'新增':'编辑'"
      :visible.sync="dialog.visible"
      :modal-append-to-body="false"
      width="760px"
      custom-class="teacher-priority-dialog"
    >
      <el-form
        class="teacher-priority-form"
        :inline="true"
        :rules="rules"
        ref="teacherForm"
        :model="teacherForm"
        :label-width="labelWidth"
      >
        <!-- class="flex-form" -->

        <!-- <el-form-item label="姓名">
					<el-input v-model="teacherForm.teacherName" :disabled="true" placeholder="请输入姓名"></el-input>
        </el-form-item>-->
        <el-form-item label="姓名" prop="teacherName">
          <el-autocomplete
            ref="teacherInput"
            v-model="teacherForm.teacherName"
            :fetch-suggestions="querySearchAsync2"
            placeholder="请输入姓名"
            @select="handleSelect"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="工号" prop="teacherNo">
          <el-input
            v-model.trim="teacherForm.teacherNo"
            :disabled="true"
            @keyup.native="queryTeacherNo"
            placeholder="请输入工号"
          >
            <i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="职称">
          <el-input v-model="teacherForm.title" :disabled="true" placeholder="请输入职称"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="teacherForm.departmentName" :disabled="true" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="授课老师类型" prop="teachingType">
          <el-select v-model="teacherForm.teachingType" placeholder="授课老师类型" style="width: 100%;">
            <el-option label="主授课老师" :value="0"></el-option>
            <el-option label="辅授课老师" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="teacherForm.priority" placeholder="请输入优先级"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button
          type="primary"
          @click="courseClose('teacherForm',dialog.status==='add'?'post':'put')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/util";
const TYPE = "teacher-priority";
const REMARK = "设置教师优先级";
export default {
  name: TYPE,
  data() {
    return {
      breadcrumb: [
        {
          label: "教学管理"
        },
        {
          label: "课程平台库",
          router: {
            path: "/base_data/course_platform"
          }
        },
        {
          label: `${this.$route.query.courseName}-课程内容库`,
          router: {
            path: "/educational_admin/course_content",
            query: this.$route.query
          }
        },
        {
          label: REMARK
        }
      ],
      dialog: {
        status: "add",
        remark: false,
        visible: false
      },
      formDetail: {
        courseName: "",
        content: "",
        teachingFormName: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      teacherForm: {
        courseContentId: "", // 课程内容库id
        teacherNo: "",
        teacherName: "",
        title: "",
        departmentName: "",
        teachingType: "",
        teacherId: "",
        priority: "",
        courseContentId: "" // 课程内容库id
      },
      rules: {
        teacherNo: [
          {
            required: true,
            message: "请输入工号",
            trigger: "blur"
          }
        ],
        teachingType: [
          {
            required: true,
            message: "请选择授课老师类型",
            trigger: "blue"
          }
        ],
        priority: [
          {
            required: true,
            message: "请输入优先级",
            trigger: "blur"
          }
        ]
      },
      labelWidth: "106px",
      formList: [
        // {label:'课程',model:'courseName',disabled:true},
        {
          label: "课程内容",
          model: "content",
          disabled: true
        },
        {
          label: "授课形式",
          model: "teachingFormName",
          disabled: true
        }
      ],
      tableList: [
        {
          label: "工号",
          prop: "teacherNo"
        },
        {
          label: "姓名",
          prop: "teacherName"
        },
        {
          label: "职称",
          prop: "title"
        },
        {
          label: "部门",
          prop: "departmentName"
        },
        {
          label: "授课老师类型",
          prop: "teachingType"
        },
        {
          label: "优先级",
          prop: "priority"
        }
      ],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      queryLoading: false,
      queryTeacherNo: () => {},
      editId: ""
    };
  },
  created() {
    this.getTableList();
    this.queryTeacherNo = this.fnThrottle(this.querySearchAsync, 500);
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
    this.formDetail = this.$route.query;
    this.teacherForm.courseContentId = this.formDetail.courseContentId;
  },
  methods: {
    querySearchAsync2(queryString, cb) {
      //模糊远程搜索姓名与工号带出信息
      if (queryString) {
        let params = {
          pageNo: 1,
          pageSize: 20,
          param: {
            name: queryString
          }
        };
        this.$http
          .post(`_op:teachers/list`, params)
          .then(res => {
            var result = [];
            if (Array.isArray(res.data.result) && res.data.result.length > 0) {
              res.data.result.forEach(r => {
                var obj = {};
                obj.value = `${r.name}(${r.teacherNo})`;
                obj.item = r;
                result.push(obj);
              });
            }
            cb(result);
          })
          .catch(err => {
            console.info(err);
            cb([]);
          });
      }
    },

    handleSelect(val) {
      console.info(val);
      this.teacherForm.teacherId = val.item.id;
      this.teacherForm.teacherNo = val.item.teacherNo;
      if (val.item.departments.length > 0) {
		  this.teacherForm.departmentName = val.item.departments.map(d => d.name).join(",")
      }
      this.teacherForm.title = val.item.positionName;
      this.teacherForm.teachingType = val.item.teachingType;
      this.teacherForm.priority = val.item.priority;
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    onClose() {
      var param = this.$route.query;
      delete param.courseContentId;
      this.$router.push({
        path: "/educational_admin/course_content",
        query: param
      });
    },
    addTask() {
      this.dialog.status = "add";
      this.dialog.visible = true;
    },
    // 根据工号带出（查询）老师信息
    querySearchAsync() {
      // var restaurants = this.restaurants;
      // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      if (this.teacherForm.teacherNo == "") {
        this.queryLoading = false;
        this.teacherForm.teacherNo = "";
        this.teacherForm.teacherName = "";
        this.teacherForm.title = "";
        this.teacherForm.departmentName = "";
        this.teacherForm.departments = [];
        return;
      }
      this.queryLoading = true;
      let params = {
        pageNo: 1,
        pageSize: 1,
        param: {
          teacherNo: this.teacherForm.teacherNo // 315
        }
      };
      // {
      //     headers:{
      //         Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJtc3dlYi1qd3QiLCJpYXQiOjE1NDYwNjM4NzAsInN1YiI6IntcIm1heEluYWN0aXZlSW50ZXJ2YWxcIjotMSxcInRva2VuXCI6XCIzM2FkOGQwMDc1MDA1NTI5ZDc4NWJjNmU4NTIyOWRkMVwiLFwidHlwZVwiOlwiand0XCIsXCJ1c2VySWRcIjpcIjQyOTFkN2RhOTAwNTM3N2VjOWFlYzRhNzFlYTgzN2ZcIn0iLCJleHAiOjE1NDYwNjc0NzB9.um7ygrhV3Gu0k3H7GTxl4KUKp4pNntZCpciEbqIyqy4'
      //     }
      // }
      // this.$http.post('http://192.168.0.101:8080/operation/data/admin/teachers/list', params, {
      this.$http
        .post("_op:teachers/list", params)
        .then(res => {
          let result = res.data.result;
          this.queryLoading = false;

          if (result.length == 0) {
            this.teacherForm.teacherName = "";
            this.teacherForm.title = "";
            this.teacherForm.departmentName = "";
            this.teacherForm.departments = [];
            this.teacherForm.teacherNo = "";
            this.$message.info("找不到该工号信息记录");
          } else {
            this.teacherForm.departments = [];
            this.teacherForm.teacherId = result[0].id;
            this.teacherForm.teacherName = result[0].name;
            this.teacherForm.title = result[0].positionName;
            this.teacherForm.departmentName = result[0].departments;
            for (var i = 0; i < result[0].departmentIds.length; i++) {
              let obj = {};
              obj.id = result[0].departmentIds[i];
              obj.name = result[0].departments.split(",")[i];
              this.teacherForm.departments.push(obj);
            }
          }
        })
        .catch(err => {
          this.$message.error("网络错误或超时");
          this.queryLoading = false;
        });
    },
    planAdjustment(row) {
      for (let key in this.teacherForm) {
        this.teacherForm[key] = row[key];
      }
      this.teacherForm.courseContentId = this.formDetail.courseContentId;
      this.dialog.status = "edit";
      this.editId = row.id;
      this.dialog.visible = true;
    },
    // 弹窗确定按钮
    courseClose(teacherForm, method) {
      this.$refs[teacherForm].validate(valid => {
        if (valid) {
          if (method === "post") {
            this.addTeacherInfo();
          } else if (method === "put") {
            this.submitTeacherInfo();
          }
        }
      });
    },
    /**
     * [getTableList 获取老师列表]
     * @return {[type]} [description]
     */
    getTableList() {
      // this.$http.post('http://192.168.5.175:8080/operation/data/admin/teachersCourseContentRel/list',{
      this.$http
        .post("_op:/teachersCourseContentRel/list", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            courseContent: "", //this.$route.query.content, // 课程内容
            courseContentId: this.$route.query.courseContentId, //课程内容id
            teachingFormContent: "" //this.$route.query.teachingFormName //授课形式内容
          }
        })
        .then(data => {
          this.tableData = data.result;
          this.totalCount = data.totalCount;
        });
    },
    sizeChange(val) {
      this.pageNo = 1;
      this.pageSize = val;
      this.getTableList();
    },
    currentChange(val) {
      this.pageNo = val;
      this.getTableList();
    },
    // 新增
    addTeacherInfo() {
      this.$http
        .post("_op:/teachersCourseContentRel", this.teacherForm)
        .then(res => {
          this.$message.success("编辑成功");
          this.dialogClose();
          this.getTableList();
        });
    },
    // 编辑课程关联老师
    submitTeacherInfo() {
      let params = {};

      params = this.teacherForm;
      params.id = this.editId;

      this.$http
        .put("_op:/teachersCourseContentRel/update", params)
        .then(res => {
          this.$message.success("编辑成功");
          this.dialogClose();
          this.getTableList();
        });
    },
    deleteTeacher(row) {
      this.$confirm(`确定删除当前关联老师信息吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`_op:/teachersCourseContentRel/${row.id}`)
            .then(data => {
              this.$message({
                type: "success",
                message: "已删除"
              });
              this.getTableList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dialogClose() {
      for (let key in this.teacherForm) {
        this.teacherForm[key] = "";
      }
      this.teacherForm.courseContentId = this.formDetail.courseContentId;
      this.dialog.visible = false;
    },
    fnThrottle(fn, delay, atleast) {
      let timer = null;
      let previous = null;
      return function() {
        let now = +new Date();
        if (!previous) previous = now;
        if (atleast && now - previous > atleast) {
          fn();
          previous = now;
          clearTimeout(timer);
        } else {
          clearTimeout(timer);
          timer = setTimeout(function() {
            fn();
            previous = null;
          }, delay);
        }
      };
    }
  }
};
</script>
<style lang="less">
.teacher-priority-dialog {
  /deep/ .el-form-item__content {
    .el-input {
      .el-input__inner {
        width: 217px;
      }
    }
  }

  /deep/ .el-form-item {
    .el-input.is-disabled .el-input__inner {
      color: #666;
    }
  }

  // .el-input{
  // 	.el-input__inner{
  // 		width: 217px;
  // 	}
  // }
}
</style>