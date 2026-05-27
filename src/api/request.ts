// 导入 axios 和 类型
import axios, { AxiosError } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type { ApiResponse, CustomRequestConfig } from './types'
import { cancelManager } from './cancel'

// 获取环境变量（Vite 方式）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 180_000

// 创建 axios 实例
const service = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig & { custom?: CustomRequestConfig }) => {
        // 1. 处理重复请求取消
        if (config.custom?.cancelDuplicated) {
            const controller = cancelManager.addPending(config)
            config.signal = controller.signal
        }

        // 2. 添加 token（从 localStorage 或其它地方获取）
        const token = localStorage.getItem('token') || ''
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 3. 其他公共参数（如语言、版本等）
        // config.headers['X-Requested-With'] = 'XMLHttpRequest';

        return config
    },
    (error: AxiosError) => {
        // 请求配置错误
        console.error('请求配置错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { data, config } = response
        const custom = (config as any).custom as CustomRequestConfig | undefined

        // 移除已完成的请求（取消管理器）
        if (custom?.cancelDuplicated) {
            cancelManager.removePending(config)
        }

        // 根据业务 code 处理
        if (data.code === 200) {
            // 成功：返回 data 部分，便于业务使用
            return data.data
        }

        // 401：未授权，清除 token 并跳转登录
        if (data.code === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
            return Promise.reject(new Error(data.message || '登录已过期'))
        }

        // 其他业务错误
        const errorMsg = data.message || '请求失败'
        if (custom?.showError !== false) {
            // 可接入 UI 提示，例如 message.error(errorMsg)
            console.error('[响应错误]', errorMsg)
        }
        return Promise.reject(new Error(errorMsg))
    },
    (error: AxiosError) => {
        const { config, message: errMsg } = error

        // 移除已取消的请求
        if (config && (config as any).custom?.cancelDuplicated) {
            cancelManager.removePending(config)
        }

        // 请求取消（不报错，静默处理）
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
            return Promise.reject({ cancelled: true, message: '请求已取消' })
        }

        // 网络错误 / 超时
        let displayMsg = '网络异常，请稍后重试'
        if (errMsg.includes('timeout')) displayMsg = '请求超时'
        else if (errMsg.includes('Network Error')) displayMsg = '网络连接失败'
        else displayMsg = errMsg

        console.error('[请求异常]', displayMsg)
        // 可接入 UI 提示
        return Promise.reject(new Error(displayMsg))
    }
)

export default service
