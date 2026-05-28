import { Icon } from '@iconify/react'
import { Tooltip } from 'antd'

import { useFullscreen } from '@/hooks/useFullscreen'

/**
 * @description: 全屏组件
 */
function Fullscreen() {
    const [isFullscreen, toggleFullscreen] = useFullscreen()

    return (
        <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <div
                className="mr-3 flex cursor-pointer items-center justify-center text-lg"
                onClick={toggleFullscreen}
            >
                <Icon
                    className="text-black-500 mr-3 w-6"
                    icon="gridicons-fullscreen-exit"
                    style={{ display: isFullscreen ? 'block' : 'none' }}
                />
                <Icon
                    className="text-black-500 mr-3 w-6"
                    icon="gridicons-fullscreen"
                    style={{ display: !isFullscreen ? 'block' : 'none' }}
                />
            </div>
        </Tooltip>
    )
}

export default Fullscreen
