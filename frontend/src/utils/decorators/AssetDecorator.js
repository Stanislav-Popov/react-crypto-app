/** @format */

import { percentDifference } from "../utils"

export class AssetDecorator {
    constructor(asset, coin) {
        this.asset = asset
        this.coin = coin
    }

    calculateStatisticData() {
        return {
                grow: this.grow(),
                growPercent: this.growPercent(),
                totalAmount: this.totalAmount(),
                totalProfit: this.totalProfit(),
                realizedProfit: this.realizedProfit(),
                unrealizedProfit: this.unrealizedProfit(),
                name: this.name(),
            }
    }

    grow() {
        return this.asset.price < this.coin.price
    }

    growPercent() {
        return percentDifference(this.asset.price, this.coin.price)
    }

    totalAmount() {
        return this.asset.amount * this.coin.price
    }

    totalProfit() {
        return this.realizedProfit() + this.unrealizedProfit()
    }

    realizedProfit() {
        return this.asset.realizedProfit || 0
    }

    unrealizedProfit() {
        return this.asset.amount * this.coin.price - this.asset.amount * this.asset.price
    }

    name() {
        return this.coin.name
    }
}
