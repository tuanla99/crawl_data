const pageScraper = require('./pageScraper');
const fs = require('fs');
async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let scrapedData = {};
        const subject_0 = 'Thời sự';
        const subject_1 = 'Kinh doanh';
        const subject_2 = 'Pháp luật';
        const subject_3 = 'Giáo dục';
        const subject_4 = 'Sức khỏe';
        const subject_5 = 'Đời sống';

        // Call the scraper for different set of news to be scraped
        scrapedData[subject_0] = await pageScraper.scraper(browser, subject_0);
        scrapedData[subject_1] = await pageScraper.scraper(browser, subject_1);
        scrapedData[subject_2] = await pageScraper.scraper(browser, subject_2);
        scrapedData[subject_3] = await pageScraper.scraper(browser, subject_3);
        scrapedData[subject_4] = await pageScraper.scraper(browser, subject_4);
        scrapedData[subject_5] = await pageScraper.scraper(browser, subject_5);
        await browser.close();
        console.log(scrapedData);

        //xu li lap
        let links = [];
        let duplicates = [];
        fs.readFile('links.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                links = JSON.parse(data);
                for (let i = 0; i < links.lenght; i++) {
                    for (let j = i; j < links.lenght; j++) {
                        if (links[i].link == links[j].links) {
                            duplicates.push(links[j]);
                        }
                    }
                }
            }
        });

        if (duplicates) {
            duplicates.forEach(l => {
                switch (l.subject) {
                    case subject_0:
                        scrapedData[subject_0].slice(l.id);
                        break;
                    case subject_1:
                        scrapedData[subject_1].slice(l.id);
                        break;
                    case subject_2:
                        scrapedData[subject_2].slice(l.id);
                        break;
                    case subject_3:
                        scrapedData[subject_3].slice(l.id);
                        break;
                    case subject_4:
                        scrapedData[subject_4].slice(l.id);
                        break;
                    case subject_5:
                        scrapedData[subject_5].slice(l.id);
                        break;
                    case subject_6:
                        scrapedData[subject_6].slice(l.id);
                        break;
                    case subject_7:
                        scrapedData[subject_7].slice(l.id);
                        break;
                    
                }
            })
        }
        fs.writeFile("data.json", JSON.stringify(scrapedData), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The data has been scraped and saved successfully! View it at './data.json'");
        });

    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)