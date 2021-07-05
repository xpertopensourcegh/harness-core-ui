import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Color, Layout, Text, Button, Container } from '@wings-software/uicore'
import { useListAggregatedApiKeys } from 'services/cd-ng'
import type { ProjectPathProps, ServiceAccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { useApiKeyModal } from '@rbac/modals/ApiKeyModal/useApiKeyModal'
import { useTokenModal } from '@rbac/modals/TokenModal/useTokenModal'
import { PageSpinner } from '@common/components'
import { PageError } from '@common/components/Page/PageError'
import ApiKeyCard from '@rbac/components/ApiKeyList/views/ApiKeyCard'

const ApiKeyList: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, serviceAccountIdentifier } = useParams<
    ProjectPathProps & ServiceAccountPathProps
  >()
  const { getString } = useStrings()
  const [refetchTokens, setRefetchTokens] = useState<boolean>(false)
  const { data, refetch, error, loading } = useListAggregatedApiKeys({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      apiKeyType: 'SERVICE_ACCOUNT',
      parentIdentifier: serviceAccountIdentifier
    }
  })

  const { openApiKeyModal } = useApiKeyModal({
    onSuccess: refetch
  })

  const onRefetchComplete = (): void => {
    setRefetchTokens(false)
  }

  const { openTokenModal } = useTokenModal({
    onSuccess: () => {
      refetch()
      setRefetchTokens(true)
    }
  })

  return (
    <Container>
      <Layout.Horizontal flex>
        <Text color={Color.BLACK} font={{ size: 'medium', weight: 'semi-bold' }}>
          {getString('common.apiKeys')}
        </Text>
        <Button
          text={getString('plusNumber', { number: getString('common.apikey') })}
          minimal
          onClick={() => openApiKeyModal()}
        />
      </Layout.Horizontal>
      <Container padding={{ top: 'medium' }}>
        {loading && <PageSpinner />}
        {error && <PageError message={(error.data as Error)?.message || error.message} onClick={() => refetch()} />}
        {data?.data?.content?.map(apiKey => (
          <ApiKeyCard
            key={apiKey.apiKey.identifier}
            data={apiKey}
            refetchApiKeys={refetch}
            openTokenModal={openTokenModal}
            refetchTokens={refetchTokens}
            onRefetchComplete={onRefetchComplete}
          />
        ))}
      </Container>
    </Container>
  )
}

export default ApiKeyList
