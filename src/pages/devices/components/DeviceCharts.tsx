import { Card } from 'antd'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import {
    DEVICE_CHART_COLORS,
    DEVICE_CHART_THEME,
    DEVICE_STATUS_LABEL_MAP,
    DEVICE_TOOLTIP_SHADOW,
    DEVICE_TYPE_LABEL_MAP,
    type DeviceStats
} from '@/constants/devices'
import type { ThemeType } from '@/constants/theme'
import {
    DeviceStatus,
    type DeviceStatusType,
    DeviceType,
    type DeviceTypeType
} from '@/types/device'

interface DeviceChartsProps {
    theme: ThemeType
    stats: DeviceStats
    dataSourceLength: number
    statusCounts: Record<DeviceStatusType, number>
    typeCounts: Record<DeviceTypeType, number>
    activeStatusFilters: DeviceStatusType[]
    activeTypeFilters: DeviceTypeType[]
    onStatusFilterChange: (status: DeviceStatusType) => void
    onTypeFilterChange: (type: DeviceTypeType) => void
}

export function DeviceCharts({
    theme,
    stats,
    dataSourceLength,
    statusCounts,
    typeCounts,
    activeStatusFilters,
    activeTypeFilters,
    onStatusFilterChange,
    onTypeFilterChange
}: DeviceChartsProps) {
    const chartTheme = DEVICE_CHART_THEME[theme]

    const statusChartOption = useMemo<EChartsOption>(
        () => ({
            animation: false,
            color: [...DEVICE_CHART_COLORS.status],
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br />{c} 台 ({d}%)',
                backgroundColor: chartTheme.tooltipBg,
                borderColor: chartTheme.tooltipBorder,
                borderWidth: 1,
                extraCssText: DEVICE_TOOLTIP_SHADOW,
                textStyle: { color: chartTheme.tooltipText }
            },
            legend: {
                orient: 'vertical',
                right: 8,
                top: 'center',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                textStyle: {
                    color: chartTheme.legendText,
                    rich: {
                        name: { width: 52, fontSize: 12 },
                        value: {
                            width: 32,
                            align: 'right',
                            color: chartTheme.primaryText,
                            fontWeight: 700
                        }
                    }
                },
                formatter: (name) => {
                    const status = DEVICE_STATUS_LABEL_MAP[name]
                    return `{name|${name}} {value|${statusCounts[status] ?? 0}}`
                },
                selected: Object.fromEntries(
                    Object.entries(DEVICE_STATUS_LABEL_MAP).map(
                        ([label, status]) => [
                            label,
                            activeStatusFilters.length === 0 ||
                                activeStatusFilters.includes(status)
                        ]
                    )
                )
            },
            series: [
                {
                    name: '设备状态',
                    type: 'pie',
                    radius: ['58%', '76%'],
                    center: ['32%', '52%'],
                    avoidLabelOverlap: true,
                    label: { show: false },
                    labelLine: { show: false },
                    itemStyle: {
                        borderColor: chartTheme.cardBorder,
                        borderWidth: 4,
                        borderRadius: 8
                    },
                    emphasis: {
                        scale: true,
                        scaleSize: 6
                    },
                    data: [
                        {
                            name: '在线',
                            value: statusCounts[DeviceStatus.Online]
                        },
                        {
                            name: '离线',
                            value: statusCounts[DeviceStatus.Offline]
                        },
                        {
                            name: '升级中',
                            value: statusCounts[DeviceStatus.Upgrading]
                        }
                    ]
                }
            ]
        }),
        [activeStatusFilters, chartTheme, statusCounts]
    )

    const upgradeChartOption = useMemo<EChartsOption>(
        () => ({
            animation: false,
            color: [DEVICE_CHART_COLORS.upgrade, chartTheme.mutedTrack],
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br />{c} 台',
                backgroundColor: chartTheme.tooltipBg,
                borderColor: chartTheme.tooltipBorder,
                borderWidth: 1,
                extraCssText: DEVICE_TOOLTIP_SHADOW,
                textStyle: { color: chartTheme.tooltipText }
            },
            series: [
                {
                    type: 'pie',
                    radius: ['62%', '78%'],
                    center: ['50%', '52%'],
                    startAngle: 90,
                    label: { show: false },
                    labelLine: { show: false },
                    itemStyle: {
                        borderColor: chartTheme.cardBorder,
                        borderWidth: 4,
                        borderRadius: 10
                    },
                    data: [
                        { name: '升级中', value: stats.upgrading },
                        {
                            name: '其他设备',
                            value: Math.max(stats.total - stats.upgrading, 0)
                        }
                    ]
                }
            ]
        }),
        [chartTheme, stats.total, stats.upgrading]
    )

    const typeChartOption = useMemo<EChartsOption>(
        () => ({
            animation: false,
            color: [...DEVICE_CHART_COLORS.type],
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    const data = params as {
                        name?: string
                        value?: number
                        percent?: number
                    }
                    return `<div style="font-weight: 700; margin-bottom: 4px;">${data.name ?? ''}</div><div>${data.value ?? 0} 台 · 占比 ${data.percent ?? 0}%</div>`
                },
                backgroundColor: chartTheme.tooltipBg,
                borderColor: chartTheme.tooltipBorder,
                borderWidth: 1,
                extraCssText: DEVICE_TOOLTIP_SHADOW,
                textStyle: { color: chartTheme.tooltipText }
            },
            legend: {
                orient: 'vertical',
                right: 4,
                top: 'center',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                textStyle: {
                    color: chartTheme.legendText,
                    rich: {
                        name: { width: 58, fontSize: 12 },
                        value: {
                            width: 32,
                            align: 'right',
                            color: chartTheme.primaryText,
                            fontWeight: 700
                        }
                    }
                },
                formatter: (name) => {
                    const type = DEVICE_TYPE_LABEL_MAP[name]
                    return `{name|${name}} {value|${typeCounts[type] ?? 0}}`
                },
                selected: Object.fromEntries(
                    Object.entries(DEVICE_TYPE_LABEL_MAP).map(
                        ([label, type]) => [
                            label,
                            activeTypeFilters.length === 0 ||
                                activeTypeFilters.includes(type)
                        ]
                    )
                )
            },
            series: [
                {
                    name: '设备类型',
                    type: 'pie',
                    radius: ['54%', '72%'],
                    center: ['34%', '52%'],
                    label: { show: false },
                    labelLine: { show: false },
                    itemStyle: {
                        borderColor: chartTheme.cardBorder,
                        borderWidth: 4,
                        borderRadius: 8
                    },
                    data: [
                        {
                            name: '路由器',
                            value: typeCounts[DeviceType.Router]
                        },
                        {
                            name: '交换机',
                            value: typeCounts[DeviceType.Switch]
                        },
                        { name: 'AP', value: typeCounts[DeviceType.AP] }
                    ]
                }
            ]
        }),
        [activeTypeFilters, chartTheme, typeCounts]
    )

    // 图例和扇区点击都复用同一套筛选入口，保证图表和表格联动规则一致。
    const statusChartEvents = useMemo(
        () => ({
            legendselectchanged: (params: { name: string }) => {
                const status = DEVICE_STATUS_LABEL_MAP[params.name]
                if (status) onStatusFilterChange(status)
            },
            click: (params: { name: string }) => {
                const status = DEVICE_STATUS_LABEL_MAP[params.name]
                if (status) onStatusFilterChange(status)
            }
        }),
        [onStatusFilterChange]
    )

    const upgradeChartEvents = useMemo(
        () => ({
            click: (params: { name: string }) => {
                if (params.name === '升级中') {
                    onStatusFilterChange(DeviceStatus.Upgrading)
                }
            }
        }),
        [onStatusFilterChange]
    )

    const typeChartEvents = useMemo(
        () => ({
            legendselectchanged: (params: { name: string }) => {
                const type = DEVICE_TYPE_LABEL_MAP[params.name]
                if (type) onTypeFilterChange(type)
            },
            click: (params: { name: string }) => {
                const type = DEVICE_TYPE_LABEL_MAP[params.name]
                if (type) onTypeFilterChange(type)
            }
        }),
        [onTypeFilterChange]
    )

    return (
        <div className="devices-overview">
            <div className="devices-overview-grid">
                <Card className="devices-chart-card devices-chart-card-primary">
                    <div className="devices-chart-header">
                        <div>
                            <div className="devices-chart-title">设备总览</div>
                            <div className="devices-chart-subtitle">
                                点击图例筛选设备状态
                            </div>
                        </div>
                        <div className="devices-chart-metric">
                            {stats.total}
                        </div>
                    </div>
                    <div className="devices-chart-wrap">
                        <ReactECharts
                            className="devices-chart"
                            notMerge
                            option={statusChartOption}
                            opts={{ renderer: 'svg' }}
                            style={{ height: 150 }}
                            onEvents={statusChartEvents}
                        />
                        <div className="devices-chart-center-label devices-chart-center-status">
                            {stats.total}
                        </div>
                    </div>
                </Card>

                <Card className="devices-chart-card devices-chart-card-accent">
                    <div className="devices-chart-header">
                        <div>
                            <div className="devices-chart-title">
                                待升级设备
                            </div>
                            <div className="devices-chart-subtitle">
                                当前待处理升级任务
                            </div>
                        </div>
                        <div className="devices-chart-metric">
                            {stats.total
                                ? `${Math.round((stats.upgrading / stats.total) * 100)}%`
                                : '0%'}
                        </div>
                    </div>
                    <div className="devices-chart-wrap">
                        <ReactECharts
                            className="devices-chart devices-chart-centered"
                            notMerge
                            option={upgradeChartOption}
                            opts={{ renderer: 'svg' }}
                            style={{ height: 150 }}
                            onEvents={upgradeChartEvents}
                        />
                        <div className="devices-chart-center-label devices-chart-center-upgrade">
                            {stats.upgrading}
                        </div>
                    </div>
                </Card>

                <Card className="devices-chart-card devices-chart-card-type">
                    <div className="devices-chart-header">
                        <div>
                            <div className="devices-chart-title">设备类型</div>
                            <div className="devices-chart-subtitle">
                                当前页类型分布
                            </div>
                        </div>
                        <div className="devices-chart-metric">
                            {dataSourceLength}
                        </div>
                    </div>
                    <div className="devices-chart-wrap">
                        <ReactECharts
                            className="devices-chart"
                            notMerge
                            option={typeChartOption}
                            opts={{ renderer: 'svg' }}
                            style={{ height: 150 }}
                            onEvents={typeChartEvents}
                        />
                        <div className="devices-chart-center-label devices-chart-center-type">
                            {dataSourceLength}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
