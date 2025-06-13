import puppeteer from 'puppeteer';

export async function notionPageToPDF({ notionUrl, outputPath }: { notionUrl: string, outputPath: string }) {
  try {
    console.log('[notion2pdf] PDF 변환 시작:', notionUrl, outputPath);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(notionUrl, { waitUntil: 'networkidle2' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: false,
    });
    await browser.close();
    console.log('[notion2pdf] PDF 파일 생성 성공:', outputPath);
    return true;
  } catch (err) {
    console.error('[notion2pdf] 전체 변환 실패:', err);
    throw err;
  }
}

// ESM 환경에서 직접 실행 시 notionPageToPDF 함수 호출
if (import.meta.url === `file://${process.argv[1]}`) {
  const notionUrl = process.argv[2];
  const outputPath = process.argv[3] || 'notion-page.pdf';
  if (!notionUrl) {
    console.error('Usage: node notion2pdf.ts <notion_url> [output.pdf]');
    process.exit(1);
  }
  notionPageToPDF({ notionUrl, outputPath }).then(() => {
    console.log('PDF 변환 완료:', outputPath);
  }).catch(err => {
    console.error('PDF 변환 실패:', err);
    process.exit(1);
  });
} 