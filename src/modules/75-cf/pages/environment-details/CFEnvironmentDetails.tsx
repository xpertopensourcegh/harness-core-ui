import React from 'react'
import { useParams } from 'react-router-dom'
import { get } from 'lodash-es'
import { Layout, Container } from '@wings-software/uicore'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { useGetEnvironment, EnvironmentResponseDTO } from 'services/cd-ng'
import { PageError } from '@common/components/Page/PageError'
import CFEnvironmentDetailsHeader from './CFEnvironmentDetailsHeader'
import CFEnvironmentDetailsBody from './CFEnvironmentDetailsBody'

type Environment = EnvironmentResponseDTO

const CFEnvironmentDetails: React.FC<{}> = () => {
  const { projectIdentifier, environmentIdentifier, orgIdentifier, accountId } = useParams<Record<string, string>>()
  const { loading, data, error, refetch } = useGetEnvironment({
    environmentIdentifier,
    queryParams: {
      accountId,
      projectIdentifier,
      orgIdentifier
    }
  })

  const environment = data?.data as Environment
  const hasData = Boolean(environment)

  return (
    <>
      {hasData && (
        <Layout.Vertical height="100vh" style={{ boxSizing: 'border-box' }}>
          <CFEnvironmentDetailsHeader environment={environment} />
          <CFEnvironmentDetailsBody environment={environment} />
        </Layout.Vertical>
      )}
      {loading && (
        <Container
          style={{
            position: 'fixed',
            top: '144px',
            left: '270px',
            width: 'calc(100% - 270px)',
            height: 'calc(100% - 144px)'
          }}
        >
          <ContainerSpinner />
        </Container>
      )}
      {error && (
        <PageError
          message={get(error, 'data.message', error?.message)}
          onClick={() => {
            refetch()
          }}
        />
      )}
    </>
  )
}

export default CFEnvironmentDetails
