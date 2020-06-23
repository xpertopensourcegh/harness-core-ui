import React from 'react'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import SnippetSection from 'modules/common/components/SnippetSection/SnippetSection'
import { Layout } from '@wings-software/uikit'

import type YamlBuilderProps from 'modules/common/interfaces/YAMLBuilderProps'

import css from './YamlBuilderPage.module.scss'

const YAMLBuilderPage = (props: YamlBuilderProps) => {
  return (
    <div className={css.builderSection}>
      <Layout.Horizontal className={css.layout}>
        <YAMLBuilder fileName={props.fileName} entityType={props.entityType} />
        <SnippetSection />
      </Layout.Horizontal>
    </div>
  )
}

export default YAMLBuilderPage
