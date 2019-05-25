
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
        const applicableItemsCopy = JSON.parse(JSON.stringify(applicableItems)).map(i => {
            i.qty = reduceToZeroPriceCount;
            i.price = 0;
            return i;
        });

        shoppingCart.items.push(...applicableItemsCopy);
        return shoppingCart;
    }

}