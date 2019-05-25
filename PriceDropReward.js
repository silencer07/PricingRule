
export default class PriceDropReward {

    constructor(price, applyToTheseProductCodes = []) {
        this.price = price;
        this.applyToTheseProductCodes = applyToTheseProductCodes;
    }

    apply(promo, shoppingCart) {
        shoppingCart.items
            .filter(item => this.applyToTheseProductCodes.includes(item.code))
            .forEach(item => item['price'] = this.price);
    }
}