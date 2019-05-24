import Promo from "./Promo";

export default class FreebiePromo extends Promo {

    apply(shoppingCart) {
        const processedShoppingCart = super.apply(shoppingCart);
        let freebieCount = 0;

        if (this.checkIfApplicable(shoppingCart)) {

            const fulfilledRequirements = this.getFulfilledRequirements(processedShoppingCart);
            const freebieCountsPerRequirement = fulfilledRequirements.map(req => {
                const matchingItem = processedShoppingCart.items.find(item => item.code === req.code);
                return Math.floor(matchingItem.qty / req.qty)
            });
            freebieCount = Math.min(...freebieCountsPerRequirement);
        }

        const freebies = freebieCount > 0 ? this.rewards.map(reward => ({
            code: reward.code,
            qty: reward.qty * freebieCount,
            price: 0
        })) : [];

        processedShoppingCart.items.push(...freebies);

        return processedShoppingCart;
    }
}
