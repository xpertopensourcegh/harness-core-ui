import React from 'react'

import { useParams, useHistory } from 'react-router-dom'
import { Button, Card, Color, Heading, Icon, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { AccountPathProps, Module } from '@common/interfaces/RouteInterfaces'
import { useContactSalesModal, ContactSalesFormProps } from '@common/modals/ContactSales/useContactSalesModal'
import type { ModuleName } from 'framework/types/ModuleName'
import type { ModuleLicenseDTO } from 'services/cd-ng'
import routes from '@common/RouteDefinitions'

import { Editions, ModuleLicenseType } from '@common/constants/SubscriptionTypes'
import type { TrialInformation } from '../SubscriptionsPage'
import css from './SubscriptionDetailsCard.module.scss'

interface SubscriptionDetailsCardProps {
  accountName?: string
  licenseData?: ModuleLicenseDTO
  module: ModuleName
  trialInformation: TrialInformation
}

const SubscriptionDetailsCard: React.FC<SubscriptionDetailsCardProps> = props => {
  const { accountName, module, licenseData, trialInformation } = props
  const { days, expiryDate, isExpired, expiredDays } = trialInformation

  const history = useHistory()
  const { getString } = useStrings()
  const { accountId } = useParams<AccountPathProps>()
  const { openContactSalesModal } = useContactSalesModal({
    onSubmit: (_values: ContactSalesFormProps) => {
      // TO-DO: call the API
    }
  })

  function getExpiryCountdownMessage(): React.ReactElement | undefined {
    if (licenseData?.licenseType !== ModuleLicenseType.PAID || days < 14) {
      return (
        <Layout.Horizontal spacing="small">
          <Icon className={css.expiryIcon} size={12} name={'warning-sign'} color="orange800" />
          <Text color={Color.ORANGE_800}>{getString('common.subscriptions.expiryCountdown', { days })}</Text>
        </Layout.Horizontal>
      )
    }
  }

  function getExpiredMessage(): React.ReactElement {
    return (
      <Layout.Horizontal spacing="small">
        <Icon className={css.expiryIcon} size={12} name={'warning-sign'} color="red700" />
        <Text color={Color.RED_700}>{getString('common.subscriptions.expired', { days: expiredDays })}</Text>
      </Layout.Horizontal>
    )
  }

  // Add this when the api is fixed
  // function insertLicenseCountElements(fields: React.ReactElement[]): void {
  //   const moduleType = licenseData?.moduleType

  //   switch (moduleType) {
  //     case ModuleName.CF:
  //       {
  //         const featureFlagUsers = licenseData?.numberOfUsers
  //         const monthlyActiveUsers = licenseData?.numberOfClientMAUs

  //         fields.push(
  //           <React.Fragment key="licenseCount">
  //             <Text color={Color.GREY_600}>{getString('common.account.licenseCount')}</Text>
  //             <Layout.Vertical spacing="medium">
  //               <Text color={Color.BLACK} font={{ weight: 'semi-bold' }} margin={{ bottom: 5 }}>
  //                 {getString('common.subscriptions.featureFlags.users', { users: featureFlagUsers })}
  //               </Text>
  //               <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
  //                 {getString('common.subscriptions.featureFlags.mau', { maus: monthlyActiveUsers })}
  //               </Text>
  //             </Layout.Vertical>
  //           </React.Fragment>
  //         )
  //       }
  //       break
  //     case ModuleName.CI:
  //       {
  //         const committers = licenseData?.numberOfCommitters

  //         fields.push(
  //           <React.Fragment key="licenseCount">
  //             <Text color={Color.GREY_600}>{getString('common.account.licenseCount')}</Text>
  //             <Layout.Vertical spacing="medium">
  //               <Text color={Color.BLACK} font={{ weight: 'semi-bold' }} margin={{ bottom: 5 }}>
  //                 {getString('common.subscriptions.ci.developers', { developers: committers })}
  //               </Text>
  //             </Layout.Vertical>
  //           </React.Fragment>
  //         )
  //       }
  //       break
  //     default:
  //       break
  //   }
  // }

  function insertPlanElements(fields: React.ReactElement[]): void {
    const expiryMessage = isExpired ? getExpiredMessage() : getExpiryCountdownMessage()
    const planMessage =
      licenseData?.licenseType === ModuleLicenseType.PAID
        ? getString('common.subscriptions.enterprisePaid')
        : getString('common.subscriptions.enterpriseTrial')

    fields.push(
      <React.Fragment key="plan">
        <Text color={Color.GREY_600}>{getString('common.subscriptions.overview.plan')}</Text>
        <Layout.Vertical>
          <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
            {planMessage}
          </Text>
          {expiryMessage}
        </Layout.Vertical>
      </React.Fragment>
    )
  }

  function insertExpiryDate(fields: React.ReactElement[]): void {
    const expiryElement = (
      <React.Fragment key="expiry">
        <Text color={Color.GREY_600}>{getString('common.subscriptions.overview.expiry')}</Text>
        <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
          {expiryDate}
        </Text>
      </React.Fragment>
    )

    fields.push(expiryElement)
  }

  function getSubscriptionDetailsFields(): React.ReactElement[] {
    const fields = [
      <React.Fragment key="account">
        <Text color={Color.GREY_600}>{getString('common.accountName')}</Text>
        <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
          {accountName}
        </Text>
      </React.Fragment>
    ]

    const edition = licenseData?.edition

    switch (edition) {
      case Editions.ENTERPRISE:
        {
          insertPlanElements(fields)
          // insertLicenseCountElements(fields)
          insertExpiryDate(fields)
        }
        break
      case Editions.TEAM:
      case Editions.FREE:
      default: {
        fields.push(
          <React.Fragment key="plan">
            <Text color={Color.GREY_600}>{getString('common.subscriptions.overview.plan')}</Text>
            <Layout.Vertical>
              <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
                {getString('common.subscriptions.noActiveSubscription')}
              </Text>
            </Layout.Vertical>
          </React.Fragment>
        )
      }
    }
    return fields
  }

  function handleSubscribeClick(): void {
    history.push(
      routes.toModuleTrialHome({
        accountId,
        module: module.toLowerCase() as Module
      })
    )
  }

  const subscribeButton = (
    <Button onClick={handleSubscribeClick} intent="primary">
      {getString('common.subscriptions.overview.subscribe')}
    </Button>
  )

  const contactSalesButton = (
    <Button intent="primary" onClick={openContactSalesModal}>
      {getString('common.banners.trial.contactSales')}
    </Button>
  )

  const extendTrialButton = (
    <Button onClick={() => void 0}>{getString('common.banners.trial.expired.extendTrial')}</Button>
  )

  const buttons = (
    <React.Fragment>
      {!licenseData && subscribeButton}
      {licenseData?.licenseType !== ModuleLicenseType.PAID && contactSalesButton}
      {licenseData?.licenseType !== ModuleLicenseType.PAID && isExpired && extendTrialButton}
    </React.Fragment>
  )

  return (
    <Card>
      <Layout.Vertical spacing="xxlarge" flex={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Heading color={Color.BLACK} font={{ size: 'medium' }}>
          {getString('common.subscriptions.overview.details')}
        </Heading>
        <div className={css.detailFields}>{getSubscriptionDetailsFields()}</div>
        <Layout.Horizontal spacing="xxlarge">{buttons}</Layout.Horizontal>
      </Layout.Vertical>
    </Card>
  )
}

export default SubscriptionDetailsCard
