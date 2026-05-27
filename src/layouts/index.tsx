import { memo } from 'react'
import { Outlet } from 'react-router-dom' // 关键导入
import Header from '@/layouts/components/Header'
import { TreeMenu } from '@/layouts/components/TreeMenu'

function Layout() {
    return (
        <div className="flex h-screen w-full flex-row">
            <div className="h-full w-60 bg-gray-200">
                <TreeMenu />
            </div>
            <div className="flex flex-1 flex-col">
                <Header />
                <div className="flex-1 overflow-auto">
                    <Outlet /> {/* 子路由的内容会渲染在这里 */}
                </div>
            </div>
        </div>
    )
}

export default memo(Layout)
