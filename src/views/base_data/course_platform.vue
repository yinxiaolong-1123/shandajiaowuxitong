<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="param" label-width="68px">
        <div class="fold">
          <div ref="formDetail" class="detail">
            <el-form-item label="专业名称">
              <el-select v-model="param.majorId" clearable filterable>
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in majorList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-select v-model="param.courseId" clearable filterable>
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in courseList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="param.status" style="width:100px">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in statusList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="btnPerObj.query">
              <el-button type="primary" size="mini" @click="search">查询</el-button>
            </el-form-item>
            <!-- <el-form-item v-if="btnPerObj.add">
              <el-button size="mini" type="primary" @click="addItem"  v-if="hasPermission('MAJOR_COURSE_MANAGE', 'add')">新增</el-button>
            </el-form-item>
            <el-form-item v-if="btnPerObj.delBatch">
              <el-button size="mini" @click="deleteAllItem">批量删除</el-button>
            </el-form-item> -->
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        size="mini"
        height="600"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @selection-change="handleSelect"
      >
        <el-table-column type="selection" width="38"></el-table-column>
        <el-table-column type="index" label="序号" fixed></el-table-column>

        <el-table-column
          v-for="(item,index) in tableList"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <template v-if="item.prop==='status'">{{Number(scope.row.status)===1?'启用':'禁用'}}</template>
            <template
              v-else-if="item.prop==='theoryHour'"
            >{{scope.row.theoryHour+'/'+scope.row.practiceHour}}</template>
            <template v-else-if="item.prop==='scoreMethod'">{{ scope.row.scoreMethod==100?'百分制':''}}</template>
            <template v-else>{{scope.row[item.prop]}}</template>
          </template>
        </el-table-column>

        <el-table-column
          v-if="btnPerObj.edit||btnPerObj.configuration||btnPerObj.delete"
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              size="small"
              @click="editItem(scope.row)"
              v-if="hasPermission('MAJOR_COURSE_MANAGE', 'update')"
            >编辑</el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              @click="deleteItem(scope.row)"
              style="color: red;"
              v-if="hasPermission('MAJOR_COURSE_MANAGE', 'delete')"
            >删除</el-button> -->
            <el-button
              type="text"
              size="small"
              @click="showCourse(scope.row)"
            >配置简介</el-button>
            <el-button
              type="text"
              size="small"
              @click="linkCourseContent(scope.row)"
              v-if="hasPermission('MAJOR_COURSE_MANAGE', 'get')"
            >课程内容</el-button>
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
      :title="(dialog.status==='add'?'新增':'编辑')+type"
      :visible.sync="dialog.visible"
      width="440px"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogClose"
      custom-class="cm-dialog-pad"
    >

    <!-- 分界线 -->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                  <el-form :model="formDialog" ref="formDialog" label-width="111px" class="addinfo">
                      <el-form-item
                        v-for="(item,index) in editFormDetail"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop"
                        :rules="item.rule?commonRules(item.label,formDialog[item.prop],formDialog,item.prop):[]"
                      >
                        <el-select
                          v-if="item.type==='select'"
                          v-model="formDialog[item.prop]"
                          :filterable="item.filterable"
                          :multiple="item.multiple"
                          :placeholder="'请选择'+item.label"
                          style="width:100%;"
                        >
                          <!-- <el-option v-if="item.prop!=='courseId' &&  item.prop!=='scoreMethod'" label="全部" :value="0"></el-option> -->
                          <el-option
                            v-for="item2 in getArrList(item.list)"
                            :key="item2.id"
                            :label="item2.name"
                            :value="item2.id"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-else
                          v-model="formDialog[item.prop]"
                          :placeholder="'请输入'+(item.placeholder || item.label)"
                          :disabled="item.editDisabled && dialog.status!=='add'"
                        ></el-input>
                      </el-form-item>

                      <el-form-item v-if="dialog.status!=='add'" label="状态" prop="status" >
                        <el-radio-group v-model="formDialog.status">
                          <el-radio :label="1">启用</el-radio>
                          <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
              </el-tab-pane>
               <el-tab-pane label="年级学时及学分" name="second">
                 <table :model="newdata" ref="newdata"  class="tableBox">
                      <tr>
                        <th>年级</th>
                        <th>学时</th>
                        <th>学分</th>
                    </tr>
                    <tr v-for="(item, index) in  newdata" :key="index" >
                      <td>{{item.year}}</td>
                      <td>{{item.theoryHour}}/{{item.practiceHour}}</td>
                      <td>{{item.credit}}</td>
                    </tr>
               </table>

                
                
              </el-tab-pane>
        </el-tabs>
    </template>
      <span  v-if="clickActiveName=='first'"   slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">关 闭</el-button>
        <el-button
          type="primary"
          @click="commonValidate('formDialog',newdata,dialog.status==='add'?'post':'put')"
        >保 存</el-button>
      </span>
        <span  v-else   slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="配置课程说明"
      :visible.sync="editCourse.visible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @closed="dialogClose('courseDialog')"
      custom-class="cm-dialog-pad"
    >
      <el-form :model="courseDialog" ref="courseDialog" label-width="100px">
        <el-form-item
          v-for="(item,index) in editCourseDialog"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :rules="commonRulesed(item.label,courseDialog[item.prop],courseDialog,item.prop)"
        >
          <el-input
            type="textarea"
            @input="changeInput(item.label,courseDialog[item.prop])"
            :rows="item.row"
            :placeholder="'请输入'+item.label.substr(0,item.label.length-1)"
            v-model="courseDialog[item.prop]"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCourse.visible=false">取 消</el-button>
        <el-button type="primary" @click="extendItem(courseDialog)">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/util";

