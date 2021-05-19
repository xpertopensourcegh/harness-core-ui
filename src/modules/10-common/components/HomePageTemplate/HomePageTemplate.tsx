import React from 'react'
import { Heading, Layout, Text, Link as ExternalLink, FlexExpander, Container, Color } from '@wings-software/uicore'
import { Link, useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import routes from '@common/RouteDefinitions'
import type { ModuleName } from 'framework/types/ModuleName'
import { TrialLicenseBanner } from '@common/components/Banners/TrialLicenseBanner'
import css from './HomePageTemplate.module.scss'

interface TrialBannerProps {
  expiryTime?: number
  licenseType?: string
  module: ModuleName
}
interface HomePageTemplate {
  title: string
  subTitle: string
  bgImageUrl: string
  documentText: string
  documentURL?: string
  trialBannerProps: TrialBannerProps
}

export const HomePageTemplate: React.FC<HomePageTemplate> = ({
  title,
  bgImageUrl,
  subTitle,
  documentText,
  documentURL = 'https://ngdocs.harness.io/',
  trialBannerProps
}) => {
  const { accountId } = useParams<{
    accountId: string
  }>()
  const { getString } = useStrings()
  return (
    <>
      <TrialLicenseBanner {...trialBannerProps} />
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
          <Heading font={{ weight: 'bold' }} color={'var(--primary-10)'} style={{ fontSize: 'xlarge' }}>
            {title}
          </Heading>
          <Text width={400} color={'var(--grey-500)'} font={{ size: 'normal' }} style={{ lineHeight: '24px' }}>
            {subTitle}
          </Text>
          <ExternalLink
            color={'var(--primary-6)'}
            font={{ size: 'normal' }}
            style={{ alignSelf: 'flex-start' }}
            href={documentURL}
            target="_blank"
          >
            {documentText}
          </ExternalLink>
          <Layout.Horizontal spacing="large" flex>
            <Link to={routes.toProjects({ accountId })} className={css.createBtn}>
              {getString('createProject')}
            </Link>
            <Text font={{ size: 'medium' }} color={Color.BLACK}>
              {getString('orSelectExisting')}
            </Text>
            <FlexExpander />
          </Layout.Horizontal>
        </Layout.Vertical>
      </Container>
    </>
  )
}
