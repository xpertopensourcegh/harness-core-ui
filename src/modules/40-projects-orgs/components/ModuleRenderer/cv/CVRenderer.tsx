import React from 'react'
import { Text, Color, Container, Layout, Icon, SparkChart } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import type { Project } from 'services/cd-ng'
import routes from '@common/RouteDefinitions'
import i18n from './CVRenderer.i18n'
import css from '../ModuleRenderer.module.scss'

interface CVRendererProps {
  data: Project
  isPreview?: boolean
}

const CVRenderer: React.FC<CVRendererProps> = ({ data, isPreview }) => {
  const history = useHistory()
  return (
    <Container
      border={{ top: true, color: Color.GREY_250 }}
      padding={{ top: 'medium', bottom: 'medium' }}
      onClick={() => {
        !isPreview &&
          history.push(
            routes.toCVMainDashBoardPage({
              orgIdentifier: data.orgIdentifier,
              projectIdentifier: data.identifier,
              accountId: data.accountIdentifier || ''
            })
          )
      }}
      className={css.moduleContainer}
    >
      <Layout.Horizontal>
        <Container width="30%" border={{ right: true, color: Color.GREY_250 }} flex={{ align: 'center-center' }}>
          <Icon name="cv-main" size={30} />
        </Container>
        <Container width="70%" flex={{ align: 'center-center' }}>
          <Layout.Vertical flex={{ align: 'center-center' }}>
            <Layout.Horizontal flex={{ align: 'center-center' }} className={css.activityChart} spacing="xxlarge">
              <SparkChart data={[2, 3, 4, 5, 4, 3, 2]} />
              <Text color={Color.GREY_400} font={{ size: 'medium' }}>
                {i18n.placeholder.toUpperCase()}
              </Text>
            </Layout.Horizontal>
            <Text color={Color.GREY_400} font={{ size: 'xsmall' }}>
              {i18n.verifications.toUpperCase()}
            </Text>
          </Layout.Vertical>
        </Container>
      </Layout.Horizontal>
    </Container>
  )
}

export default CVRenderer
