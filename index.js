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

  const youtubeIds = hrefs.map(extractYoutubeId);

  // console.info(youtubeIds);

  const youtubeIdsFirst50 = youtubeIds.slice(0, 50);

  console.info(
    "https://www.youtube.com/watch_videos?video_ids=" + youtubeIdsFirst50.join(",")
  );

  await browser.close();
}

function extractYoutubeId(url) {
  const watch = "watch?v=";
  const i1 = url.indexOf(watch);
  if (i1 > 0) {
    return url.substr(i1 + watch.length, 11);
  }
  const youtube = "youtu.be/";
  const i2 = url.indexOf(youtube);
  if (i2 > 0) {
    return url.substr(i2 + youtube.length, 11);
  }
  throw "Unable to extract yt ID";
}
