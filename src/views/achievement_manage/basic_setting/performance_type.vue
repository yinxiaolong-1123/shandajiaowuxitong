<template>
  <section class="cm-container">
    <!-- 成绩类型 -->
    <div class="cm-breadcrumb cm-bt-1px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold pd-6">
      <el-form :inline="true" size="mini" :model="param">
        <div class="fold fold-lt">
          <div ref="formDetail" class="detail">
            <!-- <el-form-item label="代码">
                            <el-input v-model="param.code" placeholder="请输入代码" onkeyup="this.value=this.value.trim();" clearable></el-input>
            </el-form-item>-->
            <el-form-item label="名称">
              <el-input
                v-model="param.cnName"
                placeholder="请输入中文名称"
                onkeyup="this.value=this.value.trim();"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="适用课程">
              <el-select clearable filterable v-model="param.courseId">
                <el-option v-for="(item,index) in courseList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()" v-if="btnPerObj.query">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                @click="addAchievementType"
                v-if="btnPerObj.add"
              >新增</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table
        size="mini"
        ref="multipleTable"
        :data="tableData"
        border
        v-loading="tableLoading"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
        <!-- <el-table-column prop="code" label="代码" width="200"></el-table-column> -->
        <el-table-column prop="cnName" label="名称" width="200"></el-table-column>
        <el-table-column prop="enName" label="英文名称" width="200"></el-table-column>
        <el-table-column prop="courseNames" label="适用课程"></el-table-column>
        <el-table-column prop="remark" label="描述"></el-table-column>
        <el-table-column label="状态" width="55">
          >
          <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column
          v-if="btnPerObj.edit||btnPerObj.delete"
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <!-- 只要不是阶段成绩或者课程成绩就显示按钮 -->
            <el-button
              type="text"
              size="small"
              @click="editDetailData(scope.row)"
              v-if="scope.row.cnName!='课程成绩'&&scope.row.cnName!='阶段成绩'&&btnPerObj.edit"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteDetailData(scope.row)"
              style="color: red;"
              v-if="scope.row.cnName!='课程成绩'&&scope.row.cnName!='阶段成绩'&&btnPerObj.delete"
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
    <el-dialog
      :title="(dialog.status==='add'?'新增':'编辑') + remark"
      :visible.sync="dialog.visible"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
      custom-class="cm-dialog-small"
      @close="resetForm"
    >
      <el-form :model="formDialog" ref="formDialog" class="boxStyle" :rules="rules">
         <!-- <el-form-item label="代码"  prop="code" :label-width="formLabelWidth">
                     <el-input v-model="formDialog.code"  ></el-input>
                </el-form-item> -->
        <!-- <el-form-item label="代码" prop="code" :label-width="formLabelWidth">
          <el-input v-model="formDialog.code"></el-input>
        </el-form-item> -->
        <el-form-item label="名称" prop="cnName" :label-width="formLabelWidth">
          <el-input v-model="formDialog.cnName"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enName" :label-width="formLabelWidth">
          <el-input v-model="formDialog.enName" maxlength="40"></el-input>
        </el-form-item>
        <!-- <el-form-item label="考试性质" :label-width="formLabelWidth">
          <el-select v-model="formDialog.examType" placeholder="请选择考试性质">
            <el-option label="非正式考试" value="0"></el-option>
            <el-option label="正式考试" value="1"></el-option>
          </el-select>
        </el-form-item> -->
         <el-form-item label="考试性质" :label-width="formLabelWidth">
                            <el-select v-model="formDialog.examType"  clearable placeholder="全部">
                                <el-option v-for="list in statusOption" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item>
        	<!-- statusOption: [//装填
				{ label: "已保存", value: 0 },
				{ label: "已提交", value: 1 },
				{ label: "已撤回", value: 2 },
                { label: "处理成功", value: 3 },
                { label: "处理失败", value: 4 },
         	 ], -->
        <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="formDialog.remark" type="textarea" rows="4" cols="50" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item class="lh" :label-width="formLabelWidth">
            <label slot="label">适用课程<br/>不选则通用</label>
            <el-select v-model="formDialog.courseIds" multiple filterable  clearable placeholder="全部">
                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态" v-if="this.dialog.status!=='add'" :label-width="formLabelWidth">
          <el-radio-group v-model="formDialog.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="commonValidate('formDialog')">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
