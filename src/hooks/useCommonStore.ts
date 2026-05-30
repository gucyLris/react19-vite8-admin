import { useShallow } from 'zustand/react/shallow'

import { THEME_STYLES } from '@/constants/theme'
import { useMenuStore, usePublicStore } from '@/stores'

// 创建一个自定义 hook 来组合多个 Zustand store 的状态和方法，方便在组件中使用, useShallow 进行浅比较以优化性能
export const useCommonStore = () => {
    const menuStore = useMenuStore(
        useShallow((state) => ({
            menuList: state.menuList
        }))
    )

    const publicStore = usePublicStore(
        useShallow((state) => ({
            isFullscreen: state.isFullscreen,
            theme: state.theme,
            rootBgClass: THEME_STYLES[state.theme].rootBgClass,
            // 根据 theme 实时计算样式类
            bgClass: THEME_STYLES[state.theme].bgClass,
            textClass: THEME_STYLES[state.theme].textClass
        }))
    )

    return {
        ...menuStore,
        ...publicStore
    }
}
