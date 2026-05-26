import { useKanBanStore } from '@/stores/useKanBan'
import { Button } from 'antd'

export const Borad = () => {
    const { boards, createBoard } = useKanBanStore()
    const handleAddItem = () => {
        const itemName = `看板${boards.length + 1}`
        createBoard(itemName)
    }
    return (
        <div>
            <h1>KanBan Board</h1>
            <Button type="primary" onClick={handleAddItem}>
                添加子项看板
            </Button>
            <ul>
                {boards.map((board) => (
                    <li key={board.id}>{board.name}</li>
                ))}
            </ul>
        </div>
    )
}
