import { ConfigProvider, Layout, theme } from 'antd'
import { memo, useMemo } from 'react'
import { Outlet } from 'react-router-dom'

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

    return (
        <ConfigProvider theme={themeConfig}>
            <div className={`flex h-screen w-full flex-col ${rootBgClass}`}>
                <Layout>
                    <HeaderPage />
                    <Layout>
                        <Sider
                            className="flex h-full flex-col"
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
                        <Content className="box-border overflow-hidden">
                            <div className="flex h-8 items-center justify-start px-6!">
                                <NavBar />
                            </div>
                            <div
                                className={`m-6! mt-0! h-[calc(100%-24px-32px)] rounded-md p-4! shadow-sm ${bgClass} ${textClass}`}
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
