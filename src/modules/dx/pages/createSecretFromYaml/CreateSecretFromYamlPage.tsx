import React, { useState, useEffect } from 'react'
import { Container, Button, IconName } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory } from 'react-router-dom'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { PageBody } from 'modules/common/components/Page/PageBody'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { usePostSecretTextViaYaml, usePostSecretFileViaYaml } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { routeSecretDetails } from 'modules/dx/routes'
import { YAMLService } from 'modules/dx/services'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'

const CreateSecretFromYamlPage: React.FC = () => {
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const { showSuccess, showError } = useToaster()
  const { mutate: createSecretText } = usePostSecretTextViaYaml({
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })
  const { mutate: createSecretFile } = usePostSecretFileViaYaml({
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

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
    const { error: apiError, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.SECRET, query)
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
        if (jsonData['type'] === 'SecretText') {
          await createSecretText(yamlData as any)
        }
        if (jsonData['type'] === 'SecretFile') {
          await createSecretFile(yamlData as any)
        }
        showSuccess('Secret created successfully')
        history.push(routeSecretDetails.url({ secretId: jsonData['identifier'] }))
      } catch (err) {
        showError(err.message)
      }
    }
  }

  return (
    <PageBody>
      <PageHeader title="Create Secret from YAML" />
      <Container padding="xlarge">
        <YAMLBuilder fileName="New Secret" entityType={YamlEntity.SECRET} bind={setYamlHandler} snippets={snippets} />
        <Button text="Create" intent="primary" margin={{ top: 'xlarge' }} onClick={handleCreate} />
      </Container>
    </PageBody>
  )
}

export default CreateSecretFromYamlPage
