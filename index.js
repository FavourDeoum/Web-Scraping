import puppeteer from "puppeteer-core";

async function getHouseData(url, outputData) {
    try {
        // launch the browser and open new blank page
        const browser = await puppeteer.launch({headless:false})
        const page = await browser.newPage()

        // set viewport
        await page.setViewport({
            width:1080,
            height:768,
        })

        // change navigation timeout from default 30sec to 2mins
        page.setDefaultNavigationTimeout(2 * 60 * 1000)

        // navigate to url
        await page.goto("https://zillow.com")

    } catch (error) {
        console.log(error)
    }
}

getHouseData(url, outputData)