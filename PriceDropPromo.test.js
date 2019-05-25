import fs from 'fs'
import Promo from "./Promo";
import ShoppingCart from "./ShoppingCart";

let priceDropPromo;
beforeEach(() => {

    const rawData = fs.readFileSync("pricing-rules.json");
    const data = JSON.parse(rawData);

    priceDropPromo = new Promo(data.autoPromos[1].name, data.autoPromos[1].requirements, data.autoPromos[1].rewards);
});


test('shopping cart eligible for discount', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_large',
            qty: 3,
            price: 44.90
        }
    ];

    expect(priceDropPromo.checkIfApplicable(cart)).toBe(true);
});

test('shopping cart eligible not eligible', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_large',
            qty: 1,
            price: 44.90
        }
    ];

    expect(priceDropPromo.checkIfApplicable(cart)).toBe(false);
});

test('shopping cart got savings', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_large',
            qty: 3,
            price: 44.90
        }
    ];

    const expected = Object.assign(new ShoppingCart(), {
        items: [
            {
                code: 'ult_large',
                qty: 3,
                price: 39.90
            }
        ],
        total: 119.70,
        pricingRule: undefined
    });
    expect(priceDropPromo.apply(cart)).toEqual(expected);

    cart.items[0].qty = 4;
    expected.items[0].qty = 4;
    expected.total = 159.60;
    expect(priceDropPromo.apply(cart)).toEqual(expected);
});
