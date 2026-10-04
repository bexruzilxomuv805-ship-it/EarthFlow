import { Area, AreaChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePrefs } from '../prefs'

const PALETTE = {
  dark: { line: '#5ad1ff', tick: '#9fb3d9', tipBg: '#0d1536', tipLine: '#2a3a7a', tipText: '#e8eefc', mark: '#ffb454', dot: '#fff' },
  light: { line: '#0b86c4', tick: '#51638a', tipBg: '#ffffff', tipLine: '#c5d3ee', tipText: '#14213d', mark: '#e07b00', dot: '#fff' },
}

export default function Chart({ data, index, unit, label }) {
  const { theme, t } = usePrefs()
  const c = PALETTE[theme]
  const cur = data[index]
  return (
    <div className="chart" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.line} stopOpacity={0.45} />
              <stop offset="100%" stopColor={c.line} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fill: c.tick, fontSize: 12 }} minTickGap={36} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: c.tick, fontSize: 12 }} width={44} axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} />
          <Tooltip
            contentStyle={{ background: c.tipBg, border: `1px solid ${c.tipLine}`, borderRadius: 12, color: c.tipText }}
            formatter={(v) => [`${v} ${unit}`, '']} labelFormatter={(y) => t('yearSuffix', { y })} separator="" />
          <Area type="monotone" dataKey="value" stroke={c.line} strokeWidth={2.5} fill="url(#fill)" isAnimationActive={false} />
          {cur && <ReferenceLine x={cur.year} stroke={c.mark} strokeDasharray="4 4" />}
          {cur && <ReferenceDot x={cur.year} y={cur.value} r={7} fill={c.mark} stroke={c.dot} strokeWidth={2} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
