import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PipelineDeploymentList from '@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList'
import type { PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import routes from '@common/RouteDefinitions'

export default function CDPipelineDeploymentList(): React.ReactElement {
  const { pipelineIdentifier, orgIdentifier, projectIdentifier, accountId, module } = useParams<
    PipelineType<PipelinePathProps>
  >()

  const history = useHistory()
  const { getString } = useStrings()
  useDocumentTitle([getString('pipelines'), getString('executionsText')])

  const onRunPipeline = (): void => {
    history.push(
      routes.toRunPipeline({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier,
        module
      })
    )
  }

  return <PipelineDeploymentList showHealthAndExecution onRunPipeline={onRunPipeline} />
}
