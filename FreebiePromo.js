import Promo from "./Promo";

export default class FreebiePromo extends Promo {

    apply(shoppingCart) {
        const processedShoppingCart = super.apply(shoppingCart);
        let freebieCount = 0;

        if (this.checkIfApplicable(shoppingCart)) {

            const fulfilledRequirements = this.getFulfilledRequirements(processedShoppingCart);
            const freebieCountsPerRequirement = fulfilledRequirements.length > 0 ? fulfilledRequirements.map(req => {
                const matchingItem = processedShoppingCart.items.find(item => item.code === req.code);
                return Math.floor(matchingItem.qty / req.qty)
            }) : [ 1 ];
            freebieCount = Math.min(...freebieCountsPerRequirement);
        }

        const freebies = freebieCount > 0 ? this.rewards
            .filter(r => r.type === 'FreebiePromo')
            .map(reward => ({
                code: reward.code,
                qty: reward.qty * freebieCount,
                price: 0
            })) : [];

        processedShoppingCart.items.push(...freebies);

        return processedShoppingCart;
    }
}
