import puppeteer from "puppeteer";

async function scrapper() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.pollbludger.net/fed2022/bludgertrack2022/leaders.htm?",
    {
      waitUntil: "domcontentloaded",
    }
  );

  await page.focus(".standard main #fullTable");
  await page.waitForSelector(".google-visualization-table-table");

  const returnData = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      ".google-visualization-table-table tbody tr"
    );

    const data: unknown[] = [];
    rows?.forEach((row, index) => {
      if (index > 3) {
        const cells = row?.querySelectorAll(
          ".google-visualization-table-table tbody tr td"
        );
        if (cells[4].innerHTML !== "&nbsp;") {
          data.push([cells[1].innerHTML, cells[4].innerHTML, cells[5].innerHTML]);
        }
      }
    });

    return data;
  });

  console.log(returnData);

  browser.close();
}

scrapper();
