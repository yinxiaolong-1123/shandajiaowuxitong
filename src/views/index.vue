<template>
    <el-container>
        <el-header height="50px" class="theme-head" v-if="nonav">
            <div class="custom-nav">
                <div class="nav-item">
                    <img class="logo" src="img/st_logo_1920.png" alt="">
                </div>
                <div class="nav-item">
                    <div class="nav-cell">
                        <img class="head-img" src="img/user.jpg" alt="" @click="changePassword()">
                    </div>
                    <div class="nav-cell">
                        {{loginName}}
                    </div>
                    <div class="nav-cell">
                        <el-button type="text" @click="signOut">退出</el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside class="cm-move" width="200px" style="max-height:92vh;" v-if="nonav">
                <el-scrollbar style="height:100%;">
                    <el-menu @select="menuSelect" :default-active=" $route.path "
                        class="menu-list cm-menu-vertical cm-scroll" style="border-right:none;" unique-opened
                        :router="true">
                        <el-submenu v-for="(item1,index1) in menuList" :key="index1" :index="index1.toString() ">
                            <template slot="title">
                                <span slot="title">{{item1.name}}</span>
                            </template>

                            <template v-for="(item2,index2) in item1.children">
                                <!-- <template v-if="item2.action"> -->
                                <template v-if="!item2.children||!item2.children.length">
                                    <!-- <el-menu-item :index="item2.action+'?actionId='+item2.id"> -->
                                    <!-- <el-menu-item :index="item2.url.split('#')[1]+'?permissionId='+item2.permissionId"> -->
                                    <el-menu-item :index="item2.url+'?permissionId='+item2.permissionId">
                                        {{item2.name}}
                                    </el-menu-item>
                                </template>
                                <template v-else>
                                    <el-submenu :index=" index1+'-'+index2 ">
                                        <span slot="title">{{item2.name}}</span>
                                        <!-- <el-menu-item  
                                        v-for="(item3,index3) in item2.children" 
                                        v-if="item3.action" 
                                        :key="index3"
                                        :index="item3.action+'?actionId='+item3.id">
                                        {{item3.name}}
                                    </el-menu-item> -->
                                        <el-menu-item v-for="(item3,index3) in item2.children"
                                            v-if="!item3.children||!item3.children.length" :key="index3"
                                            :index="item3.url+'?permissionId='+item3.permissionId">
                                            <i :class="item3.icon"></i>
                                            {{item3.name}}
                                        </el-menu-item>

                                    </el-submenu>
                                </template>
                            </template>
                        </el-submenu>
                    </el-menu>
                </el-scrollbar>
                
            </el-aside>
            <el-main class="cm-main" style=" padding: 0 0 20px 0">
                <router-view></router-view>
            </el-main>
        </el-container>

        <!-- 修改密码 -->
        <el-dialog title="修改密码" :visible.sync="changePasswordDialog" width="35%" :modal-append-to-body='false'>
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" style="padding-right:50px"
                label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm2.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="ruleForm2.newPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class="commitStyle">
                    <el-button style="margin-right:10px" type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                    <el-button @click="resetForms('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </el-container>

</template>

