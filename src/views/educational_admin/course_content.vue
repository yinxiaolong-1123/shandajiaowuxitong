<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="item.router">
          {{item.label}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse">
              <!-- <el-button type="primary" size="mini" @click="onSearch">查询</el-button> -->
              <el-button size="mini" @click="handleBackFrom">返回</el-button>
            </el-form-item>
            <el-form-item label="课程">
              <el-input :disabled="true" v-model="this.$route.query.courseName"></el-input>
            </el-form-item>
          </div>

        </div>
      </el-form>
    </div>

    <el-tabs v-model="activeName" style="margin-left:20px"  @tab-click="getDataList">
      <el-tab-pane label="课程内容总库" name="contents">
        <CourseContentTable :courseId="this.$route.query.courseId"   @click="handleClick" :yearId="currentYearId" :courses="courses" :terms="terms" @onchange="handleContentChange" ref="courseContentRef">
        </CourseContentTable>
      </el-tab-pane>
      <el-tab-pane label="专业课程内容库" name="professions">
        <ProfessionCourseContentTable :courseId="this.$route.query.courseId" :terms="terms" :yearId="currentYearId" :platformId="this.$route.query.platformId" :majorName="this.$route.query.majorName" :majorId="this.$route.query.majorIds[0]" ref="platformContentRef">
        </ProfessionCourseContentTable>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  import util from '@/util';
  import CourseContentTable from '@/views/educational_admin/components/course_content_component'
  import ProfessionCourseContentTable from '@/views/educational_admin/components/profession_course_content_component'

  import {
    mapState
  } from 'vuex';

  export default {
    name: "coursse_content",
    components: {
      CourseContentTable,
      ProfessionCourseContentTable
    },
    data() {
      return {
        activeName: 'contents',
        headers: {
          Access_Token: localStorage.getItem('token'),
          Authorization: localStorage.getItem('token')
        },

        currentYearId: '',
        breadcrumb: [{
          label: "教务管理"
        },
        {
          label: "专业课程库",
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
        }],
        fold: {
          state: false,
          text: '展开',
          showBtn: false,
        },
        // 查询条件
        formInline: {
          courseId: '',
          yearId: ''
        },
        // 课程列表
        courses: [],
        // 学期，写死
        terms: [{
          name: '学期一',
          id: 1
        }, {
          name: '学期二',
          id: 2
        }, {
          name: '学期三',
          id: 3
        }, {
          name: '学期四',
          id: 4
        }, {
          name: '学期五',
          id: 5
        }, {
          name: '学期六',
          id: 6
        }, {
          name: '学期七',
          id: 7
        }, {
          name: '学期八',
          id: 8
        }, {
          name: '学期九',
          id: 9
        }, {
          name: '学期十',
          id: 10
        }],
        errorsData: [], //报表错误提示集合
      }
    },

    created() {
      // consoel.log($route.query,'专业')
      this.formInline.courseId = this.$route.query.courseId;
    },

    mounted() {
      util.resize(this);
      window.onresize = () => {
        util.resize(this);
      };
      this.getCourseList();
    },
    watch: {
      '$route': 'watchRoute'
    },

    methods: {
      handleClick() {
       
      },
      getDataList(){
        var date = new Date;
        if(this.activeName == 'professions'){
          // this.$refs.platformContentRef.getContents(this.$route.query.courseId, this.currentYearId, date.getFullYear()+"");
          this.$refs.platformContentRef.refresh();
        }

      },
      replaceUrl() {
        this.searchCourseId = this.formInline.courseId;
        this.searchYearId = this.formInline.yearId;
        // 当清空查询条件时
        if (this.formInline.courseId == '' && this.formInline.yearId == '') {
          this.$router.replace(`/educational_admin/course_content?actionId=89`);
        }
      },
      handleBackFrom() {
        this.$router.go(-1)
        // this.$router.push({
        //   path: '/base_data/course_platform',
        // });
      },
      watchRoute() { // 监听如果查询了
      },

      onYear(val) {
        if (val) {
          for (let list of this.options1) {
            if (list.id == val) {
              this.termId = list.id;
            }
          }
        } else {
          this.termId = "";
        }
      },
      onSearch() {},

      getCourseList() {
        const _this = this;
        this.$http.get("_op:/course/combox")
          .then(data => {
            if (data.code == 0) {
              this.courses = [];
              this.$nextTick(function () {
                _this.courses = data.data;
              });
            } else {
              this.$message.error(data.msg);
            }
          })
      },
      handleContentChange() {
       
        this.$refs.platformContentRef.refresh();
      }
    }
  }
</script>

<style lang="less" scoped>
  .boxStyle {
    padding-right: 10px;
  }

  .hadSet {
    /deep/ span {
      color: #71d585;
    }
  }
</style>
