import { get } from '@/api'
import type { DeviceListResponse } from '@/types/device'

export const fetchDevicesAPI = (params: {
    page: number
    pageSize: number
    deviceName?: string
}) => {
    return get<DeviceListResponse>('/devices', params, {
        cancelDuplicated: false
    })
}
