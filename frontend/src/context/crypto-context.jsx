/** @format */

import { createContext, useState, useEffect, useContext } from 'react';
import { fetchAssets, fakeFetchCrypto } from '../api';
import { message } from 'antd';
import { AssetsRepository } from '../utils/repositories/AssetsRepository';
import { AssetService } from '../utils/services/AssetService';

const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
    addAsset: () => {},
    sellAsset: () => {},
    uploadAssets: () => {},
});

export function useCrypto() {
    return useContext(CryptoContext);
}

const repository = new AssetsRepository();
const service = new AssetService(repository);

export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        async function preload() {
            setLoading(true);
            const { result } = await fakeFetchCrypto();
            setCrypto(result);

            const storedAssets = repository.getAll();
            if (storedAssets.length === 0) {
                const defaultAssets = await fetchAssets();
                setAssets(service.mapAssets(defaultAssets, result));
            } else {
                setAssets(service.mapAssets(storedAssets, result));
            }

            setLoading(false);
        }
        preload();
    }, []);

    function addAsset(newAsset) {
        setAssets(service.addAsset(newAsset, crypto));
    }

    function sellAsset(soldAsset) {
        setAssets(service.sellAsset(soldAsset, crypto));
    }

    function uploadAssets(file) {
        service.uploadAssets(file, crypto)
            .then((newAssets) => {
                setAssets(newAssets);
                message.success('The data is downloaded from a file');
            })
            .catch((err) => {
                message.error('Error reading the JSON file: ' + err.message);
            });
    }

    return (
        <CryptoContext.Provider value={{ loading, crypto, assets, addAsset, sellAsset, uploadAssets }}>
            {children}
        </CryptoContext.Provider>
    );
}

export default CryptoContext