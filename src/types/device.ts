// 设备状态常量
export const DeviceStatus = {
    Online: 'online',
    Offline: 'offline',
    Upgrading: 'upgrading'
} as const

export type DeviceStatusType = (typeof DeviceStatus)[keyof typeof DeviceStatus]

// 设备类型常量
export const DeviceType = {
    Router: 'router',
    Switch: 'switch',
    AP: 'ap'
} as const

export type DeviceTypeType = (typeof DeviceType)[keyof typeof DeviceType]

// 设备列表项
export interface IDeviceItem {
    id: string
    name: string // 设备名称
    sn: string // SN
    status: DeviceStatusType // 设备状态
    type: DeviceTypeType // 设备类型
    model: string // 设备款型
    softwareVersion: string // 软件版本
    groupName: string // 分组名称
}

// API 响应结构
export interface DeviceListResponse {
    list: IDeviceItem[]
    total: number
    statistics: {
        online: number
        upgrading: number
        routerCount: number
    }
}
