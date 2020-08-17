import React, { useState } from 'react'
import { Container, Button } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory } from 'react-router-dom'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { PageBody } from 'modules/common/components/Page/PageBody'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { usePostSecretTextViaYaml, usePostSecretFileViaYaml } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import { linkTo } from 'framework/exports'
import { routeSecretDetails } from 'modules/dx/routes'

const CreateSecretFromYamlPage: React.FC = () => {
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const { showSuccess, showError } = useToaster()
  const { mutate: createSecretText } = usePostSecretTextViaYaml({
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })
  const { mutate: createSecretFile } = usePostSecretFileViaYaml({
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
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
        history.push(linkTo(routeSecretDetails, { secretId: jsonData['identifier'] }))
      } catch (err) {
        showError(err.message)
      }
    }
  }

  return (
    <PageBody>
      <PageHeader title="Create Secret from YAML" />
      <Container padding="xlarge">
        <YAMLBuilder fileName="New Secret" entityType={YamlEntity.SECRET} bind={setYamlHandler} />
        <Button text="Create" intent="primary" margin={{ top: 'xlarge' }} onClick={handleCreate} />
      </Container>
    </PageBody>
  )
}

export default CreateSecretFromYamlPage
