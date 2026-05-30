export const THEME = {
    LIGHT: 'light',
    DARK: 'dark'
} as const

export type ThemeType = (typeof THEME)[keyof typeof THEME]

// 图标映射（用于主题切换按钮）
export const THEME_ICON_MAP = {
    [THEME.DARK]: 'line-md:moon-filled-alt-loop',
    [THEME.LIGHT]: 'line-md:moon-filled-to-sunny-filled-loop-transition'
} as const

export const THEME_CLASS_MAP = {
    [THEME.DARK]: 'theme-dark',
    [THEME.LIGHT]: 'theme-primary'
} as const

// 全局根元素的类名（用于 Tailwind 暗色模式）
export const THEME_ROOT_CLASS = {
    [THEME.DARK]: 'dark',
    [THEME.LIGHT]: ''
} as const

// 组件内部样式类（可根据需要扩展）
export const THEME_STYLES = {
    [THEME.LIGHT]: {
        bgClass: 'bg-white',
        textClass: 'text-black',
        rootBgClass: 'bg-[#f3f3f3]'
    },
    [THEME.DARK]: {
        bgClass: 'bg-[#191919]',
        textClass: 'text-white',
        rootBgClass: 'bg-[#000000]'
    }
} as const

// 动画配置
export const THEME_ANIMATION = {
    DURATION: 400,
    EASING: 'ease-in-out'
} as const

// 工具函数：获取初始主题
export const getInitialTheme = (): ThemeType => {
    const saved = localStorage.getItem('theme') as ThemeType | null
    if (saved && Object.values(THEME).includes(saved)) return saved
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches
    return prefersDark ? THEME.DARK : THEME.LIGHT
}
