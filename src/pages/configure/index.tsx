import {
    CloudSyncOutlined,
    DeleteOutlined,
    DeploymentUnitOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    Card,
    Drawer,
    Empty,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Progress,
    Select,
    Space,
    Spin,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Key } from 'react'
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { useSearchParams } from 'react-router-dom'

import { getConfigurePageMockApi } from '@/api/modules/configure'
import {
    CONFIGURE_MAJOR_COLUMN_LABELS,
    CONFIGURE_MAJOR_TABS,
    CONFIGURE_STATUS_META,
    CONFIGURE_SUB_TAB_MAP
} from '@/constants/configure'
import { THEME } from '@/constants/theme'
import { useCommonStore } from '@/hooks/useCommonStore'
import {
    CONFIGURE_NETWORK_STATUS,
    type ConfigureMajorTabType,
    type ConfigureNetworkStatusType,
    type ConfigureSubTabType,
    type IConfigurePageData,
    type IConfigureRowFormValues,
    type IConfigureTableRow
} from '@/types/configure'

const INITIAL_MAJOR_TAB = CONFIGURE_MAJOR_TABS[0].key
const DEFAULT_PAGE_SIZE = 8

const getInitialTableScrollY = () => {
    if (typeof window === 'undefined') return 260
    return Math.max(180, window.innerHeight - 610)
}

const isConfigureMajorTab = (value: string): value is ConfigureMajorTabType =>
    CONFIGURE_MAJOR_TABS.some((item) => item.key === value)

const defaultRowFormValues: IConfigureRowFormValues = {
    name: '',
    tag: '',
    slotA: '',
    slotB: '',
    slotC: '',
    slotD: '',
    note: '',
    editable: true,
    configStatus: CONFIGURE_NETWORK_STATUS.PENDING,
    networkStatus: CONFIGURE_NETWORK_STATUS.PENDING
}

const renderStatusTag = (status: ConfigureNetworkStatusType) => (
    <Tag color={CONFIGURE_STATUS_META[status].color}>
        {CONFIGURE_STATUS_META[status].label}
    </Tag>
)

