import Promo from "./Promo";

export default class ManualPromo extends Promo {
    checkIfApplicable(shoppingCart) {
        const requirementsSatisified = super.checkIfApplicable(shoppingCart);
        const hasCouponCodeEntered = shoppingCart.couponCodes ? shoppingCart.couponCodes.includes(this.code) : false;
        return requirementsSatisified && hasCouponCodeEntered
    }
}