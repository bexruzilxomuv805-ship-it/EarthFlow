import { useEffect, useState } from 'react'
import { DATASETS } from '../data/datasets'
import { useSonify } from '../hooks/useSonify'
import Jukebox from '../components/Jukebox'
import Shell from './Shell'

// Ulashilgan havola: /jukebox?d=co2&y=1999
const shared = new URLSearchParams(window.location.search)
const initialDs = DATASETS.some((d) => d.id === shared.get('d')) ? shared.get('d') : 'temperature'
const initialYear = Number(shared.get('y'))

export default function JukeboxPage() {
  const [dsId, setDsId] = useState(initialDs)
  const [speed, setSpeed] = useState(140)
  const ds = DATASETS.find((d) => d.id === dsId)
  const { data, source, unit } = ds.json
  const { playing, index, play, stop, seek } = useSonify(data, speed, ds.wave)

  useEffect(() => {
    const i = data.findIndex((p) => p.year === initialYear)
    if (i >= 0) seek(i)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Shell>
      <Jukebox datasets={DATASETS} active={dsId} onSelect={setDsId} data={data} unit={unit} source={source} ds={ds}
        index={index} playing={playing} onPlay={play} onStop={stop} onSeek={seek} speed={speed} onSpeed={setSpeed} />
    </Shell>
  )
}
