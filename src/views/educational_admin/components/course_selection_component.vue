<template>
  <div class="container">
    <div class="top-selection">
      <el-form :model="selectionForm" label-width="70px" ref="selectionForm" :inline="true">
        <el-form-item 
          label=""
        >
          <el-select
            v-model="selectionForm.region"
            placeholder="请选择课程类别"
            @change="onCourseKindSelected"
            value-key="id"
            :disabled="regionDisabled"
            clearable
          >
            <el-option
              v-for="option in categoryOption"
              :key="option.id"
              :label="option.name"
              :value="option"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="" >
          <el-input v-model="courseSearchKeyword" @input="filterCourse" placeholder="请输入课程名称" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="transfer" style="display:flex;width: 100%">
      <div class="left-selection" style="flex:1;">
        <span>可选专业课程</span>
        <div class="table-wrapper">
          <el-table
            style="overflow-y: auto; "
            height="410"
            tooltip-effect="dark" 
            :data="selectableCourses"
            @selection-change="handleCourseSelection"
          >
            <el-table-column type="selection"  ></el-table-column>
            <el-table-column label="课程" prop="name"  ></el-table-column>
            <el-table-column label="类别"  >
              <template slot-scope="scope">
                {{scope.row.categoryId | showCategoryName(categoryOption)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="middle-command" style="width:100px;text-align:center;">
        <el-button :disabled="appendButtonDisabled"   @click="appendSelected" size="mini">
          增加
          <i class="el-icon-d-arrow-right"></i>
        </el-button>
        <br>
        <el-button :disabled="removeButtonDisabled" style="margin-top:10px;" @click="removeSelected" size="mini">
          <i class="el-icon-d-arrow-left"></i>删除
        </el-button>
      </div>

      <div class="right-selection" style="flex:1;">
        <span>已选课程</span>
      
        <div class="table-wrapper">
          <template v-if="hasSelectedCourses()">
            <el-collapse style="width: 100%;height: 400px; overflow-y: auto;" v-model="activedName">
              <el-collapse-item
                v-for="(item, index) in selectedCourses"
                :key="index"
                :name="item.id"
              >
                <template slot="title">
                  <el-checkbox
                    @change="handleChange($event, item,index)"
                    v-model="item.checked"
                  >{{item.name}}</el-checkbox>
                </template>
                <ul style="margin-left: 28px;">
                  <li v-for="(course, index) in item.selectedCourses" :key="index">
                    <el-checkbox
                      @change="checkItem($event, course,index,item)"
                      v-model="course.checked"
                    >{{course.name}}</el-checkbox>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </template>
          <template v-else>
            <span style="color: #909399;">暂无数据</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "course-selection",

  props: {
    grade: {
      value: Number,
      default: 0
    },
    majorId: {
      value: Number,
      default: 0
    },
    planId: {
      value: Number,
      default: -100
    }
  },

  watch: {
    grade: {
      immediate: true,
      handler(val) {
        if (this.grade == 0 || this.majorId == 0) {
          this.regionDisabled = true;
        } else {
          this.regionDisabled = false;
        }
      }
    },
    majorId: {
      immediate: true,
      handler(val) {
        if (this.grade == 0 || this.majorId == 0) {
          this.regionDisabled = true;
        } else {
          this.regionDisabled = false;
        }
      }
    }
  },

  data() {
    return {
      courseSearchKeyword: '',
      regionDisabled: true,
      activedName: [],
      courses: [],
      categoryOption: [],
      tempSelectedCourses: [],
      selectionForm: {
        region: {
          id: "",
          name: "",
          selectedCourses: []
        }
      }
    };
  },

  created() {
    this.fetchCourseType();
    if (this.grade == 0 || this.majorId == 0) {
      this.regionDisabled = true;
    } else {
      this.regionDisabled = false;
    }
    this.getCoursePlatform();
  },

  mounted() {},

  filters: {
    showCategoryName(val, arrs) {
      var item = arrs.filter(c => c.id == Number(val));
      if (item.length <= 0) return "未知";
      return item[0].name;
    }
  },

  computed: {
    appendButtonDisabled() {
      return this.tempSelectedCourses.length == 0;
    },

    removeButtonDisabled() {
      let self = this;
      let result = true;
      for (let i = 0; i < self.selectedCourses.length; i++) {
        for (let j = 0; j < self.selectedCourses[i].selectedCourses.length; j++)
          if (self.selectedCourses[i].selectedCourses[j].checked) {
            result = false;
          }
      }

      return result;
    },

    selectableCourses() {
      var list = this.courses.filter(course => {
        for (var i = 0; i < this.categoryOption.length; i++) {
          var category = this.categoryOption[i];
          if (category.selectedCourses != null && category.selectedCourses.length > 0) {
            var count = category.selectedCourses.filter(sc => sc.id == course.id).length;
            if (count > 0) return false;
          }
        }
        return true;
      });
      return list;
    },

    selectedCourses() {
      var arr = [];
      for (var i = 0; i < this.categoryOption.length; i++) {
        if (
          this.categoryOption[i].selectedCourses &&
          this.categoryOption[i].selectedCourses.length > 0
        ) {
          arr.push(this.categoryOption[i]);
        }
      }
      return arr;
    }
  },

  methods: {
    reset() {
      this.courseSearchKeyword = null;
      if (this.$refs.selectionForm) {
        this.$refs.selectionForm.resetFields();
        this.selectionForm.region = {
          id: "",
          name: "",
          selectedCourses: []
        };
      }
      if (this.categoryOption && this.categoryOption.length > 0) {
        this.categoryOption.forEach(c => {
          if (c.selectedCourses) {
            c.selectedCourses.splice(0, c.selectedCourses.length);
          }
        });
      }
      this.getCoursePlatform();
     
    },

    refresh() {
      if (this.categoryOption) {
        this.categoryOption.push("");
        this.categoryOption.pop();
      }

      if (this.courses) {
        this.courses.push("");
        this.courses.pop();
      }
    },

    // 根据课程名称过滤课程
    filterCourse() {
      let selectedRegion = {
        id: '',
        name: '',
        selectedCourses: [],
      };
      const key = this.courseSearchKeyword;
      this.selectionForm.region = selectedRegion;
      this.getCoursePlatform(function(data) {
        return data.filter(c => (c.name.indexOf(key) != -1));
      });
    },

    onCourseKindSelected(val) {
      if (val == null) {
        var selected = {
          id: "",
          name: "",
          selectedCourses: []
        };
        this.selectionForm.region = selected;
      } else {
        if (!val.selectedCourses) {
          val.selectedCourses = [];
        }
      }
      this.getCoursePlatform();
    },

    handleCourseSelection(val) {
      this.tempSelectedCourses = val;
    },

    handleChange(val, item) {
      item.selectedCourses.forEach(record => {
        record.checked = item.checked;
      });

      // this.categoryOption.push("");
      // this.categoryOption.pop();
    },
    //选择右侧选项    删除按钮控制  课程选中，  删除true
    checkItem(e, item, index, parentItem) {
      let selected = false;
      parentItem.selectedCourses.forEach(record => {
        if (record.checked) {
          selected = record.checked;
        }
      });
      parentItem.checked = selected;
    },

    getCoursePlatform(filter) {
      let self = this;
      let majorId = this.majorId;
      let planId = this.planId;
      let categoryId = this.selectionForm.region.id || "-1";
      if(categoryId != null){
        this.$http
          .get(`_op:/course/getByCategoryId/${categoryId}/${planId}`)
          .then(data => {
            if (data.code == 0) {
              if (filter != null && typeof(filter) === 'function') {
                this.courses = filter(data.data);
              } else {
                data.data.forEach(p => {
                  p.checked = false;
                });
                this.courses = data.data;
              }
            }
          });
        }
    },

    fetchCourseType() {
      this.$http
        .post("_op:/dicts/getDictsList", {
          type: "course-category"
        })
        .then(datas => {
          if (datas.code == 0) {
            this.categoryOption = datas.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(error => {
          this.categoryOption = [];
        });
    },

    appendSelected() {
      //增加从可选课程，添加到已选课程
      this.tempSelectedCourses.forEach(course => {
        this.categoryOption.forEach(category => {
          if (Number(category.id) == Number(course.categoryId)) {
            if (!category.selectedCourses) {
              category.selectedCourses = [];
            }
            category.selectedCourses.push(course);
            category.checked = false;
            if(this.activedName.indexOf(String(category.id)) == -1) {
              this.activedName.push(String(category.id));
            }
          }
        });
      });
      this.tempSelectedCourses = [];
      this.refresh();
      this.raiseOnChange();
      // this.selectionForm.region.selectedCourses = this.selectionForm.region.selectedCourses.concat(
      //   this.tempSelectedCourses
      // );
      // this.selectionForm.region.checked = false;
      // this.activedName.push(String(this.selectionForm.region.id)); //课程类别.等于选中类别
      // this.tempSelectedCourses = [];
      // this.refresh();
      // this.raiseOnChange();
    },
    //删除课程分类
    removeSelected() {
      let self = this;
      self.selectedCourses.forEach(c => {
        let newarray = []; //未选中数组重新赋值，给已选课程
        c.selectedCourses.forEach(item => {
          if (!item.checked) {
            newarray.push(item);
          }
        });

        if (newarray.length == 0) {
          if (c.checked == true) {
            c.selectedCourses = [];
            c.checked = false;
          }
        } else {
          c.selectedCourses = newarray;
          c.checked = false;
        }
      });
      this.refresh();
      this.raiseOnChange();
    },

    hasSelectedCourses() {
      for (var i = 0; i < this.categoryOption.length; i++) {
        if (
          this.categoryOption[i].selectedCourses &&
          this.categoryOption[i].selectedCourses.length > 0
        ) {
          return true;
        }
      }
      return false;
    },

    raiseOnChange() {
      var arr = [];
      for (var i = 0; i < this.categoryOption.length; i++) {
        if (
          this.categoryOption[i].selectedCourses &&
          this.categoryOption[i].selectedCourses.length > 0
        ) {
          this.categoryOption[i].selectedCourses.forEach(c => arr.push(c.id));
          // arr.push(this.categoryOption[i].id);
        }
      }
      this.$emit("onchange", arr);
    }
  }
};
</script>

<style lang="less" scoped>
.el-table__header-wrapper{
  width: 260px;
}
.top-selection{
  padding-left: 20px;
}
.container {
  
  // padding: 0 20px;

  // display: flex;
  

  flex-direction: column;

  .transfer {
    width: 1000px;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: nowrap;
    align-items: center;

    .left-selection {
      width: 430px;
      // flex-grow: 1.3;
    }

    .middle-command {
      // width: 20px;
      // flex-grow: 0.7;
      // width: px;;

      // display: flex;
      display: inline-block;
      flex-direction: column;
      align-items: center;
    }

    .right-selection {
      width: 400px;
      // flex-grow:1.3;
    }

    .table-wrapper {
      height: 420px;
      padding: 8px;
      border: 1px solid #ddd;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      overflow: scroll;
    }
  }
}
</style>