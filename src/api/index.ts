/**
 * 请求实例（已配置拦截器、取消重复请求等功能）
 * @see ./request.ts 具体实例配置
 */
import request from './request'
import type { CustomRequestConfig } from './types'

// 导出取消请求管理器，可用于全局取消所有进行中的请求
export { cancelManager } from './cancel'

// 导出类型定义，供外部业务模块使用
export type { ApiResponse, CustomRequestConfig } from './types'

/**
 * 封装 GET 请求
 * @template T - 响应数据的类型，默认为 any
 * @param url - 请求地址
 * @param params - URL 查询参数（会拼接在 url 后）
 * @param custom - 自定义配置（如控制错误提示、重复请求取消）
 * @returns Promise 包裹的响应数据（直接返回后端 data 字段内容）
 *
 * @example
 * 获取用户信息，不显示错误弹窗，并启用重复请求取消
 * const data = await get<UserInfo>('/user/profile', { id: 1 }, { showError: false, cancelDuplicated: true });
 */
export const get = <T = any>(
    url: string,
    params?: any,
    custom?: CustomRequestConfig
) => request.get<T, T>(url, { params, custom })

/**
 * 封装 POST 请求
 * @template T - 响应数据的类型，默认为 any
 * @param url - 请求地址
 * @param data - 请求体数据（JSON 格式）
 * @param custom - 自定义配置
 * @returns Promise 包裹的响应数据
 *
 * @example
 * const result = await post<{ token: string }>('/auth/login', { username, password });
 */
export const post = <T = any>(
    url: string,
    data?: any,
    custom?: CustomRequestConfig
) => request.post<T, T>(url, data, { custom })

/**
 * 封装 PUT 请求（全量更新）
 * @template T - 响应数据的类型，默认为 any
 * @param url - 请求地址
 * @param data - 更新的资源数据
 * @param custom - 自定义配置
 * @returns Promise 包裹的响应数据
 */
export const put = <T = any>(
    url: string,
    data?: any,
    custom?: CustomRequestConfig
) => request.put<T, T>(url, data, { custom })

/**
 * 封装 DELETE 请求
 * @template T - 响应数据的类型，默认为 any
 * @param url - 请求地址
 * @param params - URL 查询参数（如资源 ID）
 * @param custom - 自定义配置
 * @returns Promise 包裹的响应数据
 *
 * @example
 * await del('/user/123');
 */
export const del = <T = any>(
    url: string,
    params?: any,
    custom?: CustomRequestConfig
) => request.delete<T, T>(url, { params, custom })
