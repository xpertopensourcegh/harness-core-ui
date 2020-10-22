import React from 'react'
import { Text, Color, Container, Layout, Icon } from '@wings-software/uikit'
import { Link } from 'react-router-dom'
import { routeCDDashboard } from 'navigation/cd/routes'
import type { Project } from 'services/cd-ng'
import i18n from './CDRenderer.i18n'

interface CDRendererProps {
  data: Project
  isPreview?: boolean
}
const CDRenderer: React.FC<CDRendererProps> = ({ data, isPreview }) => {
  return (
    <Container border={{ top: true, color: Color.GREY_250 }} padding={{ top: 'medium', bottom: 'medium' }}>
      <Layout.Horizontal>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }}>
          {!isPreview ? (
            <Link
              to={routeCDDashboard.url({
                orgIdentifier: data.orgIdentifier as string,
                projectIdentifier: data.identifier
              })}
            >
              <Icon name="cd-hover" size={30} flex={{ align: 'center-center' }} />
            </Link>
          ) : (
            <Icon name="cd-hover" size={30} flex={{ align: 'center-center' }} />
          )}
        </Container>
        <Container width="33.33%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" flex={{ align: 'center-center' }}>
              {i18n.placeholder}
            </Text>
            <Text font="xsmall">{i18n.deployments.toUpperCase()}</Text>
          </Layout.Vertical>
        </Container>

        <Container width="33.33%" flex={{ align: 'center-center' }}>
          <Layout.Vertical>
            <Text font="medium" color={Color.RED_600} flex={{ align: 'center-center' }}>
              {i18n.placeholder}
            </Text>
            <Text font="xsmall">{i18n.alerts.toUpperCase()}</Text>
          </Layout.Vertical>
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

export default CDRenderer
