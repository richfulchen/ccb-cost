// src/axios.js
import axios from 'axios'
import { Message, Notification } from 'element-ui' // 如果你使用 Element UI 或其他 UI 库，可以在这里导入消息提示组件

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/admin-api', // 从环境变量获取基础 URL
  timeout: 30000, // 设置超时时间
  withCredentials: true // 是否携带 cookie
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做一些事情，例如添加 token
    // const token = localStorage.getItem('token') // 从本地存储获取 token
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}` // 把 token 加入请求头
    // }
    console.log('请求地址：' + process.env.VUE_APP_BASE_API + config.url)
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  async res => {
    // 对响应数据做点什么
    let { data } = res
    console.log('响应数据：' + res.data.code)
    // 未设置状态码则默认成功状态
    // 二进制数据则直接返回，例如说 Excel 导出
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      // 注意：如果导出的响应为 json，说明可能失败了，不直接返回进行下载
      if (res.data.type !== 'application/json') {
        return res.data
      }
      data = await new Response(res.data).json()
    }
    const code = data.code || 200
    // 获取错误信息
    const msg = data.msg || '系统未知错误，请反馈给管理员'
    console.log('响应数据：' + data)
    if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code === 501) {
      Message({
        type: 'error',
        duration: 0,
        message: msg
      })
      return Promise.reject(new Error(msg))
    } else if (code === 901) {
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      if (msg === '无效的刷新令牌') { // hard coding：忽略这个提示，直接登出
        console.log(msg)
      } else {
        Notification.error({
          title: msg
        })
      }
      return Promise.reject(Error(msg))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error

    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    console.log('message', message)

    Notification.error({
      title: message
    })
    return Promise.reject(error)
  }
)

export default instance
