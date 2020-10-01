import React from 'react'
import moment from 'moment'

import ExecutionContext from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import { timeDelta } from 'modules/common/components/Duration/Duration'
import durationI18n from 'modules/common/components/Duration/Duration.i18n'

import css from './ExecutionStepDetails.module.scss'

const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss a'

export default function ExecutionStepDetailsTab(): React.ReactElement {
  const { pipelineExecutionDetail } = React.useContext(ExecutionContext)

  const delta = timeDelta(
    pipelineExecutionDetail?.pipelineExecution?.startedAt || 0,
    pipelineExecutionDetail?.pipelineExecution?.startedAt || 0
  )

  return (
    <div className={css.detailsTab}>
      <table className={css.detailsTable}>
        <tbody>
          <tr>
            <th>Started at:</th>
            <td>{moment(pipelineExecutionDetail?.pipelineExecution?.startedAt).format(DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>Ended at:</th>
            <td>{moment(pipelineExecutionDetail?.pipelineExecution?.endedAt).format(DATE_FORMAT)}</td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>{durationI18n.humanizeDuration(delta.w, delta.d, delta.h, delta.m, delta.s)}</td>
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
