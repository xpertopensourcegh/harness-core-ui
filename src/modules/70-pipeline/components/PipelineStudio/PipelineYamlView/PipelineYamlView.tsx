import React from 'react'
import { useParams } from 'react-router-dom'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { useGetYamlSchema } from 'services/pipeline-ng'
import { PageSpinner } from '@common/components'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { PipelineContext } from '../PipelineContext/PipelineContext'

import css from './PipelineYamlView.module.scss'

const PipelineYamlView: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const {
    state: { pipeline },
    stepsFactory,
    setYamlHandler: setYamlHandlerContext
  } = React.useContext(PipelineContext)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()

  React.useEffect(() => {
    if (yamlHandler) {
      setYamlHandlerContext(yamlHandler)
    }
  }, [yamlHandler, setYamlHandlerContext])

  const { loading, data: pipelineSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Pipelines',
      projectIdentifier,
      orgIdentifier,
      scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
    }
  })

  return (
    <div className={css.yamlBuilder}>
      {loading ? (
        <PageSpinner />
      ) : (
        <YAMLBuilder
          fileName="Pipeline.yaml"
          entityType="Pipelines"
          existingJSON={{ pipeline }}
          bind={setYamlHandler}
          height={'calc(100vh - 200px)'}
          invocationMap={stepsFactory.getInvocationMap()}
          showSnippetSection={false}
          schema={pipelineSchema?.data}
        />
      )}
    </div>
  )
}

export default PipelineYamlView
