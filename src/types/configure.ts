export const CONFIGURE_MAJOR_TAB = {
    ALL_NETWORK: 'all-network',
    ROUTER: 'router',
    SWITCH: 'switch',
    AP: 'ap'
} as const

export type ConfigureMajorTabType =
    (typeof CONFIGURE_MAJOR_TAB)[keyof typeof CONFIGURE_MAJOR_TAB]

export const CONFIGURE_SUB_TAB = {
    BUSINESS: 'business',
    PORTAL: 'portal',
    IPTV: 'iptv',
    DEVICE: 'device',
    DNS: 'dns',
    STACK: 'stack',
    DEVICE_VLAN: 'device-vlan',
    WIFI: 'wifi',
    BLACKLIST: 'blacklist',
    INTERFACE: 'interface'
} as const

export type ConfigureSubTabType =
    (typeof CONFIGURE_SUB_TAB)[keyof typeof CONFIGURE_SUB_TAB]

export const CONFIGURE_NETWORK_STATUS = {
    SYNCED: 'synced',
    PENDING: 'pending',
    WARNING: 'warning',
    OFFLINE: 'offline'
} as const

export type ConfigureNetworkStatusType =
    (typeof CONFIGURE_NETWORK_STATUS)[keyof typeof CONFIGURE_NETWORK_STATUS]

export interface IConfigureMajorTabItem {
    key: ConfigureMajorTabType
    label: string
    description: string
}

export interface IConfigureSubTabItem {
    key: ConfigureSubTabType
    label: string
    description: string
}

export interface IConfigureOverviewStat {
    label: string
    value: string
    trend: string
    description: string
    tone: 'blue' | 'cyan' | 'emerald' | 'amber' | 'violet'
}

export interface IConfigureGatewayInfo {
    name: string
    model: string
    sn: string
    ip: string
    uplink: string
    firmware: string
    lastSyncAt: string
    status: ConfigureNetworkStatusType
    healthRate: number
}

export interface IConfigureTableRow {
    id: string
    name: string
    tag?: string
    slotA: string
    slotB: string
    slotC: string
    slotD: string
    configStatus: ConfigureNetworkStatusType
    networkStatus: ConfigureNetworkStatusType
    note: string
    editable: boolean
}

export interface IConfigureActivityItem {
    id: string
    title: string
    description: string
    time: string
    status: ConfigureNetworkStatusType
}

export interface IConfigureQuickAction {
    key: string
    label: string
    description: string
}

export interface IConfigurePageData {
    heroTitle: string
    heroDescription: string
    heroBadge: string
    heroTip: string
    gateway: IConfigureGatewayInfo
    stats: IConfigureOverviewStat[]
    rows: IConfigureTableRow[]
    activities: IConfigureActivityItem[]
    quickActions: IConfigureQuickAction[]
}

export interface IConfigureRowFormValues {
    name: string
    tag?: string
    slotA: string
    slotB: string
    slotC: string
    slotD: string
    note: string
    editable: boolean
    configStatus: ConfigureNetworkStatusType
    networkStatus: ConfigureNetworkStatusType
}
