import { post } from '@/api'

/** 获取菜单信息（自动取消重复请求） */
export const postLoginApi = (params?: any) =>
    post('/user/login', params, { cancelDuplicated: true })
