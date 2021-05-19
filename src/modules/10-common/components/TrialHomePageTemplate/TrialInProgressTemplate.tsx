import React from 'react'
import { Button, Color, Container, Heading, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { ModuleName } from 'framework/types/ModuleName'
import { useTelemetry } from '@common/hooks/useTelemetry'
import { Category, PageNames } from '@common/constants/TrackingConstants'
import { TrialLicenseBanner } from '@common/components/Banners/TrialLicenseBanner'
import { Page } from '../Page/Page'

interface TrialBannerProps {
  expiryTime?: number
  licenseType?: string
  module: ModuleName
}
interface TrialInProgressTemplateProps {
  title: string
  bgImageUrl: string
  isTrialInProgress?: boolean
  trialInProgressProps: TrialInProgressProps
  trialBannerProps: TrialBannerProps
}

interface TrialInProgressProps {
  description: string
  startBtn: {
    description: string
    onClick: () => void
  }
}

const TrialInProgressComponent: React.FC<TrialInProgressProps> = trialInProgressProps => {
  const { description, startBtn } = trialInProgressProps
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="small">
      <Text
        padding={{ bottom: 'xxlarge' }}
        width={500}
        style={{
          lineHeight: 2
        }}
      >
        {description}
      </Text>
      <Layout.Horizontal spacing="small">
        <Button width={200} height={45} intent="primary" text={startBtn.description} onClick={startBtn.onClick} />
        <Text font={{ size: 'normal' }} color={Color.BLACK} padding={'small'}>
          {getString('orSelectExisting')}
        </Text>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export const TrialInProgressTemplate: React.FC<TrialInProgressTemplateProps> = ({
  title,
  bgImageUrl,
  trialInProgressProps,
  trialBannerProps
}) => {
  const { getString } = useStrings()

  useTelemetry({
    pageName: PageNames.TrialInProgress,
    category: Category.SIGNUP,
    properties: { module: trialBannerProps.module }
  })

  return (
    <>
      <TrialLicenseBanner {...trialBannerProps} />
      <Page.Body>
        <Container
          height="calc(100% - 160px)"
          style={{
            margin: '80px',
            background: `transparent url(${bgImageUrl}) no-repeat`,
            position: 'relative',
            backgroundSize: 'contain',
            backgroundPositionY: 'center'
          }}
        >
          <Layout.Vertical spacing="medium">
            <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
              <Heading font={{ weight: 'bold', size: 'large' }} color={Color.BLACK_100}>
                {title}
              </Heading>

              <Text
                width={120}
                height={18}
                border={{ radius: 3 }}
                color={Color.WHITE}
                style={{
                  backgroundColor: 'var(--orange-500)',
                  textAlign: 'center',
                  display: 'inline-block'
                }}
              >
                {getString('common.trialInProgress')}
              </Text>
            </Layout.Horizontal>
            <TrialInProgressComponent {...trialInProgressProps} />
          </Layout.Vertical>
        </Container>
      </Page.Body>
    </>
  )
}
