import ShoppingCartItem from "../cart/ShoppingCartItem";

export default class FreebieReward {

    apply(promo, shoppingCart) {
        const fulfilledRequirements = promo.getFulfilledRequirements(shoppingCart);
        const freebieCountsPerRequirement = fulfilledRequirements.length > 0 ? fulfilledRequirements.map(req => {
            const matchingItem = shoppingCart.items.find(item => item.code === req.code);
            return Math.floor(matchingItem.qty / req.qty)
        }) : [ 1 ];
        const freebieCount = Math.min(...freebieCountsPerRequirement);

        const freebie = new ShoppingCartItem();
        const self = this;
        Object.assign(freebie, {
            code : self.code,
            qty: self.qty * freebieCount,
            price: 0
        });
        shoppingCart.items.push(freebie);
        return shoppingCart;
    }

}