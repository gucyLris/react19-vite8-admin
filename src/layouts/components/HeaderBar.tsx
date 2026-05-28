import { BannerLogo } from '@/components/BannerLogo'
import Fullscreen from '@/components/Fullscreen'
import Github from '@/components/Github'
import { UserInfo } from '@/components/UserInfo'

function HeaderBar() {
    return (
        <div className="h-16 bg-white text-2xl shadow-[0_10px_25px_-5px_rgba(99,102,241,0.3),0_0_0_1px_rgba(99,102,241,0.1)_inset]">
            <div className="flex h-full w-full items-center justify-between px-14!">
                <div>
                    <BannerLogo />
                </div>
                <div className="flex items-center">
                    <Github />
                    <Fullscreen />
                    <UserInfo />
                </div>
            </div>
        </div>
    )
}

export default HeaderBar
