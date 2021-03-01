<template>
    <section class="cm-container">
        <div class="cm-breadcrumb" id="app">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" :model="formInline" :rules="rules" ref="formName">
                <div class="fold " >
                    <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
                         <el-form-item label="课程">
                            <el-select v-model="formInline.courseId" filterable clearable placeholder="请选择课程">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="list in courseList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="btn" >
                        <el-button type="primary" size="mini" @click="onSearch()">查询</el-button>
                         <el-button size="mini" type="primary" @click="preservation()">保存</el-button>
                         <el-button size="mini" type="primary" @click="closePage">关闭</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
		<div class="cm-table my-table-box" id="sytleId" >
        <table class="fixed-table-header">
	        	<thead class="station">
              <!-- <tr  class="box1">
                <th  :width="xh1">序号</th>
                <th  :width="zy2">专业</th>
                <th  :width="szj3">所在级</th>
                <th  :width="kcmc4">课程名称</th>
                <th  :width="jd5" >阶段</th>
                <th  :width="qz6">权重</th>
                <th  :width="cjmx7">成绩类型</th>
                <th  :width="bl8">比例</th>
              </tr> -->
            </thead>
	        </table>
        <table class="stationtable">
	        	<thead class="station">
              <tr  class="box1">
                <th  ref="mycol1" >序号</th>
                <th  ref="mycol2" >专业</th>
                <th  ref="mycol3">所在级</th>
                <th   ref="mycol4">课程名称</th>
                <th   ref="mycol5" >阶段</th>
                <th   ref="mycol6">权重</th>
                <th  ref="mycol7" >成绩类型</th>
                <th  ref="mycol8">比例</th>
              </tr>
            </thead>
	        	<template v-for="(item1,index1) in tableData">
		        	<tr>
		        		<td  ref="col1" :rowspan="item1 | lengthFn">{{index1+1}}</td>
		        		<td  ref="col2" :rowspan="item1 | lengthFn">{{item1.majorName}}</td>
		        		<td  ref="col3" :rowspan="item1 | lengthFn">{{item1.grade}}</td>
		        		<td   ref="col4" :rowspan="item1 | lengthFn">{{item1.courseName}}</td>
		        		<td  ref="col5" :rowspan="item1.stages[0].scoreType.length+1">{{item1.stages[0].stage}}</td>
		        		<td ref="col6"  :rowspan="item1.stages[0].scoreType.length+1">
		        			<el-input size="mini" v-model="item1.stages[0].stageWeight" placeholder="请输入权重"></el-input>
		        		</td>
		        	</tr>
		        	<tr v-for="(item2,index2) in item1.stages[0].scoreType">
		        		<td ref="col7" >
		        			<el-checkbox v-model="item2.statu">{{item2.name}}</el-checkbox>
		        		</td>
		        		<td  ref="col7">
		        			<el-input size="mini" :disabled="!item2.statu" v-model="item2.proportion" placeholder="请输入比例"></el-input>
		        		</td>
		        	</tr>
		        	
		        	<template v-for="(item2,index2) in item1.stages" v-if="index2!=0">
			        	<tr>
			        		<td  ref="col8" :rowspan="item2.scoreType.length+1">{{item2.stage}}</td>
			        		<td  ref="col6" :rowspan="item2.scoreType.length+1">
			        			<el-input size="mini" v-model="item2.stageWeight" placeholder="请输入权重"></el-input>
			        		</td>
			        	</tr>
			        	<tr v-for="(item3,index3) in item2.scoreType">
			        		<td  ref="col7">
		        			 	<el-checkbox v-model="item3.statu">{{item3.name}}</el-checkbox>
		        			</td>
			        		<td  ref="col7">
			        			<el-input size="mini" :disabled="!item3.statu" v-model="item3.proportion" placeholder="请输入比例"></el-input>
			        		</td>
			        	</tr>
		        	</template>
		        	
	        	</template>
	        	
	        </table>
       	</div>
       	
       
       
    </section>
</template>

<script>
// window.onload=function(){
// 				 changeDivHeight();
//       }
//       			//当浏览器窗口大小改变时，设置显示内容的高度
// 			window.onresize=function(){
// 				 changeDivHeight();
// 			}
		

