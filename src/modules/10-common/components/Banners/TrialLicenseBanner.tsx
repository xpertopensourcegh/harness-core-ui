import React, { useState } from 'react'
import moment from 'moment'
import { Text, Layout, Button, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ModuleName } from 'framework/types/ModuleName'
import type { StringsMap } from 'stringTypes'
import { useContactSalesModal, ContactSalesFormProps } from '@common/modals/ContactSales/useContactSalesModal'
import { Page } from '../Page/Page'
import css from './TrialLicenseBanner.module.scss'

interface TrialBannerProps {
  expiryTime?: number
  licenseType?: string
  module: ModuleName
}

export const TrialLicenseBanner = (trialBannerProps: TrialBannerProps): React.ReactElement => {
  const { getString } = useStrings()
  const [display, setDisplay] = useState(true)
  const { module, expiryTime, licenseType } = trialBannerProps
  const moduleName = module.toString().toLowerCase()
  const moduleDescription = getString(`${moduleName}.continuous` as keyof StringsMap)

  const days = Math.round(moment(expiryTime).diff(moment.now(), 'days', true))

  const { openContactSalesModal } = useContactSalesModal({
    onSubmit: (_values: ContactSalesFormProps) => {
      // TO-DO: call the API
    }
  })

  if (licenseType !== 'TRIAL' || !display) {
    return <></>
  }

  return (
    <Page.Header
      className={css.trialLicenseBanner}
      title={''}
      content={
        <Layout.Horizontal spacing="xxxlarge">
          <Layout.Horizontal spacing="small" padding={{ right: 'xxxlarge' }}>
            <Text font={{ weight: 'semi-bold' }} icon="info" iconProps={{ size: 18, color: Color.ORANGE_500 }}>
              {getString('common.banners.trial.description', {
                module,
                days,
                moduleDescription
              })}
            </Text>
          </Layout.Horizontal>
          <Button
            padding="small"
            text={getString('common.banners.trial.contactSales')}
            onClick={openContactSalesModal}
          />
        </Layout.Horizontal>
      }
      toolbar={
        <Button
          aria-label="close banner"
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => setDisplay(false)}
        />
      }
    />
  )
}
