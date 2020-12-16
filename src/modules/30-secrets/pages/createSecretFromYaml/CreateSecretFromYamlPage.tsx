import React, { useState } from 'react'
import { Container, Button } from '@wings-software/uikit'
import { parse } from 'yaml'
import { useHistory, useParams } from 'react-router-dom'

import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { PageBody } from '@common/components/Page/PageBody'
import { PageHeader } from '@common/components/Page/PageHeader'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { usePostSecretViaYaml, useGetYamlSchema, ResponseJsonNode } from 'services/cd-ng'
import { useToaster } from '@common/exports'
import routes from '@common/RouteDefinitions'
import type { UseGetMockData } from '@common/utils/testUtils'

const CreateSecretFromYamlPage: React.FC<{ mockSchemaData?: UseGetMockData<ResponseJsonNode> }> = props => {
  const { accountId } = useParams()
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
        showSuccess('Secret created successfully')
        history.push(routes.toResourcesSecretDetails({ secretId: jsonData['identifier'], accountId }))
      } catch (err) {
        showError(err.data?.message || err.message)
      }
    } else {
      showError('Invalid Secret configuration')
    }
  }

  const { data: secretSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Secrets'
    },
    mock: props.mockSchemaData
  })

  return (
    <PageBody>
      <PageHeader title="Create Secret from YAML" />
      <Container padding="xlarge">
        <YAMLBuilder
          fileName="New Secret"
          entityType={'Secrets'}
          bind={setYamlHandler}
          schema={secretSchema?.data || ''}
        />
        <Button text="Create" intent="primary" margin={{ top: 'xlarge' }} onClick={handleCreate} />
      </Container>
    </PageBody>
  )
}

export default CreateSecretFromYamlPage
