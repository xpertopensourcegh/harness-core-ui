import React, { useCallback } from 'react'
import { ExecutionsListingView } from 'modules/cd/components/ExecutionsListingView/ExecutionsListingView'
import { useRouteParams } from 'framework/exports'

const PipelineDeploymentList: React.FC = () => {
  const { params } = useRouteParams()
  const runPipeline = useCallback(() => {
    alert('To be implemented')
  }, [])

  return (
    <ExecutionsListingView onNoDataButtonClick={runPipeline} pipelineIdentifier={params.pipelineIdentifier as string} />
  )
}

export default PipelineDeploymentList
