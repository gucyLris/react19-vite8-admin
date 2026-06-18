import { useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { CONFIGURE_MAJOR_TABS } from '@/constants/configure'
import { THEME } from '@/constants/theme'
import { useCommonStore } from '@/hooks/useCommonStore'
import type { ConfigureMajorTabType } from '@/types/configure'

const INITIAL_CONFIGURE_TAB = CONFIGURE_MAJOR_TABS[0].key

const isConfigureMajorTab = (value: string): value is ConfigureMajorTabType =>
    CONFIGURE_MAJOR_TABS.some((item) => item.key === value)

export const NavBar = () => {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const { theme: currentTheme } = useCommonStore()
    const isConfigurePage = location.pathname === '/configure'
    const isDark = currentTheme === THEME.DARK

    const configureTabItems = useMemo(
        () =>
            CONFIGURE_MAJOR_TABS.map((item) => ({
                key: item.key,
                label: item.label
            })),
        []
    )

    const activeConfigureTab = isConfigureMajorTab(
        searchParams.get('module') ?? ''
    )
        ? searchParams.get('module')!
        : INITIAL_CONFIGURE_TAB

    const handleConfigureTabChange = (key: string) => {
        const nextSearchParams = new URLSearchParams(searchParams)
        nextSearchParams.set('module', key)
        nextSearchParams.delete('sub')
        setSearchParams(nextSearchParams, { replace: true })
    }

    return isConfigurePage ? (
        <div className="flex h-10 min-w-0 items-center gap-3">
            <div
                className={`shrink-0 text-sm font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-900'
                }`}
            >
                配置
            </div>
            <div
                className={`flex min-w-0 items-center gap-2 rounded-2xl px-3 py-1.5 ${
                    isDark ? 'bg-white/3' : 'bg-white/50'
                }`}
            >
                {configureTabItems.map((item, index) => {
                    const isActive = item.key === activeConfigureTab

                    return (
                        <div key={item.key} className="flex items-center gap-2">
                            {index > 0 ? (
                                <span
                                    className={`text-sm select-none ${
                                        isDark
                                            ? 'text-slate-600'
                                            : 'text-slate-300'
                                    }`}
                                >
                                    |
                                </span>
                            ) : null}
                            <button
                                className={`relative pb-1 text-sm font-medium whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:transition-transform ${
                                    isActive
                                        ? 'text-sky-500 after:scale-x-100 after:bg-sky-500'
                                        : isDark
                                          ? 'text-slate-300 after:scale-x-0 after:bg-sky-400 hover:text-sky-300'
                                          : 'text-slate-600 after:scale-x-0 after:bg-sky-500 hover:text-sky-600'
                                }`}
                                type="button"
                                onClick={() =>
                                    handleConfigureTabChange(item.key)
                                }
                            >
                                {item.label}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    ) : null
}
