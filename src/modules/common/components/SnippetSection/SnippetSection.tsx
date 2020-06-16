import React from 'react'

import i18n from './SnippetSection.i18n'

import css from './SnippetSection.module.scss'

const SnippetSection: React.FC = () => (
  <div className={css.main}>
    <span>{i18n.title}</span>
  </div>
)

export default SnippetSection
