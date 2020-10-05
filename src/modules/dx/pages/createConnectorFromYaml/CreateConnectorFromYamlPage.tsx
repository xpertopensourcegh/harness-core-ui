import React, { useState, useEffect } from 'react'
import { Container, Button } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory, useParams, useLocation } from 'react-router-dom'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { addIconInfoToSnippets } from 'modules/common/components/YAMLBuilder/YAMLBuilderUtils'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { PageBody } from 'modules/common/components/Page/PageBody'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { useCreateConnector } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { YAMLService } from 'modules/dx/services'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import i18n from './CreateConnectorFromYaml.i18n'

const CreateConnectorFromYamlPage: React.FC = () => {
  const { accountId } = useParams()
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const { showSuccess, showError } = useToaster()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })

  const { pathname } = useLocation()

  const fetchSnippets = (query?: string): void => {
    const { error: apiError, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.CONNECTOR, query) || {}
    if (apiError) {
      showError(apiError)
      return
    }
    addIconInfoToSnippets('command-shell-script', snippetsList)
    setSnippets(snippetsList)
  }

  useEffect(() => {
    fetchSnippets()
  })

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

  return (
    <>
      <PageHeader title={i18n.title} />
      <PageBody>
        <Container padding="xlarge">
          <YAMLBuilder
            fileName={i18n.newConnector}
            entityType={YamlEntity.CONNECTOR}
            bind={setYamlHandler}
            snippets={snippets}
          />
          <Button text="Create" intent="primary" margin={{ top: 'xlarge' }} onClick={handleCreate} />
        </Container>
      </PageBody>
    </>
  )
}

export default CreateConnectorFromYamlPage
