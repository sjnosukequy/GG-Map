const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return [page, browser];
}

async function SearchMap(lat, lng, querry) {
    const obj = await start();
    const page = obj[0];
    const browser = obj[1];
    try {
        await page.goto(`https://www.google.com/maps/search/${encodeURI(querry)}/@${lat},${lng},20z`);

        // Set screen size.
        await page.setViewport({ width: 1080, height: 1024 });

        // Type into search box.
        await sleep(3000);
        await page.locator('[role="feed"]').scroll();


        // Wait and click on first result.
        // await page.locator('.devsite-result-item-link').click();

        // Locate the full title with a unique string.
        const textSelector = await page
            .locator('[role="feed"]')
            .waitHandle();
        const fullTitle = await textSelector?.evaluate((el, lat, lng) => {
            let lists = el.children;
            let data = []
            for (let i = 2; i < lists.length; i += 2) {

                let address = ''
                let addressEl = lists[i].querySelector('.fontBodyMedium').children[3].querySelectorAll('span')
                if (addressEl.length > 9) {
                    address = addressEl[8].innerText
                }
                else
                    address = addressEl[4].innerText

                let rating = ''
                let ratingEl = lists[i].querySelector('.fontBodyMedium').children[2].querySelectorAll('[aria-hidden="true"]')
                if (ratingEl.length > 0) {
                    rating = ratingEl[0].innerText
                }
                else
                    rating = 'No ratings'

                let name = lists[i].querySelector('.fontBodyMedium').children[0].innerText
                let ggMap = `https://www.google.com/maps/dir/${lat},${lng}/${encodeURI(name + ' ' + address)}`

                data.push({
                    restaurant: name,
                    rating: rating,
                    address: address,
                    image: lists[i].querySelector('img').getAttribute('src'),
                    ggMap: ggMap
                })
            }
            return data
        }, lat, lng);
        // console.log(fullTitle);
        return fullTitle
    }
    finally {
        await browser.close();
    }
}

module.exports = { SearchMap }