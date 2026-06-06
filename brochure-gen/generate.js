const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const filePath = path.join(__dirname, 'brochure.html');
    
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: path.join(__dirname, 'KnockKnockTech_Brochure.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    console.log('PDF generated successfully!');
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
})();
