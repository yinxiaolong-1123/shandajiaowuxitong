import axios from 'axios';
import { Message } from "element-ui";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '';
axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
})
// 请求拦截器，为GET请求动态添加时间戳
axios.interceptors.request.use((config) => {
	if(!(process.env.NODE_ENV=="development")){
		let urlType = config.url.split(':')[0];
		if (urlType === "_auth") {
	       config.baseURL = '/api/platform/';
	       config.url = config.url.substring(6, config.url.length)
	   	}else  if (urlType === "_op") {
	       config.baseURL = '/operation/data/admin/';
	       config.url = config.url.substring(4, config.url.length)
	   	} else if (urlType === "_ed") {
           config.baseURL = '/edu/admin/';
           config.url = config.url.substring(4, config.url.length)
      } 
	}
	
    // 添加token
    if (localStorage.getItem('token')) {
        config.headers.Authorization = localStorage.getItem('token')
    }
    //如果是get请求，则加上时间戳（到分钟）
    if (config.method.toLocaleLowerCase() === 'get') {
        //设定一分钟更新一次时间戳
        let timeStamp = `t=${parseInt(new Date().getTime()/(1000 * 60))}`;
        if (config.url.indexOf('?') > -1) {
            timeStamp = '&' + timeStamp;
        } else {
            timeStamp = '?' + timeStamp;
        }
        config.url += timeStamp;
    }
    return config;
}, error => {
    Message({
        showClose: true,
        message: error,
        type: 'error'
    });
    return Promise.reject(error);
});

// 响应拦截器，处理常见错误
axios.interceptors.response.use((response) => {
    if (response.result) {
        if (response.result.status != 200) {
            Message({
                showClose: true,
                message: response.result.message,
                type: 'warning'
            });
        }
        return response.result;
    }
    return response;
}, error => {
    if (error && error.response) {
        if (error.response.data && error.response.data.message) {
            error.message = error.response.data.message;
        }
    }
    Message({
        showClose: true,
        message: error.message,
        type: "error"
    });
    return Promise.reject(error);
});

export const POST = (url, parameters) => {
    return axios.post(url, parameters).then(res => res.data);
}

export const GET = (url, parameters) => {
    return axios.get(url, parameters).then(res => res.data);
}

export const DELETE = (url, parameters) => {
    return axios.delete(url, parameters).then(res => res.data);
}

export const PUT = (url, parameters) => {
    return axios.put(url, parameters).then(res => res.data);
}

export const PATCH = (url, parameters) => {
    return axios.patch(url, parameters).then(res => res.data);
}