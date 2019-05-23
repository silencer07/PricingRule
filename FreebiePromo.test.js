import FreebiePromo from "./FreebiePromo";
import fs from 'fs'

const rawData = fs.readFileSync("pricing-rules.json");
const data = JSON.parse(rawData);

const freebiePromoFromJson = data.autoPromos[0];

const freebiePromo = new FreebiePromo(freebiePromoFromJson.name, freebiePromoFromJson.requirements, freebiePromoFromJson.rewards);

test('applicable 3 for 2 deal on Unlimited 1GB shopping cart', () => {
    const items = [
        {
            code: 'ult_small',
            qty: 2
        }
    ];
    expect(freebiePromo.checkIfApplicable(items)).toBe(true);
});
