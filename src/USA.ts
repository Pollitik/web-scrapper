import puppeteer  from "puppeteer";
import { GoogleApis } from "googleapis";


async function scrapper (){
    const browser = await puppeteer.launch({
        headless:false
    })

    const page = await browser.newPage();

    await page.goto("https://projects.fivethirtyeight.com/biden-approval-rating/",{
        waitUntil: "domcontentloaded"
    });

   
    
}