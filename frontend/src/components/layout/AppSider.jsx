/** @format */
import { Layout, Card, Statistic, List, Typography, Tag, Modal, Drawer } from "antd"
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons"
import { capitalize } from "../../utils/utils"
import { useContext, useState } from "react"
import CoinInfoModal from "../CoinInfoModal"
import CryptoContext from "../../context/crypto-context"
import ActionButton from "../ActionButton"
import SellAssetForm from "../SellAssetForm"

const siderStyle = {
    padding: "1rem",
}

export default function AppSider() {
    const { assets, crypto } = useContext(CryptoContext)

    const [modalOpen, setModalOpen] = useState(false)
    const [drawerOpen, setDrawer] = useState(false)
    const [selectedCoin, setSelectedCoin] = useState(null)
    const [selectedAsset, setSelectedAsset] = useState(null)

    function handleInfoClick(assetId) {
        const coin = crypto.find((c) => c.id === assetId)
        setSelectedCoin(coin)
        setModalOpen(true)
    }

    function handleSellClick(assetId) {
        const coin = crypto.find((c) => c.id === assetId)
        const icon = coin.icon
        const currentPrice = coin.price
        const asset = {
            ...assets.find((a) => a.id === assetId),
            icon,
            currentPrice,
        }
        setSelectedAsset(asset)
        setDrawer(true)
    }

    const actions = (assetId) => [
        <ActionButton
            key="sell"
            title="Sell asset"
            icon={MinusCircleOutlined}
            label="Sell"
            onClick={() => handleSellClick(assetId)}
        />,
        <ActionButton
            key="info"
            title="Asset Information"
            icon={InfoCircleOutlined}
            label="Info"
            onClick={() => handleInfoClick(assetId)}
        />,
    ]

    return (
        <Layout.Sider width="25%" style={siderStyle}>
            {assets.map((asset) => (
                <Card key={asset.id} style={{ marginBottom: "1rem" }} actions={actions(asset.id)}>
                    <Statistic
                        title={capitalize(asset.id)}
                        value={asset.totalAmount}
                        precision={2}
                        valueStyle={{ color: asset.grow ? "#3f8600" : "#cf1322" }}
                        prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix="$"
                    />
                    <List
                        size="small"
                        dataSource={[
                            { title: "Total Profit", value: asset.totalProfit, withTag: true },
                            { title: "Asset Amount", value: asset.amount, isPlain: true },
                        ]}
                        renderItem={(item) => (
                            <List.Item>
                                <span>{item.title}</span>
                                <span>
                                    {item.withTag && (
                                        <Tag color={asset.grow ? "green" : "red"}>{asset.growPercent}%</Tag>
                                    )}
                                    {item.isPlain && item.value}
                                    {!item.isPlain && (
                                        <Typography.Text type={asset.grow ? "success" : "danger"}>
                                            {item.value.toFixed(2)} $
                                        </Typography.Text>
                                    )}
                                </span>
                            </List.Item>
                        )}
                    />
                </Card>
            ))}

            <Modal title="Coin Info" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
                {selectedCoin && <CoinInfoModal coin={selectedCoin} />}
            </Modal>

            <Drawer
                destroyOnClose
                width={600}
                title="Sell Asset"
                onClose={() => setDrawer(false)}
                open={drawerOpen}>
                <SellAssetForm onClose={() => setDrawer(false)} coin={selectedAsset} />
            </Drawer>
        </Layout.Sider>
    )
}
