const puppeteer = require('puppeteer');
var fs = require('fs');
let url = 'https://www.zonaprop.com.ar/casas-venta-gba-sur.html';

(async () => {
    for (let i = 1; i < 3; i++) {
        if (i > 1) {
            url = 'https://www.zonaprop.com.ar/casas-venta-gba-sur-pagina-' + i + '.html'
        }
        
        page(url);
        if(i % 10 === 0){
            break;
        }
    }
})();

async function page(url) {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    let data = await page.evaluate(() => {
        let prices = document.querySelectorAll('div[class="firstPriceContainer"] > span');
        let attrs = document.querySelectorAll('.postingCardMainFeaturesBlock > ul')
        
        let elements = [];
        prices.forEach(element => {
            elements.push(element.innerText);
        })
        let elements2 = [];
        attrs.forEach(element => {
            elements2.push(element.innerText);
        })

        let data = []
        for (let i = 0; i < elements.length; i++) {
            let json = {
                'price': elements[i],
                'attrs': elements2[i]
            }
            data.push(json);
            
        }
        return data

    })
    console.log(data)
    fs.writeFile('data.json',JSON.stringify(data), () => {
        console.log('Data saved');
    });
    await browser.close();
}

