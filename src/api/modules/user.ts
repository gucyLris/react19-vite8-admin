import { get } from '@/api'

export interface IGameActivity {
    gameName: number
    activeUsers: string
    activeRate: string
}

/** 获取游戏活动信息（自动取消重复请求） */
export const getGameActivityApi = (params?: any) =>
    get<IGameActivity>('/game/activity', params, { cancelDuplicated: true })
