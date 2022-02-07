import puppeteer from "puppeteer";
import { google, GoogleApis } from "googleapis";
import dotenv from "dotenv"

dotenv.config();

async function scrapper() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto("https://oraculus.mx/aprobacion-presidencial/", {
    waitUntil: "domcontentloaded",
  });

  await page.select("#table_1_length .length_menu", "-1");
  await page.click("#table_1_wrapper .wdtscroll #table_1 thead tr .column-mes");

  const returnData = await page.evaluate(() => {
    const table = document.querySelector("#table_1");
    const rows = table?.querySelectorAll("tbody tr");
    const data: unknown[] = [];
    data.push([]);
    rows?.forEach((row) => {
      const datum = row.querySelectorAll("td");
      data.push(["Andrés Manuel López Obrador",datum[0].innerText, datum[2].innerText, datum[3].innerText]);
    });

    return data;
  });

  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const googleSheetsOptions = {
    auth,
    spreadsheetId: process.env["SHEET_ID"],
    range:"Sheet1!A6949:D7105",
    valueInputOption: "USER_ENTERED",
    resource: {values : returnData}
  };

  let storeData = await sheets.spreadsheets.values.append(googleSheetsOptions);

  console.log(storeData);

  browser.close();
}

scrapper();
