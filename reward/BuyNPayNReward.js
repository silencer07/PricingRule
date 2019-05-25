import ShoppingCartItem from "../cart/ShoppingCartItem";

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
        const applicableItemsCopy = applicableItems.map(i => {
            const item = new ShoppingCartItem();
            Object.assign(item, {
                code: i.code,
                qty: reduceToZeroPriceCount,
                price: 0
            });
            return item;
        });

        shoppingCart.items.push(...applicableItemsCopy);
        return shoppingCart;
    }

}