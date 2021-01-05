import React from 'react'
import moment from 'moment'
import { Text } from '@wings-software/uicore'
import type { GraphVertex } from 'services/ci'
import { formatElapsedTime } from '@ci/components/common/time'
import { useStrings } from 'framework/exports'
import css from '../BuildPipelineGraph.module.scss'

export interface StepDetailsProps {
  step: GraphVertex | undefined
}

const StepDetails: React.FC<StepDetailsProps> = props => {
  const { getString } = useStrings()

  const { step } = props

  return (
    <>
      <table className={css.stepDetailsTable}>
        <tr>
          <td>{getString('startedAt')}</td>
          <td>{step?.startTs ? moment(step?.startTs).format('M/D/YYYY h:mm:ss a') : '-'}</td>
        </tr>
        <tr>
          <td>{getString('endedAt')}</td>
          <td>{step?.endTs ? moment(step?.endTs).format('M/D/YYYY h:mm:ss a') : '-'}</td>
        </tr>
        <tr>
          <td>{getString('duration')}</td>
          <td>
            {step?.startTs && step?.endTs ? formatElapsedTime(step?.endTs / 1000 - step?.startTs / 1000, true) : '-'}
          </td>
        </tr>
      </table>
      {step?.stepParameters?.skipCondition && step?.status === 'SKIPPED' && (
        <div className={css.skipped}>
          <Text font={{ weight: 'bold' }} margin={{ bottom: 'small' }}>
            {getString('skipped')}
          </Text>
          {getString('skipCondition')} <br />
          {step?.stepParameters?.skipCondition}
        </div>
      )}
    </>
  )
}

export default StepDetails
