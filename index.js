const puppeteer = require("puppeteer");

const HEADLESS = false;

(async () => {
  const url = process.env.URL;
  if (!url) throw "Set URL!";
  await getYoutubeLinksOnPage(url);
})();

async function getYoutubeLinksOnPage(url) {
  const browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();
  await page.goto(url);

  const hrefs = await page.$$eval("a[href*=youtu]", (aa) =>
    aa.map((a) => a.getAttribute("href"))
  );

  console.info(hrefs)

  await browser.close();
}
