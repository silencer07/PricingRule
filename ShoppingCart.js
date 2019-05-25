export default class ShoppingCart {

    constructor(pricingRule) {
        this.pricingRule = pricingRule;
        this.couponCodes = [];
        this.items = [];
        this.total = 0;
        this.totalDiscount = 0;
    }

    calculateTotal() {
        this.total = this.items.reduce((result, item) => result += (item.qty * item.price), 0);
        this.total -= this.total * this.totalDiscount;
        this.total = +(this.total).toFixed(2);
    }
}
