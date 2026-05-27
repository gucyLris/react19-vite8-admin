import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { loadViteServerConfig } from './src/utils/viteServerLoad'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // 加载环境变量（Vite 默认不会暴露给配置函数，需要手动 loadEnv）
    const env = loadEnv(mode, process.cwd(), '')
    // 解析 VITE_PROXY
    const proxyConfig = loadViteServerConfig(env)

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@src': path.resolve(__dirname, 'src'),
            },
        },
        plugins: [react()],
        server: {
            open: true,
            port: parseInt(env.VITE_SERVER_PORT) || 5173,
            // 跨域处理
            proxy: proxyConfig, // 将转换后的对象传给 Vite
            // 减少文件监听开销
            watch: {
                ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
                usePolling: false,
            },
            // HMR 优化，减少开发环境切换卡顿
            hmr: {
                overlay: true,
            },
        },
    }
})
