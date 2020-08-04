import React from 'react'

import { Layout } from '@wings-software/uikit'
import YAMLBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import SnippetSection from 'modules/common/components/SnippetSection/SnippetSection'

import type YamlBuilderProps from 'modules/common/interfaces/YAMLBuilderProps'

import css from './YamlBuilderPage.module.scss'

const YAMLBuilderPage: React.FC<YamlBuilderProps> = props => {
  const {
    fileName,
    entityType,
    height,
    width,
    existingYaml,
    bind,
    isReadOnlyMode,
    showSnippetsSection = true,
    invocationMap
  } = props
  return (
    <div className={css.builderSection}>
      <Layout.Horizontal className={css.layout}>
        <YAMLBuilder
          fileName={fileName}
          entityType={entityType}
          height={height}
          width={width}
          existingYaml={existingYaml}
          bind={bind}
          isReadOnlyMode={isReadOnlyMode}
          showSnippetsSection={showSnippetsSection}
          invocationMap={invocationMap}
        />
        {showSnippetsSection ? <SnippetSection entityType={props.entityType} /> : null}
      </Layout.Horizontal>
    </div>
  )
}

export default YAMLBuilderPage
