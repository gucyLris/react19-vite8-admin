import { Navigate, Outlet } from 'react-router-dom'

// 判断 token
const isAuthenticated = () => {
    return !!localStorage.getItem('token')
}

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate replace to="/login" />
}

export default ProtectedRoute
