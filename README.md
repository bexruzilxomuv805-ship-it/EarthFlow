# EarthFlow (NASA Space Apps)

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

## Joylashtirish (GitHub + Vercel)
1. Kodni GitHub'ga yuklang (`main` tarmog'i).
2. vercel.com da "Add New → Project" bosib shu repozitoriyni tanlang. Sozlamalar o'zi aniqlanadi (Framework: Vite, Build: `npm run build`, Output: `dist`). Maxsus muhit o'zgaruvchilari kerak emas.
3. Sayt HTTPS manzilga chiqqach, `index.html` dagi `og:image` va `twitter:image` ni to'liq manzilga almashtiring (masalan, `https://sizning-sayt.vercel.app/EARTH_RASMLAR/tungi-yer.jpg`), shunda Telegram va boshqalarda ulashish kartasi chiqadi.
4. Telefonda "ilova sifatida o'rnatish" faqat HTTPS orqali ishlaydi.

## Ma'lumot manbalari
- Harorat: NASA GISS GISTEMP. CO₂: NOAA GML (Mauna Loa). Dengiz sathi: NOAA Laboratory for Satellite Altimetry.
- Ob-havo (O'zbekiston viloyatlari): Open-Meteo.com, brauzerda jonli olinadi.
- Asl tekstura rasmlari `assets-originals/` papkasida saqlangan (sayt siqilgan nusxalarini ishlatadi).
