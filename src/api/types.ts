// 后端统一响应结构（根据实际后端调整）
export interface ApiResponse<T = any> {
    code: number // 200 成功，401 未授权，其他失败
    data: T
    message: string
}

// 请求配置扩展（用于自定义拦截器参数）
export interface CustomRequestConfig {
    /** 是否显示错误提示，默认 true */
    showError?: boolean
    /** 是否取消重复请求，默认 false */
    cancelDuplicated?: boolean
}

// 扩展 Axios 的 InternalAxiosRequestConfig 类型，增加自定义字段
declare module 'axios' {
    // 扩展请求配置（用于 get/post 等方法的 config 参数）
    export interface AxiosRequestConfig {
        custom?: CustomRequestConfig
    }

    // 扩展内部请求配置（用于拦截器）
    export interface InternalAxiosRequestConfig {
        custom?: CustomRequestConfig
    }
}
// 取消请求的标识
export interface CancelRequestSource {
    url: string
    controller: AbortController
}
