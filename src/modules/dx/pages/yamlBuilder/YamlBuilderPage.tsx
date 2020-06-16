import React from 'react'

import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import SnippetSection from 'modules/common/components/SnippetSection/SnippetSection'
import { Layout } from '@wings-software/uikit'

import css from './YamlBuilderPage.module.scss'

const YAMLBuilderPage: React.FC = () => (
  <div>
    <div className={css.builderSection}>
      <Layout.Horizontal className={css.layout}>
        <YAMLBuilder fileName={'placeholder-fileName.yaml'} />
        <SnippetSection />
      </Layout.Horizontal>
    </div>
  </div>
)

export default YAMLBuilderPage
