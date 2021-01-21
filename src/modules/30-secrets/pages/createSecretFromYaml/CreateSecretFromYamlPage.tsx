import React, { useState } from 'react'
import { Container, Button } from '@wings-software/uicore'
import { parse } from 'yaml'
import { useHistory, useParams } from 'react-router-dom'

import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { PageBody } from '@common/components/Page/PageBody'
import { PageHeader } from '@common/components/Page/PageHeader'
import { useStrings } from 'framework/exports'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import {
  usePostSecretViaYaml,
  useGetYamlSchema,
  ResponseJsonNode,
  useGetYamlSnippetMetadata,
  useGetYamlSnippet
} from 'services/cd-ng'
import { useToaster } from '@common/exports'
import routes from '@common/RouteDefinitions'
import type { UseGetMockData } from '@common/utils/testUtils'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'

const CreateSecretFromYamlPage: React.FC<{ mockSchemaData?: UseGetMockData<ResponseJsonNode> }> = props => {
  const { accountId } = useParams()
  const { getString } = useStrings()
  useDocumentTitle(getString('createSecretYAML.createSecret'))
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const { showSuccess, showError } = useToaster()
  const { mutate: createSecret } = usePostSecretViaYaml({
    queryParams: { accountIdentifier: accountId },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const handleCreate = async (): Promise<void> => {
    const yamlData = yamlHandler?.getLatestYaml()
    let jsonData
    try {
      jsonData = parse(yamlData || '')?.secret
    } catch (err) {
      showError(err.message)
    }

    if (yamlData && jsonData) {
      try {
        await createSecret(yamlData as any)
        showSuccess(getString('createSecretYAML.secretCreated'))
        history.push(routes.toResourcesSecretDetails({ secretId: jsonData['identifier'], accountId }))
      } catch (err) {
        showError(err.data?.message || err.message)
      }
    } else {
      showError(getString('createSecretYAML.invalidSecret'))
    }
  }

  const { data: secretSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Secrets'
    },
    mock: props.mockSchemaData
  })
  const { data: snippetData } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags('Secrets')
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    }
  })
  const { data: snippet, refetch: refetchSnippet } = useGetYamlSnippet({
    identifier: '',
    lazy: true
  })

  const onSnippetCopy = async (identifier: string): Promise<void> => {
    await refetchSnippet({
      pathParams: {
        identifier
      }
    })
  }
  return (
    <PageBody>
      <PageHeader title={getString('createSecretYAML.createSecret')} />
      <Container padding="xlarge">
        <YAMLBuilder
          fileName={getString('createSecretYAML.newSecret')}
          entityType={'Secrets'}
          bind={setYamlHandler}
          schema={secretSchema?.data || ''}
          onSnippetCopy={onSnippetCopy}
          snippetYaml={snippet?.data}
          snippets={snippetData?.data?.yamlSnippets}
        />
        <Button
          text={getString('createSecretYAML.create')}
          intent="primary"
          margin={{ top: 'xlarge' }}
          onClick={handleCreate}
        />
      </Container>
    </PageBody>
  )
}

export default CreateSecretFromYamlPage