export const ConfigurePage = () => {
    const { theme: currentTheme, textClass } = useCommonStore()
    const isDark = currentTheme === THEME.DARK
    const [searchParams, setSearchParams] = useSearchParams()

    const [pageData, setPageData] = useState<IConfigurePageData | null>(null)
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingRow, setEditingRow] = useState<IConfigureTableRow | null>(
        null
    )
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [form] = Form.useForm<IConfigureRowFormValues>()
    const [modal, contextHolder] = Modal.useModal()

    const moduleParam = searchParams.get('module') ?? ''
    const majorTab = isConfigureMajorTab(moduleParam)
        ? moduleParam
        : INITIAL_MAJOR_TAB
    const subTabs = CONFIGURE_SUB_TAB_MAP[majorTab]
    const subParam = searchParams.get('sub') ?? ''
    const currentSubTab = subTabs.some((item) => item.key === subParam)
        ? (subParam as ConfigureSubTabType)
        : subTabs[0].key
    const currentColumnLabels = CONFIGURE_MAJOR_COLUMN_LABELS[majorTab]

    useEffect(() => {
        let active = true

        const loadData = async () => {
            setLoading(true)
            try {
                const data = await getConfigurePageMockApi(
                    majorTab,
                    currentSubTab
                )
                if (!active) return

                setPageData(data)
                setSelectedRowKeys([])
                setCurrentPage(1)
            } catch (error) {
                console.error(error)
                if (active) message.error('配置数据加载失败，请稍后重试')
            } finally {
                if (active) setLoading(false)
            }
        }

        void loadData()

        return () => {
            active = false
        }
    }, [currentSubTab, majorTab])

    const filteredRows = useMemo(() => {
        if (!pageData) return []
        const keyword = searchText.trim().toLowerCase()
        if (!keyword) return pageData.rows

        return pageData.rows.filter((item) =>
            [
                item.name,
                item.tag,
                item.slotA,
                item.slotB,
                item.slotC,
                item.slotD,
                item.note
            ]
                .filter((value): value is string => Boolean(value))
                .some((value) => value.toLowerCase().includes(keyword))
        )
    }, [pageData, searchText])

    const pagedRows = useMemo(() => {
        const maxPage = Math.max(1, Math.ceil(filteredRows.length / pageSize))
        const safeCurrentPage = Math.min(currentPage, maxPage)
        const startIndex = (safeCurrentPage - 1) * pageSize
        return filteredRows.slice(startIndex, startIndex + pageSize)
    }, [currentPage, filteredRows, pageSize])

    const subTabItems = useMemo(
        () =>
            subTabs.map((item) => ({
                key: item.key,
                label: item.label
            })),
        [subTabs]
    )

    const handleSubTabChange = (key: string) => {
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.set('module', majorTab)
        nextSearchParams.set('sub', key)
        setSearchParams(nextSearchParams, { replace: true })
        setSearchText('')
        setCurrentPage(1)
    }

    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [tableScrollY, setTableScrollY] = useState(getInitialTableScrollY)

    const updateTableScrollY = useCallback(() => {
        const container = tableContainerRef.current
        if (!container) return

        const header =
            container.querySelector('.ant-table-thead tr') ??
            container.querySelector('.ant-table-header')
        const headerHeight = header?.getBoundingClientRect().height ?? 55
        const nextScrollY = Math.max(
            120,
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
    }, [filteredRows.length, loading, updateTableScrollY])

    const openCreateDrawer = useCallback(() => {
        setEditingRow(null)
        form.setFieldsValue(defaultRowFormValues)
        setDrawerOpen(true)
    }, [form])

    const openEditDrawer = useCallback(
        (row: IConfigureTableRow) => {
            setEditingRow(row)
            form.setFieldsValue({
                name: row.name,
                tag: row.tag,
                slotA: row.slotA,
                slotB: row.slotB,
                slotC: row.slotC,
                slotD: row.slotD,
                note: row.note,
                editable: row.editable,
                configStatus: row.configStatus,
                networkStatus: row.networkStatus
            })
            setDrawerOpen(true)
        },
        [form]
    )

    const closeDrawer = useCallback(() => {
        setDrawerOpen(false)
        setEditingRow(null)
        form.resetFields()
    }, [form])

    const deleteRow = useCallback((row: IConfigureTableRow) => {
        setPageData((current) => {
            if (!current) return current

            return {
                ...current,
                rows: current.rows.filter((item) => item.id !== row.id)
            }
        })
        setSelectedRowKeys((currentKeys) =>
            currentKeys.includes(row.id) ? [] : currentKeys
        )
        message.success(`已删除 ${row.name}`)
    }, [])

    const handleDeleteRow = useCallback(
        (row: IConfigureTableRow) => {
            modal.confirm({
                title: '确认删除该配置项？',
                content: `删除后会从当前配置列表中移除「${row.name}」，请确认没有正在下发的任务。`,
                okText: '确认删除',
                okButtonProps: { danger: true },
                cancelText: '取消',
                centered: true,
                onOk: () => deleteRow(row)
            })
        },
        [deleteRow, modal]
    )

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const nextId = editingRow?.id ?? `row-${Date.now()}`

            setPageData((current) => {
                if (!current) return current

                const nextRow: IConfigureTableRow = {
                    id: nextId,
                    name: values.name,
                    tag: values.tag,
                    slotA: values.slotA,
                    slotB: values.slotB,
                    slotC: values.slotC,
                    slotD: values.slotD,
                    note: values.note,
                    editable: values.editable,
                    configStatus: values.configStatus,
                    networkStatus: values.networkStatus
                }

                return {
                    ...current,
                    rows: editingRow
                        ? current.rows.map((item) =>
                              item.id === editingRow.id ? nextRow : item
                          )
                        : [nextRow, ...current.rows]
                }
            })

            setSelectedRowKeys([nextId])
            setCurrentPage(1)
            message.success(editingRow ? '配置项已更新' : '配置项已创建')
            closeDrawer()
        } catch {
            return
        }
    }

    const columns = useMemo<ColumnsType<IConfigureTableRow>>(
        () => [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
                width: 260,
                render: (value: string, row) => (
                    <div className="flex items-start gap-3">
                        <div
                            className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                                isDark
                                    ? 'bg-sky-400/10 text-sky-300'
                                    : 'bg-sky-100 text-sky-600'
                            }`}
                        >
                            <DeploymentUnitOutlined />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{value}</span>
                                {row.tag ? <Tag>{row.tag}</Tag> : null}
                            </div>
                            <div
                                className={`mt-1 text-xs leading-5 ${
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                            >
                                {row.note}
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: currentColumnLabels[0],
                dataIndex: 'slotA',
                key: 'slotA',
                width: 150
            },
            {
                title: currentColumnLabels[1],
                dataIndex: 'slotB',
                key: 'slotB',
                width: 220
            },
            {
                title: currentColumnLabels[2],
                dataIndex: 'slotC',
                key: 'slotC',
                width: 150
            },
            {
                title: currentColumnLabels[3],
                dataIndex: 'slotD',
                key: 'slotD',
                width: 150
            },
            {
                title: '配置状态',
                dataIndex: 'configStatus',
                key: 'configStatus',
                width: 120,
                render: renderStatusTag
            },
            {
                title: '网络状态',
                dataIndex: 'networkStatus',
                key: 'networkStatus',
                width: 120,
                render: renderStatusTag
            },
            {
                title: '操作',
                key: 'action',
                width: 104,
                fixed: 'right',
                render: (_, row) => (
                    <Space size={4}>
                        <Tooltip title="编辑">
                            <Button
                                icon={<EditOutlined />}
                                size="small"
                                type="text"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    openEditDrawer(row)
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            title={row.editable ? '删除' : '默认项不可删除'}
                        >
                            <Button
                                danger
                                disabled={!row.editable}
                                icon={<DeleteOutlined />}
                                size="small"
                                type="text"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleDeleteRow(row)
                                }}
                            />
                        </Tooltip>
                    </Space>
                )
            }
        ],
        [currentColumnLabels, handleDeleteRow, isDark, openEditDrawer]
    )

    const mutedTextClassName = isDark ? 'text-slate-400' : 'text-slate-500'
    const isEmptyTable = filteredRows.length === 0

    const handlePageChange = (nextPage: number, nextPageSize?: number) => {
        if (nextPageSize && nextPageSize !== pageSize) {
            setCurrentPage(1)
            setPageSize(nextPageSize)
            return
        }
        setCurrentPage(nextPage)
    }

    const renderEmpty = () => (
        <div
            style={{
                height: tableScrollY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Empty
                description="暂无配置数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        </div>
    )

    return (
        <div
            className={`devices-page devices-page-${currentTheme} flex h-full min-h-0 flex-col ${textClass}`}
        >
            {contextHolder}
            <Card
                className="devices-chart-card devices-overview configure-hero-card mb-4! shadow!"
                styles={{
                    body: {
                        padding: '16px 20px 16px'
                    }
                }}
            >
                <div className="flex h-full min-h-0 flex-col justify-between gap-5">
                    <Tabs
                        activeKey={currentSubTab}
                        className="configure-sub-tabs min-w-0 [&_.ant-tabs-nav]:m-0! [&_.ant-tabs-nav::before]:border-0!"
                        items={subTabItems}
                        tabBarGutter={22}
                        tabPlacement="top"
                        onChange={handleSubTabChange}
                    />

                    <div className="flex min-h-0 items-center justify-between gap-6">
                        <div className="flex min-w-0 items-center gap-4">
                            <Avatar
                                size={54}
                                style={{
                                    background:
                                        'linear-gradient(135deg, #0ea5e9 0%, #2563eb 55%, #6366f1 100%)'
                                }}
                            >
                                <DeploymentUnitOutlined />
                            </Avatar>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="truncate text-lg font-semibold">
                                        {pageData?.gateway.name ?? '加载中'}
                                    </span>
                                    {renderStatusTag(
                                        pageData?.gateway.status ??
                                            CONFIGURE_NETWORK_STATUS.PENDING
                                    )}
                                </div>
                                <div
                                    className={`mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm ${mutedTextClassName}`}
                                >
                                    <span>型号 {pageData?.gateway.model}</span>
                                    <span>SN {pageData?.gateway.sn}</span>
                                    <span>
                                        最近同步 {pageData?.gateway.lastSyncAt}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Space wrap>
                            <Button
                                onClick={() => message.info('已保留当前网关')}
                            >
                                选择网关
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() =>
                                    message.success('已刷新当前配置')
                                }
                            >
                                刷新
                            </Button>
                        </Space>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
                        <div>
                            <div className={`text-xs ${mutedTextClassName}`}>
                                管理地址
                            </div>
                            <div className="mt-1 font-medium">
                                {pageData?.gateway.ip}
                            </div>
                        </div>
                        <div>
                            <div className={`text-xs ${mutedTextClassName}`}>
                                上联方式
                            </div>
                            <div className="mt-1 font-medium">
                                {pageData?.gateway.uplink}
                            </div>
                        </div>
                        <div>
                            <div className={`text-xs ${mutedTextClassName}`}>
                                固件版本
                            </div>
                            <div className="mt-1 font-medium">
                                {pageData?.gateway.firmware}
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                                <span className={mutedTextClassName}>
                                    健康度
                                </span>
                                <span className="font-medium">
                                    {pageData?.gateway.healthRate ?? 0}%
                                </span>
                            </div>
                            <Progress
                                percent={pageData?.gateway.healthRate ?? 0}
                                railColor={
                                    isDark
                                        ? 'rgba(255,255,255,0.08)'
                                        : '#e2e8f0'
                                }
                                showInfo={false}
                                strokeColor={{
                                    from: '#0ea5e9',
                                    to: '#6366f1'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="devices-toolbar-card mb-4!">
                <div className="flex items-center justify-between">
                    <div className="devices-toolbar-left">
                        <Input
                            allowClear
                            placeholder="搜索名称 / 标签 / 备注"
                            prefix={<SearchOutlined />}
                            style={{ width: 320 }}
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    <Space wrap>
                        <Button
                            icon={<CloudSyncOutlined />}
                            onClick={() => message.success('已模拟批量同步')}
                        >
                            批量同步
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={openCreateDrawer}
                        >
                            新建配置
                        </Button>
                    </Space>
                </div>
            </Card>

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
                        <div style={{ height: '100%', position: 'relative' }}>
                            <Table<IConfigureTableRow>
                                columns={columns}
                                dataSource={pagedRows}
                                locale={{ emptyText: renderEmpty() }}
                                pagination={false}
                                rowClassName={(record) =>
                                    record.id === selectedRowKeys[0]
                                        ? 'bg-sky-500/10'
                                        : ''
                                }
                                rowKey="id"
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: (keys) => setSelectedRowKeys(keys)
                                }}
                                scroll={{ x: 1180, y: tableScrollY }}
                                sticky
                                onRow={(record) => ({
                                    onClick: () =>
                                        setSelectedRowKeys([record.id])
                                })}
                            />
                        </div>
                    </Spin>
                </div>
            </Card>

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
                    current={Math.min(
                        currentPage,
                        Math.max(1, Math.ceil(filteredRows.length / pageSize))
                    )}
                    pageSize={pageSize}
                    pageSizeOptions={[8, 12, 20]}
                    showSizeChanger
                    total={filteredRows.length}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                />
            </Card>

            <Drawer
                destroyOnClose
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={closeDrawer}>取消</Button>
                        <Button
                            icon={<SaveOutlined />}
                            type="primary"
                            onClick={() => void handleSubmit()}
                        >
                            保存
                        </Button>
                    </div>
                }
                open={drawerOpen}
                size={460}
                title={editingRow ? '编辑配置项' : '新建配置项'}
                onClose={closeDrawer}
            >
                <Form
                    form={form}
                    initialValues={defaultRowFormValues}
                    layout="vertical"
                >
                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: '请输入名称' }]}
                    >
                        <Input placeholder="请输入名称" />
                    </Form.Item>

                    <Form.Item label="标签" name="tag">
                        <Input placeholder="例如：办公 / 访客 / 物联" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={currentColumnLabels[0]}
                            name="slotA"
                            rules={[{ required: true, message: '请输入内容' }]}
                        >
                            <Input placeholder="请输入内容" />
                        </Form.Item>
                        <Form.Item
                            label={currentColumnLabels[1]}
                            name="slotB"
                            rules={[{ required: true, message: '请输入内容' }]}
                        >
                            <Input placeholder="请输入内容" />
                        </Form.Item>
                        <Form.Item
                            label={currentColumnLabels[2]}
                            name="slotC"
                            rules={[{ required: true, message: '请输入内容' }]}
                        >
                            <Input placeholder="请输入内容" />
                        </Form.Item>
                        <Form.Item
                            label={currentColumnLabels[3]}
                            name="slotD"
                            rules={[{ required: true, message: '请输入内容' }]}
                        >
                            <Input placeholder="请输入内容" />
                        </Form.Item>
                    </div>

                    <Form.Item label="配置状态" name="configStatus">
                        <Select
                            options={Object.entries(CONFIGURE_STATUS_META).map(
                                ([value, item]) => ({
                                    label: item.label,
                                    value
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="网络状态" name="networkStatus">
                        <Select
                            options={Object.entries(CONFIGURE_STATUS_META).map(
                                ([value, item]) => ({
                                    label: item.label,
                                    value
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="备注" name="note">
                        <Input.TextArea placeholder="请输入备注" rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="允许删除"
                        name="editable"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}
