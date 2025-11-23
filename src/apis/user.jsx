// 用户相关的所有请求
import {request} from '@/utils/request.jsx'
// 1. 登录请求
export function loginAPI(formData) {
    return request({
        method: 'POST',
        url: '/authorizations',
        data: formData,
    })
}

// 2. 获取用户信息
export function getProfileAPI() {
    return request({
        method: 'GET',
        url: '/user/profile',
    })
}