import axios from "axios";
// import qs from "qs";
import { Message } from "element-ui";
// import router from "../router";
const Axios2 = axios.create({
  baseURL: "", // 因为我本地做了反向代理
  timeout: 30000,
  responseType: "blob",
  // withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  }
});



//POST传参序列化(添加请求拦截器)
Axios2.interceptors.request.use(config => {
  // config.headers.Access_Token = localStorage.getItem('token');
  config.headers.Authorization = localStorage.getItem('token') || ''; 
  
  /* _op深圳教学  _edu教务 根据xxx：判断不同服务 */
  if (process.env.NODE_ENV === 'production') {
      let urlType = config.url.split(':')[0];
      if (urlType === "_op") {
          config.baseURL = '/operation/data/admin/';
          config.url = config.url.substring(4, config.url.length)
      } else if (urlType === "_ed") {
          config.baseURL = '/edu/admin/';
          config.url = config.url.substring(4, config.url.length)
      } else if (urlType === "_auths") {
          config.baseURL = '/api/platform/';
          config.url = config.url.substring(7, config.url.length)
      } else if (urlType === "_auth") {
          config.baseURL = '/api/platform/';
          config.url = config.url.substring(7, config.url.length)
      } else if (urlType === "_sy") {
          config.baseURL = '/sync/tool/';
          config.url = config.url.substring(4, config.url.length)
      } else if (urlType === "_sc") {
          config.baseURL = '/score/management/';
          config.url = config.url.substring(4, config.url.length)
      } else if (urlType === "_as") {
          config.baseURL = '/auto/schedule/';
          config.url = config.url.substring(4, config.url.length)
      }
  }

  return config;
}, error => {
  Message({
    showClose: true,
    message: error,
    type: "error.data.error.message"
  });
  return Promise.reject(error.data.error.message);
});

//返回状态判断(添加响应拦截器)
Axios2.interceptors.response.use(
  res => {
    //对响应数据做些事

    if (res.data) {
      return res.data;
    }
    return res;
  },
  error => {

    if (error.response && error.response.status == 500) {
      // let message = error.response.data.message;
      // if(message.indexOf("401")!=-1){
      //     router.push({
      //         path: "/"
      //     });
      // }
    }

    // 返回 response 里的错误信息
    console.log(error);
    return Promise.reject(error);
  }
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$http2", { value: Axios2 });
  }
};