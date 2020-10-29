import React, { useState } from 'react'

import { Icon, IconName } from '@wings-software/uikit'

import SnippetDetails from './SnippetDetails'
import type { SnippetInterface, SnippetSectionProps } from '../../interfaces/SnippetInterface'
import css from './SnippetSection.module.scss'

const SnippetSection: React.FC<SnippetSectionProps> = props => {
  const { showIconMenu, snippets, entityType, onSnippetSearch, height } = props

  const [selectedIcon, setSelectedIcon] = useState<string | undefined>('')

  const onIconClick = (event: React.MouseEvent<Element, MouseEvent>, icon?: string): void => {
    event.preventDefault()
    setSelectedIcon(icon)
    alert('TBD')
  }

  const getIconCategories = (snippetList?: SnippetInterface[]): IconName[] | undefined => {
    if (!snippetList) {
      return
    }
    return [...new Set(snippetList.map(snippet => snippet?.iconName || 'main-code-yaml'))]
  }

  const getIconList = (_snippets?: SnippetInterface[]): React.ReactElement | undefined => {
    if (!_snippets) {
      return
    }
    return (
      <React.Fragment>
        {getIconCategories(_snippets)?.map(icon => (
          <div className={css.snippetIcon} key={icon} onClick={event => onIconClick(event, icon)} title={icon}>
            <Icon name={icon as IconName} size={25} />
          </div>
        ))}
      </React.Fragment>
    )
  }

  return (
    <div className={css.main}>
      {showIconMenu ? <div className={css.snippetIcons}>{getIconList(snippets)}</div> : null}
      <div className={css.snippets}>
        <SnippetDetails
          entityType={entityType}
          selectedIcon={selectedIcon}
          snippets={snippets}
          onSnippetSearch={onSnippetSearch}
          height={height}
        />
      </div>
    </div>
  )
}

export default SnippetSection
