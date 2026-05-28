import { Menu } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { getMenusApi } from '@/api/modules/menus'
import { useMenuStore } from '@/stores'
import { findMenuItemByKey, transformMenuToAntd } from '@/utils/menuHelper'

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

    // 声明 navigate 函数
    const navigate = useNavigate()

    const handleMenuClick = ({ key }: { key: string }) => {
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
            className="h-full"
            id="layout-menu"
            items={menuItems}
            mode="inline"
            theme="light"
            onClick={handleMenuClick}
        />
    )
}
