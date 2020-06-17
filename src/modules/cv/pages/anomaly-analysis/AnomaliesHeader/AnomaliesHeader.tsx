import React, { FunctionComponent } from 'react'
import css from './AnomaliesHeader.module.scss'

interface AnomaliesHeaderProps {
  details: any
}

const AnomaliesHeader: FunctionComponent<any> = (props: AnomaliesHeaderProps) => {
  return (
    <div className={css.main}>
      <div className={css.header}>
        <strong> {props.details.name} </strong>
        FROM: <strong> {props.details.from} </strong>
        TO: <strong> {props.details.to} </strong>
        Overall Risk Score: <strong> {props.details.riskScore} </strong>
      </div>
    </div>
  )
}

export default AnomaliesHeader
