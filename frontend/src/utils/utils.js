/** @format */

export function percentDifference(a, b) {
    return +(100 * Math.abs((a - b) / ((a + b) / 2))).toFixed(2)
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1)
}

export function downloadAssetsAsJson(assets) {
    // 1. Оставляем только нужные поля
    const cleanedAssets = assets.map(({ id, amount, price, date }) => ({
        id,
        amount,
        price,
        date,
    }))

    // 2. Преобразуем в JSON-строку с отступами
    const json = JSON.stringify(cleanedAssets, null, 2)

    // 3. Создаём Blob из этой строки
    const blob = new Blob([json], { type: "application/json" })

    // 4. Создаём временный URL
    const url = URL.createObjectURL(blob)

    // 5. Создаём и кликаем по ссылке
    const a = document.createElement("a")
    a.href = url
    a.download = "assets.json"
    document.body.appendChild(a)
    a.click()

    // 6. Чистим
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}