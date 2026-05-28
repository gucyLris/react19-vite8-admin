import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'
import { useCallback } from 'react'

import { useCommonStore } from '@/hooks/useCommonStore'
import { usePublicStore } from '@/stores'

export const ThemeIcon = () => {
    // 从公共 store 获取当前全屏状态
    const { theme } = useCommonStore()
    // 从另一个 store 获取更新全屏状态的 action
    const setThemeValue = usePublicStore((state) => state.setThemeValue)

    const THEME_ICON_MAP = {
        dark: 'line-md:moon-filled-alt-loop',
        light: 'line-md:moon-filled-to-sunny-filled-loop-transition'
    } as const

    // 使用 useCallback 稳定切换函数引用
    const handleToggleTheme = useCallback(() => {
        const nextTheme = theme === 'light' ? 'dark' : 'light'
        setThemeValue(nextTheme)
        // 可选的副作用：document.documentElement.classList 操作
    }, [theme, setThemeValue])

    // 根据当前主题选择不同的图标
    const iconName = THEME_ICON_MAP[theme] ?? THEME_ICON_MAP.light

    return (
        <Tooltip title="切换主题">
            <div onClick={handleToggleTheme}>
                <Icon
                    className="text-black-500 mr-3 flex w-6 cursor-pointer items-center justify-center text-lg"
                    icon={iconName}
                />
            </div>
        </Tooltip>
    )
}
