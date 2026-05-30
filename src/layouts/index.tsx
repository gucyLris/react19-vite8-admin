import { ConfigProvider, Layout, theme } from 'antd'
import useApp from 'antd/es/app/useApp'
import { memo, useEffect, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { THEME } from '@/constants/theme'
import { useCommonStore } from '@/hooks/useCommonStore'
import { CollapseIcon } from '@/layouts/components/CollapseIcon'
import { FooterBar } from '@/layouts/components/FooterBar'
import HeaderPage from '@/layouts/components/HeaderBar'
import { NavBar } from '@/layouts/components/NavBar'
import { TreeMenu } from '@/layouts/components/TreeMenu'
import { setGlobalNavigate } from '@/utils/historyHelper'
import { setGlobalMessageInstance } from '@/utils/messageHelper'

const { defaultAlgorithm, darkAlgorithm } = theme

function LayoutPage() {
    const { Sider, Content } = Layout

    // 获取全局导航和 message 实例
    const navigate = useNavigate()
    const { message } = useApp()

    // 注入全局 navigate（供工具函数调用）
    useEffect(() => {
        setGlobalNavigate(navigate)
    }, [navigate])

    // 注入全局 message 实例（消除静态方法警告）
    useEffect(() => {
        setGlobalMessageInstance(message)
    }, [message])

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
