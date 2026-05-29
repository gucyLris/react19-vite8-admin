import { LockOutlined, UserOutlined } from '@ant-design/icons'
import {
    Button,
    Checkbox,
    ConfigProvider,
    Divider,
    Form,
    Input,
    message,
    theme
} from 'antd'
import { useMemo, useState } from 'react'

import Github from '@/components/github'
import { ThemeIcon } from '@/components/theme'
import { useCommonStore } from '@/hooks/useCommonStore'

const { defaultAlgorithm, darkAlgorithm } = theme

// 表单值类型
interface LoginFormValues {
    username: string
    password: string
    remember?: boolean
}

const LoginPage = () => {
    const {
        theme: currentTheme,
        bgClass,
        textClass,
        rootBgClass
    } = useCommonStore()
    const [form] = Form.useForm<LoginFormValues>()
    const [loading, setLoading] = useState(false)

    const onFinish = (values: LoginFormValues) => {
        setLoading(true)
        // 模拟登录请求
        setTimeout(() => {
            message.success(`欢迎回来，${values.username}`)
            setLoading(false)
            // 实际项目中可在此处理路由跳转、token存储等
        }, 1000)
    }

    // 动态主题配置
    const themeConfig = useMemo(
        () => ({
            algorithm: [
                currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm
            ]
        }),
        [currentTheme]
    )

    return (
        <ConfigProvider theme={themeConfig}>
            <div className="flex h-screen flex-col">
                <div
                    className={`flex h-12 items-center justify-end p-4 ${bgClass} ${textClass}`}
                >
                    <Github />
                    <ThemeIcon />
                </div>

                <div
                    className={`flex h-auto flex-1 items-center justify-center ${rootBgClass}`}
                >
                    <div
                        className={`flex w-full max-w-md flex-col items-center rounded-2xl ${bgClass} p-3 shadow-lg`}
                    >
                        <div
                            className={`m-8! text-2xl font-semibold ${textClass}`}
                        >
                            登录页面
                        </div>

                        <Form
                            className="w-[80%] text-left"
                            form={form}
                            layout="vertical"
                            name="login"
                            requiredMark={false}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={<span className="text-sm">账号</span>}
                                name="username"
                                rules={[
                                    { required: true, message: '请输入账号！' }
                                ]}
                            >
                                <Input
                                    className="rounded-md"
                                    placeholder="请输入账号"
                                    prefix={<UserOutlined />}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm">密码</span>}
                                name="password"
                                rules={[
                                    { required: true, message: '请输入密码！' }
                                ]}
                            >
                                <Input.Password
                                    className="rounded-md"
                                    placeholder="请输入密码"
                                    prefix={<LockOutlined />}
                                    size="large"
                                />
                            </Form.Item>

                            <div className="flex items-center justify-between">
                                <Form.Item
                                    name="remember"
                                    noStyle
                                    valuePropName="checked"
                                >
                                    <Checkbox className="text-sm">
                                        记住用户名
                                    </Checkbox>
                                </Form.Item>
                                <div className="space-x-4 text-sm">
                                    <a href="#">立即注册</a>
                                </div>
                            </div>

                            <Form.Item className="mt-4!">
                                <Button
                                    block
                                    className="h-10 rounded-md text-base font-medium"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    type="primary"
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider className="my-4 text-xs!">
                            其他账号登录
                        </Divider>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    )
}

export default LoginPage
