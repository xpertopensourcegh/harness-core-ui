import React, { useState, useEffect } from 'react'
import cx from 'classnames'

import { Icon } from '@wings-software/uikit'
import type { YamlSnippetMetaData } from 'services/cd-ng'
import i18n from './SnippetDetails.i18n'
import type { YamlEntity } from '../../constants/YamlConstants'
import Snippet from './Snippet'

import css from './SnippetDetails.module.scss'

interface SnippetDetailsProps {
  entityType: YamlEntity
  selectedIcon?: string
  snippets?: YamlSnippetMetaData[]
  height?: React.CSSProperties['height']
  onSnippetCopy?: (identifier: string) => void
  snippetYaml?: string
}

const SnippetDetails: React.FC<SnippetDetailsProps> = props => {
  const { height, entityType, onSnippetCopy, snippetYaml } = props
  const [snippets, setSnippets] = useState<YamlSnippetMetaData[]>()
  const [searchedSnippet, setSearchedSnippet] = useState('')

  const onSnippetSearch = (query: string): void => {
    const snippetsClone = props.snippets as YamlSnippetMetaData[]
    setSnippets(snippetsClone.filter(snippet => snippet.name?.toLowerCase().includes(query.toLowerCase())))
  }

  const handleSnippetSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    const query = event.target.value
    if (query) {
      setSearchedSnippet(query)
      onSnippetSearch(query)
    } else onSearchClear()
  }

  const onSearchClear = (event?: React.MouseEvent<HTMLElement>): void => {
    event?.preventDefault()
    setSnippets(props.snippets)
    setSearchedSnippet('')
  }

  useEffect(() => {
    setSnippets(props.snippets)
  }, [props.snippets])

  return (
    <div className={css.main}>
      <div className={css.title}>
        {entityType}&nbsp;
        {i18n.title}
      </div>
      <div className={css.searchBar}>
        <span className={css.searchIcon}>
          <Icon name={'main-search'} size={20} />
        </span>
        <input
          placeholder="Search"
          name="snippet-search"
          className={css.search}
          onChange={handleSnippetSearch}
          value={searchedSnippet}
        />
        {searchedSnippet ? (
          <span className={css.closeIcon}>
            <Icon name={'main-close'} size={10} onClick={onSearchClear} />
          </span>
        ) : null}
      </div>
      {snippets && snippets?.length > 0 ? (
        <div className={css.snippets} style={{ height, overflow: 'auto' }}>
          {snippets?.map(snippet => (
            <Snippet key={snippet.name} {...snippet} onSnippetCopy={onSnippetCopy} snippetYaml={snippetYaml} />
          ))}
        </div>
      ) : (
        <div className={cx(css.noSnippets, css.fillSpace)}>No snippets found.</div>
      )}
    </div>
  )
}

export default SnippetDetails
