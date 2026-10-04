import temperature from './temperature.json'
import co2 from './co2.json'
import sealevel from './sealevel.json'
import { LuThermometer, LuFactory, LuWaves } from 'react-icons/lu'

// Matnlar (nom, tavsif) src/i18n.js da: ds_<id>_label / _title / _desc
export const DATASETS = [
  { id: 'temperature', Icon: LuThermometer, json: temperature, wave: 'triangle', signed: true, decimals: 2 },
  { id: 'co2', Icon: LuFactory, json: co2, wave: 'sawtooth', signed: false, decimals: 1 },
  { id: 'sealevel', Icon: LuWaves, json: sealevel, wave: 'sine', signed: true, decimals: 1 },
]
