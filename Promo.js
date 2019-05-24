const requirementItemMatchingByCodeReducer = item => req => req.code === item.code;

export default class Promo {

    constructor(name = 'Unnamed Freebie Promo', requirements = [], rewards = []) {
        this.name = name;
        this.requirements = requirements;
        this.rewards = rewards;
    }

    checkIfApplicable(cart) {
        if (!this.requirements) {
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
        console.log("processing the items started");
        const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
        shoppingCartCopy.total = +(shoppingCartCopy.items.reduce((result, item) => result += (item.qty * item.price), 0)).toFixed(2);
        return shoppingCartCopy;
    }
}
