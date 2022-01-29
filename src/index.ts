import puppeteer from "puppeteer";
import { google } from "googleapis";

import dotenv from "dotenv";

dotenv.config();




const googleSheetsInput : unknown[]  = []
let date = new Date(2021, 0 ,20);
let presidentNameInput = '';
let dateInput = '';
let approvalRateInput = '';
let disapprovalInput = '';



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
  

  for(let a = 0; a < data["1"][0][0].length; a++){

    date.setDate(date.getDate() + 1);

    presidentNameInput = data["1"][0][0][a][1];
    dateInput = date.toLocaleDateString("en-us");
    approvalRateInput = data["1"][0][0][a][2];
    disapprovalInput = data["1"][0][0][a][3];
  
    googleSheetsInput.push([presidentNameInput,dateInput,approvalRateInput,disapprovalInput]);
  }
 
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly","https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const updateData = {
    auth,
    spreadsheetId : process.env["SHEET_ID"],
    range: "Sheet1!A:D",
    valueInputOption : "USER_ENTERED",
    resource: {values: googleSheetsInput}
  }


  // const response = await sheets.spreadsheets.values.get({
  //   spreadsheetId: process.env["SHEET_ID"],
  //   range: "Sheet1!A1:D1",
  // });

  let store = await sheets.spreadsheets.values.append(updateData);






  console.log(store);
  browser.close();
}

main();
