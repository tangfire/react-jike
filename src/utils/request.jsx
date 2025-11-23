// axios的封装处理
import axios from "axios";
import {getToken, removeToken} from "@/utils/token.jsx";
import router from "@/router/index.jsx";
// 1. 根域名配置

// 2. 超时时间

// 3. 请求拦截器 / 响应拦截器

const request = axios.create({
    baseURL: "http://127.0.0.1:8001/v1",
    timeout: 5000,
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 1. 获取token
    // 2. 按照后端的格式要求做token拼接
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 监控401 token失效
    // console.dir(error);
    if (error.response.status === 401) {
        removeToken()
        router.navigate('/login').then(() => {
            window.location.reload();
        })


    }
    return Promise.reject(error);
});

export {request};