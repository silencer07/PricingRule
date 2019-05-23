function requirementItemMatchingByCodeReducer(item) {
    return req => req.code === item.code;
}

export default class FreebiePromo {

    constructor(name, requirements, rewards) {
        this.name = name;
        this.requirements = requirements;
        this.rewards = rewards;
    }

    checkIfApplicable(items = []) {
        if (!this.requirements) {
            return true
        }

        const itemsMatchingRequirements = items.filter(
            item => this.requirements.filter(requirementItemMatchingByCodeReducer(item)).length > 0
        );
        const fulfilledRequirements = itemsMatchingRequirements
            .map(item => this.requirements.find(requirementItemMatchingByCodeReducer(item)))
            .filter(req =>
                req.qty >= itemsMatchingRequirements.find(item => item.code === req.code).qty
            );
        return fulfilledRequirements.length === this.requirements.length;
    }

    apply(items = []) {

    }
}
