import { createBrowserRouter } from 'react-router-dom'
import Layouts from '@/layouts'

const routers = [
    {
        path: '/',
        element: <Layouts />
    }
]

const router = createBrowserRouter(routers)

export default router
