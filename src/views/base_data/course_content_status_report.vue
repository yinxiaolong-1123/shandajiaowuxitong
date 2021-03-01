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
          <div ref="formDetail" class="detail select-con">
              <el-form-item label="所在级">
                <intelligent-year-picker
                    v-model="param.grade"
                    type="year"
                      clearable
                    value-format="yyyy" 
                    placeholder="选择年级"> 
                </intelligent-year-picker>
              </el-form-item>
     
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
            <el-form-item v-if="btnPerObj.query">
              <el-button type="primary" size="mini" @click="search"  :disabled="!param.grade&&!param.majorId&&!param.courseId">查询</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @selection-change="handleSelect"
      >
        <el-table-column type="index" label="序号" ></el-table-column>

        <el-table-column
          v-for="(item,index) in tableList"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
        >
        
        </el-table-column>

        <el-table-column
          v-if="btnPerObj.edit||btnPerObj.configuration||btnPerObj.delete"
         
          label="操作"
          
        >
          <template slot-scope="scope">
          
              <el-button
              type="text"
              size="small"
              @click="linkCourseContent(scope.row)"
            >详情</el-button>
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
  </section>
</template>

<script>
import util from "@/util";

import { mapState } from "vuex";

const TYPE = "course-platform";
const REMARK = "课程内容状态报告";

export default {
  name: TYPE,
  data() {
    return {
      searchList:true,
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
          label: "课程管理"
        },
        {
          label: REMARK
        }
      ],
      clickActiveName:"first",//选中名字
       tableList: [
        {
          label: "课程名称",
          prop: "courseName",
        
        },
       {
          label: "适用专业",
          prop: "majorName",
         
        },
       {
          label: "年级",
          prop: "grade",
         
        },
        {
          label: "学期",
          prop: "termName",
          
        },
        {
          label: "计划学时",
          prop: "planTeachingHours",
          
        },
        {
          label: "已填报内容学时",
          prop: "contentTeachingHours",
         
        },
        {
          label: "已填报老师的总学时",
          prop: "teacherTeachingHours",
     
        },
        {
          label: "已填报场地的总学时",
          prop: "areaTeachingHours",

        },
        {
          label: "状态",
          prop: "status",
          
        },
      ],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      param: {
        majorId: "",
        courseId: "",
        grade: ""
      },
      pagePort: {
        table: "_ed:/trainplan/course/prepare/stat/search",
        change: "_op:coursePlatform",
        majorList: "_op:major/combox",
        courseList: "_op:course/combox",//请求专业
        // optionItem: "_op:dicts/getDictsList",
        // deleteAll: "_op:coursePlatform/batchDelete",
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
      // editFormDetail: [
      //   {
      //     label: "课程名称",
      //     prop: "courseId",
      //     editDisabled: true,
      //     filterable: true,
      //     rule: util.commonRules("课程代码", "blur,change"),
      //     type: "select",
      //     list: "courseList"
      //   },
      
      //   {
      //     label: "课程性质",
      //     prop: "courseNatureId",
      //     type: "select",
      //     list: "natureList",
      //     rule: util.commonRules("课程代码", "blur,change")
      //   },
      //   {
      //     label: "成绩计分方式",
      //     prop: "scoreMethod",
      //     type: "select",
      //     list: "scoreList",
      //     rule: util.commonRules("课程代码", "blur,change")
      //   },
      //   {
      //     label: "适用专业",
      //     prop: "majorIds",
      //     type: "select",
      //     list: "majorList",
      //     multiple: true,
      //     rule: util.commonRules("课程代码", "blur,change")
      //   }
      // ],
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
    // this.getTableData();  //更改不自动刷新列表
    this.getOptionItem("majorList");
    // this.getOptionItem("optionItem", "course-nature");
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
          // 改变所在级请求课程
            // changeGrage(){
            //     this.getCourseList(this.searchForm.grade,this.searchForm.major)
            // },

    //  标签页
    handleClick(tab, event) {
       
        this.clickActiveName=tab.name;
            
    },
    getTableList(data){
      this.$http.get("_op:/coursePlatformYear/getByCoursePlatformIdMajor"+"/"+data.data).then(data =>{
      this.newdata=data.data;//列表数据
      })
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
          // this.dialog.visible = false;
      
          this.getTableList(data)
       
          
          
        //  this.clickActiveName="second"
          // this.
        } else {
      
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
    getTableData() {
      this.tableLoading = true;
      let option = util.cloneObj(this.param);
      // for (let key of Object.keys(option)) {
      //   option[key] === "" && delete option[key];
      // }
    
      // if(option.majorId==""||option.majorId==""){
      //   this.$message({
      //     message: '请输入年级或专业进行搜索',
      //     type: 'warning'
      //   });

      // }else{
           this.$http
        .post(this.pagePort.table, {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: option
        })
        .then(data => {
          this.tableData = data.data.result;
      
          // this.pageNo=data.pageNo;
          // this.pageSize=data.pageSize;
          this.totalCount = data.data.totalCount;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableData = [];
          this.tableLoading = false;
        });

      // }
     
   
    },
    search() {
      // this.pageNo = 1;
     
      this.pageNo = 1;
      this.getTableData();
      // if (this.param.majorId==""&&this.param.grade==''){
      //    this.$message({
      //     message: '请输入年级或专业进行搜索',
      //     type: 'warning'
      //   });
      // }else{
      //  this.getTableData();
      // }
      
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
    linkCourseContent(row) {
   
      // debugger
      this.$router.push({
        path: "/educational_admin/course_content",
        query: {
          courseId: row.courseId,
          courseName: row.courseName,
          platformId: row.coursePlatformId,
          majorName: row.majorName,
          majorIds:[row.majorId],
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
<style>
  .select-con .el-date-editor.el-input{
    width: 150px;
  }
</style>
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