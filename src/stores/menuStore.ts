// src/store/useMenuStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { IMenuItem } from '@/types/menu'

interface IMenuStore {
    menuList: IMenuItem[]
    setMenuList: (list: IMenuItem[]) => void
}

export const useMenuStore = create<IMenuStore>()(
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
