# 高雄兩天一夜｜海線 × 港區

一份給「一個人、不騎車、喜歡拍照、主要想散心」的高雄兩天一夜攻略網頁。
**兩種走法可以切換**：`港 → 駁二`（夕陽收在旗後燈塔）或 `駁二 → 港`（整個白天給旗津）。
兩條不是單純對調 —— 港線的重點是燈塔夕陽，放在 Day 2 就趕不上高鐵，所以第二種走法把夕陽改收在高流與光榮碼頭。

行動優先，字級與行距照 iOS 26 的 type ramp 排，在 iPhone 上讀起來像一篇攻略網誌。
配色刻意收成近單色的中性系統，顏色全部交給照片。

## 這份行程的設計原則

- **不騎車**：全程捷運、輕軌、渡輪、走路，只有上壽山和拉行李用 Uber。
- **不排滿**：每天只留必要的主線，中間刻意留白。時間軸只有「主線」和「彈性」兩級，「行程密度」開關可以只看主線。
- **其他地方另外放**：15 個沒排進行程的點依港這一側 / 市區 / 晚上 / 下雨天分批，勾選狀態存在瀏覽器的 `localStorage`。
- **有備案**：下雨、太熱、太累各有一套替代版本。
- **吃的獨立成一段**：19 家咖啡廳與餐廳，依兩條路線分開，點店名開 Google 地圖。
- **不寫價錢**：刻意不列預算與門票金額，避免資訊過期誤導。
- **每個點都有照片**：點圖會開到 Wikimedia Commons 的原始檔案頁，作者與授權都在那裡。

## 照片

47 張照片來自 Wikimedia Commons 與 Openverse（主要是 Flickr 的 CC 授權照），
**一律排除 ND（禁止改作）授權**，因為顯示時會裁切成統一比例。
已下載處理成 webp 放在 `public/photos/`，不 hotlink 別人的 CDN。

部分餐廳找不到合法授權的實景照，改用所在建築或街區的照片，網頁上會標「街區照」加地點，不會讓人誤以為是店內。
清單與授權見 [PHOTO-CREDITS.md](PHOTO-CREDITS.md)。

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
| `routes` | 兩種走法，各含兩天的時間軸 |
| `placeGroups` | 其他可以去的地方，依區域分批 |
| `beforeYouGo` | 出發前要確認的時效性資訊 |
| `eats` | 咖啡廳與餐廳，依路線分組 |
| `transit` | 交通小抄 |
| `photo`（欄位） | 對應 `src/data/photos.js` 的 key，決定該項顯示哪張圖 |
| `planB` / `goldenHours` | 備案與拍照時間表 |

改完存檔就好，元件會自動吃新的資料。

## 注意

營業時間、船班、開合秀場次、公休日都會變動，頁面裡的「出發前先確認這幾件事」列的就是這些。實際出發前請以官方公告為準。
