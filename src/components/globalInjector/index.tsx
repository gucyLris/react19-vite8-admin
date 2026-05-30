import useApp from 'antd/es/app/useApp'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePublicStore } from '@/stores/publicStore'
import { setGlobalNavigate } from '@/utils/historyHelper'
import { setGlobalMessageInstance } from '@/utils/messageHelper'

export function GlobalInjector() {
    // 主题的异步初始化与持久化存储
    const initializeTheme = usePublicStore((state) => state.initializeTheme)
    useEffect(() => {
        initializeTheme()
    }, [initializeTheme])

    // 获取全局导航和 message 实例
    const navigate = useNavigate()
    const { message } = useApp()

    // 注入全局 navigate（供工具函数调用）
    useEffect(() => {
        setGlobalNavigate(navigate)
        setGlobalMessageInstance(message)
    }, [navigate, message]) // 依赖稳定，只执行一次

    return null
}
