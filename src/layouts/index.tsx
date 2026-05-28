import { Layout } from 'antd'
import { ConfigProvider, theme } from 'antd'
import { memo, useMemo } from 'react'
import { Outlet } from 'react-router-dom' // 关键导入

import { useCommonStore } from '@/hooks/useCommonStore'
import { CollapseIcon } from '@/layouts/components/CollapseIcon'
import { FooterBar } from '@/layouts/components/FooterBar'
import HeaderPage from '@/layouts/components/HeaderBar'
import { NavBar } from '@/layouts/components/NavBar'
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
                            width={150}
                        >
                            <div className="flex h-full flex-col bg-gray-800">
                                <div className="flex-1 overflow-y-auto">
                                    <TreeMenu />
                                </div>
                                <div className="shrink-0 bg-[#ffffff] py-2 text-center text-black">
                                    <CollapseIcon />
                                </div>
                            </div>
                        </Sider>
                        <Content className="box-border overflow-hidden bg-[#f3f3f3]">
                            <div className="flex h-8 items-center justify-start px-6!">
                                <NavBar />
                            </div>
                            <div className="m-6! mt-0! h-[calc(100%-24px-32px)] rounded-md bg-[#ffffff] p-4! shadow-sm">
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
