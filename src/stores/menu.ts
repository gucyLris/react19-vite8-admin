// src/store/useMenuStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MenuItem } from '@/types/menu'

interface MenuStore {
    menuList: MenuItem[]
    setMenuList: (list: MenuItem[]) => void
}

export const useMenuStore = create<MenuStore>()(
    devtools(
        (set) => ({
            menuList: [],
            setMenuList: (list) =>
                set({ menuList: list }, false, 'menu/setList')
        }),
        {
            name: 'menuStore',
            enabled: import.meta.env.VITE_ENV === 'development'
        }
    )
)
