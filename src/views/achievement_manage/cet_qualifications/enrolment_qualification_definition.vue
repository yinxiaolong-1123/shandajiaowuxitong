<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="CET4资格设置" name="first" v-cloak>
                    <template>
                        <el-form ref="form" :model="form"  :rules="rules" label-width="150px">
                            <div class="outsideBox">
                                <span>1.报名时间规定:</span>
                                <el-form-item label="学生报名开始学期"  style="margin-bottom:30px" prop="semester" >
                                    <el-select v-model="form.semester" placeholder="全部"  >
                                      
                                        <el-option :label="item.value" :key="item.value" :value="item.label" v-for="item in gradeOption"></el-option>
                                   </el-select>
                                </el-form-item>
                                <span>2.历史CET4成绩规定:</span>
                                <el-form-item label="历史CET4成绩"  prop="fraction">
                                    <template>
                                        <span> &lt; </span> 
                                    </template>
                                    <el-input v-model="form.fraction" style="width:100px;margin-left:20px; "  ></el-input>  分
                                </el-form-item>
                                 <span>3.历史CET4成绩规定:</span>
                                 <el-form-item label="本次缺考，停考试"  style="margin-bottom:30px" prop="frequency" >
                                 
                                    <el-select v-model="form.frequency" placeholder="全部"  style="width:100px;"  >
                                      
                                        <el-option :label="item.value" :key="item.value" :value="item.label" v-for="item in lackNumber"></el-option>
                                   </el-select> 次
                                </el-form-item>
                                <div style="color:red;margin-top:20px;"> 注意：考生报名时要同时符合以上两种规定才能进行国家大学英语四级的报名</div>
                                <el-form-item style="margin-left:500px;margin-top:100px;">
                                    <el-button type="primary"  @click="setPreservation1('form')"  v-if="btnPerObj.save">保存</el-button>
                                </el-form-item>
                            </div>
                    </el-form>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="CET6资格设置" name="second">
                    <template>
                        <el-form ref="addForm" :model="addForm"  :rules="ruless" label-width="150px">
                            <div class="outsideBox">
                                <div>1.CET4成绩规定:</div>
                                <el-form-item label="历史CET4成绩" prop="fraction1" >
                                    <template>
                                        <span> &ge; </span>
                                    </template>
                                    <el-input v-model="addForm.fraction1" style="width:100px;margin-left:20px;"></el-input> 分
                                </el-form-item>
                                <div style="margin-top:20px;">2.历史CET6成绩规定:</div>
                                <el-form-item label="历史CET6成绩"  prop="fraction2">
                                    <template>
                                        <span> &lt; </span>
                                    </template>
                                    <el-input v-model="addForm.fraction2" style="width:100px;margin-left:20px;"></el-input> 分
                                </el-form-item>
                                <div style="margin-left:50px;margin-top:10px;">或</div>
                                <el-form-item label="历史CET6成绩"  prop="fraction3" >
                                    <template>
                                        <span> &ge; </span>
                                    </template>
                                    <el-input  v-model="addForm.fraction2"   style="width:100px;margin-left:20px;">425</el-input> 分  
                                </el-form-item>
                                
                                <div  class="boxStyle">
                                    <el-checkbox  v-model="checkList" style=" margin-left:80px" label="是否限制CET6考试次数" name="type"></el-checkbox>
                                        <template v-if="checkList==true" >
                                            <el-input v-model="addForm.fraction3"  style="width:100px;margin-left:20px;"></el-input>  次 
                                        </template>
                                </div>
                                 <div style="margin-top:20px;">3.历史CET6成绩规定:</div>
                                 <el-form-item label="本次缺考，停考试"  style="margin-bottom:30px" prop="frequency_six" >
                                    <el-select v-model="addForm.frequency_six" placeholder="全部"  style="width:100px;"  > 
                                        <el-option :label="item.value" :key="item.value" :value="item.label" v-for="item in lackNumber2"></el-option> 
                                   </el-select> 次
                                </el-form-item>
                                <div style="color:red;margin-top:20px;"> 注意：考生报名时要同时符合以上两种规定才能进行国家大学英语六级的报名</div>
                                <el-form-item style="margin-left:500px;margin-top:100px;">
                                    <el-button type="primary"  @click="setPreservation2('addForm')"  v-if="btnPerObj.save">保存</el-button>
                                </el-form-item>
                            </div>
                    </el-form>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </section>
</template>

