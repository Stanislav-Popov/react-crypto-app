/** @format */

import { LocalStorageAdapter } from "../adapters/LocalStorageAdaptor"

export class AssetsRepository {
    constructor() {
        this.adapter = new LocalStorageAdapter("portfolio_assets")
    }

    getAll() {
        return this.adapter.getAssets()
    }

    save(assets) {
        this.adapter.saveAssets(assets)
    }
}
