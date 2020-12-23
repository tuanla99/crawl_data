const fs = require('fs');
const num =100; //
const scraperObject = {

    url: 'https://vnexpress.net',
    // url: 'https://vnexpress.net/thoi-su',




    async scraper(browser, category) {
        let linkScrape = [];
        // linkScrape = fs.readFileSync('links.json', 'utf8');
        // linkScrape = JSON.parse(linkScrape);
        // console.log(linkScrape);
        let id = 0;

        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);

        // Select the category of book to be displayed
        let selectedCategory = await page.$$eval('.main-nav > ul > li > a', (links, _category) => {
            // Search for the element that has the matching text
            links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "").toLowerCase() === _category.toLowerCase() ? a : null);
            let link = links.filter(tx => tx !== null)[0];
            return link.href;
        }, category);

        // Navigate to the selected category
        await page.goto(selectedCategory);
        let scrapedData = [];

        // Wait for the required DOM to be rendered
        async function scrapeCurrentPage() {
            await page.waitForSelector('body');
            // Get the link to all the required books
            let urls = await page.evaluate(() => {

                // Extract the links from the data
                let articleElements = document.querySelectorAll('.width_common.list-news-subfolder > article >h3 > a');
                articleElements = [...articleElements];
                let links = articleElements.map(el => el.getAttribute('href'));
                return links;
            });
            //  console.log(urls);

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage();
                await newPage.goto(link);
                try {
                    dataObj['id'] = id++;
                    dataObj['subject'] = category;
                    dataObj['title'] = await newPage.$eval('.title-detail', text => text.textContent);
                    dataObj['date'] = await newPage.$eval('.date', text => text.textContent);
                    dataObj['description'] = await newPage.$eval('.description', text => {
                        // Strip new line and tab spaces
                        text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                        return text;
                    });
                    dataObj['content'] = await newPage.evaluate(() => {
                        let contentElement = document.querySelectorAll('.Normal');
                        contentElement = [...contentElement];
                        let content = contentElement.map(el => el.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, ""));
                        return content.join(' ');
                    });
                    dataObj['link'] = link;

                    linkScrape.push({
                        'id': id,
                        'link': link,
                        'subject': dataObj['subject']
                    });
                    resolve(dataObj);
                    console.log(dataObj);
                    await newPage.close();
                } catch (error) {
                    console.log(error);
                    resolve(dataObj);
                    console.log(dataObj);
                    await newPage.close();
                }

            });

            
            for (link in urls) {

                let currentPageData = await pagePromise(urls[link]);
                if (currentPageData) {
                    scrapedData.push(currentPageData);
                    if (id == num) {
                        console.log('scrapedData id =='+num);
                        break;
                    }
                }

                // console.log(currentPageData);
            }


            // When all the data on this page is done, click the next button and start the scraping of the next page
            // You are going to check if this button exist first, so you know if there really is a next page.
            let nextButtonExist = false;
            try {

                if (id == num) {
                    nextButtonExist = false;
                    console.log('end id =='+num);
                } else {
                    let nextButton = await page.$eval('.button-page > a', a => a.textContent);
                    nextButtonExist = true;
                }
            } catch (err) {
                nextButtonExist = false;
            }

            if (nextButtonExist) {
                await page.click('.button-page > a');
                return scrapeCurrentPage(); // Call this function recursively
            }
            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        // console.log(data);
        
        fs.readFile('links.json', 'utf8', function readFileCallback(err, data) {
            let l = [];
            if (err) {
                console.log(err);
            } else {
                l = JSON.parse(data);
                l = l.concat(linkScrape);
                // console.log(JSON.stringify(l));
                fs.writeFile('links.json', JSON.stringify(l), 'utf8', function (e) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The links has been scraped and saved successfully! View it at './links.json'");
                }); // write it back 
            }
        });
        // fs.appendFile("links.json", JSON.stringify(linkScrape), 'utf8', function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("The links has been scraped and saved successfully! View it at './links.json'");
        // })
        // fs.writeFile(`${category}.json`, JSON.stringify(data), 'utf8', function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("The data has been scraped and saved successfully! View it at './data.json'");
        // });
         return data;
    }
}

module.exports = scraperObject;