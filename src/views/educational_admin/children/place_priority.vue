<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.router">
          {{item.label}}
        </el-breadcrumb-item>
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
      <el-table ref="multipleTable" :data="tableData" border size="mini" style="width: 100%" header-row-class-name="cm-dark">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="planAdjustment(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteTeacher(scope.row)" type="text" size="small" style="color:red;">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cm-pagination">
      <el-pagination background :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </div>
    <!-- 新增或编辑对话框 -->
    <el-dialog :title="dialog.status==='add'?'新增':'编辑'" :visible.sync="dialog.visible" :modal-append-to-body="false" width="760px" custom-class="teacher-priority-dialog" @close="dialogClose">
      <el-form class="teacher-priority-form" :inline="true" :rules="rules" ref="placeForm" :model="placeForm" :label-width="labelWidth">
        <!-- class="flex-form" -->
        <el-form-item label="场地名称" prop="areaName">
          <!-- <el-select v-model="placeForm.areaId" filterable @change="findAreaName" placeholder="请选择场地名称">
				      <el-option v-for="(item, index) in areaList" :label="item.name" :value="item.id" :key="item.id"></el-option>
				    </el-select> -->
          <el-autocomplete v-model="placeForm.areaName" :fetch-suggestions="getAreaInfoList" placeholder="请输入场地名称" @select="handleSelect" :trigger-on-focus="false"></el-autocomplete>
        </el-form-item>
        <el-form-item label="场地类型" prop="areaType">
          <el-input v-model="placeForm.areaType" placeholder="场地类型" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="buildName">
          <el-input v-model="placeForm.buildName" placeholder="楼栋" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="校区" prop="campusName">
          <el-input v-model="placeForm.campusName" placeholder="请输入校区" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="placeForm.priority" placeholder="优先级"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="manager">
          <el-input v-model="placeForm.manager" placeholder="管理员" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="可同时容纳组数" prop="storeGroupNum">
          <el-input v-model="placeForm.storeGroupNum" placeholder="可同时容纳组数"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="courseClose('placeForm',dialog.status==='add'?'post':'put')">确 定
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import util from '@/util'
  const TYPE = 'place-priority';
  const REMARK = '设置场地优先级';
  export default {
    name: TYPE,
    data() {
      return {
        breadcrumb: [{
          label: '教学管理'
        },
        {
          label: '课程平台库',
          router: {
            path: '/base_data/course_platform'
          }
        },
        {
          label: `${this.$route.query.courseName}-课程内容库`,
          router: {
            path: '/educational_admin/course_content',
            query: this.$route.query
          }
        },
        {
          label: REMARK
        }, ],
        dialog: {
          status: 'add',
          remark: false,
          visible: false
        },
        areaList: [],
        formDetail: {
          course: '',
          content: '',
          teach: ''
        },
        formInline: {
          user: '',
          region: ''
        },
        placeForm: {
          courseContentId: '',
          areaId: '',
          areaName: '',
          areaType: '',
          buildName: '',
          campusName: '',
          priority: '',
          manager: '',
          storeGroupNum: ''
        },
        rules: {
          areaName: [{
            required: true,
            message: '场地名称不能为空',
            trigger: 'change'
          }],
          // areaType:[
          // 	{required: true, message: '场地类型不能为空', trigger: 'change'}
          // ],
          // buildName:[
          // 	{required: true, message: '楼栋不能为空', trigger: 'change'}
          // ],
          // campusName:[
          // 	{required: true, message: '校区不能为空', trigger: 'change'}
          // ],
          // priority:[
          // 	{required: true, message: '场地优先级不能为空', trigger: 'change'}
          // ],
          // manager:[
          // 	{required: true, message: '管理员不能为空', trigger: 'change'}
          // ],
          storeGroupNum: [{
            required: true,
            message: '可同时容纳数不能为空',
            trigger: 'change'
          }]
        },
        editId: '',
        labelWidth: '121px',
        formList: [
          // {label:'课程',model:'courseName',disabled:true},
          {
            label: '课程内容',
            model: 'content',
            disabled: true
          },
          {
            label: '授课形式',
            model: 'teachingFormName',
            disabled: true
          }
        ],
        tableList: [
          // {label:'工号', prop:'teacherNo'},
          {
            label: '场地名称',
            prop: 'areaName'
          },
          {
            label: '场地类型',
            prop: 'areaType'
          },
          {
            label: '楼栋',
            prop: 'buildName'
          },
          {
            label: '校区',
            prop: 'campusName'
          },
          {
            label: '管理员',
            prop: 'manager'
          },
          {
            label: '优先级',
            prop: 'priority'
          },
          {
            label: '可同时容纳组数',
            prop: 'storeGroupNum'
          }
        ],
        tableData: [
          // {teacherNo: '1', areaName: '张三丰', areaType: '场地类型', buildName:'楼栋', campusName: '校区', manager: '管理员', priority: '优先级10', storeGroupNum: '50'},
          // {teacherNo: '1', areaName: '张三丰', areaType: '场地类型', buildName:'楼栋', campusName: '校区', manager: '管理员', priority: '优先级10', storeGroupNum: '50'},
          // {teacherNo: '1', areaName: '张三丰', areaType: '场地类型', buildName:'楼栋', campusName: '校区', manager: '管理员', priority: '优先级10', storeGroupNum: '50'}
        ],
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
      }
    },
    created() {
      this.formDetail = this.$route.query;
      this.placeForm.courseContentId = this.formDetail.courseContentId;
      this.getArea();
      this.getTableList();
    },
    mounted() {
      util.resize(this);
      window.onresize = () => {
        util.resize(this);
      };
    },
    methods: {
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      onClose() {
        var param = this.$route.query;
        delete param.courseContentId;
        this.$router.push({
          path: '/educational_admin/course_content',
          query: param,
          // query: {
          // 	actionId: this.$route.query.actionId,
          // 	courseId: this.$route.query.courseId,
          // 	// searchCourseId: this.$route.query.searchCourseId,
          // 	// searchYearId: this.$route.query.searchYearId
          // }
        })
      },
      addTask() {
        this.dialog.status = 'add';
        this.dialog.visible = true;
      },
      findAreaName(val) {
        for (var i = 0; i < this.areaList.length; i++) {
          if (val == this.areaList[i].id) {
            this.placeForm.areaName = this.areaList[i].name;
          }
        }
      },
      dialogClose() {
        for (let key in this.placeForm) {
          this.placeForm[key] = '';
        }
        this.placeForm.courseContentId = this.formDetail.courseContentId;
        this.dialog.visible = false;
        this.$refs.placeForm.resetFields();
      },
      planAdjustment(row) {
        this.dialog.status = 'edit';
        this.dialog.visible = true;
        for (let key in this.placeForm) {
          this.placeForm[key] = row[key];
        }
        this.editId = row.id;
        this.placeForm.courseContentId = this.formDetail.courseContentId;
      },
      teachingRemark() {
        this.dialog.remark = true;
      },
      handleClick() {

      },
      // /areas/areaDetailsByName/{areaName}
      getAreaInfoList(val, cb) {
        if (val) {
          this.$http.get(`_op:/areas/areaDetailsByName/${val}`).then(res => {
         
            let results = [];
            for (var i = 0; i < res.data.length; i++) {
              let obj = {};
              obj.value = res.data[i].areaName;
              obj.item = res.data[i];
              results.push(obj);
            }
            cb(results)
          })
        }

      },
      handleSelect(item) {
        this.placeForm.areaName = item.item.areaName;
        this.placeForm.areaType = item.item.areaType;
        this.placeForm.buildName = item.item.buildName;
        this.placeForm.campusName = item.item.campusName;
        this.placeForm.areaId = item.item.id;
      },
      getEdit() {

      },
      courseClose(formName, method) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (method === 'post') { // 新增
              this.addNewArea();
            } else if (method === 'put') { // 修改/编辑
              this.editArea();
            }
          }
        })
      },
      // 新增
      addNewArea() {
        this.$http.post('_op:/areaCourseContentRel', this.placeForm).then(res => {
          this.$message.success('新增成功');
          this.dialogClose();
          this.getTableList();
        })
      },
      editArea() {
        let params = {};

        params = this.placeForm;
        params.id = this.editId;

        this.$http.put('_op:/areaCourseContentRel/update', params).then(res => {
          this.$message.success('编辑成功');
          this.dialogClose();
          this.getTableList();
        })
      },
      // 删除
      deleteTeacher(row) {
        this.$confirm(`确定删除当前关联场地信息吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`_op:/areaCourseContentRel/${row.id}`).then(data => {
            this.$message({
              type: 'success',
              message: '已删除'
            });
            this.getTableList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getTableList() {
        this.$http.post('_op:/areaCourseContentRel/list', {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          param: {
            //courseContent: '', // this.$route.query.content
            courseContentId: this.$route.query.courseContentId,
            //teachingFormContent: '' // this.$route.query.content
          }
        }).then(data => {
          this.tableData = data.result;
          this.totalCount = data.totalCount;
        })
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
      /**
       * [getArea 获取授课场地]
       * @param  {[type]} str [场地关键词 支持模糊查询]
       */
      getArea(str) {
        this.loading = true;
        this.$http.post("_ed:/exchangecourse/query/area", {
          str: str
        }).then(data => {
          this.areaList = data.data;
        }).catch(() => {})
      },
    }
  }
</script>
<style>
  .dv-wrap {
    display: flex;
  }
</style>