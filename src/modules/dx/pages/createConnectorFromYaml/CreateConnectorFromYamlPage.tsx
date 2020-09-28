import React, { useState, useEffect } from 'react'
import { Container, Button, IconName } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory, useParams } from 'react-router-dom'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { PageBody } from 'modules/common/components/Page/PageBody'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { useCreateConnector } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { routeConnectorDetails } from 'modules/dx/routes'
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
    const { error: apiError, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.CONNECTOR, query)
    if (apiError) {
      showError(apiError)
      return
    }
    addIconInfoToSnippets(snippetsList, 'command-shell-script')
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
        await createConnector(yamlData as any) // Replace after BE changes api
        showSuccess(i18n.successfullyCreated)
        history.push(routeConnectorDetails.url({ connectorId: jsonData['identifier'] }))
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
