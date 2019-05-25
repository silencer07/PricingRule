
export default class ShoppingCartItem {
    constructor(product = {}, qty = 0){
        this.code = product.code;
        this.price = product.price;
        this.qty = qty;
    }
}