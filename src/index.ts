import puppeteer from "puppeteer";
import { google } from "googleapis";

import dotenv from "dotenv";

dotenv.config();

async function main() {
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto("https://morningconsult.com/global-leader-approval/", {
  //   waitUntil: "domcontentloaded",
  // });
  // const data = await page.evaluate(() => {
  //   // @ts-ignore
  //   return mc_timeline_filterable;
  // });
  // console.log(data["1"][0][0]);
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env["SHEET_ID"],
    range: "Sheet1!A1:D1",
  });

  console.log(response.data);

  // browser.close();
}

main();
