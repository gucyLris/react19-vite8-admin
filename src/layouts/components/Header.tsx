import { memo, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

function Header() {
    const [isCollapsed, setCollapsed] = useState(false)
    const handleToggleCollapsed = () => {
        setCollapsed((prev) => !prev)
    }

    return (
        <>
            <header className="border-bottom py-6px box-border flex items-center justify-between px-6 transition-all">
                <div className="item-center flex">
                    <div
                        className="cursor-pointer text-lg"
                        onClick={handleToggleCollapsed}
                    >
                        {isCollapsed && <MenuUnfoldOutlined />}
                        {!isCollapsed && <MenuFoldOutlined />}
                    </div>
                </div>
            </header>
        </>
    )
}

export default memo(Header)
