import Promo from "./Promo";

export default class DiscountPercentagePromo extends Promo {

    checkIfApplicable(shoppingCart) {
        const requirementsSatisified = super.checkIfApplicable(shoppingCart);
        const hasCouponCodeEntered = shoppingCart.couponCodes ? shoppingCart.couponCodes.includes(this.code) : false;
        return requirementsSatisified && hasCouponCodeEntered
    }

    apply(shoppingCart) {
        const processedShoppingCart = super.apply(shoppingCart);

        if (this.checkIfApplicable(shoppingCart)) {
            const totalDiscount = this.rewards
                .filter(r => r.type === 'DiscountPercentagePromo')
                .map(r => r.percentage)
                .reduce((result, percentage) => result + percentage, 0);

            const total = processedShoppingCart.total;
            processedShoppingCart.total -= (total * totalDiscount )
            processedShoppingCart.total = +processedShoppingCart.total.toFixed(2)
        }

        return processedShoppingCart;
    }
}
