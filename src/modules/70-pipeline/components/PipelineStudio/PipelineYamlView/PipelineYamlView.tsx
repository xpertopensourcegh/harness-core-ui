import React from 'react'
import { parse } from 'yaml'
import { Prompt, useHistory } from 'react-router-dom'
import type * as History from 'history'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { pipelineSchema } from '@common/services/mocks/pipeline-schema.ts'
import { useToaster } from '@common/exports'
import { useStrings } from 'framework/exports'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import css from './PipelineYamlView.module.scss'

const PipelineYamlView: React.FC = () => {
  const {
    state: { pipeline },
    updatePipeline,
    stepsFactory,
    setYamlHandler: setYamlHandlerContext
  } = React.useContext(PipelineContext)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const [isYamlUpdated, setYamlUpdated] = React.useState(false)

  React.useEffect(() => {
    if (yamlHandler) {
      setYamlHandlerContext(yamlHandler)
    }
  }, [yamlHandler, setYamlHandlerContext])

  const { showError } = useToaster()
  const { getString } = useStrings()
  return (
    <div className={css.yamlBuilder}>
      <Prompt
        when={true}
        message={(nextLocation: History.Location) => {
          if (yamlHandler && !isYamlUpdated) {
            const parsedYaml = parse(yamlHandler.getLatestYaml())
            if (!parsedYaml) {
              showError(getString('invalidYamlText'))
              return false
            }
            updatePipeline(parsedYaml.pipeline).then(() => {
              setYamlUpdated(true)
              history.push(nextLocation.pathname)
            })
            return false
          }
          return true
        }}
      />
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
