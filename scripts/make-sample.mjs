// Namunaviy (taxminiy) ma'lumot. Haqiqiy NASA/NOAA ma'lumoti uchun: npm run fetch-data
import { writeFileSync } from 'node:fs'
const interp = (anchors, y0, y1, noiseAmp, dec) => {
  const out = []
  for (let y = y0; y <= y1; y++) {
    let i = anchors.findIndex(([ay]) => ay >= y); if (i <= 0) i = 1
    const [a, va] = anchors[i - 1], [b, vb] = anchors[i]
    const v = va + ((vb - va) * (y - a)) / (b - a) + Math.sin(y * 12.9898) * noiseAmp
    out.push({ year: y, value: +v.toFixed(dec) })
  }
  return out
}
const write = (name, source, unit, data) =>
  writeFileSync(new URL(`../src/data/${name}.json`, import.meta.url), JSON.stringify({ source, unit, data }))
write('temperature', 'SAMPLE (taxminiy)', '°C', interp([[1880,-0.17],[1900,-0.08],[1910,-0.4],[1940,0.1],[1950,-0.05],[1976,-0.1],[1990,0.45],[2000,0.4],[2010,0.72],[2016,1.01],[2023,1.17],[2025,1.2]], 1880, 2025, 0.06, 2))
write('co2', 'SAMPLE (taxminiy)', 'ppm', interp([[1959,316],[1970,326],[1980,338.8],[1990,354],[2000,369.6],[2010,389.9],[2020,414.2],[2025,424]], 1959, 2025, 0.3, 1))
write('sealevel', 'SAMPLE (taxminiy)', 'mm', interp([[1993,0],[2000,20],[2010,55],[2020,95],[2025,112]], 1993, 2025, 1.2, 1))
console.log('Namunaviy ma\'lumotlar yozildi')
