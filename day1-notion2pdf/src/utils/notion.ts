import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getNotionPage(pageId: string) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    return {
      page,
      blocks: blocks.results,
    };
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    throw error;
  }
}

export function extractPageId(url: string): string {
  const regex = /([a-zA-Z0-9]{32})/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid Notion URL');
  }
  
  return match[1];
}

export function convertToHtml(blocks: any[]): string {
  let html = '';
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${block.paragraph.rich_text.map((text: any) => text.plain_text).join('')}</p>`;
        break;
      case 'heading_1':
        html += `<h1>${block.heading_1.rich_text.map((text: any) => text.plain_text).join('')}</h1>`;
        break;
      case 'heading_2':
        html += `<h2>${block.heading_2.rich_text.map((text: any) => text.plain_text).join('')}</h2>`;
        break;
      case 'heading_3':
        html += `<h3>${block.heading_3.rich_text.map((text: any) => text.plain_text).join('')}</h3>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('')}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li>${block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('')}</li>`;
        break;
      case 'image':
        if (block.image.type === 'external') {
          html += `<img src="${block.image.external.url}" alt="Notion image" />`;
        }
        break;
      // Add more block types as needed
    }
  }
  
  return html;
} 