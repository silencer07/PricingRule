import ShoppingCart from "../cart/ShoppingCart";
import FreebieReward from "../reward/FreebieReward";
import DiscountPercentageReward from "../reward/DiscountPercentageReward";
import PriceDropReward from "../reward/PriceDropReward";
import BuyNPayNReward from "../reward/BuyNPayNReward";

const requirementItemMatchingByCodeReducer = item => req => req.code === item.code && item.price  > 0;

export default class Promo {

    constructor(name = 'Unnamed Freebie Promo', requirements = [], rewards = []) {
        this.name = name;
        this.requirements = requirements;
        this.rewards = rewards.map(reward =>  {
            let toReturn;
            switch (reward.type) {
                case "FreebieReward": toReturn = new FreebieReward();
                    break;
                case "DiscountPercentageReward": toReturn = new DiscountPercentageReward();
                    break;
                case "PriceDropReward": toReturn = new PriceDropReward();
                    break;
                case "BuyNPayNReward": toReturn = new BuyNPayNReward();
                    break;
                default: throw new Error(`${reward.type} not yet implemented`)
            }
            Object.assign(toReturn, reward);
            return toReturn;
        });
    }

    checkIfApplicable(cart) {
        if (!this.requirements || this.requirements.length === 0) {
            return true
        }

        const fulfilledRequirements = this.getFulfilledRequirements(cart);
        return fulfilledRequirements.length === this.requirements.length;
    }

    getFulfilledRequirements(cart) {
        const itemsMatchingRequirements = cart.items.filter(
            item => this.requirements.filter(requirementItemMatchingByCodeReducer(item)).length > 0
        );
        return itemsMatchingRequirements
            .map(item => this.requirements.find(requirementItemMatchingByCodeReducer(item)))
            .filter(req =>
                req.qty <= itemsMatchingRequirements.find(item => item.code === req.code).qty
            );
    }

    /**
     * processes the items by piping them up to promo
     * @param unprocessedItems the items yet to be processed by this promo
     * @return copy of processedItems that went through this
     */
    apply(shoppingCart) {
        if (this.checkIfApplicable(shoppingCart)) {
            this.rewards
                .forEach(reward =>  reward.apply(this, shoppingCart));
        }
        shoppingCart.calculateTotal();

        return shoppingCart;
    }
}

export const objectToPromoMapper = obj => new Promo(obj.name, obj.requirements, obj.rewards);
