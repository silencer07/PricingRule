export default class ShoppingCart {

    constructor(pricingRule) {
        this.pricingRule = pricingRule;
        this.couponCodes = [];
        this.items = [];
    }
}
