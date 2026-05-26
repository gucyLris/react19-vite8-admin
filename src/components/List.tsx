import { Button, Input, type InputRef } from 'antd'
import { useEffect, useRef, useState } from 'react'

interface IItem {
    id?: number
    name?: string
}

export const List = () => {
    const [list, setList] = useState<IItem[]>([])
    const handleAddItem = () => {
        setList((prevList) => [
            ...prevList,
            { id: Date.now(), name: `项目${prevList.length + 1}` },
        ])
    }

    // useRef和useLayoutEffect的使用示例
    const inputRef = useRef<InputRef>(null)
    const isMountedRef = useRef<boolean>(false)
    // 副作用函数，监听list的变化，更新页面标题
    useEffect(() => {
        document.title = `列表长度: ${list.length}`
        console.log(inputRef.current?.focus()) // 可以访问到Input组件的实例
        console.log(isMountedRef.current) // 可以访问到组件是否挂载的状态
    }, [list])
    // 组件挂载和卸载的副作用函数
    useEffect(() => {
        console.log('组件挂载了')
        isMountedRef.current = true
        return () => {
            console.log('组件卸载了')
        }
    }, [])
    // 监听组件更新的副作用函数
    useEffect(() => {
        console.log('组件更新: list发生变化了')
    })

    return (
        <>
            <Button type="primary" onClick={handleAddItem}>
                添加项目
            </Button>
            <div>
                {list.map((item) => (
                    <div key={item.id}>
                        {item.id}
                        {item.name}
                    </div>
                ))}
            </div>
            <div>
                <Input placeholder="请输入内容" ref={inputRef} />
            </div>
        </>
    )
}
