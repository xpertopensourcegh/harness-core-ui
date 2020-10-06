import React from 'react'
import { Layout, Container } from '@wings-software/uikit'
import { Spinner } from '@blueprintjs/core'
import { useToaster } from 'modules/common/exports'
import { useGetFeatureFlag, useGetFeatureFlagActivation } from 'services/cf'
import { useRouteParams } from 'framework/exports'
import FlagActivation from '../../components/FlagActivation/FlagActivation'
import FlagActivationDetails from '../../components/FlagActivation/FlagActivationDetails'
import css from './CFFeatureFlagsDetailPage.module.scss'

const CFFeatureFlagsDetailPage: React.FC = () => {
  const { showError } = useToaster()

  const {
    params: { projectIdentifier, featureFlagIdentifier }
  } = useRouteParams()

  const { data: singleFlag, loading: loadingFlag, error: errorFlag } = useGetFeatureFlag({
    identifier: featureFlagIdentifier as string,
    queryParams: {
      project: projectIdentifier as string
    }
  })

  // FIXME: Fix when BE is ready
  // eslint-disable-next-line
  const { data: flagActivationData, loading: loadingActivation, error: errorActivation } = useGetFeatureFlagActivation({
    identifier: featureFlagIdentifier as string,
    queryParams: {
      project: projectIdentifier as string,
      environment: 'prod' // FIXME: hardcoded until environment from BE is done
    }
  })

  if (loadingFlag || loadingActivation) {
    return (
      <Container flex style={{ justifyContent: 'center', height: '100%' }}>
        <Spinner size={50} />
      </Container>
    )
  }

  // TODO: Show more meaningful error here
  if (errorFlag || errorActivation) {
    showError('Error on back end')
  }

  return (
    <>
      <Container flex height="100%">
        <Layout.Horizontal className={css.flagContainer}>
          <Layout.Vertical width="100%">
            <FlagActivationDetails singleFlag={singleFlag} />
          </Layout.Vertical>
        </Layout.Horizontal>

        <Layout.Horizontal width="70%" height="100%">
          <Layout.Vertical width="100%">
            <FlagActivation flagActivationData={flagActivationData} />
          </Layout.Vertical>
        </Layout.Horizontal>
      </Container>
    </>
  )
}

export default CFFeatureFlagsDetailPage
