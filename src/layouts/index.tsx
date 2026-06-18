import { ConfigProvider, Layout, theme } from 'antd'
import { memo, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { THEME } from '@/constants/theme'
import { useCommonStore } from '@/hooks/useCommonStore'
import { CollapseIcon } from '@/layouts/components/CollapseIcon'
import { FooterBar } from '@/layouts/components/FooterBar'
import HeaderPage from '@/layouts/components/HeaderBar'
import { NavBar } from '@/layouts/components/NavBar'
import { TreeMenu } from '@/layouts/components/TreeMenu'

const { defaultAlgorithm, darkAlgorithm } = theme

function LayoutPage() {
    const { Sider, Content } = Layout
    const location = useLocation()

    // 从公共 store 中获取主题设置
    const {
        theme: currentTheme,
        bgClass,
        textClass,
        rootBgClass
    } = useCommonStore()

    const themeConfig = useMemo(
        () => ({
            algorithm: [
                currentTheme === THEME.DARK ? darkAlgorithm : defaultAlgorithm
            ]
        }),
        [currentTheme]
    )
    const showNavBar = location.pathname === '/configure'

    return (
        <ConfigProvider theme={themeConfig}>
            <div
                className={`flex h-screen w-full min-w-0 flex-col overflow-hidden ${rootBgClass}`}
            >
                <Layout className="min-h-0 flex-1 overflow-hidden">
                    <HeaderPage />
                    <Layout className="min-h-0 flex-1 overflow-hidden">
                        <Sider
                            className="flex h-full min-h-0 flex-col"
                            collapsedWidth={80}
                            width={150}
                        >
                            <div
                                className={`flex h-full flex-col ${bgClass} ${textClass}`}
                            >
                                <div className="flex-1 overflow-y-auto">
                                    <TreeMenu />
                                </div>
                                <div className="shrink-0 cursor-pointer py-2 text-center">
                                    <CollapseIcon />
                                </div>
                            </div>
                        </Sider>
                        <Content className="box-border flex min-h-0 min-w-0 flex-col overflow-hidden">
                            {showNavBar ? (
                                <div className="shrink-0 px-6! pt-0">
                                    <NavBar />
                                </div>
                            ) : null}
                            <div
                                className={`m-6! min-h-0 flex-1 overflow-hidden rounded-md p-4! shadow-sm ${
                                    showNavBar ? 'mt-0!' : ''
                                } ${bgClass} ${textClass}`}
                            >
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
