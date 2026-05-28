import { useEffect, useState } from 'react'

import { getFooterInfoApi } from '@/api/modules/footer'
import { useCommonStore } from '@/hooks/useCommonStore'

export const FooterBar = () => {
    const { bgClass, textClass } = useCommonStore()

    const [footInfo, setFootInfo] = useState<string>('©')

    useEffect(() => {
        const fetchMenu = async () => {
            const res = await getFooterInfoApi()
            setFootInfo(res.word)
        }
        fetchMenu()
    }, []) // 空依赖数组，仅在组件挂载时执行一次

    return (
        <div
            className={`flex h-10 items-center justify-center ${bgClass} ${textClass} shadow-[inset_0px_-4px_14px_0px_rgba(0,0,0,0.3)]`}
        >
            {footInfo}
        </div>
    )
}
