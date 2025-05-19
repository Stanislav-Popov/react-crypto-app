/** @format */
import { Form, Divider, InputNumber, Button, DatePicker, Result } from "antd"
import { useRef, useState } from "react"
import { useCrypto } from "../context/crypto-context"
import CoinInfo from "./CoinInfo"

export default function AddAssetForm({ onClose, coin, icon }) {
    const [form] = Form.useForm()
    const { sellAsset } = useCrypto()
    const [submitted, setSubmitted] = useState(false)
    const assetRef = useRef()

    const validateMessages = {
        required: "${label} is required",
        types: {
            number: "${label} is not valid number",
        },
        number: {
            range: "${label} must be between ${min}, ${max}",
        },
    }

    if (submitted) {
        return (
            <Result
                status="success"
                title="Asset sold!"
                subTitle={`Sold ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Close
                    </Button>,
                ]}
            />
        )
    }

    function onFinish(values) {
        const soldAsset = {
            id: coin.id,
            amount: values.amount,
            price: values.price,
            date: values.date?.$d ?? new Date(),
        }
        assetRef.current = soldAsset
        sellAsset(soldAsset)
        setSubmitted(true)
    }

    function handleAmountChange(value) {
        form.setFieldsValue({
            total: (value * coin.price).toFixed(2),
        })
    }

    function handlePriceChange(value) {
        const amount = form.getFieldValue("amount")
        form.setFieldsValue({
            total: (value * amount).toFixed(2),
        })
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            style={{ maxWidth: 600 }}
            initialValues={{
                price: +coin.currentPrice.toFixed(2),
                amount: +coin.amount,
                total: (+coin.currentPrice * +coin.amount).toFixed(2),
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}>
            <CoinInfo coin={coin} />
            <Divider />

            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: "number",
                    },
                ]}>
                <InputNumber
                    max={+coin.amount}
                    min={0}
                    placeholder="Input coin amount"
                    onChange={handleAmountChange}
                    style={{ width: "100%" }}
                />
            </Form.Item>

            <Form.Item
                label="Price"
                name="price"
                rules={[
                    {
                        required: true,
                        type: "number",
                    },
                ]}>
                <InputNumber min={0} onChange={handlePriceChange} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Date & Time" name="date">
                <DatePicker showTime />
            </Form.Item>

            <Form.Item label="Total" name="total">
                <InputNumber disabled style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Sell Asset
                </Button>
            </Form.Item>
        </Form>
    )
}
