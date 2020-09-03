import React from 'react'
import { stringify, parse } from 'yaml'
import type { IconName } from '@wings-software/uikit'
import { Prompt } from 'react-router-dom'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YAMLService } from 'modules/dx/services'
import { useToaster } from 'modules/common/exports'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import factory from 'modules/cd/components/PipelineSteps/PipelineStepFactory'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import css from './PipelineYamlView.module.scss'

const PipelineYamlView: React.FC = () => {
  const {
    state: { pipeline },
    updatePipeline
  } = React.useContext(PipelineContext)
  const { showError } = useToaster()
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  React.useEffect(() => {
    fetchSnippets()
  })
  const [snippets, setSnippets] = React.useState<SnippetInterface[]>()

  const addIconInfoToSnippets = (snippetsList: SnippetInterface[], iconName: IconName): void => {
    if (!snippetsList) {
      return
    }
    const snippetsClone = snippetsList.slice()
    snippetsClone.forEach(snippet => {
      snippet['iconName'] = iconName
    })
  }

  const fetchSnippets = (query?: string): void => {
    const { error, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.PIPELINE, query)
    if (error) {
      showError(error)
      return
    }
    addIconInfoToSnippets(snippetsList, 'command-shell-script')
    setSnippets(snippetsList)
  }

  return (
    <div className={css.yamlBuilder}>
      <Prompt
        when={true}
        message={() => {
          if (yamlHandler) {
            updatePipeline(parse(yamlHandler.getLatestYaml()).pipeline)
          }
          return true
        }}
      />
      <YAMLBuilder
        fileName="DeploymentPipeline.yaml"
        entityType={YamlEntity.PIPELINE}
        existingYaml={stringify({ pipeline })}
        bind={setYamlHandler}
        snippets={snippets}
        onSnippetSearch={fetchSnippets}
        height={'90%'}
        invocationMap={factory.getInvocationMap()}
      />
    </div>
  )
}

export default PipelineYamlView
