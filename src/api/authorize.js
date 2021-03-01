import * as API from './API'
import util from '../util'
import store from '@/store/index'

let Authorize = {};
var permissionMap = {};
var roleMap = {};

// 用户登录
Authorize.login = function (username, password,type) {
    return API.POST('_auth:authorize/login', {
        username: username,
        password: password,
        token_type: 'jwt',
        type: type
    }).then((response) => {
        if (response.status == 200) {
            util.setStorage('loginState', 'login');
            util.setStorage('loginId', response.result.userId);
            util.setStorage('token', response.result.token);
            return true;
        }
        return false;
    }).catch((error) => {
        return false;
    })
};

// 用户退出
Authorize.logout = function() {
    util.removeStorage("loginState");
    util.removeStorage("loginId");
    util.removeStorage("token");
//  store.commit('me', {});
    return API.GET('_auth:authorize/login-out').then((response) => {
        return true;
    }).catch(error => {
        return true;
    });
}



// 获取当前登录用户信息
Authorize.me = function () {
    return API.GET('_auth:authorize/me').then((response) => {
        if (response.status == 200) {
//          store.commit('me', response.result);
            response.result.permissions.forEach(element => {
                permissionMap[element.id] = element;
            });
            response.result.roles.forEach(element => {
                roleMap[element.id] = element;
            });
            return response.result;
        }
    }).catch(error => {
        return null;
    });
}

// 获取当前登录用户的所拥有的菜单
Authorize.getMyMenu = function() {
    return API.GET('_auth:/menu/user-own/tree').then((response) => {
        if (response.status == 200) {
//          store.commit('initMenu', response.result);
            return response.result;
        }
        return null;
    }).catch(error => {
        return null;
    });
}

// 判断用户是否有特定权限
Authorize.hasPermission = function () {
    if (arguments.length == 0) return true;
    var permission = arguments[0];
    // 用户特有权限
    var per = permissionMap[permission];
    if (!per) return false;
    if (arguments.length === 1) return true;
    for (var i = 1; i < arguments.length; i++) {
        if (per.actions.indexOf(arguments[i]) !== -1) {
            return true;
        }
    }
    return false;
}

// 判断用户是否满足角色权限
Authorize.hasRole = function() {
    for (var i = 1; i < arguments.length; i++) {
        if (roleMap[arguments[i]]) return true;
    }
    return false;
}

// 判断用户是否有特定字段的数据权限
Authorize.hasFieldAccess = function() {
    if (arguments.length === 0) return true;
    var permission = arguments[0];
    var per = permissionMap[permission];
    if (!per) return false;
    var access = true;
    if (arguments.length !== 3) return true;
    var arg = arguments;
    per.dataAccesses.forEach(element => {
        if (element.type === 'DENY_FIELDS' && element.action === arg[1]) {
            if (element.fields && element.fields.indexOf(arg[2]) !== -1) {
                access = false;
            }
        }
    });
    return access;
}


export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$authorize', { value: Authorize });
    }
};