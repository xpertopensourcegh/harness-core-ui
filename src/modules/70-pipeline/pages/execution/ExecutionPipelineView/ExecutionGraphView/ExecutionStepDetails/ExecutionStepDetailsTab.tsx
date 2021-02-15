import React from 'react'
import moment from 'moment'
import { useHistory, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { timeToDisplayText } from '@wings-software/uicore'
import type { ExecutionNode } from 'services/cd-ng'
import { String, useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import type { ExecutionPathParams } from '@pipeline/utils/executionUtils'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { LogsContent } from '@pipeline/components/LogsContent/LogsContent'
import LogsContentOld from '../../ExecutionLogView/LogsContent'
import css from './ExecutionStepDetails.module.scss'

const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss a'

export interface ExecutionStepDetailsTabProps {
  step: ExecutionNode
}

export default function ExecutionStepDetailsTab(props: ExecutionStepDetailsTabProps): React.ReactElement {
  const { step } = props

  const { orgIdentifier, executionIdentifier, pipelineIdentifier, projectIdentifier, accountId, module } = useParams<
    PipelineType<ExecutionPathParams>
  >()

  const { getString } = useStrings()
  const history = useHistory()
  const logUrl = routes.toExecutionPipelineView({
    orgIdentifier,
    executionIdentifier,
    pipelineIdentifier,
    projectIdentifier,
    accountId,
    module
  })

  const redirectToLogView = (): void => {
    history.push(`${logUrl}?view=log`)
  }

  return (
    <div className={css.detailsTab}>
      {step?.failureInfo && !isEmpty(step.failureInfo) ? (
        <div className={css.errorMsg}>
          <String className={css.title} stringID="errorSummaryText" tagName="div" />
          <p>{step?.failureInfo?.errorMessage}</p>
        </div>
      ) : null}
      <table className={css.detailsTable}>
        <tbody>
          <tr>
            <th>Started at:</th>
            <td>{step?.startTs ? moment(step?.startTs).format(DATE_FORMAT) : '-'}</td>
          </tr>
          <tr>
            <th>Ended at:</th>
            <td>{step?.endTs ? moment(step?.endTs).format(DATE_FORMAT) : '-'}</td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>{step?.startTs && step?.endTs ? timeToDisplayText(step.endTs - step.startTs) : '-'}</td>
          </tr>
          {/*<tr>
            <th>Delegate:</th>
            <td>TODO: No data from server</td>
          </tr>*/}
        </tbody>
      </table>
      {module === 'cd' ? (
        <LogsContent mode="step-details" toConsoleView={`${logUrl}?view=log`} />
      ) : (
        <LogsContentOld header={getString('execution.stepLogs')} redirectToLogView={redirectToLogView} />
      )}
    </div>
  )
}
