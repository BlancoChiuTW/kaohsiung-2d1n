# 高雄兩天一夜｜海線 × 港區

一份給「一個人、不騎車、喜歡拍照、主要想散心」的高雄兩天一夜攻略網頁。
第一天走海線（旗津、西子灣、燈塔夕陽），第二天走港區（駁二、大港橋、亞灣）。

行動優先，字級與行距照 iOS 26 的 type ramp 排，在 iPhone 上讀起來像一篇攻略網誌。
配色刻意收成近單色的中性系統，顏色全部交給照片。

## 這份行程的設計原則

- **不騎車**：全程捷運、輕軌、渡輪、走路，只有上壽山和拉行李用 Uber。
- **不排滿**：每天只留必要的主線，中間刻意留白。頁面上的「行程密度」開關可以把彈性與加碼收起來，只看一定會做的事。
- **加碼另外放**：18 個可去可不去的點獨立成一個選項池，依出片、夜景、吃、避雨避暑、海邊分類，勾選狀態存在瀏覽器的 `localStorage`。
- **有備案**：下雨、太熱、太累各有一套替代版本。
- **每個點都有照片**：點圖會開到 Wikimedia Commons 的原始檔案頁，作者與授權都在那裡。

## 照片

30 張照片全部來自 Wikimedia Commons，已下載處理成 webp 放在 `public/photos/`，
不 hotlink 別人的 CDN。清單與授權見 [PHOTO-CREDITS.md](PHOTO-CREDITS.md)。

換圖流程：改 `tools/photos.manifest.json` 的 `download` 與 `source`，然後

```bash
npm i --no-save sharp
node tools/fetch-photos.mjs
```

會重新產生 `<key>-640.webp` 與 `<key>-1280.webp`。之後把新的 credit 更新回
`src/data/photos.js`（該檔開頭有說明）。

## 開發

```bash
npm install
npm run dev      # 本機開發
npm run build    # 產出 dist/
npm run preview  # 預覽 build 結果
npm run lint
```

## 部署

推上 `main` 之後由 `.github/workflows/deploy.yml` 自動 build 並發佈到 GitHub Pages。
`vite.config.js` 的 `base` 設成 `'./'`，所以放在 `/<repo>/` 子路徑底下也不會壞。

## 改內容

所有文字集中在 `src/data/trip.js`：

| 匯出 | 內容 |
|---|---|
| `meta` | 標題、前提、錨點時間 |
| `days` | 兩天的時間軸，每筆有 `kind`（`core` / `flex` / `bonus`）與 `star` |
| `options` | 加碼選項池 |
| `categories` | 加碼分類 |
| `beforeYouGo` | 出發前要確認的時效性資訊 |
| `transit` / `budget` | 交通與花費小抄 |
| `photo`（欄位） | 對應 `src/data/photos.js` 的 key，決定該項顯示哪張圖 |
| `planB` / `goldenHours` | 備案與拍照時間表 |

改完存檔就好，元件會自動吃新的資料。

## 注意

營業時間、船班、開合秀場次、公休日都會變動，頁面裡的「出發前先確認這幾件事」列的就是這些。實際出發前請以官方公告為準。
