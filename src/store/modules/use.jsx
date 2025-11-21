// 和用户相关的状态管理
import { createSlice } from '@reduxjs/toolkit'

export const userStore = createSlice({
    name: 'user',
    initialState: {
        token: ''
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setToken } = userStore.actions

export default userStore.reducer