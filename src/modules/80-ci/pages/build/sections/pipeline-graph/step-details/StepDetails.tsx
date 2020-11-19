import React from 'react'
import moment from 'moment'
import type { GraphVertex } from 'services/ci'
import { formatElapsedTime } from '@ci/components/common/time'
import i18n from './StepDetail.i18n'
import css from '../BuildPipelineGraph.module.scss'

export interface StepDetailsProps {
  step: GraphVertex | undefined
}

const StepDetails: React.FC<StepDetailsProps> = props => {
  const { step } = props

  return (
    <table className={css.stepDetailsTable}>
      <tr>
        <td>{i18n.startedAt}</td>
        <td>{step?.startTs ? moment(step?.startTs).format('M/D/YYYY h:mm:ss a') : '-'}</td>
      </tr>
      <tr>
        <td>{i18n.endedAt}</td>
        <td>{step?.endTs ? moment(step?.endTs).format('M/D/YYYY h:mm:ss a') : '-'}</td>
      </tr>
      <tr>
        <td>{i18n.duration}</td>
        <td>
          {step?.startTs && step?.endTs ? formatElapsedTime(step?.endTs / 1000 - step?.startTs / 1000, true) : '-'}
        </td>
      </tr>
    </table>
  )
}

export default StepDetails
