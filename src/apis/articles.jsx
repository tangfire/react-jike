// 封装和文章相关的接口函数
import {request} from '@/utils/request.jsx'
// 1. 获取频道列表
export function getChannelAPI() {
    return request({
        method: 'GET',
        url: '/channels',
    })
}


// 2. 提交文章表单
export function createArticleAPI(data) {
    return request({
        url: '/mp/articles?draft=false',
        method: 'POST',
        data
    })
}

// 3. 获取文章列表
export function getArticleListAPI(params){
    return request({
        url: '/mp/articles',
        method: 'GET',
        params
    })
}
