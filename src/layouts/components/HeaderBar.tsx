import { BannerLogo } from '@/components/bannerLogo'
import Fullscreen from '@/components/fullscreen'
import Github from '@/components/github'
import { ThemeIcon } from '@/components/theme'
import { UserInfo } from '@/components/userInfo'
import { useCommonStore } from '@/hooks/useCommonStore'

function HeaderBar() {
    const { bgClass, textClass } = useCommonStore()

    return (
        <div
            className={`h-16 text-2xl shadow-[0_10px_25px_-5px_rgba(99,102,241,0.3),0_0_0_1px_rgba(99,102,241,0.1)_inset] ${bgClass} ${textClass}`}
        >
            <div className="flex h-full w-full items-center justify-between px-14!">
                <div>
                    <BannerLogo />
                </div>
                <div className="flex items-center">
                    <Github />
                    <Fullscreen />
                    <ThemeIcon />
                    <UserInfo />
                </div>
            </div>
        </div>
    )
}

export default HeaderBar
