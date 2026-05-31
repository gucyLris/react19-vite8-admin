import {
    DeleteOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Button,
    Card,
    Col,
    Empty,
    Input,
    message,
    Pagination,
    Row,
    Space,
    Spin,
    Statistic,
    Table
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
    DeviceStatus,
    type DeviceStatusType,
    DeviceType,
    type DeviceTypeType,
    type IDeviceItem
} from '@/types/device'

// 状态/类型映射
const statusMap: Record<DeviceStatusType, { color: string; text: string }> = {
    [DeviceStatus.Online]: { color: 'green', text: '在线' },
    [DeviceStatus.Offline]: { color: 'red', text: '离线' },
    [DeviceStatus.Upgrading]: { color: 'orange', text: '升级中' }
}
const typeMap: Record<DeviceTypeType, string> = {
    [DeviceType.Router]: '路由器',
    [DeviceType.Switch]: '交换机',
    [DeviceType.AP]: 'AP'
}

export const Devices = () => {
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState<IDeviceItem[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchName, setSearchName] = useState('')
    const [debouncedName, setDebouncedName] = useState('')

    // 统计数据
    const [stats, setStats] = useState({
        total: 0,
        online: 0,
        upgrading: 0,
        routerPercent: 0
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
                        upgrading: statistics?.upgrading ?? 0,
                        routerPercent: total
                            ? ((statistics?.routerCount ?? 0) / total) * 100
                            : 0
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
                    const item = statusMap[status]
                    return (
                        <span style={{ color: item?.color }}>{item?.text}</span>
                    )
                }
            },
            {
                title: '设备类型',
                dataIndex: 'type',
                key: 'type',
                render: (type: DeviceTypeType) => typeMap[type] || type
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
    const [tableScrollY, setTableScrollY] = useState(240)

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
        updateTableScrollY()
        window.addEventListener('resize', updateTableScrollY)
        return () => window.removeEventListener('resize', updateTableScrollY)
    }, [updateTableScrollY])

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
    const isEmptyTable = dataSource.length === 0

    // 空状态渲染：确保高度与滚动区域匹配，但避免产生额外滚动条
    const renderEmpty = () => {
        // 如果有数据，使用默认空状态
        if (dataSource.length) {
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
        <div className="flex h-full min-h-0 flex-col">
            {/* 统计卡片区域 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic title="全部设备" value={stats.total} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="在线设备" value={stats.online} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="待升级设备" value={stats.upgrading} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            precision={0}
                            suffix="%"
                            title="路由器占比"
                            value={stats.routerPercent}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 操作栏 */}
            <Card className="mt-4! mb-4!">
                <div className="flex items-center justify-between">
                    <Input
                        allowClear
                        placeholder="按设备名称搜索"
                        prefix={<SearchOutlined />}
                        style={{ width: 320 }}
                        value={searchName}
                        onChange={handleSearchNameChange}
                    />

                    <Space wrap>
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
                className="min-h-0 flex-1"
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
                                dataSource={dataSource}
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
                    total={total}
                    onChange={onPageChange}
                    onShowSizeChange={onPageChange}
                />
            </Card>
        </div>
    )
}
