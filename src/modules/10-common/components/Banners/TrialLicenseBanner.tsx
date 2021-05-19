import React, { useState } from 'react'
import moment from 'moment'
import { Text, Layout, Icon, Button } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ModuleName } from 'framework/types/ModuleName'
import type { StringsMap } from 'stringTypes'
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
            <Icon style={{ paddingTop: 6, color: 'var(--orange-500)' }} name="info" size={18} />
            <Text style={{ lineHeight: 2.5, fontWeight: 500 }}>
              {getString('common.banners.trial.description' as keyof StringsMap, {
                module,
                days,
                moduleDescription
              })}
            </Text>
          </Layout.Horizontal>
          <Button padding="small" text={getString('common.banners.trial.contactSales' as keyof StringsMap)} />
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
