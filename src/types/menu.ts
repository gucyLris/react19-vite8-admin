import type { MenuProps } from 'antd'

// 菜单项类型定义
export interface MenuItem {
    id: number
    label: string
    labelEn: string
    icon: string | null
    router: string
    key: string
    rule: string | null
    type: 1 | 2 // 1: 目录, 2: 菜单项
    order: number
    is_visible: boolean
    created_at: string
    updated_at: string
    children?: MenuItem[]
}

// Ant Design Menu 的 Item 类型
export type AntdMenuItem = NonNullable<MenuProps['items']>[number]
