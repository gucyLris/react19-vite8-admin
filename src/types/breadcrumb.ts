import type { BreadcrumbProps } from 'antd'
import type { ReactNode } from 'react'

export interface IBreadcrumbBarItem {
    title: ReactNode
    path?: string
    disabled?: boolean
    onClick?: () => void
}

export interface IBreadcrumbBarProps {
    items?: IBreadcrumbBarItem[]
    showHome?: boolean
    homeTitle?: ReactNode
    className?: string
}

export interface IRouteHandle {
    breadcrumb?: ReactNode
    breadcrumbPath?: string
    breadcrumbHidden?: boolean
}

export type BreadcrumbItemType = NonNullable<BreadcrumbProps['items']>[number]
