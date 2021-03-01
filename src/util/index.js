// import { MessageBox } from "element-ui";
// import router from "../router";
import store from '../store/index.js'

let baseUrl = '';
if (process.env.NODE_ENV === 'production') {
    baseUrl = '';
} else {
    baseUrl = '';
}

let setTitle = titletext => {
    document.title = titletext
};
let setStorage = (name, val) => {
    localStorage.setItem(name, val);
};
let getStorage = name => {
    return localStorage.getItem(name);
};
let removeStorage = name => {
    localStorage.removeItem(name);
};

let getCookie = name => {
    //获取cookie
    let arr = document.cookie.split("; ");
    for (let i = 0; i < arr.length; i++) {
        let _arr = arr[i].split("=");
        if (_arr[0] === name) {
            return _arr[1];
        }
    }
    return "";
};
let setCookie = (name, value, iDay = 3) => {
    //设置cookie，默认保存7天
    let oDate = new Date();
    if (iDay > 10) {
        oDate.setMinutes(oDate.getMinutes() + iDay);
    } else {
        document.cookie = name
        oDate.setDate(oDate.getDate() + iDay);
    } + "=" + value + ";expires=" + oDate + ";Path=/";
};
let removeCookie = name => {
    //删除cookie
    setCookie(name, "", -1);
};
// let userIdData = id => {
//     util.setStorage('loginId', result.data.teacher.id);
// }

//如果localStorage不存在的话，转移存储到cookie
if (!localStorage) {
    getStorage = getCookie;
    setStorage = setCookie;
    removeStorage = removeCookie;
}

let createForm = (data, url, name) => {
    let $iframe = document.createElement('iframe');
    $iframe.setAttribute('name', name);
    $iframe.setAttribute('style', 'display:none');
    document.body.appendChild($iframe);

    let $form = document.createElement('form');
    $form.setAttribute('target', name);
    $form.setAttribute('action', url);
    $form.setAttribute('method', "GET");
    $form.setAttribute('enctype', "application/x-www-form-urlencoded");
    $form.setAttribute('style', 'display:none');
    document.body.appendChild($form);

    let $content = document.createElement('input');
    $content.setAttribute('type', 'hidden');
    $content.setAttribute('name', '_form_body');
    $form.appendChild($content);

    $content.val(
        JSON.stringify({
            "1": data
        })
    );
    $form.submit();
};

//导出
let exportExcel = data => {
    let url = baseUrl + "/export/exportExcel";
    let name = "download_name" + new Date().getTime();
    createForm(data, url, name)
};
let exportWord = data => {
    let url = baseUrl + "/export/exportWord";
    let name = "download_name" + new Date().getTime();
    createForm(data, url, name)
};
//页面宽高发生变化
let resize = self => {
    let tar = self.$refs.formDetail;
    if (tar) {
        let width = tar.offsetWidth - 30;
        let childswidth = 0;

        let childs = tar.childNodes;
      
        for (let i = 0; i < childs.length; i++) {

            if (childs[i].className === "form.el-form.el-form--inline" || childs[i].className === "el-form-item el-form-item--mini" || childs[i].className === "el-form-item is-required el-form-item--mini" || childs[i].className) {

                childswidth += childs[i].offsetWidth;
            }
        }
        self.fold.showBtn = childswidth > width;
    }
};

