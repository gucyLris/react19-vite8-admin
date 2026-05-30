import router from '@src/router'
import { App as AntdApp } from 'antd'
import { RouterProvider } from 'react-router-dom'

function App() {
    return (
        <AntdApp>
            <RouterProvider router={router} />
        </AntdApp>
    )
}

export default App
