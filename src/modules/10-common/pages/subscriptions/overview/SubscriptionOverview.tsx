import React from 'react'

import { Layout } from '@wings-software/uicore'
import type { ModuleName } from 'framework/types/ModuleName'

import type { ModuleLicenseDTO } from 'services/cd-ng'
import SubscriptionDetailsCard from './SubscriptionDetailsCard'
import type { TrialInformation } from '../SubscriptionsPage'

interface SubscriptionOverviewProps {
  accountName?: string
  licenseData?: ModuleLicenseDTO
  module: ModuleName
  trialInformation: TrialInformation
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = props => {
  const { accountName, licenseData, module, trialInformation } = props

  // Although this component currently contains 'almost' nothing
  // it will be useful to leave this here for other components in the future
  return (
    <Layout.Vertical>
      <SubscriptionDetailsCard
        accountName={accountName}
        module={module}
        licenseData={licenseData}
        trialInformation={trialInformation}
      />
    </Layout.Vertical>
  )
}

export default SubscriptionOverview
