<template>
    <div class="full-size">
        <app-canvas></app-canvas>
        <div class="lg-content full-size">
            <div class="lg-introduction">
                <img src="img/school.png" alt="">
            </div>
            <div class="lg-detail">
                <!-- <div class="right-tip">
                    <el-button type="primary" size="mini" class="tip-btn"
                               @click="showCode = !showCode"
                               @blur.native="showCode = false"
                               round>
                        <span class="txt">app下载</span>
                        <i class="qr-code"></i>
                    </el-button>
                    <el-collapse-transition>
                        <div v-show="showCode" class="code-con">
                            <img src="img/qr-code.png" alt="">
                            <p>扫描下载 明日良医App</p>
                        </div>
                    </el-collapse-transition>
                </div> -->
                <h1 class="system-title">汕大智能教务管理系统</h1>
                <div class="sys-detail">
                    <el-input
                    	@keyup.enter.native="onSubmit"
                        class="detail-item"
                        placeholder="请输入学号/工号"
                        v-model="accountNo"
                        autofocus
                        clearable>
                    </el-input>
                    <el-input
                    	@keyup.enter.native="onSubmit"
                        class="detail-item"
                        placeholder="请输入密码"
                        type="password"
                        v-model="password"
                        clearable>
                    </el-input>
                    <div class="detail-item">
                        <el-button type="primary" style = "width:100%" @click="onSubmit">登录</el-button>
                         <a href="../../../template/chrome_v72.0.3626.121.exe" download="chrome_v72.0.3626.121.exe">下载最新chrome浏览器</a>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog
                :title="dialog.title"
                :visible.sync="dialog.visible"
                :close-on-click-modal="false"
                width="60%">
                <div class="roleSelect">
                    <div v-for="(item,index) in role" class="item" :key="index">
                        <el-radio v-model="roleRadio" :label="item.label">{{item.name}}</el-radio>
                    </div>
                </div>
                <p slot="footer" class="dialog-footer">
                    <el-button @click="dialog.visible = false">取 消</el-button>
                    <el-button type="primary" @click="sureJump">确 定</el-button>
                </p>
        </el-dialog>
    </div>
</template>

<script>
    import appCanvas from '../../components/BackgroundCanvas'
    import { mapState, mapActions, mapMutations } from "vuex";
    import util from '../../util'
    import crypto  from "crypto"
    export default {
        name: "login",
        components:{
            appCanvas
        },
        data(){
            return{
                accountNo:'',
                password:'',
                showCode:false,
                dialog:{
                    title:'请选择登录角色',
                    visible:false,
                },
                roleRadio:'',
                role:[]
            }
        },
        methods:{
            ...mapMutations(["setupMe"]),
           onSubmit(){
            	var md5 = crypto.createHash('md5');

                this.$http.post('_auths:authorize/login',{
               
                    username:this.accountNo,
                    password:this.password,
                    type: 'staffNo',
                    token_type: 'jwt'
                }).then(result=>{
	                
                    
                    if (result.status == 200) {
                        let token = result.result.token;

                        util.setStorage('loginState','login');
                        util.setStorage('loginId',result.result.userId);
                        util.setStorage('loginName',result.result.userName);
                        util.setStorage('token',token);

                        this.$http.get('_auths:authorize/me').then(me_resp => {
                            let r = me_resp.result.attributes
                            if(r.login_info){
                                let b = r.login_info
                                util.setStorage('teacherId',b.id);
                            }

                            if(me_resp.result.roles && me_resp.result.roles.length){
                                let roles = [];
                                me_resp.result.roles.map(item => {
                                    roles.push(item.id)
                                })
                                util.setStorage('teacherRoles',roles.join(','));
                            }else{
                                util.setStorage('teacherRoles','');
                            }
                            
                            this.setupMe(me_resp.result);
                        })

                        this.$router.push({
                            path:'/login_page/index'
                        })
                    }

                }).catch(err => {
                    this.$message.error(err.response.data.message);  
                });
            },
            sureJump(){
            }
        },
        created(){
            util.clearLogin(this);
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    @import '../../assets/styles/func';
    @slide-m:8%;
    @r-slide:380px;
    .lg-content{
        position: @rel;
        z-index:100;
    }
    .lg-introduction{
        position: fixed;
        top:50%;
        left:@slide-m;
        .box;
        width:calc(100% - 2 * @slide-m - @r-slide - 1px);
        transform: translateY(-50%);
        img{
            width:100%;
            vertical-align: middle;
        }
    }
    .lg-detail{
        position: fixed;
        right:@slide-m;
        top:50%;
        transform: translateY(-50%);
        .box;
        padding:80px 10px;
        width:@r-slide;
        .bg-color();
        border:1px solid #ddd;
        .round();
        box-shadow:2px 2px 5px rgba(0,0,0,.5);
    }
    .system-title{
        color:@cm-blue;
        text-shadow:1px 2px rgba(17,140,227,.3);
        font-size:30px;
        .tx-center();
        margin-bottom:40px;
    }
    .sys-detail{
        .clear;
        margin:0 auto;
        /*width:calc(~'100vw * 360/1280 - 80px');*/
        width:@r-slide - 100px;
        padding:0 15px;
        .box;
        .detail-item{
            margin:10px auto;
        }
    }
    .right-tip{
        position: @abs;
        right:10px;
        top:10px;
    }
    .code-con{
        position: @abs;
        top:calc(100% + 10px);
        right:0;
        width:179px;
        padding:5px;
        border:1px solid #ddd;
        .round();
        .bg-color();
        overflow: hidden;
        z-index:200;
        .tx-center();
        img{
            width:100%;
            vertical-align: middle;
        }
    }
    .roleSelect{
        .clear;
        .item{
            float:left;
            margin-bottom:10px;
            min-width:110px;
        }
    }

</style>
