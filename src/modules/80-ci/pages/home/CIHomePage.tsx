import React from 'react'
import { Color, Layout, Text, Link } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { Page } from '@common/exports'
import { useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import homeIllustration from '../builds/images/homeIllustration.svg'

const CIHomePage: React.FC = () => {
  const { accountId } = useParams<{
    accountId: string
  }>()
  const { getString } = useStrings()

  return (
    <Page.Body>
      <Layout.Vertical padding="large" spacing="medium">
        <Text color={Color.BLACK} font={{ size: 'large', weight: 'bold' }}>
          {getString('ci.continuousIntegration')}
        </Text>
        <Text width={340}>{getString('ci.dashboard.subHeading')}</Text>
        <Link style={{ alignSelf: 'flex-start' }} href="https://docs.harness.io/" target="_blank">
          {getString('ci.dashboard.learnMore')}
        </Link>
        <Layout.Horizontal spacing="xxlarge">
          <Link href={routes.toProjects({ accountId })}>{getString('ci.dashboard.createProject')}</Link>
          <Text> {getString('ci.dashboard.orSelectExisting')}</Text>
        </Layout.Horizontal>
        <img src={homeIllustration} alt="" aria-hidden />
      </Layout.Vertical>
    </Page.Body>
  )
}

export default CIHomePage
