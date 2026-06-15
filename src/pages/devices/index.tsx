import {
    DeleteOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Button,
    Card,
    Empty,
    Input,
    message,
    Pagination,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
    startTransition,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import { fetchDevicesAPI } from '@/api/modules/devices'
import {
    DEVICE_STATUS_META,
    DEVICE_TYPE_LABEL,
    type DeviceStats
} from '@/constants/devices'
import { useCommonStore } from '@/hooks/useCommonStore'
import {
    DeviceStatus,
    type DeviceStatusType,
    DeviceType,
    type DeviceTypeType,
    type IDeviceItem
} from '@/types/device'

import { DeviceCharts } from './components/DeviceCharts'

const getInitialTableScrollY = () => {
    if (typeof window === 'undefined') return 260
    return Math.max(180, window.innerHeight - 590)
}

export const Devices = () => {
    const { theme: currentTheme } = useCommonStore()
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState<IDeviceItem[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchName, setSearchName] = useState('')
    const [debouncedName, setDebouncedName] = useState('')
    const [isTableFocusMode, setIsTableFocusMode] = useState(false)
    const [activeStatusFilters, setActiveStatusFilters] = useState<
        DeviceStatusType[]
    >([])
    const [activeTypeFilters, setActiveTypeFilters] = useState<
        DeviceTypeType[]
    >([])

    // 统计数据
    const [stats, setStats] = useState<DeviceStats>({
        total: 0,
        online: 0,
        upgrading: 0
    })

    // 防抖搜索
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedName(searchName), 500)
        return () => clearTimeout(timer)
    }, [searchName])

    // 加载设备列表
    const loadDevices = useCallback(
        async (
            currentPage: number,
            currentPageSize: number,
            currentSearch: string
        ) => {
            startTransition(() => setLoading(true))
            try {
                const res = await fetchDevicesAPI({
                    page: currentPage,
                    pageSize: currentPageSize,
                    deviceName: currentSearch || undefined
                })
                const { list, total, statistics } = res
                startTransition(() => {
                    setDataSource(list)
                    setTotal(total)
                    setStats({
                        total,
                        online: statistics?.online ?? 0,
                        upgrading: statistics?.upgrading ?? 0
                    })
                })
            } catch (error) {
                console.error(error)
                message.error('网络错误，请稍后重试')
            } finally {
                setLoading(false)
            }
        },
        []
    )

    useEffect(() => {
        startTransition(() => {
            loadDevices(page, pageSize, debouncedName)
        })
    }, [page, pageSize, debouncedName, loadDevices])

    const handleRestart = useCallback((device: IDeviceItem) => {
        message.info(`重启设备: ${device.name}`)
    }, [])
    const handleDelete = useCallback((device: IDeviceItem) => {
        message.warning(`删除设备: ${device.name}`)
    }, [])

    // 图表图例和扇区点击都会走筛选函数，前端先基于当前页数据做轻量联动。
    const toggleStatusFilter = useCallback((status: DeviceStatusType) => {
        setActiveStatusFilters((currentFilters) =>
            currentFilters.includes(status)
                ? currentFilters.filter((item) => item !== status)
                : [...currentFilters, status]
        )
    }, [])

    const toggleTypeFilter = useCallback((type: DeviceTypeType) => {
        setActiveTypeFilters((currentFilters) =>
            currentFilters.includes(type)
                ? currentFilters.filter((item) => item !== type)
                : [...currentFilters, type]
        )
    }, [])

    const clearChartFilters = useCallback(() => {
        setActiveStatusFilters([])
        setActiveTypeFilters([])
    }, [])

    const statusCounts = useMemo(() => {
        const online = stats.online
        const upgrading = stats.upgrading
        const offline = Math.max(stats.total - online - upgrading, 0)
        return {
            [DeviceStatus.Online]: online,
            [DeviceStatus.Offline]: offline,
            [DeviceStatus.Upgrading]: upgrading
        }
    }, [stats.online, stats.total, stats.upgrading])

    const typeCounts = useMemo(() => {
        return dataSource.reduce(
            (counts, device) => {
                counts[device.type] += 1
                return counts
            },
            {
                [DeviceType.Router]: 0,
                [DeviceType.Switch]: 0,
                [DeviceType.AP]: 0
            } as Record<DeviceTypeType, number>
        )
    }, [dataSource])

    const filteredDataSource = useMemo(() => {
        return dataSource.filter((device) => {
            const isStatusMatched =
                activeStatusFilters.length === 0 ||
                activeStatusFilters.includes(device.status)
            const isTypeMatched =
                activeTypeFilters.length === 0 ||
                activeTypeFilters.includes(device.type)
            return isStatusMatched && isTypeMatched
        })
    }, [activeStatusFilters, activeTypeFilters, dataSource])

    const hasChartFilter =
        activeStatusFilters.length > 0 || activeTypeFilters.length > 0

    // 表格列定义集中在这里，设备状态/类型文案统一从 constants 读取。
    const columns = useMemo<ColumnsType<IDeviceItem>>(
        () => [
            {
                title: '设备名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true
            },
            { title: 'SN', dataIndex: 'sn', key: 'sn', width: 180 },
            {
                title: '设备状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: DeviceStatusType) => {
                    const item = DEVICE_STATUS_META[status]
                    return (
                        <span style={{ color: item?.color }}>{item?.text}</span>
                    )
                }
            },
            {
                title: '设备类型',
                dataIndex: 'type',
                key: 'type',
                render: (type: DeviceTypeType) =>
                    DEVICE_TYPE_LABEL[type] || type
            },
            { title: '设备款型', dataIndex: 'model', key: 'model' },
            {
                title: '软件版本',
                dataIndex: 'softwareVersion',
                key: 'softwareVersion'
            },
            { title: '分组名称', dataIndex: 'groupName', key: 'groupName' },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                width: 100,
                render: (_, record) => (
                    <Space size="small">
                        <Button
                            size="small"
                            type="link"
                            onClick={() => handleRestart(record)}
                        >
                            重启
                        </Button>
                        <Button
                            danger
                            size="small"
                            type="link"
                            onClick={() => handleDelete(record)}
                        >
                            删除
                        </Button>
                    </Space>
                )
            }
        ],
        [handleRestart, handleDelete]
    )

    // 操作栏按钮事件
    const handleBatchRestart = useCallback(() => message.info('批量重启'), [])
    const handleBatchReset = useCallback(() => message.info('恢复出厂设置'), [])
    const handleBatchDelete = useCallback(() => message.info('批量删除'), [])
    const handleAddDevice = useCallback(() => message.info('添加设备'), [])

    // 表格聚焦模式只隐藏图表区，保留搜索和批量操作，方便大数据量时查看表格。
    const toggleTableFocusMode = useCallback(() => {
        setIsTableFocusMode((currentMode) => !currentMode)
    }, [])

    const handleSearchNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchName(event.target.value)
            setPage((currentPage) => (currentPage === 1 ? currentPage : 1))
        },
        []
    )

    // 分页变化处理（修复 pageSize 变化时重置页码）
    const onPageChange = (newPage: number, newPageSize?: number) => {
        if (newPageSize && newPageSize !== pageSize) {
            setPage(1)
            setPageSize(newPageSize)
        } else {
            setPage(newPage)
        }
    }

    // 表格外壳同步计算高度
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [tableScrollY, setTableScrollY] = useState(getInitialTableScrollY)

    // 表格占满剩余空间时需要同步 scroll.y，否则路由切换和筛选后容易出现高度跳动。
    const updateTableScrollY = useCallback(() => {
        const container = tableContainerRef.current
        if (!container) return

        const header =
            container.querySelector('.ant-table-thead tr') ??
            container.querySelector('.ant-table-header')
        const headerHeight = header?.getBoundingClientRect().height ?? 55
        const nextScrollY = Math.max(
            100,
            Math.floor(container.clientHeight - headerHeight - 2)
        )

        setTableScrollY((prevScrollY) =>
            Math.abs(prevScrollY - nextScrollY) > 1 ? nextScrollY : prevScrollY
        )
    }, [])

    useLayoutEffect(() => {
        const container = tableContainerRef.current
        updateTableScrollY()

        let frameId = window.requestAnimationFrame(updateTableScrollY)
        const resizeObserver =
            container && 'ResizeObserver' in window
                ? new ResizeObserver(() => {
                      window.cancelAnimationFrame(frameId)
                      frameId = window.requestAnimationFrame(updateTableScrollY)
                  })
                : null

        if (container) resizeObserver?.observe(container)
        window.addEventListener('resize', updateTableScrollY)

        return () => {
            window.cancelAnimationFrame(frameId)
            resizeObserver?.disconnect()
            window.removeEventListener('resize', updateTableScrollY)
        }
    }, [updateTableScrollY])

    useLayoutEffect(() => {
        updateTableScrollY()

        const frameId = window.requestAnimationFrame(updateTableScrollY)
        return () => window.cancelAnimationFrame(frameId)
    }, [filteredDataSource.length, loading, updateTableScrollY])

    const rowSelection = useMemo(
        () => ({
            onChange: (
                selectedRowKeys: React.Key[],
                selectedRows: IDeviceItem[]
            ) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, selectedRows)
            }
        }),
        []
    )
    const isEmptyTable = filteredDataSource.length === 0

    // 空状态渲染：确保高度与滚动区域匹配，但避免产生额外滚动条
    const renderEmpty = () => {
        // 如果有数据，使用默认空状态
        if (filteredDataSource.length) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        // 空数据时设置一个占位高度，避免表格塌陷
        return (
            <div
                style={{
                    height: tableScrollY,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        )
    }

    return (
        <div
            className={`devices-page devices-page-${currentTheme} ${
                isTableFocusMode ? 'devices-page-table-focus' : ''
            } flex h-full min-h-0 flex-col`}
        >
            <DeviceCharts
                activeStatusFilters={activeStatusFilters}
                activeTypeFilters={activeTypeFilters}
                dataSourceLength={dataSource.length}
                stats={stats}
                statusCounts={statusCounts}
                theme={currentTheme}
                typeCounts={typeCounts}
                onStatusFilterChange={toggleStatusFilter}
                onTypeFilterChange={toggleTypeFilter}
            />

            {/* 操作栏 */}
            <Card className="devices-toolbar-card mt-4! mb-4!">
                <div className="flex items-center justify-between">
                    <div className="devices-toolbar-left">
                        <Input
                            allowClear
                            placeholder="按设备名称搜索"
                            prefix={<SearchOutlined />}
                            style={{ width: 320 }}
                            value={searchName}
                            onChange={handleSearchNameChange}
                        />

                        {hasChartFilter && (
                            <Space className="devices-filter-tags" wrap>
                                {activeStatusFilters.map((status) => (
                                    <Tag
                                        key={status}
                                        closable
                                        color={DEVICE_STATUS_META[status].color}
                                        onClose={(event) => {
                                            event.preventDefault()
                                            toggleStatusFilter(status)
                                        }}
                                    >
                                        状态：{DEVICE_STATUS_META[status].text}
                                    </Tag>
                                ))}
                                {activeTypeFilters.map((type) => (
                                    <Tag
                                        key={type}
                                        closable
                                        color="blue"
                                        onClose={(event) => {
                                            event.preventDefault()
                                            toggleTypeFilter(type)
                                        }}
                                    >
                                        类型：{DEVICE_TYPE_LABEL[type]}
                                    </Tag>
                                ))}
                                <Button type="link" onClick={clearChartFilters}>
                                    清空筛选
                                </Button>
                            </Space>
                        )}
                    </div>

                    <Space wrap>
                        <Tooltip
                            title={
                                isTableFocusMode
                                    ? '恢复图表总览'
                                    : '放大表格区域'
                            }
                        >
                            <Button
                                aria-label={
                                    isTableFocusMode
                                        ? '恢复图表总览'
                                        : '放大表格区域'
                                }
                                icon={
                                    isTableFocusMode ? (
                                        <FullscreenExitOutlined />
                                    ) : (
                                        <FullscreenOutlined />
                                    )
                                }
                                onClick={toggleTableFocusMode}
                            />
                        </Tooltip>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleBatchRestart}
                        >
                            重启
                        </Button>
                        <Button onClick={handleBatchReset}>恢复出厂</Button>

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleBatchDelete}
                        >
                            删除
                        </Button>

                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={handleAddDevice}
                        >
                            添加设备
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* 表格模块 */}
            <Card
                className="devices-data-card min-h-0 flex-1"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderTop: 'none',
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0
                }}
                styles={{
                    body: {
                        flex: 1,
                        overflow: 'hidden',
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <div
                    ref={tableContainerRef}
                    className={
                        isEmptyTable
                            ? 'devices-table-shell devices-table-empty'
                            : 'devices-table-shell'
                    }
                    style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
                >
                    <Spin spinning={loading} style={{ height: '100%' }}>
                        {/* 关键：给 Spin 的包裹元素明确高度 */}
                        <div style={{ height: '100%', position: 'relative' }}>
                            <Table
                                columns={columns}
                                dataSource={filteredDataSource}
                                locale={{ emptyText: renderEmpty() }}
                                pagination={false}
                                rowKey="id"
                                rowSelection={rowSelection}
                                scroll={{ y: tableScrollY, x: true }}
                                sticky
                            />
                        </div>
                    </Spin>
                </div>
            </Card>

            {/* 分页模块 */}
            <Card
                className="devices-pagination-card"
                style={{
                    borderTop: 'none',
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0
                }}
            >
                <Pagination
                    align="end"
                    current={page}
                    pageSize={pageSize}
                    showSizeChanger
                    showTotal={(total) => `共 ${total} 条`}
                    total={hasChartFilter ? filteredDataSource.length : total}
                    onChange={onPageChange}
                    onShowSizeChange={onPageChange}
                />
            </Card>
        </div>
    )
}