//触发页面大小改变事件
let trigger = (element, event) => {
    //IE
    if (document.all) {
        element[event]();
    }
    // 其它浏览器
    else {
        let e = document.createEvent("Event");
        e.initEvent(event, true, true);
        //这里触发行为
        element.dispatchEvent(e);
    }
};
let clone = (obj) => {
    // Handle the 3 simple types, and null or undefined or function
    if (null === obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array or Object
    if (obj instanceof Array || obj instanceof Object) {
        let copy = (obj instanceof Array) ? [] : {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to clone obj! Its type isn't supported.");
};

let cloneObj = obj => JSON.parse(JSON.stringify(obj));

//获取路由
let generateRoutesFromMenu = (menu = [], routes = []) => {
    for (let i = 0, l = menu.length; i < l; i++) {
        let item = menu[i];
        if (item.path) {
            routes.push(item)
        }
        if (!item.component) {
            let index = item.path.indexOf('/:');
            let path = index === -1 ? item.path : item.path.substr(0, index);
            // item.component = resolve => require([`@/views/${item.type}${path}.vue`], resolve);
            item.component = resolve => require.ensure([], () => resolve(require(`@/views/${item.type}${path}.vue`)));
            // item.component = ()=>import(`@/views/${item.type}${path}.vue`);
            generateRoutesFromMenu(item.children, routes)
        }
    }
    return routes
};
let clearLogin = (self) => {
    removeStorage('loginId');
    removeStorage('loginName');
    removeStorage('token');
    //  removeStorage('menuRouter');
    //同时清空路由和菜单
    store.commit('initMenu', []);
    //  store.commit('initRouter',[]);
    //清空路由
    self.$router.options.routes = [];
};
let getExtend = (extend) => {
    let val = {};
    if (extend) {
        val = typeof extend === 'string' ? JSON.parse(extend) : extend;
    }
    return val;
};
let getExtendItem = (val) => {
    if (val.extend && val.extend.value) {
        let obj = getExtend(val.extend.value);
        if (obj) {
            for (let key of Object.keys(obj)) {
                val[key] = obj[key];
            }
            val.extend = obj;
        }
    }
    return val;
};

const timeType = {
    // var myDate = new Date();
    // myDate.getYear();        //获取当前年份(2位)
    // myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    // myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    // myDate.getDate();        //获取当前日(1-31)
    // myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
    // myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
    // myDate.getHours();       //获取当前小时数(0-23)
    // myDate.getMinutes();     //获取当前分钟数(0-59)
    // myDate.getSeconds();     //获取当前秒数(0-59)
    // myDate.getMilliseconds();    //获取当前毫秒数(0-999)
    // myDate.toLocaleDateString();     //获取当前日期
    // var mytime=myDate.toLocaleTimeString();     //获取当前时间
    // myDate.toLocaleString( );        //获取日期与时间
    YMD: ['getFullYear', 'getMonth', 'getDate'],
    connect(connect, item) {
        if (connect !== 'chinese') {
            return connect;
        } else {
            return this[item];
        }
    },
    getFullYear: '年',
    getMonth: '月',
    getDate: '日',
};
let getTime = (time, connect = 'chinese', type = 'YMD') => {
    if (time) {
        time = Number(time);
        if (isNaN(time)) {
            return '';
        }
    } else {
        time = new Date().getTime();
    }
    let date = new Date(time);
    let func = timeType[type];
    let result = '';
    for (let i = 0, len = func.length; i < len; i++) {
        let value = date[func[i]]();
        if (func[i] === 'getMonth' || func[i] === 'getDay') {
            value++;
        }

        if (i !== len - 1 || connect === 'chinese') {
            result += value + timeType.connect(connect, func[i]);
        } else {
            result += value;
        }
    }
    return result;
};
const timeType1 = {
    YMD: ['getFullYear', 'getMonth', 'getDate'],
    connect(connect, item) {
        if (connect !== 'chinese') {
            return connect;
        } else {
            return this[item];
        }
    },
    getFullYear: '-',
    getMonth: '-',
    getDate: '',
};
let getTime1 = (time, connect = 'chinese', type = 'YMD') => {
    time = Number(time);
    if (isNaN(time)) {
        return '';
    }
    let date = new Date(time);
    let func = timeType1[type];
    let result = '';
    for (let i = 0, len = func.length; i < len; i++) {
        let value = date[func[i]]();
        if (func[i] === 'getMonth' || func[i] === 'getDay') {
            value++;
        }

        if (i !== len - 1 || connect === 'chinese') {
            result += (value < 10 ? ('0' + value) : value) + timeType1.connect(connect, func[i]);
        } else {
            result += (value < 10 ? ('0' + value) : value);
        }
    }
    return result;
};

let commonRules = (msg, type = 'blur') => {
    return {
        required: true,
        message: '请' + (type.indexOf('change') !== -1 ? '选择' : '填写') + msg,
        trigger: type
    }
};
//统一化:必须是个函数，否则就违背工具js的原则   //状态下拉框数据
let status = () => [{
        id: 0,
        name: '禁用'
    },
    {
        id: 1,
        name: '启用'
    },
];

let stampType = {
    'minutes': 1000 * 60,
};
let timeStamp = (str = 'minutes') => {
    return parseInt(new Date().getTime() / stampType[str]);
};

//使用策略模式，一一对应，便于扩展
const rules = {
    number: {
        reg: /[0-9]{1,10}/g,
        msg: '必须是数字，且最多只能为10个'
    }
};
//返回element-ui可用的验证函数
let rulesFunc = (type) => {
    let regs = new RegExp(rules[type].reg);
    return (rule, value, callback) => {
        if (!regs.test(value)) {
            callback(new Error(rules[type].msg));
        } else {
            callback();
        }
    };
};

let openBtnPermit = (obj) => {
    for (let item in obj) {
        obj[item] = true;
    }
}

// 节流函数
let fnThrottle = (fn, delay, atleast) => {
    let timer = null
    let previous = null
    return function() {
        let now = +new Date()
        if (!previous) previous = now
        if (atleast && now - previous > atleast) {
            fn()
            previous = now
            clearTimeout(timer)
        } else {
            clearTimeout(timer)
            timer = setTimeout(function() {
                fn()
                previous = null
            }, delay)
        }
    }
}

// 树转数组
let tree2Array = (tree, key) => {
        return tree.reduce(function f(con, item) {
            con.push(item);
            if (item[key] && item[key].length > 0) {
                item[key].reduce(f, con);
            }
            return con;
        }, []).map(i => {
            i[key] = [];
            return i;
        });
    }
    // let tree2Array = (tree, key) => {
    //     return tree.reduce((con, item) => {
    //         var callee = arguments.callee;
    //         con.push(item);
    //         if (item[key] && item[key].length > 0) {
    //             item[key].reduce(callee, con);
    //         }
    //         return con;
    //     }, []).map(i => {
    //         i[key] = [];
    //         return i;
    //     });
    // }
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// UUID
let uuid = function() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

let cnTime = function() {
    return getTime();

}

let enTime = function() {
    var dt = new Date();
    var m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec");
    var w = new Array("Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    var d = new Array("st", "nd", "rd", "th");
    let mn = dt.getMonth();
    let wn = dt.getDay();
    let dn = dt.getDate();
    var dns;
    if (((dn % 10) < 1) || ((dn % 10) > 3)) {
        dns = d[3];
    } else {
        dns = d[(dn % 10) - 1];
        if ((dn == 11) || (dn == 12)) {
            dns = d[3];
        }
    }
    return m[mn] + " " + dn + dns + " " + w[wn - 1] + " " + dt.getFullYear();
}


export default {
    getCookie,
    getStorage,
    removeCookie,
    removeStorage,
    setCookie,
    setStorage,
    setTitle,
    exportExcel,
    exportWord,
    resize,
    trigger,
    clone,
    generateRoutesFromMenu,
    clearLogin,
    getExtend,
    cloneObj,
    getExtendItem,
    // urlAddress,
    getTime,
    getTime1,
    cnTime,
    enTime,
    commonRules,
    status,
    timeStamp,
    rulesFunc,
    openBtnPermit,
    // userIdData,
    fnThrottle,
    tree2Array, // 树转数组的方法
    uuid,
}