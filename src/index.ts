import puppeteer from "puppeteer";
import { google } from "googleapis";
const sheets = google.sheets("v4");

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://morningconsult.com/global-leader-approval/", {
    waitUntil: "domcontentloaded",
  });

  const data = await page.evaluate(() => {
    // @ts-ignore
    return mc_timeline_filterable;
  });
  console.log(data["1"][0][0]);
  // const auth = new google.auth.GoogleAuth({
  //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  //   credentials: {},
  // });
  // const authClient = await auth.getClient();
  // google.options({ auth: authClient });
  // console.log("Worked");

  browser.close();
}

main();
// https://docs.google.com/spreadsheets/d/1w7tRoI3AXAokaGRu9PAWk9K9Us10YbCyYOFqWy6SQbQ/edit?usp=sharing

// sheetid 1w7tRoI3AXAokaGRu9PAWk9K9Us10YbCyYOFqWy6SQbQ

//spreadsheets.google.com/feeds/worksheets/spreadsheetID/public/basic?alt=json
