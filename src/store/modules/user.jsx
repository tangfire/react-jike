// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit'
import {request} from "@/utils/request.jsx";
import {setToken as _setToken,getToken} from "@/utils";

export const userStore = createSlice({
    name: 'user',
    initialState: {
        token: getToken() || '',
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            // localstorage存一份
            _setToken(action.payload)
        }
    }
})
// 每个 case reducer 函数会生成对应的 Action creators
const {setToken} = userStore.actions

// 异步方法 完成登录获取token
const fetchLogin = (loginForm) => {
    return async (dispatch)=>{
        // 1. 发送异步请求
         const res = await request.post('/authorizations', loginForm);
        // 2. 提交同步action进行token的存入
        dispatch(setToken(res.data.data.token))
    }
}

export {fetchLogin,setToken}


export default userStore.reducer