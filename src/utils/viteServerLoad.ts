type EnvConfigs = Record<string, string>

export const loadViteServerConfig = (env: EnvConfigs) => {
    let proxyConfig = {}
    if (env.VITE_PROXY) {
        try {
            // 将字符串解析为数组，例如 [["/api", "target1"], ["/test", "target2"]]
            const proxyList = JSON.parse(env.VITE_PROXY)
            if (Array.isArray(proxyList)) {
                proxyConfig = Object.fromEntries(
                    proxyList.map(([prefix, target]) => [
                        prefix,
                        {
                            target: target,
                            changeOrigin: true,
                            rewrite: (path: string) => path.replace(prefix, ''), // 可选，移除前缀
                        },
                    ])
                )
            }
        } catch (e) {
            console.error('解析 VITE_PROXY 失败:', e)
        }
    }
    return proxyConfig
}
