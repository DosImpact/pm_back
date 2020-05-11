import pt from "puppeteer";

/**
 * 주소들을 입력
 * html 설렉터를 입력
 *  > 결과 obj 반환
 */

export default async ({ urls, commonTag }) => {
  console.time("nmoive.js");
  console.log("start nmoive.js...");
  const result = new Array(urls.length);
  const brs = await pt.launch({ headless: false, args: ["--no-sandbox"] });

  await Promise.all(
    urls.map(async (e, idx) => {
      const page = await brs.newPage();
      await page.goto(e);
      try {
        const text = await page.evaluate(
          ({ commonTag }) => {
            const score = document.querySelector(commonTag);
            if (score) {
              return score.textContent;
            }
          },
          { commonTag }
        );
        result[idx] = text.trim();
      } catch (error) {
        console.error(error);
      } finally {
        await page.close();
      }
    })
  );
  console.log(result);
  console.log("Finished nmoive.js");
  await brs.close();
  console.timeEnd("nmoive.js");
  return 0;
};
