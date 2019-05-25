
export default class DiscountPercentageReward {

    constructor(percentage = 0, sumTheRewardFirstBeforeApplying = true) {
        this.percentage = percentage;
        this.sumTheRewardFirstBeforeApplying = sumTheRewardFirstBeforeApplying;
    }


    apply(promo, shoppingCart) {
        shoppingCart.totalDiscount = (shoppingCart.totalDiscount || 0) + this.percentage;
        return shoppingCart;
    }

    finallyApply(shoppingCart) {
        let total = shoppingCart.total;
        total -= (total * shoppingCart.totalDiscount );
        shoppingCart.total = +total.toFixed(2)
    }

}