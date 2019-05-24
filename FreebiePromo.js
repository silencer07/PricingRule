import Promo from "./Promo";

export default class FreebiePromo extends Promo {

    constructor(name = 'Unnamed Freebie Promo', requirements = [], rewards = []) {
        super(name, requirements, rewards);
    }

    /**
     * processes the items by piping them up to promo
     * @param unprocessedItems the items yet to be processed by this promo
     * @return copy of processedItems that went through this
     */
    apply(unprocessedItems) {
        const processedItems = super.apply(unprocessedItems);
        let freebieCount = 0;

        if (this.checkIfApplicable(unprocessedItems)) {
            //const rewardsToApplyToWholeCart = this.rewards.filter(reward => !reward.applyPerItem); // TODO

            const fulfilledRequirements = this.getFulfilledRequirements(unprocessedItems);
            const freebieCountsPerRequirement = fulfilledRequirements.map(req => {
                const matchingItem = processedItems.find(item => item.code === req.code);
                return Math.floor(matchingItem.qty / req.qty)
            });
            freebieCount = Math.min(...freebieCountsPerRequirement);
        }

        const freebies = freebieCount > 0 ? this.rewards.map(reward => ({
            code: reward.code,
            qty: reward.qty * freebieCount,
            price: 0
        })) : [];

        return [
            ...processedItems,
            ...freebies
        ]
    }
}
