// Haqiqiy ma'lumotni yuklaydi:
//  - NASA GISTEMP (harorat), NOAA Mauna Loa (CO2), NOAA LSA sun'iy yo'ldosh altimetriyasi (dengiz sathi)
// Ishga tushirish: npm run fetch-data
// Biror manba ochilmasa, uning eski fayli o'zgarmaydi, qolganlari yangilanadi.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const out = (name, source, unit, data) =>
  writeFileSync(new URL(`../src/data/${name}.json`, import.meta.url), JSON.stringify({ source, unit, data }))

const UA = 'Mozilla/5.0 (earthflow data fetch)' // ba'zi saytlar User-Agent'siz so'rovni rad etadi
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Avval fetch, bo'lmasa curl (ba'zi tarmoqlarda Node ulana olmaydi, curl esa ulanadi). 3 marta urinadi.
const getOnce = async (url) => {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) })
    if (!r.ok) throw new Error(`${url} -> ${r.status}`)
    return await r.text()
  } catch {
    return execFileSync('curl', ['-sSfL', '--max-time', '60', '-A', UA, url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })
  }
}
const get = async (url) => {
  let err
  for (let i = 0; i < 3; i++) {
    try { return await getOnce(url) } catch (e) { err = e; await sleep(3000 * (i + 1)) }
  }
  throw err
}

const jobs = {
  // Harorat anomaliyasi (J-D = yillik o'rtacha; tugallanmagan yilda "***" bo'ladi)
  async temperature() {
    const data = []
    for (const line of (await get('https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv')).split('\n')) {
      const c = line.split(',')
      const year = parseInt(c[0], 10), v = parseFloat(c[13])
      if (year >= 1880 && !Number.isNaN(v)) data.push({ year, value: v })
    }
    out('temperature', 'NASA GISTEMP v4', '°C', data)
    return data
  },

  // CO2 (Mauna Loa yillik o'rtacha)
  async co2() {
    const data = []
    for (const line of (await get('https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_annmean_mlo.txt')).split('\n')) {
      if (line.startsWith('#') || !line.trim()) continue
      const [y, m] = line.trim().split(/\s+/).map(Number)
      if (y && m) data.push({ year: y, value: m })
    }
    out('co2', 'NOAA GML Mauna Loa', 'ppm', data)
    return data
  },

  // Dengiz sathi (mm): ustunlar sun'iy yo'ldoshlar, har qatorda bittasi to'ldirilgan.
  // Yillik o'rtacha olib, 1993 yilga nisbatan hisoblaymiz. Tugallanmagan yillar tashlanadi.
  async sealevel() {
    const sums = new Map()
    for (const line of (await get('https://www.star.nesdis.noaa.gov/socd/lsa/SeaLevelRise/slr/slr_sla_gbl_free_all_66.csv')).split('\n')) {
      if (line.startsWith('#') || line.startsWith('year') || !line.trim()) continue
      const [t, ...vals] = line.split(',')
      const vs = vals.map(parseFloat).filter((n) => !Number.isNaN(n))
      if (!vs.length) continue
      const year = Math.floor(parseFloat(t))
      const s = sums.get(year) || { sum: 0, n: 0 }
      s.sum += vs.reduce((a, b) => a + b, 0) / vs.length
      s.n += 1
      sums.set(year, s)
    }
    const annual = [...sums].filter(([y, s]) => y >= 1993 && s.n >= 30).map(([year, s]) => ({ year, mean: s.sum / s.n }))
    const ref = annual.find((a) => a.year === 1993).mean
    const data = annual.map((a) => ({ year: a.year, value: Math.round((a.mean - ref) * 10) / 10 }))
    out('sealevel', 'NOAA Laboratory for Satellite Altimetry', 'mm', data)
    return data
  },
}

let failed = 0
for (const [name, job] of Object.entries(jobs)) {
  try {
    const d = await job()
    console.log(`OK    ${name}: ${d.length} yil (${d[0].year}–${d.at(-1).year})`)
  } catch (e) {
    failed++
    console.log(`XATO  ${name}: yuklab bo'lmadi, eski fayl qoldi (${String(e.message).split('\n')[0]})`)
  }
}
process.exit(failed ? 1 : 0)
