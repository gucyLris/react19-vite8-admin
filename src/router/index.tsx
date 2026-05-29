import { createBrowserRouter } from 'react-router-dom'

import Layouts from '@/layouts'
import { Dashboard } from '@/pages/dashboard'
import { Devices } from '@/pages/devices'
import { Terminal } from '@/pages/terminal'
import { Topology } from '@/pages/topology'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layouts />,
        children: [
            { index: true, element: <Dashboard /> }, // 访问 / 时重定向到 /dashboard
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'topology', element: <Topology /> },
            { path: 'devices', element: <Devices /> },
            { path: 'terminal', element: <Terminal /> }
        ]
    }
])

export default router
