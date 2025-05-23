/** @format */
import { useEffect, useState } from "react"
import { useCrypto } from "../../context/crypto-context"
import { Layout, Select, Space, Button, Modal, Drawer, Tooltip, Upload, message } from "antd"
import AddAssetForm from "../AddAssetForm"
import CoinInfoModal from "../CoinInfoModal"
import { downloadAssetsAsJson } from "../../utils/utils"

const headerStyle = {
    width: "100%",
    textAlign: "center",
    height: 60,
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
}

export default function AppHeader() {
    const [modal, setModal] = useState(false)
    const [drawer, setDrawer] = useState(false)
    const [select, setSelect] = useState(false)
    const [coin, setCoin] = useState(null)
    const { crypto, assets, uploadAssets } = useCrypto()

    useEffect(() => {
        const keypress = (event) => {
            if (event.key === "/") {
                setSelect((prev) => !prev)
            }
        }
        document.addEventListener("keypress", keypress)
        return () => document.removeEventListener("keypress", keypress)
    }, [])

    function handleSelect(value) {
        setCoin(crypto.find((c) => c.id === value))
        setModal(true)
    }

    function handleSave() {
        downloadAssetsAsJson(assets)
    }

    function handleFileUpload(file) {
        uploadAssets(file)
    }

    return (
        <Layout.Header style={headerStyle}>
            <Select
                open={select}
                style={{ width: 250 }}
                value="press / to open"
                onSelect={handleSelect}
                onClick={() => setSelect((prev) => !prev)}
                options={crypto.map((coin) => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img style={{ width: 20 }} src={option.data.icon} alt={option.data.label} />
                        {option.data.label}
                    </Space>
                )}
            />

            <Space>
                <Tooltip title="Load your version of the portfolio in json format">
                    <Upload
                        accept=".json"
                        beforeUpload={handleFileUpload}
                        showUploadList={false}
                        customRequest={({ file, onSuccess }) => {
                            // сразу вызываем onSuccess, чтобы АнтД подумал, что upload прошёл
                            setTimeout(() => onSuccess("ok"), 0)
                        }}>
                        <Button type="primary">Upload</Button>
                    </Upload>
                </Tooltip>
                <Tooltip title="Download the current version of the portfolio in json format">
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Tooltip>
                <Button type="primary" onClick={() => setDrawer(true)}>
                    Add Asset
                </Button>
            </Space>

            <Modal
                title="Basic Modal"
                open={modal}
                footer={null}
                onOk={() => setIsModal(false)}
                onCancel={() => setModal(false)}>
                <CoinInfoModal coin={coin}></CoinInfoModal>
            </Modal>

            <Drawer
                destroyOnClose
                width={600}
                title="Add Asset"
                onClose={() => setDrawer(false)}
                open={drawer}>
                <AddAssetForm onClose={() => setDrawer(false)}></AddAssetForm>
            </Drawer>
        </Layout.Header>
    )
}
