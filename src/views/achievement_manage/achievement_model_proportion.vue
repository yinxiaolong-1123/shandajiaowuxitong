<template>
    <section class="cm-container" >
        <div class="cm-breadcrumb" id="app">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline">
                <div class="fold">
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                        <el-form-item class="cm-collapse" v-show="fold.showBtn">
                          <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item>
                        {{formInline.majorName }}
                        <el-form-item label="专业">
                            <el-select 
                                v-model="formInline.majorName "
                                clearable
                                filterable
                                remote
                                @change="onSelectChange" 
                                :remote-method="getMajorList" 
                                placeholder="全部">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                         <el-form-item label="所在级">
                            <intelligent-year-picker style="width: 100%;"
                                v-model="formInline.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>
                        <el-form-item label="课程">
                            <el-select v-model="formInline.courseName " filterable placeholder="全部">
                                <el-option label="全部" value="-1"></el-option>
                                <template  v-for="(list,index) in courseArrangeList" :keys="index">
                                    <el-option v-for="(cour,iindex) in list.teachTaskCourseList" :key="`${index}_${iindex}`" :label="cour.name" :value="cour.courseId"></el-option>
                                </template>
                            </el-select> 
                        </el-form-item>
                           <el-form-item >
                            <el-checkbox-group   v-model="formInline.type">
                            <el-checkbox label="权重与比例维护不完整" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                       
                    </div>
                    <div class="btn" >
                        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="cm-btn-con cm-btn-others">
            <el-button size="mini" type="primary" @click="preservation">保存</el-button>
            <el-button size="mini" type="primary" @click="closePage">关闭</el-button>
        </div>
        <!--<div class="cm-table">
          <template v-for="(item, index) in tableData8">
            <el-table
              :data="item.stages"
              :span-method="objectSpanMethod"
              border
              :key="index"
              :show-header="index==0?true:false"
            >
            <el-table-column label="序号" >
              <template slot-scope="scope">
                {{index+1}}
              </template>
            </el-table-column>
            <el-table-column label="专业" prop="majorName"></el-table-column>
            <el-table-column  label="所在级" prop="grade"></el-table-column>
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column  label="阶段" prop="stage"></el-table-column>
            <el-table-column  label="权重" prop="stageWeight"></el-table-column>
            <el-table-column  label="成绩类型" prop="scoreType">
              <template slot-scope="scope" >
                 <div v-for="(list,index) in scope.row.scoreType" class="cores" style="border:solid 1px #f5f7fa;line-height: 40px;">
                    {{list.name}}
                 </div>
              </template>
            </el-table-column>
            <el-table-column  label="比例" prop="proportionList">
              <template slot-scope="scope" >
                 <div v-for="(list,index) in scope.row.scoreType" class="cores" style="border:solid 1px #f5f7fa;line-height: 40px;">
                    <el-input v-model="list.proportion"  @change="OnBlurEvent(")></el-input>

                 </div>
              </template>
            </el-table-column>
            </el-table>
          </template>-->

			<div class="cm-table">

<!-- 
            <table class="stationtable">
		        	<tr>
		        		<th  ref="mycol1">序号</th>
		        		<th  ref="mycol2">专业</th>
		        		<th  ref="mycol3">所在级</th>
		        		<th  ref="mycol4">课程名称</th>
		        		<th  ref="mycol5">阶段</th>
		        		<th  ref="mycol6">权重</th>
		        		<th  ref="mycol7">成绩类型</th>
		        		<th  ref="mycol8">比例</th>
		        	</tr>
		        </table> -->
	             <table class="stationtable">
		        	<tr>
		        		<th :width="xh">序号</th>
		        		<th :width="zy">专业</th>
		        		<th :width="szj">所在级</th>
		        		<th :width="kcmc">课程名称</th>
		        		<th :width="jd">阶段</th>
		        		<th :width="qz">权重</th>
		        		<th :width="cjlx">成绩类型</th>
		        		<th :width="bi">比例</th>
		        	</tr>
		        	<template v-for="(item1,index1) in tableData8" >
			        	<tr>
			        		<td :rowspan="item1 | lengthFn">{{index1+1}}</td>
			        		<td :rowspan="item1 | lengthFn">{{item1.majorName}}</td>
			        		<td :rowspan="item1 | lengthFn">{{item1.grade}}</td>
			        		<td :rowspan="item1 | lengthFn">{{item1.courseName}}</td>
			        		<td :rowspan="item1.stages[0].scoreType.length+1">{{item1.stages[0].stage}}</td>
			        		<td :rowspan="item1.stages[0].scoreType.length+1">{{item1.stages[0].stageWeight}}</td>
			        	</tr>
			        	<tr v-for="(item2,index2) in item1.stages[0].scoreType">
			        		<td style="height: 41.11px;">
                      <el-checkbox  @click="check('b'+index2+item1.courseId+item1.stage)" v-model="checked['b'+index2+item1.courseId+item1.stage]">
                        {{item2.name}}
                      </el-checkbox> 
                  </td>
			        		<td>
                     <div style="width:85%;margin: 0 auto" >
                        <el-input v-if="checked['b'+index2+item1.courseId+item1.stage]" v-model="item2.proportion" placeholder="请输入内容"></el-input>
                      </div>
                      
                  </td>
			        	</tr>
			        	<template v-for="(item2,index2) in item1.stages" v-if="index2!=0">
				        	<tr>
				        		<td :rowspan="item2.scoreType.length+1">{{item2.stage}}</td>
				        		<td :rowspan="item2.scoreType.length+1">{{item2.stageWeight}}</td>
				        	</tr>
				        	<tr v-for="(item3,index3) in item2.scoreType">
				        		<td   style="height: 41.11px;">
                       <el-checkbox @click="check('a'+index3+item1.courseId+item2.stage)" v-model="checked['a'+index3+item1.courseId+item2.stage]"> {{item3.name}}</el-checkbox>
                     
                    </td>
				        		<td>
                        <div style="width:85%;margin: 0 auto" >
                          <el-input  v-if="checked['a'+index3+item1.courseId+item2.stage]"  v-model="item3.proportion" placeholder="请输入内容"></el-input>
                        </div>
                      
                    </td>
				        	</tr>
			        	</template>
		        	</template>
		        </table>
           	</div>
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
                @current-change="currentChange">
            </el-pagination>
        </div>
       
    </section>
