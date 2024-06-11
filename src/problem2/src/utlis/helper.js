export const getUniqueArray = (arr, key) => {
    const seen = new Set()
    return arr?.filter((item) => {
        const isDuplicate = seen.has(item[key])
        seen.add(item[key])
        return !isDuplicate
    })
}

export const convertCrypto = (unit, price1, price2) => {
    const result = (
        (parseFloat(unit) / parseFloat(price2)) *
        parseFloat(price1)
    ).toFixed(6)
    return result
}
