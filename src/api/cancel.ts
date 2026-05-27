import type { CancelRequestSource } from './types'

/** 管理进行中的请求，用于取消重复请求 */
class RequestCancelManager {
    private pendingRequests: Map<string, CancelRequestSource> = new Map()

    /** 生成请求唯一标识（根据 method + url + params + data） */
    private generateKey(config: any): string {
        const { method, url, params, data } = config
        return [method, url, JSON.stringify(params), JSON.stringify(data)].join(
            '&'
        )
    }

    /** 添加请求 */
    addPending(config: any): AbortController {
        const key = this.generateKey(config)
        if (this.pendingRequests.has(key)) {
            // 如果已存在，先取消之前的请求
            this.cancelPending(config)
        }
        const controller = new AbortController()
        this.pendingRequests.set(key, { url: config.url, controller })
        return controller
    }

    /** 移除请求 */
    removePending(config: any): void {
        const key = this.generateKey(config)
        this.pendingRequests.delete(key)
    }

    /** 取消请求 */
    cancelPending(config: any): void {
        const key = this.generateKey(config)
        const pending = this.pendingRequests.get(key)
        if (pending) {
            pending.controller.abort()
            this.pendingRequests.delete(key)
        }
    }

    /** 取消所有请求 */
    cancelAll(): void {
        this.pendingRequests.forEach(({ controller }) => controller.abort())
        this.pendingRequests.clear()
    }
}

export const cancelManager = new RequestCancelManager()
