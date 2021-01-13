import React from 'react'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { pipelineSchema } from '@common/services/mocks/pipeline-schema.ts'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import css from './PipelineYamlView.module.scss'

const PipelineYamlView: React.FC = () => {
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

  return (
    <div className={css.yamlBuilder}>
      <YAMLBuilder
        fileName="Pipeline.yaml"
        entityType="Pipelines"
        existingJSON={{ pipeline }}
        bind={setYamlHandler}
        height={'calc(100vh - 200px)'}
        invocationMap={stepsFactory.getInvocationMap()}
        showSnippetSection={false}
        schema={pipelineSchema}
      />
    </div>
  )
}

export default PipelineYamlView
