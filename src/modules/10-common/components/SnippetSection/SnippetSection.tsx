import React, { useState, useEffect } from 'react'
import { Icon, IconName } from '@wings-software/uicore'
import cx from 'classnames'

import type { YamlSnippetMetaData, GetYamlSchemaQueryParams } from 'services/cd-ng'
import { getIconNameForTag } from '@common/utils/SnippetUtils'
import SnippetDetails from './SnippetDetails'

import css from './SnippetSection.module.scss'

export interface SnippetSectionProps {
  entityType: GetYamlSchemaQueryParams['entityType']
  showIconMenu?: boolean
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
  snippets?: YamlSnippetMetaData[]
  onSnippetCopy?: (identifier: string) => Promise<void>
  snippetYaml?: string
}

const SnippetSection: React.FC<SnippetSectionProps> = props => {
  const { showIconMenu, entityType, height, snippets, onSnippetCopy, snippetYaml } = props
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>('')
  const [snippetList, setSnippetList] = useState<YamlSnippetMetaData[]>()

  useEffect(() => {
    setSnippetList(snippets)
  }, [snippets])

  const onIconClick = (event: React.MouseEvent<Element, MouseEvent>, icon?: string): void => {
    event.preventDefault()
    if (selectedIcon === icon) {
      setSelectedIcon('')
      setSnippetList(snippets)
    } else {
      setSelectedIcon(icon)
      const snippetsClone = snippets
      setSnippetList(snippetsClone?.filter(snippet => getIconNameForTag(snippet.iconTag || '') === icon))
    }
  }

  const getIconCategories = (_snippets?: YamlSnippetMetaData[]): IconName[] | null => {
    if (!_snippets) {
      return null
    }
    return [...new Set(_snippets.map(snippet => getIconNameForTag(snippet?.iconTag || '')))]
  }

  const getIconList = (): React.ReactElement | null => {
    return (
      <React.Fragment>
        {getIconCategories(snippets)?.map(icon => (
          <div
            className={cx(css.snippetIcon, { [css.active]: icon === selectedIcon })}
            key={icon}
            onClick={event => onIconClick(event, icon)}
            title={icon}
          >
            <Icon name={icon as IconName} size={25} />
          </div>
        ))}
      </React.Fragment>
    )
  }

  return (
    <div className={css.main}>
      {showIconMenu ? <div className={css.snippetIcons}>{getIconList()}</div> : null}
      {snippetList ? (
        <div className={css.snippets}>
          <SnippetDetails
            entityType={entityType}
            selectedIcon={selectedIcon}
            snippets={snippetList}
            height={height}
            onSnippetCopy={onSnippetCopy}
            snippetYaml={snippetYaml}
          />
        </div>
      ) : (
        <div className={cx(css.noSnippets, css.fillSpace)}>No snippets found.</div>
      )}
    </div>
  )
}

export default SnippetSection
