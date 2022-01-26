import axios from "axios";
import { JSDOM } from "jsdom";

// @ts-ignore
async function main() {
  const res = await axios.get(
    "https://en.wikipedia.org/wiki/Opinion_polling_for_the_next_New_Zealand_general_election#Government_approval_rating"
  );

  const {
    window: {
      document: { body },
    },
  } = new JSDOM(res.data);

  const tables = body.querySelectorAll("table");

  tables.forEach((table) => {
    const tableHeadElements = table.querySelectorAll("th");

    let found = false;

    const indices: any = {
      Date: 0,
      "Right direction": 0,
      "Wrong direction": 0,
      "Sample size": 0,
      "Do not know": 0,
    };

    const dataMap = new Map<number, Array<string>>();

    tableHeadElements.forEach((el) => {
      if (el.textContent?.trim() == "Right direction") {
        found = true;
        tableHeadElements.forEach((el, index) => {
          const supElement = el.querySelector("sup");
          if (supElement) el.removeChild(supElement);

          if (indices.hasOwnProperty(el.textContent?.trim())) {
            indices[el.textContent!.trim()] = index;
            dataMap.set(index, []);
          }
        });
      }
    });

    if (!found) return;

    // Found the right table
    // extract the numbers in the right indices
    // and put them accordingly in an array

    const tableBody = table.querySelector("tbody")!;
    const bodyRows = tableBody.querySelectorAll("tr");

    bodyRows.forEach((row) => {
      const tdArray = row.querySelectorAll("td");

      tdArray.forEach((td, index) => {
        const dataArr = dataMap.get(index);

        if (!dataArr) return;

        const boldTag = td.querySelector("b");

        let content = (boldTag ? boldTag.textContent : td.textContent) || "";

        dataArr.push(content.trim());
      });
    });

    console.table(indices);
    console.table(dataMap);
  });
}

// main();

interface IIndices extends Object {
  "Date(s)conducted": number;
  Approve: number;
  Disapprove: number;
  "Sample size": number;
}

async function main2() {
  const res = await axios.get(
    "https://en.wikipedia.org/wiki/Opinion_polling_for_the_next_Polish_parliamentary_election#President_Andrzej_Duda"
  );

  const {
    window: {
      document: { body },
    },
  } = new JSDOM(res.data);

  const tables = body.querySelectorAll("table");

  tables.forEach((table) => {
    const tableHeadElements = table.querySelectorAll("th");

    let found = false;

    const indices: IIndices = {
      "Date(s)conducted": 0,
      Approve: 0,
      Disapprove: 0,
      "Sample size": 0,
    };

    const dataMap = new Map<number, Array<string>>();

    if (tableHeadElements) {
      tableHeadElements.forEach((el) => {
        if (el.textContent?.trim() == "Approve") {
          found = true;
          tableHeadElements.forEach((el, index) => {
            // refractor this code to remove any child instead of hardcoded child
            const supElement = el.querySelector("sup");
            if (supElement) el.removeChild(supElement);

            const spanElement = el.querySelector("span");
            if (spanElement) el.removeChild(spanElement);

            const brElement = el.querySelector("br");

            try {
              if (brElement) el.removeChild(brElement);
            } catch {}

            if (indices.hasOwnProperty(el.textContent?.trim()!)) {
              // @ts-ignore

              indices[el.textContent!.trim()] = index;
              dataMap.set(index, []);
            }
          });
        }
      });
    } else {
    }

    if (!found) return;

    // Found the right table
    // extract the numbers in the right indices
    // and put them accordingly in an array

    const tableBody = table.querySelector("tbody")!;
    const bodyRows = tableBody.querySelectorAll("tr");

    bodyRows.forEach((row) => {
      const tdArray = row.querySelectorAll("td");

      tdArray.forEach((td, index) => {
        const dataArr = dataMap.get(index);

        if (!dataArr) return;

        const boldTag = td.querySelector("b");

        let content = (boldTag ? boldTag.textContent : td.textContent) || "";

        dataArr.push(content.trim());
      });
    });

    console.table(indices);
    console.table(dataMap);
  });
}

main2();
