/**
 * Gemini Omni Flash（Interactions API）圖片 + prompt → 生成影片
 * ------------------------------------------------------------------
 * 驗證：Vertex service account（.env 的 GOOGLE_APPLICATION_CREDENTIALS + location=global）。
 * 請求：input=[圖片, 文字] + background:true（omni 收到圖片即輸出影片）。
 * seed：用環境變數 SEED 帶入 → 畫面可重現（放在 generation_config.seed）。
 * 影片：在 interaction.steps[].content[] 的 {type:'video'}（base64 data）。
 *
 * 用法：
 *   node testOmniVideo.js <圖片> "<prompt>"
 *   SEED=12345 node testOmniVideo.js <圖片> @prompt.txt
 *
 * ⚠️ 付費（720p / 8秒，約 US$0.81/支）。此模型固定 16:9，不支援自訂比例。
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { GoogleGenAI } from '@google/genai';

const MODEL = process.env.OMNI_MODEL || 'gemini-omni-flash-preview';
const SEED = process.env.SEED ? Number(process.env.SEED) : undefined;

// --- 參數 ---
const imagePath = process.argv[2];
let prompt = process.argv[3];
if (prompt?.startsWith('@')) prompt = readFileSync(prompt.slice(1), 'utf8').trim();

if (!imagePath || !prompt || !existsSync(imagePath)) {
  console.error('用法：node testOmniVideo.js <圖片> "<prompt>"（prompt 可用 @檔名）');
  process.exit(1);
}

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};
const mimeType = MIME[extname(imagePath).toLowerCase()] || 'image/jpeg';
const imageData = readFileSync(imagePath).toString('base64');

// --- 驗證（Vertex service account，讀 GOOGLE_APPLICATION_CREDENTIALS）---
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: 'global',
});

console.log(`模型：${MODEL}（Vertex）　seed：${SEED ?? '隨機'}`);
console.log(`圖片：${imagePath}\n送出中（需數十秒~數分鐘）…`);

// --- 送出並輪詢 ---
let interaction = await ai.interactions.create({
  model: MODEL,
  input: [
    { type: 'image', data: imageData, mime_type: mimeType },
    { type: 'text', text: prompt },
  ],
  background: true,
  ...(SEED !== undefined && { generation_config: { seed: SEED } }),
});

while (interaction.status === 'in_progress' || interaction.status === 'requires_action') {
  await new Promise((r) => setTimeout(r, 10000));
  interaction = await ai.interactions.get(interaction.id);
  console.log(`  …${interaction.status}`);
}

if (interaction.status !== 'completed') {
  const redact = (k, v) => (typeof v === 'string' && v.length > 120 ? `<${v.length} chars>` : v);
  console.error(`\n失敗：status=${interaction.status}`);
  console.error(JSON.stringify(interaction, redact, 2));
  process.exit(1);
}

// --- 取出影片（在 steps[].content[]）並存檔 ---
const videos = (interaction.steps ?? [])
  .flatMap((s) => s.content ?? [])
  .filter((c) => c?.type === 'video' && (c.data || c.uri));

if (!videos.length) {
  console.error('完成但找不到影片內容。');
  process.exit(1);
}

mkdirSync('output', { recursive: true });
videos.forEach((v, i) => {
  if (v.data) {
    const out = join('output', `omni-${interaction.id.slice(0, 12)}-${i}.mp4`);
    writeFileSync(out, Buffer.from(v.data, 'base64'));
    console.log(`\n✅ 已存檔：${out}`);
  } else {
    console.log(`\n✅ 影片 URI：${v.uri}`);
  }
});
