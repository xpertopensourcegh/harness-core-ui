import React from 'react'
import { Color, Layout, Icon, Text } from '@wings-software/uikit'
import type { Project } from 'services/cd-ng'
import i18n from './ModuleRenderer.i18n'
import css from './ModuleRenderer.module.scss'

interface DefaultProps {
  data: Project
  isPreview?: boolean
}

const DefaultRenderer: React.FC<DefaultProps> = () => {
  return (
    <Layout.Vertical
      padding={{ top: 'medium', left: 'xlarge', right: 'xlarge', bottom: 'large' }}
      border={{ top: true, bottom: true, color: Color.GREY_250 }}
      className={css.started}
    >
      <Text font={{ size: 'small', weight: 'semi-bold' }} padding={{ bottom: 'xsmall' }}>
        {i18n.start}
      </Text>
      <Layout.Horizontal spacing="small">
        <Icon name="cd-main" size={20} />
        <Icon name="cv-main" size={20} />
        <Icon name="ce-main" size={20} />
        <Icon name="cf-main" size={20} />
        <Icon name="ci-main" size={20} />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default DefaultRenderer
