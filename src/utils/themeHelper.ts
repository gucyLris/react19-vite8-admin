import { THEME } from '@/constants/theme'
import type { ThemeType } from '@/types/theme'
import { getItem } from '@/utils/db'

// 辅助函数：获取系统主题
const getSystemTheme = (): ThemeType => {
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return THEME.DARK
    }
    return THEME.LIGHT
}

// 辅助函数：获取初始主题（异步）
export const getInitialTheme = async (): Promise<ThemeType> => {
    // 1. 从 IndexedDB 读取
    const stored = await getItem<ThemeType>('theme')
    if (stored) return stored
    // 2. 读取系统主题
    const system = getSystemTheme()

    return system
}
