import type { MessageInstance } from 'antd/es/message/interface'

let messageInstance: MessageInstance | null = null

// 在根组件中调用此方法注入实例（见下方示例）
export const setGlobalMessageInstance = (instance: MessageInstance) => {
    messageInstance = instance
}

export const handleErrorMsg = (error?: string, content?: string) => {
    if (messageInstance) {
        messageInstance.error({
            content: error || content || '接口异常，请稍后再试！',
            key: 'error'
        })
    } else {
        // 降级：如果实例未就绪，可忽略或 fallback 到 console
        console.warn('message instance not ready', error || content)
    }
}

export const handleSuccessMsg = (msg?: string, content?: string) => {
    if (messageInstance) {
        messageInstance.success({
            content: msg || content || '操作成功！',
            key: 'success'
        })
    } else {
        console.warn('message instance not ready', msg || content)
    }
}
