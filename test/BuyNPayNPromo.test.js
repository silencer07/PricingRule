import Promo from "../src/promo/Promo";
import fs from 'fs'
import ShoppingCart from "../src/cart/ShoppingCart";
import BuyNPayNReward from "../src/reward/BuyNPayNReward";

let threeForTwo;
beforeEach(() => {
    const rawData = fs.readFileSync("data/pricing-rules.json");
    const data = JSON.parse(rawData);

    threeForTwo = new Promo(data.autoPromos[0].name, data.autoPromos[0].requirements, data.autoPromos[0].rewards);
});


test('shopping cart eligible for 3 for 2 deal on Unlimited 1GB', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 3,
            price: 24.90
        }
    ];
    expect(threeForTwo.checkIfApplicable(cart)).toBe(true);
});

test('shopping cart not eligible for 2 deal on Unlimited 1GB shopping cart', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    expect(threeForTwo.checkIfApplicable(cart)).toBe(false);
});

test('shopping cart got 1 freebie from 3 for 2 deal on Unlimited 1GB', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 3,
            price: 24.90
        }
    ];

    const expected = new ShoppingCart();
    expected.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        },
        {
            code: 'ult_small',
            qty: 1,
            price: 0
        }
    ];
    expected.total = 49.80;

    //expect(threeForTwo.apply(cart)).toEqual(expected);

    cart.items[0].qty = 4;
    expected.items[0].qty = 3;
    expected.total = 74.70;
    expect(threeForTwo.apply(cart)).toEqual(expected);
});

test('shopping cart got 3 freebie from 3 for 2 deal on Unlimited 1GB', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 6,
            price: 24.90
        }
    ];

    const expected = new ShoppingCart();
    expected.items = [
        {
            code: 'ult_small',
            qty: 4,
            price: 24.90
        },
        {
            code: 'ult_small',
            qty: 2,
            price: 0
        }
    ];
    expected.total = 99.60;

    expect(threeForTwo.apply(cart)).toEqual(expected);
});

test('suddenly 3 for 2 deal on Unlimited 1GB requirement increased', () => {
    threeForTwo.requirements.push({
        code: 'ult_medium',
        qty: 1
    });

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 3,
            price: 24.90
        },
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        }
    ];

    const expected = new ShoppingCart();
    expected.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        },
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        },
        {
            code: 'ult_small',
            qty: 1,
            price: 0
        }
    ];
    expected.total = 79.70;

    expect(threeForTwo.apply(cart)).toEqual(expected);

    // the cart did not satisfy the requirement
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    cart.total = 49.80;
    expect(threeForTwo.apply(cart)).toEqual(cart);
});