import puppeteer from "puppeteer";
import fs from "fs";

async function getHouseData(url, searchQuery, outputData) {
    try {
        // launch the browser and open new blank page
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // set viewport
        await page.setViewport({
            width: 1080,
            height: 768,
        })

        // change navigation timeout from default 30sec to 2mins
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        // navigate to url
        await page.goto(url)

        // get the search element
        await page.focus('input[type="text"]');

        // passing what is to be search in the element
        await page.keyboard.type(searchQuery);

        // tell the keyboard press enter
        await page.keyboard.press('Enter');

        // wait for page navigation untill network is stable ie when page data has completed
        await page.waitForNavigation({ waitUntil: 'networkidle2' });


        // Extract images
        const images = await page.$$eval('img', (Element) =>
            Element.map((Element) => ({
                src: Element.src,
                alt: Element.alt,
            }))
        );
        console.log(images);

        // Extract links
        const links = await page.$$eval('a', (Element) =>
            Element.map((Element) => ({
                href: Element.href,
                text: Element.textContent,
            })))
        console.log(links);

        // Convert from object array to strings 
        const dataToBeSave = {
            images,
            links
        };

        // Counting images and href tags
        const imageCount = images.length;
        const linkCount = links.length;
        console.log(imageCount);
        console.log(linkCount);


        // convert JSON into string
        const save = await JSON.stringify(dataToBeSave);

        // write Extracted DatatobeSave to the file
         await fs.writeFileSync(outputData, save, "utf-8");

        await browser.close();
    } catch (error) {
        console.log(error)
    }

}
const link = "https://www.zillow.com/homes/for_sale/";
const DataToBe = "extracted_links";
const search = "Deckers";

getHouseData(link, search, DataToBe);