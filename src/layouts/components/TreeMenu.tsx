import { Menu } from 'antd'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { getMenusApi } from '@/api/modules/menus'
import { useMenuStore } from '@/stores'
import type { MenuClickInfo } from '@/types/menu'
import {
    findMenuItemByKey,
    findMenuKeyPathByRoute,
    transformMenuToAntd
} from '@/utils/menuHelper'

export const TreeMenu = () => {
    // 从 Zustand 菜单 store 中获取菜单列表和设置菜单列表的函数，使用 useShallow 进行浅比较以优化性能
    const { menuList, setMenuList } = useMenuStore(
        useShallow((state) => ({
            menuList: state.menuList,
            setMenuList: state.setMenuList
        }))
    )

    // 组件挂载时获取菜单数据，使用 useEffect 进行副作用处理
    useEffect(() => {
        const fetchMenu = async () => {
            const res = await getMenusApi()
            setMenuList(res)
        }
        fetchMenu()
    }, [setMenuList])

    // 后面可以根据实际需求动态获取 locale，目前先写死为 'zh'
    const locale = 'zh'
    // 将接口数据转换为 Ant Design Menu 的 items，使用 useMemo 进行性能优化
    const menuItems = useMemo(
        () => transformMenuToAntd(menuList, locale),
        [menuList, locale]
    )

    const navigate = useNavigate()
    const location = useLocation()

    // 计算当前路由对应的菜单项的 key 路径，使用 useMemo 进行性能优化
    const selectedKeyPath = useMemo(
        () => findMenuKeyPathByRoute(menuList, location.pathname),
        [location.pathname, menuList]
    )

    // 计算当前选中的菜单项的 key，取 selectedKeyPath 的最后一个元素，如果 selectedKeyPath 为空，则 selectedKeys 也为空
    const selectedKeys = selectedKeyPath.length
        ? [selectedKeyPath[selectedKeyPath.length - 1]]
        : []

    // 计算默认展开的菜单项，去掉最后一个选中项，因为它是当前路由对应的菜单项，不需要展开
    const routeOpenKeys = useMemo(
        () => (selectedKeyPath.length > 1 ? selectedKeyPath.slice(0, -1) : []),
        [selectedKeyPath]
    )

    const handleMenuClick = ({ key }: MenuClickInfo) => {
        const menuItem = findMenuItemByKey(menuList, key)
        if (!menuItem) return
        if (menuItem.router?.startsWith('http')) {
            window.open(menuItem.router, '_blank')
        } else if (menuItem.router) {
            navigate(menuItem.router)
        }
    }

    return (
        <Menu
            key={selectedKeys.join('|') || location.pathname}
            className="h-full"
            defaultOpenKeys={routeOpenKeys}
            id="layout-menu"
            items={menuItems}
            mode="inline"
            selectedKeys={selectedKeys}
            theme="light"
            onClick={handleMenuClick}
        />
    )
}
