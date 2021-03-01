<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path}">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>	
        </div> 
        <el-container>
            <el-header> 
                <el-form :inline="true" :model="formInline"  style="margin-top:10px;">
                    <el-form-item label="学期">
                        <el-input v-model="formInline.semester_name" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="课程">
                        <el-input v-model="formInline.course_arrange" readonly> </el-input>
                    </el-form-item>
                </el-form>
            </el-header>
            <el-main>

                <div class="cm-btn-con cm-btn-others">
                    <el-button size="mini" @click="$router.go(-1);" >返回</el-button>
                    <el-button size="mini" type="primary">新增内容</el-button>
                    <!-- <el-button size="mini" type="primary">复制内容</el-button> -->
                    <el-button size="mini" type="primary">下载模板</el-button>
                    <el-button size="mini" type="primary">导入模板</el-button>
                </div>

                <div class="cm-table">
                    <el-table :data="courseContentData" size="mini"  v-loading="tableLoading" element-loading-text="加载中..." header-row-class-name="cm-dark" border  style="width: 100%">
                        <el-table-column type="index"></el-table-column> 
                        <el-table-column v-for="item in tableProp" :width="item.width" :key="item.id" :label="item.label" :prop="item.prop" >
                            <template slot-scope="scope">
                                <!-- &chi; -->
                                <div v-html="scope.row[item.prop]?'&radic;':''" v-if="item.prop == 'privacy'" ></div>
                                <div v-else-if="item.prop== 'teacherPriority'" >{{scope.row[item.prop] | formaterPriority('teacherName')}}</div>
                                <div v-else-if="item.prop== 'areaPriority'" >{{scope.row[item.prop]  | formaterPriority('areaName')}}</div>
                                <div v-else >{{scope.row[item.prop]}}</div>
                            </template>    
                              
                        </el-table-column> 
                        <el-table-column fixed="right" label="操作" width="280">
                            <template slot-scope="scope">
                                <el-button type="text" size="small">插入</el-button>
                                <el-button type="text" size="small">编辑</el-button>
                                <el-button type="text" size="small" @click="dialogVisible.teacherVisible = true;formInline.courseContentId=scope.row.id">老师优先级</el-button>
                                <el-button type="text" size="small" @click="dialogVisible.areaVisile = true;formInline.courseContentId=scope.row.id">场地优先级</el-button>
                                <el-button type="text" size="small" @click="deleteCourseContent(scope.row)" style="color:red">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>

        <el-dialog width="600" :visible.sync="dialogVisible.teacherVisible" :before-close="handleClose"  title="老师优先级设置" :modal-append-to-body="false">
            <teacherPrioritySetting ref="teacherPrioritySetting" @onchange="teacherPrioritySelected"></teacherPrioritySetting>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.teacherVisible = false">取 消</el-button>
                <el-button type="primary" @click="teacherPriorityUpdate()">确 定</el-button>
            </span>

        </el-dialog>

        <el-dialog width="600" :visible.sync="dialogVisible.areaVisile" :before-close="handleClose"  title="场地优先级设置"  :modal-append-to-body="false">
            <placePrioritySetting ref="placePrioritySetting" @onchange="areaPrioritySelected"></placePrioritySetting>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.areaVisile = false">取 消</el-button>
                <el-button type="primary" @click="areaPriorityUpdate()">确 定</el-button>
            </span>

        </el-dialog> 

	</section>

    