<script>
    import util from '@/util'
    import {
        mapState,
        mapActions,
        mapMutations
    } from 'vuex'

    export default {
        name: 'index',
        data() {
            // 旧密码校
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            // 新的密码输入校验
            var validatePass2 = (rule, value, callback) => {
                var x = /^[a-zA-Z0-9]{6,6}$/;
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!x.test(value)) {
                    callback(new Error('请输入6位数密码(包含大小写英文与数字组合)'));
                } else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            // 确定密码校验
            var validatePass3 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm2.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                // 定义密码表单数据
                ruleForm2: {
                    oldPassword: '',
                    newPass: '',
                    checkPass: '',
                },
                rules2: {
                    oldPass: [{
                        validator: validatePass1,
                        trigger: ['blur', 'change']
                    }],
                    newPass: [{
                        validator: validatePass2,
                        trigger: ['blur', 'change']
                    }],
                    checkPass: [{
                        validator: validatePass3,
                        trigger: ['blur', 'change']
                    }],

                },
                changePasswordDialog: false,
                loginName: '',
                bpList: [], //按钮权限数组
                nonav: false
            };
        },
        computed: {
            ...mapState(['menuList', 'btnPermitList'])
        },
        created() {
            
            let _this = this;
              if (process.env.NODE_ENV === "production") {
                        this.nonav = false
              }else{
                  this.nonav = true
              }
              console.debug(`nonav: ${this.nonav}`);
             
            if (this.$route.query.token != null) {
                let token = this.$route.query.token;
                util.setStorage('token', token);
            }

            let token = util.getStorage('token');
            this.loginName = util.getStorage('loginName');
            // if (!token) {
            //     this.$message.error('请重登录');
            //     this.$router.push({
            //         path: '/'
            //     });
            // }
            if (this.nonav) {
                // this.$http.get('_auth:/sysUserOrgDepartmentRole/privilege/eduAdminManager').then(result=>{
                this.$http.get('_auths:/menu/user-own/tree').then(result => {

                    // this.initMenu(result.data)
                    let teachMenuList = [];
                    let menus = [];
                    result.result.forEach(element => {
                        if (element.id === 'd016cde7b368fc28d4a8c77c92209f4') {
                            menus = element.children;
                        }
                    });

                    if (process.env.NODE_ENV === 'production') {
                        this.nonav = false
                        this.initMenu(orgMenuList);
                    } else { // 在开发环境截取地址path
                     this.nonav = true
                        let newMenuList = _this.splitMenuUrl(menus);
                        this.initMenu(newMenuList);
                    }
                });
            }
        },
        mounted() {

        },
        methods: {
            ...mapMutations(['initMenu', 'initBtnPermitList']),
            splitMenuUrl(orgMenu) {
                let newMenu = orgMenu;

                for (var i = 0; i < newMenu.length; i++) {
                    if (newMenu[i].url.indexOf('#') > -1) {
                        newMenu[i].url = newMenu[i].url.split('#')[1];
                    }

                    if (newMenu[i].children) {
                        this.splitMenuUrl(newMenu[i].children);
                    }
                }

                return newMenu;
            },
            // 提交修改密码  登录页面，点击头像重置密码
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('_op:user/password', {
                            oldPassword: this.ruleForm2.oldPassword,
                            password: this.ruleForm2.newPass,
                            optType: 1,
                            unionIds: [util.getStorage('loginId')],
                            userType: 1
                        }).then(data => {
                            if (data.code == 0) {
                                this.$message({
                                    message: '重置密码成功',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    this.signOut()
                                }, 1000)

                                this.changePasswordDialog = false;
                            }
                            if (data.code == 10008) {
                                this.$message.error("重置密码失败");
                            }
                        }).catch(() => {})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //  重置密码
            resetForms(formName) {
                this.$http.post('_op:user/password', {
                    optType: 2,
                    unionIds: [util.getStorage('loginId')],
                    userType: 1
                }).then(data => {
                    if (data.code == 0) {
                        this.$message({
                            message: '重置密码成功',
                            type: 'success'
                        });
                    }
                    if (data.code == 10008) {
                        this.$message.error("重置密码失败");
                    }
                }).catch(() => {

                })
            },

            signOut() {
                util.clearLogin;
                localStorage.removeItem( 'teacherId' );  
                this.$router.push({
                    path: '/'
                });
                this.$message.success('退出成功，请重新登录');
                location.reload();
            },
            changePassword() {
                this.changePasswordDialog = true;
            },
            menuSelect(url) {
                //              this.getBtnPermitList(url)
            },
            getBtnPermitList(url) {

                this.mapFn(this.menuList, url);

                this.initBtnPermitList(this.bpList)
            },
            mapFn(list, url) {
                let self = this;
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        for (let k = 0; k < list[i].children.length; k++) {
                            if (list[i].children[k].action == url) {
                                self.bpList = list[i].children[k].children
                            } else {
                                if (list[i].children[k].action && list[i].children[k] == 1) {
                                    self.mapFn(list[i].children[k].children, url)
                                }
                            }
                        }
                    }
                }
            }

        },
    };
</script>
<style>
  .cm-move .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
<style scoped lang="less">
    /*@import '../assets/styles/func';*/
    .theme-head {
        height: 50px;
        background-color: #1D8BE0;
        color: #fff;

    }

    .custom-nav {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .nav-item {
            display: flex;
            height: 100%;
            align-items: center;

            .logo {
                height: 41px;
                width: 163px;
            }

            .nav-cell {
                height: 100%;
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                font-size: 14px;

                .head-img {
                    height: 30px;
                    width: 30px;
                    border-radius: 50%;
                }

                .el-button {
                    color: #fff;
                    margin-left: 20px;
                }
            }
        }

    }


    .cm-move {
        transition: all .3s ease;
    }

    .cm-over-hide {
        overflow: hidden;

        &.el-aside {
            overflow-x: hidden;
        }
    }

    .menu-list:hover {
        &+.aside-btn {
            .btn {
                opacity: 1;
            }
        }
    }

    .cm-main {
        background-color: #fff;
        // padding: 0 20px 20px 0 !important;
    }

    /deep/.el-main {
        padding: 0;
    }

    //  element.style .passwordBox{
    //     margin-right: 50px;

    // }
    .commitStyle {
        margin-left: 80px;
    }

    /*.btn{
    position: fixed;
    top: 50%;
    left: 199px;
}*/

    /*.list {
    .flex-align-center;
    .list-item {
        .flex-align-center;
        min-width: 100px;
        height: 100%;
        justify-content: center;
        &:hover {
            .indent(5px);
            .list-link {
                color: #fff;
            }
        }
        &.active {
            background: linear-gradient(180deg, transparent, rgba(255, 255, 255, .35));
            .list-link {
                color: #fff;
            }
        }
    }
}

.list-link {
    color: #efefef;
    transition: all ease .3s;
    &:active {
        color: #efefef;
    }
}

.theme-section {
    height: calc(100% - 70px);
    .bg-color();
}

.menu-list {
    height: 100%;
}

.nav-right {
    .flex-align-center {
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
    .user-img {
        img {
            width: 50px;
            height: 50px;
            .round(50%);
            overflow: hidden;
        }
    }
}

@menu-width:200px;
.cm-menu-vertical:not(.el-menu--collapse) {
    width: @menu-width;
}
.cm-scroll {
    &.show-menu>li {
        width: calc(@menu-width - 14px);
    }
    &.hide-menu {
      min-width:78px;
    }
}

.compensate {
    padding-left: 10px;
}*/
</style>