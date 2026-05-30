import router from '@src/router'
import { App as AntdApp } from 'antd'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { usePublicStore } from '@/stores/publicStore'

function App() {
    // 主题的异步初始化与持久化存储
    const initializeTheme = usePublicStore((state) => state.initializeTheme)
    useEffect(() => {
        initializeTheme()
    }, [initializeTheme])

    return (
        <AntdApp>
            <RouterProvider router={router} />
        </AntdApp>
    )
}

export default App
