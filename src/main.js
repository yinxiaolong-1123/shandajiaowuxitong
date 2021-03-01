import Vue from 'vue'
import store from './store/index'
import Axios from './util/axios.js'
import Axios2 from './util/axios2.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Authorize from '@/api/authorize'
// import './mock'//模拟数据
// import util from './util';
import App from './app.vue'
import router from './router'
import util from "./util"
import ElBigdataTable from '@/components/vue-element-bigdata-table';
// import Print from 'vue-print-nb'
import Print from '@/plugs/print'
import VueCookies from 'vue-cookies'
import md5 from 'js-md5';
import yearPicker from '@/components/yearpicker';

Vue.use(VueCookies)
    // import store from "./store"
    // import ApiGateway from '@/api/api_gateway'

var $ = require("jquery");

Vue.use(Axios);
Vue.use(Axios2);
Vue.use(Authorize);
Vue.use(ElementUI);
Vue.use(ElBigdataTable);
// Vue.use(ApiGateway);
Vue.use(Print);
Vue.use(yearPicker);
Vue.config.productionTip = false;
//配置动态路由
let loginState = util.getStorage('loginState'); //获取登录状态
let menuList = JSON.parse(util.getStorage('menuList')); //登录成功返回的菜单
let menuRouter = JSON.parse(util.getStorage('menuRouter')); //登录成功返回的菜单
let loginId = util.getStorage('loginId'); //登录成功返回的菜单
let loadRouter = [];
//如果有缓存的话：登录后的页面直接刷新
if (menuList && menuRouter) {
    store.commit('initMenu', menuList);
    store.commit('initRouter', menuRouter);
    loadRouter = menuRouter;
}

const title = '';
//全局 前置钩子
router.beforeEach((to, from, next) => {

    //根据登录用户拿到用户存储的page pagesize 信息 
    // let key = md5(loginId + to.fullPath);
    // let currData = VueCookies.get(key);
    // if(currData){
    //     to.query['page'] = currData.page;
    //     to.query['pageSize'] = currData.pageSize;
    //     to.query['first'] = true;
    // }

    let str = title;
    if (to.query.token) {
        let token = to.query.token;
        util.setStorage('token', token);

        if (to.meta.title) {
            str += ' - ' + to.meta.title;
        }
    }
    document.title = str;

    // console.log(router.params,to,from)
    next();
});

//全局 后置钩子
router.afterEach(() => {
    setTimeout(() => {
        store.commit('loadingState', false);
    }, 200)
});


const app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

//
// //为html设置正确的lang属性:中文-简体
// document.documentElement.lang='zh-CN';

export { app, router, store }