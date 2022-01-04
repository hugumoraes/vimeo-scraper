import puppeteer from 'puppeteer';

import { links } from './links';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    product: 'firefox',
    defaultViewport: null,
  });

  const page = await browser.newPage();

  for (const link of links) {
    await page.goto(link);
    await page.waitForSelector('#stage_footer > div > div > button');
    await page.waitForSelector('.review_feature_modal', {
      timeout: 5000,
    });

    await page.evaluate(() => {
      const banner = document.querySelector('.review_feature_modal');
      banner?.parentNode?.removeChild(banner);
    });

    const t = await page.$('#stage_footer > div > div > button');
    if (t)
      await t.click({
        button: 'left',
        delay: 200,
      });

    await page.waitForTimeout(1000);

    const [v] = await page.$x("//p[contains(.,'HD 1080p')]/ancestor::a");
    if (v) v.click();

    await page.waitForTimeout(2000);
  }
};

main();
