export default function SectionHead({ id, tag, title, lead }) {
  return (
    <div className="sec-head">
      <span className="pixel tag">{tag}</span>
      <h2 id={id}>{title}</h2>
      {lead && <p className="muted">{lead}</p>}
    </div>
  )
}
