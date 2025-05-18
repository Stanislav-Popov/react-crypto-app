/** @format */

import { createContext, useState, useEffect, useContext } from "react"
import { fetchAssets, fakeFetchCrypto } from "../api"
import { percentDifference } from "../utils"

const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
})

export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [crypto, setCrypto] = useState([])
    const [assets, setAssets] = useState([])

    function mapAssets(assets, result) {
        return assets.map((asset) => {
            const coin = result.find((c) => c.id === asset.id)
            return {
                ...asset,
                grow: asset.price < coin.price,
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: asset.amount * coin.price,
                totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                name: coin.name,
            }
        })
    }

    useEffect(() => {
        async function preload() {
            setLoading(true)
            const { result } = await fakeFetchCrypto()
            const assets = await fetchAssets()

            setAssets(mapAssets(assets, result))
            setCrypto(result)
            setLoading(false)
        }
        preload()
    }, [])

    // Добавить актив в портфель
    function addAsset(newAsset) {
        setAssets((prev) => {
            const existingIndex = prev.findIndex((asset) => asset.id === newAsset.id)

            if (existingIndex !== -1) {
                // Существующий актив
                const existing = prev[existingIndex]
                const totalAmount = existing.amount + newAsset.amount
                const averagePrice =
                    (existing.amount * existing.price + newAsset.amount * newAsset.price) / totalAmount
                const updatedAsset = {
                    ...existing,
                    amount: totalAmount,
                    price: averagePrice,
                }
                const newAssets = [...prev]
                newAssets[existingIndex] = updatedAsset

                return mapAssets(newAssets, crypto)
            } else {
                // Новый актив
                return mapAssets([...prev, newAsset], crypto)
            }
        })
    }

    function sellAsset(soldAsset) {
        setAssets((prev) => {
            const assetIndex = prev.findIndex((a) => a.id === soldAsset.id)

            if (assetIndex === -1) {
                console.warn(`Trying to sell non-existing asset ${prev[soldAsset.id]}`)
                return
            }

            const existing = prev[assetIndex]
            if (soldAsset.amount > existing.amount) {
                console.warn(`Trying to sell more than owned for ${soldAsset.id}`)
                return
            }

            const newAmount = existing.amount - soldAsset.amount
            
            let newAssets
            if (newAmount === 0) {
                newAssets = prev.filter((_, i) => i !== assetIndex)
            } else {
                const updated = {
                    ...existing,
                    amount: newAmount
                }
                newAssets = [...prev]
                newAssets[assetIndex] = updated
            }

            return mapAssets(newAssets, crypto)
        })
    }

    return (
        <CryptoContext.Provider value={{ loading, crypto, assets, addAsset, sellAsset }}>
            {children}
        </CryptoContext.Provider>
    )
}

export default CryptoContext

export function useCrypto() {
    return useContext(CryptoContext)
}
