// 加载样式
import '@/assets/css/public.less'
import '@/assets/css/index.css'
// 覆盖 Ant Design 默认样式
import '@/assets/css/antd.less'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
