<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form size="mini" :inline="true" :model="evaluate">
         <div class="fold">
         	<div class="formDetail">
         	  <el-form-item label="所在级">
				      <el-select v-model="evaluate.grade" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
			      </el-form-item>

            <el-form-item label="专业">
              <el-select v-model="evaluate.majorId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="测评方案">
              <el-select v-model="evaluate.schemeId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学年">
              <el-select v-model="evaluate.semesterYear" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item>
              以下学生不参加测评
              <el-checkbox v-model="evaluate.requiredFailedFlag">必修课不及格者</el-checkbox>
            </el-form-item>
            <!-- <el-form-item>
              <el-button plain>导出结果</el-button>
            </el-form-item> -->
			      <el-form-item>
				      <el-button type="primary" @click="onEvaluation">测评</el-button>
			      </el-form-item>
         	</div>
         </div>
      </el-form>
    </div>

    <div class="cm-table">
      <el-table 
        :data="tableData" 
        height="600"
        border 
        style="width: 100%; margin-top: 20px" size="mini" 
        :header-cell-style="getRowClass"
        header-row-class-name="cm-dark"
        v-loading="tableLoading"
        element-loading-text="加载中……"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-table-column v-for="(item,index) in tableList" :key='index' :prop="item.prop" :label="item.label" :width="item.width">
        </el-table-column>
      </el-table>
    </div>

  </section>
</template>

<script>
    import util from '@/util'
    const TYPE='academicyear_comprehensive_teacher';
    const REMARK='学年综合测评(老师查询)';

    export default {
      name: TYPE,
      data() {
        return {
          type:REMARK,
          breadcrumb: [
            {label: "成绩管理"},
            {label: REMARK},
          ],
          checked: true,
          formLabelWidth: '60px',
          evaluate: {
            administrativeClassId: [],
            evaluationType: 0,
            grade: 32,
            majorId: '',
            requiredFailedFlag: false,  //必修课不及格者复选框：0-勾选，1-未勾选
            schemeId: '',
            semesterYear: ''
          },
          gradeOptions: [], //所在级
          majorIdOptions: [], //专业ID
          schemeIdOptions: [], //测评方案ID
          semesterYearOptions: [], //学年
          administrativeClassIdOptions: [], //行政班ID
          options: [
            {value: '选项1', label: '黄金糕'}, 
            {value: '选项2', label: '双皮奶'}
          ],
          tableLoading:false,
          tableData: [],
          tableList: [
            {label:'学号', prop:'studentId'},
            {label:'姓名', prop:'name'},
            {label:'行政班', prop:'remark'},
            {label:'排名', prop:'ranking', width:120},
            {label:'成绩', prop:'grade'},
            {label:'智育', prop:'intellectual', width:120},
            {label:'德育', prop:'moral'},
            {label:'体育', prop:'physical'}
          ],
        }
      },
      mounted(){
        util.resize(this);
        window.onresize=()=>{
          util.resize(this);
        };
      },
      methods: {
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#EFEFEF'
          } else {
            return ''
          }
        },
        onEvaluation () {
        },
        getTermData () {
          this.$http.post('_op:/evaluation/evaluate',{
            //TODO:
            evaluationType: this.evaluate.evaluationType
            //FIXME:
          })
        }
      } 
    }	
</script>

<style scoped lang="less">
.pull-right{
  text-align: right;
  margin-right: 10px;
}
</style>