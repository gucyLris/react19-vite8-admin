import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { ThemeType } from '@/types/theme'
import { getInitialTheme } from '@/utils/themeHelper'

interface IPublicState {
    theme: ThemeType // 主题
    isFullscreen: boolean // 是否全屏
    setThemeValue: (theme: ThemeType) => void
    setFullscreen: (isFullscreen: boolean) => void
    initializeTheme: () => Promise<void> // 初始化 Theme 函数
}

export const usePublicStore = create<IPublicState>()(
    devtools(
        (set) => ({
            theme: 'light',
            isFullscreen: false,
            setThemeValue: (theme: ThemeType) => set({ theme }),
            setFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
            initializeTheme: async () => {
                const initialTheme = await getInitialTheme()
                set({ theme: initialTheme })
            }
        }),
        {
            enabled: import.meta.env.NODE_ENV === 'development',
            name: 'publicStore'
        }
    )
)
