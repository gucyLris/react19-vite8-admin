import { useEffect, useState } from 'react'
import { getGameActivityApi, type IGameActivity } from '@/api/modules/user'

export const Hello = () => {
    const [gameActivity, setGameActivity] = useState<IGameActivity | null>(null)

    useEffect(() => {
        getGameActivityApi()
            .then(setGameActivity)
            .catch((err) => {
                if (!err.cancelled) console.error(err)
            })
    }, [])

    return <div>{gameActivity?.gameName}</div>
}
