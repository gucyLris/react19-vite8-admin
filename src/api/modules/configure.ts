import { CONFIGURE_STATUS_META } from '@/constants/configure'
import {
    CONFIGURE_MAJOR_TAB,
    CONFIGURE_NETWORK_STATUS,
    CONFIGURE_SUB_TAB,
    type ConfigureMajorTabType,
    type ConfigureSubTabType,
    type IConfigureActivityItem,
    type IConfigureGatewayInfo,
    type IConfigureOverviewStat,
    type IConfigurePageData,
    type IConfigureQuickAction,
    type IConfigureTableRow
} from '@/types/configure'

const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
        globalThis.setTimeout(resolve, ms)
    })

const getSubTabLabel = (subTab: ConfigureSubTabType) => {
    switch (subTab) {
        case CONFIGURE_SUB_TAB.BUSINESS:
            return '业务网管理'
        case CONFIGURE_SUB_TAB.PORTAL:
            return 'Portal认证'
        case CONFIGURE_SUB_TAB.IPTV:
            return 'IPTV'
        case CONFIGURE_SUB_TAB.DEVICE:
            return '设备'
        case CONFIGURE_SUB_TAB.DNS:
            return 'DNS'
        case CONFIGURE_SUB_TAB.STACK:
            return '堆叠'
        case CONFIGURE_SUB_TAB.DEVICE_VLAN:
            return '设备VLAN'
        case CONFIGURE_SUB_TAB.WIFI:
            return 'Wi-Fi管理'
        case CONFIGURE_SUB_TAB.BLACKLIST:
            return '无线黑白名单'
        case CONFIGURE_SUB_TAB.INTERFACE:
            return '接口'
        default:
            return '业务网管理'
    }
}

const buildStats = (
    majorTab: ConfigureMajorTabType
): IConfigureOverviewStat[] => {
    const presetMap: Record<ConfigureMajorTabType, IConfigureOverviewStat[]> = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: [
            {
                label: '策略总数',
                value: '24',
                trend: '+3',
                description: '包含业务网、访客网和运维网',
                tone: 'blue'
            },
            {
                label: '已同步',
                value: '19',
                trend: '79%',
                description: '配置已完成下发',
                tone: 'emerald'
            },
            {
                label: '待处理',
                value: '3',
                trend: '需要关注',
                description: '存在待同步或待确认项',
                tone: 'amber'
            }
        ],
        [CONFIGURE_MAJOR_TAB.ROUTER]: [
            {
                label: '出口策略',
                value: '12',
                trend: '+2',
                description: 'WAN、NAT 与静态路由',
                tone: 'blue'
            },
            {
                label: '在线网关',
                value: '7',
                trend: '稳定',
                description: '当前在线路由节点',
                tone: 'emerald'
            },
            {
                label: '待优化',
                value: '2',
                trend: '建议检查',
                description: '弱口令或未绑定策略',
                tone: 'amber'
            }
        ],
        [CONFIGURE_MAJOR_TAB.SWITCH]: [
            {
                label: '端口组',
                value: '18',
                trend: '+4',
                description: '接入口、上联口与镜像口',
                tone: 'cyan'
            },
            {
                label: '已启用 PoE',
                value: '14',
                trend: '活跃',
                description: '供电端口数',
                tone: 'emerald'
            },
            {
                label: '风险端口',
                value: '1',
                trend: '建议排查',
                description: '速率协商异常',
                tone: 'amber'
            }
        ],
        [CONFIGURE_MAJOR_TAB.AP]: [
            {
                label: 'SSID 组',
                value: '9',
                trend: '+1',
                description: '办公、访客与 IoT',
                tone: 'blue'
            },
            {
                label: '覆盖 AP',
                value: '42',
                trend: '稳定',
                description: '可用无线接入点',
                tone: 'emerald'
            },
            {
                label: '待调整',
                value: '4',
                trend: '建议优化',
                description: '信道与功率建议',
                tone: 'amber'
            }
        ]
    }

    return presetMap[majorTab]
}

