import Promo from "../promo/Promo";
import fs from 'fs'
import ShoppingCart from "../cart/ShoppingCart";

let TwoGBFreeOneGB;
beforeEach(() => {
    const rawData = fs.readFileSync("data/pricing-rules.json");
    const data = JSON.parse(rawData);

    TwoGBFreeOneGB = new Promo(data.autoPromos[2].name, data.autoPromos[2].requirements, data.autoPromos[2].rewards);
});

test('shopping cart eligible for Buy Unlimited 2GB get 1GB Data-pack free', () => {

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        }
    ];

    expect(TwoGBFreeOneGB.checkIfApplicable(cart)).toBe(true);
});

test('shopping cart not eligible for Buy Unlimited 2GB get 1GB Data-pack free', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 1,
            price: 24.90
        }
    ];
    expect(TwoGBFreeOneGB.checkIfApplicable(cart)).toBe(false);
});

test('shopping cart got 1 freebie from Buy Unlimited 2GB get 1GB Data-pack free', () => {

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        }
    ];

    const expected = new ShoppingCart();
    expected.items = [
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        },
        {
            code: '1gb',
            qty: 1,
            price: 0
        }
    ];
    expected.total = 29.90;

    expect(TwoGBFreeOneGB.apply(cart)).toEqual(expected);

    cart.items[0].qty = 3;
    expected.items[0].qty = 3;
    expected.items[1].qty = 3;
    expected.total = 89.70;
    expect(TwoGBFreeOneGB.apply(cart)).toEqual(expected);
});
