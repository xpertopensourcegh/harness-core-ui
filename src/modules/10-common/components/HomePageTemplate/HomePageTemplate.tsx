import React from 'react'
import { Heading, Layout, Text, Link as ExternalLink, FlexExpander, Container } from '@wings-software/uicore'
import { Link, useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import pointerImage from './pointer.svg'
import css from './HomePageTemplate.module.scss'

interface HomePageTemplate {
  title: string
  subTitle: string
  bgImageUrl: string
  documentText: string
  documentURL?: string
}

export const HomePageTemplate: React.FC<HomePageTemplate> = ({
  title,
  bgImageUrl,
  subTitle,
  documentText,
  documentURL = 'https://docs.harness.io/'
}) => {
  const { accountId } = useParams<{
    accountId: string
  }>()
  const { getString } = useStrings()

  return (
    <Container
      height="calc(100% - 160px)"
      style={{
        margin: '80px',
        background: `transparent url(${bgImageUrl}) no-repeat`,
        backgroundSize: '100% auto',
        backgroundPositionY: 'center',
        position: 'relative'
      }}
    >
      <Layout.Vertical spacing="medium">
        <Heading font={{ weight: 'bold' }} style={{ color: '#22222A', fontSize: '30px' }}>
          {title}
        </Heading>
        <Text width={400} style={{ color: '#4F5162', lineHeight: '24px', fontSize: '16px' }}>
          {subTitle}
        </Text>
        <ExternalLink
          style={{ alignSelf: 'flex-start', color: '#0092E4', fontSize: '14px' }}
          href={documentURL}
          target="_blank"
        >
          {documentText}
        </ExternalLink>
        <Layout.Horizontal spacing="large" flex>
          <Link
            to={routes.toProjects({ accountId })}
            className={css.createBtn}
            style={{
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '16px',
              color: 'var(--white)',
              width: 200,
              height: 45,
              background: '#1977D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getString('createProject')}
          </Link>
          <Text style={{ fontSize: '16px', color: '#4F5162' }}>{getString('orSelectExisting')}</Text>
          <FlexExpander />
        </Layout.Horizontal>
      </Layout.Vertical>
      <Text
        style={{
          position: 'absolute',
          width: '160px',
          top: '-20px',
          height: '80px',
          left: '-240px',
          background: `transparent url(${pointerImage}) no-repeat`,
          backgroundPositionX: '120px',
          backgroundPositionY: 0,
          paddingTop: '45px',
          paddingRight: '35px',
          fontSize: '13px',
          lineHeight: '20px',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        {getString('pickProject')}
      </Text>
    </Container>
  )
}
