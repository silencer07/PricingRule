import Promo from "./Promo";

export default class PriceDropPromo extends Promo {

    apply(shoppingCart) {
        const processedShoppingCart = super.apply(shoppingCart);

        if (this.checkIfApplicable(shoppingCart)) {
            this.rewards
                .filter(r => r.type === 'PriceDropPromo')
                .forEach(reward => {
                    processedShoppingCart.items
                        .filter(item => reward.applyToTheseProductCodes.includes(item.code))
                        .forEach(item => item['price'] = reward.price);
                });
            this.calculateTotal(processedShoppingCart);
        }

        return processedShoppingCart;
    }
}
