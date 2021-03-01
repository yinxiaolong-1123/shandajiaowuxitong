<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini" label-width="68px">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                        <el-form-item label="场地">
                        	<label>{{areaname}}</label>
                        </el-form-item>
                        <el-form-item>
	                        <el-select v-model="semester" placeholder="请选择" clearable filterable>
							    <el-option 
							    	v-for="(item,index) in semesterList" 
							    	:key="index" 
							    	:label="item.semesterName" 
							    	:value="item.semesterId"> 
							    </el-option>
							</el-select>
                        </el-form-item>
                    </div>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="getAreaTerm">查询</el-button>
                        <el-button size="mini" @click="closeBtn">关闭</el-button>
                    </div>
                </div>
            </el-form>
        </div>
        
        <table class="stationtable">
        	<tr>
        		<th rowspan="2">&nbsp; 周 &nbsp; 次 &nbsp;</th>
        		<th colspan="4" v-for="(item,index) in dateList" v-if="index<7" style="font-size: 11px;">
        			{{'星期'+weekDays(item.weekDay)}}
        		</th>
        	</tr>
        	<tr style="font-size: 12px;">
        		<template v-for=" i in dateList">
	        		<th>1-2</th>
	        		<th>3-4</th>
	        		<th>下午</th>
	        		<th>晚上</th>
        		</template>
        	</tr>
        	<template v-for="(itemweek,indexweek) in list">
        		<tr v-if="itemweek.areaUsedDetailList.length>0">
	        		<td>{{itemweek.week}}</td>
	        		<template v-if="indexdate<7" v-for="(itemdate,indexdate) in itemweek.areaUsedDetailList">
	        			<td :class="{ 'td-btn-bg' : itemdate.lessonObj.first.statu }" 
	        				@click="lessonDet(itemdate.weekDate,itemdate.lessonObj.first.lessons,itemdate.week,itemdate.weekDay)">
	        				<template v-if="itemdate.lessonObj.first.statu">已用</template>
	        			</td>
	        			<td :class="{ 'td-btn-bg' : itemdate.lessonObj.second.statu }"
	        				@click="lessonDet(itemdate.weekDate,itemdate.lessonObj.second.lessons,itemdate.week,itemdate.weekDay)">
	        				<template v-if="itemdate.lessonObj.second.statu">已用</template>
	        			</td>
	        			<td :class="{ 'td-btn-bg' : itemdate.lessonObj.third.statu }"
	        				@click="lessonDet(itemdate.weekDate,itemdate.lessonObj.third.lessons,itemdate.week,itemdate.weekDay)">
	        				<template v-if="itemdate.lessonObj.third.statu">已用</template>
	        			</td>
	        			<td :class="{ 'td-btn-bg' : itemdate.lessonObj.fourth.statu }"
	        				@click="lessonDet(itemdate.weekDate,itemdate.lessonObj.fourth.lessons,itemdate.week,itemdate.weekDay)">
	        				<template v-if="itemdate.lessonObj.fourth.statu">已用</template>
	        			</td>
	        		</template>
	        	</tr>
	        	<tr v-else>
	        		<td>{{itemweek.week}}</td>
	        		<template v-for="i in 7">
	        			<td v-for="j in 4"></td>
	        		</template>
	        	</tr>
        	</template>
        </table>
        
        
        <!----------------课程详情-------------------->
        <el-dialog
			title="课程详情"
			:visible.sync="dialogDet"
			:append-to-body="true"
			width="40%">
			
			<div class="adjust-box">
				<div class="det-box">
					<p class="title">课程</p>
					<p class="adjust-line">排课课程： {{adjustObj.courseArrange}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">课程内容</p>
					<p class="adjust-line">授课形式： {{adjustObj.teachingForm}}</p>
					<p class="adjust-line">授课内容： {{adjustObj.teachingContent}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">授课资源</p>
					<p class="adjust-line">授课老师： {{adjustObj.teacherNames}}</p>
					<p class="adjust-line">授课场地： {{adjustObj.areaName}}</p>
					<p class="adjust-line">课程时间： {{adjustObj.scheduleItemDate}}</p>
					<p class="adjust-line">课 &nbsp; &nbsp; 节： {{adjustObj.sectionNodenames}}</p>
				</div>
				
				<div class="det-box">
					<p class="title">上课班信息</p>
					<p class="adjust-line">上课班： {{adjustObj.className}}</p>
					<p class="adjust-line">分组号： {{adjustObj.groupNames}}</p>
				</div>
			</div>
		</el-dialog>
        

    </section>
</template>

<script>
    import util from '@/util'
    import moment from 'moment'

    export default {
        name: "sitestatus",
        data() {
            return {
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "场地使用情况", path: 'site_status'},
                    {label: "学期下使用情况"},
                ],
                areaId:this.$route.query.areaId,
                areaname:this.$route.query.name,
                dateList:[],
                list:[],
                dialogDet:false,
                adjustObj:{},
                semester:'',
                semesterList:[],
                
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },

            }
        },
        methods: {
        	weekDays(day) {
              switch(day) 
              {
              case 1:
                day = '一';
                break;
              case 2:
                day = '二';
                break;
              case 3:
                day = '三';
                break;
              case 4:
                day = '四';
                break;
              case 5:
                day = '五';
                break;
              case 6:
                day = '六';
                break;
              case 7:
                day = '日';
                break;
              }
              return day;
            },
        	getSemester(){
        		this.$http.get("_op:/area/detail/term/list").then(data=>{
                    this.semesterList=data.data.reverse();
                }).catch(()=>{
                })
        	},
            getAreaTerm(){
            	let self=this;
            
            	let termId=this.semester=='' ? 0 :this.semester;
				this.$http.get("_op:/area/detail/term/"+this.areaId+'/'+termId).then(data=>{
	        		self.dateList = [];
	        		self.list = data.data;
	        		
	        		for(let i=0; i <self.list.length; i++){
	        			if(self.list[i].areaUsedDetailList&&self.list[i].areaUsedDetailList.length>0){
	        				self.dateList=self.list[i].areaUsedDetailList;
	        				break;
	        			}
	        		}
	        		
	        		self.list.map(function(item1,index1){
	        			if(item1.areaUsedDetailList!=null){
		        			item1.areaUsedDetailList.map(function(item2,index2){
		    					item2.lessonObj={first:{statu:false,lessons:[]},
		    								second:{statu:false,lessons:[]},
		    								third:{statu:false,lessons:[]},
		    								fourth:{statu:false,lessons:[]}}
		    					if(item2.sectionNames.length>0){
			    				
			    					item2.sectionNames.map(function(itemSN){
			    						let lessons = itemSN.sectionNodeNames.split(',');
				    				
				        				lessons.map(function(item3,index3){
				        					if (item3==1 || item3==2) {
				        						item2.lessonObj.first.statu=true;
				        						item2.lessonObj.first.lessons.push(item3)
				        					}
				        					if (item3==3 || item3==4) {
				    							item2.lessonObj.second.statu=true;
				    							item2.lessonObj.second.lessons.push(item3)
				        					}
				        					if (item3==5 || item3==6 || item3==7) {
				    							item2.lessonObj.third.statu=true;
				    							item2.lessonObj.third.lessons.push(item3)
				        					}
				        					if (item3==8 || item3==9 || item3==10) {
				    							item2.lessonObj.fourth.statu=true;
				    							item2.lessonObj.fourth.lessons.push(item3)
				        					}
				        				})
			    					})
		    					}
		    					
		        			})
	        			}
	        		})
                }).catch(()=>{
                })
            },
            
            lessonDet(weekdate,sectionName,week,weekDay){
            	if(sectionName.length>0){
	        		this.$http.post("_op:/curriculum/area",{
						locationId: this.areaId,
						courseDate: weekdate,
						courseNameId: sectionName.join(','),
						week: week,
						whatDay: weekDay
	        		}).then(data=>{
	        			this.adjustObj=data.data[0];
	        			this.adjustObj.scheduleItemDate=moment(this.adjustObj.scheduleItemDate).format('YYYY-MM-DD');
	            		this.dialogDet=true;
	                }).catch(()=>{
	                })
            	}
            },
            
            
            closeBtn() {
                this.$router.push({
                	name:'site_status'
                })
            },
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
        },
        created(){
        	this.getAreaTerm();
        	this.getSemester();
        }
    }
</script>

<style scoped lang="less">

.stationtable{
  width: 100%;
  text-align: center;
  position: relative;
}
.stationtable th {
  background-color: #eef1f6;
  line-height: 40px;
  border: 1px solid #dfe6ec;
}
.stationtable td {
  border: 1px solid #dfe6ec;
  line-height: 40px;
}
.stationtable .bluetext{cursor: pointer;color: deepskyblue;}


.td-btn-bg{background-color: #409EFF;cursor: pointer; color: #fff;font-size: 10px;}
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
	label{width: 10%;margin-right: 20px;text-align: right;}
	.el-input , .el-select{width: 60%;}
}
</style>