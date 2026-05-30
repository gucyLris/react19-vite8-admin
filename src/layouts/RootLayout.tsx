import { Outlet } from 'react-router-dom'

import { GlobalInjector } from '@/components/globalInjector'

export function RootLayout() {
    return (
        <>
            <GlobalInjector />
            <Outlet />
        </>
    )
}
