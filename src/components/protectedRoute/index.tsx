import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { getItem } from '@/utils/db'

const ProtectedRoute = () => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null)
    useEffect(() => {
        getItem<string>('token').then((token) => {
            setIsAuth(!!token)
        })
    }, [])

    // 判断 token
    return isAuth ? <Outlet /> : <Navigate replace to="/login" />
}

export default ProtectedRoute