//接口未调用
import util from "@/util";
import { mapState } from "vuex"; //1
//每个模块的type 和remark是固定不允许改变的
const TYPE = "degree-category";
const REMARK = "成绩类型";
export default {
  name: TYPE,
  data() {
    // 自定义验证代码
    var codeRules = (rule, value, callback) => {
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else if (value.length > 20) {
        callback(new Error("代码长度不能超过20位"));
      } else {
        callback();
      }
    };
    // 自定义验证  名称
    var cnNameRules = (rule, value, callback) => {
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error("不能包含特殊字符"));
      } else if (value.length > 20) {
        callback(new Error("名称长度不能超过20位"));
        // }else if (!value.endsWith("成绩")){
        //     callback(new Error("输入格式为xx成绩"));
      } else {
        callback();
      }
    };

    return {
      // <el-option label="非正式考试" value="0"></el-option>
      //       <el-option label="正式考试" value="1"></el-option>
       statusOption: [//装填
				{ label: "非正式考试", value: 0 },
				{ label: "正式考试", value: 1 },
			
         	 ], 
      form:{
        region:"",
      },
     
      Jurisdiction: false, //根据状态不能编辑
      btnPerObj: {
        //按钮权限
        add: false,
        setting: false,
        classStu: false,
        edit: false,
        del: false
      },
      remark: REMARK,
      breadcrumb: [{ label: "成绩管理" }, { label: "成绩类型" }],
      formLabelWidth: "100px",
      rules: {
        code: [
          { required: true, message: "请输入代码", trigger: ["change"] },
          { validator: codeRules, trigger: ["change"] }
        ],
        cnName: [
          { required: true, message: "请输入名称", trigger: "change" },
          { validator: cnNameRules, trigger: [, "change"] }
        ]
      },
      tableData: [],
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      //查询数据定义
      param: {
        cnName: "",
        code: "",
        courseId: ""
      },
      courseList: [],
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      formDialog: {
        code: "",
        cnName: "",
        enName: "",
        examType:"",
        status: 1,
        remark: "",
        courseIds: []
      },
      dialog: {
        status: "add",
        visible: false
      },
      btnPerObj: {
        //按钮权限
        add: false,
        delete: false,
        edit: false,
        query: false
      }
    };
  },
  mounted() {
    util.openBtnPermit(this.btnPerObj);
    //          this.getBtnPermit();
  },
  created() {
    this.getCourseList()
    this.getSwitchSetList() //获取数据列表
  },
  computed: {
    // ...mapState(['btnPermitList']),
  },
  methods: {
    resetForm() {
      this.formDialog = {
        code: "",
        cnName: "",
        enName: "",
        examType:"",
        status: 1,
        remark: "",
        courseIds: []
      }
    },
    getCourseList() {
      this.$http.get('_op:/courseMajorRel/combox')
        .then(data => {
          if (data.code == 0) {
            let temp = data.data
            this.courseList = temp.filter( item => {
              if(item == null) {
                return false
              }else{
                return true
              }
            })

          } else {
            this.$message.error(data.msg);
          }
        })
    },
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "add_chengjileixing") {
              self.btnPerObj.add = true;
            }
            if (item.code == "delete_chengjileixing") {
              self.btnPerObj.delete = true;
            }
            if (item.code == "edit_chengjileixing") {
              self.btnPerObj.edit = true;
            }
            if (item.code == "query_chengjileixing") {
              self.btnPerObj.query = true;
            }
          });
        })
        .catch(() => {});
    },
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "add_chengjileixing") {
              self.btnPerObj.add = true;
            }
            if (item.code == "edit_chengjileixing") {
              self.btnPerObj.edit = true;
            }
            if (item.code == "delete_chengjileixing") {
              self.btnPerObj.delete = true;
            }
            if (item.code == "query_chengjileixing") {
              self.btnPerObj.query = true;
            }
          });
        })
        .catch(() => {});
    },

    //成绩类型开关   获取列表
    getSwitchSetList() {
      this.tableLoading = true;
      this.$http
        .post("_sc:/scoreSetting/list", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            type: "SCORE_TYPE",
            code: this.param.code,
            cnName: this.param.cnName,
            courseId: this.param.courseId
          }
        })
        .then(data => {
          this.tableLoading = false;
          this.tableData = data.data.result;
          this.totalCount = data.data.totalCount;
        })
        .catch(() => {
          this.tableLoading = true;
        });
    },
    // 新增成绩类型
    addAchievementType() {
      this.dialog.status = "add";
      this.dialog.visible = true;
      this.formDialog.code = '';
      // this.formDialog.code = util.uuid();
      this.formDialog.cnName = "";
      this.formDialog.enName = "";
      this.formDialog.status = "1";
      this.formDialog.remark = "";
    },
    // 新增验证
    commonValidate(formDialog) {
      this.$refs.formDialog.validate(valid => {
        if (valid) {
          this.commonRequire();
        } else {
          return false;
        }
      });
    },
    // 新增提交
    commonRequire() {
      let that = this;
      let url = "_sc:/scoreSetting";
      if (this.dialog.status == "add") {
        this.formDialog.type = "SCORE_TYPE";
        this.formDialog.code = util.uuid();
      }
      this.$http({
        method: this.dialog.status == "add" ? "post" : "put",
        url: url,
        data: this.formDialog
      }).then(data => {
        let type = "success";
        let message = `${this.dialog.status == "add" ? "新增" : "编辑"}成功！`;
        if (data.code == 0) {
          this.getSwitchSetList();
          this.dialog.visible = false;
        } else {
          type = "error";
          message = data.msg;
        }
        this.$message({
          type: type,
          message: message
        });
      });
    },

    // 查询
    search() {
      this.pageNo = 1;
      this.getSwitchSetList();
    },
    // 编辑
    editDetailData(row) {
      // todu  需要后端加接口来判断
      if (row.status == 1) {
        this.Jurisdiction = true;
      } else {
        this.Jurisdiction = false;
      }
      this.formDialog.code = row.code;
      this.formDialog.cnName = row.cnName;
      this.formDialog.enName = row.enName;
      this.formDialog.status = row.status;
      this.formDialog.remark = row.remark;
      this.formDialog.courseIds = row.courseIds;
      this.formDialog.examType = row.examType;
      this.formDialog.type = row.type;
      this.formDialog.id = row.id;
      this.dialog.status = "edit";
      this.dialog.visible = true;
    },
    // 删除
    deleteDetailData(row) {
      this.$confirm(
        `此操作将永久删除 "${row.cnName}" 的数据, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete("_sc:/scoreSetting" + "/" + row.id).then(data => {
            let message = "删除成功!";
            let type = "success";
            if (Number(data.code) === 0) {
              this.getSwitchSetList();
            } else {
              type = "error";
              message = data.msg;
            }
            this.$message({
              type,
              message
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示条数
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getSwitchSetList(); //获取数据列表
    },
    currentChange(current) {
      this.pageNo = current;
      this.getSwitchSetList(); //获取数据列表
    }
  },
};
</script>

<style scoped lang="less">
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.boxStyle {
  padding-right: 10px;
}
.lh /deep/ .el-form-item__label{
  line-height: 20px!important;
}
</style>