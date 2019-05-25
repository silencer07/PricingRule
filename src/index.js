import fs from "fs";
import PricingRule from "./cart/PricingRule";
import ShoppingCart from "./cart/ShoppingCart";
import ShoppingCartItem from "./cart/ShoppingCartItem";

const rawData = fs.readFileSync("data/pricing-rules.json");
const data = JSON.parse(rawData);

const pricingRule = new PricingRule(data.autoPromos, data.manualPromos);

const shoppingCartsToShow = [];

const shoppingCart1 = new ShoppingCart(pricingRule);
const item1 = new ShoppingCartItem(data.products[0], 3);
const item2 = new ShoppingCartItem(data.products[2], 1);
shoppingCart1.add(item1);
shoppingCart1.add(item2);
shoppingCartsToShow.push(shoppingCart1);

const shoppingCart2 = new ShoppingCart(pricingRule);
const item3 = new ShoppingCartItem(data.products[0], 2);
const item4 = new ShoppingCartItem(data.products[2], 4);
shoppingCart2.add(item3);
shoppingCart2.add(item4);
shoppingCartsToShow.push(shoppingCart2);

const shoppingCart3 = new ShoppingCart(pricingRule);
const item5 = new ShoppingCartItem(data.products[0], 1);
const item6 = new ShoppingCartItem(data.products[1], 2);
shoppingCart3.add(item5);
shoppingCart3.add(item6);
shoppingCartsToShow.push(shoppingCart3);

const shoppingCart4 = new ShoppingCart(pricingRule);
const item7 = new ShoppingCartItem(data.products[0], 1);
const item8 = new ShoppingCartItem(data.products[3], 1);
shoppingCart4.add(item7);
shoppingCart4.add(item8, data.manualPromos[0].code);
shoppingCartsToShow.push(shoppingCart4);

shoppingCartsToShow.forEach((s, index) => {
    console.log('------------------------------------');
    console.log(`scenario ${index + 1}:`);
    console.log(`> items added:`);
    s.items.forEach(i =>
        console.log(`${i.qty} X ${findItemByCode(i.code).name}`)
    );

    s.process();

    console.log(`> final items:`);
    s.items.forEach(i =>
        console.log(`${i.qty} X ${findItemByCode(i.code).name}`)
    );
    console.log(`> total: ${s.total}`);
    console.log('------------------------------------');
});

function findItemByCode(code) {
    return data.products.find(p => p.code === code)
}