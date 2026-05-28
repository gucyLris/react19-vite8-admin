import { Layout } from 'antd'
import { ConfigProvider, theme } from 'antd'
import { memo, useMemo } from 'react'
import { Outlet } from 'react-router-dom' // 关键导入

import { useCommonStore } from '@/hooks/useCommonStore'
import { CollapseIcon } from '@/layouts/components/CollapseIcon'
import { FooterBar } from '@/layouts/components/FooterBar'
import HeaderPage from '@/layouts/components/HeaderBar'
import { NavTabMenu } from '@/layouts/components/Nav'
import { TreeMenu } from '@/layouts/components/TreeMenu'
const { defaultAlgorithm, darkAlgorithm } = theme // 导入 Ant Design 的主题算法

function LayoutPage() {
    const { Sider, Content } = Layout

    // 从公共 store 中获取主题设置
    const { theme } = useCommonStore()
    // 根据当前主题动态设置 Ant Design 的主题算法，使用 useMemo 进行性能优化，只有当 theme 变化时才重新计算
    const themeConfig = useMemo(
        () => ({
            algorithm: [theme === 'dark' ? darkAlgorithm : defaultAlgorithm]
        }),
        [theme]
    )
    return (
        <ConfigProvider theme={themeConfig}>
            <div className="flex h-screen w-full flex-col">
                <Layout>
                    <HeaderPage />
                    <Layout>
                        <Sider
                            className="flex h-full flex-col"
                            collapsedWidth={80}
                            width={240}
                        >
                            <div className="flex h-full flex-col bg-gray-800">
                                <div className="flex-1 overflow-y-auto">
                                    <TreeMenu />
                                </div>
                                <div className="shrink-0 py-2 text-center text-white">
                                    <CollapseIcon />
                                </div>
                            </div>
                        </Sider>
                        <Content className="box-border overflow-hidden">
                            <div className="flex h-8 items-center justify-start bg-amber-300 px-2! text-gray-500">
                                <NavTabMenu />
                            </div>
                            <div className="h-full bg-gray-500 p-6!">
                                <Outlet /> {/* 子路由的内容会渲染在这里 */}
                            </div>
                        </Content>
                    </Layout>
                    <FooterBar />
                </Layout>
            </div>
        </ConfigProvider>
    )
}

export default memo(LayoutPage)
