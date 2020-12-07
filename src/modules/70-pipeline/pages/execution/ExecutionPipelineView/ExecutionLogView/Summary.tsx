import React, { ReactElement } from 'react'
import css from './LogsHeader.module.scss'

interface SummaryProps {
  summaryElement?: ReactElement
}

const Summary = (props: SummaryProps) => {
  const { summaryElement } = props

  if (summaryElement) {
    return <div className={css.summaryElement}>summaryElement</div>
  }

  return <div className={css.summaryElement}>Summary</div>
}

export default Summary
