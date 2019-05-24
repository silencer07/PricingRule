import FreebiePromo from "./FreebiePromo";
import fs from 'fs'
import ShoppingCart from "./ShoppingCart";

let threeForTwo;
let TwoGBFreeOneGB;
beforeEach(() => {

    const rawData = fs.readFileSync("pricing-rules.json");
    const data = JSON.parse(rawData);

    threeForTwo = new FreebiePromo(data.autoPromos[0].name, data.autoPromos[0].requirements, data.autoPromos[0].rewards);
    TwoGBFreeOneGB = new FreebiePromo(data.autoPromos[2].name, data.autoPromos[2].requirements, data.autoPromos[2].rewards);
});


test('shopping cart eligible for 3 for 2 deal on Unlimited 1GB', () => {
    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
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
            qty: 1,
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
            qty: 2,
            price: 24.90
        }
    ];

    const expected = {
        items: [
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
        ],
        total: 49.80,
        pricingRule: undefined,
        couponCodes: []
    };
    expect(threeForTwo.apply(cart)).toEqual(expected);

    cart.items[0].qty = 3;
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

    const expected = {
        items: [
            {
                code: 'ult_small',
                qty: 6,
                price: 24.90
            },
            {
                code: 'ult_small',
                qty: 3,
                price: 0
            }
        ],
        total: 149.40,
        pricingRule: undefined,
        couponCodes: []
    };
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
            qty: 2,
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

test('suddenly 3 for 2 deal on Unlimited 1GB reward increased', () => {
    threeForTwo.rewards.push({
        type: "FreebiePromo",
        applyPerItem: false,
        code: 'ult_medium',
        qty: 1,
    });

    const cart = new ShoppingCart();
    cart.items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ]

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
        },
        {
            code: 'ult_medium',
            qty: 1,
            price: 0
        }
    ];
    expected.total = 49.80;

    expect(threeForTwo.apply(cart)).toEqual(expected);
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
    expected.total = 29.90

    expect(TwoGBFreeOneGB.apply(cart)).toEqual(expected);

    cart.items[0].qty = 3;
    expected.items[0].qty = 3;
    expected.items[1].qty = 3;
    expected.total = 89.70;
    expect(TwoGBFreeOneGB.apply(cart)).toEqual(expected);
});
