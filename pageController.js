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
        // scrapedData[subject_0] = await pageScraper.scraper(browser, subject_0);
        // scrapedData[subject_1] = await pageScraper.scraper(browser, subject_1);
        // scrapedData[subject_2] = await pageScraper.scraper(browser, subject_2);
        // scrapedData[subject_3] = await pageScraper.scraper(browser, subject_3);
        // scrapedData[subject_4] = await pageScraper.scraper(browser, subject_4);
        // scrapedData[subject_5] = await pageScraper.scraper(browser, subject_5);
        // await browser.close();
        // console.log(scrapedData);

        //xu li lap
        let links = [];
        let duplicates = [];
        fs.readFile('links.json', 'utf8', function readFileCallback(err, data1) {
            if (err) {
                console.log(err);
            } else {

                fs.readFile("data.json", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    let tmp = JSON.parse(data) ;
                    let co=0;
                    links = JSON.parse(data1);
                    let length =( Object.keys(links).length+'');
                    console.log(length)
                    for (let i = 0; i < length; i++) {
                        for (let j = i; j < length; j++) {
                            if (links[i].link == links[j].link) {
                                duplicates.push(links[j]);
                                links.splice(j,1) ;
                            }
                        }
                    }
                    console.log(duplicates.length)
                    if (duplicates.lenght >0) {
                        duplicates.forEach(l => {
                            console.log(l)
                            switch (l.subject) {
                                case subject_0:
                                    tmp[subject_0].splice(l.id,1);
                                    break;
                                case subject_1:
                                    tmp[subject_1].splice(l.id,1);
                                    break;
                                case subject_2:
                                    tmp[subject_2].splice(l.id,1);
                                    break;
                                case subject_3:
                                    tmp[subject_3].splice(l.id,1);
                                    break;
                                case subject_4:
                                    tmp[subject_4].splice(l.id,1);
                                    break;
                                case subject_5:
                                    tmp[subject_5].splice(l.id,1);
                                    break;


                            }
                        })
                        
                    }
                   // console.log(links[3].link);
                    // fs.writeFile("data.json", JSON.stringify(tmp), 'utf8', function (err) {
                    //     if (err) {
                    //         return console.log(err);
                    //     }
                    //     console.log("Theee data has been scraped and saved successfully! View it at './data.json'");
                    // });
                });
            }
        });



    } catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)