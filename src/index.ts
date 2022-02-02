import puppeteer from "puppeteer";
import { google } from "googleapis";

import dotenv from "dotenv";

dotenv.config();

const googleSheetsInput: unknown[] = [];
let date = new Date();
let presidentNameInput = "";
let approvalRateInput = "";
let disapprovalInput = "";
let dateTime = "";

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



  const inputData = (index: number, amountOfData : number) => {
    for (let b = 0; b < amountOfData; b++) { 
      date = new Date(data[1][0][index][b][0] * 1000);
      dateTime = date.toLocaleDateString();
      presidentNameInput = data["1"][0][index][b][1];
      approvalRateInput = data["1"][0][index][b][2];
      disapprovalInput = data["1"][0][index][b][3];

      googleSheetsInput.push([
        presidentNameInput,
        dateTime,
        approvalRateInput,
        disapprovalInput,
      ]);
     
    }
  };


  for(let t = 0; t < data["1"][0].length; t++){
    inputData(t,data["1"][0][t].length);
    googleSheetsInput.push([]);
    // date = new Date(data[1][0][0][0][0]);
  }

  
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly","https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const googleSheetsOptions = {
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

  

  let store = await sheets.spreadsheets.values.append(googleSheetsOptions);
 

  console.log(store);
  browser.close();
}

main();
