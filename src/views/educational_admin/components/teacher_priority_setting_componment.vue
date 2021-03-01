<template>
  <div class="container">
    <div>
      <el-form :inline="true" ref="teacherForm" :model="teacherForm" label-width="96px" size="mini" :rules="teacherFormRule">
        <!-- class="flex-form" -->
        <el-form-item label="姓名" prop="teacherNameWithNo">
          <el-autocomplete ref="teacherInput" v-model="teacherForm.teacherNameWithNo" :fetch-suggestions="querySearchAsync" placeholder="请输入姓名" @select="handleSelect" :trigger-on-focus="false"></el-autocomplete>
        
        </el-form-item>
        <el-form-item label="类型" prop="teachingType">
          <el-select v-model="teacherForm.teachingType" placeholder="授课老师类型" style="width: 100%;">
            <el-option label="主授课老师" :value="0"></el-option>
            <el-option label="辅授课老师" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model.number="teacherForm.priority" placeholder="请输入优先级" type="number"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="teacherForm.teacherNo" :disabled="true" placeholder="工号"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="teacherForm.title" :disabled="true" placeholder="职称"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="teacherForm.departmentName" :disabled="true" placeholder="部门"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="appendToTableData()">添 加</el-button>
        </el-form-item>
      </el-form>

    </div>

    <div style="margin-top: 10px">
      <el-table ref="multipleTable" :data="tableData" border size="mini" header-row-class-name="cm-dark">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="工号" prop="teacherNo"></el-table-column>
        <el-table-column label="姓名" prop="teacherName"></el-table-column>
        <el-table-column label="职称" prop="title"></el-table-column>
        <el-table-column label="部门" prop="departmentName"></el-table-column>
        <el-table-column label="类型" prop="teachingType">
          <template slot-scope="scope">{{ scope.row.teachingType | teachingTypeName }}</template>
        </el-table-column>
        <el-table-column label="优先级" prop="priority"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color:red;" @click="deleteRow(scope)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacher-priority-setting',
    data() {
      return {
        teacherForm: {
          teacherNameWithNo: '',
          teacherNo: '',
          teacherName: '',
          title: '',
          departmentName: '',
          teachingType: 0,
          priority: ''
        },
        teacherFormRule: {
          teacherNo: [{
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          }],
          teachingType: [{
            required: true,
            message: '请选择授课老师类型',
            trigger: 'blue'
          }],
          priority: [{
            required: true,
            message: '请输入优先级',
            trigger: 'blur'
          }],
        },

        queryTeacherNo: () => {},
        queryLoading: false,

        tableData: [],
      }
    },

    components: {

    },

    computed: {

    },

    filters: {
      teachingTypeName(value) {
        if (value == 0) {
          return "主授课老师"
        } else {
          return "辅授课老师"
        }
      }
    },

    created() {
      // this.queryTeacherNo = this.fnThrottle(this.querySearchAsync, 500);
    },

    mounted() {

    },

    methods: {
      clear() {
        this.tableData.splice(0, this.tableData.length);
        if (this.$refs.teacherForm) {
          this.$refs.teacherForm.resetFields();
        }
      },

      handleSelect(val) {
      
        this.teacherForm.teacherId = val.item.id;
        this.teacherForm.teacherNo = val.item.teacherNo;
        this.teacherForm.teacherName = val.item.name;
        this.teacherForm.title = val.item.positionName;
        this.teacherForm.departmentName = val.item.departments.map(d => d.name).join(",");
    
      },

      fnThrottle(fn, delay, atleast) {
        let timer = null
        let previous = null
        return function () {
          let now = +new Date()
          if (!previous) previous = now
          if (atleast && now - previous > atleast) {
            fn()
            previous = now
            clearTimeout(timer)
          } else {
            clearTimeout(timer)
            timer = setTimeout(function () {
              fn()
              previous = null
            }, delay)
          }
        }
      },

      querySearchAsync(queryString, cb) {
        if (queryString) {
          let params = {
            pageNo: 1,
            pageSize: 1000,
            param: {
              name: queryString
            }
          }
          this.$http.post(`_op:teachers/list`, params).then(res => {
            var result = [];
            if (Array.isArray(res.data.result) && res.data.result.length > 0) {
              res.data.result.forEach(r => {
                var obj = {};
                obj.value = `${r.name}(${r.teacherNo})`;
                obj.item = r;
                result.push(obj);
              })
            }
            cb(result);
          }).catch(err => {
            console.info(err);
            cb([]);
          });
        }
      },

      appendToTableData() {
        this.$refs.teacherForm.validate((valid) => {
          if (valid) {
            var newTeacher = JSON.parse(JSON.stringify(this.teacherForm)); // Copy object.
            this.tableData.push(newTeacher);
            this.$refs.teacherForm.resetFields();
            this.$refs.teacherInput.focus();
            this.$emit("onchange", this.tableData);
          } else {
            return false;
          }
        })
      },

      deleteRow(row) {
        this.tableData.splice(row.$index, 1);
        this.$emit("onchange", this.tableData);
      }
    }, // methods
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    width: 100%
  }
</style>