</template>

<script>

import Vue from "vue";
import util from "@/util";
const TYPE = "class-management";
const REMARK = "上课班管理";

import { mapState } from "vuex";
// let app =(new Vue({
//   el:"#app",
//   data:{
//     box:false
//   }
// }))

export default {
  data() {
    return {
      checkList:[

      ],
      radio2:3,
      checked: [],
      arr:[
        {a:10},
        {a:20},
        {a:30},
        {a:40},
      ],
      tableData8:[],
     
      box1:false,
      box2:false,
      box3:false,
      box4:false,
      dateList:[],
      tableData6: [],
      tableData7:[],
    
      tableData:{
        courseId:"",
        courseName:"",
        majorId:"",
        stages:"",
        termId:"",
        termIds:"",

        majorName:"",
        grade:"",
        stage:"",
        weight:"",
        achievementType:"",
        proportion:"",
      },
      newSize: [],
      breadcrumb: [{ label: "成绩管理" }, { label: "成绩模型权重比例" }],
      dialog: {
        status: "add",
        remark: false,
        visible: false
      },
      options1: [],
      formInline: {
        grade:"",//所在级
        courseName: "",//课程
        majorName: ""//专业
      },
    
      tableList: [
        { label: "上课班名称", prop: "name", width: 180 },
        { label: "学期", prop: "semester_name", width: 180 },
        { label: "排课课程", prop: "course_namelist", width: 220 },
        { label: "教学模式", prop: "teaching_mode" },
        { label: "学生数", prop: "student_num" },
        { label: "状态", prop: "status" },
        { label: "创建人", prop: "create_username" },
        { label: "创建日期", prop: "create_time", width: 140 }
      ],
     
      tableData: [],
      teachTypeList: [{ name: "普通教学", id: 0 }, { name: "全英教学", id: 1 }],
      addColumn: [{ id: "" }],
      tableLoading: false,
      myDate: new Date(),
      courseArrangeList: [],
      formYear: "",
      fallYear: "",
      semesterNum: "",
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      tableHandle: {
        status: "",
        dest: "",
        url: ""
      },
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      CourseClass: "",
      userId: util.getStorage("loginId"),
      userName: util.getStorage("loginName"),
      xh:'',
      zy:'',
      szj:'',
      kcmc:'',
      qz:'',
      cjlx:'',
      bl:'',
      


    
    };
  }, 
  created() {
    this.getTableList();//按方案维护列表
    this.getMajorList();//专业数据请求
    this.getCourseArrange();
       this.$nextTick(()=>{
        this.xh=this.$refs.mycol1.offsetWidth-1;
        this.zy=this.$refs.mycol2.offsetWidth-1;
        this.szj=this.$refs.mycol3.offsetWidth-1;
        this.kcmc=this.$refs.mycol4.offsetWidth-1;
        this.jd=this.$refs.mycol5.offsetWidth-1;
        this.qz=this.$refs.mycol6.offsetWidth-1;
        this.cjlx=this.$refs.mycol7.offsetWidth-1;
        this.bl=this.$refs.mycol8.offsetWidth-1;
      })
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
      this.$nextTick(()=>{
        this.xh=this.$refs.mycol1.offsetWidth-1;
        this.zy=this.$refs.mycol2.offsetWidth-1;
        this.szj=this.$refs.mycol3.offsetWidth-1;
        this.kcmc=this.$refs.mycol4.offsetWidth-1;
        this.jd=this.$refs.mycol5.offsetWidth-1;
        this.qz=this.$refs.mycol6.offsetWidth-1;
        this.cjlx=this.$refs.mycol7.offsetWidth-1;
        this.bl=this.$refs.mycol8.offsetWidth-1;
      })
    };
  },
  filters: {
    getTime(time) {
      return util.getTime(time);
    },
    lengthFn(item){
      
    	let itemlength=0;
    	item.stages.map(itemstage=>{
        
        if(itemstage.scoreType.length){
          itemlength+=itemstage.scoreType.length+1;
        }
        
        
        
    	})
   
    	return itemlength
    }
  },
  methods: {
        check(val){
          let self = this
           self.checked[val]=!self.checked[val];
        },

     //     按方案维护  获取列表
            getTableList(){
                this.tableLoading=true;
               
                let  grade = 2018;
                let major_id = 59;
                let url = "_ed:/trainplan/course/detail/grade/"+grade+"/major/"+major_id
             
               this.$http.get(url).then(data=>{
                      this.tableData8 = data.data
                      
                      this.tableLoading=false;
           
                }).catch(()=>{
                      this.tableLoading=true;
                    
                })
            },
     // 专业数据获取
        getMajorList(){
          this.$http.get('_op:/major/combox')
          .then(data=>{
            if(data.code==0){
                this.options1 = data.data;
            }else{
              this.$message.error(data.msg);
            }
          })
        },
         // 课程数据请求
        getCourseArrange() {
          this.$http
            .post("_ed:/semestercourse/list/detail", {
              semester_year: this.fallYear,
              semester_year_number: this.semesterNum
            })
            .then(data => {
              if (data.code == 0) {
                this.courseArrangeList = data.data;
                for (let list of this.courseArrangeList) {
                  if (list.teachTaskCourseList) {
                    for (let item of list.teachTaskCourseList) {
                      let house = `${item.semester_theory_hours}/${
                        item.semester_novitiate_hours
                      }`;

                      this.$set(
                        item,
                        "name",
                        `${item.course_name}（${item.major}，${house}）`
                      );
                      this.$set(item, "courseId", list.id);
                    }
                  }
                }
              } else {
                this.$message.error(data.msg);
              }
            });
        },
        //  表格合并   
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex  <4) {
            if (rowIndex === 0) {
              return {
                rowspan: 6,
                colspan: 1
              };
            }else{
                return {
                  rowspan: 0,
                  colspan: 0
                };
            }
          }
        },
    // 展开数据
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    // 显示条数
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getTableList();
    },
    // 翻页
    currentChange(current) {
      this.pageNo = current;
      this.getTableList();
    },
    // 获取专业数据的id
    onSelectChange(_id) {
 
    },
    //查询
    onSearch() {
      this.getTableList("search");
    },
    // 保存
    preservation(){

    },
    //关闭页面
    closePage(){
      this.$router.push({path: "/achievement_manage/curriculum_model_definition",});
    },
      
    // //  请求列表数据
    // getTableList(val) {
    //   this.tableLoading = true;
    //   let option = {
    //     request_page: this.pageNo,
    //     page_size: this.pageSize
    //   };
    //   if (val == "search") {
    //     option = {
    //       // teaching_mode:this.formInline.teach,
    //       semester_course_id: this.formInline.courseId,
    //       request_page: this.pageNo,
    //       page_size: this.pageSize,
    //       semester_year: this.fallYear,
    //       semester_year_number: this.semesterNum
    //     };
    //   }
    //   this.$http({
    //     method: "post",
    //     url: "_ed:coursecls/query",
    //     data: {
    //       ...option
    //     }
    //   })
    //     .then(data => {
    //       if (data.code == 0) {
    //         this.tableLoading = false;
    //         (this.newSize = data.data.dataList.length),
    //           (this.totalCount = data.data.total_records);
    //         this.tableData = data.data.dataList;
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     })
    //     .catch(error => {
    //       this.tableLoading = false;
    //     });
    // },
  },
  computed: {
    _upload_data() {
      return {
        _upload_data: JSON.stringify({
          create_user: this.userId,
          create_username: this.userName
        })
      };
    }
  }
};
</script>
<style scoped  lang="less">
.cores{
    border: solid 1px red;
    line-height: 40px;
}
.stationtable{
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
	}
	.bluetext{cursor: pointer;color: #409EFF;font-size: 10px;}
}
.table {
  width: calc(100% - 86px) !important;
  border: solid 1px lightgray;
}
.addClass > div {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.addClass div label {
  width: 88px;
  margin-left: 14px;
}
.table > thead > tr > th {
  padding: 8px;
  vertical-align: bottom;
  border: 1px solid #ddd;
  border-bottom: 2px solid #ddd;
  background-color: #f7f7f7;
}
.table > tbody > tr > td {
  padding: 8px;
  border: 1px solid #ddd;
}
.addClass /deep/ .el-select {
  width: 100%;
}
.addClass /deep/ .el-input--small .el-input__inner {
  height: 40px;
}
.el-form /deep/ .flex-form.el-form-item .el-form-item__label {
  min-width: 100px;
}
</style>



