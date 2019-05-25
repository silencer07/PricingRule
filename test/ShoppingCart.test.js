import fs from 'fs'
import ManualPromo from "../src/promo/ManualPromo"
import ShoppingCart from "../src/cart/ShoppingCart";
import DiscountPercentageReward from "../src/reward/DiscountPercentageReward";
import PricingRule from "../src/cart/PricingRule";
import ShoppingCartItem from "../src/cart/ShoppingCartItem";

let shoppingCart;
let expectedShoppingCart;
let data;

beforeEach(() => {
    const rawData = fs.readFileSync("data/pricing-rules.json");
    data = JSON.parse(rawData);

    const pricingRule = new PricingRule(data.autoPromos, data.manualPromos);
    shoppingCart = new ShoppingCart(pricingRule);
    expectedShoppingCart = new ShoppingCart(pricingRule);
});


test('test case 1', () => {
    const item1 = new ShoppingCartItem(data.products[0], 3);
    const item2 = new ShoppingCartItem(data.products[2], 1);
    shoppingCart.add(item1);
    shoppingCart.add(item2);

    shoppingCart.process();

    expectedShoppingCart.add(item1);
    expectedShoppingCart.add(item2);
    expectedShoppingCart.add(
        new ShoppingCartItem({ code : data.products[0].code, price : 0 }, 1)
    );

    expectedShoppingCart.total =  94.70;

    expect(shoppingCart).toEqual(expectedShoppingCart);
});

test('test case 2', () => {
    const item1 = new ShoppingCartItem(data.products[0], 2);
    const item2 = new ShoppingCartItem(data.products[2], 4);
    shoppingCart.add(item1);
    shoppingCart.add(item2);

    shoppingCart.process();

    expectedShoppingCart.add(item1);
    expectedShoppingCart.add(item2);

    expectedShoppingCart.total =  209.40;

    expect(shoppingCart).toEqual(expectedShoppingCart);
});

test('test case 3', () => {
    const item1 = new ShoppingCartItem(data.products[0], 1);
    const item2 = new ShoppingCartItem(data.products[1], 2);
    shoppingCart.add(item1);
    shoppingCart.add(item2);

    shoppingCart.process();

    expectedShoppingCart.add(item1);
    expectedShoppingCart.add(item2);
    expectedShoppingCart.add(
        new ShoppingCartItem({ code : data.products[3].code, price : 0 }, 2)
    );

    expectedShoppingCart.total =  84.70;

    expect(shoppingCart).toEqual(expectedShoppingCart);
});

test('test case 4', () => {
    const item1 = new ShoppingCartItem(data.products[0], 1);
    const item2 = new ShoppingCartItem(data.products[3], 1);
    shoppingCart.add(item1);
    shoppingCart.add(item2, data.manualPromos[0].code);

    shoppingCart.process();

    expectedShoppingCart.add(item1);
    expectedShoppingCart.add(item2);
    expectedShoppingCart.couponCodes.push(data.manualPromos[0].code);

    expectedShoppingCart.total =  31.32;
    expectedShoppingCart.totalDiscount = 0.10;

    expect(shoppingCart).toEqual(expectedShoppingCart);
});