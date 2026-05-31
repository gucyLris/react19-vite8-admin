import type { MessageInstance } from 'antd/es/message/interface'

// ---------- 全局实例存储 ----------
let messageApi: MessageInstance | null = null

/**
 * 注入全局 message 实例（由 App.tsx 中的 GlobalMessage 调用）
 */
export const setMessageApi = (api: MessageInstance) => {
    messageApi = api
}

// ---------- 内部通用调用 ----------
const showMessage = (
    type: 'success' | 'error' | 'info' | 'warning',
    content: string,
    key?: string
) => {
    console.log('showMessage 调用', type, content, !!messageApi)
    if (!messageApi) {
        console.warn(
            '[messageHelper] 实例未初始化，请确认 GlobalMessage 已挂载'
        )
        return
    }
    messageApi[type]({
        content,
        key: key ?? type // 默认用类型做 key，避免同类消息堆积
    })
}

// ---------- 对外暴露的语义化方法 ----------
export const handleSuccessMsg = (msg?: string, fallback?: string) => {
    showMessage('success', msg || fallback || '操作成功！')
}

export const handleErrorMsg = (error?: string, fallback?: string) => {
    showMessage('error', error || fallback || '接口异常，请稍后再试！')
}

export const handleInfoMsg = (msg?: string, fallback?: string) => {
    showMessage('info', msg || fallback || '提示')
}

export const handleWarningMsg = (msg?: string, fallback?: string) => {
    showMessage('warning', msg || fallback || '警告')
}

// ---------- 模拟静态调用对象 ----------
export const message = {
    success: (content: string, key?: string) =>
        showMessage('success', content, key),
    error: (content: string, key?: string) =>
        showMessage('error', content, key),
    info: (content: string, key?: string) => showMessage('info', content, key),
    warning: (content: string, key?: string) =>
        showMessage('warning', content, key)
}
