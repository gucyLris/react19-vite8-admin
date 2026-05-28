import { get } from '@/api'

/** 获取页脚信息（自动取消重复请求） */
export const getFooterInfoApi = (params?: any) =>
    get('/footer/info', params, { cancelDuplicated: true })
