import {objectToPromoMapper} from "../promo/Promo";
import {objectToManualPromoMapper} from "../promo/ManualPromo";

export default class PricingRule {
    constructor(autoPromos, manualPromos) {
        this.autoPromos = autoPromos.map(objectToPromoMapper);
        this.manualPromos = manualPromos.map(objectToManualPromoMapper);
    }
}
