<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path:item.path }"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold mmmm" >
      <el-form size="mini" :inline="true"  :model="formDetails" ref="formDetails" :rules="rules" >
                <div class="fold">
                         <div ref="formDetail" class="detail" :class="{'detail-show':true}">
                      
                        <el-form-item label="学期"  prop="semester">
                            <el-select 
                                v-model="formDetails.semester"
                                 clearable
                                filterable
                                @change="onYearChange"
                                placeholder="选择学期">
                                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="授课老师" prop="teacherId">
                           <el-select 
                            v-model="formDetails.teacherId" 
                            placeholder="请选择" 
                            clearable 
                            filterable
                            remote
                            :remote-method="getTeacher"
                            :loading="loading">
                              <el-option 
                                v-for="(item,index) in teacherList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                              </el-option>
                          </el-select>
                        </el-form-item>

                         <el-form-item label="排课课程" prop="courseId" >
                            <el-select clearable style="width:350px"
                            	v-model="formDetails.courseId" 
                            	filterable placeholder="选择课程">
                                <el-option v-for="list in courseList" :key="list.id" :label="list.displayName" :value="list.id" ></el-option>
                            </el-select>
                        </el-form-item> 

                        <el-form-item label="年级" prop="grade">
                            <intelligent-year-picker   style="width:120px"
                            	:clearable="false"
                                v-model="formDetails.grade"
                                type="year" 
                                value-format="yyyy" 
                                placeholder="选择年级"> 
                            </intelligent-year-picker>
                        </el-form-item>

                          <el-form-item label="上课班">
                            <!-- <el-select v-model="formDetails.class"  class=""
                                
                                :placeholder=" classList.length==''?'该学期无上课班':'请选择' " 
                                :disabled="classList.length==0">
                                <el-option label="全部" :value="-1"></el-option>
                                <el-option v-for="list in classList" :key="list.id" :label="list.name" :value="list.id"></el-option>
                            </el-select> -->
                            <el-select 
                                v-model="formDetails.class" 
                                placeholder="请选择" 
                                clearable 
                                filterable
                                remote
                                :remote-method="getClassList"
                                :loading="loading">
                                  <el-option 
                                    v-for="(item,index) in classList" 
                                    :key="index" 
                                    :label="item.name" 
                                    :value="item.id"> 
                                  </el-option>
                          </el-select>
                        </el-form-item>
                        
                    </div>
                    <div class="btn">
                          <el-button type="primary" size="mini" @click="onSearch('formDetails')" >查询</el-button>
                    </div>
                </div>
              
            </el-form>
               <!-- <el-button @click="provmonth()" style="position: absolute;top:15%;right:220px;opacity: 1;padding: 6px 7px;">&lt;&lt;上月 </el-button>
        
                <el-button   @click="nextmonth()" style="position:absolute;top:15%;right:20px;opacity:1;padding: 6px 7px;"> 下月 &gt;&gt;</el-button> -->
  
    <div style="text-align: center;">
        <el-button @click="provmonth()"  size="mini" >&lt;&lt;上月 </el-button>
        <span style="padding: 0 20px;">{{yearday}}</span>
        <el-button   @click="nextmonth()"  size="mini" > 下月 &gt;&gt;</el-button>
    </div>
    <el-calendar v-model="datavalue" ref="calendar" class="datacalendar">
        
         <template
            slot="dateCell"
            slot-scope="{date, data}">
            <div style="height:100%;"
              :class="data.isSelected ? 'is-selected' : ''"
              
              >
              {{ data.day.split('-').slice(1).join('-') }}
              <div class="fontlength1"  >
                 <div class="fontlength" style="   font-size: 12px;  color: black;" @click="getdelis(capitalize(data.day))"> 
                   <ul  v-for="(item,index) in capitalize(data.day).name" :key="index" style=" list-style-type: none;">
                     <li :class="{delis:index>=0}">{{item}}</li>
                   </ul>
                  
                  </div>
              </div>
             
            </div>
          </template>
    </el-calendar>
    </div>
     <el-dialog
			title="课程详情"
			:visible.sync="dialog.delis"
			:append-to-body="true"
			width="40%">
			
			<div class="adjust-box" v-for="(adjustObj,index) in datails" :key="index">
				<div class="det-box">
					<p class="title">课程</p>
					<p class="adjust-line">排课课程： {{adjustObj.course}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">课程内容</p>
					<p class="adjust-line">授课形式： {{adjustObj.teaching_formname}}</p>
					<p class="adjust-line">授课内容： {{adjustObj.teaching_content}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">授课资源</p>
					<p class="adjust-line">授课老师： {{adjustObj.teacher_names}}</p>
					<p class="adjust-line">授课场地： {{adjustObj.area_name}}</p>
					<p class="adjust-line">课程时间： {{adjustObj.schedule_item_date}}</p>
					<p class="adjust-line">课 &nbsp; &nbsp; 节： {{adjustObj.section_nodenames}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">上课班信息</p>
					<p class="adjust-line">上课班： {{adjustObj.class_name}}</p>
					<p class="adjust-line">教学模式： {{adjustObj.teachingMode==0?'普通教学':'全英教学'}}</p>
					 <p class="adjust-line">分组名称： {{adjustObj.group_numbers==''?'不分组':adjustObj.group_numbers}}</p>
				</div>
        <el-divider  v-if="datails.length-1 != index"></el-divider>
			</div>
		</el-dialog>  

  </section>
</template>

<script>
    import util from '@/util';
    import {mapState} from 'vuex';

    export default {
      name:'class_course_bydata',
        data(){
            return {
              dialog:{
                delis:false,
              },
               tableLoading: false,
               datails:[],
                itemIds:{},
                iftrue:false,
                yearday:'',
                dataitem:[
                  // {
                  //   courseSummary: "临床基本技能,第6,7,8节,见习课@肿瘤医院内科一区",
                  // id: 65842,
                  // scheduleItemDate: 1568563200,
                  // sectionNames: "6,7,8",
                  //  teacherNames: "许哲鑫"
                  // },
                  // {
                  //   courseSummary: "临床基本技能,第6,7,8节,见习课@肿瘤医院内科二区",
                  //   id: 65844,
                  //   scheduleItemDate: 1569168000,
                  //   sectionNames: "6,7,8",
                  //   teacherNames: "许哲鑫"
                  // }
                ],
                formDetails: {
                  semester: '', //学期
                  class:'',//上课班
                  grade:'',//所在级
                  courseId: '', //课程
                  teacherId:''
                },
                fallYear:'',
                semesterNum:'',
                classList:[],
                courseList:[],//课程列表
                teacherList:[],//授课老师
                options1:[],
                datavalue:new Date(),
                year:'',
                month:'',
                strDate:'',
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "按日期查询课程表"},
                ],
                tableData:[],
                showdata:false,
                rules: {
                 semester: [
                     { required: true, message: '请选择学期', trigger: 'change' }
                  ],
                  teacherId: [
                     { required: true, message: '请选择老师', trigger: 'change' }
                  ],
                }

            }
        },
        created(){
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          this.yearday = year+ '年' +month+ '日'
          this.getyearandday()

          this.getTermData()
          // this.getCourseList()
          this.getClassList()
          //获取教师名单列表
          this.getTeacher('')
        	.then(()=>{
            let vuex = JSON.parse(localStorage.getItem('vuex'));
            let teacherId = vuex&&vuex.me&&vuex.me.attributes&&vuex.me.attributes.login_info&&vuex.me.attributes.login_info.id;
            if(teacherId){
              this.formDetails.teacherId = teacherId*1;
              if(!this.teacherList.find(item=>item.id==teacherId)){
                let teacherName = vuex&&vuex.me&&vuex.me.user&&vuex.me.user.name || '';
                this.teacherList = [...this.teacherList,{id:teacherId,name:teacherName}];
              }
            }
          }).then(this.getTableData);
        },
        filters:{
         
        },
        methods:{
          getyearandday(){
             
              
          },
             capitalize( val){
               
            var Time = new Date(val);
            var timestemp =  Time.getTime()/1000-28800;
            let value;
            var obj = {}
             if(this.dataitem.length==0|!val){
               value = ''
               
             }else{
               
               var r = this.dataitem.filter(function (x) {
                 return x.scheduleItemDate/1000 == timestemp
               });
              var courseSummary = r.map(x => x.courseSummary)
              if(courseSummary>3){
                courseSummary.slice(0,3)
              }
             
                var  obj = {}
              obj.name = courseSummary
              obj.id =r.map(x => x.id)
             
                           
             }
     			   return obj;
          },
          // capitalfn( val,dataitem){
          //     var Time = new Date(val);
          //     var timestemp =  Time.getTime()/1000-28800;
          //     let value;
          //     if(dataitem.length==0|!val){
          //       value = ''
                
          //     }else{
          //         debugger
          //       var r = dataitem.filter(function (x) {
          //         return x.scheduleItemDate/1000 == timestemp
          //       });
          //       var courseSummary = r.map(x => x.courseSummary).join(',');
          //     }
          //     let obj = {}
          //     obj.name = courseSummary
          //     obj.id =r.map(x => x.id)
             
          //     return obj;
              
            
          // },
       getdelis(obj){
          
         let query = {
           schduleItemIds:obj.id
         }
          this.$http.post("_ed:/schedule/item/query/detail",query).then(res=>{
                if(res.code==0){
                  function getCharcode(str){
                    return str.section_nodenames.split(',')[0].codePointAt(0);
                  }
                  this.datails = res.data.sort((a,b)=>{
                    return getCharcode(a)-getCharcode(b);
                  });
                  this.dialog.delis = true;
                }
                 
          })
       },
        onSearch(formName) {
          
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.submitForm()
            } else {
              return false;
            }
          });
        },
          submitForm(){
            this.iftrue = true
            let arry = []
        
            // arry = this.$refs.calendar.curMonthDatePrefix.split('-')
            
            let newday = new Date(this.datavalue.getFullYear(),this.datavalue.getMonth()+1,0)
            
            var y=newday.getFullYear();
            var m=newday.getMonth()+1;
            var d=newday.getDate();

            let lastDay = y+'-'+m+'-'+d
            
            let beginDay = y+'-'+m+'-01'
            
            let grade = '';
             if(this.formDetails.grade!=0){
               grade = this.formDetails.grade*1
             }
            let query = {
              clsId:this.formDetails.class,
              grade: grade,
              semesterCourseId: this.formDetails.courseId,
              semesterYear: this.fallYear,
              semesterYearNumber: this.semesterNum,
              teacherId: this.formDetails.teacherId,
              beginDate: beginDay,
              endDate: lastDay
            }
            
            this.$http.post('_ed:/schedule/item/search/from/view',query).then(res=>{
              
              if(res.code==0){

                  this.dataitem = res.data
                   
              }else{
                  this.$message.error(res.msg)
              }
           
              
            })
          },
           getCourseList() {
            // //查询课程
            // let query = dictionaryCode
            // this.$http.get("_op:/course/getCourseByCategoryCode/" + query).then(res => {
            //   this.courseList = res.data;
            // }).catch(err => {

            // })
          },
          getTeacher(str){
        		this.loading = true; 
        		return this.$http.post("_ed:/exchangecourse/query/teacher",{
        			str:str
        		}).then(data=>{
              
              this.teacherList=data.data;

              let teacherId;
              if(JSON.parse(localStorage.getItem('vuex')).me){
                let a = JSON.parse(localStorage.getItem('vuex')).me
                if(a.attributes){
                  let r = a.attributes
                  if(r.login_info){
                    let b = r.login_info
                    teacherId = b.id
                  }
                }
                
              }
			  
              if(teacherId){
                // this.formDetails.teacherId = teacherId*1
                this.onSearch('formDetails')
              }
            
        			this.loading = false;
            }).catch(()=>{
            })
          },
            //更改学期
            onYearChange(val){
             
             
                this.formDetails.class=""
                if(val){
                  
                    for(let list of this.options1){
                      
                        if(list.id==val){
                            this.fallYear = list.year;
                            this.semesterNum = list.orderNum;
                            
                        }
                    }
                }else{
                    this.fallYear = 0;
                    this.semesterNum = 0;
                }
                
                this.getClassList(  this.fallYear);
                this.getScheduleList(val);
                // this.$router.replace({query:{...this.$route.query,formYear:val}});
            },
           getTermData() { //查询学期列表
            let query = "学期"
            this.$http.get('_op:/terms/new/' + query).then(data => {
              if (data.code == 0) {
                this.options1 = data.data.reverse();

                let findItem = this.options1.find(item=>item.stage==2||item.name.indexOf('当前学期')>-1);
                this.formDetails.semester = findItem.id;
                this.addForm = findItem.name;
                this.semesterNum = findItem.orderNum;
                this.fallYear = findItem.year;

                this.getScheduleList( this.formDetails.semester)
              } else {
                this.$message.error(data.data);
              }
            })
          },
          //  getClassList(){
          //       this.$http.post("_ed:/coursecls/list",{
          //           semester_year:this.fallYear,
          //           semester_year_number:this.semesterNum
          //       }).then(data=>{
          //           if(data.code==0){
          //               this.classList = data.data;
          //           }else{
          //               this.$message.error(data.msg);
          //           }
          //       })
          //   },

            	//获取上课班级
        	getClassList(str){
                this.loading = true;
                this.$http.post("_ed:/exchangecourse/query/coursecls",{
                  str:str
                }).then(data=>{
                  this.classList=data.data;
               
                  this.loading = false;
                    }).catch(()=>{
                    })
          },
            getCourseList(){
                // this.$http.get("_op:/course/combox")
                // .then(data=>{
                //     if(data.code==0){
                //         this.courseList = data.data;
                //     }else{
                //         this.$message.error(data.msg);
                //     }
                // })
            },
            getScheduleList(_id){
                for(let item of this.options1){
                    if(item.id==_id){
                        this.fallYear = item.year;
                        this.semesterNum = item.orderNum;
                    }
                }
                this.$http.post("_ed:/semestercourse/list",{
                    semester_year:this.fallYear,
                    semester_year_number:this.semesterNum
                })
                .then(data=>{
                    if(data.code==0){
                        
                        data.data.forEach(x => x.displayName = x.course_arrange + '(' + x.majorNames + ')');
                        
                        this.courseList = data.data;
                       
                    }else{
                        this.$message.error(data.msg);
                    }
                })
            },
          nextmonth(){
            this.setMonth(1);
             this.onSearch('formDetails')
          },
          provmonth(){
            this.setMonth(-1);
            this.onSearch('formDetails')

          },setMonth(num){
              let self = this;
              let lastM = new Date(self.datavalue.setMonth(self.datavalue.getMonth()+num));
              self.datavalue = lastM;
              var year = lastM.getFullYear()
              var mon = lastM.getMonth()+1
              this.yearday  = year +'年' +mon+'月'
              
              
          },
          getconetent(day){
            return '今天的课程表'
           
          },
          details2(){
            // this.showdata = false
          },
          details(day){
            
              //  this.tableData = []
              //   this.$http.post("_ed:/exchangecourse/query",{
              //   	beginDate: day,
              //     endDate: day,
              //     areaId:  '',
              //     clsId:  '',
              //     courseId:  '',
              //     pageSize:  3,
              //     requestPage:  1,
              //     sectionNodeids:[],
              //     semestercourseId: '',
              //     teacherId: ''
              //   }).then(data=>{
              //       this.tableData=data.data.dataList;
              //       // this.tablePage.total=data.data.total_records;
              //   }).catch(()=>{
              //       this.tableData=[];
              //   })
            
            this.showdata = true
          },
          table_query(day){
            let todays= day.toString()
            this.$router.push({
              path:'/teaching_management/course_table_query',
              query:{todays:todays}

            })
          
          }

        }
    }
