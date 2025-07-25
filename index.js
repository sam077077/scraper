const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.goto("https://www.binance.com/en/earn/flexible", {
    waitUntil: "networkidle2",
    timeout: 60000
  });

  try {
    await page.click('button[aria-label="Accept all cookies"]');
    await page.waitForTimeout(1000);
  } catch (err) {}

  await page.waitForSelector('[class*="css-1x7xxfd"]', { timeout: 20000 });

  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll('[class*="css-1x7xxfd"]');
    return Array.from(rows).map(row => {
      const asset = row.querySelector("div[class*='css-1ap5wc6']")?.innerText || "N/A";
      const apr = row.querySelector("div[class*='css-1l2j9j6']")?.innerText || "N/A";
      const status = row.querySelector("div[class*='css-5jvkad']")?.innerText || "Available";
      return { asset, apr, status };
    });
  });

  console.log("📊 Binance Earn Products:");
  console.table(data);

  await browser.close();
})();
