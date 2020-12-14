import React, { useEffect, useState } from 'react'
import { Layout, Container, SelectOption } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { Spinner } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'

import routes from '@common/RouteDefinitions'
import { useToaster } from '@common/exports'
import { useGetFeatureFlag } from 'services/cf'
import { useEnvironments } from '@cf/hooks/environment'
import FlagActivation from '../../components/FlagActivation/FlagActivation'
import FlagActivationDetails from '../../components/FlagActivation/FlagActivationDetails'
import css from './CFFeatureFlagsDetailPage.module.scss'

const CFFeatureFlagsDetailPage: React.FC = () => {
  const history = useHistory()
  const { showError } = useToaster()

  const { orgIdentifier, projectIdentifier, featureFlagIdentifier, environmentIdentifier, accountId } = useParams<any>()

  const { data: environments, error: errorEnvs, loading: envsLoading } = useEnvironments({
    project: projectIdentifier as string,
    account: 'default',
    org: 'default_org'
  })
  const [environmentOption, setEnvironmentOption] = useState<SelectOption | null>(null)

  useEffect(() => {
    if (!envsLoading) {
      let index = 0
      if (environmentIdentifier) {
        index = environments.findIndex(elem => elem.value === environmentIdentifier)
      }
      setEnvironmentOption(environments?.length > 0 ? environments[index] : null)
    }
  }, [environments?.length, envsLoading, environmentIdentifier])

  const { data: singleFlag, loading: loadingFlag, error: errorFlag, refetch } = useGetFeatureFlag({
    lazy: true,
    identifier: featureFlagIdentifier as string,
    queryParams: {
      project: projectIdentifier as string,
      environment: environmentOption?.value as string,
      account: 'default',
      org: 'default_org'
    }
  })

  useEffect(() => {
    if (environmentOption) {
      refetch()
    }
  }, [environmentOption])

  const onEnvChange = (item: SelectOption) => {
    history.push(
      routes.toCFFeatureFlagsDetail({
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        environmentIdentifier: item.value as string,
        featureFlagIdentifier: featureFlagIdentifier as string,
        accountId
      })
    )
  }

  if (loadingFlag || envsLoading) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  const error = errorFlag || errorEnvs
  // TODO: Show more meaningful error here
  if (error) {
    showError('Error on back end')
  }

  return (
    <>
      <Container flex height="100%">
        <Layout.Horizontal className={css.flagContainer}>
          <Layout.Vertical width="100%">
            <FlagActivationDetails singleFlag={singleFlag?.data} refetchFlag={refetch} />
          </Layout.Vertical>
        </Layout.Horizontal>

        <Layout.Horizontal width="70%" height="100%">
          <Layout.Vertical width="100%">
            <FlagActivation
              refetchFlag={refetch}
              project={projectIdentifier as string}
              environments={environments}
              environment={environmentOption}
              flagData={singleFlag?.data}
              isBooleanFlag={singleFlag?.data?.kind === 'boolean'}
              onEnvChange={onEnvChange}
            />
          </Layout.Vertical>
        </Layout.Horizontal>
      </Container>
    </>
  )
}

export default CFFeatureFlagsDetailPage
