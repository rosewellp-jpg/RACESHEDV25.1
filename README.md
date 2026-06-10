# RaceShed Fantasy V25

Clean rebuild generated from your Excel workbook.

## Start locally

```bash
npm install
npm run dev
```

Open the Local URL.

## Deploy

Push this folder to GitHub, then import it into Vercel.

- Framework: Vite
- Build command: npm run build
- Output directory: dist

## Weekly update

Open `src/data.js`.

Update:
- schedule dates / race info
- weeklyPicks
- raceSummary
- standings
- trackDetails videoEmbedUrl

To add a YouTube/NASCAR preview video, use the YouTube embed link format:

```js
videoEmbedUrl: "https://www.youtube.com/embed/VIDEO_ID"
```

If no video is supplied, the app automatically shows the animated RaceShed track preview.
