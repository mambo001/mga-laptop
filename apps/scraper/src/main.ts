import puppeteer, { Page } from 'puppeteer';
import { saveRows } from './sheet';
import { processData } from './data-processor';

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function autoScroll(page: Page, maxScrolls: number) {
  await page.evaluate(async (maxScrolls: number) => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      let scrolls = 0; // scrolls counter
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++; // increment counter

        // stop scrolling if reached the end or the maximum number of scrolls
        if (
          totalHeight >= scrollHeight - window.innerHeight ||
          scrolls >= maxScrolls
        ) {
          clearInterval(timer);
          resolve(0);
        }
      }, 400);
    });
  }, maxScrolls);
}

function sanitizePostsText(postText: string) {
  return postText.split('\n').join(' ');
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  const pagesUrl = ['https://www.facebook.com/janstore.laptops'];

  await page.goto(pagesUrl[0]);
  await page.setViewport({ width: 1080, height: 1024 });
  await page.locator('div[aria-label="Close"]').click();

  await delay(1500);
  autoScroll(page, 500);
  await delay(25000);

  //   await delay(1500);
  //   autoScroll(page, 50);
  //   await delay(4000);

  // Click all see more elements
  // to load all data on each post
  await page.evaluate(() => {
    const seeMoreButtons = Array.from(
      document.querySelectorAll('div[role="button"]')
    ).filter((el) => el.textContent === 'See more');
    if (seeMoreButtons.length === 0) return;

    seeMoreButtons.forEach((button: HTMLButtonElement) => {
      button.click();
    });
  });
  await delay(1500);

  const postCard = await page.$$(
    'div[data-ad-comet-preview="message"][data-ad-preview="message"]'
  );
  const postCardsText = await Promise.all(
    postCard.map(
      async (card) =>
        await card.evaluate((node) => {
          const seeMoreButton: HTMLDivElement =
            node.querySelector('div[role="button"]');
          console.log({ seeMoreButton });
          if (seeMoreButton) {
            seeMoreButton.click();
          }
          return node.innerText;
        })
    )
  );
  await delay(1500);
  //   await page.close();
  const sanitized = postCardsText.map(sanitizePostsText);
  console.log('result[0]: ', sanitized[0].substring(0, 20));
  console.log('result[1]: ', sanitized[1].substring(0, 20));
  const processed = await processData(sanitized);

  if (processed !== 'No data' && processed.length > 0) {
    await saveRows(
      processed.map((detail) => ({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        model: detail.model,
        condition: detail.condition,
        price: detail.price,
        specs: JSON.stringify(detail.specs),
      }))
    );
  }
  console.log({ processed });
  await delay(3000);
  await browser.close();
}

main().then(console.log).catch(console.error);
