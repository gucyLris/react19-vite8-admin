import { useCallback, useState } from 'react'
import { Button } from 'antd'

export const Hello = () => {
    const [count, setCount] = useState(0)
    const handleAddCount = () => {
        setCount(count + 1)
    }

    const [info, setInfo] = useState({
        name: '张三',
        age: 18,
    })

    const handleInfoUpdate = useCallback(() => {
        // setInfo({
        //     name: '李四',
        //     age: 20
        // })
        console.log('info对象: ', info) // 这里会打印旧的info对象，因为useCallback依赖了info，导致闭包问题
        // 回调写法可以拿到最新的状态值，避免闭包问题
        setInfo((prevInfo) => ({
            ...prevInfo,
            name: '李四',
            age: 20,
        }))
    }, [info])

    return (
        <div>
            <Button type="primary" onClick={handleAddCount}>
                {count}
            </Button>
            <br></br>
            <Button type="primary" onClick={handleInfoUpdate}>
                更新info对象
            </Button>
            <div>
                <p>姓名: {info.name}</p>
                <p>年龄: {info.age}</p>
            </div>
        </div>
    )
}
