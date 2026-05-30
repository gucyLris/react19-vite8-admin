import { createBrowserRouter, redirect } from 'react-router-dom'

import ProtectedRoute from '@/components/protectedRoute' // 引入
import Layouts from '@/layouts'
import { Dashboard } from '@/pages/dashboard'
import { Devices } from '@/pages/devices'
import Login from '@/pages/login'
import { Terminal } from '@/pages/terminal'
import { Topology } from '@/pages/topology'
import { getItem } from '@/utils/db'

const router = createBrowserRouter([
    {
        // 守卫包裹所有需要登录的路由
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Layouts />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'topology', element: <Topology /> },
                    { path: 'devices', element: <Devices /> },
                    { path: 'terminal', element: <Terminal /> }
                ]
            }
        ]
    },
    {
        path: 'login',
        element: <Login />,
        loader: async () => {
            const isAuth = await getItem('token')
            return isAuth ? redirect('/') : null
        }
    }
])

export default router
