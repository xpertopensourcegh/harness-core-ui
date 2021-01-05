import React from 'react'
import { useParams } from 'react-router-dom'

import type { ExecutionPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useGetInputsetYaml } from 'services/pipeline-ng'
import { PageSpinner } from '@common/components'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'

export default function ExecutionInputsView(): React.ReactElement {
  const { projectIdentifier, orgIdentifier, pipelineIdentifier, accountId, module, executionIdentifier } = useParams<
    PipelineType<ExecutionPathProps>
  >()

  const { data: inputSetYaml, loading } = useGetInputsetYaml({
    planExecutionId: executionIdentifier,
    queryParams: {
      orgIdentifier,
      projectIdentifier,
      accountIdentifier: accountId
    }
  })

  // React.useEffect(() => {
  //   if (query.executionId && query.executionId !== null) {
  //     refetch()
  //   }
  // }, [query.executionId])

  if (loading) {
    return <PageSpinner />
  }

  return (
    <RunPipelineForm
      pipelineIdentifier={pipelineIdentifier}
      orgIdentifier={orgIdentifier}
      projectIdentifier={projectIdentifier}
      accountId={accountId}
      module={module}
      inputSetYAML={inputSetYaml || ''}
      executionView
    />
  )
}
