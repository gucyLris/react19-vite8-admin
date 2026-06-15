import { Breadcrumb } from 'antd'
import { memo, useCallback, useMemo } from 'react'
import { useLocation, useMatches, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { useCommonStore } from '@/hooks/useCommonStore'
import { useMenuStore } from '@/stores'
import type {
    BreadcrumbItemType,
    IBreadcrumbBarItem,
    IBreadcrumbBarProps,
    IRouteHandle
} from '@/types/breadcrumb'
import type { IMenuItem } from '@/types/menu'

// 根据当前路由路径在菜单数据中找到对应的标签文本，优先匹配完整路径，其次匹配前缀路径，返回最匹配的标签文本
const normalizePath = (path: string) => {
    if (!path) return '/'
    if (path === '/') return '/'
    return path.replace(/\/+$/, '') || '/'
}

// 将路径段转换为更友好的文本，例如 'user-profile' => 'User Profile'
const humanizeSegment = (segment: string) => {
    const decoded = decodeURIComponent(segment)
    if (!decoded) return segment
    return decoded.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

// 将后端菜单数据转换为 Ant Design Menu 的 items
const flattenMenus = (menus: IMenuItem[]) => {
    const result: Array<Pick<IMenuItem, 'router' | 'label' | 'labelEn'>> = []

    const walk = (list: IMenuItem[]) => {
        for (const item of list) {
            if (item.router) {
                result.push({
                    router: normalizePath(item.router),
                    label: item.label,
                    labelEn: item.labelEn
                })
            }
            if (item.children?.length) {
                walk(item.children)
            }
        }
    }

    walk(menus)
    return result
}

// 根据当前路由路径在菜单数据中找到对应的标签文本，优先匹配完整路径，其次匹配前缀路径，返回最匹配的标签文本
const findMenuLabel = (
    menus: IMenuItem[],
    pathname: string,
    locale: 'zh' | 'en' = 'zh'
) => {
    const normalizedPath = normalizePath(pathname)
    const flatMenus = flattenMenus(menus)

    let bestMatch: (typeof flatMenus)[number] | undefined
    let bestLength = -1

    for (const item of flatMenus) {
        const routerPath = item.router
        if (
            normalizedPath === routerPath ||
            normalizedPath.startsWith(`${routerPath}/`)
        ) {
            if (routerPath.length > bestLength) {
                bestMatch = item
                bestLength = routerPath.length
            }
        }
    }

    if (!bestMatch) return undefined
    return locale === 'zh'
        ? bestMatch.label
        : bestMatch.labelEn || bestMatch.label
}

// 解析路由 handle 中的 breadcrumb 信息，返回 IBreadcrumbBarItem 对象，如果 handle 不合法或 breadcrumbHidden 为 true 则返回 null
const parseHandleBreadcrumb = (handle: unknown): IBreadcrumbBarItem | null => {
    if (!handle || typeof handle !== 'object') return null

    const IRouteHandle = handle as IRouteHandle
    if (IRouteHandle.breadcrumbHidden) return null
    if (IRouteHandle.breadcrumb == null) return null

    return {
        title: IRouteHandle.breadcrumb,
        path: IRouteHandle.breadcrumbPath
    }
}

// 将后端菜单数据转换为 Ant Design Menu 的 items，支持多语言
export const BreadcrumbBar = memo(
    ({
        items,
        showHome = false,
        homeTitle = '首页',
        className = ''
    }: IBreadcrumbBarProps) => {
        const navigate = useNavigate()
        const location = useLocation()
        const matches = useMatches()
        const { theme: currentTheme } = useCommonStore()
        const { menuList } = useMenuStore(
            useShallow((state) => ({
                menuList: state.menuList
            }))
        )

        const breadcrumbs = useMemo(() => {
            if (items?.length) return items

            const routeItems = matches
                .map((match) => {
                    const item = parseHandleBreadcrumb(match.handle)
                    if (!item) return null

                    return {
                        ...item,
                        path: item.path ?? match.pathname
                    } satisfies IBreadcrumbBarItem
                })
                .filter(Boolean) as IBreadcrumbBarItem[]

            if (routeItems.length > 0) {
                if (showHome && routeItems[0]?.path !== '/') {
                    return [
                        {
                            title: homeTitle,
                            path: '/'
                        },
                        ...routeItems
                    ]
                }
                return routeItems
            }

            const pathname = normalizePath(location.pathname)
            const segments = pathname.split('/').filter(Boolean)
            const fallbackItems: IBreadcrumbBarItem[] = []

            if (showHome) {
                fallbackItems.push({
                    title: homeTitle,
                    path: '/'
                })
            }

            if (segments.length === 0) {
                if (!showHome) {
                    fallbackItems.push({
                        title:
                            findMenuLabel(menuList, pathname) ??
                            (homeTitle || '首页'),
                        path: '/'
                    })
                }
                return fallbackItems
            }

            let currentPath = ''
            segments.forEach((segment, index) => {
                currentPath += `/${segment}`
                const menuLabel = findMenuLabel(menuList, currentPath)
                const title = menuLabel ?? humanizeSegment(segment)
                fallbackItems.push({
                    title,
                    path: currentPath
                })

                // 如果当前路径后面还有层级，允许继续沿用菜单树匹配的结果
                if (index === segments.length - 1 && !menuLabel) {
                    fallbackItems[fallbackItems.length - 1] = {
                        title,
                        path: currentPath
                    }
                }
            })

            return fallbackItems
        }, [homeTitle, items, location.pathname, matches, menuList, showHome])

        const handleItemClick = useCallback(
            (item: IBreadcrumbBarItem) => {
                if (item.disabled) return
                if (item.onClick) {
                    item.onClick()
                    return
                }
                if (item.path) {
                    navigate(item.path)
                }
            },
            [navigate]
        )

        const breadcrumbItems = useMemo<BreadcrumbItemType[]>(
            () =>
                breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    const isClickable = Boolean(
                        !isLast && !item.disabled && (item.onClick || item.path)
                    )

                    const titleNode = (
                        <span
                            className={
                                isLast || !isClickable
                                    ? 'layout-breadcrumb-current'
                                    : 'layout-breadcrumb-link'
                            }
                        >
                            {item.title}
                        </span>
                    )

                    return {
                        key: item.path ?? `${index}`,
                        title: titleNode,
                        onClick: isClickable
                            ? (event) => {
                                  event.preventDefault()
                                  handleItemClick(item)
                              }
                            : undefined
                    }
                }),
            [breadcrumbs, handleItemClick]
        )

        if (!breadcrumbs.length) return null

        return (
            <div
                className={`layout-breadcrumb layout-breadcrumb-${currentTheme} ${className}`}
            >
                <Breadcrumb items={breadcrumbItems} separator="/" />
            </div>
        )
    }
)
