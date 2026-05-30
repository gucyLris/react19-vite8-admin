import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Icon } from '@iconify/react'
import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'

import { removeItem } from '@/utils/db'
import { navigateTo } from '@/utils/historyHelper'
import { handleSuccessMsg } from '@/utils/messageHelper'

export const UserInfo = () => {
    // 自定义用户信息
    const items: MenuProps['items'] = [
        {
            key: 'userInfo',
            label: <span>个人中心</span>,
            icon: <UserOutlined className="mr-1" />
        },
        {
            key: 'logout',
            label: <span>退出登录</span>,
            icon: <LogoutOutlined className="mr-1" />
        }
    ]

    const onClick: MenuProps['onClick'] = async ({ key }) => {
        if (key === 'userInfo') {
            console.log('个人中心')
            // 处理个人中心逻辑
        }
        if (key === 'logout') {
            await removeItem('token')
            // 需要走退出接口 这里调用
            handleSuccessMsg('已退出登录')
            navigateTo('/login')
        }
    }

    return (
        <Dropdown className="min-w-50px" menu={{ items, onClick }}>
            <div className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                <Icon
                    className="text-black-500 w-6 cursor-pointer"
                    icon="gridicons:user"
                />
            </div>
        </Dropdown>
    )
}
