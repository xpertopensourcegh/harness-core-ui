import React from 'react'
import css from './ExecutionMetadataSection.module.scss'

export interface ExecutionMetadataSectionProps {
  title?: string
  entries: { label?: string; value: JSX.Element }[]
  delimiter?: boolean
}
export default function ExecutionMetadataSection(props: ExecutionMetadataSectionProps): React.ReactElement {
  const { title, entries, delimiter = false } = props

  return (
    <div className={css.main}>
      {title ? (
        <div className={css.entry}>
          <span className={css.title}>{title}</span>
        </div>
      ) : null}
      {entries.map((entry, idx) => (
        <div className={css.entry} key={idx}>
          {entry.label ? <span className={css.label}>{entry.label}</span> : null}
          <span className={css.value}>{entry.value}</span>
        </div>
      ))}
      {delimiter ? <div className={css.delimiter}></div> : null}
    </div>
  )
}
