import FreebiePromo from "./FreebiePromo";
import fs from 'fs'

let threeForTwo;
let TwoGBFreeOneGB;
beforeEach(() => {

    const rawData = fs.readFileSync("pricing-rules.json");
    const data = JSON.parse(rawData);

    threeForTwo = new FreebiePromo(data.autoPromos[0].name, data.autoPromos[0].requirements, data.autoPromos[0].rewards);
    TwoGBFreeOneGB = new FreebiePromo(data.autoPromos[2].name, data.autoPromos[2].requirements, data.autoPromos[2].rewards);
});


test('shopping cart eligible for 3 for 2 deal on Unlimited 1GB', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    expect(threeForTwo.checkIfApplicable(items)).toBe(true);
});

test('shopping cart not eligible for 2 deal on Unlimited 1GB shopping cart', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 1,
            price: 24.90
        }
    ];
    expect(threeForTwo.checkIfApplicable(items)).toBe(false);
});

test('shopping cart got 1 freebie from 3 for 2 deal on Unlimited 1GB', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    const expected = [
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
    expect(threeForTwo.apply(items)).toEqual(expected);

    items[0].qty = 3;
    expected[0].qty = 3;
    expect(threeForTwo.apply(items)).toEqual(expected);
});

test('shopping cart got 3 freebie from 3 for 2 deal on Unlimited 1GB', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 6,
            price: 24.90
        }
    ];
    const expected = [
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
    ];
    expect(threeForTwo.apply(items)).toEqual(expected);
});

test('suddenly 3 for 2 deal on Unlimited 1GB requirement increased', () => {
    threeForTwo.requirements.push({
        code: 'ult_medium',
        qty: 1
    });
    let items = [
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
    const expected = [
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
    expect(threeForTwo.apply(items)).toEqual(expected);

    // the cart did not satisfy the requirement
    items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    expect(threeForTwo.apply(items)).toEqual(items);
});

test('suddenly 3 for 2 deal on Unlimited 1GB reward increased', () => {
    threeForTwo.rewards.push({
        type : "FreebiePromo",
        applyPerItem: false,
        code: 'ult_medium',
        qty: 1,
    });
    const items = [
        {
            code: 'ult_small',
            qty: 2,
            price: 24.90
        }
    ];
    const expected = [
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
    expect(threeForTwo.apply(items)).toEqual(expected);
});

test('shopping cart eligible for Buy Unlimited 2GB get 1GB Data-pack free', () => {
    const items = [
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        }
    ];
    expect(TwoGBFreeOneGB.checkIfApplicable(items)).toBe(true);
});

test('shopping cart not eligible for Buy Unlimited 2GB get 1GB Data-pack free', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 1,
            price: 24.90
        }
    ];
    expect(TwoGBFreeOneGB.checkIfApplicable(items)).toBe(false);
});

test('shopping cart got 1 freebie from Buy Unlimited 2GB get 1GB Data-pack free', () => {
    const items = [
        {
            code: 'ult_medium',
            qty: 1,
            price: 29.90
        }
    ];
    const expected = [
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
    expect(TwoGBFreeOneGB.apply(items)).toEqual(expected);

    items[0].qty = 3;
    expected[0].qty = 3;
    expected[1].qty = 3;
    expect(TwoGBFreeOneGB.apply(items)).toEqual(expected);
});
