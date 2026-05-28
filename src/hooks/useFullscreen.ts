import { useEffect } from 'react'

import { useCommonStore } from '@/hooks/useCommonStore'
import { usePublicStore } from '@/stores'

/**
 * 全屏功能的自定义 Hook
 * 提供全屏状态（是否全屏）以及切换全屏的方法，
 * 并自动监听全屏变化事件（如用户按 ESC 退出），保证 store 中的状态与实际同步。
 * @returns [isFullscreen, toggleFullscreen] 全屏状态与切换全屏的函数
 */
export function useFullscreen() {
    // 从公共 store 获取当前全屏状态
    const { isFullscreen } = useCommonStore()
    // 从另一个 store 获取更新全屏状态的 action
    const setFullscreen = usePublicStore((state) => state.setFullscreen)

    /**
     * 根据当前全屏状态切换全屏模式
     * 如果非全屏则尝试进入全屏，若已全屏则退出全屏。
     * @returns {Promise<boolean>} 操作成功返回 true，失败返回 false（或异常由内部捕获）
     */
    const toggleFullscreen = async (): Promise<boolean> => {
        // 获取当前实际的全屏元素（用于与 store 状态做交叉验证，增强可靠性）
        const isActuallyFullscreen = !!document.fullscreenElement

        // 进入全屏模式
        if (
            !isActuallyFullscreen &&
            document.documentElement?.requestFullscreen
        ) {
            try {
                await document.documentElement.requestFullscreen()
                setFullscreen(true)
                return true
            } catch (error) {
                console.error('进入全屏失败:', error)
                return false
            }
        }

        // 退出全屏模式
        if (isActuallyFullscreen && document.exitFullscreen) {
            try {
                await document.exitFullscreen()
                setFullscreen(false)
                return true
            } catch (error) {
                console.error('退出全屏失败:', error)
                return false
            }
        }

        // 当前环境不支持全屏 API
        console.warn('当前浏览器不支持全屏 API')
        return false
    }

    // 监听 fullscreenchange 事件，当用户通过其他方式（如按 ESC）改变全屏状态时，同步 store 中的状态
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement
            // 只有当实际状态与 store 中不一致时才更新，避免不必要的重渲染
            if (isNowFullscreen !== isFullscreen) {
                setFullscreen(isNowFullscreen)
            }
        }

        // 添加事件监听
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        // 清理函数：组件卸载时移除监听
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
        }
    }, [isFullscreen, setFullscreen]) // 依赖 isFullscreen 和 setFullscreen，确保回调中能获取最新值

    // 返回全屏状态与切换方法（保持与原返回值结构一致：数组）
    return [isFullscreen, toggleFullscreen] as const
}
