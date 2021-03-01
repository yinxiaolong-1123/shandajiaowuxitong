<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :rules="formInlineRules" :model="formInline" ref="formName">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item> -->

            <el-form-item label="年级" prop="grade">
              <intelligent-year-picker style="width: 100px;" @change="getCourseList('grade')" v-model="formInline.grade" type="year" value-format="yyyy">
              </intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">
              <el-select v-model="formInline.majorId" @change="getCourseList('major')" clearable filterable placeholder="请选择课程">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="list in options1" :key="list.id" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="课程" prop="courseId">
              <el-select v-model="formInline.courseId" filterable clearable placeholder="请选择课程">
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="btn">
                <el-button type="primary" size="mini" @click="onSearch('formName')">查询</el-button>
              </div>
            </el-form-item>
          </div>
      </el-form>
    </div>

    <div class="cm-table" style="margin-top:10px">
      <el-table size="mini" ref="multipleTable" :data="tableData1" border style="width: 97%" header-row-class-name="cm-dark" v-loading="tableLoading" element-loading-text="加载成绩模型...">
        <el-table-column type="index" label="序号" fixed width="60"></el-table-column>
        <el-table-column prop="majorName" label="专业" fixed width="200"></el-table-column>
        <el-table-column prop="grade" label="所在级别" fixed width="70"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" fixed width="280"></el-table-column>
        <el-table-column prop="stage" label="阶段权重" width="95">
          <template slot-scope="scope">
            <span>第{{scope.row.stage +'学期('+scope.row.stageWeight+')'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="85"></el-table-column>
        <el-table-column prop="scoreTypeProportion" width="1800" label="成绩类型及比例">
          <template slot-scope="scope">
            <span>{{scope.row.scoreTypeProportion}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createUser" label="创建人"></el-table-column> -->
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editTask(scope.row)"   v-if="hasPermission('kechengchengjimoxingdingyi', 'update')">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增及编辑 -->
    <el-dialog width="60%" title="编辑成绩模型" :modal-append-to-body="false" :close-on-click-modal="false" :visible.sync="dialog.visible" @closed="addDialogClose">
      <div>
        <table style="width:100%;line-height: 30px;">
          <th class="modeltab_left">成绩类型</th>
          <th class="modeltab_center">权重%</th>
          <th class="modeltab_right">操作 &#x3000;&#x3000;</th>
        </table>
        <el-collapse v-model="activedName">
          <el-collapse-item v-for="(list,index) in dialogData.stages" :key="index" :name="list.id">
            <template slot="title">
              <table style="width:100%">
                <th class="modeltab_left">&#x3000;第{{list.stage}}学期
                </th>
                <th class="modeltab_center" @click.stop="eidtstageWeight(dialogData.stages,index)">&nbsp;
                  <template v-if="list.openOrcolse">
                    <el-input autofocus="true" size="mini" style="width: 156px;" v-model="list.stageWeight" @blur="colsestageWeight(dialogData.stages,index)"></el-input>%
                  </template>
                  <template v-else>
                    {{list.stageWeight}}%
                  </template>
                </th>
                <th>
                  <template v-if="list.isCourseGradeEditable==true">
                    <el-checkbox v-model="list.isCourseGrade">本学期计算课程成绩</el-checkbox>
                  </template>
                  <template v-else>
                    <el-checkbox v-model="list.isCourseGrade" disabled>本学期计算课程成绩</el-checkbox>
                  </template>
                </th>
                <th class="modeltab_right">展开/收起&nbsp;&nbsp;</th>
              </table>
            </template>
            <table style="width:100%">
              <tr v-for="(item,index2) in list.scoreType" :key="index2">
               
                <td class="modeltab_left padleft_20" @click.stop="editselect($event, list.scoreType,index2, list)">
                  <template v-if="item.select">
                    <el-select v-model="item.id" placeholder="请选择" size="mini" @change="colsetselect($event, list.scoreType,index2)">
                      <el-option v-for="item2 in achievementRatio" :key="item2.id" :label="item2.name" :value="item2.id">
                      </el-option>
                      <el-option value="" v-if="list.paramValue == 1">
                        <el-button type="text" class="addBtn" @click="addAchievementType()">新增</el-button>
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else>
                    {{ item | examTypeName(achievementRatio) }}
                  </template>
                </td>
                <td class="modeltab_left" @click="editinput(list.scoreType,index2)">
                  <template v-if="item.edit" >
                    <el-input autofocus="true" size="mini" :disabled="item.id==-1"  v-model="item.proportion" @change="inputChange(list)" style="width: 156px;" @blur="colseinput(list.scoreType,index2)"></el-input>%
                  </template>
                  <template v-else >
                    <template >
                      {{item.proportion}}%
                    </template>
                    
                  </template>
                </td>
                <td class="modeltab_right padright_20">
                  <el-button type="text" @click="addinput(list.scoreType,index2)" :disabled="list.can_modify == 0"  v-if="hasPermission('kechengchengjimoxingdingyi', 'add')">新增</el-button> / <el-button type="text" @click="removeinput(list.scoreType,index2)" :disabled="list.can_modify == 0"  v-if="hasPermission('kechengchengjimoxingdingyi', 'delete')">删除</el-button>
                </td>
              </tr>
             
            </table>
           <p style=" margin-left: 8%;">{{`本阶段各成绩类型的权重之和应为100%，还差${list.scoreswight}%`}}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="(dialog2.status==='add'?'新增':'编辑') " :modal-append-to-body="false" :visible.sync="dialog2.visible" width="400px" :close-on-click-modal="false" custom-class="cm-dialog-small">
      <el-form :model="formDialog" ref="formDialog" class="boxStyle" :rules="rules">
        <el-form-item label="名称" prop="cnName" :label-width="formLabelWidth">
          <el-input v-model="formDialog.cnName"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="enName" :label-width="formLabelWidth">
          <el-input v-model="formDialog.enName" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="formDialog.remark" type="textarea" rows="4" cols="50" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="this.dialog.status!=='add'" :label-width="formLabelWidth">
          <el-radio-group v-model="formDialog.status" :disabled="Jurisdiction">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog2.visible=false">取 消</el-button>
        <el-button type="primary" @click="commonValidate('formDialog')">确 定</el-button>
      </span>
    </el-dialog>
    <div class="cm-pagination">
      <el-pagination background :current-page="pageNo" :page-sizes="[1,2,10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="sizeChange" @current-change="currentChange">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import util from '@/util'
  const TYPE = 'class-management';
  const REMARK = '上课班管理';

  import {
    mapState
  } from 'vuex'

  export default {
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
        }
        else {
          callback();
        }
      };
      return {

        editable: [
          true
        ],
        formLabelWidth: '100px',
        remark: REMARK,
        addOrsave: ['新增'],
        achievementRatio: [],
        stagePerformance: '',
        activedName: [],
        rules: {
          code: [{ required: true, message: '请输入代码', trigger: ['change'] },
            { validator: codeRules, trigger: ['change'] }
          ],
          cnName: [{ required: true, message: '请输入名称', trigger: 'change' },
            { validator: cnNameRules, trigger: [, 'change'] }
          ]

        },
        formInlineRules: {
          grade: [{ required: true, message: '请选择年级', trigger: ['blur'] },
          ],
          courseId: [{ required: true, message: '请选择课程', trigger: ['blur'] },
          ]

        },
        dialog: {
          visible: false
        },
        dialogscoreType: [],
        dialogData: [],
        dateList: [],
        courseList: [], //课程下拉数据定义
        tableData1: [],
        newSize: [],
        breadcrumb: [{
            label: "成绩管理"
          },

          {
            label: "课程成绩模型"
          },
        ],
        dialog: {
          status: 'add',
          remark: false,
          visible: false
        },
        dialog2: {
          status: 'add',
          remark: false,
          visible: false
        },
        formDialog: {
          code: '',
          cnName: '',
          enName: '',
          status: 1,
          remark: "",
          courseIds: []
        },
        options1: [],
        formInline: {
          grade: "",
          majorId: "",
          courseId: '',
          incompleteFlag: false, //权重比例
          teach: '-1'
        },
        addForm: {
          courseId: "",
          name: '',
          type: '',
          grade: ""
        },
        tableData: [],
        newtableData: [], //按方案维护数据
        teachTypeList: [{
          name: '普通教学',
          id: 0
        },
        {
          name: '全英教学',
          id: 1
        }],
        addColumn: [{
          id: ''
        }],
        tableLoading: false,
        myDate: new Date(),
        courseArrangeList: [],
        formYear: "",
        fallYear: "",
        semesterNum: "",
        pageNo: 1,
        pageSize: 20,
        totalCount: 0,
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        recordId: 0,
        sumProportion: 0,
        tecId: ''
      }
    },
    created() {
      this.$authorize.me().then(res => {
        this.tecId = res.attributes.login_info.id
        // this.getTermData(); //专业下拉数据请求
      });
      // this.getTableList(); //请求列表数据
      // this.openSchemeMaintenance();

      this.getDialogtableList(); //获取弹窗列表
      // this.getCourseArrange(); //课程下拉数据获取???

      // this.newgetTableList();//按方案维护列表数据请求
    },
    mounted() {},
    filters: {
      lengthFn(item) {
        let itemlength = 0;
        item.stages.map(itemstage => {
          if (itemstage.scoreType.length) {
            itemlength += itemstage.scoreType.length + 1;
          }
        })

        return itemlength
      },

      examTypeName: function (item, arrs) {
        var v = arrs.filter(i => i.id == item.id);
        if (v.length > 0) {
          item.name = v[0].name;
          return v[0].name;
        }
        return "未知";
      }
    },
    watch: {
      recordId: function (newQuestion, oldQuestion) {
       
      }
    },
    methods: {
       hasPermission(key, val) {
      return this.$authorize.hasPermission(key,val);
    },
      inputChange(list) {
        let arr = list.scoreType
      
      
        list.scoreswight = 100 - Number(this.getsun(arr));

      },


      getsun(arr) {
        let sum = 0
        for (let i = 0; i < arr.length; i++) {
          sum += arr[i].proportion * 1
        }
        return sum;
      },
      // 新增验证
      commonValidate(formDialog) {
        this.$refs.formDialog.validate((valid) => {
          if (valid) {
            this.commonRequire();
            this.dialog2.visible = false;
          } else {
            return false;
          }
        });
      },
      // 新增提交
      commonRequire() {
        let that = this;
        let url = "_sc:/scoreSetting";
        if (this.dialog.status == 'add') {
          this.formDialog.type = 'SCORE_TYPE';
        };
        this.formDialog.examType = 1,
        this.$http({
          method: this.dialog.status == 'add' ? "post" : 'put',
          url: url,
          data: this.formDialog,
        }).then(data => {
          let type = "success";
          let message = `${this.dialog.status == 'add' ? '新增' : '编辑'}成功！`
          if (data.code == 0) {
            // this.getSwitchSetList();
            this.getScoreSetting();
            // this.dialog.visible = false;
          } else {
            type = "error";
            message = data.msg;
          }
          this.$message({
            type: type,
            message: message
          });
        })
      },
      addAchievementType() {
        this.dialog2.status = 'add';
        this.dialog2.visible = true;
        // this.formDialog.code = '';
        this.formDialog.code = util.uuid();
        this.formDialog.cnName = '';
        this.formDialog.enName = '';
        this.formDialog.status = '1';
        this.formDialog.remark = '';
        this.formDialog.courseIds.push(this.formInline.courseId);
      },
      validateInput(val) {},
      editinput(item, index) {
        item[index].edit = true
      },
      editselect($event, item, index, list) {
        if(list.can_modify == 1){
          item[index].select = true
          this.addOrsave[index] = '保存'
        }
      },
      colseinput(item, index) {

        item[index].edit = false
      },
      colsetselect(value, item, index) {
        item[index].select = false
        // if(item[index].id==-1){
        //    item[index].proportion=0
        // }
      },
      eidtstageWeight(stagesweight, index) {

        stagesweight[index].openOrcolse = true
      },
      colsestageWeight(stagesweight, index) {

        stagesweight[index].openOrcolse = false
      },
      addinput(item, index) {
        let a = {
          edit: true,
          id: '',
          name: '',
          select: true,
          proportion: 0
        }
        item.splice(index + 1, 0, a)

      },
      removeinput(item, index) {
        if(item.length <= 1){
          this.$message({
            type: 'warning',
            message: '至少需要一个成绩类型，不能删除'
          })
          return
        }
        item.splice(index, 1)

      },
      // 获取列表数据
      getTableList() {
        this.tableLoading = true;
        this.$http.post('_sc:/courseScoreModel/ScoreModelList', {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          courseId: this.formInline.courseId, //课程ID
          grade: this.formInline.grade, //所在级 
          majorId: this.formInline.majorId, //专业ID
        }).then(data => {
          this.tableLoading = false;
          this.tableData1 = data.data.dataList;
          this.totalCount = data.data.total_records;
        }).catch(() => {
          this.tableLoading = true;
        })
      },

      //查询
      onSearch(formName) {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.pageNo = 1;
            this.getTableList();
          } else {
            return false;
          }
        });
      },
      // onSearch() {
      //   this.pageNo = 1;
      //   this.getTableList();
      // },


      // 弹窗列表数据
      getDialogtableList() {
        //   let courseId=135;
        //   let  grade=2018;
        //   let  majorId=59;
        //   this.$http.post("_sc:/courseScoreModel/list/detail",{
        //       courseId,
        //       grade,
        //       majorId
        //       }).then(res =>{
        //       })
      },
      // 编辑弹窗
      editTask(row) {
        this.getScoreSetting()
        this.dialog.visible = true;
        let courseId = row.courseId;
        let grade = row.grade;
        let majorId = row.majorId;
        this.$http.post("_sc:/courseScoreModel/list/detail", {
          courseId,
          grade,
          majorId
        }).then(data => {
          data.data.stages.map(item1 => {
            //  if(item1.scoreType.indexOf(某元素) > -1){//则包含该元素}
            item1.isCourseGradeEditable = true;
            item1.scoreswight = 0
            let arr = []
            item1.openOrcolse = false
            item1.scoreType.map(item2 => {
          
              item2.edit = false
              item2.select = false
              arr.push(item2)
              item1.scoreswight = this.getsun(arr)
              if (item2.proportion < 0) {
                item2.statu = false;
              }
              if (item2.proportion * 1 > 0) {
                item2.statu = true;
              }
            })
            item1.scoreswight = 100 - Number(this.getsun(arr));
            if (item1.isCourseGrade == 1) {
              item1.isCourseGrade = true;
            } else {
              item1.isCourseGrade = false;
            }
          });
          data.data.stages.sort((a, b) => a.stage - b.stage);
          data.data.stages[data.data.stages.length - 1].isCourseGrade = true;
          data.data.stages[data.data.stages.length - 1].isCourseGradeEditable = false;
          this.dialogscoreType = data.data.stages[0].scoreType;
          this.dialogData = data.data;
        
          if (Array.isArray(this.dialogData.stages)) {
            this.dialogData.stages.forEach(s => {
              this.activedName.push(String(s.id));
            })
          }
       
          this.tableLoading = false;
        })

        this.dialog.visible = true;

      },

      // 课程下拉数据拉取数据
      getCourseList(flag) {
        let grade,
            majorId
        if(this.formInline.grade == '' || this.formInline.grade == null){
          grade = 0
        }else{
          grade = this.formInline.grade
        }
        if(this.formInline.majorId == '' || this.formInline.majorId == null){
          majorId = 0
        }else{
          majorId = this.formInline.majorId
        }
        if(flag === 'grade') {
          this.formInline.majorId = ''
          this.options1 = []
          this.$http.get('_op:/major/getMajorByGrade/' + grade)
            .then( res => {
              this.options1 = res.data
            })
        }
        this.$http.get(`_op:/courseMajorRel/combox/${majorId}/${grade}/0/${this.tecId}`)
          .then(data => {
            let self = this
            if (data.code == 0) {
              self.courseList = data.data;

            } else {
              self.$message.error(data.msg);
            }
          })
      },
      // 专业数据获取
      getTermData() {
        this.$http.get('_op:/major/combox')
          .then(data => {
            if (data.code == 0) {
              this.options1 = data.data;
              let id = data.data[0].id
              // this.formInline.majorId = data.data[0].id;
              this.getCourseList(id);
            } else {
              this.$message.error(data.msg);
            }
          })
      },

      //  展开数据
      collapseShow() {
        this.fold.state = !this.fold.state;
        this.fold.text = this.fold.state ? '收起' : '展开';
      },
      // 显示条数
      sizeChange(size) {
        this.pageNo = 1;
        this.pageSize = size;
        this.getTableList(); //请求列表数据
      },
      // 翻页
      currentChange(current) {
        this.pageNo = current;
        this.getTableList(); //请求列表数据
      },
      //根据类型获取成绩管理基础设置
      getScoreSetting() {
        this.$http.get("_sc:/scoreSetting/getScoreType/" + this.formInline.courseId).then(res => {
          this.achievementRatio = [].concat(res.data);

        })
      },

      // 课程下拉列表请求
      getCourseArrange() {
        this.$http.post("_ed:/semestercourse/list/detail", {
          semester_year: this.fallYear,
          semester_year_number: this.semesterNum
        }).then(data => {
          if (data.code == 0) {
            this.courseArrangeList = data.data;
            for (let list of this.courseArrangeList) {
              // this.newData=list.teachTaskCourseList;
              if (list.teachTaskCourseList) {
                for (let item of list.teachTaskCourseList) {
                  let house =
                    `${item.semester_theory_hours}/${item.semester_novitiate_hours}`;

                  this.$set(item, "name", `${item.course_name}（${item.major}，${house}）`);
                  this.$set(item, "courseId", list.id);
                }
              }
            }
          } else {
            this.$message.error(data.msg);
          }
        })
      },

      //按方案维护
      openSchemeMaintenance(formName) {
        // this.$confirm("此操作会使用最近的培养方案同步成绩模型，请确认是否继续！", "提示", {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   const url = '_sc:/courseScoreModel/sync/trainplan';
        //   this.$http.post(url).then(resp => {
        //     this.$message.success("同步成绩模型成功，正在刷新成绩模型");
        //     this.getTableList();
        //   }).catch(resp => {
        //     this.$message.error("同步成绩模型失败，请联系管理员！");
        //   });
        // }).catch(() => {

        // });
        this.tableLoading = true;
        const url = '_sc:/courseScoreModel/syncScoreModel';
        this.$http.post(url,{
          semester_year:null,
          semester_year_number:null
        }).then(resp => {
          // this.$message.success("同步成绩模型成功，正在刷新成绩模型");
          this.getTableList();
        }).catch(resp => {
          // this.$message.error("同步成绩模型失败，请联系管理员！");
          this.$message.error("获取成绩模型失败，请联系管理员！");
        });
      },


      onPageJump() { // 成绩模型权重比例 页面跳转
        let self = this;

        if (course == "") {
          course = 0;
        }
      },
      newNum(arr) {
        var s = 0;
        arr.forEach(function (val, idx, arr) {
          s += val;
        }, 0);
        return s;
      },
      // 设置非选中状态，比例值为0
      changeStatus(index1, index2) {
        let statu = this.dialogData.stages[index1].scoreType[index2].statu;
        if (statu == false) {
          this.dialogData.stages[index1].scoreType[index2].proportion = 0;
        }
        if (statu == true) {
          if (this.dialogData.stages[index1].scoreType[index2].proportion < 1) {
            this.$message({
              message: '比例不能小于1',
              type: 'warning'
            });
          }
        }
      },
      submitForm(row) {
        let editData = {
          courseId: this.dialogData.courseId,
          grade: this.dialogData.grade,
          majorId: this.dialogData.majorId,
          stages: []
        };

        let msg = ''
        let flag = true
        this.dialogData.stages.map((item,index) => {
          let temp = JSON.parse(JSON.stringify(item));
          if(flag){
            let totalPerc = 0
            if(temp.isCourseGrade){
              if(index == 0){
                totalPerc = Number(this.dialogData.stages[index].stageWeight)
              }else{
                  totalPerc = Number(this.dialogData.stages[index].stageWeight)
                  for (let i = index-1; i >= 0; i--) {
                    const ele = this.dialogData.stages[i];
                    if(ele.isCourseGrade){
                      break
                    }else{
                      totalPerc += Number(ele.stageWeight)
                    }
                  }
              }
              if(totalPerc != 100){
                msg = `阶段权重应等于100%`
                flag = false
              }
            }
          }
          if(flag && +temp.scoreswight > 0){
            msg = `第${temp.stage}学期各成绩类型的权重之和应不小于100%`
            flag = false
          }
          if(item.isCourseGrade==true){
              temp.isCourseGrade = 1
          }else{
              temp.isCourseGrade = 0
          }
          let stageObj = {
            id: temp.id,
            stage: temp.stage,
            isCourseGrade:temp.isCourseGrade,
            stageWeight: temp.stageWeight,
            termId: temp.termId,
            scoreType: []
          };
       
          temp.scoreType.map(item2 => {
            if (item2.proportion > 0) {
              let scoreTypeObj = {
                id: item2.id,
                name: item2.name,
                proportion: Number(item2.proportion)
              }
              scoreTypeObj.proportion = Number(scoreTypeObj.proportion)
              stageObj.scoreType.push(scoreTypeObj)
            }
          })
          if (stageObj.scoreType != 0) {
            editData.stages.push(stageObj)
            //  editData.stages[editData.stages.length-1].isCourseGrade =1
          }
        })
        if(!flag){
          this.$message({
            type: 'warning',
            message: msg
          })
          return
        }
        this.$http.put("_sc:/courseScoreModel", editData).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '编辑保存成功',
              type: 'success'
            });
            this.dialog.visible = false;
            this.getTableList(); //刷新列表
          } else if (res.code == 1) {
            this.$message({
              message: res.msg,
              type: 'warning'   
            });

          } else {
            this.$message.error(res.msg);
          }
        })
      },


      // 编辑提交
      confirmAdd() {},
      //    关闭弹窗，清空数据
      addDialogClose() {
        this.dialog.visible = false;
        this.dialogData = [];
        this.addForm.name = "";
        this.addForm.type = "";
        this.addForm.grade = "";
        this.addColumn = [{
          id: ""
        }];
      },
      addDialog2Close() {
        this.dialog2.visible = false;
        this.formDialog.cnName = "";
        this.formDialog.enName = "";
        this.formDialog.remark = "";

      },
    },
    computed: {
      ...mapState(['btnPermitList']),
      _upload_data() {
        return {
          _upload_data: JSON.stringify({
            create_user: this.userId,
            create_username: this.userName
          })
        }
      },
  
    },
  }
</script>
<style scoped lang="less">
.addBtn{
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0;
  span{
    width: 100%;
    height: 100%;
    line-height: 2;
  }
}
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
  .stationtable {
    width: 100%;
    text-align: center;
    position: relative;
    margin-bottom: 20px;

    th {
      background-color: #eef1f6;
      line-height: 40px;
      border: 1px solid #dfe6ec;
    }

    td {
      width: 10%;
      border: 1px solid #dfe6ec;
      line-height: 25px;

      .el-input {
        width: 90%;
        margin: 5px 0;
      }
    }

    .bluetext {
      cursor: pointer;
      color: #409EFF;
      font-size: 10px;
    }
  }

  .modeltab_left {
    width: 20%;
    text-align: center;
  }

  .modeltab_right {
    // width: 20%;
    text-align: right;
  }

  .modeltab_center {
    width: 20%;
    text-align: center;
  }

  .padright_20 {
    padding-right: 20px
  }

  .padleft_20 {
    padding-left: 20px
  }

  .modeltab_right {
    .el-button+.el-button {
      margin-left: 0px;
    }
  }
  .hideorshow{
    opacity: 0;
  }
</style>
