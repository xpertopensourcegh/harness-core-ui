import React from 'react'
import { useParams } from 'react-router-dom'
import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { SnippetFetchResponse, YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { PageSpinner } from '@common/components'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { useGetYamlSnippet, useGetYamlSnippetMetadata } from 'services/cd-ng'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { PipelineContext } from '../PipelineContext/PipelineContext'

import { useVariablesExpression } from '../PiplineHooks/useVariablesExpression'
import { usePipelineSchema } from '../PipelineSchema/PipelineSchemaContext'
import css from './PipelineYamlView.module.scss'

const PipelineYamlView: React.FC = () => {
  const [snippetFetchResponse, setSnippetFetchResponse] = React.useState<SnippetFetchResponse>()
  const { accountId, projectIdentifier, orgIdentifier, module } = useParams<
    PipelineType<{
      orgIdentifier: string
      projectIdentifier: string
      pipelineIdentifier: string
      accountId: string
    }>
  >()
  const {
    state: { pipeline },
    stepsFactory,
    setYamlHandler: setYamlHandlerContext
  } = React.useContext(PipelineContext)
  const { pipelineSchema } = usePipelineSchema()
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { data: snippetMetaData, loading: isFetchingSnippets } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags('Pipelines', module)
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } }
  })
  const { expressions } = useVariablesExpression()
  const { data: snippet, refetch, cancel, loading: isFetchingSnippet, error: errorFetchingSnippet } = useGetYamlSnippet(
    {
      identifier: '',
      requestOptions: { headers: { accept: 'application/json' } },
      lazy: true,
      queryParams: {
        projectIdentifier,
        orgIdentifier,
        scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
      }
    }
  )

  React.useEffect(() => {
    if (yamlHandler) {
      setYamlHandlerContext(yamlHandler)
    }
  }, [yamlHandler, setYamlHandlerContext])

  React.useEffect(() => {
    setSnippetFetchResponse({
      snippet: snippet?.data || '',
      loading: isFetchingSnippet,
      error: errorFetchingSnippet
    })
  }, [isFetchingSnippet])

  const onSnippetCopy = async (identifier: string): Promise<void> => {
    cancel()
    await refetch({
      pathParams: {
        identifier
      }
    })
  }

  return (
    <div className={css.yamlBuilder}>
      {isFetchingSnippets ? (
        <PageSpinner />
      ) : (
        <YAMLBuilder
          fileName="Pipeline.yaml"
          entityType="Pipelines"
          existingJSON={{ pipeline }}
          bind={setYamlHandler}
          onSnippetCopy={onSnippetCopy}
          onExpressionTrigger={() => {
            return Promise.resolve(expressions.map(item => ({ label: item, insertText: `${item}>`, kind: 1 })))
          }}
          showIconMenu={true}
          snippetFetchResponse={snippetFetchResponse}
          yamlSanityConfig={{ removeEmptyString: false, removeEmptyObject: false, removeEmptyArray: false }}
          height={'calc(100vh - 150px)'}
          invocationMap={stepsFactory.getInvocationMap()}
          showSnippetSection={true}
          schema={pipelineSchema?.data}
          snippets={snippetMetaData?.data?.yamlSnippets}
        />
      )}
    </div>
  )
}

export default PipelineYamlView
