const DB_NAME = 'react_db'
const STORE_NAME = 'auth_store'
const DB_VERSION = 1

let dbPromise: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (dbPromise) {
            resolve(dbPromise)
            return
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
            dbPromise = request.result
            resolve(dbPromise)
        }
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
    })
}

// 存储
export async function setItem(key: string, value: any): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.put(value, key)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => resolve()
        tx.onerror = () => reject(tx.error)
    })
}

// 读取
export async function getItem<T>(key: string): Promise<T | undefined> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get(key)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => resolve(req.result as T)
    })
}

// 删除
export async function removeItem(key: string): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.delete(key)
        req.onerror = () => reject(req.error)
        req.onsuccess = () => resolve()
    })
}

// 清空整个 store
export async function clearStore(): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.clear()
        req.onerror = () => reject(req.error)
        req.onsuccess = () => resolve()
    })
}