</script>
<style scoped lang="less">
.adjust-box{
	width: 90%;
	margin: auto;
	.det-box{
		margin-bottom: 30px;
		.title{
			font-weight: bold;
			margin-bottom: 10px;
		}
	}
}
.adjust-line{
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	label{width: 15%;margin-right: 20px;text-align: right;}
	.el-input , .el-select{width: 60%;}
}
.fontlength1 ul{
  white-space:nowrap; 
	text-overflow:ellipsis;
	-o-text-overflow:ellipsis;
	overflow: hidden;
  width:200px; 
}
.fontlength .delis{
  width:185px;
 white-space:nowrap; 
 	text-overflow:ellipsis;
	-o-text-overflow:ellipsis;
	overflow: hidden;  
}
.cm-addGrade p {
  margin-bottom: 12px;
}
.showwords{
  width:270px;
  font-size: 13px;
  color:#666;
  position: relative;
  z-index: 1000;
  background: #ddd;
  opacity: 100;
  padding: 5px;
  border-radius: 5px
}
.pad_right{
        padding-right: 10px;
        text-align: center;
        border: #ddd
    }
</style>
<style>
.el-calendar__header{
  display: none!important;
  /* justify-content:center; */
}
.pm-margin /deep/.el-dialog__body {
  padding: 10px 40px;
}
/* .datacalendar .el-calendar__header.el-calendar__title{
  display: none !important;
} */
.datacalendar .el-calendar__button-group .el-button-group{
  display: none!important;
  
}
.datacalendar .el-calendar-table .el-calendar-day{
  height:110px;
}
.datacalendar .el-calendar__body{
  padding:12px 20px 0;
}
  .is-selected {
    color: #1989FA;
  }
  /* .mmmm /deep/.el-button{
    padding: 6px 7px;
    opacity: 0.6;
  } */
</style>