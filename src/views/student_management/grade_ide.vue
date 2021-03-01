<template>
  <div class="gradeIde">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" :to="item.path">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-table">
      <div class="grade-list">
        <el-table :data="gradeList" border size="mini" @row-click="showDetail" :highlight-current-row="true">
          <el-table-column prop="stu_name" label="姓名"></el-table-column>
          <el-table-column prop="type" label="异动类型">
            <template slot-scope="scope">
              <template v-if="scope.row.type == 10">院内转专业</template>
              <template v-else-if="scope.row.type == 2">院内转出</template>
              <template v-else-if="scope.row.type == 3">院外转入</template>
              <template v-else-if="scope.row.type == 4">休学</template>
              <template v-else-if="scope.row.type == 5">退学</template>
              <template v-else-if="scope.row.type == 6">降级</template>
              <template v-else-if="scope.row.type == 11">转班</template>
              <template v-else-if="scope.row.type == 9">复学</template>
              <template v-else-if="scope.row.type == 12">保留学籍</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="grade-table">
          <el-form
            :label-position="labelPosition"
            label-width="80px"
            ref="affirmForm"
            :model="affirmForm"
            >
            <el-row type="flex" justify="flex-start">
              <el-col :span="4">
                <el-form-item class="input-item" label="学号" prop="stuNum">
                  <el-input
                    size="mini"
                    v-model="affirmForm.stuNum"
                    placeholder=""
                    disabled
                    @keyup.native="keyupHandle"
                    style="width:110px"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item class="input-item" label="姓名">
                  <el-input size="mini" v-model="affirmForm.stuName" style="width:110px" :disabled="true" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="转入年级" prop="presentGrade">
                  <el-input size="mini" v-model="affirmForm.presentGrade" style="width:60px" :disabled="true" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="转入专业" prop="presentMajorId">
                  <el-input size="mini" v-model="affirmForm.majorName" :disabled="true" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                  <span style="display:flex;justify-content:flex-start;align-items:center;height:100%;margin-left:40px" v-if="showAffirmCourseList.length > 0 && showAffirmCourseList[0].is_public == 1">
                    <el-button size="mini" @click="gradeBack()">返 回</el-button>
                  </span>
                  <span style="display:flex;justify-content:flex-start;align-items:center;height:100%;margin-left:40px" v-else>
                    <el-button size="mini" type="primary" @click="affirmSubmit">暂 存</el-button>
                    <el-button size="mini" type="primary" @click="handlePublishCourse">提 交</el-button>
                    <el-button size="mini" @click="gradeBack()">返 回</el-button>
                  </span>
              </el-col>
            </el-row>
          </el-form>

          <div class="affirm-wrapper">
            <div class="affirm-header clear">
              <el-form :inline="true" size="mini" :model="formInline" style="margin-left:40px">
                <!-- <el-form-item label="学期">
                  <el-select filterable v-model="formInline.term" placeholder="全部">
                    <el-option label="全部" :value='0'></el-option>
                    <el-option

                      v-for="item in affirmtermList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
            <!--  <el-checkbox v-if="afftype==3" style="margin-left: 40px" v-model="courseChecked">仅认定课程成绩</el-checkbox>    -->
            </div>
            <div class="affirm-list cm-table">
              <el-table
                :data="showAffirmCourseList"
                border
                size="mini"
                v-loading='tableLoading'
                style="width: 100%"
                header-row-class-name="cm-dark"
                v-if="afftype==3"
              >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="学期" prop="affirmTermNumber" width="70">
                  <template slot-scope="scope">
                    <span v-if="scope.row.affirm_term_number != null">{{`第${scope.row.affirm_term_number}学期`}}</span>
                    <span v-else>{{''}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="认定课程" prop="id"  width="180">
                  <template slot-scope="scope">
                    <span>{{scope.row.affirm_course_name}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="阶段成绩" prop="affirm_stage_grade" width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_stage_grade }}
                    </span>
                    <el-input v-else :ref="`ipt1${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_grade"  oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="阶段补考成绩" prop="affirm_stage_bkgrade" width="94">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_stage_bkgrade }}
                    </span>
                    <el-input v-else :ref="`ipt2${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_bkgrade" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="补考次数" prop="affirm_bktimes" width="70">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_bktimes }}
                    </span>
                    <el-input v-else :ref="`ipt3${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_bktimes" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="课程成绩" prop="affirm_course_grade" width="90">
                  <template slot-scope="scope">
                    <el-input :ref="`ipt4${scope.$index}`" v-if="scope.row.is_course_grade == 1 && scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                    <span v-else>
                      {{ scope.row.affirm_course_grade }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="原专业课程" prop="former_course_name" width="220">
                  <template slot-scope="scope">
                    
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{ scope.row.former_course_name }}</span>
                    <!-- <el-select v-else size="mini"  filterable value-key="course_name" v-model="affirmFormBack.list[scope.$index].former_course_name1" clearable placeholder="" style="width: 100%;">
                      <el-option
                        v-for="(item,key) in scope.row.affrimCourseLists"
                        :key="key"
                        :label="`${item.course_name}(第${item.stage}学期)`"
                        :value="item"
                      ></el-option>
                    </el-select> -->
                    <el-input v-else size="mini" v-model="affirmFormBack.list[scope.$index].former_course_name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="原课程成绩" prop="former_course_grade" width="85">
                  <template slot-scope="scope">
                    <el-input :ref="`ipt6${scope.$index}`" v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].former_course_grade" size="mini"></el-input>
                    <span v-else>
                      {{ scope.row.former_course_grade }}
                    </span>
                  </template>
                </el-table-column>
              
                <el-table-column label="备注" prop="mark" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" :ref="`ipt5${scope.$index}`" v-model="affirmFormBack.list[scope.$index].remark" size="mini"></el-input>
                    <span v-else>
                      {{ scope.row.remark }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                :data="showAffirmCourseList"
                border
                size="mini"
                style="width: 100%"
                v-loading='tableLoading'
                header-row-class-name="cm-dark"
                v-if="(afftype==10 || afftype==6 || afftype==9 )&& showAffirmCourseList.length > 0"
              >
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="学期" prop="former_term_name" width="70">
                </el-table-column>

                <el-table-column label="原课程" prop="former_course_name" width="180" >
                  <template slot-scope="scope">{{ scope.row.former_course_name }}</template>
                </el-table-column>

                <el-table-column label="原阶段成绩" prop="former_stage_grade" width="100">
                </el-table-column>
                <el-table-column label="原课程成绩" prop="former_course_grade" width="85">
                </el-table-column>

                <el-table-column label="认定学期" prop="affirmTermNumber" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{`第${scope.row.affirm_term_number}学期`}}</span>
                    <el-select v-else size="mini" @change="changeTerm(affirmFormBack.list[scope.$index].affirm_term_number,scope.$index)" v-model="affirmFormBack.list[scope.$index].affirm_term_number" clearable placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="(item,key) in affirmtermList"
                        :key="key"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                
                <el-table-column label="认定课程" prop="id" width="200" >
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{scope.row.affirm_course_name}}</span>
                    <el-select v-else size="mini" @change="changeCourse(scope.$index,affirmFormBack.list[scope.$index].affirm_course_id,affirmFormBack.list[scope.$index].affirm_term_number)" :disabled="affirmFormBack.list[scope.$index].affirm_term_number == null" filterable v-model="affirmFormBack.list[scope.$index].affirm_course_id" clearable placeholder="请先选择学期再选择课程" style="width: 100%;">
                    
                      <el-option
                        v-for="(item,key) in scope.row.affrimCourseLists"
                        :key="key"
                        :label="item.course_name"
                        :value="item.course"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="阶段成绩" prop="affirm_stage_grade" width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_stage_grade }}
                    </span>
                    <el-input v-else :ref="`ipt1${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_grade"  oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="阶段补考成绩" prop="affirm_stage_bkgrade" width="94">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_stage_bkgrade }}
                    </span>
                    <el-input v-else :ref="`ipt2${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_bkgrade" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="补考次数" prop="affirm_bktimes" width="70">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                      {{ scope.row.affirm_bktimes }}
                    </span>
                    <el-input v-else :ref="`ipt3${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_bktimes" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="课程成绩" prop="affirm_course_grade" width="90">
                  <template slot-scope="scope">
                    <el-input :ref="`ipt4${scope.$index}`" v-if="scope.row.is_course_grade == 1 && scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                    <el-input :ref="`ipt9${scope.$index}`" v-else disabled oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="mark" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" :ref="`ipt5${scope.$index}`" v-model="affirmFormBack.list[scope.$index].remark" size="mini"></el-input>
                    <span v-else>
                      {{ scope.row.remark }}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
    </div>
    <el-dialog
      title="提 示"
      :close-on-click-modal="false"
      :visible.sync="dialog.tipAffirmVisible"
      width="500px"
      :modal-append-to-body="false"
      >
      <p>
        <i class="el-icon-info" style="color:#e6a23c;"></i> 发布后成绩不能再修改且记录到成绩记载表中, 是否继续?
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialog.tipAffirmVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handlePublic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'gradeIde',
  data(){
    return {
      breadcrumb: [
        {label: '学籍管理'},
        {label: '学籍异动', path: '/student_management/school_rool_change'},
        {label: '批量成绩认定'}
      ],
      tableLoading: false,
      gradeList: [],
      afftype: '',
      modifiedId: '',
      clickModified: {},
      affirmForm: {
        list: [],
        modifiedId: "",
        stuNum: "",
        stuName: "",
        presentGrade: "",
        presentMajorId: "",
        majorName: '',
        submitType: ""
      },
      dialog: {
        status: "add",
        title: "",
        visible: false,
        classVisible: false,
        affirmVisible: false,
        majorVisible: false,
        tipAffirmVisible: false
      },
      affirmFormBack: {},
      affrimCourseLists: [],
      affrimCourseListsBack: [],
      labelPosition: "right",
      courseChecked: false, 
      formInline: {
        pageNo: 1,
        pageSize: 20,
        stuName: "",
        stuNum: "",
        type: "",
        term: ""
      },
      affirmtermList: [
        { name: "第一学期", id: 1 },
        { name: "第二学期", id: 2 },
        { name: "第三学期", id: 3 },
        { name: "第四学期", id: 4 },
        { name: "第五学期", id: 5 },
        { name: "第六学期", id: 6 },
        { name: "第七学期", id: 7 },
        { name: "第八学期", id: 8 },
        { name: "第九学期", id: 9 },
        { name: "第十学期", id: 10 }
      ],
    }
  },
  created() {
    this.getTableData()
  },
  computed: {
    showAffirmCourseList() {
    
      if (this.formInline.term && this.afftype != 3) {
        var list = this.affirmForm.list.filter(
          item => item.former_term_number === this.formInline.term
        );
        return list;
      }
      if (this.formInline.term && this.afftype == 3) {
        var list = this.affirmForm.list.filter(
          item => item.affirm_term_number === this.formInline.term
        );
        return list;
      }
      if (this.courseChecked) {
        var list = this.affirmForm.list.filter(
          item => item.is_course_grade == 1
        );
        return list;
      }  
      return this.affirmForm.list;
    }
  },
  methods: {
    // 课程认定提交（也就是发布）
    handlePublic() {
      // 课程认定确定提交(暂存)
      this.affirmForm.submitType = 1;
      if (this.affirmForm.list.length < 1) {
        this.$message.warning("没有待认定的课程，请先添加");
        return;
      }
      let params = {
        modifiedId: this.affirmFormBack.modifiedId,
        presentGrade: this.affirmFormBack.presentGrade,
        presentMajorId: this.affirmFormBack.presentMajorId,
        presentMajorName: this.affirmFormBack.presentMajorName,
        stuName: this.affirmFormBack.stuName,
        stuNum: this.affirmFormBack.stuNum,
        submitType: this.affirmForm.submitType,
        list: []
      }
      this.affirmFormBack.list.map( item => {
        params.list.push({
          affirmCourseId: item.affirm_course_id,
          affirmCourseName: item.affirm_course_name,
          affirmCourseScore: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          affirmTermNumber: item.affirm_term_number,
          affirm_bktimes: (item.affirm_bktimes === '' || item.affirm_bktimes ==  null) ? null : Number(item.affirm_bktimes),
          affirm_stage_bkgrade: (item.affirm_stage_bkgrade === '' || item.affirm_stage_bkgrade ==  null) ? null : Number(item.affirm_stage_bkgrade),
          affirm_stage_grade: (item.affirm_stage_grade === '' || item.affirm_stage_grade ==  null) ? null : Number(item.affirm_stage_grade),
          affirm_term_id: item.affirm_term_id,
          formerCourseId: item.former_course_id,
          formerCourseName: item.former_course_name,
          formerCourseScore: item.former_course_grade,
          formerTermNumber: item.former_term_number,
          id: this.affirmFormBack.id,
          isPublish: item.is_public,
          is_course_grade: item.is_course_grade,
          semesterId: item.semester_id,
          semesterName: item.semester_name,
          termName: item.former_course_name,
          termNumber: item.former_term_number,
          affirm_course_grade: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          remark: item.remark,
        })
      })
      this.$http
        .post(`_op:/modified/courseaffirm/addBatch`, params)
        .then(res => {
          if (res.code == 0) {
            // this.$message.success("课程提交成功");
            this.dialog.tipAffirmVisible = false;
            // this.dialog.affirmVisible = false;
            this.$http.post('_sc:/modified/courseaffirm/submitCourseAffirm',{
              modified_id: this.affirmFormBack.modifiedId,
              user_id: 0
            }).then( res => {
              if(res.data == '' || res.data == null) {
                this.dialog.affirmVisible = false;
                this.$http.get(`_op:/modified/courseaffirm/modifyStatus/${this.affirmFormBack.modifiedId}`).then( res => {
                  this.handleAffirm(this.clickModified)
                })
              }else {
                this.$message({
                  type: 'error',
                  message: res.data,
                  duration: 8000,
                  showClose: true
                })
              }
            })
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getTableData() {
      // let temp = this.$route.params.tableData
      // this.gradeList = temp.filter( item => {
      //   if(item.type == 3 || item.type == 10 || item.type == 6 || item.type == 9){
      //     return true
      //   }else{
      //     return false
      //   }
      // })
      this.$http.get("_op:/modified/beachCourseAffirmSelect").then( res => {
        if(res.code == 0) {
          this.gradeList = res.data
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    changeTerm(id,idx){
      this.affirmFormBack.list[idx].affirm_course_id = null
      this.affirmForm.list[idx].affrimCourseLists = this.affrimCourseListsBack.filter( item => {
        return item.stage == id
      })
      this.changeCourse(idx)
    },
    changeCourse(idx,val,num){
      if(this.$refs['ipt1'+idx]){
        this.affirmFormBack.list[idx].affirm_stage_grade = null
      }
      if(this.$refs['ipt2'+idx]){
        this.affirmFormBack.list[idx].affirm_stage_bkgrade = null
      }
      if(this.$refs['ipt3'+idx]){
        this.affirmFormBack.list[idx].affirm_bktimes = null
      }
      if(this.$refs['ipt4'+idx]){
        this.affirmFormBack.list[idx].affirm_course_grade = null
      }
      if(this.$refs['ipt5'+idx]){
        this.affirmFormBack.list[idx].remark = null
      }
      this.affrimCourseLists.map( item => {
        if(item.course == val && item.stage == num){
          this.affirmFormBack.list[idx].affirm_course_name = item.course_name
          this.affirmFormBack.list[idx].affirm_term_id = item.term_id
          if(item.is_course_grade == 1 && this.$refs['ipt9'+idx] && this.affirmFormBack.list[idx].is_public == 0 && this.affirmFormBack.list[idx].can_modify == 1) {
            this.$nextTick( () => {
              this.$refs['ipt9'+idx].disabled  = false
            })
          }else {
            this.$nextTick( () => {
              this.$refs['ipt9'+idx].disabled  = true
            })
          }
        }
      })
    },
    showDetail(row, column, event) {
      this.handleAffirm(row)
      this.clickModified = row
    },
    // 课程认定 (注：批量增加学生认定课程)   发布时先获取该详情
    handleAffirm(modified) {
      this.tableLoading = true
      this.afftype = modified.type;
      this.modifiedId = modified.id;
      this.getmodifiedType(modified.type);
      this.affirmForm.submitType = 1
      this.$http.post('_sc:/modified/courseaffirm/queryCourseList',{
        grade: modified.present_grade,
        major_id: modified.present_majorid
      }).then( res => {
        if(res.code == 0){
          this.affrimCourseLists = res.data
          this.affrimCourseListsBack = JSON.parse(JSON.stringify(res.data))
          let param = {}
          if(this.afftype == 3){
            param = {
              affirm_course_grade: modified.present_grade,
              affirm_course_major: modified.present_majorid,
              term_id: '',
              modified_id: modified.id,
              type: modified.type
            }
          }else{
            param = {
              affirm_course_grade: modified.present_grade,
              affirm_course_major: modified.present_majorid,
              term_id: '',
              student_no: modified.stu_num,
              modified_id: modified.id,
              type: modified.type
            }
          }
          this.$http.post('_sc:/modified/courseaffirm/queryDetail',param).then( res => {
            this.tableLoading = false
            if(res.code == 0){
              this.affirmForm.stuNum = modified.stu_num
              this.affirmForm.majorName = modified.present_majorname
              this.affirmForm.presentMajorId = modified.present_majorid
              this.affirmForm.stuName = modified.stu_name
              this.affirmForm.presentMajorName = modified.present_majorname
              this.affirmForm.presentGrade = String(modified.present_grade)
              this.affirmFormlist = res.data
              this.affirmForm.modifiedId = modified.id;
              this.affirmForm.list = res.data
              this.affirmForm.id = modified.id
              this.affirmFormBack = JSON.parse(JSON.stringify(this.affirmForm))
              this.affirmForm.list.map( item => {
                item.affrimCourseLists = this.affrimCourseLists
              })
    
              // this.getAffirmCourseList();
            }else{
              this.$message.error(res.msg);
            }
          })
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    // 课程认定确定提交(暂存)
    affirmSubmit() {
      this.affirmForm.submitType = 1;
      if (this.affirmForm.list.length < 1) {
        this.$message.warning("没有待认定的课程，请先添加");
        return;
      }
      let params = {
        modifiedId: this.affirmFormBack.modifiedId,
        presentGrade: this.affirmFormBack.presentGrade,
        presentMajorId: this.affirmFormBack.presentMajorId,
        presentMajorName: this.affirmFormBack.presentMajorName,
        stuName: this.affirmFormBack.stuName,
        stuNum: this.affirmFormBack.stuNum,
        submitType: this.affirmFormBack.submitType,
        list: []
      }
      this.affirmFormBack.list.map( item => {
         params.list.push({
          affirmCourseId: item.affirm_course_id,
          affirmCourseName: item.affirm_course_name,
          affirmCourseScore: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          affirmTermNumber: item.affirm_term_number,
          affirm_bktimes: (item.affirm_bktimes === '' || item.affirm_bktimes ==  null) ? null : Number(item.affirm_bktimes),
          affirm_stage_bkgrade: (item.affirm_stage_bkgrade === '' || item.affirm_stage_bkgrade ==  null) ? null : Number(item.affirm_stage_bkgrade),
          affirm_stage_grade: (item.affirm_stage_grade === '' || item.affirm_stage_grade ==  null) ? null : Number(item.affirm_stage_grade),
          affirm_term_id: item.affirm_term_id,
          formerCourseId: item.former_course_id,
          formerCourseName: item.former_course_name,
          formerCourseScore: item.former_course_grade,
          formerTermNumber: item.former_term_number,
          id: this.affirmFormBack.id,
          isPublish: item.is_public,
          is_course_grade: item.is_course_grade,
          semesterId: item.semester_id,
          semesterName: item.semester_name,
          termName: item.former_course_name,
          termNumber: item.former_term_number,
          affirm_course_grade: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          remark: item.remark,
        })
      })
      this.$http
        .post(`_op:/modified/courseaffirm/addBatch`, params)
        .then(res => {
          if (res.code == 0) {
            this.$message.success("课程暂存成功");
            this.dialog.affirmVisible = false;

          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 发布课程认定获取该课程id的详情
    handlePublishCourse() {
      this.dialog.tipAffirmVisible = true;
      // this.$http
      //   .get(`_op:/modified/courseaffirm/getDetail/${this.modifiedId}`)
      //   .then(res => {
      //     let statusArr = [];

      //     for (var i = 0; i < res.data.list.length; i++) {
      //       statusArr.push(res.data.list[i].isPublish);
    
      //     }

      //     if (statusArr.length < 1) {
      //       this.$message.warning("没有待认定的课程，请先添加");
      //       return false;
      //     }

      //     if (this.affirmForm.list.length > res.data.list.length) {
      //       this.$message.warning("新增的认定课程请先暂存再提交");
      //       return false;
      //     }
      //     if (!(statusArr.indexOf(0) > -1)) {
      //       this.$message.warning(
      //         "当前学生的认定课程已发布过，暂时不需要再发布"
      //       );
           
      //       return false;
      //     }
      //     this.dialog.tipAffirmVisible = true;
      //   });
    },
    getmodifiedType(type) {
      if (type == 2) {
        this.affirmVisibletitle = "院内转出";
      } else if (type == 3) {
        this.affirmVisibletitle = "院外转入";
      } else if (type == 4) {
        this.affirmVisibletitle = "休学";
      } else if (type == 5) {
        this.affirmVisibletitle = "退学";
      } else if (type == 6) {
        this.affirmVisibletitle = "降级";
      } else if (type == 7) {
        this.affirmVisibletitle = "";
      } else if (type == 8) {
        this.affirmVisibletitle = "";
      } else if (type == 9) {
        this.affirmVisibletitle = "复学";
      } else if (type == 10) {
        this.affirmVisibletitle = "院内转专业";
      } else if (type == 11) {
        this.affirmVisibletitle = "转班";
      } else if (type == 12) {
        this.affirmVisibletitle = "保留学籍";
      }
    },
    gradeBack() {
      this.$router.push({
        name: 'school_rool_change'
      })
    }
  }
}
</script>
<style scoped>
.gradeIde{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.cm-table{
  padding: 20px 20px 0 20px;
  width: 100%;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.grade-list{
  width: 13%
}
.grade-table{
  width: 85%;
  height: 800px;
  border: 1px solid #EBEEF5;
  overflow: auto;
}
.grade-table .el-form-item{
      margin-bottom: 4px;
}
</style>