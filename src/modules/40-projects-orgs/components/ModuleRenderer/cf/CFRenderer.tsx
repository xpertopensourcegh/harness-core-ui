import React from 'react'
import { Text, Color, Container, Layout, Icon } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import type { Project } from 'services/cd-ng'
import { routeCFDashboard } from 'navigation/cf/routes'
import css from '../ModuleRenderer.module.scss'

interface CFRendererProps {
  data: Project
  isPreview?: boolean
}
const CFRenderer: React.FC<CFRendererProps> = ({ data, isPreview }) => {
  const history = useHistory()
  return (
    <Container
      border={{ top: true, color: Color.GREY_250 }}
      padding={{ top: 'medium', bottom: 'medium' }}
      className={css.moduleContainer}
      onClick={() => {
        !isPreview
          ? history.push(
              routeCFDashboard.url({
                orgIdentifier: data.orgIdentifier,
                projectIdentifier: data.identifier
              })
            )
          : undefined
      }}
    >
      <Layout.Horizontal>
        <Container width="30%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
          <Icon name="cf-main" size={35} />
        </Container>
        <Container width="70%" flex={{ align: 'center-center' }}>
          <Text>TBD</Text>
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

export default CFRenderer
