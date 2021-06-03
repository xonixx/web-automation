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
  console.info("Total: " + youtubeIds.length);

  let i,
    j,
    chunkSize = 50;

  const resYtPlaylists = [];

  for (i = 0, j = youtubeIds.length; i < j; i += chunkSize) {
    const chunk = youtubeIds.slice(i, i + chunkSize);
    const tmpPlaylistUrl =
      "https://www.youtube.com/watch_videos?video_ids=" + chunk.join(",");

    // console.info(tmpPlaylistUrl);

    await page.goto(tmpPlaylistUrl);

    const shortYoutubePlaylistUrl = page.url();
    resYtPlaylists.push([chunk.length, shortYoutubePlaylistUrl]);

    console.info(chunk.length + " : " + shortYoutubePlaylistUrl);
  }

  console.info("As YT Music:");
  for (const [chunkLen, shortYoutubePlaylistUrl] of resYtPlaylists) {
    console.info(chunkLen + " : " + shortYoutubePlaylistUrl.replace("www.", "music."));
  }

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
