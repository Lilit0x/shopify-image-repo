export const calculateActualPrice = (price, discount) => {
    return parseFloat(price) - parseFloat(discount)
}