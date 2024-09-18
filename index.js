import puppeteer from "puppeteer";
import fs from "fs";

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
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        // navigate to url
        await page.goto(url)

          // Extract links
    const links = await page.$$eval('a', (Element) =>
        Element.map((Element) => ({
            href: Element.href,
            text: Element.textContent,
        })))
         console.log(links);
            
        // Convert from object array to strings 
        const dataToBeSave = await JSON.stringify(links);

        // write Extracted DatatobeSave to the file
        fs.writeFileSync(outputData, dataToBeSave, "utf-8");

        await browser.close();
    } catch (error) {
        console.log(error)
    }

}
const link = "https://zillow.com";
const DataToBe = "extracted_links";

getHouseData(link, DataToBe);