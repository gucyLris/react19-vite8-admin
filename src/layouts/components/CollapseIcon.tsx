import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { memo, useState } from 'react'

export const CollapseIcon = memo(() => {
    const [isCollapsed, setCollapsed] = useState(false)
    const handleToggleCollapsed = () => {
        setCollapsed((prev) => !prev)
    }

    return (
        <div onClick={handleToggleCollapsed}>
            {isCollapsed && <MenuUnfoldOutlined />}
            {!isCollapsed && <MenuFoldOutlined />}
        </div>
    )
})
