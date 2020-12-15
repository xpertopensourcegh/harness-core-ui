import React, { useState } from 'react'
import { Container, Button } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { PageBody } from '@common/components/Page/PageBody'
import { PageHeader } from '@common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { useCreateConnector, useGetYamlSnippetMetadata } from 'services/cd-ng'
import { useToaster } from '@common/exports'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import i18n from './CreateConnectorFromYaml.i18n'

const CreateConnectorFromYamlPage: React.FC = () => {
  const { accountId } = useParams()
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const { showSuccess, showError } = useToaster()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })

  const { pathname } = useLocation()

  const handleCreate = async (): Promise<void> => {
    const yamlData = yamlHandler?.getLatestYaml()
    let jsonData
    try {
      jsonData = parse(yamlData || '')
    } catch (err) {
      showError(err.message)
    }

    if (yamlData && jsonData) {
      try {
        await createConnector(jsonData as any) // Replace after BE changes api
        showSuccess(i18n.successfullyCreated)
        history.push(`${pathname}/${jsonData.connector?.['identifier']}`)
      } catch (err) {
        showError(err.data?.message)
      }
    }
  }

  const { data: snippetData } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags('Connectors')
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } }
  })

  return (
    <>
      <PageHeader title={i18n.title} />
      <PageBody>
        <Container padding="xlarge">
          <YAMLBuilder
            fileName={i18n.newConnector}
            entityType="Connectors"
            bind={setYamlHandler}
            showIconMenu={true}
            snippets={snippetData?.data?.yamlSnippets}
          />
          <Button text="Create" intent="primary" margin={{ top: 'xlarge' }} onClick={handleCreate} />
        </Container>
      </PageBody>
    </>
  )
}

export default CreateConnectorFromYamlPage
