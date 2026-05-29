import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'

function Github() {
    /** 跳转Github */
    const handleOpenGithub = () => {
        window.open('https://github.com/gucyLris/react19-vite8-admin', '_blank')
    }

    return (
        <Tooltip title="Github">
            <div onClick={handleOpenGithub}>
                <Icon
                    className="text-black-500 mr-3 flex w-6 cursor-pointer items-center justify-center text-lg"
                    icon="mdi:github"
                />
            </div>
        </Tooltip>
    )
}

export default Github
