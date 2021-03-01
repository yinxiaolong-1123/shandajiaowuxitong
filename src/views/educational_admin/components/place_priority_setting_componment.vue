<template>
  <div class="container">
    <div>
      <el-form :inline="true" ref="placeForm" :model="placeForm" label-width="96px" size="mini" :rules="placeFormRule">
        <!-- class="flex-form" -->
        <el-form-item label="场地名称" prop="areaName">
          <el-autocomplete ref="placeNameInputer" v-model="placeForm.areaName" :fetch-suggestions="fetchAreas" placeholder="请输入场地名称" @select="handleAreaSelected" :trigger-on-focus="false"></el-autocomplete>
        </el-form-item>
        <el-form-item label="容量" prop="storeGroupNum">
          <el-input v-model.number="placeForm.storeGroupNum" type="number" placeholder="请输入可同时容纳组数"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model.number="placeForm.priority" placeholder="请输入优先级" type="number"></el-input>
        </el-form-item>
        <el-form-item label="场地类型">
          <el-input v-model="placeForm.areaType" :disabled="true" placeholder="场地类型"></el-input>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-input v-model="placeForm.buildName" :disabled="true" placeholder="所属楼栋"></el-input>
        </el-form-item>
        <el-form-item label="校区">
          <el-input v-model="placeForm.campusName" :disabled="true" placeholder="所属校区"></el-input>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="placeForm.manager" :disabled="true" placeholder="管理员"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="appendToTableData()">添 加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-top: 10px">
      <el-table ref="multipleTable" :data="tableData" border size="mini" header-row-class-name="cm-dark">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="场地名称" prop="areaName"></el-table-column>
        <el-table-column label="楼栋" prop="buildName"></el-table-column>
        <el-table-column label="校区" prop="campusName"></el-table-column>
        <el-table-column label="管理员" prop="manager"></el-table-column>
        <el-table-column label="容量" prop="storeGroupNum"></el-table-column>
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
    name: 'place-priority-setting',
    data() {
      return {
        placeForm: {
          areaId: '',
          areaName: '',
          areaType: '',
          buildName: '',
          campusName: '',
          priority: '',
          manager: '',
          storeGroupNum: ''
        },
        placeFormRule: {
          areaName: [{
            required: true,
            message: '请输入场地名称',
            trigger: 'blur'
          }],
          storeGroupNum: [{
            required: true,
            message: '请输入容量',
            trigger: 'blue'
          }],
          priority: [{
            required: true,
            message: '请输入优先级',
            trigger: 'blur'
          }],
        },

        tableData: [],
      }
    },

    components: {

    },

    computed: {

    },

    filters: {},

    created() {
      //   this.queryTeacherNo = this.fnThrottle(this.querySearchAsync, 500);
    },

    mounted() {

    },

    methods: {
      clear() {
        this.tableData.splice(0, this.tableData.length);
        if (this.$refs.placeForm) {
          this.$refs.placeForm.resetFields();
        }
      },

      fetchAreas(val, cb) {
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

      handleAreaSelected(item) {
        this.placeForm.areaName = item.item.areaName;
        this.placeForm.areaType = item.item.areaType;
        this.placeForm.buildName = item.item.buildName;
        this.placeForm.campusName = item.item.campusName;
        this.placeForm.areaId = item.item.id;
      },

      appendToTableData() {
        this.$refs.placeForm.validate((valid) => {
          if (valid) {
            var newPlace = JSON.parse(JSON.stringify(this.placeForm)); // Copy object.
            this.tableData.push(newPlace);
            this.$refs.placeForm.resetFields();
            this.$refs.placeNameInputer.focus();
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