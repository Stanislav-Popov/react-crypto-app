/** @format */
// Доступ к localStorage по ключу
export class LocalStorageAdapter {
    constructor(storageKey) {
        this.storageKey = storageKey
    }

    getAssets() {
        const raw = localStorage.getItem(this.storageKey)
        return raw ? JSON.parse(raw) : []
    }

    saveAssets(assets) {
        localStorage.setItem(this.storageKey, JSON.stringify(assets))
    }
}
