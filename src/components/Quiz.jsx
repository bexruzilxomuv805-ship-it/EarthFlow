import { useEffect, useRef, useState } from 'react'
import { LuCircleCheck, LuCircleX, LuRefreshCw, LuShare2, LuCheck, LuTrophy } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

// To'g'ri javob: har bir savolning q<n>_o<k> variantlaridan k (1 dan boshlab)
const ANSWERS = [3, 3, 3, 2, 2, 4, 2, 4]
const TOTAL = ANSWERS.length
const BEST_KEY = 'quiz-best'

const readBest = () => { try { const v = Number(localStorage.getItem(BEST_KEY)); return Number.isFinite(v) ? v : 0 } catch { return 0 } }
const writeBest = (v) => { try { localStorage.setItem(BEST_KEY, String(v)) } catch { /* ok */ } }

// Har o'yinda variantlar tartibi aralashtiriladi
const shuffled = () => Array.from({ length: TOTAL }, () => {
  const a = [1, 2, 3, 4]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
})

const rankOf = (s) => (s === TOTAL ? 4 : s >= 6 ? 3 : s >= 4 ? 2 : 1)

export default function Quiz() {
  const { t } = usePrefs()
  const [orders, setOrders] = useState(shuffled)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null) // tanlangan variant raqami (1..4)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState(readBest)
  const [copied, setCopied] = useState(false)
  const nextRef = useRef(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { if (picked !== null) nextRef.current?.focus({ preventScroll: true }) }, [picked])

  const n = i + 1
  const answer = ANSWERS[i]
  const answered = picked !== null

  const choose = (k) => {
    if (answered) return
    setPicked(k)
    if (k === answer) setScore((s) => s + 1)
  }
  const next = () => {
    if (i + 1 < TOTAL) { setI(i + 1); setPicked(null); return }
    if (score > best) { setBest(score); writeBest(score) }
    setDone(true)
  }
  const restart = () => { setOrders(shuffled()); setI(0); setPicked(null); setScore(0); setDone(false) }

  const share = async () => {
    const text = t('quizShareText', { n: score, total: TOTAL })
    const url = window.location.origin + window.location.pathname
    if (navigator.share) {
      try { await navigator.share({ title: t('brand'), text, url }); return } catch (e) { if (e?.name === 'AbortError') return }
    }
    try { await navigator.clipboard.writeText(`${text} ${url}`) } catch { window.prompt(t('quizShare'), `${text} ${url}`); return }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section className="section" id="viktorina" aria-labelledby="quiz-title">
      <SectionHead id="quiz-title" tag={t('quizTag')} title={t('quizTitle')} lead={t('quizLead')} />
      <div className="quiz glass">
        {!done ? (
          <>
            <div className="quiz-top">
              <span className="small muted">{t('quizQ', { n, total: TOTAL })}</span>
              <div className="quiz-bar" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={i + (answered ? 1 : 0)}>
                <span style={{ width: `${((i + (answered ? 1 : 0)) / TOTAL) * 100}%` }} />
              </div>
            </div>
            <h3 className="quiz-q">{t(`q${n}_q`)}</h3>
            <div className="quiz-opts" role="group" aria-label={t('quizAnswers')}>
              {orders[i].map((k) => {
                const isRight = k === answer, isPicked = k === picked
                const state = !answered ? '' : isRight ? 'right' : isPicked ? 'wrong' : 'dim'
                return (
                  <button key={k} className={`quiz-opt ${state}`} onClick={() => choose(k)} disabled={answered && !isRight && !isPicked} aria-pressed={isPicked}>
                    <span>{t(`q${n}_o${k}`)}</span>
                    {answered && isRight && <LuCircleCheck aria-hidden="true" />}
                    {answered && isPicked && !isRight && <LuCircleX aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`quiz-expl ${picked === answer ? 'ok' : 'no'}`} role="status">
                <strong>{picked === answer ? t('quizCorrect') : t('quizWrong')}</strong> {t(`q${n}_e`)}
              </div>
            )}
            <div className="quiz-foot">
              <span className="small muted">{best > 0 && t('quizBest', { n: best, total: TOTAL })}</span>
              {answered && <button ref={nextRef} className="btn" onClick={next}>{i + 1 < TOTAL ? t('quizNext') : t('quizFinish')}</button>}
            </div>
          </>
        ) : (
          <div className="quiz-result" role="status">
            <div className="trophy"><LuTrophy aria-hidden="true" /></div>
            <div className="big accent">{t('quizScore', { n: score, total: TOTAL })}</div>
            <h3>{t(`rank${rankOf(score)}`)}</h3>
            <p className="muted">{t(`rank${rankOf(score)}_t`)}</p>
            {best > 0 && <p className="small muted">{t('quizBest', { n: best, total: TOTAL })}</p>}
            <div className="quiz-actions">
              <button className="btn" onClick={restart}><LuRefreshCw aria-hidden="true" /> {t('quizRestart')}</button>
              <button className="btn ghost" onClick={share}>{copied ? <LuCheck aria-hidden="true" /> : <LuShare2 aria-hidden="true" />} {copied ? t('quizCopied') : t('quizShare')}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
