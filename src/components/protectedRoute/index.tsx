import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { getItem } from '@/utils/db'

/**
 * 路由守卫组件
 * - 从 IndexedDB 中读取 token，判断用户是否已登录
 * - 由于 IndexedDB 是异步 API，需要在读取完成前显示加载动画，避免直接重定向到登录页
 * - 已登录：渲染子路由（Outlet）；未登录：重定向到 /login
 */
const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null)

    useEffect(() => {
        getItem<string>('token').then((token) => {
            setIsAuth(!!token)
        })
    }, [])

    if (isAuth === null) {
        return <Spin fullscreen size="large" />
    }

    return isAuth ? <Outlet /> : <Navigate replace to="/login" />
}

export default ProtectedRoute
