import { get } from '@/api'

/** 获取菜单信息（自动取消重复请求） */
export const getMenusApi = (params?: any) =>
    get('/menus', params, { cancelDuplicated: true })
