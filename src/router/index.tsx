import { createBrowserRouter } from 'react-router-dom'
import { Hello } from '@/components/HelloWord'
import { List } from '@/components/List'
import { Borad } from '@/pages/borad'

const routers = [
    {
        path: '/',
        element: <Hello />,
    },
    {
        path: '/list',
        element: <List />,
    },
    {
        path: '/borad',
        element: <Borad />,
    },
]

const router = createBrowserRouter(routers)

export default router
