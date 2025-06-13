import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Notion pageId 추출
    const pageIdMatch = url.match(/[a-f0-9]{32}/);
    if (!pageIdMatch) {
      return NextResponse.json({ error: 'Invalid Notion URL' }, { status: 400 });
    }
    const pageId = pageIdMatch[0];

    // 임시 PDF 파일 경로 생성
    const outputPath = path.join('/tmp', `notion2pdf_${randomUUID()}.pdf`);

    // child_process로 notion2pdf.ts 실행 (stdout, stderr 수집)
    await new Promise((resolve, reject) => {
      const child = spawn('npx', ['ts-node', 'src/server/notion2pdf.ts', pageId, outputPath]);
      child.stdout.on('data', (data) => {
        console.log('[notion2pdf:stdout]', data.toString());
      });
      child.stderr.on('data', (data) => {
        console.error('[notion2pdf:stderr]', data.toString());
      });
      child.on('exit', (code) => {
        if (code === 0) resolve(true);
        else reject(new Error('PDF 변환 실패'));
      });
      child.on('error', reject);
    });

    // PDF 파일 읽어서 반환
    const pdfBuffer = await fs.readFile(outputPath);
    await fs.unlink(outputPath); // 임시 파일 삭제

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="notion-page.pdf"',
      },
    });
  } catch (error) {
    console.error('Error converting to PDF:', error);
    return NextResponse.json({ error: 'Failed to convert to PDF' }, { status: 500 });
  }
} 