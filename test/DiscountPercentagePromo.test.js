import fs from 'fs'
import ManualPromo from "../promo/ManualPromo"
import ShoppingCart from "../cart/ShoppingCart";
import DiscountPercentageReward from "../reward/DiscountPercentageReward";

let iLoveAmaySimPromo;
beforeEach(() => {
    const rawData = fs.readFileSync("data/pricing-rules.json");
    const data = JSON.parse(rawData);

    iLoveAmaySimPromo = new ManualPromo(data.manualPromos[0].name, data.manualPromos[0].requirements, data.manualPromos[0].rewards);
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

test('shopping cart got 10% discount case 1', () => {
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
        totalDiscount: 0.1,
        pricingRule: undefined,
        couponCodes: [ iLoveAmaySimPromo.code ]
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});

test('shopping cart got 10% discount case 2', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 3,
            price: 24.90
        }
    ];
    cart.couponCodes.push(iLoveAmaySimPromo.code);

    const expected = Object.assign(new ShoppingCart(), {
        items: [
            {
                code: 'ult_small',
                qty: 3,
                price: 24.90
            }
        ],
        total: 67.23,
        totalDiscount: 0.1,
        pricingRule: undefined,
        couponCodes: [ iLoveAmaySimPromo.code ]
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});

test('shopping cart got 20% discount case 1', () => {
    iLoveAmaySimPromo.rewards.push(new DiscountPercentageReward(0.10));

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
        totalDiscount: 0.2,
        total: 39.84
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});

test('shopping cart got 20% discount case 2', () => {
    iLoveAmaySimPromo.rewards.push(new DiscountPercentageReward(0.10));

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 3,
            price: 24.90
        }
    ];
    cart.couponCodes.push(iLoveAmaySimPromo.code);

    const expected = Object.assign(new ShoppingCart(),{
        items: [
            {
                code: 'ult_small',
                qty: 3,
                price: 24.90
            }
        ],
        couponCodes: [iLoveAmaySimPromo.code],
        totalDiscount: 0.2,
        total: 59.76
    });
    expect(iLoveAmaySimPromo.apply(cart)).toEqual(expected);
});
