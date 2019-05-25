export default class ShoppingCart {

    constructor(pricingRule) {
        this.pricingRule = pricingRule;
        this.couponCodes = [];
        this.items = [];
        this.total = 0;
        this.totalDiscount = 0;
    }

    add(item, couponCode) {
        this.items.push(item);
        if (couponCode) {
            this.couponCodes.push(couponCode);
        }
    }

    process() {
        this.processPromos(this.pricingRule.autoPromos);
        this.processPromos(this.pricingRule.manualPromos);
        this.calculateTotal();
    }

    processPromos(promos) {
        promos.filter(promo => promo.checkIfApplicable(this))
            .forEach(promo => promo.apply(this))
    }

    calculateTotal() {
        this.total = this.items.reduce((result, item) => result += (item.qty * item.price), 0);
        this.total -= this.total * this.totalDiscount;
        this.total = +(this.total).toFixed(2);
    }
}