import util from "@/util";
const TYPE = "class-management";
const REMARK = "上课班管理";
const $ = require("jquery");//y引入JQ

import { mapState } from "vuex";

export default {
  data() {
    return {
      winHeight: '',
       rules: {
          majorName: [ { required: true, message: '请选择专业', trigger: 'change' } ],
          grade: [ { required: true, message: '请选择所在级别', trigger: 'change' } ]
        },
      zongfen:'',
      radio2:3,
      checked: [],
      arr:[
        {a:10},
        {a:20},
        {a:30},
        {a:40},
      ],
     
      box1:false,
      box2:false,
      box3:false,
      box4:false,
      dateList:[],
      tableData6: [],
      tableData7:[],
      tableData:[],//接收参数
    
      // tableData:{
      //   courseId:"",
      //   courseName:"",
      //   majorId:"",
      //   stages:"",
      //   termId:"",
      //   termIds:"",
      //   majorName:"",
      //   grade:"",
      //   stage:"",
      //   weight:"",
      //   achievementType:"",
      //   proportion:"",
      // },
      breadcrumb: [{ label: "成绩管理" }, { label: "成绩模型权重比例" }],
      options1: [],
      formInline: {//搜索数据
        grade:"",//所在级
        courseName: "",//课程
        majorName: ""//专业
      },
     query:[],
      addColumn: [{ id: "" }],
      tableLoading: false,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      courseList:[],//课程下拉数
      xh1:"",
      zy2:"",
      szj3:"",
      kcmc4:"",
      jd5:"",
      qz6:"",
      cjmx7:"",
      bl8:"",
    };
  }, 
  created() {	
    // changeDivHeight(){				
		// 		var h = document.documentElement.clientHeight;//获取页面可见高度
		// 		document.getElementById("sytleId").style.height=h-10+"px";

    //   }
    $(window).resize(function () {          //当浏览器大小变化时
     var hh = $(window).height();//获取页面可见高度
    
    	// document.getElementById("sytleId").style.height=hh-50+"px";
      if(hh>600){
        document.getElementById("sytleId").style.height=hh+"px";

      }
  
});

     this.getCourseList();//课程下拉列表
     this.getMajorList();//专业数据请求
    //  this.getTableList();//请求数据
    //  this.openSchemeMaintenance();
    
      this.query = JSON.parse(this.$route.query.data);
    
      this.tableData=this.query;
      // 设置表格表头固定
      this.$nextTick(()=>{
        this.xh1=this.$refs.mycol1.offsetWidth-1;
        this.zy2=this.$refs.mycol2.offsetWidth-1;
        this.szj3=this.$refs.mycol3.offsetWidth-1;
        this.kcmc4=this.$refs.mycol4.offsetWidth-1;
        this.jd5=this.$refs.mycol5.offsetWidth-1;
        this.qz6=this.$refs.mycol6.offsetWidth-1;
        this.cjmx7=this.$refs.mycol7.offsetWidth-1;
        this.bl8=this.$refs.mycol8.offsetWidth-1;
      })
      
  },
  mounted() {
    // resize 对浏览器窗口调整大小进行计数：
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
        this.xh1=this.$refs.mycol1.offsetWidth-1;
        this.zy2=this.$refs.mycol2.offsetWidth-1;
        this.szj3=this.$refs.mycol3.offsetWidth-1;
        this.kcmc4=this.$refs.mycol4.offsetWidth-1;
        this.jd5=this.$refs.mycol5.offsetWidth-1;
        this.qz6=this.$refs.mycol6.offsetWidth-1;
        this.cjmx7=this.$refs.mycol7.offsetWidth-1;
        this.bl8=this.$refs.mycol8.offsetWidth-1;
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
    // openSchemeMaintenance(){
    //    var routerParams = this.$route.query.params

    // },
        check(val){
          	let self = this
           	self.checked[val]=!self.checked[val];
        },
        //获取表格列表
        getTableList(){
            this.tableLoading=true;
            let  grade = this.query[0].grade;
            let  major_id = this.query[0].majorId;
            let  course = this.formInline.courseId;
            if (course==""){
              course=0;
            }
            
            let url = "_ed:/trainplan/course/detail/grade/"+grade+"/major/"+major_id+"/course/"+course
           	this.$http.get(url).then(data=>{
               

               this.tableData = data.data
       			// data.data.map(item1=>{
       			// 	item1.stages.map(item2=>{
       			// 		item2.scoreType.map(item3=>{
       			// 			item3.statu=false;
       			// 		})
       			// 	})
            //  }) 
                this.tableData = data.data;
                 this.totalCount=data.data.totalCount;

                this.tableLoading=false;
            }).catch(()=>{
              	this.tableLoading=true;
            })
        },
        //查询
          onSearch(formName) {
             this.$refs.formName.validate((valid) => {
                if (valid) {
                  this.getTableList();
                } else {
                  return false;
                }
              });
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
         // 课程下拉列表
            	getCourseList(){
                this.$http.get("_op:/course/combox")
                .then(data =>{
                    if(data.code==0){
                        this.courseList = data.data;
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
    // 展开数据    
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    // 获取专业数据的id
    onSelectChange(_id) {
    },
    funsum(arr) {
    var s = 0;
    for(let i=0;i<arr.length;i++){
      s += arr[i]*1;
      }
    return s;
   },
   
    // 保存
    preservation(){

      let paraList=[];//参数数组
      let arr=[];
      let  proportionNum=[];
      this.tableData=this.query;
    	this.tableData.map(item1=>{
    		let courseObj={
    			courseId:'',
    			grade:'',
    			majorId:'',
    			stages:[]
    		}
    		item1.stages.map(item2=>{
    			let stageObj={
    				stage:'',
    				stageWeight:'',
    				termId:'',
    				scoreType:[]
          }
         
    			item2.scoreType.map(item3=>{
    				if (item3.statu) {
    					  stageObj.scoreType.push({
	    					id:item3.id,
	    					name:item3.name,
	    					proportion:Number(item3.proportion)
            })
            let self = this
            proportionNum.push(item3.proportion)
            self.zongfen = self.funsum(proportionNum)
            }
          })
          
    			stageObj.termId=item2.termId;
    			if (stageObj.scoreType.length!=0) {
    				courseObj.stages.push(stageObj)
          }
          stageObj.stage=item2.stage;
          
          var re =  /(^[1-9]\d*$)/;
              if(stageObj.stageWeight>100){
                  this.$message({
                    message: '权重比例不能超过100',
                    type: 'warning'
                  });
                }else{
                    stageObj.stageWeight= Number(item2.stageWeight);
                    courseObj.courseId=item1.courseId;
                    courseObj.grade=item1.grade;
                    courseObj.majorId=item1.majorId;
                }
        })
         
                    if (courseObj.stages!=0) {
                      paraList.push(courseObj)
         }
      })
      
         this.$http.post("_sc:/courseScoreModel",paraList).then(res => {
           
            if(res.code==0){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              
              this.$router.push({
                        path: "/achievement_manage/curriculum_model_definition",
                    });
            }else{
              this.$message({
                  message:res.msg,
                  type: 'warning'
                });
            }
          }).catch(()=>{
            this.tableLoading=true;
      })
     
    },
    //关闭页面
    closePage(){
      this.$router.push({path: "/achievement_manage/curriculum_model_definition",});
    },
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
<style scoped lang="less">
.sytleId{
  // height:680px;
}
.cm-container{
  overflow-y: hidden;
  // height: 680px;
}

// @media screen and (max-height:768px){
//   .cm-container{
//   }
// }
.cores{
    border: solid 1px red;
    line-height: 40px;
}
.my-table-box{
  position: relative;
  // height: 750px;
  overflow-y: auto;
}
.station{
  //  position: fixed;
  //   width: 100%; 
    left: 220px;
    right: 40px;
}
.fixed-table-header{
  position: absolute;
  z-index: 333;
  line-height: 40px;
}
.fixed-table-header th{
  background-color: #eef1f6;
  border:1px solid #dfe6ec;
}

.box1{
    width: 100%;
    
    /* width: 3px; */
}

    // padding: 0;
    // min-width: px;
    // min-width: 63px;
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
	  	.el-input{
	  		width: 90%;
        margin: 5px 0;
	  	}
	}
	.bluetext{cursor: pointer;color: #409EFF;font-size: 10px;}
}
// .fixdes{
//   position: fixed;
// }
</style>



