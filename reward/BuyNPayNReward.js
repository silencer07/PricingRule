
export default class BuyNPayNReward {

    apply(promo, shoppingCart) {
        const fulfilledRequirements = promo.getFulfilledRequirements(shoppingCart);
        const freebieCountsPerRequirement = fulfilledRequirements.map(req => {
            const matchingItem = shoppingCart.items.find(item => item.code === req.code);
            return Math.floor(matchingItem.qty / req.qty)
        });

        const reduceToZeroPriceCount = Math.min(...freebieCountsPerRequirement);
        const applyToTheseProductCodes = this.applyToTheseProductCodes;
        const applicableItems = shoppingCart.items.filter(i => applyToTheseProductCodes.includes(i.code));

        applicableItems.forEach(i => i.qty -= reduceToZeroPriceCount);
        const applicableItemsCopy = applicableItems.map(i => ({
            code: i.code,
            qty: reduceToZeroPriceCount,
            price: 0
        }));

        shoppingCart.items.push(...applicableItemsCopy);
        return shoppingCart;
    }

}