// src/utils/menuHelper.tsx
import type { MenuProps } from 'antd'
import React from 'react'

import type { IMenuItem } from '@/types/menu'

type MenuItemType = NonNullable<MenuProps['items']>[number]

/**
 * 将后端菜单数据转换为 Ant Design Menu 的 items
 * @param menus 后端返回的菜单数组（已从接口 data 字段中提取）
 * @param locale 当前语言，'zh' 或 'en'，默认为 'zh'
 * @returns Ant Design Menu 的 items 数组
 */
export const transformMenuToAntd = (
    menus: IMenuItem[],
    locale: 'zh' | 'en' = 'zh'
): MenuItemType[] => {
    if (!Array.isArray(menus)) return []

    // 1. 按 order 升序排序
    const sorted = [...menus].sort((a, b) => a.order - b.order)

    // 2. 递归构建菜单项
    const buildItems = (list: IMenuItem[]): MenuItemType[] => {
        const result: MenuItemType[] = []

        for (const item of list) {
            // 过滤不可见的菜单
            if (!item.is_visible) continue

            // 根据语言获取标签文本
            const labelText =
                locale === 'zh' ? item.label : item.labelEn || item.label
            const key = item.key
            // 图标处理：如果图标字符串非空，可替换为真实的图标组件，此处仅作占位
            const icon = item.icon ? <span>{item.icon}</span> : undefined

            // 菜单项（叶子节点，type === 2）
            if (item.type === 2) {
                result.push({
                    key,
                    label: labelText,
                    icon
                } as MenuItemType)
            }
            // 目录（type === 1）
            else if (item.type === 1) {
                const hasChildren = item.children && item.children.length > 0
                const childrenItems = hasChildren
                    ? buildItems(item.children!)
                    : []
                result.push({
                    key,
                    label: labelText,
                    icon,
                    children:
                        childrenItems.length > 0 ? childrenItems : undefined
                } as MenuItemType)
            }
        }
        return result
    }

    return buildItems(sorted)
}

/**
 * 根据菜单项的 key 在原始数据中查找完整信息（用于点击跳转等场景）
 * @param menus 原始菜单数组
 * @param key 菜单项的唯一标识 key
 * @returns 匹配的菜单项，未找到则返回 undefined
 */
export const findMenuItemByKey = (
    menus: IMenuItem[],
    key: string
): IMenuItem | undefined => {
    for (const item of menus) {
        if (item.key === key) return item
        if (item.children) {
            const found = findMenuItemByKey(item.children, key)
            if (found) return found
        }
    }
    return undefined
}
