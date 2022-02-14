import puppeteer from "puppeteer";
import https from "https";
import fs from "fs";
import { GoogleApis } from "googleapis";

async function scrapper() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://projects.fivethirtyeight.com/biden-approval-rating/",
    {
      waitUntil: "domcontentloaded",
    }
  );

  

  const downloadLink = await page.$eval(
    ".additional-credits p:nth-child(2) a:nth-child(1)",
    (link) => link.getAttribute("href")
  );

  

  https.get(String(downloadLink), (res) => {
    const writeStream = fs.createWriteStream('data.xlsx');
    res.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("finish");
      writeStream.close();
    });
  });



  console.log(downloadLink);
  browser.close();
}

scrapper();
