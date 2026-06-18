import type {
    ConfigureMajorTabType,
    IConfigureMajorTabItem,
    IConfigureSubTabItem
} from '@/types/configure'

export const CONFIGURE_MAJOR_TABS: IConfigureMajorTabItem[] = [
    {
        key: 'all-network',
        label: '整网配置',
        description: '统一管理站点、网关与无线策略'
    },
    {
        key: 'router',
        label: '路由器',
        description: 'WAN、NAT、出口和转发策略'
    },
    {
        key: 'switch',
        label: '交换机',
        description: '端口、VLAN、PoE 和链路聚合'
    },
    {
        key: 'ap',
        label: 'AP',
        description: 'SSID、漫游、认证与射频优化'
    }
]

export const CONFIGURE_SUB_TAB_MAP: Record<
    ConfigureMajorTabType,
    IConfigureSubTabItem[]
> = {
    'all-network': [
        {
            key: 'business',
            label: '业务网管理',
            description: '创建、编辑和分配业务网络'
        },
        {
            key: 'portal',
            label: 'Portal认证',
            description: '认证入口与放行策略'
        },
        {
            key: 'iptv',
            label: 'IPTV',
            description: 'VLAN 与组播通道'
        }
    ],
    router: [
        {
            key: 'device',
            label: '设备',
            description: '网关与出口设备'
        },
        {
            key: 'dns',
            label: 'DNS',
            description: '解析与分流'
        }
    ],
    switch: [
        {
            key: 'device',
            label: '设备',
            description: '接入与上联设备'
        },
        {
            key: 'stack',
            label: '堆叠',
            description: '堆叠组与主备关系'
        },
        {
            key: 'device-vlan',
            label: '设备VLAN',
            description: '端口与 VLAN 策略'
        }
    ],
    ap: [
        {
            key: 'wifi',
            label: 'Wi-Fi管理',
            description: 'SSID 与无线策略'
        },
        {
            key: 'blacklist',
            label: '无线黑白名单',
            description: '终端准入控制'
        },
        {
            key: 'interface',
            label: '接口',
            description: '回传与上联接口'
        }
    ]
}

export const CONFIGURE_STATUS_META = {
    synced: {
        label: '已同步',
        color: 'green'
    },
    pending: {
        label: '待同步',
        color: 'blue'
    },
    warning: {
        label: '需优化',
        color: 'gold'
    },
    offline: {
        label: '异常',
        color: 'red'
    }
} as const

export const CONFIGURE_MAJOR_COLUMN_LABELS: Record<
    ConfigureMajorTabType,
    [string, string, string, string]
> = {
    'all-network': ['VLAN', '网关/掩码', '有线接入口', '无线配置'],
    router: ['WAN 接入', 'DNS', '出口策略', '带宽上限'],
    switch: ['端口模式', 'VLAN', 'PoE 供电', '链路状态'],
    ap: ['SSID', '频段', '覆盖范围', '漫游策略']
}
