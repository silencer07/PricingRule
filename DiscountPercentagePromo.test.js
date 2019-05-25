import fs from 'fs'
import DiscountPercentagePromo from "./DiscountPercentagePromo";
import ShoppingCart from "./ShoppingCart";

let iLoveAmaySimPromo;
beforeEach(() => {

    const rawData = fs.readFileSync("pricing-rules.json");
    const data = JSON.parse(rawData);

    iLoveAmaySimPromo = new DiscountPercentagePromo(data.manualPromos[0].name, data.manualPromos[0].requirements, data.manualPromos[0].rewards);
    iLoveAmaySimPromo.code = data.manualPromos[0].code;
});


test('shopping cart eligible for discount', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    cart.couponCodes.push(iLoveAmaySimPromo.code);

    expect(iLoveAmaySimPromo.checkIfApplicable(cart)).toBe(true);
});

test('shopping cart eligible not eligible', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];

    expect(iLoveAmaySimPromo.checkIfApplicable(cart)).toBe(false);
});

test('shopping cart got 10% discount', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    cart.couponCodes.push(iLoveAmaySimPromo.code);

    const expected = Object.assign(new ShoppingCart(), {
        items: [
            {
                code: 'ult_small',
                qty: 2,
                price: 24.90
            }
        ],
        total: 44.82,
        pricingRule: undefined,
        couponCodes: [ iLoveAmaySimPromo.code ]
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);

    cart.items[0].qty = 3;
    expected.items[0].qty = 3;
    expected.total = 67.23;
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});

test('shopping cart got 20% discount', () => {
    iLoveAmaySimPromo.rewards.push({
        "type" : "DiscountPercentagePromo",
        "percentage": 0.10
    });

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    cart.couponCodes.push(iLoveAmaySimPromo.code);

    const expected = Object.assign(new ShoppingCart(),{
        items: [
            {
                code: 'ult_small',
                qty: 2,
                price: 24.90
            }
        ],
        couponCodes: [iLoveAmaySimPromo.code],
        total: 39.84
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);

    cart.items[0].qty = 3;
    expected.items[0].qty = 3;
    expected.total = 59.76;
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});