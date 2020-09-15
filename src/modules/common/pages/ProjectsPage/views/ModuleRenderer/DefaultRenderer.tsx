import React from 'react'
import { Link } from 'react-router-dom'
import { Color, Layout, Icon, Text } from '@wings-software/uikit'
import { routeCDDashboard } from 'modules/cd/routes'
import { routeCVMainDashBoardPage } from 'modules/cv/routes'
import type { Project } from 'services/cd-ng'
import i18n from './ModuleRenderer.i18n'
import css from './ModuleRenderer.module.scss'

interface DefaultProps {
  data: Project
  isPreview?: boolean
}

const DefaultRenderer: React.FC<DefaultProps> = props => {
  const { data, isPreview } = props
  return (
    <Layout.Vertical
      padding={{ top: 'medium', left: 'xlarge', right: 'xlarge', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
      className={css.started}
    >
      <Text font="small" color={Color.BLACK} padding={{ bottom: 'xsmall' }}>
        {i18n.start}
      </Text>
      {isPreview ? (
        <Layout.Horizontal spacing="small">
          <Icon name="cd-hover" size={20} />
          <Icon name="nav-cv-hover" size={20} />
          <Icon name="ce-hover" size={20} />
        </Layout.Horizontal>
      ) : (
        <Layout.Horizontal spacing="small">
          <Link
            to={routeCDDashboard.url({
              projectIdentifier: data.identifier || ''
            })}
          >
            <Icon name="cd-hover" size={20} />
          </Link>
          <Link
            to={routeCVMainDashBoardPage.url({
              projectIdentifier: data.identifier || '',
              orgIdentifier: data.orgIdentifier || ''
            })}
          >
            <Icon name="nav-cv-hover" size={20} />
          </Link>
          <Icon name="ce-hover" size={20} />
        </Layout.Horizontal>
      )}
    </Layout.Vertical>
  )
}

export default DefaultRenderer
