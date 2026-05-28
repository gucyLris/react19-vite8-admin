import { BannerLogo } from '@/components/BannerLogo'
import Fullscreen from '@/components/Fullscreen'
import Github from '@/components/Github'
import { UserInfo } from '@/components/UserInfo'

function HeaderBar() {
    return (
        <div className="justify-content flex h-16 items-center px-14! py-0 text-2xl shadow-md">
            <div className="flex w-full items-center justify-between">
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
