import React from 'react'
import moment from 'moment'

import type { ExecutionNode } from 'services/cd-ng'
import { DurationI18n, timeDelta } from '@common/exports'

import css from './ExecutionStepDetails.module.scss'

const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss a'

export interface ExecutionStepDetailsTabProps {
  step: ExecutionNode
}

export default function ExecutionStepDetailsTab(props: ExecutionStepDetailsTabProps): React.ReactElement {
  const { step } = props

  const delta = timeDelta(step?.startTs || 0, step?.endTs || 0)

  return (
    <div className={css.detailsTab}>
      <table className={css.detailsTable}>
        <tbody>
          <tr>
            <th>Started at:</th>
            <td>{moment(step?.startTs).format(DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>Ended at:</th>
            <td>{moment(step?.endTs).format(DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>{DurationI18n.humanizeDuration(delta.w, delta.d, delta.h, delta.m, delta.s)}</td>
          </tr>
          <tr>
            <th>Delegate:</th>
            <td>asd</td>
          </tr>
        </tbody>
      </table>
      <div style={{ background: '#00162B', height: '100%', flex: '1 1 0%' }}></div>
    </div>
  )
}
