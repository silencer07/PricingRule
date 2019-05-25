
export default class FreebieReward {

    apply(promo, shoppingCart) {
        const fulfilledRequirements = promo.getFulfilledRequirements(shoppingCart);
        const freebieCountsPerRequirement = fulfilledRequirements.length > 0 ? fulfilledRequirements.map(req => {
            const matchingItem = shoppingCart.items.find(item => item.code === req.code);
            return Math.floor(matchingItem.qty / req.qty)
        }) : [ 1 ];
        const freebieCount = Math.min(...freebieCountsPerRequirement);

        shoppingCart.items.push({
            code : this.code,
            qty: this.qty * freebieCount,
            price: 0
        });
        return shoppingCart;
    }

}