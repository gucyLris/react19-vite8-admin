import logoDark from '@/assets/images/headerImg/logo_dark.svg'
import logoLight from '@/assets/images/headerImg/logo_light.svg'
import { useCommonStore } from '@/hooks/useCommonStore'

export const BannerLogo = () => {
    const { theme } = useCommonStore()
    const logoSrc = theme === 'light' ? logoLight : logoDark
    return (
        <>
            <img alt="logo" className="h-6! w-auto" src={logoSrc} />
        </>
    )
}
