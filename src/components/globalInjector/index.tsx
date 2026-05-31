import { message as antdMessage } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePublicStore } from '@/stores/publicStore'
import { setGlobalNavigate } from '@/utils/historyHelper'
import { setMessageApi } from '@/utils/messageHelper'

export function GlobalInjector() {
    // 主题的异步初始化与持久化存储
    const initializeTheme = usePublicStore((state) => state.initializeTheme)
    useEffect(() => {
        initializeTheme()
    }, [initializeTheme])

    // 获取全局导航
    const navigate = useNavigate()

    // Antd message Hooks 调用
    const [api, contextHolder] = antdMessage.useMessage()
    // 注入全局 navigate（供工具函数调用）
    useEffect(() => {
        setGlobalNavigate(navigate)
        setMessageApi(api)
    }, [navigate, api]) // 依赖稳定，只执行一次

    return <>{contextHolder}</>
}