</template>
<script>
    import util from '@/util';
    import teacherPrioritySetting from '../../educational_admin/components/teacher_priority_setting_componment';
    import placePrioritySetting from '../../educational_admin/components/place_priority_setting_componment';
	const TYPE='course_content';
    const REMARK='学期课程内容库';
	export default {
        name:TYPE,
        components: {
            teacherPrioritySetting,
            placePrioritySetting
        },
        props: {
            courseId: {
                value: Number,
                default: 0
            },
            yearId: {
                value: Number,
                default: 0
            },
            platformId: {
                value: Number,
                default: 0
            },
            majorName: {
                value: String,
                default: ''
            },
            terms: {
                value: Array,
                    default: function () {
                    return [];
                }
            }
        },
		data(){
            return {
                breadcrumb: [
                    {label: "教学管理"},
                    {label: "学期课程库",path:'/teaching_management/class_course'}, 
                    {label: REMARK}
                ],
                formInline:{
                    semester_name:'',
                    course_arrange:''
                },
                tableProp:[ //表格属性列定义 
                    { label:'课程内容',prop:'content',width:250},
                    // { label:'适用专业',prop:'majorNames',width:'150'},
                    { label:'授课形式',prop:'teachingFormName'},
                    { label:'学时',prop:'learningHour',width:60},
                    { label:'科室',prop:'adminDepartmentName'},
                    { label:'老师优先级',prop:'teacherPriority',width:'150'},
                    { label:'场地优先级',prop:'areaPriority',width:'150'},
                    { label:'最多人数',prop:'',width:100},
                    { label:'是否有隐私',prop:'privacy'},
                    { label:'知识点',prop:'knowledgePoints'},
                ],
                courseContentData:[],
                tableLoading:false,
                dialogVisible:{//设置老师场地科室
                    teacherVisible: false,
                    areaVisile: false 
                },
                teacherSelected:[],
                areaSelected:[]
            }
        },
        mounted(){
            let self = this;
            self.formInline = self.$route.query;
            //加载内容库数据
            self.loadCourseCotent();
        },
        filters:{
            formaterPriority(value,type){
                if(value){
                    let priority = JSON.parse(value);
                    if(typeof priority == 'object'){
                        if( typeof priority.length == 'number' ){
                            let names = priority.map(item=>item[type]);
                            return names.join('/');
                        } 
                    } 
 
                }
                
            }
        },
        computed: {
            
        },
        created(){
            let self = this;
           
        },methods:{
            loadCourseCotent(){
                let self = this;
                self.tableLoading = true;
                self.$http.get("_ed:/semestercourse/content/"+self.formInline.id).then(res=>{
                    if(res.code == 0){
                        self.courseContentData = res.data;
                        self.tableLoading = false;
                    }
                })
            },
            deleteCourseContent(row){
                let self = this;
                self.$http.delete("_ed:/semestercourse/content/delete/"+row.id).then(res=>{
                    if(res.code == 0){
                         self.loadCourseCotent();
                    }
                })
            }, 
            handleClose(done){
                let self = this;
                self.$confirm('确认关闭？').then(_ => {
                        done();
                }).catch(_ => {});
            },
            areaPrioritySelected(val) {
                this.areaSelected = [].concat(val);
            },

            teacherPrioritySelected(val) {
                this.teacherSelected = [].concat(val);
            },
            refresh(){
                let self = this;
                self.loadCourseCotent();
            },
            setPriority(type,data){//设置优先级
               let self = this;
               let params = {
                   id:self.formInline.courseContentId,
                   type:type,
                   data:data
               }
               self.$http.put('_ed:/semestercourse/setPriority',params).then(res =>{
                    if(res.code == 0){
                        self.$message.success('设置成功');
                        //关闭圣诞框
                        self.dialogVisible.areaVisile = false;
                        self.dialogVisible.teacherVisible = false;
                        self.refresh();
                    }else{
                        self.$message.error(res.msg);
                    }
               }).catch(err => {
                   console.error('请求出错,请检查');
               });
                

            },
            teacherPriorityUpdate() {//老师优先级
                let self = this;
                if(!self.teacherSelected || self.teacherSelected.length < 0){
                    // this.$message.war('设置成功');
                    self.$message.warning('请添加老师数据');
                    return ;
                }
                self.setPriority(1,self.teacherSelected);
               
            },

            areaPriorityUpdate() {//场地优先级
               let self = this;
                if(!self.areaSelected || self.areaSelected.length < 0){
                    // this.$message.war('设置成功');
                    self.$message.warning('请添加场地数据');
                    return ;
                }
                self.setPriority(2,self.areaSelected);
            }
        }
    }
</script>