<script>
    import util from '@/util';
    const regNum = /^[\d\/]+$/;//匹配数字跟斜杠

    import {mapState} from 'vuex';

    export default {
        data(){
            return {
                      //选择学期
                gradeOption:[//所在级
                    {label:1,value:"学期一"},
                    {label:2,value:"学期二"},
                    {label:3,value:"学期三"},
                    {label:4,value:"学期四"},
                    {label:5,value:"学期五"},
                    {label:6,value:"学期六"},
                    {label:7,value:"学期七"},
                    {label:8,value:"学期八"},
                    {label:9,value:"学期九"},
                ],
                lackNumber:[//缺考次数
                    {label:1,value:1},
                ],
                lackNumber2:[//缺考次数
                    {label:1,value:1},
                ],
                // 定义默认标签页  首页
                activeName: 'first',
                checkList:"",
                 form: {
                    semester:"",//学期
                    frequency:"1",//次数
                    fraction:"",//学分
                    fraction1: "",
                    fraction2: "",
                    frequency_six:"",//cet6缺考次数
                    fraction3: "",
                    type:"",
                    resource:true
                },
                addForm:{
                    fraction1: "",
                    fraction2: "",
                     frequency_six:"",//cet6缺考次数
                    fraction3: "",
                    // testLimitNum:"",
                    type:1
                },
                aaaaa:"",
                ECTDATA:[],
                 formLabelWidth: '300px',
                breadcrumb: [//面包屑
                    {label: "成绩管理"},
                    {label: "CET报名资格定义"},
                ],
                 type:'创建补缓考名单',
                rules:{
                     semester:[ { required: true, message: '请选择学期', trigger: 'change' }],
                     frequency:[ { required: true, message: '请选择缺考次数', trigger: 'change' }],
                     fraction:[{required: true, message: '请输入基础学分', trigger: 'change'},
                   ]
                },
                ruless:{
                    fraction1:[ { required: true, message: '请输入基础学分', trigger: 'change' }],
                    fraction2:[ { required: true, message: '请输入基础学分', trigger: 'change' }],
                    frequency_six:[ { required: true, message: '请输入缺考次数', trigger: 'change' }],
                   
                },
                fold:{
                    state:false,
                    text:'展开',
                    showBtn:false,
                },
                 btnPerObj:{//按钮权限
                  save:false,
                }

            }
        },
        created(){
            
            
        },
        computed:{
             
          
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
            };
         this.getCETData(0);
         
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();//按钮权限

        },
        filters:{
        },
        watch:{ 
        
        },
        methods:{
               //获取按钮权限
           getBtnPermit() {
                let self = this;
                let actionId=this.$route.query.actionId;
                this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
                    data.data.map(item => {
                        if (item.code=="query_baomingzigedingyi") {
                            self.btnPerObj.save=true;
                        }
                    });
                }).catch(()=>{
                })
            },
            // 获取原始定义数据
            getCETData(val){
                this.$http.post('_sc:/cetEnrollQualification/listCetEnrollQualification'
                ,{  
                    type: val,
                }).then(res =>{
                
                    if(res){
                            let num=null;
                            if (res.data[0].limitSwitch==0){
                                num=false;
                            }
                            if (res.data[0].limitSwitch==1){
                                num=true;
                            }
                            
                            res.data[0].limitSwitch=num
                            let that=this;
                            this.form.semester=res.data[0].termNum,
                            this.form.frequency=res.data[0].forbidTestLimitNum,//缺考次数
                            this.form.fraction=res.data[0].cet4QualifiedScore,
                            this.addForm.fraction1=res.data[0].cet4QualifiedScore,
                            this.addForm.fraction2=res.data[0].cet6QualifiedScore,
                            this.addForm.frequency_six=res.data[0].forbidTestLimitNum,//cet6缺考次数
                            this.addForm.fraction3=res.data[0].testLimitNum
                            this.checkList=res.data[0].limitSwitch
                        }
                    })
            },
            // 保存CET4考试资格定义数据
            setPreservation1(form){
                  	this.$refs.form.validate((valid) => {//表单校验
			        if (valid) {
                        this.$http.post("_sc:/cetEnrollQualification",{
                          termNum:this.form.semester ,
                          forbidTestLimitNum: this.form.frequency,
                          cet4QualifiedScore:JSON.parse(this.form.fraction),
                          type:"0"
                        }).then(res =>{
                            if (res.code=='10400'){
                                this.$message.warning(`${res.msg}`);
                            }else if(res.code==0){
                                this.$message.success('保存成功');
                            }
                        }).catch((error)=>{
                            this.$message.error(`${error.msg}`)
                        })
			        } else {
                        return false;
			        }
		        });
            },
            // 保存CET6考试资格定义数据   
            setPreservation2(addForm){
                  	this.$refs.addForm.validate((valid) => {//表单校验
			        if (valid) {
                        let newnum=null;
                        if (this.checkList==true){
                            newnum=1;
                        }
                        if (this.checkList==false){
                            newnum=0;
                        }
                        this.checkList=newnum;
                        this.$http.post("_sc:/cetEnrollQualification",{
                            cet6QualifiedScore:this.addForm.fraction2,
                            type:this.addForm.type,
                            forbidTestLimitNum:this.addForm.frequency_six,
                            cet4QualifiedScore:this.addForm.fraction1,
                            testLimitNum:this.addForm.fraction3,
                            limitSwitch:this.checkList
                        }).then(res =>{
                            if (res.code=='10400'){
                                this.$message.warning(`${res.msg}`);
                            }else if(res.code==0){
                                this.$message.success('保存成功');
                                let  newnum2=null;
                                if (this.checkList==0){
                                    newnum2=false;
                                }
                                if (this.checkList==1){
                                    newnum2=true;
                                }
                                this.checkList=newnum2;
                            }
                        }).catch((error)=>{
                            this.$message.error(`${error.msg}`)
                        })
			        } else {
                        return false;
			        }
		        });
            },
            // 页面切换
             handleClick(tab) {
                //  tab.name=this.aaaaa;
                if(tab.name=='first'){
                    this.form.type=0
                    this.getCETData(this.form.type);
                }
                if(tab.name=='second'){
                    this.form.type=1
                    this.getCETData(this.form.type);
                }
                this.newtype=this.form.type
               
              
            },
        }
    }
</script>
<style scoped>

    .cm-addGrade p{
        margin-bottom: 12px;
    }
    .box{
    border: 1px  solid  #e4e7ed;
    height: 700px;
    }
    .outsideBox{
    margin-top: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding:10px;
    min-height: 600px;
    }
    .importStyle{
        position: relative;
    }  
    .redStyle{
        position: absolute;
        color: red;
        position: relative;
        left: -115px;
        top: 1px;
    }
    .boxStyle{
        display: inline-block;
        margin-left: 241px;
        margin-top: -38px;
        position: absolute;

    }
</style>