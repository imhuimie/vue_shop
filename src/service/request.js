import axios from 'axios';
import store from '../store';
import baseURL from '../config/index.js'; // 引入环境配置文件


axios.defaults.headers.post['Content-Type'] = 'application/json';
// 跨域设置
axios.defaults.withCredentials = true;

// 创建 axios 实例
const service = axios.create({
    baseURL: baseURL.baseUrl, // api 的 base_url
    timeout: 5000, // 请求超时时间
  });


  // 请求拦截器
service.interceptors.request.use(
    config => {
      // 可以在这里添加请求头等信息
      if (store.state.token) {
        config.headers['Authorization'] = `Bearer ${store.state.token}`;
      }
      return config;
    },
    error => {
      // 请求错误处理
      console.log(error); // for debug
      Promise.reject(error);
    },
  );

// 响应拦截器
service.interceptors.response.use(
    response => {
      // 可以在这里对响应数据进行处理
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    error => {
      // 响应错误处理
      console.log('err' + error); // for debug
      if (error.response.status) {
        return Promise.reject(error.response);
      }
    },
  );

// 封装 get 方法
export function get(url, params) {
    return new Promise((resolve, reject) => {
      service
       .get(url, {
          params: params,
        })
       .then((res) => {
          resolve(res.data);
        })
       .catch((err) => {
          reject(err.data);
        });
    });
  }
  
// 封装 post 方法
export function post(url, data) {
    return new Promise((resolve, reject) => {
      service.post(url, data)
       .then((res) => {
          resolve(res.data);
        })
       .catch((err) => {
          reject(err.data);
        });
    });
  }