const buildGateway = (
    majorTab: ConfigureMajorTabType,
    subTab: ConfigureSubTabType
): IConfigureGatewayInfo => {
    const baseName = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: 'AR303_11500105332212122334',
        [CONFIGURE_MAJOR_TAB.ROUTER]: 'AR2010_Gateway_0001',
        [CONFIGURE_MAJOR_TAB.SWITCH]: 'S5735_Stack_08',
        [CONFIGURE_MAJOR_TAB.AP]: 'AP6050_Cluster_12'
    }[majorTab]

    const model = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: 'AR303',
        [CONFIGURE_MAJOR_TAB.ROUTER]: 'AR2010',
        [CONFIGURE_MAJOR_TAB.SWITCH]: 'S5735',
        [CONFIGURE_MAJOR_TAB.AP]: 'AP6050'
    }[majorTab]

    return {
        name: `${baseName} · ${getSubTabLabel(subTab)}`,
        model,
        sn: `${baseName.replace(/[^0-9A-Z]/gi, '').slice(-16) || '0000'}-${model}`,
        ip: {
            [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: '192.168.10.1',
            [CONFIGURE_MAJOR_TAB.ROUTER]: '10.0.0.1',
            [CONFIGURE_MAJOR_TAB.SWITCH]: '172.16.12.1',
            [CONFIGURE_MAJOR_TAB.AP]: '192.168.88.1'
        }[majorTab],
        uplink: {
            [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: '千兆光猫',
            [CONFIGURE_MAJOR_TAB.ROUTER]: '双 WAN 负载均衡',
            [CONFIGURE_MAJOR_TAB.SWITCH]: '核心汇聚链路',
            [CONFIGURE_MAJOR_TAB.AP]: 'Mesh 回传'
        }[majorTab],
        firmware: {
            [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: 'V3R1.10',
            [CONFIGURE_MAJOR_TAB.ROUTER]: 'V2.5.04',
            [CONFIGURE_MAJOR_TAB.SWITCH]: 'V1.9.21',
            [CONFIGURE_MAJOR_TAB.AP]: 'V4.2.08'
        }[majorTab],
        lastSyncAt: '2026-06-16 09:42',
        status: CONFIGURE_NETWORK_STATUS.SYNCED,
        healthRate: {
            [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: 86,
            [CONFIGURE_MAJOR_TAB.ROUTER]: 93,
            [CONFIGURE_MAJOR_TAB.SWITCH]: 88,
            [CONFIGURE_MAJOR_TAB.AP]: 91
        }[majorTab]
    }
}

const buildQuickActions = (
    majorTab: ConfigureMajorTabType
): IConfigureQuickAction[] => {
    const labelMap = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: '网络',
        [CONFIGURE_MAJOR_TAB.ROUTER]: '路由',
        [CONFIGURE_MAJOR_TAB.SWITCH]: '交换机',
        [CONFIGURE_MAJOR_TAB.AP]: '无线'
    }

    return [
        {
            key: 'sync',
            label: `同步${labelMap[majorTab]}`,
            description: '将当前配置下发到设备'
        },
        {
            key: 'create',
            label: '新建策略',
            description: '快速创建一条新的配置项'
        }
    ]
}

const expandRows = (
    rows: IConfigureTableRow[],
    total: number
): IConfigureTableRow[] =>
    Array.from({ length: total }, (_, index) => {
        const source = rows[index % rows.length]
        const round = Math.floor(index / rows.length)
        const sequence = String(index + 1).padStart(2, '0')

        return {
            ...source,
            id: `${source.id}-${sequence}`,
            name: round === 0 ? source.name : `${source.name}-${round + 1}`,
            configStatus:
                index % 7 === 0
                    ? CONFIGURE_NETWORK_STATUS.WARNING
                    : source.configStatus,
            networkStatus:
                index % 5 === 0
                    ? CONFIGURE_NETWORK_STATUS.PENDING
                    : source.networkStatus
        }
    })

const buildRows = (majorTab: ConfigureMajorTabType): IConfigureTableRow[] => {
    switch (majorTab) {
        case CONFIGURE_MAJOR_TAB.ALL_NETWORK:
            return expandRows(
                [
                    {
                        id: 'network-1',
                        name: 'VLAN1',
                        tag: '默认',
                        slotA: '1',
                        slotB: '192.168.1.1/24',
                        slotC: '2-4',
                        slotD: '2',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '基础管理网',
                        editable: false
                    },
                    {
                        id: 'network-2',
                        name: 'Guest-Net',
                        tag: '访客',
                        slotA: '100',
                        slotB: '172.16.100.1/24',
                        slotC: '5-8',
                        slotD: '1',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '访客网络隔离',
                        editable: true
                    },
                    {
                        id: 'network-3',
                        name: 'Office-Net',
                        tag: '办公',
                        slotA: '200',
                        slotB: '10.10.20.1/24',
                        slotC: '9-12',
                        slotD: '4',
                        configStatus: CONFIGURE_NETWORK_STATUS.WARNING,
                        networkStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        note: '建议补充 ACL',
                        editable: true
                    },
                    {
                        id: 'network-4',
                        name: 'IoT-Net',
                        tag: '物联',
                        slotA: '300',
                        slotB: '10.30.30.1/24',
                        slotC: '13-16',
                        slotD: '3',
                        configStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        networkStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        note: '待确认设备白名单',
                        editable: true
                    }
                ],
                24
            )
        case CONFIGURE_MAJOR_TAB.ROUTER:
            return expandRows(
                [
                    {
                        id: 'router-1',
                        name: 'WAN 主链路',
                        tag: '出口',
                        slotA: 'PPPoE',
                        slotB: '223.5.5.5 / 114.114.114.114',
                        slotC: '负载均衡启用',
                        slotD: '500 Mbps',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '主链路在线',
                        editable: true
                    },
                    {
                        id: 'router-2',
                        name: '静态路由',
                        tag: '路由',
                        slotA: '3 条',
                        slotB: '10.20.0.0/16',
                        slotC: '策略路由',
                        slotD: '100 Mbps',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '跨网段已生效',
                        editable: true
                    },
                    {
                        id: 'router-3',
                        name: 'NAT 规则',
                        tag: '转换',
                        slotA: '启用',
                        slotB: '端口映射',
                        slotC: '1:1 NAT',
                        slotD: '50 Mbps',
                        configStatus: CONFIGURE_NETWORK_STATUS.WARNING,
                        networkStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        note: '建议收敛规则',
                        editable: true
                    }
                ],
                18
            )
        case CONFIGURE_MAJOR_TAB.SWITCH:
            return expandRows(
                [
                    {
                        id: 'switch-1',
                        name: 'Uplink-01',
                        tag: '上联',
                        slotA: 'Trunk',
                        slotB: 'VLAN 1/100/200',
                        slotC: 'PoE 关闭',
                        slotD: '1000M',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '核心上联口',
                        editable: true
                    },
                    {
                        id: 'switch-2',
                        name: 'Access-07',
                        tag: '接入',
                        slotA: 'Access',
                        slotB: 'VLAN 200',
                        slotC: 'PoE 开启',
                        slotD: '100M',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '终端接入口',
                        editable: true
                    },
                    {
                        id: 'switch-3',
                        name: 'Camera-Group',
                        tag: '安防',
                        slotA: 'Access',
                        slotB: 'VLAN 300',
                        slotC: 'PoE 开启',
                        slotD: '100M',
                        configStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        networkStatus: CONFIGURE_NETWORK_STATUS.WARNING,
                        note: '摄像头链路抖动',
                        editable: true
                    }
                ],
                21
            )
        case CONFIGURE_MAJOR_TAB.AP:
        default:
            return expandRows(
                [
                    {
                        id: 'ap-1',
                        name: 'Office-SSID',
                        tag: '办公',
                        slotA: '5GHz / 2.4GHz',
                        slotB: 'Band Steering',
                        slotC: '覆盖 25m',
                        slotD: '智能漫游',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '主办公网络',
                        editable: true
                    },
                    {
                        id: 'ap-2',
                        name: 'Guest-SSID',
                        tag: '访客',
                        slotA: '5GHz',
                        slotB: 'Portal',
                        slotC: '覆盖 20m',
                        slotD: '访客隔离',
                        configStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        networkStatus: CONFIGURE_NETWORK_STATUS.SYNCED,
                        note: '访客认证入口',
                        editable: true
                    },
                    {
                        id: 'ap-3',
                        name: 'IoT-SSID',
                        tag: '物联',
                        slotA: '2.4GHz',
                        slotB: 'WPA2-PSK',
                        slotC: '覆盖 30m',
                        slotD: '低功率模式',
                        configStatus: CONFIGURE_NETWORK_STATUS.WARNING,
                        networkStatus: CONFIGURE_NETWORK_STATUS.PENDING,
                        note: '建议收窄带宽',
                        editable: true
                    }
                ],
                18
            )
    }
}

const buildActivities = (
    majorTab: ConfigureMajorTabType
): IConfigureActivityItem[] => {
    const tabLabel = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: '整网配置',
        [CONFIGURE_MAJOR_TAB.ROUTER]: '路由器',
        [CONFIGURE_MAJOR_TAB.SWITCH]: '交换机',
        [CONFIGURE_MAJOR_TAB.AP]: 'AP'
    }[majorTab]

    return [
        {
            id: 'activity-1',
            title: `${tabLabel} 已同步完成`,
            description: '最近一次下发已经成功完成',
            time: '09:42',
            status: CONFIGURE_NETWORK_STATUS.SYNCED
        },
        {
            id: 'activity-2',
            title: '检测到待优化项',
            description: '部分策略仍处于待确认状态',
            time: '08:18',
            status: CONFIGURE_NETWORK_STATUS.WARNING
        }
    ]
}

export const getConfigurePageMockApi = async (
    majorTab: ConfigureMajorTabType,
    subTab: ConfigureSubTabType
): Promise<IConfigurePageData> => {
    await sleep(260)

    const heroTitleMap = {
        [CONFIGURE_MAJOR_TAB.ALL_NETWORK]: '整网配置工作台',
        [CONFIGURE_MAJOR_TAB.ROUTER]: '路由器配置工作台',
        [CONFIGURE_MAJOR_TAB.SWITCH]: '交换机配置工作台',
        [CONFIGURE_MAJOR_TAB.AP]: 'AP 配置工作台'
    }

    return {
        heroTitle: heroTitleMap[majorTab],
        heroDescription: `当前正在查看 ${getSubTabLabel(subTab)}，用于管理网络策略、设备状态和下发任务。`,
        heroBadge: `${CONFIGURE_STATUS_META.synced.label} · Mock`,
        heroTip: '当前数据来自 Easy Mock，后续可直接替换成真实接口。',
        gateway: buildGateway(majorTab, subTab),
        stats: buildStats(majorTab),
        rows: buildRows(majorTab),
        activities: buildActivities(majorTab),
        quickActions: buildQuickActions(majorTab)
    }
}
