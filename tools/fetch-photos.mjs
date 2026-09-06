// 依 tools/photos.manifest.json 重新下載並產生 public/photos/*.webp
//
//   npm i --no-save sharp
//   node tools/fetch-photos.mjs
//
// 每個 key 產生兩個尺寸（640w / 1280w），統一裁成 3:2。
// 來源是 Wikimedia Commons 的縮圖網址；他們只接受特定幾個寬度，
// 所以 manifest 裡的 download 網址不要自己改寬度。
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/photos');
const UA = 'kaohsiung-2d1n/1.0 (https://github.com/BlancoChiuTW/kaohsiung-2d1n)';
const WIDTHS = [640, 1280];

const { default: sharp } = await import('sharp').catch(() => {
  console.error('需要 sharp：npm i --no-save sharp');
  process.exit(1);
});

const manifest = JSON.parse(
  await fs.readFile(path.join(ROOT, 'tools/photos.manifest.json'), 'utf8'),
);
await fs.mkdir(OUT, { recursive: true });

for (const [key, entry] of Object.entries(manifest)) {
  const res = await fetch(entry.download, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    console.error(`${key}: HTTP ${res.status} ${entry.download}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  for (const w of WIDTHS) {
    await sharp(buf)
      .resize(w, Math.round((w * 2) / 3), { fit: 'cover', position: 'attention' })
      .webp({ quality: w === 640 ? 74 : 70, effort: 6 })
      .toFile(path.join(OUT, `${key}-${w}.webp`));
  }
  console.log(`${key}: ok`);
  await new Promise((r) => setTimeout(r, 150));
}
console.log('done');
