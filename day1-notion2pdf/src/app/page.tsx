'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('PDF 변환에 실패했습니다.');
      }

      // PDF 다운로드
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'notion-page.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'PDF 변환 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 40 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Notion2PDF</h1>
      <p style={{ fontSize: 20, marginBottom: 32 }}>Notion 페이지를 아름다운 PDF로 변환하세요</p>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600, marginBottom: 32 }}>
        <input
          placeholder="Notion 페이지 URL을 입력하세요"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%', padding: 12, fontSize: 18, marginBottom: 12 }}
        />
        <button
          type="submit"
          style={{ width: '100%', padding: 16, fontSize: 18, background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600 }}
          disabled={loading}
        >
          {loading ? '변환 중...' : 'PDF 변환하기'}
        </button>
      </form>
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>주요 기능</h2>
        <ul style={{ fontSize: 18, listStyle: 'none', padding: 0 }}>
          <li>• 16:9 비율의 깔끔한 PDF 출력</li>
          <li>• 제목, 목록, 표, 이미지 지원</li>
          <li>• 로그인 불필요</li>
          <li>• 빠른 변환 속도</li>
        </ul>
      </div>
    </div>
  );
}
