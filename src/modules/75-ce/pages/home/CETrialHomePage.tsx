import React from 'react'
import { useParams } from 'react-router-dom'
import { StartTrialTemplate } from '@common/components/TrialHomePageTemplate/StartTrialTemplate'
import { useGetAccountLicenseInfo } from 'services/portal'
import { useStrings } from 'framework/strings'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import bgImageURL from './ce-homepage-bg.svg'

const CETrialHomePage: React.FC = () => {
  const { getString } = useStrings()

  const { accountId } = useParams<{
    accountId: string
  }>()

  const { error, data, refetch, loading } = useGetAccountLicenseInfo({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  // If account licensing info already exists we know the user has not had
  // the chance to pick between cost optimization and cost visibility.
  // When they come from the purpose page they have already chosen optimization
  // so it is redundant to show them the modal again.
  const shouldShowStartTrialModal = data?.data?.moduleLicenses
    ? Object.keys(data?.data?.moduleLicenses).length !== 0
    : false

  const startTrialProps = {
    description: getString('ce.ceTrialHomePage.startTrial.description'),
    learnMore: {
      description: getString('ce.learnMore'),
      url: 'https://ngdocs.harness.io/article/34bzscs2y9-ce-placeholder'
    },
    startBtn: {
      description: shouldShowStartTrialModal ? getString('getStarted') : getString('common.ce.startTrial')
    },
    shouldShowStartTrialModal
  }

  if (loading) {
    return <PageSpinner />
  }

  if (error) {
    return <PageError message={(error.data as Error)?.message || error.message} onClick={() => refetch()} />
  }

  return (
    <StartTrialTemplate
      title={getString('ce.continuous')}
      bgImageUrl={bgImageURL}
      startTrialProps={startTrialProps}
      module="ce"
    />
  )
}

export default CETrialHomePage
