<template>
    <section class="cm-container">
        	
		<table class="stationtable">
			<tr><td class="title">排课课程</td><td colspan="2" class="textleft">{{excourseObj.courseArrange}}</td></tr>
			<tr><td class="title">上  课  班</td><td colspan="2" class="textleft">{{excourseObj.clsName}}</td></tr>
			<tr><td class="title">调课理由</td><td colspan="2" class="textleft">{{excourseObj.exchangeExcuse}}</td></tr>
			<tr><td class="title">调课类型</td><td colspan="2" class="textleft">{{excourseObj.exchangeType | exchangeTypeFn}}</td></tr>
			<tr><td class="title">辅助说明</td><td colspan="2" class="textleft">{{excourseObj.instruction}}</td></tr>
			<tr><td class="title">状       态</td><td colspan="2" class="textleft">{{excourseObj.status | statusFn}}</td></tr>
			<tr><td class="title"> 		 </td><td>调课前</td><td>调课后</td></tr>
			<tr><td class="title">授课课程</td>
				<td colspan="2">{{excourseObj.courseArrange}}</td>
			</tr>
			<tr><td class="title">授课内容</td>
				<td colspan="2">{{excourseObj.teachingContent}}</td>
			</tr>
			<tr><td class="title">授课老师</td>
				<td>{{excourseObj.teacherNames}}</td>
				<td>
					<template v-if="checkType==1">{{excourseObj.ndteacherNames}}</template>
					<template v-else>
	    				<template v-if="!excourseObj.editPower">{{excourseObj.ndteacherNames}}</template>
	    				<template v-else>
	    					<template v-if="excourseObj.singleType!=1">{{excourseObj.ndteacherNames}}</template>
	    					<el-select 
	    						v-else
								v-model="excourseObj.ndteacherIds" 
								remote
								:remote-method="getTeacher"
								placeholder="请选择" 
								size="mini"
								style="width:90%"
								multiple 
								clearable 
								filterable>
							    <el-option 
							    	v-for="(item,index) in teacherList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
	    				</template>
					</template>
				</td>
			</tr>
			<tr>
				<td class="title">授课日期</td>
				<td>{{excourseObj.scheduleitemDate}}</td>
				<td>
					<template v-if="checkType==1">{{excourseObj.ndscheduleitemDate}}</template>
					<template v-else>
	    				<template v-if="!excourseObj.editPower">{{excourseObj.ndscheduleitemDate}}</template>
	    				<template v-else>
	    					<template v-if="excourseObj.singleType==1">{{excourseObj.ndscheduleitemDate}}</template>
							<el-date-picker v-else v-model="excourseObj.ndscheduleitemDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" size="small" style="width:90%"> </el-date-picker>
	    				</template>
					</template>
				</td>
			</tr>
			<tr>
				<td class="title">授课课节</td>
				<td>{{excourseObj.sectionNodenames}}</td>
				<td>
					<template v-if="checkType==1">{{excourseObj.ndsectionNodenames}}</template>
					<template v-else>
	    				<template v-if="!excourseObj.editPower">{{excourseObj.ndsectionNodenames}}</template>
	    				<template v-else>
	    					<template v-if="excourseObj.singleType==1">{{excourseObj.ndsectionNodenames}}</template>
	        				<el-select 
	    						v-else
								v-model="excourseObj.ndsectionNodeids" 
								placeholder="请选择" 
								size="small"
								style="width:90%"
								multiple 
								clearable 
								filterable>
							    <el-option 
							    	v-for="(item,index) in lessonList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							    <el-option label="X" :value="9999"></el-option>
							</el-select>
	    				</template>
					</template>
				</td>
			</tr>
			<tr>
				<td class="title">授课场地</td>
				<td>{{excourseObj.areaName}}</td>
				<td>
					<template v-if="checkType==1">{{excourseObj.ndareaName}}</template>
					<template v-else>
	    				<template v-if="!excourseObj.editPower">{{excourseObj.ndareaName}}</template>
	    				<template v-else>
	    					<template v-if="excourseObj.singleType==1">{{excourseObj.ndareaName}}</template>
	        				<el-select 
	    						v-else
								v-model="excourseObj.ndareaId" 
								@change="ndareaIdChange"
								placeholder="请选择" 
								size="small"
								style="width:90%"
								clearable 
								filterable
								remote
								:remote-method="getArea"
								:loading="loading">
							    <el-option 
							    	v-for="(item,index) in areaList" 
							    	:key="index" 
							    	:label="item.name" 
							    	:value="item.id"> 
							    </el-option>
							</el-select>
	    				</template>
					</template>
				</td>
			</tr>
			<tr>
				<td class="title">审核记录</td>
				<td colspan="2" class="textleft">
					<el-button type="text" @click="checkRecord">查看审核记录</el-button>
				</td>
			</tr>
		</table>
		
		<div class="cm-pagination" style="margin-top: 20px;">
		    <!--<el-button @click=" dialogVisible= false">关闭</el-button>-->
		    <el-button type="primary" @click="audit(1)" v-if="checkType==0">不同意</el-button>
		    <el-button type="primary" @click="audit(0)" v-if="checkType==0">同意</el-button>
		</div>
		
	    <el-dialog 
	    	title="审核记录" 
	    	:visible.sync="dialogAudit"  
	    	width="60%" 
	    	append-to-body>
	        <el-table
	            ref="multipleTable"
	            :data="auditlogList"
	            border
	            style="width: 100%"
	            header-row-class-name="cm-dark">
	            <el-table-column type="index" label="序号" fixed width="80"></el-table-column>
	
	            <el-table-column prop="auditRole" label="角色"></el-table-column>
	            <el-table-column prop="auditName" label="审核人"></el-table-column>
	            <el-table-column label="审核日期">
	            	<template slot-scope="scope">{{scope.row.auditDate | dateFn}}</template>
	            </el-table-column>
	            <el-table-column prop="auditResult" label="审核结果">
	            	<template slot-scope="scope">{{auditResult==1?"不同意":"同意"}}</template>
	            </el-table-column>
	    	</el-table>
	    	
		</el-dialog>

    </section>
