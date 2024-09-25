import axios from 'axios'
import { getCookie } from '@/utils/common'

// 假设你已经获取到了登录后的 Cookie
const loginCookies = {
  authToken: getCookie('authToken')
}

// 创建一个 接口校验方法
export function checkVerify () {
  // 发送 POST 请求
  return axios.post('http://api.bssmgt.yuncpt.ccb.com/uop/auth/user/validLogin', {
    loginCookies: loginCookies
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
