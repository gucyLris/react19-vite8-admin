import type { NavigateFunction } from 'react-router-dom'

let globalNavigate: NavigateFunction | null = null

export const setGlobalNavigate = (navigate: NavigateFunction) => {
    globalNavigate = navigate
}

export const navigateTo = (
    path: string,
    options: { replace?: boolean } = { replace: true }
) => {
    if (globalNavigate) {
        globalNavigate(path, options)
    } else {
        // 降级方案：硬跳转
        window.location.href = path
    }
}