</template>

<script>
    import util from '@/util';
    import moment from 'moment';

    export default {
        name: "adjust_lesson_check",
        data() {
        	return {
        		checkType:this.$route.query.type,//0处理,1查看详情
				semestercourseid:this.$route.query.id,//调课id
				excourseObj:{},//调课处理对象
				auditlogList:[],//审核记录
				dialogAudit:false,//审核记录弹框
        		
				teacherList:[],//教师列表
				lessonList:[],//课节
                areaList:[],//授课场地
        		
				dialogVisible:false,
				dialogTitle:'',
				
                
                teacherId:util.getStorage('loginId'),
                teacherName:util.getStorage('loginName'),
                btnPerObj:{//按钮权限
                    query:false,
                    exchange:false,
                    detail:false
                }
                
            }
        },
        filters: {
        	statusFn(val){
        		let statutext='';
        		switch (val){
        			case 0: statutext='处理中'
        				break;
        			case 1: statutext='调课成功'
        				break;
        			case 2: statutext='调课失败'
        				break;
        			case 3: statutext='撤销调课'
        				break;
        			default:
        				break;
        		}
        		return statutext;
        	},
        	exchangeTypeFn(val){
        		let typetext='';
        		switch (val){
        			case 3: typetext='单独调课'
        				break;
        			case 4: typetext='互换调课'
        				break;
        			default:
        				break;
        		}
        		return typetext;
        	},
        	dateFn(val){
        		if (val!=null) {
        			return moment(val).format('YYYY-MM-DD')
        		}
        	}
        },
        mounted(){
        },
        computed:{
        },
        created(){
        	this.getData();
        },
        methods: {
        	getData(){
        		this.$http.get("_ed:/exchangecourse/query/excourse/"+this.semestercourseid).then(data=>{
            		data.data.scheduleitemDate= data.data.scheduleitemDate==null? '': moment(data.data.scheduleitemDate).format('YYYY-MM-DD');
            		data.data.ndscheduleitemDate= data.data.ndscheduleitemDate==null? '': moment(data.data.ndscheduleitemDate).format('YYYY-MM-DD');
            		data.data.ndareaId=data.data.ndareaId==0?'':data.data.ndareaId
            		this.excourseObj=data.data;
            		if(data.data.editPower){//是否能编辑
            			if(data.data.singleType==1){
            				this.getTeacher(' ');
            			}else{
	            			this.geLessonList();
	            			this.getArea();
            			}
            		}
                }).catch(()=>{
                })
        	},
        	
        	
//          openDialog(type,id){
//          	this.$http.get("_ed:/exchangecourse/query/excourse/"+id).then(data=>{
//          		this.semestercourseid=id;
//          		data.data.scheduleitemDate= data.data.scheduleitemDate==null? '': moment(data.data.scheduleitemDate).format('YYYY-MM-DD');
//          		data.data.ndscheduleitemDate= data.data.ndscheduleitemDate==null? '': moment(data.data.ndscheduleitemDate).format('YYYY-MM-DD');
//          		data.data.ndareaId=data.data.ndareaId==0?'':data.data.ndareaId
//          		this.excourseObj=data.data;
//          		if(data.data.editPower){//是否能编辑
//          			if(data.data.singleType==1){
//          				this.getTeacher(' ');
//          			}else{
//	            			this.geLessonList();
//	            			this.getArea();
//          			}
//          		}
//                  this.dialogTitle= type==0? {name:'调课审核',type:type}:{name:'调课详情',type:type};
//	            	this.dialogVisible=true;
//              }).catch(()=>{
//              })
//          	
//          },
            
            ndareaIdChange(){
            	this.areaList.map(item=>{
            		if (item.id==this.excourseObj.ndareaId) {
            			this.excourseObj.ndareaName=item.name
            		}
            	})
            },
            audit(type){//1不同意、0同意
            	let self=this;
            	let sectionlist=[];
            	let ndteacherNames=[];
            	self.excourseObj.ndsectionNodeids.map(item1=>{
            		self.lessonList.map(item2=>{
            			if (item1==item2.id) {
            				sectionlist.push({
			      				id:item2.id,
			      				name:item2.name
			      			})
            			}
            		})
            	})
            
            	self.excourseObj.ndteacherIds.map(item1=>{
            		self.teacherList.map(item2=>{
            			if (item1==item2.id) {
            				ndteacherNames.push(item2.name)
            			}
            		})
            	})
            	this.$http.post("_ed:/exchangecourse/handle",{
            		auditId: this.teacherId,
            		auditName: this.teacherName,
					auditResult: type,
					exchangeCourseId: this.semestercourseid,
					ndareaId: this.excourseObj.ndareaId,
					ndareaName: this.excourseObj.ndareaName,
					ndscheduleitemDate: this.excourseObj.ndscheduleitemDate,
					sectionNodeidsJson: sectionlist,
					ndteacherIds: self.excourseObj.ndteacherIds,
					ndteacherNames: ndteacherNames.join()
            	}).then(data=>{
	            	this.dialogVisible=false;
	            	this.getTableData();
                }).catch(()=>{
                })
            },
            checkRecord(){
            	this.$http.get("_ed:/exchangecourse/query/auditlog/"+this.semestercourseid).then(data=>{
            		this.auditlogList=data.data;
            		this.dialogAudit=true;
                }).catch(()=>{
                })
            },
            getTeacher(key){//获取教师
				this.$http.get("_op:/teachers/combox/"+key).then(data=>{
					if(data.code==0){
                        if(data.data){
    						this.teacherList = data.data;
                        }
					}else{
						this.$message.error(data.msg);
					}
				})
			},
            geLessonList(){//获取课节
				this.$http.get("_op:/sections/find").then(data=>{
					if(data.code==0){
                        if(data.data){
    						this.lessonList = data.data;
                        }
					}else{
						this.$message.error(data.msg);
					}
				})
			},
            getArea(str){
            	let self=this;
        		this.loading = true;
        		this.$http.post("_ed:/exchangecourse/query/area",{
        			str:str
        		}).then(data=>{
        			let isarea=false;
        			data.data.map(item=>{
        				if(item.id==self.excourseObj.ndareaId){
        					isarea=true;
        				}
        			})
        			if(!isarea){
        				data.data.push({
        					id:self.excourseObj.ndareaId,
        					name:self.excourseObj.ndareaName
        				})
        			}
        			this.areaList=data.data;
        			this.loading = false;
                }).catch(()=>{
                })
        	},
        	
        	
        }
    }
</script>

<style scoped lang="less">
.cm-container{background-color: #fff;}
.stationtable{
  	width: 100%;
  	text-align: center;
  	position: relative;
  	td {
	  border: 1px solid #dfe6ec;
	  line-height: 40px;
	}
	.title{
		background-color: #DCDFE6;
	}
	.textleft{
		text-align: left;
		padding-left: 20px;
	}
}
</style>