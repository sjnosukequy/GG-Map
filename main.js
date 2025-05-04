const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function start() {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote",
            '--use-gl=swiftshader',
        ],
        // executablePath: '/opt/google/chrome/chrome',
        headless: true,
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    return [page, browser];
}

async function SearchMap(lat, lng, querry) {
    const obj = await start();
    const page = obj[0];
    const browser = obj[1];
    try {
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(querry)}/@${lat},${lng},20z`);

        // Set screen size.
        await page.setViewport({ width: 1920, height: 1080 });

        // Type into search box.
        await sleep(2000);
        await page.locator('[role="feed"]').scroll({ scrollTop: 10000 });
        await sleep(2000);



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

                try {
                    let href = lists[i].querySelector('a').getAttribute('href')
                    let hrefData = href.split('/data=')[1]
                    let href_lat = hrefData.split('!')[5].split('d')[1]
                    let href_lng = hrefData.split('!')[6].split('d')[1]

                    let address = ''
                    let addressEl = lists[i].querySelector('.fontBodyMedium').children[3].querySelectorAll('span')
                    let symbols = lists[i].querySelector('.fontBodyMedium').children[3].querySelector('span .google-symbols')
                    if (symbols) {
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
                    let ggMap = `https://www.google.com/maps/dir/${lat},${lng}/${encodeURIComponent(name + ' ' + address)}`
                    let ggMap2 = `https://www.google.com/maps/dir/${lat},${lng}/${href_lat},${href_lng}`
                    data.push({
                        restaurant: name,
                        rating: rating,
                        address: address,
                        image: lists[i].querySelector('img')?.getAttribute('src') ? lists[i].querySelector('img').getAttribute('src') : '',
                        ggMap: ggMap,
                        ggMap2: ggMap2,
                        geolocation: {
                            lat: href_lat,
                            lng: href_lng
                        }
                    })
                }
                catch (e) {
                    continue;
                }
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