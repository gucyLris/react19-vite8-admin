import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'

import {
    ANIMATION_DURATION,
    THEME_CLASS_MAP,
    THEME_ICON_MAP
} from '@/constants/theme'
import { useCommonStore } from '@/hooks/useCommonStore'
import { usePublicStore } from '@/stores'
import type { ThemeType } from '@/types/theme'

export const ThemeIcon = () => {
    const { theme } = useCommonStore()
    const setThemeValue = usePublicStore((state) => state.setThemeValue)

    // 纯切换逻辑（无动画）
    const toggleThemeScheme = (nextTheme: ThemeType) => {
        setThemeValue(nextTheme)
        document.body.className = THEME_CLASS_MAP[nextTheme]
    }

    // 带动画的切换
    const handleToggleTheme = (
        ev: React.MouseEvent<HTMLDivElement>,
        nextTheme: ThemeType
    ) => {
        if (!document.startViewTransition) {
            toggleThemeScheme(nextTheme)
            return
        }

        const transition = document.startViewTransition(() => {
            toggleThemeScheme(nextTheme)
        })

        transition.ready.then(() => {
            const { clientX, clientY } = ev
            const radius = Math.hypot(
                Math.max(clientX, window.innerWidth - clientX),
                Math.max(clientY, window.innerHeight - clientY)
            )

            document.documentElement.animate(
                [
                    { clipPath: `circle(0% at ${clientX}px ${clientY}px)` },
                    {
                        clipPath: `circle(${radius}px at ${clientX}px ${clientY}px)`
                    }
                ],
                {
                    duration: ANIMATION_DURATION,
                    pseudoElement: '::view-transition-new(root)'
                }
            )
        })
    }

    // 根据当前主题决定下一个主题
    const nextTheme: ThemeType = theme === 'light' ? 'dark' : 'light'

    return (
        <Tooltip title="切换主题">
            <div onClick={(ev) => handleToggleTheme(ev, nextTheme)}>
                <Icon
                    className="text-black-500 mr-3 flex w-6 cursor-pointer items-center justify-center text-lg"
                    icon={THEME_ICON_MAP[nextTheme]}
                />
            </div>
        </Tooltip>
    )
}
