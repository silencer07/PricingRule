
export default class DiscountPercentageReward {

    constructor(percentage = 0) {
        this.percentage = percentage;
    }


    apply(promo, shoppingCart) {
        shoppingCart.totalDiscount += this.percentage;
        return shoppingCart;
    }
}