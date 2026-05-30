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
    useMemo,
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
                        online: statistics.online,
                        upgrading: statistics.upgrading,
                        routerPercent: total
                            ? (statistics.routerCount / total) * 100
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
        loadDevices(page, pageSize, debouncedName)
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

    // 分页变化处理（修复 pageSize 变化时重置页码）
    const onPageChange = (newPage: number, newPageSize?: number) => {
        if (newPageSize && newPageSize !== pageSize) {
            setPage(1)
            setPageSize(newPageSize)
        } else {
            setPage(newPage)
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* 统计卡片区域 */}
            <Row className="mb-8!" gutter={16}>
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
            <Card>
                <div className="flex items-center justify-between">
                    <Input
                        allowClear
                        placeholder="按设备名称搜索"
                        prefix={<SearchOutlined />}
                        style={{ width: 320 }}
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
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

            {/* 表格卡片 */}
            <div className="h-full overflow-hidden">
                <Card className="h-full overflow-auto">
                    {/* 表格数据 */}
                    <Spin className="flex-1" spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            rowKey="id"
                        />
                    </Spin>
                </Card>
            </div>
            <Card>
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