import { mapState } from "vuex";

const TYPE = "course-platform";
const REMARK = "专业课程库";

export default {
  name: TYPE,
  data() {
    return {
      gradeHour:{
        grade:"",
        classHour:"",


      },
      getDataPrams:"",
      newdata:[
        {
          year:2019,
          practiceHour:26/20,
          credit:89
       },
        {
          year:2018,
          practiceHour:26/20,
          credit:0
       },
        {
          year:2017,
          practiceHour:26/20,
          credit:89
       },
       
      ],
      newdata:[],
      activeName: 'first',
      type: REMARK,
      breadcrumb: [
        {
          label: "教务管理"
        },
        {
          label: REMARK
        }
      ],
      clickActiveName:"first",//选中名字
      tableList: [
        {
          label: "课程代码",
          prop: "courseCode"
        },
        {
          label: "课程名称",
          prop: "courseName",
          width:250
        },
        // {
        //   label: "平台学时(理论/实践)",
        //   prop: "theoryHour"
        // },
        // {
        //   label: "总学时",
        //   prop: "totalClassHour"
        // },
        // {
        //   label: "课程学分",
        //   prop: "credit"
        // },
        {
          label: "课程性质",
          prop: "courseNatureName"
        },
        {
          label: "成绩计分方式",
          prop: "scoreMethod"
        },
        {
          label: "专业",
          prop: "majorName",
           width:250
        },
        {
          label: "状态",
          prop: "status",
          width:100
        },
        {
          label: "创建人",
          prop: "createUserStr"
        },
        {
          label: "创建日期",
          prop: "createTime",
          width: 100
        }
        // {label:'排课形式', prop:'schoolingYear'},
      ],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      param: {
        majorId: "",
        courseId: "",
        status: ""
      },
      pagePort: {
        table: "_op:coursePlatform/list",
        change: "_op:coursePlatform",
        majorList: "_op:major/combox",
        courseList: "_op:course/combox",
        optionItem: "_op:dicts/getDictsList",
        deleteAll: "_op:coursePlatform/batchDelete",
        setCourse: "_op:coursePlatform/setCourse"
      },
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      formDialog: {
        courseId: "", //课程
        classHour: "",
        theoryHour: 0, //理论
        practiceHour: 0, //实践
        credit: "",
        courseNatureId: "",
        majorIds: [],
        scoreMethod: "",
        status: 1 //1-启用，0-禁用
      },
      dialog: {
        status: "add",
        visible: false
      },
      tableLoading: false,
      editFormDetail: [
        {
          label: "课程名称",
          prop: "courseId",
          editDisabled: true,
          filterable: true,
          rule: util.commonRules("课程代码", "blur,change"),
          type: "select",
          list: "courseList"
        },
        // {
        //   label: "理论/实践学时",
        //   prop: "classHour",
        //   rule: util.commonRules("课程代码", "blur,change")
        // },
        // {
        //   label: "课程学分",
        //   prop: "credit",
        //   rule: util.commonRules("课程代码", "blur,change")
        // },
        {
          label: "课程性质",
          prop: "courseNatureId",
          type: "select",
          list: "natureList",
          rule: util.commonRules("课程代码", "blur,change")
        },
        {
          label: "成绩计分方式",
          prop: "scoreMethod",
          type: "select",
          list: "scoreList",
          rule: util.commonRules("课程代码", "blur,change")
        },
        {
          label: "适用专业",
          prop: "majorIds",
          type: "select",
          list: "majorList",
          multiple: false,
          rule: util.commonRules("课程代码", "blur,change")
        }
      ],
      statusList: [], //状态
      courseList: [], //课程名称
      natureList: [], //课程性质
      majorList: [], //专业
      scoreList: [
        // {name:'全部',id:''},
        {
          name: "百分制",
          id: "100"
        }
      ], //计分方式
      checkedList: [],
      editCourse: {
        visible: false,
        id: ""
      },
      courseDialog: {
        summary: "", //简介
        target: "", //目标
        participant: "" //参与者
      },
      editCourseDialog: [
        {
          label: "课程简介：",
          prop: "summary",
          row: 4,
          rule: false
        },
        {
          label: "课程目标：",
          prop: "target",
          row: 4,
          rule: false
        },
        {
          label: "参与部门：",
          prop: "participant",
          row: 2,
          rule: false
        }
      ],
      btnPerObj: {
        //按钮权限
        add: false,
        query: false,
        edit: false,
        delete: false,
        delBatch: false,
        configuration: false
      }
    };
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };

    util.openBtnPermit(this.btnPerObj);
  },
  created() {
    this.$authorize.me();
    this.getTableData();
    this.getOptionItem("majorList");
    this.getOptionItem("optionItem", "natureList", "course-nature");
    this.getOptionItem("courseList");
    this.statusList = util.status();
    // this.getTableList(544);//请求年级列表
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    }
  },
  computed: {
    ...mapState(["btnPermitList", "me"])
  },
  methods: {  



    //  标签页
    handleClick(tab, event) {
      
        this.clickActiveName=tab.name;
              
                if(tab.name=='first'){
                    
                }
                if(tab.name=='second'){
                 
                }
                // this.newtype=this.form.type
    },
    getTableList(data){
      this.$http.get("_op:/coursePlatformYear/getByCoursePlatformIdMajor"+"/"+data.data).then(data =>{
      this.newdata=data.data;//列表数据
      })
      // this.$http.get("_op:/coursePlatformYear/getByCoursePlatformIdMajor"+"/"+544).then(data =>{
      //    this.newdata=data.data;//列表数据
      // })

    },


    
    hasPermission(key, val) {
      return this.$authorize.hasPermission(key,val);
    },
    //chan
    changeInput(name, value) {
      if (name == "课程简介" && value.length > 100) {
        this.editCourseDialog[0].rule = true;
      } else {
        this.editCourseDialog[0].rule = false;
      }
      if (name == "课程目标" && value.length > 100) {
        this.editCourseDialog[1].rule = true;
      } else {
        this.editCourseDialog[1].rule = false;
      }
      if (name == "参与部门" && value.length > 40) {
        this.editCourseDialog[2].rule = true;
      } else {
        this.editCourseDialog[2].rule = false;
      }
    },
    //表单验证
    commonRulesed(msg, val, courseDialog, item) {
      let text_number = (rule, value, callback) => {
        if (msg.indexOf("课程简介") != -1 && value.length > 100) {
          return callback(new Error("课程简介不能超过100个字"));
        } else if (msg.indexOf("课程目标") != -1 && value.length > 100) {
          return callback(new Error("课程目标不能超过100个字"));
        } else if (msg.indexOf("参与部门") != -1 && value.length > 40) {
          return callback(new Error("参与部门不能超过40个字"));
        } else {
          return callback();
        }
      };
      return [
        {
          required: true,
          message: "请输入" + msg,
          trigger: "blur"
        },
        {
          validator: text_number,
          trigger: "change"
        }
      ];
    },
    //新增课程平台库
    commonRules(msg, val, courseDialog, item) {
      let text_number = (rule, value, callback) => {
        var regEn = /^[0-9]*$/;
        let test1 = /[`~!@#$%^&*()_+<>?:"{}.;[]]/gi;
        let test2 = /[·！#￥（——）：；“”‘、|《。》？、【】[]]/gi;
        let reg = /^[\d\/]+$/; //匹配数字跟斜杠
        if (
          (msg.indexOf("理论/实践学时") != -1 && test1.test(value)) ||
          test2.test(value)
        ) {
          callback(new Error("不能包含特殊字符"));
        }
        // else if(msg.indexOf("理论/实践学时")!= -1 && value.length>4){
        //     return callback(new Error("理论/实践学时不能超过4个数"));
        // }
        else if (
          msg.indexOf("理论/实践学时") != -1 &&
          reg.test(value) &&
          value.length > 9
        ) {
          callback(new Error("请输入0000/0000格式学时的9位数字"));
        }
        //      let reg = /^[\d\/]+$/;//匹配数字跟斜杠
        // if (value.length>9){
        //     callback(new Error("学时输入不能超过9位数字"));
        // }else if(!reg.test(value)){
        //     callback(new Error("请输入9位以内整数"));
        // }else {
        //     callback();
        // }
        // else if(msg.indexOf("理论/实践学时")!= -1 &&!regEn.test(value)){
        //          callback(new Error("请输入4位以内纯数字"));
        // }
        else if (
          (msg.indexOf("课程学分") != -1 && test1.test(value)) ||
          test2.test(value)
        ) {
          callback(new Error("不能包含特殊字符"));
        } else if (msg.indexOf("课程学分") != -1 && value.length > 3) {
          return callback(new Error("课程学分不能超过3位数字"));
        } else if (msg.indexOf("课程学分") != -1 && !regEn.test(value))
          callback(new Error("请输入3位以内纯数字"));
        else {
          return callback();
        }
      };
      return [
        {
          required: true,
          message: "请输入" + msg,
          trigger: "blur"
        },
        {
          validator: text_number,
          trigger: "change"
        }
      ];
    },
    addItem() {
      this.dialog.status = "add";
      this.dialog.visible = true;
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    commonValidate(ref,gradeDada,type) {
    
      this.$refs[ref].validate(bool => {
        if (bool) {
          this.commonRequire(type);
        }
      });
    },
    commonRequire(method) {
     
      
      this.formDialog.majorIds=[this.formDialog.majorIds];
       let option = util.cloneObj(this.formDialog);
      if (method === "post") {
        option.id && delete option.id;
        delete option.status;
      }
     
      option.extend && delete option.extend;
      this.$http({
        method: method,
        url: this.pagePort.change,
        data: {
          ...option
        }
      }).then(data => {
        let message = (method === "post" ? "新增" : "编辑") + "成功！";
        let type = "success";
        if (Number(data.code) === 0) {
     
          this.getTableList(data)
     
          
        //  this.clickActiveName="second"
          // this.
        } else {
          // this.clickActiveName="second"
    
          message = data.msg;
          type = "warning";
        }
        this.$message({
          type,
          message,
          showClose: true
        });
        //更新数据列表
        this.getTableData();
      });
    },
    currentChange(current) {
      this.pageNo = current;
      this.getTableData();
    },
    deleteItem(row) {
      this.$confirm(
        `此操作将永久删除 "${row.courseName}" 的数据, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.delete(this.pagePort.change + "/" + row.id).then(data => {
            let message = "删除成功!";
            let type = "success";
            if (Number(data.code) === 0) {
              this.getTableData();
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
    dialogClose(str = "formDialog") {
      //关闭弹窗时重置数据
      this.$refs[str].resetFields();
    },
    editItem({ id }) {
     
      this.$http.get(this.pagePort.change + "/" + id).then(data => {
            data.data.classHour =  data.data.theoryHour+'/'+data.data.practiceHour
            if (data.data.majorIds.length > 0) {
              data.data.majorIds = data.data.majorIds[0]; // 凑合着用吧
            }
            this.formDialog = data.data;
            this.getEditTable(id)
            
      });
      this.dialog.status = "edit";
      this.dialog.visible = true;
    },
    getEditTable(param){
      this.$http.get("_op:/coursePlatformYear/getByCoursePlatformIdMajor"+"/"+param).then(data => {
     
        this.newdata=data.data;//列表数据
      })
    },
    getTableData() {
      this.tableLoading = true;
      let option = util.cloneObj(this.param);
      for (let key of Object.keys(option)) {
        option[key] === "" && delete option[key];
      }
      let vuex = JSON.parse(localStorage.getItem('vuex'));
      option.roles = vuex.me.roles.map(item=>item.id);
      this.$http
        .post(this.pagePort.table, {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: option
        })
        .then(data => {
          this.tableData = data.result;
          // this.pageNo=data.pageNo;
          this.pageSize=data.pageSize;
          this.totalCount = data.totalCount;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableData = [];
          this.tableLoading = false;
        });
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
    getOptionItem(str, list, type) {
      let data = {};
      let url = this.pagePort[str];
      if (type && list) {
        data.type = type;
      } else {
        list = str;
      }

      if (
        url.indexOf("course/combox") > -1 ||
        url.indexOf("major/combox") > -1
      ) {
        this.$http.get(url, data).then(data => {
          this[list] = data.data;
        });
      } else {
        this.$http.post(url, data).then(data => {
          this[list] = data.data;
        });
      }
    },
    getArrList(str) {
      return this[str];
    },
    handleSelect(selection) {
      this.checkedList = [...selection].map(val => val.id);
    },
    deleteAllItem() {
      if (this.checkedList.length === 0) {
        return this.$message({
          type: "warning",
          message: "尚未选中任何数据",
          showClose: true
        });
      }
      this.$confirm(`此操作将永久删除已选中的数据,是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            method: "post",
            url: this.pagePort.deleteAll,
            data: {
              ids: [...this.checkedList]
            }
          }).then(data => {
            let message = "删除成功!";
            let type = "success";
            if (Number(data.code) === 0) {
              this.getTableData();
            } else {
              type = "error";
              // message=data.msg;
              message = "包含被教学计划使用的课程，不能删除";
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
    showCourse({ id }) {
      this.editCourse.visible = true;
      this.editCourse.id = id;
      this.$http.get(this.pagePort.change + "/" + id).then(data => {
        if (data.data && data.data.extend) {
          this.courseDialog = {
            ...util.getExtend(data.data.extend)
          };
        }
      });
    },
    linkCourseContent(row) {
    
      this.$router.push({
        path: "/educational_admin/course_content",
        query: {
          courseId: row.courseId,
          courseName: row.courseName,
          platformId: row.id,
          majorName: row.majorName,
          majorIds:row.majorIds,
          actionId: 89 // ?
        }
      });
    },
    extendItem(courseDialog) {
      this.$refs.courseDialog.validate(valid => {
        if (valid) {
          this.$http
            .post(this.pagePort.setCourse, {
              id: this.editCourse.id,
              extend: {
                ...this.courseDialog
              }
            })
            .then(data => {
              let type = "success",
                message = "配置成功";
              if (data.code == 0) {
                this.editCourse.visible = false;
              } else {
                type = "error";
                message = data.msg;
              }
              this.$message({
                type,
                message,
                showClose: true
              });
            });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.addinfo {
  /deep/.el-form-item__label {
    padding: 0 10px 0 0;
  }
}
.tableBox{
  border: solid 1px  #dcdfe6;
  width: 100%;
}
.tableBox td{
   border:solid 1px  #dcdfe6;
   width:30%;
   height: 30px;
   text-align: center;
  
}
.tableBox th{
    border: solid 1px  #dcdfe6;
   width:30%;
   height:30px;
   color:gray;

}
.tableBox td{
   border: solid 1px  #dcdfe6;
    color:gray;
  
}
</style>