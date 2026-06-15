import { THEME, type ThemeType } from '@/constants/theme'
import {
    DeviceStatus,
    type DeviceStatusType,
    DeviceType,
    type DeviceTypeType
} from '@/types/device'

export interface DeviceStats {
    total: number
    online: number
    upgrading: number
}

// 业务枚举的展示文案和主色统一维护，表格、筛选标签、图表图例都从这里取。
export const DEVICE_STATUS_META: Record<
    DeviceStatusType,
    { color: string; text: string }
> = {
    [DeviceStatus.Online]: { color: '#16c784', text: '在线' },
    [DeviceStatus.Offline]: { color: '#ef4444', text: '离线' },
    [DeviceStatus.Upgrading]: { color: '#f59e0b', text: '升级中' }
}

// 设备类型文案独立出来，避免页面、表格、图表里重复写中文。
export const DEVICE_TYPE_LABEL: Record<DeviceTypeType, string> = {
    [DeviceType.Router]: '路由器',
    [DeviceType.Switch]: '交换机',
    [DeviceType.AP]: 'AP'
}

export const DEVICE_STATUS_LABEL_MAP: Record<string, DeviceStatusType> = {
    在线: DeviceStatus.Online,
    离线: DeviceStatus.Offline,
    升级中: DeviceStatus.Upgrading
}

export const DEVICE_TYPE_LABEL_MAP: Record<string, DeviceTypeType> = {
    路由器: DeviceType.Router,
    交换机: DeviceType.Switch,
    AP: DeviceType.AP
}

// 图表配色只维护 token，具体图表 option 在组件里消费。
export const DEVICE_CHART_COLORS = {
    status: ['#16c784', '#ef4444', '#f59e0b'],
    upgrade: '#f59e0b',
    type: ['#2563eb', '#10b981', '#8b5cf6']
} as const

// 深浅主题差异集中在这里，后续新增图表时优先复用这组 token。
export const DEVICE_CHART_THEME: Record<
    ThemeType,
    {
        cardBorder: string
        tooltipBg: string
        tooltipBorder: string
        tooltipText: string
        primaryText: string
        legendText: string
        mutedTrack: string
    }
> = {
    [THEME.LIGHT]: {
        cardBorder: '#ffffff',
        tooltipBg: 'rgba(255, 255, 255, 0.96)',
        tooltipBorder: 'rgba(226, 232, 240, 0.95)',
        tooltipText: '#0f172a',
        primaryText: '#0f172a',
        legendText: '#475569',
        mutedTrack: '#e2e8f0'
    },
    [THEME.DARK]: {
        cardBorder: '#191919',
        tooltipBg: 'rgba(17, 24, 39, 0.96)',
        tooltipBorder: 'rgba(71, 85, 105, 0.72)',
        tooltipText: '#f8fafc',
        primaryText: '#f8fafc',
        legendText: '#cbd5e1',
        mutedTrack: '#2a2f38'
    }
}

export const DEVICE_TOOLTIP_SHADOW =
    'box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18); border-radius: 8px; white-space: nowrap;'
