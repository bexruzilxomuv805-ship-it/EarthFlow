# Yer jukeboksi (NASA Space Apps)

React + Vite + three.js (3D Yer) + Tone.js (ovoz) + Recharts (grafik).

## Ishga tushirish
```
npm install
npm run fetch-data   # haqiqiy ma'lumot: NASA GISTEMP (harorat), NOAA (CO2, dengiz sathi)
npm run dev
```
- `npm run fetch-data` har bir manbani alohida yuklaydi. Biri ochilmasa (masalan, server vaqtincha ishlamasa), uning eski fayli qoladi va sahifada "SAMPLE (taxminiy)" yozuvi ko'rinadi. Keyinroq buyruqni qayta ishga tushiring.
- Dengiz sathi: NOAA Laboratory for Satellite Altimetry, 1993 yilga nisbatan (mm). Ma'lumotdan foydalanganda "Altimetry data are provided by NOAA Laboratory for Satellite Altimetry" yozuvi saqlansin (saytning pastki qismida bor).
- Yer teksturalari `public/textures/` ichida (NASA «Blue Marble» to'plami). Topshirishdan oldin tasvirlar manbasi va ruxsatini (attribution) tekshiring.

## Joylashtirish
`npm run build`, so'ng `dist/` ni Vercel/Netlify'ga yuklang.
