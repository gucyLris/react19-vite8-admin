import { create } from 'zustand'

interface KanBanState {
    boards: { id: string; name: string }[]
    createBoard: (item: string) => void
}

export const useKanBanStore = create<KanBanState>((set) => ({
    boards: [],
    createBoard: (item) =>
        set((state) => ({
            boards: [
                ...state.boards,
                { id: Date.now().toString(), name: item },
            ],
        })),
}))
