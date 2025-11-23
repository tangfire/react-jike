// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit'
import {request} from "@/utils/request.jsx";
import {setToken as _setToken, getToken, removeToken} from "@/utils";
import {loginAPI,getProfileAPI} from "@/apis/user.jsx";

export const userStore = createSlice({
    name: 'user',
    initialState: {
        token: getToken() || '',
        userInfo: {}
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            // localstorage存一份
            _setToken(action.payload)
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload
        },
        clearUserInfo(state) {
            state.userInfo = {}
            state.token = ''
            removeToken()
        }
    }
})
// 每个 case reducer 函数会生成对应的 Action creators
const {setToken,setUserInfo,clearUserInfo} = userStore.actions

// 异步方法 完成登录获取token
const fetchLogin = (loginForm) => {
    return async (dispatch)=>{
        // 1. 发送异步请求
         const res = await loginAPI(loginForm);
        // 2. 提交同步action进行token的存入
        dispatch(setToken(res.data.data.token))
    }
}

// 获取个人用户信息异步方法
const fetchUserInfo = () => {
    return async (dispatch)=>{
        const res = await getProfileAPI()
        dispatch(setUserInfo(res.data.data))
    }
}

export {fetchLogin,setToken,fetchUserInfo,clearUserInfo}


export default userStore.reducer