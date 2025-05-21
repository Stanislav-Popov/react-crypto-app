import { AssetsRepository } from '../repositories/AssetsRepository';
import { percentDifference } from '../utils';

export class AssetService {
    constructor(repository) {
        this.repository = repository;
    }

    addAsset(newAsset, crypto) {
        const assets = this.repository.getAll();
        const existingIndex = assets.findIndex((asset) => asset.id === newAsset.id);

        let newAssets;
        if (existingIndex !== -1) {
            const existing = assets[existingIndex];
            const totalAmount = existing.amount + newAsset.amount;
            const averagePrice =
                (existing.amount * existing.price + newAsset.amount * newAsset.price) / totalAmount;
            const updatedAsset = {
                ...existing,
                amount: totalAmount,
                price: averagePrice,
                date: newAsset.date || existing.date,
            };
            newAssets = [...assets];
            newAssets[existingIndex] = updatedAsset;
        } else {
            newAssets = [...assets, newAsset];
        }

        this.repository.save(newAssets);
        return this.mapAssets(newAssets, crypto);
    }

    sellAsset(soldAsset, crypto) {
        const assets = this.repository.getAll();
        const assetIndex = assets.findIndex((a) => a.id === soldAsset.id);

        if (assetIndex === -1) {
            console.warn(`Trying to sell non-existing asset ${soldAsset.id}`);
            return assets;
        }

        const existing = assets[assetIndex];
        if (soldAsset.amount > existing.amount) {
            console.warn(`Trying to sell more than owned for ${soldAsset.id}`);
            return assets;
        }

        const realized = soldAsset.amount * (soldAsset.price - existing.price);
        const newAmount = existing.amount - soldAsset.amount;

        let newAssets;
        if (newAmount === 0) {
            newAssets = assets.filter((_, i) => i !== assetIndex);
        } else {
            const updated = {
                ...existing,
                amount: newAmount,
                realizedProfit: (existing.realizedProfit || 0) + realized,
            };
            newAssets = [...assets];
            newAssets[assetIndex] = updated;
        }

        this.repository.save(newAssets);
        return this.mapAssets(newAssets, crypto);
    }

    uploadAssets(file, crypto) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const json = JSON.parse(text);

                    // Валидация загружаемых активов
                    if (!Array.isArray(json)) {
                        throw new Error('File must contain an array of assets');
                    }

                    const validatedAssets = json.map((asset, index) => {
                        if (!asset.id || typeof asset.amount !== 'number' || typeof asset.price !== 'number') {
                            throw new Error(`Invalid asset at index ${index}: missing id, amount, or price`);
                        }
                        return {
                            id: asset.id,
                            amount: asset.amount,
                            price: asset.price,
                            date: asset.date ? new Date(asset.date) : new Date(),
                            realizedProfit: asset.realizedProfit || 0,
                        };
                    });

                    const newAssets = validatedAssets;
                    this.repository.save(newAssets);
                    resolve(this.mapAssets(newAssets, crypto));
                } catch (err) {
                    console.error('❌ JSON.parse or validation error:', err);
                    reject(err);
                }
            };
            reader.onerror = () => {
                const error = new Error('Failed to read file');
                console.error('❌ FileReader error:', error);
                reject(error);
            };
            reader.readAsText(file);
        });
    }

    mapAssets(assets, crypto) {
        return assets.map((asset) => {
            const coin = crypto.find((c) => c.id === asset.id);
            const unrealizedProfit = asset.amount * (coin?.price || 0) - asset.amount * asset.price;
            const realizedProfit = asset.realizedProfit || 0;
            return {
                ...asset,
                grow: coin && asset.price < coin.price,
                growPercent: coin ? percentDifference(asset.price, coin.price) : 0,
                totalAmount: coin ? asset.amount * coin.price : 0,
                totalProfit: realizedProfit + unrealizedProfit,
                name: coin?.name || asset.id,
            };
        });
    }
}